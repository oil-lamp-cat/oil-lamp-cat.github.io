---
title: "[pwn.college] 1-2. Linux Luminarium."
date: 2025-04-15 22:14:00 +09:00
categories: [Linux, pwn.college, hacking]
tags: [pwn.college]
pin: true
---

![pwn.college](https://github.com/user-attachments/assets/b192ec27-92e2-4817-ad39-049e247e2737)

## Linux - Luminarium

![Image](https://github.com/user-attachments/assets/46036a08-6b03-472a-a435-87c006f9994b)

> 이전 문제들
> 
[[pwn.college] 1-1. Linux Luminarium.](https://oil-lamp-cat.github.io/posts/pwn-college-1-1-Linux-Luminarium/)

## File Globbing

![Image](https://github.com/user-attachments/assets/40cbe337-b36a-4aa6-8d19-bbbc40ba5e37)

몇 단계만 진행해도 이렇게 긴 파일 경로들을 계속 타이핑하는 게 벌써 지겨워졌을 수도 있습니다. 다행히 셸에는 이를 해결할 수 있는 기능이 있습니다. 바로 **글로빙(Globbing)** 이라는 기능인데, 이번 모듈에서는 이걸 배울 거예요.

명령어를 실행하기 전에, 셸은 입력한 내용을 먼저 확장(expansion)하는 작업을 합니다. 그중 하나가 바로 **글로빙(globbing)** 입니다. 글로빙을 사용하면 모든 파일 이름이나 전체 경로를 하나하나 다 입력하지 않고도 파일들을 참조할 수 있게 됩니다. 자, 이제 자세히 알아볼까요?

## File Globbing _ Challenge _

![Image](https://github.com/user-attachments/assets/0ab95f7a-75f7-4d53-963e-d4b1b1714753)

### Matching with *

![Image](https://github.com/user-attachments/assets/bd679288-f5c5-4508-8861-2734eca4045c)

우리가 배울 첫 번째 글로브는 `*`이다. 인자에 `*` 문자가 있으면, 셸은 이를 **와일드카드**로 인식해서 그 패턴에 맞는 모든 파일로 바꿔준다. 설명보다 예시가 더 쉬우니 보자.

```
hacker@dojo:~$ touch file_a
hacker@dojo:~$ touch file_b
hacker@dojo:~$ touch file_c
hacker@dojo:~$ ls
file_a	file_b	file_c
hacker@dojo:~$ echo Look: file_*
Look: file_a file_b file_c
```

이 예시처럼, `*` 글로브는 여러 개의 파일과 일치할 수 있다. 하지만 하나만 일치할 수도 있다.

```
hacker@dojo:~$ touch file_a
hacker@dojo:~$ ls
file_a
hacker@dojo:~$ echo Look: file_*
Look: file_a
```

일치하는 파일이 하나도 없다면, 기본적으로 셸은 글로브를 **그대로 남겨둔다.**

```
hacker@dojo:~$ touch file_a
hacker@dojo:~$ ls
file_a
hacker@dojo:~$ echo Look: nope_*
Look: nope_*
```

`*`는 파일 이름의 어떤 부분과도 일치할 수 있지만, **슬래시(`/`)나 맨 앞에 오는 점(`.`)** 과는 일치하지 않는다. 예시를 보자.

```
hacker@dojo:~$ echo ONE: /ho*/*ck*
ONE: /home/hacker
hacker@dojo:~$ echo TWO: /*/hacker
TWO: /home/hacker
hacker@dojo:~$ echo THREE: ../*
THREE: ../hacker
```

이제 네가 직접 연습할 차례다!  
홈 디렉터리에서 시작해서, `cd` 명령어의 인자로 **최대 4글자만 사용해서** `/challenge` 디렉터리로 이동해야 한다. (글로빙을 사용해야 한다.)  
그 다음 `/challenge/run`을 실행하면 플래그를 받을 수 있다.

#### 해결 과정

최대 4글자만 사용하라고?

![Image](https://github.com/user-attachments/assets/4c3932ba-2eef-481d-a358-63913fa89546)

간단하다!

보아하니 챌린지에 오류가 생기지 않게 처음 터미널을 열게 되면 `/home/hacker`에 있는 디렉토리를 싹다 리셋시킨다

이렇게 되면 `/home/hacker`에 남아있는 디렉토리 중에 `ch`로 시작하는 것은 `challenge` 밖에 없으니 쉽게 말해서 `/ch*`는 `/ch`를 쓰고 **tab**을 누른 것과 같은 효과가 나는 것이다!

### Matching with ?

![Image](https://github.com/user-attachments/assets/94892029-e6b7-4aa0-8279-536739040b72)

다음으로, `?`에 대해 배워보자.  
셸이 인자에서 `?` 문자를 만나면, 이를 **한 글자 와일드카드**로 처리한다.  
이건 `*`처럼 동작하지만, **오직 한 글자만** 일치시킨다는 점이 다르다. 예시를 보자:

```
hacker@dojo:~$ touch file_a
hacker@dojo:~$ touch file_b
hacker@dojo:~$ touch file_cc
hacker@dojo:~$ ls
file_a	file_b	file_cc
hacker@dojo:~$ echo Look: file_?
Look: file_a file_b
hacker@dojo:~$ echo Look: file_??
Look: file_cc
```

이제 직접 연습해보자!  
홈 디렉터리에서 시작해서, `cd` 명령어를 사용할 때 **`c`와 `l` 대신 `?`를 사용해서** `/challenge` 디렉터리로 이동해야 한다.  
그 다음 `/challenge/run`을 실행하면 플래그를 얻을 수 있다.

#### 해결 과정

![Image](https://github.com/user-attachments/assets/4b80e3de-fc9b-4c09-aca0-299efe47cd37)

`c`와 `l`을 전부 `?`로 바꾸라 했으니 그리 해주면 된다

### Matching with []

![Image](https://github.com/user-attachments/assets/85986fb1-9dca-4406-850d-080f4dcfbb8e)

다음으로는 `[]` 대괄호에 대해 알아보자.  
대괄호는 일종의 제한된 형태의 `?` 와일드카드다.  
`?`가 어떤 문자든 하나를 매칭했다면, `[]`는 **대괄호 안에 명시한 문자 중 하나만** 매칭된다.

예를 들어 `[pwn]`은 문자 `p`, `w`, 또는 `n` 중 하나에만 매칭된다. 아래 예시를 보자:

```
hacker@dojo:~$ touch file_a
hacker@dojo:~$ touch file_b
hacker@dojo:~$ touch file_c
hacker@dojo:~$ ls
file_a	file_b	file_c
hacker@dojo:~$ echo Look: file_[ab]
Look: file_a file_b
```

이제 직접 해보자!  
`/challenge/files` 디렉터리 안에 여러 개의 파일을 만들어두었다.  
먼저 `/challenge/files`로 이동한 후, `file_b`, `file_a`, `file_s`, `file_h`를 **브래킷 와일드카드(대괄호)** 를 사용해 한 번에 가리키는 인자 하나를 주어 `/challenge/run`을 실행해 보자!

#### 해결 과정

![Image](https://github.com/user-attachments/assets/5bca0f45-580f-407d-8bd8-5ea434c95663)

와 나 이거 몰랐었네?

### Matching paths with []

![Image](https://github.com/user-attachments/assets/743c6fe3-0bc8-46ac-94f0-1d1b44798a2b)

글로빙은 경로 기반으로 이루어지므로, 글로빙된 인자들을 사용해 전체 경로를 확장할 수 있다. 예를 들어:

```
hacker@dojo:~$ touch file_a
hacker@dojo:~$ touch file_b
hacker@dojo:~$ touch file_c
hacker@dojo:~$ ls
file_a	file_b	file_c
hacker@dojo:~$ echo Look: /home/hacker/file_[ab]
Look: /home/hacker/file_a /home/hacker/file_b
```

이제 네 차례다. 이번에도 `/challenge/files` 디렉터리에 여러 개의 파일을 준비해두었다.  
홈 디렉터리에서 시작하여, **브래킷 글로빙**을 사용해 `file_b`, `file_a`, `file_s`, `file_h` 파일들의 **절대 경로**를 하나의 인자로 만들어 `/challenge/run`을 실행해 보자!

#### 해결 과정

![Image](https://github.com/user-attachments/assets/3e702db4-cba9-48c2-802e-37539fc6c998)

문제 is 답

### Mixing globs

![Image](https://github.com/user-attachments/assets/908d1bd0-5663-4580-9131-b55650e7d4de)

이제 이전 레벨들을 합쳐보자! 우리는 `/challenge/files`에 몇 가지 기쁘고, 하지만 다양하게 이름 지어진 파일들을 넣어두었다. 그곳으로 `cd`해서, 배운 글로빙을 사용하여 "challenging", "educational", "pwning" 파일들을 매칭할 수 있는 **짧은 (6자 이하)** 글로브를 하나 작성해 보자!

#### 해결 과정

![Image](https://github.com/user-attachments/assets/865ac22a-6ccc-4641-bd58-200b192a7ba4)

으악 이렇게 하면 될 줄 알았는데 하나의 인자로 전부 가져올 수있어야 한다

![Image](https://github.com/user-attachments/assets/096ece20-173f-4a96-9689-973ff8b2ed2d)

바로 이렇게!

### Exclusionary globbing

![Image](https://github.com/user-attachments/assets/9b415e4c-fff5-44eb-b47a-6f441366171c)

때때로, 글로브에서 특정 파일들을 **제외하고 싶을** 때가 있다! 다행히도 `[]`를 사용하면 이 작업을 할 수 있다. 만약 대괄호 안의 **첫 번째 문자**가 `!`이거나 (최신 bash 버전에서는) `^`인 경우, 그 글로브는 **반전**되어 괄호 안에 **없는 문자들과 일치**하게 된다. 예를 들어:

```bash
hacker@dojo:~$ touch file_a
hacker@dojo:~$ touch file_b
hacker@dojo:~$ touch file_c
hacker@dojo:~$ ls
file_a  file_b  file_c
hacker@dojo:~$ echo Look: file_[!ab]
Look: file_c
hacker@dojo:~$ echo Look: file_[^ab]
Look: file_c
hacker@dojo:~$ echo Look: file_[ab]
Look: file_a file_b
```

이제 이 지식을 활용해서 `/challenge/files`로 가서 `p`, `w`, `n`으로 **시작하지 않는 모든 파일들**을 대상으로 `/challenge/run`을 실행해 보자!

> 참고: `!` 문자는 `[]` 글로브의 **첫 문자**가 아닌 곳에서 사용될 경우 bash에서 **다른 특수한 의미**로 해석되기 때문에, 예상대로 동작하지 않을 수 있다. 반면 `^`는 이 문제가 없지만, **오래된 셸에서는 호환되지 않을 수 있음**을 주의하자.

#### 해결 과정

![Image](https://github.com/user-attachments/assets/9ae80eb4-4c32-4bd4-b998-d1377f487545)

찾지 않으려는 것은 `[!pwn]`으로 넣고 그 외의 나머지 것들이 필요하니까 `*`를 붙여주면 된다

### File Globbing 끝!

![Image](https://github.com/user-attachments/assets/0e0ae0ce-cfa9-44f3-aeec-f766650f5805)