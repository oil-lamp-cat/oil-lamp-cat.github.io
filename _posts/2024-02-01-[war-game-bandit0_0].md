---
title: "[wargame] overthewire bandit0"
date: 2024-02-01 00:25:15 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

![overthewire](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/d20228f5-ee18-43c4-834b-464c5215f6b3)

# 리눅스 워게임 중 하나인 overthewire의 bandit

[overthewire](https://overthewire.org/wargames/)의 워 게임은

1. Bandit
2. Leviathan or Natas or Krypton
3. Narnia
4. Behemoth
5. Utumno
6. Maze
7. Vortex
8. Manpage
9. Drifter
10. FormulaOne

이 있고 그 중 이 페이지에서는 bandit을 다룰 것이다.

[overthewire-bandit](https://overthewire.org/wargames/bandit/)

## Bandit Information (bandit 소개)

![bandit information](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/431a3132-838c-497d-8797-3a0b4e466d4c)

음... 한글로 번역해서 만들어봤는데 아무래도 가독성이 좋지 않으니 영어를 직접 해석하며 읽어보길 바란다. 컴퓨터와 영어는 땔 수 없는 관계인만큼 이렇게 틈틈이 공부하면 좋지 않을까?

![bandit information - ko](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/eee3a091-23e6-4376-8625-dfdb101c9d30)

## bandit 접속

bandit을 접속하기 위해서는 ssh로 접속해야하며 shell로도 접속이 가능하지만 보통 putty나 termius를 사용하는 편이다. 나도 최근까지는 putty를 사용하고 있었지만 termius의 ui가 훨씬 더 보기 좋아 [termius](https://termius.com/)로 옮겼다. 아 참고로 나는 "Dracula" 테마를 사용하고 있다.

![termius-Hosts-page](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/97224693-4e5c-42be-b23e-4ea745efa433)

처음 프로그램을 키게 되면 이런 화면이 보일 텐데 Group과 Hosts는 내가 몇가지 이미 만들어놔서 그런 것이니 이 화면에서 NEW HOST를 누르면 된다.

![캡처](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/3ad9ec47-4e84-45f8-b036-14bdefe0d3e6)

위에서 부터 설명하자면

- Address : 우리가 접속할 IP 혹은 Hostname
- Label : (아직 이게 무엇인지 이해하지 못해 나는 flag저장용으로 쓰는 중이다.)
- Parent Group : 하나의 Group을 만들어 SSH Port를 저장해 놓았다가 사용할 수 있게 할 수 있다.
- Tags : 테그를 지정해 줄 수 있다.
- SSH on <> port : 접속할 Adress의 접속할 수 있는 port이다.
- Username : 접속할 username
- Password : 접속할 user의 password

일단 bandit을 하는 동안 사용할 것들은 이정도라고 생각한다. 고로 우리가 적어야 할 것들은

![bandit0](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/462c0d60-8907-47e2-8556-e7af4652a82b)

이정도 되시겠다

**Host**: bandit.labs.overthewire.org<br/>
**Port**: 2220

## Bandit Level 0

![bandit0](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/5454cf8c-d2d9-4149-aa41-ba383a7dec2f)

### 목표

이 레벨의 목표는 SSH를 사용하여 게임에 로그인하는 것입니다. 연결해야 하는 호스트는 포트 2220의 bandit.labs.overthewire.org 입니다. 사용자 이름은 bandit0이고 비밀번호는 bandit0입니다. 로그인이 완료되면 Level 1 페이지로 이동하여 Level 1을 이기는 방법을 알아보세요.

### 풀이

접속했다면 Level 0는 해결이다! 그럼 여기서 무엇을 찾아야할지 [Level 0 -> Level 1](https://overthewire.org/wargames/bandit/bandit1.html) 페이지로 가서 확인해보자!
