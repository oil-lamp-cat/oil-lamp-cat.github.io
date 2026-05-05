---
title: "[wargame] overthewire bandit 19 -> 20"
date: 2024-08-30 13:41:15 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

## Bandit Level 19 -> Level 20

**user_id** : bandit19<br/>
**password** : cGWpMaKXVwDUNgPAVJbWYuGHVn9zl3j8

### 목표

![image](https://github.com/user-attachments/assets/07e3af78-dba4-4b62-94dc-2067f65c28d7)

다음 레벨에 액세스하려면 홈 디렉토리에서 setuid 바이너리를 사용해야 합니다. 사용 방법을 알아보려면 인수 없이 실행하십시오. 이 레벨의 암호는 setuid 바이너리를 사용한 후 일반적인 자리(/etc/bandit_pass)에서 찾을 수 있습니다.

#### 1. 홈 디렉토리에서 setuid binary를 이용해라

> binary가 뭘까?

2진수 숫자로된 데이터 파일을 의미한다

그럼 여기서 말하는 setuid binary는 setuid가 설정된 데이터 파일을 의미한다

> setuid가 뭘까?

SetUID는 유닉스 환경에서 일시적으로 접근 권한이 없는 파일에 접근을 허용하는 특수 권한을 부여할 수 있게 된다

자세한 설명은 [SetUID를 이용한 권한상승의 위험성](https://www.igloo.co.kr/security-information/setuid%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EA%B6%8C%ED%95%9C%EC%83%81%EC%8A%B9%EC%9D%98-%EC%9C%84%ED%97%98%EC%84%B1/) 이곳을 참고하면 좋을 것이다

혹시 모르니 바로 한번 `/etc/bandit_pass/bandit20`를 읽어보자

![image](https://github.com/user-attachments/assets/6ff43497-9bfb-4592-aab0-ad94d096f360)

역시 권한이 없다

### 해결법

#### 권한

진작에 한번 공부를 했어야 했는데

[리눅스 권한 설정](https://danmilife.tistory.com/8), [리눅스 파일 & 디렉토리 권한](https://inpa.tistory.com/entry/LINUX-%F0%9F%93%9A-%ED%8C%8C%EC%9D%BC-%EA%B6%8C%ED%95%9C-%EC%86%8C%EC%9C%A0%EA%B6%8C%ED%97%88%EA%B0%80%EA%B6%8C-%F0%9F%92%AF-%EC%A0%95%EB%A6%AC)을 먼저 보고 오면 좋다

```
-rwsr-x--- 1 bandit20 bandit19 14880 Jul 17 15:57 bandit20-do
```

위와 같은 권한이 있다고 해보자

> `-` (file type)

`-`  : 파일이다

> rws (User) 

`r` : 읽기 권한 있음

`w` : 쓰기 권한 있음

`s` : setUID 설정이 되어있어 사용자 권한이 있어야 실행할 수 있음

> r-x (Group)

`r` : 읽기 권한 있음

`-` : 쓰기 권한 없음

`x` : 실행 권한 있음

> --- (Other)

아무 권한 없음

> bandit20 (User)

파일을 만든 소유주

> bandit19 (Group)

파일을 만든 소유주가 속한 그룹

> 14880 (File size)

파일 크기 byte로 되어있음

> Jul 17 15:57 (마지막 변경 날짜)

> bandit20-do (파일 이름)

![image](https://github.com/user-attachments/assets/0a5d9eb1-bebe-464f-aaca-e776afd4aaa5)

파일을 확인해 보면 권한이 `rws`로 `s`가 바로 setuid 설정이 되어있는 것이다

보통은 rwx로 권한이 설정되어있어서 실행 권한을 나타낸다고 한다

#### 일단 한번 실행해보자

![image](https://github.com/user-attachments/assets/71580daf-76e8-43b2-88a7-a2fb86612632)

다른 user권한으로 실행하라고 한다

예시에 `./bandit20-do id`라고 하니 그대로 실행시켜보자

![image](https://github.com/user-attachments/assets/f0164f7b-afcc-4c30-81e5-96b1809ff08a)

오 우리가 권한에 관해 이야기 할 때 봤듯 `setUID`가 설정되어있어 `bandit20`의 권한으로 실행이 된다

더 쉽게 알 수 있는 방법은 실행시켰을 때 `uid`는 `bandit19`로 뜨지만 옆에 `euid`가 `bandit20`으로 뜨고 있는 것을 볼 수 있다

이 `euid`는 파일을 실행했을 때 실제 사용하는 `uid`를 의미한다

#### 비밀번호를 가져오자

문제에서 `/etc/bandit_pass/bandit20`에 비밀번호가 있다고 하니 읽어보도록 하자

![image](https://github.com/user-attachments/assets/fe548a42-e460-4152-a819-04838907a4e2)

> 비밀번호 : **0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO**

와 솔직히 계속 bandit을 통해 리눅스 지식을 접하거나 bash스크립트를 짤 때 자꾸 사람들이 `chmod`니 권한 상승이니 하는 말들이 많았고 사실 그 때는 그냥 필요하면 따라하기만 했었는데 이렇게 중요한 것이라고는 생각을 못했었다

나중에 따로 아예 리눅스에 관한 책 혹은 글을 읽어봐야겠다