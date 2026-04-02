---
title: "[HTB] Principal (Medium_Linux)"
date: 2026-03-21 10:41:00 +09:00
categories: [hacking, RedLabs, Linux]
tags: [Hack The Box, Medium]
---

> [Congratulations OilLampCat! You are player #558 to have solved Principal.](https://labs.hackthebox.com/achievement/machine/988787/853)

## 시작에 앞서

![principal](https://github.com/user-attachments/assets/f161796d-20e1-4f37-9911-4db5f235283f)

거진 2주 이상 어깨 부상으로 인해 아예 앉아있는 것이 불가능 했던 상황이라 계속 약 먹고 자고 누워있고 하다보니 이제야 좀 앉아있을 수는 있어서 문제를 다시 풀어보기 시작했다.

아쉽게도 저번 Saturnx operators 오프라인 모임에는 참석을 못했는데 이제 이름이 RedLabs로 바뀌었다더라.

사실 지금도 중증 진통제를 먹고 살짝 해롱한 상태로 문제 풀고 블로그 작성하는 상황이다보니 틀린 부분이나 이상한 부분이 있을 수도 있다는점!

그럼 이제 다시 시작하는 **Linux** Medium 문제 풀이 시작!

## 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap1](https://github.com/user-attachments/assets/cf5fac57-66e1-4efe-b721-feda7e9f5f11)

![nmap2](https://github.com/user-attachments/assets/959bf29d-9d41-438f-b97c-0cd379134382)

![nmap3](https://github.com/user-attachments/assets/9cf30f7f-7a3b-4730-8797-0344b8acdd02)

nmap 스캔 결과가 정말 길긴 한데 간단히 보자면 `22/ssh` 와 `8080/http` 가 열려있음을 알 수 있다.

![etchost](https://github.com/user-attachments/assets/bf4e60dc-d3b4-436c-a215-b11ebd7b9f5f)

그리고 이름이 `principal.htb`라는 것을 알아냈으니 도메인을 추가해주자.

## 초기 침투 (Initial Foothold / Exploitation)

![site](https://github.com/user-attachments/assets/cb49a9e3-2b55-4e50-8cd8-b77e5bdef92b)

사이트에 접속을 해보면 로그인 하는 부분과 회원가입은 없고 `pac4j v1.2.0`이라는 것을 확인할 수 있었다.

![검색](https://github.com/user-attachments/assets/354ac416-7171-44d0-a1b2-c656b1588cfe)

그렇기에 간단히 검색을 해본다면 위처럼 바로 취약점들에 대한 내용이 나오게 되고 그것을 이용해 초기 침투를 진행하도록 하자.

![burp](https://github.com/user-attachments/assets/74ef2342-73cd-4544-b55d-cb2961102f77)

dir탐색을 하기 전에 한번 burpsuite를 이용해 프록시 내역을 확인하니 `/static/js/app.js`에 쓰여있길 우리가 찾던 `CVE-2026-29000`에 취약한 `pac4j-jwt/6.0.3`버전이라는 것을 알 수 있었고

![jwks](https://github.com/user-attachments/assets/735834ae-1d03-471c-a1d7-91c7f294134d)

취약점에 대해 간단히 설명하자면 `서버의 공개키(Public Key)`만 알면 서명검증을 우회하여 `관리자 토큰(JWE)`을 위조할 수 있다는 것이다. 그런데 찾아낸 `/static/js/app.js`에 떡하니 공개키의 위치가 `/api/auth/jwks` 엔드포인트라고 쓰여있네?

![요청 보내기](https://github.com/user-attachments/assets/9887ff6d-175f-42aa-87ae-3160b3b1027c)

그렇게 `/api/auth/jwks`에 요청을 보내 공개키를 받아볼 수 있었다.

이제 공개키를 성공적으로 얻어냈으니 이 키를 이용해 위에서 말한 관리자 토큰(JWE)를 위조할 차례다.

CVE-2026-29000에 대해 내가 이해한 바에 따르면 이론적인 과정은 다음과 같다.

1. `sub`(사용자)는 `admin`으로, `role`(권한)은 `ROLE_ADMIN`으로 설정된 데이터를 만든다.
2. 서명이 존재하지 않는 텍스트 상태의 토큰(**PlainJWT, alg:"none"**)을 생성한다.
3. 앞서 확보한 `타겟 서버의 공개키(Public Key)`를 사용해 이 서명 없는 토큰을 JWE 규격에 맞게 암호화 한다.
4. 암호화된 토큰을 서버에 보내면 서버는 자신의 개인키로 복호화한 뒤 서명검증을 건너뛰고 관리자 권한을 승인해버린다.

그런데 이 과정을 하나씩 진행한다기엔 `RSA-OAEP-256`과 `AES-GCM`이라고 하는 복잡한 암호화 연산을 거친 뒤에 Base64 인코딩 까지 해야하는데...

솔직히 이걸 사람이 하나씩 하기엔 너무 오래 걸리기도 하고 솔직히 저런 암호화가 뭔지도 모르겠단 말이지... 근데 난 시간이 없단말이지, 어깨 땜시 타임 어택인데.

그렇기에 이 과정을 자동화해줄 POC를 구글링해 보았는데. 대부분 `Maven` 환경을 세팅하고 빌드해야하는 Java 기반의 코드들뿐이었다. (내가 못 찾을 것일 수도 있다.)

더 찾아보기엔 내 어깨가 버틸 수 없어서 간단히 나는 파이썬 코드로 구하기로 했다.

> 이후 알았는데 결국에 내가 찾은게 공식 Writeup에 올라온 파이썬 코드였다.

![run](https://github.com/user-attachments/assets/efc4c7d2-3383-4ae8-8249-8660623b989a)

실행을 해보면? 위처럼 관리자 권한이 들어간 토큰을 얻을 수 있게 된다.

![inject](https://github.com/user-attachments/assets/a40bb31e-bd24-4c14-86f0-3b59a18049a5)

그리고 그걸 이용해 firefox에서 토큰을 넣어주게되면?

![login](https://github.com/user-attachments/assets/07aed48e-62ad-421e-a840-0798f9b9575b)

짜잔 관리자 권한으로 로그인 할 수 있게 된다!

![user](https://github.com/user-attachments/assets/37196776-b175-4b2a-bbb3-52b18afcd420)

그러나 지금은 관리자 페널에 들어왔을 뿐이라 좀 더 둘러보니 User Management에 `svc-deploy`라는 유저가 `Service account for deployments via SSH certificate auth` 라고 하는 SSH 권한이 있다는 것을 알 수 있었다.

![sshpass](https://github.com/user-attachments/assets/c33cf23b-6103-43ad-976e-71cf8f35d189)

게다가 System Settings의 Security 부분을 보니 `encryptionKey`가 `D3pl0y_$$H_Now42!`라며 딱 봐도 ssh에 쓸 수 있을 듯한 비밀번호가 보였다.

![ssh](https://github.com/user-attachments/assets/9274a07f-a0d0-490a-9960-8e82228e2d05)

그렇게 ssh에 접속하는데 성공했고 user 플래그를 얻어낼 수 있었다.

## 권한 상승 (Privilege Escalation) 

![sudol](https://github.com/user-attachments/assets/629b4675-f31b-4822-a0a9-790db02b9374)

국룰인 sudo 권한을 확인해보았으나 svc-deploy 유저는 sudo 권한이 전혀 없었다.

![id](https://github.com/user-attachments/assets/628d657e-ac45-4c41-acc1-f503c4c1028f)

그러나 id 명령어를 쳐보니 `deployers`라는 그웁에 속해있었고 `find`를 이용해 그룹 소유의 파일들을 전부 검색해보았다.

- /etc/ssh/sshd_config.d/60-principal.conf
- /opt/principal/ssh
- /opt/principal/ssh/README.txt
- /opt/principal/ssh/ca

를 찾아낼 수 있었고 

![cat](https://github.com/user-attachments/assets/14cb8e3f-95a1-4ea5-bab7-bebb40a07eed)

읽을 수 있는 파일들을 읽어보니 README.txt에 명시되길 `이 CA 키 쌍은 SSH 인증을 위해 sshd에서 신뢰하고 있다`라고 쓰여있었다. 즉 같은 폴더에 있는 `ca` 파일(개인 키)가 이 시스템의 마스터키 역할을 한다고 대놓고 알려준 샘이다.

그리고 `/etc/ssh/sshd_config.d/60-principal.conf`를 열어보니 `TrustedUserCAKeys /opt/principal/ssh/ca.pub`라며 이 CA가 서명한 인증서는 무조건 믿어라 라고 설정되어있었따.

그런데 정작 어떤 유저의 인증서만 허용할 것인지 제한하는 AuthorizedPrincipalsFile 설정이 빠져있었다.

그럼 난 이 설정 누락을 이용해 `deployers` 그룹 권한으로 CA 개인키를 이용해 **나는 root야** 라고 적힌 인증서를 직접 만들어 루트 권한을 획득할 수 있게 되는 상황이다.

![root](https://github.com/user-attachments/assets/973f039e-a165-41b4-ae5a-11ad873d559c)

일단 인증서 도장을 찍기 전에 내가 인증에 사용할 SSH 키를 만들어야한다. 

```sh
svc-deploy@principal:/opt/principal/ssh$ ssh-keygen -t ed25519 -f /tmp/pwn -N ""
```

위 명령어를 통해 비밀번호 없이 pwn 이라는 키를 만들어두고

```sh
svc-deploy@principal:/opt/principal/ssh$ ssh-keygen -s /opt/principal/ssh/ca -I "pwn-root"{요건 없어도 됨} -n root -V +1h /tmp/pwn.pub
```

인증서에 서명을 하면서(`-s 옵션`) 인증서 주인을 루트로 만들고 (`-n 옵션`) 일단은 1시간만 유효하게(`-v 옵션`) 도장은 `/tmp/pwn.pub`에 찍도록 했다.

그렇게 인증서를 이용해 로컬호스트로 ssh 연결을 시도하면 루트 권한을 얻어낼 수 있었다!

## 마치며

![You have solved Principal!](https://github.com/user-attachments/assets/e4235789-725e-4eb5-b05e-822bbb2e1397)

와 진짜... 오랜만에 와서? 갑자기 인증서에 관련된 Medium 문제를 풀어서?인지 뭔가 엄청 내용이 많아진 듯 하면서도 짧게 푼 것도 같고. 사실 이번 문제는 풀면서 되게 공부를 더 많이 했던 문제였다.

이만 벌써 어깨가 아파오니 이제 다시 누우러 가야겠다. 다음번엔 건강하게 문제를 풀 수 있기를!