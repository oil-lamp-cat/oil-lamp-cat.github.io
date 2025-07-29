---
title: "[Google Cloud] 마인크래프트 서버 만들기"
date: 2025-1-18 18:50:15 +09:00
categories: [google cloud, 마인크래프트]
tags: [서버]
pin: true
---

## 시작

2일 전 1월 16일 드디어 훈련소를 마치고 사회에 나왔다

물론 a형 독감과 함께라는 문제가 있었지만 일단 나오고 나니 너무 기분이 좋다

훈련소에서 만난 사람들과 마크 `24시간 마크 서버`를 간단하게 열어서 놀아볼까 하는 생각에 시작한다

## 선택

마인크래프트 서버를 여는 방법에는 여러가지가 있다

- 개인 컴퓨터
- 미니 컴퓨터
- 외부 서비스

일단 내가 고려해볼 것은 24시간 돌릴 것이지만 개인 컴퓨터를 켜놓고 있기에는 잠 자는 시간동안에도 컴퓨터를 옆에 켜 놓고 팬 돌아가는 소리를 들어야하니 나에게 선택지는 외부 서비스와 미니 컴퓨터 중 하나가 되겠다

외부 서비스에는 `Microsoft Azure` 과 `Google Cloud`가 있다

미니 컴퓨터로는 따로 구매하거나 내가 전에 작업했던 `Rpi 4B`가 있다

처음에는 `라즈베리파이`를 이용하려고 했었다. 그런데 생각해보니 

![Image](https://github.com/user-attachments/assets/453ee0c3-2609-40eb-abab-fe7e3344adbd)

우리 집이 좀 많이 오래된 곳인지라 랜선을 끌어오려면 벽을 통해서가 아닌 거실을 통과하여 라우터에서 직접 가져와야하는데 하필이면 출입문이 막고 있어 선을 끌어오는데 미관적으로 별로일 것 같아 라즈베리파이는 일단 미뤘다

하지만 뭐 결국에는 라우터도 오래된지라(4년) 무선인터넷 속도가 느리니 랜선을 끌어오기는 할 것이다. 하지만 지금은 몸이 아프니 좀 나중에나 하겠지

그렇다면 이제 `외부 서비스`를 이용하는 방법만이 남았는데 난 이미 `Microsoft Azure`을 재미사마 `안드로이드 구동`을 위한 VM 서비스로 한달 동안 썼기에 이제 무료 토큰은 남아있지 않았다 (그런데 이렇게 만들어 놓고 기어코 라즈베리파이에 Android Lineage 버전을 설치 한뒤에 게임 구동에 까지 성공했었다. 그래서 VM에는 Windows를 설치하여 객체검출에 사용했다는 이야기가...)

그럼 지금 당장 할 수 없는 방법들을 열외해 보면 `Google Cloud`를 써야겠지?

## Google Cloud 무료 서비스 등록하기

![Image](https://github.com/user-attachments/assets/e0c6ce19-ce5c-4538-bf7f-4dce01f8e76e)

만약 처음 구글 계정으로 서비스를 이용하고자 한다면 `무료로 시작하기`가 있을 것이다. 그럼 구글 계정만 계속 만들면 무한으로 쓸 수 있나? 싶은 생각이 들기도 하지만 아니겠지

![Image](https://github.com/user-attachments/assets/635be07a-af8a-4f34-9011-7cec72d50c72)

300달러의 크레딧을 무료로 90일 동안 쓸 수 있다고 한다

일단 써보고 90일 안에 따로 서버를 구성한다면 옮기면 되고 아니면 다른 방법을 찾아보던가 하자, 일단은 간단히 가지고 놀 생각이니까

![Image](https://github.com/user-attachments/assets/d5d038a2-64fd-410d-9a07-87c221412dfd)

간단한 본인 정보를 넣고 나면 바로 사용할 수 있다

![Image](https://github.com/user-attachments/assets/aaa9f903-fc74-4db1-b85a-c0c7f8f2d58d)

당연지사 결제는 자동 이체로 전환되지 않는다고 한다

![Image](https://github.com/user-attachments/assets/7b6302f7-8efa-4079-9d26-65e3efbfcce5)

자 모든 정보를 입력하면 이제 곧 바로 서비스를 이용할 수 있게 된다

## 서버 생성하기

![Image](https://github.com/user-attachments/assets/34d54222-5f6a-4d58-89d2-a942174b3567)

꽤 많은 크레딧이 들어왔다

![Image](https://github.com/user-attachments/assets/e2eda44e-c052-4aea-9a63-8fa192cb0b54)

시작하면 바로 `My First Project`에 들어와있을 것이다

![Image](https://github.com/user-attachments/assets/4630a765-563b-4435-b542-4c00eb6bd2be)

데시보드에서 가상 `VM 인스턴스`에 들어가 서버를 생성하자

![Image](https://github.com/user-attachments/assets/20f6d014-553d-4d3f-a942-02b90d1537b2)

처음 들어가면 위와 같은 사진이 뜰 텐데 사용을 누르면 2분 정도의 시간이 지난 후 

![Image](https://github.com/user-attachments/assets/2040582c-7ecd-48d0-bce9-0ae98a8b08d5)

무한 로딩에 빠졌다.. 뭐지? 컴퓨터에 랜선이 아닌 무선랜을 쓰고 있어서 그런가? 아닐텐데 뭐가 문제인지 모르겠다

![Image](https://github.com/user-attachments/assets/4b06394b-9aad-4b1c-a1f5-222f274b944a)

페이지를 `다시 로딩(F5)`하니 제대로 페이지에 들어가졌다. 버그였던걸로

이제는 나 처럼 이미 한번 `Azure` 서비스나 다른 서비스를 이용해 본 사람이라면 쉽게 할 수 있을 것이다

![Image](https://github.com/user-attachments/assets/e20f40d7-9dd6-419f-a06c-42e2e39b5364)

![Image](https://github.com/user-attachments/assets/63cb6209-65b9-4b63-bd79-0d374315ced1)

머신 구성

- 리전 : 서울 
- 영역 : 자유
- N2 CPU (마크 서버는 싱글 코어를 사용한다고 한다)
- 코어 : 2
- 메모리 : 16GB

만약에 이 세팅에서도 잘 돌아가고 메모리를 8GB로 맞춰도 잘 돌아간다면 라즈베리파이로 도전해 봐도 좋을 듯 하다

![Image](https://github.com/user-attachments/assets/2cd45a4b-90e1-42d4-b171-e83e204b2861)

만들기 전 OS 및 스토레지에서 기본 설정인 `Devian`에서 내게 더 익숙한 `Ubuntu`로 변경 후 SSD스토레지로 설정하여 25GB의 크기를 할당해 주었다 (일단 둘 다 Linux기반이기는 하다. 게다가 우리는 딱히 VM에 들어가 GUI를 쓸 일은 없다)

![Image](https://github.com/user-attachments/assets/aaabc66c-7435-4476-a932-1a713167d994)

아니 그냥 50GB로 설정해 주었다. 이건 내맘

![Image](https://github.com/user-attachments/assets/5b714463-8aea-411f-9ab9-1e80a0f50ebc)

90일이면 3달 월 114.22를 쓰게 되고 내가 가진 크레딧은 442.18 꽤나 잘 책정된 것 같다

![Image](https://github.com/user-attachments/assets/9a44084b-d5b4-4797-bd88-66a5ab9bea05)

이 때 내가 찾아보던 사이트들에서는 네트워크 탭에서 위 두 트래픽을 허용해 주라는데 나는 왜인지 이해하지 못했다

마인크래프트 방화벽을 여는데 HTTP, HTTPS가 필요한가?

![Image](https://github.com/user-attachments/assets/6d19fdd1-8a2d-4ddd-9ec1-88034059414a)

예약 버튼을 눌러 서버 IP도 할당해보자. 결과에 나오는 IP는 이제 친구들과만 공유하길 바란다

**만들기** 버튼을 누르면 서버를 생성할 수 있다

![Image](https://github.com/user-attachments/assets/11582e8b-33c4-4570-9b7a-cd529efc3952)

머신(서버용) 생성 성공

## 방화벽 설정

외부에서 이 서버에 접속하기 위해서는 당연히 방화벽을 설정해줘야 한다

하다못해 라즈베리파이도 FTP, VNC 쓰려고 방화벽을 설정하기도 한다

![Image](https://github.com/user-attachments/assets/6d8d8974-dd1d-498a-add8-4572b4f13ad3)

좌측 탭에서 방화벽 설정을 해보자

**방화벽 정책**에서 **방화벽 규칙 만들기**를 하자

![Image](https://github.com/user-attachments/assets/1e9d60b3-1833-4810-beea-1b47aab929f7)

이름은 본인이 기억하기 쉽게 설정

![Image](https://github.com/user-attachments/assets/3f065d96-4c14-460d-8c2d-60149e293443)

포트는 TCP 포트로 열고 마인크래프트 서버를 위한 포트인 `25565`을 넣어주자

진짜 HTTPS랑 HTTP는 왜 필요한거지? 모드용 서버와 바닐라 서버를 모두 완성한 후 서버에서 잘 놀고있는 지금도 글을 다듬고 있는 지금도 이해하지 못했다

![Image](https://github.com/user-attachments/assets/ff9f1329-d792-4fbb-b23b-2958fcb398af)

만들고 나면 이렇게 `VPC 방화벽 규칙`에서 볼 수 있다

## 마인크래프트 서버 구동 준비

다시 `Computer Engine` 탭에서 `VM 인스턴스`로 들어가 `SSH`에 접속하자

![Image](https://github.com/user-attachments/assets/60d28e41-6d5f-46b3-ba65-579c8e66a779)

새로운 창에서 SSH에 접속할 수 있다

![Image](https://github.com/user-attachments/assets/31b237ad-5079-400c-9c64-592c19dde37a)

`root`권한 설정을 위해 비밀번호를 결정했다

내 생일로 설정

![Image](https://github.com/user-attachments/assets/029da4eb-0242-4983-b321-6ff5a737c269)

매번 리눅스를 키면 하곤 했던 `apt update`와 `apt upgrade`를 하자

![Image](https://github.com/user-attachments/assets/7d1f76d3-715c-486d-8f0d-444b795b7604)

마인크래프트 서버용 포트인 `25565`와 `OpenSSH`를 쓰기 위한 포트를 열어주자

![Image](https://github.com/user-attachments/assets/22de2153-8fb4-4124-8f3c-d5a4d160f34d)

이제 방화벽을 활성화 시켜주면 끝!

![Image](https://github.com/user-attachments/assets/d71a05d8-9874-4663-bfad-9f4ca1c35ddd)

상태를 확인해 보아도 포트가 잘 열려있음을 알 수 있다

## 마인크래프트 서버 구동 설치 (paperMC) - 바닐라

이제 정말로 마크 서버를 구동시키기 위한 마지막 단계를 시작하자

나는 바닐라 서버 구동을 위해 `PaperMC`를 이용하고자 한다. 마크 버전은 가장 최신 버전을 쓸 것이다 

![Image](https://github.com/user-attachments/assets/5f3bd865-d132-4ce7-bbab-9cf845caf3f2)

일단 시작으로는 `OpenJDK 21`버전을 받아주자

![Image](https://github.com/user-attachments/assets/a6152bfc-e15e-454e-b5fe-f83318e53b1f)

그 후 마인크래프트 계정을 생성하여 Root 에서 일반 계정으로 전환한다

![Image](https://github.com/user-attachments/assets/5ea7a6e1-3501-4ec2-98d8-3e72310b1f01)

그 후 서버를 생성할 폴더를 만들자

![Image](https://github.com/user-attachments/assets/dbf90371-cbd2-4d1b-a782-f28e89fbdd60)

가장 최근 버전의 `Paper MC`를 설치할 것인데 [paper](https://papermc.io/downloads/paper)사이트에 들어가 Build를 우클릭하고 링크를 복사해서 다운받을 수 있다

![Image](https://github.com/user-attachments/assets/9609d3c2-d4e8-4c29-ae3a-394bfb31f291)

설치된 것을 확인했다면 서버를 열어보자

![Image](https://github.com/user-attachments/assets/1d22b0a4-7cca-4740-8ef5-27ed8ccce526)

라고 하기에는 문제가 발생하였다

아무래도 다운로드 상에 문제인지 76KB만 다운이 되고 내가 원하는 서버 실행 파일을 얻지 못했음으로 `wget https://api.papermc.io/v2/projects/paper/versions/1.21.4/builds/117/downloads/paper-1.21.4-117.jar` 명령어를 통해 다른 방식으로 다운로드 하였다

![Image](https://github.com/user-attachments/assets/c6390373-98ee-41d2-bbcc-c1a8c7b7862a)

이제 서버 실행에 성공했고 `eula 동의`를 해야한다

`nano eula.txt` 명령어로 파일에서 `false`값을 `true`로 변경하고 다시 실행하자

![Image](https://github.com/user-attachments/assets/968a7756-dd2f-4f5b-86da-2d62db47d4ca)

서버 실행에 성공했다!!

![Image](https://github.com/user-attachments/assets/48cc05ea-47db-4167-9617-b2a34147e236)

그리고 매번 `java -Xms8G -Xmx16G -jar paper-1.21.4-117.jar nogui`을 치기 귀찮아서 그냥 bash 실행파일을 만들었다

![Image](https://github.com/user-attachments/assets/1fb33d3b-133a-4969-9a46-7978b37307ca)

이제 아주 쉽게 서버를 열 수 있게 되었다

만 문제가 생겼다. SSH를 닫으면 서버가 꺼진다

왜냐? SSH 터미널에서 실행시키고 있었는데 그 터미널이 꺼졌으니 당연히 서버도 꺼질 수 밖에

## 서버 24시간 유지하기

뭐 방법은 여러가지가 있다

- tmux
- screen
- 백그라운드 실행

이 중에 나는 screen을 써보기로 했다

chat gpt가 이걸 추천하더라고

참고로 서버 종료 명령어는 `stop`이다

### 서버 시작

```
screen ./start.sh
```

### 스크린 리스트 확인

```
screen -ls
```

### 스크린 접속

```
screen -r (이름)
```

### 스크린 삭제

```
screen -S (이름) -X quit
```

## 접속해보자 1차

![Image](https://github.com/user-attachments/assets/11a0ea02-6048-4aa8-8221-127c251ff0cf)

일단 성공이다.. 와!

![Image](https://github.com/user-attachments/assets/65f1667c-f466-4b67-934c-d28ed75e6a41)

다른 사람들도 들어와서 사용 가능 확인 완료!

## 서버 관리를 위해 플러그인 설치하기 (봇 생성) - PaperMC

계속 Google Cloud에 들어가서 서버 상태를 확인하는 것 보다는 디스코드를 이용해서 서버와 통신을 통해 확인하는 것이 훨씬 빠르고 편할 것 이라고 생각해 플러그인을 추가하고자 한다

[DiscordSRV](https://github.com/DiscordSRV/DiscordSRV)을 추가 할 생각이다

정리하는 지금(25-1-24)에 와서 서버를 써보면서 안 사실이지만 `DiscordSRV`는 서버 상태를 알려주지는 않는다

채팅이나 도전과제 달성, 서버에 들어오거나 나갈 때 봇을 통해 알려준다

방법은 매우 간단하다

```
cd /server/plugins
```

플러그인 파일에 들어가 `wget` 명령어로 가장 최신 .jar파일을 다운받으면 된다

한번 다운받은 후에는 서버를 다시 실행시켜 Discord 봇 토큰을 넣으라는 메세지가 뜰 때 까지 기다리다 서버를 종료한 뒤에 봇 설정에 들어가자

![Image](https://github.com/user-attachments/assets/86e9d305-ea56-4a9a-b295-cc4c75b3914e)

이렇게 봇을 생성하고 나면 이제 다시 서버로 돌아가 토큰을 넣어주자. 복사한 토큰은 서버의 `./config.yml`에 넣어주면 된다

봇 토큰을 발급 받은 후 `./plugins/DiscordSRV/config.yml`에 넣었다면 봇 초대 링크를 생성해 디스코드 서버에 봇을 초대할 차례이다

![Image](https://github.com/user-attachments/assets/c06fffdb-cbe4-4cce-ac79-5316050991bc)

`OAuth2`에 들어가 맨 아래로 페이지를 내려보자

![Image](https://github.com/user-attachments/assets/6820aeac-e958-4539-99d5-0e1c53ff3412)

여기서는 서버에서 어떤 권한들을 쥐여줄지 선택할 수 있는 페이지 이다. 나는 여기서 `SCOPES`는 `BOT`으로 `BOT PERMISSIONS`은 `Send Messages`, `Manage Messages` 두가지 기능을 사용하겠다

이제 가장 아래 있는 링크 생성기에서 링크를 만들고 브라우저에 입력하면 봇을 어떤 서버에 부를지 정할 수 있게 되고 생성된 봇에 설정을 해줄 시간이다

## 서버 관리를 위해 플러그인 설치하기 (봇 세팅)

![Image](https://github.com/user-attachments/assets/ce659452-11bd-41c5-ba47-94a1b44495e5)

먼저 디스코드에서 봇이 사용할 채널을 옮겨주자

사실 이 외에도 많은 다른 코드가 있겠으나 사실 이젠 끝이다 이 상태로 서버를 활성화시켜주면 봇도 같이 활성화가 된다

![Image](https://github.com/user-attachments/assets/b4c1d7a0-1d5f-4bf4-a02e-032f15bbdb42)

서버가 실행될 때 알아서 플러그인을 잡아주니 얼마나 좋은가

![Image](https://github.com/user-attachments/assets/8615d5fb-39c4-4e52-a1a3-1f27783f4650)

아닌가? 이런.. 봇의 권한이 조금 더 필요했었다

![Image](https://github.com/user-attachments/assets/5335a668-3de6-438d-b843-4ea6aea9b164)

이제는 되겠지?

![Image](https://github.com/user-attachments/assets/c51ae8a4-7480-4a19-b267-81101d51a34e)

오오오오오 됬나!

![Image](https://github.com/user-attachments/assets/ae06329b-0f33-4e4a-a1b7-cc1465500be4)

성공이다

![Image](https://github.com/user-attachments/assets/35517a9f-4dd3-4704-9194-b227858e18c7)

채팅도 확인되었다

![Image](https://github.com/user-attachments/assets/f95bf3bb-8e20-4213-afb7-c471c8dcdcc4)

계속 알람이 울리면 좀 그래서 아예 따로 채널을 하나 만들었다. 이제 마인크래프트 서버는 쉽게 만들 수 있겠다

![Image](https://github.com/user-attachments/assets/ac268e00-7235-4151-bcfc-1ac1d0c8bd73)

명령어는 안뜨는 걸로 확인되었다. 일단 당분간 이 서버는 이렇게 냅두는 걸로 하자

## 마인크래프트 서버 구동 설치 (Fabric)

모드를 사용하기 위해서는 `Fabric`이나 `Forge`를 이용해야 한다

또한 `Forge`는 훨씬 많은 모드를 보유하고 있지만 조금 무겁고

`Fabric`은 모드의 수가 적지만 훨씬 가벼운 서버에 친화적이다 고로 `Fabric` 너로 정했다

(25-1-24 : 라고 해놓고 모드팩을 설치하는 바람에 결국 싹 다시 날렸다는.. 그러니 처음 모드 서버를 만드는 사람은 Forge 탭으로 가시길)

![Image](https://github.com/user-attachments/assets/ce889742-d7dd-4571-aba5-9ee70e7689d5)

VM 설정은 위와 동일하다

![Image](https://github.com/user-attachments/assets/b20d6403-bae3-4c29-a3ed-f891fcb6660f)

또한 서버 구동 준비 까지의 과정은 완전 동일하다

이번에는 모드의 버전이 낮기에 OpenJDK의 버전은 17이 될 것이다

![Image](https://github.com/user-attachments/assets/815b7fa6-f4a5-446c-9c3d-9591bfa3ea81)

설치가 끝나면 minecraft 계정으로 돌아간다. 그리고 이제부터가 진짜 `Fabric`을 설치하는 과정이 되겠다

![Image](https://github.com/user-attachments/assets/8394ba5b-0517-4be4-b9c1-7265efbcd8e9)

공식 문서에 나온 대로 CLI 설치를 하고 실행을 해주면 서버는 실행하는데 성공한 것이다

```
java -Xmx12G -jar fabric-server-mc.1.20.1-loader.0.16.10-launcher.1.0.1.jar nogui
```

다시한번 실행용 `start.sh`를 만들고 `eula.txt`에서 동의로 바꿔주면

![Image](https://github.com/user-attachments/assets/622723bf-914b-4894-9c02-156e5c682cc8)

아 맞다 권한을 안줬네

![Image](https://github.com/user-attachments/assets/3f2f8ac7-c37c-4899-a4db-9c13ca6f3bb8)

권한을 주고 처음 실행시키게 되면

![Image](https://github.com/user-attachments/assets/aa076b2f-982a-41a3-bb75-01dadd5d0304)

이렇게 맵을 만들고 있는 것을 볼 수 있다

![Image](https://github.com/user-attachments/assets/535f1926-ef47-4ac1-b018-a1cf7b867272)

좋아 이제 서버를 만드는 작업은 끝났고 모드를 설치하고 맵을 다시 뒤엎어보자

내가 설치할 모드는 Prominence II RPG: Hasturian Era라는 모드팩이다

일단 설치해 보고 나중에 싹 다 갈아엎을 수도?

```
wget https://mediafilez.forgecdn.net/files/6088/184/Prominence%20II%20RPG%20Hasturian%20Era-v3.0.30hf.zip
```

모드 설치 경로는 위와 같다

다른 모드들도 그렇지만 파일 다운로드 경로를 못 찾겠다면 그냥 본인 컴퓨터에 한번 다운 받아보고 다운로드 링크를 써넣으면 된다

월드를 새로 갈아 엎을 때에는 `world`파일을 그냥 통째로 날려버려라 그럼 다시 만들어질 것이다

![Image](https://github.com/user-attachments/assets/c2be2f1d-ec71-40d4-b1b5-ed59c7e96ecf)

그.. 그만.. 이번 오류는 바로 의존성 모드가 필요하다고 한다..

```
wget https://mediafilez.forgecdn.net/files/4731/991/Luna-FABRIC-MC1.19.X-1.0.1.jar

wget https://mediafilez.forgecdn.net/files/6036/402/fabric-api-0.92.3%2B1.20.1.jar

wget https://mediafilez.forgecdn.net/files/5772/682/Necronomicon-Fabric-1.6.0%2B1.20.1.jar
```

![Image](https://github.com/user-attachments/assets/b86110d2-1076-4ca7-b345-f541a8665dfa)

그래도 문제가 계속 생긴다. 일...단은 다 삭제하고 내일 다시 해봐야겠다. 어쩌면 그냥 모드팩이 아니라 모드만 까는 것이 훨씬 쉬울지도, 라고 생각했으나

![Image](https://github.com/user-attachments/assets/28e6b3f6-6618-48a8-b7ad-a7a3a7158122)

충격적이게도 내 본 마인크래프트를 설치하였을 때에 `curse forge` 앱에 서버용 다운로드가 뜨는 것을 발견하였다

설마 이거를 따로 써야하나?

![Image](https://github.com/user-attachments/assets/7b865553-a9e5-42a2-8737-c892e34588c2)

맞았다! 파일을 다운 받은 후 zip파일을 풀고 `start.sh`파일에 권한을 부여한 후 실행시키면 알아서 서버를 열어준다

![Image](https://github.com/user-attachments/assets/d2840e4a-94c6-4d45-ae7a-876df7f269a4)

그리고 확인해 보니 확실히 모드 서버가 실행하는데 있어 엄청나게 오래 걸린 다는 것을 알 수 있었다

![Image](https://github.com/user-attachments/assets/a7e746fc-5f83-44a3-a3db-b663585896b4)

모드 서버에 접속하는데 성공은 했으나 아무래도 내가 설정한 VM이 모드팩을 못 버티는 듯 하다 이건 뭐 나중에 좀 더 바꾸기로 하자

(25-1-24 : 사실 생각보다 오류가 뜨지만 맵 확장 시에만 조금 느렸지 모드팩을 즐기는데에는 무리가 없었다)

## 마인크래프트 서버 구동 설치 (Forge)

서버를 갈아 엎고 Forge용 서버로 필요한 모드만 넣기로 하였다

### 1. 서버 갈아엎기

파일 내부를 전부 삭제 후 [Forge](https://files.minecraftforge.net/net/minecraftforge/forge/) 사이트에 들어가 원하는 버전을 선택한 후 위 `Fabric`에서 하던 방법을 다시 하면 된다

![Image](https://github.com/user-attachments/assets/23b0a6be-b918-46e9-bd42-4809d366e885)

이렇게 서버 준비가 끝이 나면 시작은 `run.sh`파일로 하면 된다. 위에 보이는 `start.sh`는 서버를 처음 만들 때 필요해서 만들어 둔 것이기에 사실 한 번 실행 했다면 삭제해도 무방하다

### 2. 모드 선정 후 다운로드 하기

일단 이번 서버의 버전은 **1.20.1**로 결정했다

모드를 선택할 때에는 [curseforge](https://www.curseforge.com/minecraft/search?class=mc-mods)에 들어가 다운로드 하면 되고 이 때 `Forge`인지 `Fabric`용 인지 확인하고 버전도 맞춰서 다운하길 바란다

![Image](https://github.com/user-attachments/assets/a916dc9b-ffe4-44cf-b5ef-ed6ff97eef84)

이번에 나는 이정도의 모드를 설치해 보고자 한다

뭐 하는 모드인지는 나중에 시간이 남는다면 적어볼 수도?

이제 나는 이 파일을 나의 마크 서버에 보내야 한다

> 25-1-24

- aether : 천국모드
- alexsmobs : 새로운 몬스터, 동물 추가
- animal_armor_trims : 동물 갑옷
- appleskin : 음식 먹었을 때 추가 효과
- betterfpsdist : 서버의 FPS 증가
- BetterThirdPerson : 3인칭 추가 기능
- BiomesOPlenty : 바이옴 추가
- carryon : 물건 들 수 있음
- chat_heads : 채팅치면 얼굴 나옴
- Clumps : 경혐치 구슬 덩어리로 모아줌 - 랙 감소
- embeddium : 이게 쉐이더였나?
- EnchantmentDescriptions : 이름 그대로 인첸트 설명
- gravestone : 무덤
- irons_spellbooks : 마법책 모드
- Jade : 누구세요?
- jei : 아이템 검색 등등
- journeymap : 지도
- JustEnoughResources : jei랑 합쳐져서 추가 정보
- modernfix : 움직임 인가? 기억이 안나네
- moonlight : 다른 모드에 필요
- mowziesmobs : 모찌라고 불리는 모드, 여러 몬스터 및 바이옴 추가
- NatureCompass : 지형 찾기 나침반 추가
- polymorph : 모드마다 조합법 안 썪이게 정리
- skinlayers3d : 스킨 3d로 구현
- sodiumdynamiclights : 이게 쉐이던데?
- sophisticatedbackpacks : 가방 추가
- twilightforest : 황혼의 숲
- waystones : 텔레포트 할 수 있는 웨이포인트 비석 추가

### 3. 모드 전송

일단 한번 `scp` 명령어를 사용해 보자

는 시작부터 문제네

![Image](https://github.com/user-attachments/assets/3fd180ef-0c65-4abd-91e7-1664644e46ff)

아무래도 내가 서버측에서 마크용 포트만 열어놔서 막히는 듯 하다. 이러면 또 다른 방법을 써야지

`github`서버에 올린 뒤에 이걸 다운받으면 되겠지?

![Image](https://github.com/user-attachments/assets/3e42245d-348d-41f0-ab25-a0c08ed87f4f)

오케이 바로 실패. 뭐 당연한 거였겠지만 용량의 문제일 것이다

그렇다면 그냥 외부 서비스를 이용하자

![Image](https://github.com/user-attachments/assets/e4bc31a6-1c52-4b43-afb8-845deb3bc46d)

그런데 `file.io`는 또 뭔가 `lime`이랑 합병 되면서 이상해졌다. `wget`사용 불가

그냥 `github 레포지토리`에 올린 뒤에 다운 받자

![Image](https://github.com/user-attachments/assets/f6c60448-d700-45a6-b346-350b4f114e39)

`zip`파일로 올리게 되면 용량에 문제가 생기니 원래 있던 레포지토리에 `하나씩`파일을 쪼개 넣으면 된다

![Image](https://github.com/user-attachments/assets/25506a0b-eb06-4f64-b167-b769216bfc54)

`git clone`으로 다운 받으면 성공

![Image](https://github.com/user-attachments/assets/fea5c608-39ad-4c36-8c4e-ca49de8000ce)

끝!?

![Image](https://github.com/user-attachments/assets/2e09c612-c28d-435b-a073-b43517c63095)

실행시키면 필요한 라이브러리가 매우 많다는 것을 알 수 있다.. 아이고

![Image](https://github.com/user-attachments/assets/3f65d390-5ef8-46cb-a4e5-9c4038a3d741)

다시 설치를 끝내고 실행을 해보면?

![Image](https://github.com/user-attachments/assets/17c302b7-706b-417d-970d-36985fea725e)

월드 생성이 시작된다!

![Image](https://github.com/user-attachments/assets/5746af4d-adca-40d1-935e-ba9183972f9c)

서버 구동 성공!

> 25-1-24

는 했지만 아직도 우리는 바닐라 서버를 즐기는 중이다

필요에 따라 다르겠지만 동시에 쓸게 아니라면 토큰도 아낄겸 서버 하나만 열어서 구동하여도 좋을듯 하다

## 마인크래프트 (클라이언트) 모드 설치

서버측 보다 훨씬 쉽다. 아니 사실상 과정이 동일하다 CLI가 아닌 GUI로 이루어진다는 것만 빼면 말이다

파일 내부를 전부 삭제 후 [Forge](https://files.minecraftforge.net/net/minecraftforge/forge/) 사이트에 들어가 원하는 버전을 선택한 후 설치를 진행하자

![Image](https://github.com/user-attachments/assets/799692c8-a66c-4c81-82f6-412069c1500f)

![Image](https://github.com/user-attachments/assets/ea0f4c82-3491-4c36-8c2d-1dab1b1c1a1d)

쭉 진행하면 된다

마크 설치도 완료된다면 모드를 전부 넣어주자

![Image](https://github.com/user-attachments/assets/dae619bb-7d32-4e0f-b843-2ebc46e2dc45)

![Image](https://github.com/user-attachments/assets/7c19fa73-9c8e-4039-96f8-7c516bd3c045)

모드를 몇가지 더 추가했다

![Image](https://github.com/user-attachments/assets/b13027fe-c7a1-4191-bb1b-adbe9ddcd15f)

모드 서버 접속 성공!!

## 끝?

4주의 훈련소 과정을 할 때에 한번쯤은 다시 한번 시도해 보고 싶다는 생각이 들었던 마크 서버 만들기

결국에는 하루만에 성공했네요

어릴땐 이게 어찌나 어렵던지.. 그만큼 최근 나오는 도구들이 더 쉽게 도와준다는 뜻도 있겠죠

다들 독감 조심하시길..

## 진짜 끝 1차

서버를 Forge용도로 변경하기 위해 Forge 관련 내용이 추가되었다

## 2025-01-24 끝 2차

다듬기까지 끝

## 메우 늦은 백업... (2025-07-29)

![ㅠㅠ](https://github.com/user-attachments/assets/c19ee2d7-e9c1-4d92-b1ab-aeb650bb6f4f)

정말 오랜만에 마인크래프트 서버 토큰 사용일이 지나 중지되었을 것이라 생각해 내용물만 잠깐 켜서 돈 내고 가져올까 하였으나.. 슬프게도 내용물이 통째로 없어졌다.

다들 백업 꼭 해놓으시길 바란다.