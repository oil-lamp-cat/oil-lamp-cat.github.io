---
title: "[wargame] overthewire bandit 6 -> 7"
date: 2024-02-01 00:25:22 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

## Bandit Level 6 -> Level 7

**user_id** : bandit6<br/>
**password** : HWasnPhtq9AVKe0dmk45nxy20cvUa6EG

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
bandit6@bandit:~$ find / -size 33c -user bandit7 -group  bandit6 2> /dev/null
/var/lib/dpkg/info/bandit7.password

bandit6@bandit:~$ cat /var/lib/dpkg/info/bandit7.password morbNTDkSW6jIlUc0ymOdMaLnOlFVAaj
```

비밀번호 : morbNTDkSW6jIlUc0ymOdMaLnOlFVAaj

![bandit6_7_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/aa431231-ee86-4059-8846-35483ffba8a9)

사실 난 리눅스에 관한 지식, 명령어에 관한 지식 없이 시작하였기에 여기저기 수많은 블로그들을 참고하여 작성하고 있는 중이다. 아마 이미 이러한 지식을 알고있는 사람이라면 여기까지 매우 쉽게 도달했을 것이라 생각한다! 차근차근 나아가자! :D
