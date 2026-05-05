---
title: "[wargame] overthewire bandit 4 -> 5"
date: 2024-02-01 00:25:20 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

## Bandit Level 4 -> Level 5

**user_id** : bandit4<br/>
**password** : 2WmrDFRmJIq3IPxneAaMGhap0pFhF3NJ

![bandit4_5](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/37f951f2-9b84-4074-8471-b35aaac5321e)

### 목표

다음 레벨로 가는 비밀번호는 inhere 딕셔너리의 **"인간이 읽을 수 있는"** 파일로 저장되어있습니다.

Tip: 터미널이 더러워졌다면, "reset" 명령어를 사용하세요!

(저는 "reset" 보다는 "clear"를 사용하는 편이랍니다!)

- "reset" 명령어는 말 그대로 모두 원래대로 되돌리는 기능이고 "clear" 명령어는 터미널의 화면을 깨끗이 지우는 차이가 있다.

### 풀이

- home 디렉토리 안에 inhere 디렉토리가 있고 그 안에는 `-file\*` 파일들이 10개가 있다.
- 물론 이 파일들을 직접 열어보며 읽을 수 있나 없나 확인 할 수도 있겠지만 `file` 명령어를 이용해서 찾아보기로 하자
- **file ./\*** 명령어에서 ./\* 부분은 파일 안에 있는 모든 파일의 정보를 볼 수 있게해준다.
- 찾아보니 ./-file06번 파일이 **"ASCII text"** 로 되어있다고 한다.
- `cat` 명령어로 비밀번호를 찾았다! `4oQYVPkxZOOEOO5pTW81FB8j8lxXGUQw`

![bandit4_5_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/6bf0529c-dd5a-4c6d-bdf7-4f5a44296ff3)
