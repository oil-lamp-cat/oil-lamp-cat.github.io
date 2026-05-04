---
title: kali linux virtualbox 가상환경 다운로드
date: 2023-11-28 14:52:15 +09:00
categories: [Tools & Environment]
tags: [VirtualBox, Kali-Linux, 설치]
pin: true
---

>보통은 usb에 설치하는 방법을 이용해서 사용하고 있었으나, 책을 읽으며 공부하다 [virtualbox](https://www.virtualbox.org/)를 이용하기로 했다.

# 1.virtual box 설치
[Oracle VirtualBox](https://www.virtualbox.org/) 사이트에 들어가서 [다운로드](https://www.virtualbox.org/wiki/Downloads)에 들어가 본인의 컴퓨터 사양에 맞는 링크를 클릭해 설치하기 바란다.
![스크린샷](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/0c72712d-755e-4841-80d2-39cfd1b7811e)
내 컴퓨터는 windows에 설치할 것이기에 windows hosts를 눌러 설치 파일을 다운받았다.

 실행하기 전에 맞는(변조되지 않은) 설치 파일인지 확인하기 위해 [checksum](https://oil-lamp-cat.github.io/posts/window-checksum/)을 이용해 변조되었는지 확인을 하기 바란다.
 ![스크린샷](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/86cf8b56-24f5-4d16-958a-a1fe678b388f)

이제는 그저 next만 누르면 virtualbox를 설치할 수 있기에 굳이 필요 없지만 그래도 모르겠다 하는 사람을 위해 아래 사진을 첨부해 놓았다.
 <details><summary>설치 과정</summary>
 <div markdown = "1">

![스크린샷](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/bc915ca7-8b42-4df6-8d29-f872acbbb8a6)
Next

![스크린샷](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/4c2ee854-905e-4a21-ab03-4573df675c3d)
Next

![스크린샷](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/cfbd9f73-0480-48ac-90a4-c3a069d8ab8c)
Yes

![스크린샷](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/7e678b0b-fbc2-4cb8-a312-5a5ffed67f3a)
Yes

![스크린샷](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/af62caa8-917d-4803-95b6-57bbe69dc8a0)
Install

![스크린샷](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/ddf1b4a1-f7a9-45e1-8662-96b16265f2cc)
설치 대기

![스크린샷](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/0064669d-3595-4a43-9571-ca899a0877d3)
Finish 클릭

</div>
</details>

<br/>

# 2. VirtualBox 설정 및 머신 추가

>시작하기에 앞서 나는 **핸즈 온 해킹** 책을 기준으로 설정하였고 책을 따라하다 보니 이미 설정이 된 것들, 혹은 다른 점들이 있기에 기록한다.

내가 사용한 버전은 7.0 버전이다.
![스크린샷 2023-11-28 151018](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/333a7a4b-780d-45ff-80a6-c3342c7d389c)

가장 처음 virtualbox를 키게 되면 아래와 같은 화면을 보게 될 것이다.
![스크린샷 2023-11-26 233605](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/b62beb88-9a0e-47c8-97b9-6604eabb1b53)

여기서 우리는 파일 - 도구 - 네트워크 관리자 를 들어가 네트워크 설정을 보자.
![스크린샷 2023-11-26 233718](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/a52182fa-719d-4bca-af0a-d7f6bac9c979)

책에서는 이것을 직접 설정해 주어야 했지만 다행히! 우리는 이미 설정이 끝나있다. 그래도 한번 살펴보자.
![스크린샷 2023-11-26 233739](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/602cc0b3-6f8b-4be8-b544-93991ef1e4b6)
호스트 전용 네트워크란 내가 만든 가상환경들 끼리만 통신이 가능하게 될 인터넷을 의미한다. 처음에는 왜 사용하는지 몰랐으나, 예를들어 우리가 취약한 서버를 설치해서 해킹 실습을 하게 된다면(실제로 하게 될 것이다.) 그 서버가 연결된 외부인터넷에서도 접속 할 수 있으면 내 컴퓨터가 위험하기에 가상환경으로 접속할 인터넷을 한정시켜 주는 것이다. 그리고 ipv4가 192.168.56.1/24이다.

속성을 누르면 다음과 같은 화면을 볼 수 있다. 이것 또한 우리는 자동으로 맞춰저 있기에 건드릴 것이 없다.
![스크린샷 2023-11-26 235507](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/750f7f63-c6fe-4228-8407-983b2cde4e87)

하지만 **DHCP 서버**를 눌러보면 아래 화면과 다르게 서버 활성화가 꺼져있을 것이다. 우리는 이것을 활성화 해주면 된다.
![스크린샷 2023-11-26 235517](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/1b5b313d-3e13-48e1-8117-c954937a9175)

# 3. kali linux ios 다운로드

[kali linux](https://www.kali.org/get-kali/#kali-live)다운로드 사이트에 들어가서 live 버전을 다운로드 해주기로 하자

![스크린샷 2023-11-28 154045](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/e9df3b22-46c7-4b9d-aaa3-821a7d00ffd7)

좌측부터<br/>

* 개발중인 버전(버그 있을 수 있음)
* 배포 버전(버그 없음)
* 모든 툴이 전부 포함되어 있음

나는 live boot 버전 중 좌측버전을 선택하였다. 아무래도 불안정 하기는 하지만 USB persistence버전을 만들 때에 rufus(이제는 ventoy 사용)를 사용하게 되는데, 오류가 발생하여 이 버전으로는 라이브 버전으로 사용하기 어렵다고 생각하여 개발중 버전을 사용하였다. 
![스크린샷 2023-11-28 160718](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/e864d155-dca1-4e61-aba8-7e9be1f25674)

그리고 이번에도 다운로드 한 후 checksum을 해주도록 하자.
![스크린샷 2023-11-28 161237](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/9fe48b61-44e7-4afc-8afb-35bb75b5ec4d)

# 4. kali linux VirtualBox 가상환경 설치

아까 설치한 VirtualBox를 들어가 머신 - 새로 만들기

이름은 kali(VirtualBox에서 뜨는 이름), 폴더는 가상머신을 저장할 위치, ISO이미지는 지금 선택 할 수도 있으나 책을 따라가기에 선택하지 않았다.(선택하게 되면 아래 세팅이 자동으로 된다.) 그 외에는 아래 사진을 보고 세팅을 해주면 된다.
![스크린샷 2023-11-26 233929](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/07f543f3-8153-47ee-a4e4-e058622c7b35)

가상머신이 사용하게 될 메모리, cpu프로세서 수이다. <br/>내 노트북은 CPU 12코어 메모리 16GB로 아래 정도면 괜찮을 듯 해서 설정했다. <br/>
사용하다가 필요하면 변경할 수 있으니 적당히 설정하고 넘어가자
![스크린샷 2023-11-26 234242](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/1235c85f-efbd-48be-9356-2a7633065163)

가상머신이 차지하게 될 디스크 크기를 성정해 주는 것인데 만약에 가상하드가 이미 있다면 기존가상 하드 디스크 파일 사용을 누르고 나는 없었기에 새 가상 하드 디스크 만들기를 하였다. 추가적으로 미리 전체 크기 할당을 체크하면 사용 할 때마다 용량이 늘어나는 것이 아닌 한번에 정한 상태로 쓸 수 있다.(사용자 마음)
![스크린샷 2023-11-26 234334](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/4dddac28-05a6-45e6-9f04-73f43f1d6065)

최종적으로 이런 식으로 요약해서 보여준다.
![스크린샷 2023-11-26 234401](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/6aba87fe-0196-4a46-8628-688e31d4fbe5)

머신 만들기를 끝마치면 이제 설정을 들어가 인터넷, 칼리 리눅스 iso설치, ctrl+c,v 를 설정해 주자
![스크린샷 2023-11-26 234503](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/73474411-277f-404e-95ae-78230191d7e6)

네트워크 창으로 가면 어뎁터1이 있고 여기서 네트워크 어뎁터 활성화, NAT에 연결해 준다.
![스크린샷 2023-11-26 234559](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/a309b283-9644-4ba7-bb45-9d6f7e87132c)

어뎁터2에서는 가상환경끼리의 통신을 위해 만들었던(원래 있었던) 호스트 전용 어뎁터를 연결해 준다.
![스크린샷 2023-11-26 234611](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/a8c33426-06d4-4659-bb1b-285bbd6b67d9)

이제 칼리 iso를 넣어주자, 저장소 - 비어있음을 누르고 옆에 보이는 CD를 눌러 다음 사진과 같이 만들어주자.
![스크린샷 2023-11-26 234623](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/dc3aae7d-4e77-42b3-bc47-557f681e5607)
![스크린샷 2023-11-26 234657](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/f910f581-e819-40fe-b8e1-287c83b950f0)

클립보드 설정 : 일반 - 고급 - 양방향 설정
![스크린샷 2023-11-26 234848](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/f3c0e13b-5af2-4e62-a985-79daf5d3054d)

이제 시작을 눌러 칼리 리눅스 가상환경을 켜주자, 이런 화면이 뜰 텐데(혹은 다른 버전은 좀 더 밝은 배경) start installer를 눌러 가상환경에 다운로드 옵션으로 설치한다.
![스크린샷 2023-11-26 234939](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/63f56b33-1b25-41e8-b8f3-2576f8342f63)

책을 따라가기에 나는책에 나온 설정을 따라갔다. 한국어로 하고 싶다면 인터넷에 검색해 보길 바란다. 매우 많은 자료가 있다.
![스크린샷 2023-11-26 235133](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/6f20a88f-0ca3-43f2-b900-53683dad1bdc)
![스크린샷 2023-11-26 235147](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/fbf7f6da-fe78-466a-ad9e-3c910dde2b2d)
![스크린샷 2023-11-26 235159](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/671ad04e-f61d-4678-a797-2679c5c4b4a9)

잠시 기다리다 보면 이런 화면이 뜰텐데 이 글을 읽고 따라했다면 eth0가 컴퓨터에 연결된 인터넷이고 eth1이 가상환경끼리의 인터넷이 될 것이다. 고로 설치할 때에 필요한 인터넷은 eth0이다.
![스크린샷 2023-11-26 235237](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/4212a8ab-58af-47ef-9199-ca09a9b0fbde)

Hostname설정이다. 난 kali로 설정했다.
![스크린샷 2023-11-26 235711](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/4f77704f-52c9-4223-b22e-a9774624ba6e)

도메인이 있다면 설정하겠지만 나는 없다. 비운체로 continue하면 된다.
![스크린샷 2023-11-26 235722](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/e97e9167-8b50-4989-b199-3f6d11b13b2f)

Full name(username) 유저 이름이다. 칼리 로그인 하면 뜨는 이름이자 칼리 명령어 칠 때에 뜨는 이름이다.
![스크린샷 2023-11-26 235737](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/819c4934-2506-41e9-9952-1fdc38621c3a)

이것 또한 username이다 사실 영어를 읽어보면 사소한 차이가 있지만 나는 둘 다 같은 이름으로 설정했다.
![스크린샷 2023-11-26 235746](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/7097edf6-32c7-4fce-b2f8-078b833bce4e)

비밀번호 설정이다. 칼리 리눅스 암호
![스크린샷 2023-11-26 235804](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/62d66b98-156a-4682-9ad8-14b2080e06d5)

시스템 시간 설정인데 한국으로 했으면 한국이 뜨겠지만 나는 미국 설정이라 그냥 아무거나 골랐다.
![스크린샷 2023-11-26 235815](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/b463e22f-6976-45c6-aa77-bc6daf8bf65b)

파티션 설정이다. 우리는 가상환경에 90GB로 설정했고 그 곳에 깔리게 될 것이다.
![스크린샷 2023-11-26 235839](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/77180089-0dbe-4c5f-a7fc-99c24e0a9354)

바로 여기
![스크린샷 2023-11-26 235852](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/29184cf3-2820-4a65-ba87-a2d9da015170)

전체 파티션을 하나의 디스크에 설치하겠냐고 붇는 것인데 가상환경이니 하나에 전부 넣자.
![스크린샷 2023-11-26 235903](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/7de47985-8ed4-4caa-a744-f88d63146d2c)

설정을 하였으면 끝마치기를 누르자.
![스크린샷 2023-11-26 235914](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/c28a209c-9d1a-4d12-852f-095c57f77322)

디스크 포멧이 바뀐다는 의미인데 우리는 상관 없다 가상환경이니까.
![스크린샷 2023-11-26 235924](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/7447162e-2625-4bc8-99c4-cd52833d0cd8)

기다리면 Use a network mirror?라는 질문이 뜨는데 NO누르지 말고 무조건 Yes다 패키지 다운로드 해야하기에.
![스크린샷 2023-11-27 000855](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/c705e741-2cc0-4d6e-b370-25aec4d5aa23)

다음으로는 proxy를 설정할 것이냐 묻는데 우리는 필요하지 않다.
![스크린샷 2023-11-27 000918](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/21180322-fabc-497f-99d1-1b500eed4583)

설치를 쭉 진행하다 보면 GRUB boot loader를 사용할 것이냐 묻는데 우리는 가상환경에 설치하였으니 Yes
![스크린샷 2023-11-27 001014](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/964e8714-414e-43bf-9084-2a7501845a53)

그리고 그 설치 위치는 가상환경의 설치 경로인(화면에 떠있는) /dev/sda

이제 화면에 뜬 것 처럼 'Please choose Continue to reboot'을 따라 reboot해주면 된다.

다시 들어가면 다음과 같은 화면이 뜰 것이고, 위에서 설정한 아이디, 비밀번호를 치면 들어갈 수 있게 된다.

# 끝 마치며
아무래도 시간이 지남에 따라 편리성이 증가하기도 하고 조금씩 달라지는 것들이 있다보니 책을 선택할 때에도 가능하면 최신 책을 선택하는 것이 좋겠다. 물론 이론을 공부할 것이라면 괜찮겠지만 실습을 할 때에는 이것저것 찾아봐야 하는 경우가 있기에. 나중에 또 달라지는 점이 생긴다면 다시 와서 고치기로 하자.</br>(2023-11-29)