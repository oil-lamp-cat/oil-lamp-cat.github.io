---
title: "[HTB] TombWatcher (Medium_Windows)"
date: 2025-10-19 13:26:43 +09:00
categories: [hacking, saturnx operators, windows]
tags: [Hack The Box]
---

[TombWatcher has been Pwned!](https://labs.hackthebox.com/achievement/machine/988787/664)

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

## 권한 상승 (Privilege Escalation) 1

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


## 권한 상승 (Privilege Escalation) 2

![vurln](https://github.com/user-attachments/assets/9ac83c8e-2a2e-4f6b-9139-1ecbcd9aec9b)

다시 시작하며 위 이미지에서 스캔 결과를 보면 알 수 있듯 `Certificate Authority`는 `tombwatcher-CA-1`이고 이상하게도 SID가 `S-1-5-21-1392491010-1358638721-2126982587-1111`인 객체를 찾지 못하였다고 한다.

```json
"17": {
    "Template Name": "WebServer",
    "Display Name": "Web Server",
    "Certificate Authorities": [
    "tombwatcher-CA-1"
    ],
    "Enabled": true,
    "Client Authentication": false,
    "Enrollment Agent": false,
    "Any Purpose": false,
    "Enrollee Supplies Subject": true,
    "Certificate Name Flag": [
    1
    ],
    "Extended Key Usage": [
    "Server Authentication"
    ],
    "Requires Manager Approval": false,
    "Requires Key Archival": false,
    "Authorized Signatures Required": 0,
    "Schema Version": 1,
    "Validity Period": "2 years",
    "Renewal Period": "6 weeks",
    "Minimum RSA Key Length": 2048,
    "Template Created": "2024-11-16 00:57:49+00:00",
    "Template Last Modified": "2024-11-16 17:07:26+00:00",
    "Permissions": {
    "Enrollment Permissions": {
        "Enrollment Rights": [
        "TOMBWATCHER.HTB\\Domain Admins",
        "TOMBWATCHER.HTB\\Enterprise Admins",
        "S-1-5-21-1392491010-1358638721-2126982587-1111"
        ]
    },
    "Object Control Permissions": {
        "Owner": "TOMBWATCHER.HTB\\Enterprise Admins",
        "Full Control Principals": [
        "TOMBWATCHER.HTB\\Domain Admins",
        "TOMBWATCHER.HTB\\Enterprise Admins"
        ],
        "Write Owner Principals": [
        "TOMBWATCHER.HTB\\Domain Admins",
        "TOMBWATCHER.HTB\\Enterprise Admins"
        ],
        "Write Dacl Principals": [
        "TOMBWATCHER.HTB\\Domain Admins",
        "TOMBWATCHER.HTB\\Enterprise Admins"
        ],
        "Write Property Enroll": [
        "TOMBWATCHER.HTB\\Domain Admins",
        "TOMBWATCHER.HTB\\Enterprise Admins",
        "S-1-5-21-1392491010-1358638721-2126982587-1111"
        ]
    }
    }
},
```

그리고 위에서 말했듯 SID가 `S-1-5-21-1392491010-1358638721-2126982587-1111`인 객체를 갖고 있는 `WebServer`라는 템플릿을 찾을 수 있다. 

여기서 난 이전에 했던 것 처럼 `[*] Remarks` 부분에 취약한 것에 대해 써있을 줄 알았는데 이번에는 없었다. 오히려 ESC2와 ESC3에 대한 내용이 나와있었다. 찾아보니 지금 스캔한 `John`이라는 유저로는 저 SID의 권한을 가진게 아니라 그것에 대한 내용은 없을 것이라 한다.

일단 위 JSON 결과에서 중요한 부분을 보자면,

1. Enabled : **True** (활성화됨)
2. Certificate Authorities : **tombwatcher-CA-1** (발급 가능 CA)
3. Enrollee Supplies Subject : **true** -> [ESC1](https://www.레드팀.com/privilege-escalation/ad/adcs/esc1) 가능, [ADCS의 취약한 인증서 템플릿 구성을 통한 ESC1 공격기술(Offensive Technique)](https://www.igloo.co.kr/security-information/adcs%EC%9D%98-%EC%B7%A8%EC%95%BD%ED%95%9C-%EC%9D%B8%EC%A6%9D%EC%84%9C-%ED%85%9C%ED%94%8C%EB%A6%BF-%EA%B5%AC%EC%84%B1%EC%9D%84-%ED%86%B5%ED%95%9C-esc1-%EA%B3%B5%EA%B2%A9%EA%B8%B0%EC%88%A0offensive-tec/)
4. Requires Manager Approval : False (관리자 승인 불필요)
5. Authorized Signatures Required: O (추가 서명 불필요)

그렇다면 우리는 `ESC1`을 이용하여 이 템플릿을 쓰고 싶다만.. 이 템플릿은 `S-1-5...` 객체에게 할당된 것인지라 `john`에게는 템플릿을 직접 등록할 권한이 없다.

대신 우리는 `ADCS` OU에 대한 `GenericAll` 권한이 있음으로 `WebServer` 템플릿의 `ACL(접근 제어 목록)`을 수정하는 [ESC4](https://www.rbtsec.com/blog/active-directory-certificate-services-adcs-esc4/) 공격을 먼저 진행하는 것이다.

### ESC4 -> ESC1?

진행하기에 앞서 위에서 찾은 이상한 객체에 대해 bloodhound로 찾아보자.

![bloodhound sid](https://github.com/user-attachments/assets/f741cb43-8db5-411d-97e2-f91f874e640f)

역시 위에서 보았듯 `WebServer` 템플릿에 포함되어있다. 그런데 이름이 아니라 이렇게 이상한 SID로 표시된다는 것은 이것이 삭제된 계정이라는 것이다. 그럼 이 객체를 부활시켜야겠지?

![certutil](https://github.com/user-attachments/assets/1d78fbfc-31ac-401f-a762-ca358bc00193)

evilwinrm으로 john으로 들어간 후 [certutil](https://reonic.tistory.com/42) 명령어를 사용해 WebServer 템플릿을 읽어보면 당연하게도 등록 권한은 있지만 여전히 사용자의 이름은 표시되지 않는다.

![get-adobject](https://github.com/user-attachments/assets/4bb22181-37f8-4cf5-b762-b770afea162b)

혹시하여 한번 더 확인해봐도 역시는 역시다.

![bin](https://github.com/user-attachments/assets/6522debc-198d-43ed-8630-bdc947a46a1d)

![bin sid](https://github.com/user-attachments/assets/ee92a529-994a-4de5-953e-739c495fb8e2)

그래서 삭제된 내용들을 확인해보니 `cert_admin`이라는 유저가 우리가 찾는 SID를 갖고 있는 것이 확인되었다.

![예토전생](https://github.com/user-attachments/assets/22e2f5a7-bf56-4b11-ab74-e249591ba79e)

무덤에서 끌어내고, 비밀번호를 원하는 걸로(`hithere`)설정 하면!

![부활 실패](https://github.com/user-attachments/assets/610d0b0a-89b6-4169-bde8-65d791880601)

부활에 실패했다. 뭐지?

![부활은 했는데](https://github.com/user-attachments/assets/2ed0ae4a-be9b-40bb-9576-6e91f8c08d88)

부활은 했는데 시체가 사람이 없는 아이러니한 상황...

![why](https://github.com/user-attachments/assets/aea6822c-3e88-4835-93e4-d137f06125c8)

엑.. 비활성화 상태라니, 이런건 또 몰랐지뭐야.

![어...](https://github.com/user-attachments/assets/7cd10f07-a030-4bb7-9e19-09176b94a4fc)

계정이 활성화가 되었는데 못찾는다뇨..?

![ㅇㅎ](https://github.com/user-attachments/assets/28831cf3-41aa-4d6a-99b9-7ccef51f0548)

나의 AD 지식이 짧았다.

![cert_admin](https://github.com/user-attachments/assets/a393a4a5-cb10-44f8-977e-e106d656dd5c)

그렇취!

![드디어..](https://github.com/user-attachments/assets/6b28dbcb-c65b-4f4f-9d56-f6d7d5c0801a)

세상에.. 드디어 확인에 성공했다... 일단 보아하니 winrm은 안되고 smb나 ldap이 활성화 되어있어 확인할 수 있었다. 한번 bloodhound로 봐볼까?

![rescan](https://github.com/user-attachments/assets/033b3e2c-5e1f-4aa1-9966-894982f5a07c)

다시 스캔 후에 확인해보니 이제 `Cert_admin`이라는 유저가 확인되었다.

![아 또..](https://github.com/user-attachments/assets/c1a4b521-cc8f-4c07-99d7-431d978e497f)

설마 했는데 아 또또또 비번이 변경되었다. 아니면 다시 무덤으로 들어갔거나..

![cert_admin certipy](https://github.com/user-attachments/assets/8f33239d-d388-4434-8ddd-4de739e410a6)

설마가 사람 잡는다고 완전 머신이 리셋되었었다. 모든 과정을 다시 하고 나서 다시 실행하니 성공!

```json
{
  "Certificate Authorities": {
    "0": {
      "CA Name": "tombwatcher-CA-1",
      "DNS Name": "DC01.tombwatcher.htb",
      "Certificate Subject": "CN=tombwatcher-CA-1, DC=tombwatcher, DC=htb",
      "Certificate Serial Number": "3428A7FC52C310B2460F8440AA8327AC",
      "Certificate Validity Start": "2024-11-16 00:47:48+00:00",
      "Certificate Validity End": "2123-11-16 00:57:48+00:00",
      "Web Enrollment": {
        "http": {
          "enabled": false
        },
        "https": {
          "enabled": false,
          "channel_binding": null
        }
      },
      "User Specified SAN": "Disabled",
      "Request Disposition": "Issue",
      "Enforce Encryption for Requests": "Enabled",
      "Active Policy": "CertificateAuthority_MicrosoftDefault.Policy",
      "Permissions": {
        "Owner": "TOMBWATCHER.HTB\\Administrators",
        "Access Rights": {
          "1": [
            "TOMBWATCHER.HTB\\Administrators",
            "TOMBWATCHER.HTB\\Domain Admins",
            "TOMBWATCHER.HTB\\Enterprise Admins"
          ],
          "2": [
            "TOMBWATCHER.HTB\\Administrators",
            "TOMBWATCHER.HTB\\Domain Admins",
            "TOMBWATCHER.HTB\\Enterprise Admins"
          ],
          "512": [
            "TOMBWATCHER.HTB\\Authenticated Users"
          ]
        }
      }
    }
  },
  "Certificate Templates": {
    "0": {
      "Template Name": "WebServer",
      "Display Name": "Web Server",
      "Certificate Authorities": [
        "tombwatcher-CA-1"
      ],
      "Enabled": true,
      "Client Authentication": false,
      "Enrollment Agent": false,
      "Any Purpose": false,
      "Enrollee Supplies Subject": true,
      "Certificate Name Flag": [
        1
      ],
      "Extended Key Usage": [
        "Server Authentication"
      ],
      "Requires Manager Approval": false,
      "Requires Key Archival": false,
      "Authorized Signatures Required": 0,
      "Schema Version": 1,
      "Validity Period": "2 years",
      "Renewal Period": "6 weeks",
      "Minimum RSA Key Length": 2048,
      "Template Created": "2024-11-16 00:57:49+00:00",
      "Template Last Modified": "2024-11-16 17:07:26+00:00",
      "Permissions": {
        "Enrollment Permissions": {
          "Enrollment Rights": [
            "TOMBWATCHER.HTB\\Domain Admins",
            "TOMBWATCHER.HTB\\Enterprise Admins",
            "TOMBWATCHER.HTB\\cert_admin"
          ]
        },
        "Object Control Permissions": {
          "Owner": "TOMBWATCHER.HTB\\Enterprise Admins",
          "Full Control Principals": [
            "TOMBWATCHER.HTB\\Domain Admins",
            "TOMBWATCHER.HTB\\Enterprise Admins"
          ],
          "Write Owner Principals": [
            "TOMBWATCHER.HTB\\Domain Admins",
            "TOMBWATCHER.HTB\\Enterprise Admins"
          ],
          "Write Dacl Principals": [
            "TOMBWATCHER.HTB\\Domain Admins",
            "TOMBWATCHER.HTB\\Enterprise Admins"
          ],
          "Write Property Enroll": [
            "TOMBWATCHER.HTB\\Domain Admins",
            "TOMBWATCHER.HTB\\Enterprise Admins",
            "TOMBWATCHER.HTB\\cert_admin"
          ]
        }
      },
      "[+] User Enrollable Principals": [
        "TOMBWATCHER.HTB\\cert_admin"
      ],
      "[!] Vulnerabilities": {
        "ESC15": "Enrollee supplies subject and schema version is 1."
      },
      "[*] Remarks": {
        "ESC15": "Only applicable if the environment has not been patched. See CVE-2024-49019 or the wiki for more details."
      }
    }
  }
}
```

이번에는 인증서가 하나 딱 나왔고 바로 `ESC15`에 취약점이 있다고 한다. [ESC15: Arbitrary Application Policy Injection in V1 Templates (CVE-2024-49019 "EKUwu")](https://github.com/ly4k/Certipy/wiki/06-%E2%80%90-Privilege-Escalation#esc15-arbitrary-application-policy-injection-in-v1-templates-cve-2024-49019-ekuwu)

### ESC15 (EKUwU, CVE-2024-49019)

`ESC15`는 스키마 버전 1로 만들어진 오래된 인증서 템플릿에서 발생하는 보안 취약점으로, 인증서를 요청할 때에 템플릿에 정의되지 않은 `임의의 EKU`를 주입하여 발급 받을 수 있는 취약점이다.

이걸 이용해서 예를 들어 원래 로그인 용이 아닌 템플릿으로 인증서를 요청하면서 "이 인증서는 로그인용(Client Authentication)으로 쓰게 해주세요"라고 요구하면 CA가 그대로 발급해주는 취약점!

### ESC15 - Scenario A

![Scenario A](https://github.com/user-attachments/assets/428ba991-9f99-4f22-a263-63e3fadf80a2)

```shell
┌──(kali㉿kali)-[~]
└─$ certipy-ad req -u 'cert_admin' -p 'hithere' -target '10.10.11.72' -ca 'tombwatcher-CA-1' -template 'WebServer' -upn 'administrator@tombwatcher.htb' -sid 'S-1-5-21-1392491010-1358638721-2126982587-500' -application-policies 'Client Authentication'
```

[ESC15](https://github.com/ly4k/Certipy/wiki/06-%E2%80%90-Privilege-Escalation#esc15-arbitrary-application-policy-injection-in-v1-templates-cve-2024-49019-ekuwu)에 나온 방법 중 `시나리오 A`를 따라하여 진행했고 성공적이었다만.. `ldap`만을 이용해야하는 만큼 파일을 읽거나 하는 쉘을 얻어낼 수가 없었다.

아니 없는 줄 알았다...

![이게 되네](https://github.com/user-attachments/assets/3cc5f031-fe4a-481d-a54d-4659d1c257b6)

아니 writeup에서는 다들 이거 안된다고 한거야!!! `ldap 쉘`에서 admin의 비밀번호 바꿔서 들어가버리면 되네... 생각해보니 이걸 왜 시도 안 했지? 허허.. 시나리오 B가 정배인 줄 알았는데 A가 정배였던 아이러니한 상황... 그래도 공부 많이 했으니까.

정문이 아니라 쪽문인줄 알고 옆으로 돌아서 함정피해 갔는데 거기가 쪽문이고 원래 갔던 곳이 정문이었던 건에 대하여.

![심지어](https://github.com/user-attachments/assets/ad18bfba-cb24-413f-8daf-18a3a4c859cb)

심지어 진짜 권한 문제도 없어서 모든 파일 보고 할 수 있다.

### ESC15 - Scenario B

공격자가 `ESC1에 취약한 템플릿(WebServer)`에 직접 등록할 권한이 없을 때 사용한다. 대신, 공격자가 자신이 등록 권한을 가진 다른 V1 템플릿을 찾아네 취약점을 이용해 "인증서 요청 에이전트(Enrollment Agent)" 인증서를 발급받고 이 에이전트 인증서를 이용해 다른 사용자(여기선 Admin)을 대신해 인증서를 요철할 수 있다는 것!

![get cert agent](https://github.com/user-attachments/assets/873fd010-fb53-4258-aaca-b47d329cd978)

`cert_admin`은 WebServer 템플릿에 `등록(Enroll)권한`이 있는데다 템플릿이 `스키마 버전 1`이기에 공격이 가능하다.

`cert_admin` 사용자로 `Webserver` 템플릿으로 인증서를 요청하면서 `-application-policies 'Certificate Request Agent'` 옵션을 통해 원래 템플릿에 없는 인증서 요청 에이전트 EKU를 주입한다.

그러면 CA가 이 요청을 옳다고 받아들여 `cert_admin`에게 `Enrollment Agent` 권한을 가진 인증서(cert_admin.pfx)를 발급하게 된다.

그럼 이제 이걸 이용해 대리 출석이 가능해진 샘.

![get admin .pfx](https://github.com/user-attachments/assets/b1695def-5307-45f0-86a3-080f018e7445)

이제 administrator에 대리출석을 해야 하는데 이 때 사용할 것은 `WebServer` 템플릿이 아니라 `User` 템플릿을 사용할 것이다.

왜? `certipy find` 결과를 보면 `User` 템플릿에서 `Client Authentication` 이 True로 되어있기에 WebServer 템플릿과 달리 로그인 인증에 쓸 수 있기 때문이다.

게다가 `Enrollee Supplies Subject = false`로 되어있기에 `-on-behalf-of` 즉 누가 대신해서 인증서를 요청할지를 막지 않기 때문에 쓸 수 있다.

이번 과정은 [ESC3](https://learn.microsoft.com/ko-kr/defender-for-identity/security-assessment-edit-misconfigured-enrollment-agent)를 악용하는 것이라 한다.

위 이미지에서 볼 수 있듯 성공적으로 SID값이 어드민으로 설정된 것을 볼 수 있다.

![got admin hash](https://github.com/user-attachments/assets/a5e63468-d5ba-45b7-97f2-f7f3aee2f904)

이후 얻어낸 관리자 인증서 신분증을 이용해 kerberos 인증(PKINIT)을 통해 관리자의 TGT(Ticket Granting Ticket)를 성공적으로 발급받고 관리자의 NTLM 해시까지 획득할 수 있었다.

![got root flag](https://github.com/user-attachments/assets/ae9063a1-73b2-4ad1-b33a-3c667181dd3e)

루트 플래그 획득에 성공했다!

## 마치며

![Pwned](https://github.com/user-attachments/assets/f4160574-3d68-4ab4-9e7f-fbad09b158a9)

이번에는 처음으로 Medium 난이도에 도전해보았다. 애초에 리눅스로 미디움 난이도를 접근해도 어려울 탠데 윈도우로 시도해본 이유라면..

이미 이전에 easy난이도인 AD문제를 풀었었고 그러다보니 흥미가 생겼달까? 근데 이렇게 되니 오히려 이제는 리눅스 문제 푸는 법을 까먹고 있는 듯한 느낌도 들어 다음번엔 리눅스 문제 하나 풀어야겠다. 어쩌면 주말에 풀 수도 있고.

![stars](https://github.com/user-attachments/assets/ad765a99-f229-405b-9747-c88832d303f9)

이번 문제 풀 때에는 분명 user flag를 얻는 과정 자체는 진짜 처음이지만 4시간 안에 풀 수 있을 정도로 과정이 간단했다고 생각한다. 정작 풀 때는 이게 뭔 소리냐 하며 공부하며 풀긴 했지만, 뭐랄까.. 이후 root flag를 얻기 위해 인증서 관련 내용을 진행하고 또또또 처음보는 개념들을 공부해가며 진행하니 거진 3일동안 별에별 인터넷에 있는 모든 writeup을 읽어보고 공식 youtube도 봐가면서도 이해가 안가 인공지능과 하루종일 이야기하고 조사하다 드디어 끝을 볼 수 있었다.

물론 이해안하고 풀기만 진행한다면, 어쩌면 하루로 충분할지도 모르겠다. 복사 붙여넣기 작업일테니까. 근데 난 공부하는 입장이고 솔직히 훗날 OSCP 자격증 따는걸 목표로 공부하는 것이기도 하니까, 궁금한 것들이나 이해가 안가는 것들은 지금에 바로 해소하며 진행하는게 좋겠지.

결국엔 휴가 기간 동안에 해냈다는 것!

좀 더 정리하긴 해야겠지만 일단 오늘은 여기서 끝내도록 하겠다. 물론 이후 발표자료 준비하면서 꽤나 많은 부분이 더 서술되거나 잘못 생각해 썼던 부분들이 바뀔지도? 안 바뀔지도?

> 2025-10-22-23-39

아니.. 이래서 알 수록 더 보인달까.. 답지만 보고 문제를 풀면 생기는 문제랄까.. 아무리 생각해도 시나리오 A에서 `ldap` 쉘을 얻었을 때에 더이상 할 수 있는게 없다고들 하기에 넘겼는데 가만 생각해보니 이상해서 좀 조사해서 시도해보니 잘 되네.. 비번 바꾸기 해버리면 되는거잖아.. 왜 안 된다는거야. 다들 문제풀이할 때에 어쩌면 답지만 보고 블로그에 옮겨 적곤 하여 이런 상황이 발생한 것 같은데, 심지어는 이러면 공식 유튜브의 writeup도 잘못된건가? x_- 음.. 이건 이후에 Saturnx operators 발표할 때에 이야기 해봐야겠다.