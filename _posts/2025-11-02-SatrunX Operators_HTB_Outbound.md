---
title: "[HTB] Outbound (Easy_Linux)"
date: 2025-11-02 12:55:43 +09:00
categories: [hacking, saturnx operators, linux]
tags: [Hack The Box]
pin: true
password: "11021651"
---

[Congratulations OilLampCat, best of luck in capturing flags ahead!](https://labs.hackthebox.com/achievement/machine/988787/672)

## 시작에 앞서

![outbound start](https://github.com/user-attachments/assets/1c2611d5-01c4-4bdc-ab8b-de66d4722916)

이번엔 다시 돌아온 linux 머신(그것도 easy)인데,

![account for linux?](https://github.com/user-attachments/assets/27ca423d-c428-44ad-9dc5-4735ee21e154)

어라? 리눅스에서 계정 정보를 주는 것은 처음이다.

`계정 : tyler / LhKL1o9Nm3X2`

일단 시작해보자구.

## 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap result](https://github.com/user-attachments/assets/19df53a7-a860-42bf-90a4-9f5a9904e08b)

보아하니 `SSH`와 `http` 포트가 열려있는데 `mail.outbound.htb`라는 도메인으로 리다이렉트가 되는 것을 확인했다.

그렇다면 우리의 타겟은 저 메일이겠지?

![/etc/hosts](https://github.com/user-attachments/assets/453a8ec7-73e9-45ba-9732-69e567ddccbd)

`/etc/hosts` 파일에 매핑해주자.

![mail site](https://github.com/user-attachments/assets/d9123317-2cee-4935-8217-7140bd85aa0a)

아하 이래서 계정을 주었나보다.

![login](https://github.com/user-attachments/assets/05b120f6-1921-4fc3-8466-dfbe3148bd70)

로그인을 해보면.. 메일이 없다?

![webmail](https://github.com/user-attachments/assets/cbe36f10-7e38-4a4a-bcf8-d9b587f6382f)

다 찾아봐도 다른 특별한 내용은 없었고 대신 무엇으로 만들어 졌는지, 거기에 쓰인 플러그인들의 버전이 무엇인지 등의 내용들을 찾을 수 있었다. 그럼 이제 이걸 토대로 침투하러 가보자!

## 초기 침투 (Initial Foothold / Exploitation)

![webmail vuln](https://github.com/user-attachments/assets/e6663f1d-878d-487a-8b14-ed8e763f0405)

아니 검색 하자마자 바로 이 버전 웹메일의 취약점이 나온다. 그것도 RCE라니.

![msf RCE](https://github.com/user-attachments/assets/becb6416-6a01-4fde-aad9-810a3454097a)

따끈따끈한 metasploit 모듈이다.

[hakaioffsec/CVE-2025-49113-exploit](https://github.com/hakaioffsec/CVE-2025-49113-exploit) 혹은 다른 POC를 이용하면 될듯 한데 난 가능하면 msf를 쓰지 않고 진행해보겠다.

![RCE](https://github.com/user-attachments/assets/e912b128-6de0-46e1-92e6-9a4b04ea12fc)

리버스 쉘을 얻는데 성공했다.

![but](https://github.com/user-attachments/assets/fedce1ab-4a60-42f3-a795-57e61e5bd7b6)

하지만 내가 접근할 수 있는 권한이 없다는거..

![su](https://github.com/user-attachments/assets/2d135c30-bf72-4d39-a1a6-6125e951bec6)

물론 계정도 있으니 바로 로그인하면 그만이다.

![no python](https://github.com/user-attachments/assets/90a986f8-fc76-4b18-8117-91dbd35e54d2)

아쉽게도 파이썬이 없어서 이상한 쉘로 볼 수밖에 없다.

![what can i do](https://github.com/user-attachments/assets/9ae1db91-4e94-4d7c-a076-ad30b75205f6)

어.. 근데 내가 뭘 할수 있지? send 파일도 비어있고..

![gemini](https://github.com/user-attachments/assets/4b2b3711-1f16-4361-88b5-80bbfd5c48dc)

일단 칭찬은 고맙고 보아하니 `roundcubemail`에서는 `config.inc.php`라는 파일이 중요하다고 한다.

![got u](https://github.com/user-attachments/assets/a9dab717-3506-4ea6-8506-e6caa6eaf928)

일단 찾았고 한번 파일을 열어보자.

```php
<?php

/*
 +-----------------------------------------------------------------------+
 | Local configuration for the Roundcube Webmail installation.           |
 |                                                                       |
 | This is a sample configuration file only containing the minimum       |
 | setup required for a functional installation. Copy more options       |
 | from defaults.inc.php to this file to override the defaults.          |
 |                                                                       |
 | This file is part of the Roundcube Webmail client                     |
 | Copyright (C) The Roundcube Dev Team                                  |
 |                                                                       |
 | Licensed under the GNU General Public License version 3 or            |
 | any later version with exceptions for skins & plugins.                |
 | See the README file for a full license statement.                     |
 +-----------------------------------------------------------------------+
*/

$config = [];

// Database connection string (DSN) for read+write operations
// Format (compatible with PEAR MDB2): db_provider://user:password@host/database
// Currently supported db_providers: mysql, pgsql, sqlite, mssql, sqlsrv, oracle
// For examples see http://pear.php.net/manual/en/package.database.mdb2.intro-dsn.php
// NOTE: for SQLite use absolute path (Linux): 'sqlite:////full/path/to/sqlite.db?mode=0646'
//       or (Windows): 'sqlite:///C:/full/path/to/sqlite.db'
$config['db_dsnw'] = 'mysql://roundcube:RCDBPass2025@localhost/roundcube';

// IMAP host chosen to perform the log-in.
// See defaults.inc.php for the option description.
$config['imap_host'] = 'localhost:143';

// SMTP server host (for sending mails).
// See defaults.inc.php for the option description.
$config['smtp_host'] = 'localhost:587';

// SMTP username (if required) if you use %u as the username Roundcube
// will use the current username for login
$config['smtp_user'] = '%u';

// SMTP password (if required) if you use %p as the password Roundcube
// will use the current user's password for login
$config['smtp_pass'] = '%p';

// provide an URL where a user can get support for this Roundcube installation
// PLEASE DO NOT LINK TO THE ROUNDCUBE.NET WEBSITE HERE!
$config['support_url'] = '';

// Name your service. This is displayed on the login screen and in the window title
$config['product_name'] = 'Roundcube Webmail';

// This key is used to encrypt the users imap password which is stored
// in the session record. For the default cipher method it must be
// exactly 24 characters long.
// YOUR KEY MUST BE DIFFERENT THAN THE SAMPLE VALUE FOR SECURITY REASONS
$config['des_key'] = 'rcmail-!24ByteDESkey*Str';

// List of active plugins (in plugins/ directory)
$config['plugins'] = [
    'archive',
    'zipdownload',
];

// skin name: folder from skins/
$config['skin'] = 'elastic';
$config['default_host'] = 'localhost';
$config['smtp_server'] = 'localhost';
```

![nice](https://github.com/user-attachments/assets/4f31fa25-e750-4541-b39d-bb91dd1c5bff)

오! mysql 계정에 대한 정보를 얻었다!

![뭘까?](https://github.com/user-attachments/assets/5cdafaa7-567a-432a-b160-82c37976f046)

뭔가 암호화되어있으니 주의하라는 문구가 들어있는게 있긴 한데 이건 일단 뭔지 모르겠으니 넘어가서 mysql을 이용해볼까?

![?](https://github.com/user-attachments/assets/674aee55-71b8-4a96-a544-33b9a3387285)

왜 안 뜨는거지?

![msf](https://github.com/user-attachments/assets/beef8eef-aad2-404a-9c4c-d06aaa250cc9)

쉘의 문제인가 싶어 metasploit을 이용해보기로 했다.

![msf option](https://github.com/user-attachments/assets/d22e5d61-be25-4e7b-9521-b19440661437)

자 필수적인 부분을 모두 기입후 실행시키자.

![why?](https://github.com/user-attachments/assets/f44960ab-26f8-47d3-9e82-204d79038d08)

음.. 이게 이상하게 `exit;`을 넣어야지만 위에 입력한 값의 결과 값이 나오는데 왜 이런걸까?

![ㅇㅎ](https://github.com/user-attachments/assets/9b3006fe-011d-4f82-9c45-97dc5b705d7a)

다른게 문제가 아니라 역시 생각했듯 셸의 형태가 문제였다.

![now it works](https://github.com/user-attachments/assets/ca9abe7f-19f1-4f1a-92d8-6c68a8a62d6d)

확실히 이제야, 비대화형으로 실행하니 잘 나온다.

![got session?](https://github.com/user-attachments/assets/eddec8f8-868c-4ee0-b05c-483e9b292745)

이렇게 뭔가를 찾아서 gemini에게 물어보니,

![gemini 왈](https://github.com/user-attachments/assets/e88e3fa1-df75-4d86-942b-198c3e171556)

오? base64로 인코딩된 세션 정보라는데?

![did](https://github.com/user-attachments/assets/36309188-f98d-4ccd-bdc5-ea2f099bbdc6)

확실히 그러했다!

`jacob`

`L7Rv00A8TuwJAr67kITxxcSgnIk25Am/`

![그럼 그렇지](https://github.com/user-attachments/assets/9bf8a863-dc5e-4a1e-9727-46850af165ee)

어쩌면 당연하겠다만 이거 자체가 비밀번호는 아닌 샘이다. 그렇다고 base64도 아니였다.

[decrypt.sh](https://github.com/roundcube/roundcubemail/blob/master/bin/decrypt.sh)

공식 roundcubemail 깃허브의 내용을 찾아보니 아예 복호화에 대한 코드가 있었다.

![did?](https://github.com/user-attachments/assets/650a3b2d-9617-439b-99ea-d523b4c01c34)

실행시켜 복호화 시킬 내용을 넣으니 이번에야말로 이게 비밀번호일까?

![jacob](https://github.com/user-attachments/assets/cbb23e0a-338f-40b2-bb24-d68e6e4aedce)

드디어 jacob의 이메일에 접속해 볼 수 있었다.

![first email](https://github.com/user-attachments/assets/b7663bc9-4825-432f-adcb-3ccbe199d57f)

일단 첫 메일에서는 tyler가 메일 비번 바뀌었으니 다음에 로그인하면 비밀번호를 바꾸라고 한다. 이건 ssh의 비밀번호일까? 아니면 바뀌기 전의 이메일 비밀번호일까?

![second one](https://github.com/user-attachments/assets/30f44597-b7e3-4079-ba71-6d283cfae10e)

mel이라는 사람에게 연락이 왔는데 메인 서버의 리소스 사용량이 비정상적으로 높아서 확인하기 위해 Below라는 모니터링 툴을 설치했고 jacob에게 그 권한을 부여했다고 한다.

그럼 이제 위 결과에 따라 첫 메일 부터 시도해보자.

![ssh](https://github.com/user-attachments/assets/edc3341c-4a0c-431b-adf9-def414c1d3f5)

오잉? 진짜로 ssh네? 그리고 바로 뭔가 사용량들이 쭉 뜨는데 이게 위에서 말한 below라는 모니터링 툴인걸까?

![got user flag](https://github.com/user-attachments/assets/84af9e88-8189-4606-8671-30b181ca8850)

일단 userflag를 얻었으니 한잔해.

![how this is easy level](https://github.com/user-attachments/assets/cb97ee3c-45f7-4eb8-9f3b-7dc9e61da3d4)

## 권한 상승 (Privilege Escalation) 

![sudo -l 권한 확인](https://github.com/user-attachments/assets/c69cc107-8312-40a5-a80c-3261d31d0366)

일단 아까 위에서 Below라는 툴에 권한이 있다고 했으니까 `sudo -l` 라는 명령어를 통해서 확인해보니 `/usr/bin/below`라는 툴에 권한이 있는것을 확인해볼 수 있었다.

찾아보니 [Below has Incorrect Permission Assignment for Critical Resource](https://github.com/advisories/GHSA-9mc5-7qhg-fp3w)라고 하는 취약점이 있었다. [CVE-2025-27591](https://nvd.nist.gov/vuln/detail/CVE-2025-27591)로 나와있어 이를 이용하면 될듯 하다.

![version](https://github.com/user-attachments/assets/73ad8a67-dcc9-4564-ad99-b85505719efd)

혹시하여 `jacob@outbound:~$ sudo /usr/bin/below` 명령어를 통해 들어가 확인해보니 버전이 `0.8.0`이었다.

![didit](https://github.com/user-attachments/assets/990d0c30-4371-44ba-89cc-fd82d7264dd2)

[BridgerAlderson/CVE-2025-27591-PoC](https://github.com/BridgerAlderson/CVE-2025-27591-PoC)를 이용하여 루트 권한을 얻는데 성공했다!

![root owned](https://github.com/user-attachments/assets/bbd3fa63-8f09-46ce-86d1-a103d4950fce)

## 마치며

![outbound has been pwned](https://github.com/user-attachments/assets/66a64303-8dba-4c33-ba55-e532d9409e8d)

오랜만에 다시 돌아온 리눅스! 뭔가 확실히 아직은 리눅스 문제 푸는게 훨씬 더 익숙하다.

근데 이번 문제는 뭔가 user플래그를 얻는게 root 얻는 것 보다 훨씬 어려웠던 느낌? 특히 mysql에 대해 잘 알지 못한 상태로 도전을 하게 되니까 계속 진행하며 막혀서 더 그랬던 것도 있는듯 하다.

![script kiddie](https://github.com/user-attachments/assets/07b9247a-3b66-4583-aacd-010b3a16f9fd)

그리고 이제야 스크립트 키디 타이틀을 얻게 되었다. 다음 Hacker까지! 꾸준히 노력해보자!