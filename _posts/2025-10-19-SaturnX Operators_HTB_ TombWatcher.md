---
title: "[HTB] TombWatcher (Medium_Windows)"
date: 2025-10-19 13:26:43 +09:00
categories: [hacking, saturnx operators, windows]
tags: [Hack The Box]
pin: true
---

## 시작에 앞서

![TombWatcher_windows](https://github.com/user-attachments/assets/82524851-9f3b-4c79-bfa1-fed6dcafed62)

이번에도 윈도우 환경이며 리타이어된 머신이다.

다만 가이드 모드가 없으며 평소에 풀던 `Easy`가 아닌 `Medium` 난이도 이기에 어떨련지는...

## 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![account](https://github.com/user-attachments/assets/8a7d7354-1452-42d5-aef6-49edea43d77b)

일단 저번과 동일하게 하나의 계정을 알려준다.

- account: henry / H3nry_987TGV!

### nmap 결과

![nmap result](https://github.com/user-attachments/assets/ed40d708-1d1c-4fe6-9aae-1f13630f7a65)

아 그리고 뭘 하기 전에 도메인을 넣어주자.

![Domain setting](https://github.com/user-attachments/assets/3c4253e5-43ce-49de-9e98-3d5780977f7d)

보아하니 80번 포트가 열려있어 한번 들어가보고자 한다. 물론 DC 서버다 보니 뭔가 있을 것 같지는 않지만.

![80 port](https://github.com/user-attachments/assets/9a6a96ef-a968-41ce-a46d-baeb6bb2f72b)

음.. 역시 뭔가 특별한 것은 없어보인다. 보통의 Microsoft 서버라면 가지고 있을 부분이라는데.

혹시 저번처럼 또 smb 파일을 이용해 할 수 있는 것이 있지 않을까?

![nxc result fail](https://github.com/user-attachments/assets/aaf3704e-f166-484a-8245-495647fdd1e3)

음..? 유저인거 까지는 확인이 되는데 왜 `smb`파일을 확인할 수가 없지?

![nxc result success](https://github.com/user-attachments/assets/41787e46-59d6-45c5-ba96-d0f196095d34)

머부분 버그다. 근데 여기서 우리가 권한이 있는 파일은 없으니 블러드 하운드를 이용해야겠지?

![kerberos Error](https://github.com/user-attachments/assets/1edfd426-8414-443f-b161-f989754922ce)

아 이노므 `kerberos clock error`

![bloodhound-ce](https://github.com/user-attachments/assets/c2b085ef-4d0f-4b25-a015-c5ba7e360396)

`bloodhound-ce`버전을 이용했으며 참고로 커버로스 시간 동기화 할 때에 나는 `sudo systemctl stop systemd-timesyncd`으로 시간을 멈춰놓고 `sudo ntpdate <IP>`로 설정해야 되더라.

## 초기 침투 (Initial Foothold / Exploitation)

분석에 앞서 다시한번 말하지만 필자는 아직도 DC에서 권한에 대한 내용이나 블러드 하운드를 사용하는데 있어 잘 알지 못하기에 틀린 부분이 있을 수 있다는점!

다만 요즘에는 Gemini가 잘 알려줘서 공부하기 매우 좋다!

![full path henry to john](https://github.com/user-attachments/assets/750b2c86-8f90-4645-a62d-38e3faac2e54)

일단 위 과정이 gemini가 알려준 공격 경로이고 하나씩 짚어가며 이해해보자.

![bloodhound-ce cypher](https://github.com/user-attachments/assets/7cb76b5a-cee2-401c-9258-2a7d94786e84)


그리고 알아보니 애초에 `bloodhound-CE`의 `CYPHER`기능을 이용하면 `Shortest paths from Owned objects`라는 쿼리를 사용해 이 DC를 습득할 수 있는 가장 최단 거리를 보여주기도 한다.

![how to pen](https://github.com/user-attachments/assets/57d06e21-24f7-41f2-8406-fd3a1c64e63b)

심지어 두 노드 사이에 있는 태그를 누르면 어떻게 공격을 이어갈지에 대해서도 나온다니!!! 난 이걸 몰라서 2시간동안 인터넷을 뒤지다 못찾아 도움을 요청해 배웠다. 이런 기능이 있을 줄이야.. 난 내가 쓴게 sharphound가 아니라 그런 줄 알았지 뭐람..

### henry -> alfred

![henry to alfred](https://github.com/user-attachments/assets/570a7c28-b6e2-4138-a6d6-96f431d24a1d)

`henry`유저에서 볼 수 있는 것들을 전부 찾아보니 `alfred`라는 유저에게 `WriteSPN(서비스 주체 이름 쓰기)`이라는 권한이 존재하는 것을 확인했다.

다음으로 넘어가기 앞서 SPN의 개념을 잡고 가자.

#### SPN(Service Principal Name) 이란?

**사람**에게 `주민등록번호`가 있고, **AD 유저**에게 `SID`가 있다면, **서비스(ex. 웹 서버, SQL 데이터 베이스)** 에는 `SPN`이 존재한다.

예를 들어 `fileserver.tomwatcher.htb`에 접속한다고 했을 때에 도메인 컨트롤러에게 "나 fileserver에 접속할 거니까 인증 티켓 좀 주세요"라고 요청을 보내면 DC는 서비스의 SPN을 보고 "fileserver에는 FILESVR01이라는 계정이 운영 하는구나"하고 암호화된 티켓을 발급해주게 된다.

근데 지금 들어보면 분명히 `서비스`라고 했는데 이 블러드 하운드 결과에서는 `사람`계정이 권한을 가지고 있네?

#### WriteSPN (SPN 쓰기 권한) 이란?

말 그대로 SPN 속성값을 수정(추가, 삭제, 변경)할 수 있는 권한이다.

그럼 이제 이걸 악용해보자.

![abuse](https://github.com/user-attachments/assets/9e31f01f-388a-4e38-8257-9cccdd79944c)

방법은 우측 Abuse에 쓰여있듯 `targetedKerberoast.py`라는 도구를 이용하면 직접 하나씩 할 필요 없이 진행할 수 있다고 한다.

솔직히 말해서 필자는 이거 하기 전에 몰라서 하나씩 직접 진행했었고 이후 하다가 막혀서 찾다보니 이런 좋은 방법이 있다는 사실을 알아버렸다는 것...

![get hash](https://github.com/user-attachments/assets/687e78f1-d3a8-4bab-8246-ecd75ff67d01)

자 해시를 얻었으니 크래킹을 해야겠지?

![hashcat result](https://github.com/user-attachments/assets/767416fd-91b3-49f0-9264-bea8f7aba59b)

중간 과정을 날려먹어서 일단 경과만 보여주자면 난 `hashcat`을 이용해 진행했고 암호는 `basketball`이다. 와 암호학의 세계란... 이떻게 저리 짧은게 저리 길어진다냐..

### alfred -> INFRASTRUCTURE

![full path henry to john](https://github.com/user-attachments/assets/750b2c86-8f90-4645-a62d-38e3faac2e54)

이건 뭐.. 간단하게 `AddSelf` 권한이 있으니 그저 넣어주면 된다.

![add mem](https://github.com/user-attachments/assets/3527a75a-cbbf-4d50-a702-f207bf3d328b)

### INFRASTRUCTURE -> ansible_dev$

이미 `infrastructure` 그룹의 권한을 갖고 있기에 바로 `ansible_dev$`의 해시를 읽을 수 있다.

하지만 그 전에 gMSA란 무엇일까?

#### gMSA (Group Managed Service Account)

정의는 이름에서 알 수 있듯 `그룹 관리 서비스 계정`이지만 도메인에서 자동으로 사용하는 무인 계정이다.

도메인 컨트롤러가 자동으로 암호를 생성하고 주기적으로 변경하기에 정해져 있는 암호가 없다만 대신 DC에서 이 gMSA 계정의 암호 해시를 읽을 수 있는 특정 컴퓨터나 그룹을 지정해 놓는다.

그리고 여기서 그 그룹이 바로 `INFRASTRUCTURE` 그룹이었던 것!

이번에도 bloodhound abuse에서 알려준 [gMSADumper.py](https://github.com/micahvandeusen/gMSADumper)를 이용하겠다.

![gMSADumper](https://github.com/user-attachments/assets/ea2cb28a-aca3-43f9-89e2-efcb31e34052)

그세 시간 좀 지났다고 잘 안될 때가 있는데 그러면 다시 시도해주면 된다.

### ansible_dev$ -> sam

세상에 이번에는 심지어 `ForceChangePassword`권한 즉 강제 비밀번호 변경 권한이 있다.

![forcechangepassword](https://github.com/user-attachments/assets/f55e1c79-1940-4757-8e20-2a979950554d)

짜잔, 비밀번호가 `1234hithere`가 되었답니다!

### sam -> john

이번에는 `WriteOwner` 권한이다. 어... 그니까 누구든 주인으로 만들 수 있는 권한이랄까?

![owner](https://github.com/user-attachments/assets/47bbd1e2-0906-416b-903a-31dc773a87c0)

주인 설정 해주고,

![set generic all](https://github.com/user-attachments/assets/ef808f9e-4b35-485a-9c6b-a4351322176c)

Generic all 권한 설정 해주고,

![change password](https://github.com/user-attachments/assets/47b8712b-311e-4ad9-aa93-4430660a9dcd)

비번까지 바꿔주면?

![get user flag!](https://github.com/user-attachments/assets/691d7bac-c2d6-4ab8-83a7-60b32a640c52)

![submit user flag!](https://github.com/user-attachments/assets/2d66cd08-0b87-433a-827a-a15c5ce4d418)

유저 플래그 획득 성공!

## 왜 굳이 JOHN 이었나?

![memberof1](https://github.com/user-attachments/assets/5284f97f-4f98-40d8-be5f-0f697feb8a69)

![memberof2](https://github.com/user-attachments/assets/da33347c-348e-433d-bcb7-39b7083c007e)

사실 이건 내가 죽 고민하고 있던 문제였다. 왜 굳이 다른 유저도 아니고 JOHN을 목표로 잡고 접근하기 위해 그리 애를 썼을까?

근데 가만 생각해보면 정말 간단한 문제였던 거다.

`REMOTE MANAGEMENT USERS` 즉 원격 접속 권한이 있는 그룹의 맴버가 `JOHN`밖에 없거든.

뭔가 이제 두번째쯤 풀어보니 윈도우에서 어떤 것을 목표로 잡고 침투를 시작하는지. 그리고 왜 그 목표인지 등이 좀 더 명확하게 와닿는다.

## 권한 상승 (Privilege Escalation)

유저 플래그를 획득했으니 이제 우리가 가진 `JOHN`을 이용해서 어떤 것을 할 수 있을지 확인해 봐야한다.

![John outbound](https://github.com/user-attachments/assets/78077385-88c7-4a90-a294-4d2e251aa3a9)

보아하니 `JOHN`은 `ADCS OU (Active Directory Certificate Services Organizational Unit)`에 대해 `GenericAll`권한을 가지고 있어 뭐든 할 수 있는 상태라고 한다.

저번에 그랬듯 인증서 관련 이니까 `certipy`를 이용해야할까?

![why cant](https://github.com/user-attachments/assets/d0dbfd65-192e-4add-a8b2-ee6663eb849b)

여기서부터는 또 모르겠어서 잠시 gemini에게 물어보며 진행하려 했는데 이상하게도 자꾸 다른 라이트업들과는 다른 소리를 하기 시작했다. 그래서 뭐가 문제인고 하니 다른 사람들은 분명히 `bloodhound`에서 제대로 정보를 수집하여 추가적으로 있어야 하는 정보가 내게는 없었던 상황이었다. 그래서 혹시 하는 마음에 유저를 바꿔보기도 하며 여러 스캔을 진행하였지만 여전히 인증서에 관한 내용은 찾아볼 수도 없었다.

![rusthound](https://github.com/user-attachments/assets/505a2ed3-aacb-42c3-be01-f60e78bd9434)

그나마 [RustHound-CE](https://github.com/g0h4n/RustHound-CE)를 이용하였을 때에 좀 더 많은 정보를 얻을 수는 있었으나 이번엔 또 뭐가 문제인지 `1 File(s) failed to ingest as JSON Content`라며 오류가 발생하기도 했는 줄 알았는데!!

![works](https://github.com/user-attachments/assets/71b842ab-9026-4111-b87e-9dd19bb7d091)

일단 잘 뜨는 것을 확인했다. 만.. 솔직히 저거 봐도 뭐가 뭔지 모르겠고 애초에 ADCS랑 관련이 있는 건지도 모르겠다.

![certify try](https://github.com/user-attachments/assets/ba09444e-1d31-4836-a468-2d04cb2efed1)

고로 우리는 본래 하려던 `certipy-ad`를 이용하기로 하자.

![vurln](https://github.com/user-attachments/assets/9ac83c8e-2a2e-4f6b-9139-1ecbcd9aec9b)

취약점을 찾기 위해 결과 .txt 파일을 gemini에게 넘겨줬다. 이럴 때 쓰라고 있는게 인공지능이니까 말이지.

음.. 근데 좀 내용이 이상하다. 템플릿 등록 권한이 기본 관리자 그룹 외에 사용자에게 부여되었다는 것 까지는 이해를 했는데 그게 `John`이라고 하는건 아마 내가 질문할 때에 언급한 것 때문일 것이다.

우리가 여기서 눈여겨 봐야할 내용은 어떤 사용자(SID)가 있고 그 사용자에게 있어서는 안되는 등록 권한이 존재한다는 이야기이다.

그러니 이제부터 진행할 것은 다음과 같다.

1. John의 권한으로 `WebServer` 템플릿에 등록 권한을 추가하고,
2. 이제 John에게도 권한이 생겼으니 Administrator를 사칭하는 인증서를 요청해서,
3. TGT 요청해 생긴 캐시로 접속하면 끝

과정은 `ESC4(템플릿 제어권 획득)`에서 `ESC1(관리자 사칭 인증서 발급)`이 되겠다.

> 2025-10-19 23 29 졸려서 오늘은 여기까지

## 마치며

