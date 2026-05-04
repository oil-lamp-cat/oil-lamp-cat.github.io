---
title: "[wargame] overthewire bandit 20 -> 21"
date: 2024-08-30 22:15:15 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

## Bandit Level 20 -> Level 21

**user_id** : bandit20<br/>
**password** : 0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO

이제 드디어 앞자리가 2로 바뀌었다

### 목표

![image](https://github.com/user-attachments/assets/1a076556-f8b2-4204-ae8b-32f52187de2c)

홈 디렉토리에는 명령줄 인수로 지정한 포트의 로컬 호스트에 연결하는 `setuid` 바이너리가 있습니다. 그런 다음 연결에서 텍스트 한 줄을 읽어 `이전 레벨(bandit20)`의 비밀번호와 비교합니다. 비밀번호가 정확하면 `다음 레벨(bandit21)`의 비밀번호를 전송합니다.

참고: 네트워크 데몬에 연결하여 네트워크 데몬이 생각하는 대로 작동하는지 확인해 보십시오

그러니까 `setuid binary`가 설정되어있고 네트워크 연결한 뒤 거기에 맞는 비밀번호를 입력하면 다음 레벨의 비밀번호를 준다

그런데 참고 부분이 있는 것을 보아하니 또 지금까지 해오던 것과는 다른 느낌인가보다

### 해결법

![image](https://github.com/user-attachments/assets/72f2317d-51b6-4ef8-b68a-7e327869b975)

이번에도 `setuid`설정이 된 파일이 보인다

일단 실행시켜보면

![image](https://github.com/user-attachments/assets/910726de-36bd-4bd5-a820-2e1953cae6bb)

`이 프로그램은 TCP를 사용하여 로컬 호스트의 지정된 포트에 연결합니다. 만약 다른 쪽에서 올바른 암호를 받으면 다음 암호는 다시 전송됩니다.`

음... 그니까 내가 bandit20으로 두개의 터미널로 연결해서 서로 통신을 하게 해야한다는 의미인 거겠지?

![image](https://github.com/user-attachments/assets/56a5cd4d-c718-40e9-b783-56039ae5880a)

termius에서는 터미널 나누기를 사용할 수 있다

![image](https://github.com/user-attachments/assets/33da9e3a-b580-4049-93af-2c7ff7b5963e)

이제 한쪽에서는 로컬에 포트 `7777(원하는 대로)`로 통신을 열어보자

![image](https://github.com/user-attachments/assets/c1f4f017-6362-4e94-9637-697063a9aad2)

아래 화면과 같이 로컬호스트에 연결되었다고 뜨면 이제 `bandit20`의 비밀번호를 넘겨주면 된다

![image](https://github.com/user-attachments/assets/3d0b745b-8b9a-422c-898b-9cefa9d7a9e1)

그러면 순식간에 비밀번호를 발송해준다!

> 비밀번호 : **EeoULMCra2q0dSkYj561DX7s1CpBuOBt**

그저 막연한 호기심으로 한번 파일을 읽어봤다

![image](https://github.com/user-attachments/assets/602dc3fb-221d-4f7f-9fa7-9a734b7e5929)

음.. 그만 알아보도록 하자