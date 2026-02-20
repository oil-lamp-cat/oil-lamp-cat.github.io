---
title: "[wargame] overthewire bandit Full"
date: 2024-08-31 19:22:15 +09:00
categories: [war game, Linux, bandit]
tags: [bandit, overtherwire]
pin: true
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

## bandit 모음집

> 2024-02-01에 시작해서 2024-08-31에 완성하였으며 bandit16-34까지 비밀번호는 최신일 수 있으나 나머지는 다를 수 있음

<details><summary>Over The Wire : Bandit 목차 </summary>
<div markdown = "1">

[[wargame] overthewire bandit : 전체 과정](https://oil-lamp-cat.github.io/posts/war-game-bandit/)

[[wargame] overthewire bandit : 시작 (0 -> 0)](https://oil-lamp-cat.github.io/posts/war-game-bandit0_0/)

[[wargame] overthewire bandit : 파일 읽기 (0 -> 1)](https://oil-lamp-cat.github.io/posts/war-game-bandit0_1/)

[[wargame] overthewire bandit : 파일 읽기 (1 -> 2)](https://oil-lamp-cat.github.io/posts/war-game-bandit1_2/)

[[wargame] overthewire bandit : 파일 읽기 (2 -> 3)](https://oil-lamp-cat.github.io/posts/war-game-bandit2_3/)

[[wargame] overthewire bandit : 파일 읽기 (3 -> 4)](https://oil-lamp-cat.github.io/posts/war-game-bandit3_4/)

[[wargame] overthewire bandit : 파일 읽기 (4 -> 5)](https://oil-lamp-cat.github.io/posts/war-game-bandit4_5/)

[[wargame] overthewire bandit : 파일 읽기 (5 -> 6)](https://oil-lamp-cat.github.io/posts/war-game-bandit5_6/)

[[wargame] overthewire bandit : 파일 읽기 (6 -> 7)](https://oil-lamp-cat.github.io/posts/war-game-bandit6_7/)

[[wargame] overthewire bandit : 특정 글자 찾기 (7 -> 8)](https://oil-lamp-cat.github.io/posts/war-game-bandit7_8/)

[[wargame] overthewire bandit : 특정 글자 찾기 (8 -> 9)](https://oil-lamp-cat.github.io/posts/war-game-bandit8_9/)

[[wargame] overthewire bandit : 특정 글자 찾기 (9 -> 10)](https://oil-lamp-cat.github.io/posts/war-game-bandit9_10/)

[[wargame] overthewire bandit : 데이터 변환 (10 -> 11)](https://oil-lamp-cat.github.io/posts/war-game-bandit10_11/)

[[wargame] overthewire bandit : 데이터 변환 (11 -> 12)](https://oil-lamp-cat.github.io/posts/war-game-bandit11_12/)

[[wargame] overthewire bandit : 데이터 변환 (12 -> 13)](https://oil-lamp-cat.github.io/posts/war-game-bandit12_13/)

[[wargame] overthewire bandit : 네트워크 연결 (13 -> 14)](https://oil-lamp-cat.github.io/posts/war-game-bandit13_14/)

[[wargame] overthewire bandit : 네트워크 연결 (14 -> 15)](https://oil-lamp-cat.github.io/posts/war-game-bandit14_15/)

[[wargame] overthewire bandit : 네트워크 연결 (15 -> 16)](https://oil-lamp-cat.github.io/posts/war-game-bandit15_16/)

[[wargame] overthewire bandit : 네트워크 연결 (16 -> 17)](https://oil-lamp-cat.github.io/posts/war-game-bandit16_17/)

[[wargame] overthewire bandit : 네트워크 연결 (17 -> 18)](https://oil-lamp-cat.github.io/posts/war-game-bandit17_18/)

[[wargame] overthewire bandit : 네트워크 연결 (18 -> 19)](https://oil-lamp-cat.github.io/posts/war-game-bandit18_19/)

[[wargame] overthewire bandit : setuid (19 -> 20)](https://oil-lamp-cat.github.io/posts/war-game-bandit19_20/)

[[wargame] overthewire bandit : setuid (20 -> 21)](https://oil-lamp-cat.github.io/posts/war-game-bandit20_21/)

[[wargame] overthewire bandit : cron (21 -> 22)](https://oil-lamp-cat.github.io/posts/war-game-bandit21_22/)

[[wargame] overthewire bandit : cron (22 -> 23)](https://oil-lamp-cat.github.io/posts/war-game-bandit22_23/)

[[wargame] overthewire bandit : cron (23 -> 24)](https://oil-lamp-cat.github.io/posts/war-game-bandit23_24/)

[[wargame] overthewire bandit : 쉘 스크립트 (24 -> 25)](https://oil-lamp-cat.github.io/posts/war-game-bandit24_25/)

[[wargame] overthewire bandit : 쉘 안에 쉘 (25 -> 26)](https://oil-lamp-cat.github.io/posts/war-game-bandit25_26/)

[[wargame] overthewire bandit : setuid (26 -> 27)](https://oil-lamp-cat.github.io/posts/war-game-bandit26_27/)

[[wargame] overthewire bandit : git (27 -> 28)](https://oil-lamp-cat.github.io/posts/war-game-bandit27_28/)

[[wargame] overthewire bandit : git (28 -> 29)](https://oil-lamp-cat.github.io/posts/war-game-bandit28_29/)

[[wargame] overthewire bandit : git (29 -> 30)](https://oil-lamp-cat.github.io/posts/war-game-bandit29_30/)

[[wargame] overthewire bandit : git (30 -> 31)](https://oil-lamp-cat.github.io/posts/war-game-bandit30_31/)

[[wargame] overthewire bandit : git (31 -> 32)](https://oil-lamp-cat.github.io/posts/war-game-bandit31_32/)

[[wargame] overthewire bandit : git (32 -> 33)](https://oil-lamp-cat.github.io/posts/war-game-bandit32_33/)

[[wargame] overthewire bandit : 문제 없음 (33 -> 34)](https://oil-lamp-cat.github.io/posts/war-game-bandit33_34/)



</div>
</details>

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

## Bandit Level 0 -> Level 1

![bandit0_1](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/dc9ad301-252f-4b22-802a-306b20854359)

### 목표

다음 레벨의 비밀번호는 home 디렉토리에 위치한 readme 라는 파일에 저장됩니다. 이 비밀번호를 사용하여 SSH로 bandit1에 로그인합니다. 레벨의 비밀번호를 찾을 때마다 SSH(2220 포트)를 사용하여 해당 레벨에 로그인하고 게임을 계속 진행합니다.

### 풀이

- 현재 본인이 어떤 디렉토리에 있는지 확인하기 위해 `pwd`명령어를 써주자.

- 그 후 `ls`명령어를 이용하여 어떤 파일들이 있는지 확인해보자.

- 아마 `readme` 파일이 존재할 것이다.

- 존재하지 않는다면 현재 디렉토리가 home이 아닐테니 `pwd` 명령어를 사용하여 확인해보자.

- `readme` 파일은 명령어로 읽어보기 위해서는 `cat` 명령어를 사용한다.

- 여기서 잠시 명령어들의 유래를 이야기해보자 아무래도 나는 이러는 편이 기억하는데 도움이 되었다.

- `pwd` 명령어는 `print working directory` 현재 일하고 있는 디렉토리 라는 의미이다.

- `ls` 명령어는 `list directory contents` 디렉토리안에 있는 디렉토리 및 파일 리스트를 출력한다.

- `cat` 명령어는 `concatenate`는 `연결하다`라는 뜻을 가지고 있는데 본래의 기능은 여러 파일의 내용을 하나로 합쳐주는 역할을 하지만 이번에 사용한 것처럼 파일의 내용을 단순 출력하여 확인하거나, `>` 이나 `>>` 같은 기호와 함께 사용하여 파일을 생성하고, 저장하는 용도로도 사용될 수 있다고 한다.

![bandit0_1_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/7821e92b-0987-4c0b-9244-31e2167cbe52)

여기 아래 보이는 `NH2SXQwcBdpmTEzi3bvBHMM9H66vVXjL` 이 바로 다음 게임의 비밀번호가 된다!

## Bandit Level 1 -> Level 2

**user_id** : bandit1<br/>
**password** : NH2SXQwcBdpmTEzi3bvBHMM9H66vVXjL (언제든 바뀔 수 있다.)

![bandit1_2](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/d76a3a34-31d1-42eb-9c35-d473593df16f)

### 목표

다음 레벨의 비밀번호는 home 디렉토리의 `-`라는 이름을 가진 파일에 있다.

찾아보면 좋을 것들 :

- 구글에 `- 이름을 가진 파일` 이라고 검색해보세요
- (Advanced Bash-scripting Guide - Chapter 3 - Special Characters)[http://tldp.org/LDP/abs/html/special-chars.html]

### 풀이

- `pwd` 명령어로 현재 위치를 보니 home 디렉토리이다.

- `ls` 명령어로 리스트를 확인해보니 `-` 라는 파일이 있다.

- `cat -` 로 열어봐도 아무것도 나오지 않는다. 이럴 때에는 `ctrl+c` 혹은 `^c`로 빠져나올 수 있다.

- `-` 라는 문자가 리눅스에서 예약된 즉 약속된 특수문자라 `file`, `cat`에서 인자로 넘겨받지 못한다. 고로 현재 경로에 있는 파일을 뜻하는 `./`를 사용하기로 하자.

- `file ./-` 명령어를 통해 어떤 형식의 파일인지 읽어보자. [ASCII](https://namu.wiki/w/%EC%95%84%EC%8A%A4%ED%82%A4%20%EC%BD%94%EB%93%9C)(아스키코드) text 파일이라고 한다.

- `cat ./-` 명령어로 파일 내용을 출력해보자.

찾았다! `rRGizSaX8Mk1RTb1CNQoXTcYZWU6lgzi`

![bandit1_2_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/74168a24-1404-4139-8e37-539d92f09f05)

## Bandit Level 2 -> Level 3

**user_id** : bandit2<br/>
**password** : rRGizSaX8Mk1RTb1CNQoXTcYZWU6lgzi

![bandit 2_3](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/05e19646-795b-4af7-9c5b-d7b6e94d99fc)

### 목표

다음 레벨의 비밀번호는 `home 디렉토리`의 `spaces in this filename`에 담겨있습니다.

### 풀이

- `home 디렉토리`에서 `ls`명령어를 쳐보면 목표에서 알려주듯 `spaces in this filename`이라는 파일이 있다.

- 띄어쓰기가 되어있는 파일을 읽을 때에는 `''` 로 파일을 감싸주면 된다.

![bandit2_3_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/22611709-3c82-4419-80d6-433e030d3407)

비밀번호는 `aBZ0W5EmUfAf7kHTQeOwd8bauFJ2lAiG` 이다!

## Bandit Level 3 -> Level 4

**user_id** : bandit3<br/>
**password** : aBZ0W5EmUfAf7kHTQeOwd8bauFJ2lAiG

![bandit3_4](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/827b6011-cbbf-45de-b938-ad5a49fafe34)

### 목표

다음 레벨로 가는 비밀번호는 **inhere** 딕셔너리 안에 숨겨진 파일 안에 있습니다.

### 풀이

- `home 디렉토리`의 `inhere 딕셔너리`로 들어가 보았을 때 `ls`명령어를 사용해 보면 아무 파일도 보이지 않는다.
- 목표에서 말했듯 `inhere 딕셔너리`에 숨겨진 파일이라고 하니 `ls -al` 명령어를 사용하여 모든 파일 보기를 하자.

- `ls` 명령어의 옵션 중 하나인 `ls -a`는 모든 파일을 보는 옵션이고 `ls -l` 명령어는 파일이 만들어진 시간을 볼 수 있게 해주는 옵션이다. 그리고 그 둘을 합친 옵션이 `ls -al`이다. 이번 문제를 해결하기 위해서 `ls -a` 만 해줘도 된다.

![bandit3_4_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/ae26e9d9-0a0b-49cd-9eb8-3a2bdef9c39e)

숨겨져 있는 비밀번호는 `2EW7BBsr6aMMoJ2HjW067dm8EgX26xNe이다`.

## Bandit Level 4 -> Level 5

**user_id** : bandit4<br/>
**password** : 2EW7BBsr6aMMoJ2HjW067dm8EgX26xNe

![bandit4_5](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/37f951f2-9b84-4074-8471-b35aaac5321e)

### 목표

다음 레벨로 가는 비밀번호는 `inhere 딕셔너리`의 **"인간이 읽을 수 있는"** 파일로 저장되어있습니다.

Tip: 터미널이 더러워졌다면, `reset` 명령어를 사용하세요!

(저는 `reset` 보다는 `clear`를 사용하는 편이랍니다!)

- `reset` 명령어는 말 그대로 모두 원래대로 되돌리는 기능이고 `clear` 명령어는 터미널의 화면을 깨끗이 지우는 차이가 있다.

### 풀이

- `home 디렉토리` 안에 `inhere 디렉토리`가 있고 그 안에는 `-file\*` 파일들이 10개가 있다.
- 물론 이 파일들을 직접 열어보며 읽을 수 있나 없나 확인 할 수도 있겠지만 `file` 명령어를 이용해서 찾아보기로 하자
- **file ./\*** 명령어에서 ./\* 부분은 파일 안에 있는 모든 파일의 정보를 볼 수 있게해준다.
- 찾아보니 ./-file06번 파일이 **"ASCII text"** 로 되어있다고 한다.
- `cat` 명령어로 비밀번호를 찾았다! `lrIWWI6bB37kxfiCQZqUdOIYfr6eEeqR`

![bandit4_5_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/6bf0529c-dd5a-4c6d-bdf7-4f5a44296ff3)

## Bandit Level 5 -> Level 6

**user_id** : bandit5<br/>
**password** : lrIWWI6bB37kxfiCQZqUdOIYfr6eEeqR

![bandit5_6](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/dcdc812c-c3b9-4a42-ae9e-06c57b7a37c4)

### 목표

다음 레벨로 가는 비밀번호는 inhere 디렉토리의 다음 조건을 충족하는 사항을 가지고 있다.

- 사람이 읽을 수 있다.
- 1033 byte의 크기를 가지고 있다.
- 실행파일이 아니다

### 해결법

- inhere 딕셔너리에서 `ls` 명령어를 쳐보자.

```bash
bandit5@bandit:~/inhere$ ls -a
.            maybehere04  maybehere10  maybehere16
..           maybehere05  maybehere11  maybehere17
maybehere00  maybehere06  maybehere12  maybehere18
maybehere01  maybehere07  maybehere13  maybehere19
maybehere02  maybehere08  maybehere14
maybehere03  maybehere09  maybehere15
```

어우 하나하나 찾기에는 역시 조건을 준 이유가 있었다.

- 그렇다면 이번에는 **'find'** 명령어를 사용하기로 하자
- **"find . -size 1033c"** 명령어를 이용하여 1033 byte의 크기를 가진 파일을 찾아낼 수 있다.

```bash
bandit5@bandit:~/inhere$ find . -size 1033c
./maybehere07/.file2
```

- `cat` 명령어를 이용하여 `./maybehere07/.file2` 파일을 읽어보면 비밀번호를 찾을 수 있다!

찾았다! : `P4L4vucdmLnm8I7Vl7jG1ApGSfjYKqJU`

![bandit5_6_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/f6977bc4-e750-4be2-89fa-5dbe4be55a3f)

## Bandit Level 6 -> Level 7

**user_id** : bandit6<br/>
**password** : P4L4vucdmLnm8I7Vl7jG1ApGSfjYKqJU

![bandit6_7](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/b36e65f3-e0a5-4abb-b40f-4fa1b5a06468)

### 목표

다음 레벨로 가는 비밀번호는 다음 조건을 충족시키며 서버의 어딘가에 있다.

- bandit7 유저가 가지고 있다.
- bandit6 그룹에 있다.
- 33 byte의 크기를 가지고 있다.

- user == bandit7
- group == bandit6
- size == 33 byte

음... 지금까지랑은 다르게 서버의 어딘가에 있다고 한다.

### 해결법

힌트에서 준 대로 find 명령어를 이용하여 비밀번호를 찾아가보자.

```shell
bandit6@bandit:~$ find / -user bandit7 -group bandit6 -size 33c
```

결과를 보기 전 잠시 옵션들에 관해 알아보자.

- `/`는 서버에서 최상위 경로를 의미한다. 시스템 전부를 토대로 찾겠다는 의미이다.
- `-user`는 파일의 소유자(user)를 찾는다.
- `-group`은 파일이 속한 그룹을 찾습니다.
- `-size`는 Level 5-6에서 사용했던 것처럼 파일의 사이즈를 찾습니다. 그 중 `c`는 `bytes`를 의미합니다.

어..음.. 결과가 너무 많이 나왔다. 그것도 그중 "Permission denied" 즉 접근 권한 없음 에러가 매우 많이 나왔다.

```shell
find: ‘/etc/ssl/private’: Permission denied
find: ‘/etc/polkit-1/localauthority’: Permission denied
find: ‘/etc/sudoers.d’: Permission denied
find: ‘/etc/multipath’: Permission denied
find: ‘/root’: Permission denied
find: ‘/var/lib/update-notifier/package-data-downloads/partial’: Permission denied
find: ‘/var/lib/amazon’: Permission denied
/var/lib/dpkg/info/bandit7.password
find: ‘/var/log’: Permission denied
find: ‘/var/cache/private’: Permission denied

--중략--

find: ‘/run/systemd/propagate’: Permission denied
find: ‘/run/systemd/unit-root’: Permission denied
find: ‘/run/systemd/inaccessible/dir’: Permission denied
find: ‘/run/lock/lvm’: Permission denied
```

이 긴 결과를 읽다보면 중간에 `/var/lib/dpkg/info/bandit7.password` 라는 파일에 접근이 가능하다는 결과를 볼 수 있다.

하지만 우리는 좀 더 명령어를 이용하여 깔끔하고 빠른 방법으로 찾아보도록 하자.

---

위 문제를 해결하기 위해 우리는 `File Descriptor`라는 것에 대해 잠시 알아보자.

파일 디스크립터(File Descriptor)란 리눅스 혹은 유닉스 계열의 시스템 프로세스가 파일을 다룰 때 사용하는 개념으로 파일에 접근할 때 할당되는 값이다. 그 값들의 뜻은 다음과 같다.

- 0 : 표준 입력 , `Standard Input`
- 1 : 표준 출력 , `Standard Output`
- 2 : 표준 에러 , `Standard Error`

---

이제 우리는 오류 즉 `Permission denied`가 어떤 값을 가지게 되는지 알았고(`2`), 그럼 이 오류가 출력되지 않게 하려면 어떻게 할 지에 관해 생각해보자.

---

### I/O Redirection

직역하자면 Input/Output의 재방향화이다. 입력과 출력의 방향을 바꿔 모니터 출력이 아닌 파일에 저장하거나 파일을 출력하는 뱡향을 바꾸는 식으로 사용할 수 있다. 나중에 이것에 관해 좀 더 깊게 다뤄봐야 할 듯 하지만 일단 간단히 적어보자면.

- A > B : A의 결과를 B로 `보낸(저장)`다.
- A >> B : A의 결과를 B의 데이터에 `추가`한다.
- A < B : B의 데이터를 A에 `입력`한다.

그렇다면 우리는 `File Descriptor`를 통해 `2`번인 것을 알았고, `Redirection`을 통해 그 출력을 다른 어딘가로 보낼 수 있다는 것을 알았다.

그렇다면 이번엔 `리눅스의 블랙홀`이라고 불리는 곳으로 오류들을 보내버리면! 우리가 원하는 값들을 얻을 수 있을 것이다.

> `/dev/null` : 리눅스의 블랙홀 이라고도 불리는 이곳은 경로에 나와 있듯 `null`값을 가져 아무것도 남지 않는 공간이다.

> `2 > /dev/null` : 표준에러를 `/dev/null`로!

---

그럼 이제야말로 정말 비밀번호를 찾아내보자.

```shell
bandit6@bandit:~$ find / -user bandit7 -group bandit6 size 33c 2>/dev/null
/var/lib/dpkg/info/bandit7.password

bandit6@bandit:~$ cat /var/lib/dpkg/info/bandit7.password z7WtoNQU2XfjmMtWA8u5rN4vzqu4v99S
```

비밀번호 : z7WtoNQU2XfjmMtWA8u5rN4vzqu4v99S

![bandit6_7_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/aa431231-ee86-4059-8846-35483ffba8a9)

사실 난 리눅스에 관한 지식, 명령어에 관한 지식 없이 시작하였기에 여기저기 수많은 블로그들을 참고하여 작성하고 있는 중이다. 아마 이미 이러한 지식을 알고있는 사람이라면 여기까지 매우 쉽게 도달했을 것이라 생각한다! 차근차근 나아가자! :D

## Bandit Level 7 -> Level 8

**user_id** : bandit7<br/>
**password** : z7WtoNQU2XfjmMtWA8u5rN4vzqu4v99S

![bandit7_8](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/2b5b9153-6a88-4cb1-a0ff-3a78cadecde9)

### 목표

다음 레벨로 가는 비밀번호는 `data.txt`라는 파일 안에 `millionth`라는 단어 옆에 있다.

### 해결법

일단 어떤 식으로 파일이 이루어져 있나 보기 위해 파일을 읽어봤다.

```shell
bandit7@bandit:~$ cat data.txt

--중략--

summation       u50rQF4SGWx3gtytGjZL9oaF5Pqcf3yi
Israelites      d5RJ2L7p0yKa9RpCr7dU9dhuKq46dFVC
volatility's    wqQvrK0UVKfx2BtyFogXhTyGI0V4BOS5
Albany's        GopEzFC069enA4p224dn1i0Ire3HP9jx
indecisively    tOcTUgSwpbShx5J5x6xmmIQKIlG1GTJz
choosey 3u6Ir3tT1Vq7q17aWIvdT14IxT0f1y5X
velveteen's     46soI2oXIiX1HuXtDXeRLlFrctbGJTYO
```

어우.. 좀.. 너무 많다 이걸 하나하나 읽어가면서 찾을 수도 있고 혹은 notepad에 옮긴 뒤 ctrl+F로 찾을 수도 있지만 우리는 명령어를 사용하기로 하자.

그 중 우리는 `grep`이라는 명령어를 사용할 것이다.

> grep [옵션] [표현식] [파일명] : 이렇게 파일 속 특정 문자열(혹은 표현식)을 찾습니다.

```shell
bandit7@bandit:~$ grep millionth data.txt
millionth       TESKZC0XvTetK0S9xNwm25STk5iWrBvP
```

찾았다!

---

혹은 `cat`명령어와 `grep`명령어를 섞어 만들 수도 있다.

`cat data.txt | grep millionth` 이런식으로!

```shell
bandit7@bandit:~$ cat data.txt | grep millionth
millionth       TESKZC0XvTetK0S9xNwm25STk5iWrBvP
```

같은 결과가 나온다.

---

비밀번호는 `TESKZC0XvTetK0S9xNwm25STk5iWrBvP`이다.

## Bandit Level 8 -> Level 9

**user_id** : bandit8<br/>
**password** : TESKZC0XvTetK0S9xNwm25STk5iWrBvP

![bandit8_9](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/c12b9a02-2f91-4be3-92bb-52697a83a962)

### 목표

다음 레벨로 가는 비밀번호는 `data.txt`에 있고 딱 `한 줄만 나타난다`고 한다.

중복되는 것을 제거하거나 딱 한번만 나오는 것을 찾으면 될 것 같다.

### 해결법

이번에는 `uniq`라는 명령어를 이용해보자.

#### uniq

`**uniq**`명령어는 **연속적으로 반복되는 행을 한 행으로 줄여주는** 명령어이다. 특히나 `uniq`명령어는 `sort`명령어와 대부분 같이 쓰이게 되는데, sort 명령어는 정렬을 해주기 때문에 한 행이 몇번 반복되는지 한눈에 알 수 있게 해주기 떄문이다. 그리고 그 두 명령어를 같이 쓰려변 저번에 `cat`명령어와 `grep`명령어를 같이 쓸 때 사용한 `|`(파이프)를 써야한다.

> uniq [옵션] [파일 이름]

옵션을 사용하지 않으면

```shell

bandit8@bandit:~$ cat data.txt | sort | uniq
18DyjwhN856SsMx8bNrFSvr6rJxNQKhE
1iyGemEgn3qUOOFcAJyGPHOiewqZyp1y
2CQ5DQRdtoe9Ft8YpMHqCwQcN1Bk9lCI
365RauAVsFlxktPMpoLtIf1uxijU1TfV
4K2MoVHd1gXfoOdDjvlaRxFNZwmi4A4C
52p0CnGhAvm4m3fPKqz9mTxVDeVYCvnG
5Y76FifuxKStZi4CVovF2uPhgLrZnLzG
7A4l2BI3lPJgNdWAmyXAGlfB8uvCQLX0
8cxarYi5VoKRj3lzo2baLOJaMgUtzoRH
97Qwmy18JE8aGIud1stpTsOrOtUMHeGI
9d8exmGtSsGcU1gz6HmqTfSxmnmI4FBo
A16BW831T94qcsYcGDSkgzYhxnX2xUdK
aAd8RbcAAGVRifo0gE2x1nPIGH2fjgZi

--중략--

```

이런식으로 문자열 단위로 정렬되어 보이게 된다. 하지만 우리는 한번만 나오는 문자열이 필요하기에 옵션을 추가해줘 비밀번호를 찾아낼 것이다.

#### uniq 옵션들 - options

> 내가 자주 쓰게 될 것들만 일단 적어본다.

##### -c

연속적으로 반복된 수 만큼 행 앞에 표시된다.

```shell

bandit8@bandit:~$ cat data.txt | sort | uniq -c
     10 18DyjwhN856SsMx8bNrFSvr6rJxNQKhE
     10 1iyGemEgn3qUOOFcAJyGPHOiewqZyp1y
     10 2CQ5DQRdtoe9Ft8YpMHqCwQcN1Bk9lCI
     10 365RauAVsFlxktPMpoLtIf1uxijU1TfV
     10 4K2MoVHd1gXfoOdDjvlaRxFNZwmi4A4C
     10 52p0CnGhAvm4m3fPKqz9mTxVDeVYCvnG
     10 5Y76FifuxKStZi4CVovF2uPhgLrZnLzG
     10 7A4l2BI3lPJgNdWAmyXAGlfB8uvCQLX0
     10 8cxarYi5VoKRj3lzo2baLOJaMgUtzoRH
     10 97Qwmy18JE8aGIud1stpTsOrOtUMHeGI
     10 9d8exmGtSsGcU1gz6HmqTfSxmnmI4FBo

    --중략--

```

이렇게 숫자로 표기된 곳에서 혼자 1로 표시된 문자열을 찾을 수도 있고 다음 옵션을 이용하여 찾을 수도 있다.

##### -u

연속적으로 반복되지 않는 행만 출력한다.

```shell

bandit8@bandit:~$ cat data.txt | sort | uniq -u
EN632PlfYiZbn3PhVK3XOGSlNInNE00t

```

오호 이 녀석이 우리가 찾던 비밀번호다!

비밀번호 : `EN632PlfYiZbn3PhVK3XOGSlNInNE00t`

## Bandit Level 9 -> Level 10

**user_id** : bandit9<br/>
**password** : EN632PlfYiZbn3PhVK3XOGSlNInNE00t

![bandit9_10](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/4744e711-77f3-466b-bb3f-0dff4f3cf79f)

### 목표

다음 레벨로 가는 비밀번호는 `data.txt` 파일 안에 `human-readable` 즉 사람이 읽을 수 있는 문자열로 몇개의 `=` 문자 뒤에 나온다.

### 해결법

한번 `grep`명령어로 `=`문자열을 찾아볼까요?

![bandit9_10_grep_result](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/4a5bc229-1e2e-4a10-8755-a7da146f5695)

이런 사람이 읽을 수 있는 텍스트(text)파일이 아니라 바이너리(binary: 데이터의 저장과 처리를 목적으로 0과 1의 이진 형태로 인코딩된 파일)이다보니 grep 명령어를 사용할 수 없다고 한다.

`grep`명령어의 옵션 중에는 `-a`옵션이 있는데 이 옵션이 바로 바이너리를 텍스트 파일처럼 처리해주는 옵션이라고 합니다.

```shell

bandit9@bandit:~$ cat data.txt | grep -a "=="
"x����$�WI��G���gq��B�ș�q6�p�|r9����K�|��[�l������#0jb�7u��uf`e�Y�o�    ?>�?���F��){�x%�1�c3    ��l�XQz�U0��
                                                                                                            �O-@����E�8�jr��i��$�]�:[������x]T========== theG)"�)<�!G��{��X8�?��5�&���O:�@N��s~�i\6�Xz     ����==��S�igy����>�m���P�I�ݰ���C+x�[ڋ�e22�a�
�{��\nF���<��D� �M�f*I�`�@oݗn�ײ�p�n��Y�����x�n�����ۓ�4j\9̷�n:�J�Va���K��+        ���f��Z9�)��Q�Ѻ?��r��.���O[��6�^FS�========== passwordk^�ټ����1>���jg�S�>�����5~�I�-�"��G|�����6L�"�� �T�'����j�T=������2_�q+T6(�p
                                                                                               '
�T����T�p#fz:�LJ�r*;�o#�E�hϻ��/]��&x��:!�Oη��[%ug�Z��hݹkj��D����ZH���Ed����ZE������4K�?�p������z�iw?������J������^`t d�;T��ڪ`��M�T�/�j�M�Ł��$����O�Msh��������8��========== is�w
.�Ze�x��J���i��_qhlbw���X�yϪ�.�-3������7�T�����             Ke@�&,]D���%�v�
:��g����yV�M]��Vf��̤��i�L�u#�&ZR�7٬.׳?L6>�D�GC�:jЂ��}��=��T�k�@I]j5�}0Ļ�_�zW5E��f3c�ᦩ�a��Ozݏ������:�Dr%[+��*2lk���X�齲g/$�%��g�Z"g��x�
A�tL[�#��Ƴ���wv..ک!�5��nH�mwQ!2��Fu�cp��B�;ݍ�UH�NEz+�w�'�w$F��6�L�l��ܤ
�(���k�}�N l�E����*�9�<u2����_0�Y���4�`�w�j:6�ek�{OXr���/��?d�mH�m�3�EM`�om�x��۽�>���Ihe�X��N�tz�xb�(X�1��oPZ�ɱ�ݿQ��{�%�xV��۵G�{TbJ;=l��J�Q�/��,��??r)SՒ98UU��jߗc-�?4���6�[�$�J��S��ۿv��P��u$��4+�2ʾ�$�oI�[=lI���a6�ȁ
                                                                                                  ×/%Â���w�����l��eu-)E��f�n���%����Ƙ�p��~��L�]wPP�J��O1#�{"@Ip�I�2��Di�����T�m�Gf�rSa
���LN�|�r1�7�6��8������<D�_o��kV�Jx�#���[�����딭��E�����O.x�s�薲�Ҋ����I��t�.�RF�L�V¡G�D�5c
                                                                                          %�0d������^b�C�EX��I��,S߫��)o��8/�-��ďRj$�e0G�rx70yJ{��|Ƞ��ÒX     5��a���C�2����{�5���8+�dm)��Z�R��
                                                                         |�q���E�C��[�qX2R^{X���҉�WH     fU�����B�|�������j��n�c����`����yq��       ����������E�0�Mhr��Xw�<Ͱ�[      �N�iޑ2KYl�A���)�#pJ_�)�]�PJoZP�EW��-"�ְ��D��Yq5� �G^xu�,-ҏ���i�o}2��j��Ֆ�����[:ˇ52��)"t     jh�y��========== G7w8LIi6J3kTb8A7j9LgrywtEUlyyp6s

```

음 딱 보아하니 맨 아래 있는 `G7w8LIi6J3kTb8A7j9LgrywtEUlyyp6s`가 비밀번호 인듯 하지만 우리는 이것보다 더 깔끔한 결과를 찾아보도록 하죠.

위 문제를 해결하기 위한 방법은 우리가 보통 파일을 읽을 때에는 `cat`명령어를 사용하였지만 이번에는

> strings : 파일의 문자열을 출력

`strings` 명령어를 사용해 보도록 하겠습니다. 이렇게 함으로써 문제의 힌트였던 `human-readable` 텍스트만 출력되게 될 것이다.

![bandit9_10_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/71337889-8e96-4163-af94-f2466eda7b22)

이제야 모든 조건을 사용하면서 비밀번호를 찾아냈다!

`the password is G7w8LIi6J3kTb8A7j9LgrywtEUlyyp6s`

비밀번호 : `G7w8LIi6J3kTb8A7j9LgrywtEUlyyp6s`

## Bandit Level 10 -> Level 11

**user_id** : bandit10<br/>
**password** : G7w8LIi6J3kTb8A7j9LgrywtEUlyyp6s

### 목표

![bandit10_11](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/261b6ab8-2fa7-4422-b3b1-71dac8ab6d0e)

비밀번호는 `data.txt`파일에 `base64`형태로 인코딩되어있다.

### 해결법

> `base64` : 바이너리 데이터를 문자 코드에 영향을 받지 않는 공통 ASCII 문자표로 표현하기 위해 만들어진 인코딩이다. ASCII 문자 하나가 64진법의 숫자 하나를 의미하기 때문에 Base64라는 이름을 가졌다고 한다.

인코딩의 반대말은? 디코딩!

`base64` 명령어를 사용하여 디코딩해 봅시다.

![bandit10_11_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/942c774b-8f40-4ec7-8b46-57cd8c2ca000)

비밀번호 : `6zPeziLdR2RKNdNYFNb6nVCKzphlXHBM`

## Bandit Level 11 -> Level 12

**user_id** : bandit11<br/>
**password** : 6zPeziLdR2RKNdNYFNb6nVCKzphlXHBM

### 목표

![bandit11_12](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/d1b5ee20-b32d-47eb-bcd5-16a43e7f6b3c)

비밀번호는 `data.txt`파일에 대소문자가 13자리씩 회전되어있다고 한다.

- 카이사르 암호
  > ROT13 : 문자를 알파벳 뒤에 13 번째 문자로 대채하는 대체 암호.

### 해결법

```shell
bandit11@bandit:~$ ls
data.txt
bandit11@bandit:~$ cat data.txt
Gur cnffjbeq vf WIAOOSFzMjXXBC0KoSKBbJ8puQm5lIEi
```

여기 나온 결과를 카이사르 암호 풀이 사이트를 이용해서 풀어도 된다. 하지만 이번에는 `tr`명령어를 사용해 보기로 한다.

---

#### tr(translate) 명령어

특정 문자를 치환하거나 삭제할 수 있다.

`tr [option] [문자열1] [문자열2]` 형태로 사용할 수 있다.

- 소문자 -> 대문자 : `tr a-z A-Z`, `tr '[:lower:]' '[:upper:]'`, `tr '[a-z]' '[A-Z]'등의 형태로 사용할 수 있다.

---

우리는 `ROT13`된 문자열이 필요하다. 또한 대,소문자 모두 이동해야 하기에 범위 지정을 할 때에 대소문자 모두 기입해야 한다.

```shell
bandit11@bandit:~$ cat data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'
The password is JVNBBFSmZwKKOP0XbFXOoW8chDz5yVRv
```

비밀번호 : `JVNBBFSmZwKKOP0XbFXOoW8chDz5yVRv`

## Bandit Level 12 -> Level 13

**user_id** : bandit12<br/>
**password** : JVNBBFSmZwKKOP0XbFXOoW8chDz5yVRv

### 목표

![bandit12_13](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/bd856e0b-0860-41b0-84d5-a5b08b9c6387)

다음 레벨로 가는 비밀번호는 **여러번 압축된** `hexdump` 파일인 `data.txt`에 있다. 이번 레벨을 위해서는 `mkdir`을 이용해서 `/tmp` 디렉토리 아래 파일을 만들어서 문제를 푸는 것이 좋다. 예를들어: `mkdir /tmp/myname123`. `cp`명령어를 사용해서 datafile을 옮기고 `mv`명령어를 사용해서 이름을 다시 지어라.(manpage를 읽어봐!)

### 해결법

모르는 명령어가 몇개 더 추가되었군요. 한번 정리해 봅시다.

---

#### mkdir (make directory)

디렉토리(폴더)를 생성할 때 사용하는 명령어입니다.

> `mkdir [옵션] [생성할 디렉토리]`

예를 들어 `호롱고양이의 폴더`를 만든다고 해봅시다.

`mkdir lampcat_folder` 이렇게 명령어를 이용하면 현 위치를 Default(기본)으로 하여 지금 위치에 폴더를 만들게 됩니다.

그렇다면 이번에는 **/home/** 위치에 폴더를 생성한다고 해봅니다.

`mkdir /home/lampcat_folder` 이런식으로 폴더를 생성할 수 있다.

##### options (옵션)

- -m : 디렉토리를 생성할 때 권한을 설정합니다. (아직 이해가..)
- -p : 상위 경로도 함께 생성합니다. (위 예시에서 만약 `/home`경로가 없다면 추가적으로 생성하게 됩니다)
- -v : 디렉토리를 생성하고 생성된 디렉토리에 대한 메시지를 출력합니다.

---

#### cp (copy)

리눅스 혹은 유닉스 환경에서 파일 혹은 디렉토리를 복사할 때 사용합니다.

```shell
cp [옵션] [복사 대상 디렉터리or파일] [복사될 디렉터리or파일]
```

##### options (옵션)

- -r : 하위 디렉토리까지 모두 복사
- -i : 복사될 파일의 이름이 이미 존재한다면
- -v : cp 명령어를 수행하면서 복사 진행 상태를 출력한다.
- -f : 복사 파일이 이미 그 위치에 있다면 파일을 지우고, 강제로 복사한다.
- -p : 파일 혹은 디렉토리를 복사할 때 복사 대상의 소유자(계정), 그룹, 권한등의 정보까지 복사한다.

마지막 옵션 `-p`를 사용하게 되면 권한까지 복사하게 되므로 원래 `permission denied` 되던 문제를 해결하기 위해 우리가 mkdir로 폴더를 옮겨 작업하던 것이 의미 없게 된다!

---

#### mv (move)

> `mv [옵션] [원본 파일] [변경하려고 하는 대상, 대상의 위치]`

원래는 디렉토리를 이동시킬 때 사용하는 명령어이다.

##### options (옵션)

- -b : 이동시킬 파일이 이미 존재하면 백업 파일을 만든다.
- -i : 이동시킬 파일이 이미 존재하면 덮어쓰기 여부를 묻는다.
- -f : 이동시킬 파일이 이미 존재하면 강제로 덮어쓰기 한다.
- -n : 이동시킬 파일이 이미 존재하면 덮어쓰기 하지 않는다.
- -r : 하위 디렉토리까지 모두 이동한다.
- -v : 이동 진행상황을 출력한다.

그런데 우리는 이것을 이용하여 대상의 확장자를 변경하는 작업을 할 것이다.

---

이것만 있으면 될 줄 알았는데 압축을 해결하기 위해 추가적인 명령어가 필요했다.

#### xxd

파일 혹은 표준 입력으로부터 `hexdump`를 만들거나 복원해 주는 명령어로, 바이너리 형식에서 `hexdump`를 만들 수 있다.

> Hex dump?

hex dump는 램 또는 파일이나 저장장치에 있는 컴퓨터 데이터의 십육진법적인 보임새이다. 데이터의 hex dump를 보는 것은 주로 디버깅이나 리버스 엔지니어링의 한 부분이다. hex dump에서, 각 바이트는 2 숫자의 16진법 수로 표현된다.

라고 위키백과에서 말했다. 글로만 봐서는 무슨 말인지 이해가 안가 직접 `cat`명령어로 열어보기로 했다.

![bandit12_13_hexdump](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/a02f98f8-c948-4065-9a05-65871a64eb9b)

어우.. 이게 그 hex dump라는 것인 듯 하다. 나중에 `Hex dump`에 관해 좀 더 찾아봐야겠다.

그럼 이제 다시 xxd로 돌아와서 (일단은 쉬운 것만 적어놓겠다.)

- -i : C언어에서 사용가능한 형식으로 출력
- -E : 오른쪽 문자열을 ASCII에서 \*EBCDIC로 변경
- -r : 16진수 데이터를 바이너리 데이터로 변환
- -u : hex 를 소문자 대신 대문자로 출력

#### bzip2

`gzip`보다 높은 압축률을 갖는 압축방식을 사용한다.

- bzip2 압축 해제

```shell
bzip2 -d data.bz2
```

- bzip2 압축

```shell
bzip2 data.tar
```

- bzip2 압축 파일 정보 출력

```shell
bzip2 data.bz2
```

- bzip2 압축 파일 내용 출력

```shell
bzcat data.bz2
```

#### gzip

`gzip`은 60~70%의 압축률을 갖습니다. `.gz`, `.tar`, `.bz2`에 관한 내용은 좀 더 찾아봐야겠다.

- gzip 압축 해제

```shell
gzip -d data.gz
```

- gzip 압축

```shell
gzip data.tar
```

- gzip 압축 파일 정보 출력

```shell
gzip -l data.gz
```

- gzip 압축 파일 내용 출력

```shell
zcat data.gz
```

---

#### tar (Tape Archive)

여러 파일을 하나의 파일로 묶어주는 명령어이다.

압축을 해주는 명령어인 `gzip`, `bzip2`와 다르게 `tar`명령어는 단순히 파일을 하나로 묶는 명령어이다. 하지만 여러 옵션을 추가하여 압축까지 가능하게 해준다.

- -c (create) : 파일을 하나로 합친다.
- -v (verbose) : `tar`의 과정을 보여준다.
- -f (file) : 압축파일의 이름은 지정해준다.
- -x (extract) : 압축을 해제한다.
- -z (gzip) : `gzip`형태로 압축한다. (.gz)
- -j (bzip2) : `bzip2`형태로 압축한다. (.bz2)
- -t (list) : 파일의 리스트를 확인할 수 있다.

---

그럼 이제 정말로 비밀번호를 찾아보자.

![bandit12_13_1](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/de13c208-2fa4-4875-930f-018eb64cd919)

아까 했던대로 `data.txt`파일을 열어보자 hex dump파일이 나온다.

그리고 그 파일을 `xxd` 명령어를 풀어보면?

![bandit12_13_2](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/6c997608-9d17-489b-95d6-62f7a43f64f2)

아.. permission denied 접근 권한 없음 오류가 나온다. 그리고 우리는 사실 이 오류를 예상했었다. 바로? 목표에서!

`mkdir`명령어와 `cp`명령어를 이용해서 디렉토리를 만들고 파일을 복사해서 문제를 풀어보라고 한다. `cp` 명령어를 사용 할 때에 `-p` 명령어가 권한까지 복사하는 것을 보아 그냥 `cp` 명령어를 사용하였을 때에 권한이 복사되지 않기에 변경할 수 있는 것으로 보인다.

`mkdir`명령어를 사용해서 `lampcat`이라는 디렉토리를 만들면?

![bandit12_13_3](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/023b9952-54af-47fb-8127-66841620428c)

아까 테스트 해 본다고 디렉토리를 만들었었더니 아직 서버에 남아있는 듯 하다. 그럼 다른 이름으로 시도해 보면 된다.

![bandit12_13_4](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/f1a65e2d-b527-4530-af2c-03ad849e2224)

이번에는 디렉토리를 만드는데 성공했다. `cp`명령어로 만들어둔 디렉토리에 data.txt를 복사한 뒤 `xxd`명령어로 바이너리 데이터로 되돌려보자.

![bandit12_13_5](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/16634f27-9001-42f0-9c11-409bc8cb3bf5)

보아하니 `data`라는 파일이 복원된 파일이다. file 명령어로 `data`의 상태를 읽어보니 `gzip`의 형태로 압축되어있다고 한다.

```shell
bandit12@bandit:/tmp/oillampcat$ file data
data: gzip compressed data, was "data2.bin", last modified: Thu Oct  5 06:19:20 2023, max compression, from Unix, original size modulo 2^32 573
```

그렇기에 우리는 `data`파일을 `mv`명령어를 사용하여 `.gz`형태의 확장자로 바꿔준 뒤 압축을 해제할 것이다.

![bandit12_13_6](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/552a4b64-e82b-4dad-9f19-148315d56913)

그리고 돌고돌아 다시 `data`파일을 마주하였다. 그리고 이번에는 bzip의 형태로 되어있다고 한다. 그럼 또 풀어야겠지?

![bandit12_13_7](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/e30dc8bb-1c1b-492f-93ad-7566431b022c)

`mv`명령어로 bz2확장자로 변경하고, `bzip2`명령어로 압축 해제하면 또또 `data`파일은 만나게 된다.

![bandit12_13_8](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/ed6a1341-c251-46f0-9d02-d58be2557ef9)

그렇게 한번 더 `gzip`형태를 풀게되면, 이번에는 `tar`형식으로 압축되어있다고 한다.

![bandit12_13_9](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/addece31-c3d5-4665-90f6-da78920e8771)

`tar`로 압축된 `data`파일은 이번에는 `tar`명령어의 `-x (압축해제)`, `-v(압축 과정 출력)`, `-f(압축파일 이름 지정)` 옵션을 이용해 풀어주었다.

![bandit12_13_10](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/029256c9-3d9c-4f18-85fe-65e722a770c8)

이번에는 웬일로 확장자를 붙인 채로 `data5.bin`이라는 이름을 갖고 압축이 해제되었다.

![bandit12_13_11](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/e6204f24-b442-4832-bdd0-0f1a88bc3a76)

이제 이 data5.bin 파일을 읽어보면? 또다시 `tar`압축이 되어있다고 한다.

![bandit12_13_12](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/01ed1050-7d63-4180-a2fd-b5f8a43a3234)

다시 한번 풀어주고 이제는 반복일 뿐이다.

![bandit12_13_13](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/d2eb025f-395c-44c7-a151-315891da7b39)

같은 이름이지만 `file`명령어로 읽어봤을 때에 압축된 방법이 다른 `data8.bin`파일이다.

![bandit12_13_14](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/36e2bcde-2dc4-47e9-b7b1-dd20f4a5fd21)

드디어 비밀번호를 찾을 수 있었다. 확장자는 `.bin`이지만 `file`명령어로 읽어보면 `ASCCI` 텍스트로 이루어져 있다는 것을 알 수 있다.

![bandit12_13_15](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/8e78ddcc-71fb-46f2-bd70-9d420c431176)

비밀번호 : `wbWdlBxEir4CaE8LaPhauuOo6pwRmrDw`

## Bandit Level 13 -> Level 14

**user_id** : bandit13<br/>
**password** : wbWdlBxEir4CaE8LaPhauuOo6pwRmrDw

### 목표

![bandit12_14](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/6859c2c8-b01d-4c9c-9d19-be59b98dfd64)

비밀번호는 `/etc/bandit_pass/bandit14`에 있고 이 파일은 `bandit14`유저만 열어볼 수 있다. 이번 레벨에서는 다음 레벨로 가는 비밀번호는 찾을 수 없지만, 다음 로그인 할 때 필요한 `SSH key`는 가지고 있다. **Note : localhost**는 당신이 현재 작업하고 있는 `PC` 입니다.

### 해결법

이게 무슨 말인고 하니, '우리는 `ssh` 즉 네트워크 상의 다른 컴퓨터에 로그인, 혹은 원격 제어를 할 수 있게 해주는 프로토콜의 비밀번호를 이미 알고있다.' 라고 합니다. 일단 그럼 `SSH`가 무엇인지 부터 한번 이야기를 해볼까한다.

#### SSH

##### `SSH`란?

`Secure Shell Protocol` 즉 네트우크 프로토콜 중 하나로 컴퓨터와 컴퓨터가 같은 Public Network를 통해 통신할 때 보안을 통한 통신(제어, 전송)을 하기 위해 사용하는 프로토콜입니다.

##### `SSH 클라이언트`란?

`SSH 클라이언트`란 안전한 원격 프로토콜인 SSH를 이용하여 원격 서버에 접속 할 수 있게 해주는 소프트웨어로 대표적으로는 `Putty`, `xshell`이 있습니다. 제가 이 포스트에 사용하고 있는 `Termius`도 또한 `SSH 클라이언트`이다.

##### `SSH 서버`란?

Unix 계열의 운영체제(Mac, Linux)를 원격제어하기 위해서 `SSH 서버`가 설치되어있어야 하는데 `Mac`에는 기본적으로 깔려있으나 `Linux`에는 별도로 설치해 주어야한다.

##### `SSH Key`란?

`SSH Key`란 서버에서 클라이언트가 접속할 때 비밀번호 대신 `Key`를 제출하여 접속할 수 있습니다. `SSH Key`에는 `Private Key`(비공개 키), `Public Key`(공개 키)가 있는데 `Private Key`는 `Client`가 `Public Key`는 `Server`가 가지고 있게 된다. `SSH 서버`에 접근을 시도하면 두 키가 일치하는지를 확인하여 접속할 수 있게 해준다.

##### `ssh` 명령어 사용법

기본적인 접속 명령어

```
ssh [옵션] [접속할 계정]@[접속할 ip]
```

##### 옵션

-p 옵션 : 포트 지정

```
ssh -p [포트 번호] [접속할 계정]@[접속할 ip]
```

-i 옵션 : ssh key를 이용해서 접속

```
ssh -i [ssh 키 파일 위치] [접속할 계정]@[접속할 ip]
```

-c 옵션 : 데이터 압축 (네트워크 사용량 줄이기)

```
ssh -C [접속할 계정]@[접속할 ip]
```

-v 옵션 : 전체 로그 출력

```
ssh -v [접속할 계정]@[접속할 ip]
```

---

그럼 이제 비밀번호(?)를 찾으러 가보자.

-----아래 내용이랑 전체 내용을 기록할 때 내가 기억을 못하고 새로 작성한 듯 하다-----

#### Shell (쉘)?

 쉘이란 운영체제 커널과 사용자 간의 소통을 담당해 주는 텍스트 기반의 명령어 해석기이다. 쉘은 마치 커널을 조개껍질처럼 감싸고 있다고 하여 shell(껍데기)라는 이름이 붙었다.

 쉘은 UI, 즉 유저 인터페이스(User Interface) 사용자로부터 입력을 받아들이는 방식에 따라 두가지로 나뉜다고 한다.

 - GUI (Graphic User Interface) : Gnome, KDE, (윈도우 사용자들이 보는 화면도 포함!) 등
 - CLI (Command Line Interface) : csh, bash, cmd 등

#### SSH (Secure Shell) - 보안 셸 프로토콜?
 
 SSH는 네트워크 상의 다른 컴퓨터의 셸을 사용할 수 있게 해주는 프로토콜을 의미한다. SSH를 이용하여 보호되지 않은 네트워크를 통해 컴퓨터에 명령을 안전하게 전송할 수 있게 해준다. 계속 서버에 앉아있을 수는 없는 노릇이니 원격으로 SSH를 통해 서버에 접속해 관리할 수 있게 한다.
 
 SSH가 동작할 때에는 SSH서버라는 이름을 가진 데몬([daemon](https://ko.wikipedia.org/wiki/%EB%8D%B0%EB%AA%AC_%EC%BB%B4%ED%93%A8%ED%8C%85))이 항상 작동하면서 접속을 기다리고 있다가 클라이언트가 접속을 시도하면 SSH 서버와 클라이언트간의 보안 연결이 된다. 그 보안을 위해 다음과 같은 보안 방식을 가진다.

 - key는 `private key`와 `public key`의 한 쌍으로 이루어져있고 이 둘을 비대칭 키라고 부른다. `Private key`는 클라이언트(Client)에서 안전하게 보관되어야하는 key이고 `Public key`는 서버(Server)에 공유되는 key를 의미한다.
  
  클라이언트가 ssh명령어를 통해 서버에 접속을 시도하게 되면 서버는 클라이언트가 `Private key`를 가졌는지 확인을 하여 연결 여부를 결정하게 되는 것이다.

 자 그럼 다시 접속을 해보도록 하자.

 ![bandit13_14_1](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/c92303b5-f7c8-4a8d-8c5e-0685fc341189)

 우리가 읽을 수 있는 파일 중에는 `sshkey.private`라는 파일이 존재한다.

 `file`명령어를 사용해 보았을 때 해당 파일은 PEM RSA private key라고 한다.

 무슨 파일일까 해서 `cat`명령어를 사용하여 읽어보니 역시 사람이 읽을 파일은 아닌 것 같다.

 그럼 이 파일을 이용해서 무엇을 하라는 것일까?

 [SSH key로 Linux 접속하기](https://pyromaniac.me/entry/SSH-%ED%82%A4%EB%A1%9C-Linux-%EC%A0%91%EC%86%8D%ED%95%98%EA%B8%B0), [SSH 공개키 인증을 사용하여 접속하기](https://velog.io/@lehdqlsl/SSH-%EA%B3%B5%EA%B0%9C%ED%82%A4-%EC%95%94%ED%98%B8%ED%99%94-%EB%B0%A9%EC%8B%9D-%EC%A0%91%EC%86%8D-%EC%9B%90%EB%A6%AC-i7rrv4de)

 이곳 저곳을 찾아보니 ssh 명령어 옵션 중 `-i`라는 옵션을 이용하여 private key 파일을 선택하여 접속할 수 있다고 한다.

 ```ssh -i [Private Key FIle] [UserName]@[HostName] [포트]```

 형식을 이용하여 사용할 수 있다. 자 그럼 이제 접속을 해보도록 하자.

 ```
ssh -i sshkey.private bandit14@localhost -p 2220
 ```

 ![bandit13_14_2](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/e315ca59-b035-49f9-99b1-dc42f9121a0f)


 어라 안바뀌었나? 싶지만

 ```
 !!! You are trying to log into this SSH server with a password on port 2220 from localhost.
 !!! Connecting from localhost is blocked to conserve resources.
 !! Please log out and log in again.
 ```

 ```
 !!! 로컬 호스트에서 포트 2220의 암호를 사용하여 이 SSH 서버에 로그인하려고 합니다.
 !!! 리소스를 절약하기 위해 로컬 호스트에서 연결이 차단되었습니다.
 !!! 로그아웃 후 다시 로그인해 주시기 바랍니다.
 ```

 라며 경고를 보내지만

 ![bandit13_14_3](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/fe541693-a864-4442-89b8-b7eddb8efcf3)

 일단은 접속에 성공한 모습이다. 그럼 이제 이 상태에서 비밀번호를 찾으러 가보자.

 ![bandit13_14_4](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/566d42bb-2236-4a4c-b3d1-ef17c81a603c)

 수 많은 파일들이 보이지만 이 중 우리가 볼 것은 bandit14의 비밀번호이다. 그리고 다른 폴더를 열어보려 하여도 

 ![bandit13_14_5](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/83659c12-669f-4f26-af30-6cc1987459cb)

 다른 사용자가 만든 파일은 접근할 수 없어 `permission denied`만 뜰 뿐이다.

 비밀번호 : `MU4VWeTyJk8ROof1qqmcBPaLh7lDCPvS`

## Bandit Level 14 -> Level 15

**user_id** : bandit14<br/>
**password** : fGrHPx402xGC7U7rXKDaxiWFTOiF0ENq

### 목표

![bandit14_15](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/4a22d422-d5c6-40e2-987a-764ba939b960)

다음 레벨의 암호는 `로컬 호스트`의 `포트 30000`에 `현재 레벨의 암호`를 제출하여 검색할(얻을) 수 있다.

### 해결법

와 이번에는 전보다 더 많은 `Helpful Reading Material`이 있으니 읽어보는 것도 좋을 듯 하다.

일단은 언제나처럼 어떤 파일들이 있을지 살펴보도록 하자.

![bandit14_15_1](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/7dd73462-3d84-4ae2-a4a1-52df74823405)

일..단은 아무래도 파일이 전부 숨겨져있나보다.

![bandit14_15_2](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/c72c9254-3391-4f27-9598-a478064c2745)

물론 `ls -a` 명령어를 이용하여 숨겨진 파일들도 볼 수 있고 그중에는 `.ssh`라는 처음보는 파일도 있기에 한번 읽어보기로 하자

![bandit14_15_3](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/cdb98a52-e536-41c8-be2c-803d48288be4)

저번과 같이 이번에도 딱히 도움이 될 것 같은 느낌은 아니다.

문제에서 말하길 `localhost`의 `30000 포트`로 가보라고 했으니 `ssh`, `telnet`, `nc`명령어 들을 이용해서 접속을 해보도록 하자.

- [Telnet](https://www.ibm.com/docs/ko/i/7.3?topic=services-telnet) : 로컬 네트워크 내에서 직접 연결된 것 처럼 외부컴퓨터에서 로그인 하여 사용할 수 있도록 하는 프로토콜.

- [nc (netcat)](https://ko.wikipedia.org/wiki/Netcat) : TCP 또는 UDP를 사용하여 네트워크 연결을 읽거나 기록하는 컴퓨터 네트워킹 유틸리티이다. (네트워크 해킹과 보안 책에서 메일 서버를 해킹하는 실습에 사용했던 도구)

```
telnet [port] [hostname]

nc [port] [hostname]
```

이지만 요즘에는 대부분 ssh로 교체되고 있는 중이라고 한다.

자세한 내용은

[telnet, netcat](https://velog.io/@hyungyoo42/telnet-netcat) 블로그를 참고하면 좋을 듯 하다. 매우 잘 정리가 되어있다.

그럼 첫번째로 계속 해오던 ssh를 이용하여 접속을 시도해보자

![bandit14_15_4](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/0412265c-01b4-4d87-93a3-075165ed9aea)

오류 메시지를 발견하고 바로 검색을 해보았다. 

[kex_exchange_identification: Connection closed by remote host](https://betweencloud.tistory.com/137)

아하 접속은 하였으나 아무일도 하지않아 종료되며 출력된 오류 메시지라고 한다. 그럼 이제 다음 방법을 사용해보자.

`telnet`을 이용하여 접속해보자.

![bandit14_15_5](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/98a69cf2-4bcd-4eec-b4ee-0346838cff5c)

접속 후 문제에서 주어진 것 처럼 bandit14의 비밀번호를 입력하자 bandit15로 가는 비밀번호를 출력해주었다!

비밀번호 : `jN2kgmIXJ6fShzhT2avhotn4Zcka6tnt`

`nc (netcat)`을 이용해보자.

![bandit14_15_6](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/a0fe48db-aea9-4944-ae50-5d5c29187cd7)

`netcat`에서도 동일한 비밀번호를 출력해 주었다.

비밀번호 : `8xCjnmgoKbGLhHFAZlGE5Tmu4M2tKJQo`

## Bandit Level 15 -> Level 16

**user_id** : bandit15<br/>
**password** : jN2kgmIXJ6fShzhT2avhotn4Zcka6tnt

### 목표

![bandit15_16](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/d468c106-26f1-4d1f-bac5-75d438ceff18)

다음 단계로 가기 위해서 localhost 포트 30001에 현재 레벨의 password를 SSL 암호화를 이용해라

유용한 노트 : ign_eof를 이용해서 "HEARTBEATING"과 "Read R BLOCK?"을 얻고 메뉴 페이지에서 "CONNECTED COMMANDS" 섹션을 읽으십시오. 'R'과 'Q' 옆에 있는 'B'명령어도 이 명령어 버전에서 작동합니다...

### 해결법

음... 솔직히 유용한 노트에서 무엇을 말하는 건지 전혀 감도 잡히지 않는다

일단 문제에 써있는 것들을 하나씩 알아보자

#### SSL(Secure Sockets Layer)?

> 보안 소켓 계층

암호화 기반 인터넷 보안 프로토콜이다.

찾다보니 [CloudFare SSL](https://www.cloudflare.com/ko-kr/learning/ssl/what-is-ssl/)에 아주 자세히 나와있어 첨부한다

간단하게 말하면 두 컴퓨터 사이에 전송되는 데이터를 암호화 하여 인터넷 연결을 보호하는 표준 프로토콜로 현재는 SSL -> TLS로 쓰이고 있다

#### openssl?

ssl을 이용하기 위해 우리가 사용할 명령어는 `openssl`이다

`help`명령어로 무엇을 추가할 수 있을지 알아보자

![bandit15_16_1](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/bbcb1594-9a13-4334-9a14-34847833d223)

보아하니 

- Standard commands
- Message Digest commands
- Cipher commands

중 하나를 사용해야 한다

여기에 나와있는 수 많은 명령어 중 우리는 bandit에서 `Commands you may need to solve this level`에 나온 `s_client`를 이용하도록 하자

#### s_client

```
openssl s_client -[option] [host:port]
```

처음 보는 명령어이니 다시 `help`를 이용해 옵션을 살펴보자

![bandit15_16_2](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/53888cf4-7cdf-4698-8d31-05a6dacde4e4)

이번에는 아까보다 훨씬 더 많은 옵션들이 존재한다

- General options
- Network options
- Identity options
- Session options
- Input/Output options
- Debug options
- Protocol and version options
- Random state options
- TLS/SSL options
- Validation options
- Extended certificate options
- Provider options

그리고 Parameter로는

- host:port

형식을 쓴다고 한다

우리는 연결을 해야하기 떄문에 `Network options`에 있는 `connect`옵션을 사용하도록 하자

![bandit15_16_3](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/bd0590e5-25ed-4f6e-931f-5a4fc244e1a6)

다시 한번 매우 긴 글이 우리를 반겨주지만 드디어 내가 이해하지 못했던 힌트의 `read R BLOCK`를 발견 할 수 있었다

여기에 현재 레벨의 비밀번호를 입력해주게 되면?

![bandit15_16_4](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/3adf321a-9883-4fbf-98fb-cabbc0fdc638)

Correct!라며 bandit 16으로 가는 비밀번호를 알려준다

비밀번호 : `kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx`

글이 길다고 무서워하지 말고 차근차근 읽어보자!

## Bandit Level 17 -> Level 18

**user_id** : bandit17<br/>
**password** : EReVavePLFHtFlFsjn3hyzMlvSuSAcRD

### 목표

![image](https://github.com/user-attachments/assets/1670f61d-d9bf-4e1c-ad5c-a9f9888027f0)

홈 디렉토리에는 passwords.old와 passwords.new 두 개의 파일이 있습니다. 다음 단계의 암호는 passwords.new에 있으며 passwords.old와 passwords.new 사이에서 변경된 유일한 줄입니다

참고: 이 레벨을 해결하고 bandit18에 로그인하려고 할 때 'Bye bye!'를 보게 될 것인데, 이것은 다음 레벨인 bandit19와 관련이 있습니다

### 해결법

![image](https://github.com/user-attachments/assets/f132c113-6a35-4085-bfff-c62054c8897d)

정말로 파일은 .new와 .old가 존재하고 둘 다 읽을 수 있는 파일로 되어있네요

cat명령어를 통해 읽어보니 

![image](https://github.com/user-attachments/assets/d1f4ee66-57f8-4923-a923-97ddf2c9ddab)

어우 사진에 보이는 것 보다 더 길군요

일단 bandit에서 힌트를 주길 `cat`,`grep`,`ls`,`diff`를 쓰라고 했으며 왠지모르게 `diff`라는 명령어가 이번 문제의 키일 것 같은 느낌이 드네요

> diff : 두 파일을 비교하고 차이점 추출

`-q` : 파일이 다른 경우 `Files passwords.new and passwords.old differ`이런 식으로 간단하게 다르다, 라고만 알려준다

`-r` : 디렉토리 비교를 위해 사용

`-u` : 유니파일 형식으로 파일의 차이를 출력

예를들어 다음과 같다

![image](https://github.com/user-attachments/assets/da2d41cf-20ba-4623-8dc6-edea1036bd1f)

`-c` : 파일의 차이를 문장 형태로 보여준다

![image](https://github.com/user-attachments/assets/ee5e1253-d249-492e-a933-c8f80ea19865)

'39에서 45번째 줄 중 이 부분이 틀렸어요!' 하고 알려준다

`-i` : 대/소문자를 무시하고 비교

`-w` : 공백 문자 무시

`-B` : 빈줄 무시

`-y` : 이중 컬럼 출력 모드

![image](https://github.com/user-attachments/assets/02de73ce-2f1a-48bf-aa75-2404534d5268)

이런 식으로 github commit 내용처럼 비교하여 출력함

`-l` : 변경된 줄의 개수만 출력

우리는 굳이 옵션을 넣어줄 필요는 없어 보인다

![image](https://github.com/user-attachments/assets/5ea5064a-a7ec-434a-8096-4514c32c2f95)

위 부분이 new파일이고 아래 부분이 old파일 부분이다

그렇다면 바뀐 비밀번호는? 위에 부분인 것이다

비밀번호 : `x2gLTTjFwMOhQ8oWNbMN362QKxfRqGlO`

그런데 여기서 잠깐 다음 문제로 넘어가게 되면 연결을 시도했을 때 termius를 사용하는 사람이라면 바로 종료가 되어 session log를 확인해 보았을 때

![image](https://github.com/user-attachments/assets/ce3d3643-4469-487d-9d36-a8542a72cef3)

`Byebye!`라며 바로 나를 내보내 버린다

처음 문제에서 말했듯 이것은 bandit19번과 관련이 있으며 우리는 잘 해결한 것이 맞다!

## Bandit Level 18 -> Level 19

**user_id** : bandit18<br/>
**password** : x2gLTTjFwMOhQ8oWNbMN362QKxfRqGlO

### 목표

![image](https://github.com/user-attachments/assets/1da9fdce-e977-4e55-823e-c3b68378c370)

다음 레벨의 암호는 홈 디렉토리의 readme 파일에 저장됩니다. 불행히도 SSH로 로그인할 때 누군가가 .bashrc를 로그아웃하도록 수정했습니다.

그래서 자꾸 로그아웃 당했던 거구만

일단 readme파일에 비밀번호가 있다고 하니 들어갈 수만 있다면 오케이다

### 해결법

> 일단 `bashrc`가 무엇인가? 

bash + Run Command 의 줄인말

> `./bashrc` 는?

[bashrc 설정하기](https://slamwithme.oopy.io/bb4e942f-65f1-4c8d-8188-203eca2b8fde)에 자세히 설명되어있으며 간단히 말하면 `bash`에 미리 입력하고 싶은 내용을 작성해두어 쉘을 열면 자동으로 실행되는 것을 뜻한다

그렇다면 [[Ubuntu] terminal에 pfetch 실행하기](https://oil-lamp-cat.github.io/posts/pfetch-terminal/) 이것도 bashrc에 명령어를 미리 입력해 두어 실행할 수도 있겠네!

그런데 이번 문제에서는 누군가 `.bashrc`파일을 변경해두어 ssh를 이용해 쉘을 연결하면 기본 쉘인 `bash`가 실행되면서 `Byebye`를 출력하고 우리를 쫒아낸 것이다

그렇다면 접속을 하기 위한 쉘인 ssh에 관해 조금 더 생각을 해보자

원래 우리는 ssh를 연결할 때 (termius말고) 

```sh
ssh [옵션] [사용자명]@[호스트 주소]
```

을 통해 연결했었다 하지만 만약 접속 전에 명령어를 넘겨줄 수 있다면?

```sh
ssh [옵션] [사용자명]@[호스트 주소] [명령어]
```

원래는 이런 형태로도 사용이 가능했던 것이다!

이번에는 터미널을 통해 연결해보자 (termius)

![image](https://github.com/user-attachments/assets/74cc8d8d-34f4-4a62-88ce-f955cc49f724)

터미널을 열고

![image](https://github.com/user-attachments/assets/6f9a2186-a8cc-4dcf-89c2-f593537f0940)

`bash`쉘이 아닌 `sh`가장 기본 쉘을 통해 접속에 성공했다

또한 처음에 비밀번호를 입력했을 때 따로 출력이 뜨지 않는다고 뭐지? 생각할 수도 있다

따로 password incorrect와 같은 오류가 뜨지 않았다면 접속에 성공한 것이니 하던대로 파일을 읽으면 된다!

비밀번호 : `cGWpMaKXVwDUNgPAVJbWYuGHVn9zl3j8`

## Bandit Level 19 -> Level 20

**user_id** : bandit19<br/>
**password** : cGWpMaKXVwDUNgPAVJbWYuGHVn9zl3j8

### 목표

![image](https://github.com/user-attachments/assets/07e3af78-dba4-4b62-94dc-2067f65c28d7)

다음 레벨에 액세스하려면 홈 디렉토리에서 setuid 바이너리를 사용해야 합니다. 사용 방법을 알아보려면 인수 없이 실행하십시오. 이 레벨의 암호는 setuid 바이너리를 사용한 후 일반적인 자리(/etc/bandit_pass)에서 찾을 수 있습니다.

#### 1. 홈 디렉토리에서 setuid binary를 이용해라

> binary가 뭘까?

2진수 숫자로된 데이터 파일을 의미한다

그럼 여기서 말하는 setuid binary는 setuid가 설정된 데이터 파일을 의미한다

> setuid가 뭘까?

SetUID는 유닉스 환경에서 일시적으로 접근 권한이 없는 파일에 접근을 허용하는 특수 권한을 부여할 수 있게 된다

자세한 설명은 [SetUID를 이용한 권한상승의 위험성](https://www.igloo.co.kr/security-information/setuid%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EA%B6%8C%ED%95%9C%EC%83%81%EC%8A%B9%EC%9D%98-%EC%9C%84%ED%97%98%EC%84%B1/) 이곳을 참고하면 좋을 것이다

혹시 모르니 바로 한번 `/etc/bandit_pass/bandit20`를 읽어보자

![image](https://github.com/user-attachments/assets/6ff43497-9bfb-4592-aab0-ad94d096f360)

역시 권한이 없다

### 해결법

#### 권한

진작에 한번 공부를 했어야 했는데

[리눅스 권한 설정](https://danmilife.tistory.com/8), [리눅스 파일 & 디렉토리 권한](https://inpa.tistory.com/entry/LINUX-%F0%9F%93%9A-%ED%8C%8C%EC%9D%BC-%EA%B6%8C%ED%95%9C-%EC%86%8C%EC%9C%A0%EA%B6%8C%ED%97%88%EA%B0%80%EA%B6%8C-%F0%9F%92%AF-%EC%A0%95%EB%A6%AC)을 먼저 보고 오면 좋다

```
-rwsr-x--- 1 bandit20 bandit19 14880 Jul 17 15:57 bandit20-do
```

위와 같은 권한이 있다고 해보자

> `-` (file type)

`-`  : 파일이다

> rws (User) 

`r` : 읽기 권한 있음

`w` : 쓰기 권한 있음

`s` : setUID 설정이 되어있어 사용자 권한이 있어야 실행할 수 있음

> r-x (Group)

`r` : 읽기 권한 있음

`-` : 쓰기 권한 없음

`x` : 실행 권한 있음

> --- (Other)

아무 권한 없음

> bandit20 (User)

파일을 만든 소유주

> bandit19 (Group)

파일을 만든 소유주가 속한 그룹

> 14880 (File size)

파일 크기 byte로 되어있음

> Jul 17 15:57 (마지막 변경 날짜)

> bandit20-do (파일 이름)

![image](https://github.com/user-attachments/assets/0a5d9eb1-bebe-464f-aaca-e776afd4aaa5)

파일을 확인해 보면 권한이 `rws`로 `s`가 바로 setuid 설정이 되어있는 것이다

보통은 rwx로 권한이 설정되어있어서 실행 권한을 나타낸다고 한다

#### 일단 한번 실행해보자

![image](https://github.com/user-attachments/assets/71580daf-76e8-43b2-88a7-a2fb86612632)

다른 user권한으로 실행하라고 한다

예시에 `./bandit20-do id`라고 하니 그대로 실행시켜보자

![image](https://github.com/user-attachments/assets/f0164f7b-afcc-4c30-81e5-96b1809ff08a)

오 우리가 권한에 관해 이야기 할 때 봤듯 `setUID`가 설정되어있어 `bandit20`의 권한으로 실행이 된다

더 쉽게 알 수 있는 방법은 실행시켰을 때 `uid`는 `bandit19`로 뜨지만 옆에 `euid`가 `bandit20`으로 뜨고 있는 것을 볼 수 있다

이 `euid`는 파일을 실행했을 때 실제 사용하는 `uid`를 의미한다

#### 비밀번호를 가져오자

문제에서 `/etc/bandit_pass/bandit20`에 비밀번호가 있다고 하니 읽어보도록 하자

![image](https://github.com/user-attachments/assets/fe548a42-e460-4152-a819-04838907a4e2)

> 비밀번호 : **0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO**

와 솔직히 계속 bandit을 통해 리눅스 지식을 접하거나 bash스크립트를 짤 때 자꾸 사람들이 `chmod`니 권한 상승이니 하는 말들이 많았고 사실 그 때는 그냥 필요하면 따라하기만 했었는데 이렇게 중요한 것이라고는 생각을 못했었다

나중에 따로 아예 리눅스에 관한 책 혹은 글을 읽어봐야겠다

## Bandit Level 20 -> Level 21

**user_id** : bandit20<br/>
**password** : 0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO

이제 드디어 앞자리가 2로 바뀌었다

### 목표

![image](https://github.com/user-attachments/assets/1a076556-f8b2-4204-ae8b-32f52187de2c)

홈 디렉토리에는 명령줄 인수로 지정한 포트의 로컬 호스트에 연결하는 `setuid` 바이너리가 있습니다. 그런 다음 연결에서 텍스트 한 줄을 읽어 `이전 레벨(bandit20)`의 비밀번호와 비교합니다. 비밀번호가 정확하면 `다음 레벨(bandit21)`의 비밀번호를 전송합니다.

참고: 네트워크 데몬에 연결하여 네트워크 데몬이 생각하는 대로 작동하는지 확인해 보십시오

그러니까 `setuid binary`가 설정되어있고 네트워크 연결한 뒤 거기에 맞는 비밀번호를 입력하면 다음 레벨의 비밀번호를 준다

그런데 참고 부분이 있는 것을 보아하니 또 지금까지 해오던 것과는 다른 느낌인가보다

### 해결법

![image](https://github.com/user-attachments/assets/72f2317d-51b6-4ef8-b68a-7e327869b975)

이번에도 `setuid`설정이 된 파일이 보인다

일단 실행시켜보면

![image](https://github.com/user-attachments/assets/910726de-36bd-4bd5-a820-2e1953cae6bb)

`이 프로그램은 TCP를 사용하여 로컬 호스트의 지정된 포트에 연결합니다. 만약 다른 쪽에서 올바른 암호를 받으면 다음 암호는 다시 전송됩니다.`

음... 그니까 내가 bandit20으로 두개의 터미널로 연결해서 서로 통신을 하게 해야한다는 의미인 거겠지?

![image](https://github.com/user-attachments/assets/56a5cd4d-c718-40e9-b783-56039ae5880a)

termius에서는 터미널 나누기를 사용할 수 있다

![image](https://github.com/user-attachments/assets/33da9e3a-b580-4049-93af-2c7ff7b5963e)

이제 한쪽에서는 로컬에 포트 `7777(원하는 대로)`로 통신을 열어보자

![image](https://github.com/user-attachments/assets/c1f4f017-6362-4e94-9637-697063a9aad2)

아래 화면과 같이 로컬호스트에 연결되었다고 뜨면 이제 `bandit20`의 비밀번호를 넘겨주면 된다

![image](https://github.com/user-attachments/assets/3d0b745b-8b9a-422c-898b-9cefa9d7a9e1)

그러면 순식간에 비밀번호를 발송해준다!

> 비밀번호 : **EeoULMCra2q0dSkYj561DX7s1CpBuOBt**

그저 막연한 호기심으로 한번 파일을 읽어봤다

![image](https://github.com/user-attachments/assets/602dc3fb-221d-4f7f-9fa7-9a734b7e5929)

음.. 그만 알아보도록 하자

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

## Bandit Level 22 -> Level 23

**user_id** : bandit22<br/>
**password** : tRae0UfB9v0UzbCdn9cY0gQnds9GF58Q


### 목표

![image](https://github.com/user-attachments/assets/f561c320-8261-48f2-969e-84efe8a596f4)

시간 기반 작업 스케줄러인 cron에서 일정한 간격으로 프로그램이 자동으로 실행되고 있습니다. /etc/cron.d/에서 구성을 확인하고 어떤 명령어가 실행되고 있는지 확인하십시오.

참고: 다른 사람이 작성한 셸 스크립트를 보는 것은 매우 유용한 기술입니다. 이 수준의 스크립트는 의도적으로 읽기 쉽게 만들어졌습니다. 만약 그것이 무엇을 하는지 이해하는 데 문제가 있다면, 그것이 출력하는 디버그 정보를 보기 위해 실행해 보세요.

어... 저번이랑 거의 다른 것은 없고 참고가 추가되었다

### 해결법

![image](https://github.com/user-attachments/assets/a0862211-8068-4e25-b385-4e221b16ca35)

저번처럼 들어가서 `cron`에 연결된 파일을 후딱 읽어보면 이번에는 `/usr/bin/cronjob_bandit23.sh`파일로 연결되어있다고 한다


![image](https://github.com/user-attachments/assets/fe22702e-16a4-497d-b3ef-ab1c1af06451)

매우 간단한 스크립트가 있다

```bash
#!/bin/bash

myname=$(whoami)
mytarget=$(echo I am user $myname | md5sum | cut -d ' ' -f 1)

echo "Copying passwordfile /etc/bandit_pass/$myname to /tmp/$mytarget"

cat /etc/bandit_pass/$myname > /tmp/$mytarget
```

> myname=$(whoami)

`whoami`명령어를 통해 유저 id를 넣는다

> mytarget=$(echo I am user $myname | md5sum | cut -d ' ' -f 1)

`I am user bandit23`을 `md5`해시 변환 하고 ''을 구분하여 첫번째 부분만 `mytarget` 변수에 넣는다

> cat /etc/bandit_pass/$myname > /tmp/$mytarget

`tmp/$mytarget`에 `bandit23`의 비밀번호가 저장되게 된다

![ezgif-3-6b2e5d6e92](https://github.com/user-attachments/assets/aad031c4-edea-4b33-9c77-8c66535cc56f)

우리는 현재 `whoami`를 하였을 때 `bandit22`가 나오고 우리가 찾고 싶은 것은 `bandit23`의 비밀번호이기에 찾기위해 그 부분을 직접 입력해주자

![image](https://github.com/user-attachments/assets/7781a8df-4282-4dfa-9b6f-a9dd8db94959)

위에서 파일이 `/tmp/$mytarget`에 저장되어있다고 하였고 우리는 `$mytarget`이 `8ca319486bfbbc3663ea0fbe81326349`라는 것을 알아냈다

![image](https://github.com/user-attachments/assets/51560e85-dc0a-4bef-89dd-e4e1629fd958)

읽어보면 `bandit23`의 비밀번호를 알아낼 수 있다

> 비밀번호 : **0Zf11ioIjMVN551jX3CmStKLYqjk54Ga**

## Bandit Level 23 -> Level 24

**user_id** : bandit23<br/>
**password** : 0Zf11ioIjMVN551jX3CmStKLYqjk54Ga


### 목표

![image](https://github.com/user-attachments/assets/252e8dcf-8fa9-4a42-85b4-9c7f5fe93b37)

시간 기반 작업 스케줄러인 `cron`에서 일정한 간격으로 프로그램이 자동으로 실행되고 있습니다. `/etc/cron.d/`에서 구성을 확인하고 어떤 명령어가 실행되고 있는지 확인하십시오.

참고: 이 레벨은 여러분 자신의 첫 번째 쉘 스크립트를 만들어야 합니다. 이것은 매우 큰 단계이며 이 레벨을 통과할 때 자신을 자랑스러워 해야 합니다!

참고 2: 쉘 스크립트는 한번 실행되면 제거되므로 복사본을 보관하세요…


### 해결법

와 이번에는 직접 쉘 스크립트를 만들어야 한다고 한다!

![image](https://github.com/user-attachments/assets/16f1f694-8bf3-435a-8504-c0c644b35b6d)

보아하니 이번에는 `/usr/bin/cronjob_bandit24.sh`을 확인해 봐야 하는 것 같은데 어쨰서 쉘 스크립트를 만들어야 한다고 하는걸까?

![image](https://github.com/user-attachments/assets/373c7942-f0d5-4f1a-a264-89e1f39cb805)

1. `/var/spool/bandit24/foo`로 이동
2. 해당 경로의 모든 스크립트를 실행 후 삭제
3. 파일이 `.`이거나 `..`이 아닐 경우 실행
4. 파일 소유자가 `bandit23`이면 60초 동안 실행되고 `-s 9` 즉 `9(SIGKILL)`을 보내서 명령어를 강제종료한다. 그 후 삭제된다

저번과 다른 점이라면 아무래도 

```
cat /etc/bandit_pass/$myname > /tmp/$mytarget
```

비밀번호를 가져오는 이 부분이 빠졌기에 그 부분을 가져오고 `/var/spool/bandit24/`의 위치한 스크립트는 계속 삭제될 것이기에 따로 스크립트를 만들어 주고 옮기면 될 것 같다

```
#!/bin/bash
cat /etc/bandit_pass/bandit24 > /tmp/lampcat23/bandit24_password
```

![image](https://github.com/user-attachments/assets/fafd820e-6542-42bb-8638-7c3c50aa28c6)

스크립트를 만든 뒤 옮기려 하였는데 `/var/spool/bandit24/`가 없네?

아 잘못했구나 경로가 `/var/spool/$myname/foo`이니까 우리는 `/var/spool/bandit24/foo`가 될 것이다

다시 해보면?

![image](https://github.com/user-attachments/assets/207bd3c5-795f-45f9-b7dd-8043fdecd01e)

> 비밀번호 : **gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8**

## Bandit Level 24 -> Level 25

**user_id** : bandit24<br/>
**password** : gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8


### 목표

![image](https://github.com/user-attachments/assets/41841481-3d50-43cb-8384-31c248f060e1)

데몬은 `포트 30002`에서 듣고 있으며, `bandit24의 암호`와 `비밀 숫자 4자리 핀코`드가 주어지면 `bandit25`의 암호를 알려줍니다. `10000 가지 조합`을 모두 거치는 것 외에는 핀코드를 검색할 수 있는 방법이 없습니다.
매번 새 연결을 만들 필요가 없습니다

1. 30002번 포트는 열려있다
2. bandit24의 암호 + 비밀 숫자 4자리 를 보내면 bandit25의 암호를 돌려준다
3. 비밀 숫자는 10000가지 조합중 하나이다
4. 한번 연결하면 굳이 새 연결을 만들 필요가 없다

### 해결법

간단한 [brute force](https://hcr3066.tistory.com/26)공격 문제이다

스크립트를 만들고 무차별 대입을 해보자

![image](https://github.com/user-attachments/assets/c09c59c7-557b-4b91-b62e-e7efd07e449f)

일단 혹시해서 `nmap`을 통해 포트 스캐닝을 해보니 30002번 포트가 열려있는 것이 확실해 졌다

![image](https://github.com/user-attachments/assets/d1278d87-a400-49ca-8596-dbd79f62c006)

스크립트 생성을 위해 하던대로 내 작업장을 만들었다

`btureforce`를 위한 비밀번호 조합 생성 스크립트는 다음과 같다

```
#!/bin/bash
pwd24=gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8

for i in {0000..9999}
do
    echo $pwd24 $i >> pwdlist.txt
done
```

![image](https://github.com/user-attachments/assets/bb1b0c50-6b5f-4c35-8137-50eb8ed1fc02)

리스트를 만들고 나면 이제 접속을 시도해 보자

#### ERROR

![image](https://github.com/user-attachments/assets/2d689044-7a6b-4bd8-ba0b-1689937e916d)

혹시 나처럼 결과가 반복문이 실행되지 않는 분들을 위해 하나 말하자면

실행할 때 `sh`로 실행하는 것이 아니라

![image](https://github.com/user-attachments/assets/6617cbd7-8c24-4bf5-a15f-39d8dc87116d)

이렇게 `./`로 실행해 보아라

물론 실행하기 전에 권한도 줘야하고

[스크립트 실행하는 방법에 따른 차이점](https://m.blog.naver.com/darkpegasus/221962662113)이 글을 읽고 나면 어느정도 이해가 간다

`bash쉘`이 아니라 `sh 기본 쉘`로 실행되다 보니 반복문의  `{ }` 부분을 이해하지 못한 것 같다

#### 다시 접속

그럼 이제 만들어진 리스트를 가지고 접속을 시도해보자

![image](https://github.com/user-attachments/assets/2b8d6447-c643-4aae-997a-2bbc97765bcf)

순식간에 결과가 나왔다

역시 한번 틀려봐야 지식이 늘어난다

> 비밀번호 : **iCi86ttT4KSNe1armKiwbQNmB3YJP3q4**

## Bandit Level 25 -> Level 26

**user_id** : bandit25<br/>
**password** : iCi86ttT4KSNe1armKiwbQNmB3YJP3q4


### 목표

![image](https://github.com/user-attachments/assets/88d2184c-f33a-4324-b756-d805e5870f12)

`bandit25`에서 `bandit26`에 로그인하는 것은 꽤 쉬울 것입니다… 사용자 `bandit26`의 쉘은 /bin/bash가 아니라 다른 것입니다. 그것이 무엇인지, 어떻게 작동하는지, 그리고 그것을 탈출하는 방법을 알아보세요.

참고: Windows 사용자이고 일반적으로 Powershell을 사용하여 밴디트에 ssh를 적용하는 경우: Powershell은 이 수준의 의도된 솔루션에 문제가 발생하는 것으로 알려져 있습니다. 대신 명령 프롬프트를 사용해야 합니다.

나는 termius 쓸 거라서 참고사항은 패스

### 해결법

![image](https://github.com/user-attachments/assets/5f84f8cc-f20a-46c0-b934-40e276ee2dec)

일단 파일을 읽어보니 바로 `bandit26.sshkey`가 보인다

그리고 `bandit25@bandit:~$ ssh -i bandit26.sshkey bandit26@localhost -p 2220`를 통해 접속시도를 하게 되면

![image](https://github.com/user-attachments/assets/59321c9b-c6e8-4524-a62c-82b443f0d85a)

바로 쫒겨난다 목표에서 말하듯 쉘이 `/bin/bash`가 아닌 다른 것이기에 생긴 문제인 것 같다

![image](https://github.com/user-attachments/assets/81db3c03-0cb4-49ae-b879-7bcb5c020f0c)

`/etc/passwd`폴더에서 계정들이 사용하는 쉘을 볼 수 있다

[/etc/passwd에 관해](https://feccle.tistory.com/32)

![image](https://github.com/user-attachments/assets/2c44fac9-54bd-429a-ba54-ae3aaabe6f7e)

확인해 보면

`bandit26:x:11026:11026:bandit level 26:/home/bandit26:/usr/bin/showtext`

`(1):(2):(3):(4):(5):(6):(7)` 로 나눠 보았을 때

`:` : 구분자

`(1)` : 사용자 계정

`(2)` : 사용자 암호가 들어갈 자리, x는 /etc/shadow 파일에 암호가 저장되어있음

`(3)` : 사용자의 ID, root는 0

`(4)` : Group id, root그룹은 0

`(5)` : 기타 정보, 보통 사용자의 이름

`(6)` : 홈 디렉토리 정보

`(7)` : 사용자가 기본으로 사용하는 shell 정보

여기서 우리는 `bandit26`이 `/usr/bin/showtext`라는 쉘? 을 사용하고 있다는 것을 알 수 있다

![image](https://github.com/user-attachments/assets/10482587-19b3-4cde-a5b4-57cc43a54deb)

`/usr/bin/showtext`파일을 읽어보면 

> export TERM=linux

`TERM`이라는 환경변수에 linux를 저장

> exec more ~/text.txt

`/home bandit26/text.txt`에 `more`라는 명령어를 실행한다

처음보는 명령어이기에 [Linux 기본 명령어 more](https://incodom.kr/Linux/%EA%B8%B0%EB%B3%B8%EB%AA%85%EB%A0%B9%EC%96%B4/more)을 읽으면 좋다

일단 창을 줄이는 것과 관련된 명령어라는 것은 이해를 했다

![image](https://github.com/user-attachments/assets/42d234f7-dcfc-4118-a018-f866848aabb1)

termius에서는 안되는 걸로

![image](https://github.com/user-attachments/assets/ac91b62c-37a3-49c3-9184-5b4b0092c687)

`putty`에서는 성공했다

![image](https://github.com/user-attachments/assets/8903b7b5-5d7e-4bbd-8fdf-94cf350a15a4)

이 상태에서 v를 누르니 vi 편집기가 실행되었다

![image](https://github.com/user-attachments/assets/11d653e3-cbf4-41cc-9725-6aa4493d1acd)

`:set shell=/bin/bash` 명령어를 입력하여 `bash쉘`로 기본쉘을 설정하고

![image](https://github.com/user-attachments/assets/4c86a5c7-4f2b-42ec-a63d-c328b0440c96)

`:sh` 명령어를 입력해 익숙한 `bash쉘`로 들어올 수 있었다

![image](https://github.com/user-attachments/assets/1f894a43-72e2-4789-ac8c-da8258bf5899)

비밀번호가 출력되었다!

> 비밀번호 : **s0773xxkk0MXfdqOfPRVr9L3jJBUOgCZ**

이 다음 문제인 `bandit26`도 termius를 통해 접속하게 되면  다음과 같이 보인다만

분명 아무것도 눌리지 않을 것이다..

![image](https://github.com/user-attachments/assets/4490423e-f718-4128-89d6-599fa7bc4240)

그렇다.. 26번 문제도 아직 25번 문제에서 이어진 문제였던 것이다

여기서 부터는 다음번에

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

## Bandit Level 33 -> Level 34

**user_id** : bandit33<br/>
**password** : tQdtbs5D5i2vJwkO8mEyYEyTL8izoeJ0

### 목표

![image](https://github.com/user-attachments/assets/34acb541-a209-46cd-8bd1-1e342389b8b1)

아직 문제가 없음

### 해결법

> 비밀번호 : **공백**

## FIN

이렇게 나의 첫 워게임인 `Over The Wire`의 `Bandit`을 끝내게 되었다

초반에는 오히려 내가 리눅스에 관해 알고있는 것 없이 무작정 달려들었다 보니 글 쓰는 것이 매우 느려지고 왜인지 모르게 손이 잘 안가는 포스트 였다

하지만 bandit14번 까지 끝내고 나서 [[Shell Sciprt]로 구현한 로그 생성 및 로그에서 에러 잡기 스크립트](https://oil-lamp-cat.github.io/posts/log-read-shell-script/)라던가 [[shell script] 포트 스캐닝](https://oil-lamp-cat.github.io/posts/TCP-Port-scan-bash-script/)과 같은 여러 스크립트를 짜면서 리눅스에 관해 어느정도 이해를 하게 되었고 한참이 지난 지금에 와서야 6개월 만에 bandit34를 끝내게 되었다

정말 내가 해낼 수 있을까 하면서 계속 미루던 것을 끝내니 너무 속이 편해진다

이제는 다른 워게임이나 공부를 하기 전에 먼저 [Udemy](https://oil-lamp-cat.github.io/posts/Udemy-%ED%99%94%EC%9D%B4%ED%8A%B8-%ED%95%B4%ED%82%B9-101-%EC%9C%A4%EB%A6%AC%EC%A0%81-%ED%95%B4%ED%82%B9-%EA%B8%B0%EC%B4%88%EB%B6%80%ED%84%B0-%EB%B0%B0%EC%9A%B0%EA%B8%B0/)에서 신청한 강의를 들어야겠다

![bye](https://github.com/user-attachments/assets/f2c60fd6-0781-427d-b4a0-f08c53b3a8c9)

아 참 블로그를 작성하다가 생긴 요령인데

![image](https://github.com/user-attachments/assets/72cf65de-17fe-40cf-9936-98a96dc84798)

이런 사이트에서 문제를 캡쳐해 올 때 오른쪽 위의 `Donate`와 `Help`같은 찍었을 때 없앴으면 좋겠는 부분이 있으면

![image](https://github.com/user-attachments/assets/aab7ba2b-9605-4d3c-93cc-4c8f9821d96c)

F12로 관리자 모드에 들어가서 `Delete Elements`로 삭제해 버리면 된다

> 정말로 끝