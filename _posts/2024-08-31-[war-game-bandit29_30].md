---
title: "[wargame] overthewire bandit 29 -> 30"
date: 2024-08-31 17:22:15 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

## Bandit Level 29 -> Level 30

**user_id** : bandit29<br/>
**password** : 4pT1t5DENaYuqnqvadYs1oE4QLCdjmJ7


### 목표

![image](https://github.com/user-attachments/assets/a5d16349-cf78-436d-ac45-d0c429355603)

음 그래 그럴거 같았어

### 해결법

`ssh://bandit29-git@localhost:2220/home/bandit29-git/repo`

![image](https://github.com/user-attachments/assets/9aee9e26-e327-43d7-9cea-cbfb1c6512a6)

기본세팅

![image](https://github.com/user-attachments/assets/2dae1c6f-df0a-4f81-8757-12d4baedf077)

`README`가 말하길 `no passwords in production!`이라신다 

여긴 비밀번호 없음!

![image](https://github.com/user-attachments/assets/7d3e8035-915f-4279-9d43-e9fc7dc4da32)

로그도 딱히 뭔가 문제될 것이 없어보인다

그렇다면 브랜치는?

![image](https://github.com/user-attachments/assets/b329a284-cb62-4371-8297-d5baa91288dc)

오케이 여러 갈래의 브랜치가 있는 것을 확인했다

가장 위에있는 `origin/dev`로 가보자

![image](https://github.com/user-attachments/assets/e59995be-9ca7-48ee-b106-546b3179c7ea)

찾았다

> 비밀번호 : **qp30ex3VLz5MDG1n91YowTv4Q8l7CDZL**

그런데 저 code는 뭐가 있을까?

![image](https://github.com/user-attachments/assets/ec52159e-87f3-4126-b993-35ae311081fc)

gif를 ascii코드로 출력해주는 파이썬 파일인걸까?

![image](https://github.com/user-attachments/assets/4f6fd820-fb5c-4f8e-a9f6-8a9181e35302)

비었다?

![image](https://github.com/user-attachments/assets/d949368f-704f-47d4-abc9-24de113a5e31)

특별할 거 없는 1byte짜리 파일이였다

기대했는데...