---
title: "[pwn.college] 1-1. Linux Luminarium."
date: 2025-04-13 22:00:00 +09:00
categories: [Linux, pwn.college, hacking]
tags: [pwn.college]
pin: true
---

![pwn.college](https://github.com/user-attachments/assets/b192ec27-92e2-4817-ad39-049e247e2737)

## Linux Luminarium

![Image](https://github.com/user-attachments/assets/2f53c91c-bf6c-4b2f-8eb2-4ef6646cee52)

### 리눅스 루미나리움에 오신 것을 환영합니다!

이 도장은 여러분이 **리눅스 명령줄 인터페이스(CLI)** 를 사용하는 방법을 부드럽게 배울 수 있도록 구성되어 있으며, 그 과정에서 핵심적인 리눅스 개념들도 자연스럽게 습득할 수 있게 도와줍니다.

이런 종류의 리소스는 인터넷에 많이 있지만, 이 도장은 필요한 경우 다른 좋은 자료들로도 연결해드리려고 노력합니다.

저희는 리눅스에 대한 사전 지식이 전혀 없다고 가정하고 내용을 구성하지만, pwn.college 플랫폼 자체를 사용하는 방법은 이미 익혔다고 가정합니다.

> 💡 참고: 이 도장은 현재 진행 중인 프로젝트이며, 커뮤니티가 함께 만들어가고 있는 콘텐츠입니다!

기여에 관심이 있다면 GitHub로 오세요!

질문, 의견, 피드백 등이 있다면 Discord 채널에서 저희와 소통해 주세요.

>⚠️ 참고: 리눅스 루미나리움은 **매우 기초적인** 수준의 내용입니다.

이미 리눅스에 익숙하다면 이 도장을 건너뛰어도 괜찮습니다. (단, 강의 과제로 지정된 경우에는 꼭 수행하세요!)

> ⚠️ 참고: 이 도장은 일부러 어렵게 만들지 않았습니다!

다만, pwn.college 플랫폼 자체의 업데이트나 구조적 변화로 인해 일부 챌린지가 제대로 작동하지 않을 수도 있습니다.
이상하게 동작하는 챌린지가 있다면 꼭 Discord 채널에 알려 주세요!

---

![Image](https://github.com/user-attachments/assets/32bdf5d2-035d-4f96-920e-fdb7aa62f118)

이번에는 모듈의 수도 많을 뿐 아니라 그 안에 있는 풀어야 할 문제가 많기에 어쩌면 작성하다가 반반을 나눠서 작성하게 될 지도 모르겠다

84개라니...

## Hello Hackers

![Image](https://github.com/user-attachments/assets/522719d2-183d-43f2-8bd1-15af72632b0b)

이 모듈에서는 **명령줄(Command Line)을 다루는 매우 기초적인 내용**을 배웁니다!  
명령줄을 통해 명령어를 실행할 수 있으며, 터미널을 실행하면 명령줄 “셸(shell)”이 실행됩니다. 이 셸은 아래와 같은 형태로 보입니다:

```
hacker@dojo:~$
```

이것을 **프롬프트(prompt)** 라고 부르며, 여러분에게 명령어를 입력하라고 “프롬프트”하는 것입니다. 

아래는 각 부분의 의미입니다:

- `hacker`는 현재 사용자의 **이름(username)** 입니다. pwn.college의 도장 환경에서는 항상 "hacker"입니다.
- `dojo`는 이 셸이 실행 중인 컴퓨터의 **호스트 이름(hostname)** 입니다. 예를 들어, 여러 대의 서버를 다루는 시스템 관리자에게는 이 정보가 유용할 수 있습니다. 실제 pwn.college 환경에서는 이 호스트 이름이 여러분이 시도 중인 챌린지의 이름에서 파생되어 표시됩니다.
- `~`의 의미는 나중에 설명합니다 :-)
- 마지막에 있는 `$`는 `hacker` 사용자가 **관리자 권한이 없는 일반 사용자**임을 나타냅니다.  
  pwn.college의 훨씬 나중 모듈에서는 **익스플로잇을 이용해 관리자 권한을 얻는 법**을 배우게 되며, 그때는 프롬프트가 `$` 대신 `#`로 바뀌는 걸 볼 수 있을 것입니다.  
  그때가 되면 여러분은 도전을 “해킹”한 것이고, 승리한 것입니다!

자, 이제 프롬프트는 여러분의 명령어 입력을 기다리고 있습니다.  
다음 챌린지로 이동하여 **실제로 명령어를 실행하는 방법**을 배워보세요!

---

이번에도 전과 동일하게 강의가 있지만 이미 아는 내용이기에 패스

## Hello Hackers _ Challenge _

### Intro to Commands

![Image](https://github.com/user-attachments/assets/aff0daa9-6268-48b5-ad84-76a70462030e)

이 챌린지에서는 **여러분이 처음으로 명령어를 실행**하게 됩니다!  
명령어를 입력하고 Enter 키를 누르면, 해당 명령어가 아래처럼 실행됩니다:

```
hacker@dojo:~$ whoami
hacker
hacker@dojo:~$
```

위 예시에서는 사용자가 `whoami` 명령어를 실행했습니다.  
이 명령어는 **현재 로그인한 사용자의 이름**(여기서는 `hacker`)을 출력합니다.  
명령어가 종료되면 셸은 다시 프롬프트를 보여주며, 다음 명령어를 입력받을 준비를 합니다.

이 단계에서는 **`hello` 명령어를 실행해서 플래그를 얻으세요!**  
Linux에서는 **명령어가 대소문자를 구분**한다는 점을 꼭 기억하세요:  
`hello`는 `HELLO`와는 전혀 다른 명령어입니다.

---

#### 해결 과정

![Image](https://github.com/user-attachments/assets/be683c0e-ea7a-4acf-abfe-f579c0927167)

문제에 나온대로 `hello`를 터미널에 입력하면 끝

### Intro to Arguments

![Image](https://github.com/user-attachments/assets/4538d1de-5610-42a6-87c7-6a58ba979a3a)

이제 조금 더 복잡한 걸 해봅시다: **인자(arguments)** 가 포함된 명령어입니다.  
인자는 명령어에 전달되는 추가 데이터예요.  
당신이 터미널에 어떤 문장을 입력하고 Enter를 누르면, 셸은 입력을 해석하여 **첫 번째 단어는 '명령어'**, 그리고 **그 뒤의 단어들은 '인자'** 로 인식합니다.

예시를 볼게요:

```bash
hacker@dojo:~$ echo Hello
Hello
hacker@dojo:~$
```

여기서 `echo`가 명령어이고, `Hello`는 인자예요.  
`echo`는 받은 인자들을 그대로 터미널에 출력하는 단순한 명령어입니다.

인자가 여러 개인 경우도 마찬가지예요:

```bash
hacker@dojo:~$ echo Hello Hackers!
Hello Hackers!
hacker@dojo:~$
```

이 경우에는 `Hello`와 `Hackers!` 두 개가 `echo`의 인자입니다.

💡 **이번 챌린지에서는 `hello` 명령어를 실행해야 합니다** (주의: `echo` 아님!)  
그리고 **인자로 `hackers` 하나만 주면** 플래그를 얻을 수 있어요.

---

#### 해결 과정

![Image](https://github.com/user-attachments/assets/c4bf2b6a-8be8-4251-9137-3dabba60d9ee)

문제가 곧 해결 과정

문제가 간단하고 내가 C언어 인자 넣는 코드 짜는걸 까먹어 잠시 코드를 짜봤다

```c
#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[]) {
    if (argc != 2) {
        printf("Please run this command with the argument 'hackers'\n");
        return 1;
    }

    if (strcmp(argv[1], "hackers") == 0) {
        printf("Success! Here is your flag:\n");
        printf("pwn.college{kwTeCSn9NsRQ7EPtpST5zINmgo3.QX4YjM1wyM3MzNxEzW}\n");
    } else {
        printf("Please run this command with the argument 'hackers' (rather than '%s').\n", argv[1]);
    }

    return 0;
}
```

`hello`는 이런 느낌이지 않을까? 싶다

---

![Image](https://github.com/user-attachments/assets/e2fa1187-6253-48e5-84fc-62ce2201d154)

이렇게 **Hello Hackers**에 있는 2개의 챌린지가 끝났다

## Pondering Paths

![Image](https://github.com/user-attachments/assets/f4e70cc9-0d08-4137-9db8-3efd44a4bf30)

이 모듈은 **리눅스 파일 경로(Linux file paths)** 의 기본 개념을 가르쳐 줄 것입니다!

리눅스 파일 시스템은 `트리(tree)` 구조입니다. 즉, `루트(root)`가 있으며, 이는 `/`로 표기됩니다. 파일 시스템의 루트는 하나의 디렉토리이며, 각 디렉토리는 다른 디렉토리나 파일을 포함할 수 있습니다. 파일이나 디렉토리를 참조할 때는 **경로(path)** 를 사용합니다. 파일 시스템의 루트에서 시작하는 경로는 `/`로 시작하며, 파일을 찾기 위해 따라가야 할 디렉토리들의 집합을 나타냅니다. 경로의 각 부분은 `/` 기호로 구분됩니다.

이제 이 지식을 바탕으로 아래의 도전 과제들을 해결해 보세요!

---

### 강의 자료 중 - 기본 파일 시스템

| 경로            | 설명                                       |
|-----------------|--------------------------------------------|
| **`/`**         | 파일 시스템의 루트, "anchor"라고 불림.   |
| **`/usr`**      | 시스템 파일이 포함됨.                     |
| **`/usr/bin`**  | 설치된 프로그램의 실행 파일들.            |
| **`/usr/lib`**  | 프로그램에서 사용할 공유 라이브러리들.    |
| **`/usr/share`**| 프로그램 리소스(아이콘, 아트 자산 등).    |
| **`/etc`**      | 시스템 설정 파일들.                       |
| **`/var`**      | 로그, 캐시 등.                             |
| **`/home`**     | 사용자 소유의 데이터.                     |
| **`/home/hacker`** | pwn.college 인프라에서 해당 사용자의 데이터. |
| **`/proc`**     | 실행 중인 프로세스의 데이터.               |
| **`/tmp`**      | 임시 데이터 저장소.                       |

## Pondering Paths _ Challenge _

![Image](https://github.com/user-attachments/assets/3c91db96-e6a6-464b-8db2-f1f63df12835)

### The Root

![Image](https://github.com/user-attachments/assets/412ca4d1-40a3-4b79-8ed7-ee63854c98f9)

이 모듈에서는 파일 시스템의 기본을 배울 것입니다!

Linux 파일 시스템은 **"트리"** 형태입니다. 즉, 루트(보통 `/`로 표시됨)가 있고, 루트는 디렉터리입니다. 그 아래에는 다른 디렉터리나 파일들이 포함될 수 있습니다. 파일과 디렉터리는 경로(Path)를 통해 참조합니다. 루트 디렉터리에서 시작하는 경로는 `/`로 시작하며, 이를 통해 파일을 찾기 위해 들어가야 하는 디렉터리들을 설명합니다. 경로의 각 부분은 `/`로 구분됩니다.

이 지식을 바탕으로, 아래의 도전 과제들을 해결해 보세요!

**도전 과제**: 
이 레벨에서는 `/` 디렉터리에 `pwn`이라는 프로그램이 추가되어 있습니다. 이 프로그램을 실행하면 플래그가 제공됩니다. 이 레벨의 목표는 `pwn` 프로그램을 실행하는 것뿐입니다!

프로그램을 실행하려면 명령어에 경로를 제공해야 합니다. 이 경우, `/`부터 시작하는 정확한 경로를 제공해야 하므로 경로는 `/pwn`이 됩니다. 이처럼 루트 디렉터리에서 시작하는 경로를 **"절대 경로"** 라고 부릅니다.

이제 도전 과제를 시작하고, 터미널을 열어 `/pwn` 명령어로 프로그램을 실행하세요. 그럼 플래그를 잡을 수 있을 겁니다!

행운을 빕니다!

---

#### 해결 과정

![Image](https://github.com/user-attachments/assets/c539937b-e594-4b80-8fa2-f0dc1db22093)

사실 아마 기초 과정은 쭉 이런 식으로 플래그 찾기를 하기 보다는 개념을 공부한다는 느낌으로 문제가 나올 것이다