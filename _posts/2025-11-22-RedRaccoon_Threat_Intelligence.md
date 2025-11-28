---
title: "[Red Raccoon] Threat Intelligence - CEO 사칭 내부 피싱 사건 • 공격자 인프라를 추적하라"
date: 2025-11-22 09:14:43 +09:00
categories: [hacking, Red Raccoon]
tags: [Threat Intelligence]
pin: true
---

> 2025-11-24, 아래는 발표 자료. 하지만 뭔가 보고서 작성하면서 더 깊게 공부하게 될 듯한 느낌? 그리고 지금 내용은 뭐랄까... 문제풀이에 치중되어 적은 듯한 느낌이라 좀더 확실히 TI에 대해 알아보고 공부하면서 보고서를 작성해봐야겠다. 그래도 진짜 재밌었으니 한잔해!

[Red Raccoon_Threat Intelligence.pptx](https://github.com/user-attachments/files/23723835/Red.Raccoon_Threat.Intelligence.pptx)


> 2025-11-28, 보고서를 완성했다! 내가 만든건 처음이기에 현직자들이 보는 보고서와는 차원이 다르게 미약할 것이다. 하지만 그럼에도 난 처음으로 누구의 도움도 없이 보고서를 만들어봤다. 물론 이번에도 당연히 실제 보고서들을 많이 찾아보며 만들긴 했지만 애시당초 ms word를 쓰는게 첨이기도 해서 꾸미거나 하진 못했다(공대생이라 그렇다는 나쁜 말은 쉿). 다시한번 문제를 만들어주신 redraccoon의 그루트 님께 감사를! 다른 문제들은 어떤게 나올지 기대가 된다!

[RaccoonCoin CEO 사칭 피싱 및 공격자 인프라 역추적 보고서 _ Threat Intelligence Report _ 호롱고양이.pdf](https://github.com/user-attachments/files/23824987/RaccoonCoin.CEO._.Threat.Intelligence.Report._.pdf)

## 시작에 앞서

![Threat Intelligence](https://github.com/user-attachments/assets/d92832d3-23dd-42a5-a33f-849916556fe3)

[Red Raccoon - Threat Intelligence / CEO 사칭 내부 피싱 사건 - 공격자 인프라를 추적하라](https://ctf.redraccoon.kr/challenges#%EC%8B%A4%EC%A0%84%20Threat%20Intelligence%20%EC%B6%94%EC%A0%81%20%EC%B1%8C%EB%A6%B0%EC%A7%80-128)

사실 지금까지 나는 공격하는 입장에서만 문제를 풀어왔었지 추적을 해본다는 것에 대해서는 공부를 해보거나 생각을 해보지 않았었다.

그런데 이번에 시간이 좀 생기기도 했고 `Red Raccoon`커뮤니티에 재밌어보이는 문제가 있기에 한번 풀어보려고 한다. 물론 풀다가 끝가지 가지 못할 수도 있다만 그래도 한번 도전해보는게 어딘가.

## 문제 풀이 시작 (메일 분석하기)

![문제](https://github.com/user-attachments/assets/7712da04-178a-4e6f-b02c-3cc9ae8ba1f5)

피싱 메일이 있고 그게 CEO명의로 모든 사람에게 전송되었다고 한다.

일단 그럼 메일을 뜯어볼까?

[client_request.eml](https://github.com/user-attachments/files/23685866/client_request.eml)

![email 내용](https://github.com/user-attachments/assets/cb238267-2093-4c8e-8fa9-e32de43d334d)

내가 email구조에 대해서 잘 모르긴 하지만 일단 base64로 디코딩 되어있고 그 내용을 하나씩 복호화 해보자면 다음과 같다.

### IT Support에서 Threat Intelligence Team으로

```
안녕하세요, 레드라쿤 인텔리전스팀.

CEO 명의로 전직원에게 발송된 의심 메일이 확인되어, CEO께서 본인이 보낸 메일이 아님을 확인하였습니다.
관련 원본 EML을 첨부하오니 긴급 조사 부탁드립니다.

티켓 ID: INC-2025-1101-0932-CEO-CHAIN

감사합니다.
IT Support / RaccoonCoin
```

오.. 케이? 일단 중요한 내용이라면 뭔가 `티켓 ID`가 존재한다는거. 그리고 이건 뭔가 검색해도 딱 이거다 싶은게 없으니 다음으로 넘어가자.

### Tony에서 IT Support으로

```
From: Tony Raccoon <tony.raccoon@raccooncoin.site>
To: IT Support <it@raccooncoin.site>
Cc: Tech Lead <techlead@raccooncoin.site>, SOC <soc@raccooncoin.site>,
 incident.response@raccooncoin.site
Subject: =?utf-8?b?7KCE7KeB7JuQ7Jy866GcIOuwnOyGoeuQnCDsnZjsi6wg66mU7J28IA==?=
 =?utf-8?b?7KCE64usIOKAlCDquLTquIkg7KGw7IKsIOyalOyyrQ==?=
Date: Sat, 01 Nov 2025 08:45:12 +0900
Message-ID: <20251101084512@raccooncoin.site>
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="===============8554573115456101840=="

--===============8554573115456101840==
Content-Type: text/plain; charset="utf-8"
Content-Transfer-Encoding: base64

7JWI64WV7ZWY7IS47JqULCBJVO2MgC4KCuygnCDrqoXsnZjroZwg7KCE7KeB7JuQ7JeQ6rKMIOyC
rOy5rSDsnbTrqZTsnbzsnbQg67Cc7Iah65CcIOygle2ZqeydtCDsnojslrQg7JuQ66y47J2EIOyg
hOuLrO2VqeuLiOuLpC4K7KCc6rCAIOuztOuCuCDrqZTsnbzsnbQg7JWE64uI66+A66GcIOq4tOq4
iSDsobDsgqwg67aA7YOB65Oc66a964uI64ukLiAo7LKo67aAOiDsm5Drs7ggRU1MKQoK6rCQ7IKs
7ZWp64uI64ukLgpUb255IFJhY2Nvb24KQ2hpZWYgRXhlY3V0aXZlIE9mZmljZXIKUmFjY29vbkNv
aW4KdG9ueS5yYWNjb29uQHJhY2Nvb25jb2luLnNpdGUK

--===============8554573115456101840==
Content-Type: message/rfc822
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="original_mass_email.eml"
MIME-Version: 1.0

RnJvbTogVG9ueSBSYWNjb29uIDx0b255LnJhY2Nvb25AcmFjb29uY29pbi5zaXRlPgpUbzogYWxs
QHJhY2Nvb25jb2luLnNpdGUKU3ViamVjdDogPT91dGYtOD9iP1crcTR0T3E0aVYwZzdJS3M2NEsw
SU91enRleW5nQ0R0ajZ6dGhMZ2c3SmVGNjQydzdKMjA3WXE0Pz0KICA9P3V0Zi04P2I/N1ptVjdK
MjRJT3lhbE95eXJRPT0/PQpEYXRlOiBTYXQsIDAxIE5vdiAyMDI1IDA4OjA5OjU4ICswOTAwCk1l
c3NhZ2UtSUQ6IDxtYXNzMjAyNTExMDEwODA5NThAcmFjb29uY29pbi5zaXRlPgpSZXR1cm4tUGF0
aDogPG5vLXJlcGx5QHJhY29vbmNvaW4uc2l0ZT4KUmVjZWl2ZWQ6IGZyb20gbWFpbC50dXRhbm90
YS5kZSAobWFpbC50dXRhbm90YS5kZSBbMjAzLjAuMTEzLjQ1XSkgYnkKIG14LnJhY2Nvb25jb2lu
LnNpdGUgd2l0aCBFU01UUFMgaWQgbXgtMTsgU2F0LCAwMSBOb3YgMjAyNSAwODowOTo1OCArMDkw
MAogKEtTVCkKUmVjZWl2ZWQtU1BGOiBmYWlsIChtYWlsIGZyb20gcmFjb29uY29pbi5zaXRlIG5v
dCBhdXRob3JpemVkKQpBdXRoZW50aWNhdGlvbi1SZXN1bHRzOiBteC5yYWNjb29uY29pbi5zaXRl
OyBzcGY9ZmFpbCAoY2xpZW50LWlwPTIwMy4wLjExMy40NSkKIHNtdHAubWFpbGZyb209cmFjb29u
Y29pbi5zaXRlOyBka2ltPW5vbmU7IGRtYXJjPW5vbmUKQ29udGVudC1UeXBlOiB0ZXh0L2h0bWw7
IGNoYXJzZXQ9InV0Zi04IgpDb250ZW50LVRyYW5zZmVyLUVuY29kaW5nOiBiYXNlNjQKTUlNRS1W
ZXJzaW9uOiAxLjAKClBDRkVUME5VV1ZCRklHaDBiV3crQ2p4b2RHMXNJR3hoYm1jOUltdHZJajRL
SUNBOGFHVmhaRDQ4YldWMFlTQmphR0Z5YzJWMFBTSjEKZEdZdE9DSStQQzlvWldGa1Bnb2dJRHhp
YjJSNVBnb2dJQ0FnUEhBKzdKV0k2NFdWN1pXWTdJUzQ3SnFVTENEc29JVHNwNEhzbTVBZwo3SmVz
NjUrczY3YUVMand2Y0Q0S0lDQWdJRHh3UHV5MW5PcTN2Q0RzZ3F6cmdyUWc2N08xN0tlQUlPMlBy
TzJFdU95WGtDRHF1TFRxCnVJa2c2ck8xN0tlQUlPdXdqeURyczdYc3A0QWc3S0NjNjQrRUlPdXpn
T3F5dlNEc2dxenRsYTNzbmJRZzdKNkk3SmEwSU95Z2hDRHMKcDRIc201QWc3Wm1WN0oyNDdKMjBJ
TzJWaE95YWxPMlZxZXVMaU91THBDNEtJQ0FnSU95VmhPdWVtQ0RycDRIdGdhenJwYndnN1lhMQo3
WlcwSU91aG5PcTN1T3lkdU8yVm1PeVhyQ0RyczREcXNyMGc3SUtzN1pXdDdKMkVJTzJabGV5ZHVP
MlZ0Q0Rzbzd6c2hManNtcFF1ClBDOXdQZ29nSUNBZ1BIQStDaUFnSUNBZ0lEeGhJR2h5WldZOUlt
aDBkSEE2THk5MmNHNHVjbUZqYjI5dVkyOXBiaTV6YVhSbElpQjAKWVhKblpYUTlJbDlpYkdGdWF5
SWdjbVZzUFNKdWIyOXdaVzVsY2lCdWIzSmxabVZ5Y21WeUlnb2dJQ0FnSUNBZ0lDQnpkSGxzWlQw
aQpZMjlzYjNJNkl6RmhNR1JoWWpzZ2RHVjRkQzFrWldOdmNtRjBhVzl1T25WdVpHVnliR2x1WlRz
aVBnb2dJQ0FnSUNBZ0lPeUNyT3VDCnRDRHJzN1hzcDRBZzdZK3M3WVM0SU91d2xPdWhuT3F3Z09x
NHNDQW82NkdjNnJlNDdKMjRLUW9nSUNBZ0lDQThMMkUrQ2lBZ0lDQTgKTDNBK0NpQWdJQ0E4Y0Q0
S0lDQWdJQ0FnNjZ5NDdKMlk3SUtzN1pXdDdKMkFJT3lnZ095WGtPcXlqQ0R0bW96c2k2QWc2N0NV
NjU2Tgo2NHVJNjR1a0xqeGljajRLSUNBZ0lDQWc2ckNRN0lLczdaV3A2NHVJNjR1a0xqeGljajRL
SUNBZ0lDQWdWRzl1ZVNCU1lXTmpiMjl1ClBHSnlQZ29nSUNBZ0lDQkRSVThzSUZKaFkyTnZiMjVE
YjJsdUNpQWdJQ0E4TDNBK0NpQWdQQzlpYjJSNVBnbzhMMmgwYld3Kw==

--===============8554573115456101840==--
```

결국 이것도 base64 디코딩을 해야한다.

```
안녕하세요, IT팀.

제 명의로 전직원에게 사칭 이메일이 발송된 정황이 있어 원문을 전달합니다.
제가 보낸 메일이 아니므로 긴급 조사 부탁드립니다. (첨부: 원본 EML)

감사합니다.
Tony Raccoon
Chief Executive Officer
RaccoonCoin
tony.raccoon@raccooncoin.site
```

이제 그럼 다음 복호화 부분이 드디어 원본 EML이겠네.

### Tony에서 all(전 직원)으로

```
From: Tony Raccoon <tony.raccoon@racooncoin.site>
To: all@raccooncoin.site
Subject: =?utf-8?b?W+q4tOq4iV0g7IKs64K0IOuzteyngCDtj6zthLgg7JeF642w7J207Yq4?=
  =?utf-8?b?7ZmV7J24IOyalOyyrQ==?=
Date: Sat, 01 Nov 2025 08:09:58 +0900
Message-ID: <mass20251101080958@racooncoin.site>
Return-Path: <no-reply@racooncoin.site>
Received: from mail.tutanota.de (mail.tutanota.de [203.0.113.45]) by
 mx.raccooncoin.site with ESMTPS id mx-1; Sat, 01 Nov 2025 08:09:58 +0900
 (KST)
Received-SPF: fail (mail from racooncoin.site not authorized)
Authentication-Results: mx.raccooncoin.site; spf=fail (client-ip=203.0.113.45)
 smtp.mailfrom=racooncoin.site; dkim=none; dmarc=none
Content-Type: text/html; charset="utf-8"
Content-Transfer-Encoding: base64
MIME-Version: 1.0

PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImtvIj4KICA8aGVhZD48bWV0YSBjaGFyc2V0PSJ1
dGYtOCI+PC9oZWFkPgogIDxib2R5PgogICAgPHA+7JWI64WV7ZWY7IS47JqULCDsoITsp4Hsm5Ag
7Jes65+s67aELjwvcD4KICAgIDxwPuy1nOq3vCDsgqzrgrQg67O17KeAIO2PrO2EuOyXkCDquLTq
uIkg6rO17KeAIOuwjyDrs7Xsp4Ag7KCc64+EIOuzgOqyvSDsgqztla3snbQg7J6I7Ja0IOyghCDs
p4Hsm5Ag7ZmV7J247J20IO2VhOyalO2VqeuLiOuLpC4KICAgIOyVhOuemCDrp4Htgazrpbwg7Ya1
7ZW0IOuhnOq3uOyduO2VmOyXrCDrs4Dqsr0g7IKs7ZWt7J2EIO2ZleyduO2VtCDso7zshLjsmpQu
PC9wPgogICAgPHA+CiAgICAgIDxhIGhyZWY9Imh0dHA6Ly92cG4ucmFjb29uY29pbi5zaXRlIiB0
YXJnZXQ9Il9ibGFuayIgcmVsPSJub29wZW5lciBub3JlZmVycmVyIgogICAgICAgICBzdHlsZT0i
Y29sb3I6IzFhMGRhYjsgdGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZTsiPgogICAgICAgIOyCrOuC
tCDrs7Xsp4Ag7Y+s7YS4IOuwlOuhnOqwgOq4sCAo66Gc6re47J24KQogICAgICA8L2E+CiAgICA8
L3A+CiAgICA8cD4KICAgICAg66y47J2Y7IKs7ZWt7J2AIOyggOyXkOqyjCDtmozsi6Ag67CU656N
64uI64ukLjxicj4KICAgICAg6rCQ7IKs7ZWp64uI64ukLjxicj4KICAgICAgVG9ueSBSYWNjb29u
PGJyPgogICAgICBDRU8sIFJhY2Nvb25Db2luCiAgICA8L3A+CiAgPC9ib2R5Pgo8L2h0bWw+
```

오 드디어 문제의 메일을 발견했다. 복호화를 해보면.

```
<!DOCTYPE html>
<html lang="ko">
  <head><meta charset="utf-8"></head>
  <body>
    <p>안녕하세요, 전직원 여러분.</p>
    <p>최근 사내 복지 포털에 긴급 공지 및 복지 제도 변경 사항이 있어 전 직원 확인이 필요합니다.
    아래 링크를 통해 로그인하여 변경 사항을 확인해 주세요.</p>
    <p>
      <a href="http://vpn.racooncoin.site" target="_blank" rel="noopener noreferrer"
         style="color:#1a0dab; text-decoration:underline;">
        사내 복지 포털 바로가기 (로그인)
      </a>
    </p>
    <p>
      문의사항은 저에게 회신 바랍니다.<br>
      감사합니다.<br>
      Tony Raccoon<br>
      CEO, RaccoonCoin
    </p>
  </body>
</html>
```

포털 로그인이 나오고 `http://vpn.racooncoin.site`이게 우리가 잡아야할 사이트라고 볼 수 있겠다. 왜냐? 원래 메일을 보면 링크가 `raccooncoin.site`인데 지금 마지막 메일의 링크는 `racooncoin.site`즉 `c`가 하나 없다! 고전적인 수법이지만 솔직히 이걸 누가 하나하나 다 검사하면서 누르겠나..

## 메일을 통한 중간 점검

- Lure Site(미끼 사이트) : http://vpn.racooncoin.site

사용자가 로그인 정보를 입력하게 만드는 가짜 페이지.

- Source IP(발송지) : 203.0.113.45

헤더의 Received 부분에서 발견. INFRA 1 또는 INFRA 2의 단서가 됨.

- Mail Service : mail.tutanota.de

공격자는 추적을 피하기 위해 보안 메일 서비스(Tutanota)를 경유했음.

으음... 일단 메일로 알 수 있는건 이정도인 듯 하고 이제 문제 페이지로 넘어가 진행해보자.

> 2025-11-25

이후에 보고서 작성하다 알아낸 거지만

![emlreader](https://github.com/user-attachments/assets/3507f912-03ac-4553-baa7-fab92b845440)

[emlreader](https://www.emlreader.com/)라는 사이트를 통해 훨씬 편하게 볼 수 있었다. 이런! 훨씬 깔끔하고 보기도 좋네..

## 문제 풀기 시작

![실전 추적 챌린지](https://github.com/user-attachments/assets/4401409f-dc65-46c9-93ba-464857e50696)

이게 가장 메인 문제이고 아래는 문제를 풀기 위한 과정이라고 생각하면 되겠다.

### Suspicious Domain #1

![Suspicious Domain 1](https://github.com/user-attachments/assets/0b851804-8ff9-4700-ac3c-26790d0f3354)

메일 분석에서 찾았듯 c 하나 있는 녀석이다.

![1 done](https://github.com/user-attachments/assets/b02c72bd-ca52-4344-b9e0-e4a36b167473)

### What is This Domain? #2

![What is This Domain 2](https://github.com/user-attachments/assets/6c6c523f-f78d-43d3-943e-f836c33d95da)

문제는 풀었지만 우린 공부하는 입장이니 좀 더 알아보자면.

- **Domain Hijacking (도메인 하이재킹)** : 말 그대로 도메인 소유권을 통째로 뺏는 것.
- **Typosquatting (타이포스쿼팅)** : 오타(Typo) + 무단 점거(Squatting). 사용자가 주소를 입력할 때 실수할 만한 오타를 예측해서 미리 도메인을 등록해 두는 기법.
- **Host Spoofing (호스트 스푸핑)** : 네트워크 상에서 자신이 다른 컴퓨터(호스트)인 척 속이는 행위.
- **Homograph Attack (동형이의어 공격)** : 사람 눈에는 완전히 똑같이 보이지만, 컴퓨터는 다르게 인식하는 문자를 섞어 쓰는 기법입니다. 주로 국제 도메인(IDN) 정책을 악용하여 영문 `a`와 모양이 같은 키릴 문자 `а` 등을 사용. 솔직히 첨에 이거라고 골라서 틀렸었다.
- **Typo Attack** : 이..건? 문제 낼 때 헷갈리게 하려고 만든 답인 듯 하다.


### Phishing Link #3

![Phising Link 3](https://github.com/user-attachments/assets/c068ca33-4a68-4ad1-8b60-0433621ee67a)

이것도 개념을 좀 알아보자.

- **Credential Stuffing** : 훔친 계정 정보를 마구잡이로 쑤셔 넣는다(Stuffing)는 뜻.
- **Credential Harvesting** : 계정 정보(Credential)를 농사짓듯이 수확(Harvesting).
- **Supply Chain Compromise** : 보안이 철저한 대기업을 직접 뚫는 게 어려우니, 그 기업이 사용하는 소프트웨어 업체나 하청 업체(공급망)를 해킹해서, 업데이트 파일에 악성코드를 심어 침투하는 방식.
- **Drive-by Compromise** : 차 타고 지나가다가(Drive-by) 총 맞는 것처럼, 웹사이트에 접속만 해도 감염된다는 개념.

`Drive-by Compromise`도 링크를 이용하는 것이기는 하지만 이번 문제에서는 로그인을 했을 때에 계정을 탈취하는 것이였기에 요건 아니다.

### Suspicious IP #4

![Suspicious IP 4](https://github.com/user-attachments/assets/2ae664d3-f00c-44c0-b742-206bfdb573ef)

그러게 말입니다.. 

난 처음에 `203.0.113.45`인줄 알았는데 생각해보니 이건 범인이 메일을 발송할 때 쓴 IP인거지 공격 사이트가 아니다. 그니까 난 이제 공격 사이트 즉 `vpn.racooncoin.site`을 찾아봐야하는 것!

![vpn 사이트 접속](https://github.com/user-attachments/assets/eace55e0-7de6-496f-a630-cc2bcda26ce6)

일단 사이트는 이런 식으로 나오고 DEV툴로 열어보니.

![찾았다](https://github.com/user-attachments/assets/0b79524a-e8be-434a-bb64-a262e1a13bd4)

`http://140.238.194.224` 딱 봐도 이거구만.

![didit 4](https://github.com/user-attachments/assets/b0d53d5f-4da3-495d-b169-0ec33737a017)

### What is this IP for? #5

![What is this IP for 5](https://github.com/user-attachments/assets/ede73f20-1b2e-462b-96c7-44e5a1fce03f)

- **C2 (Command & Control)** : 좀비 PC들에게 명령 내리는 커맨드 센터.
- **HTTPS Redirector** : HTTPS로 리다이렉션 해주는 서버
- **GoPhish** : 오픈소스로 가장 널리 쓰이는 이메일 피싱 테스트 도구. 요건 첨보네.
- **Evilgnix2** : 피싱 프레임워크.
- **HTTP Redirector** : 공격자는 자신의 진짜 서버(본거지)를 숨기기 위해, 중간에 `토스`만 해주는 서버를 두는데 이걸 리다이렉터(Redirector)라고 한다. 그리고 이번 문제의 답이다.

![5 done](https://github.com/user-attachments/assets/dbf150f9-05eb-4503-8ccc-f14e74b0b5d5)

왜냐? `window.location.href = 'http://140.238.194.224';` http로 리다이렉트를 보내버리기에.

### They still make mistakes! #6

![They still make mistakes 6](https://github.com/user-attachments/assets/84ffc995-d7ad-407c-a797-f4a5490bb73a)

엄... 열린 포트를 봐야하네? 보통은 vm 칼리를 켜겠다만.. 지금 윈도우라서 그냥 간단히 wsl 칼리를 켜자.

![nmap result](https://github.com/user-attachments/assets/6b98e6ba-7165-4db0-9384-5be99d5fc69c)

어... 딱 보니까 `8081`이라는 되게 특이한 포트가 열려있다.

![6 done](https://github.com/user-attachments/assets/a8720c3a-7a0d-4f1d-ae2a-411f2f1612fe)

### What's their attack plan? #7

![What's their attack plan 7](https://github.com/user-attachments/assets/dfa7d442-4a25-43bf-b6b3-75f36e0c9a68)

자 문제 따라 접속해봅시다.

![7 in](https://github.com/user-attachments/assets/6a334dfa-9503-4f7e-91fe-a71f8b48b0e8)

오 `Directory listing for`이라고 해서 파일들이 보이는데?

![raccooncoin_info](https://github.com/user-attachments/assets/782e5440-aaa0-4504-967d-4ddd653eb2d1)

아니 이거 윈도우에서 못 읽네.

![in wsl](https://github.com/user-attachments/assets/39564b60-d268-451b-81da-dc164527f5b8)

하나씩 불러오기 귀찮아서 그냥 통째로 다운받았다.

당연하다면 당연하겠지만 실제로 진행하게 된다 하면 이렇게 했다가는 일단 상대에게 로그가 많이 남는건 고사하고 바이러스 파일도 다운받을 수 있기에 하면 안된다. 지금은 CTF니까 편의를 위해 이렇게 진행했다는 점.

![all files](https://github.com/user-attachments/assets/4002fa59-c0e0-435f-9114-58804c31e24b)

역시 뭔가 하다보니 이젠 cli가 더 편하다.

![file result](https://github.com/user-attachments/assets/eff1ac1a-2e62-4b2d-b09d-bb4c36bb31f4)

오케이 그냥 아스키 텍스트였다.

![fake](https://github.com/user-attachments/assets/13842a69-4ec9-4de0-88c4-f132d2c72165)

? 딱 봐도 이놈들은 아니다. 어쩐지 너무 쉽더라.

![flag](https://github.com/user-attachments/assets/bcd8b872-4e46-4593-b0a8-1e7d88f3c1e5)

다른 파일들 읽어보다가 `db.sql`파일을 보니 FLAG가 있다.

![예업](https://github.com/user-attachments/assets/faf01192-7e72-4286-ae06-75fd5a4b7681)

### Sock Puppets #8

![Sock Puppets](https://github.com/user-attachments/assets/82389a99-1bed-4f74-b8d1-c32efb7e8955)

오.. 이건 또 색다르네.

사실 이건 이전에 `plan.txt`를 자세히 읽어봤다면 풀 수 있다.

```
┌──(kali㉿raen-70)-[~/raccoon_investigation/140.238.194.224:8081/raccooncoin_info]
└─$ cat plan.txt
-- ==================================================================
-- RaccoonCoin Exchange - Internal Database Dump (LEAKED)
-- Source: db01.internal.raccooncoin.site (PostgreSQL 13.11)
-- Dumped by: raccoon-admin (2025-11-10 03:14:22+09)
-- ==================================================================

-- NOTE: This is for Red Raccoon (https://redraccoon.kr)
-- Korean Cyber Security / RED TEAM Community Threat Intelligence Challenge purpose only.
-- All data below is FAKE TRAINING DATA. Do not reuse in real environments.

[0x01] Initial Recon
--------------------
- Target: raccooncoin.site (KR-based crypto exchange)
- Goal: Obtain internal access to Staff VPN / admin panel
- Approach: OSINT → impersonation → phishing → VPN creds → pivot

Domains / Infra:
- www.raccooncoin.site      → Cloudflare in front of Oracle VPS (origin: 140.238.x.x)
- raccooncoin.site/singin.html    → seems to serve /signin.html? maybe we can use this later for their customers' phishing
- vpn.raccooncoin.site      → mentioned in internal phishing email sample (Staff VPN Logon)

Staff OSINT:
- "Tony Raccoon" – appears as CEO / co-founder
  - Email: tony.raccoon@raccooncoin.site
  - Style: likes raccoon memes and zombie aesthetics → could be useful in social engineering pretext.
- "Soyeong Park" – Security Engineer / Tech Lead
  - Email: soyeong.park@raccooncoin.site
  - Appears in leaked VPN table as username "spark".
  - May be in charge of SOC + Threat Intel? → good target for internal IT infra network

[0x02] Social Engineering Plan
------------------------------
Idea: Create fake LinkedIn + GitHub profiles to impersonate internal staff or trusted vendors (for dropper purpose)

1) Fake LinkedIn profile #1 - their tech lead
   - Name: "Soyeong Park"
   - Title: "Teach Lead at Raccoon Coin"
   - Pitch: for internal vpn training or just try out fake logon attempt to internal employeee
   - Connect with:
     - Tony Raccoon
     - anyone listing "RaccoonCoin" or "RaccoonCoin Exchange" as employer.

Note: we can create more fake linkedin profiles with other staffs later. You guys can make one racooncoin.site domain we have.

2) Fake GitHub profile - TBU more
   - Use the tech lead identity (with email verification with racooncoin.site )
   - Bio: "Tech lead raccooncoin."
   - Mirror some public code (fork from open-source projects).
   - Upload fake "internal" tools repo later:
     - /scripts/vpn-helper.sh
     - /tools/raccoon-monitor.py
   - Idea: if devs Google random errors, they might land on this GitHub and trust it as internal.
   - Could embed malicious curl|bash installer in README later.

[0x03] Phishing Scenario
------------------------
Objective: Get staff to log into attacker-controlled VPN portal, extract DB.

------------------------------
- DB leak snippet (which i'll share it later with you guys the full list) reveals:
  - VPN credentials for C-levels. (Check db in the zip file)
  - Some internal IP ranges: 10.10.0.0/16.
  - Evidence that RedRaccoon TI (threat-intel@redraccoon.kr) had "pending" VPN account.
- Interesting IPs:
  - 198.51.100.44 → used for failed VPN attempts against "groot". Might be previous attacker or misconfigured testing box.
  - 185.199.111.153 → GitHub pages / static hosting. Seen as login source for rr-ti1/wget → maybe Red Raccoon scanner.

- Idea:
  - Stand up redirector on cheap VPS.
  - Use it as:
    - HTTP(S) phishing landing page
    - SSH C2 pivot (port 80/443 masquerading) - socat 2222 and port 80 from redirector -> c2.

[0x05] Future Steps / To-Do
---------------------------
[ ] Finish fake LinkedIn + GitHub profiles and age them for a few days.
[ ] Join Korean security / crypto groups and casually interact to build trust.
[ ] Finalize phishing email template in both English and Korean.
[ ] Deploy cloned VPN login page and test credential logging.
[ ] Deploy cloned VPN login page and test credential logging.
[ ] Prepare OSINT trail so that investigators (CTF players) can:
    - find this notes file
    - pivot from leaked SQL → email addresses → social media → fake profiles → onion/redirector infra.
```

다만... 좀 많이 자세히 본다면 말이다.

![0x02](https://github.com/user-attachments/assets/2716a73d-edaf-49bb-a9ac-2bfea3776209)

소셜 엔지니어링 부분을 보면 `Teach Lead at Raccoon Coin`는 `Soyeong Park`을 사칭한다고 되어있다. 그리고 우리가 잘 생각해본다면 기술 팀장은 `Tech Lead`이지 `Teach Lead`가 아니다.

![findout](https://github.com/user-attachments/assets/b1e9787d-88e6-41f2-878a-ddb58a4e5f6b)

그리고 찾아보니 딱 한명 나온다만... `Teach Lead`로 검색했을 때에는 딱히 아무도 나온게 없다.

그리고 답에 넣어보니 이거 아니다. 아니 뭐지?

![no?](https://github.com/user-attachments/assets/896d9ca8-8a37-4bd5-aa97-d135ca4ed5e3)

아니 링크드인에 없는디.

![hint?](https://github.com/user-attachments/assets/d621d3bf-1f08-4b71-bbd3-dd73b27a776f)

그... 힌트가 그거여도 제가 우쩨 압니까 없는디.

![maybe](https://github.com/user-attachments/assets/7256c1ca-8342-4b0c-8189-f91013106185)

이들 중에 한명 인듯 한데 프로필을 볼 수가 없소. 어? 근데 지금 뭔가 이상한걸 찾았다.

![techinical](https://github.com/user-attachments/assets/e372270f-051e-4462-9e83-3c7774a4442e)

`Technical`에 `i`가 하나 더 들어가있네? 그렇다면 이걸 기반으로 찾으면?

![i got u](https://github.com/user-attachments/assets/d11037e7-4985-4525-8ad5-b5d4efcc382a)

찾았답... 인데 왜 아니라는겨

![why](https://github.com/user-attachments/assets/0ebf654e-4088-49ec-8d44-6381a604aef6)

이번엔 맞잖습니까? 뭔디...?

![아이](https://github.com/user-attachments/assets/5ce4c1b0-7a3d-4f95-a748-fafafc44e9f4)

아잇 링크 맨 뒤에 `/`가 없어서 안됬던 거였다. 이러면 어케풀엌ㅋㅋㅋ

### Suspicious Repo #9

![Suspicious Repo 9](https://github.com/user-attachments/assets/a3102035-b4e4-4d04-951a-05cfcbe4911d)

이건 또 아까 봤던 `plan.txt`에 있었지.

![fake github](https://github.com/user-attachments/assets/043018b4-52fe-4ed6-a117-348b74ec3234)

![only one](https://github.com/user-attachments/assets/2cea213d-26f8-4ef7-b5ff-2240c8fd7368)

딱 한명 뜨는데 이거 아니란다.

![아 이거네](https://github.com/user-attachments/assets/fbdaba79-b6ca-477e-b3c7-76a425e633b4)

아 이거네. 솔직히 깃허브에 검색했을 때 나올까 했는데 영어 이름 검색하니까 `Raccoon Coin`이 나오더라. 근데 개인 깃허브는 못 가진다고 했으니 이것일 확률이 100%!

![정답](https://github.com/user-attachments/assets/397b3994-1c3c-4fac-a016-b6929ef61c7a)

### Find their Geo Location #10

![Find their Geo Location 10](https://github.com/user-attachments/assets/1cbcf707-f008-4573-aaed-642130f442ba)

와 이건 전혀 푸는 법을 모르겠어서 gemini와 이야기를 좀 해봤는데 이런 기능이 있었어?

![commit](https://github.com/user-attachments/assets/e83bcb20-15f7-40ba-902f-b85322cdbfd4)

아무 레포나 들어가서 `commit`으로 들어가고, 이제 여기서 링크의 맨 뒷 부분에 .patch를 붙여주면?

`https://github.com/racconcoin/raccooncoin-dev/commit/afa96b9a8edb3798716a03376afd5da018acf567.patch`이런 느낌으로.

![log](https://github.com/user-attachments/assets/06ad0b49-b215-4e2a-8cae-e5ad37a9a37c)

이런 식으로 Raw데이터를 볼 수 있게 되는데 여기서 `Date`의 맨 뒤에 나온 `-0500`이 의미하는 것은

- 대한민국: +0900
- 아르메니아: +0400 (UTC+4)
- 포르투갈: +0000 (UTC+0) 또는 +0100
- 콜롬비아 / 미국(동부): -0500 (UTC-5)

즉 미국 동부라는 것!

![인데](https://github.com/user-attachments/assets/f3337ac2-ada9-48a9-982b-29a564344b81)

오잉..?

![콜롬비아는 맞아?](https://github.com/user-attachments/assets/7c5974f2-26fa-4c2c-9df8-d3f1c5de3a02)

![음...](https://github.com/user-attachments/assets/b879a3bc-c1f8-480f-8e25-1fa2c1a70c4f)

이번 문제는 gemini에게 물어봐도 솔직히 왜 굳이 콜롬비아? 인지 잘 모르겠다. 지금이 겨울이라서 그런가? 흠...

일단은 레드라쿤 커뮤니티에 질문을 올렸으니 추후 답변이 온다면 그 때 다시 생각해보자.

![와!!](https://github.com/user-attachments/assets/e6db920a-38cf-466f-bd89-4bd94c8f294f)

와!! 내 생각이 맞았다! 이 맛에 해킹공부하지! 너무 즐겁다.

### KEY TO "HACK-BACK" #11

![Key to 11](https://github.com/user-attachments/assets/29f709bd-60c7-49f1-98a8-95f84618df17)

이 문제는 이미 커밋들을 살펴보다가 이미 발견했다는 사실!

![private key](https://github.com/user-attachments/assets/016389de-233e-4231-b32d-eee9b63787f4)

private키가 노출되었다.

![bash history](https://github.com/user-attachments/assets/af7646ee-e3f8-406f-87b3-469b635d5ed8)

게다가 commit에 bash history가 있고 심지어는 ssh 비밀번호까지? 있다. 그리고 우리가 접속해야 하는 유저 `spark`도 발견할 수 있었다.

![ssh](https://github.com/user-attachments/assets/6dd22ff2-cdd2-48e4-a7ec-aa34de3fd05d)

그리고 사실 여기서 엄청 오래동안 시간을 썼는데...

![flag](https://github.com/user-attachments/assets/028998ff-4e0a-47ec-a51d-4cddae98fa67)

이놈 숨겨져 있었다... ㅎ

![11 done](https://github.com/user-attachments/assets/8df76670-fe36-4851-93c0-921f75337e61)

### Command&Control #12

![Command&Control 12](https://github.com/user-attachments/assets/3e20b58e-d922-4153-be7b-3c645334a902)

일단 이번 문제는 진행하기에 앞서 좀 더 많은 지식이 필요했기에 [http-redirector](https://www.레드팀.com/infrastructure/http-redirector)를 읽고 문제 풀기를 시작했다.

![reason](https://github.com/user-attachments/assets/36e7463e-b858-4ed5-9d9b-9361a7e3526c)

그 이유인즉 `plan.txt`에서 `socat`을 이용한다고 되어있었기에 그것을 기준으로 사용중인 프로세스를 검색했고, 위 레드팀 플레이북에서도 나오듯 `2222`번 포트를 사용하여 리다이렉트를 하고 있었다.

![찾아보기](https://github.com/user-attachments/assets/00fd3938-c00f-4f77-819a-d10c6942f7f0)

위와 같이 검색해보았을 때에 일단 내가 root 권한이 없기에 `Not all processes-`하고 뜨는데 그걸 제외하더라도 두 tcp중 위의 `59.7.68.201:38904`는 내 ssh 연결이므로 `158.180.6.169:40302` 요놈이 바로 C2의 IP가 되겠다. 그리고 만약에 내 ip를 모른다고 해도 `59`로 시작한는 ip는 한국 통신사 대역이기에 어떻게 해도 아래일 확률이 높다.

![12 done](https://github.com/user-attachments/assets/a2d52b6d-fa46-4aac-a2f8-e9b5fc8652c1)

### Under The "Deep" Sea #13

![Under the sea](https://github.com/user-attachments/assets/264e6f75-7b60-4783-91d8-68f2ca1be218)

![onion](https://github.com/user-attachments/assets/beb11710-f05a-4564-a37f-908b76e0dea6)

이제 거의 끝에 도달했다. 마지막으로는 아마 onion(tor 네트워크)으로 연결되는 것을 찾아야 하나보다.

![tor loc](https://github.com/user-attachments/assets/aa2f3866-8237-4e31-b9ba-d202c48d1589)

와.. 진짜 어떻게 찾아야하나 막막했는데 전체 찾기로 돌려버리니까 나오네...

![비밀번호요?](https://github.com/user-attachments/assets/99c947cb-4155-49a9-8729-e706d1ed7832)

?? tor 사이트에도 비밀번호가 있었어?

![비밀번호](https://github.com/user-attachments/assets/e193eea5-e0a8-4adb-b6ec-149d148b5fc8)

그리고 당연하게도 같은 파일 안에 들어있다.

![tor 접속](https://github.com/user-attachments/assets/c31eba8e-3324-4bc1-97d3-089b3d22e6c4)

오케이 접속 성공이고.

![대시보드](https://github.com/user-attachments/assets/b17c2be8-d236-47e0-b5a8-4c4e7ffd803a)

대시보드에 들어올 수 있었다.

![희생자 목록](https://github.com/user-attachments/assets/7e14bd64-eb06-4b47-9feb-abb68cfcefdd)

그리고 이제 희생자 목록을 열어보니 플래그 발견!

![13 done](https://github.com/user-attachments/assets/0a4328de-5492-444b-bd04-83151d58d915)

> 2025-11-28 / 23:02

![비번 불필요](https://github.com/user-attachments/assets/ec878962-5a4a-4680-bcd4-3513f368ecaf)

이후 보고서 작성할 때 확인할 것이 있어 대시보드에 접근하고 했었는데 이후 그루트 님께서 아예 비밀번호를 없애시고 사실상 고정? 을 시키신 듯 하다.

![next victims list](https://github.com/user-attachments/assets/5dce2634-8175-463d-8747-dd313556619c)

아니 이것도 업데이트 됬네? 전에는 뭔가 css 다 깨진 형태였는데 이번에는 더 정리되어 잘 보인다. 보고서 고치러가야겠구만..

![아무것도 없음](https://github.com/user-attachments/assets/ef33fd9c-e7dc-4c65-a6d2-b7c2e4ae52bd)

그리고 첨 풀 때는 딱히 신경을 안 썼었는데 `redraccon_exfil_2025.zip`에는 아무 내용도 없다는 것.

### Ransomware Artifact #14

![Ransomware Artifact 14](https://github.com/user-attachments/assets/83e1f2ab-5503-4e62-9096-722a74d1f451)

랜섬웨어 바이너리를 다운해야 하는데 사실 원래 진짜 랜섬웨어라면 당연히 다운받으면 안되겠죠?

![이건 시험이니까](https://github.com/user-attachments/assets/04a1ae19-2cc8-4e0e-9e35-3ddfc9af5e7e)

하지만 이번 문제에서는 그저 문제일 뿐이기에 실제로는 `.txt` 파일을 준다.

![간단 하죠잉?](https://github.com/user-attachments/assets/6d14762e-1e17-41dd-a3ac-f9a542ab4ec1)

간단하죠잉?

![14 done](https://github.com/user-attachments/assets/049b1f5b-7323-4785-8623-36e5335d2a5c)

### So.. now what? (파이널 최종과제 및 강의 쿠폰 지급)

![So.. now what (파이널 최종과제 및 강의 쿠폰 지급)](https://github.com/user-attachments/assets/80822146-4ed4-4c18-9913-2a23409953ac)

그리고 이제 마지막 문제이다. 사실상 이제 문제 자체는 끝났다! 하지만 내가 HTB 문제 푸는 것도 그렇고 일단은 계속해서 보고서 작성 공부를 해야하기에, 또한 40% 할인 쿠폰을 받기 위해선 리포트를 작성 해야하기에 결국 내가 공부한 것을 마무리 하기 위해선 보고서를 작성해야한다.

솔직히 내가 지금까지 한번도 보고서를 작성해 보지는 않았지만 이번 기회에 작성해보고자 한다. 물론 그 전에 일단 점심좀 먹고... 8시에 먹고 13시 까지 집중해서 풀어가.. 솔직히 재밌는걸?

![REDRACCOON TI DONE](https://github.com/user-attachments/assets/3a108cbc-bf6b-41ce-a286-8207aa106528)

끝! 다음에 또 이런 재밌는 문제가 있길!

![next victim](https://github.com/user-attachments/assets/69ff79c1-9d96-41e9-9c0c-44b8e73213ab)

아 참고로 다음 희생자들의 목록은 다음과 같다. 한국에 미국에 일본, 싱가폴까지 ㅋㅋㅋㅋ

> 2025-11-28-11-17-FIN

![FIN](https://github.com/user-attachments/assets/323253a8-04b6-4f3a-8a56-96a50214e187)