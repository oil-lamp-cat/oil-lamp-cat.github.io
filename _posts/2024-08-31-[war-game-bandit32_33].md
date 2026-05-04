---
title: "[wargame] overthewire bandit 32 -> 33"
date: 2024-08-31 18:02:15 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

## Bandit Level 32 -> Level 33

**user_id** : bandit32<br/>
**password** : 3O9RfhqyAlVBEZpVb6LYStshZoqoSx5K

### 목표

![image](https://github.com/user-attachments/assets/38ca4633-a9c3-4744-a095-050c5a4622bc)

git 관련 문제가 끝난 뒤에, 또 다른 탈출을 할 시간입니다. 행운을 빌어요!

아니 선생님 문제는요?

### 해결법

![image](https://github.com/user-attachments/assets/e6c2ddda-0db2-47c2-8039-67eaa92a881a)

이번에는 시작부터 `bash`쉘이 아닌 `UPPERCASE SHELL`이라고 한다

일명 `대문자 쉘`

이게 무슨..

![image](https://github.com/user-attachments/assets/9101bad4-5dfc-49c1-bd3e-657a60798da2)

정말로 일단 소문자는 입력이 안된다

말 그대로 대문자만 받는 쉘인가보다

![image](https://github.com/user-attachments/assets/5192b1b7-0e2a-4be0-8a20-36128694d087)

`$0`은 현재 쉘을 반환하는 환경변수인데 실행하면 쉘안에 쉘이 생긴다

환경변수는 또 받네?

![image](https://github.com/user-attachments/assets/a817ca33-f951-43e3-849b-66b4c2306dc8)

`bash`쉘로 실행을 시키니 놀랍게도 제 계정이 `bandit33`으로 바뀌어있습니다??

지금은 32번 문젠데?

![image](https://github.com/user-attachments/assets/5f05d5ce-f3cd-4a74-b355-40f0fda98e68)

이렇게 비밀번호를 바로 찾아낼 수 있었답니다

> 비밀번호 : **tQdtbs5D5i2vJwkO8mEyYEyTL8izoeJ0**

