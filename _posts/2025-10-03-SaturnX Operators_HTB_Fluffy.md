---
title: "[HTB] Fluffy (Easy_Windows)"
date: 2025-10-03 14:17:43 +09:00
categories: [hacking, saturnx operators, windows]
tags: [Hack The Box]
pin: true
---

[OilLampCat has successfully pwned Fluffy Machine from Hack The Box](https://labs.hackthebox.com/achievement/machine/988787/662)

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

### Task 6 다음날

오늘 시작하기에 앞서 혹시 하는 마음에 `Bloodhound-python`을 다시 실행시켜봤는데 생각지도 못한 문제가 있었다.

![bloodhound for legacy](https://github.com/user-attachments/assets/6a30a5bb-8668-46b3-a136-73161820f1f2)

바로 이번에 스캔을 할 때에 사용했던 `bloodhound-python`은 레거시 버전을 위한 것으로 이번에 내가 설치한 `bloodhound-CE` 버전과는 맞지 않는 스캔 도구였던 것이다.

[BloodHound CE Tutorial: Find Active Directory Attacks Like a Red Teamer](https://www.youtube.com/watch?v=P2SV6bxxA0g)

음.. 정확한 사용법을 위해서 좀 유튜브도 보고 github도 찾아보고 했는데

[dirkjanm/BloodHound.py](https://github.com/dirkjanm/BloodHound.py/tree/bloodhound-ce)

나는 sharphound를 이용하는 방법보다는 `bloodhound-ce`를 이용하는 편이 더 좋을 듯 한다.

[kali/bloodhound-ce-python](https://www.kali.org/tools/bloodhound-ce-python/)

설치방법은 위와 같이 간단하니 apt로 설치하면 된다.

![bloodhound-ce-python](https://github.com/user-attachments/assets/06d042e9-6d14-423a-9c31-413276421c3a)

진행하다보니 오류가 뜨기는 했다만.

![bloodhound-ce](https://github.com/user-attachments/assets/2697d93a-17ee-44d2-9715-0915a5893c1a)

일단 잘 나오기는 한다.

![p.agila](https://github.com/user-attachments/assets/6aa8a16b-6136-40fe-8bb6-1f444c1863d7)

이전 결과와 동일하게 `p.agila`계정은 `SERVICE ACCOUNT MANAGERS` 그룹에 속해있고 `SERVICE ACCOUNTS` 그룹에 모든 권한이 있다.

![service accounts](https://github.com/user-attachments/assets/5f8169f4-6292-4ef0-a129-2a7be7dbecd9)

이제 전과 같은 상황이라는 것을 확인할 수 있었고 그럼 이제 다시 `winrm_svc`를 찾아야 하는 이유에 관한 문제인데

![gemini why](https://github.com/user-attachments/assets/a6553d2e-0441-48c5-9804-0649f0a5f816)

아예 `.zip`파일을 gemini에게 보내주자 공격 경로에 대해 알려준다.

사실 그냥 가이드 모드를 따라가고자 한다면 따라갈 수 있겠다만. 왜 굳이 `WINRM_SVC`냐고 한다면 이것이 원격 관리를 위한 계정이고 이를 얻어 `WinRM`을 통해 서버에 원격으로 접속할 수 있게 해준다고 한다.

![winrm_svc search](https://github.com/user-attachments/assets/14d1eb12-fc31-46cd-987c-3563c7ef9402)

음.. 찾아봐도 딱히 저 이름에 대한 내용은 없는거 같은데.. 그냥 `WinRM`을 사용하는 유저다 해서 이름을 저리 지은듯 하다. 마치 88번 포트면 http 8080이면 https 이런 느낌일까?

![Task 7 clear](https://github.com/user-attachments/assets/9e7f08b7-22ba-4f9d-9c5d-7448d7b8cebd)

### Task 8 _ User Flag

![Task 8](https://github.com/user-attachments/assets/8f2b85e6-b956-426b-8819-8bcb05f6d05a)

자 그럼 이제 실제로 `Winrm_svc` 유저에 접속해야겠지?

![pagila to sa](https://github.com/user-attachments/assets/2d585c85-d111-4c36-9165-3c557684e510)

먼저 `p.agila`를 `SERVICE ACCOUNTS`에 넣자.

그리고 솔직히 이 다음에 어떻게 진행해야할지 전혀 감이 오지 않는다. 그냥 다음으로 진행하면 되는게 아닌가 했는데 아니더라..

![why? how?](https://github.com/user-attachments/assets/f92ca80a-d0aa-4a74-964c-d8ad5d211f3b)

그니까 결국 여러번 풀다보니 아 이 때에는 이렇게 진행해야하는구나! 하고 알게되는건가?

![shadow Credentials](https://github.com/user-attachments/assets/d4aed364-8917-4ad3-8005-324f069e750e)

음.. 난 진짜 인공지능 없었으면 이건 어떻게 풀었을지 몰라.

...? 근데 내가 봤을 때에는 `Generic All` 아녔나?

아! 이건 내가 해깔린게 맞다.

일단 지금 `p.agila`는 원래 `SERVICE ACCOUNT MANAGER`에 속해 있었고 위 과정을 통해 `SERVICE ACCOUNTS`에 이미 들어온거다.

그러니 이제 여기서 `Winrm_SVC`유저에 접근하기 위한 방법을 이용하면 되는 것이다!

머리가 뜨거워지는구나...

![after add sa](https://github.com/user-attachments/assets/626accc7-64b8-42f5-80cb-0a37cbf8a14a)

그래서 아예 `SERVICE ACCOUNTS`에 계정을 추가한 후 다시 Bloodhound를 이용해 다시 정보를 얻어보니 위 사진과 같이 `p.agila`가 `SERVICE ACCOUNTS`의 계정에 추가되어있는 것을 알 수 있다. 그리고 여기서 우리가 찾고자 하는 `WinRM_SVC` 유저가 `GenericWrite`로 권한이 걸려있기에 그에 따른 취득 방법을 이용하면 되는 것이다!

와.. 정말 멀리도 돌아왔다...

자 그럼 이제 `Shadow Credentials`를 이용해 다시 한번 해시를 얻으러 가보자.

![why not working](https://github.com/user-attachments/assets/35db53a2-d833-4dd6-9f75-bd4680b81d0c)

아니 왜 자꾸 hash값이 없다고 이러는건지 모르겠다.. 애초에 `no identities foun in this certificate`가 뜨는 것도 그렇고 도대체 왜지?

![claude](https://github.com/user-attachments/assets/0a7e6b4c-7346-44a4-8d07-613c35877101)

찾아보다 claude가 시간 동기화를 해야한다는 말을 했다. 설마 이걸까..

![not](https://github.com/user-attachments/assets/645b7c49-8362-4482-b272-94d73cb6477d)

음....

![why??????????](https://github.com/user-attachments/assets/f8cf169f-2392-4edb-984d-ebc9fa001149)

진짜로 왜 안되는건데..

![works!?](https://github.com/user-attachments/assets/b5b5d014-8ad2-41c2-94bf-62bb0835ac26)

일단 성공했는데 참... 시간대가 문제였다니...

![reason of works](https://github.com/user-attachments/assets/b75835d0-1c3d-42b5-9f2f-216ca8d19077)

하나는 내 vm 칼리와 DC의 시간이 맞어야지 진행되는 문제였고.

두번째는 자꾸 자동으로 인터넷 표준 시간과 서버가 자동으로 시간을 동기화 해버려서 불가능 했던것...

그럼 다음으로 `evil-winrm`을 이용해 `winrm_svc`에 접속해보자.

![did it...](https://github.com/user-attachments/assets/cd1072a7-f620-43f0-9ce3-040ccaeb4a25)

와... 찾았다..

그리고 이게 신기한것이 원래 PowerShell 명령어에서는 `ls`나 `cat`, `pwd`등을 쓸 수가 없는데 이 `evil-winrm`이라는 쉘이 평소에 사용하던 리눅스 명령어를 쓸 수 있게 만들어놨다.

![Task 8 clear](https://github.com/user-attachments/assets/eb022cf4-41b3-4a63-9deb-74e9ef486e99)

## 권한 상승 (Privilege Escalation)

이제 다음으론 root 권한 얻기다!

### Task 9

![Task 9](https://github.com/user-attachments/assets/21912be0-03ee-4833-8020-81b0afa0d674)

`Service Accounts 그룹이 GenericWrite 권한으로 수정할 수 있고, 동시에 Cert Publishers 그룹에도 속해 있는 계정은 어떤 계정인가요?`

![Task 9 blood](https://github.com/user-attachments/assets/73733eda-1570-491d-aef1-778ca291cc01)

사실 Task 9 문제 자체는 쉽다 그냥 Path 지정해서 확인해보면 되니 말이다. 하지만 난 여기서 궁금해진게 왜 굳이? 라는거다. 왜 이번에 취득한 `Winrm_svc`가 아니라 `ca_svc`를 찾아야 하는거지?

일단 내가 정확히 이해한 것 같지는 않은데 간단하게 인터넷을 돌아다니며 이해한 것은 지금 우리가 갖고 있는 이 `Winrm_SVC`에서 일단 먼저 정찰을 하며 취약점이 있는지 찾아보는게 먼저다. 그 때에 `커버로스팅(Kerberoasting)`과 같은 공격을 시도해 볼 수 있지만 이번 Fluffy 문제에서는 `AD CS(Active Directory Certificate Services)`의 경로를 통해 권한 상승이 가능하게 문제가 만들어져있다고 한다.

![how to go up](https://github.com/user-attachments/assets/b4b7d5be-66a5-49b8-87ec-902ce6196414)

위와 같은 느낌이라고 제미나이가 알려주던데 그렇다면 나는 이 Task 9번 문제를 풀기 전에 일단 취약점들이 있는지 부터를 찾아보는게 먼저일 듯 싶다.

그리고 `winPEAS`를 이용해보려 했으나 자꾸 실패해서 일단은 밀어두고 다음으로 넘어가고자 한다.

윈도우 쉽지 않네...

[Hack The Box: Fluffy Walkthrough](https://www.youtube.com/watch?v=4_I657Mfk0k)

그나마 위 유튜브를 보면서 왜 하필 CA인가 했는데 잘못 구성된 CA를 관리자 인증서로 바꿔버리는 걸로 진행해야 한단다.

그리고 이를 이용하기 위해서는 ADCS가 있는지 확인해야한다.

![adcs is there](https://github.com/user-attachments/assets/53b0d446-612a-4673-b837-062c2a3411d9)

`nxc`를 이용해 ADCS가 존재하는 것을 확인했기에 우리는 그것을 사용중인 `ca_svc`유저에서 취약점을 찾아보도록 하자.

방법은 위 `Winrm_svc`에서 했던 방식과 동일하다.

![get ca_svc](https://github.com/user-attachments/assets/a9c5faf0-baa4-4e5c-93d4-6beb6e7ae5f4)

이제 이것을 이용해서 다음 Task를 진행하면 된다.

![Task 9 clear](https://github.com/user-attachments/assets/6f55ac5f-30ad-44be-95e5-0ae2c1feb333)

### Task 10

![Task 10](https://github.com/user-attachments/assets/16df082f-ccdd-4ccb-93b1-287416320170)

`Active Directory 환경에서 인증서를 발급하는 인증 기관(CA)의 공통 이름(CN)은 무엇인가요?`

위에서 `ca_svc`의 hash를 얻었으니 `certipy-ad`를 이용해서 취약점을 찾을 수 있다.

![cerad re](https://github.com/user-attachments/assets/85227968-330f-4399-a271-3e0de9697c0f)

실행 커맨드는 위와 같다.

![vuln](https://github.com/user-attachments/assets/7030434f-6339-4a2f-a355-e895d54db135)

결과의 마지막즘에 가면 빨간색으로 표시해 놓은 곳에 `ESC16`이라는 공격에 취약하다는 문구가 들어있다.

[ESC16](https://github.com/ly4k/Certipy/wiki/06-%E2%80%90-Privilege-Escalation#esc16-security-extension-disabled-on-ca-globally)

cve는 아니고 Certipy에서 코드를 붙여놓은듯 하다.

Task 9의 답은 `CA Name`으로 나와있는 `fluffy-DC01-CA`다.

![Task10 Clear](https://github.com/user-attachments/assets/6c2c222f-281f-4d1c-95f0-8a59455568f7)

### Task 11

![Task 11](https://github.com/user-attachments/assets/291a7f40-0e03-4f5a-9eab-d37e4d9188f6)

`Fluffy에서 CA가 전역적으로 보안 확장이 비활성화된 상태로 잘못 구성되어 있습니다. 이것이 나타내는 ESC 취약점의 가짜 이름(별칭)은 무엇인가요?`

이게 바로 우리가 찾았던 `ESC16`이다.

![Task 11 clear](https://github.com/user-attachments/assets/e8a3f3c7-0d2a-43d5-8af8-8b67b860bb5a)

### Task 12 _ Root Flag

![Task 12](https://github.com/user-attachments/assets/5b2d4b70-181d-4e03-9961-dbdd5995f0b1)

마지막은 이제 이 취약점을 이용해 루트 플래그를 따내는 건데..

자 잘 자고 왔으니 다시 맑은 정신으로 진행하자!

#### 1. UPN 스푸핑

> 계정 정보 변경

ESC16 공격은 인증기관(CA)를 속여 우리가 원하는 사용자의 인증서를 발급받는 작업이다.

고로 `Ca_SVC`계정의 사용자 계정 이름(User Principal Name, UPN)을 잠시 `administrator`로 변경하자.

![cant](https://github.com/user-attachments/assets/f8584e75-b4e7-46e0-adb1-5e4d6d5d6222)

아 한번 끊고 시작하니 당연히 `p.agila`의 계정도 다시 연결시켜야 한다.

![UPN spooping](https://github.com/user-attachments/assets/83689783-2464-45aa-87d8-ef9aab9819ee)

자 이름을 바꾸는데 성공했다.

#### 2. 관리자 인증서 요청

이제 `Ca_SVC`의 이름이 잠시 `administrator`가 되었으니 바로 인증서를 발급받자.

![관리자 인증서 요청](https://github.com/user-attachments/assets/dc5dcf08-5c9e-424d-a3c2-ad49b6860f77)

성공이다. 그리고 여기서 생긴 `administrator.pfx`라는 파일이 바로 우리가 필요한 위조 관리자 신분증이다.

#### 3. 관리자 계정의 NTLM 해시 탈취

이제 바꿨던 `Ca_SVC`계정의 이름을 다시 원래대로 돌려놓고 해시를 받으면 되는데...

![관리자 NTLM wrong](https://github.com/user-attachments/assets/e578281f-4e8a-4a68-917d-484239eb18f4)

앵? 파일이 있는데 없다네?

아 당연히 없다 ㅋㅋㅋ `administrator`여야 하는데 `administarator`라고 했으니 ㅋㅋㅋ 뒤 과정을 제대로 된 명령어로 다시 수행하자.

![또 왜..](https://github.com/user-attachments/assets/08599ad8-88cd-4d59-97f8-f9d08f27eaaa)

이번엔 `ciphertext integrity failure`라는데 다시 시도하니 됬다. 뭐였지?

![NTLM 해시 탈취 완료](https://github.com/user-attachments/assets/0af32ec8-d27a-4532-8175-aff042a89470)

진짜 나한테 왜 이래요.. 간떨어지게..

#### 4. Root 플래그 먹으러 가자~

해시도 있겠다 바~로 `evil-winrm`을 이용해 접속을 시도하자.

그리고 참고로 `aad3b435b51404eeaad3b435b51404ee:8da83a3fa618b6e3a00e93f676c92a6e` 난 이거 전부 넣어서 접속을 시도했는데 그게 아니라 `:` 이거 뒤에것만 우리가 필요한 해시다.

앞부분은 `LM(LAN Manager)`로 오래된 보안에 취약한 해시라고 한다.

그리고 뒷부분은 `NT(NTLM)`으로 최신버전의 해시라고 한다.

![Task 12 Clear](https://github.com/user-attachments/assets/d6fa252b-ffcf-485c-98d6-8cd720b74bd3)

## 마치며

![Fluffy has been Pwned!](https://github.com/user-attachments/assets/d240eeef-ddc5-4059-90b0-b756061a8a0f)

와.. 진짜 세삼 그동안 내가 윈도우에 대해서는 너무 공부를 안했다는 생각이 든다. 그동안 wargame이나 ctf에서 나오는 문제들도 사실 다 리눅스다보니 윈도우? 일반인, 혹은 게이머나 쓰는 os 아닌가 하면서 별거 아니지 싶었었는데... 어우.. 이게 Easy라니..

식사 시간 제외하고 어제 9시간 + 오늘 8시간 총 17시간이라..

사실 내일부터 또 추석이라 모든게 세팅되어있는 본 컴퓨터를 못쓰기에 아무래도 조급했던 것도 있었다. 뭔가 시간에 쫒겨 이거 2일 안에 다 공부하고 끝까지 풀어야지 하는? 여유가 없었달까?

그래도 풀다보니 다음번에는 그래도 좀 더 수월하게 풀수 있겠다는 생각이 든다.

이번에 bloodhound 세팅으로 거의 3시간 잡아먹고 새로운 개념들을 하나씩 다 공부해가며 문제를 풀었더니 오래 걸릴 수 밖에 없었기도 하고 말이다.

특히 진짜 다시 한번 느끼는거지만 머리아프고 막힐 때에는 잠시 접어두고 자고 오거나 쉬고 오는건 정말 좋은 선택이다. 애초에 oscp 시험때에 권유하기도 하니 말이다. 루트 플래그 얻기 전까지 최소 3시간씩 앉아서 뚫어져라 쳐다보고 왜 안되냐 하면서 문제풀다보니 지금 다시 기록을 읽어봐도 정리가 안되어있다는게 새삼 느껴진다. 나중에 다시 기록을 정갈하게 해야겠지.

하여튼 Easy라곤 하지만 내겐 정말 어려운 문제였고 솔직히 이제와선 꽤나 재미있는? 혹은 색다른 문제여서 좋았다. 이번건 내가 온전히 이해하지 못한 부분이 한두곳이 아니라 발표를 할 수 있을지는 모르겠지만 이번에도 준비하면서 동시에 공부를 해야겠다.

끝!

![누군가에겐 놀림거리일 script kiddie는 내게는 먼 곳으로 가는 한발이다.](https://github.com/user-attachments/assets/dec12564-edcd-4009-aca4-abb046177ca6)