---
title: "[Ubuntu] 디스크 마운트 안되는 문제, (wrong fs type, bad option, bad superblock on /dev/nvme0n1p*, missing codepage or helper program, or other error)"
date: 2025-3-31 10:31:15 +09:00
categories: [Ubuntu]
tags: [error]
pin: true
---

## wrong fs type, bad option, bad superblock on /dev/nvme0n1p*, missing codepage or helper program, or other error

![Image](https://github.com/user-attachments/assets/76287898-48c7-49a3-b571-b6fd8666db91)

## 버전

우분투 os 버전 : `Ubuntu 24.04.2 LTS`

커널 버전 : 6.8.0-55-generic

윈도우 os 버전 : `Windows 11 Home 24H2`

os 빌드 : 26100.3476

## 문제

내 컴퓨터는 기본은 windows가 설치되어있지만 grub을 이용하여 우분투를 듀얼부팅으로 사용하고 있는 중이다

어제까지만 해도 정말 아무 문제 없이 잘 사용하고 있었다

헌데 어제 동아리 활동을 위해 윈도우에 docker를 설치한 것이 문제인 것일까, 윈도우 업데이트를 한 것이 문제일까..

우분투에서 윈도우 파티션을 마운팅 하려 하니 다음과 같은 문제가 발생했다

```
wrong fs type, bad option, bad superblock on /dev/nvme0n1p4, missing codepage or helper program, or other error
```

음.. 혹시 하여 다른 파티션도 마운팅을 시도했다

```
wrong fs type, bad option, bad superblock on /dev/nvme0n1p3, missing codepage or helper program, or other error
```

될리가 없지..

## 해결 과정

일단 정확한 문제를 위해 로그를 찍어보자

```cmd
raen@seolhwa:~$ sudo journalctl -f
```

컴퓨터에서 일어나는 모든 로그를 띄우게 될 텐데 뭐 필요하다면 `grep` 명령어를 이용하여 원하는 부분만 출력하게 해도 된다

```cmd
 3월 31 10:52:58 seolhwa kernel: ntfs3: nvme0n1p4: It is recommened to use chkdsk.
 3월 31 10:52:58 seolhwa kernel: ntfs3: nvme0n1p4: volume is dirty and "force" flag is not set!
 3월 31 10:52:58 seolhwa gnome-shell[2544]: error: Failed to mount “Rs Workspace”: Error mounting /dev/nvme0n1p4 at /media/raen/Rs Workspace: wrong fs type, bad option, bad superblock on /dev/nvme0n1p4, missing codepage or helper program, or other error
 3월 31 10:52:58 seolhwa gnome-shell[2544]: Impossible to mount removable Rs Workspace: Gio.IOErrorEnum: Error mounting /dev/nvme0n1p4 at /media/raen/Rs Workspace: wrong fs type, bad option, bad superblock on /dev/nvme0n1p4, missing codepage or helper program, or other error
                                             
                                             Stack trace:
                                               _promisify/proto[asyncFunc]/</<@resource:///org/gnome/gjs/modules/core/overrides/Gio.js:453:45
                                               @resource:///org/gnome/shell/ui/init.js:21:20
                                               ### Promise created here: ###
                                               launchAction@file:///usr/share/gnome-shell/extensions/ubuntu-dock@ubuntu.com/locations.js:632:35
                                               makeLocationApp/<@file:///usr/share/gnome-shell/extensions/ubuntu-dock@ubuntu.com/locations.js:1068:26
                                               _create/object[name]@file:///usr/share/gnome-shell/extensions/ubuntu-dock@ubuntu.com/utils.js:326:37
                                               _rebuildMenu/<@file:///usr/share/gnome-shell/extensions/ubuntu-dock@ubuntu.com/appIcons.js:1114:38
                                               activate@resource:///org/gnome/shell/ui/popupMenu.js:195:14
                                               _init/<@resource:///org/gnome/shell/ui/popupMenu.js:112:24
                                               @resource:///org/gnome/shell/ui/init.js:21:20
```

오.. 대부분 무슨 소리인지는 잘 모르겠으나 첫 줄에서 `chkdsk`를 실행하라고 한다

일단은 전문을 챗gpt에 물어보도록 하자

![Image](https://github.com/user-attachments/assets/05e30496-4fb7-4247-a241-87617d5711a8)

음.. 그러니까 파일이 손상되었다는거네?

아... 이렇게 되면 window로 넘어가보자

### chkdsk D: /f /r 실행하기

```
  C:\Windows\System32>chkdsk D: /f /r
  파일 시스템 유형은 NTFS입니다.

  다른 프로세스가 볼륨을 사용 중이기 때문에 Chkdsk를 실행할 수 없습니다.
  이 볼륨을 우선 분리하면 Chkdsk를 실행할 수 있을 것입니다.
  그러면 이 볼륨에 대해 열린 모든 핸들을 사용할 수 없습니다.
  이 볼륨에서 분리하도록 하시겠습니까(Y/N)? Y

  볼륨을 분리했습니다. 이 볼륨에 대해 열린 모든 핸들을 이제 사용할 수 없습니다.
  볼륨 레이블은 Rs Workspace입니다.
  1단계: 기본 파일 시스템 구조 검사...
  266240개의 파일 레코드가 처리되었습니다.
  파일 검증 작업을 완료했습니다.
  단계 기간(파일 레코드 검증): 2.00 초.
  165개의 큰 파일 레코드가 처리되었습니다.
  단계 기간(연결 없는 파일 레코드 복구): 18.68 밀리초.
  0개의 잘못된 파일 레코드가 처리되었습니다.
  단계 기간(잘못된 파일 레코드 확인): 0.69 밀리초.
  
  2단계: 파일 이름 연결 검사...
  606개의 재분석 레코드가 처리되었습니다.
  312878개의 인덱스 항목이 처리되었습니다.
  색인 검증 작업을 완료했습니다.
  단계 기간(인덱스 검증): 4.32 초.
  CHKDSK가 원래 디렉터리에 다시 연결하기 위해 인덱싱되지 않은 파일을 검색하고 있습니다.
  5개의 인덱싱되지 않은 파일이 검색되었습니다.
  0개의 인덱싱되지 않은 파일이 원래 디렉터리로 복구되었습니다.
  단계 기간(고아 재연결): 96.04 밀리초.
  CHKDSK가 인덱싱되지 않은 나머지 파일을 복구하고 있습니다.
  5개의 인덱싱되지 않은 파일이 손실 및 찾기로 복구되었습니다.
  손실 및 찾기는 \found.000에 있습니다.
  단계 기간(손실 및 찾기로 고아 복구): 18.35 밀리초.
  606개의 재분석 레코드가 처리되었습니다.
  단계 기간(재분석 지점 및 개체 ID 검증): 4.25 밀리초.
  
  3단계: 보안 설명자 검사...
  보안 설명자를 검증했습니다.
  단계 기간(보안 설명자 검증): 0.93 밀리초.
  23319개의 데이터 파일이 처리되었습니다.
  단계 기간(데이터 특성  검증): 0.47 밀리초.
  
  4단계: 사용자 파일 데이터에서 잘못된 클러스터 찾기...
  266224개의 파일이 처리되었습니다.
  파일 데이터를 검증했습니다.
  단계 기간(사용자 파일 복구): 5.22 분.
  
  5단계: 잘못된 가용 클러스터 찾기...
  61199168개의 사용 가능한 클러스터가 처리되었습니다.
  빈 공간을 검증했습니다.
  단계 기간(사용 가능한 공간 복구): 49.23 초.
  마스터 파일 테이블(MFT)에 있는 비트맵 특성의 오류를 고칩니다.
  [볼륨 비트맵]에 있는 오류를 고칩니다.
  
  Windows에서 파일 시스템을 수정했습니다.
  더 이상 작업이 필요하지 않습니다.
  
  전체 디스크 공간:  396925936KB
  151720168KB (224904개 파일)
  색인 23323개:      63912KB
  잘못된 섹터:          0KB
  시스템 사용:     345184KB
  로그 파일이      65536KB가 되었습니다.
  사용 가능한 디스크 공간:  244796672KB
  각 할당 단위:       4096바이트
  디스크의 전체 할당 단위 개수:   99231484개
  디스크에서 사용 가능한 할당 단위 개수:   61199168개
  전체 기간: 6.15 분(369345 밀리초).
```

오! 뭔가 문제가 있었고 심지어 파일 3개를 복구했다고 한다!

## 해결

정말로 해결이 되었는지 우분투로 넘어가 확인해보자

![Image](https://github.com/user-attachments/assets/d54993ae-045c-4ed5-8d64-299a5b99be7d)

성공이다!

그럼 복구 되었다는 파일은 뭘까?

`found.000/dir0000.chk`에 있다고 한다

![Image](https://github.com/user-attachments/assets/6af48621-8432-450f-9c52-3c95f097f362)

![Image](https://github.com/user-attachments/assets/7a5141ba-da4a-4fe3-9ad4-f3c08ac1084b)

![Image](https://github.com/user-attachments/assets/c7e450df-1f27-4736-a526-1d2f6bb3a734)

![Image](https://github.com/user-attachments/assets/4a238bd6-add2-46c3-8dcb-ec3212d123be)

![Image](https://github.com/user-attachments/assets/949a98d4-8945-49ab-83ad-6ac18cbd03a1)

음... 딱히 필요한 것들은 아니고 그냥 이미지 몇장이였다

그대로 휴지통에 들어가면 될 것이고 드디어 다시 작업을 할 수 있게 되었다

와 진짜 처음에 오류를 마주했을 때는 아무것도 안했는데 뭐가 문제인거지? 싶은 생각에 식겁했는데 일단 해결할 수 있어서 정말 다행이다

혹시 내가 윈도우 업데이트 중에 노트북을 끈 적이 있어서 생긴 문제인걸까?

아니면 정말로 도커 설치에 의해 생긴 문제일까?

이번일은 추가적으로 문제를 구현해보지 않는 한 문제를 알아내기는 무리일 듯 싶다

일단 해결!