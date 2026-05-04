---
title: "[wargame] overthewire bandit 27 -> 28"
date: 2024-08-31 16:56:15 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

## Bandit Level 27 -> Level 28

**user_id** : bandit27<br/>
**password** : upsNCc7vzaRDx6oZC6GiR6ERwe1MowGB


### 목표

![image](https://github.com/user-attachments/assets/41515042-9551-4e9b-a93c-79bda581eec7)

포트 2220의 `ssh://bandit27-git@localhost/home/bandit27-git/repo`에 `git 저장소`가 있습니다. 사용자 `bandit27-git`의 암호는 사용자 `bandit27`의 암호와 동일합니다.

리포지토리를 복제하고 다음 단계의 암호를 찾습니다.

### 해결법

git 사용에 관한 내용이네요

이건 이미 팀 프로젝트를 할 때 조금 써봤었죠

![image](https://github.com/user-attachments/assets/a8f4cc4b-42e4-49d5-b568-ff6c34d553ff)

작업 폴더를 만들고 `git clone`을 해줍시다

`ssh://bandit27-git@localhost:2220/home/bandit27-git/repo`

포트 설정을 해준 것은 2220번 포트로 가져올 수 있다고 했으니 이렇게 해야 한답니다

![image](https://github.com/user-attachments/assets/102510c8-d462-4188-9e83-ca36298ade9e)

비밀번호는 bandit27과 같다고 했었죠?

![image](https://github.com/user-attachments/assets/55060951-1b0d-4252-a60a-189e4ff2c045)

자 다운이 다 되었습니다

![image](https://github.com/user-attachments/assets/67a5d618-ad63-4eff-bc37-e0aaf7526971)

안에 들어있는 파일을 열어 비밀번호를 찾아낼 수 있었네요

> 비밀번호 : **Yz9IpL0sBcCeuG7m9uQFt8ZNpS4HZRcN**