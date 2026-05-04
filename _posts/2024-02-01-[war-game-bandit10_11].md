---
title: "[wargame] overthewire bandit 10 -> 11"
date: 2024-02-01 00:25:26 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

## Bandit Level 10 -> Level 11

**user_id** : bandit10<br/>
**password** : FGUW5ilLVJrxX9kMYMmlN4MgbpfMiqey

### 목표

![bandit10_11](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/261b6ab8-2fa7-4422-b3b1-71dac8ab6d0e)

비밀번호는 `data.txt`파일에 `base64`형태로 인코딩되어있다.

### 해결법

> `base64` : 바이너리 데이터를 문자 코드에 영향을 받지 않는 공통 ASCII 문자표로 표현하기 위해 만들어진 인코딩이다. ASCII 문자 하나가 64진법의 숫자 하나를 의미하기 때문에 Base64라는 이름을 가졌다고 한다.

인코딩의 반대말은? 디코딩!

`base64` 명령어를 사용하여 디코딩해 봅시다.

![bandit10_11_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/942c774b-8f40-4ec7-8b46-57cd8c2ca000)

비밀번호 : `dtR173fZKb0RRsDFSGsg2RWnpNVj3qRr`
