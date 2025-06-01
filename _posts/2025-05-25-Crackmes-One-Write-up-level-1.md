---
title: "[Reversing] Crackmes.one 문제 풀어보기 - Level 1"
date: 2025-05-25 21:44:00 +09:00
categories: [windows, crackmes.one, hacking]
tags: [reversing]
pin: true
---

## 시작

동아리 활동을 하면서 이제 본격적으로 공부에 들어감에 있어 시작은 `Windows Reverse Engineering`을 하기로 했다

그리고 그에 따라 책을 읽으며 이론을 다지기도 하고 직접 문제를 풀어보며 실습도 할 것이고 여기서는 `crackmes.one`이라는 사이트의 문제들을 풀어보도록 하겠다

## 첫번째 도전 (with. x32dbg)

이번에 풀어볼 문제는 **Crypt0's Crypt0 - Beginner CrackMe**되시겠다

![Image](https://github.com/user-attachments/assets/12c60ac2-4903-4847-ba03-6e0372d0457f)

아 참고로 여기서 `Download` 버튼을 눌러 문제를 받고 나면 **.zip** 파일을 받게 되는데 이 압축 파일의 비밀번호는 

![Image](https://github.com/user-attachments/assets/3e0d2fe5-6655-45b5-889f-43d751c54dec)

여기 나와있듯 `crackmes.one`이거나 `crackmes.de`이다

### 문제 풀어보기

![Image](https://github.com/user-attachments/assets/7cda0481-813d-4d81-9520-41ec70094ab4)

압축 파일을 해제하면 두가지 파일이 보인다

어.. 근데 `README.nfo`는 왜 있는거지? 싶은 생각이 들지만 일단은 넘기고 우리에게 필요한 `CrackMe.exe`를 먼저 보자

하지만 그 전에!

![Image](https://github.com/user-attachments/assets/795f7e46-9778-4fdb-b15e-17d2abdff094)

일단 나는 위와 같이 virustotal에 트로이의 목마라고 잡히기는 하지만 윈도우 디펜더나 v3에서도 안잡히기에 실행하는 것으로 하겠다

만약에 좀 그렇다 하는 사람은 vm과 같은 환경에서 시도해 보는 것을 추천한다

---

이제 파일을 불러와보자

참고로 필자는 이 툴에 관해 아는 것이 전무하기에 잘못된 것들이 있을 수도?

![Image](https://github.com/user-attachments/assets/0acd1b93-7850-4d11-a289-5dd7a61fc7c5)

나는 `x64dbg`에 파일을 그대로 옯겨넣었고 아래와 같이 `x32dbg`를 사용하라고 한다

![Image](https://github.com/user-attachments/assets/525fbec7-3419-4af3-baac-4924f68b34c2)

오 이번에는 실제로 `x32dbg`에서 파일을 불러왔을 뿐 아니라 자동으로 프로그램을 실행시키기 까지 했다

그리고 지금 프로그램에서 검은 화면이 뜨는 이유는 디버거에서 자동으로 중단점을 잡고 멈췄기 때문이다 실제로 실행해 보면 다음과 같다

![Image](https://github.com/user-attachments/assets/056ec28f-8cb3-4caf-94a8-d6557a2a28e3)

이렇게 유저 명을 넣는 칸이 나오고 틀리게 넣었다면 

![Image](https://github.com/user-attachments/assets/a0411109-a997-4191-accf-72453e60caeb)

틀렸다고 나온다

그럼 다시 디버거로 돌아가서 `Username`이라는 이름이 나오는 곳을 찾아가보자

![Image](https://github.com/user-attachments/assets/99146d4b-b619-4c9c-b742-0baae2f8eba1)

우클릭으로 `문자열 참조`를 눌러 우리가 찾는 `Username :` 부분이 어딘지 찾아가보자

![Image](https://github.com/user-attachments/assets/77ea1b7c-1321-45f1-8c2d-ebbc6099e593)

이렇게 엄청 많은 문자열들을 찾아내겠지만 그중에 눈에 띄는 것이 보인다 

![Image](https://github.com/user-attachments/assets/81b03eec-6eca-4735-a941-4df7138069f1)

이거 누가 봐도 이게 우리가 찾던 것 같다

물론 이 상황에서 바로 뭔가 비번 같아 보이는 `Nick`과 `4ACE00F`를 들어가 볼 수도 있겠지만 일단은 두번 클릭해서 뭔지 들어가보자

![Image](https://github.com/user-attachments/assets/d6c38ab9-43bc-4a1b-9032-b17def826094)

일단 나는 `Username`부분을 클릭해 들어갔고 보아하니 여기가 가장 중요한 함수가 있는 부분인듯 하다

들어가니 `Username :` 하고 화면에 표시해 주는 부분과  아래에는 `password:`를 입력하라는 부분이 있는걸 보니 만약에 `Username`을 정확히 입력한다고 해도 비밀번호를 입력해야 하는 부분도 있나보다

그럼 `password:` 위의 부분이 유저 확인 로직이 들어간 부분임이 틀림없다!

내가 아직 어셈블리를 잘 모르기는 하지만 한번 코드가 어떻게 구성될지 예상을 해보자면

`Username :` 화면 출력 → 입력 → 정답과 입력값 비교 → `password:` 출력

이지 않을까 싶다

그럼 저렇게 생각하고 아스키 코드를 읽어보자

> 주의! 아스키코드를 읽을 줄 모르기에 틀린 부분이 많을 것이다, 초보자의 시선에서 쓰는 글임을 명심해라

![Image](https://github.com/user-attachments/assets/b44c4e02-9774-4fd4-85f1-8ecabd3d12a2)

#### `0x00A2953A` : push crackme.A32EFC

일단 옆에 나온 참조를 생각해보면 `Username :`을 출력해주는 부분일 것이다

#### `0x00A2954D` : lea eax, dword ptr ss:[ebp-78]

묘하게 잘 읽어보면 `password : `위의 부분중에 두번 동일하게 써있는 부분이 있다 바로 `[ebp-78]`이라는 녀석이다

그럼 예상하길 이게 바로 우리가 넣는 `유저명`이 될 확률이 놓아 보인다

#### `0x00A29560` : lea eax,dword ptr ss:[ebp-30]

그렇다면 이건 유저명의 정답이 들어있는 부분이겠지?

거기다 다음 부분을 보면 다시 아까 저장했던 **[ebp-78]** 를 불러오는것을 보니 그 다음 부분이 비교하는 부분인가보다

#### `0x00A29568` : call crackme.A214BF

그렇다면 위에서 넣은 값들이 이제 `crackme.A214BF`에 들어가 계산이 된다고 생각하면 되겠다

#### `0x00A29570` : movzx edx,al

이 부분이 내가 이해한 것이 맞는지 골때리기는 하는데 `al` 값을 `edx`에 옮긴다

그 과정에서 `상위 바이트를 0으로 채워서 확장한다` 라는 말이 있는데... 음.. 이거는 어셈블리어 공부할 때 다시 보도록 하자

일단은 비교하는 함수 `crackme.A214BF`의 결과값이 `al`이고 이걸 `edx`로 옮겨넣었다고 생각하자

#### `0x00A29573` : test edx,edx

`edx`와 `edx`의 비트 AND 연산을 한다, 그리고 그 결과값은 저장되지 않고 플래그(true, false )만 저장된다고 한다

어.. 왜 edx랑 edx를 비교하는 건지는 모르겠지만 아마 `movzx`에서 넣은 `edx`와 정답의 `edx`를 비교한다는게 아닐까?

아 찾아보니 `test`의 형태가 `ZF = (edx & edx == 0) ? 1 : 0` 이렇게 구현되어있다고 한다

이러면 이해가 가네

#### `0x00A29575` : je crackme.A295D9

먼저 어셈블리어 이름을 찾압보니 JE (Jump if Equal / Jump if Zero)라고 한다

이전 명령(test) 결과가 1이면 해당 주소로 점프

그러니까 쉽게 말해 정답이면 진행 아니면 특정 주소, 여기서는 `0xA295D9` 번지로 이동한다는거다

![Image](https://github.com/user-attachments/assets/6199c473-5c78-4d5d-88c2-57e2e9e9d853)

이렇게 x32dbg를 보면 저 부분에서 여기로 이동해요! 하고 보여주는 부분이 나온다 그리고 그곳에는

**cls** (터미널 화면 지우기)명령어를 실행하고 틀릴 때 마다 보던 `user not registered! :( \n`을 볼 수 있다

그럼 이제 유저명은 통과했다고 생각하고 비밀번호 부분도 봐보자, 사실상 위와 구조가 거의 동일하여 이번에는 빠르게!

#### 비밀번호 체크 

![Image](https://github.com/user-attachments/assets/54a4e79d-a7e7-4004-abf9-d5e53d81cfed)

> **0x00A29577** : push crackme.A32F0C

`password:` 띄워주는 부분

> **0x00A2958A** : lea eax,dword ptr ss:[ebp-9C]

비밀번호 입력

> **00A295A0** : lea eax,dword ptr ss:[ebp-54]

정답 비밀번호 가져오고

> **00A295A4** : lea ecx,dword ptr ss:[ebp-9C]

입력한 비밀번호 가져오고

> **00A295B3** : movzx edx,al 와 **00A295B6** :test edx,edx

둘을 비교해서

> **00A295B8** : je crackme.A295D7

같으면 진행하고 다르면 `0xA295D7`로 보내버리기!

유저명 입력할 때랑 같은 곳으로 보내는걸 보니 비밀번호를 틀려도 **user not registered**가 뜬다는 것을 알 수 있다

그럼 유저명과 비밀번호는 언제 생겨난걸까?

![Image](https://github.com/user-attachments/assets/2c0c237d-5776-4aff-a789-99484d370d84)

당연하게도 유저명을 물어보기 전에 생겨났다

직접 해보면?

![Image](https://github.com/user-attachments/assets/f543fcbe-25ec-448e-bf7a-3f6ef8c98baa)

처음으로 디버거를 이용해 리버싱에 성공했다!

## 첫번째 외전 (with. PEstudio)

crackmes.one에 올라온 솔루션들을 읽어보니 두 방법 중에 `PEstudio`를 이용한 방법도 있기에 가져와봤다

![Image](https://github.com/user-attachments/assets/db0e3b4a-8e38-4d0e-9d33-90d6cc2c9d49)

`PEstudio`에 불러와보면 자동으로 바이러스 토탈에도 돌려주기도 하는등 자동으로 여러가지를 알아서 해준다

솔직히 이것도 어떻게 쓰는지는 모르겠지만 적어도 `strings` 즉 문자열에 관한 내용은 확실히 읽을 수 있으니 들어가보면 정답지에서도 나오듯 몇가지 눈에 띄는 문자들이 보이고 이건 우리가 `x32dbg`에서 찾았던 문자열과 같다는 걸 알 수 있다

음.. 일단은 여기까지만 보고 다음 문제로 넘어가보자