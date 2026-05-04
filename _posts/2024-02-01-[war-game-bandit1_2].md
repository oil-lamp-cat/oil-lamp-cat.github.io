---
title: "[wargame] overthewire bandit 1 -> 2"
date: 2024-02-01 00:25:17 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

## Bandit Level 1 -> Level 2

**user_id** : bandit1<br/>
**password** : ZjLjTmM6FvvyRnrb2rfNWOZOTa6ip5If (언제든 바뀔 수 있다.)

![bandit1_2](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/d76a3a34-31d1-42eb-9c35-d473593df16f)

### 목표

다음 레벨의 비밀번호는 home 디렉토리의 '-'라는 이름을 가진 파일에 있다.

찾아보면 좋을 것들 :

- 구글에 "- 이름을 가진 파일" 이라고 검색해보세요
- (Advanced Bash-scripting Guide - Chapter 3 - Special Characters)[http://tldp.org/LDP/abs/html/special-chars.html]

### 풀이

- "pwd" 명령어로 현재 위치를 보니 home 디렉토리이다.

- "ls" 명령어로 리스트를 확인해보니 "-" 라는 파일이 있다.

- "cat -" 로 열어봐도 아무것도 나오지 않는다. 이럴 때에는 ctrl+c 혹은 ^c로 빠져나올 수 있다.

- "-" 라는 문자가 리눅스에서 예약된 즉 약속된 특수문자라 file, cat에서 인자로 넘겨받지 못한다. 고로 현재 경로에 있는 파일을 뜻하는 ./를 사용하기로 하자.

- "file ./-" 명령어를 통해 어떤 형식의 파일인지 읽어보자. [ASCII](https://namu.wiki/w/%EC%95%84%EC%8A%A4%ED%82%A4%20%EC%BD%94%EB%93%9C)(아스키코드) text 파일이라고 한다.

- "cat ./-" 명령어로 파일 내용을 출력해보자.

찾았다! 263JGJPfgU6LtdEvgfWU1XP5yac29mFx

![bandit1_2_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/74168a24-1404-4139-8e37-539d92f09f05)
