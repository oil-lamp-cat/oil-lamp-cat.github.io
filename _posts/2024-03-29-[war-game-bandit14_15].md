---
title: "[wargame] overthewire bandit 14 -> 15"
date: 2024-03-29 00:25:15 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

## Bandit Level 14 -> Level 15

**user_id** : bandit14<br/>
**password** : MU4VWeTyJk8ROof1qqmcBPaLh7lDCPvS

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