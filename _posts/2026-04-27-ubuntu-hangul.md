---
title: "[Ubuntu] 한영 변환 alt+r 대신 한글로"
date: 2026-04-27 12:01:00 +09:00
categories: [ubuntu]
tags: [편의성 개선]
pin: true
---

![ubuntu](https://github.com/user-attachments/assets/923799ea-74a5-42ef-a741-24661b7dbb64)

## 한영키 잘만 되는데?

인간은 불편할 때에야 발전이 있다던가..

오랜만에 노트북(Ubuntu)로 작업을 하는데 써본 사람만이 아는 고통.. 이 썩을 한영키를 누를 때 마다 자꾸 이상한 설정창으로 넘어가거나 firefox의 경우엔 검색 창으로 넘어가는 경우가 있다.

사실 기본적으로 우분투를 듀얼부팅이던 그냥 통짜 설치이던 깔고 처음 한글로 설정한 후 오 잘 된다! 하는 기쁜 마음으로 쓰다보면 이런 상황에 직면하게 될 것이라 생각한다.

사실 나도 왜 그동안 이걸 해결 안했나 싶긴 한데 이번에 해결한 겸 한번 작성해보고자 한다.

~~우분투 사랑해요~~

## 시스템 사양

![시스템 사양](https://github.com/user-attachments/assets/c363b2e2-926e-435a-b180-10bd3fba67df)

아무래도 우분투 몇 버전이고 어디에 설치되었는지에 따라 좀 달라지는 부분이 있다보니(갤북 3 360 버전은 소리 안 나오는 문제처럼) 일단 내 시스템 사샹은 위와 같다.

- SAMSUNG ELECTRONICS CO., LTD. 960QFG
- P07ALN.260.240415.SH
- Ubuntu 24.04.4 LTS
- Linux 6.8.0-110-generic
- GNOME 46
- 64비트

## 그럼 무엇이 문제였을까?

본론으로 돌아와 그럼 분명 한영키 인터넷에서 찾은대로 다 하고 했는데 어째서 왜 이런 일이 발생하는걸까?

이 원인은 바로 `ALT+R` 이라는 키 세팅에 있겠다..

![키 세팅](https://github.com/user-attachments/assets/1ef770e4-09dd-4935-80cd-9fdecda149ff)

우리가 설치를 하고 나면 위 이미지 처럼 한국어 라고 쓰여있고 정말 잘 나오긴 한다. 그런데 말입니다.

![키 설정](https://github.com/user-attachments/assets/e59c7074-a9ba-43b7-a5b2-c44fdc243f39)

키보드 설정에 들어가면 이렇게 한영 전환 키가 무려 alt+R 로 설정이 되어있음을 알 수 있다.

근데 이게 또 잘못됬나? 하면 그건 아닌게 분명히 한영키의 반대쪽엔 alt+L 키가 있으니까... 다만 우린 이 때문에 한영키의 저주에서 벗어날 수 없었던 것이다.

## 실패를 해보자. alt+R -> Hangul

사실 이걸 해결하기 위해 인터넷을 찾아보다 수 많은 사람들이 블로그에 올린 `sudo gedit /usr/share/X11/xkb/keycodes/evdev` 이 방식을 써봤었다. 그런데 쩝... 내가 듀얼 부팅을 하고 있는 상태라 그럴까? 

설정값을 변경하고 리부트를 하니 우분투는 내게 검은 화면만을 보여줄 뿐이었다. 아이고난....

그래도 정말 천만 다행으로 **ctrl+alt+f3** 을 눌러 cli 창으로 들어올 수는 있었기에 다음 명령어를 쳐서 설정파일을 아예 리셋을 시켜줬다.

```
# 1. 패키지 목록 업데이트
sudo apt update

# 2. X11 키보드 데이터 패키지 재설치 (수정된 xkb 파일 원복)
sudo apt install --reinstall xkb-data

# 3. 키보드 설정 재구성
sudo dpkg-reconfigure keyboard-configuration
# 뭔가 화면이 나오면 그냥 엔터를 쳐서 기본값으로 쭉쭉 넘어가시면 됩니다
```
위 명령어를 입력 후 reboot을 하니 아쉽게도 alt+r을 바꾸진 못했지만 그래도 그나마 우분투를 살릴 수는 있었다.

## 성공을 해보자. alt+R -> Hangul

실패는 성공의 어머니랴. 어쨋든간에 성공은 했으니 그럼 설정 파일을 바꾸지 않고 해결할 수 있는 방법이 있지 않을까?

물론 제미나이에게 물어본다면 어쩌면 이 블로그에 당도하기도 전에 해결 했을 지도 모르겠다.

그래도! 혹시나! 따라할 이미지가 필요하다면? 이 블로그를 찾아와주면 감사하겠다.

저번엔 cli로 했다가 문제가 생겼으니 난 무서워서 gui 방법을 쓰기로 했다.

### GNOME Tweaks (기능 개선)

```
sudo apt install gnome-tweaks
```

기능 개선 (GNOME Tweaks)이라는 우분투 공식 설정 확장 앱을 설치해 주자. 이건 ubuntu software 앱에서도 설치 가능하다.

![gnome tweeks](https://github.com/user-attachments/assets/4aac34d9-b73d-429f-a592-c4f57bdb805f)

설치를 완료했다면 들어가서 키보드 -> 추가 배치 옵션으로 들어가주자.

![배치 옵션](https://github.com/user-attachments/assets/f5a09242-e4ec-4f0c-8163-2e6b84576a0d)

그리고 딱 보아하니 우리를 위한 한국어 한/영, 한자키가 보이네?

![altr 잘가라](https://github.com/user-attachments/assets/fa35de0f-07be-416a-a807-8adb29de4881)

딱 봐도 나 눌러줘요 하고있는 **오른쪽 Alt 키를 한/영 키로 만들기**를 선택해주자.

일단 GNOME Tweaks에서의 설정은 끝났지만 최종 목적지를 위해!

![다시 설정으로](https://github.com/user-attachments/assets/430446ce-8fc1-4008-ab11-1666b5b7691f)

다시 키보드 설정으로 돌아와 점 세개를 누르고 한영 전환키를 보면 기본은 ALT+R도 되어있을 것이다. 특히 Tweaks 설정을 안했다면 여기서 추가 버튼을 누르고 한영키를 눌러도 여전히 ALT+R이 뜨겠지만? 우리는 설정을 했으니 드디어!! `Hangul` 을 볼 수 있게 되었다!

사실 이건 누군가 보라는 느낌 보단 내가 또 이거 까먹고 어딘가에서 한글 설정 하다가 에에 이게 뭐더라 하고 삽질하지 않게 이리 적어둔다.