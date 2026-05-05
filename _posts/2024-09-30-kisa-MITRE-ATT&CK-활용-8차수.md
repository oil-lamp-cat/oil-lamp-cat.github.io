---
title: "[KISA Academy] [초급] 침해사고 대응훈련 - MITRE ATT&CK 활용"
date: 2024-09-30 17:19:15 +09:00
categories: [Security & Hacking, KISA]
tags: [MITRE ATT&CK, 보안]
pin: true
---

# MITRE ATT&CK 활용 8차수

![image](https://github.com/user-attachments/assets/07c75c87-a813-4981-9da1-ffb89fb13140)

[KISA 아카데미](https://academy.kisa.or.kr/main.kisa)에서 처음으로 신청사게 되어 듣게 된 `MITRE ATT&CK`에 관한 강의이다.

[초급]이기에 이번 8회차에서는 개념에 관해 많이 나왔다.(내가 가장 필요한 것들!)

강의 내용을 요약해서 기록하고 아무리 기초라고 하여도 나에게 생소한 단어들이 많았기에 기록한다.

## 1. [이론] MITRE ATT&CK 프레임워크의 이해(1)

1. `MITRE ATT&CK`은 처음 2013년에 처음 등장했으나 2018년도즘에 들어서 관심이 급속도로 증가하기 시작했다.

그 이유는 다음과 같다.

- 사이버 보안 전략이 차단, 보호 중심에서 탐지 전략으로 바뀌기 시작했다.

### 차단 및 보호 중심의 방어 전략

- 사전 위협을 식별하고 이를 제거했다.
- 제거되지 못한 위협은 방화벽이나 인증 시스템 등을 활용하여 정보 자산에 위협 요소가 접근하는 것을 차단하였다.
- 현재까지도 차단 중심의 보안 기술은 중요하지만 그것만으로는 다양한 위협에 완벽히 대응하기 어려워졌다.

[공격 표면(Attack Surface)?](https://www.igloo.co.kr/service/klu-attack-surface-management/)

[제로 트러스트(zero trust)?](https://www.hpe.com/kr/ko/what-is/zero-trust.html)

### 탐지의 중요성(침투)

전형적인 APT 스타일의 공격자는 아래와 같은 규칙을 통해 침투할 수 있다고 한다.

1. 초기 침투 (initial compromise)
2. 교두보 확보 (establish foothold)
3. 권한 상승 (escalate privilege)
4. 내부정찰 (internal recon)
   - 레터럴 무브먼트(lateral movement)
5. 목적 행위 수행 (action on objectives)

이것도 하나하나 찾아볼까 했는데 매우 자세히 설명되어있는 것을 찾아 첨부한다.

[[KDT_AISEC] 4주차 - 지능형 지속 공격 APT](https://velog.io/@gloomy_passion/KDTAISEC-4%EC%A3%BC%EC%B0%A8-%EC%A7%80%EB%8A%A5%ED%98%95-%EC%A7%80%EC%86%8D-%EA%B3%B5%EA%B2%A9-APT)

[[Gloomy]KDT_AISEC](https://velog.io/@gloomy_passion/series/KDTAISEC) 공부할 블로그 추가!

#### APT?

> Advanced Persistent Threat

다른 글에도 한 번 썻던거 같은데 익숙하지 않으니 다시 찾게된다.

지능적이고(Advanced) 지속적인(Persistent) 공격(Threat)

[APT-1 (APT 공격이란 무엇인가?)](https://brunch.co.kr/@ka3211/23)에 정말로 자세히 설명되어있다. 개념 뿐 아니라 공격 세부 진행상황까지 설명되어있다.

### 공격자가 갖는 약점

- 내부망의 환경을 파악할 시간이 필요하다.
- 레터럴 무브먼트를 통해 최종 목표에 도달하기까지 시간이 소요된다.

고로 방어자는 내부망에 침투하는 것을 차단하는데 실패하더라도 실질적으로 피해가 발생하기 전까지 위협을 제거할 기회가 존재한다. 그렇기에 최근에는 탐지의 중요성도 높아지고 있다.

### DWELL TIME

> 잠복기

최초 침투 후에 발견되기 까지의 소요 시간

### 탐지 전략의 변화

> 고통의 피라미드

공격자의 활동을 탐지하는데 사용할 수 있는 공격 유형의 지표이며 그에 따라 소요되는 노력을 피라미드로 만든 것

![image](https://github.com/user-attachments/assets/b5043852-0f73-4bf0-9c70-ff2426b290f9)

왼쪽 탐지의 기준이 되는 값

오른쪽은 공격적자가 보았을 때 왼쪽 지표들을 우회하기 위해 소요되는 노력의 정도

- 해시값 (Trivial) : 가벼운 수준의 코드 수정만으로도 우회가 가능하다. 예를 들어 스크립트 변경으로 우회 가능.

- IP 어드레스(Easy) : 간단한 노력만으로 IP 주소 변경 가능하다. 예를들어 C2의 아이피 변경하거나 코드의 IP를 변경하는 것으로도 우회 하여 블랙리스트 등의 방법을 우회할 수 있다.
- 도메인 네임(Simple) : 도메인 변경 가능.
- 네트워크/호스트 아티팩트(Annoying) : 코드 수정, 아티팩트 제거 등의 노력이 필요. IOC(Indicator Of Compromise) == 침해지표 기반 탐지 우회 필요.
- 툴(Challenging) : 많은 노력 필요. 하지만 우회가 불가능 하지는 않다.
- TTP(Tough) : 새로운 방식의 공격 방법이 필요함.

과거에는 IOC 기반 탐지를 많이 사용했으나 최근에는 TTP 기반 탐지를 많이 사용한다.

### EDR?

> Endpoint Detection and Response

기본적으로는 TTP 기반 탐지 솔루션이다.

[[공지] 그래서 EDR이 뭐야? (EDR 기초지식 알아보기)](https://m.blog.naver.com/cybereason/222473264298)

### TTP?

> Tactic, Technique, Procedures

- Tactic : 공격 목표
- Technique : 공격 방법
- Procedure : 공격의 세부 실행 방법

[TTP(Tactic, Technique, Procedures)란 무엇인가? 사이버 보안에서의 중요성](https://dev-with-wish.tistory.com/entry/TTPTactic-Technique-Procedures%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80-%EC%82%AC%EC%9D%B4%EB%B2%84-%EB%B3%B4%EC%95%88%EC%97%90%EC%84%9C%EC%9D%98-%EC%A4%91%EC%9A%94%EC%84%B1)

### IOC?

> Indicator of Compromise

[[보안상식] IOC(Indicator Of Compromise)란?](https://m.blog.naver.com/kaoni_gw/221035228430)

[What are indicators of compromise (IOCs)?](https://www.microsoft.com/en-us/security/business/security-101/what-are-indicators-of-compromise-ioc)

## 2. [이론] MITRE ATT&CK 프레임워크의 이해(2)

### IOC (Indicator Of Compromise, 침해지표)

- 시스템이 악의적인 활동에 의해 침해되었을 가능성이 있음을 보여주는 운영체제 또는 네트워크 아티팩트
- IOC로 사용되는 정보 : 해시값, 파일 이름 및 경로, C2 도메인, IP Address, URL, 레지스트리 키, 서비스 이름/정보, 스케쥴된 태스크 정보 등
- IOC도 궁극적으로는 시그니처와 비슷하다고 본다.
- 최근에는 잠재적인 위협을 탐지하기 위한 보편적 이상 행위를 모두 포함하는 개념으로 확장되었다.
- 징후를 탐지하는 느낌으로 개념 확장되었다.

### 아티팩트 (Artifact)

> 부산물

하지만 쓸모없는 것이 아닌 소프트웨어 전체 구조와 기능을 설명하는데 도움이 되는 데이터베이스, 데이터 모델, 소프트웨어 매뉴얼 등 다양한 형태의 요소들이다.

### IOC 기반 탐지의 한계점

- reactive (리액티브) 하다. 존재하지 않던 악성코드를 탐지할 수는 없다. 이미 한번 겪어야 탐지 가능한 문제.
- 아직은 시그니처가 같고 있던 단점을 가지고 있다. [패턴과 시그니처 기반 보안 솔루션의 한계](https://jaysecurity.tistory.com/66)
- 공격에 사용되었던 특징을 뽑아낸 것이기에 유효 기간(수명)이 짧다.
- 시간이 지날 수록 IOC가 계속 쌓이게 되어 관리 및 탐지에 많은 시간이 소요된다.
- IOC 기반 탐지는 TTP에 비해 상대적으로 우회하기가 용이하다. 툴 수정등을 통해 우회할 수도 있다.
- false sense of security : 우리 IOC에서는 발견되지 않았기에 안전하다, 라고 하는 착각을 일으킬 수 있다. 안전하다고 100% 확신할 수 없음에도 안전하다고 믿을 수도 있다는 것. 블랙리스트 또한 같은 한계점을 가지고 있다.

### IOC 기반 탐지 VS 행위 기반 탐지

예시 1 )

|                                                      공격행위                                                       |                    IOC 기반 탐지                    |                                                                             TTP 기반 탐지                                                                              |
| :-----------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| LSASS(Local Security Authority Subsystem Service) 프로세스의 메모리 영역에 접근하여 사용자들의 크레덴셜 정보를 획득 | 사용한 도구(ex : Mimikatz)의 해시값을 이용하여 탐지 | - LSASS의 메모리 영역에 접근하는 프로세스 모니터링 <br/> - LSASS를 대상으로 하는 프로세스 인젝션 모니터링 <br/> - LSASS에 로드된 DLL 중 서명되지 않은 것이 있는지 확인 |

#### Mimikatz(미미캐츠)?

[야옹! 미미캐츠(Mimikatz)란 무엇일까요? 어떻게 피할 수 있을까요?](https://nordvpn.com/ko/blog/mimikatz/)

만약 위 상황에서 IOC 기반 탐지를 우회하기 위해 해시값이 다른 Mimikatz를 사용하거나 Mimikatz에 의해 만들어진 파일들을 삭제하거나 확장명을 다른 것으로 바꾸어 실행할 수도 있다.

예시 2 )

|                            공격행위                             |                     IOC 기반 탐지                     |                                                                                                                                               TTP 기반 탐지                                                                                                                                                |
| :-------------------------------------------------------------: | :---------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| 내부 시스템에 감염된 악성코드와 C&C 간 커뮤니케이션 (HTTP 활용) | C&C의 IP 주소, URL, User-Agent 문자열을 이용하여 탐지 | - 내부 시스템에 있는 악성코드가 C2서버에 접속하여 명령을 하달받는다. 그렇기에 주기적으로 `아웃바운드 커넥션`(내부에서 외부 서버로 데이터를 전송하기 위해 연결되는 것)이 있는지 탐지한다. <br/> - 최근에 등록한 도메인(베이비 도메인) 혹은 랜덤하게 생성된 도메인에 속한 시스템과의 통신이 있는지 확인한다. |

## 3. MITRE ATT&CK 프래임워크의 이해(3)

[TTP(Tactic, Technique, Procedures)란 무엇인가? 사이버 보안에서의 중요성](https://dev-with-wish.tistory.com/entry/TTPTactic-Technique-Procedures%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80-%EC%82%AC%EC%9D%B4%EB%B2%84-%EB%B3%B4%EC%95%88%EC%97%90%EC%84%9C%EC%9D%98-%EC%A4%91%EC%9A%94%EC%84%B1)

다시한번 보고 옵시다!

### TTPs (Tactics, Techniques, Procedures)

- TTP는 위협 행위를 체계적으로 설명하기 위한 일종의 모델이다.
- Tactics (전술)은 `위협 행위의 목적`을 나타낸다.
- Techniques (테크닉)은 위협 행위의 목적을 달성하기 위해 `사용하는 테크닉`을 의미한다.
- Procedures (프로시저)는 테크닉을 `구현하기 위한 구체적인 절차와 방법`을 의미한다.

### TTPs 예시

|                       전술(Tactics)                       |                 테크닉/서브테크닉                  |                                                                                                                      프로시저 (Procedures)                                                                                                                       |
| :-------------------------------------------------------: | :------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| 최초 접근 (Initial Access) : 교두보 확보와 관련 있는 기법 | 스피어 피싱/첨부파일, 링크 등을 이용한 스피어 피싱 | - 악성 고스트스크립트가 포함된 HWP 파일을 이메일에 첨부 <br/> - 사용자가 첨부된 HWP 파일을 오픈하면 mshta.exe가 실행되어 외부에서 세컨 스테이지 악성 스크립트를 다운로드 받아 실행 <br/> - 악성 스크립트가 실행되면 HTTP를 이용하여 비콘(beacon) 악성코드를 실행 |

```
스피어피싱의 서브 테크닉

- 링크
- 서비스 : 카카오톡 등
- 첨부파일
- etc
```

#### 비콘 (beacon)?

감염된 장비가 명령이나 추가 페이로드를 전달받기 위해 특정 시간에 공격자의 C2 서버에 연결을 시도하는 클라이언트 악성코드

[C2 서버를 이용하는 악성행위 분석](https://www.igloo.co.kr/security-information/command-control-%EC%84%9C%EB%B2%84%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%98%EB%8A%94-%EC%95%85%EC%84%B1%ED%96%89%EC%9C%84-%EB%B6%84%EC%84%9D/)

#### Ghost 스크립트?

[한글 파일에 숨어든 ‘고스트’](https://image.ahnlab.com/atip/content/atcp/tistory/1239_AhnLab_ASEC_%ED%95%9C%EA%B8%80%ED%8C%8C%EC%9D%BC%EC%97%90%EC%88%A8%EC%96%B4%EB%93%A0%EA%B3%A0%EC%8A%A4%ED%8A%B8.pdf)

#### 사이버 킬 체인?

[사이버전 - 사이버 킬 체인(Cyber Kill Chain)](https://charstring.tistory.com/473)

#### 탐지 기술의 발전

`시그니처 기반` -> `IOC 기반` -> `행위기반의 탐지(ex : TTPs 중 대표적으로 EDR)`

[엔드포인트 탐지 및 대응(EDR)이란 무엇인가요?](https://www.ibm.com/kr-ko/topics/edr)

`MITRE-ATT&CK(TTPs)`은 그 전에 비해 공격자의 관점에서 보는 보안 전략

## 4.[이론] MITRE-ATT&CK-프래임워크의 이해 (4)

### MITRE?

- 1958년 설립된 미국의 비영리 민간 연구 기관
- 미국의 정부 기관과 협력하여 국방, 보안, 헬스케어 등의 분야에서 전문적인 연구를 수행

### CVE?

> Common Vulnerabilities and Exposures

`취약점` 리스트

과거에는 취약점을 부르는 용어가 다 달랐었지만 CVE 프로젝트를 통해서 취약점의 공식적인 이름을 붙이게 되었다.

[CVE란?](https://www.redhat.com/ko/topics/security/what-is-cve)

### CWE?

> Common Weakness Enumeration

`보안의 약점` 리스트

[CVE v.s. CWE 차이점](https://blog.naver.com/bycho211/221508854566)

### CAPEC?

> Common Attack Pattern Enumerations and Classifications

> 흔한 공격 패턴 목록화 및 항목화 

[[EQST insight] 사이버 공격 패러다임 변화에 따른 시나리오 기반 모의해킹 트렌드](https://blog.naver.com/adtkorea77/222501529256)

### STIX, TAXII?

> Structured Threat Information eXpression

인텔리전스에 관련된 정보를 저장하는 방법을 통일했다.

위협 정보를 표현하기 위한 틀

> Trusted Automated eXchange of Intelligence Information

STIX로 표현되는 위협 정보를 교환하는 프로토콜, 프레임워크이다.

[STIX/TAXII란?](https://www.cloudflare.com/ko-kr/learning/security/what-is-stix-and-taxii/)

### Cybox, MAEC?

[Using MAEC Report within Cuckoo Sandbox](https://www.hakawati.co.kr/entry/Using-MAEC-Report-within-Cuckoo-Sandbox)

요 부분은 추가 필요, 아직 이해 못함.

### MITRE ATT&CK 프레임워크

> Adversarial Tactics Techniques & Common Knowledge

> 공격자의 전술 기술 & 일반적인 정보

공격자들이 사용하는 TTP들을 집대성하고 체계적으로 정리해 놓은 공개된 데이터 베이스이다.

- 공개된 침해사고분석 보고서, 악성코드 분석 보고서, 위협 그룹에 대한 정보를 분석하여 공격자들의 TTPs를 집대성하고 체계적으로 정리한 공개된 지식 베이스
- 특히 post-exploitation(침투 후) 과정에서 사용되는 위협 행위들을 분석 및 분류 해 놓았다.
- OSINT를 통해 확인된 모든 TTPs들을 포함하고 있으나 따로 중요도/관찰빈도에 따른 정보는 반영되지 않았다.
- 하지만 여전히 블라인드 스팟(blind spot)은 존재하기에 지속적으로 업데이트 되고 있다.

## 5. [이론] MITRE ATT&CK 프래임워크의 이해(5)

[MITRE ATT&CK Framework 이해하기](https://www.igloo.co.kr/security-information/mitre-attck-framework-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0/)

- Matrices (매트릭스)
- Tactics (전술)
- Techniques (기술)
- Data Sources (소스)
- Mitigations (공격 완화 정보)
- Groups (그룹)
- Software (소프트웨어)

였는데 이제는 

- Matrices
- Tactics
- Techniques
- Defenses
- CTI
- Resources
- Benefactors

로 바뀌었다.

### Matrices (매트릭스)

- 테크닉/서브테크닉을 전술을 기준으로 분류해 놓은 표
- 각 컬럼은 전술, 각 행은 해당 전술을 수행하는데 사용되는 테크닉의 정보를 포함
- ATT&CK 매트릭스는 `Enterprise`(윈도우, 맥OS, 리눅스, 클라우드, 네트워크, 컨테이너), `Mobile`(안드로이드, ios), `ICS`(사업제어시스템)

### Tactics

|           Tactics(전술)            |                                                      설명                                                      |
| :--------------------------------: | :------------------------------------------------------------------------------------------------------------: |
|       Reconnaissance (정찰)        |                                  공격을 계획하는데 사용할 수 있는 정보를 수집                                  |
| Resource Development (리소스 개발) |                    공격에 사용할 인프라와 서비스, 악성코드 등 필요한 기능을 개발/구매/탈취                     |
|     Initial Access (초기 접근)     |                                      네트워크에 침입하여 초기 거점을 확보                                      |
|          Execution (실행)          |       악성 행위 수행을 위한 코드를 실행, 더 관범위한 목표를 달성하기 위해 다른 전술의 테크닉들과 견합됨        |
|      Persistence (퍼시스턴스)      |        시스템 재시작, 크레덴셜 변경 등에도 시스템으로의 접근이 지속될 수 있도록 하여 확보한 거점을 유지        |
|  Privilege Escalation (권한 상승)  |                         공격 중 시스템 또는 네트워크에서 보다 높은 수준의 권한을 획득                          |
|    Defense Evasion (방어 우회)     |                                    공격 중 탐지 및 차단 등 방어 체계를 우회                                    |
|  Credential Acess (크레덴셜 접근)  |                          자격 증명을 위한 인증 정보 (계정 이름과 패스워드 등)을 탈취                           |
|          Discovery (정찰)          | 타겟 네트워크에 침투한 이후 행동 방법과 공격 전략을 수립하기 전 시스템 및 네트워크 환경을 관찰하고 정보를 수집 |
| Lateral Movement (레터럴 무브먼트) |          최종 목표 시스템으로의 접근을 위해 타겟 네트워크 내부의 다른 시스템들에 침투하고 권한을 확장          |
|      Collection (데이터 수집)      |                                   공격을 통해 탈취하고자 한 데이터를 수집함                                    |
|   Command and Control (C&C, C2)    |                                     침투에 성공한 시스템과 통신하고 제어함                                     |
|        Exfiltration (유출)         |                                       데이터를 타겟 네트워크 외부로 반출                                       |
|          Impact (임팩트)           |                                    시스템 또는 데이터를 조작, 방해, 파괴함                                     |

### Cyber Kill Chain과의 차이점

![image](https://github.com/user-attachments/assets/67c1b3ad-bbea-4788-becb-b97825240371)

> 사이버 킬 체인

- 공격 시 거쳐야 하는 절차/단계를 모델화 한 것
- 각 단계별로 사용되는 구체적인 테크닉 등에 대해는 다루지 않음
- 각 절차별로 대응 전략을 수립하여 위협 요소를 제거하거나 완화하는데 활용

> MITRE ATT&CK

- 공격 수행에 필요한 절차보다는 공격자들의 TTPs를 집대성 하는데 중점을 둠
- 각 TTPs에 대한 탐지 및 대응 현황을 분석(AS-IS)하고 TO-BE 전략을 수립하는데 활용된다.

[AS-IS / TO-BE 란 무슨 뜻 일까?](https://inpa.tistory.com/entry/%F0%9F%91%A9%E2%80%8D%F0%9F%92%BB-AS-IS-TO-BE-%EB%9E%80)

## 6. [이론] MITRE ATT&CK 활용(1)

MITRE ATT&CK 프레임워크를 활용하여 SOC 및 보안 체계, 보안 솔루션, 개인 및 조직의 사이버보안 현황과 역량 수준을 평가(AS-IS 분석)하고 부족한 부분을 보완하기 위한 전략, 기술, 역량 개발에 활용

- Assess Defensive Coverage
  1. ATT&CK based Adversary Emulation
  2. Atomic Red Team
  3. ATT&CK based SOC Assessment
  4. ATT&CK evaluations

- Identify High Priority Gaps
   1. ATT&CK Heatmap
- Tune or Acquire New Defenses
   1. ATT&CK evaluations
   2. Cyber Analytics Repository

실제로 공격자들의 공격을 시뮬레이션 해본다. 이를 통해 타겟이 이러한 공격을 잘 차단하는지, 감지를 잘 하는지 평가해 볼 수 있다

각각의 테크닉을 에뮬레이션 하는 방법과 특정 그룹이 사용하고 있는 TTP를 모아서 그대로 재현해 보는 방법도 있다

히트맵을 통해 탐지했던 공격과 막지 못한 공격을 가시적(Heat Map)으로 표시할 수 있고 우선순위를 결정할 수 있다

> Threat Informed Defense

![image](https://github.com/user-attachments/assets/8b3601b0-9456-4515-b4cc-79259dc44034)

MITRE ATT&CK 프레임 워크를 실무에 적용하기 위한 과정

- STEP 01 - Establish inputs
   - THREAT INTEL (오픈소스 or 커머셜 툴)
   - IOC
   - IOB
   - DATA MINING

공격자들의 TTPS를 입력받는다

- STEP 02 - Create an adversary emulation plan
   - TTPs를 식별하고
   - 정리한다
   - 그리고 그를 통해 시뮬레이션에 필요한 툴 등을 만든다

- STEP 03 - Run an attack simlation
   - 실제로 시뮬레이션을 돌린다

- STEP 04 - Alert, Hunt & Report
   - 시뮬레이션 결과를 보고하고 경고한다

## 7. [이론] MITRE ATT&CK 활용(2)

> Adversary Emulation (atomic)

평가를 하기 위해 공격을 에뮬레이션 할 때에는 크게 2가지 방법으로 나눠진다

1. 개별적인 TTPs를 구현
2. 전체적인 시나리오를 구현

`atomic`은 이름 그대로 개별적인 것을 다룬다

> Atomic Red Team

오픈소스이다

MITRE ATT&CK의 각 테크닉들을 아토믹하게 구현해 놓았다

각 테크닉과의 연계없이 개별적이고 독립적(아토믹)에뮬레이션

현재 제공되는 프로시저가 다양성, 완전성 측면에서 완벽하지는 않음

> Adversary Emulation Plan

- 에뮬레이션 하고자 하는 위협 그룹의 TTPs 분석
- 공격의 각 단계별로 사용할 TTPs 선택
- 각 TTPs 들을 킬체인 등을 활용하여 공격 단계별로 배치하고 조합하여 공격 절차 구성
- 프로시저 세부 내용 설계 및 구현
- 특정 도구나 명령어에 의존하기 보다는 행위 자체에 집중
- 동일한 행위 또는 테크닉일지라도 실제 사용할 수 있는 도구나 명령어는 매우 다양함

![image](https://github.com/user-attachments/assets/55807083-f14e-47a1-93cb-6580033695d8)

1. 스피어피싱 이메일이 사용자에게 보내짐
2. DOCX 파일을 오픈
3. 그 안에는 DDauto 커맨드가 삽입되어있어서 파일을 실행하게 되면 `mshta.exe(윈도우 기본 프로그램)`라는 프로그램이 실행
4. `mshta.exe`를 통해 인터넷에서 자동으로 악성 코드를 다운받고 실행
5. 악성코드는 자동으로 `EXCEL` 객체를 하나 만들게 되고 `EXCEL work book`에 매크로를 삽입하고 실행하게 됨
6. 매크로는 `rundll32.exe`를 실행하여 악성코드를 네트워크에서 다운받아 주입
7. 그 악성코드는 인터넷에서 `비콘`을 다운받아서 피해자 컴퓨터에 삽입

![image](https://github.com/user-attachments/assets/3e448bfd-aa61-4655-9147-afb6ca0d7984)

## 8. [이론] MITRE ATT&CK 활용(3)

> Top ATT&CK Techniques

MITRE ATT&CK 프레임워크에 있는 기술 중 가장 많이 사용하는 기술에 관해 나열해 놓았다

> Red Canary Top 10 Techniques

Red Canary사가 `Top ATT&CK Techniques`보다 좀 더 자세하게 나열해놓았다

## 시험

> 1. ( )는 공격자들의 위협 행위를 체계적으로 기술하기 위한 일종의 모델입니다. 괄호 안에 들어갈 용어로 가장 적합한 것은 무엇입니까?

정답 : `1` TTPs

> 2. 다음은 MITRE ATT&CK 프레임워크에 정의돈 전술(tactics)에 대한 설명입니다. 잘못된 것을 고르세요.

정답 : `3` 크레덴셜 접근은 주로 내부망 침투 전 공격에 활용할 수 있는 이메일 주소나 사용자 계정 정보 등을 수집하는 것을 목적으로 한다. 

크레덴셜 접근은 침투 후 공격에 해당한다.

> 3. 다음 중 시스템이 악의적인 활동에 의해 침해되었을 가능성이 높음을 보여주는 운영체제 또는 네트워크 아티팩트를 의미하는 용어는 무엇입니까?

정답 : `2` IOC (Indicator of Compromise)

> 4. 다음 중 공격자가 네트워크에 침입한 순간부터 공격을 탐지해내거나 공격을 당했다는 사실을 인지하는데 까지 걸린 시간을 의미하는 용어는 무엇입니까?

정답 : `3` Dwell Time

난 이거 1번인 줄 알았다는거...

`1.` TTA (Time to Alert) : 침입이나 이상 징후를 탐지하고 경고를 보내기까지 걸리는 시간

`2.` TTT (Time to Triage) : 보안 사고가 발생한 후, 이를 분류하고 우선순위를 결정하는데 걸리는 시간

`4.` TTM (Time to Mitigate) : 발생한 보안 위험을 완화하고 문제를 해결하는데 걸리는 시간


> 5. 다음은 MITRE ATT&CK 프레임워크에 대한 설명입니다. 잘못된 것을 고르세요.

정답 : `4` MITRE ATT&CK 매트릭스의 각 전술은 공격자들의 공격 절차를 반영하고 있다.

`전술`은 공격자들이 달성하려는 `목적`을 나타내고 문제에서 말해는 `공격 절차`는 `기술`에 해당한다

어려버...

`1.` OSINT를 수집하고 분석한 결과를 토대로 공격자들의 TTPs 및 관련 정보를 체계적으로 정리

`2.` 보안 매커니즘, 솔루션, 개인 및 조직의 탐지, 차단, 대응 역량을 평가하고 이를 개선하는데 활용할 수 있다.

`3.` Treat Informed Defense를 위한 핵심 프레임워크로 널리 사용되고 있다.

> 6. (참/거짓) MITRE ATT&CK 프레임워크에 등록되어있는 테크닉들은 OSINT를 분석한 결과를 토대로 중요성과 심각성, 출현빈도를 반영하여 선정한 것이다.

정답 : `거짓`

중요성과 심각성, 출현빈도와 같은 기준없이 전부 문서화 해 놓은 것이다

> 7. 이 테크닉은 애플리케이션 이름, 시그니처, 코드 서명 등에 근거하여 실행 파일이나 스크립트의 유해성을 판단하고 실행 및 접근 통제를 수행하는 보안 기능을 우회하여 스크립트, 실행 파일 등 다양한 형태를 가지는 악성 코드를 실행하는 목적으로 사용된다. 이 테크닉은 무엇입니까?

정답 : `3` System Binary Proxy Execution

proxy = 우회... 이걸 틀리네

`1.` Credential Dump : 시스템에서 사용자 자격 증명(크레덴셜)을 추출하는 공격 기법

`2.` Impair Defense : 방어 시스템을 손상시키거나 비활성화하여 탐지를 피하는 공격 기법

`4.` Process Injection : 악성 코드를 다른 프로세스의 주소 공간에 주입하여 그 프로세스를 악의적으로 사용하는 공격 기법

셤 볼때는 분명 1번이라고 생각을...

> 8. 다음은 MITRE ATT&CK 프레임워크와 사이버 킬체인의 차이점을 기술한 것입니다. 잘못된 것을 고르세요.

정답 : `4` 사이버 킬체인에서 정의한 각 단계는 MITRE ATT&CK 프레임워크의 전술에 해당한다.

`사이버 킬체인`은 공격의 단계를 보통 7단계 (정찰, 무기화, 전달, 악성 코드 실행, 설치, 명령제어, 목표 달성)으로 이루어져있지만 `MITRE ATT&CK` 프레임워크는 공격자의 `TTPs`를 기반으로 `전술`, `기술`을 설명한다.

헷갈리는 것 한가지

`2.` MITRE ATT&CK 프레임워크는 주로 post-exploitation 단계에서 사용되는 공격자의 TTPs의 세부 내용을 망라해 놓은 것이다.

요거는 맞는 말이라고 한다.

> 9. 다음은 AEP(Adversary Emulation Plan)에 대한 설명입니다. 잘못된 것을 고르세요.

정답 : `2` 위협 그룹이 사용하는 단일 테크닉을 아토믹하게 에뮬레이션하기 위한 절차서이다.

`AEP`는 특정 위협 그룹의 공격 활동을 단일이 아닌 전체적으로 시뮬레이션 하기 위한 계획이다.

아토믹..?  개별적인이라고 보면 될 것 같다.[Atomic operation](https://casionwoo.tistory.com/29) 어.. 일단 답은 찾을 수 있었다. 단일 테크닉이 아니라 전체 시뮬레이션이기에. 

> 10. 아래의 공개된 프로젝트 중 MITRE ATT&CK 프레임워크에 등록되어있는 테크닉을 에뮬레이션 하기 위한 개별적인 프로시저를 제공하고 있는 것은 무엇입니까?

정답 : `2` Atomic Red Team

MITRE ATT&CK 프레임워크에 등록된 테크닉을 에뮬레이션 하기 위한 atomic tests 를 제공한다.

> 11. 다음은 MITRE ATT&CK 프레임워크의 활용 방안에 대한 설명입니다. 일반적인 활용 방안과 가장 거리가 먼 것을 고르세요.

정답 : `4` 체크 리스트 기반의 보안 점검을 통해 취약점을 평가하고 적절한 대응 방안을 마련하기 위해 사용한다.

MITRE ATT&CK 프레임워크는 TTPs를 체계적으로 정리한 것으로 위협 모방, 방어 체계 평가, 탐지 로직 개발 등에 주로 사용되지만 체크리스트 기반의 보안 점검보다는 위협 행위를 기반으로 방어 체계의 탐지 및 대응 능력을 향상시키는 데 초점이 맞춰져 있다.

> 12. 이거은 MITRE에서 운영하고 있는 프로그램 중 하나입니다. 이것의 목적은 실제 위협 그륍의 TTPs를 모사한 공격 에뮬레이션을 통해 위협 행위를 탐지하는 보안 솔루션들의 탐지 범위와 수준, 방법들을 평가하여 소비자와 개발자 모두에게 유익한 정보를 제공하는 것을 목적으로 하고 있습니다. 이것은 무엇입니까?

정답 : `2` ATT&CK Evaluation

> 13. 다음중 MITRE ATT&CK 프레임워크에서 제공하지 않는 정보는 무엇입니까?

정답 : `4` 테크닉과 관련된 취약점 정보

MITRE ATT&CK 프레임워크는 TTPs에 초점을 맞추고 있어 각 테크닉에 대한 세부적인 `탐지 방법, 데이터 소스, 위협 그룹 및 악성 코드`와 같은 정보는 제공하지만 특정 테크닉과 관련된 `취약점 정보`는 MITRE의 `CVE`프로젝트에서 제공한다.

> 14. TTPs 기반 탐지가 가지는 특성 및 장점과 거리가 먼 것은?

정답 : `1` 리액티브한 속성을 가진다

TTPs(전술, 기술, 절차) 기반의 탐지는 프로엑티브, `즉 공격자의 행통 패턴을 기반으로 사전에 위협을 식별하고 대응할 수 있다`는 의미로 리엑티브, 즉 `공격이 발생한 후에 대응하는 방식` 과는 맞지 않다.

`2. 상대적으로 우회하기 어렵다` : TTPs 기반 탐지는 상대적으로 우회하기 어려운 탐지 방식이다.

`3. 선제적 대응이 가능하다` : TTPs 기반 탐지를 통해 선제적 대응이 가능하다는 장점이 있다.

`4. 특정 시그니처나 IOC에 의존하지 않고 행위에 기반하여 탐지를 수행한다` : TTPs 기반 탐지의 핵심이다.