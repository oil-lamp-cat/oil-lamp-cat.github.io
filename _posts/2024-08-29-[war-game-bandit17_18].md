---
title: "[wargame] overthewire bandit 17 -> 18"
date: 2024-08-30 12:13:15 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

## Bandit Level 17 -> Level 18

**user_id** : bandit17<br/>
**password** : EReVavePLFHtFlFsjn3hyzMlvSuSAcRD

### 목표

![image](https://github.com/user-attachments/assets/1670f61d-d9bf-4e1c-ad5c-a9f9888027f0)

홈 디렉토리에는 passwords.old와 passwords.new 두 개의 파일이 있습니다. 다음 단계의 암호는 passwords.new에 있으며 passwords.old와 passwords.new 사이에서 변경된 유일한 줄입니다

참고: 이 레벨을 해결하고 bandit18에 로그인하려고 할 때 'Bye bye!'를 보게 될 것인데, 이것은 다음 레벨인 bandit19와 관련이 있습니다

### 해결법

![image](https://github.com/user-attachments/assets/f132c113-6a35-4085-bfff-c62054c8897d)

정말로 파일은 .new와 .old가 존재하고 둘 다 읽을 수 있는 파일로 되어있네요

cat명령어를 통해 읽어보니 

![image](https://github.com/user-attachments/assets/d1f4ee66-57f8-4923-a923-97ddf2c9ddab)

어우 사진에 보이는 것 보다 더 길군요

일단 bandit에서 힌트를 주길 `cat`,`grep`,`ls`,`diff`를 쓰라고 했으며 왠지모르게 `diff`라는 명령어가 이번 문제의 키일 것 같은 느낌이 드네요

> diff : 두 파일을 비교하고 차이점 추출

`-q` : 파일이 다른 경우 `Files passwords.new and passwords.old differ`이런 식으로 간단하게 다르다, 라고만 알려준다

`-r` : 디렉토리 비교를 위해 사용

`-u` : 유니파일 형식으로 파일의 차이를 출력

예를들어 다음과 같다

![image](https://github.com/user-attachments/assets/da2d41cf-20ba-4623-8dc6-edea1036bd1f)

`-c` : 파일의 차이를 문장 형태로 보여준다

![image](https://github.com/user-attachments/assets/ee5e1253-d249-492e-a933-c8f80ea19865)

'39에서 45번째 줄 중 이 부분이 틀렸어요!' 하고 알려준다

`-i` : 대/소문자를 무시하고 비교

`-w` : 공백 문자 무시

`-B` : 빈줄 무시

`-y` : 이중 컬럼 출력 모드

![image](https://github.com/user-attachments/assets/02de73ce-2f1a-48bf-aa75-2404534d5268)

이런 식으로 github commit 내용처럼 비교하여 출력함

`-l` : 변경된 줄의 개수만 출력

우리는 굳이 옵션을 넣어줄 필요는 없어 보인다

![image](https://github.com/user-attachments/assets/5ea5064a-a7ec-434a-8096-4514c32c2f95)

위 부분이 new파일이고 아래 부분이 old파일 부분이다

그렇다면 바뀐 비밀번호는? 위에 부분인 것이다

비밀번호 : `x2gLTTjFwMOhQ8oWNbMN362QKxfRqGlO`

그런데 여기서 잠깐 다음 문제로 넘어가게 되면 연결을 시도했을 때 termius를 사용하는 사람이라면 바로 종료가 되어 session log를 확인해 보았을 때

![image](https://github.com/user-attachments/assets/ce3d3643-4469-487d-9d36-a8542a72cef3)

`Byebye!`라며 바로 나를 내보내 버린다

처음 문제에서 말했듯 이것은 bandit19번과 관련이 있으며 우리는 잘 해결한 것이 맞다!