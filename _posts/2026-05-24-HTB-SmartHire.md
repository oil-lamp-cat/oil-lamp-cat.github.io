---
title: "[HTB] SmartHire (Medium_Linux)"
date: 2026-05-24 20:36:00 +09:00
categories: [Security & Hacking, HTB]
tags: [Hack The Box, hacking, RedLabs, Linux]
password: "20260524"
pin: true
---

![Smarthire1](https://github.com/user-attachments/assets/044001af-c83e-4a94-9387-eef65fe99dea#.png)

[You have solved SmartHire! Congratulations OilLampCat best of luck in capturing flags ahead!](https://labs.hackthebox.com/achievement/machine/988787/897)

## 1. 시작에 앞서

![Smarthire](https://github.com/user-attachments/assets/12ebfa0f-b05f-4923-a252-42a95a1b4c9b#.png)

이번 문제는 점수가 좀 낮긴 한데 이런건 뭐에 대한 문제일까 싶어 한번 풀어봤다.

결론적으로 말하자면 아무래도 초기 침투 부분에선 이게 왜? 싶은 부분이 존재했고 이후 권한 상승 부분에선 medium 이라기엔 너무 쉽다 싶은 부분들이 있어 점수가 많이 낮았던거다.

Difficulty rating 만 봐도 난이도가 들쭉 날쭉이다.

## 2. 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

### 2-1. nmap 스캔

![nmap](https://github.com/user-attachments/assets/f1a02b3f-6b95-4bb2-afac-f993cf1f8801#.png)

오랜만에 노트북에서 포트 스캔을 진행해보았고 `22/ssh`, `80/http`가 열려있었다.

![etchosts](https://github.com/user-attachments/assets/44c8f7c0-a034-4e6f-bc26-2c12fafa697e#.png)

버전으로는 침투할 구멍이 보이지는 않았고 http 요청이 `http://smarthire.htb`로 리다이렉션 된다기에 `/etc/hosts`에 도메인과 ip를 매칭시켜줬다.

### 2-2. 사이트 살펴보기

![site](https://github.com/user-attachments/assets/e3166c91-ccd0-453e-944e-76ccde925b34#.png)

사이트에 들어가보니 뭔가 ai 관련 작업 그것도 고용 관련? 뭔가를 할 수 있는 건가 싶었다.

![login](https://github.com/user-attachments/assets/880d3c35-dc44-4331-b7e9-57be256d15f4#.png)

다른 곳은 딱히 특별한 것이 보이지는 않았고 이번엔 로그인 하는 부분 뿐 아니라

![register](https://github.com/user-attachments/assets/3083feec-1403-41d2-a817-d3f0a2f788c4#.png)

회원가입을 할 수 있는 부분까지 찾을 수 있었다.

![dirsearch](https://github.com/user-attachments/assets/6081cb95-5edc-4e40-9119-67cace67ff9f#.png)

혹여 따로 못찾은게 있을까 싶어 **dirsearch**를 돌려봤지만 딱히 특이한걸 찾지 못했다.

![wappalyzer](https://github.com/user-attachments/assets/b01e726b-85bc-4262-95fd-e204f4ffbefe#.png)

**Wappalyzer**에서도 특이한건 보이지 않았다.

![create](https://github.com/user-attachments/assets/38b9179d-4e26-4d8f-8d05-ff9205cb1a8b#.png)

더 찾아볼게 있을까 싶어 일단 회원가입을 진행했다.

~~이후 이거 또 쓸텐데 그 땐 다음날 진행해서 계정 정보가 바뀌었다.~~

![tringmodel](https://github.com/user-attachments/assets/04c5692c-8bb8-4abf-9711-43365da007bd#.png)

로그인 후 보이는 train model 이라던가 (csv 파일 올리면 자동으로? 학습시키는 건가?)

![makepredictions](https://github.com/user-attachments/assets/50cb294d-2085-4c4a-b07c-33c49c1c7435#.png)

예측을 통한 점수 매기기? 같은 것도 보이는데 여기서 딱 봐도 아! csv에 뭔가 업로드 해서 초기 침투를 하는거겠구나!! 하는 생각에 진짜 별걸 다 해봤다.

![burp](https://github.com/user-attachments/assets/d32aca74-4215-449c-8a46-c07a894ca51c#.png)

**burpsuite**로 씹고 뜯고 맛보고... 근데 아쉽게도 어떻게 해도 csv를 통한 침투는 안되더라. 적어도 내가 아는 선에선.

### 2-3. FFUF Subdomain 탐색

![ffuf](https://github.com/user-attachments/assets/c5b3d356-7c97-49be-bf98-e1ae2e2d49db#.png)

그래서 혹시 내가 빼먹었던 subdomain에 찾지 못했던게 있는건 아닐까? 하는 생각에 스캔을 진행했다.

그러자 **models** 라는 서브 도메인이 존재하네?

다만 문제가 있다면 401이 돌아왔다는 거려나.

일단 이것도 `/etc/hosts`에 추가해줘야 접근 가능하다.

## 3. 초기 침투 (Initial Foothold / Exploitation)

이 초기침투 부분에선 좀 알쏭달쏭한 부분이 존재하긴 한다.

### 3-1. Default Credentials (기본 자격 증명)

![로그인](https://github.com/user-attachments/assets/d9b7cef0-129c-448a-8c0c-aee25ddd7f76#.png)

접속해보니 왜 401이 떴는지 알겠더라. 로그인을 해야 접속할 수 있다보니 ffuf에서도 존재는 한다고 연락이 왔던 것.

다만 내가 위에서 말했듯 이 부분이 좀 문제였는데 다른 어디에서도 이것에 대한 정보는 찾을 수 없었고 그저 보통 쓰이는(?) 계정 정보인 `admin`, `password`, `administrator` 등을 조합해서 막 넣어보다

![왜됨](https://github.com/user-attachments/assets/c5fa740d-68b6-4269-8b2b-2d57ae1646b7#.png)

이렇게 `admin/password`의 계정 정보로 로그인에 성공할 수 있었다.

이게 뭐로 만들어진 사이트인지 라던가 어떤 걸로 구성되었는지라도 알 수 있다면 기본 비밀번호에 대해 검색을 하던 했을텐데 wappalyzer로도 당연히 알 수 없었기에 그저 찍어 맞추는 부분이였다. 아마 이것때문에 점수가 낮지 않았을까 하는 생각.

### 3-2. mlflow 취약점 검색 (CVE-2024-37054)

![vuln](https://github.com/user-attachments/assets/d8e65704-0334-49ef-a2ff-35670cd18df5#.png)

이제 `mlflow`로 만들어졌고 버전이 `2.14.1`이라는 것도 알아냈으니 바로 구글에 검색해보면 시작하자마자 **RCE** 취약점이 있었다며 알려준다.

![poc](https://github.com/user-attachments/assets/d85ba05d-1cb1-4107-bc2b-2f9341730bad#.png)

그리고 당연하게도 poc 코드가 github에 존재하고 말이다.

정말 간단하게 설명하자면 이 취약점은 

**'MLflow 서버에 악성 파이썬 객체(Pickle)를 업로드하여, 서버가 이를 읽는 순간 공격자의 명령어가 실행되도록 만드는 원격 코드 실행(RCE) 취약점'**

이라고 설명할 수 있겠다. 근데 조금만 더 깊게 들어가게 되면...

> 머신러닝 플랫폼인 **MLflow**에서 발생한 취약점으로 안전하지 않은 역직렬화 문제

라고 볼 수 있는데 여기서 역 직렬화가 뭔고 하니,

- **직렬화(Serialization):** 파이썬에서 열심히 학습시킨 인공지능 모델(객체)을 파일 형태로 저장하거나 네트워크로 전송하기 위해, 0과 1로 이루어진 이진 데이터(Byte Stream)로 변환하는 과정으로 파이썬에서는 주로 pickle이라는 라이브러리를 사용한다.

- **역직렬화(Deserialization):** 반대로 저장된 파일(Pickle)을 읽어서 다시 원래의 파이썬 객체로 복원하는 과정.

에서 벌어지는 문제로 **pickle** 라이브러리는 받는 파일을 모두 안전하다 판단해 실행하게 되는데 만약 공격자가 일반 AI 모델이 아니라 악성코드가 들어간 Pickle 파일을 업로드 한다면?

`pickle.load()` 등의 함수로 **역직렬화(파일 읽는 행위)** 를 하는 순간 악성 코드가 서버의 권한으로 자동 실행되어버리는 사태가 발생하는거다.

### 3-3. CVE-2024-37054 poc 진행하기

[ben-slates/CVE-2024-37054](https://github.com/ben-slates/CVE-2024-37054)

![CVE](https://github.com/user-attachments/assets/f0ab9161-fb63-4a04-b867-b545959ce466#.png)

난 위와 같은 poc를 github에서 찾아 사용하였다.

사실 딸깍 하면 되는 코드이긴 한데 그래도 좀 더 자세히 알고 넘어가보자.

> 5단계로 요약하면

- **악성 페이로드 생성:** 공격자가 역직렬화될 때 역쉘(Reverse Shell)을 실행하도록 설계된 악성 파이썬 피클 데이터를 생성.

- **웹 애플리케이션 침투:** 취약한 메인 웹사이트(Smarthire)의 데이터 업로드 기능을 통해 이 악성 데이터를 학습 데이터나 모델 형태로 제출.

- **MLflow 연동 트리거:** 메인 웹사이트 백엔드가 이 데이터를 받아 연결된 MLflow 트래킹 서버(models.smarthire.htb)에 등록 요청을 보내고.

- **악성 파일 로드 (역직렬화):** MLflow 서버가 새로 등록된 모델의 정보를 읽고 예측(predict) 엔드포인트를 처리하는 과정에서 악성 피클 파일을 역직렬화까지 하면.

- **RCE 성공:** 서버 백엔드에서 공격자의 명령어가 실행되면서, 공격자의 PC로 서버 권한의 쉘이 연결(Reverse Shell)된다.

근데 여기서 hithere 이라는 모델을 가져온 것으로 보이는데... 이게 내가 아마 로그인 할 때 계정 정보를 **hithere**로 통합해버려서 그런걸거다.

위 과정의 취약점을 막으려면 `pickle` 대신 `Safetensors`나 `ONNX` 같은 포맷을 쓰게 하면 되겠지?

![초기침투 끝](https://github.com/user-attachments/assets/81e92120-ece5-47c1-bad2-419a37117e43#.png)

일단 이렇게 초기 침투는 성공했다.

![먼가 막 올라오는데](https://github.com/user-attachments/assets/4645c1ec-8cbd-469b-8ea3-2fa52e3efd27#.png)

먼가 전보다 막 띠로링 하면서 올라오는게 많으니 더 재밌달까?

## 4. 권한 상승 (Privilege Escalation) 

### 4-1. 여기저기 둘러보기

![ls](https://github.com/user-attachments/assets/10276bcb-c5e4-45ec-ad85-b8c55bc7eadd#.png)

사실 처음 여기 들어온 위치에서 플래그 찾기 전에 이것 저것 둘러봤는데 딱 봐도 뭔가 `.db`가 눈에 띄어 들어가봤다.

![굳이](https://github.com/user-attachments/assets/75b66be3-c910-493d-afbe-7597409647e5#.png)

다만 이건 결국 `smarthire.htb`에 로그인할 때 쓰이곤 하던 정보이기에 굳이? 필요는 없었다.

### 4-2. sudo -l

![sudol](https://github.com/user-attachments/assets/5d9b4131-4c7b-43e5-a2a4-a455bb35f4f3#.png)

내가 진행하면서 찾았던걸 이번엔 다 캡쳐하지 않았던데... 사실 저번에 group 때문에 진행이 막혔던게 떠올라 내 그룹 권한으로 볼 수 있는 것들부터 찾아봤었다.

그리고 딱 하나가 떴었는데 그게 `/opt/tools/mlflow_ctl/plugins/dev` 폴더였다.

게다가 `sudo -l` 으로 스캔을 돌려보니 똑같은 `/opt/tools/mlflow_ctl/` 폴더에 `mlflowctl.py`라는 코드가 있었다.

**와일드카드(*)** 가 걸려있으니 어떤 인자를 붙이던 모두 root 권한으로 실행 가능하다는 것이렸다. 딱 봐도 뭔가 **Plugin Injection** 냄새가 스멀스멀

### 4-3. mlsflowctl.py

![mlflowctlpy](https://github.com/user-attachments/assets/d29724a4-43dc-48ea-992c-f901818fa25b#.png)

소스코드가 좀 많이 긴데 간단히 이해를 해보자면

> MLflow 서비스의 운영 및 관리를 자동화하기 위해 내부 관리자가 만든 도구?

- **기능** : 상태 점검(Status), 모델 백업(backup-models), 서비스 재시작(restart)

- **플러그인 구조** : 메인 코드는 그대로 존재하고 `plugins` 폴더 아래에 디렉토리만 추가하여 확장 기능을 자동으로 인식해 불러올 수 있도록 **플러그인 확장 모델**로 설계함.

인데! 여기서 취약점이 발생해버렸다.

### 4-4. mlsflowctl.py 취약점

그런데 말입니다.

```py
BASE_DIR = Path(__file__).resolve().parent
PLUGINS_DIR = BASE_DIR / "plugins"

# make plugins importable
for path in PLUGINS_DIR.iterdir():
    if path.is_dir():
        site.addsitedir(str(path))
```

이 부분을 보면 `plugins` 폴더 내부의 하위 디렉토리를 모두 가져오죠? 그리고 우린 `plugins/dev` 폴더에 권한이 있고? 그럼 여기에 우리가 실행할 악성코드를 넣으면 되겠다! 만...

![py](https://github.com/user-attachments/assets/5c165f2a-97c5-4169-9d69-3af55f4e0795#.png)

사실 난 여기서 바로 `.py`를 만들어 하이재킹을 시도했었다.

아니 근데 어떻게 해도 안되기에 좀 더 찾아보니 파이썬은 `site.addsitedir()` 함수에서 

``` py
# 파이썬이 모듈을 찾는 순서 (sys.path)
[
    "/opt/tools/mlflow_ctl/",            # 1순위: 스크립트가 실행된 현재 폴더 (여기에 '진짜' 원본 모듈이 있음!)
    "/usr/lib/python3.10/",              # 2순위: 시스템 기본 라이브러리 폴더들
    ...
    "/opt/tools/mlflow_ctl/plugins/dev"  # 꼴등: addsitedir()로 방금 추가된 우리의 가짜 폴더
]
```

이런 식으로 내가 만든 모듈이 들어가기에 `.py`를 아무리 넣어도 굳이? 라며 실행을 안했었다.

그러니 이런 식이었던거다.

1. `site.addsitedir()` 실행 (우리 폴더가 맨 꼴지로)
2. `import mlflow_actions` 실행
3. 파이썬은 1순위 폴더에 이미 `mlflow_actions.py`가 존재한다고 확인했으니 우리껀 무시

이렇게 되어버리니...

방법은 `.pth`를 써버리면 되는 것이다!

`.pth`는 원래 파이썬이 추가적인 경로를 텍스트로 읽어오기 위해 만든 설정 파일인데 만약 이 파일 안에 `import`라는 단어로 시작한다면? 모듈 검색 순서고 뭐고 다 무시하고 바로 이 코드를 먼저 실행시켜버린다.

---
> 참고 자료들

![addsitedir](https://github.com/user-attachments/assets/81303a4a-1c58-4920-a5a4-1289c7621344#.png)

구글에 단순히 .pth를 검색하면 십중팔구 PyTorch(파이토치)의 AI 모델 가중치 저장 파일에 대한 내용만 나온다만 이번 포스팅에서 다룬 취약점은 '파이썬 내장 경로 설정 파일(Path Configuration File)'을 악용한 것이므로 혼동하지 않도록 내가 읽어본 자료들을 첨부한다.

- [한글] 파이썬 모듈 검색 경로 완벽 이해 (가장 추천하는 글)
  - [[Python] Module Search Path and sys.path / Dsaint31의 tistory](https://dsaint31.tistory.com/528)

- [공식 문서] site 모듈에 대해
  - [Python 3 Documentation: site — Site-specific configuration hook](https://docs.python.org/3/library/site.html) 

- [실제 사례]
  - [Elastic Security (MITRE ATT&CK 기반 보안 위협 분석)](https://www.elastic.co/guide/en/security/current/prebuilt-rule-8-19-12-python-path-file-pth-creation.html)

- 가장 처음 찾아봤던 길을 알려준 글
  - [Persistence through Python .pth Files / Medium, dfirloading](https://medium.com/@dfirloading/persistence-through-python-pth-files-695a9a34bba2) 

개인적으론 위 글을 다 읽어보는걸 추천한다. 아무래도 문제 풀이 자체는 정말로 짧으니 말이지.

---

> 다시 침투로 돌아와

![pth](https://github.com/user-attachments/assets/47558e77-9f71-40b1-bb5f-341280b7b578#.png)

고로 이렇게 `.pth`를 만들어주고 실행시키면? 바로 루트 권한을 얻을 수 있다! 여기서 깨알같은 저번에 썼던 `-p` 옵션도 추가해서 말이다.

![root](https://github.com/user-attachments/assets/3ff3db41-e7a7-44bb-9c18-0abe0451a112#.png)

루트 플래그도 획득!

## 마치며

![smarthirehbp](https://github.com/user-attachments/assets/e5f7ae86-600f-4a60-9d68-300339e318f3#.png)

아쉽게도 다다음주 발표떄에는 여행을 가야하기에 redlabs 참여를 못하는데 이 문제는 그 다음이라도 한번 발표해볼만 한 문제라고 생각한다.

이게 평점 자체는, 그니까 풀이를 위한 문제로써 본다면 나 또한 별로라고 생각하는데 좀 더 깊게 파고들어 왜 어디서 뭐가 취약한건지 하나씩 긁어먹다보면 이만큼 미식이 없다.

처음 초기 침투 때 비밀번호 때려맞추기만 뺴고.

여전히 문제를 풀면서 자꾸만 새로운 모르는게 생겨나는데 그래도 언젠간 시험에 도전해 봐야겠지

다들 Happy Hacking이다!