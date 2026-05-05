---
title: "[wargame] overthewire bandit 30 -> 31"
date: 2024-08-31 17:39:15 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

## Bandit Level 30 -> Level 31

**user_id** : bandit30<br/>
**password** : qp30ex3VLz5MDG1n91YowTv4Q8l7CDZL

벌써 앞자리가 3이라니 고지가 멀지 않았다

### 목표

![image](https://github.com/user-attachments/assets/9eaae2af-ab1e-4cb5-b9bd-50d28f67a6ce)

오케이 이번에도 git문제군

### 해결법

`ssh://bandit30-git@localhost:2220/home/bandit30-git/repo`

![image](https://github.com/user-attachments/assets/15c5487b-e3c4-43b0-a8f5-925a5a0e3529)

어..? 아 잘못 썼다

![image](https://github.com/user-attachments/assets/5b8b8661-d8fb-4022-885c-5e37a7267da6)

이번에는 성공했다

![image](https://github.com/user-attachments/assets/27c47228-0ba9-4c9e-aeef-a733fd84f3d9)

허 이번에는 비었다며 웃는다

![image](https://github.com/user-attachments/assets/08b6c05c-ddfb-4cc2-a5a4-95406a0efe72)

그리고 딱히 다른 변경사항도 없다

![image](https://github.com/user-attachments/assets/666fce4a-e0b1-4f3a-819e-0e40a2397e82)

그리고 브랜치도 `HEAD`와 `master`뿐이다

[git tag](https://velog.io/@devp1023/GIT-Tag-%EC%BB%A4%EB%B0%8B%EC%97%90-%EC%9D%B4%EB%A6%84-%EB%B6%99%EC%9D%B4%EA%B8%B0)라는 것은 써본 적이 없어서 몰랐는데 이 친구가 이번 문제의 핵심이였다

![image](https://github.com/user-attachments/assets/a032f2ce-6137-4a64-a442-3c3e7a6c7541)

찾았다

> 비밀번호 : **fb5S2xb7bRyFmAvQYQGEqsbhVyJqhnDy**

