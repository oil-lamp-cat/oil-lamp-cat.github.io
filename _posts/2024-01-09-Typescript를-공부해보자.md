---
title: Typescript 이야기
date: 2024-01-09 01:55:15 +09:00
categories: [Learning]
tags: [TypeScript, Frontend, 부트캠프]
pin: true
---

# Typescript 이야기

## 이모저모

### 마우스 클릭했을 때 깜빡이게 만들기

```typescript
cursor: pointer;
&:active{
    opacity: [투명화 값];
};
```

### rem? px?

#### px

픽셀이라고 불리며 절대단위이다. 1px = 1픽셀

#### em

이 단위가 사용되고 있는 요소의 font-size 기준에서 px로 바꾸어서 화면에 표시된다.

#### rem

rem(root em):

최상위 엘리먼트에서 설정된 font-size 기준에서 px로 변환한다.
