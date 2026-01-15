---
title: "[HTB] Browsed (Medium_Linux)"
date: 2026-01-15 11:46:00 +09:00
categories: [hacking, saturnx operators, Linux]
tags: [Hack The Box, Medium]
password: "20260115"
---

## 시작에 앞서

![Browsed](https://github.com/user-attachments/assets/bfff44c8-04e1-4452-87b2-8196bc57a898)

이번에는 **Browsed**라고 하는 Medium 난이도의 Active 머신으로 어떤걸 풀어볼까 하는데 `Arena` 로 등록된 머신이기에 한번 해봤다.

![Arena 였던것](https://github.com/user-attachments/assets/72ab31f8-3281-479f-be0a-d755a4448367)

~~아니 근데 이걸 작성하고 있는 지금은 또 Arena에서 Live로 바뀌었다.~~

|구분|Arena (지난주 토 ~ 어제)|Live (오늘 ~)|
|:--:|:--:|:--:|
|상태|따끈따끈한 신상 (Seasons 경쟁 중)|일반 Active 머신 (안정화 단계)|
서버|Release Arena (신규 전용 서버)|Standard / Free (일반 공용 서버)|
|접속 권한|누구나 (Free 포함)|누구나 (Free 포함)|
|바뀐 이유|출시 후 5일이 지나 신규 기간이 종료됨|이제 일반 서버로 이관됨|

**Live**와 **Arena**는 위와 같은 차이가 있다고 한다.

솔직히 요거 푸는데 2일동안은 삽질만 하다가 비로소 4일차에 풀어냈다는 이야기 ㅎ

## 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap](https://github.com/user-attachments/assets/fb3cd189-54bc-4e74-a737-b53e940af7ab)

nmap의 결과를 보면 `22/ssh`와 `80/http`가 있고 페이지 이름이 `Browsed`라고 한다. `nginx 1.24.0`버전이고....

직접 들어가보자.
![Browsed page](https://github.com/user-attachments/assets/3906df82-3820-46bb-a403-281fc42fce03)

페이지에 접속해보니 `Browsed.htb`라는 사이트와 크롬 확장프로그램관련 사이트라는 소개를 볼 수 있다.

![addetchosts](https://github.com/user-attachments/assets/9df0ff00-0f89-42fa-989d-8b2abb22ba9a)

`/etc/hosts`에 `browsed.htb`를 추가했고 다시 더 살펴보자.

![mainpage1](https://github.com/user-attachments/assets/4e477cfe-2014-4a52-8175-cfacad229c07)

![mainpage2](https://github.com/user-attachments/assets/442bd1bd-d544-4c0a-aa1d-0f3252f274b9)

내가 만든 extention을 올리면 그걸 자동으로 실행하고 확인해준다고 한다. 뭔가 공유하고 쉽게 만들 수 있고 한 내용도 있긴 한데... 다른 페이지를 찾아봐도 딱히?

dirsearch로 찾아봐도 뭐가 없다.

![update](https://github.com/user-attachments/assets/1cc49eb2-acc4-44d2-8ad9-d1d1153a6618)

`Sample`에 들어가보면 위와 같이 세가지 예시 파일이 있다.

`Fontify`, `ReplaceImages`, `Timer`

![Sample fontify](https://github.com/user-attachments/assets/35c9d232-a4be-4259-bdc5-72a9f7a73964)

fontify를 다운받아 열어보니 `manifest.json`, `style.css`, `popup.js`, `content.js`, `popup.html`이 있다.

![maniandcontent](https://github.com/user-attachments/assets/4ae4abeb-0e06-41de-89fa-2ab086783362)

중요해보이는 `manifest.json`과 `content.js`를 열어보니 `manifest_version`이 3이라는 것을 알 수 있었다.

참고로 난 어떻게 기본 구조가 되는지 몰라서 [웹 앱 매니페스트 manifest.json 를 작성해보자.
by. 365kim](https://365kim.tistory.com/169)의 내용을 참고했다.

## 초기 침투 (Initial Foothold / Exploitation)

## 권한 상승 (Privilege Escalation) 

## 마치며