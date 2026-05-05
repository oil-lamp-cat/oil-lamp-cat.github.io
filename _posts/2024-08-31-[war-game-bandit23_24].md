---
title: "[wargame] overthewire bandit 23 -> 24"
date: 2024-08-31 11:30:15 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

## Bandit Level 23 -> Level 24

**user_id** : bandit23<br/>
**password** : 0Zf11ioIjMVN551jX3CmStKLYqjk54Ga


### 목표

![image](https://github.com/user-attachments/assets/252e8dcf-8fa9-4a42-85b4-9c7f5fe93b37)

시간 기반 작업 스케줄러인 `cron`에서 일정한 간격으로 프로그램이 자동으로 실행되고 있습니다. `/etc/cron.d/`에서 구성을 확인하고 어떤 명령어가 실행되고 있는지 확인하십시오.

참고: 이 레벨은 여러분 자신의 첫 번째 쉘 스크립트를 만들어야 합니다. 이것은 매우 큰 단계이며 이 레벨을 통과할 때 자신을 자랑스러워 해야 합니다!

참고 2: 쉘 스크립트는 한번 실행되면 제거되므로 복사본을 보관하세요…


### 해결법

와 이번에는 직접 쉘 스크립트를 만들어야 한다고 한다!

![image](https://github.com/user-attachments/assets/16f1f694-8bf3-435a-8504-c0c644b35b6d)

보아하니 이번에는 `/usr/bin/cronjob_bandit24.sh`을 확인해 봐야 하는 것 같은데 어쨰서 쉘 스크립트를 만들어야 한다고 하는걸까?

![image](https://github.com/user-attachments/assets/373c7942-f0d5-4f1a-a264-89e1f39cb805)

1. `/var/spool/bandit24/foo`로 이동
2. 해당 경로의 모든 스크립트를 실행 후 삭제
3. 파일이 `.`이거나 `..`이 아닐 경우 실행
4. 파일 소유자가 `bandit23`이면 60초 동안 실행되고 `-s 9` 즉 `9(SIGKILL)`을 보내서 명령어를 강제종료한다. 그 후 삭제된다

저번과 다른 점이라면 아무래도 

```
cat /etc/bandit_pass/$myname > /tmp/$mytarget
```

비밀번호를 가져오는 이 부분이 빠졌기에 그 부분을 가져오고 `/var/spool/bandit24/`의 위치한 스크립트는 계속 삭제될 것이기에 따로 스크립트를 만들어 주고 옮기면 될 것 같다

```
#!/bin/bash
cat /etc/bandit_pass/bandit24 > /tmp/lampcat23/bandit24_password
```

![image](https://github.com/user-attachments/assets/fafd820e-6542-42bb-8638-7c3c50aa28c6)

스크립트를 만든 뒤 옮기려 하였는데 `/var/spool/bandit24/`가 없네?

아 잘못했구나 경로가 `/var/spool/$myname/foo`이니까 우리는 `/var/spool/bandit24/foo`가 될 것이다

다시 해보면?

![image](https://github.com/user-attachments/assets/207bd3c5-795f-45f9-b7dd-8043fdecd01e)

> 비밀번호 : **gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8**

