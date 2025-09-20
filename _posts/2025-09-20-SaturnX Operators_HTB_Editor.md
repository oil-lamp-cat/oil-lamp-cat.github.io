---
title: "[HTB] Editor (Easy)"
date: 2025-09-20 15:01:15 +09:00
categories: [hacking, saturnx operators]
tags: [Hack The Box]
pin: true
password: "0730123545"
---

## 시작에 앞서

2025-09-20 시작, Active 머신이라 공개하면 안된다 하여 추후 다시 올릴 예정

[Editor has been Pwned](https://labs.hackthebox.com/achievement/machine/988787/684)

![start](https://github.com/user-attachments/assets/4057645e-3914-430f-8110-a5efdfb2b79b)

일단 이번 문제는 아직 `Active` 되어있는 머신으로 모드 설정이 불가능 하기에 틀린 부분이나 많이 돌아가는 부분이 존재할 것이다. 그리고 생각의 흐름대로 풀거라 이걸 왜 이렇게 풀어? 싶은 부분들도 있을거다.

Easy라고는 하지만.. 내게 쉬울지는...

## 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap scan result](https://github.com/user-attachments/assets/54f04eda-0da3-4061-9b48-dcf2e0eebf7c)

- 포트 22: SSH (OpenSSH 8.9p1)
- 포트 80: HTTP (Nginx 1.18.0)
- 포트 8080: HTTP (Jetty 10.0.20 / XWiki)

보아하니 `OpenSSH`의 버전은 최신이라 취약점을 찾아봐야 할 듯 하고 `Nginx`는 내용을 보니 `editor.htb`를 통해 접속을 해야지 볼 수 있다고 한다. 그러기 위해서는 `/etc/hosts` 에서 호스트 파일을 수정해야 한다는데.. 이건 잠시 넘겨두자.

그렇다면 남은건 `XWiki`인데 보아하니 바로 접속도 가능해 보이니 들어가서 페이지를 둘러보자.

![xwiki 취약점](https://github.com/user-attachments/assets/12a45d06-378b-4ead-bdae-3981c78ce967)

아 그리고 위 사진처럼 취약점이라고 검색을 해보니 엄청 많이 나와서 필요하다면 이것도 사용할 수 있을 듯 하다.

![W am i could do?](https://github.com/user-attachments/assets/b89ff60f-e862-46b6-91cb-9d69372c8b6d)

일..단 로그인 페이지도 있고, 내려보면 `installation`이라고 해서 뭔가 다운받는 것도 있고..

`SimplistCode Pro` 라는 프로그램을 다운할 수 있게 해주는 사이트다.

![설치 방법](https://github.com/user-attachments/assets/3f3d1153-007d-462d-8208-151dc9bd0039)

설치 방법은 위와 같이 나오게 된다만 우리는 이게 중요한게 아니라

![xwiki version](https://github.com/user-attachments/assets/2c5f311c-704a-43b4-9519-2c22da2e58c9)

아래로 쭉 내려 `Information`부분을 보면 `Xwiki`의 버전이 보인다.

`XWiki 2.1` 이게 우리의 타겟이 되겠다.

![2.1Vuln](https://github.com/user-attachments/assets/da23d73d-8fe1-4b11-a639-9a78b6e1205a)

검색 결과 시작부터 **RCE** 취약점에 대한 내용이 보인다.

[XWiki Remote Code Execution Vulnerability via User Registration](https://github.com/advisories/GHSA-rj7p-xjv7-7229)

아 근데 이건 버전이 맞지 않는다.

`XWiki Debian 15.10.8` 현재 문제의 버전은 저 취약점을 쓰기엔 버전이 더 높다. 다른걸 찾아야할지도..

- [CVE-2025-24893 – Unauthenticated Remote Code Execution in XWiki via SolrSearch Macro](https://www.offsec.com/blog/cve-2025-24893/)
- [XWiki Platform 15.10.10 - Remote Code Execution](https://www.exploit-db.com/exploits/52136)

그리고 위 두가지 내용을 찾아냈다. 둘 모두 `cve-2025-24893`에 관한 취약점에 대한 내용으로 이것을 이용해 다음 단계로 진행하면 좋겠다. 물론 그 전에 내용 좀 읽어보고.

## 초기 침투 (Initial Foothold / Exploitation)

바로 침투하기에 앞서 일단 CVE 내용을 좀 정리해보자. 일단은 공부하려고 하는거니 말이다.

### 취약점에 대해

- XWiki에는 관리자가 동적 콘텐츠를 생성할 수 있도록 지원하는 `스크립팅 매크로({{groovy}})`가 존재합니다. 이 기능은 서버 사이드에서 직접 코드를 실행하는 역할을 한다.
- 하지만 이 매크로를 관리자 인증 그런거 없이 게스트 접속 만으로(누구나) 요청을 보낼 수가 있다. `GET /xwiki/bin/view/Main/SolrSearchMacros?search=... (with embedded Groovy code)` 이런식으로 말이다.
- `def query = "search=${params.search}" def result = evaluate(query)` 이런 식으로 어떤 내용이 들어오든지 검증을 하지 않았다는 것이다.

그렇게 위 사이트에서 나온 공격 코드는 `curl "http://<target>/xwiki/bin/view/Main/SolrSearchMacros?search=groovy:java.lang.Runtime.getRuntime().exec('touch /tmp/pwned')"` 이렇게 된다.

살짝 뜯어보자면

- `groovy:` : 검색어의 시작을 groovy:로 지정하여, XWiki 서버에게 "이 뒤에 오는 내용은 단순한 검색어가 아니라 Groovy 스크립트이니, 서버에서 직접 실행해 줘"라고 지시하는 매직 키워드이다.

- `java.lang.Runtime.getRuntime().exec(...)` : 서버에서 운영체제(OS) 명령어를 실행시키는 표준적인 Java/Groovy 코드이다.

- `'touch /tmp/pwned'` : 실행할 OS 명령어입니다. touch는 빈 파일을 생성하는 리눅스 명령어이며, /tmp/pwned는 /tmp 디렉터리에 pwned라는 이름의 빈 파일을 만들라는 의미다.

지금 이 코드 자체가 악의적인 행동을 하는 코드는 아니지만 원격으로 `/tmp/pwned` 파일을 생성해내는데 성공하게 된다면 어떤한 코드든 실행할 수 있다는 취약점이 증명되는 샘이다.

`MSFconsole`을 이용할 수도 있겠다만, 나는 일단 CVE에 나온 [CVE-2025-24893.py](https://github.com/a1baradi/Exploit/blob/main/CVE-2025-24893.py)를 이용해 보도록 하겠다.

### 침투 시작

![wget](https://github.com/user-attachments/assets/dafc4396-f2a8-4a05-96c6-de04a7e488b5)

코드를 다운받고 이제 실행해보자.

![why?](https://github.com/user-attachments/assets/7fce6d00-d64b-4ba5-ab51-d24660a07f3a)

어.. 왜? 어쩌면 포트를 입력해서 그럴지도 모르겠다.

![why??](https://github.com/user-attachments/assets/0ecf66f0-a442-435b-b0d3-34edac43c7c9)

진짜 왜?

좀 알아보니 첫번째 시도에서의 문제는 30번 리다이렉트 되어서 실패했다고 뜬거고 두번째에서는 애초에 처음 nmap을 해보았을 때에 80번 포트에는 접속 못하게 되어있어서 그런 것 같다. 일단 적어도 난 그렇게 생각한다.

- [CVE-2025-24893-XWiki-Unauthenticated-RCE-Exploit-POC](https://github.com/dollarboysushil/CVE-2025-24893-XWiki-Unauthenticated-RCE-Exploit-POC)
- [gunzf0x/CVE-2025-24893](https://github.com/gunzf0x/CVE-2025-24893/tree/main)
- [Infinit3i/CVE-2025-24893](https://github.com/Infinit3i/CVE-2025-24893)

찾아보면 github에 위와 같이 여러 코드들이 있으니 그 중에 하나 선택해서 이용하면 될텐데. 코드를 뜯어보니 애초에 처음 내가 이용했던 코드에는 `/etc/passwd`를 읽어서 내게 띄워주는 코드였고 위 3개의 코드는 다 reverse shell을 위한 코드이다.

그 중에 나는 가장 첫번째 코드를 이용하겠다.

![Success](https://github.com/user-attachments/assets/81d76e94-5eab-4af9-ad2b-b18977b0a588)

성공!!!

그럼 이제 여기서 `user.flag`를 찾아야 하는데 `ls -la /home`을 통해 파일들을 찾아보니 `oliver`가 있고 일단 더 편하게 쉘을 쓰기 위해 `bash`쉘을 띄웠다.

![bash](https://github.com/user-attachments/assets/de220989-b581-4dc0-b4be-fc87a7b9cb78)

근데 그래서 여기서 뭘 할수 있을까? 유저 플래그를 찾아야하려나?

![user](https://github.com/user-attachments/assets/aaf7c2bb-9aae-4c92-955f-56619e5f9ecc)

필자는 여기서 이 oliver를 어떻게 접속할까 고민하는 것 만으로 2시간을 썼다. 아니 근데 진짜로 그냥 보고서 `linpeas`도 써볼까 했는데 `getcap`에서 이미 딱히 방법이 없어보이고, 다른 파일들 돌아다녀봐도 아무래도 이런 문제 푸는게 저번 문제 빼면 거의 처음이기에 방도를 못 찾고 있었다.

![permission denied](https://github.com/user-attachments/assets/d66f1333-8b39-4e03-bd04-c578e50668fc)

화딱지가 난다...

![제미니](https://github.com/user-attachments/assets/464f92c0-aa37-40b6-ab33-a6c70f6c90ac)

그러다 제미니에게 `Xwiki`에서 중요한 파일이 있느냐고 물으니 `hibernate.cfg.xml` 파일이 가장 중요하다고 한다. 이래서 뭔가 머리박고 시작하는 것 보다 그 시스템에 대해서 잘 아는게 더 중요한 이유인가보다.

![찾았나?](https://github.com/user-attachments/assets/57d8edfa-84b6-4a3a-9587-d855f636bdd9)

보아하니 `xwiki`말고 `theEd1t0rTeam99`이라는 비밀번호가 보인다. 이게 혹시 oliver의 비밀번호일까?

그리고 이 때 oliver로 권한을 상승하는 방법은 `su`를 이용하거나 `ssh`를 이용하는 방법이 있다고 하는데 이미 위의 nmap 결과에서 나왔듯 22번 포트에 ssh가 열려있으니 이를 이용하면 되겠다.

## 권한 상승 (Privilege Escalation)

![oliver](https://github.com/user-attachments/assets/1cdff8d2-35dd-4036-95d7-a4508ec5c2c6)

이거지!! oliver로 접속에 성공했다. 그럼 이제 플래그를 찾을 수 있겠지?

![userflag](https://github.com/user-attachments/assets/5adbb329-542a-4089-ac89-4cf4a495deec)

성공이다!!

![userflagdone](https://github.com/user-attachments/assets/c50fd429-522e-4fe0-9a66-d63245a1635d)

그럼 이젠 Root flag만 찾으면 되겠다.

![getcap](https://github.com/user-attachments/assets/4cfb5c56-82a6-4fbf-9ac6-63d10b4389c0)

뭐.. 어찌보면 당연하겠다만 getcap의 결과는 동일할 것이고 그렇다는건 어떻게든 지금의 결과를 이용해야한다는 의미겠다. 아니면 이번에야말로 linpeas를?

![linpeasresult](https://github.com/user-attachments/assets/8f7603ce-28f3-4ba8-b3c6-e65a1348b28e)

결과는 위와 같이 나왔고 그중에 `/opt/netdata/usr/libexec/netdata/plugins.d/`가 수상해보인다. 다른건 보통 알 수 있다고 하는데 이건 알 수 없는 SUID 바이너리라고 하니 함 실행해보자.

![plugins.d](https://github.com/user-attachments/assets/24ab2121-6ed2-4cb7-949f-674b7f2af0d7)

이렇게 가보니 빨간색으로 친히 Setuid가 되어있다고 알려준다.

![ndsudo](https://github.com/user-attachments/assets/555430c0-1275-49fc-b7cc-f6f68ebe4175)

다 하나씩 `--help` 써가며 설명서를 읽어봤지만 그나마 `ndsudo`가 가능성이 있어 보인다만.. 더 찾아봐야겠다.

![gemini](https://github.com/user-attachments/assets/84a150d8-bccd-47ea-a249-5a72814af060)

오? 이렇게는 전혀 생각을 못했었는데 Gemini가 어째 답을 알려준 것 같다. 그럼에도 필자는 잘 이해를 하지 못했기에 좀 더 알아보고자 한다.

![Path hijecking](https://github.com/user-attachments/assets/5a58d647-deb4-4fd5-90e6-8c04ac58ddf8)

인공지능은 참 공부할 때 도움이 많이 된다.

- [National Vulnerability Database _ CVE-2024-32019 Detail](https://nvd.nist.gov/vuln/detail/CVE-2024-32019)
- [AzureADTrent/CVE-2024-32019-POC](https://github.com/AzureADTrent/CVE-2024-32019-POC)
- [ndsudo: local privilege escalation via untrusted search path](https://github.com/netdata/netdata/security/advisories/GHSA-pmhq-4cxq-wj93)

그리고 찾다보니 애초에 이 `ndsudo`라는 친구에게 취약점이 있다는 것을 찾아낼 수 있었다. 그리고 그 내용이 Gemini에게 들었던 그 취약점과 동일한 내용이기에 이것을 이용하면 되겠다.

![scp paload](https://github.com/user-attachments/assets/fd752a55-ce1c-486d-961f-a3d3fe385b94)

첨에 머신 내부에서 파일을 생성해보려고 했으나 oliver가 파일 만들 권한이 없어가 외부 kali에서 scp명령어를 통해 파일을 옮겼다.

아 참고로 저 poc.c는 [poc.c](https://github.com/AzureADTrent/CVE-2024-32019-POC/blob/main/poc.c)에서 가져왔다.

```c
#include <unistd.h>

int main() {
    setuid(0); setgid(0);
    execl("/bin/bash", "bash", NULL);
    return 0;
}
```

보이듯 정말 간단한데 루트 권한을 얻고(`setuid(0)`과 `setgid(0)`) bash쉘까지 실행해 주는 코드다.

그걸 `-o`를 이용해 nvme로 컴파일 후 타겟으로 넘기고 이제 실행할 차례다.

![PATH](https://github.com/user-attachments/assets/23f84ea1-1df4-4311-8867-6cfa9e8cb978)

chmod로 실행 권한을 주고(안해도 권한이 같더라는 이야기), `export PATH=/tmp:$PATH`를 이용해 쉘이 명령어를 찾을 때 가장 먼저 `/tmp`파일에서 찾게 만들어버리자.

- 변경 전: `PATH=/usr/bin:/bin`
- 변경 후: `PATH=/tmp:/usr/bin:/bin`

그럼 위와 같이 변경되어 이제 `/tmp`에서 가장 먼저 찾고 `/usr/bin` 그리고 `/bin`순서가 될거다.

이제 마지막으로 `ndsudo`를 이용해 루트 권한을 얻으러 가자!

![what?](https://github.com/user-attachments/assets/7715dfe2-500e-4a24-94ea-cff6e444d1ac)

진행하려 했는데 갑자기 내가 넣었던 nvme 파일이 통째로 사라졌다. 어쩐지 오류가 나더라니... 전에 듣기론 여러 사람이 같이 진행하다보니 이렇듯 가끔 제대로 되어야 하는게 안될 때가 있을 수도 있다고 했었는데, 뭐 무료 사용자니까 그럴 수 있다. 다시 `scp` 명령어로 nvme 넘겨주고 실행하자.

![imgroot](https://github.com/user-attachments/assets/826154d3-e190-4bcf-ae5a-1a623c8b5702)

자 드디어!! root 권한을 획득할 수 있었다.

![final](https://github.com/user-attachments/assets/0f31519b-0fcb-4db4-ab15-58d58e86cf6a)

얻은 플래그를 넣고 나면!

![Editor Pwned](https://github.com/user-attachments/assets/2cfb1e0e-79fe-475e-ac7b-f6d2cd029577)

크~ 드디어 하나 또 해냈다! 근데 이번에는 어떻게 진행해야하는지 가이드가 없다보니 확실히 아침에 시작해서 이젠 밤이 되었다. 그래도 즐거우니 한잔해!