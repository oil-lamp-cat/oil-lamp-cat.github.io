---
title: "[HTB] Previous (Medium_Linux)"
date: 2025-12-29 15:20:00 +09:00
categories: [hacking, saturnx operators, Linux]
tags: [Hack The Box]
pin: true
password: "20251229"
---

## 시작에 앞서

![Previous](https://github.com/user-attachments/assets/4d4313c7-aadb-4f71-b762-62d5e423ad7a)

다시 돌아온 Linux! 하지만 이번엔 Medium 난이도 도전!

## 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![previous nmap result](https://github.com/user-attachments/assets/5ea86065-3f67-47cc-b92f-3be6c0154ce6)

결과를 보아하니 언제나처럼 ssh 80포트와 nginx 80번 포트가 열려있다.

`http://previous.htb/`라고 하니 `/etc/hosts` 파일에 등록해주자.

![website](https://github.com/user-attachments/assets/9ee0308d-230d-4b24-bfc2-373a29ba9a9e)

이거 설마 Next.js 본따서 만든 페이지인가? 이름부터가 Previous.js인데 ㅋㅋㅋ

내일의 기술이 아니라 어제의 기술 이란다 ㅋㅋㅋ

`SSR` 이 아니라 `NSR`

`Lightweight` 가 아니라 `Heavyweight`

`Opt-in` 이 아니라 `Opt-out`

![login](https://github.com/user-attachments/assets/a332e07b-0c77-4fbc-b734-07aa0bf80af8)

`Get Started`나 `Docs`를 눌러도 로그인 페이지로 들어간다.

![dirsearch 1](https://github.com/user-attachments/assets/d2f38775-87bd-4d81-870a-58af9a89a8bd)

![dirsearch 2](https://github.com/user-attachments/assets/3eb0ba2b-1dc2-4706-bb4d-241e3b2400a2)

![dirsearch 3](https://github.com/user-attachments/assets/6ba8ceb8-bb81-4ffe-9319-fb50c6378bed)

`dirsearch`를 진행했고, 보아하니 수 많은 api와 `/signin` 등등이 있는데 사실상 하나만 200이고 다들 307, 308인데?

![Wappalyzer](https://github.com/user-attachments/assets/2b73f099-5c62-48aa-a95e-87b1b46f5eca)

Wappalyzer로 확인을 해보니 `Next.js`, `Nginx`, `React`를 확인했음을 확인할 수 있다.

## 초기 침투 (Initial Foothold / Exploitation)

![vuln nextjs 15.2.2](https://github.com/user-attachments/assets/5c738aff-9028-4352-931e-ec5a8e6f2651)

보아하니 꽤 많은 것들이 보이는데, 일단 RCE에다가 bypass까지 꽤 쏠쏠해 보이는데?

![bypass](https://github.com/user-attachments/assets/6b61392c-04f9-476b-af5e-f1b1cc40db25)

일단 인증 우회는 exploit 코드도 있다고 하고

![rce](https://github.com/user-attachments/assets/95bc023c-54ce-4eed-a385-0a66aabb35bb)

이것도 있네?

그럼 둘 다 해보지 뭐

### CVE-2025-29927 (Next.js에서 권한 우회)

[Next.js 미들웨어 인증 우회 취약점 (CVE-2025-29927) / 꼰머의 보안공부](https://ggonmerr.tistory.com/580)

내용이 좀 많이 어렵긴 한데 간단히 설명하자면 

Next.js에서 작업을 처리한 후에 결과를 보여주기 위해 Redirect를 할 때에 Host 헤더의 주소표를 보고 이동할 곳을 정하게 된다.

근데 이 Host 헤더의 `x-middleware-subrequest`라는 친구가 원래는 무한 루프 방지를 위해 존재하는 녀석인데 이걸 여러번 주입해서 내가 원하는 곳으로 우회가 가능하다는 취약점이다.

[websecnl/CVE-2025-29927-PoC-Exploit](https://github.com/websecnl/CVE-2025-29927-PoC-Exploit)을 이용했고 그 결과?

![result of CVE](https://github.com/user-attachments/assets/d1aee079-3ebd-4458-8321-b2c6cdbfffef)

```bash
┌──(kali㉿kali)-[~/CVE-2025-29927-PoC-Exploit]
└─$ python3 CVE-2025-29927-check.py
Domain (or full URL): http://previous.htb
```

다 실패?

![previoushtb docs](https://github.com/user-attachments/assets/6e679459-7c99-4264-bcf5-70b72204f362)

```bash
┌──(kali㉿kali)-[~/CVE-2025-29927-PoC-Exploit]
└─$ python3 CVE-2025-29927-check.py                          
Domain (or full URL): http://previous.htb/docs
[+] Full path provided. Testing only endpoint: /docs
[*] Connecting to base URL: http://previous.htb
```

그럴리가! 보아하니 이 poc를 이용할 때에는 도메인을 잘 넣어줘야겠다.

![result middleware](https://github.com/user-attachments/assets/6e768fc4-6d39-4493-b490-463c00e4d45c)

일단 우리가 원래는 접근 못해야 하는 부분의 내용이 보이게 되긴 했는데...

![gui](https://github.com/user-attachments/assets/08ac05b0-e13a-4f4d-b0d5-68c6f8ef73a0)

확실히 이쪽으로 보는게 더 편하죠?

보아하니 `Logged in as ???`인게 우리가 인증우회를 진행해서 들어왔기에 이리 뜨게 된다.

근데 이것도 지금 문제가 curl 결과를 내가 html로 옮겨서 연건데 그럼 페이지를 돌아다니기 불편하잖아?

burpsuite를 이용하자.

#### burp suite 이용하기

![burp main](https://github.com/user-attachments/assets/cb3fd4f7-36d6-41ad-9c82-852168f85f77)

일단 `Proxy` 탭으로 이동하여 `Proxy settings`를 들어간다.

![Proxy settings](https://github.com/user-attachments/assets/af16a697-36a0-4584-92f9-136450d9b6cd)

쭉 내려가다보면 이미지처럼 `HTTP match and replace rules`가 보인다.

여기서 `Add`를 눌러주자.

![add mr rule](https://github.com/user-attachments/assets/29dd98e7-cdd5-4c2f-b899-27ccf27a9921)

이렇게 뜰텐데 다른거 건들이지 말고 `Replace`에 `x-middleware-subrequest: middleware:middleware:middleware:middleware:middleware`를 넣어주고

`Comment`에는 아무렇게 써주자.

![add](https://github.com/user-attachments/assets/29a1f650-2119-4cda-8fd8-66066a07e669)

이렇게 넣었다면 준비 끝! 

burpsuite의 Open browser를 이용해 `http://previous.htb/docs`로 들어가주면?

![didit](https://github.com/user-attachments/assets/237c9090-3892-4e00-b399-89c529df9e6c)

짜잔! 이렇게 ???로 로그인 하여 페이지를 볼 수 있다!

### CVE-2025-29927로 다시 돌아와

![getting started](https://github.com/user-attachments/assets/32d6b9e7-e9af-43b2-a681-71f24dfde649)

Getting Started 페이지에는 뭐 딱히 없고

![Examples](https://github.com/user-attachments/assets/03d80375-9054-4e71-bbf2-4b35c97e98ae)

Examples에서는 뭔가 다운받는게 있네?

![download](https://github.com/user-attachments/assets/9be15d6d-d196-40a1-8909-dc2bccc7f4c6)

하지만 별거 없죠?

![download api](https://github.com/user-attachments/assets/e82e558f-a001-495a-9ad9-b668a473bca6)

뭔가 걸리는게 있어서 `Intercept` 기능을 켜고 보니 `/api/download?example=`를 통해 파일을 다운받는 것을 확인했다.

![etcpasswd](https://github.com/user-attachments/assets/9c416793-2052-401c-b6e6-ca8921cb11ca)

그렇지! 다운로드 경로를 `../../../etc/passwd`로 하니 파일을 다운로드 할 수 있었다.

그렇다는건 다른 것들도?

![env](https://github.com/user-attachments/assets/a92509c0-c3af-4edf-a78b-c29bac9c8cb1)

이번엔 `../../../app/.env`에 있던 파일인데 뭔가의 시크릿 키가 있네?

`.env` 찾는다고 하루를 썼다는건 안 비밀.

![packagejson](https://github.com/user-attachments/assets/e717910f-6549-47ce-9404-11b2f4b36a5c)

![.next routes manifest](https://github.com/user-attachments/assets/c1944b55-8e40-4971-b076-dac8b9be2edc)

제미나이의 추천으로 찾아보고 있는 것들

- app/package.json (설치된 패키지들)
- app/.next/routes-manifest.json (Next.js 프레임워크 전용 빌드 파일)

아니 근데 무슨 파일 이름이 `[]`가 들어간담?

![대괄호 auth](https://github.com/user-attachments/assets/26db614e-a116-4922-9932-71b566e885ba)

심지어 이거 `[]` 때문에 `\`를 넣어줘야한다.

![분석](https://github.com/user-attachments/assets/67b38b43-a674-4dbc-8887-ded55e3f72e2)

오! 이게 우리가 가장 찾고 있는 부분일게 분명하다!

![login](https://github.com/user-attachments/assets/82808d32-4e7d-4836-8827-b82050929d35)

나는야 Jeremy!

![ssh login](https://github.com/user-attachments/assets/145146de-5441-4e8d-abbe-520c0dfb9a52)

그리고 ssh로 로그인도 성공했다!

![userflag](https://github.com/user-attachments/assets/5abf63f0-a8a9-43fc-8a79-2fb3adb34a6d)

으윽... docker... ptsd가...

![user done](https://github.com/user-attachments/assets/313ce1e1-5db1-47a4-ad57-b2fdff0b29c4)

넌 진짜 Medium이다.. 이게 생각보다 next.js의 구조를 모르면 거의 노가다 식으로 문제를 풀게될테니까 어느정도의 사전 지식을 요하는? 그런 문제이기에 Medium! 난이도에 딱 맞게.

### CVE-2025-66478 (react2shell)

아니 지금 보니까 이거 React2shell 이잖아?

![react2shell](https://github.com/user-attachments/assets/9282bf2a-bbb9-4fa7-9705-6e98531cb7c7)

하지만 이건 실패 라고 한다. 요건 또 좀 알아봐야하려나? 아니면 진짜 너무 유명한거라 안되는 걸지도?

일단 오늘은 여기까지!

## 권한 상승 (Privilege Escalation) 

## 마치며
