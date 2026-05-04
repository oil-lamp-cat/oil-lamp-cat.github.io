---
title: "[wargame] overthewire bandit 16 -> 17"
date: 2024-08-29 18:04:15 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

오랜만에 다시 왔더니 모든 비밀번호가 변경되어있었다 허허.. 일단 0_15까지 전부 변경하였다

전체는 아직

## Bandit Level 16 -> Level 17

**user_id** : bandit16<br/>
**password** : kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx

### 목표

![image](https://github.com/user-attachments/assets/cd2f17aa-e964-4587-a9bc-a67663a0392a)

다음 레벨에 대한 자격 증명은 현재 레벨의 암호를 31000에서 32000 사이의 로컬 호스트에 있는 포트에 제출하면 검색할 수 있습니다. 먼저 이 포트 중 어떤 포트에 수신 중인 서버가 있는지 확인하십시오. 그런 다음 이 포트 중에 SSL/TLS를 사용하는 서버와 그렇지 않은 서버가 있는지 확인하십시오. 다음 자격 증명을 제공하는 서버는 단 하나뿐이며, 다른 서버는 당신이 보내는 모든 것을 당신에게 다시 보낼 것입니다.

유용한 참고 사항: "DONE", "RENEGOTIATING" 또는 "KEYUPDATE"? 메뉴 페이지의 "연결된 명령" 섹션을 읽으십시오.

또 무슨 말인지 이해가 안되는 파트가 나왔다

조금 어려우니 살짝 풀어보면

1. 31000번 ~ 32000번 포트 중 열려있는 문을 찾아라
2. 그 중 SSL/TLS를 사용하는 포트를 찾아라

어? 이거 1번은 포트 스캐닝이네?

[C언어로 된 포트 스캐너](https://oil-lamp-cat.github.io/posts/TCP-Port-scan-c/)를 보면 포트스캐너의 원리를 대충이나마 이해할 수 있을 것이다

### 해결법

#### 1. 31000번 ~ 32000번 중 하나?

> 아래 적혀있는 커맨드 중 nc(Net Cat)을 이용해보자

```bash
bandit16@bandit:~$ nc -w [연결 횟수] -z 127.0.0.1 [스캔할 포트 시작]-[스캔할 포트 끝]
```

![image](https://github.com/user-attachments/assets/45bd4ec7-4bb4-4199-8830-c1d30fa59ac0)

오 역시 localhost라서 그런지 매우 빠르다

일단 열린 포트 5가지를 찾았고 우리는 이중에 SSL/TLS 통신을 하는 포트를 찾아야 한다

#### 2. SSL/TLS 통신

이 전 16번 문제에 사용했던 방식을 쓰면 된다만 만약 포트가 더 많았다면? 이라는 생각으로 Bash 스크립트를 만들어볼 생각이다

![image](https://github.com/user-attachments/assets/86e95e53-6e64-4263-a3aa-b57ac8277424)

어... permission denied는 변수랄까...

일단은 이렇게 되었다

```bash
#!/bin/bash

result=$(nc -w 1 -z localhost 31000-32000)

# 포트 번호를 추출
port=$(echo "$result" | grep -oP '\d{2,5}')

# 추출된 포트 번호를 사용해 OpenSSL s_client 실행
if [ -n "$port" ]; then
    echo "Connecting to localhost on port $port using openssl s_c>    openssl s_client -connect localhost:$port
else
    echo "No open ports found."
fi
```

아마 실행해 본다면 될 것이라 생각하지만 일단은 권한 문제로 직접 한 줄로 만들어서 실행시킬 수 밖에

```bash
result=$(nc -w 1 -z localhost 31000-32000) | port=$(echo "$result" | grep -oP '\b\d{5}\b') |echo "$port"| if [ -n "$port" ]; then openssl s_client -connect localhost:$port; else echo "No open ports found."; fi
```

라고 생각했는데 나의 내공이 부족한 것인지 `nc`의 결과가 변수에 들어가지를 않는다... 

어렵구만 어려워

다시 한번 좀 더 머리를 굴려보자

```
for port in $(nc -nv -w 1 -z 127.0.0.1 31000-32000 2>&1 | grep succeeded | grep -oP '\b\d{5}\b'); do (echo -n "$port: "; openssl s_client -connect localhost:$port < /dev/null > /dev/null 2>&1 && echo "success") || echo "failure"; done
```

성공!!!!!!!!!!!!

![image](https://github.com/user-attachments/assets/0da9afcb-5fc8-4c4d-bdee-c9ca37f0dd80)

그런데 이상하게도 2개나 응답을 했네? 뭐지?

일단 한번 연결을 직접 해보면?

```bash
read R BLOCK
kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx
KEYUPDATE
kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx
KEYUPDATE
kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx
KEYUPDATE

closed
```
응? KEYUPDATE라고만 뜨네?

다시 가장 처음 문제를 읽어보면 `Helpful note: Getting “DONE”, “RENEGOTIATING” or “KEYUPDATE”? Read the “CONNECTED COMMANDS” section in the manpage.` manpage의 connected commands를 읽어보라고 한다

[connected-commands](https://docs.openssl.org/1.0.2/man1/s_client/#connected-commands)

```sh
bandit16@bandit:~$ openssl s_client -ign_eof -connect localhost:31790
```
를 통해 해결했다 정답은 `-ign_eof`였던 것

파일의 끝(EOF)에 도달하여도 프로그램이 `-ign_eof`을 걸어주어 프로그램이 중단되는 것을 막아주었다

아니 이런게 있었어? [EOF(End Of File)](https://msh1307.tistory.com/13)

![image](https://github.com/user-attachments/assets/4d540d02-9bf9-43e5-a17b-0e8b9b209d54)

일단 처음 31518번 포트는 열려있고 ssl 통신을 하지만 키를 반복해서 뱉어낼 뿐 결과를 주지 않는다

그럼 31790번 포트는?

![image](https://github.com/user-attachments/assets/1f84973e-5e8a-4134-aeeb-5392117a3461)

이 친구는 오히려 너무 푸짐하게 준다 어우...

```
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAvmOkuifmMg6HL2YPIOjon6iWfbp7c3jx34YkYWqUH57SUdyJ
imZzeyGC0gtZPGujUSxiJSWI/oTqexh+cAMTSMlOJf7+BrJObArnxd9Y7YT2bRPQ
Ja6Lzb558YW3FZl87ORiO+rW4LCDCNd2lUvLE/GL2GWyuKN0K5iCd5TbtJzEkQTu
DSt2mcNn4rhAL+JFr56o4T6z8WWAW18BR6yGrMq7Q/kALHYW3OekePQAzL0VUYbW
JGTi65CxbCnzc/w4+mqQyvmzpWtMAzJTzAzQxNbkR2MBGySxDLrjg0LWN6sK7wNX
x0YVztz/zbIkPjfkU1jHS+9EbVNj+D1XFOJuaQIDAQABAoIBABagpxpM1aoLWfvD
KHcj10nqcoBc4oE11aFYQwik7xfW+24pRNuDE6SFthOar69jp5RlLwD1NhPx3iBl
J9nOM8OJ0VToum43UOS8YxF8WwhXriYGnc1sskbwpXOUDc9uX4+UESzH22P29ovd
d8WErY0gPxun8pbJLmxkAtWNhpMvfe0050vk9TL5wqbu9AlbssgTcCXkMQnPw9nC
YNN6DDP2lbcBrvgT9YCNL6C+ZKufD52yOQ9qOkwFTEQpjtF4uNtJom+asvlpmS8A
vLY9r60wYSvmZhNqBUrj7lyCtXMIu1kkd4w7F77k+DjHoAXyxcUp1DGL51sOmama
+TOWWgECgYEA8JtPxP0GRJ+IQkX262jM3dEIkza8ky5moIwUqYdsx0NxHgRRhORT
8c8hAuRBb2G82so8vUHk/fur85OEfc9TncnCY2crpoqsghifKLxrLgtT+qDpfZnx
SatLdt8GfQ85yA7hnWWJ2MxF3NaeSDm75Lsm+tBbAiyc9P2jGRNtMSkCgYEAypHd
HCctNi/FwjulhttFx/rHYKhLidZDFYeiE/v45bN4yFm8x7R/b0iE7KaszX+Exdvt
SghaTdcG0Knyw1bpJVyusavPzpaJMjdJ6tcFhVAbAjm7enCIvGCSx+X3l5SiWg0A
R57hJglezIiVjv3aGwHwvlZvtszK6zV6oXFAu0ECgYAbjo46T4hyP5tJi93V5HDi
Ttiek7xRVxUl+iU7rWkGAXFpMLFteQEsRr7PJ/lemmEY5eTDAFMLy9FL2m9oQWCg
R8VdwSk8r9FGLS+9aKcV5PI/WEKlwgXinB3OhYimtiG2Cg5JCqIZFHxD6MjEGOiu
L8ktHMPvodBwNsSBULpG0QKBgBAplTfC1HOnWiMGOU3KPwYWt0O6CdTkmJOmL8Ni
blh9elyZ9FsGxsgtRBXRsqXuz7wtsQAgLHxbdLq/ZJQ7YfzOKU4ZxEnabvXnvWkU
YOdjHdSOoKvDQNWu6ucyLRAWFuISeXw9a/9p7ftpxm0TSgyvmfLF2MIAEwyzRqaM
77pBAoGAMmjmIJdjp+Ez8duyn3ieo36yrttF5NSsJLAbxFpdlc1gvtGCWW+9Cq0b
dxviW8+TFVEBl1O4f7HVm6EpTscdDxU+bCXWkfjuRb7Dy9GOtt9JPsX8MBTakzh3
vBgsyi/sN3RqRBcGU40fOoZyfAMT8s1m/uYv52O6IgeuZ/ujbjY=
-----END RSA PRIVATE KEY-----
```

RSA 키라고 하니까 저장해 주고 level13에서 풀었던 방법과 동일하게 풀면 끝이다

위에서 bash스크립트를 짤 때 확인했듯이 폴더에 그냥 만들 수는 없다

고로 `/tmp`퐅더에 만들도록 하자

```sh
bandit16@bandit:mkdir /tmp/lampcat2
bandit16@bandit:cd /tmp/lampcat2
```

아 근데 지금 생각해보니 여기에 스크립트 만들면 됬구나... 아...

이제 `sshkey`를 생성해 주면

```
bandit16@bandit:/tmp/lampcat2$ cat > sshkey.private
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAvmOkuifmMg6HL2YPIOjon6iWfbp7c3jx34YkYWqUH57SUdyJ
imZzeyGC0gtZPGujUSxiJSWI/oTqexh+cAMTSMlOJf7+BrJObArnxd9Y7YT2bRPQ
Ja6Lzb558YW3FZl87ORiO+rW4LCDCNd2lUvLE/GL2GWyuKN0K5iCd5TbtJzEkQTu
DSt2mcNn4rhAL+JFr56o4T6z8WWAW18BR6yGrMq7Q/kALHYW3OekePQAzL0VUYbW
JGTi65CxbCnzc/w4+mqQyvmzpWtMAzJTzAzQxNbkR2MBGySxDLrjg0LWN6sK7wNX
x0YVztz/zbIkPjfkU1jHS+9EbVNj+D1XFOJuaQIDAQABAoIBABagpxpM1aoLWfvD
KHcj10nqcoBc4oE11aFYQwik7xfW+24pRNuDE6SFthOar69jp5RlLwD1NhPx3iBl
J9nOM8OJ0VToum43UOS8YxF8WwhXriYGnc1sskbwpXOUDc9uX4+UESzH22P29ovd
d8WErY0gPxun8pbJLmxkAtWNhpMvfe0050vk9TL5wqbu9AlbssgTcCXkMQnPw9nC
YNN6DDP2lbcBrvgT9YCNL6C+ZKufD52yOQ9qOkwFTEQpjtF4uNtJom+asvlpmS8A
vLY9r60wYSvmZhNqBUrj7lyCtXMIu1kkd4w7F77k+DjHoAXyxcUp1DGL51sOmama
+TOWWgECgYEA8JtPxP0GRJ+IQkX262jM3dEIkza8ky5moIwUqYdsx0NxHgRRhORT
8c8hAuRBb2G82so8vUHk/fur85OEfc9TncnCY2crpoqsghifKLxrLgtT+qDpfZnx
SatLdt8GfQ85yA7hnWWJ2MxF3NaeSDm75Lsm+tBbAiyc9P2jGRNtMSkCgYEAypHd
HCctNi/FwjulhttFx/rHYKhLidZDFYeiE/v45bN4yFm8x7R/b0iE7KaszX+Exdvt
SghaTdcG0Knyw1bpJVyusavPzpaJMjdJ6tcFhVAbAjm7enCIvGCSx+X3l5SiWg0A
R57hJglezIiVjv3aGwHwvlZvtszK6zV6oXFAu0ECgYAbjo46T4hyP5tJi93V5HDi
Ttiek7xRVxUl+iU7rWkGAXFpMLFteQEsRr7PJ/lemmEY5eTDAFMLy9FL2m9oQWCg
R8VdwSk8r9FGLS+9aKcV5PI/WEKlwgXinB3OhYimtiG2Cg5JCqIZFHxD6MjEGOiu
L8ktHMPvodBwNsSBULpG0QKBgBAplTfC1HOnWiMGOU3KPwYWt0O6CdTkmJOmL8Ni
blh9elyZ9FsGxsgtRBXRsqXuz7wtsQAgLHxbdLq/ZJQ7YfzOKU4ZxEnabvXnvWkU
YOdjHdSOoKvDQNWu6ucyLRAWFuISeXw9a/9p7ftpxm0TSgyvmfLF2MIAEwyzRqaM
77pBAoGAMmjmIJdjp+Ez8duyn3ieo36yrttF5NSsJLAbxFpdlc1gvtGCWW+9Cq0b
dxviW8+TFVEBl1O4f7HVm6EpTscdDxU+bCXWkfjuRb7Dy9GOtt9JPsX8MBTakzh3
vBgsyi/sN3RqRBcGU40fOoZyfAMT8s1m/uYv52O6IgeuZ/ujbjY=
-----END RSA PRIVATE KEY-----
^C
bandit16@bandit:/tmp/lampcat2$
```

ssh로 접속을 할 수 있게 된다

```sh
bandit16@bandit:/tmp/lampcat2$ ssh -i sshkey.private bandit17@localhost
```

![image](https://github.com/user-attachments/assets/45648f64-4b85-4a79-af09-f70f4cab17ea)

아니 왜 또 막는겨

읽어보니 `sshkey.private` 값이 공개키이고 권한이 잘못되어있다고 한다

???

![image](https://github.com/user-attachments/assets/3ac3dde9-04c7-4344-bc61-fbd72159f2eb)

권한 등급이 `rw-rw-r`로 나 뿐 아니라 모든 사람이 읽을 수 있는 파일이였다

그렇기에 ssh가 안전하지 않다고 판단하여 접근 불가 판정을 내렸던 것

그렇다면 나만 읽을 수 있는 권한을 주도록 하자

![image](https://github.com/user-attachments/assets/bc72a75d-eca7-4ee1-b574-2539b8516cf4)

연결해 보면

![image](https://github.com/user-attachments/assets/8ce87ef4-872a-4483-ab65-cc2fda41c7a0)

그.. 그만해...

이번에는 22번 포트로 들어오라고 한다

아 그치 문이 아니라 창문으로 들어오려고 하면 이상하지

참고로 22번 포트로 접속을 해도 막힌다...

이것 때문에 꽤 찾아봤는데 우리가 현재 접속을 2220포트로 했기에 2220포트로 접속을 해야 한다고 한다

와우!

![ezgif-3-6b2e5d6e92](https://github.com/user-attachments/assets/aad031c4-edea-4b33-9c77-8c66535cc56f)

```sh
bandit16@bandit:/tmp/lampcat2$ ssh -i sshkey.private bandit17@localhost -p2220
```

![image](https://github.com/user-attachments/assets/6ef12066-d9db-4e4d-a1b2-f5f96a64ec9a)

일단 접속은 성공했다

비밀번호를 찾으러 가보자

![image](https://github.com/user-attachments/assets/4c354a5f-47a1-4181-b5ec-b10ece60d184)

bandit의 모든 패스워드는 `/etc/bandit_pass/`에 저장되어 있으니 여기서 찾으면 된다

하지만 다른 파일들은 권한이 없어 맞는 권한을 가진 것만 읽을 수 있다

![image](https://github.com/user-attachments/assets/fe952418-6daf-4108-88e7-da21bfdc00f7)

비밀번호는 `EReVavePLFHtFlFsjn3hyzMlvSuSAcRD`이다!