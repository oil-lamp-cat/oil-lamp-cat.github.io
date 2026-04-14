---
title: "[HTB] Garfield (Hard_Window) _ 작성 중"
date: 2026-04-13 17:29:00 +09:00
categories: [hacking, RedLabs, Windows]
tags: [Hack The Box, Hard]
password: "73"
---

## 시작에 앞서

![Garfield](https://github.com/user-attachments/assets/d77b9fab-85d9-488c-aa66-53eaceeec664)

오랜만에 돌아온 Windows 문제. 이번 시즌 문제에 나오기도 했고 이번 시즌엔 한번 점수를 얻어볼까? 싶은 마음에 바로 머리부터 박고 시작한 문제였다.

![season](https://github.com/user-attachments/assets/45d59b0b-9b1e-4d06-84ce-077b7713a757)

다만 이걸 3일 전에 풀기 시작해, 어제까지는 점수를 얻을 수 있었는데 오늘은 마침 딱 linux 문제로 바뀌더라. 쩝.. 그래서 첫날 풀었던 userflag 점수를 얻어서 첨으로 bronze에는 발을 들여봤다.

거진 3일동안 진짜 하루 종일 붇들고 있으면서 여기 저기 찾아다니고 인공지능과 사바사바 하면서 간신히 풀었기에 나 또한 이 글을 작성하며 Writeup이지만 공부 정리의 형식처럼 작성하게 될 듯 싶다. 그리고 딱 보아하니 이거 정리 자체도 오래 걸릴지도?

## 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![문제](https://github.com/user-attachments/assets/aacc01d3-2c27-4994-b100-521d902f9882)

문제를 보아하니 전에 풀었던 TombWatcher 문제가 떠오르는 계정 정보다.

일단 계정 정보를 주었으니 이번엔 AD 문제가 되겠네?

![nmap1](https://github.com/user-attachments/assets/9d8c315e-e6ab-4957-aa72-3270d1509cc2)

일단 바로 nmap을 돌려보았다. 뭐.. 이번 머신이 웹 페이지가 있는지도 모르고 smb나 ssh 열려있는지도 모르는데 할 수있는 방법이 이것 밖에 없지 머.

보아하니 도메인 네임은 `garfield.htb`, `DC01.garfield.htb`이고 `135/rpc`나 `389/ldap` 등이 보인다.

![etchosts](https://github.com/user-attachments/assets/a32656e2-f1e0-47c5-ab23-ef180eecc7ee)

바로 도메인 추가해주자.

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

- `SYSVOL` -> C:\Windows\SYSVOL\sysvol\
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

![bloodhoundce](https://github.com/user-attachments/assets/d2b8401e-9dc1-4163-ac57-9ef99b63bdd1)

참고로 default로 kali에 설치되는 bloodhound-python의 버전은 레거시이기에 추가로 ce 버전을 설치해야 neo4j 버전과 맞게 된다. 근데 난 사실 이걸 하기 전에 레거시 버전으로 했다가 공격 경로가 안보여서 뭐지 싶어 ce로 변경했다는 이야기...

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

그렇다면 다음 우리가 결국 갖고자 하는 타겟이 누구일까 하니 `RPC`에 권한이 있는 `Remote Desktop` 그룹에 `L.Wilson`이 있다는걸 확인할 수 있었다.

![reverse](https://github.com/user-attachments/assets/76036b4f-54ff-4a0f-ace0-5632c538646f)

이제 내 계정(j.arbuckle)이 IT Support 그룹에 속해있게 되었고 직원들이 회사 출근해서 접속하는 `SYSVOL\scripts` 폴더에 파일을 쓸 수 있는 권한이 있다는 것을 확인했다.

그러니 이제 우리의 다음 타겟인 `L.Wilson`의 AD 객체 속성을 마음대로 수정할 수 있는 권한을 갖고있다는 좋은 소식을 얻은것이기에,

SYSVOL 스크립트 폴더에 리버스 쉘을 심어두고 L.wilson의 계정 설정에 들어가서 로그인 할 때마다 이 리버스쉘 스크립트를 실행해! 라고 강제 지정해버리자.

그럼 이제 찾을 만큼 찾았는데 초기 침투를 진행해볼까?

## 초기 침투 (Initial Foothold / Exploitation)

![printerdetect](https://github.com/user-attachments/assets/a6900275-4004-4462-9d82-bedd08e22826)

일단 리버스 쉘을 만들기 위해 기존 스크립트는 어찌 되어있나 보니 `.bat` 형식으로 되어있었다.

![reverse](https://github.com/user-attachments/assets/76036b4f-54ff-4a0f-ace0-5632c538646f)

고로 [revshells](https://www.revshells.com/)에서 powershell용 그것도 base64 인코딩된 코드를 찾아 복사해주자.

![put](https://github.com/user-attachments/assets/21d91d1f-ff6a-43b5-b0ec-67ed30860d9f)

이후 `smbclient`로 `SYSVOL`에 접속해 printerDetect.bat 파일을 미리 만들어둔 리버스 쉘로 바꿔치기 해버리자.

그리고 리스너를 켜준 후 `bloodyAD -u 'j.arbuckle' -p 'Th1sD4mnC4t!@1978' --host 10.129.28.86 set object "CN=Liz Wilson,CN=Users,DC=garfield,DC=htb" scriptPath -v printerDetect.bat` 명령어를 통해 다른 유저가 아니라 Liz Wilson 유저가 printerDetect.bat 파일을 읽게 만들어버리면?

위 이미지처럼 리버스 쉘을 받을 수 있다.

## 권한 상승 (Privilege Escalation) 

## 마치며
