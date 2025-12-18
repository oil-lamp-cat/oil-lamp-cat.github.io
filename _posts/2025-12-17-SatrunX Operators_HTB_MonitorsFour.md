---
title: "[HTB] MonitorsFour (Easy_Windows)"
date: 2025-12-17 19:25:43 +09:00
categories: [hacking, saturnx operators, Windows]
tags: [Hack The Box]
pin: true
password: "password"
---

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

추가적으로 나는 도메인이나 서브도메인에 대한 지식이 없다보니 이 기회에 아예 위 자료들을 참고하며 좀 더 알아보고 진행하였다.

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

## 마치며