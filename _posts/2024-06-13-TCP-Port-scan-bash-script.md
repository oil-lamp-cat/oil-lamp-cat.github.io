---
title: "[shell script] 포트 스캐닝"
date: 2024-06-13 20:27:15 +09:00
categories: [Security & Hacking]
tags: [Linux, Shell-Script, 포트스캔, Bash]
pin: true
---

# Port scan

매번 모의해킹을 하거나 워게임을 하다 보면 `port scan`이라는 것을 하게 된다

그리고 이 때 사용하는 가장 대표적인 친구가 바로 `nmap`이다

나는 그동안 `nmap`을 사용만 해봤지 사실상 어떻게 작동하는 것인지 전혀 모르고 있었다

그렇기에 이번 기회에 `TCP`, `UTP`의 작동 원리와 shell script를 이용한 포트스캐닝을 만들어 보고자 한다

[포트 스캐닝 기법들](https://isc9511.tistory.com/126)

위 블로그에서 정말 설명이 잘 되어있기에 여기에서는 따로 설명하지 않겠다

# TCP
# shell script (TCP, UDP Port Scanning)
내가 지금 사용하고 있는 `Bash shell`에는 별도의 패키지 설치가 필요 없는 `/dev/tcp/[대상 IP]/[포트번호]`를 이용해 포트스캔을 구현할 생각이다

## 1차

아래는 처음 만들었던 스크립트이다

처음에는 어떻게 구현해야 할까 하는 생각에 조금의 조사 후 스크립트가 꽤나 길게 만들어 졌다

아래 매개변수를 입력하는 부분이 뭔가 마음이 들지 않아 더 줄일 수 있는 방법이 있나 찾아봐야겠다  

```bash
#!/bin/bash

IP_ADDRESS=$1

PORT_START=$2

PORT_END=$3

#이 부분을 매우 단순하게 줄일 수 있음
:<<'END'
if [ -z "$IP_ADDRESS" ]; then
    echo "IP : 127.0.0.1 (loop back IP)"
    IP_ADDRESS="127.0.0.1"
else
    echo "IP : $IP_ADDRESS"
fi

if [ -z "$PORT_START" ]; then
    echo "Start port : 1"
    PORT_START=1
else
    echo "Start port : $PORT_START"
fi

if [ -z "$PORT_END" ]; then
    echo "End port : 1024"
    PORT_END=1024
else
    echo "End port : $PORT_END"
fi
END

echo "scanning start to $IP_ADDRESS for TCP ports $PORT_START to $PORT_END"

for (( port=PORT_START; port<=PORT_END; port++ ))
do
    (echo >/dev/tcp/"$IP_ADDRESS"/"$port") &>/dev/null && echo "Port $port is open"
    sleep 0.01
done
```

## 2차

위 스크립트에서 불필요한 부분을 지우고 아래와 같이 매우 간단하게 줄일 수 있었다

```bash
#!/bin/bash

IP_ADDRESS=${1:-"127.0.0.1"}

PORT_START=${2:-1}

PORT_END=${3:-1024}

echo "scanning start to $IP_ADDRESS for TCP ports $PORT_START to $PORT_END"

for (( port=PORT_START; port<=PORT_END; port++ ))
do
    (echo >/dev/tcp/"$IP_ADDRESS"/"$port") &>/dev/null && echo "Port $port is open"
    sleep 0.01
done
```

결과는 아래와 같이 나온다

참고로 `127.0.0.1`은 다른 이름으로는 `localhost`로 루프백 아이피 즉 본인 컴퓨터를 의미하는 것이다

한국에서는 포트스캐닝을 하는 것이 불법이니 가상환경에서 하거나 본인에게 태스트 해 보는 것이 좋을 듯 하다

```bash
raen@seolhwa:~/문서/GitHub/Port_Scanner$ bash PSB.sh
scanning start to 127.0.0.1 for TCP ports 1 to 1024
Port 631 is open
```

다음번에는 포트가 무슨 서비스를 가지고 있는지 확인하는 스크립트를 추가하자

## 3차

이번에는 아예 나중에 쉽게 조절할 수 있도록 반복되는 부분을 함수로 바꿨다

위에서 어떤 서비스인지 확인하는 스크립트를 추가 한다고 했었는데 그 부분이 바로 `grep $PORT/tcp /etc/services | head -n1 | awk '{print $1}` 부분이다

`grep`명령어는 `grep [찾을 문구] [파일]`으로 검색 할 수 있다

`/etc/services`라는 파일에서 `$PORT/tcp`라는 문구를 찾을건데 실제로 위 명령어를 잠시 쳐보면 `ipp		631/tcp				# Internet Printing Protocol`이라며 서비스명, 포트 번호, 설명 이 나온다

나는 이중에 가장 앞에 나오는 어떤 서비스 인지가 필요했기에 `head -n1`찾은 문구에서 가장 첫줄 (혹시 몰라서), `awk '{print $1}`를 통해 맨 앞 단어만 가져왔다


```bash
#!/bin/bash

IP_ADDRESS=${1:-"127.0.0.1"}

PORT_START=${2:-1}

PORT_END=${3:-1024}

scan_port(){
    PORT=$1
    (echo >/dev/tcp/"$IP_ADDRESS"/"$PORT") &>/dev/null && echo -e "$PORT/tcp\topen\t`grep $PORT/tcp /etc/services | head -n1 | awk '{print $1}'`"
    sleep 0.01
}

clear
echo "Scanning $IP_ADDRESS [TCP ports $PORT_START to $PORT_END]"

echo -e "\nPORT\tSTATE\tSERVICE"

for (( PORT=PORT_START; PORT<=PORT_END; PORT++ ))
do
    scan_port $PORT
done
```

그렇게 출력된 결과물은?

```bash
Scanning 127.0.0.1 [TCP ports 1 to 1024]

PORT	STATE	SERVICE
631/tcp	open	ipp
```

꽤나 마음에 든다

다음번에는 서비스 설명까지 띄우는 옵션을 설정해 볼까 한다

## 4차

`getopts` : 실행 옵션 설정

```
OPTION="a:b:c:defg"
```

- 인자가 있는 실행 옵션은 옵션 뒤에 : 넣기 - a,b,c
- 인자가 없는 실행 옵션은 옵션 뒤에 아무것도 없음 - d,e,f,g

```bash
#!/bin/bash

IP_ADDRESS="127.0.0.1"

PORT_START=1

PORT_END=1024

TYPE=tcp

SERVICE=false

OPTIONS=":i:ahtu?"

usage()
{
    echo '
    <options>
    -i [ip] : ip설정
    -a : 서비스에 관한 설명까지 추가되어 출력
    -h : 도움말
    -t : tcp 스캔 (default)
    -u : udp 스캔
    '
}

while getopts $OPTIONS opts; do
    case $opts in
    \?)
    echo "invalid option"
    usage
    exit 1;;
    a) SERVICE=true
    ;;
    i) IP_ADDRESS=$OPTARG
    ;;
    t) TYPE=tcp
    ;;
    u) TYPE=udp
    ;;
    h)
        usage
    exit;;
    :)
        usage
    exit;;
    esac
done

scan_port(){
    PORT=$1
    if [ $SERVICE = true ]; then
        if [ $TYPE == 'tcp' ]; then
            (echo >/dev/tcp/"$IP_ADDRESS"/"$PORT") &>/dev/null && echo -e "$PORT/tcp\topen\t`grep $PORT/tcp /etc/services | head -n1 | awk '{print $1}'`\t`grep $PORT/tcp /etc/services | head -n1 | awk '{print $4}'`"
        else
            (echo >/dev/udp/"$IP_ADDRESS"/"$PORT") &>/dev/null && echo -e "$PORT/udp\topen\t`grep $PORT/udp /etc/services | head -n1 | awk '{print $1}'`\t`grep $PORT/udp /etc/services | head -n1 | awk '{print $4}'`"
        fi
    else
        if [ $TYPE == 'tcp' ]; then
            (echo >/dev/tcp/"$IP_ADDRESS"/"$PORT") &>/dev/null && echo -e "$PORT/tcp\topen\t`grep $PORT/tcp /etc/services | head -n1 | awk '{print $1}'`"
        else
            (echo >/dev/udp/"$IP_ADDRESS"/"$PORT") &>/dev/null && echo -e "$PORT/udp\topen\t`grep $PORT/udp /etc/services | head -n1 | awk '{print $1}'`"
        fi
    fi
    sleep 0.01
}

clear
echo "Scanning $IP_ADDRESS [TCP ports $PORT_START to $PORT_END]"

echo -e "\nPORT\tSTATE\tSERVICE"

for (( PORT=PORT_START; PORT<=PORT_END; PORT++ ))
do
    scan_port $PORT
done
```

위와같이 UDP 스캐너도 추가적으로 넣었으나... 아무래도 출력되는 것을 보아하니 UDP스캔은 안 되는 것 같다

자료조사를 할 때에 분명 있다고 했는데...

Bash shell로 할 수 있는 통신은 /dev/tcp, /dev/udp와 같이 정해진 것 뿐이고 이제 추가적인 기능을 구현하기 위해서는 다른 언어를 쓰는 것이 좋겠다

C, Rust, Python 중 하나를 선택할 것 같다