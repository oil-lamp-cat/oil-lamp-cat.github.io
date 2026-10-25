---
title: "[PG Play] ColdBoxEasy (Linux_Fundamental)"
date: 2026-10-25 16:13:00 +09:00
categories: [Security & Hacking, HTB]
tags: [Proving Grounds Play, hacking, RedLabs, Linux]
pin: true
---

## 1. 시작에 앞서

![PGP](https://github.com/user-attachments/assets/ed42f554-6b6e-4844-b2bd-4cda52f3cd70#.png)

최근에 시작한(벌써 15일이 지나고 있는) OSCP를 공부하다 `PG Play` 라고 하는 실습 머신들을 발견해서 풀어 보았다.

알아보니 아마 내가 OSCP 글에서도 쓴 것 같은데, 이 부분은 무료 버전으로, 여기 저기 올라온 머신들을 offsec에서 가져와 풀 수 있게 해둔 것이다.

고로 많이 본? 것 같은 머신들도 있을거고, flag의 이름이나 형태도 좀 다르고 그랬다.

아 그리고 이거 기초 난이도람서 나한텐 또 아니였다.

씁... 실력을 길러야해!

![이렇게](https://github.com/user-attachments/assets/23e4c2cc-31c1-4852-8448-2894c6c6cd68#.png)

이렇게 문제에 들어가 풀어볼 수 있다. 저기 다른 힌트를 보거나 하면 그건 점수를 얻을 수 없기에 직접 풀어볼 수 밖에 없었다는...

## 2. 초기 침투 : 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap](https://github.com/user-attachments/assets/6184eb27-6bad-48ea-9269-151caf0e11aa#.png)

정보 수집을 해보았을때 80번 포트만 열려있는 것을 확인했다.

![사이트 접속](https://github.com/user-attachments/assets/2d3c6ec7-b5d1-485f-a5a7-eed43f5e4558#.png)

사이트에 접속을 해보니 이렇게 wordpress로 만들어진 페이지가 나왔다.

![wordpress](https://github.com/user-attachments/assets/ad357b82-247e-4301-be0c-9fb869933933#.png)

그래서 딱 보자 마자 어? 버전이 있네? 그럼 검색

을 통한 취약점을 찾긴 했으나 실패를 했었다.

사실 난 여기서 부터 문제가 좀 심하게 있었는데 그래서 저걸 어떻게 쓰지? 라고 하니까 방법이 없더라.

아마 이런 머신들을 자주 풀어본 사람 이라면 딱 봐도 검색 했을 때 wordpress? 게다가 검색 해보니까 WPScan 이라는게 있네? 그럼 저거 써야지.

라고 생각했을 탠데 난 몰라서 진짜 깊게, 깊게 삽질만 했었다.

## 3. 초기 침투 (Initial Foothold / Exploitation)

![wp1](https://github.com/user-attachments/assets/55a8e03d-120f-447e-9560-79fb92c8adea#.png)

그 당시엔 정말 오래 삽질을 했지만 결국 위처럼 

`wpscan --url <ip> --enumerate u`

라는 명령어를 통해 혹시나 이 WP에서 로그인 할 수 있는 유저가 브루트 포싱이 될까? 아니면 뭔가 취약한 플러그인이 있을까? 하고 스캔을 돌려봐야 했다.

![wp2](https://github.com/user-attachments/assets/9ca35aa5-fdc3-4824-8d57-148e4ee8d279#.png)
![wp3](https://github.com/user-attachments/assets/1e737785-0b19-43fd-8e58-8b170331f80a#.png)

그 결과 위처럼 `philip`,`c0ldd`, `hugo` 라는 유저들을 찾을 수 있었고

![wp4](https://github.com/user-attachments/assets/5011f15b-0c4b-4e82-874a-316d65f06073#.png)
![wp5](https://github.com/user-attachments/assets/5a69caee-e838-4b60-ad17-10ae72c64704#.png)

이번엔

`wpscan --url <ip> --usernames <user 찾은 것들> --passwords <rockyou.txt>`

이렇게 해서 브루트 포싱을 돌려보니 비밀번호를 찾을 수 있었다.

내가 너무 어렵게 생각했었던 것이다...

![페이지](https://github.com/user-attachments/assets/ee328173-9079-4eae-b676-2f0506450a38#.png)

그렇게 얻은 계정 정보를 토대로 사이트에 로그인하여 접속하는데 성공 했다.

![설정](https://github.com/user-attachments/assets/49c38f74-f428-4480-82a6-74e6e3da7d5a#.png)

난 솔직히 이제 여기서 ssh 설정이라던가 그런 곳에 하드코딩된 계정 정보를 찾을 수 있을 것이라 생각했다.

그런데 아무리 둘러봐도 딱히 찾을 수가 없었고

`Appreance`에서 테마를 변경할 수 있었다.

그니까 여기서 내가 만약 PHP로 리버스 쉘을 만들어 넣게 되면 그 페이지에 접속 했을 때 리버스 쉘이 실행 된다는 뜻이다.

~~지금 기준으론 php면 PHP2Shell이 되긴 하겠지만...~~

그런데 여기서 매우매우 큰 문제!!

![내가](https://github.com/user-attachments/assets/6e9cd5e1-971d-447b-b8d0-f4b8423e6275#.png)

내가 아무리 무슨 짓을 해도 변경 요청 자체가 날아가지를 않았다.

post 요청이 내 네트워크에서 서버로 전송이 되지 않는 것이다.

그래서 여기서 진짜 별에 별 것을 다 해보았다. 아예 취약점 다른 경로를 찾아보거나, 머신을 몇번이고 리셋 해 보거나

그런데 그건 답이 아니였던 것이다...

![mtu](https://github.com/user-attachments/assets/853c8689-7ac3-4be7-a50d-e8ad5196cee0#.png)

`sudo ip link set dev tun0 mtu 1200`

![mtuhate](https://github.com/user-attachments/assets/1a1bb62a-0542-4579-8041-32448836ed16#.png)
![mtuhate](https://github.com/user-attachments/assets/750cf75a-3f9f-4206-9d52-9035218e49d3#.png)

이런 썩을....

mtu가 내 머신에서 날아가는 정보를 모두 드랍하고 있었던 것이다.

뭐 이게 정확한 설명일지는 모르겠지만 적어도 이후 내가 oscp 과정을 수강하며 문제가 있을 땐 꼭 mtu 설정을 해주게 되면 정상적으로 작동했다는 이야기...

![mtu](https://github.com/user-attachments/assets/efd1d576-9c59-45b6-a06c-7e1b5bcb14ba#.png)

허튼 그래서 이제 php reverseshell을 404.php 위치로 올려주고

![접속](https://github.com/user-attachments/assets/8febca90-8869-4397-afdf-c8c1f7498981#.png)

페이지에 접속해

```
?cmd=echo <base64 reverse shell> | base64 -d | bash
```

이런 식으로 url에 base64페키징을 해서 넘겨주면? (그냥 넣으면 드랍된다)

![짜잔](https://github.com/user-attachments/assets/baeb307f-9ef7-4f4b-bc99-86276fb7759b#.png)

짜잔 리버스쉘 획득 성공!

이후 `python3 -c 'import pty;pty.spawn("/bin/bash")'`로 쉘 안정화를 해주고

내가 실수로 스샷을 안 찍었는데 (시험에서 이러면 진짜... 어우...)

`www-data@ColddBox-Easy:/var/www/html$ cat wp-config.php`

여기서 c0ldd 계정의 정보를 발견!

![계정](https://github.com/user-attachments/assets/abc16e92-2ff7-4621-8d1d-84411d7d62b5#.png)

비밀번호 재사용 취약점으로 인해 계정 취득

![및](https://github.com/user-attachments/assets/ead72011-8c34-49d1-8ef3-539e0948f6f1#.png)

및 플레그 획득 까지 성공이다!

![참고](https://github.com/user-attachments/assets/98280946-ad7c-4311-9f21-be097fb47f72#.png)

참고로 pgp는 플래그 이름이 local.txt 이런 식이더라.

## 4. 권한 상승 (Privilege Escalation) 

![sudol](https://github.com/user-attachments/assets/43adbf8f-779b-4923-9d9a-e1bce5bc2704#.png)

기본인 `sudo -l` 을 확인했을 때 `/usr/bin/vim`과 `/usr/bin/ftp`가 취약한 것을 확인

![이렇게](https://github.com/user-attachments/assets/eb395c75-a44d-4360-989a-41805e505a74#.png)

`sudo ftp`로 실행을 해준 후 `!/bin/sh`로 쉘까지 얻어냈다.

만약에 vim으로 올리겠다면

`sudo vim -c ':!/bin/sh'` 이렇게 해줘도 된다.

그렇게 플래그 획득도 끝!

## 마치며

![gg](https://github.com/user-attachments/assets/c3dc822e-58e9-4d85-a2dc-47ced20fde15#.png)

이렇게 되려 권한 상승 부분은 허무할 만큼 쉽게 성공했다.

아니 어떠헥 보념 그게 아니라 초기 침투가 그만큼 어려웠던거 아닌가? 흠....

1. 난 브루트 포싱이 밉다
2. 스크린 샷 진짜 꼭 찍어라
3. 아직은! 배워야 할게 많다!

Try harder!!