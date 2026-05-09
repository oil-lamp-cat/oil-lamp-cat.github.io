---
title: "[Raspberry pi 4B] 라즈베리파이로 Sliver 구동하기"
date: 2026-05-04 13:40:00 +09:00
categories: [Security & Hacking]
tags: [hacking, Sliver, Raspi, 라즈베리파이]
pin: true
---

## 라즈베리파이?

![Sliver](https://github.com/user-attachments/assets/eae1b893-9311-4050-bdd0-3728cf360bd4#.png)

사실 이번 기수 동아리 활동으로 직접 AD를 구현하고 그 AD를 직접 모의해킹 침투를 진행하고 이후 방어쪽에서도 로그들을 수짐 및 인공지능에게 분석시키는 것을 하려고 했었다.

그리고 그 과정에 침투를 진행하는걸 뭐로 할까 하다 라즈베리파이를 4개정도 갖고 있으니 이걸 써야겠다! 하는 생각이 들었었다.

물론 지금은 결국 프로젝트를 하려 했던게 이게 의미가 있는 활동인가? 어쩌피 이미 오픈소스나 이런걸로 존재하는데 내가 열화판을 만드는데 의미가 있을까 하는 일종의 현타가 와버린 상황이라 그걸 해결하기 위해서라도 일단 라즈베리파이에 sliver를 올려 `Red Teaming`을 위한 서버를 간단하게 구현해보기로 했다.

> 참고로 내가 사용할 라즈베리파이 버전은 **RPi 4B**이다.

## 라즈베리파이 os 준비하기

![ubuntu server](https://github.com/user-attachments/assets/6f55b095-9e1b-4b4d-9d73-5aa7018a2da5#.png)

가만 생각을 해보니 굳이 이 서버에 ui는 필요 없을 듯 하고 뭔가 필요한 툴이 있다면 내가 직접 설치하면 되는거니까 이번엔 **라즈베리 파이 이미저**에서 지원하는 **Ubuntu Server 26.4** 이미지를 이용하기로 했다.

![저장장치](https://github.com/user-attachments/assets/8b9e02c0-1a96-42c8-9f75-8cca7d5a45b2#.png)

저장 장치는 이처럼 64기가 짜리 SD카드에 구웠고(근데 왜 59.7GB로 뜨냐고? 나도 모르겠다.)

![이미지 기록](https://github.com/user-attachments/assets/c6241c47-5d19-40fd-85be-59340b4d87e4#.png)

모든 로컬화나 사용자, wifi, 원격 접근(ssh)도 설정하고 기록을 누르게 되면?

![쓰기 완료](https://github.com/user-attachments/assets/e28dd9e8-5091-49c2-a91e-d049dddfd03c#.png)

많은 시간이 지난 후(sd카드라 그런지 좀 많이 느리다) 모두 잘 설정되었다고 한다.

## 네트워크 연결하기

![켜졌나](https://github.com/user-attachments/assets/d8bf8f7a-84c1-40c2-9308-8b7e9ab22188#.png)

아니 근데 이녀석이 연결 하고 나서 불빛이 깜빡이는데도 설정한 Wi-Fi 네트워크 상에 전혀 잡히지가 않았다.

또 혹시 저번에 kali 설치했을 때 못 잡은 것 처럼 문제가 있는건가? 했는데 

듀얼 모니터를 사용하기에 하나에 연결해보니 글쎄 딱 이 상황에서 ssh 키를 만들고 그냥 멈춰있는게 아니겠는가...

어째서? 다음을 뭔가 진행하고 해야 했던거 아닌가?

![키보드](https://github.com/user-attachments/assets/dec81c6d-fc32-425d-a48f-8194c761a0f1#.png)

그래서 어쩔 수 없이 남는 키보드가 없는지라 본체의 키보드를 잠시 빌려 Enter 키를 누르니 그제야 login이라는 문구가 뜬다.

근데 사실 어쩌면 이거 login 안떠도 원래는 되야하는 것일 수도 있다. 왜냐면 다음에 나올 과정들을 생각해봤을 때 뭔가 이상했거든.

![로그인](https://github.com/user-attachments/assets/ac4cdfbc-29db-4697-bad3-527bf6cb8115#.png)

처음 os 생성할 때 계정을 만들어뒀으니 그걸로 로그인을 시도해 CLI로 들어갈 수 있다.

그런데 또 IPv4를 보니 왜 eth0가 10.10.10.2 인거지? 우리 집 내부 인터넷은 저게 아닌데다가 **eth0** 면 유선 랜카드인데...? 난 무선으로 연결하려 했단 말이에요?

![당연히업뎃 안됨](https://github.com/user-attachments/assets/466f1ea2-fc97-4629-ae26-e71a3b79d057#.png)

그러니 당연하게도 업데이트는 안 되고..

![혹시](https://github.com/user-attachments/assets/7575138b-fdf2-43df-bf40-162d709a3b48#.png)

혹시해서 `50-cloud-init.yaml`을 읽어봐도? 흠... 잘 들어가 있는데...

![왜됨](https://github.com/user-attachments/assets/08f5a307-e7bf-4cea-a616-d897cd07b93d#.png)

그런데 다시 확인을 해보니 갑자기 됬네? 어째서?

![ssh연결](https://github.com/user-attachments/assets/9ff39480-6d95-46ae-a67e-cc444bd50e29#.png)

그렇게 본 컴퓨터에서 Terminus를 이용해 ssh로 연결에 성공했다! 야호!

## 봇 넣어주기

![UCS](https://github.com/user-attachments/assets/1d7f8125-cbd5-4f14-bc37-ca8668dda3e9#.png)

네트워크 설정도 끝났겠다 아무래도 이 라즈베리파이가 무선으로 연결되어있기도 하고 IP를 고정시키고 싶지는 않았기 때문에 봇을 넣어 discord를 통해 켜지면 IP가 뭔지 전송하고 또한 더 편히 서버를 제어할 수 있게 하기 위해 봇을 넣어주자!

![bot](https://github.com/user-attachments/assets/9f0249fc-5b5c-4bb6-bc7b-c0b63745d3c5#.png)

먼저 본 컴퓨터에 설정 자동화를 위한 **setup.sh**, 봇 본체인 **bot.py**, 그리고 서비스 설저엥 대한 **ucs-bot.service**를 scp 명령어를 통해 넘겨줬다.

![ubuntussh](https://github.com/user-attachments/assets/5c7a1994-1b8a-49fd-b4b3-53d0bb4f06d1#.png)

넘겨준 파일들을 잘 세팅 하고

![봇설정실행](https://github.com/user-attachments/assets/7f259eb0-c9db-4798-b4c5-bce5a43f956c#.png)

자동으로 봇 설정과 자동시작등을 해주는 shell을 실행시키면?

오류가 뜬다. 

![다시](https://github.com/user-attachments/assets/8528264f-f8e5-4b5a-aa19-1039a6dde815#.png)

그렇기에 다시 권한 설정 및 토큰 넣기 등 모든 설정을 다시 해주면?

![bot완성](https://github.com/user-attachments/assets/47540fb4-2237-407a-b8d1-f202fa7365fd#.png)

이렇게 봇이 매우 잘 작동하고 있는 것을 확인할 수 있다!

다만 방금 확인해보니 이거 서버 꺼지면 그건 또 감지를 안하더라? 전에 mincraft 서버 만들 땐 됬었는데 흠... 뭔가 살짝 바꿔야 할지도?

그래도 기능상에는 문제 없으니 한잔해.

## Sliver 서버 설치 & 설정

![sliver 설치](https://github.com/user-attachments/assets/1405ae3b-d819-41de-9b8a-0606db5cd8b8#.png)

사실 sliver를 설치하는 과정 자체가 딱히 별게 없다. 

그저 curl로 **sliver.sh**를 받아온 후 실행하기만 하면 끝

![sliver 서버 설정](https://github.com/user-attachments/assets/99aa96a7-3e05-4c8e-b4cd-ec5f2d11a054#.png)

아래 성공한 부분만 보면 `yoonseul` 이라는 계정에 Sliver 접속 가능한 모든 권한을 부여하고 파일을 옮기기 위해 소유권을 변경해줬다.

![ftp](https://github.com/user-attachments/assets/f5aa58eb-a811-4a89-804a-374a7678366b#.png)

이후 terminus의 SFTP 기능을 활용해 본 컴퓨터로 인증키를 옮겨줬다.

## Sliver 클라이언트

![sliver 클라이언트](https://github.com/user-attachments/assets/d06084ee-7b64-48ef-9956-b7af25769aed#.png)

서버는 만들었으니 그럼 클라이언트가 있어야겠지?

github에 들어가 본인에게 맞는 클라이언트를 설치해주면 된다.

![바이러스](https://github.com/user-attachments/assets/03075f48-145a-4626-9455-e6446fa8b3f4#.png)

만... 자꾸 크롬이 바이러스가 발견된다고 막는다.

![제외](https://github.com/user-attachments/assets/26749c7d-c522-457d-9ae9-cabbcb9b47dd#.png)

그래서 혹시 하는 마음에 windows defender에서 예외처리한 폴더를 만들었는데 여기까지 옮기기도 전에 일단 다운로드 자체를 막더라.

![USS](https://github.com/user-attachments/assets/ca008ca6-72ea-427a-b646-3c0525f1efbc#.png)

하지만 내가 누구? 집념의 한국인!

firefox로 넘어가 다시 다운로드를 진행하자 다운은 되는데 10초 내로 디펜더가 잡아 없애기에 바로 복사하기를 눌러 검사가 제외된 폴더로 쓱 옮겨줬다.

이렇게 하니 다운로드 폴더에 있던 클라이언트는 갔지만 USS 폴더의 클라이언트는 살려둘 수 있었다.

![Sliver](https://github.com/user-attachments/assets/eae1b893-9311-4050-bdd0-3728cf360bd4#.png)

그렇게 처음 봤던 이미지처럼 Sliver 서버에 접속하는데 성공했다!!

야호! 다만 외부에선 아직 접속은 불가능하다. (포트포워딩 안해서)

## 그래서 이 Sliver, 도대체 언제 어디서 어떻게?

이렇게 삽질을 해가며 라즈베리파이에 기껏 C2(Command & Control) 서버를 올렸는데, "이걸로 뭘 할 수 있는지" 모르면 섭섭하다.

특히 나처럼 HTB(Hack The Box)를 푸는 사람들에게 이 C2 서버 구축을 해서 도대체 뭘 할 수 있는걸까?

### 1. HTB 킬체인(Kill-Chain)의 어느 단계에서 쓰일까?

보통 HTB 문제를 풀 때 우리는 Nmap으로 포트를 찾고, 웹 취약점을 털어서 `netcat(nc)`으로 불안정한 리버스 쉘(Reverse Shell)을 딴다.
Sliver는 정찰(Enumeration) 단계에서 쓰는 툴이 아니다. **초기 침투(Initial Access) 이후, 거점을 확보하고 권한을 상승시키는 Post-Exploitation(포스트 익스플로잇) 단계**에 사용하는 도구다.

* **기존 방식:** `nc -lvnp 4444` 띄워놓고 쉘 얻음 -> 실수로 `Ctrl + C` 누르면 쉘 죽음 -> 다시 처음부터 공격... (깊은 빡침)
* **Sliver 활용:** 타겟에 Sliver로 만든 악성코드(Implant)를 심어서 실행 -> 라즈베리파이 C2 서버로 안정적인 쉘(Session/Beacon)이 떨어짐 -> 통신이 끊겨도 좀비처럼 알아서 다시 연결됨!

물론 tmux를 쓰면 되지만.

쉘 업그레이드(`python -c 'import pty...'`) 같은 귀찮은 짓을 할 필요 없이, Sliver 콘솔 안에서 명령어 한 줄로 파일 업로드/다운로드, 포트 포워딩, 권한 확인이 모두 가능하다.

### 2. Red Teaming에서의 진짜 의의 (블루팀 농락하기)

실제 기업을 상대로 모의침투(Red Teaming)를 할 때, 날것의 넷캣(Netcat) 쉘을 쓰면 방어자(Blue Team)의 보안 장비(EDR, IPS 등)에 적발된다. 하지만 Sliver를 쓰면 다음과 같은 것이 가능해진다.

* **통신 암호화 및 위장:** Sliver는 블루팀의 네트워크 패킷 분석을 피하기 위해 정상적인 HTTPS 웹 서핑 트래픽이나 mTLS 등으로 위장하여 통신한다.
* **Fileless(메모리 내 실행):** 타겟 PC에 `mimikatz` 같은 유명한 해킹 툴을 파일로 다운받으면 백신에 바로 걸린다. 하지만 Sliver는 해킹 툴을 타겟 PC의 메모리(RAM)에 직접 꽂아 넣어서 실행(execute-assembly)할 수 있다. 디펜더를 피하는 기술이다.
* **멀티플레이(협동 공격):** 이 라즈베리파이 서버 하나만 켜두면, 다른 팀원들도 클라이언트로 접속해서 하나의 타겟 PC를 동시에 요리할 수 있다.

사실 이렇게만 이야기하면 그래서 뭔데? 싶을 수 있겠지? 그러니 한번 다음 HTB 문제를 풀 땐 만들어둔 이걸 이용해보기로 하자! (가능하다면)

Happy Hacking!!