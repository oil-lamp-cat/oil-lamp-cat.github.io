---
title: "[Red Raccoon] Raccoon Hospital (Easy)"
date: 2025-12-06 16:19:43 +09:00
categories: [hacking, Red Raccoon, Linux]
tags: [RTB]
pin: true
---

## 시작에 앞서

![Raccoon Hospical](https://github.com/user-attachments/assets/0c046fed-f74f-4cb4-ab6f-30a17e900530)

[RACCOON THE BOX](https://rtb.redraccoon.kr/index.html)

이젠 무료로 진행할 수 있는 HTB 문제를 거의 다 풀기도 했고 전에 풀었던 `Red Raccoon` 커뮤니티에 `라쿤 더 박스`라는 이름으로 `Tryhackme`나 `HTB`와 같은 박스를 진행할 수 있게 만들었다 하여 한번 해보고자 한다.

![How to Play RTB](https://github.com/user-attachments/assets/efc0324a-f0a9-4194-b4af-a2c65c49358c)

vpn에 접속하는 방법은 위와 같다.

일단은 어떤 환경의 머신일지 전혀 모르겠으니 WSL보다는 vm을 이용하도록 하겠다.

### RTB 접속하기 (kali VM)

![download wire](https://github.com/user-attachments/assets/ec7bb1c0-8250-4721-a729-31a330aca6d9)

이렇게 wireguard를 설치 후 

![genprivate](https://github.com/user-attachments/assets/516c610d-5eb6-4436-8099-d51ec9b05262)

public 키를 얻고 난 후 디스코드 서버에 가서 `/register <public key>`를 넣으면

![didit](https://github.com/user-attachments/assets/f7da21c4-4aa9-4082-818d-a85075aa9fa7)

개인 디스코드로 위와 같이 연락이 온다.

![add](https://github.com/user-attachments/assets/f9bfc865-431f-4c92-97fe-42d8d5135908)

그럼 이제 `sudo vim /etc/wireguard/wg0.conf` 명령어로 파일을 만든 후 위와 같이 Privatekey와 그 아래엔 봇이 보내준 모든걸 보내면 된다.

![이후 실행](https://github.com/user-attachments/assets/4011b5d7-d63f-4609-bcf7-d47083a9dd88)

이후 위와 같이 저장한 것을 실행시키면 성공!

홈페이지에 리눅스 설명도 써있으면 좋으련만...

참고로 저 `10.8.0.1`은 박스가 아니라 wireguard vpn 서버가 정상 작동하는지 확인하는 것이니 해깔려 하지 마시길. (내가 그랬기에...)

![machine 정보](https://github.com/user-attachments/assets/21c57562-5000-439d-880a-31a0feb1d778)

해볼 수 있는 머신 개요는 봇에게 `/labs` 명령어를 넣어 확인할 수 있다.

## 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![Raccoon Hospital](https://github.com/user-attachments/assets/0c046fed-f74f-4cb4-ab6f-30a17e900530)

자 그럼 다시 돌아와 이번에 해볼 문제는 `Raccoon Hospital` 줄여서 `RH`라고 부를 문제이다. 난이도는 EASY이고 이제 운영체제나 이런 것들을 확인해봐야겠지?

![nmap result](https://github.com/user-attachments/assets/10397897-9149-486d-8814-635f5b65d2f0)

일단 이번에는 전과 달리 `-oN`이라는 명령어를 사용하여 결과를 저장해 필요시 다시 볼 수 있게 하였다.

보아하니 `22번` 포트에 우분투 리눅스 라고 나와있고.

`80번` 포트에 http 사이트가 열려있는 것을 확인했다.

그럼... 들어가 봐야겠지?

![RH](https://github.com/user-attachments/assets/57029a03-983e-4fd4-b45a-6f364002c214)

메인 페이지에 들어와보니 의료 기록을 업로드 하면 뭔갈 해준다는데.

![upload Record](https://github.com/user-attachments/assets/abed2733-10ac-4cc8-a0b4-f963408d7dd0)

파일 업로드 부분,

![about](https://github.com/user-attachments/assets/a08d9d5e-5924-4f58-90c2-c17c56184b0a)

의사는 `John Doe`라고 하고,

![contact](https://github.com/user-attachments/assets/83b4fb4f-64f5-4161-a014-b4ad3d84906c)

연락에는 불편하게스리 살짝 삐져나와있다.

![all file?](https://github.com/user-attachments/assets/da6ce86d-e40c-4a0e-8626-af53469a645d)

그리고 모든 파일을 업로드 할 수 있네?

## 초기 침투 (Initial Foothold / Exploitation)

![reverse shell](https://github.com/user-attachments/assets/694539f6-1a8a-43c0-80f0-fde66e9acb6a)

간단한 리버스 쉘을 만들고

![업로드](https://github.com/user-attachments/assets/44f13763-2dcd-45fc-90d2-30aa7cf5cf65)

업로드를 하면..?

안 되네?

![uploads](https://github.com/user-attachments/assets/c16dad97-d3b8-494b-bd22-bd4a814e297e)

![했다](https://github.com/user-attachments/assets/02f3edfb-ee9d-4c38-af42-d02384e56f45)

설마 이거 파일 어디에 업로드 되려나 해서 여기저기 링크를 돌아다녔었는데 생각해보니 그냥 gobuster를 쓸걸 그랬다.

물론 그게 아니더라도 지금처럼 `/uploads`등 개발자도 이해하기 편한 위치에 파일이 업로드 될 확률이 높으니 그걸 이용하면 되겠다.

![나 말고](https://github.com/user-attachments/assets/096ba8b9-c9e6-48cd-9ec8-11e147676cae)

나 말고도 꽤나 지금 시도하고 있는 것 같은데?

![으음..](https://github.com/user-attachments/assets/14faae2b-c98b-492c-937e-e23289c48cd8)

하지만 지금 내가 권한이 있는 파일은 없다.

![mail](https://github.com/user-attachments/assets/7455a872-9f96-4ec0-be8d-3ccb4d16d54a)

그렇게 파일을 이동하거나 권한들을 찾아보다 초기 리버스쉘 위치인 `www`이 아니라 `www-data`안에 `mailbox`를 발견했다. 그리고 거기에 드디어! 찾던 정보가 들어있는 것을 확인했다.

아니 근데 분명히 find로 PASSWORD 했을 때 없던데 뭐지?

![get john](https://github.com/user-attachments/assets/0c5c51e4-b9d9-41f8-b6c7-edb805626386)

음~ 이거지!

![user.txt](https://github.com/user-attachments/assets/ae70cc52-8554-4dca-bc8c-38c84f1a7825)

나이스!

![flag confirmed](https://github.com/user-attachments/assets/f8117478-0571-48d4-940b-5bdb3acac963)

## 권한 상승 (Privilege Escalation) 

![sudo -l](https://github.com/user-attachments/assets/274e3803-94ea-4358-9967-cf2e14dc14b8)

권한을 확인해보니 `find` 명령어가 루트 권한으로 실행시킬 수 있다는데..

`-exec`으로 루트 권한을 얻어버리면 되네?

![root](https://github.com/user-attachments/assets/f08f4573-d212-4f5a-8dea-1bf2e15ef4c6)

루트 권한 획득 성공!

![bash history](https://github.com/user-attachments/assets/6131598f-c50a-4753-9f45-25bedc2d7698)

그리고 여담으로 `.bash_history`에 들어가보면 위와같이 다른 사람들이 이미 여러번 같은 방법을 시도했음을 알 수 있다.

요거 원래 없어져야하는거 아니냐곸ㅋㅋㅋㅋ 이거 답안지잖앜ㅋㅋㅋㅋ

![get root flag](https://github.com/user-attachments/assets/09af349b-b2aa-437d-a00b-e45ea34912d1)

![done](https://github.com/user-attachments/assets/ad4405a6-51cd-41ee-8537-fef040d4215f)

## 마치며

EASY 난이도이기도 하고 비슷한 문제를 HTB에서 몇번 봤다보니 이런 문제는 이제 손쉽게 해결할 수 있게 되었다.

다음에는 바로 옆에 있는 

![Shelock Holmes](https://github.com/user-attachments/assets/3fae49d2-8753-47fa-9831-501b5fbf0d5b)

셜록 홈즈 문제를 풀어보자!