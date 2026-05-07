---
title: "T31N + GC2053 기반 CCTV 하드웨어 개조: PoE에서 독립형 비전 AI 센서로"
date: 2026-05-04 13:13:00 +09:00
categories: [Hardware, Reverse Engineering]
tags: [T31N, GC2053, UART, PoE, CCTV, 마개조]
pin: true
---

## 왜 갑자기?

안 그래도 내 컴퓨터에 쓸 웹캠이 다이소에서 왔다보니 벌써 선이 달랑거리기도 하고 화질도 별로인데 갑자기 **POE** 계열 CCTV 4개를 중고로 얻게 되어 한번 이걸 내 컴터에 달자! 라고 생각을 하게 되었다.

## 하드웨어 (hardware)

> **LETS Security** 사의 **EM-POE3008K3-RB** 모델

![POE CCTV](https://github.com/user-attachments/assets/aa13ac04-6595-497c-8195-44404a9cc25a#.png)

꽤나 크고 사실 내부 소자들을 분리한다고 내가 poe 선을 그냥 뚝 잘라버려서 이후에 할 작업에 손이 많이 가게 되었다. ㅎ

> 카메라 심장

![inside](https://github.com/user-attachments/assets/c91e4506-948b-4c9d-a463-f7618d74a7d8#.png)

사실상 위 모델 정보나 이런건 껍대기에 불가하고 실제로 우리가 건들일 부분은 이 **3층 전자 탑**이 되겠다.

### 3층

![3개 뜯기](https://github.com/user-attachments/assets/80f31d92-70b6-42f1-8ff4-5b0a4bae6576#.png)

층을 다 분리해보면 위처럼 나오는데 

각 층은 다음과 같은 역할과 이름을 갖고 있다.

- 1층(전력) : **SPB-PO030-F020-10**
- 2층(카메라) : **T31N_GC2053_v1.3**
- 3층(IR LED) : **FY-T5036-L**

사실 난 이걸 그냥 USB에 연결해서 딸깍 하면 컴퓨터에 연결할 수 있을 줄 알았다. 

아.. 그러지 말았어야 했는데.

이곳 저곳을 찾아다니며 나랑 같은 생각을 한 사람이 있을까, 혹은 비슷하게라도 싶어 둘러다녀봤으나 다들 그냥 POE면 POE로 쓰지 그걸 굳이 왜 컴퓨터에? 싶었나보다.

솔직히 동감하는 바이긴 한데 그래도 재밌잖아?

### 전선들

내가 이걸 처음 뜯고 마주한 전선들을 하나씩 외우자니 나중에 까먹을 듯 싶어 기록한다.

```
[1번] 빨강/검정 (12V) ──→ FY-T5036-L (IR LED 보드 전원)

[2번] 빨강/검정 (12V) ──→ SPB-PO030-F020-10 메인 전원 입력
                            여기서 내부적으로 5V, 3.3V로 강압해서
                            T31N 보드에 공급함

[파랑, 파랑+흰] R-1, R-2 ──→ 이더넷 수신 페어 (RX+, RX-)
[초록, 초록+흰] T-2, T-6 ──→ 이더넷 송신 페어 (TX+, TX-)
    ↑ 이 4선이 100Mbps LAN 데이터선

[보라] LED- ──→ IR LED 보드 GND 제어선
               (T31N이 주야간 판단해서 IR ON/OFF 스위칭)
```

근데 솔직히 보라선이 LED 보드 제어선인지는 잘 모르겠다. 1층에 연결되어있는데 가만 생각해보면 제어선이 아니라 CCTV 리셋 버튼 같기도 하고....

### T31N_GC2053_v1.3

![cameraboard](https://github.com/user-attachments/assets/84fcbf5a-9f62-4e0e-987f-9d8c8a54dc90#.png)

그리고 이번에 우리가 가장 많이 다룰 녀석은 바로 이 카메라가 달린 부분이다.

아무래도 전원 부분은 그냥 12V 따로 장비 사서 연결하면 되고 이 카메라를 어떻게 해야지 내 컴퓨터에 연결하고 쓸 수 있을테니 말이다.

![알리바바](https://github.com/user-attachments/assets/b5e2c052-e7bf-4bd5-b6d7-15a20896be7c#.png)

[Vanhua AK54/alibaba](https://www.alibaba.com/product-detail/2024-Ingenic-T31N-chipset-1-2_1601144425477.html)

그래서 좀 더 알아보다 알리바바에서 똑같은(카메라는 없는) 보드를 찾아낼 수 있었다.

|  핀 번호   |  기능 (다이어그램 기준)  |               개조 타겟               |
| :--------: | :----------------------: | :-----------------------------------: |
|  **1번**   |      **DC12V (+)**       |     **12V 어댑터 (+) 라인** 연결      |
|  **2번**   |       **GND (-)**        |     **12V 어댑터 (-) 라인** 연결      |
|  **3번**   |    **RJ1-TN (녹색)**     |     RJ45 커넥터 **2번 핀 (TX-)**      |
|  **4번**   | **RJ2-TP (화이트 그린)** |     RJ45 커넥터 **1번 핀 (TX+)**      |
|  **5번**   |    **RJ3-RN (블루)**     |     RJ45 커넥터 **6번 핀 (RX-)**      |
|  **6번**   | **RJ6-RP (화이트 블루)** |     RJ45 커넥터 **3번 핀 (RX+)**      |
| **7, 8번** |     **Link/ACT LED**     | (선택 사항) 상태 확인용 LED 연결 가능 |

다만 오히려 이걸 통해 usb로 연결하는 방법은 불가능하다는 것을 알 수 있었다.

그럼 이건 어쩔 수 없고 다만 POE 방식이 아니라 내가 C2Lan 장비가 있으니 전원 따로 인가하고 인터넷 선만 뽑아 컴퓨터로 넘겨주면 되는 방식이겠다.

## 소프트웨어 (software)

![thingino](https://github.com/user-attachments/assets/4aa7f55d-4251-4ada-b32b-15a45a4be10f#.png)

그럼 하드웨어로 뚝딱 하는 방법만 있을까?

gemini 선생이 말하길 무려 1080의 해상도를 가진 카메라인데 아예 내부 펌웨어를 기본이 아닌 **Thingino** 라는 오픈소스 프로젝트로 바꿔버려 더 다루기 좋은 보드로 만들어버릴 수 있다고 한다!

이걸 이용하면 웹캠 뿐 아니라 Low-latency로 RTSP 영상만 띄워서 YOLO에 먹여주면 되겠지?

![trg](https://github.com/user-attachments/assets/f3ded4bd-ff84-4938-a421-6be642634e54#.png)

그래서 그럼 어떻게 펌웨어를 업로드 하느냐?

바로 이 보드에 아~~주 작게 나와있는 **TRG(TX, RX, GND)** 핀에 **USB-to-TTL** 변환기를 이용해 **UART 통신**을 진행해야한다.

그리고 연결 후 터미널을 열어 쉘을 따고 펌웨어를 메모리에 올려버리면 된다. (제에발 되길)

## 1일차 (전원, 랜 연결)

> 2026-05-07

이 장비에 대해 알아보고 하는건 결국 하드웨어 소프트웨어를 나눠서 보긴 했지만 결국 작업할 때는 다 같이 하게 되더라.

일단 오늘은 드디어 필요한 **수축 선**이나 **랜툴**, **변압 전원선**이 왔기에 드디어 생각하던 작업을 시작할 수 있었다.

![didit](https://github.com/user-attachments/assets/5b1042a9-339d-4af9-a700-ac964c9198b5#.png)

일단 결론부터 말하자면 보다시피 python의 opencv를 이용해 rtsp로 비디오 영상을 받아오는데 성공했다. 다만 지금 설정의 문제인지 내가 카메라를 손가락으로 만져서 그런건지 화질이 좋지 못해서(내 웹캠보단 좋지만) 그건 또 나중에 해결해야할 문제가 되겠다.

그런 어떻게 했는지 차근차근 이야기해보자.

### 랜선 연결

![랜툴](https://github.com/user-attachments/assets/e2c29122-30bb-44e9-87d5-4106d0b65348#.png)

사실 이 장비는 위에서 말했듯 POE 장비다. 그렇다보니 원래는 랜선이랑 전원선이 하나로 엮여있고 난 그게 싫어서 그 부분을 아예 물리적으로 동강 잘라냈었다.

오늘은 솔직히 살짝 후회할 뻔 했는데, 난 이 랜캡(RJ45)를 씌울 때 랜선의 피복을 벗겨야 하는줄 알았다. 사진 보면 알겠지만 하필 갖고있는 **스트리퍼**를 쓰기엔 너무 전선이 얇아서 무려 손톱깍기까지 동원해서 작업을 했었다.

근데 작업하다 다 껴놓고 제미나이랑 이야기를 해보니

![아](https://github.com/user-attachments/assets/e3158a36-6b11-4727-a34a-e60019e405f1#.png)

아 이런 세상에 빨리 알려주지... 

선 넣을 땐 그래도 전에 [CCNA](https://oil-lamp-cat.github.io/posts/CCNA-%EA%B3%B5%EB%B6%80-1/)를 공부는 했었다고 그 기억을 토대로 선은 맞춰서 넣었는데 이거 피복을 안 벗겨도 되는 거였네?

쩝....

뭐 일단 그래도 해냈다.

**2. 왼쪽부터 밀어 넣는 순서**
* **1번 구멍 (TX+):** 카메라의 **화이트 그린 (흰색/초록 섞인 선)**
* **2번 구멍 (TX-):** 카메라의 **녹색 선**
* **3번 구멍 (RX+):** 카메라의 **화이트 블루 (흰색/파랑 섞인 선)**
* **4번 구멍:** 비워둠 (Empty)
* **5번 구멍:** 비워둠 (Empty)
* **6번 구멍 (RX-):** 카메라의 **블루 (파란색 선)**
* **7번 구멍:** 비워둠 (Empty)
* **8번 구멍:** 비워둠 (Empty)

나중에 또 다른 3개의 cctv가 있으니 잊어먹지 않게 기록해둔다.

### 전원선 연결

![어댑터](https://github.com/user-attachments/assets/48b6f183-f1e4-4e54-ac32-e12a8b48cfda#.png)

이제 전원선을 연결할 차례이다. 어댑터는 12V에서 왔다갔다 변압을 할 수 있고 게다가 여러 종류의 연결부 특히나 내가 지금 쓸 나사를 조여 고정할 수 있는게 있기에 이걸 선택했다.

![bad1](https://github.com/user-attachments/assets/2717b7e7-5272-48e1-ab18-e136c3f7b266#.png)

근데 이것도 선이 얇아서 하... 결국 다시 손톱깍기 신공을 사용했다.

![bad2](https://github.com/user-attachments/assets/62f4e02f-2137-4f74-8a32-5ff7452e88a4#.png)

그리고 이렇게 뭉쳐 넣은 뒤 나사를 조여줬는데 

![수축튜브](https://github.com/user-attachments/assets/07aeccf9-1fb1-403c-b92e-da562711c74f#.png)

생각해보니 내가 수축 튜브를 샀던지라 이것저것 잘 작동하나 확인 한 후 더 두꺼운 확장 선을 연결하고 튜브로 꽉 조여줬다. 

이거 수축 튜브가 좋은걸 산게 튜브가 다 조여들지 않아도 내부의 빨강, 파랑 색의 띄가 먼저 부푸러 오르면서 선을 꽉 조여준다. 그 덕에 듀브 자체를 완전히 조이지 않아도 되 넘 좋다. 다만 유지보수는 살짝 빡샐지도?

### IP 설정 및 접속해보기

![선 연결](https://github.com/user-attachments/assets/c9223d81-bbb6-4da2-93e7-af00c361cf45#.png)

이제 이렇게 랜 선 따로, 전원선 따로 인가할 수 있게 되었다. USB로 안되냐 할 수있는데 이 보드가 아쉽게도 usb를 전혀 지원하지 않아서 불가능 했다. 카메라만 때서 옮기는건 가능할지도 모르겠다.

일단 난 테스트를 위해 우분투가 깔린 노트북으로 테스트를 진행하였다.

![Lan1](https://github.com/user-attachments/assets/eaf94bfe-c4d7-4b26-a580-05f6b5da8878#.png)

인터넷을 확인해보니 새로 보이는 **enx00e6c3e091b** 라는 녀석이 뜨긴 하는데 아이피도 할당되지 않아서 뭘 해야하지? 싶었다.

찾아보니 지금 이 IP 카메라가 IP를 못 받아서 깡통 상태이기에 내 우분투를 DHCP 서버로 구현할 필요가 있었다.

![dhcp](https://github.com/user-attachments/assets/efca98ea-704c-4a68-ad7f-6522db123c92#.png)

네트워크에 들어가보면 유선 케이블이 하나 보인다. 

![IPv4](https://github.com/user-attachments/assets/f83cbea1-20c5-4842-9450-cb6ec6b1b958#.png)

> 참고로 이건 실패한 방법이다.

여기서 IPv4로 들어가보면 원래는 자동(DHCP)가 되어있을건데 이걸 `다른 컴퓨터에 공유`로 바꿔서 우분투가 자체 내부망을 만들게 했었다.

![lan3](https://github.com/user-attachments/assets/b1a21b9d-369d-49b0-b17f-bc48f7c2ef99#.png)

이제 내 아이피가 할당 되었으니 cctv도 됬겠지?

![nmap](https://github.com/user-attachments/assets/4b1d69b6-c836-4257-8565-9c730587cc21#.png)

는 아니였다. 내 컴터는 뜨는데 이놈의 lan은 분명히 신호가 간다며 랜 케이블에 led가 깜빡거리긴 했지만 정작 스캔되는건 없었다.

![what](https://github.com/user-attachments/assets/790efaf3-c4a6-4950-b33f-ab051230a83c#.png)

그래서 한번 이 네트워크로 무슨 패킷이 오긴 하나 하고 `tcpdump`를 이용해 기다려봤더니 CCTV 왈...

- **tell 0.0.0.0** : 나 아직 IP 확정 안했어!(DAD, Duplicate Address Detection)
- **who-has 112.171.197.105** : 아무도 이 아이피 안쓰면 내가 고정으로 쓸거야!

인데 지금 우분투의 아이피 대역이랑 다르죠? 그러니까 스캔도 안되고 통신도 안 되었던 상황이였던 것이다.

> 여기부턴 성공

![수동](https://github.com/user-attachments/assets/3adc5aa4-2dd1-4fe2-a1fe-315ed1e63442#.png)

그렇기에 아예 수동으로 IP를 고정시켜주고

![renmap](https://github.com/user-attachments/assets/9baf86b1-f208-40cc-950b-6b9c0040351c#.png)

다시 nmap을 돌려주면? 와 손바닥보다 작은 보드에 뭔 열린 포트가 이래 많을까.

![web](https://github.com/user-attachments/assets/ccd056e3-b746-4009-b5fb-dca077d29835#.png)

80번 사이트가 열려있다고 하니까 한번 들어가보면 이렇게 카메라 사이트로 가게 된다.

근데 난 여기서 이 사이트의 비밀번호가 우리 집에서 설정했던 카메라 비밀번호인줄 알았는데 그게 아니라 그냥 디폴트 비밀번호인 `1234567`이였다. 오잉?

이거 뭔가 shodan으로 open cctv 찾아다녀본 사람은 어쩐지 익숙할 수도 있는 그런 사이트일거다. 

근데 진짜로 맞다. 이게 밖 네트워크로 보이게 되면 shodan에 찍히게 되고 그중에도 80번 포트가 열려있다면 이렇게 접속할 수 있게 되는 것이다. 물론 내 네트워크는 로컬로 돌려서 괜찮지만.

![사이트 접속 성공](https://github.com/user-attachments/assets/aeb7095e-0c35-4165-9eb2-cb681e193e92#.png)

접속에 성공하고 나면 이렇게 firefox에서 플러그인 못써욧! 하고 화면은 안 보여준다.

그래도 설정에 들어가 아까 본 IP를 바꿀 수도 있고 화면 출력에 대한 내용이나 해상도, 오디오, 사람 감지 등등 많은 것을 볼 수 있다.

### pyhon으로 연결해 영상을 보자

하지만 지금은 브라우저를 바꾸지 않으면 영상을 볼 수 없잖아? 게다가 난 이걸로 yolov를 돌릴 수도 있는걸?

그래서 아예 파이썬으로 코드를 짜 봐보기로 했다.

```python
import cv2

# 서브스트림 사용 (stream = H.265 → stream0 = H.264 저화질이지만 빠름)
# 메인스트림 쓰려면 /stream 으로
url = "rtsp://admin:123456@112.171.197.105:554/stream"

cap = cv2.VideoCapture(url, cv2.CAP_FFMPEG)

# 버퍼 최소화
cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

# UDP로 전환 (TCP보다 빠름, 직결 환경에서 유리)
cap.set(cv2.CAP_PROP_OPEN_TIMEOUT_MSEC, 5000)

cv2.namedWindow("CCTV", cv2.WINDOW_NORMAL)
cv2.resizeWindow("CCTV", 1280, 720)

while True:
    # 버퍼 비우기 - 가장 최신 프레임만 가져옴
    cap.grab()
    cap.grab()
    ret, frame = cap.retrieve()
    
    if not ret:
        break

    cv2.imshow("CCTV", frame)
    if cv2.waitKey(1) == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
```

되게 짧게 코드가 짜여졌는데 

![생각보다](https://github.com/user-attachments/assets/bbacb7df-6b55-42be-ba98-d8a5a2e5c3f7#.png)

생각보다 영상 딜레이 자체는 많이 줄일 수 있어서 만족이다. 다만 아직 아까 말했던 화질 문제를 해결하긴 해야겠다.

분명 해상도를 1920x1080 으로 했는데 어째 이전에 쓰던 친구(지금은 가버리신 다이소 웹캠)랑 화질이 거의 비슷해 보였다.

### 1일차 정리

일단 오늘은 여기까지 해서 한 4,5시간 걸렸나? 싶은데 그래도 선도 꼬아서 예쁘게 정리했고 무려 랜과 전원선도 인가하는데 성공했다!

다만 뭔가 또 이렇게 되니 드는 생각이 이거 그냥 차라리 usb에 연결도 못하는데 전원선 따로, 랜선 따로 연결하려니 어째 poe가 더 좋아 보이는 느낌? ㅋㅋㅋ

그래서 아마 남은 3 친구중 하나는 아예 리튬 베터리도 많겠다 충전 모듈과 승압 모듈도 연결해서 무선으로 만들어 버릴 수도 있겠다는 생각이 든다. 거기다 아예 무선 모듈도 달면? 그야말로 진짜 무선 카메라가 되어버리는 거겠지?

근데 일케되면 어째 처음 하려던 작업의 의의가...

뭐 그래도 도전은 좋은거니까. 이번에 많은걸 배우기도 했고. 어째 난 진짜로 메카트로닉스 학과에 맞긴 할지도?

이렇게 마무리 하고 다음번엔 아예 펌웨어도 갈아엎어 Thingino를 넣어보기로 하자!

아 참고로 이거 웹캠으로 쓰려면 진짜 obs로 rtsp 영상 받아온 후에 가상 카메라 시작으로 연결해야하더라... 이런...