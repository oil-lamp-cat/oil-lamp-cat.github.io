---
title: "[HTB] Cohort (Easy_Linux)"
date: 2026-08-04 13:45:00 +09:00
categories: [Security & Hacking, HTB]
tags: [Hack The Box, hacking, RedLabs, Linux]
password: "20260804"
pin: true
---

![Cohort](https://github.com/user-attachments/assets/0b3b215e-5864-4d48-bf41-21be388359e5#.png)

[Cohort has been Pwned OilLampCat has successfully pwned Cohort Machine from Hack The Box](https://labs.hackthebox.com/achievement/machine/988787/933)

## 1. 시작에 앞서

![Cohort](https://github.com/user-attachments/assets/b2832f52-8f13-4d08-9603-19801c24639f#.png)

별이 4점 이하인 것에는 이유가 있더라.

왜 이게 어떻게 easy 인가 싶은 난이도랄까. 아니 어쩌면 그저 내가 길을 잘못 찾아들어가서 이런 일이 생긴 것일지도 모르겠다.

일단 내가 지금 6일간 아픈 중이라 몽롱한 상태로 쓴다는 것을 유의하고 라이트업을 읽어주길 바란다.

## 2. 초기 침투 : 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap](https://github.com/user-attachments/assets/86bbbfa2-c332-46e7-b7e5-ea988fb2876f#.png)

초기 계정 없고, 일단 보통 그럼 http 웹 서비스가 열려있을테니 보통은 그걸 먼저 확인하면 되겠다.

하지만 난 지금은 htb를 풀고 있잖아? 

그래서 나온 **nmap**의 결과를 보자면

**22/ssh**, **80/http**, **443/https** 가 있다. 이놈의 https...

일단 도메인이 `cohort.htb`라고 하니 `/etc/hosts`에 등록해주자.

![site](https://github.com/user-attachments/assets/a7e1e9a0-98af-42b2-9c45-c4d299c2a985#.png)

이제 web을 들어가 둘러보면 뭔가 분석해주는 사이트가 나오고,

![site1](https://github.com/user-attachments/assets/35a582a0-b5de-41b5-8b3b-497ae04030f0#.png)

뭐하는 곳인지 등이 나오는데 로그인이나 다른 페이지는 찾지 못했다.

저 `Client insights` 부분만 존재했다.

적어도 정찰 할 때 dirsearch나 fuzz 등으로 서브 도메인, 디렉토리 브루트 포싱 등을 통한 결과는 그랬었다.

![su](https://github.com/user-attachments/assets/be549632-a02a-4320-b223-4005b1c8d072#.png)

유일하게 들어갈 수 있는 곳에 접속해보면 **source URL**이라고 해서 csv 등의 파일을 올리면 그걸 가져와 가능 불가능 하면서 알려주는 페이지가 나온다.

옆을 읽어보면 보안 이슈로 루프백 주소는 불가능해욥 이라고 한다.

물론 그걸 우린 믿지 않겠지만.

![su1](https://github.com/user-attachments/assets/77767b4a-7dfb-44f6-b9c0-c69e90af42bd#.png)

보아하니 csv, json 등등을 넣을 수 있는데 일단 암거나 넣어보기 위해 내 공격자 컴퓨터를 열어봤다.

![su2](https://github.com/user-attachments/assets/5994b4b3-6aa5-4e7b-b740-2f62c52c0b41#.png)

굳이 딱 csv나 json이 아니여도 되네?

![su3](https://github.com/user-attachments/assets/c531fe44-62df-4efb-a7fc-71e7f30d9b70#.png)

그래서 바로 박치기를 시전했다. 리버스쉘 보내면 그거 읽어서 쉘이 떨어지겠지? 하고.

솔직히 easy 잖냐. 당연히 해볼 법한 생각 아닌가?

근데 이건 틀렸다. 저건 그냥 그 데이터를 읽어올 뿐 실행은 하지 않았다.

## 3. 초기 침투 (Initial Foothold / Exploitation)

근데 그렇다면 내부 루프백이 안 된다고 했었는데 되게 하면 어떻게 되는거지?

하는 생각이 들었고 얼마전 풀었던 문제 중에 10진수의 IP 주소를 8진수로 변경해서 통과해야했던 문제가 떠올랐다.

![8진수](https://github.com/user-attachments/assets/d62728ff-90ce-43a8-be00-de9e74d5737c#.png)

그리고 그건 정확했다. 

분명히 루프백이 안 된다고 했지만 10진수인 **127.0.0.1**이 아니라 8진수인 **0177.0000.0000.0001**이라면?

쉽게 통과가 되어 지금 보고 있는 이 페이지를 띄워줬다.

![f12](https://github.com/user-attachments/assets/dd69c933-a92a-4df8-9837-5cf9f88094c3#.png)

burp로 열어도 되겠다만 이게 무슨 일인지 wsl에선 burp gui가 자꾸 깨지는 바람에 그냥 f12의 네트워크 탭에서 정보를 찾아왔다.

아니 근데 위에서 찾았던 https가 도대체 어디서 쓰이는 건가 했더니 여기서 쓰이더라.

api 요청을 보낼 때 https를 통해 보낸다니.

![ffuf](https://github.com/user-attachments/assets/fe8bd4f0-5506-4bcc-a9c6-1e27a57ad859#.png)

그래서 그럼 내가 이 기능을 이용해 어떤 것들에 접속할 수 있을지, 이번엔 내부 포트를 통해 스캔을 쭉 진행했다.

외부에서도 봤던 포트들이 내부에도 몇개 돌고 있었고, 그 중엔 특이한 5000번과 8000번 포트도 찾아낼 수 있었다.

근데 난 이렇게 찾았다만...

![나중에](https://github.com/user-attachments/assets/fca6094e-4c87-417f-b773-066565542ad4#.png)

나중에 이것 저것 더 해보다보니 `status`위치에 들어가서 그냥 확인할 수도 있었다.

어째서...?

게다가 이 때 `host`가 `nb-문자열.cohort.htb` 라는 서브 도메인을 갖고 있다는걸 알 수 있다

이러니까 fuff를 돌려도 못찾지.

![도메인](https://github.com/user-attachments/assets/286db61f-fac8-41e0-9c88-67ec09a92a15#.png)

그래서 도메인을 추가해주고

![접속](https://github.com/user-attachments/assets/9f5dc265-1f2c-4483-852c-adb7bfe35720#.png)

접속해보면? 비밀번호를 통해 로그인 해라! 라고 한다.

how? 버전도 모르는데?

![그래서](https://github.com/user-attachments/assets/e1b03d16-dccc-405a-959d-d9ed7bf7979e#.png)

그래서 바로 다시 본래 사이트로 돌아와 `8888`번 포트의 api를 이용해 version을 찍어봤다.

`0.20.4` 

이제 사이트의 타이틀을 통해 **marimo**라는 것도 알게 되었고, 거기다 버전까지!

![cve](https://github.com/user-attachments/assets/e26ba3d2-8328-44f9-a315-01c741b11107#.png)

그렇게 나온 결과를 통해 검색해본 결과 `CVE-2026-39987`이라는 취약점을 발견할 수 있었다.

무려 Pre-Auth RCE (웹 소켓을 이용한)이다.

로그인 하지 않고도 코드 상에 ws혹은 wss를 불러내 연결할 수 있는 놀라운 CVE였다.

솔직히 여기까지 오는데 삽질을 너무 많이 해서 거의 3시간을 썼달까.

다행히 위 코드를 이용하면 바로 revshell을 걸 수 있었다. 만.

![와이](https://github.com/user-attachments/assets/5a821988-8b11-4f76-a0a9-d32c2a4a949c#.png)

뭔가의 보안 조취인건지 자꾸만 리버스쉘이 걸리고 즉시 끊겼다.

![하지만](https://github.com/user-attachments/assets/4b1d2644-1429-4b26-a297-e2f858d07ce4#.png)

하지만 이건 간단했다. 끊기기 전에 바로 bash 쉘을 새로 열어주면 될 뿐.

보아하니 저 `Hangup`이 문제인 것 같았는데 저게 리눅스에서 세션이 닫히면 터미널 닫혔으니까 너네도 종료해! 하고 `SIGHUP` 시그널을 보냈던 것이다. 근데 이제 내가 끝나기 전에 새로 쉘을 열어버린 것이고

나는 침투를 성공 해버린 것이야.

![user](https://github.com/user-attachments/assets/7d6e8002-d3ae-4f20-ac71-686cc6d2dcb4#.png)

그렇게 유저 플래그를 얻을 수 있었다.

## 4. 권한 상승 (Privilege Escalation) 

![sudo](https://github.com/user-attachments/assets/0ee4660e-896b-48cc-82ec-9f2ecd414b67#.png)

자 그럼 `marimo`라는 유저로 들어왔으니까 이제 뭘 할 수 있나 또 정찰을 해봐야겠지?

![psaux](https://github.com/user-attachments/assets/709f79d6-ef70-4ebf-835b-e26c32f5bc1d#.png)

이 때 `sudo -l`은 권한이 없었고, `ps -aux` 결과가 엄청 길었는데 그 중 눈에 딱 띄었던게 위 이미지의 부분이였다.

8888번 포트(아까 우리가 찾은거)에 token password도 있기에 한번 로그인 해보았다.

![what](https://github.com/user-attachments/assets/b0abb6ec-0211-484b-b2fa-30b3f0baf3c5#.png)

다만 그래서 뭐? 솔직히 뭘 할 수 있는지 이것저것 코드도 실행시켜보고 설정도 들어갔는데 찾지 못했다.

![linpeas](https://github.com/user-attachments/assets/00f55719-6085-4dbd-adcf-a8e965f827cb#.png)

그래서 linpeas를 준비해

![출격](https://github.com/user-attachments/assets/2319b8ea-194a-4fcd-b353-4912f9c7b6b8#.png)

보내버리고

![tmp](https://github.com/user-attachments/assets/0169d2d2-9007-4a45-81d3-79f280604a26#.png)

tmp 폴더에 하나 만들어서 실행시키면?

![긴거](https://github.com/user-attachments/assets/8a9ff434-1b9c-4028-927f-db975d10b4b4#.png)

정말로 긴 내용들이 있지만 그 중엔 아예 CVE-2026-41651 이라는 취약점이 존재한다고 알려줬다.

![검색1](https://github.com/user-attachments/assets/8e82b070-6cd0-4af1-8eec-d05429287291#.png)

검색해보니 바로 뭐라고 설명해주는데 좀 어려워서 자세하게 해달라고 하니

![검색2](https://github.com/user-attachments/assets/d0c7aa94-929a-4a47-a03c-ffb6abb19034#.png)

그렇다고 한다.

![poc](https://github.com/user-attachments/assets/f3245e25-3040-49bf-bc2d-cf01aa1cbc6f#.png)

POC는 [Vozec/CVE-2026-41651](https://github.com/Vozec/CVE-2026-41651)을 이용했다.

![넘기기](https://github.com/user-attachments/assets/db42a923-444b-4506-8a48-fd9b8b68f7d3#.png)

공격자에서 받아 넘겨주고 이것도 동일하게 /tmp 폴더에 만들어주면?

![딸깍](https://github.com/user-attachments/assets/291b9f62-0297-4b8b-99d7-2360f3b008f9#.png)

명령어 한번으로 root의 euid가 생성된 파일을 생성해낼 수 있다.

![위치](https://github.com/user-attachments/assets/3e12c0f2-f3df-49ec-9369-ea82c8b775a0#.png)

위치는 여기 있으니까.

![실행](https://github.com/user-attachments/assets/46222b4b-7083-41cf-983a-994373fddf90#.png)

이렇게 실행할 수 있다.

![참고로](https://github.com/user-attachments/assets/f975c532-767d-47a9-9861-901190f2ae65#.png)

참고로 위처럼 편하게 보겠다고 그냥 `/bin/bash` 를 스폰해버리면 기껏 만든 root 권한이 없이 이 쉘을 실행한 주최인 marimo의 것으로 되니 해주고 싶다면 `os.setuid(0)`을 꼭 해주기로 하자.

![일케](https://github.com/user-attachments/assets/59ec5c0a-8f0a-47a9-b570-21cc7db858a0#.png)

일케 하면 더 예쁘게 볼 수도 있다.

## 마치며

![Cohort](https://github.com/user-attachments/assets/4f827bb0-c17f-4b1d-9a16-ec04e8120f18#.png)

솔직히 이번 문제 풀면서 초기 침투 부분을 너무 머리 쓰기도 했고 자꾸 어떤 단서가 딱 나왔는데 이게 지금 쓰일게 아닌데도 꼭 붙잡고 있다보니 어렵게 느껴졌었나보다.

이렇게 보니까 되게 쉬워보이는건 왤까...

솔직히 말해서 ws를 이용하는 부분을 진행할 때 서브 도메인이 있을거라는 생각을 아예 못해서 

아니 그럼 도대체가 poc를 어느 위치에 써야하는거지? 터널링으로 내부에 침투 할 수 있는 것도 아닌데?

하면서 해맸던게 어렵다 느낀 가장 큰 이유였던 것 같다 허허...

게다가 easy인 이유를 linpeas 돌리면 되니까 라고 해서 문제를 출제한 것 같은데 어딜 봐서 이게 easy냐.

cve를 찾지 못했으면 못 풀었을텐데 점수가 낮은데는 이유가 있달까.

이번 휴가동안 계속 몸이 아파서 지금 살짝 매롱한 상태인데 담번에 쓸 땐 안 아프길.

그럼 Happy Hacking이다!