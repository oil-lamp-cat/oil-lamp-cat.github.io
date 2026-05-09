---
title: github issue의 이상한 participants
date: 2026-05-09 11:14:00 +09:00
categories: [Web Development]
tags: [Jekyll, GitHub-Pages, 블로그]
pin: true
---

## github issue?

![participant](https://github.com/user-attachments/assets/c7bde7df-10aa-4586-9745-9dca22a34fdd#.png)

난 이 블로그를 운영할 때 직접 파일 안에 이미지를 넣기보단 가능하면 github issue를 이용하곤 한다.

물론 이게 과해지면 재제를 먹게 되긴 할텐데 그 전에 아무래도 한번 싹 갈아엎긴 해야겠지?

일단 그 전에 지금 이 포스트를 쓰는 이유에 대해 설면하자면 내 github 이슈를 살펴보던 중 이상한 부분을 발견했기에 그렇다.

위 이미지를 보면 이상하게도 **Participants**의 부분에 나 이외의 누군가가 존재하는걸 알 수 있다.

분명 다른 issue에는 나 이외엔 없었는데 누구세요?

## Leftoverstoday

![Leftoverstoday](https://github.com/user-attachments/assets/6137e6b6-8e42-44f6-bfe5-76592071e67f#.png)

들어가보니 **Leftovers.today**라는 계정으로 두개의 레포가 있었다.

![google](https://github.com/user-attachments/assets/13ca09ca-ec77-4e0b-9d77-0c4d9bf4387b#.png)

google에 검색해보니 꽤나 유명한 레포가 있는건가? 싶었다.

![아닌데](https://github.com/user-attachments/assets/711e77e5-98df-47f5-bea0-61b066d53787#.png)

그런데 정작 링크를 통해 들어가보니 github는 404를 띄우는게 아니겠는가?

내가 좀 예민한 것일 수도 있는데 개인적으로 너무 이상하다고 생각했다.

![github](https://github.com/user-attachments/assets/67931fa4-7fce-4805-8ec0-dc2afe785238#.png)

심지어 github에 검색을 해보니 2024년 이후 자주 올리던 풀리퀘스트도 없는 것을 알 수 있다.

흐으음...

물론 레포 자체는 fork한거라서 없애거나 비공개로 돌리면 404가 뜨긴 한다.

![뭐임](https://github.com/user-attachments/assets/c10445db-b1f2-4485-87a1-4b34ef5b74e7#.png)

아무리 생각해도 이상해서 **github Raw Data**를 확인해봤다. 근데 여기서도 안 나오더라.

그러니까 내 github 이슈에 아예 기여를 한게 없는 상황인데 github participants로 되어있다는 것.

여기저기 찾아보니 깃허브의 이슈일거라는데. 적어도 보안 문제는 아니고 그저 Github 서버 캐시의 렌더링 버그일 것이라고는 한다..

아니 그래도 솔직히 아무것도 안했는데 participants로 뜨면 이상하지 않나...

이번 포스트는 뭔가 기술적으로 했다기보단 그냥 이상하여 이렇게 작성해본다. 일단은 저 계정을 block하긴 했는데 (솔직히 넘 찝찝하잖아요...) 훗날 다시 정상화 되거나 진짜 원인을 찾게 된다면 그 때 다시 이어 적도록 하겠다.