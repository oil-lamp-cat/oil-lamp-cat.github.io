---
title: "[HTB] Garfield (Hard_Windows)"
date: 2026-04-13 17:29:00 +09:00
categories: [hacking, RedLabs, Windows, Active Directory]
tags: [Hack The Box, Hard]
pin: true
password: "20260413"
---

> 발표 자료 만들다가 key list attack이 될 수가 없는데 되기에 스크린샷을 다시 확인하니 powerview 부분을 안 썼더라...

[Congratulations OilLampCat! You are player #2312 to have solved Garfield.](https://labs.hackthebox.com/achievement/machine/988787/862)

## 1. 시작에 앞서

![Garfield](https://github.com/user-attachments/assets/d77b9fab-85d9-488c-aa66-53eaceeec664)

오랜만에 돌아온 Windows 문제. 이번 시즌 문제에 나오기도 했고 이번 시즌엔 한번 점수를 얻어볼까? 싶은 마음에 바로 머리부터 박고 시작한 문제였다.

![season](https://github.com/user-attachments/assets/45d59b0b-9b1e-4d06-84ce-077b7713a757)

다만 이걸 3일 전에 풀기 시작해, 어제까지는 점수를 얻을 수 있었는데 오늘은 마침 딱 linux 문제로 바뀌더라. 쩝.. 그래서 첫날 풀었던 userflag 점수를 얻어서 첨으로 bronze에는 발을 들여봤다.

거진 3일동안 진짜 하루 종일 붇들고 있으면서 여기 저기 찾아다니고 인공지능과 사바사바 하면서 간신히 풀었기에 나 또한 이 글을 작성하며 Writeup이지만 공부 정리의 형식처럼 작성하게 될 듯 싶다. 그리고 딱 보아하니 이거 정리 자체도 오래 걸릴지도?

## 2. 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![문제](https://github.com/user-attachments/assets/aacc01d3-2c27-4994-b100-521d902f9882)

문제를 보니 전에 풀었던 TombWatcher 문제가 떠오르는 계정 정보다.

일단 계정 정보를 주었으니 이번엔 AD 문제가 되려나?

![nmap1](https://github.com/user-attachments/assets/9d8c315e-e6ab-4957-aa72-3270d1509cc2)

일단 바로 nmap을 돌려보았다. 뭐.. 이번 머신이 웹 페이지가 있는지도 모르고 smb나 ssh 열려있는지도 모르는데 할 수있는 방법이 이것 밖에 없지 머.

보아하니 도메인 네임은 `garfield.htb`, `DC01.garfield.htb`이고 `135/rpc`나 `389/ldap` 등이 보인다.

![etchosts](https://github.com/user-attachments/assets/a32656e2-f1e0-47c5-ab23-ef180eecc7ee)

바로 도메인 추가해주자.

### 2-1. SMB 둘러보기

![smb](https://github.com/user-attachments/assets/03a1449d-c6ac-4abc-965a-e8d1dd87ccf4)

smb가 열려있다고 하였으니 `nxc` 명령어를 이용해 공유 폴더 스캔을 진행하니 `IPC$`, `NETLOGON`, `SYSVOL` 폴더에 `READ` 권한이 있는걸 알 수 있었다. 근데 씁.. 하필 READ네 읽을 수만 있다니..

다만 옆의 **Remark(비고)** 를 보니 이전과는 다른 것이 보인다. `Logon Server share`

이것은 AD 환경의 도메인 컨트롤러가 설정해두어 각 PC에게 출근해서 처음 로그인 할 때 설정할 파일이나 스크립트 등을 다운로드 해가는 전용 폴더다. 직원 누구나 읽을 수 있어야 하기에 일반 계정인 `j.arbuckle`에게도 기본적으로 READ 권한이 있던 샘이다.

- `NETLOGON` : 사용자가 로그인 할 때 실행되어야 하는 로그인 스크립트 등이 저장되는 폴더
- `SYSVOL` : 도메인의 그룹 정책(GPO) 전체가 저장된 폴더

근데 결국엔 다들 READ 폴더라 뭔가 스크립트를 주입하거나 하는건 안되겠네? 하는 생각이 들었다.

![smbmap](https://github.com/user-attachments/assets/b2a8d1f8-e9c0-484e-bb16-0d8c7fc16fe5)

추가로 혹시 해서 `smbmap`을 돌려봤지만 결국 같은 결과가 나왔다.

![users](https://github.com/user-attachments/assets/e22ab85f-ea17-4474-8725-1ebfa44ccda9)

유저를 열거해보니 지금 갖고있는 `j.arbuckle` 말고도 `l.wilson`이 존재하는 것을 알 수 있다.

![sysvol](https://github.com/user-attachments/assets/92602efe-b904-48b7-9061-fd617ed1f77a)

일단하나씩 들어가 보기로 했다. 혹시라도 중요한 파일이 있을 수도 있잖아? 

일단 `SYSVOL`에는 `garfield.htb`라는 파일이,

![IPC](https://github.com/user-attachments/assets/932e9795-49c7-43e8-870c-aa2d19e0f187)

`IPC$`에는 아무것도 없고,

![NETLOGON](https://github.com/user-attachments/assets/30568079-0be1-4637-a098-2ea3a079b1ae)

`NETLOGON`에는 `printerDetect.bat`가 있었다.

![sysvolall](https://github.com/user-attachments/assets/beb22cff-b3d6-465a-a0d0-e8043744abc2)

그런데 sysvol 폴더에 있는걸 하나씩 뒤지기 귀찮아서 그냥 통째로 다운받았다.

![pinter](https://github.com/user-attachments/assets/d54721ce-4d28-48b8-b89d-eef45feec469)

보아하니 `printerDetect.bat`는 처음 컴터 켜지면서 회사 프린터 연결하는 친구인듯 하고,

![garfield](https://github.com/user-attachments/assets/b12cd41f-144e-4ca1-9f87-c32fd107d661)

`garfield` 폴터 안에는 어우.. 뭐가 많았다. 그런데 동일하게도 script 폴더 안에 같은 `printerDetect.bat`가 들어있더라.

후에 공부하면서 혹시 생각한 내용인데

- `SYSVOL` -> C:\Windows\SYSVOL\sysvol\
- `NETLOGON` -> C:\Windows\SYSVOL\sysvol\garfield.htb\scripts\

였던건 아닐까?

[도메인에서 SYSVOL 트리 및 해당 콘텐츠를 다시 빌드하는 방법](https://learn.microsoft.com/ko-kr/troubleshoot/windows-server/group-policy/rebuild-sysvol-tree-and-content-in-a-domain)

거의 비슷했다.

공식 문서에 의하면 물리적인 실제 경로는 맞긴 한데 SMB 공유로 접근을 하게 되면

- `SYSVOL` -> C:\Windows\SYSVOL\sysvol\ <- Junction Point
- `NETLOGON` -> C:\Windows\SYSVOL\sysvol\garfield.htb\scripts\

이런 식이였다고 한다. 구조를 보자면

```
C:\Windows\SYSVOL\
├── domain\                    <- 실제 데이터 저장
│   ├── scripts\               <- printerDetect.bat 여기!
│   └── Policies\
└── sysvol\                    <- Junction Point
    └── garfield.htb\          <- SMB로 접근 시 이 경로
        ├── scripts\           <- \\DC01\SYSVOL\garfield.htb\scripts\
        └── Policies\

SMB 공유:
\\DC01\SYSVOL   -> C:\Windows\SYSVOL\sysvol\
\\DC01\NETLOGON -> C:\Windows\SYSVOL\sysvol\garfield.htb\scripts\
```

이렇게 되겠다.

![혹시](https://github.com/user-attachments/assets/66591090-a3f0-4894-9b2b-1613bcc3be15)

혹시 다른 파일들에 중요한 내용이 있지 않을까 하여 더 찾아봤으나 딱히 보이는내용은 없었다.

![smbcacls](https://github.com/user-attachments/assets/aac79810-df82-4f03-a6a0-1fd60238595b)

그렇다보니 도대체 내가 그럼 뭘 할 수 있는거지? 싶은 생각에 여기 저기 다 찔러보다 마지막으로 클로드 선생님께서 알려준 `smbcacls`라는 도구를 돌려봤고 그 결과 `RWXD`권한이 걸려있는 `IT Support` 라는 그룹을 발견할 수 있었다.

그렇다면 우리 `j.arbuckle`씨가 과연 이 IT support 에 있는지 아니면 다른 공격 벡터를 찾아야 하는지 확이해봐야겠지?

> 참고로 RWXD란? Read, Write, Execute, Delete

### 2-2. Bloodhound 스캔하기

![bloodhoundce](https://github.com/user-attachments/assets/d2b8401e-9dc1-4163-ac57-9ef99b63bdd1)

참고로 default로 kali에 설치되는 bloodhound-python의 버전은 레거시이기에 추가로 ce 버전을 설치해야 neo4j 버전과 맞게 된다. 근데 난 사실 이걸 하기 전에 레거시 버전으로 했다가 공격 경로가 안보여서 뭐지 싶어 ce로 변경했다는 이야기...

~~근데 버전 이슈가 아니였다 ㅎ~~

![bloodhound1](https://github.com/user-attachments/assets/d5ddfd3b-d06c-4181-900c-f0f44500768f)

하여튼 시간 설정도 해주고 성공적으로 스캔을 마쳤다면 bloodhound를 실행시켜주자.

![bloodhound2](https://github.com/user-attachments/assets/e6176f4a-4289-4706-9c00-f6c7c08804cb)

기본 비밀번호는 kali가 아니라 admin이다.

![bloodhound3](https://github.com/user-attachments/assets/fb89fff8-e85f-4b17-a563-9590ec4c064c)

로그인 성공 후에 파일을 모두 넣고 나면 위 이미지처럼 complete가 뜰 때 까지 기다려주자.

![bloodhoundsetting](https://github.com/user-attachments/assets/82ed9c6d-26e6-4af5-9b71-f5f0ea0ad5d7)

참고로 난 wsl에서 bloodhound를 쓰다보니 외부로 빼내기 위해 `/etc/bhapi/bhapi.json` 부분의 `bind_addr`을 `0.0.0.0`으로 설정해주었다. 이후 윈도우에서 `localhost:8080`으로 접속하면 된다.

![jarbuckle](https://github.com/user-attachments/assets/53ea38e2-0416-417c-b520-4ca27342405c)

일단 기본적으로 현재 갖고 있는 계정의 주변을 살펴보니 역시나 `IT SUPPORT`의 그룹에 속해있었다.

그렇다는건 SYSVOL의 파일을 편집할 수 있다는 이야기!

![RPC](https://github.com/user-attachments/assets/56474b91-b3b5-43a6-8461-dbadd7022932)

그렇다면 다음 우리가 결국 갖고자 하는 타겟이 누구일까 하니 `RPC`에 권한이 있는 `Remote Desktop` 그룹에 `L.Wilson`, `L.Wilson ADM`이 있다는걸 확인할 수 있었다.

근데 그래도 결국 내가(j.arbuckle) `Liz Wilson`에 접근하는 방법이 없는데? 싶었다.

![reverse](https://github.com/user-attachments/assets/76036b4f-54ff-4a0f-ace0-5632c538646f)

다만 내 계정(j.arbuckle)이 IT Support 그룹에 속해있게 되었고 직원들이 회사 출근해서 접속하는 `SYSVOL\scripts` 폴더에 파일을 쓸 수 있는 권한이 있다는 것을 알아냈다.

그러니 이제 우리의 다음 타겟인 `L.Wilson`의 AD 객체 속성을 마음대로 수정할 수 있는 권한을 갖고있다는 좋은 소식을 얻은 것이기에,

SYSVOL 스크립트 폴더에 리버스 쉘을 심어두고 L.wilson의 계정 설정에 들어가서 로그인 할 때마다 이 리버스쉘 스크립트를 실행해! 라고 강제 지정해버리자.

그럼 이제 찾을 만큼 찾았는데 초기 침투를 진행해볼까?

## 3. 초기 침투 (Initial Foothold / Exploitation)

![printerdetect](https://github.com/user-attachments/assets/a6900275-4004-4462-9d82-bedd08e22826)

일단 리버스 쉘을 만들기 위해 기존 스크립트는 어찌 되어있나 보니 `.bat` 형식으로 되어 자동으로 프린터에 연결될 수 있는 스크립트였다.

![reverse](https://github.com/user-attachments/assets/76036b4f-54ff-4a0f-ace0-5632c538646f)

고로 [revshells](https://www.revshells.com/)에서 powershell용 그것도 base64 인코딩된 코드를 찾아 복사해주자.

![put](https://github.com/user-attachments/assets/21d91d1f-ff6a-43b5-b0ec-67ed30860d9f)

이후 `smbclient`로 `SYSVOL`에 접속해 printerDetect.bat 파일을 미리 만들어둔 리버스 쉘로 바꿔치기 해버리자.

그리고 리스너를 켜준 후 `bloodyAD -u 'j.arbuckle' -p 'Th1sD4mnC4t!@1978' --host 10.129.28.86 set object "CN=Liz Wilson,CN=Users,DC=garfield,DC=htb" scriptPath -v printerDetect.bat` 명령어를 통해 다른 유저가 아니라 Liz Wilson 유저가 printerDetect.bat 파일을 읽게 만들어버리면?

위 이미지처럼 리버스 쉘을 받을 수 있다.

### 3-1. 그런데 왜 굳이 Liz Wilson? ADM이 아니라?

[[Active Directory] 3장. AD 기본 계정과 권한
출처: https://mokpo.tistory.com/767 [MSS:티스토리]](https://mokpo.tistory.com/767)

그런데 어째서 `Liz Wilson`의 계정에 리버스 쉘을 걸은걸까? 바로 `Liz Wilson ADM(관리자 계정)`에 리버스 쉘을 걸 수 있다면 되는게 아닐까? 하는 생각이 든다.

![bloodhoundcegogetmachine](https://github.com/user-attachments/assets/179b4a4a-a2e7-4ce7-8b0e-1153d537613a)

게다가 bloodhound의 cypher 쿼리 중 `shortest path to`로 검색해 보았을 때 처음 갖고있는 `l.Wilson` 계정이나 `l.Wilson ADM`에도 접근할 수 없는 상황이었다. 근데 딱 보아하니 뭔가 관리자를 얻고 하려면 최종적으로 `KRBTGT_8245`를 취득하거나 이용해서 커버로스팅 티켓을 얻어야 할 듯한 느낌?

다만 공식 문서나 여기저기 찾아다녀보았을 때 적어도 난 다음과 같이 생각했다.

`l.wilson_adm`은 이름에서 알 수 있듯 관리자 권한을 가진 보호된 계정(Protected Account)이다. AD 환경에서는 이런 고위급 계정들을 보호하기 위해 `AdminSDHolder 메커니즘`과 `SDProp 프로세스`가 60분마다 권한(ACL)을 초기화해 버린다. 즉, 하위 그룹인 IT Support가 설령 이 계정의 설정을 바꾸고 싶어도 시스템 원천적으로 'Access Denied'가 뜨며 차단된다. 그렇기 때문에 우리는 권한 보호의 사각지대에 있는 일반 계정 `l.wilson`을 먼저 장악하여 징검다리로 써야만 했다.

그러나 일단은 공식 문서에 딱 adm은 scriptPath를 쓸 수 없다! 라고 명시해 놓은건 아니라서 다만 내 생각일 뿐이다.  

![password force change](https://github.com/user-attachments/assets/0ab3488c-b47d-4538-9110-8c1371235b93)

그럼 이제 리버스 쉘을 통해 `l.wilson`의 계정에 접속 성공했고 bloodhound에서 보았듯 이 계정은 `l.wilson_adm`에 대해 `passwordForcechange` 권한이 있으므로 비밀번호를 `Hithere!`로 초기화 해준 뒤 `evil-winrm`을 통해 접속하면?

![userget](https://github.com/user-attachments/assets/b49756b9-3acc-47e3-a9e2-27c48bda49da)

`l.wilson_adm`까지 얻고 user 플래그 까지 얻는데 성공했다.

## 4. 권한 상승 (Privilege Escalation) 

![bloodhoundRODC01](https://github.com/user-attachments/assets/4d19a7aa-ff0f-4d0d-b24f-d4ee4571beb4)

이제 권한 상승으로 넘어가기 전에 잠시 bloodhound를 보자. 우리의 최종적인 목표는 이 머신 즉 `DC01`을 탈취하는거다. 그런데 그러기 위해 `KRBTGT_8245`를 얻어야 하는데 어째 그 앞에 `RODC01`이 있네?

그럼 도대체 이 녀석은 뭘까? 그동안 easy나 medium 문제를 풀 때에는 못 본 친구인데? 어쩌면 공격 과정에 없어서 기억을 못하는 것일 수도..

### 4-1. RODC (Read-Only Domain Controller)

RODC는 말 그대로 **'읽기 전용 도메인 컨트롤러'** 다.
보통 물리적인 보안이 취약한 `지사` 같은 곳에 설치하는 서버로 만약 도둑이 지사에 침입해서 이 서버를 통째로 훔쳐 가더라도 도메인 전체가 털리지 않도록, 데이터를 수정할 수도 없고, 원칙적으로 직원들의 비밀번호 해시도 저장(캐싱)하지 않는 아주 제한적인 역할만 수행하는 서버다.

그리고 우리의 목적은 바로 이 RODC01을 장악한 뒤, 이 서버가 가지고 있는 고유의 열쇠(krbtgt 마스터 키)를 빼내서 본섭을 속이는 것이다. 그렇다면 이 RODC01은 어떻게 장악할 수 있을까?

![bloodhoundwriteaccountrestrictions](https://github.com/user-attachments/assets/df9e3ac9-f842-43dc-a487-48fa562baac4)

잠시 bloodhound로 돌아가보자. 내 계정에서 RODC01으로 통하는 하나의 권한을 확인할 수 있다. 바로 `WriteAccountRestrictions` 권한이다.

이 권한은 Active Directory에서 아주 큰 의미를 가진다. 특정 컴퓨터 객체(RODC01)의 **msDS-AllowedToActOnBehalfOfOtherIdentity**라는 속성을 내 마음대로 수정할 수 있다는 뜻이기 때문이다.

이 속성이 무엇이냐고? 쉽게 말해 **"이 컴퓨터(RODC01)에 접속할 때, 다른 사람의 신분증을 대신 내밀어도 허락해 줄게!"라는 '대리인 위임장'** 이다.

해커의 시선에서 이 상황을 정리하면 완벽한 공격 시나리오가 나온다.

"내가 RODC01의 위임장을 쓸 수 있네? 그럼 가짜 컴퓨터(대리인)를 하나 만들고, 그 가짜 컴퓨터가 최고 관리자(Administrator)인 척 위장해서 RODC01에 들어가게 만들면 되겠다!"

그리고 이것이 AD해킹에서 **'RBCD (Resource-Based Constrained Delegation, 자원 기반 제한적 위임)'** 라고 불리는 공격이다.

자 그럼 어떻게 뚫고나갈지도 알아냈으니 진행을 다시 해볼까?

### 4-2. RBCD (Resource-Based Constrained Delegation, 자원 기반 제한적 위임)

![RBCD](https://github.com/user-attachments/assets/ae8ea5b8-3381-43e1-92b6-e4e83901c4f6)

> 여기부턴 다시 문제를 풀게될까 싶어 코드도 넣어본다.

**1. 가짜 컴퓨터(Machine Account) 생성**

```shell
impacket-addcomputer -computer-name 'ATTACKSYS$' -computer-pass 'Hithere!' -dc-ip 10.129.28.86 'garfield.htb/l.wilson_adm:Hithere!'
```

AD 환경에서는 `일반 사용자 계정(이번엔 l.wilson_adm)`만 있으면 누구나 도메인에 새로운 '컴퓨터 계정'을 최대 10개까지 만들 수 있다. `찾아보니 MachineAccountQuota 취약점 라고도 불린다더라`. 그래서 우리는 `ATTACKSYS$`라는 이름의 가짜 컴퓨터 계정을 우리 마음대로 만들 수 있었다.

**2. RODC01에 RBCD 권한 부여 (가짜 위임장 작성)**

```shell
impacket-rbcd -delegate-from 'ATTACKSYS$' -delegate-to 'RODC01$' -action 'write' -dc-ip 10.129.28.86 'garfield.htb/l.wilson_adm:Hithere!'
```

여기가 RBCD 공격의 핵심이다. `l.wilson_adm` 계정은 RODC01 서버를 관리할 수 있는 권한이 있기에 이 권한을 악용해서, RODC01의 설정 장부에 **"앞으로 ATTACKSYS$ 컴퓨터가 누구의 이름표를 달고 오든 다 믿어줘!"** 라고 허가증(위임장)을 강제로 써버렸다.

**3. 최고 관리자(Administrator) 위장 티켓 발급**

```shell
impacket-getST -spn 'cifs/RODC01.garfield.htb' -impersonate 'Administrator' -dc-ip 10.129.28.86 'garfield.htb/ATTACKSYS$:Hithere!'
```

이제 우리가 만든 `가짜 컴퓨터(ATTACKSYS$)`의 자격으로 AD 서버(DC01)에게 찾아가서 **"나 RODC01한테 갈 건데, 최고 관리자(Administrator) 자격으로 접속할 수 있는 티켓(Service Ticket) 좀 끊어줘. 쟤가 나 믿는다고 허락했어!"** 라고 요청을 보내버리면?

AD 서버는 아까 조작해 둔 허가증을 보고 깜빡 속아서, 최고 관리자 권한이 담긴 티켓을 `Administrator@cifs_RODC01...ccache` 라는 파일로 발급해 주게 됩니다.

다만 여기서 해깔리면 안 된다. 우리는 `RODC01` 서버의 최고 관리자 행세만 할 수 있을 뿐 `DC01` 에는 접속할 수 없다는 것! 위에서 말한 최고 관리자라는게 DC01이 아닌 RODC01의 관리자라는 뜻이니 말이다.

### 4-3. Chisel을 쓰게된 이유

그럼 이제 위조 티켓도 만들었으니 `RODC01`에 들어가기만 하면 되겠지? 라고 생각했었다.

그런데 `/etc/hosts`에 RODC01을 추가하던 어떻게든 접속을 시도해도 여전히 접근 불가라며 오류만 띄울 뿐이었다.

이제야 **'어.. 뭔가 다른 네트워크에 있는건가?'** 하는 생각에  이미 확보해 둔 본섭(DC01)의 `l.wilson_adm 쉘(Evil-WinRM)` 내부에서 네트워크 구조를 스캔해 보기로 했다.

![RODC01insidenetwork](https://github.com/user-attachments/assets/162ea101-99af-4384-985f-c1dd50c4fce2)

l.wilson_adm 쉘에서 `ipconfig`를 쳐보니, 본섭(DC01)에는 우리가 칼리로 접속했던 **외부망 IP(10.129.x.x)** 외에도 **192.168.100.1** 이라는 **내부망(vEthernet)** 어댑터가 하나 더 존재했다.

그렇기에 혹시 하는 마음에 `ping RODC01`과 `nslookup RODC01.garfield.htb`를 쳐보니, RODC01의 IP 주소가 192.168.100.2로 떴다!

그러니까 지금 내 hackthebox vpn으로 연결된 외부망은 DC01이 맞지만 정작 지금 뚫고가야하는 RODC01은 외부에서 ping조차 날릴 수 없는 상태였던거다.

그렇기에 내가 이미 장악한 PC를 중계기 삼아 더 깊숙한 내부망으로 넘어갈 수 있는 **'터널링(Tunneling)'**을 진행하기로 했다.

그리고 이 때 사용할 도구를 다른 이미지에서도 여러번 나왔던 `Chisel`을 이용하기로 했다.

![chisel밀반입](https://github.com/user-attachments/assets/5cb8cbc2-cd5d-453e-870f-3ccd677e1279)

chisel을 l.wilson_adm에 넣기 위해 칼리에 설치해준 후 `wget` 명령어를 통해 옮겨와줬다.

![startchisel](https://github.com/user-attachments/assets/44232d96-ce6f-424c-bfb8-1a68c21481b6)

이제 칼리 리눅스에서 Chisel 서버를 열고, 본섭(DC01)에서 칼리 리눅스로 역방향 접속(Reverse Connection)을 맺어 터널을 뚫어준다.
이렇게 터널이 연결되면, 내 칼리 리눅스의 특정 포트로 보내는 모든 공격 패킷은 DC01이라는 중계기를 타고 192.168.100.2(RODC01)로 고스란히 전달(포워딩)된다.

이때 주의할 점은 저 쉘들을 끄면 안된다는 것. 아마 더 좋은 방법이 있지 않았을까 싶긴 한데 난 이렇게 진행했었다.

### 4-4. Proxychain을 이용해 다시 RODC에 접속해보자

![proxynotwork](https://github.com/user-attachments/assets/29c70cdc-0f13-499b-bd94-2ad1e869067b)

```shell
KRB5CCNAME='Administrator@cifs_RODC01...ccache' proxychains impacket-psexec -k -no-pass garfield.htb/Administrator@RODC01.garfield.htb -dc-ip 192.168.100.1 -target-ip 192.168.100.2
```

그리고 이제 RODC01에 접속하기 위해 `impacket-psexec`을 이용했다. 하지만 그냥 쓴다면 아까와 같이 또 오류가 발생할 것이기에 이번엔 chisel이 연결된 `proxychain`을 이용했더니?

어라? 어째서 또 오류가?

툴이 아직도 터널 입구를 찾지 못하고 빙빙 돌다가 뻗어버렸다!

그래도 다행이 오류 메시지를 자세히 살펴보면 힌트가 있다. 127.0.0.1:9050으로 연결을 시도하다가 타임아웃이 났다는 것.

나는 분명히 chisel을 열 때 `proxy#R:127.0.0.1:1080=>socks: Listening` 즉 1080번 포트로 열어줬는데 내 칼리의 프록시는 **9050(Tor 네트워크 기본 포트)** 으로 설정되어 있었다.

뭐.. 그냥 진행하고자 한다면 chisel을 열 때 다시 설정해주면 되겠지만 나는 설정을 바꿔주기로 했다.

![port](https://github.com/user-attachments/assets/a8adcce2-846f-40f5-a61d-9ef780713c83)

`/etc/proxychains4.conf`의 맨 아래줄 tor를 위한 9050번 포트 줄을 주석처리하고 1080번 포트를 새로 추가해주자.

![after proxy](https://github.com/user-attachments/assets/31a79e2b-8e9c-4a4d-9154-efae541e021b)

설정을 정확히 했다면 다시 연결을 시도했을 때 위처럼 드디어! 티켓을 이용해 **RODC01(192.168.100.2) 서버의 시스템 권한**을 얻는데 성공했다!

다만 아직도 이건 최종 **DC01**을 얻기 위한! **krbtgt**해시를 얻기 위한! 준비일 뿐이다.

자 아직 갈 길이 멀다!

### 4-5. ForceChangePassword를 해도 안되는 이유는?

![bloodhoundwriteaccountrestrictions](https://github.com/user-attachments/assets/df9e3ac9-f842-43dc-a487-48fa562baac4)

그런데 말이다. 분명히 bloodhound에서는 우리의 최종 목적지인 `DC01`을 얻기 위해 `KRBTGT_8245`를 얻기 위해서 RODC01을 통한 `ForceChangePassword`를 진행하라고 했다. 그럼 이 유저를 얻고 나면 끝나는걸까? 라고 생각할 수 있지만 여기서 **매우매우매우** 해깔리면 안되는 부분이 존재한다.

![allusers](https://github.com/user-attachments/assets/cac068f0-6c6c-44ad-b99e-7c91ddc45834)

도메인에 존재하는 모든 유저들을 찍어보았을 때, 이상하게도 `KRBTGT`와 `KRBTGT_8245`가 따로 존재하는 것을 알 수 있다.

즉 우리가 현재 최종 목표로 잡고있는 `KRBTGT_8245`는 DC01(도메인 전체)를 지배하고 있는 진짜 `KRBTGT`가 아니라 `RODC01`에서만 쓸 수 있는 가짜 마스터 키라는 의미다. 게다가 RODC는 읽기 전용이다보니 ForceChangePassword를 진행하려면 [zjorz/Public-AD-Script](https://github.com/zjorz/Public-AD-Scripts/blob/master/Reset-KrbTgt-Password-For-RWDCs-And-RODCs.md)와 같은 스크립트를 사용해 본섭과의 동기화 과정 등을 거쳐서 진행해야한다.

쉽게 이해하려면 다음과 같다.

- **DC01 (본사)** : 도메인 전체를 관리한다. 이 세상의 모든 문을 열 수 있는 `마스터 황금 열쇠(krbtgt)`를 가지고 있다.

- **RODC01 (지점)** : 본사의 허락을 받아 지점을 운영한다. 하지만 도둑이 지점을 털어갈까봐 본사는 지점에게 `마스터 열쇠(krbtgt)`를 주지 않고 `지점 전용 열쇠(krbtgt_8245)`만 줬다.

그렇기에 우린 이 지점 열쇠만으론 본사에 출입할 수가 없는 상황이다.

그럼 도대체 이걸로 뭘 하겠다는걸까?

### 4-6. 이후에 할 작업은?

[커버로스 프로토콜(Kerberos Protocol)이란? [개발자의 길:티스토리]](https://jang8584.tistory.com/309)

[AD(Active Directory) 모의해킹 방법론 [Hack_SMS:Becoming a Hacker]](https://hacksms.tistory.com/346)

[At the Edge of Tier Zero: The Curious Case of the RODC [Elad Shamir]](https://specterops.io/blog/2023/01/25/at-the-edge-of-tier-zero-the-curious-case-of-the-rodc/?source=rss----f05f8696e3cc---4)

[The Hacker Reciepes/kerberos/golden-ticket](https://www.thehacker.recipes/ad/movement/kerberos/forged-tickets/#golden-ticket)

일단은 내가 이해한 내용을 토대로 설명할 것이기에 틀린게 있을 수 있다는 것을 명심하자.

그래도 위 블로그들을 읽고 조사해보니 우리는 다음고 같은 과정을 통해 최종 목적지인 DC01에 도달할 수 있게 된다.

> RODC Golden Ticket (무기 제작)

우리가 훔친 `지점 전용 열쇠 (krbtgt_8245의 AES256 키)`를 이용해서 임의의 유저(Administrator)의 명의로 가짜 TGT(티켓 발급용 티켓)를 만들어내는 행위 자체를 `Golden Ticket`이라고 부르는데...

결국 이 RODC 골든 티켓은 본섭(DC01)에 가져가봤자 **"음, 얘는 지점(RODC01)에서 인증받고 온 애구나"** 정도로만 취급할 뿐이다.

> Key List Attack

그렇기에 위에서 만든 `RODC 골든 티켓`을 들고 본섭(DC01)의 KDC(키 분배 센터)에 찾아가서, **"KERB-KEY-LIST-REQ"** 라는 아주 특수한 프로토콜 요청을 날리는 공격 기법을 통해 **"아, 지점에서 최고 관리자의 비밀번호가 필요하구나!"** 하고 속아 최고 관리자의 진짜 비밀번호 해시를 뱉어내게 해야한다.

### 4-7. 좀 더 쉽게 알아보는 Golden Ticket과 Key List Attack 까지

![mimikatz](https://github.com/user-attachments/assets/0a8341d5-ebfe-4182-8d1a-3d1c391ada1e)

> Mimikatz를 이용해 지점 금고 털기

**해커(RODC01 위장)** : "mimikatz를 이용해서 지점(RODC01)의 마스터 도장인 `krbtgt_8245` 계정의 AES246 키를 복사해줘."

- 이를 통해 RODC01에 내장된 RODC01 admin의 AES246 키를 복제한다.

![rubeus 다운로드](https://github.com/user-attachments/assets/c3572823-dc6e-4eac-8c30-d9f67d1e8142)

참고로 Rubeus의 경우 kali apt로 설치할 수 있는 [GhostPack/Rubeus](https://github.com/GhostPack/Rubeus)은 더이상의 업데이트가 진행되지 않아 goldenticket을 위조할 수 없었으므로 [Flangvik/SharpCollection](https://github.com/Flangvik/SharpCollection/blob/master/NetFramework_4.7_x64/Rubeus.exe)의 최신 rubeus를 다운받아 진행했다.

> 이후 발표자료 준비하다가 찾게 되었는데 아니 이거 Rubeus 본 래포에도 golden 을 쓸 수 있는데? 뭐지? 그냥 내 칼리에 깔린 버전이 옛날거였던?

![Rubeus gt](https://github.com/user-attachments/assets/a2dbfbf6-e23f-4449-ac60-4474c67c39eb)

> Rubeus (Golden Ticket) 가짜 신분증 위조

**해커(RODC01)** : "서류(Golden Ticket)를 만들건데 그 내용엔 **'이 사람은 지사의 최고 관리자이며, 우리 지점(RODC01)이 신분을 보증함'** 이라고 쓰고 아까 훔친 AES246키를 넣어줘!"

**Rubeus** : "RODC Golden Ticket (가짜 VIP 출입증) 생성 완료, 하지만 RODC01용 VIP 출입증입니다."

- 이렇게 아까 찾은 AES246 키를 통해 Golden Ticket 생성.

![rubeus kla](https://github.com/user-attachments/assets/30310235-1aed-4224-9cfe-12f26b030701)

> Rubeus (Key List Attack)을 하기 전 PRP 수정

![PRP1](https://github.com/user-attachments/assets/73951cf2-b7f8-4e37-8ff8-1775807282c8)

그런데 정작 keyList 공격을 날리려고 하니 DC01이 `PRP(복제 정책)` 때문에 Administrator 해시를 보내주지 않았다. 

그렇기에 지금 l.wilson_adm이 RODC01을 다룰 수 있는 Admin 권한을 얻기 위해 `Add-ADGroupMember` 명령어를 이용하였다.

![PRP2](https://github.com/user-attachments/assets/6f0e5b62-1479-4a5b-869c-eaa57f23a16c)

그리고 `powerview.ps1` 모듈을 올려서 **허용 그룹 (RevealOnDemandGroup)** 에 추가해주려 했는데 그룹 권한을 설정해주면 쉘을 한번 껐다가 켜야했다.

![PRP3](https://github.com/user-attachments/assets/95192931-3a59-49bb-936a-3e941b2ad47d)

다시 쉘을 켜준 후 `powerview.ps1`을 다시 메모리에 올리고 

**허용 그룹 (RevealOnDemandGroup)** 에 "본사 장부야, RODC가 Adminitrator 비밀번호 달라고 하면 줘." 

**거부 그룹 (NeverRevealGroup)** 에 "본사 장부야, 막아둔 블랙리스트 명단 싹 지워버려."

라고 조작을 해버리면 드디어 다음 과정을 진행할 수 있게 된다.

> Rubeus (Key List Attack) 본사에 전화걸기

**해커(RODC01 위장)** : "여보세요 본사(DC01)죠? 나 **RODC01** 서버 인데요. 방금 우리 지점에 본사 회장님(Administrator)이 오셔서 로그인(인증)을 시도하셨거든요? 증명서(RODC Golden Ticket) 첨부합니다. 이분 인증 처리해 드려야 하니까 진짜 비밀번호 해시 좀 빨리 보내주세요!"

**본사 (DC01)** : 음 지점장 도장(krbtgt_8245)가 찍혀있네. 그리고 누가 본사 장부(msDS-RevealOndemandGroup)에 '본사 회장님 비밀번호를 보내줘도 됨' 이라고 결재를 올려놨네? "바로 NTLM 해시 보내드릴게요."

![rubeus kla get password hash](https://github.com/user-attachments/assets/2d8ff650-ba17-402e-ac49-4d5b40e6ce9d)

이렇게 최종적으로 우린 `Administartor@garfield.htb`의 진짜 NTLM 해시를 얻게 되었다!!!!

### 4-8. 최종 접속

이젠 지루한 위장이나 터널링도 필요 없다. 이 해시값 하나면 본사(DC01) 정문을 열고 들어갈 수 있기에.

![got admin](https://github.com/user-attachments/assets/112de783-d0c4-4da6-bc6f-c3bc6c2f147c)

evil-winrm을 통해 최종 서버 관리자의 계정으로 로그인하는데 성공했고.

![get root](https://github.com/user-attachments/assets/25c50dc6-ba59-4d47-a527-6a8192e5fefb)

드디어 root flag를 얻을 수 있었다.

## 마치며

![garfield pwned](https://github.com/user-attachments/assets/1562152d-1616-47d9-80e5-224914f3cfaa)

그렇게 오랜만에 푼 Windows AD 그것도 Hard 난이도의 문제를 풀어보았다.

지금 이렇게 다 하나씩 예시를 들어가며 정리를 하니 아 그래서 그랬구나 싶고 생각보다 막 어렵지는 않은가? 싶다가도 그저 writeup이 아니라 개념들까지 하나씩 뜯고 씹고 맛보며 진행하니 역시 점점 식견이 넓어져가는 듯 하다.

아쉽게도 이번 문제는 user를 얻는 것만 점수를 받을 수 있었다만, 사실 root를 얻는 과정에서 몇번이나 와 씨 이거 맞음? 하는 생각에 포기할까도 많이 생각했었다. 근데 뭔가 처음 도전하는 Hard 난이도라는 생각과 닿을듯 말듯 알쏭 달쏭한 이 기분을 해결하지 못하면 다음거 못풀겠다 하여 이리 끝까지 푸는데 성공했다.

그리고 난 말 그대로 아직 공부하는 입장이잖는가? 게다가 난 보안 전공생도 아님이니 이렇게 직접 부딪혀가며 문제를 푸는게 어쩌면 가장 빠르게 최신 트렌드와 필수 지식들을 얻는 과정이라고도 생각하니 말이다.

사실 이 문제 바로 다음으로 season에 올라온 문제가 평점 4.3에 리눅스 easy 난이도여서 확 그냥 그걸 풀어버릴까도 생각했었다. 그리고 이걸 풀면 그걸 풀어서 좀 더 내 머리속으로 정리된 내용을 Redlabs에서 발표해야하나 싶었지만 결국 이리 풀고 블로그에 작성하며 정리하니 어? 이거 발표하면 좋겠는데? 싶다.

뭐.. 시험 기간인 24시간을 넘겨 3일이라는 긴 시간동안 풀었지만 그래도 해냈다는 것 그것 만으로도 만족이다.

재능이 있는자를 따라가기 위해선 노력해야하니 말이지.

다들 Happy Hacking이다!