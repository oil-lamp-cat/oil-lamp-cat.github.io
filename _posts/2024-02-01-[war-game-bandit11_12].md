---
title: "[wargame] overthewire bandit 11 -> 12"
date: 2024-02-01 00:25:27 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

## Bandit Level 11 -> Level 12

**user_id** : bandit11<br/>
**password** : dtR173fZKb0RRsDFSGsg2RWnpNVj3qRr

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
The password is 7x16WNeHIi5YkIhWsfFIqoognUTyj9Q4
```

비밀번호 : `7x16WNeHIi5YkIhWsfFIqoognUTyj9Q4`
