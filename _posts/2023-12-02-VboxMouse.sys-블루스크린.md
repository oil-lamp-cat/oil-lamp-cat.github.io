---
title: VboxMouse.sys 블루스크린(중지코드 Driver_IRQL_NOT_LESS_OR_EQUAL)
date: 2023-12-02 20:50:15 +09:00
categories: [Tools & Environment]
tags: [Windows, 오류해결]
pin: true
---

자꾸만 컴퓨터를 끄거나 실행할 때에 
>중지코드 : Driver_IRQL_NOT_LESS_OR_EQUA<br/>
>실패한 내용: VBoxMouse.sys

오류가 발생하여 여기저기 해결방안을 찾아다녔지만 결과론적으론 다음과 같다.

## 이유
나는 가상환경으로 linux와 서버를 돌리고 있기에 Virtual Box를 깔았는데 그 과정에서 virtualboxguest버전을 설치하였다. 헌데 이것을 vbox에 깐 것이 아니라 직접 다운받아서 window 루트폴더에 깔아버린 것이다. 이로 인해 내가 사용하고 있는 bluetooth 마우스가 연결이 해제되거나 연결되면 블루스크린이 뜨며 종료하게 된 것이다.

## 해결방법
매우 간단하다.

>제어판 - 프로그램 제거 - Oracle VM VirtualBox Guest Additions 삭제 - 재시작

이로써 내가 혹시 windows sys에 문제가 생겼나 해서 **DISM restore health**를 하라고 했던 블로그 들을 찾아보다 결국 reddit에서 이유를 찾게 되어 10시간동안의 삽질 끝에 해결한 오류를 해결할 수 있다.

혹시 restore health 명령어를 찾는 이를 위해 남겨둔다.
```shell
$ DISM /Online/Cleanup-image/Restorehealth
$ sfc /scannow
```