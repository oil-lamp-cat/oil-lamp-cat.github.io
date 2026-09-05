---
title: "[HTB] Reactor (Easy_Linux)"
date: 2026-09-05 12:31:00 +09:00
categories: [Security & Hacking, HTB]
tags: [Hack The Box, hacking, RedLabs, Linux]
password: "20260905"
pin: true
---

![Reactor](https://github.com/user-attachments/assets/595b3d95-b9e5-4d95-857f-4f971b759ad4#.png)

[Reactor has been Pwned, OilLampCat has successfully pwned Reactor Machine from Hack The Box](https://labs.hackthebox.com/achievement/machine/988787/900)

## 1. 시작에 앞서

![Reactor](https://github.com/user-attachments/assets/a011604f-1d4d-4332-a9f9-30560fa790a1#.png)

요건 정말로 easy 난이도에 딱 맞는 문제였다. 근데 재밌어!

## 2. 초기 침투 : 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap](https://github.com/user-attachments/assets/1c9881de-19e0-42ce-a47a-a2c5ac29381c#.png)

일단 포트 스캐닝을 진행하였을 때 평소 보던 `22/ssh`는 익숙했지만 `3000/ppp?`는 또 첨보는거라 이게 뭐지 싶었었다.

그런데 일단은 접속할 수 있는 사이트로 보였기에 바로 접속을 시도해보았다.

![site](https://github.com/user-attachments/assets/f2436e97-cf67-479c-ade5-3513c70854f9#.png)

들어와보니 **REACTORWATCH** 라고 하는 일종의 원자력 발전소? 의 상태를 확인하는 그런 사이트로 보였다.

![site1](https://github.com/user-attachments/assets/eaf749b2-ec34-4787-9f8f-041d288b6df3#.png)

그리고 이 사이트에 지금 접속한 사람들 목록이 뜨기도 했고, 시스템 로그도 있었다. 

하지만 딱 그 뿐, dirsearch나 ffuf 같은 툴로 디렉토리 브루트 포싱을 해보아도 딱히 찾을만한 구석이 없었다.

## 3. 초기 침투 (Initial Foothold / Exploitation)

![wapa](https://github.com/user-attachments/assets/e6f92535-4f20-4691-8923-58a599f9a6cf#.png)

그래서 한번 wappalyzer로 확인을 해보았다.

> 참고로 wsl 쓸 때 그냥 firefox 열면 확장 못 쓰고, sudo로 열어야 쓸 수 있더라... why? 나도 모르겠다.

음... 이거 어디서 많이 본 버전인데...

![R2S](https://github.com/user-attachments/assets/50cfa862-2c7c-4eaf-beb7-258960dc1188#.png)

어? 이거? 

![React2shell](https://github.com/user-attachments/assets/99b20c67-00f0-4a06-a64e-f5d8b6657e97#.png)

아니 그 유명했던 React2Shell 이 아니던가?

![poc](https://github.com/user-attachments/assets/cb2174aa-8531-430a-920a-d78f917964dc#.png)

바로 poc를 다운받아주고

![node](https://github.com/user-attachments/assets/2d012425-9d17-4d91-a49a-7555c8b8948b#.png)

node 가 없어서 설치 해주고

![test](https://github.com/user-attachments/assets/427805c0-39ab-42c3-96c7-e24f5b754e93#.png)

테스트 삼아 `sleep 5`를 날려보니 딱 6초가 걸렸다.

사실 id나 pwd 등을 날려보기도 했지만 그건 요청이 갔다가 올 때 웹 서버가 실행 결과(stdout)을 반환하지 않는 상황이였다.

그니까 서버쪽 쉘에는 id의 결과가 나왔지만 나한테 돌려주지는 않았다는거. 

그래서 일부러 시간을 늘려 확인해보니 1초 내로 답변이 오던게 6초로 늘어나며 우린 성공했다고 확인할 수 있었다.

![rev](https://github.com/user-attachments/assets/04a3e8c8-b48f-440c-a378-7f885dec4884#.png)

고로 명령어가 실행된다! 는 것은 알았으니 이렇게 리버스쉘 페이로드를 보내게 되면? response는 안 돌아오지만

![rev2](https://github.com/user-attachments/assets/4c6ab1dd-5179-4648-a5de-631f121d3acc#.png)

리버스 쉘이 붙은 것을 확인할 수 있다.

![shellupgrade](https://github.com/user-attachments/assets/f1f317bb-5bfd-431c-9df9-4f11f8146c3f#.png)

보기 별로니까 좀 더 안정적인 쉘로 업그레이드를 시켜주고 확인해보니 `node`라는 계정으로 들어오게 되었다.

![sad](https://github.com/user-attachments/assets/ee66aed8-b8e2-4a33-969f-5af397d4ad47#.png)

다만 아쉬운건 이 계정은 폴더도 있긴 하지만 정작 내용물은 볼게 없다는 점?

오히려 처음 리버스 쉘을 들어왔을 때의 위치인 `/opt/reactor-app`에 딱 봐도 뭔가 열어보고 싶은 내용이 있었다.

![anyone](https://github.com/user-attachments/assets/58ec38e5-7073-4bc7-bcec-0d80bf20dbf7#.png)

누가 봐도 db라고 하면 열어보고 싶지 않은가? 

그래서 바로 `sqlite3`로 연결을 시도해보았고 그 안에서 admin과 engineer 계정을 찾아낼 수 있었다.

물론 여기서 말하는 admin은 권한 상승을 위한 비밀번호가 아니라는건 알겠죵?

![복호화](https://github.com/user-attachments/assets/0eab6ef4-8d17-4e1b-8690-6b39cfc213e5#.png)

일단 reactor 계정의 해시를 crackstation에서 돌려보니 비밀번호를 찾을 수 있다.

![hashcat](https://github.com/user-attachments/assets/6eb9ba18-aade-4464-af01-6b550101c625#.png)

![hashcat1](https://github.com/user-attachments/assets/b6628c24-64de-4af9-9f98-a0742b28b179#.png)

이렇게 hashcat을 이용해서도 가능 하고요.

![user](https://github.com/user-attachments/assets/23a3332f-2b07-412e-83d5-da02d7bb9a37#.png)

그럼 이걸 토대로 아까 발견했던 22번 포트로 ssh를 연결 시도해보면?

유저 플래그를 획득!!

## 4. 권한 상승 (Privilege Escalation) 

![sudo](https://github.com/user-attachments/assets/629ce49a-9eb4-43ee-86e8-0c590e1e899e#.png)

매번 하던 권한 확인인데 이 계정으로는 sudo를 쓸 수가 없었다.

![그래서](https://github.com/user-attachments/assets/509d7fc3-0716-4f24-9128-a7b9eb78adf6#.png)

그래서 이것 저것 둘러보던 중 내부 네트워크를 한번 싹 둘러봤는데?

어라? 포트 중에 9229라는 포트가 열려있네?

이걸 찾아보니 Node.js Inspector(디버거)가 사용하는 기본 포트라고 한다.

우리가 초기 침투를 진행할 떄에도 웹 애플리케이션이 `next.js` 기반이였던걸 생각해보면 저게 공격 경로일지도?!

![turnel](https://github.com/user-attachments/assets/7c720b4b-057d-4936-a29f-e8e4e9698623#.png)

근데 결국 저건 내부 포트여서 우리가 접근 할 수가 없었다.

하지만 우린? 바로 ssh 접속에 성공한 사람!

`-L` 명령어로 내 kali의 포트와 reactor 머신의 9229 포트를 포트포워딩 해서 뚫어버리자. 

이 때 이 쉘을 끄게 되면 터널링도 끊어지니까 그대로 켜둬야 한다.

![node](https://github.com/user-attachments/assets/7aec6180-b397-4e8a-981e-cf38c0c936fd#.png)

이제 내 kali 머신의 9229 포트와 타겟의 127.0.0.1:9229와 직통으로 연결되어있으니 이대로 Node.js 디버거에 바로 접속해보자.

이렇게 접속은 했는데 이 디버그 모드에서는 우리가 원하는 시스템 명령어 같은건 바로 칠 수가 없었다. 그렇기에 자바 스크립트 코드를 실행할 수 있는 대화형 환경인 **REPL(Read-Eval-Print-Loop)** 모드로 진입해야 한다.

~~난 여기서 디버그 모드로 뭘 해야 하나 싶어 3시간을 해맸달까.~~

![repl](https://github.com/user-attachments/assets/98711e8e-cec4-481d-8cf7-c2d9153247a3#.png)

이렇게 repl을 입력 하고 프롬프트로 넘어온 뒤 다시 한번 추가적인 리버스 쉘을 끼얹어주면?

![rev](https://github.com/user-attachments/assets/2e58726a-3224-4d02-bac9-b8a214088dac#.png)

리버스 쉘이 떨어진다.

![그리고](https://github.com/user-attachments/assets/f9eab5ef-c2f9-4022-bbed-75daa75765dd#.png)

그대로 루트 플래그를 옴뇸뇸!

## 마치며

![Reactor](https://github.com/user-attachments/assets/c080582d-f3ea-4a0e-b93a-aad252ce428b#.png)

이번 문제를 풀면서 난 내부 포트를 마주했을 때 또 설마 chisel이나 Ligolo-ng를 써야하는건가 하는 생각이 들었었다.

근데 왜 chisel을 안 썼을까?

간단하게보자면 우린 이미 털어놓은 SSH 비밀번호가 있었기 때문이었다.

chisel을 쓰려면 파일 업로드를 통해 바이너리를 올려야 하는데 그런거 필요 없이 이미 타겟에 설치되어있는 SSH를 LOTL 을 통해 간단히 연결을 해줄 수 있었으니 말이다.

그러니 다른 문제를 풀 때도 할 수 있다면! 가능한 SSH를 이용하는 방법을 써봐야겠다.

그동안 푼 문제가 난이도가 있었어서인지, 아니면 내가 기본적인 절차를 밟아오며 공부한게 아니여서인지 오히려 이게 더 쉬운 방법, 기초적인 방법인 듯 한데 되려 몰랐었다.

이번에 하나를 더 알게 되었으니 좋았으?

다음번엔 진짜로 medium 이상 문제를 풀어봐야겠다.

그럼 Happy Hacking이다!