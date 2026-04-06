---
title: "[HTB] Kobold (Easy_Linux)"
date: 2026-04-02 15:16:00 +09:00
categories: [hacking, RedLabs, Linux]
tags: [Hack The Box, Easy]
password: "20260402"
---

[HTB_Kobold_호롱고양이.pptx](https://github.com/user-attachments/files/26508660/HTB_Kobold_.pptx)

> 솔직히 이거 뭔가 맞게 푼건지도 뭔가 내가 못 찾은 것도 있는거 같아서 나중에 retired 되면 다시 봐야할듯

> [Congratulations OilLampCat! You are player #4702 to have solved Kobold.](https://labs.hackthebox.com/achievement/machine/988787/856)

## 시작에 앞서

![Kobold](https://github.com/user-attachments/assets/34dc488f-be17-495f-9aa2-cfb61d5077a2)

일단 참.. 뭐랄까 문제를 풀면서 초기 침투까지는 정말 **"아하! 이러니까 이렇게 들어가면 되겠구나!"** 하며 문제를 풀었는데 권한 상승 부분에서 도대체가 맞게 한건지, 일단 플래그는 얻었는데 진짜 이상하게 풀어버린 특히 자동화 툴을 마지막에 쓰고 풀게되었다보니 문제를 풀고 왜 이렇게 된걸까 하고 찾아보는 상황이 되서 좀 당황스럽달까.

보통은 문제 풀이 -> 답 순서가 되는데 이번엔 답 -> 왜? 가 되어버린 상황이라 일단은 진행을 해보자고.

## 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap1](https://github.com/user-attachments/assets/abe0188f-836b-4fc5-9d6f-a47f9aab75a1)

일단 국룰이던 nmap 결과로는 `22번 ssh(안씀)`, `80번 http(안씀)`, `443번 https`를 찾을 수 있었다.

다른 문제들이랑 달리 https가 열려있다니 요건 좀 특이했달까.

![etchosts1](https://github.com/user-attachments/assets/14be7b08-fea4-457c-bb61-ffe4b7688e56)

그런데 이번엔 첨으로 window WSL에서 Kali를 열어 시도해봤는데 도메인 지정을 위해 `/etc/hosts`를 편집하려고 했더니 자동으로 다시 켤 떄마다 바뀌니까 너가 직접 끄세용! 이라고 하더라.

![wsl](https://github.com/user-attachments/assets/29b6e09c-128d-47e7-91c9-0379d09576d9)

`wsl.conf` 설정을 바꿔주고

![etchosts2](https://github.com/user-attachments/assets/9a6e72e5-dc2b-4617-97fb-5544059b8314)

다시 `/etc/hosts` 파일에 찾아낸 kobold.htb를 넣어주자.

아 참고로 난 윈도우 기본 쉘에 zsh 설치하고 catppuccin 테마를 사용하고 있다. mocha 테마로.

![443](https://github.com/user-attachments/assets/e42fb3b6-e810-4f71-8abe-eb3e134113ed)

접속해보니 뭔가 내용이 쭉 나오긴 하는데 무슨 서비스 관리 페이지? 그런 느낌인듯 하다만 coming soon을 눌러도 뭐 안되고 다른 버튼도 없다.

![burp](https://github.com/user-attachments/assets/0f2f74c5-29d2-43f5-b01b-45fbb7a3a58b)

혹시하는 마음에 burp로 찍어봤지만 동일하게 볼게 없었다.

![ffuf1](https://github.com/user-attachments/assets/99deb9cb-ec94-47ef-862f-7916d2f52b8b)

dirsearch를 돌려봤을 때에도 딱히 특별한게 보이지 않아 ffuf를 이용해 subdomain을 찾아보았다. 이 과정에서 `mcp`라는 것을 찾아냈고

![ffuf2](https://github.com/user-attachments/assets/02682a5c-c514-4e50-a84e-28587be2b177)

혹시하는 마음에 좀 더 큰 리스트를 써봤더니 웬걸 `mcp` 말고도 `bin`이라는 녀석을 발견할 수 있었다.

![etchosts3](https://github.com/user-attachments/assets/9d3d8be9-62f3-4f68-8364-aeba070e4dd6)

추가적으로 도메인 두개를 더 넣어주고 접속을 해보면?

![mcpjam1](https://github.com/user-attachments/assets/3ed5153a-a550-4971-9a44-0ac6162a2fa8)

메인 사이트에서 나왔듯 ai를 다루기 위한 `mcpjam`이 설치되어있었다.

![mcpjam2](https://github.com/user-attachments/assets/8b4daff0-0973-4d8f-b39b-cb66700c79d2)

좀 더 찾아보니 버전 1.4.2를 사용하고 있었다.

![bin1](https://github.com/user-attachments/assets/632b5200-da01-4300-aece-fcbd013c5c45)

추가로 찾아낸 bin 에 접속하니 `privatebin 2.0.2`이라고 하는 서버 내부에서 쓰는 `pastebin`같은 사이트가 있었다.

## 초기 침투 (Initial Foothold / Exploitation)

![CVE](https://github.com/user-attachments/assets/ff900feb-52df-46ff-8e75-319535a1a6f0)

인터넷을 돌아다니며 혹시 이 버전들에 취약점이 있을까 찾아보니 MCPJam에 `CVE-2026-23744`라는 취약점을 찾아낼 수 있었다. 

[REC in MCPJam inspector due to HTTP Endpoint exposes](https://github.com/advisories/GHSA-232v-j27c-5pp6)

![CVE2026](https://github.com/user-attachments/assets/1d1068dc-66cf-47e8-95aa-38a1e4891ab7)

[oxg00se/CVE-2026-23744-script](https://github.com/0xg00se/CVE-2026-23744-script)가 가장 간단해 보였기에 이것을 이용하기로 했다.

![초기](https://github.com/user-attachments/assets/046f2e24-8a4a-4366-af90-45168afd11f2)

CVE의 파이썬 코드를 이용해 mcpjam의 `/api/mcp/connect`에 페이로드를 보내 리버스 쉘을 얻는데 성공하였다.

![flag](https://github.com/user-attachments/assets/d79316c1-015e-46de-8a9e-44d68ba18162)

그리고 `python3 -c 'import pty; pty.spawn("/bin/bash")'`을 이용하니 `ben`이라는 유저로 들어왔고 플래그를 얻을 수 있었다.

## 권한 상승 (Privilege Escalation) 

사실 이제 이 부분이 좀 많이 내겐 문제였던 부분의 시작인데, 초기침투를 하는 부분에서 mcpjam에 대한 취약점을 악용하여 침투에 성공해 `ben` 이라는 유저를 얻어낼 수 있었다만...

![sudol](https://github.com/user-attachments/assets/a352dd81-6082-4731-ab6b-3853806cb871)

이 ben 유저로 `sudo -l`을 하자니 정작 ben 유저의 비밀번호를 모르네?

![id](https://github.com/user-attachments/assets/f56d8b28-f5dd-4a59-9e3d-104921444cbf)

그렇다면 이 ben 계정이 속한 그룹에 특이하게 37(operator)라고 쓰여있으니 이게 바로 공격할 곳인가? 싶어 쭉 둘러보니 위에서도 찾았듯 `/privatebin-data` 라는 폴더를 찾을 수 있었다만...

여기서도 문제인게 애초에 `bin.kobold.htb`에 접속해 privatebin 에 뭔갈 올려서 넘기려고 해도 쓴 후에 애초에 서버로 정보가 전혀 넘어가지 않았다. 그리고 만약에라도 데이터가 들어갔다면 e3나 bd에 들어갔어야 할텐데 음... 전혀 아무 내용도 없다. 뭐.. 당연하겠지 애초에 파일 올리거나 텍스트 올리는 것도 안되니.

그럼 다시 막혀버리는 상황이 온 것이다. 진짜 내부 파일들 다 직접 뒤져보고 내부에서만 접근 가능한 통신망 있을까 둘러보기도 했는데 이미 찾은 것들 외에는 없었다. 그럼 그것들로만 해도 뭔가 된다는 소리일텐데...

여기서 좀 많이 골머리를 앓다가, 아니 이게 Easy 난이도인데 이렇게 정보가 없는게 말이 되나? 싶은 생각도 들어서 오랜만에 `linpeas`를 꺼내들기로 했다.

![linpeas1](https://github.com/user-attachments/assets/f95cbfd8-6e97-4194-bf90-322409cb3839)

다행이랄까..? tmp 폴더에 linpeas를 옮겨서 실행할 권한이 있었고 내 kali에 린피스를 다운받은 후에 넘겨서 실행했다.

![linpeas2](https://github.com/user-attachments/assets/be780dd3-87fe-4047-96c9-076ba05ecea9)

그런데 말입니다. 여기서도 진짜 평소처럼 여기 취약점 있음! 하고 빨간 색으로 뜨지가 않더군요? 애초에 이 ben 이라는 유저로서도 계정의 비밀번호가 없으니 스캔하는데에도 문제가 있었고 말입니다...

하지만! 그럼에도 뭔가 찾아냈다는거 아니겠어요?

`Actual Group Memberships via newgrp`

`Accessible group not shown in id: docker (gid=111)`

평소 우리는 권한 확인을 할 때에 내가 그랬듯 `id` 명령어를 처서 확인하곤 하는데 linpeas는 그것 뿐 아리나 `newgrp` 이라고 하는 명령어를 직접 실행을 해가면서 권한이 있는지 확인을 하게 됩니다.

그리고 그 과정에서 이상하게도 이 ben 이라는 계정이 `docker`라는 그룹에 대해서 권한이 있는 상황이다! 라는걸 제게 알려준것이죠.

아니 이게 빨간 글씨가 아니라고? 어째서?

![newgrp](https://github.com/user-attachments/assets/a14e0df3-61c0-457d-83dd-76a19e5d01af)

자 그럼 뭔가 특이한 도커 권한을 찾아냈으니 이걸 이용할 수 있는지 한번 확인을 해봐야겠죠?

위 이미지를 보면 알 수 있듯 `newgrp docker` 명령어를 통해 원래 있던 `operator` 외에 그룹을 하나 더 추가 해줍니다.

이후 이제 도커 권한을 얻었으니 컨테이너를 하나 더 만들어야 하는데 그러려면 뼈대가 되는 이미지가 필요하고 그 이미지를 굳이 외부에서 다운받는게 아니라 `docker ps` 명령어를 통해 현재 서버에서 돌아가고 있는 컨테이너 목록을 확인해보는거죠.

결과를 보아하니 `privatebin/nginx-fpm-alpine:2.0.2`라는 이미지가 존재했고요.

`docker run --rm -it -u 0 --entrypoint sh -v /:/mnt privatebin/nginx-fpm-alpine:2.0.2`

이 공격에서 도커 권한 상승의 가장 핵심인 명령어 부분입니다. 그리고 제가 또 검색한다고 애먹었던 부분이기도 하고요.

- `--rm -it` : 끝나면 지워줘(--rm), 쉘을 줘 (-it)
- `-u 0` : 내 권한을 무조건 root(uid 0)으로 줘
- `--entrypoint sh` : 컨테이너 켜지면 바로 쉘 실행해
- `-v /:/mnt` : 볼륨 마운트를 할 때 이 서버(호스트)의 최상위 하드디스크(/) 통쨰로 새로 켜지는 컨테이너의 `/mnt` 폴더에 연결해줘

라고 하는 명령어를 이용한 건데, 음.. 어쩌면 필요 없는 부분이 있을 수도 있다는 점!

그리고 위 명령어를 치고 나면 쉘이 `/var/www #`으로 변했고 이건 `컨테이너 내부`에서의 루트를 얻은거긴 합니다. 하지만 우리의 목표는 `/`죠? 그렇기에 `chroot /mnt` 명령어를 사용해서 최상위 경로를 `/mnt`로 설정해버리는거죠.

그렇게 최고 권한을 얻고 root 플레그를 얻을 수는 있었습니다만..

위에서도 말했듯 뭔가 자동화 툴을 쓰니까 찝찝하잖소? 그래서 그럼 도커가 열려있다라거나 도커 버전에 대한 내용이 있는데 내가 못 본걸까 해서 좀 더 파일들을 둘러봤습니다.

![docker](https://github.com/user-attachments/assets/9f326b78-fc26-46e1-8b3f-21c671a5d36f)

그랬더니 일단 mcpjam을 설치하는데 있어 Readme를 읽어보니 docker로 설치한다 라는 이야기가 있기도 했고

![packagejson](https://github.com/user-attachments/assets/e630f195-fe6b-435c-8462-ba356579d342)

package.json을 열어보니 NPM scripts 부분에 docker 관련 내용이 좀 많기는 했다는 것.

![gshadow](https://github.com/user-attachments/assets/5a404481-e1cc-44f4-8cec-ba9ef78f572d)

그리고 최종적으론 결국 루트 권한을 얻고 나서야 찾을 수 있었던 내용이지만 `/etc/group`에는 ben의 권한에 대한 내용이 없으나 아까 `/home` 디렉토리에 있었던 `alice` 라는 유저가 docker 그룹에 있기도 했고 `/etc/gshadow` 파일 안에는 docker 그룹 안에 ben과 alice 가 있다고 써있기도 했다는 것.

근데 결국 맨 아래건 결론적으론 루트 권한을 얻어야 볼 수 있던 파일이니 그저 linpeas를 돌리거나 mcpjam에 대해서 좀 잘 알고 있어야 풀 수 있던 문제라고 밖에 보이지 않는다.

## 마치며

![solv kobold](https://github.com/user-attachments/assets/75a48257-5b83-43d1-a45e-87f2a2b24615)

이번 문제는 진짜 참 여러모로 복잡했던 문제였다. 분명히 초기 침투까지는 이해가 갔다만 어째 권한 상승의 부분이 전혀 어떠한 이유도 없이 저렇게 되어버리니 참.. 퍼즐을 푸는데 단서 없이 갑자기 자물쇠가 열려버린 기분이랄까? 그리고 보아하니 그래서인지 이 머신의 경우엔 현재 기준 별점이 3.7점이라는 이야기 ㅋㅋㅋㅋ

뭐 모든 문제가 다 와 스러울 수는 없으니까, 그리고 어쩌면 이번 문제가 더 현실에 가까운 문제일 수도 있고 말이지.

아니 근데 진짜로 operator 그룹하고 privatebin은 함정이였던걸까? 정말 그런거라면 와... 난 이번 문제는 오히려 높게 칠지도 모르겠다.

요거는 이번 redlabs에서 발표를 한번 해볼지도?