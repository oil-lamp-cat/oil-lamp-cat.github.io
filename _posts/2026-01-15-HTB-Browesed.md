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

dirsearch로 찾아봐도 특별히 눈에 띄는 취약점이나 숨겨진 경로는 없었다.

![update](https://github.com/user-attachments/assets/1cc49eb2-acc4-44d2-8ad9-d1d1153a6618)

`Sample`에 들어가보면 위와 같이 세가지 예시 파일이 있다.

`Fontify`, `ReplaceImages`, `Timer`

![Sample fontify](https://github.com/user-attachments/assets/35c9d232-a4be-4259-bdc5-72a9f7a73964)

fontify를 다운받아 열어보니 `manifest.json`, `style.css`, `popup.js`, `content.js`, `popup.html`이 있다.

![maniandcontent](https://github.com/user-attachments/assets/4ae4abeb-0e06-41de-89fa-2ab086783362)

중요해보이는 `manifest.json`과 `content.js`를 열어보니 `manifest_version`이 3이라는 것을 알 수 있었다.

참고로 난 어떻게 기본 구조가 되는지 몰라서 

[웹 앱 매니페스트 manifest.json 를 작성해보자.
by. 365kim](https://365kim.tistory.com/169)

[크롬 확장프로그램 만들기 part.1 (계기, 디자인&기획, 기본 준비 단계, 참고 문서) by. JOOLOG](https://youngsimi.tistory.com/entry/%ED%81%AC%EB%A1%AC-%ED%99%95%EC%9E%A5%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8-%EB%A7%8C%EB%93%A4%EA%B8%B0-part1-%EA%B3%84%EA%B8%B0-%EB%94%94%EC%9E%90%EC%9D%B8%EA%B8%B0%ED%9A%8D-%08%EA%B8%B0%EB%B3%B8-%EC%A4%80%EB%B9%84-%EB%8B%A8%EA%B3%84-%EC%B0%B8%EA%B3%A0-%EB%AC%B8%EC%84%9C)

의 내용을 참고해 공부했다.

![업로드 부분](https://github.com/user-attachments/assets/f39c5fab-b1fa-4494-832c-509081ae3bfe)

그리고 페이지의 `Update Extension`을 들어가보면 아까 다운로드한 예시 처럼 `.zip`의 형태로 파일을 업로드 할 수 있게 되어있다.

일단은 뭐 어떻게 작동하는지 모르니까 난 예시에서 다운받은 파일을 바로 그냥 올려봤다.

![output of extention](https://github.com/user-attachments/assets/8d6254e5-70ea-4dce-8745-ed2d90e6e26a)

그리고 그 결과 나온 output을 읽어보다 많은 오류 로그중에 (진짜 진짜 많다) `http://browsedinternals.htb` 라는 주소를 발견 할 수 있었다!

![etchosts2](https://github.com/user-attachments/assets/01fbfed3-cca2-421f-8425-abc5f6435558)

근데 nmap을 스캔했을 때에는 `browsed.htb`만 존재했었으니 추가적으로 로그에서 발견한 `browsedinternals.htb` 도메인도 `/etc/hosts`에 추가해 주었다. 이로써 하나의 IP에 두 개의 도메인이 매핑된 상태가 되었다.

![againnmap](https://github.com/user-attachments/assets/78b37dd8-e53b-4298-b24a-3ffd3d6507de)

그리고 다시 nmap을 진행했다... 만 사실 이거 할 필요 없다. 왜냐면 어쩌피 같은 IP주소를 기반으로 스캔하는 거다보니 굳이?

다만 Host 헤더가 뭐라고 나올까 하여 돌려봤다. 그리고 아까와 달리 이번에는 `Gitea`로 만들어진 페이지가 발견되었다.

메인 도메인이 `browsed.htb`이고 서브 도메인이 `browsedinternals.htb`가 되는 셈.

![gitea](https://github.com/user-attachments/assets/29257465-fd1b-42db-b8b7-67f76d259a02)

들어가보니 Gitea라고 하는 마치 github와 비슷한 역할을 하는 페이지를 볼 수 있었다.

공식 gitea 문서는 [Gitea.com](https://about.gitea.com/) 여기로.

![버전과 레포](https://github.com/user-attachments/assets/750a19a8-2ae9-492d-ac8b-0038e226cfb8)

`explore`로 들어가보니 딱 하나의 larry가 만든 레포를 볼 수 있다. 그리고 gitea의 버전이 1.24.5라는 것 까지.

![레포 안](https://github.com/user-attachments/assets/71c4f21b-8394-4773-b17b-1cdbc29293e2)

레포 안에 들어가보니 `backups`, `files`, `log`, `app.py`, `routines.sh`가 있었다.

솔직이 이전 Easy 문제들 생각해서 여기 나오는 backups에 뭔가 정보가 있거나 과거 commit 정보에 민감한 정보, 혹은 log에라도 뭔가있을줄 알았는데 log는 진짜 로그 정보만 있고 backups에는 텅 빈 백업 파일만, 다른 소스 코드에는 취약한 부분이 안 보였기에 진짜 여기서 삽질을 많이 했다. (내가 찾던건 하드코딩된 민감한 정보들이었는데.... 여기가 타겠이었...)

처음으론 gitea의 버전 정보를 찾아보며 취약점이 있을까 뒤져보기도 하고, dirsearch로 페이지 싹 뒤져보거나 gitea를 둘러보고 회원가입은 안되서 불가(내부에서 회원가입 가능한데 이게 그 섭 도메인이라 그런듯?)였기에 거진 2-3일간 여기서 멈춰버렸다.

## 초기 침투 (Initial Foothold / Exploitation)

## 권한 상승 (Privilege Escalation) 

## 마치며