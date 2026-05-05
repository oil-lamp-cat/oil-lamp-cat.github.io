---
title: "[wargame] overthewire bandit 3 -> 4"
date: 2024-02-01 00:25:19 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

## Bandit Level 3 -> Level 4

**user_id** : bandit3<br/>
**password** : MNk8KNH3Usiio41PRUEoDFPqfxLPlSmx

![bandit3_4](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/827b6011-cbbf-45de-b938-ad5a49fafe34)

### 목표

다음 레벨로 가는 비밀번호는 **inhere** 딕셔너리 안에 숨겨진 파일 안에 있습니다.

### 풀이

- home 디렉토리의 inhere 딕셔너리로 들어가 보았을 때 'ls'명령어를 사용해 보면 아무 파일도 보이지 않는다.
- 목표에서 말했듯 inhere 딕셔너리에 숨겨진 파일이라고 하니 'ls -al' 명령어를 사용하여 모든 파일 보기를 하자.

- "ls" 명령어의 옵션 중 하나인 'ls -a'는 모든 파일을 보는 옵션이고 'ls -l' 명령어는 파일이 만들어진 시간을 볼 수 있게 해주는 옵션이다. 그리고 그 둘을 합친 옵션이 'ls -al'이다. 이번 문제를 해결하기 위해서 'ls -a' 만 해줘도 된다.

![bandit3_4_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/ae26e9d9-0a0b-49cd-9eb8-3a2bdef9c39e)

숨겨져 있는 비밀번호는 `2WmrDFRmJIq3IPxneAaMGhap0pFhF3NJ`이다.
