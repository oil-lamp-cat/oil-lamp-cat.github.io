---
title: "[HTB] StartingPoint Tier 2- Multi Step Attacks and Privilege Escalation 문제 풀이 모음"
date: 2026-02-19 13:53:00 +09:00
categories: [hacking, Linux, Windows, Very Easy]
tags: [Hack The Box]
---

## 시작에 앞서

이젠 확실하게 권한상승까지 있는 Tier 2 문제를 풀어보자. 근데 어째 권한상승은 할만한데 초기 침투가 좀 많이 어려운...

|이름|난이도|OS|Link|
|:--:|:--:|:--:|:--:|
|**Archetype**|Very Easy|Windows|[Link](https://app.hackthebox.com/machines/Archetype)|
|**Oopsie**|Very Easy|Linux|[Link](https://app.hackthebox.com/machines/Oopsie)|
|**Vaccine**|Very Easy|Linux|[Link](https://app.hackthebox.com/machines/Vaccine)|
|**Responder**|Very Easy|Windows|[Link](https://app.hackthebox.com/machines/Responder)|
|**Unified**|Very Easy|Linux|[Link](https://app.hackthebox.com/machines/Unified)|

## Archetype (Windows)

[Congratulations OilLampCat! You are player #116692 to have solved Archetype.](https://labs.hackthebox.com/achievement/machine/988787/287)

![Archetype](https://github.com/user-attachments/assets/11b92d2d-e949-400b-b298-e09a75a74c99)

사실 문제 풀 때에는 Unified 부터 풀기는 했다만 기록하는데에는 문제가 없겠지?

### 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

![nmap1](https://github.com/user-attachments/assets/0896650b-f3df-44fa-8f48-ca19535b70a9)
![nmap2](https://github.com/user-attachments/assets/9bf75d2b-33c3-4224-a56d-b144a55f44ee)

nmap의 결과가 길다보니 두번 잘라 올렸다.

보아하니 `135`,`139`,`445`,`1433` 등의 포트가 열려있고 스캔 결과에 따라 윈도우 머신이라는 것을 알 수 있었다.

![smb1](https://github.com/user-attachments/assets/dc3cd206-94ff-4430-bdc4-125d20146a3a)

smb가 열려있음을 위에서 확인했음으로 접근에 시도해보자.

그 결과 4개의 공유 폴더를 확인할 수 있었다.

![smb2](https://github.com/user-attachments/assets/bccd3f3f-44a3-4f21-b17f-a8416727e9b9)

그렇게 찾아낸 폴더에 접근을 시도하니 `backups`와 `IPC$`에만 접근할 수 있었다.

![smb3](https://github.com/user-attachments/assets/8456b9cb-f7df-47bf-a6a8-804117167aa2)

**backups**에는 `prod.dtsConfig`라는 파일이 있어 get 명령어로 다운받아줬고.

![smb4](https://github.com/user-attachments/assets/42f60502-730b-4dcb-be74-cac5837f5f6c)

**IPC$** 에는 아무런 파일도 존재하지 않았다.

![prod](https://github.com/user-attachments/assets/eb9d74d3-cac8-48dd-8113-fe23635d6c5c)

backups에서 찾아온 `prod.dtsConfig` 파일을 읽어보자 그 안에

- ID=ARCHETYPE\sql_svc
- Password=`생략`

이 존재했다.

### 초기 침투 (Initial Foothold / Exploitation)

### 권한 상승 NONE (Privilege Escalation) 

## Oopsie (Linux)

### 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

### 초기 침투 (Initial Foothold / Exploitation)

### 권한 상승 NONE (Privilege Escalation) 

## Vaccine (Linux)

### 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

### 초기 침투 (Initial Foothold / Exploitation)

### 권한 상승 NONE (Privilege Escalation) 

## Responder (Linux)

### 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

### 초기 침투 (Initial Foothold / Exploitation)

### 권한 상승 NONE (Privilege Escalation) 

## Unified (Linux)

### 정찰 및 정보 수집 (Reconnaissance & Enumeration) 

### 초기 침투 (Initial Foothold / Exploitation)

### 권한 상승 NONE (Privilege Escalation) 
