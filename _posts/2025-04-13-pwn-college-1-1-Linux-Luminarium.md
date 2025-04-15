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

이번에는 모듈의 수도 많을 뿐 아니라 그 안에 있는 풀어야 할 문제가 많기에 어쩌면 작성하다가 몇번을 나눠서 작성하게 될 지도 모르겠다

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

### Program and absolute paths

![Image](https://github.com/user-attachments/assets/5b74942f-1639-4774-9aa7-705bb9a22af3)

조금 더 복잡한 경로를 살펴봅시다!

이전 레벨을 제외하면, **pwn.college**의 모든 도전 과제는 `/challenge` 디렉터리 안에 있습니다. 그리고 이 `/challenge` 디렉터리는 **루트 디렉터리(`/`)** 바로 아래에 위치해 있죠.

이번 레벨에서 실행해야 할 프로그램의 이름은 `run`이고, 이 파일은 `/challenge` 디렉터리 안에 존재합니다. 따라서, 이 프로그램의 **절대 경로(absolute path)** 는 다음과 같습니다:

```
/challenge/run
```

이 도전 과제의 목표는 이 `run` 프로그램을 **정확한 절대 경로**로 실행하는 것입니다. 즉, 터미널에 다음과 같이 입력하면 됩니다:

```
/challenge/run
```

성공적으로 실행하면 플래그를 획득할 수 있습니다.  
**행운을 빕니다!**

#### 해결 과정

![Image](https://github.com/user-attachments/assets/4f8229dd-28c7-4ae1-a733-50336fbd41e3)

### Position thy self

![Image](https://github.com/user-attachments/assets/b96f4523-277c-4180-b97c-88c50dd0a2fa)

리눅스 파일 시스템에는 아주 많은 디렉토리들과 파일들이 존재합니다.  
디렉토리 사이를 이동하려면 `cd`(change directory, 디렉토리 변경) 명령어를 사용하고, 인자로 경로(path)를 전달하면 됩니다. 예를 들어:

```bash
hacker@dojo:~$ cd /some/new/directory
hacker@dojo:/some/new/directory$
```

이렇게 하면 현재 프로세스(여기서는 bash 셸)의 **현재 작업 디렉토리(current working directory)** 가 바뀌게 됩니다.  
모든 프로세스는 자신이 현재 머무르고 있는 디렉토리를 가지고 있고,  
이 이유는 이 모듈의 뒷부분에서 점점 더 명확해질 거예요.

덧붙이자면, 이제 프롬프트에 보이던 `~` 기호가 무엇이었는지도 알 수 있을 거예요!  
이건 여러분의 셸이 현재 위치해 있는 경로를 나타내는 겁니다.

이 도전 과제에서는 `/challenge/run`이라는 프로그램을 **특정 디렉토리에서 실행**해야 합니다.  
(어느 경로에서 실행해야 하는지는 실행할 때 알려줍니다.)

그러니 먼저 `cd` 명령어로 해당 디렉토리로 이동한 후,  
그 상태에서 `/challenge/run` 프로그램을 다시 실행해야 합니다.

행운을 빌어요!


#### 해결 과정

![Image](https://github.com/user-attachments/assets/e26487f8-8c11-4bf8-9500-a901c209738c)

보아하니 `/usr/share/build-essential`의 위치로 가서 다시 실행하라고 한다

![Image](https://github.com/user-attachments/assets/91316b1d-2dd7-4fee-ac0a-c07d15a96e23)

성공

### Position elsewhere

![Image](https://github.com/user-attachments/assets/906c8d19-f446-4041-97af-4fdb44e4fa52)

리눅스 파일 시스템에는 아주 많은 디렉토리들과 그 안에 또 많은 파일들이 있습니다.  
디렉토리 사이를 이동하려면 `cd`(change directory) 명령어를 사용하고, 그 인자로 경로를 넘기면 됩니다. 예시는 다음과 같습니다:

```bash
hacker@dojo:~$ cd /some/new/directory
hacker@dojo:/some/new/directory$
```

이 명령어는 당신의 프로세스(이 경우에는 bash 셸)의 **현재 작업 디렉토리(current working directory)** 에 영향을 줍니다.  
각 프로세스는 자신이 현재 "머무르고 있는" 디렉토리를 가지고 있습니다.  
이 개념이 왜 중요한지는 이 모듈의 뒤에서 더 분명히 설명될 것입니다.

덧붙여서, 이제 프롬프트에 보였던 `~` 기호가 무엇인지 알 수 있게 되었네요!  
이 기호는 셸이 현재 위치하고 있는 경로를 나타냅니다.

이번 도전 과제에서는 `/challenge/run`이라는 프로그램을 **특정 경로에서** 실행해야 합니다.  
그 특정 경로는 프로그램이 직접 알려줄 것입니다.

당신은 먼저 `cd` 명령어로 그 디렉토리로 이동해야 하며,  
그 후에 `/challenge/run` 프로그램을 다시 실행해야 합니다.

행운을 빕니다!

#### 해결 과정

음..? 왜 위 문제랑 같은 것 같지?

![Image](https://github.com/user-attachments/assets/2399dd07-6e89-4ad4-83ac-0ecaa1e45551)

같은게 맞다

### Position yet elsewhere

![Image](https://github.com/user-attachments/assets/725cfb62-6f75-4354-b924-201bbaf46625)

리눅스 파일 시스템에는 수많은 디렉토리와 파일들이 존재합니다.  
`cd` (change directory) 명령어를 사용하고, 그 뒤에 경로를 인자로 넘겨줌으로써 디렉토리 사이를 이동할 수 있습니다. 예를 들면 다음과 같습니다:

```
hacker@dojo:~$ cd /some/new/directory  
hacker@dojo:/some/new/directory$
```

이 명령은 당신의 프로세스(이 경우에는 bash 셸)의 **"현재 작업 디렉토리(current working directory)"** 에 영향을 줍니다.  
모든 프로세스는 자신이 현재 위치하고 있는 디렉토리를 가지고 있습니다.  
왜 이것이 중요한지는 이 모듈의 뒷부분에서 더 분명해질 것입니다.

덧붙이자면, 이제 프롬프트에 표시되던 `~` 기호가 무엇을 의미하는지도 알 수 있게 되었겠죠!  
이 기호는 셸이 현재 위치한 경로를 나타냅니다.

이번 도전에서는 `/challenge/run` 프로그램을 **특정 경로에서** 실행해야 합니다 (그 경로는 프로그램이 알려줄 것입니다).  
먼저 그 디렉토리로 `cd` 명령어를 이용해 이동한 뒤, 프로그램을 다시 실행해야 합니다.

행운을 빌어요!

#### 해결 과정

또네?

반복되어 나온다는 것은 그만큼 중요하다는 뜻!

![Image](https://github.com/user-attachments/assets/74023d38-3b40-4cbd-98cd-7d5a26cd8035)


### implicit relative paths, from /

![Image](https://github.com/user-attachments/assets/0e4026b6-0c2c-42d8-a271-3007b9585bc0)

이제 여러분은 **절대 경로(absolute path)** 를 참조하는 방법과 디렉토리를 이동하는 방법에 익숙해졌을 것입니다.  
이전의 세 가지 문제를 통해 알게 되었듯이, 경로를 항상 절대 경로로 작성한다면, 현재 어떤 디렉토리에 위치해 있든 사실 상관이 없습니다.

하지만 **상대 경로(relative path)** 를 사용할 때는 **현재 작업 디렉토리(cwd, current working directory)** 가 매우 중요합니다.

> 상대 경로란 무엇인가요?

- 상대 경로는 **루트(/)** 로 시작하지 않는 경로입니다.
- 상대 경로는 **현재 작업 디렉토리 기준** 으로 해석됩니다.
- 현재 작업 디렉토리는 셸 프롬프트가 현재 위치한 경로입니다.
- 따라서 특정 파일을 어떻게 지정하느냐는 **당시 프롬프트가 어디에 위치해 있는지** 에 따라 달라집니다.

> 예시 : 만약 우리가 `/tmp/a/b/my_file` 파일에 접근하려고 한다면,

- 현재 디렉토리가 `/` 라면: 상대 경로는 `tmp/a/b/my_file`
- 현재 디렉토리가 `/tmp` 라면: 상대 경로는 `a/b/my_file`
- 현재 디렉토리가 `/tmp/a/b/c` 라면: 상대 경로는 `../my_file`  
  (여기서 `..` 는 **부모 디렉토리** 를 의미합니다)


이번 챌린지에서는, 현재 작업 디렉토리가 `/` 인 상태에서 **상대 경로를 이용해 `/challenge/run` 프로그램을 실행해야 합니다**.

힌트를 하나 드릴게요.  
당신이 사용할 상대 경로는 **c** 로 시작합니다

#### 해결 과정

![Image](https://github.com/user-attachments/assets/f49c202c-7346-4324-ae6b-8935d0c5628b)

이번에 문제를 풀기 위해 생각해볼 것은 바로 우리가 계속 실행하던 `/challenge/run`의 위치이다

문제 설명에 나와있듯 `run`은 `/`그러니까 루트 디렉토리안에 있는 `challenge`안에 들어있다는 의미이고 

이번 문제를 풀 때에는 상대 경로에서 찾아들어가 실행해야했던 문제이다

아니 난 우리가 사용할 상대 경로가 `c`로 시작한다길래 윈도우처럼 `C`드라이브를 만들은건가? 싶었네

### explicit relative paths, from /

![Image](https://github.com/user-attachments/assets/be13b7e2-7730-4f2e-9a16-0a9888d6bd92)

이전 단계에서는 상대 경로를 "직접적(naked)"으로 사용했다. 즉, 현재 디렉토리에서 하위 디렉토리로 곧장 이동하는 방식이었다. 이번 단계에서는 좀 더 **명시적인(explicit)** 상대 경로를 다뤄볼 것이다.

대부분의 운영체제, 그리고 리눅스에서도 마찬가지로, **모든 디렉토리에는 두 개의 특별한 항목**이 존재합니다:  
`.` (점 하나)와 `..` (점 두 개).

- `.` 는 **현재 디렉토리 자체**를 가리킵니다.
- `..` 는 **부모 디렉토리**, 즉 상위 디렉토리를 의미합니다.

예를 들어, 다음의 **절대 경로**들은 모두 동일한 의미를 가집니다:

```
/challenge
/challenge/.
/challenge/./././././././././
/./././challenge/././
```

마찬가지로, 아래의 **상대 경로**들도 전부 같은 의미이다:

```
challenge
./challenge
./././challenge
challenge/.
```

물론, 여러분의 현재 작업 디렉토리(cwd)가 `/`라면, 이 상대 경로들은 위의 절대 경로들과 같은 결과를 낳습니다.

이번 챌린지에서는, 상대 경로 안에 `.`을 적극적으로 활용해보게 될 것이다.  
자, 준비됐나요? 시작해봅시다!

#### 해결 과정

![Image](https://github.com/user-attachments/assets/3d001f01-f8ff-4f5c-a07a-0c75b0d18826)

일단 뭐가 되었든 상대경로를 이용하면 된다는 듯 하다

### implicit relative path

![Image](https://github.com/user-attachments/assets/235176fc-d3b5-429f-97dd-2010fd35969a)

이번 단계에서는 `.`을 사용하여 경로를 지정하는 연습을 좀 더 해보자. 이 챌린지에서는 `/challenge` 디렉토리에서 프로그램을 실행해야 한다. 여기서부터 조금 헷갈릴 수 있다.

리눅스는 "naked" 경로를 입력할 때 **현재 디렉토리에서 자동으로 파일을 찾지 않도록** 명시적으로 설정되어 있다. 다음을 보자:

```bash
hacker@dojo:~$ cd /challenge
hacker@dojo:/challenge$ run
```

이 명령은 `/challenge/run`을 실행하지 않는다.  
사실, 이는 보안 조치이다. 만약 리눅스가 "naked" 경로를 입력할 때마다 자동으로 현재 디렉토리에서 프로그램을 검색했다면, 현재 디렉토리에 시스템 명령어와 동일한 이름의 프로그램이 있다면 실수로 그 프로그램을 실행할 수 있기 때문이다.  
따라서 위 명령을 실행하면 다음과 같은 에러가 발생한다:

```bash
bash: run: command not found
```

이 개념의 작동 원리는 나중에 더 배우겠지만, 이번 챌린지에서는 **현재 디렉토리에서 프로그램을 명시적으로 실행하는 방법**을 배우게 된다.  
이를 위해서는 **`.`을 사용해서 현재 디렉토리에 있는 프로그램을 실행하려는 의도를 리눅스에 명시적으로 알려줘야 한다**. 

이렇게 해야 한다:

```bash
./run
```

이전 단계에서 배운 것처럼, `./`는 현재 디렉토리를 의미한다.  
이제 직접 실행해보자!

#### 해결 과정

![Image](https://github.com/user-attachments/assets/9335aa5b-3d19-46a3-aaff-ef20400ab5b2)

위를 문제에서 말했듯이 리눅스에서 파일을 실행할 때에 그냥 `run` 이렇게 실행하게 되면 이게 명령어의 `run`인지 파일 `run`인지 구별할 수 없기 때문에 파일을 실행할 때에는 `./run`으로 실행하게 보안조치가 되어있다

### home sweet home

![Image](https://github.com/user-attachments/assets/f38c84af-14a0-4adb-90c3-d57787b9d8c3)

모든 사용자에게는 홈 디렉토리가 있다. 이 홈 디렉토리는 보통 파일 시스템에서 `/home` 아래에 위치한다. 도전 과제에서, 당신은 `hacker`라는 사용자이고, 당신의 홈 디렉토리는 `/home/hacker`이다. 홈 디렉토리는 보통 사용자가 대부분의 개인 파일을 저장하는 곳이다. pwn.college를 진행하면서, 대부분의 해결책을 여기서 저장하게 될 것이다.

일반적으로, 셸 세션은 홈 디렉토리가 현재 작업 디렉토리로 설정되어 시작된다. 초기 프롬프트를 보자:

```bash
hacker@dojo:~$
```

이 프롬프트에서 `~`는 현재 작업 디렉토리를 의미하며, `~`는 `/home/hacker`의 약어이다. bash는 이 약어를 제공하고 사용한다. 왜냐하면, 대부분의 시간을 홈 디렉토리에서 보낼 것이기 때문이다. 따라서 bash는 경로의 일부로 `~`가 제공되면 이를 `/home/hacker`로 확장한다. 예를 들어:

```bash
hacker@dojo:~$ echo LOOK: ~
LOOK: /home/hacker
```

이제 `~`를 사용하여 경로를 탐색하는 예시를 보자:

```bash
hacker@dojo:~$ cd /
hacker@dojo:/$ cd ~
hacker@dojo:~$ cd ~/asdf
hacker@dojo:~/asdf$ cd ~/asdf
hacker@dojo:~/asdf$ cd ~
hacker@dojo:~$ cd /home/hacker/asdf
hacker@dojo:~/asdf$
```

여기서 중요한 점은 `~`의 확장은 절대 경로로 이루어진다는 것이다. 예를 들어, `~/~`는 `/home/hacker/~`로 확장된다. 이는 `/home/hacker/home/hacker`로 확장되는 것이 아님을 의미한다.

흥미로운 사실: `cd` 명령은 기본적으로 홈 디렉토리로 이동한다:

```bash
hacker@dojo:~$ cd /tmp
hacker@dojo:/tmp$ cd
hacker@dojo:~$
```

이제 당신 차례이다! 이번 챌린지에서는 `/challenge/run`이 명령줄에서 지정한 파일에 flag의 복사본을 작성할 것이다. 다만, 아래와 같은 제약 조건이 있다:

- 인자는 절대 경로여야 한다.
- 경로는 반드시 홈 디렉토리 내에 있어야 한다.
- 확장되기 전의 인자는 3자 이하여야 한다.

따라서 `/challenge/run`에 인자를 제공할 때는 이렇게 작성해야 한다:

```bash
hacker@dojo:~$ /challenge/run YOUR_PATH_HERE
```

#### 해결 과정

![Image](https://github.com/user-attachments/assets/265e306f-feda-432c-add6-05ca53ab1dac)

이번 문제를 풀 때 마지막 조건 때문에 조금 헤맸다

문제의 마지막을 보면 경로는 반드시 홈 디렉토리 내에 있어야 하고 우리가 지정한(인자로 넣은)파일에 플래그를 넣어준다고 하기에 바로 `mkdir`을 이용해 파일을 만들고 실행해보니

![Image](https://github.com/user-attachments/assets/8be2c0fc-d1df-4c2d-8c7f-a6452ec53ca4)

이렇게 뜨며 심지어 플래그가 생성되지도 않았다

파일을 만들고 실행하라는게 아니라 그냥 원하는 파일이 뭔지만 정해서 실행하라는 의미였던 것...

### 끝

![Image](https://github.com/user-attachments/assets/42a8e610-153d-4a10-bd72-fa89c198b593)

다음은 `Comprehending Commands` 이다

## Comprehending Commands

![Image](https://github.com/user-attachments/assets/2dce6a7d-1501-42bf-bbb6-e53f7c6622d2)

이 모듈에서는 앞으로의 여정에 큰 도움이 될 유용한 리눅스 명령어들을 소개한다. 이 목록은 결코 완전한 것이 아니며, 이 모듈은 계속 확장될 예정이다. 하지만 지금 시작하기에는 충분한 내용이다.

그럼, 서론은 이쯤에서 마치고 본격적으로 명령어들을 배워보자!

## Comprehending Commands _ Challenge _

![Image](https://github.com/user-attachments/assets/15c2f381-1133-4742-a2ce-42e0738fb505)

### cat: not the pet, but the command!

![Image](https://github.com/user-attachments/assets/e2f55e34-562f-474c-9ac4-9363791c354f)

리눅스에서 가장 중요한 명령어 중 하나는 `cat`이다. `cat`은 주로 파일의 내용을 출력할 때 사용된다. 사용 예시는 다음과 같다:

```bash
hacker@dojo:~$ cat /challenge/DESCRIPTION.md
One of the most critical Linux commands is `cat`.
`cat` is most often used for reading out files, like so:
```

`cat`은 여러 파일을 인자로 전달받으면 그것들을 이어붙여(concatenate) 출력한다. 이름이 `cat`인 이유도 여기서 비롯되었다.

예시:

```bash
hacker@dojo:~$ cat myfile
This is my file!
hacker@dojo:~$ cat yourfile
This is your file!
hacker@dojo:~$ cat myfile yourfile
This is my file!
This is your file!
hacker@dojo:~$ cat myfile yourfile myfile
This is my file!
This is your file!
This is my file!
```

또한, 인자를 아무것도 주지 않으면 `cat`은 터미널 입력을 읽어서 그대로 출력한다. 이 기능은 나중에 다른 도전 과제에서 더 다뤄볼 예정이다.

이번 도전에서는 플래그가 사용자의 홈 디렉터리(쉘이 시작되는 위치)에 있는 `flag`라는 파일로 복사되어 있다. `cat` 명령어로 그 파일을 읽어보면 된다!

#### 해결 과정

![Image](https://github.com/user-attachments/assets/c7b3207f-63f1-4ba1-be5d-04c7598fc531)

문제 = 답

### catting absolute paths

![Image](https://github.com/user-attachments/assets/95896cbe-ee0f-4fac-bb17-4a1bdb9c8449)

이전 단계에서는 `cat flag` 명령어를 사용해서 홈 디렉터리에 있는 플래그 파일을 읽었을 것이다! 물론 `cat` 명령어의 인자를 절대 경로로 지정하는 것도 가능하다:

```bash
hacker@dojo:~$ cat /challenge/DESCRIPTION.md
```

이번 도전에서는 플래그를 홈 디렉터리에 복사하지는 않지만, 읽을 수 있도록 설정해두었다. 절대 경로 `/flag`를 사용해 `cat`으로 읽으면 된다:

```bash
cat /flag
```

**재밌는 사실:** `/flag`는 pwn.college에서 플래그가 항상 존재하는 위치다. 하지만 이번 도전과는 달리, 대부분의 경우 이 파일에 직접 접근할 수는 없다.

#### 해결 과정

이건 사진도 필요 없을 듯 하다...

```
cat /flag
```

끝이다

### more catting practice

![Image](https://github.com/user-attachments/assets/cf4218e9-5f9b-4ffb-894d-12ceef31f382)

명령어에 인자로 다양한 경로를 지정할 수 있는데, 이번 단계에서는 `cat` 명령어로 그 연습을 더 해보게 된다. 이번에는 플래그 파일을 아주 복잡한 디렉터리에 넣어둘 것이고, `cd` 명령어로 디렉터리를 이동하는 것도 허용되지 않는다.  
그러니까 `cat flag` 같은 단순한 접근은 사용할 수 없다.
`cd` 없이, 플래그 파일이 있는 **절대 경로**를 사용해서 직접 `cat`으로 플래그를 읽어야 한다.

#### 해결 과정

![Image](https://github.com/user-attachments/assets/9fef68ba-8000-4b34-af6f-6a3ae84caab6)

터미널을 키게 되면 어디에 있는지 다 알려준다

### grepping for a needle in a haystack

![Image](https://github.com/user-attachments/assets/74cf646a-54a1-49ff-888a-b152ab65e25c)

가끔 `cat` 명령어로 출력하려는 파일이 너무 클 때가 있다. 다행히도, 우리가 필요한 내용을 빠르게 검색할 수 있도록 도와주는 `grep` 명령어가 있다! 이번 챌린지에서는 그 사용법을 배워본다.

`grep`에는 다양한 사용 방법이 있지만, 여기서는 그중 한 가지를 배워볼 것이다:

```bash
hacker@dojo:~$ grep 검색할_문자열 /파일/경로
```

위처럼 실행하면, `grep`은 해당 파일에서 **검색할 문자열이 포함된 줄**을 찾아 콘솔에 출력해준다.

이번 챌린지에서는 `/challenge/data.txt` 파일에 **10만 줄의 텍스트**가 담겨 있다. 이 파일 안에서 flag를 찾아야 한다!

**힌트**: flag는 항상 `pwn.college`로 시작한다.

#### 해결 과정

![Image](https://github.com/user-attachments/assets/f6afd8a0-8e4c-44fb-b41c-1c01f9d8e8cb)

역시 파일을 읽어보니 매우 긴 줄의 문장이 존재하는 것을 알 수 있다

![Image](https://github.com/user-attachments/assets/ee885b9e-37ec-4c77-83ca-d997296c84c1)

`grep` 명령어를 이용해서 원하는 부분만 추출하자

### listing files

![Image](https://github.com/user-attachments/assets/5f566a74-bcc1-4d00-8ae5-f4678c2b73ea)

지금까지는 어떤 파일을 다뤄야 하는지 알려줬지만, 디렉터리 안에는 많은 파일과 다른 디렉터리들이 있을 수 있다. 우리는 항상 그 이름을 알려주지 않으므로, 디렉터리의 내용을 확인하는 방법을 배워야 한다.

`ls` 명령어를 사용하면 주어진 디렉터리의 파일 목록을 출력할 수 있다. 인자가 없으면 현재 디렉터리의 내용을 출력하고, 경로를 제공하면 그 경로의 내용을 보여준다.

예시:
```
hacker@dojo:~$ ls /challenge
run
hacker@dojo:~$ ls
Desktop    Downloads  Pictures  Templates
Documents  Music      Public    Videos
hacker@dojo:~$ ls /home/hacker
Desktop    Downloads  Pictures  Templates
Documents  Music      Public    Videos
hacker@dojo:~$
```

이번 챌린지에서는 `/challenge/run` 파일의 이름을 임의로 변경했으므로, `ls /challenge` 명령어로 파일 목록을 확인하여 해당 파일을 찾아야 한다.

#### 해결 과정

![Image](https://github.com/user-attachments/assets/004b5b5c-bd44-4c9d-ab69-aa2aed7ce051)

여기서 `5691-renamed-run-15440`을 다 치고 있기 당연히 힘들다

고로 우리는 `56`만 쓴 뒤에 `Tab`키를 누르면 바로 자동완성 시킬 수 있다

타자 연습을 하겠다면야? 말리지는 않겠다만 굳이?

### touching files

![Image](https://github.com/user-attachments/assets/fc8f81b6-ed44-4bbd-9510-8744aa325375)

물론, 파일을 생성할 수도 있다! 파일을 생성하는 방법은 여러 가지가 있지만, 여기서는 간단한 명령어를 살펴보자. `touch` 명령어를 사용하면 새로 빈 파일을 생성할 수 있다:

```
hacker@dojo:~$ cd /tmp
hacker@dojo:/tmp$ ls
hacker@dojo:/tmp$ touch pwnfile
hacker@dojo:/tmp$ ls
pwnfile
hacker@dojo:/tmp$
```

이렇게 간단하다! 이번 챌린지에서는 `/tmp/pwn`과 `/tmp/college`라는 두 개의 파일을 만들고, `/challenge/run`을 실행하여 플래그를 얻어야 한다.

#### 해결 과정

![Image](https://github.com/user-attachments/assets/21441d66-6f5a-4e9e-9ab1-3b90ee4e6413)

문제에 나와있기는 하지만 파일을 만들지 않고 `/challenge/run`을 실행하면 뭐라 할지 궁금하여 실행시켜봤다

### removing files

![Image](https://github.com/user-attachments/assets/b8344d5b-a9ed-46f0-a1ee-ea78c04c02fe)

파일은 주변에 많이 있다. 사탕 포장지처럼 결국 너무 많아질 것이다. 이 레벨에서는 파일을 정리하는 방법을 배운다!

Linux에서는 `rm` 명령어를 사용하여 파일을 삭제할 수 있다:

```
hacker@dojo:~$ touch PWN
hacker@dojo:~$ touch COLLEGE
hacker@dojo:~$ ls
COLLEGE     PWN
hacker@dojo:~$ rm PWN
hacker@dojo:~$ ls
COLLEGE
hacker@dojo:~$
```

이제 연습을 해보자. 이번 챌린지에서는 `delete_me`라는 파일이 홈 디렉토리에 생성될 것이다! 이 파일을 삭제하고, `/challenge/check`를 실행해 파일이 삭제되었는지 확인한 후 플래그를 받자!

#### 해결 과정

![Image](https://github.com/user-attachments/assets/64659e88-cc9f-49db-b92d-3feba5843c8b)

문제에서 `delete_me`라는 파일을 삭제하라 하였으니 그대로 하면 끝!

### hidden files

![Image](https://github.com/user-attachments/assets/a6c8ae2b-56a0-4455-a7b8-6369de66730d)

흥미롭게도, `ls` 명령어는 기본적으로 모든 파일을 나열하지 않는다. Linux에는 `.`으로 시작하는 파일은 기본적으로 `ls`와 몇 가지 다른 상황에서 표시되지 않는 관례가 있다. 이러한 파일을 보려면 `-a` 플래그와 함께 `ls`를 실행해야 한다:

```
hacker@dojo:~$ touch pwn
hacker@dojo:~$ touch .college
hacker@dojo:~$ ls
pwn
hacker@dojo:~$ ls -a
.college	pwn
hacker@dojo:~$
```

이제 네 차례다! `/`에서 `.`으로 시작하는 숨겨진 파일로 플래그를 찾아보자!

#### 해결 과정

![Image](https://github.com/user-attachments/assets/c0cfe0a1-390a-4b53-b23b-900130ee69ad)

이건 내가 실수했던 건데 나는 바로 그냥 처음 터미널을 열고 `ls -a`를 입력했는데 문제를 다시 읽어보니 `/`에 가서 찾는거였다

어쩐지 없더라

### An Epic Filesystem Quest

![Image](https://github.com/user-attachments/assets/6833e7a1-8703-40ff-bf1e-5add13199f4a)

이제 `cd`, `ls`, 그리고 `cat`에 대한 지식을 바탕으로 작은 게임을 시작할 준비가 되었다! 

먼저, `/` 디렉토리로 시작할 것이다. 보통은 이렇게 한다:

```
hacker@dojo:~$ cd /
hacker@dojo:/$ ls
bin   challenge  etc   home  lib32  libx32  mnt  proc  run   srv  tmp  var
boot  dev        flag  lib   lib64  media   opt  root  sbin  sys  usr
```

이제 많은 내용들이 보인다! 언젠가는 이 파일들과 디렉토리에 익숙해지겠지만, 이미 `flag` 파일과 `challenge` 디렉토리를 인식할 수 있을지도 모른다.

이 도전에서는 내가 플래그를 숨겼다! 이제 `ls`와 `cat`을 사용하여 내게 주어진 단서를 따라가며 찾을 것이다. 방법은 다음과 같다:

0. 첫 번째 단서는 `/` 디렉토리에 있다. 거기로 가자.
1. `ls`로 주변을 살펴본다. 거기에는 `HINT`나 `CLUE`와 비슷한 파일이 있을 것이다!
2. 그 파일을 `cat` 명령어로 읽어 단서를 확인한다.
3. 단서에 따라 다음 디렉토리로 가거나, 그대로 있을 수도 있다!
4. 단서를 따라가면 플래그를 찾을 수 있다!

행운이 있기를!

#### 해결 과정

![Image](https://github.com/user-attachments/assets/dea3f71a-e735-4b76-b7db-5cdfa9075bec)

문제를 죽 따라오다보면 `함정에 빠졌어! cd 명령어를 쓰지 않고 다음 단서를 찾아야해, 안그러면 단서는 자폭할거야!` 라며 협박을 한다

![Image](https://github.com/user-attachments/assets/40b8b3e2-486e-4948-8440-5e0112d57029)

그리고 찾아가보면... `Permission denied`가 반겨준다

잘못왔나?

어쩐지 tab이 안되더라니

![Image](https://github.com/user-attachments/assets/76e1fff8-261c-4586-84cd-cbb8575e223c)

음.. 뭐지? hacker가 만든거 맞는데

![Image](https://github.com/user-attachments/assets/36402af6-a48e-4df7-a960-db61360f6611)

아 맞다 읽는 것만 가능하군...

그럼 이제 단서를 따라 다음으로 가보자

아니 근데 이놈도 자폭한다네?

![Image](https://github.com/user-attachments/assets/9b7fc806-e0d7-4281-b0e9-20caefe92705)

이렇게 봤을 때 `AUTHORS`와 `CUE-TRAPPED` 처럼 뭔가 둘다 단서인가? 싶을 때는 (물론 지금 trap에 빠졌다고 하니까 CUE-TRAPPED가 맞겠지만), `-al` 명령어를 이용해서 권한을 확인해 보면 된다

`practice`모드일 때에는 root 권한으로 들어오게 되지만 `start`를 눌러 실행시키면 `hacker`로 로그인하게 된다

![Image](https://github.com/user-attachments/assets/9c4894f8-1b84-4047-8799-27915c7ad981)

습.. 이거 왜 `bandit`에서 했던 압축 파일 풀기 느낌이 나지

![Image](https://github.com/user-attachments/assets/84b0412e-8926-46d3-8f29-195712291e4b)

오 드디어!

어렵지는 않는다만 좀 귀찮은 문제였다

### making directories

![Image](https://github.com/user-attachments/assets/f2ab0d78-489c-42e5-920b-498a06aab479)

우리는 파일을 만들 수 있다. 그럼 디렉토리는 어떨까? 디렉토리는 `mkdir` 명령어로 만들 수 있다. 그런 다음 그 안에 파일을 넣을 수 있다!

예시:
```bash
hacker@dojo:~$ cd /tmp
hacker@dojo:/tmp$ mkdir my_directory
hacker@dojo:/tmp$ cd my_directory
hacker@dojo:/tmp/my_directory$ touch my_file
```

이제 과제를 수행하자:

1. `/tmp/pwn` 디렉토리를 만든다:
2. 그 안에 `college`라는 파일을 만든다:
3. `/challenge/run` 명령어를 실행한다:

그러면 정답이 확인되고 flag가 출력될 것이다!

#### 해결 과정

![Image](https://github.com/user-attachments/assets/d40d02a1-0774-401f-ae56-aeaedace3a69)

쉽죵?

### finding files

![Image](https://github.com/user-attachments/assets/4dcc66be-36fa-437b-afa5-4886ffd1c3de)

이제 우리는 파일을 나열하고, 읽고, 생성하는 방법을 배웠습니다. 하지만 파일을 어떻게 찾을까요? 우리는 `find` 명령어를 사용합니다!

`find` 명령어는 선택적으로 검색 기준과 검색 위치를 인자로 받습니다. 검색 기준을 지정하지 않으면 `find`는 모든 파일을 검색하며, 검색 위치를 지정하지 않으면 현재 작업 중인 디렉토리(`.`)에서 검색합니다. 예를 들어:

```
hacker@dojo:~$ mkdir my_directory
hacker@dojo:~$ mkdir my_directory/my_subdirectory
hacker@dojo:~$ touch my_directory/my_file
hacker@dojo:~$ touch my_directory/my_subdirectory/my_subfile
hacker@dojo:~$ find
.
./my_directory
./my_directory/my_subdirectory
./my_directory/my_subdirectory/my_subfile
./my_directory/my_file
```

그리고 검색 위치를 지정하면:

```
hacker@dojo:~$ find my_directory/my_subdirectory
my_directory/my_subdirectory
my_directory/my_subdirectory/my_subfile
```

물론, 우리는 검색 기준도 지정할 수 있습니다! 아래는 이름으로 필터링한 예시입니다:

```
hacker@dojo:~$ find -name my_subfile
./my_directory/my_subdirectory/my_subfile
hacker@dojo:~$ find -name my_subdirectory
./my_directory/my_subdirectory
```

파일 시스템 전체를 검색할 수도 있습니다!

```
hacker@dojo:~$ find / -name hacker
/home/hacker
```

이제 당신 차례입니다. 저는 파일 시스템 어딘가에 flag 파일을 숨겨두었습니다. 여전히 이름은 `flag`입니다. 이제 그것을 찾아보세요!

몇 가지 참고사항입니다:
1. 파일 시스템에는 이름이 `flag`인 다른 파일들도 있을 수 있습니다. 처음 찾은 것이 실제 flag가 아닐 수도 있으니 당황하지 마세요.
2. 일반 사용자로 접근할 수 없는 디렉토리들이 있습니다. 이런 디렉토리들은 `find` 명령어가 에러를 발생시킬 수 있지만 무시해도 괜찮습니다. 우리는 그런 곳에 flag를 숨겨놓지 않았습니다.
3. `find`는 시간이 오래 걸릴 수 있습니다. 조금만 인내심을 가지세요!

#### 해결 과정

![Image](https://github.com/user-attachments/assets/000c5910-6cf0-4f26-9f92-69cf063471eb)

일단 가장 기본 `/home/hacker`에는 없다

![Image](https://github.com/user-attachments/assets/720cf51a-0353-4750-983a-9d877eb97b5d)

이번에는 그냥 `/`에서 검색을 시작하였고 매~우 많은 파일을 뒤져보고 있다

![Image](https://github.com/user-attachments/assets/4a99048b-3945-4e07-ae3f-54554250376a)

그리고 결과는? 없단다...

아니 문제에서 flag라면서요? 뭐에요?

아.. 명령어를 잘못썼다

이름으로 찾을거면 `-name`을 써야하는데 그냥 `find flag`를 했으니..

![Image](https://github.com/user-attachments/assets/add2e912-c3eb-4854-a925-c13d97d55823)

제대로 검색을 시작하자 많은 `permission denied`가 반겨주는데 솔직히 이거 보고싶지 않으니 없애는 명령어를 추가하자

```sh
find / -name flag 2>/dev/null
```

![Image](https://github.com/user-attachments/assets/9166b26e-a91b-4b3a-8439-a519282f4343)

자 이렇게 해서 몇가지 후보가 나왔다

하지만 여기서도 이게 파일인지 아니면 디렉토리인지 알 길이 없다..

사실 직접 하나하나 읽어보면 알 수는 있다 (내가 그랬었다)

하지만 너무 오래걸리잖는가?

그리하여 

```sh
find / -name flag -type f 2>/dev/null
```

위 코드에서 추가된 부분을 보자면 바로 `-type f`일 것이다

이것이 의미하는 바는 `f` 즉 파일만 찾겠다는 거다

그렇다면 디렉토리만 찾을 때는? `d`다

![Image](https://github.com/user-attachments/assets/32f0d2e6-268f-4e17-9b77-e110d2702409)

좋았으

### linking files

![Image](https://github.com/user-attachments/assets/3474af0c-3b40-419c-90a7-06588edcc5ed)

Linux(또는 컴퓨터)를 일정 기간 사용하다 보면 다음과 같은 상황을 마주하게 될 수 있습니다: 두 프로그램이 동일한 데이터를 액세스하려고 하는데, 각 프로그램은 데이터를 서로 다른 위치에서 찾고자 합니다. 다행히도, Linux는 이 문제를 해결할 방법을 제공합니다: 바로 링크입니다.

링크에는 두 가지 종류가 있습니다: 하드 링크와 소프트(또는 심볼릭) 링크입니다. 두 가지를 비교하는 비유를 들어 설명하겠습니다:

- 하드 링크는 여러 주소가 동일한 장소를 가리키는 것과 같습니다 (예: Apt 2와 Unit 2가 같은 아파트를 가리키는 경우).
- 소프트 링크는 이사한 후, 우편 서비스가 자동으로 당신의 우편물을 새로운 집으로 전달하는 것과 같습니다.

파일 시스템에서 파일은 그 파일의 내용이 저장된 주소로 개념화될 수 있습니다. 하드 링크는 그 데이터를 참조하는 또 다른 주소입니다. 하드 링크에 대한 접근과 원본 파일에 대한 접근은 완전히 동일하며, 즉시 필요한 데이터를 반환합니다. 반면, 소프트/심볼릭 링크는 원본 파일의 이름을 포함합니다. 심볼릭 링크에 접근하면 Linux는 이것이 심볼릭 링크임을 인식하고 원본 파일 이름을 읽은 후 해당 파일에 자동으로 접근합니다. 대부분의 경우, 두 상황 모두 원본 데이터를 액세스하지만, 그 메커니즘은 다릅니다.

하드 링크는 대부분의 사람들에게 더 간단하게 느껴집니다(예를 들어, 저는 하드 링크를 한 문장으로 설명했지만, 심볼릭 링크는 두 문장으로 설명했습니다). 하지만 하드 링크에는 여러 가지 단점과 구현상의 문제들이 있어, 소프트/심볼릭 링크가 훨씬 더 많이 사용됩니다.

이번 챌린지에서는 심볼릭 링크(또는 심볼릭 링크라고도 불리는 symlink)에 대해 배울 것입니다. 심볼릭 링크는 `ln` 명령어와 `-s` 옵션을 사용하여 만들 수 있습니다. 예를 들어:

```sh
hacker@dojo:~$ cat /tmp/myfile
This is my file!
hacker@dojo:~$ ln -s /tmp/myfile /home/hacker/ourfile
hacker@dojo:~$ cat ~/ourfile
This is my file!
hacker@dojo:~$
```

심볼릭 링크에 접근하면 원본 파일의 내용이 표시되는 것을 볼 수 있습니다! 또한 `ln -s` 사용법을 확인할 수 있습니다. 명령어에서 원본 파일 경로가 링크 경로보다 먼저 나옵니다.

심볼릭 링크는 몇 가지 방법으로 확인할 수 있습니다. 예를 들어, `file` 명령어를 사용하면 파일의 종류를 확인할 수 있습니다. 이 명령어는 심볼릭 링크도 인식합니다:

```sh
hacker@dojo:~$ file /tmp/myfile
/tmp/myfile: ASCII text
hacker@dojo:~$ file ~/ourfile
/home/hacker/ourfile: symbolic link to /tmp/myfile
hacker@dojo:~$
```

이제 여러분이 시도할 차례입니다! 이번 레벨에서는 플래그가 항상 `/flag`에 있지만, `/challenge/catflag`는 대신 `/home/hacker/not-the-flag`를 읽습니다. 심볼릭 링크를 사용하여 이를 속이고 플래그를 얻어보세요!

#### 해결 과정

습.. 갑자기 뭔가 문제가 많이 길어졌는데..

게다가 다른 강의에서는 본 적도 없는 `ln` 명령어를 사용한다

사실 이번 것도 강의에 있는 `Symbolic Links`를 봤다면 풀 수 있을 것이다

![Image](https://github.com/user-attachments/assets/71d7555c-3fda-40a2-988c-d353dc6f884a)

일단 바로 `/challenge/catflag`를 실행시켜보면 `cat왈` 파일이 없다고 한다

그렇다면 우리가 해야할 작업은 이렇게 될거다

1. `/home/hacker/not-the-flag`를 만든다
2. `/home/hacker/not-the-flag`랑 `/flag`를 링크시킨다
3. `/challenge/catflag`가 `/home/hacker/not-the-flag`를 읽고 `/flag`를 읽게된다!

![Image](https://github.com/user-attachments/assets/a0ad976b-a576-4065-bbb4-12864406024f)

솔직히 아무리 이름을 바꾸려 하던 뭐 파일을 삭제하려 하던 다 `/home/hacker/not-the-flag`가 없다고 해서 당최 뭘까 하며 `ls`로 파일을 읽어봤다가 해결 방법을 깨달았다

![Image](https://github.com/user-attachments/assets/9edf438c-dec1-4077-941b-e0cc1879ae21)

아 디렉토리로 만들었네

![Image](https://github.com/user-attachments/assets/1292cd8a-3730-4343-a933-55eb832ea239)

아니 그것도 아니였다

파일이나 디렉토리를 만든느 것이 아니라 링크를 만들 때 자동으로 링크 파일이 만들어지는 거였다

끼약 강의 좀 잘 볼걸

![Image](https://github.com/user-attachments/assets/c161cdea-f942-49a0-8d43-1910143d72bf)

이렇게 플래그를 찾을 수 있었다

### linking files 끝!

![Image](https://github.com/user-attachments/assets/52857bcc-5998-4ba2-b298-8c3d9422ec1d)

다음은 `Digesting Documentation`이다!

## Digesting Documentation

![Image](https://github.com/user-attachments/assets/06de45e0-5cb0-476a-a7c4-a9cfdf505047)

이 모듈은 리눅스에서 가장 중요한 기술 중 하나인 프로그램 사용법을 찾는 방법을 가르쳐 줄 거예요. 이 기술은 앞으로 당신의 여정에 큰 도움이 될 거예요. 아래에서 시작해 봅시다!

## Digesting Documentation _ Challenge _

![Image](https://github.com/user-attachments/assets/36a21025-1f63-4c6c-81b3-7abaaa275d75)

### Learning From Documentation

![Image](https://github.com/user-attachments/assets/ecbcbf8d-7b95-4153-a82a-4d54bea1f6e6)

당신이 문서를 필요로 하는 일반적인 이유는, 이 많은 프로그램들을 **어떻게 사용하는지 알아내는 것**이고, 그중에서도 특히 **명령줄에 어떤 인자(argument)를 입력해야 하는지 알아내는 것**입니다. 이 모듈은 주로 그 개념을 다룰 것이며, 이는 전반적으로 프로그램을 어떻게 사용하는지 이해하는 데에 도움이 되는 방식이에요. 이 모듈의 나머지 부분에서는 다양한 방법으로 프로그램 사용법에 대한 도움말을 환경에 요청하는 방법을 배우게 될 것이지만, 먼저 **문서를 읽는 개념**부터 살펴봅시다.

프로그램을 올바르게 사용하는 방법은 **적절한 인자를 지정하는 것**에 크게 달려 있습니다. Basic Commands 모듈의 숨김 파일 문제에서 사용한 `ls -a` 명령어를 기억해보세요. 여기서 `-a`는 `ls`에게 숨겨진 파일도 함께 보여주라고 지시하는 인자였습니다. 우리가 숨겨진 파일을 보려고 했기 때문에 `ls`에 `-a` 인자를 준 것은 우리의 상황에서 올바른 사용법이었습니다.

이번 챌린지에서 사용할 프로그램은 `/challenge/challenge`이고, 플래그를 얻기 위해서는 **올바르게 실행해야 합니다**. 마치 이 프로그램에 대한 문서가 다음과 같다고 가정해 봅시다:

---

**/challenge/challenge에 대한 문서에 오신 것을 환영합니다! 이 프로그램을 제대로 실행하려면 `--giveflag` 인자를 전달해야 합니다. 행운을 빕니다!**

---

이 내용을 바탕으로, 가서 플래그를 얻으세요!

#### 해결 과정

![Image](https://github.com/user-attachments/assets/00b881cd-24ae-43af-af0e-3f27d9805543)

문제에 답이 있다

### Learning Complex Usage

![Image](https://github.com/user-attachments/assets/23bcf3c2-45c4-435a-ad7e-82940f83ac33)

대부분의 명령어는 사용하는 것이 비교적 간단하지만, 일부 명령어는 사용법이 꽤 복잡해질 수 있습니다. 예를 들어 `sed`와 `awk` 같은 명령어는—지금 당장은 다루지 않을 거지만—**인자로 주어지는 값 자체가 마치 난해한 프로그래밍 언어로 된 하나의 프로그램**인 경우도 있습니다! `cd`와 `awk` 사이 어딘가쯤에는, **자신의 인자에게 또 다른 인자를 요구하는 명령어들**이 있습니다...

이게 이상하게 들릴 수도 있지만, 사실 여러분은 이미 Basic Commands 모듈의 `find` 레벨에서 이걸 경험했습니다. `find`는 `-name`이라는 인자를 갖고 있는데, 이 `-name`이라는 인자 **자체가 또 다른 인자**, 즉 **검색할 파일 이름**을 필요로 하죠. 이와 비슷한 구조를 가진 명령어들이 많습니다.

다음은 이 레벨에서 사용할 `/challenge/challenge` 프로그램의 설명입니다:

---

**/challenge/challenge에 대한 문서에 오신 것을 환영합니다! 이 프로그램은 `--printfile` 인자를 주면 원하는 파일을 터미널에 출력할 수 있습니다. 그리고 `--printfile`이라는 인자에는 출력하고 싶은 파일의 경로를 인자로 넘겨주어야 합니다. 예를 들어, 다음과 같이 실행하면 레벨 설명 파일이 출력됩니다:**

```
/challenge/challenge --printfile /challenge/DESCRIPTION.md
```

---

이 문서를 참고해서, 플래그를 얻어보세요!

#### 해결 과정

![Image](https://github.com/user-attachments/assets/6143231e-a9ab-423d-9703-6c07d499d01b)

문제에 나온 그대로 써보면 위와 같은 문서가 나타난다

이제 여기서 플래그를 얻으려면 `/flag`를 읽으면 되겠지?

![Image](https://github.com/user-attachments/assets/8424925c-7e88-4629-bf94-770b73872e82)

정답이다, 다음 문제로!

### Reading Manuals

![Image](https://github.com/user-attachments/assets/1ff20c7f-19d6-4619-bb6f-83f23f6a76eb)

이 단계에서는 `man` 명령어를 소개합니다. `man`은 manual(매뉴얼)의 줄임말이며, 인자로 전달한 명령어의 매뉴얼(가능한 경우)을 표시합니다. 예를 들어, `yes` 명령어에 대해 알고 싶다고 가정해봅시다 (`yes`는 실제로 존재하는 명령어입니다):

```
hacker@dojo:~$ man yes
```

이 명령은 `yes`의 매뉴얼 페이지를 출력하며, 대략 다음과 같은 내용이 표시됩니다:

```
YES(1)                           User Commands                          YES(1)

NAME
       yes - 문자열을 반복해서 출력함 (kill 될 때까지)

SYNOPSIS
       yes [STRING]...
       yes OPTION

DESCRIPTION
       지정한 문자열들을 반복적으로 출력하거나, 기본값으로 'y'를 출력함.

       --help : 도움말을 출력하고 종료함

       --version : 버전 정보를 출력하고 종료함

AUTHOR
       David MacKenzie가 작성함.

BUG 제보
       GNU coreutils 온라인 도움말: <https://www.gnu.org/software/coreutils/>
       번역 관련 버그는 <https://translationproject.org/team/> 으로 제보

COPYRIGHT
       Copyright © 2020 Free Software Foundation, Inc.  
       라이선스 GPLv3+: GNU GPL 버전 3 이상 <https://gnu.org/licenses/gpl.html>.
       이 소프트웨어는 자유롭게 수정 및 재배포할 수 있습니다. 
       법적으로 허용되는 범위 내에서 보증은 없습니다.

SEE ALSO
       전체 문서: <https://www.gnu.org/software/coreutils/yes>
       또는 로컬에서: info '(coreutils) yes invocation'

GNU coreutils 8.32               2022년 2월                          YES(1)
```

중요한 섹션은 다음과 같습니다:

```
NAME(1)                           CATEGORY                          NAME(1)

NAME
	이 페이지에서 다루는 명령어나 개념의 이름과 간단한 설명을 제공합니다.

SYNOPSIS
	짧은 사용법 요약을 보여줍니다. 이 요약은 표준 형식을 따릅니다. 
	일반적으로 각 줄은 명령어의 유효한 사용 방식 중 하나이며 다음과 같이 읽을 수 있습니다:

	COMMAND [선택 인자] 필수 인자
	COMMAND [선택 인자] 여러 인자...

DESCRIPTION
	명령어나 개념에 대한 상세 설명과 다양한 옵션에 대한 구체적인 설명이 제공됩니다.

SEE ALSO
	참고할 만한 다른 매뉴얼 페이지나 온라인 리소스를 나열합니다.

COLLECTION                        DATE                          NAME(1)
```

man 페이지는 화살표 키 또는 PgUp/PgDn 키를 사용해 스크롤할 수 있습니다. 다 읽었다면 `q` 키를 눌러 종료하세요.

man 페이지는 중앙화된 데이터베이스에 저장되어 있습니다. 참고로 이 데이터베이스는 `/usr/share/man` 디렉토리에 있지만, 직접 이 경로와 상호작용할 필요는 없습니다. 단지 `man` 명령을 통해 조회하기만 하면 됩니다. `man` 명령에 전달하는 인자는 파일 경로가 아니라 항목의 이름입니다. 예를 들어 `man yes`라고 입력하면 `yes`의 매뉴얼을 확인할 수 있지만, `man /usr/bin/yes`라고 입력하면 실제 경로를 참조하는 것이기 때문에 엉뚱한 출력이 나올 수 있습니다.

이 단계의 챌린지에는 **비밀 옵션**이 있으며, 이 옵션을 사용하면 플래그를 출력합니다. 이 옵션은 `challenge` 명령어의 man 페이지를 통해 알아내야 합니다!

#### 해결 과정

![Image](https://github.com/user-attachments/assets/250633a4-5b61-45b1-ab6e-1a04f1c16132)

`man challenge`를 해서 보니 그냥 플래그를 출력한다고 하는데 

딱 보아하니 `--lqiwlm` 부분에서 396을 넣으면 flag를 준다고 한다

![Image](https://github.com/user-attachments/assets/6cbf1341-dfe8-4075-8c97-4a1b38d42a22)

굿

### Searching Manuals

![Image](https://github.com/user-attachments/assets/113c2694-f89f-41a2-bbcf-1edff6fe89c8)

화살표 키(PgUp/PgDn 포함)를 사용하여 man 페이지를 스크롤할 수 있고, `/` 키로 검색할 수 있습니다. 검색 후에는 `n` 키를 눌러 다음 결과로, `N` 키를 눌러 이전 결과로 이동할 수 있습니다. `/` 대신 `?`를 사용하면 반대로(위쪽 방향으로) 검색할 수 있습니다!

`challenge`의 man 페이지를 읽어 플래그를 출력해주는 옵션을 찾아보세요.

#### 해결 과정

![Image](https://github.com/user-attachments/assets/6a58f278-dc5f-45c5-a4bd-b2cb45b76c01)

이번에는 위와 같이 `man challenge`를 했을 때 매~우 긴 설명이 나온다 우리는 여기서 검색 기능을 사용하자

![Image](https://github.com/user-attachments/assets/d4176a01-023d-42be-9d01-e738708692a0)

찾았다! `--audczh`란다

![Image](https://github.com/user-attachments/assets/400e5d70-6c11-4f1d-963e-5d5f5f339c8c)

정답

### Searching For Manuals

![Image](https://github.com/user-attachments/assets/bb0d39b7-6606-4307-9e3c-a85ae9d79dd9)

이 레벨은 조금 까다롭습니다: 챌린지의 man 페이지는 그 이름이 랜덤으로 변경되어 숨겨져 있습니다. 다행히 모든 man 페이지는 검색 가능한 데이터베이스에 모여 있으므로, man 페이지 데이터베이스를 검색하여 숨겨진 챌린지의 man 페이지를 찾을 수 있습니다! 올바른 man 페이지를 검색하는 방법을 알아내려면, `man man` 명령어로 man 페이지의 man 페이지를 읽어보세요!

힌트 1: `man man`은 man 명령어 자체의 고급 사용법을 가르쳐 주며, 이 지식을 사용하여 숨겨진 man 페이지를 검색하는 방법을 알아내야 합니다.

힌트 2: man 페이지 이름은 랜덤으로 변경되었지만, 여전히 `/challenge/challenge`를 사용하여 플래그를 얻을 수 있습니다!

#### 해결 과정

어.. `man`으로 `man`을 읽어보라고 한다

![Image](https://github.com/user-attachments/assets/bd127eda-c58b-483b-b0a5-51c35eb81fcd)

이엑 역시 엄청 긴 설명이 나오고 여기서 이제 숨겨진 챌린지의 man 페이지를 찾아야한다

![Image](https://github.com/user-attachments/assets/b1282fae-3779-4304-9193-e2dc01db7d86)

그냥 flag도 없다..

![Image](https://github.com/user-attachments/assets/93222898-5478-4e17-88e9-91d3c536cc49)

음.. 그러니까 어떤 방법으로 `man`을 이용해서 `challenge`를 읽고 그렇게 파일을 열어봐야한다는 뜻?

아니면 `man`을 이용해서 어떤 숨겨진 것을 열어봐야한다는 걸까?

![Image](https://github.com/user-attachments/assets/61c957f5-dd5f-4701-b071-c59526d67134)

오? 이거 혹시?

사실상 똑같이 페이지에서 검색하는 기능인 것 같은데

`man -k printf`
```
주어진 키워드 `printf`에 대해 매뉴얼 페이지의 짧은 설명과 이름을 정규 표현식으로 검색합니다. 일치하는 항목을 출력합니다. `apropos printf`와 동일합니다.
```

음...

![Image](https://github.com/user-attachments/assets/08bd5bd1-5361-48e4-bc8b-486560856302)

이거 검색해 볼 때는 없었는데!!

![Image](https://github.com/user-attachments/assets/40d7aec8-0dde-4ae9-9877-571b6e2c9068)

게다가 이번에는 이걸 어떻게 쓰라는걸까?

![Image](https://github.com/user-attachments/assets/d2979a06-0b27-4967-a332-2fbcedaac11e)

아! `man ~~`로 찾은게 `man lpjmilrwyz`로 열어볼 수 있는 설명서였다!

그러니까 이제야 문제가 이해가 되는게 원래 `challenge`에 대한 설명서를 열어보기 위해서는 `man challenge`를 써야하는데 여기서 설명서가 변경되어 `man lpjmilrwyz`로 이름이 바뀌었다는 거였다!

![Image](https://github.com/user-attachments/assets/7eaa2eaf-9322-4c35-b689-5bf45c08a561)

그런거였어!!

### Helpful Programs

![Image](https://github.com/user-attachments/assets/57aecb7c-3c3f-4c9f-baaa-f10027a8e2ac)

일부 프로그램은 man 페이지가 없지만, 특별한 인자를 주면 실행 방법을 알려줄 수 있습니다. 보통 이 인자는 `--help`이지만, 종종 `-h`, 드물게는 `-?`, `help`, 또는 `/`로 시작하는 특이한 값들(`/?)` 같은)일 수도 있습니다 (이 마지막 경우는 주로 Windows에서 더 자주 볼 수 있습니다).

이번 단계에서는 `--help`를 사용하여 프로그램의 문서를 읽는 연습을 하게 됩니다. 한번 시도해보세요!

#### 해결 과정

![Image](https://github.com/user-attachments/assets/74bf8eb4-d263-46f9-805f-3ff10376a230)

일단 문제에 나온 대로 `--help`를 이용해서 사용 방법을 찾은 후 우리는 `-g`를 이용해 플래그를 얻어야 하지만 뒤의 `GIVE_THE_FLAG`를 모르니 `-p` 옵션을 이용해 값을 얻어내면 된다

### Help for Builtins

![Image](https://github.com/user-attachments/assets/900806e3-db6c-48b8-9657-134030476dfb)

일부 명령어는 man 페이지나 help 옵션을 가진 프로그램이 아니라, 셸 자체에 내장된 명령어입니다. 이러한 명령어를 **builtins(내장 명령어)** 라고 부릅니다. 내장 명령어는 일반 명령어처럼 실행되지만, 셸이 내부적으로 처리하며 외부 프로그램을 실행하지 않습니다.

내장 명령어 목록을 보려면 `help` 명령어를 실행하면 됩니다:

```
hacker@dojo:~$ help
```

특정 내장 명령어에 대한 도움말을 보고 싶다면, `help` 뒤에 그 명령어 이름을 붙이면 됩니다. 우리가 이전에 사용했던 `cd` 명령어를 예로 들어보면:

```
hacker@dojo:~$ help cd
cd: cd [-L|[-P [-e]] [-@]] [dir]
    Change the shell working directory.
    
    Change the current directory to DIR.  The default DIR is the value of the
    HOME shell variable.
...
```

꽤 유용한 정보죠! 이번 챌린지에서는 `help` 명령어를 사용하여 내장 명령어의 도움말을 확인하는 연습을 하게 됩니다. 이 단계의 `/challenge/challenge` 명령어는 외부 프로그램이 아니라 셸 내장 명령어입니다. 이전과 마찬가지로, 이 명령어의 도움말을 찾아보고 어떤 값을 넘겨야 플래그를 얻을 수 있는지 알아내야 합니다!

#### 해결 과정

![Image](https://github.com/user-attachments/assets/73a57396-e5f1-4333-b57c-f69bed6deca9)

### Digesting Documentation 끝!

![Image](https://github.com/user-attachments/assets/46036a08-6b03-472a-a435-87c006f9994b)

다음 문제들은 다른 페이지에 추가로 만들기로 하겠다