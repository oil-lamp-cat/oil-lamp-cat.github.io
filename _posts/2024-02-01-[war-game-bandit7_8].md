---
title: "[wargame] overthewire bandit 7 -> 8"
date: 2024-02-01 00:25:23 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

## Bandit Level 7 -> Level 8

**user_id** : bandit7<br/>
**password** : morbNTDkSW6jIlUc0ymOdMaLnOlFVAaj

![bandit7_8](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/2b5b9153-6a88-4cb1-a0ff-3a78cadecde9)

### 목표

다음 레벨로 가는 비밀번호는 `data.txt`라는 파일 안에 `millionth`라는 단어 옆에 있다.

### 해결법

일단 어떤 식으로 파일이 이루어져 있나 보기 위해 파일을 읽어봤다.

```shell
bandit7@bandit:~$ cat data.txt

--중략--

summation       u50rQF4SGWx3gtytGjZL9oaF5Pqcf3yi
Israelites      d5RJ2L7p0yKa9RpCr7dU9dhuKq46dFVC
volatility's    wqQvrK0UVKfx2BtyFogXhTyGI0V4BOS5
Albany's        GopEzFC069enA4p224dn1i0Ire3HP9jx
indecisively    tOcTUgSwpbShx5J5x6xmmIQKIlG1GTJz
choosey 3u6Ir3tT1Vq7q17aWIvdT14IxT0f1y5X
velveteen's     46soI2oXIiX1HuXtDXeRLlFrctbGJTYO
```

어우.. 좀.. 너무 많다 이걸 하나하나 읽어가면서 찾을 수도 있고 혹은 notepad에 옮긴 뒤 ctrl+F로 찾을 수도 있지만 우리는 명령어를 사용하기로 하자.

그 중 우리는 `grep`이라는 명령어를 사용할 것이다.

> grep [옵션] [표현식] [파일명] : 이렇게 파일 속 특정 문자열(혹은 표현식)을 찾습니다.

```shell
bandit7@bandit:~$ grep millionth data.txt
millionth       TESKZC0XvTetK0S9xNwm25STk5iWrBvP
```

찾았다!

---

혹은 `cat`명령어와 `grep`명령어를 섞어 만들 수도 있다.

`cat data.txt | grep millionth` 이런식으로!

```shell
bandit7@bandit:~$ cat data.txt | grep millionth
millionth       dfwvzFQi4mU0wfNbFOe9RoWskMLg7eEc
```

같은 결과가 나온다.

---

비밀번호는 `dfwvzFQi4mU0wfNbFOe9RoWskMLg7eEc`이다.
