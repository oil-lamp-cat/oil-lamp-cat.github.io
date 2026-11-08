---
title: "[PG Play] Amaterasu (Linux_Fundamental)"
date: 2026-11-08 10:48:00 +09:00
categories: [Security & Hacking, HTB]
tags: [Proving Grounds Play, hacking, RedLabs, Linux]
pin: true
---

## 1. 시작에 앞서

![이번에도 풀어본](https://github.com/user-attachments/assets/8f48ff74-745c-4fa5-a84b-e6a30d327a27#.png)

이번에도 풀어본 PGP 문제!

이번엔 `Amaterasu`라는 것을 풀어보았고, 이번에야말로? 쉬웠다.

## 2. 초기 침투 : 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![enum](https://github.com/user-attachments/assets/f7d6d079-7458-48e1-ae92-2f14d1a497a6#.png)

시작과 동시에 nmap을 돌려 포트 스캐닝을 진행했고, `21/ftp`가 열려있는 것을 확인 하였기에

난 anonymous 로그인 된다고 해서 바로 접속을 했지.

근데 그 아래를 안 읽었단 말이지...

`Can't get directory listing: TIMEOUT`

![ftp안됨](https://github.com/user-attachments/assets/e54539e7-f006-495a-8788-67013579f81f#.png)

이 때문인지 어떤 방법을 써봐도, 적어도 내가 아는 방법으론 ls를 하던가 다른 명령어를 쓰는 것이 불가능했다. 

게다가 다른 포트에 열린 서비스에 들어가볼까 해도 다 `closed`여서 접근도 안되고..

![nmap2차전체스캔](https://github.com/user-attachments/assets/af8e0a7b-1964-4b5d-ac3b-8a0917341936#.png)

그래서 아예 nmap을 전체 포트 단위로 스캔해보기로 했다.

그러자! 드러난 `open` 포트들!!

![조금더](https://github.com/user-attachments/assets/2283e44c-c6a4-42c8-bdcf-f8723d91f05e#.png)

조금 더 자세히 알기 위해 `-sV -sC`와 포트를 지정해줘 전체를 스캔해보았을 때 http 사이트들을 발견할 수 있었다!!!

![접속](https://github.com/user-attachments/assets/a8fad8b9-598e-41a1-890d-2ee1d5a5b728#.png)

접속을 해보니 이렇게 firefox? 그림이 있는 사이트가 드러나기도 했고

![그런데](https://github.com/user-attachments/assets/ffdc60e8-ab2d-4cfe-894c-776e82539067#.png)

그런데 다른 포트로 접속한 부분에선 보이는게 없기 때문에 

![wapa1](https://github.com/user-attachments/assets/2f2c4894-f1f8-4e7f-8052-fef7d036e146#.png)

![wapa2](https://github.com/user-attachments/assets/233fda75-9c0f-42fd-a87a-36b9e36010e9#.png)

이렇게 사이트도 확인을 해보았지만 어음.... 모르겠다

![혹시](https://github.com/user-attachments/assets/06dc19c1-762c-44e0-bb28-37771ff95825#.png)

혹시나 하는 마음에 두 사이트에 dirsearch로 dir 브루트 포싱을 돌려보았고

그 결과 notfound가 떴던 사이트에 `/help`와 `/info`를 찾아낼 수 있었다.

![info](https://github.com/user-attachments/assets/529b4231-cf56-4683-8fbf-c9456f2148e4#.png)

보아하니 API 서버였던 것이다!

![help](https://github.com/user-attachments/assets/359b15f4-876f-41b2-8363-e770ad700b1d#.png)

게다가 이렇게 친절하게도 어떻게 쓸 수 있는지 API 리스트를 던져주는게 아니겠나?!

특히 그 중 내 눈에 보인건 `/file-upload`였다. 여기서 ssh 키를 업로드 할 수만 있으면? 바로 호로록

## 3. 초기 침투 (Initial Foothold / Exploitation)

![dir](https://github.com/user-attachments/assets/0341a894-f7d5-40eb-ae2e-165daf887455#.png)

그래도 일단은 다른 기능들도 써보기 위해 `file-list?dir=/`로 루트 경로를 살펴봤는데 잘 잡혔고.

![그중](https://github.com/user-attachments/assets/ba6ce222-7224-44c7-86c9-3a97fdb7eae9#.png)

그 중엔 `/root` 폴더도 있기에 한번 찾아가봤으나 아무래도 권한 문제가 있는 것인지 접근할 수 없었다.

고로 우린 ssh를 넘겨준다고 해도 최대 user 계정으로 접근 가능할 것이라는 의미!

![사실](https://github.com/user-attachments/assets/8ca6e195-2110-4574-be6f-bc588ad136a2#.png)

사실 그보다 `/home` 경롤르 살펴 보았을 때 `alfredo`의 계정을 발견할 수 있었고, 게다가 접근도 가능했기에 `local.txt`는 바로 읽을 수는 있었다.

![테스트 삼아서](https://github.com/user-attachments/assets/263e2348-95c3-46a6-85d5-442ed1834d27#.png)

테스트 삼아서 그냥 `.txt`를 업로드 해보았더니 정말로 들어갔기에 ssh 키를 바꿔치기 하면 되겠구나! 라고 알 수 있었다.

![sshkey만들기](https://github.com/user-attachments/assets/4b1224d9-1b99-48f1-a395-57dc37fd97d3#.png)

고로 `ssh-keygen`을 이용해 키를 만들고 `authorized_keys`로 `pub`키를 이름 바꿔준 뒤에

![filetype](https://github.com/user-attachments/assets/88eef9c8-7bcd-4fd9-98c4-ab3aa327df3c#.png)

넘겨주면? 바로 그냥 filetype 에러가 발생한다.

올릴 수 있는 파일 타입이 정말 기본적인 txt, pdf, png, jpg, jpeg, gif 라는데

![ssh](https://github.com/user-attachments/assets/dbc76aeb-9a35-4fe0-b323-b883dc2d8ba1#.png)

![이렇게](https://github.com/user-attachments/assets/94a415fe-0a39-447c-82f4-54ecf196e3ad#.png)

이렇게 클로드의 자세한 설명 처럼 진행 하여 이름을 속여 저장할 수 있었다.

![좀 더 자세히](https://github.com/user-attachments/assets/616ecc92-caac-468e-8f66-4403a7748d60#.png)

솔직히 내가 이거 할 땐 그냥 인터넷에서 이런 방법이 있더라 하고 진행을 했었는데 막상 원리를 뜯어보니까 이거 나 못 풀었을 수도 있겠다 싶다 ㅋㅋㅋㅋ

이런 취약점을 `TOCTOU` 비슷한 느낌이라고 이해하면 될 것 같다.

> 검사 대상과 사용(저장) 대상이 불일치 + Path traversal 미차단

![get user](https://github.com/user-attachments/assets/341346bc-57e9-492a-bada-4b26e88594d9#.png)

그렇게 userflag를 얻어낼 수 있었다.

![추가로](https://github.com/user-attachments/assets/23915342-6a27-4bf2-ad94-b6e350b7c203#.png)

추가로 이건 내가 해깔려서 물어보고 알아낸 것.

나중에 이런 문제 나오면 또 여기 찾아와야겠다.

![localtxt](https://github.com/user-attachments/assets/3bf99c66-20ee-4553-bf8a-7b8d53e2d25a#.png)

## 4. 권한 상승 (Privilege Escalation) 

![sudol](https://github.com/user-attachments/assets/3a0e33a7-70b0-442f-a19b-52ceb7e2670d#.png)

자 그럼 국룰인 권한 상승을 위한 `sudo -l`을 입력 해보았으나? 난 비번 모르거든...

![getcap](https://github.com/user-attachments/assets/d80f637b-8f22-471f-bfa3-3b2752b5fc6b#.png)

그렇기에 지금 계정으로 `getcap -r`을 찍어보았고 근데 솔직히 그래도 모르겠기에

![crond](https://github.com/user-attachments/assets/2f81aed5-7222-488b-bd93-9271cb3d48c2#.png)

`/etc/crontab`을 읽어보았더니 여기 root 권한으로 실행되는 `/usr/local/backup-flas.sh`가 있네?

![flasktargz](https://github.com/user-attachments/assets/50b8992d-e291-4542-88a5-ae2122322c75#.png)

그래서 `.sh`를 읽어보았더니 (내가 권한이 있어 읽을 수도 있었음)

내가 쓰기 가능한 폴더인 `/home/alfredo/restapi`가 `$PATH` 맨 앞에 나오고

`tar`를 절대경로 없이 호출 하는데다가? `*`가 있어서 와일드 카드로 모두 다 실행이네?

![바로](https://github.com/user-attachments/assets/8b7de5fb-08a6-4ec6-8516-652d04120333#.png)

바로 그냥 `tar`의 `PATH 하이재킹`을 해버리기 위해 `/home/alfredo/restapi`에 `tar`이라는 이름의 `rootbash`로 올려줄 루트 권한 스크립트를 만들어놓고

기다리면?

![안된다](https://github.com/user-attachments/assets/202d12fd-4811-4456-b8e5-e48015bedde4#.png)

어째서?!! 안 되는 것이냐?? root 권한을 갖고 있으면서!!! 왜?? `-p`도 잘 했는데!!

![는](https://github.com/user-attachments/assets/90b54712-c0ce-4da0-a3e9-1e2e34c34727#.png)

는 확인을 해보니 `SUID`는 제대로 걸렸지만 `findmnt /tmp`로 `/tmp` 폴더를 확인해보니 `nosuid`로 마운팅이 되어버리면서 커널이 `SUID`를 씹어버리는 상황이 있었다.

이게 `Fedora`의 기본 값이라고 하니 기억해둬야겠다.

![그래서](https://github.com/user-attachments/assets/77872da2-e7ec-4828-acf6-e89ca52c23d8#.png)

그래서 다시 찾아보다가 그럼 일단 권한 상승을 위한 경로는 만들어지니까 내꺼는? 이라는 생각에 `/home/alfredo`를 확인해보니 `nosuid`가 없었다!

![고로](https://github.com/user-attachments/assets/6f50194f-7130-4ca6-9134-5276675d4fd4#.png)

고로 이렇게 이전처럼 대신 경로만 내 폴더로 해서 실행 하면?

따단!! 루트 권한을 획득 할 수 있었다!!

![아직](https://github.com/user-attachments/assets/0c29c8fe-d3f3-4d4e-ac88-7165993140db#.png)

아직도 1시간 컷이나 걸린다니... 조금만 더 공부를!!

## 마치며

![Amaterasu](https://github.com/user-attachments/assets/8a9a62b3-b454-49e2-950f-a25c87ce18df#.png)

Lab time이 13분으로 나오는데.. 저건 아마 내가 권한 상승 할 때를 의미하는 것 같고

실제론 1시간이니 말이지.

아니 근데 OSCP+ 강의 lab은 15점씩 주고 그럼서 PGP는 1시간 걸려 풀면 10점 주는거야? 너무하네!

이번 문제에서 쓴 내용들을 간단히 써보자면?

1. 포트 은닉 - 기본 포트가 아니라 뒤에도 있었으
2. FTP 래빗홀 - 접속은 되는데 아무것도 못 한다? 래빗홀 신호
3. Path Traversal + 파일 업로드 검증 우회 - secure_filename()으로 경로 제거 해야 함 + os.path.realpath()로 업로드 루트를 벗어나는지도 검증 해야함!
4. Cron + PATH Gijacking - 권한 상승
5. nosuid 마운트 - `tmp`가 `nosuid`였던 해프닝 - findmnt로 한번씩 확인 해보기!

Try harder!!