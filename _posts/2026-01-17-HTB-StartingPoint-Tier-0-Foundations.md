---
title: "[HTB] StartingPoint - Foundations 문제 풀이 모음"
date: 2026-01-17 14:53:00 +09:00
categories: [hacking, saturnx operators, Linux, Windows, Very Easy]
tags: [Hack The Box]
---

## 시작에 앞서

생각해보니까 나는 가장 기본적인 Writeup이 있는 문제들이 아니라 바로 Machines로 달려들어갔다는 것을 깨닫고 이번에 동아리에서 스터디 매니저로 진행하는 겸 한번 `Starting Point`에 있는 문제들을 풀어보고자 한다.

근데 여기도 VIP 머신들이 있어 일단은 Free 머신들만 푸는걸로.

|이름|난이도|OS|Link|
|:--:|:--:|:--:|:--:|
|Meow|Very Easy|Linux|[Link](https://app.hackthebox.com/machines/Meow)|
|Fawn|Very Easy|Linux|[Link](https://app.hackthebox.com/machines/Fawn)|
|Dancing|Very Easy|Window|[Link](https://app.hackthebox.com/machines/Dancing)|
|Redeemer|Very Easy|Linux|[Link](https://app.hackthebox.com/machines/Redeemer)|


## Meow (Linux)

![Meow](https://github.com/user-attachments/assets/a222670e-d5da-4600-a3ec-b328db15a331)

일단 모든 과정은 

- 정찰 및 정보 수집
- 초기 침투
- 권한 상승

의 순서로 진행하게 된다.

### 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap](https://github.com/user-attachments/assets/2481dbfe-3d8c-415d-be72-94701f7e9efb)

nmap 결과 telnet이 열려있음을 확인했다.

### 초기 침투 (Initial Foothold / Exploitation)

![telnet](https://github.com/user-attachments/assets/48c7a4c0-fbd4-4525-8151-cfbc09983af8)

telnet에 `admin`, `administrator`, `root` 등으로 로그인을 시도했고 바로 관리자(root)계정을 습득하는데 성공했다.

### 권한 상승 (Privilege Escalation) 

할 것도 없이 바로 root 습득

이번 문제는 `Weak Credentials(취약한 자격 증명)`, `Misconfiguration(설정 오류 _ 비밀번호 없음)` 의 취약점이라고 볼 수 있겠다.

## Fawn (Linux)

![Fawn](https://github.com/user-attachments/assets/cba0ccb4-17ed-4d2c-a9d4-50e92a8111d8)

바로 시작

### 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![Fawn nmap re](https://github.com/user-attachments/assets/a1f6e0b3-c41f-4aee-856e-1c1ca99b3e44)

nmap 스캔 결과 21번 포트에 FTP 서비스(vsftpd 3.0.3)이 실행 중임을 알 수 있다.

거기다 `Anonymous FTP login allowed`를 보면 알 수 있듯 비밀번호 없이 `anonymous`로 로그인 할 수 있고 게다가 비밀번호 없이 접속 가능하다고 한다.

### 초기 침투 (Initial Foothold / Exploitation)

![ftp](https://github.com/user-attachments/assets/ee237a2c-0004-4c3a-b078-32a0cd58d60c)

FTP 접속 성공 및 파일을 바로 읽을 수 없음으로 FTP의 명령어인 get을 이용해 다운로드 받으면 된다.

### 권한 상승 (Privilege Escalation)

이번 문제는 유저 획득이나 계정 탈취 과정이 없다.

## Dancing (Window)

![Dancing](https://github.com/user-attachments/assets/dd902bdb-327d-4ef5-9ba2-887d5b29f702)

이번 문제는 지금까지와는 다른 Window 머신이다.

### 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![Dancing nmap](https://github.com/user-attachments/assets/458564b1-99f2-4389-bcee-cc7857bb0dc2)

딱 봐도 리눅스랑 차이가 많이 보이는데 

자세한 내용들은 인터넷에 찾아보거나 [호롱불 고양이/HTB Fluffy](https://oil-lamp-cat.github.io/posts/SaturnX-Operators_HTB_Fluffy/)에 정리해 놓은 부분을 참고하면 된다.

### 초기 침투 (Initial Foothold / Exploitation)

일단 이번에 우리가 볼 부분은 `microsoft-ds`로 이 친구를 통해 윈도우에서 `SMB`프로토콜이 실행중임을 알 수 있다.

![SMB 접속](https://github.com/user-attachments/assets/474fefe4-5ca6-4743-8d1d-e77ffe2a2b15)

`smbclient -L <IP>`를 통해 접속을 시도해보면 비밀번호를 물어보는데 우린 모르니까. 그냥 엔터를 눌러주자.

그럼 위처럼 `ADMIN$`, `C$`, `IPC$`, `WorkShares`라고 하는 4개의 공유 폴더를 볼 수 있다.

![smb 파일 접속](https://github.com/user-attachments/assets/1a699860-03fa-41d4-a1d0-1af231790fcc)

그리고 `smbclient` 명령어를 통해 파일들에 접속을 시도하면 위처럼 `ADMIN$`과 `C$`는 접속이 불가능하나 `IPC$`나 `WorkShares`에는 무리없이 접속이 가능하다는 것을 알 수 있다.

참고로 여기서 `\\\\`를 4개나 쓴 이유라면 리눅스 터미널에서 `\`를 쓰기 위해선 `\\`으로 입력해야 `\`가 되기 때문이다. 마치 마크다운처럼.

![no file](https://github.com/user-attachments/assets/9b52fb97-6c14-4721-aa8b-901df400f6bc)

하지만 `IPC$`에는 파일이 없고

![work](https://github.com/user-attachments/assets/f71c799f-3fed-4bae-82d3-4be922440148)

여기엔 두 사용자가 있다.

![Amy](https://github.com/user-attachments/assets/be45c654-5ab1-48c9-8bd3-4a5f68e4e05f)

Amy.J에는 worknotes가 존재하고

![James](https://github.com/user-attachments/assets/3a02f73d-4fa1-4109-808c-633ff97fc8e7)

James.P 에는 찾는 플래그가 존재한다.

![다운받은 것들](https://github.com/user-attachments/assets/8c488ce8-0392-4c1a-ac10-a3a854144c95)

보아하니 진짜 일해야 하는 것들에 대한 내용이였다.

### 권한 상승 (Privilege Escalation)

![Dancing Pwned](https://github.com/user-attachments/assets/61abe9a7-a032-49ba-9755-0c68ea7a35c5)

![Dancing has been Pwned](https://labs.hackthebox.com/achievement/machine/988787/395)

이번 문제는 `SMB Share Misconfiguration` 즉 `SMB 공유 설정 오류`라고 볼 수 있겠다.

## Redeemer (Linux)

![Redeemer](https://github.com/user-attachments/assets/a2b9abf7-308e-4bc0-826b-be7d06a29573)

이번엔 다시 리눅스 문제.

### 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![어](https://github.com/user-attachments/assets/a9381c9b-144d-463a-bbc1-a85f973e93b4)

어..? 머선일이고.

![좀더 넓게](https://github.com/user-attachments/assets/a8ef3174-31bf-4d50-9c08-d5b903edf919)

좀 더 넓게 스캔을 진행하니 무려 `6379`번 포트가 열려있음을 확인했다.

그리고 그 안에는 `Redis 5.0.7` 버전이 실행되고 있다는 것을 알게 되었다.

[Redis란? 특징부터 사용법까지, 제대로 활용하기 / ELANCER](https://www.elancer.co.kr/blog/detail/768)

위 블로그를 통해 redis에 대해 간단히 이해하고, 다음으로 진행하자.

### 초기 침투 (Initial Foothold / Exploitation)

![connect to redis](https://github.com/user-attachments/assets/8d8dd0ae-b83a-46a2-9dad-d41ef29d0b2b)

`redis-cli -h <ip>`를 통해 원격 서버에 접속이 가능하고 성공했다면 위처럼 나올 것이다.

![info](https://github.com/user-attachments/assets/235df38a-0923-4e9e-bd77-f012643f454d)

`info` 명령어를 입력해 출력된 정보를 쭉 읽어보면

`# Keyspace`에 `db0:keys=4`를 볼 수 있다.

0번 데이터베이스에 4개의 키가 저장되어있다고 하니 `select 0`을 입력해 0번 데이터베이스를 선택하자.

![select dB](https://github.com/user-attachments/assets/c3bb1870-0e11-443f-a80c-3a785e8aa84e)

위와같이 `keys *` 명령어를 통해 존재하는 키들을 살펴볼 수 있고 `get` 명령어로 마치 `cat`으로 읽듯 읽어볼 수 있다.

### 권한 상승 (Privilege Escalation)

![참 쉽죠](https://github.com/user-attachments/assets/744150f0-4fcf-4533-bbca-5d7696dbfcc5)

참 쉽죠?

Redeemer의 경우 원래 `Redis`는 보통 신뢰할 수 있는 내부 네트워크에서만 접근하도록 설계되어있다만 이번처럼 비밀번호도 없는데다 외부에서 찾아 접속 가능했기에 발생한 문제라고 볼 수 있겠다.

[Redeemer has been Pwned](https://labs.hackthebox.com/achievement/machine/988787/472)

## 마치며

![end foundations](https://github.com/user-attachments/assets/f740e7e4-4d17-4160-996b-77b7da89e4fa)

보통의 문제와는 좀 다르게 되게 쉽게 만들어져있다보니 아무래도 `초기 침투`, `권한 상승`의 부분이 전혀 없는 난이도의 문제이긴 하다.

일단 아직 진행도는 56%이지만 무료 사용자가 할 수 있는 문제는 다 풀었다고 볼 수 있겠다.

그럼 다음번엔 **Tier 1 - Fundamental Exploitation**으로 넘어가 문제를 풀어보자.