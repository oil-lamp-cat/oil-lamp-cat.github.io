---
title: "[wargame] overthewire bandit 21 -> 22"
date: 2024-08-30 22:39:15 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

## Bandit Level 21 -> Level 22

**user_id** : bandit21<br/>
**password** : EeoULMCra2q0dSkYj561DX7s1CpBuOBt


### 목표

![image](https://github.com/user-attachments/assets/94fe9975-33f7-4f86-ac1d-ca0a4332cb3b)

시간 기반 작업 스케줄러인 `cron`에서 일정한 간격으로 프로그램이 자동으로 실행되고 있습니다. `/etc/cron.d/`에서 구성을 확인하고 어떤 명령어가 실행되고 있는지 확인하십시오.

### 해결법

오오 이미 `cron`은 [우분투 소리 안나옴 문제](https://oil-lamp-cat.github.io/posts/ubuntu-no-sound/)에서 한번 찾아본 적이 있기에 생각보다 쉽게 할 수 있지 않을까 싶다

`cron`에 관해 간단하게 설명하자면 일정 시간, 혹은 컴퓨터가 꺼지고 켜질 때에 자동으로 명령어 프로그램이 실행되게 만드는 프로그램이다

![image](https://github.com/user-attachments/assets/f6749c55-1603-47d3-bb05-cddf8e5bf1cd)

`cron`의 실행될 파일들이 있는 `/etc/cron.d`폴더에 들어가 확인할 수 있다

아마 우리는 `bandit21`문제를 풀고 있으니  `cronjob_bandit22` 가 우리가 찾던 것이 아닐까 싶다

![image](https://github.com/user-attachments/assets/22d35daa-45bc-462a-a87c-73bbad8346f6)

오잉 읽어보니 `1분마다 /usr/bin/cronjob_bandit22.sh`가 실행되고 있다

그렇다면 바로 찾아가 주도록 하자

![image](https://github.com/user-attachments/assets/d97a6be2-68db-4bd6-ba4e-5f00222f2278)

`tmp`디렉토리에 `/tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv`라는 파일을 만들고 bandit22의 비밀번호를 cat을 통해 `/tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv`파일에 저장을 하고 있다

이번엔 `/tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv`을 읽어보도록 하자

![image](https://github.com/user-attachments/assets/c1c71192-351a-4b49-8c9a-eb6d6f217682)

비밀번호가 저장되어있다!

> 비밀번호 : **tRae0UfB9v0UzbCdn9cY0gQnds9GF58Q**

