---
title: "[wargame] overthewire bandit 26 -> 27"
date: 2024-08-31 16:43:15 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

## Bandit Level 26 -> Level 27

**user_id** : bandit26<br/>
**password** : s0773xxkk0MXfdqOfPRVr9L3jJBUOgCZ


### 목표

![image](https://github.com/user-attachments/assets/864fb736-7eec-4938-91d2-9017e1ffa8ec)

...? shell을 얻고 bandit27의 비밀번호를 가져라! 라는데?

### 해결법

![image](https://github.com/user-attachments/assets/9fc17c8b-12be-4bc8-acbf-9f609a3db3f2)

다시 보니 반가운 `-do`파일이 보입니다

그리고 `text.txt`파일도 보이네요?

![image](https://github.com/user-attachments/assets/dbca4502-ffae-4b61-ad89-0f68b84a4b48)

일단 `text.txt`는 `Ascii Art`를 띄워주는 거였군요

![image](https://github.com/user-attachments/assets/fad7078b-a751-4774-9b4f-df3129ff2594)

역시 `euid`가 `bandit27`로 뜨네요

![image](https://github.com/user-attachments/assets/14459964-c2fc-4a8f-9fba-b06de3b8ceda)

그리고 잡았다 요놈

> 비밀번호 : **upsNCc7vzaRDx6oZC6GiR6ERwe1MowGB**

