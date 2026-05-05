---
title: "[HP 컴퓨터] BootDevice Not Found"
date: 2024-11-10 18:18:15 +09:00
categories: [Tools & Environment]
tags: [Windows, hp]
pin: true
---

## BootDevice Not Found

![BootDevice Not Found](https://github.com/user-attachments/assets/a96a893d-38d1-4adf-b5c6-3bc6da8e849a)

부모님 컴퓨터에 원래 `centos`가 깔려있었는데 윈도우를 설치하기 위해 회사 사람들과 이것저것 다 해봐도 해결이 되지 않아 시간이 남아도는 나에게 미션이 떨어졌다

일단 해야하는 목록은 

1. 윈도우11 설치
2. 정식 인증
3. 한컴 설치
4. chrome, v3 등등 설치

였고 나 또한 1번 부터 문제에 봉착했다

## hp 컴퓨터?

일단 문제가 바로 hp 컴퓨터라는 것이다..

내가 hp 마더보드를 쓰는 컴퓨터를 다뤄보지 않았기에 바이오스의 GUI가 어떻게 이루어질지 몰랐다는 것

또한 다른 분들이 windows 11을 설치할 때 `usb`, `cd` 전부 사용해봤지만 실패했다는 것을 몰랐다

처음 컴퓨터를 켰을 때에는 뭔가 설정이 잘못된 것인지 기존에 깔려있던 `centos` 또한 불러오지 못해 가장 처음에 있던 `BootDevice Not Found`가 떴다

써있기로는 하드디스크에 `os`가 설치되어있지 않다는데... 알아보니 SSD가 전원을 입력받지 않고 데이터를 저장할 수 있는 기간은 5년 정도, 그리고 이 컴퓨터는 2018년에 만들어지고 1년 쓰다가 사용을 안한 컴퓨터..

아하! 데이터가 다 날라갔구나!

그럼 내가 만든 만능 [USB](https://oil-lamp-cat.github.io/posts/ventoy-%EC%82%AC%EC%9A%A9%EA%B8%B0/)로 로딩을 해보자!

## 진행

일단 USB 부팅으로 세팅을 하기 위해 바이오스에 들어가는 키는 `F10`이였다

<img alt="" src="https://github.com/user-attachments/assets/569c778d-c81f-4a73-9577-0b2150bbe2c0" width="300" height="300">

그리고 진입하자 마자 나를 반겨주는 처음보는 바이오스 화면...

어... 이게 뭐지?

`Memory Test` : 메모리에 문제가 있는지 검사

`Hard Drive Check` : 하드드라이브에 문제가 있는지 검사

인건데 아무리 봐도 그동안 봐오던 바이오스 화면과는 너무 차이가 컸다

다행이 `Exit`을 클릭하자 드디어 우리가 원하는 바이오스 화면이 떴고 설정을 통해 `USB`부팅 모드로 변경하였다.(이 부분은 인터넷에 널렸으니)

하지만 여기서 문제점은 아무리 해도 `BootDevice Not Found`가 나를 반겨주는 것이다

드디어 다른 분들이 해결하지 못했던 부분에 도달했다!

## 해결

일단 혹시 모르니 `Memory Test`와 `Hard Drive Check`를 둘다 돌려보았으나 아래 사진과 같이 모두 `PASS`를 받았다

<img alt="" src="https://github.com/user-attachments/assets/4ac75b90-f881-461b-996b-e5a8831857b4" width="300" height="300"><img alt="" src="https://github.com/user-attachments/assets/07b3bfce-e81a-4d3b-8e93-ab61125e4be6" width="300" height="300">

그럼 이번에는 부팅 옵션 문제인가 싶어 정말 이것저것 다 바꿔보았으나 여젼히 USB를 읽지 못했다

아니 왜?

다른게 문제인가 하여 바이오스 버전을 보니 `Ver. 01.21`로 `2016년 02월 03일`에 마지막 업데이트가 되었었다고 한다

![버전](https://github.com/user-attachments/assets/2f721722-2506-4198-9ce6-9a4b04ee9d79)

이건가 설마? 싶어 일단 인터넷 선도 연결되어있겠다 바로 업데이트를 실행시켜보나 중요도 `high`인 업데이트가 있었다

![업데이트 완료](https://github.com/user-attachments/assets/34b21092-80d0-4211-8079-371c15c8aeb2)

업데이트 후 버전은 `Ver. 01.92`로 무려 8년이 밀린 업데이트였다

놀랍게도 이후에는 세팅을 건들이지 않았음에도 USB를 인식하여 ventoy화면으로 넘어갔다

## 설치

그럼 이제 윈도우 11을 설치해야겠지?

![windows 11](https://github.com/user-attachments/assets/afe880bd-923c-4894-92fe-6f89741c4d09)

파티션은 내 USB의 Ventoy를 제외하고 `디스크 0`을 싹 지운 뒤에 설치하면 된다

![위치](https://github.com/user-attachments/assets/7c4d8541-66c7-43d5-b3a4-24f02d267d3b)

이렇게 깨끗이 비워버린 후에 `Create Partition`을 눌러 윈도우 파티션을 할당해 주면 된다

![자동 할당](https://github.com/user-attachments/assets/17b066bc-15a8-49e4-ba09-bc4398f5d1fc)

할당이 끝나면 위와 같이 파티션이 나눠지게 되고 이제 설치를 하면 끝난다

물론 `파티션 3`는 원래 윈도우가 설치된 `\C`드라이브지만 저 공간을 200, 300, 300GiB로 나눠서 분리할 예정이다

## 파티션 나누기

는 사진이 너무 이상하여 사진을 제외하고 순서를 설명해보자

1. 931GB에서 800GiB를 축소한다. 남은 131GiB는 윈도우를 위해 남겨두기
2. 800GiB에서 200을 `\E`드라이브로 설정
3. 600GiB에서 300을 `\D`드라이브로 설정
4. 나머지 300을 `\F`드라이브로 설정하였다

이름은 본인이 원하는 것으로 설정하면 되고 여기서 중요한 것은 가끔 파티션을 나눌 때 1GB를 1000MB라고 계산하는 사람들이 있는데.. 1GiB로 계산하여 1024MiB로 생각하고 계산해야한다

```
1GB = 1000MB
1GiB = 1024MiB
```

끝