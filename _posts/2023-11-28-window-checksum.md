---
title: windows checksum 확인법
date: 2023-11-28 09:50:15 +09:00
categories: [Tools & Environment]
tags: [Windows, 팁]
pin: true
---

웹사이트에서 파일을 다운받을 때에 위조되었는지 확인하기 위한 작업

* cmd
```shell
certutil -hashfile {파일 경로} {checksum 종류}
```
checksum 종류(써본 것들)
* sha256
* MD5
* sha1
* MD4
