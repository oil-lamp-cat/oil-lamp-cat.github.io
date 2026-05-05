---
title: "[wargame] overthewire bandit 5 -> 6"
date: 2024-02-01 00:25:21 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

## Bandit Level 5 -> Level 6

**user_id** : bandit5<br/>
**password** : 4oQYVPkxZOOEOO5pTW81FB8j8lxXGUQw

![bandit5_6](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/dcdc812c-c3b9-4a42-ae9e-06c57b7a37c4)

### 목표

다음 레벨로 가는 비밀번호는 inhere 디렉토리의 다음 조건을 충족하는 사항을 가지고 있다.

- 사람이 읽을 수 있다.
- 1033 byte의 크기를 가지고 있다.
- 실행파일이 아니다

### 해결법

- inhere 딕셔너리에서 ls 명령어를 쳐보자.

```bash
bandit5@bandit:~/inhere$ ls -a
.            maybehere04  maybehere10  maybehere16
..           maybehere05  maybehere11  maybehere17
maybehere00  maybehere06  maybehere12  maybehere18
maybehere01  maybehere07  maybehere13  maybehere19
maybehere02  maybehere08  maybehere14
maybehere03  maybehere09  maybehere15
```

어우 하나하나 찾기에는 역시 조건을 준 이유가 있었다.

- 그렇다면 이번에는 **'find'** 명령어를 사용하기로 하자
- **"find . -size 1033c"** 명령어를 이용하여 1033 byte의 크기를 가진 파일을 찾아낼 수 있다.

```bash
bandit5@bandit:~/inhere$ find . -size 1033c
./maybehere07/.file2
```

- "cat" 명령어를 이용하여 ./maybehere07/.file2 파일을 읽어보면 비밀번호를 찾을 수 있다!

찾았다! : HWasnPhtq9AVKe0dmk45nxy20cvUa6EG

![bandit5_6_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/f6977bc4-e750-4be2-89fa-5dbe4be55a3f)
