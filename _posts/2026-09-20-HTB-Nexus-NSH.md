---
title: "[HTB] Nexus (Easy_Linux) 권한상승 부분의 코드 구현은 라이트업을 확인함."
date: 2026-09-20 20:26:00 +09:00
categories: [Security & Hacking, HTB]
tags: [Hack The Box, hacking, RedLabs, Linux]
pin: true
---

![Nexus](https://github.com/user-attachments/assets/156e95ec-1dec-4933-b1da-ac6b91581142#.png)

[Nexus has been Pwned, OilLampCat has successfully pwned Nexus Machine from Hack The Box](https://labs.hackthebox.com/achievement/machine/988787/948)

## 1. 시작에 앞서

![Nexus](https://github.com/user-attachments/assets/5d4986a7-ba15-487a-a65b-9abd934a9138#.png)

음.. 이번에도 저번에 말했던 거랑 달리 easy를 풀게 되었는데...

![Management](https://github.com/user-attachments/assets/e749d2ea-8725-456f-b58d-0d5a8bc53fd3#.png)

management라는 문제를 도전 했었다만... 이게 실패를 해서 말이지.

그래서 찾다가 이번 redlabs 과제가 nexus라서 이미 라이트업이 나와있는 retired 머신이지만 직접 도전해보고 싶었다.

그리고 이제 진짜로 OSCP 강의를 등록 하고 시험을 보려고 준비중이라서 easy라면 뭐 3시간이 머야, 1시간 컷 내야지 하는 마음가짐으로 집중해서 덤볐다.

그래... 초기 침투는 그게 맞더라.

근데 권한 상승은 진짜 아니였다. 이거 리뷰들 보니까 다들 권한 상승에선 이게 왜 easy? 라고 하더라 ㅋㅋㅋㅋ

아 그리고 이제부턴 치트 시트도 만들면서 진행하고자 한다.

## 2. 초기 침투 : 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap](https://github.com/user-attachments/assets/c420a7e6-b671-4737-90c7-3996b51328f2#.png)

easy 난이도에 맞게? **22/ssh**와 **80/http** 두 포트를 발견할 수 있었다.

![web](https://github.com/user-attachments/assets/732bae04-bcde-4a4a-bd2b-8f6d628c9c58#.png)

사이트에 방문해보니 위처럼 환경 에너지 관련 회사? 같은데 여기서 찾아볼 수 있는 버튼들을 다 눌러보았을 때 메인 페이지에서 옮겨다니는걸 제외하면 딱히 뭔가 찾을만한건 없었다.

![web1](https://github.com/user-attachments/assets/dcdf7eb6-6557-44af-8787-bdeb25601015#.png)

맨 아래 내려가서 등록 하는 부분이 있다는거 빼면?

저건 정말로 누르면 이메일 보내기로 연결 되니까 문제풀 때에는 아닐 터였고,

![wappalyzer](https://github.com/user-attachments/assets/9e5bc7af-e466-477d-bc42-2a8197f33af1#.png)

wappalyzer로 확인해보았을 때에도 딱히 취약해 보이는 버전도 없었다.

![dirsearch](https://github.com/user-attachments/assets/7afa9669-5604-45dd-abda-def146f174a3#.png)

그럼 다음으로 해볼건 자명하지 않던가, dirsearch로 다른 숨겨진 경로가 있는지 살펴보고

![ffuf](https://github.com/user-attachments/assets/107fa7ee-3774-406f-8261-4a29b64b64de#.png)

ffuf를 이용해 서브 도메인을 찾아보는 것 까지.

그 결과 `billing`과 `git`이라는 서브 도메인을 찾아낼 수 있었다.

![gitea](https://github.com/user-attachments/assets/c51ab79b-e92f-4d68-8e50-98b0086034b7#.png)

`git.nexus.htb`의 경우 역시나 전에도 몇번 본적이 있던 **gitea**였다.

![billing](https://github.com/user-attachments/assets/ea8e134b-0bed-4180-9f77-4efbbf687326#.png)

`billing.nexus.htb`의 경우 **Krayin**이라고 하는 처음보는 서비스의 로그인 화면이 나타났다. 게다가 아래엔 마치 원격 조종 화면인 것 마냥 떴는데 저건 추후에.

> 지금 찾은 것들

- port : 22, 80
- email : **careers@nexus.htb**, **j.matthew@nexus.htb**
- version : **Nginx 1.24.0**, **Laravel Version 12.54.1**
- subdomain : **billing**, **git**

## 3. 초기 침투 (Initial Foothold / Exploitation)

![gitea](https://github.com/user-attachments/assets/d88ce03d-4e4f-4690-b39f-45334864bdac#.png)

gitea의 explore에 들어가보니 **admin/krayin-docker-setup**이라고 하는 레포를 발견할 수 있었다. 

딱 이름만 들었을 때에도 이게 아까 찾았던 `billing` 서브 도메인 부분에 관한 내용이라는 것을 알 수 있었다.

![gitea1](https://github.com/user-attachments/assets/a7bbd693-aea0-42f6-8487-01c02645a586#.png)

내부에는 docker 생성 파일과 .env 환경변수, documents 가 존재했다.

그리고 꼭 이런 문제일 때 타겟이 되는 commit을 확인해봐야겠지?

![env](https://github.com/user-attachments/assets/1e018e36-2ebe-4fcb-9fcf-ab0650c2a8fe#.png)

일단 그 전에 호옥시나 easy 문제니까 env를 확인해봤더니 아쉽게도 많은걸 알 수는 없었다. 대부분의 password나 그런 것들이 적혀있지는 않았기에.

하지만 과연 커밋에선?

![Commit](https://github.com/user-attachments/assets/dd0e6e84-2328-4e31-b7eb-d3df7d5b444e#.png)

찾았다! 

APP_URL을 바꿨던 기록과 함께 DB_PASSWORD를 지우기 전 비밀번호를 확인할 수 있었던 것이다!!

![혹시](https://github.com/user-attachments/assets/58c6147d-3ef7-46e3-bae0-c95d2972d68b#.png)

혹시 하는 마음에 찾아낸 PASSWORD로 Krayin에 로그인을 시도해봤는데 일단 오히려 gitea에서 찾았던 email으론 실패했고,

![혹시1](https://github.com/user-attachments/assets/424953c9-7434-4e34-83a7-cb0a65aba208#.png)

정찰 할 때 찾았던 그 email 계정인 j.matthew를 이용하여 로그인을 성공시킬 수 있었다.

![krayin](https://github.com/user-attachments/assets/a98337c6-9265-4e80-bbd7-3dc456992956#.png)

들어와보니 뭔가 대시보드가 많은데... 

![너냐](https://github.com/user-attachments/assets/2abcd507-e144-464b-b724-3b1c2c9a49ca#.png)

이 때 찾아낸 버전을 넣어 검색해봤는데 이건 Krayin의 버전이 아니라 이 특이한 창의 버전이였다.

![krayin](https://github.com/user-attachments/assets/4b530546-e35e-4a87-b9f1-0d288bf26524#.png)

대신 내 계정을 보려고 이모티콘을 눌러보니 Krayin 서비스의 버전은 **2.2.0**이라는 것을 확인할 수 있었다.

![krayin220](https://github.com/user-attachments/assets/4bdf6ab7-8cfd-43af-9314-8b7607bb8353#.png)

그 버전을 그대로 구글에 검색하니 

![CVE](https://github.com/user-attachments/assets/111496eb-2c4b-4827-95c9-bd70ecd5d9f7#.png)

이런 식으로 **CVE-2026-38526**이라는 RCE 취약점을 찾을 수 있었다.

![CVE1](https://github.com/user-attachments/assets/2d8cd21f-ac17-42c2-8d00-6ce7794c84f4#.png)

참고로 난 이 POC를 이용했다.

![id](https://github.com/user-attachments/assets/61f5a5f3-b024-4ba1-99ea-0342a0fb4fd2#.png)

명령어가 실행될 수 있는게 맞는지 확인을 위해 **id** 명령어를 넣었고 그 결과가 제대로 반환되는 것을 확인했다.

![rev](https://github.com/user-attachments/assets/94d9fb99-26a6-4d14-b03d-8b300db85dd6#.png)

간단한 리버스쉘 코드를 넣어 poc를 실행시켜보니

![rev1](https://github.com/user-attachments/assets/a5a99356-b88b-4227-a6d0-8659da521aef#.png)

침투하는데 성공은 했다. 다만 이게... 계정 이름에서처럼 **www-data**라고 나와있다.

![envls](https://github.com/user-attachments/assets/ca2a3b42-04f6-48ce-beba-b56355046f37#.png)

아무래도 우리가 얻어야할 계정은 **git**이나 **jones**로 보인다.

![ls1](https://github.com/user-attachments/assets/349d1eb2-0026-41dc-93bf-4be72416893f#.png)

처음 딱 들어갔을 때 위치인 `/krayin`에서 뭐가 있을까 확인해보니 엄... docker를 위한? 엄청 긴 자료들이 쭈욱 나오는데

![env](https://github.com/user-attachments/assets/3849a2e7-c661-4aac-bb60-959ed1e86f99#.png)

이것 저것 열어보다 **.env**를 열게 되었을 때 분명 gitea에서 봤던 거랑은 또 다른 **DB_PASSWORD**를 찾아낼 수 있었다.

![jones](https://github.com/user-attachments/assets/ef6065c2-7ac9-47f5-af9c-e9dd9b7441f2#.png)

계정은 다시 확인해보니 역시나 git, jones, mysql 등이 있었다.

![혹시](https://github.com/user-attachments/assets/639f646b-d5cc-4f51-b756-2d134fa2b592#.png)

혹시 싶어서 mysql을 좀 더 찾아봤는데 여기선... 딱히 이럴만한 부분을 찾지는 못했다.

필요하다면 권한 상승때 쓸지도 모른다고 생각해 이런게 있구나 정도만.

![아니 이게왜](https://github.com/user-attachments/assets/4f3d176c-45d1-438f-b86d-263befca8e74#.png)

근데 되려 허무하게도... ssh를 통해 jones로 로그인 할 때 이 비밀번호를 넣어보니 간단하게 접속이 되었다는거.

![user](https://github.com/user-attachments/assets/9195249b-2893-42c1-bb98-a08d0149e12e#.png)

그렇게 user를 얻어낼 수 있었다.

> 솔직히 여기까지만 해도 이게 easy가 맞나...? 하는 생각을 했다만 그래도 여기까진 꽤나 수월하게 진행할 수 있기도 했고, 오히려 지식의 저주마냥 mysql이 있네? 여길 털어야지! 하는 생각 때문에 유저 플래그를 찾는데 더 오래 걸린 것일지도?
>
> 는 무슨 그런게 아니라 어쩌면 이번엔 이게 일종의 취약점으로 보인다. 그니까 이제 OSCP 보고서를 작성할 때에 넣을 mysql의 비밀번호가 평문인 것도 문제이지만 그럼에도 ssh 키와 비밀번호가 같으면 안 되었던 그런 느낌 말이다.

## 4. 권한 상승 (Privilege Escalation) 

자 이제 권한 상승이 진행될 것인데, 이 부분은 내가 처음에 말했듯 리뷰들에서도 이게 왜 easy냐고 하는 말도 많고 푸는 나도 easy에서 이정도가 나오면 안되는데? 하면서 또 잘못 생각하고 있나 하며 자꾸 다른 경로를 찾으려 하기도 했던 부분이었다.

![sudol](https://github.com/user-attachments/assets/0a736252-d602-435f-8504-d46ec47100a4#.png)

유구한 전통의 **sudo -l**을 했을 때 사실 난 이게 안되기에 어라? 그럼 얼마나 쉽게 숨긴거야? 했었다.

반대일줄은...

![id](https://github.com/user-attachments/assets/26a2dfef-d34e-4e32-ac59-8e4baf87f565#.png)

id를 쳐보았을 때에나 뭐 버전 같은걸 추가로 확인해봐도 딱히 특이한 권한 계정은 보이지 않았다.

![find](https://github.com/user-attachments/assets/4ea397b7-5311-4e75-b234-55b575b7fca1#.png)

**find / -perm -4000 -type f 2>/dev/null**

을 넣어봤을 때나 -2000을 넣어서 권한이 있는 파일을 살펴봐도...

왜 없지.

![cron](https://github.com/user-attachments/assets/1f5e5c09-f19a-4a30-818e-24e6e43c489b#.png)

혹시 싶어 cron도 돌려봤는데 특이점은 보이지 않았다.

여기서 난 막혔다. 그래서 linpeas를 돌려보기 전 혹시나 다른 명령어 처서 정보 수집 할 부분이 있나 하여 클 선생에게 물어보니(gemini 학생이 끝나서 클로드로 넘어왔다.)

![list-timmers](https://github.com/user-attachments/assets/a8c336dc-20d4-473d-afbe-82f97fa8cf6a#.png)

crontab 말고 **list-timers** 라고 부르는 것이 있다고 하기에 한번 쳐보았다.

> 잠시 여기서 `systemctl list-timers`가 뭔지 짚고 넘어가자면.

crontab은 작업 스케줄러고, systemd timer는 최신 linux 등에서 crontab을 대체하고 있는 스케줄러라고 한다.

예를 들면 우분투라던가?

그러니 아무래도 이번에 치트시트 만들 때 이것도 하나 추가해둬야겠다.

> 그럼 다시 문제로 돌아와서

여기서 뭘 봐야하냐 <- 이건 나도 이해가 안가서 그냥 지나간 부분이었다.

나중에 한참을 삽질하다가 클 선생에게 내가 찾은 것들을 보여주었더니

- `fwupd-refresh` -> 펌웨어 업데이트 (Ubuntu 기본)
- `phpsessionclean` -> PHP 세션 정리 (Ubuntu 기본)
- `sysstat-collect` -> 시스템 통계 수집 (Ubuntu 기본)
- `apt-daily` -> apt 업데이트 (Ubuntu 기본)
- `logrotate` -> 로그 관리 (Ubuntu 기본)
- `man-db` -> man 페이지 DB (Ubuntu 기본)

이라며`gitea-template-sync`는 우분투의 기본 시스템에 깔린게 아니니까 이걸 확인해 보세요!!

라고 하더라.

아니 근데 난 사실 이 머신에 gitea가 있길래 그럼 정상적인거 아닌가 싶었는데

![아하](https://github.com/user-attachments/assets/7b3f9b64-26f2-4d75-85b0-105324d3efc9#.png)

그렇다고 한다.

아하!

![service](https://github.com/user-attachments/assets/305cf30e-fc6e-4f1a-812a-f822eccfd435#.png)

그래서 서비스를 확인해보니 확실히 무언가 python 코드가 실행되고 있는 것을 확인할 수 있었다.

![syncpy1](https://github.com/user-attachments/assets/72a49da2-2f6b-4823-a9b3-98b7e7290cf6#.png)

![syncpy2](https://github.com/user-attachments/assets/f5029c2a-3a05-43da-a6fd-3b917813499e#.png)

![syncpy3](https://github.com/user-attachments/assets/38ef3b3c-734f-49fc-b068-ac9a567dfc4c#.png)

~~참고로 이거 내가 스크린샷을 전체 딸 때 정작 중요한 부분을 잘라버렸더라?~~

보아하니 이름에서부터 알 수 있듯 템플릿 이라는 것을 sync 해준다는 것 같은데.

> Gitea 에서 template란 무엇인고!

Gitea에서 repo를 만들 땐 Make repository a template 라고 하는 체크박스가 존재한다. 이걸 체크하면 다른 사람들이 그 repo를 기반으로 새 repo를 만들 때 쓸 일종의 틀(template)이 된다.

이건 GitHub에도 있는 template repository랑 같은 개념이라더라.

![syncpy4](https://github.com/user-attachments/assets/75906c4a-e95d-4518-81db-0afa51a5ff4b#.png)

코드를 보다 위에 표시해둔 곳을 보면 이건 template으로 표시된 repo만 가져온다고 한다.

즉 내가 **누군가의 계정으로 Gitea에 template repo를 만들어두면 이 sync 서비스가 가져간다**는 의미일 터고.

![취약점](https://github.com/user-attachments/assets/af89c9c4-0203-42b4-ba9d-2fcd0b448745#.png)

99번째 줄을 보아하니 target의 filepath 부분이 곧 repo 안의 파일 경로인데 이게 전혀 검증 과정을 거치지 않았다.

그러니까 `../../../`이게 가능해진다는 뜻.

`../../../../../root/.ssh/authorized_keys` 그래서 만~약에 내가 이런 식으로 root 디렉토리에 내 ssh키를 덮어 씌워 버리면?

```
내가 template repo 생성
-> sync 서비스가 가져감
-> filepath에 ..이 있어도 그냥 씀
-> /root/.ssh/authorized_keys에 내 SSH키가 쓰임
-> root 접속 가능
```

이라고 일단 생각은 할 수 있을 것이다.

![ssh](https://github.com/user-attachments/assets/1ce36ddf-d3c6-4765-9337-be21920136d2#.png)

생각했던걸 실현시키기 위해 일단 ssh 키를 만들어주고.

![이번에도](https://github.com/user-attachments/assets/e8ec8633-2661-423d-82d4-d43abfff6ad1#.png)

이번에도? jones의 계정으로 아까 찾은 비밀번호를 통해 gitea에도 로그인이 가능했기에 로그인을 해주고,

![이름은 아무거나](https://github.com/user-attachments/assets/8dc4bd6e-5fe1-472a-8aea-d9756ad9e740#.png)

이름은 아무거나로 지은 후

![마지막에](https://github.com/user-attachments/assets/f71df417-efd5-4c8e-8b5b-c99111b7606c#.png)

마지막에 생성하기 위 버튼 부분에서 **make repository a template**을 눌러 활성화를 시켜주자.

![여기서](https://github.com/user-attachments/assets/f1e264b2-02e5-4ddd-8561-02df1210af1c#.png)

사실 난 여기서 이렇게 레포가 만들어지자 

![가져온](https://github.com/user-attachments/assets/7f456f46-4e31-438d-a043-66dcd7681390#.png)

그걸 내 kali로 가져온 후에 (같은 vpn상에 있으니까 clone 해오는게 가능해버리는)

![repo](https://github.com/user-attachments/assets/c4545189-4ac4-4476-b4fc-2d6af94ea7c0#.png)

이렇게 들어가서 

```
mkdir -p "../../../../../root/.ssh"
cp ~/.ssh/id_rsa.pub "../../../../../root/.ssh/nexus_key"
git add .
git push
```

뭐 이런 식으로 커밋을 날리려고 했다.

```
error: Invalid path '../../../../../root/.ssh/nexus_key'
```

근데 막히는거 아니겠는가?

[git - 10.2 Git의 내부 - Git 개체](https://git-scm.com/book/ko/v2/Git%ec%9d%98-%eb%82%b4%eb%b6%80-Git-%ea%b0%9c%ec%b2%b4#.png)

그래서 이건 또 뭐냐 클 선생께 여쭤보니 

![그래](https://github.com/user-attachments/assets/da3861fa-47d3-43b3-a77b-1e81fed4d98e#.png)

그래... git이 그런 간단한 위험성을 냅뒀을리가 없지.

![대신](https://github.com/user-attachments/assets/4c525149-2a0c-45a0-b13a-154ea6b01e9d#.png)

대신 뭐 이렇게 해서 build.py를 만들어주게 되었는데

그보단 공식 writeup이 있으니까 이번엔 그걸 보게 되었다.

내가 가능한 라이트업을 보지는 않겠는데 이젠 공부를 하는 입장에서 시험보는게 아니기도 하고 모르는건 차라리 코드를 보고 공부하겠다는 마음가짐이었다.

![클선생과](https://github.com/user-attachments/assets/f1c2aade-35c5-47f0-818a-d16e275e7651#.png)

![공식의 짬뽕](https://github.com/user-attachments/assets/ba1fa6eb-eda8-43bf-87b9-287d47d97a58#.png)

클선생이 공식 라이트업을 보곤 이렇게 자세히 주석을 달아줬으니 한번 읽어보며 공부하는걸 추천한다.

그리고 확실히 이걸 읽으며 생각했다.

이걸 6분만에 푼 사람도 괴물이고. 이걸 easy라고 낸 사람도 괴물인가 보구나.

이게 도대체 어딜봐서 누구 눈으로 봤을 때 easy 인거냐?

![build](https://github.com/user-attachments/assets/1f54dbb8-261c-486f-a9ec-201b5d4f37b0#.png)

뭐... 그렇게 build를 만들어 실행 하고 git push를 진행해 ssh 키가 올라갈 때 까지(timer가 1분 단위로 도니까.) 기다린 후에 ssh를 진행 하면?

![아직](https://github.com/user-attachments/assets/8cd7df75-fc42-418a-bc08-943ee84a3b5c#.png)

아직 때가 아닐 땐 이렇게 password를 요구하고.

![jone](https://github.com/user-attachments/assets/f7304347-057e-43ea-84a3-fa557d1d5747#.png)

jones 계정으로 log를 읽어보았을 때 이렇게 들어갔다고 뜨면

![짜잔](https://github.com/user-attachments/assets/d7cd3c47-74e6-4eff-96f4-f11cf1bdfe18#.png)

짜잔 이렇게 루트 권한을 얻을 수는 있다.

`수는`

허... 참... 너무 찝찝한 문제였다.

## 마치며

![Nexus](https://github.com/user-attachments/assets/2eacdcf6-3535-4505-9b6d-eecb61d64cce#.png)

일단 이렇게 초기 침투를 넘어 루트 권한을 어떻게 얻을지 찾는 과정 까지는 재밌었다.

**사실 그 때 까지만 해도 이정도면 easy는 애매하긴 한데 그래도 인정** 이라고 생각하며 재밌게 풀었는데 이게 원... 갑자기 build.py 코드를 짜는 부분이 이건 초보자한텐 절대로 인공지능을 쓰라고 만든 문제 같은데.

애초에 초보자가 이걸 보고 아 git을 공부해야겠구나. 아 git의 내부 포맷을 이해하고 그거에 대한 코드를 작성해야겠구나!

라고 하겠냐고.

심지어 이거 공식 라이트업이 없으면 저걸 직접 짜야 한다고?

[HackTheBox Walkthrough — Nexus](https://medium.com/@indigoshadowwashere/hackthebox-walkthrough-nexus-f48a53ea87d5)

야이...

[Nexus (HTB): de un .env filtrado a root](https://alecsilva.com/posts/nexus-writeup)

선넘네 증말

> 여담

어째서인지 전과 달리 firefox extension인 wappalyzer를 켰을 때 스크린샷을 찍으려 하면 자꾸만 캡쳐가 끊기면서 꺼지기에 아마도 이스케이프 할 때 뭔가 트리거가 되는 것 같긴 한데 좀 신박한 해결방법을 찾았다.

wappalyzer를 켰을때 마우스 우클릭으로 xf11이던 wayloid이던 뭔가 다른 상위 창을 켜고 스크린샷을 켜면(win+shift+s) 우클릭 했던 창만 꺼지면서 wappalyzer를 캡쳐 할 수 있었다...

진짜로 다음번엔 medium 하나쯤은 풀어야 하고 windows ad 문제로 풀고 싶은데 말이지...

일단 치트시트 완성을 해보고 함 다음번엔 성공을 해보자. 아무래도 free 티어로 htb를 하고 있어서 제한되는 것도 많긴 하다만 할 수 있는 만큼 해보고 OSCP에 들어가야지.

그럼 Happy Hacking이다!
