---
title: "[wargame] overthewire bandit 8 -> 9"
date: 2024-02-01 00:25:24 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

## Bandit Level 8 -> Level 9

**user_id** : bandit8<br/>
**password** : dfwvzFQi4mU0wfNbFOe9RoWskMLg7eEc

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
4CKMh1JI91bUIZZPXDqGanal4xvAg0JM

```

오호 이 녀석이 우리가 찾던 비밀번호다!

비밀번호 : `4CKMh1JI91bUIZZPXDqGanal4xvAg0JM`
