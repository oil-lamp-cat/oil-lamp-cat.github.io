---
title: "[wargame] overthewire bandit 28 -> 29"
date: 2024-08-31 17:07:15 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

## Bandit Level 28 -> Level 29

**user_id** : bandit28<br/>
**password** : Yz9IpL0sBcCeuG7m9uQFt8ZNpS4HZRcN


### 목표

![image](https://github.com/user-attachments/assets/a21f31c5-a7c5-44f2-8491-1e9e8a170fa8)

포트 2220을 통해 `ssh://bandit28-git@localhost/home/bandit28-git/repo`에 `git 저장소`가 있습니다. 사용자 bandit28-git의 암호는 사용자 bandit28의 암호와 동일합니다.

리포지토리를 복제하고 다음 단계의 암호를 찾습니다.

어? 문제가 같다?

### 해결법

`ssh://bandit28-git@localhost:2220/home/bandit28-git/repo`

![image](https://github.com/user-attachments/assets/4221b250-395a-4872-ba8a-ced81335520e)

전 처럼 `git clone`을 해오면 된다

![image](https://github.com/user-attachments/assets/b76dabf0-53dd-42d5-8ae9-7ea85a4b9f34)

그리고 `README`파일 내용이 변했다

그런데 이게 무슨 말인지 알 수가 없다

힌트는 아닌 것 같고

그렇다면 혹시 누군가 파일 정보를 바꾼거라면?

![image](https://github.com/user-attachments/assets/23cc9115-ab1d-49ac-ac09-941e999cf875)

`git clone`을 해왔으니 당연히 `.git`파일이 존재한다 

![image](https://github.com/user-attachments/assets/8723ab60-d7a3-4459-90b7-19689ec97c52)

오 바로 `fix info leak`이라는 문구를 찾았다

아마 이게 비밀번호를 숨긴 부분이지 않을까 한다

![image](https://github.com/user-attachments/assets/a1627c72-253f-4873-9378-fee99c400fc8)

그럼 고치기 전으로 넘어가주자

![image](https://github.com/user-attachments/assets/be521a71-c3d8-4cd7-83c0-b4f12760c2a7)

비밀번호 발견~

> 비밀번호 : **4pT1t5DENaYuqnqvadYs1oE4QLCdjmJ7**

이러니 `git`을 사용할 때 중요한 정보들은 `.gitignore`을 사용하여 git에 올라가지 않도록 하자

까딱하면 api 비용을 엄청나게 내야할 수도 있다