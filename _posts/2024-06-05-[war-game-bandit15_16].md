---
title: "[wargame] overthewire bandit 15 -> 16"
date: 2024-06-05 13:52:15 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

## Bandit Level 15 -> Level 16

**user_id** : bandit15<br/>
**password** : 8xCjnmgoKbGLhHFAZlGE5Tmu4M2tKJQo

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