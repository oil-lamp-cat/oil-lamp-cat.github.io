---
title: "[HTB] Paperwork (Easy_Linux)"
date: 2026-08-23 14:21:00 +09:00
categories: [Security & Hacking, HTB]
tags: [Hack The Box, hacking, RedLabs, Linux]
password: "20260823"
pin: true
---

![Paperwork](https://github.com/user-attachments/assets/5cbcba11-ea6f-497f-8525-41ab662a45a4#.png)

[Paperwork has been Pwned, OilLampCat has successfully pwned Paperwork Machine from Hack The Box](https://labs.hackthebox.com/achievement/machine/988787/921)

## 1. 시작에 앞서

![Paperwork](https://github.com/user-attachments/assets/c87e3627-c5bc-47ba-9641-d8e16d2f523f#.png)

이번 문제는 또또또 지난주에 목이 완전 작살난 후 시즌 문제를 풀다가 기어코 **Bedside**와 **DanglingTree** 문제를 풀지 못하고 잡게된 문제였다.

![progress](https://github.com/user-attachments/assets/679d84c0-338a-4cdd-b8f9-364881f9a919#.png)

흐아.. 진짜 할 수 있을 것 같은데 일단 나중에 다시 덤벼야 겠다는 생각을 하며 머신을 둘러보다 easy linux? 이거라도 할까 싶어 도전해 본 문제이다.

그런데 위에 **User-Rated Difficulty**를 보면 알겠지만 이게... easy이긴 한데 프린터 해킹? 관련 내용을 알지 못한다면 medium으로 갑자기 난이도가 뛰어버리는 그런 문제였다.

특히나 어떤 CVE 내용을 그저 가져다 쓰는 것이 아닌 문제를 풀기 위해선 직접 내용을 이해하고, 코드를 작성해 진행해야 했기에 오랜만에 새로 공부하며 풀기 너무 좋은 문제였다.

## 2. 초기 침투 : 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap](https://github.com/user-attachments/assets/1c1703e6-2a8e-41d0-8960-8232d6d984c1#.png)

매번 그렇듯 일단 htb의 문제는 nmap을 돌려 보는 것으로 시작했다.

정말 간단하게도 **22번**, **80번** 포트만이 보였다. 그렇기에 바로 80번 포트로 접속을 시도해 보았다.

사실 바로 더 넓은 범위의 스캔을 진행은 했지만 그 전에 단서를 찾아버려서 말이지.

![web1](https://github.com/user-attachments/assets/2100ab43-a91c-47ef-a19a-4f2c7388b1d6#.png)

웹에 접속을 해보니 보이는건 **Intake Portal**로 부서의 기록물 및 아카이브 관리를 위한 사내 포털이었다.

써있기론 **Maintenance Advisory**를 보면 

"메인 백엔드 스풀러 관리 콘솔이 오프라인 상태이니 구형 게이트웨이를 통한 수동 접수만 가능하다."

라고 써있었다.

추가적으로 얻을 수 있는 정보는

- Protocoal : RFC 1179, 즉 네트워크 프린터 통신 규격인 LPD(Line Printer Daemon)
- Target Queue : 작업 요청 시 명시해야하는 타겟 큐 이름
- Internal Processor : 프린터 데몬의 소스코드를 다운할 수 있다

그럼 말해 뭐하겠는가? 바로 소스코드 다운받아서 뜯어봐야겠지?

물론 그 전에 dirsearch나 fuff와 같은 툴을 돌려보긴 하겠지만 감지된 것이 없었다.

![source](https://github.com/user-attachments/assets/2494a66a-efb4-49f5-bbc8-170e5e31c5f5#.png)

일단 다운 받아 unzip을 하니 **server.py**라는 소스코드를 발견할 수 있었다.

![source1](https://github.com/user-attachments/assets/f4827b11-8613-48fc-9bf4-b9ca7a05fd7b#.png)

nmap 스캔을 계속 진행 중이었지만 그 전에 소스코드를 통해서 **1515** 포트가 열려있고 이 데몬이 그곳에서 돌아가고 있다는 것을 확인할 수 있었다.

![source2](https://github.com/user-attachments/assets/af1f651b-7c02-4e19-920a-ed0cb9ffaa07#.png)

게다가 `if line.startswith('J'):`라는 조건을 통해서 입력 데이터 중에 'J' 로 시작하는 줄을 찾게 되는데 LPD 프로토콜에서 J는 Job Name을 뜻한다고 하더라.

하지만 그보다 중요한건 그 뒤에 나오는 맨 아래 문장의 `shell=True` 부분이였다!

## 3. 초기 침투 (Initial Foothold / Exploitation)

![ex](https://github.com/user-attachments/assets/cb15eafc-bb71-4da4-9443-79a5414dbed6#.png)

자 그럼 코드를 짜서 진행을 해야겠지?

이번 경우엔 당연하게도 CVE와 같은 것이 아니기에 POC 코드가 없어 직접 진행 해야했다.

exploit 코드는 간단하게 위에서 웹 사이트를 읽으면서 찾은 `queue_name`과 `target_port` 그리고 이름의 시작이 `J`로만 들어가면 shell을 실행시킬 수 있는! 입력 값을 아무런 필터링 없이 `subprocess.Popen`에서 shell 인자에 바로 전달해버렸기에 가능한 취약점 이었다.

왜 base64를 썼냐고 묻는다면 고것은 그냥 했더니 안되서 한번 시도해 본 것이고 다른 부분에 대해 설명을 하자면.

```py
s.sendall(p8(2) + f"{data_len} cfA000localhost\n".encode())
```

이 부분은 LPD 서버에 보내는 통신 규격으로

- **p8(2)** : LPD 프로토콜에서 0x02 즉 Receive control file 을 의미하는 명령 코드
- **data_len** : 보낼 파일 전체 크기
- **cfA000localhost** : 서버에 저장될 컨트롤 파일의 이름인데!

**cfA000localhost** 이놈이 또 처음으로 본 내용이였다.

RFC 1179에서는 컨트롤 파일의 이름은 특정 포맷을 따라야만 했다.

- **cf** : Control File 의 약자, 실제 인쇄하는건 **df**
- **A** : 작업의 우선순위 지정, A-Z 순서
- **000** : 작업 번호
- **localhost** : 프린트 작업을 요청한 호스트의 이름이기에 머신이 보냈다고 해야 프린터가 알아 먹을 듯 했다.

이렇듯 문제를 푸는데 있어 참... 시작부터 새로 공부할 것이 많았다.

이게 Easy?

### 3-1. lp 계정 획득

![실행](https://github.com/user-attachments/assets/13f73f2c-47f0-4865-822f-6efc4721751c#.png)

그렇기에 코드만 잘 만들었다면 간단히 익스플로잇을 진행하여

![rev](https://github.com/user-attachments/assets/f1f83a5d-e43b-4fbd-ad4f-efa5e7d695e4#.png)

간단히 리버스 쉘을 받을 수 있었다.

만.

![archivist](https://github.com/user-attachments/assets/fc521ea6-cc01-4119-ba15-d71e19c95125#.png)

아니 유저 플래그를 얻으러 갔더니 `lp` 계정이 아니라 `archivist` 계정이던게 아니겠는가?

그냥 lp는 서비스 계정일 뿐이었던...

![혹시](https://github.com/user-attachments/assets/0e9ee83e-0a99-4480-83f4-07ed819b3e9d#.png)

혹시 하는 마음에 sudo -l 를 돌려봤지만 당연하게도 있을리는 만무했고.

그럼 이번엔 archivist 계정으로 횡이동(pivoting)을 해야 했다.

![이것 저것](https://github.com/user-attachments/assets/268f0c4d-9de4-469d-8764-395299075556#.png)

이것 저것 찾아보다 내부 네트워크에서 돌고 있는게 뭔가 있지 않을까 싶어 확인해 보았는데 솔직히 개인적으론 뭐가 뭔지 모르겠었다. 그래서 바로 gemini 선생한테 던져주니?

![9100](https://github.com/user-attachments/assets/f810cf42-c2bc-4d33-a0f5-35e2012adae3#.png)

여기서 눈여겨볼 부분이 바로 9100 포트라고 꼭 확인해 보라고 했다.

다른건 `0.0.0.0`으로 외부에서 볼 수 있는 것도 있었는데 내부에서만 볼 수 있는 포트 중엔 저 9100 포트가 바로 네트워크 프린터기에서 쓰이는 포트로 보안 주의사항이 바로 떡하니 보일 정도였다!

![인쇄](https://github.com/user-attachments/assets/8a5b88ec-0f79-4852-8914-1aea32b66e63#.png)

![좀더](https://github.com/user-attachments/assets/1c3f38c1-d7fc-48d6-a2d6-d5a96b8d928d#.png)

그래서 도대체 이 포트가 뭔데? 싶어 이것 저것 더 찾아보니 확실히 프린터 쪽 보안에선 꽤나 유명한 것 같았다.

애초에 이번 문제의 이름도 paperwork겠다. 이쪽을 좀 더 자세히 알아보기로 했다.

### 3-2. 9100 포트

![9100](https://github.com/user-attachments/assets/a75ebb66-26a6-44a4-a455-2436b0948aca#.png)

아예 이 포트의 pentesting 관련 자료를 검색해보면 정말로 자세하게,

![으엑](https://github.com/user-attachments/assets/b11faaf8-b0c9-45d8-a181-93fb53ec3e93#.png)

으엑... 뭔가 엄청 공부할 것이 늘어났다.

![좀더](https://github.com/user-attachments/assets/9919bc30-d568-4358-bce3-1a80a47453e7#.png)

![grep](https://github.com/user-attachments/assets/bc650a7b-db6a-4ec3-8496-545bc1ab9eab#.png)

그래서 aux를 이용해 좀 더 찾아보기 시작했는데

일단 9100포트를 쓰고 있는 친구는 `archivist` 권한으로 실행되고 있는 `jetdirect.py`라는 코드였고, `/home/archivist/printer`안에 들어있어 내가 접속해서 읽어볼 권한이 없었다.

하지만! 오히려 root 권한으로 돌고 있는 `/usr/bin/paperwork-daemon`을 열어서 볼 수 있었다.

![epahs](https://github.com/user-attachments/assets/3242fd4a-5484-4809-be49-4dd668f477a9#.png)
![epahs2](https://github.com/user-attachments/assets/80b73c1c-5359-42ae-a242-2b7a5ee74f13#.png)

그렇기에 소스 코드를 뜯어보면 뭔가 엄청 길게 나오는데 

![code1](https://github.com/user-attachments/assets/c5eba337-694b-48e1-860b-dff449cacef0#.png)

지금 이 코드는 **archivist**의 계정으로 작동 중이었고, **scan_for_malice()** 함수를 보면 데몬은 `commands.log` 파일을 감시하면서 문자열에 `"FSQUERY", "FSUPLOAD", "FSDOWNLOAD"`가 존재하는지 검사한다.

그리고 이 단어들은 9100 포트에서 사용되는 **PJL(Printer Job Language)** 의 시스템 제어 명령어 들이었다.

이게 뭐냐고?

![짜잔](https://github.com/user-attachments/assets/50ca587d-1f90-4c76-9857-7881fca72c80#.png)

짜잔! 또 공부해야 할 것이 늘어났다는 소리다!

[hacktricks/network-services-pentesting/9100-pjl.html#enumeration](https://hacktricks.wiki/en/network-services-pentesting/9100-pjl.html#enumeration)

일단 간단하게 이번 문제와 관련하여 설명을 해보자면

**PJL(Printer Job Language)** 는 프린터한테 "양면 인쇄해", "해상도 높여" 같은 하드웨어 제어 명령을 내리는 언어이다.

그런데 여기서 PJL 프린터 내부 메모리나 파일 시스템을 직접 조작할 수 있는 **FSUPLOAD(파일 업로드)** 나 **FSDOWNLOAD(파일 다운로드)** 같은 명령어들도 존재한다는 점이다.

그럼 여기서 살짝 머리를 굴려보자.

1. 우리가 얻고 싶은 타겟은 `jetdirect.py`를 실행하고 있는 **archivist**이다.
2. root 데몬이 **FSUPLOAD**라는걸 감시 중이라는건? 역설적으로 **9100 포트를 통해 파일 업로드가 구현되어있다!** 라는 뜻일 테고.
3. 그렇다면? 만약에 만약에 나의 SSH public key를 archivist의 홈 디렉토리인 `~/.ssh/authorized_keys`에 넣어버린다면?

근데 또 코드를 자세히 읽었다면 이렇게 생각할 수도 있다.

![code2](https://github.com/user-attachments/assets/a720b901-27ef-4151-9483-b5a407822b9a#.png)

"아니 lockdown이 돌고 있다며? 저걸 실행 시키면 이 데몬이 감지해서 차단 시키는거 아니야?"

반은 맞고 반은 틀렸다.

데몬이 감시를 하며 `jetdirect.py`가 명령을 처리하고 난 뒤에 남기는 `commands.log` 로그 파일을 열어서 **사후 검사**를 한다는 것이다.

즉, 우리가 파일을 올리면 데몬이 어! 안되! 하고 락을 걸겠지만 이미 ssh키는 업로드가 되어버린 상황이 될 것이라는 거다.

어떻게 보면 뺑소니 전략 이랄까. Hit and Run인거지.

### 3-3. Hit and Run

![pub](https://github.com/user-attachments/assets/7d465b70-2381-4490-a5fa-1467602e5abe#.png)

작전은 세워졌으니 바로 실행에 옮겨보자.

먼저 내 로컬(kali)에서 `ssh-keygen`으로 새 키 쌍을 만들어 공개키(public key)를 준비했다.

![pjlinject](https://github.com/user-attachments/assets/964b0235-3b98-4393-a4a0-84416a26ebd6#.png)

그리고 얻었던 lp 계정으로 EOF를 사용해 `tmp`에 위처럼 ssh키를 올려버리기 위한 준비를 해주고 실행 시키면?

![inject](https://github.com/user-attachments/assets/ecc0a47b-c48a-43a1-9fef-4745f8ebf3a4#.png)

이렇게 잘 되었다고 나올텐데 사실 난 여기서 한번 테스트 해보겠다고 바로 명령어로 `FSUPLOAD`를 건들였다가 lock걸려서 머신을 3번인가 정도 리셋을 해야 했다 ㅋㅋㅋ

![ssh](https://github.com/user-attachments/assets/c51dea67-401d-47f6-af4a-51e5afe527f6#.png)

제대로 성공하고 나면 이렇게 **archivist**계정으로 제대로 접속할 수 있게 된다!

![sudo](https://github.com/user-attachments/assets/9f3c5dc0-52b3-421f-a629-ae3047130879#.png)

그리고 혹시 해서 sudo를 써봤지만 물론 안 되었고, 이제야 초기 침투를 완료할 수 있었다.

## 4. 권한 상승 (Privilege Escalation) 

자 이제 여기서 루트 권한을 얻어야 하는데 이전에 `sudo -l`을 했을 때 알다싶이 그걸론 뭘 알 수가 없었다.

대신! 아까 보았던 Lockdown 코드가 떠올랐다.

![code2](https://github.com/user-attachments/assets/a720b901-27ef-4151-9483-b5a407822b9a#.png)

생각해보면 이게 lockdown을 걸 때 `포렌식 조사용 파일(로그 등)을 넘겨줘야지!` 로 이어지는데

그런데 여기서 대참사가 일어난다. 바로 `evidence_bundle` 배열에 `admin_fd`를 같이 묶어서 소켓으로 던져버린 것이다. 
여기서 `admin_fd`가 무엇이냐 하면, 데몬이 켜질 때 root 권한으로 열어둔 **/etc/paperwork/admin_pins.conf (관리자 패스워드가 적힌 파일)의 파일 디스크립터(File Descriptor)** 다!

![code3](https://github.com/user-attachments/assets/c64c9805-05f5-4994-8234-ebfb2846b76f#.png)

이건 위에 전체 코드를 보면 이렇게 써있는 것을 확인할 수 있다.

물론 지금의 나로썬 저 conf 파일을 읽을 수 없었지만 잘만 이 데몬을 이용한다면? 그 안에 들어있는 정보들을 빼내 가져오는게 가능할지도?

### 4-1. 왜 하필 mgmt.sock 인가?

그렇다면 데몬이 이 마스터키 박스를 던져주는 통로는 어디일까? 코드를 더 내려보니 소켓 바인딩 경로가 보인다.

```python
socket_path = "/run/paperwork/mgmt.sock"
s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
s.bind(socket_path)
```

이 데몬은 로컬 UNIX 도메인 소켓인 `/run/paperwork/mgmt.sock`을 열고 귀를 기울이고 있다. 즉, 우리가 이 소켓에 접속해야만 데몬이 던져주는 마스터키를 받아낼 수 있다.

근데 왜 lp 계정일 때는 이걸 안 했냐고? 
이 소켓 파일의 권한을 조회해 보면 답이 나온다.

```text
srw-rw---- 1 root archivist 0 Aug 22 00:17 /run/paperwork/mgmt.sock
```

소유 그룹이 **archivist**로 제한되어 있다! lp 계정일 때는 접근 권한(Permission Denied) 때문에 이 소켓을 건드릴 수조차 없었기에, 9100 포트로 뺑소니를 쳐서 굳이 archivist로 먼저 횡이동을 해야만 했던 것이다. 

자 이제 준비는 끝났고 어떻게 진행할지 대충 정리가 되었으니 이제 당당하게 이 소켓을 털 차례다.

### 4-2. 루트 권한을 위한 exploit 코드 짜기

![mgsock](https://github.com/user-attachments/assets/741b4b5e-f6b3-4b69-9054-38c0a97d01d3#.png)

이 모든 원리(아마도?)를 알았으니 공격 시나리오는 명확하다.

1. **9100 포트**에 다시 한번 `FSQUERY`를 던져 로그를 오염시킨다. (데몬이 "앗 침해사고다! 락다운!"을 외치게 만듦)
2. 데몬이 허둥지둥 락다운을 걸며 마스터키를 던지기 전에, 우리는 **`mgmt.sock`**에 칼같이 연결해서 대기한다.
3. 소켓 버퍼를 통해 날아온 데이터에서 파일 디스크립터(FD)를 쏙 빼낸다.
4. 가로챈 FD를 가지고 `os.pread()`로 파일 내용을 메모리에서 강제로 읽어와 화면에 출력한다.

라곤 했지만 쩝... 코드를 짜는게 여간 헷갈려야지...

난 여기서 7번 이상 머신을 리셋했다.

코드를 테스트 해본답시고 잘못 짠걸, 그러니까 한 번호씩 코드를 짜고 실행해보고를 반복하니 그 때 마다 소켓 연결도 안 됐는데 이미 락이 걸려버려 데이터가 안왔던 ㅋㅋㅋ

![autorun](https://github.com/user-attachments/assets/9907eb2f-cb10-4671-b6ce-f788cc7ca62d#.png)

그렇게 내가 짜고 ai모델이 정리해주고를 반복하며 완성된 최종 코드는 위와 같다.

내가 socket 통신이라던가 데몬에 어떻게 접근해야하는지, 그리고 이번에 진행했던 취약점들을 어떻게 사용해야하는지 등 기본 지식도 없었던 터라 아무래도 위 코드가 좀 이상할 수도 있을 터다.

~~솔직히 직접 코드를 짜보고 싶었기에 틀린 부분과 주석만 달라고 시켜서 오래 걸렸... 그냥 있는 도구는 씁시다 우리.~~

![code5](https://github.com/user-attachments/assets/ae40683d-4be0-46ae-bff3-a7121fb52ef0#.png)

그래도 제대로 실행만 된다면!! 위처럼 adminpassword가 출력될 것이고

![sudo](https://github.com/user-attachments/assets/352efd1d-a8fd-4946-b836-d86e9e16927d#.png)

이렇게!! su root를 이용해 최고 관리자 권한을 획득할 수 있었다.

## 마치며

![Paperwork](https://github.com/user-attachments/assets/698ecd3d-48fb-499e-87c3-f1f385bfa50a#.png)

이번 문제는 평소와 같이 CVE를 쓰거나 bloodhound, linpeas와 같은 자동화 툴을 쓰는 것이 아니라 정말로 소스 코드를 분석하고 내가 그에 대응하는 코드를 작성하여 진행을 했어야 했다.

분명 easy 난이도라고 했지만 이전의 다른 문제들처럼 시시하다던가, 화나는 easy 문제가 아닌 정말 그럴듯하고, htb에 사람들이 rating을 한걸 보면 medium이 꽤나 높던데 정말 재밌게 풀었던 문제였다.

medium을 피하려다 medium급 easy 난이도를 만나버린~~

내가 아직도 못푼 두 문제 **Bedside**나 **DanglingTree**가 있긴 한데 이것들은 나중에 꼭 풀어봐야겠다.


그리고 가능하면 이번 문제의 경우엔 다음번이라도 redlabs에서 한번 발표를 해보는 것도 좋을 것 같다.

그럼 Happy Hacking이다!