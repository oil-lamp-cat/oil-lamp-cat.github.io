---
title: "[wargame] overthewire bandit 24 -> 25"
date: 2024-08-31 12:13:15 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

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

