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

우분투 os 버전 : Ubuntu 24.04.2 LTS

커널 버전 : 6.8.0-55-generic

윈도우 os 버전 : 

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