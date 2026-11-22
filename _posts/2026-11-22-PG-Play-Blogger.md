---
title: "[PG Play] Blogger (Linux_Fundamental)"
date: 2026-11-22 19:46:00 +09:00
categories: [Security & Hacking, PGP]
tags: [Proving Grounds Play, hacking, RedLabs, Linux]
pin: true
---

## 1. 시작에 앞서

![이번엔](https://github.com/user-attachments/assets/f0de5ddf-0ac3-428c-a9bd-0ea006fc9659#.png)

이번엔 사실 올라갈 문제 풀이가 이게 아니였다.

![본래](https://github.com/user-attachments/assets/cfdeb670-3304-4c3a-bf3e-bd6f18652683#.png)

본래는 요것을 풀고 있었는데

![뿌에에에ㅔ](https://github.com/user-attachments/assets/e07bbf61-0ce3-4247-99fb-0edfc9d392e4#.png)

초기 침투 단계에세 횡적 이동을 해야 하는데 어떻게 뭘 찾아서 다음으로 나아가야할지 전혀 이해하지 못했고, 그 경로를 찾지도 못해서(거의 6시간 동안) 기어코 내려놓고 풀게 된 문제였다.

사실 이번 것도 초기 침투 할 때 아 또 WP야? 하는 생각에 괜히 쉬운걸 골랐나, 라고 생각했지만

으음... 지금 생각해보면 모르는걸 배울 수 있어서 갑진 시간이었더언...

## 2. 초기 침투 : 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap1](https://github.com/user-attachments/assets/6526455e-0266-4ce3-893d-0bdd12cb29a8#.png)

OSCP공부를 하고 있다보니 거기서 배운 것들을 요로콤 조로콤 사용하기도 했다.

기본적으로 nmap을 통해 전체 핑 스캔을 돌려보고

![그결과](https://github.com/user-attachments/assets/b3b8c02b-aae9-4e09-bd3e-e7eecaada6e9#.png)

그 결과를 통해 나온 포트를 스캔을 해보고

![업으니](https://github.com/user-attachments/assets/5dc54a0f-9903-4ef7-b973-535d387214ae#.png)

특별해 보이는건 없으니 일단 사이트로 접속을 해보고

![버전](https://github.com/user-attachments/assets/1eea5465-21bd-4733-a920-6aaeee407ffd#.png)

wappalyzer로 버전도 찍어보니 저런 느낌이고

![물론](https://github.com/user-attachments/assets/a384e9bb-16b4-4829-b13f-bf7366fca264#.png)

물론 그 버전 토대로 검색을 해보았을 때 CVE가 존재하긴 했지만 이건 특정 조건이 있어야 하는? 그런 것에다가 

좀 안 맞는 것 같아서 조금 더 살펴보기 시작

![모든](https://github.com/user-attachments/assets/9948de12-c9d0-4fae-b865-80e3593b12c9#.png)

모든 버튼은 다 홈 페이지로 보내버리는, 외부 네트워크 통신을 일절 하지 않는 빈 사이트라는 것을 알 수 있었다.

![간단히](https://github.com/user-attachments/assets/d851f2ee-cbd4-4f61-8bc1-55c1af921ef0#.png)

간단히 dirsearch를 통해 디렉토리 리스팅을 해보았지만 특별한건 못 찾았고

![요로콤](https://github.com/user-attachments/assets/9865573d-432d-4b37-b7af-31381891d699#.png)

요로콤 폴더를 뒤져볼 수 있었는데 여기서 `../../../`같은 file traversal을 시도했지만 당연하게도(?) 안 됬었다.

그래서 ffuf를 이용해 서브 도메인을 찾아보기도 했었는데

![못참고](https://github.com/user-attachments/assets/051d485e-bdf1-47d6-857e-032cb4b23433#.png)

찾지 못해서 아예 feroxbuster로 싹 뒤져보기로 했다. 

![그렇게](https://github.com/user-attachments/assets/403c5710-696f-49c9-b412-0cc5c89cb679#.png)

그렇게 재귀탐색 결과

아니 무슨 `wp`가

그러니까 워드프레스가 `assets/fonts/blog`에 있다는 것을 발견했다.

여기서부터 또 처음 보는 초식이라 머리가 아찔해졌다.

![혹시](https://github.com/user-attachments/assets/8731a288-613a-4ad5-a99d-0b171ecd2ae3#.png)

혹시 몰라 `wpscan --url http://<IP>/assets/fonts/blog/ -e ap,u`를 돌려보기도 했었는데 너무 오래 걸리고 일단 뭔가 하나 발견한 듯 싶어 멈췄다.

![그보다](https://github.com/user-attachments/assets/595d0efb-752c-4f5e-a6a7-46808076a7a8#.png)

그보다 일단 접속을 해보려고, 저 위치로 갔더니 사이트가 깨져서 보이는게 아니겠나.

![게다가](https://github.com/user-attachments/assets/fcb2652c-20fd-403e-afc8-be4f9d9b9eb0#.png)

게다가 들어갔더니 사이트 주소가 `blogger.pg`로 보내는 것을 확인할 수 있었다.

![도대체](https://github.com/user-attachments/assets/9c9a5924-3573-42ef-9bd5-8f8248a8819e#.png)

IP로 접속을 해서 찾아갔더니 도메인으로?

![그렇기에](https://github.com/user-attachments/assets/edd8b3e7-cdb5-4c3d-bbbb-3ffe62a152b9#.png)

그렇기에 도메인을 등록해주고

![찾아가니](https://github.com/user-attachments/assets/b378f29a-ee54-4f16-a53b-223132e6e09c#.png)

찾아가니 드디어 무슨 사이트가 등장했다.

wp로 만들어진 블로그로 보였으며

assets를 모두 지우고 방문하게 되면

![다시](https://github.com/user-attachments/assets/5d6da9a4-6585-454f-85bf-92d6b26eefa2#.png)

다시 아저씨랑 아이컨택을 할 수 있다.

![그래서](https://github.com/user-attachments/assets/f4655d19-11aa-49f9-8227-7ddf3a4b62fd#.png)

허튼 그래서 wpscan을 돌려뒀던 결과를 살펴보다가 

![wjrjt](https://github.com/user-attachments/assets/ac1475f6-4c2d-401b-b7e0-6498a6c45378#.png)

`wpDiscuz`라는 것을 마침 발견하게 되었고

그를 통해 searchsploit에 검색하자 바로 취약점을 이용한 코드들이 발견되었다.

## 3. 초기 침투 (Initial Foothold / Exploitation)

![즉시](https://github.com/user-attachments/assets/795fcd6f-9861-4682-b67d-29ece28fe053#.png)

즉시 다운받아서

![코드](https://github.com/user-attachments/assets/7cf22e7d-d728-4209-aa77-fce9703eb589#.png)

코드를 살펴보며 사용법을 간단히 익히고

![실행](https://github.com/user-attachments/assets/6b9df095-8632-4d5b-8fca-8b42ffe348ed#.png)

실행 하면? 

분명히 업로드는 되었다는데 정작 쉘은 작동을 안 했다.

![직접](https://github.com/user-attachments/assets/a180a6b7-1e2e-4ff1-8eab-a6e1d3b224a8#.png)

다만 직접 접속을 해보면?

확실히 결과가 나오긴 한다

![그러면](https://github.com/user-attachments/assets/229a29a4-0ed3-49b7-bf70-3579c0de0b38#.png)

다만 일단 나는 공부를 하는 사람이기에 확인을 해보니 `?cmd=`을 들어가는 `?` 앞에 

`&quot`가 들어간다는 것을 확인했다.

그래서 그걸 지우게 했는데!! 또또또! 안되서

![print](https://github.com/user-attachments/assets/effc0120-6bb4-41f7-a513-2cbe429a16a5#.png)

아예 print를 찍어서 확인해보니

링크를 `url:http`로 받고 있었다...

아니 이러니까 안되지

![그래서](https://github.com/user-attachments/assets/7c0b74b8-4b8f-46e8-8b89-9871011198cd#.png)

고로 이렇게 http부터 저장하도록 shell을 설정해주면?

![드디어](https://github.com/user-attachments/assets/9b300586-e45c-4281-a383-9fe82eea9f6d#.png)

드디어 제대로 쉘 입력이 되는 것을 확인할 수 있었다.

![curl](https://github.com/user-attachments/assets/34da4799-63a8-441f-bcd8-bcbc61a7b75d#.png)

curl을 통해 `--path-as-is`랑 `--data-urlencode`를 이용해서 리버스쉘을 띄우면

![nc](https://github.com/user-attachments/assets/85e69c4e-4bc0-4757-b753-fb01b008eb7b#.png)

그렇게 쉘을 얻어낼 수 있었다.

![업글](https://github.com/user-attachments/assets/a58d6e19-d72a-4b43-a8cb-2dad49a6e6a7#.png)

혹시 모를 상황에 대비해서 업글도 해주고

![간단한](https://github.com/user-attachments/assets/e7f49992-a89a-4aa7-81d8-729aa85e56a1#.png)

폴더를 보니 3개가 있다.

![유저플레그](https://github.com/user-attachments/assets/41f0c8a5-adcf-45cf-bbe3-2e0d5ea8ad21#.png)

그런데 james 폴더에 접근을 할 수 있어서 여기서 유저 플레그를 얻을 수 있었다.

![flagfound](https://github.com/user-attachments/assets/92506281-6439-4973-84a9-c825b3a99b6a#.png)

## 4. 권한 상승 (Privilege Escalation) 

이제 이 과정에서 난 극심한 래빗홀에 빠졌다가 머리 싹 비우고 다시 했긴 했는데 그 전까지의 과정을 좀 나눠서 이야기를 해보려 한다.

![일단](https://github.com/user-attachments/assets/cc307c0b-af09-4207-b453-e852c275d872#.png)

일단 기본적으로 `sudo -l`을 했지만 권한이 없고

![perm](https://github.com/user-attachments/assets/c0f78769-afa6-4ba5-8853-dc1dc64acc85#.png)

가능한 권한을 확인해봐도 딱히 눈에 띄는건 없었으며..

![env](https://github.com/user-attachments/assets/4f9c77c5-d9dd-436b-a276-fdd226fcdd9e#.png)

환경변수를 확인해 보았을 때에도 눈에 띄는 것은 없었다.

![cron](https://github.com/user-attachments/assets/a7e9d286-aa47-45cb-8bea-ce5ec6985fb1#.png)

대신 cron을 확인해보았을 때

옷?!! 

`/usr/local/bin/backup.sh`를 확인할 수 있었는데 확인을 해보니

![backup](https://github.com/user-attachments/assets/59f4f929-4d54-4b62-8ba1-94f1da558ae1#.png)

backup.sh를 확인해보니 

```sh
#!/bin/sh
cd /home/james/
tar czf /tmp/backup.tar.gz *
```

로 되어있어서 만약에? 내가 `/home/james/`에 뭔가를 만들어두면?

그걸 `/tmp/backup.tar.gz`로 모두 싹 다 압축해서 보내버리게 되어있었다.

근데 여기서 이 스크립트가 root 권한으로 실행이 되어버리니까 그럼 루트 권한을 얻게 되네?!!

![문제](https://github.com/user-attachments/assets/7139b65f-fa39-47dc-9896-1fab4e003899#.png)

문제가 있다면 일단 내가 여기 뭔가를 만들기 위해선 `james`의 계정이 있어야 했다는 것...

### 여기서 부터 잠시 래빗홀

![config](https://github.com/user-attachments/assets/6324fd90-3bab-45c6-a59d-880265e46e35#.png)

난 여기서 그럼 이제 어떻게 비밀번호를 찾을까 하다가 wp를 쓰고 있었으니 

`wp-config.php`를 통해 MySQL DB의 정보를 얻어냈다

![일단](https://github.com/user-attachments/assets/b2440d38-1b8b-4b3b-8d4d-fe5fc801090a#.png)

일단은 이 얻은 비밀번호를 조금 써봤는데 비밀번호 재사용 취약점은 없었다.

![그래서](https://github.com/user-attachments/assets/89f36df0-27b2-41e5-9363-0171abcb06d5#.png)

그래서 이 얻은 DB 계정 정보를 통해 MariaDB에 접속을 해보았다.

![여기서](https://github.com/user-attachments/assets/b4091f19-115b-4de7-b07f-26f3b86c8ede#.png)

그렇게 찾아낸 `user_pass`의 해시를

![이제](https://github.com/user-attachments/assets/9bf552de-f679-4870-9c3c-a518a1e40c6a#.png)

물론 이건 이제와서 내가 확인한 것이지만 포맷이 없었고

![world](https://github.com/user-attachments/assets/0c90a33e-2280-480a-bbb9-d1a9fde9cde5#.png)

분명히 `$P$`로 시작하는 wordpress 해시라고 했는데...

![rockyou](https://github.com/user-attachments/assets/aec8eb7c-7741-4166-af5d-cf72aa2bf685#.png)

rockyou는 어림도 없었다.

그래서 진짜 이걸 어떻게 하려고 별 방법을 다 찾아보고, salt를 찾아보고 했었는데...

### 성공한 방법

![옮겨](https://github.com/user-attachments/assets/ea08815f-c290-4654-8822-cdcae699ec28#.png)

linpeas를 옮겨와

![leanpeas](https://github.com/user-attachments/assets/c65beee9-1933-4808-9c33-1262b4d7f4e9#.png)

스캔을 딱 때리면서 클로드한테 내가 도대체 이 이상 뭘 봐야하느냐고 물어봤더니

![마침](https://github.com/user-attachments/assets/a2eec738-4443-4e28-af66-1751a7d680fa#.png)

마침 linpeas에서 `root`권한으로 만들어진 `/opt` 폴더가 있다고 목록에 써있어서 갔더니

`.creds`라는 파일 하나를 발견할 수 있었다.

![그래서](https://github.com/user-attachments/assets/a70f2660-3a7c-467f-b020-db36750c0230#.png)

그래서 읽어보니 이런 특이한? 해시를 발견할 수 있었고, 도대체 이건 뭐고 또 어떻게 풀어야 하는건가? 싶어 이것 저것 알아보다

![이렇게](https://github.com/user-attachments/assets/57ef5948-c1ae-4f3f-961b-d27184d5df36#.png)

[Online Tools for Ciphers](https://www.boxentriq.com/)

라는 사이트를 찾아내서 한번 넣어보니

이게 `Rot47`이라는 방식으로 인코딩 되어있다는 것을 알아낼 수 있었다.

![그렇게](https://github.com/user-attachments/assets/adcb5598-ade3-4a36-851a-5b21346e61f6#.png)

그렇게 돌려보니

누가봐도 Base64로 만든 것 같은 문자열로 변경되었고

![그것을](https://github.com/user-attachments/assets/16b1b4aa-bbe3-4133-83f9-d5214aeaa3bc#.png)

그것을 돌려보니 또또? Base64인 것을 확인했다

[Magic - CyberChef](https://gchq.github.io/CyberChef/])

그렇게 보아하니 몇번을 더 해야 할 것 같아 위 사이트로 들어가 돌려보니

![정신이](https://github.com/user-attachments/assets/1ea2493a-e354-4707-9d41-a21d13fb9e1e#.png)

정신이 나가버려어....

무려 ROT47을 돌리고? Base64를 무려 5번을 해야지만 풀어지는 인코딩였던 것이다.

여기서도 진짜 이해가 안 갔던게

도대체 왜? 왜왜? `/opt`에 저런게 있는 것이냐 물었더니

`/opt`는 기본 리눅스에선 무언가 없고, 보통 뭔가를 새로 설치 하거나? 할 때 있는 곳이라고 했다.

그리고 그곳에 아마도? 이 문제의 목적이라고 한다면 사용자가 비번 저장하기 귀찮아서 저기에 인코딩로 저장했다, 라고 생각해야 할 듯 하다.

![su](https://github.com/user-attachments/assets/b5c1db28-076a-4cbf-9fe8-5ad50f32b66a#.png)

그럼 이제 비밀번호를 찾았으니 `su james`로 james의 계정을 얻어낼 수 있었다.

![권한 상승](https://github.com/user-attachments/assets/98b313e0-06c8-4104-93d8-b8fe668da94c#.png)

그럼 이제 아까 찾았던 취약점을 이용하면

`tar -czf backup.tar.gz /big/folder --checkpoint=1000 --checkpoint-action=echo="1000개 처리됨"`

원래는 이런 코드가 가능한데 이건 이제 tar 자체의 인수를 이용하는 것으로

"N개 처리 할 때 마다 뭔가를 해라!" 라는 것이었다.

그런데 이제 그걸 

```sh
만든 파일:       

--checkpoint=1
--checkpoint-action=exec=sh shell.sh

            ↓

cron이 실행: 

tar czf /tmp/backup.tar.gz *

            ↓ ('*'가 파일 이름들로 펼쳐짐)

tar czf ... --checkpoint=1 --checkpoint-action=exec=sh shell.sh

            ↓

tar가 이걸 "압축할 파일"이 아니라 "내 옵션"으로 읽음!
```

이런 식으로 실행되게 만들어버리는거다.

내용 없지만 `*`로 모든 파일을 읽어오니까, 그 이름에 `--checkpoint=1`이라는 이름의 파일을 만들어놓으면 그걸 인수로써 읽어버리게 되고!!

게다가?

`shell.sh`에 `chmod +s /bin/bash`를 걸어서 SUID 비트 즉 누가 실행하든 그 파일 소유자 권한으로 돌게 만들어서, 근데 이제 그 소유자가 root니까?

`-rwxr-xr-x`에서 `-rwsr-xr-x`가 되어버린!!

![cron](https://github.com/user-attachments/assets/9e935f74-9028-457d-88d2-24cb9e77b73d#.png)

cron을 기다리면 이렇게 되고 있다가

![cron](https://github.com/user-attachments/assets/38459260-7bc1-4590-a7b1-a2a6b77b9f0a#.png)

cron이 되고 나면?

짜잔 이렇게 빨간 색으로! 쓸 수 있게 되고, 우리는 `-p`옵션을 넣어 권한을 벗기지 않고 플래그를 획득할 수 있었다!

![didit](https://github.com/user-attachments/assets/a50ea7fe-0e28-4d23-8742-00df36592dee#.png)

이렇게!!

![빠밤](https://github.com/user-attachments/assets/abfdb1ba-3c9e-4058-ae0b-3793f78bab2b#.png)

그리고 일단은 OSCP 공부 중이니까...

![이것도](https://github.com/user-attachments/assets/98f3ce22-8cd4-4751-a01b-61630ebb3ffb#.png)

뒷처리도...

## 마치며

![2시간](https://github.com/user-attachments/assets/43e40c9b-fb5b-4277-9a93-f604dfedbfc9#.png)

난 어쩌면 지금은 좀 공부를 하는 입장이라서 그런지 자꾸만 뭔가 이유를 찾게 된다

`이유`가 없는데 왜 이 취약점을 써? 라는 느낌이랄까?

어쩌면 오히려 그렇다보니 이번엔 찾았던 mraiadb에서 찾은 그 비밀번호를 어떻게든 해시 크래킹 하려고 해서 래빗홀에 빠지기도 했었던...

이번엔 좀 많이 내가 잘못 들어가기도 했고, 그 과정에서 hashcracking이라던가 하는 고민도 하면서 여기 저기 돌아다니게 되서 아무래도 2배가 넘는 시간이 걸렸다.

일단 아직 포기 못 한 RedEye 문제를 풀어보고 있기는 한데 고것은 할 수 있을지는..?

Try harder!!

그럼 이제 난 OSCP 오늘 일차도 채우러!!