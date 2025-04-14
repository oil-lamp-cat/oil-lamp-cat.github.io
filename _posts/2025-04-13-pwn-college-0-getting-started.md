---
title: "[pwn.college] 0. Using the Dojo Getting Started."
date: 2025-04-13 18:27:15 +09:00
categories: [Linux, pwn.college, hacking]
tags: [pwn.college]
pin: true
---

![pwn.college](https://github.com/user-attachments/assets/b192ec27-92e2-4817-ad39-049e247e2737)

## pwn.college

**pwn.college** 는 `리눅스 기본 명령어`와 `시스템 이해`를 위한 기초 해킹 입문용 워게임이였던 **bandit**과는 달리 Exploit 개발, 시스템 보안, 바이너리 해킹 등을 학습하는 고급 해킹 교육 플랫폼이라고 한다

이제 막 도전해보며 공부할 생각이라 잘못된 설명이 있을 수도 있고 더 쉽게 푸는 방법이 있을 수도 있다

하지만 시작이 반이라는 말이 있듯 머리를 박고 고민하는 것으로 하자

> [pwn.college](https://pwn.college/)
- 목적: Exploit 개발, 시스템 보안, 바이너리 해킹 등을 학습하는 고급 해킹 교육 플랫폼
- 난이도: 초급~고급까지 폭넓음
- 기반 지식: 리눅스, C언어, 어셈블리, gdb, pwntools 등
- 형식: 강의 + 실습 기반 CTF 스타일
- 강의 수강 → 문제 해결 → 플래그 제출

> [bandit](https://oil-lamp-cat.github.io/posts/war-game-bandit/)
- 목적: 리눅스 기본 명령어와 시스템 이해를 위한 기초 해킹 입문용 워게임
- 난이도: 입문~초급
- 기반 지식: 리눅스 명령어, 파일 퍼미션, ssh 등
- 형식: 서버에 ssh로 접속해서 문제를 풀어가며 다음 레벨로 이동


이번에 동아리 활동을 하는 동안 물어볼 사람들도 많으니 도전해본다

## 회원가입을 할 때 나오는 몇가지 룰

![Image](https://github.com/user-attachments/assets/13dc3e58-4d88-4dd3-8383-95f7d6ea3871)

---

### 기본 규칙  

이 플랫폼을 사용할 때는 몇 가지 기본 규칙을 기억해주세요!

### Writeup 관련  

pwn.college에 제공되는 챌린지들은 교육용 자료이며, 애리조나 주립대학교(ASU) 학생들의 평가에도 사용됩니다.  
이런 이유로, **문제 풀이 Writeup, 공략 영상, 라이브 스트리밍 등의 공개는 자제해주시면 감사하겠습니다.**  

물론 인터넷에 게시하는 것을 우리가 막을 수는 없지만, 이 모든 콘텐츠를 공개하기 위해 많은 노력을 들였기에, pwn.college가 계속해서 유용한 교육 플랫폼으로 유지될 수 있도록 여러분의 협조를 부탁드립니다.

### 버그 바운티  

숙련된 해커들도 종종 자기 프로그램에 취약점을 남겨두곤 합니다!  
만약 이 플랫폼에서 취약점을 발견했다면, 우리를 해킹하기보다는 **이메일로 알려주세요.**  
정말 감사하게 생각할 것이며, **ASU 학생이라면 추가 점수**, 그 외 사용자라면 **스코어보드 상에서 멋진 보상**을 받을 수 있어요!

---

어 근데 생각해보니 문제 풀이 Writeup 공개를 자제해 달라는데...

음... 학생들이 내 블로그를 볼 일이 없지 않을까?

## 시작

![Image](https://github.com/user-attachments/assets/c4e637a3-9d2a-4e4f-b205-5c47f1eee46f)

로그인을 하고 보이는 `Getting Started`를 먼저 눌러 시작해보자

![Image](https://github.com/user-attachments/assets/32fc78f7-4470-432b-8bd6-38bcddfcabd5)

---

### 도장(Dojo)에 오신 것을 환영합니다!

이 도장은 여러분에게 이 플랫폼 사용법에 대한 **속성 강의(crash course)** 를 제공하고, 앞으로의 성공적인 학습을 위한 준비를 도와줄 거예요.

핵심은 바로 **플래그(flag)** 를 획득하는 것입니다.
플래그는 문제를 풀면 얻을 수 있는 이며, 이를 통해 **점수를 획득**할 수 있어요.  
플래그를 얻는 방법? 간단해요—**도전 과제를 해결하면 됩니다!**


### 도장의 구조

- 각 도장은 **하나 이상의 모듈(module)** 로 구성되어 있어요.  
- 각 모듈 안에는 **여러 개의 챌린지(문제)** 가 있고,  
- **각 챌린지를 풀면 하나의 플래그**를 얻을 수 있어요.

이 입문 도장에는 여러분이 처음으로 도전할 몇 가지 문제들이 포함되어 있고,  
이를 통해 도장 환경을 어떻게 사용하는지 배울 수 있어요!

### 리더보드!

플래그는 수치화할 수 있기 때문에,  
각 도장과 모듈에는 **해커들의 랭킹을 보여주는 리더보드**가 존재합니다.  
이 도장의 맨 아래쪽에서 확인해보세요!

### 이제 도장에 입장할 준비가 되셨나요?

준비가 되었다면, 아래 모듈 목록에서 **‘Using the Dojo’** 를 클릭/탭해 시작하세요!


도장의 **음(陰)** 에 해당하는 **양(陽)** 은 바로 우리의 **디스코드 서버**입니다.  
모듈 목록에서 **‘Joining the Discord’** 로 이동해 자세한 내용을 확인하고 커뮤니티에도 참여해보세요!


`Using the Dojo` 를 배우고, `Discord에 참여`까지 마쳤다면,  
이제 본격적인 학습 콘텐츠로 넘어갈 수 있어요.

사이버 보안 여정에 행운을 빕니다!

## Joining the Discord

![Image](https://github.com/user-attachments/assets/1cb88538-c917-4b59-882d-962a97c69633)

디스코드 서버에 들어가서 계정과 연결하면 흰 띠를 준다네요

![Image](https://github.com/user-attachments/assets/ff7a5883-2ebf-4a8a-898f-cb0377a8e3d3)

성공


## Using the Dojo

![Image](https://github.com/user-attachments/assets/b61d7975-9adb-4803-87ab-d40e2b0cc364)

---

### 이 모듈에서는 이 플랫폼과 상호작용하는 방법을 배우게 됩니다!

플랫폼에서 챌린지에 접근하는 방법은 **세 가지**가 있어요:

1. **Dojo Workspace** 사용 –  
   도장 내부에서 실행되는 **Visual Studio Code** 기반의 개발 환경입니다.

2. **Dojo Desktop** 사용 –  
   도장 내부에서 실행되는 **리눅스 GUI 데스크탑 환경**이에요.

3. **SSH 클라이언트를 설정하고 직접 접속** –  
   개인 SSH 클라이언트를 설정해서 직접 로그인할 수 있어요.

이 모듈에서는 **앞의 두 가지 방법(Workspace와 Desktop 사용법)** 을 안내하고,  
플랫폼의 **다른 유용한 기능들**도 소개할 거예요!

아래에는 두 가지 항목이 있습니다:

- **학습 자료**(강의 및 읽을 거리)
- **연습 문제**(챌린지)

각 항목은 클릭/탭하면 내용을 확장할 수 있으니, 원하는 항목을 펼쳐보세요!

이제 아래에 있는 **"시작하기 영상(Getting Started)"** 을 시청하거나,  
바로 **"VSCode Workspace 사용하기" 챌린지**에 도전해보세요!

---

### Lectures and Reading

![Image](https://github.com/user-attachments/assets/405cba01-4815-4b02-8317-51586ef6c893)

각각의 질문들에는 영상과 자료가 함께 포함되어있다

영상자료는 각자 직접 보는걸로

아 이거 위에 죽 설명한게 회원가입 부터 싹 다 `Getting Started`에서 다 나온다

꼭 넘기지 말고 다 들어보자, 길어야 11분인데 되게 중요하다

#### 챌린지 접속 방법

- 브라우저에서 사이트에서 제공하는 vscode를 통해 터미널에 접속한다
- 브라우저에서 사이트에서 제공하는 vm에 접속한다
- ssh-key를 설정하여 접속한다

나는 그냥 간단하게 사이트 제공 vscode를 이용할 듯 하다

여기가 좋은게 문제를 하나 선택하고 풀 때 다른 사이트에서는 vm에 접속할 때 vpn을 사용하여 느리곤 했는데 브라우저에서 사이트 제공 터미널에 바로 접속할 수 있어 좋은 것 같다

게다가 ssh를 쓴다고 했을 때 bandit처럼 문제마다 접속 계정이 달라지는게 아니라 선택한 문제에 따른 서버가 생겨 같은 위치로 접속하면 되니 편하다

## Using the Dojo _ Challenges _

### Using the VSCode Workspace

![Image](https://github.com/user-attachments/assets/c059d591-b0c1-415c-8d25-ac71c7048401)

VSCode에서 터미널을 실행한 것이 감지되면, 플래그(Flag)를 준다고 한다

영어로된 영상을 전부 보고 온 사람이라면 알겠지만 이제 도전을 시작하기 위해 **Start** 버튼을 누르면 된다

![Image](https://github.com/user-attachments/assets/8fa8d925-021b-4bda-a010-2ecb22d191fc)

ㅋㅋㅋㅋ 정말로 컨샙이 도장이 맞는갑다

![Image](https://github.com/user-attachments/assets/86c32768-0fa7-412c-a2e0-c8cc3971775f)

플래그를 넣고 Submit을 누르면 성공이다

깃발이 초록색으로 바뀌게 되면 이제 다음 도전으로 넘어가자

### Using the GUI Desktop

![Image](https://github.com/user-attachments/assets/5e516fd0-f679-4ca6-8f8e-72801bfd7d25)

이번에는 사이트의 GUI VM을 열라고 한다

![Image](https://github.com/user-attachments/assets/60012b33-2e35-400e-bbc3-17f9879dd188)

터미널에 들어가면 플래그가 바로 출력된다

심지어 플래그를 어떻게 복사해서 붙여넣는지까지도 친절하게 설명해준다

1. ctrl + shift + c
2. vm의 왼쪽 화면에 화살표를 클릭
3. clipboard에서 복사

### Pasting into the Desktop

![Image](https://github.com/user-attachments/assets/10b2b0c8-ed3b-4541-8f73-099d52553cc0)

vm에 들어가 터미널에 붙여넣기를 하란다

위 과정의 역순이다

![Image](https://github.com/user-attachments/assets/e2a88015-7a7b-43de-b116-87e49aa9e41a)

### Restarting Challenges

![Image](https://github.com/user-attachments/assets/910861c6-f1c4-4cb8-86bd-a2ac1495652c)

처음 시도할 때에는 비밀번호를 입력하라고 하는데 우리는 아직 비밀번호를 모른다

일단 아무거나 입력하면 플래그를 삭제해 버린다고..

그러면 다시 문제로 돌아가 **Start** 버튼을 누르면 끝

![Image](https://github.com/user-attachments/assets/95ab987e-e5ef-4dce-b5c3-758d81ff71b0)

아무 비번이나 넣으니 진짜를 알려주며 다시 시작해야하는 상황이 되었다

![Image](https://github.com/user-attachments/assets/c3f8a289-1b11-4880-bbd5-586687e29e4c)

다시 실행하고 비번을 넣어서 성공

### Getting Help

![Image](https://github.com/user-attachments/assets/d5a23eaf-7c32-47df-bec7-6c6cd3128e9e)

오호 문제 풀 때 어려운게 있으면 pwn.college에서 만든 AI인 **SENSAI**한테 질문을 하라고 한다

지금 생각해보니 저거 센세잖아

![Image](https://github.com/user-attachments/assets/5d2e3782-5f05-4a01-93fc-40b3159b3619)

일단 유의사항은 센세랑 대화하기 전에 먼저 문제를 활성화 하고 와야한다

![Image](https://github.com/user-attachments/assets/f1c7ad54-632c-4b25-9440-d59809ffa848)

뭐야 아닌데?

???????

![Image](https://github.com/user-attachments/assets/50caf196-2287-481d-9258-dafffa2189d4)

아 그럼 그렇지 뭔가 이상하더라고

플래그를 준게 아니라 말 그대로 문제에 쓰이는 암호를 준거였네요

### Challenge Programs

![Image](https://github.com/user-attachments/assets/ed86a4fa-5c00-4286-98be-f1b30f9f1f66)

이번 챌린지는 이전과 다르게 터미널 연다고 바로 실행되는게 아닌 `/challenge` 폴더 안에 `/challenge/solve` 프로그램을 실행시키라고 한다

![Image](https://github.com/user-attachments/assets/9de95477-a227-4dce-946f-47c642c94b8d)

좋습니다!

### The Flag File

![Image](https://github.com/user-attachments/assets/a5179b68-8603-4c00-95bd-84416bbc3708)

- 플래그는 **/flag** 파일 안에 들어있다
- **cat /flag**를 써서 읽어보고 싶겠지만 우리는 `hacker`유저로 실행중이다
- 지금까지는 루트 권한으로 실행되는 **/challenge/solve** 프로그램이 대신 /flag 파일을 읽고 내용을 출력해줬다
- 이 챌린지에서는 **/challenge/solve** 프로그램이 플래그를 직접 읽어서 출력하진 않지만, 대신 플래그 파일을 **world-readable(모든 사용자 읽기 가능)** 로 변경해준다

그럼 우리가 해야할 순서는 다음과 같다

1. `/challenge/solve`를 먼저 실행해서 플래그 접근 권한을 열고

2. 그 후에 cat /flag 명령어 등으로 직접 내용을 읽고

3. 결과를 제출

> 진행

![Image](https://github.com/user-attachments/assets/fc5e8d0c-3b5b-4062-be03-35704b8408bc)

확실히 권한이 없다

![Image](https://github.com/user-attachments/assets/e975d8ef-66e9-4904-9c23-5ee33ea61aae)

하지만 위 과정대로 하면 권한이 설정되어 (chmod 644) 플래그를 읽을 수 있게 된다

### Using Practice Mode

![Image](https://github.com/user-attachments/assets/ded1a008-eaa3-471c-a092-5693dd912791)

기본적으로 우리가 챌린지를 시작 할 때는 `Start`를 통해 들어갔고 `Practice`모드를 이용하면 `SUDO`로서 관리자 권한을 얻은 채로 이것 저것 더 찾아볼 수 있게 된다

> 해결 과정

1. **Practice** 모드로 챌린지를 실행한다
2. `/challenge/secret` 파일 내용을 읽은 뒤
3. **Start** 버튼을 눌러 일반 모드로 다시 실행
4. `/challenge/solve`에 비밀번호를 입력한다

![Image](https://github.com/user-attachments/assets/3ea4f9b1-711e-4535-b41a-d9de33e2512f)

**Practice** 모드에서 확인할 수 있듯이 `/challenge/secret`파일은 권한 문제로 `hacker`유저가 읽을 수 없다

![Image](https://github.com/user-attachments/assets/4919df0b-5243-45e3-85f4-c5af1042a270)

다시 **Start**로 돌아가서 암호를 넣으면 성공

### Persistent Home Directories - One

![Image](https://github.com/user-attachments/assets/a549b851-8087-4afd-8535-63715effe927)

vm에 파일이 유지된다는 것을 확인하기 위해 `/challenge/solve`에 따라 진행하면 된다네요

![Image](https://github.com/user-attachments/assets/d9e33b87-d26f-4dc5-8bff-36566ad60747)

이번에는 `/challenge/secret` 파일을 홈 디렉토리 아래에 **leap**이라는 디렉토리를 만들어 그 안에 복사해야 한다는군요

아래의 명령어들을 순서대로 실행하면 됩니다:

- 1. leap 디렉토리 생성 : `mkdir -p ~/leap`

- 2. /challenge/secret 파일을 ~/leap/secret 경로로 복사 : `cp /challenge/secret ~/leap/secret`

- 3. 다시 `/challenge/solve` 실행

![Image](https://github.com/user-attachments/assets/a0701e9a-cdab-4c0f-a52c-1f160406ecf4)

### Persistent Home Directories - Two

![Image](https://github.com/user-attachments/assets/6509f544-43f0-4bb1-9ee1-8c7c1125ac68)

이번 챌린지는 전에 만들었던 파일을 이용하는 문제라고 한다 일단 설명을 듣기 위해 `/challenge/solve`를 실행하란다

![Image](https://github.com/user-attachments/assets/12687436-862c-4bee-b308-4ba2f4826457)

이전에 정상적으로 파일을 만들어 넘어왔다면 바로 플래그를 얻을 수 있다

### Using the Dojo 끝

![Image](https://github.com/user-attachments/assets/2148a799-1aaa-48e9-b100-e4a7ff76f641)

이렇게 이제 가장 기초적인 모든 챌린지를 끝낼 수 있었다

![Image](https://github.com/user-attachments/assets/27b34069-ddca-4417-a6b8-a78343f5d150)

![Image](https://github.com/user-attachments/assets/c1f18d4e-4241-4c90-9906-5936495d0b4f)

다음은 `Linux Luminarium`이다