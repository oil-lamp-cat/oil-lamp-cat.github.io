---
title: "[Python][venv] No python at 문제"
date: 2025-2-12 09:26:15 +09:00
categories: [Tools & Environment]
tags: [작업, venv, python]
pin: true
---

## 2025-02-12 9시 7분, 파이썬 venv, no python 문제

이거는 아마도 따로 기록을 해야할 부분인 것 같다

정말로 간단한 문제이지만 파이썬 경로에 대하여 잘 모른다면 아마 정말로 많이 해매게 될 것이다 (내가 그랬다)

아침에 출근하고 노트북에 외장하드를 연결하고 실행하는 순간 오류 문구를 발견했다

```
No Python at '"C:\Users\user\AppData\Local\Programs\Python\Python311\python.exe'
```

아니 파이썬이 없다뇨? 생각해보니 어제 마지막 작업을 할 때에도 분명 노트북에서는 잘 되다가 컴퓨터(데스크탑)에서는 파이썬을 불러오지 못해 문제가 생겼었다

분명 그 때는 아예 venv를 새로 만들었었더라지

그리하여 이번에는 `venv` 설정파일을 뜯어보기로 했다

참고로 설정 파일의 이름은 가상환경 파일 안에 `pyvenv.cfg`라는 이름으로 되어있을 것이다

```
home = C:\Users\user\AppData\Local\Programs\Python\Python311
include-system-site-packages = false
version = 3.11.4
executable = C:\Users\user\AppData\Local\Programs\Python\Python311\python.exe
command = C:\Users\user\AppData\Local\Programs\Python\Python311\python.exe -m venv E:\Programing\파일 경로\Log_TCP_classifier\venvwin
```

열어보면 위와 같이 되어있을 것인데 위 예시는 내 컴퓨터 그러니까 desktop에서의 환경이다

그리고 비교를 위해 노트북에서도 venv를 생성한 후에 비교해보자

```
home = C:\Users\raen0\AppData\Local\Programs\Python\Python311
include-system-site-packages = false
version = 3.11.4
executable = C:\Users\raen0\AppData\Local\Programs\Python\Python311\python.exe
command = C:\Users\raen0\AppData\Local\Programs\Python\Python311\python.exe -m venv E:\Programing\파일경로\Log_TCP_classifier\venvwin_notebook
```

보아하니 `C:\Users\`다음 부분, 즉 desktop과 노트북의 윈도우 계정 이름이 다르다는 것을 확인할 수 있었다 

`raen0와 user`

이러니 python을 못찾는게 정상인것이였다...

만약에 가상환경 하나만 남긴 뒤에 계정의 이름이 다른 두 컴퓨터 사이에서 사용하고자 한다면 

`C:\Users\계정이름`과 같은 방식으로 옮길 때 마다 파이썬의 경로를 변경해 주면 된다

나는 귀찮아서 그냥 하나를 더 만들기로 한다

어쩌피 필요한 모듈중에 2개는 따로 직접 코드를 추가했기에 문제가 없다는 사실

혹시나 윈도우 계정이 무엇이 있는지 모르겠다 한다면 

`C:\Users`에 들어가 확인해 보길 바란다