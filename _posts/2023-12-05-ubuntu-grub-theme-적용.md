---
title: ubuntu grub에 테마를 적용하기
date: 2023-12-05 15:24:15 +09:00
categories: [System & Linux]
tags: [Linux, Ubuntu, 커스터마이징]
pin: true
---

## GRUB?

GRUB(Grand Unified Bootloader)

GNU프로젝트의 부트로더로 컴퓨터를 켰을 때 가장 먼저 실행되는 프로그램이다. GRUB 메뉴에서 부팅할 커널(os)를 선택하거나 메뉴 항목을 수정해 부팅방법을 변경할 수 있다.

### 왜 테마를 적용시키려 하는가?
리눅스(특히 아래 사진은 ubuntu)를 처음 키게 되면 다음과 같은 화면이 반겨준다. 
![grub](https://github.com/catppuccin/grub/assets/103806022/823d8aaa-e2e1-4a68-bbc5-85e9b0d02ac6)

하지만 너무 딱딱해 보이고 어떻게 하면 grub을 꾸밀 수 있을까 하는 생각에 한번 테마를 적용시켜보기로 하였다.

## 테마 선택
grub 테마를 선택할 때에는 자신이 원하는 테마로 고르면된다. 아래는 내가 찾은 몇가지 사이트이다.
* [GNOME-LOOK GRUB 최신부터](https://www.gnome-look.org/browse?cat=109&ord=latest)
* [GNOME-LOOK GRUB 점수별](https://www.gnome-look.org/browse?cat=109&ord=rating)
* [catppuccin의 grub](https://github.com/catppuccin/grub)
* [vinceliuice의 grub2-themes](https://github.com/vinceliuice/grub2-themes)

나는 catppuccin의 grub테마가 좋아서(고양이 최고) archlinux의 grub과 ubuntu의 grub에 적용하였다.

## 테마 적용(archlinux등 대부분의 리눅스)
이 글은 내가 처음 리눅스를 써보면서 성공한 것을 적은 것이고 이미 리눅스를 잘 다룬다면, github에 있는 글만 보고 적용할 수 있을 것이다.

[catppuccin](https://github.com/catppuccin/grub)에 들어가보면 아래에 모든 명령어들이 있기에 사실 그대로 따라하면 된다.

1. repository를 로컬 폴더로 clone한다.
```shell
git clone https://github.com/catppuccin/grub.git && cd grub
```

2. 로컬폴더의 src에 있는 테마를 리눅스 grub의 themes폴더로 옮긴다.
```shell
sudo cp -r src/* /usr/share/grub/themes/
```

3. grubtheme설정을 해준다.(vim 편집기를 사용할 시)
```shell
sudo vim /etc/default/grub
```

4. 그 후 GRUB_THEME=을 찾아준다. 없다면 만든다.(아래는 Mocka 테마)
```shell
GRUB_THEME="/usr/share/grub/themes/catppuccin-mocha-grub-theme/theme.txt"
```

5. grub 설정을 저장해준다.
```shell
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

## 테마 적용(우분투)

우분투는 grub의 위치가 다르고 굳이 명령어를 이용하지 않고 Grub-customizer를 이용해 적용할 수 있다.

### grub costomizer 설치
```shell
sudo apt update
sudo apt upgrade

sudo add-apt-repository ppa:danielrichter2007/grub-customizer
sudo apt update
sudo apt install grub-customizer
```

### grub customizer 사용하기
grub customizer는 이제 ubuntu의 앱 목록에 있을 것이다.

자동으로 다운로드한 테마가 뜨게 하려면
```shell
sudo cp -r src/* /boot/grub/themes/
```
이제 아래와 같이 보이게 될 것이다.
![스크린샷 2023-12-05 16-02-23](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/8b85b3a8-0e81-4d27-8fb7-ee0c118ebe9f)

### 설명

>환경설정 목록

여기서 우리는 어떤 os가 위에서 보이게 될지 설정하는 장소이다.
![스크린샷 2023-12-05 16-03-51](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/5ffe6049-2fbe-4767-965f-7281a34196fd)

>일반설정

기본 항목 : grub을 키면 마우스가 어떤 os를 선택할 것인가
- 미리 정의된 : first entry(가장 위에있는 os)
- 이전에 부팅된 항목 : 이전에 부팅된 os

가시성
* 매 ?초마다 기본 항목을 부팅합니다 : 자동으로 선택된 os부팅까지 카운트다운

![스크린샷 2023-12-05 16-04-09](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/3ca9595f-a250-44ba-b216-934cf201a5d0)

>외관 설정
여기서 이제 theme과 해상도를 설정할 수 있다.
![스크린샷 2023-12-05 16-04-57](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/3af05705-a19f-4488-aec7-b706a9bf6cfd)

왼쪽에 나오는 테마내용 안에 있는 파일들을 다른 이미지로 꾸밀 수 있다.
![스크린샷 2023-12-05 16-05-18](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/1cb5b836-6293-4e16-a77d-eb1872740765)



## 추가 사항
```shell
sudo vim /etc/default/grub
```
GRUB의 해상도를 바꾸고자 한다면 아래와 같이 변경해준다.
```shell
GRUB_GFXMODE={해상도}
```

GRUB상에서 다른 os(dualboot인 나의 노트북에서는 window, ubuntu, archlinux)가 보이지 않는다면
```shell
GRUB_DISABLE_OS_PROBER=false
```