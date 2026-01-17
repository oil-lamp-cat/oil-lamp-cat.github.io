---
title: "[HTB] Hack The Box의 시작과 CAP (Easy_Linux)"
date: 2025-09-06 10:40:15 +09:00
categories: [hacking, saturnx operators, Linux]
tags: [Hack The Box]
---

## Hack The Box 시작

이번에 동아리에서 하던 프로젝트들도 끝났겠다. 슬슬 또 할 것을 찾아나선 나는 레드라쿤 커뮤니티에서 스터디를 모집한다는 글을 보고 바로 `Saturnx Operators`에 지원하게 되었다.

그렇게 이번주에 풀어야 하는 문제는 `Hack The Box`의 초보자 단계 문제인 [Cap](https://app.hackthebox.com/machines/Cap)이다.

![htbcap](https://github.com/user-attachments/assets/837fe861-8555-4675-9277-5665125de8c6)

그리고 필자는 일단 HTB에서 머신을 풀어보는 것은 처음이기도 하고 다른 문제들 풀때 매번 그러했듯 시작부터 뭔가 샛길로 새는 경향이 있었기에 이번에는 `Guided Mode`로 설정하고 진행하려고 한다.

![select](https://github.com/user-attachments/assets/16f5b24d-8501-46b8-b54e-f3ca929d3cf2)

위 사진처럼 설정하면 각 순서를 알려주기에 진행하기 쉽달까?

정 못 풀겠거나 문제를 푼 뒤 이게 맞게 푼건지 확인하고 싶다면 `Official Writeup`을 보는 것도 좋은 생각이다.

![cap is offline](https://github.com/user-attachments/assets/3870d018-ce54-4e49-879f-4b5439693a77)

일단 머신이 꺼져있으니 켜보자. 

![machine online](https://github.com/user-attachments/assets/15b470b7-4170-4efc-9323-38513caefac6)

이렇게 IP 주소가 나오게 되었고. 이 머신에 접속하기 위해서(?)는 vpn에 접속할 필요가 있다. 특히 HTB는 `openvpn`을 사용하니 인터넷에 들어가 검색해 보면 바로 연결할 수 있다.

![connect](https://github.com/user-attachments/assets/28145659-6697-4323-b00b-62337a9a7320)

처음 `connect to HTB`를 눌러 들어가보면 이렇게 `Machines`와 `Starting Point`라는 것이 보일텐데 둘의 차이는 다음과 같다.

1. Machines (US FREE 2 서버)
    - 접속 목적: Cap 머신과 같은 일반적인 실전 해킹 챌린지를 풀기 위한 메인 랩.

    - 설명: 이 네트워크에 접속해야만 `Machines` 목록에 있는 다양한 난이도의 머신들과 통신하고 해킹을 시도할 수 있다.


1. Starting Point (US STARTINGPOINT 1 서버)
    - 접속 목적: HTB 입문자들을 위한 튜토리얼용 머신을 풀기 위한 전용 랩.

    - 설명: 이 네트워크는 완전히 분리되어 있으며, 오직 `Starting Point` 섹션에 있는 가이드 머신들에만 접근할 수 있다.

고로 필자가 풀려는 `CAP` 머신에 접속하기 위해서는 `Machines`에 접속해야한다.

![openvpnvspwnbox](https://github.com/user-attachments/assets/d036c091-ec1d-4ae6-8fff-7d606a22b6aa)

들어가보면 이렇게 `OpenVPN`을 이용하여 머신에 접속할지 `Pwnbox`를 이용하여 접속할지에 대해 선택하게 한다.

`OpenVPN`은 말 그대로 openvpn을 이용하여 cli로 접속하여 문제를 푸는거고 `Pwnbox`는 `HTB`에서 제공하는 `Parrot Linux`를 이용하여 웹페이지에서 문제를 풀 수 있게 해주는 방식이다.

![Pwnbox](https://github.com/user-attachments/assets/135ca818-ed41-4ce6-8b0c-5a67974b54fd)

필자는 openvpn을 사용하는걸 선호하지만 일단 한번 Pwnbox의 사용법을 보도록 하자.

`Pwnbox`를 선택하여 들어가면 위와 같이 몇 시간동안 사용할 수 있는지 (Hours Left), 서버를 어디로 사용할건지 (Server)에 대해 나와있고 `PWNBOX LOCATION`에서 핑이 얼마나 되는지도 나와있다. 사진에서는 `United States East`로 잡혔고 26ms정도의 핑차이가 있다고 한다.

이 때 시간 제한 없이 사용하거나 커스터마이징을 맘대로 하고 싶다면 VIP 구독을 해야한다.

![VIP](https://github.com/user-attachments/assets/f57c4268-09ac-4db8-88b3-c94cacd2c6f7)

구독하면 본래 여러 사람이 사용하는 머신(문제) 인스턴스를 개인만 사용 할 수 있게 돌릴 수도 있고 그 외의 플랫폼에서 올라온 문제들이나 곧 나온 HTB 랩들을 플레이 해볼 수 있다고 한다.

필요하다면 월 `23,482원` 정도이니 구독 해보는 것도 나쁘지 않을수도?

필자는 일단은 OpenVPN을 이용할 생각이라 일단 무료로 진행해 보고 훗날 필요하다면 그 때 구독하여 사용하겠다.

![you ar not assigned to this vpn server](https://github.com/user-attachments/assets/b6d7c257-137f-4f16-819d-cdb1ba7f8547)

아 그리고 필자도 처음 써보다 보니 알아낸건데 `Pwnbox`에 접속 하려 할 때 위와 같은 오류가 생기기에 뭣이 문제인가 하여 알아보니.

`VPN ACCESS`라는 부분을 보면 지금은 `US Free 2`라고 적혀있다. 근데 접속이 안되네?

그러면 F5를 눌러 다시 들어와 머신을 열고 다시 Pwnbox를 눌러보자.

![Pwnbox online](https://github.com/user-attachments/assets/e6da8042-497e-42b1-96df-141a36119e53)

이렇게 성공적으로 online 되면 성공이다.

![inside desktop](https://github.com/user-attachments/assets/e5fc5706-b18c-4f00-a72b-9f753bf11d6e)

하지만 필자는 느린 것도 그렇고 뭐랄까.. 어쩌피 칼리를 사용하거나 다른 linux를 사용하게 될텐데 그렇다면 이미 필요한 툴들이 깔려있는 칼리를 직접 사용하는 것이 더 좋지 않을까 하여 VMware에 kali를 설치한 뒤 Openvpn을 이용해 접속하는 방식을 사용하도록 하겠다.

참고로 `Pwnbox`를 켰다면 Openvpn을 켜기 전 종료시켜야 한다. [연결 관련 문서](https://help.hackthebox.com/en/articles/5185536-connection-troubleshooting)에도 나와있듯 둘을 동시에 켜면 충돌이나 문제가 생길 수 있다 하니 `TERMINATE CONNECTION`으로 연결을 끊고 시도하자.

![OPenVPN](https://github.com/user-attachments/assets/f47f4fc9-c8ac-43e5-ab2e-edd84ed20969)

이제 `Openvpn`을 이용해 연결할 때 먼저 `Download VPN`을 눌러 VPN을 다운로드 해주자.

![Pending connection](https://github.com/user-attachments/assets/9f121e69-1104-41c0-9679-00f9df3b3d93)

그러고 나면 위와 같이 vpn연결을 기다리고 있다고 하니 창을 띄워놓고 우리는 vmware로 들어가자.

아 물론 vmware뿐 아니라 ventoy를 이용한 liveusb나 듀얼 부팅을 통한 kali, 혹은 직접 툴을 다 깔겠다 하면 ubuntu나 윈도우의 wsl 등을 이용하여도 좋다. 필자는 이렇게 기록을 같이 하게 되기에 아무래도 노트북을 또 켤 수는 없는 노릇이라 vmware를 이용하도록 하겠다.

![kali linux](https://github.com/user-attachments/assets/566c2afa-7de4-47bc-9410-fce99bb3cb65)

이렇게 접속하고 나면 음... 일단 필자는 배경이 눈에 아파 바꾸도록 하겠다.

물론 그 전에 기본 세팅인 `apt update, apt upgrade` 등은 다 하고..

![background](https://github.com/user-attachments/assets/020982e7-6043-4527-ab2d-992d498c9d21)

편안~

![start ssh](https://github.com/user-attachments/assets/3db37c91-a5f4-4627-afc4-616666f14995)

openvpn 파일을 옮기기 위해 ssh 서버를 열고

![scp](https://github.com/user-attachments/assets/86d31ee6-3d12-4da6-a0ae-646c0b46e87a)

`scp` 명령어를 이용해서 넘겨주면 된다.

![openvpn](https://github.com/user-attachments/assets/4258f2f3-3e71-45bb-aaed-79de92a2e7f9)

이렇게 칼리에서 확인할 수 있고 그럼 이제 접속해보자.

![openvpn connect](https://github.com/user-attachments/assets/1ac956a2-ed47-4bda-94cd-c7b1e6bf8141)

![connect to openvpn](https://github.com/user-attachments/assets/797c1e07-f8ae-46da-9ef2-dd5511c44f5f)

자 이제 `ONLINE`이 되었고 이제부터 드디어 박스를 풀 세팅이 끝났다.

그럼 이제 다시 `Join Machine`을 눌러 시작해보자.

## HTB Cap 시작

[CAP](https://app.hackthebox.com/machines/Cap)

처음이기에 `Guided Mode`를 따라가겠다.

### 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

#### Task 1

![Task1](https://github.com/user-attachments/assets/09f721e8-4755-484e-8a17-4c2fba37a3fe)

![nmap 스캔 결과](https://github.com/user-attachments/assets/3dd2d1a7-7812-4c24-acc6-e3d1e2a5f017)

보아하니 21, 22, 80번 포트가 열려있다. 게다가 22번 포트의 결과를 토대로 서버는 리눅스 중 ubuntu로 구성되어있다는 것을 알 수 있다.

고로 정답은 3

#### Task 2

![Task2](https://github.com/user-attachments/assets/29feea68-51e3-4114-9563-6dc0b3069605)

`Security Snapshot`을 실행하고 어떤 주소를 찾으라는데 이걸 위해서는 일단 CAP 머신 스캔에서 보았듯 열려있는 http 서버에 접속할 필요가 있어 보인다.

![접속](https://github.com/user-attachments/assets/f7f85df0-a8ee-4321-bca7-04bea58fca5c)

아하 역시나 여기에 `Security Snapshot` 이라는 페이지가 있다.

![Security Snapshot](https://github.com/user-attachments/assets/036675f2-1efe-41e7-8414-24a0d095d9dd)

접속하고보니 문제에서 말했던 `/[something]/[id]`가 `/data/10` 이라는 것을 알 수 이다.

#### Task 3

![Task3](https://github.com/user-attachments/assets/e9957922-8336-476f-998f-bafafe2b19de)

음... 그니까 지금 `Nathan` 이라는 사람 계정으로 접속해서 `/data/8`(나갔다 들어오니 10에서 바뀜)을 볼 수 있는데 다른 저 `[id]`를 변경해서 다른 사람의 페이지를 볼 수 있는지 물어보는건가?

![힌트3](https://github.com/user-attachments/assets/1359e94d-99f2-411d-8700-aacb3ca51456)

힌트 내용을 보니 맞는거 같다. URL 값을 변경해가며 알 수 있다고 하고 `ffuf`나 `wfuzz`와 같은 툴을 이용할 수 있다고 한다.

![ffuf](https://github.com/user-attachments/assets/b99b04af-aa66-43bd-ad06-02ff3657a741)

이번에는 한번 ffuf를 이용해보았는데 음... 아무래도 gemini가 추천해준 `ffuf -c -u http://10.10.10.245/data/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt` 명령어를 썼으나 너무 오래 걸리기도 하고 지금은 딱 봐도 `/data/id` 이렇게 들어가니까 `id`에는 숫자가 들어갈 텐데 굳이 이렇게 큰 워드 리스트를 쓸 이유가 없다.

실제로 `id`값에 `8`이 아닌 다른 값들을 넣어보면 다른 pcap파일을 다운받을 수 있는 페이지가 나온다 고로 답은 `yes`

#### Task 4

![Task4](https://github.com/user-attachments/assets/8a184f32-7974-4e95-8e25-19fbbe4323f0)

중요한 정보가 담긴 pcap파일이 들어있는 페이지의 `id`는 무엇이냐고 묻는다.

어.. 다 찾아봐야하네?

![8pcap](https://github.com/user-attachments/assets/a6deeb66-5540-4f09-9a47-d9517e1f1c84)

일단 당연하겠지만 바로 보이는 8번은 아니고..

![10pcap](https://github.com/user-attachments/assets/a31637a1-2430-4a31-9b78-3a0333090d5b)

아까 첨에 봤던 10번은 아예 비어있으니..

한번 가장 첫번째 일 것 같은 0번을 봐보자.

![0pcap](https://github.com/user-attachments/assets/3789edee-fb14-4988-86b2-35f070fbfae1)

오?? 이건가? 

![find](https://github.com/user-attachments/assets/eae69b29-8869-4345-af65-b180a42196ce)

읽어보니 FTP 서버에 접속을 하는데 `nathan`이라는 이름과 비밀번호로 `Buck3tH4TF0RM3!` 라고 한다. 아니 뭔 비번이 이렇게 어려워...

일단 문제는 풀었다.

### 초기 침투 (Initial Foothold / Exploitation)

#### Task 5

![Task5](https://github.com/user-attachments/assets/0d824123-1a3b-4576-898a-cea4e2149030)

pcap 파일에서 민감한 데이터가 보이는게 어떤 프로토콜 사용할 때냐고 묻는다.

`FTP`

#### Task 6

![Task6](https://github.com/user-attachments/assets/fb5dd449-8062-44d1-a75b-7410376a67c0)

`nathan의 FTP 비밀번호를 알아냈습니다. 이 비밀번호가 어떤 다른 서비스에서도 작동하나요?` 라는데 우리가 nmap을 이용해 스캔해 보았을 때 현재 비밀번호가 잡힌 `21/ftp`가 있었고 `22/ssh`, `88/http`가 있었다.

그렇다면 혹시 ssh 에서도 같은 비밀번호를?

![Task6](https://github.com/user-attachments/assets/391fc97a-5532-43dc-9d7e-f8e965ea4d93)

이게 되네.

#### Task 7

![Task7](https://github.com/user-attachments/assets/8a668caa-a051-4efc-b292-f476139167d1)

`home` 디렉토리에 있는 파일의 플래그를 읽어서 넣으라고 한다.

![flag](https://github.com/user-attachments/assets/d5b880bc-df03-42bf-a7da-c8899a4fe7fa)

### 권한 상승 (Privilege Escalation)

#### Task 8

![Task8](https://github.com/user-attachments/assets/4f43482a-f878-434e-b22a-6392096f1ab1)

이 머신에서 루트 권한을 얻기 위해 악용될 수 있는 **특별한 기능(capabilities)**을 가진 바이너리(실행 파일)의 전체 경로는 무엇인가요?

라는데... 일단 `capabilities`를 찾기 위한 명령어는 기본적으로 `getcap`이 있다.

그리고 이전 사진에서 보았듯 `linpeas`라는 자동화 스크립트도 있다. [linPEAS](https://github.com/peass-ng/PEASS-ng/tree/master/linPEAS)

일단은 자동화 스크립트보다는 기본 명령어를 사용해서 찾아보자.

![getcap](https://github.com/user-attachments/assets/8c7cddd1-0a54-4bf6-8ed2-81e3c065a86c)

이렇게 결과가 나오게 되었고 이 중 우리가 눈여겨 볼 수 있는 것은 `/usr/bin/python3.8`이다.

- `cap_setuid` : 이 권한이 있는 프로그램은 프로세스의 사용자 ID를 변경할 수 있다. 즉, 일반 사용자로 실행되었더라도 스스로를 루트(UID 0)로 바꿀 수 있는 잠재력을 가지고 있는 것이다. 그리고 그 행위가 바로 권한 상승이다.

- `cap_net_bind_service` : 원래 0번부터 1023번까지의 포트(예:20번 ssh, 80번 HTTP, 443번 HTTPS)는 루트 권한으로만 열 수 있는데, 이 capability가 있으면 일반 사용자도 해당 포트를 사용할 수 있게 된다.

그럼 이번에는 linePeas를 사용해보자. 게다가 이미 누군가 쉘 스크립트를 만들어놨으니 오히려 좋아.

![linpeas](https://github.com/user-attachments/assets/dbfc55b1-99c3-4a8a-82f1-98807ee8db14)

엄... 뭔가 엄청나게 뜨고 그 과정에서 이 머신에 있을 수 있는 CVE나 권한들에 관한 것들도 싹 다 스캔해주는거 좋기는 한데...

![linpeascap](https://github.com/user-attachments/assets/9a0c2a1b-c774-4623-8eb4-49ae172ff2f8)

이렇게 찾아야한다. 그래도 찾았으니 좋았으.

#### Task 9

![task9](https://github.com/user-attachments/assets/336e484a-2aef-45f9-b393-e9f433f6967d)

Cap의 마지막 문제, root로 읽을 수 있는 파일을 읽어서 플래그를 가져다 달라고 한다.

그럼 우리는 python을 이용하면 권한을 상승시킬 수 있다는 것을 알았으니 해보자.

![root](https://github.com/user-attachments/assets/9b23f432-6c49-445f-b38b-4dffd1bdf3c3)

CAP 끝!

[Ending](https://labs.hackthebox.com/achievement/machine/988787/351)

![Rmx](https://github.com/user-attachments/assets/2f5b3dad-7248-45d0-997b-12234d3afa2a)