---
title: "[Shell Sciprt]로 구현한 로그 생성 및 로그에서 에러 잡기 스크립트"
date: 2024-06-10 14:43:15 +09:00
categories: [System & Linux]
tags: [Linux, Shell-Script, Bash]
pin: true
---

# 시작

예를 들어 `mlat.log`라는 파일이 있다고 했을 때 이 파일에서 오류(Error, critical, Down)을 찾아내기 위해 만들기 시작

하지만 이제 문제가 있다면 내가 직접 그 기계들이 작동하고 있는 동안(로그가 생성되는 동안)을 가정하고 스크립트를 짜야한다는 점..

내가 가지고 있는 파일은 이미 수많은 로그가 찍힌 `mlat.log`파일 뿐이다

그렇다면?

직접 한 줄씩 새로 로그 파일을 만드는 스크립트를 짜면 되겠네?

# log 생성 스크립트

``` bash
#!/bin/bash

LOG_FILE="./mlat.log"

NEW_LOG_FILE="./test.log"

if [ -f "$NEW_LOG_FILE" ]; then
	rm "$NEW_LOG_FILE"
fi

while read -r line
do
	echo "$line" >> "$NEW_LOG_FILE"
	echo "$line"
	sleep 1

done < "$LOG_FILE"
```

`mlat.log`파일을 불러오고 우리는 새로운 파일인 `test.log`파일을 만들어 낼 것이다

이 때 만약 파일이 이미 있다면? 삭제하고 없다면 그대로 진행한다

그 후 한줄씩 읽어가며 파일에 추가해주면 끝!

# 로그 읽고 에러 띄우기

그럼 이제 정말로 실시간 log가 생성될 때 에러를 잡는 코드를 짜보자

아 참고로 이름은 그냥 간단하게 RD LOD (로그 읽기)로 지었다

Ascii Art를 이용해서 이름을 꾸민 것이기에 필요 없다면 지우고 사용해도 된다

```bash
#!/bin/bash
echo "


██████╗ ██████╗     ██╗      ██████╗  ██████╗ 
██╔══██╗██╔══██╗    ██║     ██╔═══██╗██╔════╝ 
██████╔╝██║  ██║    ██║     ██║   ██║██║  ███╗
██╔══██╗██║  ██║    ██║     ██║   ██║██║   ██║
██║  ██║██████╔╝    ███████╗╚██████╔╝╚██████╔╝
╚═╝  ╚═╝╚═════╝     ╚══════╝ ╚═════╝  ╚═════╝ 

"

echo "프로그램을 실행합니다"
sleep 2
clear

LOG_FILE="./test.log"

PREVIOUS_CONTENT=""

#파일 변경 확인 함수
check_file_change() {
	if [ -f "$LOG_FILE" ]; then
		CURRENT_CONTENT=$(< "$LOG_FILE")
		if [ "$CURRENT_CONTENT" != "$PREVIOUS_CONTENT" ]; then
			echo "변경이 감지"
			PREVIOUS_CONTENT="$CURRENT_CONTENT"
		fi
	else
		echo "로그 파일이 없습니다"
		echo "1초 뒤 다시 실행합니다"
		sleep 1
		clear
	fi
}

while true
do
	check_file_change
	sleep 1 #요건 나중에 없앨 거에요~
done
```

일단은 파일의 변경을 감지하는 것 까지 만들었다

이제 log 변경이 감지된 후 파일을 읽어 오류 수와 오류 종류 등을 띄워줄 차례이다

## 1차

<details><summary>RD_Log.sh</summary>
<div markdown = "1">

```bash
#!/bin/bash
echo "프로그램을 실행합니다"
sleep 1
clear

LOG_FILE="./test.log"

PREVIOUS_CONTENT=""

#파일 변경 확인 함수
check_file_change() {
	if [ -f "$LOG_FILE" ]; then
		CURRENT_CONTENT=$(< "$LOG_FILE")
		if [ "$CURRENT_CONTENT" != "$PREVIOUS_CONTENT" ]; then
			#echo "변경이 감지"
			echo "UP 수 : `cat $LOG_FILE | grep -c "UP"`"
			echo "DOWN 수 : `cat $LOG_FILE | grep -c "DOWN"`"
			if grep -q "CRITICAL" "$LOG_FILE"; then
				#CRITICAL 이 존재할 때
				echo "CRITICAL 수 : `cat $LOG_FILE | grep -c "CRITICAL"`"
			fi

			#이렇게 되면 안되는데...
			if grep -q "DOWN" "$LOG_FILE"; then
				echo -e '\a'
			fi
			PREVIOUS_CONTENT="$CURRENT_CONTENT"
		fi
	else
		echo "로그 파일이 없습니다"
		echo "1초 뒤 다시 실행합니다"
		sleep 1
		clear
		
	fi
}

while true
do
	check_file_change

	sleep 0.2
	clear
done
```
</div>
</details>

다 좋은데 지금 문제가 DOWN이 감지되면 소리가 난다는 것은 좋다 그런데 한번 문제를 감지하면 계속 소리를 낸 다는 것이다... 아이고

그렇다면 따로 변수를 지정해주어 DOWN의 현재 수를 기록해 두었다가 그것이 변경 될 때에 실행되게 만들면 될 것이다

일단 출력되는 것은 나중으로 생각하고 차근차근 해보자

## 2차
<details><summary>RD_Log.sh</summary>
<div markdown = "1">

```bash
#!/bin/bash
echo "프로그램을 실행합니다"
sleep 1
clear

LOG_FILE="./test.log"

PREVIOUS_CONTENT=""

PREVIOUS_DOWN=0

CURRENT_DOWN=0

#파일 변경 확인 함수
check_file_change() {
	if [ -f "$LOG_FILE" ]; then

		#LOG_FILE 변수에 저장
		CURRENT_CONTENT=$(< "$LOG_FILE")

		#변경 감지
		if [ "$CURRENT_CONTENT" != "$PREVIOUS_CONTENT" ]; then

			#UP 수 확인
			echo "UP 수 : `cat $LOG_FILE | grep -c "UP"`"

			#DOWN 수 확인
			CURRENT_DOWN=$(grep -c "DOWN" "$LOG_FILE")
			echo "DOWN 수 : $CURRENT_DOWN"

			#CRITICAL 이 존재할 때
			if grep -q "CRITICAL" "$LOG_FILE"; then
				echo "CRITICAL 수 : `cat $LOG_FILE | grep -c "CRITICAL"`"
			fi

			#DOWN수가 변경되었을 때 소리내기
			if [ $CURRENT_DOWN -gt $PREVIOUS_DOWN ]; then
				echo -e '\a'
			fi

			PREVIOUS_DOWN=$CURRENT_DOWN
			PREVIOUS_CONTENT=$CURRENT_CONTENT
		fi
	else
		echo "로그 파일이 없습니다"
		echo "1초 뒤 다시 실행합니다"
		sleep 1
		clear
		
	fi
}



while true
do
	check_file_change
	sleep 0.2
	clear
done
```
</div>
</details>

이제 소리가 나오는 것 까지 완료 하였다

나중에 필요하면 `삡`소리 말고 다른 소리로 변경이 가능하기도 하다

이제 문제가 되는 DOWN이나 CRITICAL오류들을 따로 뽑아서 볼 수 있게 만들고자 한다

지금 생각한 바로는 따로 스크립트를 짜서 그 스크립트 실행 시 볼 수 있게 하거나

이미 있는 `RDlog.sh`에서 띄우거나 인데

로그를 좀 더 분석한 뒤에 결정해봐야 겠다

## 3차

이번에는 파일 변경을 확인하기 위한 작업으로 데이터가 늘어나면 데이터 자체를 비교하는데 시간이 오래 걸리기에 파일 변경 `시간`을 이용하기로 하였다

또한 추가적으로 alarm소리를 출력하기 위한 방법을 백그라운드 실행을 통해 해결할 수 있었다

만약 DOWN이 감지되어 alarm이 실행되었다면 그 함수를 백그라운드로 실행함과 동시에 프로세스 ID를 저장해 두었다가 나중에 사람이 확인했다는 의미인 `q`를 눌렀을 때 백그라운드 프로세스를 kill하는 것으로 해결했다

백그라운드 프로세스를 다루는 것은 c나 c++, pyhton에서도 해본 적이 없던 작업이라 처음에는 당황했지만 여러 예제들을 보고난 뒤에는 확실히 활용할 수 있게 되었다

아 그리고 난 bash shell에는 `echo`만으로 출력 가능할 것이라고 생각했는데 `printf`를 이용해서도 출력이 가능했다

심지어 `echo`를 이용한 출력에서 비프음을 위한 `\a` 때문에 자꾸 한 줄씩 내려버려 이것을 어떻게 해결해야하나 했는데 `printf`를 이용하면 줄 내림이 없어진 다는 것을 알게 되었다 

이걸 몰랐네

<details><summary>RD_Log.sh</summary>
<div markdown = "1">

```bash
#!/bin/bash
echo "프로그램을 실행합니다"
sleep 1
clear

#log 파일
LOG_FILE="./test.log"

#파일 변경 시간 초기화
PREVIOUS_DATE=""

#DOWN 수
PREVIOUS_DOWN=0

#UP 수
CURRENT_DOWN=0

# 알람 출력
alarm() {
	while true
	do 
		printf '\a'	
		sleep 0.5 
	done 
}

#소리 알람 함수
sound_alarm() {

	#alarm 함수 백그라운드 실행
	alarm &

	# alarm 함수 프로세스 ID 저장
	alarm_process_id=$!

	while read -s -n 1 input
	do
		if [[ $input = q ]]
		then
			kill $alarm_process_id
			break
		fi
	done
}

#파일 변경 확인 함수
check_file_change() {
	#파일 존재 유무
	if [ -f "$LOG_FILE" ]; then

		#LOG_FILE 변경 시간을 저장
		CURRENT_DATE=$(date -r "$LOG_FILE")

		#변경 감지 : 시간을 기반으로 
		if [ "$CURRENT_DATE" != "$PREVIOUS_DATE" ]; then

			#UP 수 확인
			echo "UP 수 : `cat $LOG_FILE | grep -c "UP"`"

			#DOWN 수 확인
			CURRENT_DOWN=$(grep -c "DOWN" "$LOG_FILE")
			echo "DOWN 수 : $CURRENT_DOWN"

			#CRITICAL 이 존재할 때
			if grep -q "CRITICAL" "$LOG_FILE"; then
				echo "CRITICAL 수 : `cat $LOG_FILE | grep -c "CRITICAL"`"
			fi

			#DOWN수가 변경되었을 때 소리내기
			if [ $CURRENT_DOWN -gt $PREVIOUS_DOWN ]; then
				sound_alarm
			fi

			PREVIOUS_DOWN=$CURRENT_DOWN
			PREVIOUS_DATE=$CURRENT_DATE
		fi
	else
		echo "로그 파일이 없습니다"
		echo "1초 뒤 다시 실행합니다"
		sleep 1
		clear
		
	fi
}

#파일 변경 메인
while true
do
	check_file_change
	sleep 1
	clear
done
```
</div>
</details>

## 4차

코드를 수정하던 중 난관에 봉착했다

![스크린샷 2024-06-11 16-59-16](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/2d11e613-c131-44bf-b897-c62350286065)


```bash
#DOWN수가 변경되었을 때 소리내기
if [ $CURRENT_DOWN -gt $PREVIOUS_DOWN ]; then
	echo  -e "\n DOWN 발생"
	DOWN_LOG=$(grep "DOWN" "$LOG_FILE")
	echo "$DOWN_LOG"
	DOWN_COUNT=$(($CURRENT_DOWN - $PREVIOUS_DOWN ))
	echo "$PREVIOUS_DOWN -> $CURRENT_DOWN"
	echo "`tail -n $DOWN_COUNT $DOWN_LOG`"
	sound_alarm
fi
```

음... 솔직히 이건 전혀 생각치 못했다

위 코드를 보면 tail 명령어를 사용할 때에 `DOWN_COUNT`와 `DOWN_LOG`가 있는데 이 두 부분에서 아무래도 오류가 발생하는 것이 아닐까 싶다

왜냐면 `echo "$DOWN_LOG"`는 확실하게 한 문장으로 오류를 보여주기 때문에 아무래도 두 부분을 바꿔가며 찾아봐야겠다

```bash
echo "`tail -n 1 $DOWN_LOG`"
```

일단 한 줄만 출력할 수 있게 설정하였을 때에

![스크린샷 2024-06-11 17-05-11](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/b16f41d1-1a2a-447c-8b33-360e0e6f7cd4)

줄 문제가 아니였나 보다

아 계속 하다가 딱 번뜩 떠오르는 것이 있다

`grep`, `cat`, `tail` 명령어는 파일에서 찾을 때 쓰는 명령어지 변수에서 찾을 때 쓰는 명령어가 아니다...

이걸 왜 까먹고 있었지?

```bash
#DOWN수가 변경되었을 때 소리내기
if [ $CURRENT_DOWN -gt $PREVIOUS_DOWN ]; then
	echo  -e "\n DOWN 발생"
	DOWN_LOG=$(grep "DOWN" "$LOG_FILE")
	DOWN_COUNT=$(($CURRENT_DOWN - $PREVIOUS_DOWN ))
	echo "$PREVIOUS_DOWN -> $CURRENT_DOWN"
	echo -e "\n========= LOG ========="
	echo -e "\n$DOWN_LOG" | tail -n $DOWN_COUNT
	echo -e "\n알람을 종료하기 위해 q를 누르세요"
	sound_alarm
fi
```

명령어로 넣지 않고 스크립트에 사용하는 식으로 이용하면 해결 가능!

![스크린샷 2024-06-11 17-26-18](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/b67394f3-6c07-4620-bac8-bdf8ed5c4d53)

## 중간 점검

1. 로그 파일을 읽는다
2. 로그 파일에서 문제점들을 찾는다 - `critical`, `DOWN`
3. 문제점이 발견 되었을 때 경보를 울린다
4. 확인하여 q를 눌렀을 때 경보를 닫는다
5. 그리고 다시 문제점을 찾을 때 까지 모니터링 한다

[스크린캐스트 2024년 06월 11일 17시 33분 30초.webm](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/7c3d91cf-3f05-4601-bf5e-ef15e969559c)

<details><summary>RD_log.sh</summary>
<div markdown = "1">

```bash
#!/bin/bash
echo "프로그램을 실행합니다"
sleep 1
clear

#log 파일
LOG_FILE="./test.log"

#파일 변경 시간 초기화
PREVIOUS_DATE=""

#DOWN 수
PREVIOUS_DOWN=0

#UP 수
CURRENT_DOWN=0

#DOWN 출력 초기화
DOWN_LOG=""

#DOWN 수 초기화
DOWN_COUNT=0

# 알람 출력
alarm() {
	while true
	do 
		printf '\a'	
		sleep 0.5 
	done 
}

#소리 알람 함수
sound_alarm() {

	#alarm 함수 백그라운드 실행
	alarm &

	# alarm 함수 프로세스 ID 저장
	alarm_process_id=$!

	while read -s -n 1 input
	do
		if [[ $input = q ]]
		then
			kill $alarm_process_id
			break
		fi
	done
}

#파일 변경 확인 함수
check_file_change() {
	#파일 존재 유무
	if [ -f "$LOG_FILE" ]; then

		#LOG_FILE 변경 시간을 저장
		CURRENT_DATE=$(date -r "$LOG_FILE")

		#변경 감지 : 시간을 기반으로 
		if [ "$CURRENT_DATE" != "$PREVIOUS_DATE" ]; then

			#UP 수 확인
			echo " UP 수 : `cat $LOG_FILE | grep -c "UP"`"

			#DOWN 수 확인
			CURRENT_DOWN=$(grep -c "DOWN" "$LOG_FILE")
			echo " DOWN 수 : $CURRENT_DOWN"

			#CRITICAL 이 존재할 때
			if grep -q "CRITICAL" "$LOG_FILE"; then
				echo " CRITICAL 수 : `cat $LOG_FILE | grep -c "CRITICAL"`"
			fi

			#DOWN수가 변경되었을 때 소리내기
			if [ $CURRENT_DOWN -gt $PREVIOUS_DOWN ]; then
				echo  -e "\n DOWN 발생"
				DOWN_LOG=$(grep "DOWN" "$LOG_FILE")
				DOWN_COUNT=$(($CURRENT_DOWN - $PREVIOUS_DOWN ))
				echo " $PREVIOUS_DOWN -> $CURRENT_DOWN"
				echo -e "\n========= LOG =========\n"
				echo -e "\n$DOWN_LOG" | tail -n $DOWN_COUNT
				echo -e "\n======================="
				echo -e "\n알람을 종료하기 위해 q를 누르세요"
				sound_alarm
			fi

			PREVIOUS_DOWN=$CURRENT_DOWN
			PREVIOUS_DATE=$CURRENT_DATE
		fi
	else
		echo "로그 파일이 없습니다"
		echo "1초 뒤 다시 실행합니다"
		sleep 1
		clear
		
	fi
}

#파일 변경 메인
while true
do
	check_file_change
	sleep 1
	clear
done
```
</div>
</details>

## 5차

몇가지 변경 사항이 생겼다

1. 로그가 한 줄씩 생기는 것이 아니라 특정 시간 마다 생긴다
2. 그리고 로그의 맨 앞 [~]안에 들어있는 숫자가 unix 시간이다
3. 파일은 특정 크기 이후로 그 전 로그는 삭제되고 새로운 것이 들어온다


<details><summary>MKlog.sh</summary>
<div markdown = "1">

```bash
#!/bin/bash

#테스트용 파일 (원한다면 변경 가능)
LOG_FILE="mlat.log"

#테스트용으로 만들어질 파일 (변경 할 이유 없음)
NEW_LOG_FILE="NEW_LOG_FILE.log"

# 파일 존재 확인 간소화
> "$NEW_LOG_FILE"

#이전 시간 저장	변수
PREV_TIME=""

#IFS 백업
PRE_IFS=$IFS

while IFS= read -r line; do

	# grep에서 ^를 통해 첫번 째 [] 만 꺼내왔다, tr로 []을 삭제하고 시간 부분만 저장
    TIME_STAMP=$(echo "$line" | grep -oP '^\[\d+\]' | tr -d '[]')

    if [[ -z "$TIME_STAMP" ]]; then
        continue
    fi

	#unix 시간 변경
    CURRENT_TIME=$(date -d "@$TIME_STAMP" "+%Y-%m-%d %H:%M:%S")

	#test용- 이 스크립트는 테스트 용도이다
	echo "============================="
	echo "이전 시간 : $PREV_TIME"
	echo "현재  시간 : $CURRENT_TIME"
	echo "============================="

    if [[ -n "$PREV_TIME" && "$PREV_TIME" != "$CURRENT_TIME" ]]; then
		echo "Time change detected"
        sleep 15
		clear
    fi

    echo "$line" >> "$NEW_LOG_FILE"

    PREV_TIME="$CURRENT_TIME"
done < "$LOG_FILE"

#IFS 원상복구
IFS=$PRE_IFS
echo "Log processing complete. Check the NEW_LOG_FILE.log for entries."
```
</div>
</details>

## 6차
만들다보니 내가 아예 잘못 시작을 해버린 것이 아닌가 싶은 생각이 들어 다시 한번 정리하고 가야겠다

> MKlog

1. mlat.log(실제 로그)와 test.log(테스트용 로그)파일이 있는지 확인
2. test.log가 존재한다면 초기화
3. mlat.log의 첫번 째 로그를 읽어 가장 처음 시간 (UNIX)를 읽어 PREV_TIME으로 저장
4. 같은 시간로그가 끝나는 시점의 로그를 저장해 놓았다가 그 로그 다음번 시간을 읽고 위 작업을 반복

혹은

1. mlat.log(실제 로그)와 test.log(테스트용 로그)파일이 있는지 확인
2. test.log가 존재한다면 초기화
3. 원래 하던 작업과 동일하지만 배열을 이용해서 같은 시간동안의 로그를 한번에 test.log로 옮기기

사실 두번째 방법이 가장 좋을 것이라고 생각하는 바이기는 하다 사실 MKLog같은 경우에는 테스트용 스크립트이기 때문에 빨리 끝낼 수록 좋은데...

뭔가 자꾸 "어 이렇게 하면 이런 문제가 생길텐데"하는 생각이 들어 다시 만들게 된다

<details><summary>MKlog.sh</summary>
<div markdown = "1">

```bash
#!/bin/bash

#테스트용 파일 (원한다면 변경 가능)
LOG_FILE="mlat.log"

#테스트용으로 만들어질 파일 (변경 할 이유 없음)
NEW_LOG_FILE="NEW_LOG_FILE.log"

# 파일 존재 확인 간소화
> "$NEW_LOG_FILE"

#이전 시간 저장	변수
PREV_TIME=""

#저장용 배열
LINE_ARRAY=""

while read -r line; do

	# grep에서 ^를 통해 첫번 째 [] 만 꺼내왔다, tr로 []을 삭제하고 시간 부분만 저장
    TIME_STAMP=$(echo "$line" | grep -oP '^\[\d+\]' | tr -d '[]')

    if [[ -z "$TIME_STAMP" ]]; then
        continue
    fi

	#unix 시간 변경
    CURRENT_TIME=$(date -d "@$TIME_STAMP" "+%Y-%m-%d %H:%M:%S")

	#test용 출력
	#echo "============================="
	#echo "이전 시간 : $PREV_TIME"
	#echo "현재  시간 : $CURRENT_TIME"
	#echo "============================="

    #시간변경 감지 후 새로운 로그 추가
    if [[ -n "$PREV_TIME" && "$PREV_TIME" != "$CURRENT_TIME" ]]; then
		echo "Time change detected"
        #파일로 한번에 저장 (\n이 존재하기에 -e를 이용)
        echo -e "$LINE_ARRAY" >> "$NEW_LOG_FILE"
        #배열 초기화
        LINE_ARRAY=""
        #대기 시간
        sleep 15 #$(( $PREV_TIME - $CURRENT_TIME +%S )) #으로 실제 테스트를 진행할 수 있다
		clear
    fi

    #배열 추가
    if [[ -n "$LINE_ARRAY" ]]; then
        LINE_ARRAY+="\n$line"
    else
        LINE_ARRAY="$line"
    fi

    #echo "$line" >> "$NEW_LOG_FILE"
    PREV_TIME="$CURRENT_TIME"
done < "$LOG_FILE"

echo "모든 테스트 로그가 종료되었습니다"
```

</div>
</details>

![image](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/76af285a-e7a6-4c80-877e-a9420f67df61)

> ReadLog

1. 로그 파일 존재 확인 (나중에 매개변수를 통해 테스트 파일을 따로 설정할 수 있게 할 생각이다)
2. 파일이 변경되는지를 감지
3. 변경되었다면 다음 함수 실행 아니라면 다시 카운트 다운(default 15s)
4. 처음에는 PREV_TIME 값을 비워놔 현재 존재하는 모든 로그를 대상으로 CRITICAL, DOWN등의 에러 확인
5. 처음 확인을 거친 후 가장 마지막에 있는 줄의 로그에서 UNIX시간을 PREV_TIME으로, []안에 들어있을 것 (가장 처음 []안에 들어있는 것만 추출해야함!!)
6. 카운트 다운 후에 파일 변경이 감지되었다면 PREV_TIME을 제외한 모든 시간대의 로그를 가지고 비교한다
7. 위 반복

이번에도 거의 다 만들고 생각난 것이 결국에 `LOG_TIME`값이 계속 추가되면 문제가 생기지 않나.. 라는 것이다... 아 이거 어케 해결한담...
<details><summary>ReadLog.sh</summary>
<div markdown = "1">

```bash
#!/bin/bash
echo "

    ██████╗ ██████╗     ██╗      ██████╗  ██████╗ 
    ██╔══██╗██╔══██╗    ██║     ██╔═══██╗██╔════╝ 
    ██████╔╝██║  ██║    ██║     ██║   ██║██║  ███╗
    ██╔══██╗██║  ██║    ██║     ██║   ██║██║   ██║
    ██║  ██║██████╔╝    ███████╗╚██████╔╝╚██████╔╝
    ╚═╝  ╚═╝╚═════╝     ╚══════╝ ╚═════╝  ╚═════╝ 

"

echo "프로그램을 실행합니다"
sleep 1
clear

# log 파일
LOG_FILE="./NEW_LOG_FILE.log"

#파일 변경 시간 초기화
PREVIOUS_DATE=""

#로그 시작 시간 초기화, 로그에 * 가 없기에 초기 값으로 설정
LOG_TIME="\*"

# 알람 출력
alarm() {
    while true
    do 
        printf '\a'    
        sleep 0.3
    done 
}

# 소리 알람 함수
sound_alarm() {
    # alarm 함수 백그라운드 실행
    alarm &

    # alarm 함수 프로세스 ID 저장
    local alarm_process_id=$! # 지역변수로 설정

    while read -s -n 1 input
    do
        if [[ $input = q ]]; then
            if [[ $alarm_process_id != "" ]]; then
                kill $alarm_process_id
            fi
            clear
            break
        elif [[ $input = m ]]; then
            kill $alarm_process_id
            alarm_process_id=""
            echo "알람을 종료했습니다. q를 눌러 작업을 계속할 수 있습니다."
        else
            echo "$input 은(는) 잘못된 입력입니다."
        fi
    done
}

# 파일 변경 확인 함수
check_file_change(){
    # 파일 존재 유무
    if [ ! -f "$LOG_FILE" ]; then
        echo "로그 파일이 없습니다."
        echo "1초 뒤 다시 실행합니다."
        sleep 1
        clear
        return

    fi

    if [[ ! -s "$LOG_FILE" ]]; then
        echo "파일이 비어있습니다."
        sleep 1
        #clear
        return
    fi

    #파일 변경 감지 : 시간기반
    CURRENT_DATE=$(date -r "$LOG_FILE")
    if [ "$CURRENT_DATE" != "$PREVIOUS_DATE" ]; then
        #시간 조정
        PREVIOUS_DATE=$CURRENT_DATE
        NEW_LOG=$(grep -Ev "$LOG_TIME" "$LOG_FILE")
        echo "$NEW_LOG"

        #NEW_LOG 존재 유무 확인
        if [[ -z "$NEW_LOG" ]]; then
            return
        fi

        #grep을 받을 때 echo를 이용해 변수에 있는 값들을 출력하고 거기서 grep을 할 것!!! grep 뒤에 그냥 쓰면 파일이름 이라서 문제 발생!!
        if echo "$NEW_LOG" | grep -q "DOWN"; then
            
            #critical 감지
            if echo "$NEW_LOG" | grep -q "CRITICAL"; then
                echo "CRITICAL 발생"
            fi

            echo -e "\n DOWN 발생"
            DOWN_LOG=$(echo "$NEW_LOG" | grep "DOWN")
            echo -e "\n========= DOWN LOG =========\n"
            echo -e "\n$DOWN_LOG"
            echo -e "\n============================"
            echo -e "\n알람을 종료하기 위해 q를 음속어를 위해서는 m을 누르세요"
            sound_alarm
        fi
    
        LOG_TIME+=$(echo "$NEW_LOG" | grep -oP '^\[\d+\]' | tr -d '[]' | sort -u | awk 'BEGIN{sep="|"} {printf "%s%s", sep, $0; sep=" | "} END{print ""}')
    else
        echo "변경사항 없음"
    fi
    
}

# 파일 변경 메인 실행
while true
do
    check_file_change
    sleep 2
    clear
done
```

</div>
</details>

![image](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/9c23bbfd-6b7b-418b-8e27-c64c8327395a)


## 7차

로그 읽기 스크립트 ReadLog입니다
```bash

    へ 
 （• ˕ •マ 
    |､  ~ヽ         
    じしf_,)〳       made by LampCat
	
```

> 실행

`main.sh`를 실행시켜 주시면 됩니다

만약 permission denied가 뜬다면 `chmod +x '스크립트'`를 통해 권한을 주시면 됩니다

> OPTION에 대한 설명

처음 main.sh를 실행시키게 되면 OPTION을 만들게 됩니다

`OPTION`파일에서는 알람 빈도수, 로그 파일 위치를 변경하실 수 있습니다

`LOG_PATH`에는 테스트가 아닌 실제 읽고자 하는 로그의 위치를 넣으시면 됩니다

`ALARM_REPEAT`은 CRITICAL 또는 DOWN이 감지되었을 때 비프음을 계속해서 내게 될 것인데 그 때의 빈도수를 조절 할 수 있습니다

`TEST_LOG_FILE`에 테스트 하고 싶은 로그 파일을 넣으면 됩니다

`RDLOG_REPEAT` 로그를 읽을 빈도수 입니다

코드는 내일 조금만 더 다듬고 올리도록 하지요 벌써 1시 10분이네요 ;V

## FINAL?

최종 드디어 길고 긴 스크립트 여정이 끝났네요!?

[github_RDLog](https://github.com/oil-lamp-cat/Log-Reader)

![스크린샷 2024-06-30 15-26-49](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/4713cbd5-e5b0-4d04-ad22-fc19bde12fac)

[youtube](https://www.youtube.com/watch?v=8xagFLWRSwo)

![스크린샷 2024-06-30 15-23-32](https://github.com/oil-lamp-cat/Log-Reader/assets/103806022/3fc15695-194c-42d3-b808-3ef6aa92023f)