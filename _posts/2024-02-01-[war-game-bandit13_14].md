---
title: "[wargame] overthewire bandit 13 -> 14"
date: 2024-03-29 00:25:15 +09:00
categories: [Security & Hacking]
tags: [Bandit, CTF, Linux, OverTheWire]
---

## Bandit Level 13 -> Level 14

**user_id** : bandit13<br/>
**password** : FO5dwFsc0cbaIiH0h8J2eUks2vdTDwAn

### 목표

![bandit12_14](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/6859c2c8-b01d-4c9c-9d19-be59b98dfd64)

비밀번호는 `/etc/bandit_pass/bandit14`에 있고 이 파일은 `bandit14`유저만 열어볼 수 있다. 이번 레벨에서는 다음 레벨로 가는 비밀번호는 찾을 수 없지만, 다음 로그인 할 때 필요한 `SSH key`는 가지고 있다. **Note : localhost**는 당신이 현재 작업하고 있는 `PC` 입니다.

### 해결법

이게 무슨 말인고 하니, '우리는 `ssh` 즉 네트워크 상의 다른 컴퓨터에 로그인, 혹은 원격 제어를 할 수 있게 해주는 프로토콜의 비밀번호를 이미 알고있다.' 라고 합니다. 일단 그럼 `SSH`가 무엇인지 부터 한번 이야기를 해볼까한다.


#### Shell (쉘)?

 쉘이란 운영체제 커널과 사용자 간의 소통을 담당해 주는 텍스트 기반의 명령어 해석기이다. 쉘은 마치 커널을 조개껍질처럼 감싸고 있다고 하여 shell(껍데기)라는 이름이 붙었다.

 쉘은 UI, 즉 유저 인터페이스(User Interface) 사용자로부터 입력을 받아들이는 방식에 따라 두가지로 나뉜다고 한다.

 - GUI (Graphic User Interface) : Gnome, KDE, (윈도우 사용자들이 보는 화면도 포함!) 등
 - CLI (Command Line Interface) : csh, bash, cmd 등

#### SSH (Secure Shell) - 보안 셸 프로토콜?
 
 SSH는 네트워크 상의 다른 컴퓨터의 셸을 사용할 수 있게 해주는 프로토콜을 의미한다. SSH를 이용하여 보호되지 않은 네트워크를 통해 컴퓨터에 명령을 안전하게 전송할 수 있게 해준다. 계속 서버에 앉아있을 수는 없는 노릇이니 원격으로 SSH를 통해 서버에 접속해 관리할 수 있게 한다.
 
 SSH가 동작할 때에는 SSH서버라는 이름을 가진 데몬([daemon](https://ko.wikipedia.org/wiki/%EB%8D%B0%EB%AA%AC_%EC%BB%B4%ED%93%A8%ED%8C%85))이 항상 작동하면서 접속을 기다리고 있다가 클라이언트가 접속을 시도하면 SSH 서버와 클라이언트간의 보안 연결이 된다. 그 보안을 위해 다음과 같은 보안 방식을 가진다.

 - key는 `private key`와 `public key`의 한 쌍으로 이루어져있고 이 둘을 비대칭 키라고 부른다. `Private key`는 클라이언트(Client)에서 안전하게 보관되어야하는 key이고 `Public key`는 서버(Server)에 공유되는 key를 의미한다.
  
  클라이언트가 ssh명령어를 통해 서버에 접속을 시도하게 되면 서버는 클라이언트가 `Private key`를 가졌는지 확인을 하여 연결 여부를 결정하게 되는 것이다.

 자 그럼 다시 접속을 해보도록 하자.

 ![bandit13_14_1](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/c92303b5-f7c8-4a8d-8c5e-0685fc341189)

 우리가 읽을 수 있는 파일 중에는 `sshkey.private`라는 파일이 존재한다.

 `file`명령어를 사용해 보았을 때 해당 파일은 PEM RSA private key라고 한다.

 무슨 파일일까 해서 `cat`명령어를 사용하여 읽어보니 역시 사람이 읽을 파일은 아닌 것 같다.

 그럼 이 파일을 이용해서 무엇을 하라는 것일까?

 [SSH key로 Linux 접속하기](https://pyromaniac.me/entry/SSH-%ED%82%A4%EB%A1%9C-Linux-%EC%A0%91%EC%86%8D%ED%95%98%EA%B8%B0), [SSH 공개키 인증을 사용하여 접속하기](https://velog.io/@lehdqlsl/SSH-%EA%B3%B5%EA%B0%9C%ED%82%A4-%EC%95%94%ED%98%B8%ED%99%94-%EB%B0%A9%EC%8B%9D-%EC%A0%91%EC%86%8D-%EC%9B%90%EB%A6%AC-i7rrv4de)

 이곳 저곳을 찾아보니 ssh 명령어 옵션 중 `-i`라는 옵션을 이용하여 private key 파일을 선택하여 접속할 수 있다고 한다.

 ```ssh -i [Private Key FIle] [UserName]@[HostName] [포트]```

 형식을 이용하여 사용할 수 있다. 자 그럼 이제 접속을 해보도록 하자.

 ```
ssh -i sshkey.private bandit14@localhost -p 2220
 ```

 ![bandit13_14_2](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/e315ca59-b035-49f9-99b1-dc42f9121a0f)


 어라 안바뀌었나? 싶지만

 ```
 !!! You are trying to log into this SSH server with a password on port 2220 from localhost.
 !!! Connecting from localhost is blocked to conserve resources.
 !! Please log out and log in again.
 ```

 ```
 !!! 로컬 호스트에서 포트 2220의 암호를 사용하여 이 SSH 서버에 로그인하려고 합니다.
 !!! 리소스를 절약하기 위해 로컬 호스트에서 연결이 차단되었습니다.
 !!! 로그아웃 후 다시 로그인해 주시기 바랍니다.
 ```

 라며 경고를 보내지만

 ![bandit13_14_3](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/fe541693-a864-4442-89b8-b7eddb8efcf3)

 일단은 접속에 성공한 모습이다. 그럼 이제 이 상태에서 비밀번호를 찾으러 가보자.

 ![bandit13_14_4](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/566d42bb-2236-4a4c-b3d1-ef17c81a603c)

 수 많은 파일들이 보이지만 이 중 우리가 볼 것은 bandit14의 비밀번호이다. 그리고 다른 폴더를 열어보려 하여도 

 ![bandit13_14_5](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/83659c12-669f-4f26-af30-6cc1987459cb)

 다른 사용자가 만든 파일은 접근할 수 없어 `permission denied`만 뜰 뿐이다.

 비밀번호 : `MU4VWeTyJk8ROof1qqmcBPaLh7lDCPvS`