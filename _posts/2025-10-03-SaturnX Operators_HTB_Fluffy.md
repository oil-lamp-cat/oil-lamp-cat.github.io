---
title: "[HTB] Fluffy (Easy_Windows)"
date: 2025-10-03 14:17:43 +09:00
categories: [hacking, saturnx operators, windows]
tags: [Hack The Box]
pin: true
---

## 시작에 앞서

![Fluffy_windows](https://github.com/user-attachments/assets/6e680621-22c3-4925-af84-6adb58333ddc)

이번에 풀 문제는 `Retired Machine`중 지금까지 해왔던, 여러 워게임에서 다뤘던 것과는 다른 `Windows` 문제를 풀것이다.

난이도는 `Easy`이고 사실 풀 수 있게 될 문제가 `Fluffy`와 `Puppy` 두 문제가 있었는데 `Puppy`문제는 Guided 모드가 없기에 Fluffy 문제를 선택했다.

이번에도 저번과 비슷하게 처음으로 풀게 되는 윈도우 문제이니만큼 되게 풀이가 중구난방할 예정이다.

그럼 시작.

## 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![about machine](https://github.com/user-attachments/assets/89f3bbc8-8afe-4b5f-927f-6fe545b7f433)

문제풀이를 시작하려 하니 처음부터 지금까지와는 다른 어떤 문구가 반겨주었다.

```
현실의 Windows 펜테스트에서 흔히 있는 것처럼, Fluffy 박스는 다음 계정 자격증명으로 시작합니다:
아이디 j.fleischman / 비밀번호 J0elTHEM4n1990!
```

어째서 다른 리눅스 문제와는 다르게 윈도우 상황에서는 이런 문구가 있는걸까 하여 찾아보니, `가정된 침해(Assumed Breach) 시나리오를 시뮬레이션`을 하기 위함이라고 한다.

오희 해킹에서 외부에서 시스템을 뚫고 들어가는 것 뿐 아니라 내부 사용자 계정 하나가 탈취된 상황을 가정하고 시작한다고 한다.

쉽게말해 이번 문제에서는 이미 해커가 모종의 방법을 통해 일반 직원(?)인 `j.fleischman`의 계정 정보를 알아냈고 이제 이 계정으로 내부에 로그인해서 어디까지 권한을 상승시키고 정보를 빼낼 수 있는가를 보는 문제라 볼 수 있다.

자 그럼 이제 매번 하던 `nmap`을 통한 스캔부터 차근차근 진행해보자.

### Task 1

![Task1](https://github.com/user-attachments/assets/87505205-5704-4d89-8e9b-61a8c377efa7)

`Certified에서 도메인 컨트롤러의 정규화된 전체 도메인 이름(FQDN)은 무엇인가요?`

여기서 나는 `FQDN`이 무슨 의미인지 몰라 찾아보니 다음과 같았다.

- mail.google.com
- Hostname: mail
- Domain name: google
- 최상위 도메인(TLD): com
- FQDN: mail.google.com

![Task1 namp](https://github.com/user-attachments/assets/58dd5578-f6e8-4651-9ad4-7489ae282ef8)

`nmap`의 스캔 결과는 위와 같았고 평소와 보던 것과 달리 이번에는 `Microsoft Windows`라는 부분이 많이 눈에 띈다.

이번 스캔 결과에 대해서 설명하기에 앞서 필자는 윈도우 시스템에 대해서 아는 것이 거의 없기에 이번 머신(도메인 컨트롤러)에 대해 간단히 알아보고자 한다.

#### 도메인 컨트롤러란?

**도메인 컨트롤러(Domain Controller)** 는 마이크로소프트의 엑티브 디렉토리(Active Directory, AD)환경에서 모든 것을 관리하고 통제하는 중앙 서버이다.

- 회사나 조직의 **직원 계정(아이디/비밀번호)** 을 중앙에서 관리하고,

- 사용자가 로그인할 때 **인증(Authentication)** 을 담당하며,

- 네트워크 자원(파일 서버, 프린터, 이메일, 그룹 정책 등)에 **접근 권한(Authorization)** 을 통제하고,

- 네트워크에 연결된 모든 컴퓨터에 일괄적으로 보안 설정이나 규칙(그룹 정책, Group Policy)를 적용한다.

분명 진행하다보면 추가적인 내용이 있겠지만 그건 진행 하면서 알아보자.

#### Task 1의 스캔 결과

- Port 53 / `domain` : DNS 서비스로 후에 나올 `fluffy.htb`와 같은 도메인 이름을 IP 주소로 바꿔주는 DNS 서버 역할.
- Port 88 / `kerberos-sec` : [커버로스](https://juhi.tistory.com/75) 인증 서비스로 AD 환경에서 사용자가 로그인 할 때에 신원 확인하는 역할. 
- Port 139 / `ldap` : [LDAP(Lightweight Directory Access Protocol)](https://www.samsungsds.com/kr/insights/ldap.html) 서비스로 AD의 모든 사용자, 그룹, 컴퓨터 정보를 찾아볼 수 있게 해주는 프로토콜로 `-sC`스크립트 결과 도메인 이름이 `fluffy.htb`이고 서버 이름이 `dc01.fluffy.htb`라는 사실을 알아냈다.
- Port 445 / `microsoft-ds?` : 다른 컴퓨터와 파일, 프린트 자원 등을 공유하기 위한 목적으로 사용하는 `SMB(Server Message Block)` 서비스이다.
- Port 464 / `kpasswd5?` : Kerveros 암호 변경 프로토콜이라는데 일단은 추가 정보는 없다.
- Port 593 / `ncacn_http` : RPC(Remote Procedure Call)서비스로 원격으로 다른 컴퓨터에 있는 프로그램을 실행할 수 있게 해주는 거라는데...
- Port 636 / `ssl/ldap` : [LDAPS(LDAP over SSL)서비스](https://www.ibm.com/docs/ko/cloud-private/3.2.x?topic=ldap-configuring-over-ssl)라고 하며 389번 포트와 역할은 비슷하나 통신이 ssl로 암호화 되어 더 안전하다는데.. 어렵다..
- Port 3268 / `ldap` & 3269 / `ssl/ldap` : 이건 또 왜 있는거지? gemini의 힘을 빌리니 `글로벌 카탈로그(Global Catalog) 서비스` 라는데 여기까진 어우..
- Port 5985 / `http` :  WinRM (Windows Remote Management) 서비스라는데 이것도 일단 넘기자.

#### 다시 Task 1으로 돌아와서

우리는 일단 기본적으로 Windows가 쓰여있으니 머신이 Windows라는 것을 알았고 또한 `Kerberos(Port 88)`과 `LDAP(Port 389)`, `SMB(Port 445)`를 통해 `Domain Controller`라는 것을 알게 되었다.

또한 도메인 이름이 `fluffy.htb`라는 것과 DNS가 `DC01.fluffy.htb`라는 것도 말이다.

그렇다면 FQDN은? `dc01.fluffy.htb`다.

![Task1 clear](https://github.com/user-attachments/assets/09061f85-f747-4263-a47d-b3a26cb57651)

### Task 2

![Task2](https://github.com/user-attachments/assets/d6ec9f95-85f8-4a4f-bb1f-3513f2bac835)

어.. SMB share에서 볼 수 있는 PDF 파일 이름이 무엇이냐고 한다.

이것을 해결하기 위해 우리는 진행하기에 앞서 `/etc/hosts`파일을 열어 추가해줄 작업이 있다. 

![/etc/hosts why](https://github.com/user-attachments/assets/105aec40-8897-45b8-aea2-a9e44901a0d4)

라고 하니 똑같이 진행하자.

![/etc/hosts yes](https://github.com/user-attachments/assets/4326674f-817b-4ffa-9957-f853416cd8b4)

자 그럼 이제 `SMB`를 어떻게 접속할 수 있는지 찾아봐야겠지?

이를 위해 몇가지 명령어가 있다.

`smbclient`, `nxc`, `crackmapexec`

이 중 `crackmapexec`은 개발이 중단되어 그 이후 이어받은게 `nxc`라고 하고 다음과 같은 차이점이 있다고 한다.

![dif smbc nxc](https://github.com/user-attachments/assets/5f57de06-9594-4fa2-bf84-97713113dbf6)

둘 다 써보자.

![nxc](https://github.com/user-attachments/assets/1bd0f65f-06a6-4910-81d2-98fded3e6ee2)

보아하니 위에 나오는 로그들은 처음 실행해서 나온듯 하고 HTB에서 주어진 사용자와 비밀번호를 이용하여 로그인에 성공은 했으나 일반 사용자가 아니라 게스트 그룹에 속한 계정이라고 한다.

아 그게 아니라 걍 유저가 틀렸다. `j.fleischman` 이여야 하는데 `j.fleishman` 이라고 했다. 이래서 복붙을 해야해...

![nxc real result](https://github.com/user-attachments/assets/4d0eb90f-551c-49af-8d51-b195cf9865be)

이번에는 Guest가 없으니 일반 사용자라는 뜻이겠다! 하지만 여전히 share에 대한 내용은 없다.

![nxc shares](https://github.com/user-attachments/assets/eddfd936-17ab-4736-b823-3777d039e646)

확인해보니 `--shares`라는 옵션을 넣어줘야 하더라.. 게다가 root 권한으로 말이다.

결과를 토대로 유추해보자면 이 계정은 `IT`라는 공유 폴더를 읽고 쓸 수 있는 권한이 둘 다 설정되어있다는 것이다 그럼 이제 직접 들어가서 확인해보면 되겠지?

![smbclient](https://github.com/user-attachments/assets/9b1ba386-ed00-4c87-b1e8-c50457ed809d)

딱 보니 찾아야 하는 pdf 파일이 눈에 띈다.

![Task 2 clear](https://github.com/user-attachments/assets/7ce5ab94-ed33-4702-8641-bb058179a2fb)

### Task 3

![Task 3](https://github.com/user-attachments/assets/2579944b-89f0-4063-bb08-643aa162093f)

`PDF에 언급된 CVE 목록 중에서 어느 CVE가 공격자로 하여금 NTLM 해시를 유출할 수 있게 하나요?`라는데 여기서 NTLM이 뭘까?

찾아보니 [NTLM](https://elfmfl.tistory.com/40)은 윈도우에서 제공하는 인증 프로토콜이라는데 이게 왜 필요하지?

![why need NTLM](https://github.com/user-attachments/assets/4039dd3f-1054-4c97-86c5-e0c88bafc220)

제미나이 왈 위와 같이 알려주었는데 그렇다면 PDF 파일을 읽어보자.

![fluffy pdf](https://github.com/user-attachments/assets/ce95ed7d-e4d6-40ef-ad8f-32fd5d35910a)

PDF를 읽어보니 좀 더 명확해진다. 일단 이 PDF는 `Fluffy`라는 회사(?)의 문서이고. 보안 이슈가 있으니 업데이트 해야 한다는 일종의 보고서 처럼 보인다. 게다가 최근 취약점이라며 여러 CVE를 적어놨는데 

![fluffy pdf 2](https://github.com/user-attachments/assets/8fe7271d-718a-4cf6-8b67-c1b85a7e1a6e)

위와 같이 목표를 써놨다. 그렇다면 이 문제는 아직 업데이트를 안한 상황을 가정하고 진행하는 문제인걸까? 와.. 난 이 문제는 가이드 없으면 못 풀겠다.

여기 나와있는 CVE들을 하나씩 찾아보니 `CVE-2025-24071`가 우리가 찾아야하는 NTLM hash에 대한 취약점이다.

[[하루한줄] CVE-2025-24071 : Windows File Explorer의 NTLM Hash Leak 취약점](https://hackyboiz.github.io/2025/03/20/pwndorei/2025-03-20/)

[NIST/CVE-2025-24071 Detail](https://nvd.nist.gov/vuln/detail/CVE-2025-24071)

[Microsoft Windows 파일 탐색기 스푸핑 취약성 CVE-2025-24071 Security Vulnerability](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2025-24071)

이 취약점은 악성으로 조작된 `.library-ms`파일을 사용자가 추출하면 시스템이 자동으로 원격 SMB 서버에 인증을 시도하면서 사용자의 NTLM 해시가 외부로 유출되는 취약점이다. 리눅스로 따지면 ssh 프라이빗 키가 유출되는 거랄까?

![Task 3 clear](https://github.com/user-attachments/assets/4a5026aa-53be-4edc-ae8c-d783cec9f8d0)

### Task 4

![Task 4](https://github.com/user-attachments/assets/c5d3483c-3ba6-4b87-995c-a8c7e92f95dd)

`IT 공유(IT share)에서 ZIP 파일을 열고 있는 사용자는 누구인가요?`

라는데... 

- [0x6rss/CVE-2025-24071_PoC](https://github.com/0x6rss/CVE-2025-24071_PoC)
- [ThemeHackers/CVE-2025-24071](https://github.com/ThemeHackers/CVE-2025-24071)
- [FOLKS-iwd/CVE-2025-24071-msfvenom](https://github.com/FOLKS-iwd/CVE-2025-24071-msfvenom)
- [pswalia2u/CVE-2025-24071_POC](https://github.com/pswalia2u/CVE-2025-24071_POC)
- [helidem/CVE-2025-24054_CVE-2025-24071-PoC](https://github.com/helidem/CVE-2025-24054_CVE-2025-24071-PoC)

이렇게 많은 POC들을 github에서 찾아볼 수 있고 난 이중에 가장 위에 있는 `0x6rss`의 POC를 이용해보겠다.

![POC download](https://github.com/user-attachments/assets/1dd820e2-a460-4197-ab41-18e2e981dbcf)

사용법은 되게 간단하다.

![POC setting](https://github.com/user-attachments/assets/7fc094fd-4c75-4a24-9030-35296f6421ec)

위와 같이 이름과 IP설정을 끝내고 이제 SMB를 통해 파일을 보낸 후 POC에서 나왔듯 `responder`를 이용해 필요한 Hash 값을 받아보자.

![smb put](https://github.com/user-attachments/assets/4735e9bb-6c2f-42da-abaf-5d503d5cf9bf)

넣기도 성공했고 그럼 내쪽에서 들을 수 있는지 확인해보자.

![문제 발생](https://github.com/user-attachments/assets/3db70fc8-6982-49ba-bb85-516992b438b5)

음..? 왜 안되?

했는데 `ls`를 찍어보니 그 잠깐 사이에 파일이 삭제되었었다. 허허...

![didit!](https://github.com/user-attachments/assets/ae3c38e0-7a59-473b-8296-6621d3eab987)

아 드디어 잡아냈다.

user는 `p.agila`이고 Hash는 `p.agila::FLUFFY:b6bd89...` 이라고한다.

![Task 4 clear](https://github.com/user-attachments/assets/56c6f57d-043d-4b7a-ad8f-3595e699b100)

### Task 5

![Task 5](https://github.com/user-attachments/assets/94b25ef6-64c3-4a22-9382-b0c08f3d92c4)

이번에는 비밀번호가 무엇이냐고 한다. 아까 위에서 Hash를 땄으니 이제 복호화를 해봐야겠지?

![Task 5 hint](https://github.com/user-attachments/assets/a6a52268-3b02-489d-8a64-1bef0c9b14ca)

힌트에서는 `hashcat`을 이용해 `rockyou.txt`의 워드리스트를 이용하라고 한다.

![hashcat](https://github.com/user-attachments/assets/4262dbee-4302-4acc-a634-490727111cac)

```cmd
┌──(kali㉿kali)-[~]
└─$ hashcat -m 5600 hash /usr/share/wordlists/rockyou.txt.gz
```

위 명령어를 사용했다. 여기서 5600은 hashcat의 -m 옵션을 통해 `NetNTLMv2`으로 만들어졌으니 그에 따른 방식을 이용해! 라고 알려주는거다.

보아하니 비밀번호는 `prometheusx-303`인듯?

![Task 5 clear](https://github.com/user-attachments/assets/b9f5b377-0120-4252-bfeb-570f5ee88de9)

## 초기 침투 (Initial Foothold / Exploitation)

지금까지 모은 정보를 토대로 다음 단계로 나아가자.

### Task 6

![Task 6](https://github.com/user-attachments/assets/5c9c72e8-9fec-41d2-9b71-9452b9a65f32)

`서비스 계정 매니저(Service Account Managers) 그룹이 서비스 계정(Service Accounts) 그룹에 대해 어떤 ACE(액세스 제어 항목)를 가지고 있나요?`

![Task 6 hint](https://github.com/user-attachments/assets/9a84f009-6764-4e5c-bea6-e0d93e676843)

이번에도 어떻게 풀어야할지 감이 오지 않아 바로 힌트를 보았다.

`bloodhound`를 이용해 UI에서 찾아보라고 한다. 드디어 블러드하운드를 쓰는구나!

이게 나는 kali를 vm에 올려 사용하고 있는데 4GB 정도의 메모리로 설정해두면 docker에 bloodhound 올리면서 멈추는 문제가 있었다. 그래서 8GB로 올리니 정상작동하게 되었다는 이야기...

![bloodhound-python result](https://github.com/user-attachments/assets/3dc8cf6e-7363-409c-a7f0-ee5b58064ab8)

`bloodhound-python -d <domain> -u '<user>' -p '<password>' -dc 'dc01.<domain>' -c all -ns <Target IP>`

위 결과를 토대로 우리는 정보를 얻었고 이제 UI를 열어서 볼 시간이다.

![wrong](https://github.com/user-attachments/assets/ddb377bf-d4b9-4e3d-a73e-0c35c3c08706)

하.. 왜지? 다른사람들 보면 다 그래프 노드로 쭉쭉 나오던데 나는 검색하는 것만 띡 나온다.. 분명 이건 아닐텐데..

처음 bloodhound를 쓰는거라 찾아보니 이게 맞다.. 이제 유저를 검색하고 거기에서 이어지는 것들을 찾아나가면 되는것!

![bloodhound1](https://github.com/user-attachments/assets/4ea38025-039b-41a2-9881-065421a86932)

보아하니 우리가 찾아야하는 `service account managers`에 이전에 얻었던 `p.agila`가 멤버로 들어가있다. 그리고 우리가 찾아야하는 `service account managers`과 `service accounts`의 관계에서 우리는 `GenericAll`이라는 권한이 있다는 것을 알 수 있다.

[레드팀 플레이북/GenericAll](https://www.xn--hy1b43d247a.com/privilege-escalation/ad-dacl/genericall)

![more!](https://github.com/user-attachments/assets/ac597ab0-fa44-452b-a76c-9affb74d58be)

조금 더 들어가보니 위와 같은 그래프가 나왔다. 사실 처음 딱 bloodhound로 검색했을 때에 참.. 소위 말하는 거지같은 노드 사이만 길고 정리도 안 되어있는 그래프가 나와서 좀 정리하고 보니 봐줄만 하다.

![oh...](https://github.com/user-attachments/assets/56a77d69-a5cc-4030-a275-76fafc0cc0d4)

솔직히 왜 전체 그래프를 보여주지 않는지 되게 궁금했었기에 `CYPHER`라는 기능을 이용해 띄워봤다만... 어우.. 안 보여주는 이유가 있었네..

![Task 7 clear](https://github.com/user-attachments/assets/94275c31-c63e-4897-904e-35b017a3989e)

### Task 7

![Task 7](https://github.com/user-attachments/assets/cfdebe29-7e21-42b0-a959-e4d28ee209fe)

`서비스 계정(Service Accounts) 그룹이 winrm_svc 사용자에 대해 어떤 ACE(액세스 제어 항목)를 가지고 있나요?`

갑자기 왠 winrm_svc? 힌트에서도 전에 했던 말 그대로 하고 있는데?

![winrm_svc](https://github.com/user-attachments/assets/fa700896-af1d-4ce2-8c49-43264cb68e71)

일단은 찾아보니 `Service Accounts`의 맴버로 속해있다. 근데 그래서?

- 2025-10-04, userflag 못찾고 9시간 지난건 또 처음이네 으엑

## 권한 상승 (Privilege Escalation)