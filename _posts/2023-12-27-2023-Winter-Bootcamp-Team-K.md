---
title: 2023-Winter-Bootcamp-Team K
date: 2023-12-27 22:08:15 +09:00
categories: [Projects]
tags: [2024 실리콘벨리 겨울 부트캠프, Team K, 부트캠프, Frontend, Backend]
pin: true
---

> 부트캠프 시작
> 나는 사실상 지금까지 프론트엔드나 백엔드에 관한 것을 하나도 공부해 본 것이 없었기에 이번이 처음이다. 그렇다면 당연히 처음 배우는 것들을 공부해야겠지?

# 날짜별 일지

## 2일차 2023-12-28 (Git & Github)

git과 github에 관하여 배웠다.

github.io페이지 넘길 때에는 main브랜치에 바로 push pull했고 issue나 action에 관한 사용방법을 몰랐었는데 나중에 git에 관해 한번 다 정리해봐야겠다.

## 3일차 2023-12-29 (Chat Gpt를 사용하여 개발하기)

chat Gpt를 이용한 서비스를 만들게 될 것이다보니 아무래도 좀 많이 집중해서 들어야겠다. 우리는 GPT를 이용해서 캐릭터를 만들고 그 캐릭터와 대화하면서 영어실력을 향상시킬 수 있는 서비스를 만들 것이다.

> 다른 아이디어를 생각해 보라는....

사용할 것들 : chat GPT, RVS-TTS, STT, react, typescript 등등

## 4일차 2023-12-30 (프로젝트 관리와 커뮤니케이션)

> 아직도 아이디어 개발중... 으엑

react를 공부할 때에는 [생활코딩의 react강의](https://www.youtube.com/watch?v=t9e3hMJ_s-c&list=PLuHgQVnccGMCOGstdDZvH41x0Vtvwyxu7&index=5&t=233s)를 보면서 공부하고 있다.

추가로 아래 영상들을 보며 공부하고 있다.
![생활코딩](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/13daafcc-cf7e-4365-b29f-80fda6246d6d)

## 5-1일차 2023-12-31 (2023년의 마지막 날)

> 또 다른 아이디어!

택배 경로 최적화 서비스

### 기획 의도

---

전통적인 택배 배달 방식의 비효율적인 시간문제 환경 문제를 해결하기 위해 지하철을 활용한 배달 시스템 고안

### 기대 효과

---

- 지하철을 활용한 택배 어플리케이션을 제공함으로써 택배 배송의 문제점인 교통체증, 대기오염 등의 문제 해결
- 기존 물류 시스템보다 빠른 시간 내에 배송이 가능
- 택배 기사님들의 과도한 업무량 감소
- 누구나 택배기사가 될 수 있으므로 경제적인 효과?

> 그리고 파기

## 5-2일차 2023-12-31 (2023년의 마지막 날)

> 돌고돌아 음성 채팅이 되었다.

### 기획의도

---

유튜브에서 본인이 좋아하는 캐릭터의 성우와 이야기하면서 실제 캐릭터와 대화하는 느낌을 받으며 기뻐하는 컨텐츠를 보고 생각하게 되었다. 이를 보고 캐릭터의 성격이나 정보를 GPT에게 입력한 후 TTS를 기반으로 사용자가 해당 캐릭터와 대화를 하는 서비스가 있다면 좋을 것 같다는 생각에서 기획하게 되었다.

## 6, 7일차 2024-01-03 (UI/UX 설계 및 적용, 도커 & 도커 컴포즈)

[CSS 공부 시작](https://www.youtube.com/)

[HTML 공부 이어서](https://oil-lamp-cat.github.io/posts/html/)

[ERD cloud](https://shuu.tistory.com/64)

- npm 대신 Yarn을 사용해보자!
  [참고](https://velog.io/@nxnaxx/React-%EA%B0%9C%EB%B0%9C-%ED%99%98%EA%B2%BD-%EA%B5%AC%EC%B6%95-yarn%EA%B3%BC-CRA-%EC%84%A4%EC%B9%98)

api 설계(api 명세서 작성)

API 설계란?

애플리케이션(스마트폰, 카카오톡 서버 등 서로 다른 프로그램)이 인터페이싱하는(요청과 응답을 주고받는) 체계
[추가적인 내용](https://enjoyinjoanne.tistory.com/56)

[설계할 때 참고한 블로그](https://hackmd.io/@boostgroup3/S152Qkn_P)

## 8일차 2024-01-04 (DB, 프론트엔드 초기 세팅)

수업을 듣고나서 세팅을 해보려 했는데 자꾸 해깔려서 기록

- `npm install --global yarn vite`
- `yarn create vite [프로젝트 이름] --template react-ts`
- `yarn install`
- `yarn add  -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser`
- `yarn add -D eslint-config-airbnb-base eslint-plugin-import`
- `yarn add -D prettier`
- `yarn add -D tailwindcss postcss autoprefixer`
- `yarn add react-router-dom`
- `yarn dev`로 실행

## 2024-01-09

이제는 Typescript를 이용해서 웹사이트 퍼블리싱을 하기로 함. 타입스크립트관련 내용은 추후에 추가로 쓰겠다.
![2024-01-09](https://github.com/2023-Summer-Bootcamp-Team-G/frontend/assets/103806022/482ea619-7cc2-4aad-8e87-11c5937a140b)

타입스크립트에서 props사용하는 법을 잘 알지 못해 아무래도 여기 저기 찾아다녔고 결국 찾았다!
![스크린샷(187)](https://github.com/2023-Summer-Bootcamp-Team-G/frontend/assets/103806022/fdd2c37f-ba5c-4521-afff-8f90f6206a8c)

```escripttyp
type [이름] = {
  변수명?: [변수 타입];
}
```

변수명 뒤에 ?를 붙여 기본 설정하고 변수 타입을 설정할 수 있게 만들어준다.

![스크린샷(188)](https://github.com/2023-Summer-Bootcamp-Team-G/frontend/assets/103806022/bc19230e-52fc-43bb-afec-435ee7d6193b)

```typescript
export default function [함수명]({
  변수명 = '기본 설정 값',
  변수명,
} : [이름]){
  return(
    <div
    변수명1 = {변수명1}
    변수명2 = {변수명2}
    >{변수명3}</div>
  );
}
```

변수설정 할 때에 기본 설정을 해 놓으면 컴포넌트 사용할 때에 필수가 아닌 선택을 할 수 있게 된다.

![스크린샷(189)](https://github.com/2023-Summer-Bootcamp-Team-G/frontend/assets/103806022/638d898b-71cd-4f19-9dcd-1c233c8e2b40)

이 부분에서 중요한 곳은

```typescript
[css 변수]: ${(props) => (props.[css 변수] === '원하는 기본 명령어' ? '기본 명령어일 때 값' : props.[css 변수])}
```

이거를 이해하기 위해 거진 6시간동안 찾았고 역시 나는 이런거에 희열을 느끼는 사람인가보다. 다음 문제는 뭘까?

## 2024-01-09

> 오늘은 (로그인 안했을 시) 메인 페이지, 로그인 페이지, 회원가입 페이지를 만들었다.

![main page](https://github.com/2023-Winter-Bootcamp-Team-K/Front/assets/103806022/35049a1a-007f-4c65-9dd7-859864501727)
-> 메인 페이지

![login page](https://github.com/2023-Winter-Bootcamp-Team-K/Front/assets/103806022/94cbd5a0-9b6a-4b18-9c02-2e2aea80c0b2)
-> 로그인 페이지

![register page](https://github.com/2023-Winter-Bootcamp-Team-K/Front/assets/103806022/2be7ec1f-0ed9-4e42-aef2-e6e099dd6c0a)
-> 회원가입(아이디 비밀번호) 페이지

![register page2](https://github.com/2023-Winter-Bootcamp-Team-K/Front/assets/103806022/5cedd0e4-4fe6-4497-9b89-c3c211edb3fd)
-> 회원가입(개인정보) 페이지

styled component를 사용하게 되면 딱 css나 html문법만 사용하게 될 줄 알았는데 생각보다 하면서 뭔가 애니메이션도 넣고 싶은 생각이 들어 typescript를 좀 더 파봐야겠다. 일단 오늘 만든 것은 위 3페이지로 추가적으로 나중에 시간이 난다면 구름이나 꽃 등의 요소가 떠다니는 애니메이션을 넣고 싶다. 코드를 짜면서 오류가 나던 것들은 계속 캡쳐를 하고 있으니 나중에 모아서 오류들에 관한 이야기를 작성해 봐야겠다.

컴포넌트들(btn, id/pwinput)을 우리 입맛대로 조율할 수 있게 하려고 props를 추가하여 넣어주었다.

[github](https://github.com/2023-Winter-Bootcamp-Team-K/Front/pull/27)

> git 자주 쓰는 명령어

```git
git fetch
git switch 브랜치 이름(design/#1)

git add .
git commit -m '폴더'
git push origin main

git pull
```

### 오후

> 스크롤 바꾸미는 방법을 찾아 채팅창을 구현하는 중이다.

![scrollB](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/07bd4b23-390a-4f8b-99a2-6fc3907921f0)

-> 꾸미기 전

음... 브라우저마다 규칙이 달라서 이건 나중에 혼자 해보는 걸로....

## 2024-01-11

> 어제 하던 로그인 페이지, 회원가입 페이지를 완성했다. 추가로 카메라(react-webcam) 반응형을 구현하였다.

### 오늘의 문제

분명 같은 컴포넌트인데 자꾸 input창이 밖으로 나온다.

![비밀번호_box_layout](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/e1c291b4-785f-49a3-b0f3-c5d9b1176683)
![비밀번호_input_layout](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/37017faa-3375-41b4-88d3-4178554fc3f8)
![비밀번호_layout](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/4f3833f6-e38a-49b2-805a-8f37cb7ced07)

-> 비밀번호 layout

![아이디_box_layout](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/adfc106f-675c-452b-9c75-988393927fc1)
![아이디_input_layout](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/949588e2-fccc-4f0c-9542-4266c0428ee2)
![아이디_layout](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/5e7f6e29-78bf-4c9f-8ef0-07ff3abc2c46)

-> 아이디 layout

### 해결

일단 결론만 말하자면 width 설정을 해줄 때에 오류가 생긴 코드에서는 outbox layer와 input layer의 값이 동일하기에 margin을 주었을 때에 옆으로 삐져나가는 오류가 생긴 것이다. 해결하기위해 width 를 props로 주지 않고 100%로 설정하여 해결하였다.

```typescript
    @media all and (min-width: 391px) {
      width: ${(props) => (props.width === 'normal' ? '29.55rem' : props.width)};;
      height: 1.84725rem;
      font-size: 1.25rem;
      margin-left: 0.94rem;
    }
    @media all and (min-width: 390px) and (max-width: 790px) {
      width: ${(props) => (props.width === 'normal' ? '29.55rem' : props.width)};;
      height: 1.1425rem;
      font-size: 1rem;
      margin-left: 0.51rem;
    }
```

```typescript
    @media all and (min-width: 391px) {
      width: 100%;
      height: 1.84725rem;
      font-size: 1.25rem;
      margin-left: 0.94rem;
    }
    @media all and (min-width: 390px) and (max-width: 790px) {
      width: 100%;
      height: 1.1425rem;
      font-size: 1rem;
      margin-left: 0.51rem;
    }
```

### 지금까지의 결과물

![2024-01-11-18-07-26-Trim](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/720e2dcb-99ef-40a9-8468-db6ffff6de3f)

[[design] 회원가입 페이지 반응형 설정 #44](https://github.com/2023-Winter-Bootcamp-Team-K/Front/issues/44)

[[design] 로그인 페이지 반응형 설정 #38](https://github.com/2023-Winter-Bootcamp-Team-K/Front/issues/38)

[[design] 카메라 반응형 구현 #50](https://github.com/2023-Winter-Bootcamp-Team-K/Front/issues/50)

## 2023-01-12

오늘은 어제에 이어서 일기장 페이지 반응형을 설정하였고, webcam 모달을 퍼블리싱 하였다.

### 오늘의 실수

부모 요소를 자식요소한테 전해주려면 (width, height) display: flex;를 이용해야 한다. 이걸 해깔려서 분명 반응형 설정을 했는데 불구하고 카메라 캡쳐가 혼자 본래의 크기를 유지하고 있는 일이 생겼다. 그리고 \<webcam>에 width를 줄 때에 부모 크기에 맞출 수 있게 rem이나 px값이 아닌 100%로 줘야한다는 요령이 생겼다. 이러한 관계가 익숙해지면 훨씬 더 간단하고 효율적으로 코드를 짤 수 있지 않을까 생각해본다.

### 결과물

음.. 이미지가 너무 커서 github 호스팅이 안된다.

```
![df](../assets/img/post/winter_bootcamp/2024-01-12/2024-01-12%2022-09-48.gif)
```

생각보다 자잘한 문제들이 많아서 아무래도 조금 시간이 걸렸다. 확실히 만들기 전에 어떻게 코들를 짤지 박스로 그림을 그려놓고 만드는 것이 좋은 것 같다.

그리고 확실히 나는 적어도 6시간은 자야겠다. 아무래도 효율이 좋지 않다.

- [[design] CameraModal.tsx 퍼블리싱 ](https://github.com/2023-Winter-Bootcamp-Team-K/Front/issues/61)
- [[design] result 페이지, chattingResult 컴포넌트(반응형x) 생성 ](https://github.com/2023-Winter-Bootcamp-Team-K/Front/issues/59)
- [[design] 일기장 페이지 반응형 설정](https://github.com/2023-Winter-Bootcamp-Team-K/Front/issues/55)

이제 백엔드에서 만든 api를 연동해야 하는데.. 백엔드에서 작업을 끝낼 때 까지 어떻게 연동해야하는지 그리고 Zustand, useEffect 함수에 관해 공부하고 있어야겠다.

### 2024-01-13 02/37

추가적으로 변경사항이 생겼다.

[[design/#69] chatInfo 컴포넌트 생성 및 chatpage 레이아웃 조정 ](https://github.com/2023-Winter-Bootcamp-Team-K/Front/pull/70)

![스크린샷(210)](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/da3e4c21-f42b-4920-b0a5-2e1f369106a1)

## 2024-01-13

시작부터 오류를 발견했다..

> chunk-GZ55BCQ2.js?v=bed9aa86:521 Warning: React does not recognize the `marginBottomPTT` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `marginbottomptt` instead. If you accidentally passed it from a parent component, remove it from the DOM element.

콘솔창이 말하길 pops 명에 대문자가 포함되어 있어 문제가 생기고 있다 한다.

아.. 미리 체크 해볼걸.. 또 새로운 것을 알아간다..

![스크린샷(216)](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/088ad40d-0792-4fa7-84b8-9b284a9f2ce9)

세상에 이걸 다 바꿔야한다니... 연결되어있는 page가 좀 많이 많은데..

![스크린샷(215)](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/6d8c25f0-961b-4798-913a-56362c1141e7)

### 저녁

![스크린샷(219)](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/9fa8a7fa-d98b-4282-b938-9b68e897af7a)

해결을 이해 marginbottomptt에 값을 넣어주었다.

## 2024-01-14

### 오전

정규식표현을 적용하여

- 비밀번호 : 6자리 이상 영어, 숫자 포함
- 이름 : only 한글
- 생년월일 : YY-MM-DD 형식으로 YY 4, MM 2, DD 2자씩 입력해야 통과할 수 있게 만들었다.

```typescript
/// 비밀번호
/^(?=.*[a-zA-Z])(?=.*[0-9]).{6,25}$/

/// 생일
/[0-9]{4}-[0-9]{2}-[0-9]{2}/i

/// 이름
/^[ㄱ-ㅎ|가-힣]+$/

```

![2024-01-14 14-46-13 - Trim](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/9d4abfc9-fe31-4d33-9488-c1df7616be58)

## 2024-01-16

일기장 생성 api연동, diarypage에서 메인으로 가는 버튼 추가, result 페이지 퍼블리싱을 하였다. 사실 이번에는 백엔드와 axios로 api연동하는 작업을 많이 했다.

![2024-01-16 00-10-05 - Trim](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/62928d2f-5f74-4712-8946-287c1f7fe0e9)

[[feat/#77] 일기장 생성 및 diarypage 메인으로 가기 버튼 추가](https://github.com/2023-Winter-Bootcamp-Team-K/Front/pull/82)

[[design/#83] result 페이지 퍼블리(채팅기록 페이지 퍼블리싱)](https://github.com/2023-Winter-Bootcamp-Team-K/Front/pull/84)

## 2024-01-17

### 새벽

일단 어제, 오늘은 swagger연동과 웹소켓 연결을 하였고 추가적으로 웹소켓 시작 세팅(첫 대화 시작 연동을 하였다)

웹소켓 연결을 할 때에 다른 라이브러리를 사용하지 않고 그냥 WebSocket을 사용하였다.

[[design] 채팅기록 페이지 퍼블리싱](https://github.com/2023-Winter-Bootcamp-Team-K/Front/issues/83)

[[feat] 채팅 페이지 웹소켓 연결](https://github.com/2023-Winter-Bootcamp-Team-K/Front/issues/85)

[[feat] 일기장 생성 ](https://github.com/2023-Winter-Bootcamp-Team-K/Front/issues/77)

[[feat] 웹소켓 기분설정, 첫 대화 시작](https://github.com/2023-Winter-Bootcamp-Team-K/Front/issues/90)

### 저녁

웹소켓 연결, 연결 해제, 웹소켓 연결하면 연결 되었다고 백엔드에 요청 보낸 후 요청을 받아서 character별로 분류하여 리스트에 넣고 tts는 blob형태를 다시 base64 디코딩하여 소리로 출력할 수 있게 만들었다.

```javascript
const audioBlob = messageReceived.data.audioBlob;
let snd = new Audio(`data:audio/x-wav;base64, ${audioBlob}`);
snd.play();
```

- javascript에서 blob형태를 base64 디코딩하여 소리로 변환하는 코드

[[Feat/#90] 웹소켓 연결 및 연결 해제](https://github.com/2023-Winter-Bootcamp-Team-K/Front/pull/97)

## 2024-01-18

아래와 같은 오류가 발생하는 이유는 부모 컴포넌트에서 자식 컴포넌트로 props를 옮겨 오는 과정에서 styled-components 콘솔 오류가 발생하는 듯 하다.

![캡처](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/95c28288-bc00-4c2e-9f6f-71c7b5093c7b)

```
styled-components: it looks like an unknown prop "prop이름" is being sent through to the DOM, which will likely trigger a React console error. If you would like automatic filtering of unknown props, you can opt-into that behavior via <StyleSheetManager shouldForwardProp={...}> (connect an API like @emotion/is-prop-valid) or consider using transient props ($ prefix for automatic filtering.)
```

이 오류를 해결하기 위해 자식 컴포넌트에 $를 붙여 해결하였다.

![props 오류](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/d8872ae6-e9a0-4a64-9fa7-af402f744648)

![props 오류 2](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/f9ab4c55-57ab-4c35-b74c-e84fb7e10d5e)

![props 오류 3](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/e3aee7e7-bbe1-45cd-ad2c-952e79d6a131)

## 2024-01-19

### 새벽

- 페이지 이동하였을 때에 다이어리 아이디 받지 못하던것 다이어리 생성할 때에 다이어리 아이디 localstorage에 저장해놓았다가 꺼내서 사용
- 다이어리 백그라운드 이미지 않뜨던 것 이미지 위치를 src로 받아줘야했음.

나머지는 있다가 나가서 하는걸로.

[[feat] 채팅 기록 보기 페이지 api 연동](https://github.com/2023-Winter-Bootcamp-Team-K/Front/issues/102)

## 2023-01-20~22

### 새벽

- 웹소켓에 녹음 기능 연동하는중... 3일째

javascript로 화면을 녹화할 때에는 그냥 react-webcam을 사용하여 처리하였으나 녹음기능을 처리할 때에는 MediaRecorder를 사용하여 미디어 풀을 만들고 blob형태로 받고 base64처리해서 보내야했기에 정말 많은 시간이 걸렸다. 나중에 MediaRecorder에 관한 것으로만으로도 글을 쓸 수도 있을 정도로 어렵더라...

오늘은 웹소켓 녹음 기능을 websocket과 연결하여 대화하는 것에는 성공했으나 justand문제인지 비동기 문제인지 가장 중요한 대화에서 문제가 생긴다.

```
쿼카: 1질문
나: 1대답
쿼카: 2질문
나: 2대답
```

이런 방식으로 대화해야 하지만 현재

```
쿼카: 1질문
나: 0대답
쿼카: 0대답에 대한 질문
나: 1질문에 대한 대답
```

이런식이다.. 으악

![스크린샷(252)](https://github.com/2023-Winter-Bootcamp-Team-K/Front/assets/103806022/a4e6dc60-5bc1-4a67-9e0d-d1f8bb92ef34)

추가적으로 분명 ToggleRecording이 false값인데 녹음을 시작하게 되는 이 상황을 해결해야한다... 도대체 뭐지 진짜

![스크린샷(256)](https://github.com/2023-Winter-Bootcamp-Team-K/Front/assets/103806022/529a4444-33bc-44c3-9c15-36725ad738f0)

어쨰서 false값이 들어온 후에 바로 true 값이 되는지 찾아봐야겠다. 이제는 true값이 되어야하는게 false값이 들어와있다... 허허

![스크린샷(257)](https://github.com/2023-Winter-Bootcamp-Team-K/Front/assets/103806022/b2ba2b9c-647b-4f02-80d9-d73dec6734b7)

[[feat] 녹음 기능 웹소켓 연결](https://github.com/2023-Winter-Bootcamp-Team-K/Front/issues/109)

### 오후

ToggleRecording이 true로 바뀌지 않는 이유는 찾았다. 아래 코드에서 RecordToggle을 log찍는 순간이 setTimeout안에서 setRecordToggle로 바뀌는 함수 안에 있기에 변화가 생기지 않는다고 한다.

```javascript
        snd.addEventListener('loadedmetadata', (event) => {
          const sndElement = event.currentTarget as HTMLAudioElement;
          const QuokkaTime = sndElement.duration * 1000;
          console.log('시간지연 테스트', QuokkaTime);
          setTimeout(() => {
            console.log('쿼카 말 끝남');
            setRecordToggle(true); //true 인데
            console.log('RecordToggle(true 여야함): ', RecordToggle); //false래 말이 됨?
            console.log('레코드 시작1');
          }, QuokkaTime);
```

이 코드를

```javascript
        snd.addEventListener('loadedmetadata', (event) => {
          const sndElement = event.currentTarget as HTMLAudioElement;
          const QuokkaTime = sndElement.duration * 1000;
          console.log('시간지연 테스트', QuokkaTime);
          setTimeout(() => {
            console.log('쿼카 말 끝남');
            setRecordToggle(true); //true 인데

            console.log('레코드 시작1');
          }, QuokkaTime);
            console.log('RecordToggle(true 여야함): ', RecordToggle); //false래 말이 됨?
```

이런식으로 만들면 로그에는 이제 제대로 true값이 나오게 될 것이다.

### 대화 밀림 현상 해결

아래 코드에서 나는 python과 c, c++ 쪽만 공부해봐서 설마 이런 이유일 거라고는 생각을 못했었다. 분명 나는 toggleRecording이 실행되고 setSendAudio가 실행될 것이라고 생각했는데 놀랍게도 setSendAudio가 먼저 실행되었다... 와우

```javascript
// 버튼 클릭 핸들러
const handleButtonClick = () => {
  setRecordToggle(false); // true이면 녹음 시작 false면 중지
  toggleRecording();
  setSendAudio(true); // 오디오 보내기 상태관리
};

'''생략'''

        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          const base64Audio = fileReader.result as string;
          const resultAudio = base64Audio.split(',')[1];

          // console.log('오디오 설정', resultAudio);
          window.localStorage.setItem('Audio', resultAudio);
          setAudio(resultAudio);
        };
        fileReader.readAsDataURL(audioBlob);
      });
```

이를 해결하기 위해 아래와 같이 코드를 개편하였다. 이리하여 오디오가 저장된 뒤 오디오를 websocket으로 전송하였다. 멘토님 감사합니다!! 진짜 세상에 이런 문제일줄이야.

```javascript
// 버튼 클릭 핸들러
const handleButtonClick = () => {
  setRecordToggle(false); // true이면 녹음 시작 false면 중지
  toggleRecording();
};

'''생략'''

        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          const base64Audio = fileReader.result as string;
          const resultAudio = base64Audio.split(',')[1];

          // console.log('오디오 설정', resultAudio);
          window.localStorage.setItem('Audio', resultAudio);
          setAudio(resultAudio);
          setSendAudio(true); // 오디오 보내기 상태관리
        };
        fileReader.readAsDataURL(audioBlob);
      });
```

### 저녁

- 2024-01-22 남은일

- 날짜 1일씩 뒤로 밀리는 이슈 확인
- 맵을 통한 채팅 구현
- diarypage 이미지 크기 조정
- gif, 정적 이미지 처리
- 리액트 쿼리를 통한 폴링 구현
- resultpage 구현

## 2024-01-23

### 오후

이제 대화하는 것까지 해결했으니 대화한 내용이 채팅창에 뜰 수 있게끔 작업을 해줘야 한다.

문제 : 아이 메세지나 쿼카 메세지가 들어오면 들어온 내용을 바로 chatting 컴포넌트로 보내서 띄워주려 하였으나 아래 사진과 같이 tts가 끝난 후에야 컴포넌트가 변경된다.

![스크린샷(279)](https://github.com/2023-Winter-Bootcamp-Team-K/Front/assets/103806022/43adb1f4-4c9c-4a7a-8b1c-b3d8b2d5fe2f)

### 저녁 & 새벽(2024-01-24)

일단 위에 작업은 작동'은' 하기에 두고 다음 작업을 하였다. 페이지 렌더링 순서 문제인 듯 한데.. 음.. 아직 어렵다

- 대화 쌓이면 스크롤 아래로 내리기

```javascript
---생략---

const messageLayOutRef = useRef<HTMLDivElement | null>(null);

---생략---

//스크롤부분
useEffect(() => {
  const messageLayOutElement = messageLayOutRef.current;
  if (messageLayOutElement) {
    messageLayOutElement.scrollTop = messageLayOutElement.scrollHeight;
  }
});

---생략---

//적용부분
return (
<ChatBoxLayout ref={messageLayOutRef}>
)

---생략---

```

- 로그인 되어있을 때에 /login 페이지로 가면 로그인 되어있는 토큰 읽어서 바로 main페이지로 이동

```javascript
useEffect(() => {
  const cookie = getCookie("token");
  if (cookie) {
    navigate("/main");
  }
});
```

- 경로 오류

```javascript
import loadingLottie from "/src/assets/lottie/Animation - 1704999772308.json";
```

```javascript
import loadingLottie from "../../assets/lottie/Animation - 1704999772308.json";
```

---

추후 해야하는 것들

- 로그아웃 시 토큰 지우기
- 채팅 렌더링 조정해서 실시간으로 뜰 수 있게 하기
- resultPage 반응형
- 폴링 구현
- 아이디 중복확인 안하면 안넘어가도록
- 쿼카 처음에 말하는거 gif 움직이도록
- 대화 끝내기 컴포넌트 쿼카가 이야기할 때에는 안보이도록
- 다이어리 페이지 line-height 재설정
- 쿼카가 말할 때 잠깐 기다려줘 문구 띄우기 + 쿼카 차례에 둥실거리게 하기

![스크린샷(289)](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/59789ba2-b08d-4781-80f6-909f788012de)

![스크린샷(293)](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/c447986e-4a68-4bb0-8371-6b829fcbd075)

생각해보니 뭔가 많이 남았다...

---

오늘의 작업

[[Feat/#109] 웹소켓 에러 해결](https://github.com/2023-Winter-Bootcamp-Team-K/Front/pull/118)

[[Fix/#127] 빌드 성공](https://github.com/2023-Winter-Bootcamp-Team-K/Front/pull/129)

[[Design/#121] 대화 모달 퍼블리싱 완성(?), 로그인페이지에서 쿠키 있으면 이동](https://github.com/2023-Winter-Bootcamp-Team-K/Front/pull/126)

## 2024-01-24

### 오후

로그아웃 했을 때 토큰 삭제

-> 토큰 제거

```javascript
  const logout = async () => {
    const refresh = getCookie('refresh_token');
    removeCookie('token');
    removeCookie('refresh_token');
```

-> 토큰 관련 함수

```javascript
import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name: string, value: string, options: any) => {
  return cookies.set(name, value, { ...options });
};

export const getCookie = (name: string) => {
  return cookies.get(name);
};

export const removeCookie = (name: string) => {
  return cookies.remove(name, { path: "/" });
};
```

### 새벽 (2024-01-25)

쿼카가 말을 할 때에는 대화를 끝내지 못하게 만들었다.

```javascript
<QuitChatBtn onClick={handleQuitChat} disabled={exitToggle}>
  대화 끝내기
  {exitToggle === true && <ButtonImage src="src/assets/img/QuitIcon2.png" />}
  {exitToggle === false && <ButtonImage src="src/assets/img/QuitIcon.png" />}
</QuitChatBtn>
```

위 코드에서 QuitChatBtn은 styledcomponent.button으로 구성되어있다보니 disabled를 나는 분명 그냥 props 이름으로 사용하려고 했는데 disabled true면 버튼이 눌리지 않는 해프닝이 있었다.

```javascript
<QuitChatBtn onClick={handleQuitChat} disabled={exitToggle}></QuitChatBtn>
```

살다살다 Docker Desktop 오류가 이런건 또 처음본다. CPU가 161%라뇨 선생님 이게 무슨 말씀이세요... 윈도우에서 도커 사용하는 것은 어려운가보다.

![스크린샷(306)](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/8fdcbd5f-1ba0-4d34-b8f5-3208ebe0c364)

[[feat] 대화 끝내기 컴포넌트 쿼카가 이야기할 때에는 안보이도록 설정 #137](https://github.com/2023-Winter-Bootcamp-Team-K/Front/issues/137)

[[design#139] 404페이지 퍼블리싱 및 다시시도하시옹](https://github.com/2023-Winter-Bootcamp-Team-K/Front/pull/140)

## 2024-01-25

### 오후

쿼카가 말할 때에 애니메이션 넣기

```javascript
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const SpeakingQuakkaAnimate = styled.img`
  animation: ${bounce} 2s ease-in-out infinite;
`;
```

- 대화가 들어오기 전에 기다려줘 문구
- 쿼카가 말하는 도중에 끝내기 버튼과 마이크 버튼 못 누르게 설정
- 쿼카가 말할 때 애니메이션 추가

### 새벽 (2024-01-26)

chatpage 로그인 후 접속하면 오류 발생

```javascript
const Mood = window.localStorage.getItem("mood");
```

위 코드의 실행 위치를 함수 내로 설정해주어 변수를 함수 실행 시 가져올 수 있게 하였다.

[대화 감정 불러오기 해결](https://github.com/2023-Winter-Bootcamp-Team-K/Front/commit/4e5290c55960aaceae369ab79779095902cef9b8)

![2024-01-25 16-49-56](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/808fac68-3151-4e64-8d5f-eb970e07c7e0)

[[feat/#141] 기다려줘 문구, 쿼가가 말하는 도중에 끝내기(마이크) 못 누르게, 쿼카 어화둥둥~](https://github.com/2023-Winter-Bootcamp-Team-K/Front/pull/143)

그리고 .. 오늘이 내 발표일 으악

## 2024-01-27

채팅 시작을 하자마자 녹화가 되는 문제 해결... zustand 상태관리값이 페이지를 이동해도 여전히 남아있었다... 그래서 우리는 페이지가 이동되면 F5가 눌리게 하거나 zustand를 리셋시킬 예정이다. 라고 했으나 이것은 다른 문제였다는 이야기... 아래 방법으로 해결하였다.

```javascript
import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

type ChatStore = {
  RecordToggle: boolean;
  isShowChar: boolean;
  audio: string;
  sendAudio: boolean;
  plzWait: boolean;
  exitChat: boolean;

  setIsShowChar: (isShowChar: any) => void;
  setRecordToggle: (RecordToggle: any) => void;
  setAudio: (audio: any) => void;
  setSendAudio: (sendAudio: any) => void;
  setPlzWait: (plzWait: any) => void;
  setExitChat: (exitChat: any) => void;
};
type UserPersist = (
  config: StateCreator<ChatStore>,
  options: PersistOptions<ChatStore>
) => StateCreator<ChatStore>;

export const useChatStore = create<ChatStore>(
  (persist as UserPersist)(
  (set) => ({
    RecordToggle: false,
    isShowChar: false,
    audio: 'none',
    sendAudio: false,
    plzWait: false,
    exitChat: true,

    setRecordToggle: (RecordToggle) => set({ RecordToggle: RecordToggle }),
    setIsShowChar: (isShowChar) => set({ isShowChar: isShowChar }),
    setAudio: (audio) => set({ audio: audio }),
    setSendAudio: (sendAudio) => set({ sendAudio: sendAudio }),
    setPlzWait: (plzWait) => set({ plzWait: plzWait }),
    setExitChat: (exitChat) => set({ exitChat: exitChat }),
  })
   {
     name: 'chat-StoreName',
   }
 )
);
```

위 코드를

```javascript
import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

type ChatStore = {
  RecordToggle: boolean,
  isShowChar: boolean,
  audio: string,
  sendAudio: boolean,
  plzWait: boolean,
  exitChat: boolean,

  setIsShowChar: (isShowChar: any) => void,
  setRecordToggle: (RecordToggle: any) => void,
  setAudio: (audio: any) => void,
  setSendAudio: (sendAudio: any) => void,
  setPlzWait: (plzWait: any) => void,
  setExitChat: (exitChat: any) => void
};
// type UserPersist = (
//   config: StateCreator<ChatStore>,
//   options: PersistOptions<ChatStore>
// ) => StateCreator<ChatStore>;

export const useChatStore =
  create <
  ChatStore >
  // (persist as UserPersist)(
  ((set) => ({
    RecordToggle: false,
    isShowChar: false,
    audio: "none",
    sendAudio: false,
    plzWait: false,
    exitChat: true,

    setRecordToggle: (RecordToggle) => set({ RecordToggle: RecordToggle }),
    setIsShowChar: (isShowChar) => set({ isShowChar: isShowChar }),
    setAudio: (audio) => set({ audio: audio }),
    setSendAudio: (sendAudio) => set({ sendAudio: sendAudio }),
    setPlzWait: (plzWait) => set({ plzWait: plzWait }),
    setExitChat: (exitChat) => set({ exitChat: exitChat })
  }));
//   {
//     name: 'chat-StoreName',
//   }
// )
```

대화 끝내기를 누른 후에도 음성녹음이 지속되는 문제를 해결하기 위해 대화가 끝나면 녹음을 종료하지만 음성녹음이 된 파일을 전송하지 않아 대화가 지속되지 않지만 동시에 마이크 녹음은 종료 할 수 있도록 하였다.

[[feat/#149] 쿼카 대화 음성녹음 오류 해결 main에서...](https://github.com/2023-Winter-Bootcamp-Team-K/Front/commit/b6f7fd7fe6591b65a7c13801219baa56f4552b9a)

### 새벽 (2024-01-28)

아래 코든는 대화 관련 코드인데 지금 한 글자씩 나오는 코드를 작성하던 중 가장 처음 생각했던 바로바로 한 문장씩 나오는 코드를 만들어버렸다. 근데 이유를 이해하지 못해서 이곳에 저장

<details><summary>Chatting.tsx</summary>
<div markdown = "1">

```javascript
import styled from 'styled-components';
import MyMessage from './MyMessage';
import OpponentMessage from './OpponentMessage';
import { useEffect, useState } from 'react';
import AudioRecorder from './AudioRecorder';
import { useRef } from 'react';

type ChatBoxProps = {
  sendChatArray: any[];
  sendChatting: any[];
};

export default function ChatBox({ sendChatArray, sendChatting }: ChatBoxProps) {
  const [messages, setMessages] = useState<
    { character?: string; message?: string }[]
  >([]);
  const [chat, setChat] = useState<{ character?: string; message?: string }[]>(
    []
  );
  const messageLayOutRef = useRef<HTMLDivElement | null>(null);

  const [End, setEnd] = useState<{ character?: string; message?: string }[]>(
    []
  );

  let Middle = [];

  //스크롤부분
  useEffect(() => {
    const messageLayOutElement = messageLayOutRef.current;
    if (messageLayOutElement) {
      messageLayOutElement.scrollTop = messageLayOutElement.scrollHeight;
    }
  });

  useEffect(() => {
    let test1 = [];
    let test2 = [];

    if (sendChatArray !== messages) {
      setMessages(sendChatArray);
      test1 = sendChatArray;
      console.log('messages', messages);
    }

    if (sendChatting !== messages) {
      setChat(sendChatting.flat());
      test2 = sendChatting;
      console.log('chat', chat);
    }

    Middle = test2.flat();
    Middle = Middle.concat(test1);

    setEnd(Middle);
    console.log(End);
  }, [sendChatArray, sendChatting]);

  return (
    <ChatLayout>
      <ChatBoxLayout ref={messageLayOutRef}>
        {End.slice(0, End.length - 1).map((message, index) => {
          if (message.character === 'quokka') {
            return (
              <OpponentMessage key={index} chatMessage={message.message} />
            );
          }
          if (message.character === 'child') {
            return <MyMessage key={index} chatMessage={message.message} />;
          }
          return null;
        })}
      </ChatBoxLayout>
      <TextBox>말을 다하면 나를 눌러줘</TextBox>
      <AudioRecorder />
    </ChatLayout>
  );
}
//생략//

```

</div>
</details>

.slice라는 함수를 지우게 되면 우리가 생각했던 한단어씩 나오는 상황이 된다. 다만 마지막에 이상한 것이 끼어있다.

test1과 test2는 usestate를 실행하게 되면 그 때마다 리셋시키기에 여기서 문제가 생긴것 같다 아마도?
[[commit] 2024-01-28-03-13 문장 하나씩 추출 성공](https://github.com/2023-Winter-Bootcamp-Team-K/Front/commit/251a3a48dd74516b395cd7a5609c35af43e5af37)
[[commit] 리엑트가 싫다](https://github.com/2023-Winter-Bootcamp-Team-K/Front/commit/c9d1094c818b72f3c651e87c1b6f08190a1ea01c)

## 2024-01-29

### 04시 19분

```javascript
interface ImageModalProps {
  picture: string;
}

export default function ImageModal({ picture }: ImageModalProps) {
  const [quokkaImage, setquokkaImage] = useState(false);

  if (picture === "src/assets/img/DefaultResultImage.png") {
    setquokkaImage(true);
  } else {
    setquokkaImage(false);
  }

  return (
    <Overlay>
      <ModalContainer>
        {quokkaImage ? (
          <CapturedQuokkaImage src={picture} />
        ) : (
          <CapturedImage src={picture} />
        )}
      </ModalContainer>
    </Overlay>
  );
}
```

위 컴포넌트를 실행시키자 무한 렌더링 오류가 발생하였다.

생각해보니 setQuokkaImage가 변경될 때마다 페이지가 다시 렌더링되고 그러면 또 변경하여 무한 반복을 하게 된다.

이를 해결하기 위해 useEffect를 걸었다. 나는 useEffect가 마운트 언마운트 될 때 실행될 수 있게만 해주는 건줄 알았는데 이런식으로 렌더링 제한을 주는 방법은 생각을 못했었다. G선생 인정.

```javascript
useEffect(() => {
  if (picture === "src/assets/img/DefaultResultImage.png") {
    setquokkaImage(true);
  }
}, [picture]);
```

[[Feat/#151] 채팅 해결](https://github.com/2023-Winter-Bootcamp-Team-K/Front/pull/155)

### 저녁

페이지의 크기가 변경될 때마다 변수 값을 변경시켜주려 하였다. 찾아보니 EventListener를 통해 '사이즈 변경되고 있을 때'라는 "resize"를 적용해줄 수 있었다. 또한 EventListener는 페이지 마운팅 될 때에 생성하고 unmount 될 때에 EventListner를 삭제시켜주었다.

```javascript
//크기에 따른 isModal open 값 변경
const handleResize = () => {
  setIsModalOpen(window.matchMedia("(max-width: 390px)").matches);
};

useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

도커 빌드 하는 과정에서 아래와 같은 오류를 발견하였다.
![스크린샷(357)](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/fdf1d8f3-fcab-42a2-a061-96ad10f58ac9)

```log
Mixed Content: The page at 'https://talktaka.site/signup' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://talktaka.site/check/id/availability/?id=1q2w3e4r'. This request has been blocked; the content must be served over HTTPS.
```

이유인 즉 "암호화된 Https페이지에 암호화되지 않은 Http를 통해 요청을 할 때에 발생하는 에러" 였다.
페이지는 HTTPS, API는 HTTP 였다.

해결하기 위해 아래 코드를 index.html \<head>\</head>코드에 추가해주었다.

```html
<meta
  http-equiv="Content-Security-Policy"
  content="upgrade-insecure-requests"
/>
```

[[refactor/#157] result 페이지 Refactoring](https://github.com/2023-Winter-Bootcamp-Team-K/Front/pull/158)

## 2024-01-30

### 오후

![스크린샷(360)](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/0a091b22-192d-4ec5-b441-d474da6bd607)

input 태그가 password 타입일 경우 form 태그로 감싸주라고 한다. 근데 이 문제가 window사용자인 나의 chrome에서만 발생하기에 일단은 냅두고 다른 컴포넌트의 props console 오류를 해결하였다.

[[refactor/#157] result 페이지 Refactoring](https://github.com/2023-Winter-Bootcamp-Team-K/Front/pull/158)

## 2024-01-31

빌드하고 배포하는 과정에서 이미지가 출력되지 않는 문제가 생겨 찾아보다 아래 방법을 찾았다.

[[React] Styled-Component 이미지 경로 지정](https://velog.io/@narcoker/React-Styled-Component-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EA%B2%BD%EB%A1%9C-%EC%A7%80%EC%A0%95)

프론트엔드 배포환경을 테스트 할 때에

```console
yarn build

npx serve -s ./dist
```

로 테스트 해 볼 수 있다는 것을 알았다. (이걸 이제 알았네)

npm, yarn: 페키지 메니저 (진짜 설치)

npx: cra, serve 등 실행 할 때만 필요하고 그 후에는 삭제시킨다는 의미

## 2024-02-01

이제 2달이 지났다. 나는 그동안 코딩을 혼자 필요할 때에 여기저기 찾아서 공부를 했기에 이렇다 할 길을 찾지 못했었다. 하지만 이번 기회에 협업을 하고 진짜 프로젝트를 만들어보며 되게 식견이 넓어졌다. 이런식으로 계속 발전할 수 있다면 좋겠다.

[[feat/#165] diary 대기시간동안 modal 띄우기](https://github.com/2023-Winter-Bootcamp-Team-K/Front/pull/166)

## 2024-02-02

### 오후

일단 어제 오늘 해뜨는 것을 보면서 결국 배포에 성공했다. [http 버전(이였던것)](https://talktaka.site/)일단 아직은 Amazon https 승인이 나지 않아 http 버전으로 설정해 놓았다.

지금까지 로컬 환경에서의 설정과 배포 환경에서 URL 주소 설정 값에 많은 차이가 있어 문제가 생겼었다. 또한 아래 목록을 변경하여 배포에 성공하였다.

- nginx 볼륨 추가
- frontend 볼륨 추가
- frontend dockerfile 변경사항
- frontend location url 변경(nginx conf)

## 2024-02-07

이미 이번 부트캠프가 끝난 지는 좀 지났지만 아직도 2달동안 아침에 일어나서 밥 먹고 코딩하고 점심먹고 코딩하고 잠 자기 전까지 코딩하던 그 느낌이 사라지지 않아 뭔가 해야겠다는 기분이 계속 든다. 처음에 부트캠프 시작할 때에는 내가 지금까지 공부해오던(사실 내가 공부하던 것들은 좀 많이 중구난방 이었지만) 것들과 다른 웹서비스 계발을 하게 되어 내가 이 부트캠프를 참여하는 것이 맞을까? 차라리 휴학하고 있는 이 시간에 다른 것들을 찾아서 공부하는 것이 좋지 않을까? 하는 생각이 안들었냐고 하면, 음 처음엔 정말로 많은 생각을 했었다. 하지만 이번에 팀원들에게 정말 많은 것을 배우고 협업을 하고 직접 퍼블리싱을 하고 나를 한계까지 밀어넣으면서 계발을 해본 이 경험이 나에게 정말로 큰, 내가 더 넓은 세상을 볼 수 있게 해주는 계기가 되었다. 우리팀의 막내로서 프로젝트에 필요한 지식이 없던 나를 이끌어주고 격려해준 우리 팀원들에게 너무나 고마운 마음이다. 올해부터 3년간(1년 휴학, 2년 사회복무요원 근무) free이니 언제든 필요하면 불러주세요! 정말로 고마웠습니다! 최고의 K팀!

![JHB](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/8bcbfbcf-098d-4c2a-81eb-55a2369c02c2)

# 공부할 때에 도움이 된 것들

> 이기는 한데 코드를 짤 때에 이미 너무 많은 것들을 찾아봐서 저장하기 어려울지도?

css

- [스크롤 꾸미기!](https://inpa.tistory.com/entry/CSS-%F0%9F%8C%9F-%EC%8A%A4%ED%81%AC%EB%A1%A4-%EB%B0%94Scrollbar-%EA%BE%B8%EB%AF%B8%EA%B8%B0-%EC%86%8D%EC%84%B1-%EC%B4%9D%EC%A0%95%EB%A6%AC)
- [FlexboxFroggy](https://flexboxfroggy.com/#ko)
- [WEB2-CSS](https://youtube.com/playlist?list=PLuHgQVnccGMAnWgUYiAW2cTzSBywFO75B&si=LZxR-ue8zYp82oOh)

javascript

- [WEB2-JavaScript](https://youtube.com/playlist?list=PLuHgQVnccGMBB348PWRN0fREzYcYgFybf&si=5-6IckN6-OTd5cwx)

react

- [2022 코딩애플 리액트 강의](https://www.youtube.com/playlist?list=PLfLgtT94nNq0qTRunX9OEmUzQv4lI4pnP)
- [react-webcam + TypeScript](https://dev.to/sababg/react-webcam-typescript-gh2)

git

- [Learning git branch](https://learngitbranching.js.org/?locale=ko)

색상 추천

- [color space](https://mycolor.space/?hex=%23FEC479&sub=1)

DB

- [VS-code에서-MySQL-연동하기](https://velog.io/@milkim0818/VS-code%EC%97%90%EC%84%9C-MySQL-%EC%97%B0%EB%8F%99%ED%95%98%EA%B8%B0)

https://codingbat.com/java

[다시시도하시옹]
