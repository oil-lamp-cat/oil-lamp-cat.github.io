---
title: "[wargame] overthewire bandit 0 -> 1"
date: 2024-02-01 00:25:16 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

## Bandit Level 0 -> Level 1

![bandit0_1](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/dc9ad301-252f-4b22-802a-306b20854359)

### 목표

다음 레벨의 비밀번호는 home 디렉토리에 위치한 readme 라는 파일에 저장됩니다. 이 비밀번호를 사용하여 SSH로 bandit1에 로그인합니다. 레벨의 비밀번호를 찾을 때마다 SSH(2220 포트)를 사용하여 해당 레벨에 로그인하고 게임을 계속 진행합니다.

### 풀이

- 현재 본인이 어떤 디렉토리에 있는지 확인하기 위해 "pwd"명령어를 써주자.

- 그 후 "ls"명령어를 이용하여 어떤 파일들이 있는지 확인해보자.

- 아마 readme 파일이 존재할 것이다.

- 존재하지 않는다면 현재 디렉토리가 home이 아닐테니 "pwd" 명령어를 사용하여 확인해보자.

- readme 파일은 명령어로 읽어보기 위해서는 "cat" 명령어를 사용한다.

- 여기서 잠시 명령어들의 유래를 이야기해보자 아무래도 나는 이러는 편이 기억하는데 도움이 되었다.

- "pwd" 명령어는 "print working directory" 현재 일하고 있는 디렉토리 라는 의미이다.

- "ls" 명령어는 "list directory contents" 디렉토리안에 있는 디렉토리 및 파일 리스트를 출력한다.

- "cat" 명령어는 "concatenate"는 "연결하다"라는 뜻을 가지고 있는데 본래의 기능은 여러 파일의 내용을 하나로 합쳐주는 역할을 하지만 이번에 사용한 것처럼 파일의 내용을 단순 출력하여 확인하거나, ">" 이나 ">>" 같은 기호와 함께 사용하여 파일을 생성하고, 저장하는 용도로도 사용될 수 있다고 한다.

![bandit0_1_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/7821e92b-0987-4c0b-9244-31e2167cbe52)

여기 아래 보이는 `ZjLjTmM6FvvyRnrb2rfNWOZOTa6ip5If` 이 바로 다음 게임의 비밀번호가 된다!
