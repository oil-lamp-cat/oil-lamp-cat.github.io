---
title: "[wargame] overthewire bandit 31 -> 32"
date: 2024-08-31 17:50:15 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

## Bandit Level 31 -> Level 32

**user_id** : bandit31<br/>
**password** : qp30ex3VLz5MDG1n91YowTv4Q8l7CDZL

### 목표

![image](https://github.com/user-attachments/assets/f5d43b85-d4c3-40a0-9fd3-0e249981ab8b)

### 해결법

`ssh://bandit31-git@localhost:2220/home/bandit31-git/repo`

![image](https://github.com/user-attachments/assets/b25bcbd2-7550-4c64-a865-52beecca5a79)

기본

![image](https://github.com/user-attachments/assets/73b68989-bfb8-46ca-bc6e-40a6f6241b49)

이번에는 원격 레포지토리에 파일을 `push`하라고 한다

May I come in?을 내용으로 제목을 key.txt로 master브렌치에 push하란다

![image](https://github.com/user-attachments/assets/c523b7a0-de04-4244-b83e-6cce2b6cf1a3)

보낼 파일을 만들고

![image](https://github.com/user-attachments/assets/1f67cdc5-3c11-4cff-a66a-3c65709d6c40)

push해보면 지금 .gitignore 파일에 *.txt파일을 넣지 못하게 되어있고 강제로 넣고자 한다면 `-f`옵션을 사용하라고 한다

![image](https://github.com/user-attachments/assets/a7cdbc56-e778-40ac-815d-f18d21769ead)

강제로 넣고 `commit`을 날린 뒤 `push`를 하면

![image](https://github.com/user-attachments/assets/164d6ffc-223c-4a30-8b96-8e9addc7ab57)

원격에서 `push` 하는 것을 막아놨기에 `push`는 안되었지만 비밀번호를 얻어내었다

> 비밀번호 : **3O9RfhqyAlVBEZpVb6LYStshZoqoSx5K**

