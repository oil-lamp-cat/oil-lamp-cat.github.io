---
title: "[HTB] Interpreter (Medium_Linux)"
date: 2026-05-10 12:28:00 +09:00
categories: [Security & Hacking, HTB]
tags: [Hack The Box, hacking, RedLabs, Linux]
password: "20260510"
pin: true
---

![Interpretersolved](https://github.com/user-attachments/assets/ad4fc5c4-ce0e-4c6b-b038-2968cd4d9ea8#.png)

[You have solved Interpreter! Congratulations OilLampCat best of luck in capturing flags ahead!](https://labs.hackthebox.com/achievement/machine/988787/841)

## 1. 시작에 앞서

![Interpreter](https://github.com/user-attachments/assets/d5632b2a-aa0d-4b8f-b57f-ec0cf47b8fe1#.png)

HTB 시즌도 끝났고 배가 아프던 것도 어느정도 좋아지기 시작하니 다시 어떤 문제를 풀까 둘러보던 중 machine 점수는 좀 낮지만 Medium 난이도의 Linux 문제를 발견해 풀어보기로 했다.

근데 개인적으로 이번 문제는 있는 툴을 찾아서 쓰니까 생각보단 쉽게 진행되어 특히 초기 침투 부분은 Medium? 이 아닌데.. 하는 생각이 들긴 했다.

물론 권한 상승부는 medium 인정!

## 2. 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

리눅스 문제라 기본 제공되는 계정은 없다!

### 2-1. nmap (포트 정보를 통한 서비스 열거)

![nmap](https://github.com/user-attachments/assets/9fbbc978-dfe6-429b-8ae5-0dab82857a9c#.png)

이 머신이 무슨 서비스를 갖고 있는지, 어떤 서버인지 아는 정보가 없기에 nmap 스캔을 돌려보았을 때 **22/ssh**, **80/http**, **443/ssl,http**가 열려있는 것을 확인했다.

오잉? 443번 포트라니? https아닌고? 사이트 제목은 http와 동일하게 `Mirth Connect Administrator`라고 하니 뭔가 관리자로 접속하려면 https를 통해 접속해야한다 뭐 그런 소리인가보다.

### 2-2. 80/http, 443/https 방문

![site80](https://github.com/user-attachments/assets/46f282d7-ac04-4303-96b6-fb8d51d30bee#.png)

일단 80번 포트로 들어가보니 역시나 `Mirth Connect Administrator` 라고 하는 **건강 서비스?** 에 관련된 패널이 나온다.

그리고 뭔가 버튼을 눌러서 **Administrator Launcher**와 **Administrator lacal workstation**을 다운로드 할 수 있다고 한다.

그리고 역시나 Dashboard로 로그인을 하려면 아까 봤던 443 사이트로 접속하라고 한다.

![site443](https://github.com/user-attachments/assets/ec345adb-f5cf-4f6f-8b98-aed8313d20fc#.png)

443으로 접속해보면 이렇게 로그인을 진행할 수 있다.

![wappalyzer](https://github.com/user-attachments/assets/80b3cb58-64ab-45c3-97e9-d41642bf9e11#.png)

wappalyzer로 보니 딱히 특별한건 보이지 않았고,

![HSTS](https://github.com/user-attachments/assets/67eb5fea-6f7c-4e89-ba66-46fdb0643dd0#.png)

그나마 찾은 HSTS가 무엇인고 하여 찾아보니 보안 정책이라고 한다. 그래서 443이 있었구만.

![다운받은거](https://github.com/user-attachments/assets/80e6e9cd-9751-4bc4-b1c1-5da7ae3a4ca8#.png)

다운로드받은 `administrator launcher` 를 열어보니 `s3 amazonaws`로 넘어간다.

근데 솔직히 난 여기서도 딱히 뭘 찾지는 못했다.

![다운받은거](https://github.com/user-attachments/assets/190c89b2-7989-4010-b0df-62e94f94f6f0#.png)

또한 처음 버튼으로 다운받을 수 있는 webstart.jnlp 를 열어봐도 딱히? 버전이 4.4.0 이라는 건 있는데 이건 그냥 사이트에서도 확인이 가능하니 말이다.

![dirsearch](https://github.com/user-attachments/assets/93a9ebe2-2ae5-4b91-91bc-4cf3d2949523#.png)

혹시 뭔가 놓치는게 있을까 싶어 dirsearch를 돌렸고 역시나는 역시나였다.

![근본 검색](https://github.com/user-attachments/assets/19c47077-6353-421e-a9a2-031fba48e932#.png)

그렇기에 **Mirth Connect 4.4.0**이라는 정보를 얻었기에 바로 취약점 검색을 하니...

CVE-2023-43208이 바로 나오네? 오잉?

![githubpoc](https://github.com/user-attachments/assets/b2b8d932-3ab4-47c3-a329-baf75f60006c#.png)

심지어 완전 자동화를 해주는 CVE도 존재했다. 야호

## 3. 초기 침투 (Initial Foothold / Exploitation)

바로 침투를 진행해주자.

### 3-1. CVE-2023-43208

![침투 준비](https://github.com/user-attachments/assets/3314da21-12a8-4412-a12a-bacbd8562c9a#.png)

cve를 clone해오고 준비를 하자.

![tooluse](https://github.com/user-attachments/assets/956e6153-546b-4475-8567-a7042d38a0d5#.png)

근데 이 친구는 자동으로 리버스쉘을 열어주기에 따로 nc를 열어줄 필요가 없었다. 

게다가 성공을 했는데 딱 위 이미지처럼 성공했다 뜨고 멈춰있길래 뭐지? 싶었는데.

![초기침투중](https://github.com/user-attachments/assets/6f56c23c-4f5c-41d1-bed5-d333e0ccc082#.png)

아 이미 쉘엔 들어왔고 여기서 python은 없지만 python3는 있어서 이걸로 bash 쉘을 열어줬다.

![파일 탐색](https://github.com/user-attachments/assets/f5c7e4da-a171-432f-8501-244e7fc3298c#.png)

이후 여기저기 돌아다니며 user flag가 어디있나 찾아봤는데 적어도 이 `mirth` 라는 계정에게는 없었다.

### 3-2. 파일 탐색 (mirth.properties)

![mirthproperties](https://github.com/user-attachments/assets/17bcc5a4-f3f7-4515-9f98-e88d2712be02#.png)

그래서 또 여기저기 살펴보다 이곳 서비스의 이름이 들어간 `mirth.properties`라는 설정 파일을 발견하게 되었다.

![그런데 말입니다](https://github.com/user-attachments/assets/6adc6052-7c14-47f1-a746-8dfd0c819753#.png)

그런데 말입니다. 이 안에 무려 **database**에 대한 유저와 비밀번호가 있는게 아니겠어요?!

### 3-3. 데이터베이스 탐색

![mysql](https://github.com/user-attachments/assets/9de38ebc-d262-4355-ba53-2c0fff1bfcb3#.png)

그래서 바로 mysql로 데이터베이스에 접속해 둘러보기로 했죠.

![mysql1](https://github.com/user-attachments/assets/4a5678e4-324f-4432-9e9c-894f45315882#.png)

database를 보니 `information_schema`, `mc_bdd_prod` 라는게 보이던데 사실 난 다 둘러보긴 했다만 위처럼 두번째 db에 들어가보면 딱 봐도 **PERSON**, **PERSON_PASSWORD** 아니 이건 진짜 누가봐도 아이디 비번이잖냐.

![dbpass](https://github.com/user-attachments/assets/080e19a5-d111-4d33-854b-7f74ce2ad61d#.png)

열어보니 `sedric` 이라는 계정에 `u/+어쩌고/kLMt3w+w==` 이라고 하는 되게 특이한 비밀번호를 얻게 됬다.

물론 당연하다면 당연하겠다만 이게 평문 비밀번호일리는 없고 이걸 토대로 우린 **hash cracking**을 진행해야했다.

### 3-4. 해시 크래킹 (PBKDF2WithHmacSHA256, iteration 600000)

![changed](https://github.com/user-attachments/assets/e537f880-c931-4736-a318-452c13d3ab16#.png)

사실 난 여기서 도대체 이 해시는 어떤 걸까 하는 생각에 **crackstation** 사이트에서도 돌려보고 그냥 **hashcrack**이나 **johntheripper**를 돌렸었다. 그리고 당연하다면 당연하게도 전혀 성공하지 못했고 그래서 아니 그럼 뭐로 해시가 생성되는건데? 싶어 검색을 해보니...

원래 이전 버전에선 **SHA256**을 썼었지만 이젠 **PBKDF2WithHmacSHA256** 라는 알고리즘으로 바꿨다고 한다. 오....

![hashcat1](https://github.com/user-attachments/assets/162e92d9-dae1-4842-88e3-12d4d5ecdc33#.png)

난 저 해시 알고리즘에 대한 내용은 잘 모르지만 내게는 인공지능 선생이 3이나 있기에(chatgpt 5.5 버전이 좋기에 그것도 추가했다.) 셋을 잘 돌려가며 의견을 모아 위와 같이 hashcrack을 진행했다.

![hashcat2](https://github.com/user-attachments/assets/23cc7b3f-0097-45dd-ba74-e5ec49d4c2da#.png)

그 결과 `snowflake1`이라는 비밀번호를 얻어낼 수 있었다!!

![ssh](https://github.com/user-attachments/assets/4b2fddad-3c39-4b3a-94da-cb3c855b1f03#.png)

게다가 그 정보를 토대로 ssh 접속을 시도해 **sedric** 계정을 얻어내 user flag를 얻는데 성공했다!

## 4. 권한 상승 (Privilege Escalation) 

![권한 상승 enu](https://github.com/user-attachments/assets/84e9464f-6aab-47c4-95e7-81dc22042b8f#.png)

이번에 권한 상승을 하려 **sudo -l**을 써봤지만 없었고 특이한 그룹도, 4000 권한 있는 것도 없었다. 그나마 특이한게 있다면 내부 네트워크 통신을 찍어보았을 때 포트가 **54321**이라는 포트를 쓰는 통신이 있다는 것 정도?

### 4-1. Linpease

![넘겨주기](https://github.com/user-attachments/assets/5649fc2b-a190-4724-9536-6986e3b5e11f#.png)

![linpease](https://github.com/user-attachments/assets/b6b29bff-1b21-4f5e-8df5-06323cca3af3#.png)

진짜 영감 이것만은 꺼내고 싶지 않았는데 내가 이번 문제를 권한상승부분에 medium은 맞다고 한 이유가 이거다.

진짜 별에 별걸 다 검색하고 적어도 내가 아는 것들을 다 검색해보았을 때에는 권한상승 할 수 있는 부분이 전혀 보이지 않았기 때문에... 기어코 다시 Linpease를 꺼내들게 되었다.

![어느정도의 시간이 지나고](https://github.com/user-attachments/assets/8bf04266-c24a-4182-a412-77b8c53b3fde#.png)

그렇게 어느정도의 시간이 지나고 린피스에서 나온 결과를 둘러보던 중 **Readable files belonging to root and readable by me but not world readable** 이라는 부분에서 감지된 **user.txt**와 **notif.py**라는 파일을 발견할 수 있었다.

이 파일인 즉 **루트 소유지만, 나(sedric)는 읽을 수 있고, 남들(world)은 못 읽는 파일** 이라는데 

![사실 해봄](https://github.com/user-attachments/assets/b5503e97-555b-4fe0-a4be-73dac25ae135#.png)

사실 내가 이걸 안해본 것은 아니다. 가장 처음에 해봤지. 근데 결과가 60줄이 넘는데 이걸 하나씩 보고있자니 설마 이건 아니겠지 싶어서 넘어갔었다. ㅎ

![좀더 찾아보니](https://github.com/user-attachments/assets/3adcd631-96b8-47cd-b9ed-0e2b11ea64f2#.png)

좀 더 찾아보니 이렇게 살짝의 정규식을 넣어 범위를 확 줄일 수 있긴 했다.

![혹은](https://github.com/user-attachments/assets/ba1fbba4-0ace-47a7-bf62-091a7f71e9da#.png)

혹은 이렇게.

![이렇게도](https://github.com/user-attachments/assets/dd00e78f-0592-4c50-9627-91395e9ede91#.png)

이렇게도 가능했다.

```sh
# root가 실행 중인 이상한 커스텀 스크립트 찾기
ps auxww | grep -Ei "python|flask|notif|/usr/local|/opt|/srv" | grep -v grep

# 로컬 전용 포트 확인
ss -lntp 2>/dev/null || ss -lnt

# sedric 그룹이 읽을 수 있는 root 소유 파일 찾기
find / -xdev -type f -user root -group sedric -perm -g+r -ls 2>/dev/null

# world-readable이 아닌 root 소유 파일 중 내가 읽을 수 있는 것
find / -xdev -type f -user root ! -perm -o+r -readable -ls 2>/dev/null
```

정리하자면 이런 느낌이려나?

### 4-2. notif.py와 eval()과 fstring

![수상한놈](https://github.com/user-attachments/assets/758e6924-eb41-4aa4-b101-972f8697b85d#.png)

그렇게 수상한 녀석을 찾아냈기에 python 코드를 읽어보니 ~~솔직히 뭔지 몰랐다만~~ 인공지능이 먼갈 감지했다. 아 참고로 이거 포트를 보니 아까 이상하게 생각했던 그 `54321`포트였다.

[python eval() 함수 - 사용을 조심해야 하는 이유 - 출처 ㅍㅍㅋㄷ:티스토리](https://bluese05.tistory.com/64)

위 블로그를 통해 알 수 있듯 이번 코드엔 

```py
template = f"Patient {first} {last} ({gender}), {{datetime.now().year - year_of_birth}} years old, received from {sender} at {ts}"
try:
    return eval(f"f'''{template}'''")
```

이런 부분이 있는데 여기가 원래는 나이를 자동 계산해주는 거였지만 만약에 `first`나 `last` 변수에 `{파이썬 코드}` 형태의 문자열을 넣게 된다면? `eval()`이 그걸 진짜 파이썬 코드로 인식하고 **루트 권한으로 실행**해 버릴거다!

게다가 사실 살짝의 방비는 되어있다.

```py
pattern = re.compile(r"^[a-zA-Z0-9._'\"(){}=+/]+$")
```

이렇게 정규식 검증은 했다만 알파벳, 숫자, 그리고 몇 가지 특수문자만 허용하고 `공백(스페이스바)`나 `하이픈(-)` 같은 문자는 차단해놨다.

근데 이것 때문에 권한 상승 명령어인 `chmod u+s /bin/bash`를 칠 수가 없는가? 아니다!

아스키코드 변환 함수인 `chr(32)`를 쓰고 문자열을 `+` 기호로 이어붙여버리면 될 것이다.

```py
{__import__('os').system('chmod'+chr(32)+'u+s'+chr(32)+'/bin/bash')}
```

이렇게

![wget](https://github.com/user-attachments/assets/8c48674e-85b5-4ae1-8de9-7ad57c07c666#.png)

curl은 없으니 wget 명령어로 페이로드를 보내주면 뭐가 바뀐것인가 싶겠지만 bash가 SUID로 변환되었기에

![root](https://github.com/user-attachments/assets/11a993ac-9512-4325-8eed-dab8e6aac693#.png)

`/bin/bash -p` 명령어를 통해 권한을 빼지 않고 바로 루트 쉘로 실행시킬 수 있었다!!!!

![권한 상승 끝](https://github.com/user-attachments/assets/eb368e66-b445-4d5f-9f06-9048972412cf#.png)

권한 상승도 끝!

## 마치며

![Interpreter Pwned](https://github.com/user-attachments/assets/2c4ffe2e-bf2b-4798-839a-e7faa54bafcb#.png)

이렇게 Interpreter 문제를 푸는데 성공했다. 오랜만에 linux를 풀다보니 어색하기도 하고 내가 까먹었을려나 싶었는데 아니 오히려 윈도우 문제 풀 때보다 모르는 내용이 적다보니 오히려 더 편하게 풀었던 것 같다.

아 근데 OSCP 시험 볼 때는 아예 llm을 못 쓴다던데 으음.... 난 아무래도 뭔가 분석 부분이라던가 이런건 아직은 계속 공부하는 입장이다보니 떌 수가 없다. 좀 더 많이 실력 키워서 해야지. 아니 그리고 솔직히 페이로드 만드는건 내가 직접 하는 것보다 인공지능이 하는게 훨씬 빠르고 효율적인게 정상이지 않으려나?

일종의 난 마스터 마인드인거고 내 아래 llm들을 조종하는 그런게 요즘은 더 효율적인듯 한데. 아무래도 자격증 시험이니까 말이지. 근데 google 검색했을 때 나오는 gemini 결과는 어쩐담? 흠...

어째든 이렇게 Linux Medium 문제 끝! 담번엔 진짜로 Linpease 안쓰고 해야지.

Happy Hacking!