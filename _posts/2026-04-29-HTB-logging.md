---
title: "[HTB] Logging (Medium_Windows)"
date: 2026-04-29 20:02:00 +09:00
categories: [hacking, RedLabs, Windows, Active Directory]
tags: [Hack The Box, Medium]
pin: true
password: "20260429"
---

> 발표자료 업로드 완료!

[HTB_Logging_호롱고양이.pptx](https://github.com/user-attachments/files/27359895/HTB_Logging_.pptx)

![Logging](https://github.com/user-attachments/assets/43e7bb4c-dda4-4e81-a837-28310ae5d6c8#.png)

[You have solved Logging! Congratulations OilLampCat best of luck in capturing flags ahead!](https://labs.hackthebox.com/achievement/machine/988787/888)

## 1. 시작에 앞서

![Logging](https://github.com/user-attachments/assets/7d2eefe5-9959-425b-b9b6-0f7528d80442#.png)

이번에도 또 다시 season 문제를 둘러보다 풀게된 Windows 머신인 Logging! 분명 지난번에 윈도우는 안 풀겠다 했지만 그게 쉽던가 ㅎ 결국 보이는 것을 풀 수 밖에 없었는걸?

다만 이번 문제의 경우 내가 권한 상승 부분에서 왜 됬지? 하는 내용이 있다보니 아무래도 좀 발표를 진행 한 후 추가적으로 다시 적게 될지도 모르겠다.

그럼 시작! 

## 2. 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![계정](https://github.com/user-attachments/assets/6cdec707-858e-465e-becb-28a4401c862b#.png)

처음 주어진 계정은 `wallace.everette / Welcome2026@` 이고 역시 기본적인 침투는 되었다고 가정하고 시작된다.

### 2-1. nmap -Sv -Sc

![nmap1](https://github.com/user-attachments/assets/0ca14ab5-2df3-4f70-a77a-e310d077a73d#.png)

![nmap1](https://github.com/user-attachments/assets/28e11dce-e038-4ccc-bc07-2b76ab683be9#.png)

일단 문제를 풀기 위해선 웹이 열려있는지 os가 뭔지 어떤 서비스가 있는지 등을 알아야 하기에 nmap 스캔을 돌려주었고 역시 active directory 답게 많은 서비스가 뒤에 돌고 있었다. 설명은 이전 포스트들에서 많이 다뤘고 음... 딱히 특이사항이 보이지는 않기에 이런 포트들이 존재한다고 염두하고 넘어가자.

당연하겠지만 이 과정은 매우 중요하다. 여기서 공격 벡터를 찾을 때가 많으니까. 고로 가능하면 이런 기록들은 -o 명령어를 통해 저장해두는걸 추천한다.

### 2-2. smb share, users

![smb file](https://github.com/user-attachments/assets/d490c707-0b98-495e-9e9c-906218d877e7#.png)

일단 smb가 열려있다 하였고 계정이 있으니 이 계정으로 접근할 수 있는 공유 파일이 있을까 하여 살펴보았다.

그리고 이 과정에서 지금 우리는 권한이 없지만 뭔가 `WSUSTemp` 라는 그동안 본 적 없던 공유 파일이 존재하는 것을 알 수 있었다.

그리고 사실 난 이게 어쩌피 권한도 없어서 의미 있겠나 싶어 그냥 쭉 진행하다 막혀 다시 진행했던 스크린샷을 보고 그제야 권한상승 부분의 실마리를 잡을 수 있었다. 이래서 **정보 수집**이 중요한거다. 꼭 적어두자. 아니면 적어도 스크린 샷으로라도.

![smb user](https://github.com/user-attachments/assets/f7f21429-c88c-4507-862f-1ebdd44b70c3#.png)

이후 전체 유저들을 스캔해 보았고 이번에는 저번과 달리 유저는 많아졌지만 `krbtgt`가 하나만 존재하기에 어쩐지 안심했다. ~~정말 끔찍했어~~

![IPC](https://github.com/user-attachments/assets/78555c28-cd3c-4f9f-82ba-3a6a71c12a99#.png)

일단 평소 그렇듯 IPC$는 비어있었다.

![Logs](https://github.com/user-attachments/assets/28ff8294-b683-4574-b607-d3b600dae3f2#.png)

여긴 뭔가 로그들이 저장되어있었고 smb로 보기 불편해 통째로 다운받았다.

![Netlogon](https://github.com/user-attachments/assets/3fd8a37a-947e-4699-88cc-79f23639cb51#.png)

여기도 비어있기는 마찬가지.

![SYSVOL](https://github.com/user-attachments/assets/7ab7e1b8-1f8d-491e-81b4-8f1fe5ab7392#.png)

여기도 아마 계정들에 대한 정책 같은게 들어있을텐데 통째로 다운받았다.

![WSUSTemp](https://github.com/user-attachments/assets/da3bc729-7327-43f9-8a42-7376328b120d#.png)

애초에 권한이 없기에 WSUSTemp엔 접근할 수도 없었다.

### 2-3. log

![audit_hearbeat](https://github.com/user-attachments/assets/aabc9b19-ad8e-4b7e-a0e2-add43aa5288d#.png)

받은 로그들을 하나씩 살펴보자. 일단 Audit_Heartbeat.log를 보니 이름에서도 그렇고 내용에서도 그렇듯 어째 인공심박동기 로그인지 심장 박동 서비스가 정상인지 체크한다.

![IdentitySync_Trace](https://github.com/user-attachments/assets/7e70a8b3-8f16-42fd-8267-e07c3857a9ce#.png)

**IdentitySync_Trace_날짜.log**는 딱 봐도 이 장비가 서버에 요청을 보내고 나 누구임 살아있고 내 정보는 뭐야 하고 알려주는 로그인듯 하다. 

하지만! 여기서 Timeout이 난 로그를 보니 `Bind_User`, `Bind_Pass`라며 이 계정이 로그인할 때 사용한 유저(LOGGING\\SVC_recovery)와 비밀번호(E어쩌고$$2025)가 눈에 띄었다. 벌써 정보 수집에서 계정을??!

![Service_State](https://github.com/user-attachments/assets/75a061d6-37a6-4064-ae72-3314bf47a3a8#.png)

요건 서비스 시작하는지 멈췄는지 확인하는 로그로 보이고,

![TaskMonitor](https://github.com/user-attachments/assets/145462bd-5094-4e44-a9d0-25d2a76932cc#.png)

이건 건강 체크? 인듯 하다.

그럼 우린 계정을 찾았으니 바로 침투 시작! 을 하기 전에 이 새로운 계정으로도 열거를 해봐야겠지?

### 2-4. 2차 smb 열거 (feat. 안 되지롱)

![smbnotworking](https://github.com/user-attachments/assets/3d0b13b1-f4f6-4c85-829c-b45f55d8365e#.png)

그런데 말입니다. 아니 이 계정으로 smb로그인을 시도하려 하거나 뭘 하려 해도 막히는게 아니겠어요?

열거는 둘째치고 이 계정의 비밀번호가 틀린건지 암것도 안되기에 포기하고 일단 bloodhound를 돌려보기로 했답니다.

### 2-5. bloodhound

![시간](https://github.com/user-attachments/assets/7ddc47a8-572e-4c7d-af7c-54ac5523f068#.png)

시간 동기화 문제로 또 커버로스가 막으려 할태니 먼저 동기화를 해주고,

![bloodhoundce](https://github.com/user-attachments/assets/fcb0b333-b9f6-4e3a-93fc-ec0a1bee7536#.png)

초기 계정으로 스캔을 딱 해주면?

~~사실 무슨 문제인지 처음에 스캔한건 오류가 떠서 다시 했다.~~

![bloodhound result](https://github.com/user-attachments/assets/0cb59b80-ca43-4ee1-8d12-18899e05a464#.png)

이렇게 파일들이 나올 것이고(난 압축을 안해서 .json 형식의 파일들만 있다.),

![bloodhound](https://github.com/user-attachments/assets/e02de738-a5c4-4661-8899-88bccc66bdd1#.png)

bloodhound를 켜주고,

![bloodhound분석](https://github.com/user-attachments/assets/4c835052-2b2f-4b79-ab93-a9b0ae823170#.png)

블러드 하운드에 분석을 맞기고 나면 이제 그래프를 보며 정보를 찾으러 갈 수 있다.

![bloodhound1](https://github.com/user-attachments/assets/28d39708-cb1c-495c-bb9e-3ecb6086644c#.png)

그런데 일단 우리 초기 계정에서 머신을 얻기 위한 연결고리를 찾아봐도 없고

![bloodhound2](https://github.com/user-attachments/assets/2022eaf5-f3e7-4dbd-84db-c5bdedc546b0#.png)

새로 얻을 녀석(실패한)은 초기 계정에서 연결되는 루트가 없었다.

씁....

## 3. 초기 침투 (Initial Foothold / Exploitation)

![try](https://github.com/user-attachments/assets/8bb4cf07-337c-4747-9226-612490a62330#.png)

그래서 진짜 별의 별결 해봤다. 위를 보면 도대체 이걸로 뭘 하라는건가 싶어 tgt 발급도 시도했는데 비밀번호가 틀렸으니 애초에 될리가 만무하지..

### 3-1. Rule-based Attack? 패스워드 주기적 변경 정책?

![what](https://github.com/user-attachments/assets/b1e76b1f-2ace-4a1b-9bdf-28b28f8c76de#.png)

진짜 별 짓을 다 해보다가 시작부터 길을 못찾고 혹시 WSUS로 뭘 해야하나? 했는데 그것도 아닌지라 머리를 싸매고 있다 진짜 혹시 에이 하는 마음에 svc_recovery 계정의 비밀번호 끝자리인 2025년을 지금 년도이자 로그의 년도인 2026년으로 바꿔주자?

아니 세상에 이게 왜 됨?

뭐... 내가 일을 해본적은 없으니 모르겠다만 어쩌면 이건 일종의 기업체에서 시행하는 **패스워드 주기적 변경 정책**같은게 아닐까? 싶다.

보안팀(IT)에서 "비밀번호를 90일마다 바꾸세요! 이전 비밀번호는 쓸 수 없습니다!"라고 강제하면, 귀찮은 직원들은 완전히 새로운 비밀번호를 외우는 대신 더 간단한 방법으로 비밀번호를 바꾸기 시작해버리는거다.

Password2025! -> Password2026!

Spring2025@ -> Summer2025@ -> Fall2025@

CompanyName01 -> CompanyName02

이런 식으로 말이지. 솔직히 우리도 그런 경우 많지 않던가. 비밀번호 갑자기 새로 만들래서 귀찮아 @하나를 추가한다던지 !를 넣거나 년도를 살짝 비틀든지. 딱 이번 문제가 그런 상황이였던 것이다.

야호! 계정을 얻었다!

그러니 이제 이 계정을 갖고 뭘 할 수 있나 다시 살펴보자.

### 3-2. bloodhound 2트 (with. svc_recovery)

![Cypher](https://github.com/user-attachments/assets/103e522f-c622-4ae9-b747-a84321e42a04#.png)

블러드 하운드에는 정말 간편한 스크립트가 존재한다. 바로 Cypher라는 친구로 우리가 습득한 계정을 통해 어떻게 하면 어디로 공격을 진행할지, 그리고 어떤 계정이 관리자 계정이거나 중요한 자산에 접근 가능한 계정인지를 한번에 검색해주는 기능을 갖고있다.

그리고 일단 내가 가장 애용하는(~~매번 바뀌지만~~)건 `shortest paths from object`다.

적어도 이전엔 svc_recovery 계정이 없었기에 뜨지 않았지만 드디어 획득했다고 체크를 하자 노드가 뜨기 시작했다.

![sptfo](https://github.com/user-attachments/assets/0a88f37c-8d37-4556-baea-12a5c33e63e4#.png)

보아하니 역시나 wallance 계정은 따로 떨어져 있었고(하지만 그 덕에 다음 계정에 침투했지) 새로 얻은 **SVC_RECOVERY** 계정은 **MSA_HEALTH**계정에 GenericWrite 권한이 존재했으며 그 계정은 무려! **REMOTE MANAGEMENT USERS** 그룹에 포함되어있었다!!

참고로 **REMOTE MANAGEMENT USERS** 그룹은 이름에서도 알 수 있듯 rpc 즉 원격 접속이 가능한 계정이란 의미다.

### 3-3. svc_recovery -> msa_health (feat. pywhisker)

![how](https://github.com/user-attachments/assets/c21954d8-36ff-4f95-9024-91fe41056d97#.png)

계정을 얻기 위해 genericwrite를 클릭해보면 bloodhound에서 "이런 툴을 쓰면 얻을 수 있어요!" 하고 알려주는 Abuse 패널이 뜬다.

그리고 이번엔 아래 부분의 `pywhisker.py`라는 친구를 사용해볼 예정이다.

![레드팀 플레이북](https://github.com/user-attachments/assets/1fa8b616-b78b-4edf-8ce4-14a358829ccf#.png)

그리고 이것에 대한 내용은 레드팀 플레이북에도 나와있으니 궁금하다면 찾아가보는 것도?

![clone](https://github.com/user-attachments/assets/f90a7282-2f6f-4d29-84c5-0061968fd6f2#.png)

일단 kali에 설치되어있는 기본 툴이 아닌지라 인터넷에서 다운받아 준비했다.

![pywhisker](https://github.com/user-attachments/assets/2f3e5a9f-430a-451d-a13e-921ad4a2e001#.png)

`python3 pywhisker.py ... --action "add"`

를 통해 몰래 SVC_recovery 계정의 쓰기 권한(GenericWrite)을 이용해 겟인 MSA_HEALTH$ 계정의 **msDS-KeyCredentialLink** 속성에 방금 만든 가짜 인증서를 강제로 쑤셔 넣자. 

([+] Updated the sDS-KeyCredentialLink...)

그러고 나면 로그인에 사용할 수 있는 **.pfx** 파일과 비밀번호를 칼리에 저장해주고 이제 이걸 이용하면 된다!

![cetipyad](https://github.com/user-attachments/assets/ccdfd4ae-43f5-49dc-81e4-db12df793192#.png)

`certipy-ad auth -pfx msa_health.pfx ...`

이후 얻은 **.pfx**를 이용해 **Kerberos TGT(티켓)**을 발급받고 거기서 비밀번호 대용으로 쓸 msa_health의 진짜 진짜 **NT Hash** 값을 추출해낸다.

이제 이 해시만 있으면 사실상 비밀번호를 알고 있는거나 다름 없는 샘!

![winrm](https://github.com/user-attachments/assets/059907ac-4fc3-422a-92c7-74b06fcd5155#.png)

그렇게 winrm에 접속이 성공했고! rpc에 접속을 했으니 userflag를 찾아보면?

왜 없지? 

![EH](https://github.com/user-attachments/assets/2611d954-00aa-46de-8963-61b105f4f892#.png)

또 나를 속인거니 머신머신아....

~~신영만 짤 하나만 넣으려다 너무 얼빡샷이 커서 그냥 검색한걸로~~

### 3-4. msa_health 계정으로 둘러보기 -> UpdateMonitor.exe

![winrm](https://github.com/user-attachments/assets/73003f28-6a0f-4a55-8e28-8e11eeb6d82d#.png)

좋아 일단 winrm에는 들어왔는데 유저 플레그가 없으니 다음 계정으로 넘어가야 한다는 의미려나? 싶다.

![insidewinrm2](https://github.com/user-attachments/assets/da9fcac0-c420-401c-ab70-bcde8c78e492#.png)

혹시 하는 마음에 지나온 Documents에 들어가봐도 monitor.ps1 이라는 스크립트가 보인다.

![monitorps1](https://github.com/user-attachments/assets/75435ce9-1676-4be1-9780-ca95086cdbc4#.png)

이게 무언고 싶어 열어보니 이 스크립트는 **UpdateChecker Agent**라는 이름의 윈도우 스케줄러 작업(Scheduled Task)이 잘 돌아가고 있는지 감시하는 역할을 하고 있었다.

![schedule](https://github.com/user-attachments/assets/d480c05d-8cf6-4893-bc2e-4a7498222851#.png)

그렇기에 직접 **UpdateChecker Agent 스케줄러**의 실제 **설정값(XML)** 을 뜯어봤다.

중요해 보이는 것들을 살펴보니.

`<Interval>PT3M</Interval>` 

-> 이 작업은 3분마다 자동으로 실행

`<Command>C:\Program Files\UpdateMonitor\UpdateMonitor.exe</Command>` 

-> 이 작업이 실행하는 진짜 프로그램의 위치

`<UserId>S-1-5-21-...-2105</UserId>` 

-> 이 작업은 시스템(SYSTEM)이 아니라 특정 유저의 권한으로 실행

그럼 이 유저가 누군지 한번 확인을 해봐야겠지?

![siduser](https://github.com/user-attachments/assets/9d08fe4c-46ec-4466-ac82-3522a74cc3d6#.png)

bloodhound에 들어가 찾아낸 Id를 그대로 넣으면 위처럼 **JAYLEE_CLIFTON**이라는 유저라는 것을 확인할 수 있었고 그럼 어떻게든 저 **UpdateMonitor**를 조작만 할 수 있다면 이 계정을 탈취할 수 있을것이다!

![권한 확인](https://github.com/user-attachments/assets/bfb3e7b4-79c6-4ba3-ba90-13a543201681#.png)

게다가 이 프로그램의 권한을 혹시 하는 마음에 다시 확인해보니 **IT**그룹에 권한이 걸려있었고

![notme](https://github.com/user-attachments/assets/99996102-583c-4f4e-b874-16b0408ddc04#.png)

적어도 지금 계정(msa_health)은 `BUILTIN\Users`에 속해있고 UpdateMonitor.exe 파일은 `BUILTIN\Users:(I)(RX)` 권한을 갖고 있기에 적어도 파일 내용을 다운받거나 들어가거나 실행할 수는 있는 상황이었다. 다만 쓸 수는 없기에 파일을 리버스쉘로 바꿔치기 하는 것은 불가능했다. 

![donwload](https://github.com/user-attachments/assets/3ae743b4-4670-403f-94e7-2561fdb6918b#.png)

그래서 일단 exe 파일을 다운받았다. 뭘 하기 위해? 바로 리버싱을 해버리기 위해서!

### 3-5. UpdateMonitor.exe (Feat. DLL Hijacking)

![file스트링](https://github.com/user-attachments/assets/62cc9269-f982-4ae5-9f30-8fbc36390c84#.png)

일단 혹시 일반 텍스트로 뭔가 내용이 써있을까? 싶어 strings 명령어를 사용했으나 어림도 없었다.

![ida](https://github.com/user-attachments/assets/d617862f-7e43-440f-8af2-014b92b8aaa0#.png)

첨에 ida를 이용해 돌리려 했더니 위처럼 `Detected file format: Microsoft.Net assembly` 이라며 C, C++가 아니라 .NET(C#)으로 만들어졌으니 안 먹겠다며 오류를 뱉었다.

![dnspy1](https://github.com/user-attachments/assets/90cedaa2-4edf-429a-aead-08a48789c914#.png)

그렇기 때문에 처음 써보는 툴인 **dnspy**를 이용해봤다. 세상 깔끔하고 바로 컴파일해서 보여주니 마음이 편안~

![tex4isthething](https://github.com/user-attachments/assets/3f692512-56aa-4ce8-aef6-4e7f9ab882b0#.png)

코드를 살펴보니 경로 설정 부분에서

- **text (입력 파일):** C:\ProgramData\UpdateMonitor\Settings_Update.zip

- **text2 (압축 풀 경로):** C:\Program Files\UpdateMonitor\bin\

- **text3 (목표 파일명):** settings_update.dll

- **text4 (최종 실행 경로):** C:\Program Files\UpdateMonitor\bin\settings_update.dll

이렇게 만들어 지도록 되어있는데 애초에 text(Settings_Update.zip)이 존재 한다면 기존에 있던 tex4를 지워버리고 압축 파일을 풀고 text2 안에 덮어 씌워버리게 된다.

만약에 text 파일이 존재 한다고 치고 압축 해제가 끝나면, 방금 덮어씌워진 text4(settings_update.dll)를 LoadLibrary 함수를 이용해 메모리에 강제로 올리고 그 DLL 안의 PreUpdateCheck 라는 함수를 찾아서 실행시키게 된다.

근데 이 과정에서 저 zip 파일 안에 뭐가 있든지 간에 검증을 안 한다는 것!

그렇다면 그렇다면 우리는 가짜 **settings_update.dll**를 만들고 zip으로 만든 뒤 대기를 타면? jaylee.clifton이 알아서 가짜를 실행하게 된다!

**DLL Hijacking (DLL 하이재킹)** 을 하게 되는 것!!

### 3-6. DLL Hijacking (To. Jaylee.clifton)

![msfvenom](https://github.com/user-attachments/assets/7a356790-79ea-405e-be4a-d9e342165d6b#.png)

그렇기 때문에 하이재킹을 위한 dll은 **msfvenom**을 이용해 만들고 이름을 맞춰 압축을해 준비해주자.

![pd](https://github.com/user-attachments/assets/09b99e2e-1509-4725-9cd8-9345470f1e04#.png)

그리고 그냥 ls로 찾았을 땐 ProgramData가 숨겨져있지만 전체로 검색하면 나오니 찾아서 들어가주자.

![uploaddll](https://github.com/user-attachments/assets/3195b523-a468-4ace-94b3-ebe850af3680#.png)

이후 zip 파일을 업로드 하고 기다려주면?

~~솔직히 이번 문제는 기다리는 것 때문에 잘 됬는지 잘못 했는지 긴장되서 기다리는 시간이 너무 힘들었어...~~

![reversshell](https://github.com/user-attachments/assets/d2ad54cb-6313-4dca-b4d7-bc66fb98c5a0#.png)

짜잔! 리버스쉘을 얻을 수 있다!

![jaylee](https://github.com/user-attachments/assets/8c475e51-3498-49ad-832b-ac409aa78102#.png)

그리고 드디어 마참내 **jaylee.clifton**의 계정을 얻고 유저 플래그를 획득할 수 있었다.

## 4. 권한 상승 (Privilege Escalation) 

![jayleebloodhound](https://github.com/user-attachments/assets/757a1f49-fd65-4f1b-a997-6b699b0306ba#.png)

아니 그래서 jaylee 계정을 얻으면 내가 뭘 할 수 있죠? 하는 생각에 bloodhound를 탐방해봤다만

![bloodhoundall](https://github.com/user-attachments/assets/d35d8640-0a11-4816-880f-b49c382e2a75#.png)

일단 지금까지 얻은 것들을 보아도 결국 지금 얻은 고가치 표적은 `Jaylee_clifton`이라 여기서 뭔가 더 찾을 부분은 보이지 않았다.

그렇기에 AD계정을 얻었을 때 하던 ADCS(인증서 서비스)를 스캔해보며 혹시라도 취약한 템플릿이 있지 않을까 진행해보았다.

### 4-1. Certify

![certify](https://github.com/user-attachments/assets/84e2673d-2288-41c9-ab2e-2ed62e74fb8e#.png)

그 첫번째론 jaylee 계정이 있고 쉘이 있으니 wget 명령어로 certify 템플릿 스캐너를 옮겨와 취약점을 스캔했다.

![certifyresult](https://github.com/user-attachments/assets/4ff824ba-ece6-4139-a637-4449d01e70fc#.png)

만... 취약점이 없어용? 그러면 안 되는데...

다시 미궁에 빠져버렸다.

그래서 또 뭘 할 수 있나 여기저기 찔러보고 둘러보다 마지막으로 winpeas를 돌려보기 전 msa_health 비밀번호 계정도 있겠다 **certify**랑 비슷한 **certipy-ad**를 써보기로 했다.

### 4-2. Certipy-ad

![certipy-ad](https://github.com/user-attachments/assets/97c81a6c-c127-47f3-ad03-93ddc137b1a6#.png)

이 친구도 똑같이 자동으로 스캔을 해주기도 하지만 스캔 정보를 저장해주기도 하기에 스캔을 돌려보고 이 결과를 통째로 인공지능에게 넣어 분석을 돌렸다.

물론 직접 볼 수도 있진 한데 평소처럼 `vuln 어쩌고` 하면서 취약한 내용이 있다! 라고 나오지도 않았고 도구는 있으면 써야하니 말이다.

![updateSrv](https://github.com/user-attachments/assets/3ba1eb5c-bd1a-4d03-864d-b732fbb0d3d0#.png)

그리고! 우리의 사랑스러운 깡통이가 찾아준 취약 템플릿은 바로 **UpdateSrv**라는 녀석이였다.

그런데 말입니다. 분명 Certify는 취약점이 없다고 했었죠? 심지어 제가 결과를 읽어보니 딱히 취약하다 하는 내용은 없었습니다. 그래서 이번엔 제미니 선생한테 물어봤죠.

![gemini Updatesrv](https://github.com/user-attachments/assets/d5fb0172-abaf-470d-9b53-daa04dbe5105#.png)

아 그니까 이 템플릿이 본래 ESC1로 쓰이는 용도의 것과는 살짝쿵 다르게 되어있어서? 게다가 지금 스캔을 뜬 계정이 jaylee가 아닌 msa_health이고 이 템플릿은 IT 그룹에서 쓸 수 있기에?

![템플릿](https://github.com/user-attachments/assets/7a54cf79-f122-4b3a-9521-dac20b887b92#.png)

씁... 진짜 다시 봐도 난 아마 못찾지 않았을까..

![스캔 결과 vuln](https://github.com/user-attachments/assets/2c8b3703-bf52-4334-88a7-c284769253cc#.png)

심지어 스캔 결과 맨 아래로 내려가보면 ESC1은 고사하고 ESC2나 ESC3에 대한 내용이 있어 난 사실 첨엔 이걸 시도해봐야 하는건가? 싶었었다.

### 4-3. so what?

자 좋아 그러니까 우린 UpdateSrv가 취약한 템플릿이라는걸 알았고 그에 대한 IT 그룹 권한을 jaylee가 갖고 있다는 것도 알았는데 그래서 다음으론 뭘 봐야한다는거지?

그런데 처음 서비스 열거를 할 때에 내가 꼭 기억해두자고 했던 것이 있다.

바로 **[WSUS](https://learn.microsoft.com/ko-kr/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus)** 라는 것이다.

[[WSUS] Windows Server Update Service 구성 / TaylorAn](https://twm365.tistory.com/28)

[WSUS(Windows Server Update Services)를 사용하여 Windows 클라이언트 업데이트 배포](https://learn.microsoft.com/ko-kr/windows/deployment/update/waas-manage-updates-wsus)

위 글들을 읽고 찾아보며 살짝 공부해본 바에 따르면

우리가 집에서 쓰는 개인 PC는 **마이크로소프트의 공식 업데이트 서버(인터넷)** 에서 직접 파일을 받아옵니다. 하지만 수백, 수천 대의 PC와 서버를 관리하는 기업 환경에서는? 

만약 모든 PC가 각자 인터넷으로 마이크로소프트에 접속해서 업데이트를 받으면 회사 인터넷망이이 꽤나 많은 부하가 오게될 겁니다(아마도). 

그래서 회사 내부에 **'가짜 마이크로소프트(업데이트 캐시 서버)'** 를 하나 세워두고, 모든 직원의 PC는 외부 인터넷이 아니라 이 내부 서버에서 업데이트를 받아가도록 설정합니다. 이 내부 서버가 바로 WSUS의 존재 의의라고 볼 수 있겠다.

결국엔 기업 입장에서

**트래픽 절감 (효율성)**, **업데이트 통제 (안정성)**, **보안 격리 (폐쇄망)** 까지 한번에 잡을 수 있는 기능인 거다.

### 4-4. 그래서 우리가 할 공격은? (Feat. 열거)

그래서 우리는 **윈도우 서버(DC)를 속여서 우리 해커의 PC를 '진짜 업데이트 할 서버'** 로 착각하게 만들 수만 있다면 DC는 우리 컴퓨터의 악성코드를 가져가 업데이트처럼 실행시켜버리게 할 수 있을 것이다.

위 일련의 과정을 **WSUS Spoofing(스푸핑)** 이라고 부른다.

그럼 일단은 WSUS가 기본 링크가 어디로 되어있는지 알아봐야겠지?

![WindowUpdate](https://github.com/user-attachments/assets/ef18219e-4af5-440a-804a-10e7553d50e5#.png)

위처럼 Jaylee의 계정을 통해 `Get-ItemProperty -Path "HKLM:\Software\Policies\Microsoft\Windows\WindowsUpdate"` 명령어를 쳐보면 윈도우 업데이트에 쓸 WSUS 서버의 주소를 확인할 수 있다.

그럼 그냥 서버 열고 연결하면 끝일까?

그렇게 쉽게 되었다면 medium 문제가 아니였으리..

큰 문제가 있다면 우리가 평소 만들던 **http** 서버가 아닌 **https** 로 서버를 만들어야 한다는 것이다. 그렇기 때문에 간단히 python으로 서버를 여는게 아닌 DC가 내 컴퓨터에 접속했을 때 이건 인증된 서버다 하는 **인증서**가 필요한 상황이다.

### 4-5. WSUS Spoofing 준비하기 (인증서, 리버스 쉘)

그럼 공격을 하기 전 준비단계에서 인증서가 필요할 탠데 이걸 어디서 찾고 만들 수 있을까? 하면 바로 우리가 이전에 찾았던 **UpdateSrv** 템플릿을 이용해 가짜 신분증을 진짜 신분증 처럼 속여 발급 받을 수 있게 된다!

일단은 인증서 부터 준비해보자.

![openssl](https://github.com/user-attachments/assets/206b9d30-5f1b-4367-bc20-4f4653b6a518#.png)

우리가 사용할 취약점은 인증서를 신청할 때 `내 맘대로 이름을 적어낼 수 있는 취약점(Enrollee Supplies Subject)`이 있는 `UpdateSrv 템플릿`을 이용할거고 일단은 `openssl` 명령어를 이용해서 **내가 만든 비밀번호(개인 키)** 와 **내 이름은 wsus.logging.htb**야 라고 하는 **가짜 신청서(wsus.cer)** 을 만들어냈다.

> 발표자료 만들고 있는데 이거 나 왜 인증서 만드는거 뒷 부분 안 썼니 ㅋㅋㅋㅋㅋ

![cer서명](https://github.com/user-attachments/assets/4c28cd42-3ffe-420b-946e-748182c11d69#.png)

이후 jaylee 계정으로 돌아가 만들어 놓은 아직은 인증이 안된 **wsus.csr**을 다운받은 후 서명 과정을 거쳐 **wsus.cer**을 만들어주자.

이 때 **Issued**가 뜨면 된 것이다.

![cer](https://github.com/user-attachments/assets/a7a82ed4-f2e7-412c-b47d-8518eb0d131b#.png)

읽어보면 위처럼 긴 문자열이 나올텐데 이거 복사해서 kali로 옮기면 된다.

![vimcer](https://github.com/user-attachments/assets/2e93ef76-a15b-462d-95ae-363b7b6d2bda#.png)

이렇게 **.cer**, **.csr**, **.key** 를 만들면 성공!

![msfvenompayload](https://github.com/user-attachments/assets/d138d6b1-e274-48d2-a689-d8ef6f1a7ad9#.png)

그리고 업데이트가 진행되면서 내 컴에 들어와 리버스 쉘을 따가게 될테니 **msfvenom**을 이용해 만들어줬다. 사실 이것도 맞는건지 모르겠는데 일단 내가 처음 안될 때(진짜 원인을 몰라서)는 암호화를 안하고 했었다. 근데 일단 성공했을 때는 암호화를 했었기에 위처럼 기록한다.

### 4-6. WSUS Spoofing (몇가지 문제점)

준비물은 다 있으니 이제 툴을 이용해 스푸핑을 진행할 차례였다. 근데 난 이걸 할 때 처음엔 **pywsus**와 명령어 실행을 위한 **netexec**을 설치해 진행을 했었는데... 진짜 하루동안 해도 실패했었다..

그래도 이즘 와서 정리해보니 어째 툴이 잘못됬던게 아닌 듯 하다.

![PsExec64](https://github.com/user-attachments/assets/c4044d97-98ec-4b93-8905-51680313769b#.png)

일단 내가 시도하면서 [EliteLoser/Invoke-PsExec](https://github.com/EliteLoser/Invoke-PsExec)이거였나? 싶은 github에서 설치해 사용했었는데 첫날 안되다가 진짜 뭐가 문제지 싶어 혹시 하는 마음에 [windows 공식 PsExec v2.43](https://learn.microsoft.com/en-us/sysinternals/downloads/psexec)를 설치해 용량을 비교하니 좀 많이 차이가 났다... 씁..

이게 첫번째 문제였고 사실 이걸 해도 안 되었기에 그럼 pywsus의 문제인가? 했는데

![pywsus](https://github.com/user-attachments/assets/f9d69591-1aab-45a7-a7b1-41d55e92ceb2#.png)

사실 뭔가 요청이 가고 하는건 보이기에 그럼 또 인증서 문제? 했지만 아니였고 그냥 다른 툴을 쓰자 싶어서 **pywsus**에서 **wsuks**라는 툴을 써보기로 했다.

뭐 결론부터 말하자면 도구 문제가 맞았지만 wsuks도 안될 운명이였다는거.

![wsuksucks](https://github.com/user-attachments/assets/10454f92-6e72-4630-9fe7-cd3a54814a75#.png)

WSUKS도 동일하게 요청이 오가는건 보이고 PsExec을 가져가기도 했는데 가져만 가고 업데이트를 실행도 했는데 리버스 쉘이 오지 않았다.

그래서 진짜 이것저것 할 수 있는걸 다 해보다 마지막으로 그럼 도구가 문제인가? 싶어 아예 뜯어보기로 했다. 

![sysc-updates](https://github.com/user-attachments/assets/c323f298-a198-43e9-86d4-d533529e9bae#.png)

그리고 발견한 사실... wsuks에 업데이트 관련 파일인 `sync-updates.xml` 파일이 있는데 이 녀석이 내 윈도우 서버 업데이트 관련 정보가 없었기에 안됬다는 이야기가...

![what](https://github.com/user-attachments/assets/3d070256-94eb-4311-a8de-0bf0cddc65f2#.png)

그래서 파일은 잘 넘어가도 그냥 서버쪽에서 **"음 우리 서버에 맞는 업데이트가 없구나!"** 하고 넘겨버렸다는 거였다...

근데 진짜 이렇게 쓰면서도 이게 원인이 맞나? 싶기도 해서 아마 이번 redlabs 발표 때 이야기를 나눠볼 듯 하다.

하도 시도를 많이 하다보니 바꾼게 너무 많아서 말이지...

![pysus](https://github.com/user-attachments/assets/8326ed5a-9d1f-4341-b731-a217844af4a3#.png)

게다가 **pysus**나 **Wsuks** 모두 살펴보니 동일하게 이 파일이 있었기에

![wsuks](https://github.com/user-attachments/assets/9c05979e-817c-47a5-a298-d38924481c3e#.png)

아마 **sync-updates.xml**고 **Psexec** 둘다 문제였을 것이라 생각한다.

### 4-7. WSUS Spoofing 성공!

![runwsuks](https://github.com/user-attachments/assets/c3befd2f-c43b-4ec8-b915-9af1e27894e7#.png)

그렇기에 claude를 통해 만든 wsuks 변형 코드를 실행했고 사실 로그 자체는 지난번과 동일하게 떴지만 이번엔 혹시 외부에서 리버스 쉘이 넘어오는게 문제인가? 싶어 그냥 아예 내가 지금 winrm으로 접근 가능한 **msa_health** 계정을 admin에 넣어버릴 수 있게 코드를 짰다.

~~코드는 지금 노트북에서 볼 수가 없어 집에 돌아가면 넣겠다.~~

![claude](https://github.com/user-attachments/assets/31e0e74f-f76d-4e9a-a457-6e83001fddc1#.png)

claude 선생께서 wsuks나 pysus를 보고 만들어준 공격 코드

![msa_health](https://github.com/user-attachments/assets/77fe4453-80ee-473a-a56a-58c707c77421#.png)

그리고 wsus를 통한 업데이트를 돌려줬고 위처럼 admin 그룹에 msa_health를 넣을 수 있었다.

![파일 없음](https://github.com/user-attachments/assets/0f4df1fc-ae91-44c1-9dfb-adb638c19687#.png)

그리고 바로 플래그를 찾으러 갔는데 Administrator에 없더라...

![bloodhound](https://github.com/user-attachments/assets/da959c83-a83b-4fcf-89ea-51d4ed9598f3#.png)

많이 당황그럽긴 했지만 그래도 이전에 bloodhound를 둘러보다 tier 0 계정 중 **Toby_Brynleigh** 이라는 계정을 발경했었기에 한번 들어가보니

![rootflag](https://github.com/user-attachments/assets/9facaf59-307a-4c60-bc00-0014ec2a1bb3#.png)

여기서 드디어 루트 플래그를 발견할 수 있었다!!! 아오 진짜...

근데 또 한편으론 루트 플래그가 다른 계정에 있으니 내가 계정 얻는걸 잘못 진행했나? 싶기도 하고 뭐 그래도 얻었으니 된거 아닌가? 싶기도 하고 ㅋㅋㅋ

## 마치며

![점수주기](https://github.com/user-attachments/assets/6cd7a8d9-1ee7-441b-94a8-e8981667a017#.png)

뭐.. 개인적으론 루트 플래그 얻는 과정이 많이.. 너무 많은걸 시도해보고 했다보니 이리 채크했다만 지금 다시 생각해보면 준비를 잘 하고 개념만 알았다면 딱 medium 난이도의 문제였을 것이라 생각한다.

![logging pwned](https://github.com/user-attachments/assets/f51d487f-8326-44ff-b52e-d5c6d67a7a3e#.png)

이번 문제로 **wsus**라는게 있다는 것과 역시 **enumeration은 중요**하다는거, 그리고 가능하면 **공식 도구**를 쓰자는 것, 그리고 **툴을 너무 맹신하는 것은 좋지 못하다**라는 것을 느꼈다...

다음 문제를 풀 때는 진짜로 이번엔 가능하면 잠시 리눅스 문제를 풀어보고 싶다. 

그럼 이제 발표 자료를 만들러

Happy Hacking!!