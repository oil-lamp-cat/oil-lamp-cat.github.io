---
title: "[Red Racoon Academy] 일단 따라하는 모의해킹 2 - Robots"
date: 2024-06-04 14:43:15 +09:00
categories: [Security & Hacking]
tags: [CTF, 모의해킹, Linux, Red Raccoon]
pin: true
---

## 보너스 문제 - 파일시스템 어딘가에 숨겨져 있는 두번째 플래그

``` sh
┌──(kali㉿kali)-[~]
└─$ ssh secret@10.10.166.138
```
로 접속한다

![ssh connected](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/1bc16986-615a-4ae5-b936-d7b1df274a72)


위와 같은 화면이 나왔을 때 나는 당연히 전 영상에서 flag.txt에 플래그가 있었기에 같은 이름으로 있을 것이라고 생각한 뒤 `find / -name "flag.txt"` 로 찾아보려 했었다

헌데 순간 수많은 `permission denied`를 만나게 되었다

![ssh permission denied](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/4f3955e6-191b-4cff-8812-c317bddbabbf)

그럼 `permission denied`를 제외한 문구만 뜨면 되지 않을까? 하는 생각을 하여 

``` sh
$ find / -name "flag.txt" 2>/dev/null
```
명령어로 표준 에러 `2`를 출력하지 않게 되는 방식을 사용하여 검색해 보았다

![ssh without permission denied](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/db579a17-17c2-47a8-8593-1b09d6064166)

그러나 이번에는 아예 아무 결과도 나오지 않았다

음... 아무래도 두번째 플래그의 이름은 `flag.txt`가 아닌 듯 하다

그렇다면 다른 힌트를 찾아보도록 하자

`ls -al`명령어로 상세보기를 해보자

``` sh
$ ls -al
total 40
drwxr-xr-x 4 secret secret 4096 Mar 11  2023 .
drwxr-xr-x 3 root   root   4096 Mar 11  2023 ..
lrwxrwxrwx 1 secret secret    9 Mar 11  2023 .bash_history -> /dev/null
-rw-r--r-- 1 secret secret  220 Apr  4  2018 .bash_logout
-rw-r--r-- 1 secret secret 3771 Apr  4  2018 .bashrc
drwx------ 2 secret secret 4096 Mar 11  2023 .cache
drwx------ 3 secret secret 4096 Mar 11  2023 .gnupg
-rw-r--r-- 1 secret secret  807 Apr  4  2018 .profile
-rwxrwxrwx 1 root   root     88 Mar 11  2023 .roothint.lmao
-rw------- 1 secret secret    1 Mar 11  2023 .viminfo
-rw------- 1 secret secret  118 Mar 11  2023 .Xauthority 
```

보아하니 `.roothint.lmao`라는 이름의 파일이 숨겨져 있는 것을 확인해 볼 수 있었다

```sh
$ cat .roothint.lmao
how did you get in here? Bet you won't find the secret file though.  <  secrets.txt  > 
```

아 역시 두번째 플래그 파일의 이름은 `secrets.txt`였던 것이다

``` sh
$ find / -name "secrets.txt" 2>/dev/null      
/etc/apache2/secrets.txt
```

두번째 플래그는 `/etc/apache2/secrets.txt` 위치에 있었다

``` sh
$ cat /etc/apache2/secrets.txt
GROOT{WELCOME_TO_THE_HONEYPOT_WE_ARE_GOING_TO_GET_YOU}
```

두번째 플래그는? `GROOT{WELCOME_TO_THE_HONEYPOT_WE_ARE_GOING_TO_GET_YOU}`이다