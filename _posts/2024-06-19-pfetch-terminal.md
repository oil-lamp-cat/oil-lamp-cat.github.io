---
title: "[Ubuntu] terminal에 pfetch 실행하기"
date: 2024-06-19 18:28:15 +09:00
categories: [Tools & Environment]
tags: [Linux, Terminal, 커스터마이징]
pin: true
---

![스크린샷 2024-06-19 18-29-25](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/55e30792-f277-48c4-a0d8-dfc02973a4c8)

난 고양이를 무척 좋아한다

그리고 내 노트북 환경을 꾸미던 중 [Catppuccin](https://github.com/catppuccin)을 발견하여 이쪽 테마가 되게 보기 편해서 여러 설정을 하던 중이였다

분명 terminal설정을 바꿨는데 고양이가 보이지 않았던 것이다...

여기저기 찾아다녀본 결과 이것은 `pfetch`라는 것을 이용하여 실행한 것이였다

그렇다면 pfetch를 설치하는 방법은?

간단하게 make 파일을 만들었다

```make
PREFIX ?= /usr

all:
        @echo RUN \'make install\' to install pfetch

install:
        @install -Dm755 pfetch $(DESTDIR)$(PREFIX)/bin/pfetch

uninstall:
        @rm -f $(DESTDIR)$(PREFIX)/bin/pfetch
```

pfetch 파일은 [pfetch](https://github.com/unseen-ninja/pfetch/blob/main/pfetch)에서 가져오고 원래는 브라우저 마다 나오는 모습이 다르지만 나는 catppuccin테마를 원했기에 전부 지우고 catppuccin 테마의 고양이만 남겼다

혹시몰라 여기 저장한다 [디스코드 링크](https://discord.com/channels/882162361643986984/1252916468861894728/1252916543936008192)



```bash
        ([Uu]buntu*)
            read_ascii 2 <<-EOF
                ${c6}
                ${c6}
				${c6}       へ
				${c6}     （• ˕ •マ
				${c6}       |､  ~ヽ
				${c6}       じしf_,)〳‎‎
			EOF
        ;;
```

터미널에 계속 나오게 하기 위해 `nano ~/.bashrc` 을 하고 그 파일의 맨 마지막줄에 `pfetch`를 추가해 주면 끝이다