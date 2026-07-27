---
title: "[HTB] Orion (Easy_Linux)"
date: 2026-07-27 18:25:00 +09:00
categories: [Security & Hacking, HTB]
tags: [Hack The Box, hacking, RedLabs, Linux]
pin: true
---

![Orion](https://github.com/user-attachments/assets/df097b87-f449-43c1-a71d-e923fb9860bb#.png)

[Orion has been Pwned OilLampCat has successfully pwned Orion Machine from Hack The Box](https://labs.hackthebox.com/achievement/machine/988787/945)

## 1. 시작에 앞서

![Orion](https://github.com/user-attachments/assets/1e67656e-c67c-479b-ae17-3d2baeee4883#.png)

이번 문제는 사실 2주간 개인적으로 많이 재밌는 취미를 찾게 되어 퇴근하고 놀다 HTB 대회를 진행해보기 전 Bedside 라는 문제에 도전했다가 알 수 없는 이슈로 실패하고 갑작스레 풀게 된 문제였다.

![Saltc](https://github.com/user-attachments/assets/520689c7-d0c3-4ab8-8ed5-8bc5717b0d2e#.png)

요것도 솔직히 말하면 많이 풀어보지도 못했고 도전도 못했기에 블로그에 글을 쓸지는... 

## 2. 초기 침투 : 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap](https://github.com/user-attachments/assets/2c566194-14bf-41ad-ac7e-74f5efd2ea22#.png)

자! 일단 위에서 말했듯 이 문제는 갑자기 풀게 되었고 지금 2시간 안에 정리해서 제출해야 하니까 후딱 진행해 봅시다.

일단 Easy 던 뭐던 htb 문제는 포트 스캔이 시작이죠?

결과는 `22번/ssh`와 `80번/http` 포트가 존재하네요.

익숙하죠?

그럼 바로 웹에 들어가 살펴봅시다.

물론 그 전에 잠시 `/etc/hosts`에 도메인을 등록해 주고요.

![web1](https://github.com/user-attachments/assets/cb8ce166-7a8f-4c8e-a567-3d447297154c#.png)

보아하니 무언가 전화? 서비스가 보이는데

![web2](https://github.com/user-attachments/assets/2c2c2662-ca3d-4d8a-bd0b-ee880d047a00#.png)

이 회사는 위 같은 서비스를 갖고 있다 한다.

![web3](https://github.com/user-attachments/assets/eda6574f-b19a-4751-811f-5f66c57b1bd9#.png)

그럼 로그인 할 수 있는 뭔가가 있나 했더니 그건 아니고 메일로 연락을 보낼 수 있게 되어있다. 

근데 그 전에 아래 **CraftCMS**로 만들어졌다는 이야기가 있네?

![dirsearch](https://github.com/user-attachments/assets/f763d810-a65f-441e-8b2d-7cf3258d8739#.png)

다만 그 이후에 딱히 사이트 자체에선 찾지 못해서 **dirsearch**를 이용해 ui로 들어갈 수 없는 사이트들을 살펴봤다.

`/admin` 이라는 위치가 존재하네??

![admin](https://github.com/user-attachments/assets/0379fe85-d4b2-4244-a794-3f599daf78e1#.png)

**/admin** 을 찾아들어가니 아까 보았던 **Craft CMS 5.6.16** 까지, 이번엔 심지어 버전까지 확인할 수 있었다.

Forgat password는 들어가도 뭐 할 수 있는게 없었고.

![cms](https://github.com/user-attachments/assets/ba58641b-d70f-47fa-b3b2-1d10a1b23b7b#.png)

버전 정보를 통해 검색을 하자마자 바로 심지어 우리의 제미니께서 취약점 정보를 가져다 주었다.

아니 너 보안 관련된건 침묵 아녔어?

## 3. 초기 침투 (Initial Foothold / Exploitation)

![CVE](https://github.com/user-attachments/assets/6c63f726-c14a-4fef-b040-82f1ae39a27f#.png)

그렇기에 바로 github 에서 POC를 찾아 이용하였다.

CVE의 자세한 내용은 직접 찾아보도록! 유명한건지 한국어로 설명 되어있는 것들도 많으니까.

![rev](https://github.com/user-attachments/assets/55c094a6-bbed-4b17-b525-d012be38ccc2#.png)

다만 여기서 문제가 있다면 사실 바로 리버스쉘을 띄워버리는 코드를 입력해서 보냈었다.

근데 이게 poc의 문제인건지 아니면 bedside 문제를 풀 때도 자꾸만 막혔던 내 쪽 인터넷의 설정 때문인지 즉각적인 리버스 쉘을 받는건 실패해서 어쩔 수 없이 내 쪽에 리버스쉘 스크립트를 짜고 머신이 받아가 실행하게 만들었다.

![www](https://github.com/user-attachments/assets/7dbe508e-37d9-4775-b8d4-b162f3353e99#.png)

리버스쉘로 들어오니 `www-data`인 그니까 결국 진짜 사용자가 아니였기에 좀 더 살펴보기로 했다.

![env](https://github.com/user-attachments/assets/57281a10-a470-4a85-b5d8-1c0c86996056#.png)

그러다 **.env** 파일에서 결정적인 단서를 발견했다.

무려! mariadb의 user와 password를!

![maria](https://github.com/user-attachments/assets/69b3299e-86a1-4f6d-80a9-f6f7108ca90b#.png)

easy 문제라서 그런지 특별한 기교 없이 mariadb에 접속할 수 있었다.

![table](https://github.com/user-attachments/assets/99d48bad-02ea-4bd4-b78c-22fc9aceba69#.png)

다만.. 이게 여간히 많아야지...

![user](https://github.com/user-attachments/assets/7702c612-9110-4079-a39d-6384f1591f71#.png)

하지만 다른건 제처두고 우리가 딱 볼만한 이름들이 있다.

바로 USER 테이블.

예상대로 유저 테이블에는 사용자의 이름과 비밀번호(암호화된)가 있었다.

![hashcat](https://github.com/user-attachments/assets/708010ac-247c-4da1-8a98-1d7ee3f1edb7#.png)

하지만 고것은 가뿐히 hashcat으로 해시 크래킹을 진행해주고

![ssh](https://github.com/user-attachments/assets/db99b6ba-ccac-43fa-94a4-2b3a056cfba3#.png)

ssh에 접속해 유저 플래그를 획득할 수 있었다.

## 4. 권한 상승 (Privilege Escalation) 

![sudo](https://github.com/user-attachments/assets/ebd06c74-3f47-43f0-91b9-3230f15af947#.png)

다만 권한 상승에서 살짝 문제가 있었다. `sudo -l`는 불가능 했고 이 계정에 특별한 권한이나 그룹은 없었다.

그래서 거의 끝에 가서야 내부 포트를 스캔해 보았는데,

솔직히 봐도 모르겠어서 제미나이한테 던졌더니 `23`번 포트가 무려 `telnet`의 기본 포트라고 한다.

그리고 혹시 모르니 그걸 확인해 보래서 버전을 확인해보니.

![telnet](https://github.com/user-attachments/assets/40969025-e0e4-464f-939b-c3fb2218c98f#.png)

어째 이거 버전이.. 낮은거 같다?

![버전 검색](https://github.com/user-attachments/assets/f228e170-ea93-4ee8-936e-1d73acc49b90#.png)

그래! 이거지!

확실히 버전이 낮은게 맞았다.

![root](https://github.com/user-attachments/assets/c517d6ff-e70c-4b66-a6c3-47642a8247ba#.png)

심지어 이 버전의 취약점을 이용하기 위해선 특별한 poc 스크립트나 기교 조차 필요하지 않았다.

그저 **"내가 루트요."** 하며 문을 열고 들어가기만 하면 됬으니까.

![루트 플레그까지 끝](https://github.com/user-attachments/assets/288dd41f-9831-4383-9f94-e7c77d95c667#.png)

그렇게 루트 플레그 까지 끝!

## 마치며

![orion pwned](https://github.com/user-attachments/assets/83be58e0-335d-4640-9293-af4d94e6fb8e#.png)

진짜 이번 문제는 Bedside의 대용으로 제출할 문제를 찾다보니 풀게 되었는데 아무래도 오픈된 문제다보니 공식 writeup이 나와있어서 너무나도 보고 싶었다.

하지만! 권한 상승에서 막혔다 한들 언젠간 또 비슷한 문제를 만날 것이고 최대한 머리를 굴려보자 하여 이렇게 풀어낼 수 있었다.

끝나고 공식 라이트업 보니까 매우 맞게 풀었더라.

그럼 Happy Hacking이다!