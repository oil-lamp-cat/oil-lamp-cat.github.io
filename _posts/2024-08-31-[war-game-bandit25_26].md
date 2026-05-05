---
title: "[wargame] overthewire bandit 25 -> 26"
date: 2024-08-31 15:57:15 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

## Bandit Level 25 -> Level 26

**user_id** : bandit25<br/>
**password** : iCi86ttT4KSNe1armKiwbQNmB3YJP3q4


### 목표

![image](https://github.com/user-attachments/assets/88d2184c-f33a-4324-b756-d805e5870f12)

`bandit25`에서 `bandit26`에 로그인하는 것은 꽤 쉬울 것입니다… 사용자 `bandit26`의 쉘은 /bin/bash가 아니라 다른 것입니다. 그것이 무엇인지, 어떻게 작동하는지, 그리고 그것을 탈출하는 방법을 알아보세요.

참고: Windows 사용자이고 일반적으로 Powershell을 사용하여 밴디트에 ssh를 적용하는 경우: Powershell은 이 수준의 의도된 솔루션에 문제가 발생하는 것으로 알려져 있습니다. 대신 명령 프롬프트를 사용해야 합니다.

나는 termius 쓸 거라서 참고사항은 패스

### 해결법

![image](https://github.com/user-attachments/assets/5f84f8cc-f20a-46c0-b934-40e276ee2dec)

일단 파일을 읽어보니 바로 `bandit26.sshkey`가 보인다

그리고 `bandit25@bandit:~$ ssh -i bandit26.sshkey bandit26@localhost -p 2220`를 통해 접속시도를 하게 되면

![image](https://github.com/user-attachments/assets/59321c9b-c6e8-4524-a62c-82b443f0d85a)

바로 쫒겨난다 목표에서 말하듯 쉘이 `/bin/bash`가 아닌 다른 것이기에 생긴 문제인 것 같다

![image](https://github.com/user-attachments/assets/81db3c03-0cb4-49ae-b879-7bcb5c020f0c)

`/etc/passwd`폴더에서 계정들이 사용하는 쉘을 볼 수 있다

[/etc/passwd에 관해](https://feccle.tistory.com/32)

![image](https://github.com/user-attachments/assets/2c44fac9-54bd-429a-ba54-ae3aaabe6f7e)

확인해 보면

`bandit26:x:11026:11026:bandit level 26:/home/bandit26:/usr/bin/showtext`

`(1):(2):(3):(4):(5):(6):(7)` 로 나눠 보았을 때

`:` : 구분자

`(1)` : 사용자 계정

`(2)` : 사용자 암호가 들어갈 자리, x는 /etc/shadow 파일에 암호가 저장되어있음

`(3)` : 사용자의 ID, root는 0

`(4)` : Group id, root그룹은 0

`(5)` : 기타 정보, 보통 사용자의 이름

`(6)` : 홈 디렉토리 정보

`(7)` : 사용자가 기본으로 사용하는 shell 정보

여기서 우리는 `bandit26`이 `/usr/bin/showtext`라는 쉘? 을 사용하고 있다는 것을 알 수 있다

![image](https://github.com/user-attachments/assets/10482587-19b3-4cde-a5b4-57cc43a54deb)

`/usr/bin/showtext`파일을 읽어보면 

> export TERM=linux

`TERM`이라는 환경변수에 linux를 저장

> exec more ~/text.txt

`/home bandit26/text.txt`에 `more`라는 명령어를 실행한다

처음보는 명령어이기에 [Linux 기본 명령어 more](https://incodom.kr/Linux/%EA%B8%B0%EB%B3%B8%EB%AA%85%EB%A0%B9%EC%96%B4/more)을 읽으면 좋다

일단 창을 줄이는 것과 관련된 명령어라는 것은 이해를 했다

![image](https://github.com/user-attachments/assets/42d234f7-dcfc-4118-a018-f866848aabb1)

termius에서는 안되는 걸로

![image](https://github.com/user-attachments/assets/ac91b62c-37a3-49c3-9184-5b4b0092c687)

`putty`에서는 성공했다

![image](https://github.com/user-attachments/assets/8903b7b5-5d7e-4bbd-8fdf-94cf350a15a4)

이 상태에서 v를 누르니 vi 편집기가 실행되었다

![image](https://github.com/user-attachments/assets/11d653e3-cbf4-41cc-9725-6aa4493d1acd)

`:set shell=/bin/bash` 명령어를 입력하여 `bash쉘`로 기본쉘을 설정하고

![image](https://github.com/user-attachments/assets/4c86a5c7-4f2b-42ec-a63d-c328b0440c96)

`:sh` 명령어를 입력해 익숙한 `bash쉘`로 들어올 수 있었다

![image](https://github.com/user-attachments/assets/1f894a43-72e2-4789-ac8c-da8258bf5899)

비밀번호가 출력되었다!

> 비밀번호 : **s0773xxkk0MXfdqOfPRVr9L3jJBUOgCZ**

이 다음 문제인 `bandit26`도 termius를 통해 접속하게 되면  다음과 같이 보인다만

분명 아무것도 눌리지 않을 것이다..

![image](https://github.com/user-attachments/assets/4490423e-f718-4128-89d6-599fa7bc4240)

그렇다.. 26번 문제도 아직 25번 문제에서 이어진 문제였던 것이다

여기서 부터는 다음번에