---
title: "[HTB] Conversor (Easy_Linux)"
date: 2025-11-21 13:57:43 +09:00
categories: [hacking, saturnx operators, Linux]
tags: [Hack The Box]
pin: true
password: "11211847"
---

[Congratulations OilLampCat, best of luck in capturing flags ahead!](https://labs.hackthebox.com/achievement/machine/988787/787)

[HTB_Conversor_호롱고양이.pptx](https://github.com/user-attachments/files/23723876/HTB_Conversor_.pptx)

## 시작에 앞서

![key bind](https://github.com/user-attachments/assets/a45d3bf1-fcfd-4271-91a0-0f06a0fafa8e)

블로그를 작성하는데 자꾸 github에 올렸다가 그거 링크 복사해서 붙여넣기 하고`![]()`이거 넣고 하는데 시간 소요가 생각보다 더 되는 듯 하여 아예 키세팅을 넣었다.

`ctrl + shift + p`를 누른 후 `Preferences: Open Keyboard Shortcuts (JSON)`에 들어가 위 코드를 넣어주면 된다. 심지어 지금 설정을 넣고 나면 마우스 포인터가 `[]`안에 들어갈 수 있게 설정하여 매우매우 편해졌다는 것!

그럼 이제 다시 문제로 돌아가서.

![outbound start](https://github.com/user-attachments/assets/35b8c894-6070-4d4d-bc22-0e8d92e5d59f)

이번엔 다시 돌아온 linux 머신이고 또 한번 active 머신이다. 그리고 평소와 비슷하게 이번에는 계정 정보가 없다.

![active](https://github.com/user-attachments/assets/3a551ae9-8400-4607-bdba-446fada8e10d)

일단 시작!

## 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap](https://github.com/user-attachments/assets/1f28ee0e-20c0-465c-bfef-6257cfee755a)

어... 결과가... 보통 있는 `ssh/22`와 `http/80`번 포트 밖에 없다.

이렇게 되면 이제 `/etc/host`파일에 링크를 넣고 직접 들어가 확인해보는 수 밖에.

## 초기 침투 (Initial Foothold / Exploitation)

![login?](https://github.com/user-attachments/assets/e768ccae-20c3-404b-803b-fc27cc2b17f3)

어쩨 들어가봤더니 login 페이지만 뜬다. 뭐.. 계정도 없으니 아마 지금 상황이 정상인 것이라.

![register](https://github.com/user-attachments/assets/a9e23149-b7ee-4940-bb2a-498c639f1c09)

회원가입의 기능도 있으니 이것을 이용하여 들어가야겠다.

![after login](https://github.com/user-attachments/assets/db203db8-66c7-4631-bc89-e3a5682bfbae)

음...

```
우리는 Conversor입니다. Nmap으로 대규모 스캔을 하고 결과를 좀 더 예쁘게 보고 싶었던 적이 있나요? 우리에게 해결책이 있습니다! XML 파일과 XSLT 시트를 업로드하기만 하면 더 미적인(aesthetic) 형식으로 변환해 줍니다. 원하신다면 우리가 개발한 템플릿을 다운로드할 수도 있습니다.
```

사용자가 XML 파일과 XSLT 파일을 업로드하면, 서버가 이를 처리해 보기 좋은 형태로 바꿔준다는데, 일단 그 전에 XML과 XSLT가 뭘까?

- XML (Extensible Markup Language)

데이터를 구조화해서 저장하는 텍스트 파일로 HTML과 비슷하게 태그(<>)를 사용하지만 디자인이 아닌 데이터를 저장한다.

- XSLT (Extensible Stylesheet Language Transformations)

XML 문서를 다른 형식(HTML, Text, 다른 XML 등)으로 변환하는 언어로 XML 데이터를 가져와서 "이 태그의 데이터는 빨간색 제목으로 보여줘"와 같이 명령을 내리게 된다.

찾아보니 XML로는 뭔가 할 수 있는 것이 딱히 없어보이고 다만 XSLT를 이용한 `Server-Side XSLT Injection`이 가능하다는 것을 확인했다.

![예제 템플릿1](https://github.com/user-attachments/assets/fbf0ce99-5115-4b3b-b2d6-5f23aa85012e)

![예제 템플릿2](https://github.com/user-attachments/assets/06ea6b39-b286-4c9a-a6c0-87d5124d5832)

`Download Template`을 이용해 예제 템플릿을 다운 받아봤다.

![테스트](https://github.com/user-attachments/assets/3dc30120-bcf0-4db1-a7a8-663517e54d88)

그리고 그걸 내 입맛대로 꾸미고 xml 파일은 빈걸 넣어보니.

![not working](https://github.com/user-attachments/assets/696669df-5a5d-4efa-a58d-a950771a175b)

엑.. 뭔가 안 된다.

![about](https://github.com/user-attachments/assets/afde115f-f554-4b8b-a832-4dde6aab9f9e)

내가 뭔가 더 찾아보지 않은 것이 있나 하여 페이지를 더 둘러보다 `About` 페이지에서 `Download Source Code`를 찾았다. 이래서 `Enumeration`을 확실히 해야하나보다.. 

![why?](https://github.com/user-attachments/assets/81aa6484-62b6-424c-8385-d86081e7c9de)

어... 소스코드가 압축 해제가 안되네? 왜요?

![낚였다!](https://github.com/user-attachments/assets/ad5df7a1-e172-4cd8-89d8-7fbd2db617aa)

아닛 압축이 안되어있는 파일이네?

명령어에서 `z`를 빼면 된다.

![didit](https://github.com/user-attachments/assets/ff5809ed-4aea-4b7a-9ac0-5da94d02d281)

짜잔 드디어 소스코드를 분석할 수 있게 되었다.

![app.py](https://github.com/user-attachments/assets/47fa68c6-6053-4338-8d4d-daec0dfe742c)

가장 중요해보이는 app.py를 뜯어보니 flask로 만들어졌다.

![convert](https://github.com/user-attachments/assets/b116b534-347a-4566-9add-3d16730aef26)

게다가 convert부분을 들어가보니 위에서 생각한 대로 XML부분은 `resolve_entities`와 같은 설정이 되어있지만 `xslt`는 전혀 그런 설정이 없음이 확인되었다. 

그리고 어쩌면 이건 나도 확실치 않다만 php가 아니라 `python`으로 명령을 내려야 할수도?

![install.md](https://github.com/user-attachments/assets/c48bcf74-438c-490f-bb67-164a12016eb2)

게다가 `install.md`를 읽어보니 `/var/www/conversor.htb/scripts/`에 `*.py`를 실행시켜주는 cron이 돌고있다고 한다. 이거군!

그럼 이제 다시 정리해서 공격 방식은 다음과 같을거다.

1. 스파이 만들기 (내 컴퓨터에서 피해자로 넘어갈 리버스 쉘)
2. xslt파일을 업로드해 피해자가 내 컴퓨터에서 리버스 쉘을 가져가도록 유도
3. 리버스쉘 접속 성공!

이렇게 진행된다.

![1_reverse sehll](https://github.com/user-attachments/assets/a697c8b5-a4eb-42e2-b60a-e77783873591)

리버스 쉘(스파이)를 만들고.

![take it](https://github.com/user-attachments/assets/90458cff-3f8a-46cf-9d90-5a24ee34f8fd)

스파이를 가져갈 수 있도록 xslt파일을 만든 후.

![put xslt](https://github.com/user-attachments/assets/ce004b27-2ae3-457d-805f-b281d991dae1)

파일을 업로드 하면... 이거 실제로 혹시 해서 5분 기다려봤는데 안 된다. 애초에 cron 설정이 1분 단위이기도 해서 당연히 그정도 기다려서 안되면 안 되는거다.

그래서 뭣이 문제일까 찾아보니. 세상에 xslt의 `import os`와 같은 부분을 보면 앞에 띄어쓰기가 되어있지 않은가? 저걸 없애야 한다. 그 띄어쓰기 덕에 문제가 생기는 상황이라는 것!

![get reverse shell](https://github.com/user-attachments/assets/5d71c91c-92ac-4d43-b643-be24a3a00272)

리버스 쉘 획득 성공!

인데... 뭔가 더 쉬운 방법이 없을까 해서 찾아보니.

![base64](https://github.com/user-attachments/assets/972688e7-58b3-4ba5-ad5e-0bd3c95af4d0)

애초에 xslt파일을 통해 base64로 디코딩된 리버스쉘을 넘겨주면 되는거였다.

내가 이걸 왜 생각 못했지? 배고파서 그런가?

![fismathack](https://github.com/user-attachments/assets/0b4e36f7-f987-44d9-876e-61fcc821b7f2)

보아하니 `fismathack`이라는 유저를 얻는게 이번 userflag를 위한 길인듯 한데 아까 찾았던 파일 중에 db파일이 있었으니 이걸 찾아가보자.

![db](https://github.com/user-attachments/assets/a4f18a97-0127-4e97-8002-1dfc28b1e619)

여기도 여전히 db가 있으니 이제 sql로 연결해보자.

![sqlite3](https://github.com/user-attachments/assets/9f5a5c31-fe73-4344-9ca5-6449436ce89c)

게다가 코드를 보아하니 sqlite3가 설치되어있다는 것을 알 수 있었다.

![dumshell](https://github.com/user-attachments/assets/ac435c07-28aa-45cc-bd9a-9ffa134dcbf4)

이거 왜 또 안되나 하고 가만히 있었는데 저번과 동일하게 덤쉘이여서 그런 것 같은디...

![tty](https://github.com/user-attachments/assets/fefc4827-ac20-4eed-8f1a-7d633210c50d)

정답이었다! 그럼 이제 db를 읽어볼까?

![이번엔 왜?](https://github.com/user-attachments/assets/69ad0991-caf7-47de-89fc-51f62a2c8b08)

이번엔 또 table이 비어있다고 하기에 왜인가 했더니, gemini왈 내가 지금 있는 위치에는 `users.db`가 없기에 빈 db를 만든거라고 한다.

![찾았다](https://github.com/user-attachments/assets/41f6e492-b0ce-4597-877f-9eee02605772)

이제야 제대로된 db를 찾았다. 보아하니 `나`인 `oillampcat`과 다른 유저들이 보이는데 그 중에 아까 찾고자 했던 유저인 `fismathack`의 계정이 보인다.

![crack station](https://github.com/user-attachments/assets/43a12bc4-a48a-4a2b-8530-62d6a8f03657)

이걸 크래킹 할 때에 `hashcat`이나 `john the ripper`를 이용해도 되겠지만 난 그냥 인터넷에서 크래킹을 진행하기로 했다. md5였네.

![user.txt](https://github.com/user-attachments/assets/4e8a087f-7df0-4f82-8d16-42457dea918f)

잡았으!

![own user flag](https://github.com/user-attachments/assets/7b1b6aaf-6a61-4fde-b712-06c7a50915f1)

## 권한 상승 (Privilege Escalation) 

![sudo -l 권한 확인](https://github.com/user-attachments/assets/38b5ef32-a667-4a4f-b314-fb08cefad149)

권한을 확인하기 위해서 `sudo -l` 명령어를 사용했고 `needrestart`라는 친구가 비밀번호가 없다고 한다?

![needrestart vuln](https://github.com/user-attachments/assets/44f65b8a-6e0b-4e0f-bd13-908f0be6485d)

오?검색 하자마자 바로 CVE가 나오기 시작하는데?

![needrestart version](https://github.com/user-attachments/assets/32d950dc-ef51-48cc-8235-70b081d337cc)

더 정확한 확인을 위해 버전을 찍어보니 3.7 버전이란다.

검색 해보았을 때에 [pentestfunctions/CVE-2024-48990-PoC-Testing](https://github.com/pentestfunctions/CVE-2024-48990-PoC-Testing)가 바로 뜨기에 바~로 채택.

![그리고 비상](https://github.com/user-attachments/assets/9d38b112-f2f6-4788-a171-7ec243729ca6)

그리고 비상. gcc가 없어서 진행 불가 ㅋㅋㅋㅋㅋㅋ

이렇게 되면 이제 그냥 내 컴퓨터에서 컴파일 후에 넘겨주는 걸로 해야겠다.

![local to pc](https://github.com/user-attachments/assets/e054defd-cf87-4873-b5b4-b7e8d0bb8b61)

넘겨주는데 성공했다.

![but 안됨](https://github.com/user-attachments/assets/da25564e-bd1b-4e57-bed2-fd6668c6e447)

하지만? 문제가 있는지 전혀 되지 않음..

[CVE-2024-48990-Automatic-Exploit](https://github.com/Serner77/CVE-2024-48990-Automatic-Exploit) 고로 다른 사람의 poc를 이용해보기로 했다.

![자동화는 신이야](https://github.com/user-attachments/assets/ac337179-c534-46c0-aa0b-153ab99fdb5f)

자동화 최고! 있다가 지금 이거랑 내가 했던거랑 비교하면서 뭐가 잘못 되었던건지 확인을 좀 해봐야겠다.

![글자가 작기는 하다만...](https://github.com/user-attachments/assets/a5b5c51b-6227-4af9-a41a-fc52e1c498d0)

찾았다! 하루 안에 문제 풀다니 발전했다 나 자신!

![done](https://github.com/user-attachments/assets/6271c717-d9ae-45eb-ae90-37704058093b)

## 마치며

![Conversor PWNED](https://github.com/user-attachments/assets/d9babbc2-e426-456b-92a8-d3c53c0353a8)

이젠 확실히 문제를 봤을 때 어떻게 검색할지 어떤 부분을 내가 모르는지에 대해서 좀 더 알게 되었다. 물론 이번 문제 풀 때의 마지막처럼 여전히 이게 왜 안 될까? 하는 그런 부분도 있기는 하다만 꾸준히 해나가고 있으니 언젠간 그것 마져도 풀어낼 수 있게 되지 않을까?

언젠가 내가 CVE를 올리게 되는 그날까지!