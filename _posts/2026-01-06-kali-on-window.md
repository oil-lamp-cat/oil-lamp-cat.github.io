---
title: "[HTB] Hack The Box를 위한 kali 윈도우 설치에 관하여 (feat. 중첩 가상화, WSL2, Win-kex)"
date: 2026-1-6 21:50:00 +09:00
categories: [hacking, Kali Linux]
tags: [HTB, Kali Linux]
pin: true
---

## 시작에 앞서

사실 전에도 HTB 문제를 가장 처음 풀 때에 윈도우에 Kali를 설치하는 방법에 대해 간단하게 설명 했던 적이 있었다만 이번 기회에 WSL이나 Win-kex, Vmware 등을 활용하는 방법을 쭉 작성해보고자 한다.

## 세팅에서 살짝 다를 수도 있는 부분

내 컴퓨터에 처음부터 세팅하는 것을 보여주려니 내 컴퓨터에는 이미 세팅이 되어있어 새로 싹 밀고 설치하기가 좀 그래서 `VMware`를 이용해 보여주고자 한다.

그리고 이 과정에서 VMware `중첩 가상화`를 이용해 진행하기로 했고 그를 위해 VMware 설정을 하는데 살짝 애를 먹기도 했기에 이후 혹시 다시 이 작업을 하게 된다면 또 찾을 일 없게 좀 정리해두고자 한다.

## 중첩 가상화란?

간단하게 중첩 가상화가 무엇인지 설명하자면, 내 PC (windows)에 VMware를 통해 가상환경을 이미 세팅해 두었는데 VM안에서 또 VM을 설치해버리는 것을 중첩 가상화이다.

[중첩된 가상화란? / Windows](https://learn.microsoft.com/ko-kr/windows-server/virtualization/hyper-v/nested-virtualization)

![가상환경](https://github.com/user-attachments/assets/07afe6cc-f458-456c-8562-d12443f609af)

위 사진과 같이 메인 os안에 가상환경 안에 가상환경인 셈

그리고 이것을 위해 

![virtualization engine](https://github.com/user-attachments/assets/6ba952c0-4a3c-4dcf-8d24-86298ba3664b)

일단 VM을 기준으로 os를 설치한 후 머신 세팅에 들어가 위 이미지에서 보이는 `Virtualize Intel VT-x/EPT or AMD-v/RVI`를 켜주면 되는데...

난 이것만 딸깍 하면 될줄 알았다만..

![vm 안됨](https://github.com/user-attachments/assets/8fb882d4-efd0-4e50-9bbb-2e776118d884)

위와 같은 `Virtualized Intel VT-x/EPT is not supported on this platform.` 이라며 님 가상화 안됨 하고 가상화 끄고 진행하겠냐고 떴다.

절대 안되지. 난 가상화를 쓰기 위해 Win 11을 까는 중이었는걸?

그래서 좀 더 알아보며 이것 저것 다 해봤다. 

`.vmx` 파일 편집하기, 메모리 무결성 끄기, CPU 사용량 늘리기 등

하지만 결국 저 오류는 `메모리 무결성 끄기`로 해결했고 

![vm restart](https://github.com/user-attachments/assets/d6d6ac3b-f464-4563-8871-369db7b2d3c0)

이번에는 또 위와 같이 윈도우 설치가 잘 진행 되다가 `Your device ran into a problem and needs to restart.` 라며 `WHEA_UNCORRECTABLE_ERROR` 오류가 발생하였다.

그리고 알아보니 이건 `CPU 가상화 충돌` 문제인데 아무래도 내 컴퓨터에 WSL을 실행하기 위한 `Hyper-V`가 켜져있어서 VMware랑 둘이 기싸움을 벌이다가 뻗어버린 상황이였다.

[Hyper-V가 활성화된 호스트에서 실행되는 Windows 10/11 게스트에서 무작위 "WHEA uncorrectable error" 크래시가 발생하는 문제에 대한 가능한 해결 방법](https://www.reddit.com/r/vmware/comments/1e1mhxp/possible_workaround_for_random_whea_uncorrectable/?tl=ko)

그러다 위와 같이 무려 2년전 레딧에 올라온 글을 보게 되었고 글 따라 Windows11을 설치할 때에 기본 디스크인 `NVMe`가 아니라 `SATA` 방식으로 가상 하드디스크 방식을 바꿔버리니?

![win11 success](https://github.com/user-attachments/assets/5697d9e0-e839-4efe-bcd4-9d6a30bcc2e3)

됬다!! 이게 되네.

아 그리고 참고로 윈도우 설치할 때에 계정 넣고 뭐 넣고 해야하는데 그거 싫으면 윈도우 설치 할 때에 머신 설정 들어가서

Network Adapter -> Connected, Connect at power on

을 전부 꺼버리고

Shift + F10을 눌러 CMD 창에 `oobe\bypassnro`를 넣으면 설치 과정에서 `인터넷에 연결되어있지 않음`이라는 문구를 통해 계정 설정 없이 진행이 가능하다.

난 이걸 몰라서 하루를 썼다는 이야기... 인공지능도 아직 만능은 아니여.

## VMware에 Kali Linux 설치

다시 Kali 설치로 돌아와 

![내가 이래서 bing을 안써](https://github.com/user-attachments/assets/6db11f72-83a8-4ff9-b91d-ef11fc65ef9d)

내가 이래서 Edge를 안써... vmware 검색했더니 쓸데없는거 나오는거보소. 그래도 일단은 VM 윈도우니까 이번만 쓸거니까..

![VM 설치](https://github.com/user-attachments/assets/42cabf5c-0e9e-4854-9f7a-a268c7de4665)

뭐... 위 페이지 찾았으면 Products 들어가서 vmware 계정 만들고 VMware Workstation Pro 설치하는건 알죵? 모른다고요? 간단히 설명해 드리죠.

### VMware 설치 (2026년 1월 7일 기준)

![login](https://github.com/user-attachments/assets/b6b0e91e-2f3e-4f57-ab04-8ca80fcfa580)

로그인을 누르면 세가지 방법이 뜨는데 이 중 우리는 `Broadcom Support`를 들어가야 합니다. 여기서 다운받을 수 있거든요.

![panel](https://github.com/user-attachments/assets/b43284a3-a7c6-405e-adc0-423c6389c992)

들어가서 로그인하면 위와 같은 페이지가 보일거고 왼쪽에 `My Downloads`를 들어가면

![MyDownloads](https://github.com/user-attachments/assets/40fed3b7-7d67-40f8-9b3a-8d15bd404520)

위처럼 데이터 없음 할탠데 놀라지 마시고 `Free Software Downloads available HERE`을 누르세요.

![product](https://github.com/user-attachments/assets/7e18288d-c037-4420-82e3-e326e09ead3c)

보면 제품들 딥따 만을텐데 우리가 필요한건 `VMware Workstation Pro` 랍니다.

![뭐설치할거](https://github.com/user-attachments/assets/6765a592-d5c8-4457-81b7-1e876d08cf7f)

뭐를 설치할거냐고 묻는데 이제 가장 최신이랄까 더 이상 없데이트를 안하는 17.0버전 말고 25H2 버전을 설치하시면 됩니다.

![아잇](https://github.com/user-attachments/assets/245d3a57-42d0-4818-a758-6f5a11418ec4)

아잇 그 사실 지금 위 사진처럼 저는 이미 약관 동의나 이런걸 다 해서 바로 다운로드 할 수가 있는데 

![원래는](https://github.com/user-attachments/assets/4afe9765-f3ab-4ae1-b0ac-4027ac736cc7)

원래는 위 예시처럼 `I agree to the Terms and Conditions`가 있어서 이거 눌러서 약관 보고 동의 해야 설치 가능합니다.

사실 이 마지막 것 때문에 VM설치에 대해 간단히 설명하는 것이기도 하고요.

그럼 이제 vmware를 설치했다고 치고! (설치 과정은 간단하니까) 진짜 kali를 설치하러 가보죠.

### VMware에 Kali 설치하기

![get kali](https://github.com/user-attachments/assets/5e466885-dc14-4e31-b036-8a6349ccc01c)

인터넷에 `Get Kali Linux`를 쳐서 공식 사이트에 들어갑시다. 

그러면 이제 위처럼 여러 방식의 설치 방법이 있는데 일단 이번에는 VMware를 이용할거니까요? `Virtual Machines`를 들어가줍시다.

![pre-built](https://github.com/user-attachments/assets/ea832641-a62b-4b84-9800-9aabe64c9c19)

그럼 보이는 것 처럼 VMware나 VirtualBox, Hyper-v, QEMU에 설치할 수 있는 이미 만들어진 칼리 파일이 있는데 저희는 이 중에 VMware를 다운받으면 됩니다. 옆에 있는 torrent나 docs, sum은 순서대로 설치 방법, 문서, checksum 입니다.

여담으로 전 사실 제 본 컴의 vm을 설치할 때에 ios를 다운받아 했다는 사실.. 나도 이렇게 할걸.

![들어가보면](https://github.com/user-attachments/assets/a8ac0e1f-e8e3-48bd-98b8-86618749dad0)

파일 압축을 해제해보면 위처럼 이미 만들어진 가상 디스크와 세팅 등이 있다.

~~이거 vm에서 압축 해제 했다가 가상 디스크 가득차서 os 뻗었다는 이야기... 솔직히 3GB가 14GB가 되는건 사기지~~

![워크 스테이션](https://github.com/user-attachments/assets/f30da7b0-c730-440e-94b9-7f204bc8cf87)

이제 재료도 다 모였으니 Workstation을 켜면 위와 같이 보이고 여기서 우린 Create가 아닌 `Open a Virtual Machine`을 선택해주자.

![vmr](https://github.com/user-attachments/assets/e7d9b699-32ca-4cd0-9d21-eac0a4183b6b)

여기서 아까 다운받았던 파일에 들어가보면 딱 파일 하나 뜰거고 이걸 열어주면 된다.

![VMware 끝](https://github.com/user-attachments/assets/4e2879e5-a2db-45ff-b3e8-b02b97662358)

사실상 여기서 이제 머신 설정 바꾸고 싶으면 바꾸는거고 그 외에는 끝이다. VMware로 Kali 설치하기 참 쉽죠잉?

이후에 세팅을 하고 싶다면 고것은 Kali Linux에 대해서 찾아보시길. 그리고 사실 이미 다 있어서 굳이?

## WSL2로 Kali Linux 설치

자 그럼 이제 WSL2를 이용한 설치를 봐볼까?

![wsl 설치](https://github.com/user-attachments/assets/677d750c-fe82-49e1-87aa-00374527ce89)

이것을 하기 위해서는 WSL을 이용해야하는데 이게 기본 값이 WSL 버전 1인지 2인지가 긴가민가해서 일단 버전 2로 고정하고 진행하겠다.

`wsl --set-default-version 2`을 넣으면 된다.

![wsl2 설치 완](https://github.com/user-attachments/assets/1ddd1f7b-30fa-4a91-bf88-04333f6284b5)

처음 설치할 때에는 뭔가 많이 뜰거고 그 결과로 위처럼 버전 2가 설치될 것이다.

이미 있다면 버전 확인을 위해 `wsl -l -v`를 입력하면 된다.

![kali 검색](https://github.com/user-attachments/assets/0a8af160-dc4f-488a-b26d-64ec925ab2a5)

kali 설치를 할 때에는 굳이 공식 사이트로 가는게 아니라 `윈도우`키를 누르고 `kali linux`를 검색하기만 하면 `스토어`에 `Kali Linux`가 뜨는데 이게 바로 WSL로 설치하는거다.

![이렇게](https://github.com/user-attachments/assets/a8f3e221-9243-4db0-9481-8563863eff0a)

이렇게 설치를 하고 나면

![kali 설치 완료](https://github.com/user-attachments/assets/685035f2-8cbb-4915-9708-0872df355e64)

설치가 완료된 것을 알 수 있고 

![내 vm에서 오류남](https://github.com/user-attachments/assets/ff11d64f-145a-4cff-9422-22738b3a10c9)

내 VM에서는 오류가 발생한 것을 알 수 있다...???????

아 이거 그 vm 윈도우에서 `가상 머신 플랫폼 켜기`와 `Linux용 Windows 하위 시스템 켜기` 안해서 그렇다. 이건 뭐.. 간단한 이슈니까.

![windows 기능 켜기/끄기](https://github.com/user-attachments/assets/0428c1e5-241b-4d5d-977a-18af33e0559b)

`Windows 기능 켜기/끄기`에 들어가 위에서 이야기 했던 것들을 전부 켜주면 된다.

그리고 다시 컴퓨터를 껏다가 키면?

![이렇게](https://github.com/user-attachments/assets/0ff58f05-8a34-449c-a8d3-eda3dbe6b21a)

이렇게 처음 `Default User name`과 `Password`를 입력해야한다.

![kali 설치](https://github.com/user-attachments/assets/07367c4d-facb-4432-8678-79bd8887c86b)

WSL2에 칼리 설치가 끝났다!

다만 여기서 문제가 있다면 이 칼리의 경우 설명에도 나와있듯 `minimal installation` 이기에 도구들을 설치해줘야 한다는거? 그리고 지금 상태로는 GUI를 열 수가 없다는 점 등이 있겠다.

물론 여기서 기본 도구들 설치하려면

```
sudo apt update

sudo apt upgrade

sudo apt install -y kali-linux-default
```

을 통해 설치해주면 된다!

아 그리고 요건 오류? 때문인지 모르겠는데 바로 설치 후에는 nmap이 안된 적이 있었는데 함 설치 다 하고 나면 WSL 껐다 켜주기.

## WSL2에 Win-Kex로 GUI이용하기

[kali/Win-KeX](https://www.kali.org/docs/wsl/win-kex/)

자! 그럼 이제 WSL2로 Kali Linux를 설치하는 것도 끝났겠다! WSL로만 쓰면 도구들을 GUI로 열거나 볼 수가 없지 않는가? 여기서 사용할 수 있는 것이 바로 `Win-Kex`를 이용하는 방법이다!

여기엔 3가지 형태가 있는데

1. 윈도우 모드 (Window Mode)

![윈도우 모드](https://www.kali.org/docs/wsl/win-kex/win-kex-full.png)

2. Seemless 모드

![심리스 모드](https://www.kali.org/docs/wsl/win-kex/win-kex-sl.png)

3. 향상된 세션 모드 (Enhanced Session Mode)

![향세모](https://www.kali.org/docs/wsl/win-kex-esm/win-kex-2.png)

이 3가지 방법을 소개해줄 것이고 사실 설치하려면 이 블로그 말고 인터넷이나 공식 사이트에도 자세히 설명되어있으니 참고!

### Win-Kex 윈도우 모드

오늘은 일단 여기에서 끝 낼 출근해야혀..

### Win-Kex Seemless 모드

### Win-Kex 향상된 세션 모드