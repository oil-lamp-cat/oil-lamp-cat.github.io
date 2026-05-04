---
title: "[wargame] overthewire bandit 2 -> 3"
date: 2024-02-01 00:25:18 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

## Bandit Level 2 -> Level 3

**user_id** : bandit2<br/>
**password** : 263JGJPfgU6LtdEvgfWU1XP5yac29mFx

![bandit 2_3](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/05e19646-795b-4af7-9c5b-d7b6e94d99fc)

### 목표

다음 레벨의 비밀번호는 home 디렉토리의 'spaces in this filename'에 담겨있습니다.

### 풀이

- home 디렉토리에서 ls명령어를 쳐보면 목표에서 보이듯 'spaces in this filename'이라는 파일이 있다.

- 띄어쓰기가 되어있는 파일을 읽을 때에는 '' 로 파일을 감싸주면 된다.

![bandit2_3_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/22611709-3c82-4419-80d6-433e030d3407)

비밀번호는 `MNk8KNH3Usiio41PRUEoDFPqfxLPlSmx` 이다!
