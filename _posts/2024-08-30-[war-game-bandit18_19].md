---
title: "[wargame] overthewire bandit 18 -> 19"
date: 2024-08-30 13:13:15 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

## Bandit Level 18 -> Level 19

**user_id** : bandit18<br/>
**password** : x2gLTTjFwMOhQ8oWNbMN362QKxfRqGlO

### 목표

![image](https://github.com/user-attachments/assets/1da9fdce-e977-4e55-823e-c3b68378c370)

다음 레벨의 암호는 홈 디렉토리의 readme 파일에 저장됩니다. 불행히도 SSH로 로그인할 때 누군가가 .bashrc를 로그아웃하도록 수정했습니다.

그래서 자꾸 로그아웃 당했던 거구만

일단 readme파일에 비밀번호가 있다고 하니 들어갈 수만 있다면 오케이다

### 해결법

> 일단 `bashrc`가 무엇인가? 

bash + Run Command 의 줄인말

> `./bashrc` 는?

[bashrc 설정하기](https://slamwithme.oopy.io/bb4e942f-65f1-4c8d-8188-203eca2b8fde)에 자세히 설명되어있으며 간단히 말하면 `bash`에 미리 입력하고 싶은 내용을 작성해두어 쉘을 열면 자동으로 실행되는 것을 뜻한다

그렇다면 [[Ubuntu] terminal에 pfetch 실행하기](https://oil-lamp-cat.github.io/posts/pfetch-terminal/) 이것도 bashrc에 명령어를 미리 입력해 두어 실행할 수도 있겠네!

그런데 이번 문제에서는 누군가 `.bashrc`파일을 변경해두어 ssh를 이용해 쉘을 연결하면 기본 쉘인 `bash`가 실행되면서 `Byebye`를 출력하고 우리를 쫒아낸 것이다

그렇다면 접속을 하기 위한 쉘인 ssh에 관해 조금 더 생각을 해보자

원래 우리는 ssh를 연결할 때 (termius말고) 

```sh
ssh [옵션] [사용자명]@[호스트 주소]
```

을 통해 연결했었다 하지만 만약 접속 전에 명령어를 넘겨줄 수 있다면?

```sh
ssh [옵션] [사용자명]@[호스트 주소] [명령어]
```

원래는 이런 형태로도 사용이 가능했던 것이다!

이번에는 터미널을 통해 연결해보자 (termius)

![image](https://github.com/user-attachments/assets/74cc8d8d-34f4-4a62-88ce-f955cc49f724)

터미널을 열고

![image](https://github.com/user-attachments/assets/6f9a2186-a8cc-4dcf-89c2-f593537f0940)

`bash`쉘이 아닌 `sh`가장 기본 쉘을 통해 접속에 성공했다

또한 처음에 비밀번호를 입력했을 때 따로 출력이 뜨지 않는다고 뭐지? 생각할 수도 있다

따로 password incorrect와 같은 오류가 뜨지 않았다면 접속에 성공한 것이니 하던대로 파일을 읽으면 된다!

비밀번호 : `cGWpMaKXVwDUNgPAVJbWYuGHVn9zl3j8`