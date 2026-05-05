---
title: "[wargame] overthewire bandit 22 -> 23"
date: 2024-08-30 22:53:15 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

## Bandit Level 22 -> Level 23

**user_id** : bandit22<br/>
**password** : tRae0UfB9v0UzbCdn9cY0gQnds9GF58Q


### 목표

![image](https://github.com/user-attachments/assets/f561c320-8261-48f2-969e-84efe8a596f4)

시간 기반 작업 스케줄러인 cron에서 일정한 간격으로 프로그램이 자동으로 실행되고 있습니다. /etc/cron.d/에서 구성을 확인하고 어떤 명령어가 실행되고 있는지 확인하십시오.

참고: 다른 사람이 작성한 셸 스크립트를 보는 것은 매우 유용한 기술입니다. 이 수준의 스크립트는 의도적으로 읽기 쉽게 만들어졌습니다. 만약 그것이 무엇을 하는지 이해하는 데 문제가 있다면, 그것이 출력하는 디버그 정보를 보기 위해 실행해 보세요.

어... 저번이랑 거의 다른 것은 없고 참고가 추가되었다

### 해결법

![image](https://github.com/user-attachments/assets/a0862211-8068-4e25-b385-4e221b16ca35)

저번처럼 들어가서 `cron`에 연결된 파일을 후딱 읽어보면 이번에는 `/usr/bin/cronjob_bandit23.sh`파일로 연결되어있다고 한다


![image](https://github.com/user-attachments/assets/fe22702e-16a4-497d-b3ef-ab1c1af06451)

매우 간단한 스크립트가 있다

```bash
#!/bin/bash

myname=$(whoami)
mytarget=$(echo I am user $myname | md5sum | cut -d ' ' -f 1)

echo "Copying passwordfile /etc/bandit_pass/$myname to /tmp/$mytarget"

cat /etc/bandit_pass/$myname > /tmp/$mytarget
```

> myname=$(whoami)

`whoami`명령어를 통해 유저 id를 넣는다

> mytarget=$(echo I am user $myname | md5sum | cut -d ' ' -f 1)

`I am user bandit23`을 `md5`해시 변환 하고 ''을 구분하여 첫번째 부분만 `mytarget` 변수에 넣는다

> cat /etc/bandit_pass/$myname > /tmp/$mytarget

`tmp/$mytarget`에 `bandit23`의 비밀번호가 저장되게 된다

![ezgif-3-6b2e5d6e92](https://github.com/user-attachments/assets/aad031c4-edea-4b33-9c77-8c66535cc56f)

우리는 현재 `whoami`를 하였을 때 `bandit22`가 나오고 우리가 찾고 싶은 것은 `bandit23`의 비밀번호이기에 찾기위해 그 부분을 직접 입력해주자

![image](https://github.com/user-attachments/assets/7781a8df-4282-4dfa-9b6f-a9dd8db94959)

위에서 파일이 `/tmp/$mytarget`에 저장되어있다고 하였고 우리는 `$mytarget`이 `8ca319486bfbbc3663ea0fbe81326349`라는 것을 알아냈다

![image](https://github.com/user-attachments/assets/51560e85-dc0a-4bef-89dd-e4e1629fd958)

읽어보면 `bandit23`의 비밀번호를 알아낼 수 있다

> 비밀번호 : **0Zf11ioIjMVN551jX3CmStKLYqjk54Ga**

