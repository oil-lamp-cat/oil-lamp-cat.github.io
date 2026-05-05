---
title: "[wargame] overthewire bandit 12 -> 13"
date: 2024-02-01 00:25:28 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

## Bandit Level 12 -> Level 13

**user_id** : bandit12<br/>
**password** : 7x16WNeHIi5YkIhWsfFIqoognUTyj9Q4

### 목표

![bandit12_13](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/bd856e0b-0860-41b0-84d5-a5b08b9c6387)

다음 레벨로 가는 비밀번호는 **여러번 압축된** `hexdump` 파일인 `data.txt`에 있다. 이번 레벨을 위해서는 `mkdir`을 이용해서 `/tmp` 디렉토리 아래 파일을 만들어서 문제를 푸는 것이 좋다. 예를들어: `mkdir /tmp/myname123`. `cp`명령어를 사용해서 datafile을 옮기고 `mv`명령어를 사용해서 이름을 다시 지어라.(manpage를 읽어봐!)

### 해결법

모르는 명령어가 몇개 더 추가되었군요. 한번 정리해 봅시다.

---

#### mkdir (make directory)

디렉토리(폴더)를 생성할 때 사용하는 명령어입니다.

> `mkdir [옵션] [생성할 디렉토리]`

예를 들어 `호롱고양이의 폴더`를 만든다고 해봅시다.

`mkdir lampcat_folder` 이렇게 명령어를 이용하면 현 위치를 Default(기본)으로 하여 지금 위치에 폴더를 만들게 됩니다.

그렇다면 이번에는 **/home/** 위치에 폴더를 생성한다고 해봅니다.

`mkdir /home/lampcat_folder` 이런식으로 폴더를 생성할 수 있다.

##### options (옵션)

- -m : 디렉토리를 생성할 때 권한을 설정합니다. (아직 이해가..)
- -p : 상위 경로도 함께 생성합니다. (위 예시에서 만약 `/home`경로가 없다면 추가적으로 생성하게 됩니다)
- -v : 디렉토리를 생성하고 생성된 디렉토리에 대한 메시지를 출력합니다.

---

#### cp (copy)

리눅스 혹은 유닉스 환경에서 파일 혹은 디렉토리를 복사할 때 사용합니다.

```shell
cp [옵션] [복사 대상 디렉터리or파일] [복사될 디렉터리or파일]
```

##### options (옵션)

- -r : 하위 디렉토리까지 모두 복사
- -i : 복사될 파일의 이름이 이미 존재한다면
- -v : cp 명령어를 수행하면서 복사 진행 상태를 출력한다.
- -f : 복사 파일이 이미 그 위치에 있다면 파일을 지우고, 강제로 복사한다.
- -p : 파일 혹은 디렉토리를 복사할 때 복사 대상의 소유자(계정), 그룹, 권한등의 정보까지 복사한다.

마지막 옵션 `-p`를 사용하게 되면 권한까지 복사하게 되므로 원래 `permission denied` 되던 문제를 해결하기 위해 우리가 mkdir로 폴더를 옮겨 작업하던 것이 의미 없게 된다!

---

#### mv (move)

> `mv [옵션] [원본 파일] [변경하려고 하는 대상, 대상의 위치]`

원래는 디렉토리를 이동시킬 때 사용하는 명령어이다.

##### options (옵션)

- -b : 이동시킬 파일이 이미 존재하면 백업 파일을 만든다.
- -i : 이동시킬 파일이 이미 존재하면 덮어쓰기 여부를 묻는다.
- -f : 이동시킬 파일이 이미 존재하면 강제로 덮어쓰기 한다.
- -n : 이동시킬 파일이 이미 존재하면 덮어쓰기 하지 않는다.
- -r : 하위 디렉토리까지 모두 이동한다.
- -v : 이동 진행상황을 출력한다.

그런데 우리는 이것을 이용하여 대상의 확장자를 변경하는 작업을 할 것이다.

---

이것만 있으면 될 줄 알았는데 압축을 해결하기 위해 추가적인 명령어가 필요했다.

#### xxd

파일 혹은 표준 입력으로부터 `hexdump`를 만들거나 복원해 주는 명령어로, 바이너리 형식에서 `hexdump`를 만들 수 있다.

> Hex dump?

hex dump는 램 또는 파일이나 저장장치에 있는 컴퓨터 데이터의 십육진법적인 보임새이다. 데이터의 hex dump를 보는 것은 주로 디버깅이나 리버스 엔지니어링의 한 부분이다. hex dump에서, 각 바이트는 2 숫자의 16진법 수로 표현된다.

라고 위키백과에서 말했다. 글로만 봐서는 무슨 말인지 이해가 안가 직접 `cat`명령어로 열어보기로 했다.

![bandit12_13_hexdump](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/a02f98f8-c948-4065-9a05-65871a64eb9b)

어우.. 이게 그 hex dump라는 것인 듯 하다. 나중에 `Hex dump`에 관해 좀 더 찾아봐야겠다.

그럼 이제 다시 xxd로 돌아와서 (일단은 쉬운 것만 적어놓겠다.)

- -i : C언어에서 사용가능한 형식으로 출력
- -E : 오른쪽 문자열을 ASCII에서 \*EBCDIC로 변경
- -r : 16진수 데이터를 바이너리 데이터로 변환
- -u : hex 를 소문자 대신 대문자로 출력

#### bzip2

`gzip`보다 높은 압축률을 갖는 압축방식을 사용한다.

- bzip2 압축 해제

```shell
bzip2 -d data.bz2
```

- bzip2 압축

```shell
bzip2 data.tar
```

- bzip2 압축 파일 정보 출력

```shell
bzip2 data.bz2
```

- bzip2 압축 파일 내용 출력

```shell
bzcat data.bz2
```

#### gzip

`gzip`은 60~70%의 압축률을 갖습니다. `.gz`, `.tar`, `.bz2`에 관한 내용은 좀 더 찾아봐야겠다.

- gzip 압축 해제

```shell
gzip -d data.gz
```

- gzip 압축

```shell
gzip data.tar
```

- gzip 압축 파일 정보 출력

```shell
gzip -l data.gz
```

- gzip 압축 파일 내용 출력

```shell
zcat data.gz
```

---

#### tar (Tape Archive)

여러 파일을 하나의 파일로 묶어주는 명령어이다.

압축을 해주는 명령어인 `gzip`, `bzip2`와 다르게 `tar`명령어는 단순히 파일을 하나로 묶는 명령어이다. 하지만 여러 옵션을 추가하여 압축까지 가능하게 해준다.

- -c (create) : 파일을 하나로 합친다.
- -v (verbose) : `tar`의 과정을 보여준다.
- -f (file) : 압축파일의 이름은 지정해준다.
- -x (extract) : 압축을 해제한다.
- -z (gzip) : `gzip`형태로 압축한다. (.gz)
- -j (bzip2) : `bzip2`형태로 압축한다. (.bz2)
- -t (list) : 파일의 리스트를 확인할 수 있다.

---

그럼 이제 정말로 비밀번호를 찾아보자.

![bandit12_13_1](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/de13c208-2fa4-4875-930f-018eb64cd919)

아까 했던대로 `data.txt`파일을 열어보자 hex dump파일이 나온다.

그리고 그 파일을 `xxd` 명령어를 풀어보면?

![bandit12_13_2](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/6c997608-9d17-489b-95d6-62f7a43f64f2)

아.. permission denied 접근 권한 없음 오류가 나온다. 그리고 우리는 사실 이 오류를 예상했었다. 바로? 목표에서!

`mkdir`명령어와 `cp`명령어를 이용해서 디렉토리를 만들고 파일을 복사해서 문제를 풀어보라고 한다. `cp` 명령어를 사용 할 때에 `-p` 명령어가 권한까지 복사하는 것을 보아 그냥 `cp` 명령어를 사용하였을 때에 권한이 복사되지 않기에 변경할 수 있는 것으로 보인다.

`mkdir`명령어를 사용해서 `lampcat`이라는 디렉토리를 만들면?

![bandit12_13_3](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/023b9952-54af-47fb-8127-66841620428c)

아까 테스트 해 본다고 디렉토리를 만들었었더니 아직 서버에 남아있는 듯 하다. 그럼 다른 이름으로 시도해 보면 된다.

![bandit12_13_4](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/f1a65e2d-b527-4530-af2c-03ad849e2224)

이번에는 디렉토리를 만드는데 성공했다. `cp`명령어로 만들어둔 디렉토리에 data.txt를 복사한 뒤 `xxd`명령어로 바이너리 데이터로 되돌려보자.

![bandit12_13_5](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/16634f27-9001-42f0-9c11-409bc8cb3bf5)

보아하니 `data`라는 파일이 복원된 파일이다. file 명령어로 `data`의 상태를 읽어보니 `gzip`의 형태로 압축되어있다고 한다.

```shell
bandit12@bandit:/tmp/oillampcat$ file data
data: gzip compressed data, was "data2.bin", last modified: Thu Oct  5 06:19:20 2023, max compression, from Unix, original size modulo 2^32 573
```

그렇기에 우리는 `data`파일을 `mv`명령어를 사용하여 `.gz`형태의 확장자로 바꿔준 뒤 압축을 해제할 것이다.

![bandit12_13_6](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/552a4b64-e82b-4dad-9f19-148315d56913)

그리고 돌고돌아 다시 `data`파일을 마주하였다. 그리고 이번에는 bzip의 형태로 되어있다고 한다. 그럼 또 풀어야겠지?

![bandit12_13_7](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/e30dc8bb-1c1b-492f-93ad-7566431b022c)

`mv`명령어로 bz2확장자로 변경하고, `bzip2`명령어로 압축 해제하면 또또 `data`파일은 만나게 된다.

![bandit12_13_8](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/ed6a1341-c251-46f0-9d02-d58be2557ef9)

그렇게 한번 더 `gzip`형태를 풀게되면, 이번에는 `tar`형식으로 압축되어있다고 한다.

![bandit12_13_9](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/addece31-c3d5-4665-90f6-da78920e8771)

`tar`로 압축된 `data`파일은 이번에는 `tar`명령어의 `-x (압축해제)`, `-v(압축 과정 출력)`, `-f(압축파일 이름 지정)` 옵션을 이용해 풀어주었다.

![bandit12_13_10](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/029256c9-3d9c-4f18-85fe-65e722a770c8)

이번에는 웬일로 확장자를 붙인 채로 `data5.bin`이라는 이름을 갖고 압축이 해제되었다.

![bandit12_13_11](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/e6204f24-b442-4832-bdd0-0f1a88bc3a76)

이제 이 data5.bin 파일을 읽어보면? 또다시 `tar`압축이 되어있다고 한다.

![bandit12_13_12](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/01ed1050-7d63-4180-a2fd-b5f8a43a3234)

다시 한번 풀어주고 이제는 반복일 뿐이다.

![bandit12_13_13](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/d2eb025f-395c-44c7-a151-315891da7b39)

같은 이름이지만 `file`명령어로 읽어봤을 때에 압축된 방법이 다른 `data8.bin`파일이다.

![bandit12_13_14](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/36e2bcde-2dc4-47e9-b7b1-dd20f4a5fd21)

드디어 비밀번호를 찾을 수 있었다. 확장자는 `.bin`이지만 `file`명령어로 읽어보면 `ASCCI` 텍스트로 이루어져 있다는 것을 알 수 있다.

![bandit12_13_15](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/8e78ddcc-71fb-46f2-bd70-9d420c431176)

비밀번호 : `FO5dwFsc0cbaIiH0h8J2eUks2vdTDwAn`
