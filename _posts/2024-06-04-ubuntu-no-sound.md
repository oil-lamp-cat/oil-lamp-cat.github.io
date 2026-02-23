---
title: "Galaxy Book 3 Pro 360 소리 안나옴 문제"
date: 2024-06-04 14:43:15 +09:00
categories: [Linux]
tags: [ubuntu, error, 오류, 우분투, 소리]
pin: true
---

## Galaxy Book 3 Pro 360 사운드카드는 연결 되어있으나 소리 안나옴 문제 해결

현재 사용 노트북은 `window11`을 기본으로 탑제하고 있으며 `Ubuntu 22.04.4 LTS`를 grub 듀얼부팅으로 설치하였다

![소리는 나옴](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/22f2aa81-c471-4f61-abd9-a27b43cb52b7)

분명 사운드카드가 잡혀서 분명 소리가 나오지만 놀랍게도 실제로 컴퓨터에서 소리가 나오지 않는다

그래서 처음에는 

```
linux sound not work,
Ubuntu 22.04 sound card not working,
Ubuntu no sound,
dual booting sound not working,
sof-hda-dsp sound not working,
우분투 소리 안들림,
```

위와 같이 검색하여 찾아보았으나 아무리 찾아보아도 문제점을 찾지 못했다

하!지!만! 결국 이 문제는 `Galaxy book 3 pro`의 문제임을 알게 되었고 

[Speakers work in Galaxy Book 3 Pro 360 in linux but need this fix ](https://www.reddit.com/r/GalaxyBook/comments/14cgxvw/speakers_work_in_galaxy_book_3_pro_360_in_linux/)

위 사이트에서 [github issue](https://github.com/thesofproject/linux/issues/4055#issuecomment-1332331409)를 찾아 해결 할 수 있게 되었다.

## 해결 과정

일단 기본적으로 hda-verb packag인 alexmiter를 설치한다

[여기서 찾아 설치하면 된다](https://command-not-found.com/hda-verb)

나는 `sudo apt-get install alsa-tools`로 설치하였다

(보통은 설치되어있을 것이다)

그 후 [script](https://github.com/joshuagrisham/galaxy-book2-pro-linux/blob/main/sound/necessary-verbs.sh)이 스크립트를 다운로드 한 뒤 본인이 넣고 싶은 위치에 넣는다

나는 `/문서/script`파일로 옮겨넣었다

```
raen@seolhwa:~/문서/script$ ls
necessary-verbs.sh
```

그 후 실행시켜보면 

```
raen@seolhwa:~/문서/script$ sudo bash necessary-verbs.sh
```

이제 컴퓨터를 다시 시작해보면? 소리가 잘 나온다면 끝!

아니라면 다음 단계로 가면 된다

껐다가 켰을 때 안된다면 시작 프로그램을 등록해 주면 된다

```
crontab -e

맨 아래 줄에

@reboot <스크립트 위치>/necessary-verbs.sh
```

를 추가하여 시작프로그램 등록으로 해결할 수 있다

인 줄 알았는데 나는 실패했다


> 2026년 2월 23일 

댓글이 달려 다시 글을 확인하게 되었는데 최근엔 다양한 글들이 올라왔더라.

[From Silence to Sound: Fixing Audio on Ubuntu Linux on my Samsung Galaxy Book](https://dev.to/topzyray/from-silence-to-sound-fixing-audio-on-samsung-galaxy-book-running-ubuntu-linux-4kgc)

[Bad Samsung Support of Drivers on Linux Systems for the #GalaxyBook pro 360***](https://eu.community.samsung.com/t5/computers-it/bad-samsung-support-of-drivers-on-linux-systems-for-the/td-p/4706134/page/2)

[joshuagrisham/samsung-galaxybook-extras](https://github.com/joshuagrisham/samsung-galaxybook-extras)

위 글들을 참고하여 설정해주면 된다!

근데 난 우분투로 쓸 땐 딱히 소리가 필요없곤 했어서 정작 본인은 딱히 불편함을 느끼지 못했긴 했다.

그래도 댓글이 달렸다는게 뭔가 기분이 묘하다. 누군가에게 도움이 됬다니 기쁩니다~!

근데 나도 슬 한번 저거 설정을 해봐야겠다. 재밌을지도?

다만 이젠 ubuntu 버전이 올라가긴 했다. 물론 그래도 소리는 안 난다는... ㅎ