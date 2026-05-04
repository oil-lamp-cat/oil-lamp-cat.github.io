---
title: "[Shell Sciprt]로 구현한 로그 생성 및 로그에서 에러 잡기 스크립트 아직 끝이 아니다!"
date: 2024-07-08 19:57:15 +09:00
categories: [System & Linux]
tags: [Linux, Shell-Script, Bash]
pin: true
---

# 아직 끝이 아니다?

추가할 기능들이 갑자기 생겨버렸기에! 아직은 끝낼 수 없다

하지만 원래 기록에 더하기에는 좀 너무 글이 길어져 세로운 곳에 적는편이 좋겠다고 생각했답니다

-  비프음 말고 따로 오디오 파일 쓸 수 있게 옵션 넣기
-  특정 시간 동안만 시작될 수 있게 옵션
-  특정 시간 동안은 소리가 울리지 않게 옵션
-  옵션 파일 조정할 수 있게 스크립트 안에 넣기

일단은 이정도 추가할 것들을 생각하고 있습니다

## 옵션 파일 조정기능 스크립트에 추가

처음 스크립트를 실행하게 되면 OPTION이라는 파일을 만들게 되는데 처음에는 `OPTION 파일에 들어가서 변경하거나 확인하면 되지`라고 생각했는데 

그렇게 하면 사용자의 편의성이 많이 떨어지겠다고 생각이 바뀌어 변경하게 되었습니다

추가적으로 `옵션 조절 + 실행 시간, 실행 불가 시간, 알람파일 선택`을 더 추가하기로 했기에 OPTION 파일이 전과 다르게 좀 많이 늘었습니다

<details><summary>main.sh</summary>
<div markdown = "1">

```bash
#main.sh
#!/bin/bash

OPTION_FILE="./OPTION"
OPTIONS=":th?"
OPTION_TRUE=0
USER_ID=$USER
HOST_NAME=$(hostname)

usage()
{
    echo '
    <options>
    -t : 테스트 스크립트 실행
    -f : 폴더 선택
    -k : 키워드 설정
    -h : 도움말
    '
}

test_s(){
    gnome-terminal --tab -- bash -c "./MKlog.sh; exec bash"

    gnome-terminal --tab -- bash -c "./ReadLog.sh; exec bash"
}

read_log_d(){
    gnome-terminal -- bash -c "./ReadLog.sh -f $OPTION_FILE; exec bash"

}

read_log_a(){
    gnome-terminal -- bash -c "./ReadLog.sh -a -f $OPTION_FILE; exec bash"
}

keyword_read_log(){
    gnome-terminal -- bash -c "./ReadLog.sh -a -k -f $OPTION_FILE; exec bash"
}

change(){
        local OPTION_TYPE="$1"
        local CHANGE_TO="$2"
        local PREVIOUS="$3"
        echo "$OPTION_TYPE 의 $PREVIOUS 에서 $CHANGE_TO 로 변경하시겠습니까? Y/N"
        printf "$USER_ID@$HOST_NAME> "
        read yn
        if [ "$OPTION_TYPE" = "LOG_PATH" ] || [ "$OPTION_TYPE" = "TEST_LOG_FILE" ] || [ "$OPTION_TYPE" = "ALARM_FILE" ]; then
            if ! [ -f "$CHANGE_TO" ]; then
                option_setting "파일이 존재하지 않습니다."
            fi
        fi
        case "$yn" in
        [yY])
            sed -i "s/\($OPTION_TYPE : \[\)[^]]*\(\]\)/\1$(echo "$CHANGE_TO" | sed -e 's/[\/&]/\\&/g')\2/" "$OPTION_FILE"
            option_setting "$OPTION_TYPE 의 $PREVIOUS 에서 $CHANGE_TO (으)로 변경되었습니다"
        ;;
        [nN])
            option_setting "변경사항이 없습니다"
        ;;
        *)
            option_setting "$yn 은 잘못된 입력값입니다"
        ;;
    esac
}

option_setting(){
    clear

    local CHANGED_LOG="${1:-NONE}"

    local LOG_FILE=$(grep '^LOG_PATH : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local ALARM_REPEAT=$(grep '^ALARM_REPEAT : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local ALARM_FILE=$(grep '^ALARM_FILE : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local ALARM_ON_OFF=$(grep '^ALARM_ON_OFF : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local TEST_LOG_FILE=$(grep '^TEST_LOG_FILE : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local TIME_FILTER_COUNT=$(grep '^TIME_FILTER_COUNT : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local WORD=$(grep '^KEYWORD : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local RDLOG_REPEAT=$(grep '^RDLOG_REPEAT : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local RUNNING_TIME=$(grep '^RUNNING_TIME : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local NO_RUNNING_TIME=$(grep '^NO_RUNNING_TIME : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    echo -e "\n 옵션 설정"
    echo "
    # 변경을 하고자 하는 숫자를 입력 하거나
    # q를 눌러 다시 메인으로 가실 수 있습니다

    1.LOG_PATH : $LOG_FILE
    2.TEST_LOG_FILE : $TEST_LOG_FILE
    3.ALARM_REPEAT : $ALARM_REPEAT
    4.ALARM_FILE : $ALARM_FILE
    5.ALARM_ON_OFF : $ALARM_ON_OFF
    6.RDLOG_REPEAT : $RDLOG_REPEAT
    7.TIME_FILTER_COUNT : $TIME_FILTER_COUNT
    8.KEYWORD : $WORD
    9.RUNNING_TIME : $RUNNING_TIME
    10.NO_RUNNING_TIME : $NO_RUNNING_TIME
    "

    if [ "$CHANGED_LOG" != "NONE" ]; then
        echo -e "   $CHANGED_LOG \n"
    fi

    printf "$USER_ID@$HOST_NAME> "
    read task_input

    case "$task_input" in
        1)
            clear
            echo " LOG_PATH : $LOG_FILE"
            echo -e " 변경하고 싶은 log파일의 위치를 넣으세요\n"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "LOG_PATH" "$change" "$LOG_FILE"
        ;;
        2)
            clear
            echo " TEST_LOG_FILE : $TEST_LOG_FILE"
            echo -e " 변경하고 싶은 log파일의 위치를 넣으세요\n"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "TEST_LOG_FILE" "$change" "$TEST_LOG_FILE"
        ;;
        3)
            clear
            echo " ALARM_REPEAT : $ALARM_REPEAT"
            echo -e " 알람 출력 빈도입니다 - 기본 0.3s, 입력은 숫자만 입력해주세요\n"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "ALARM_REPEAT" "$change" "$ALARM_REPEAT"
        ;;
        4)
            clear
            echo " ALARM_FILE : $ALARM_FILE"
            echo -e " 알람 파일입니다\n"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "ALARM_FILE" "$change" "$ALARM_FILE"            
        ;;
        5)
            clear
            echo " ALARM_ON_OFF : $ALARM_ON_OFF"
            echo -e " 알람 파일을 끄고 킬 수 있습니다, 스크립트 실행 중에도 안에서 변경 가능"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "ALARM_ON_OFF" "$change" "$ALARM_ON_OFF"   
        ;;
        6)
            clear
            echo " RDLOG_REPEAT : $RDLOG_REPEAT"
            echo -e " 로그 읽는 빈도수 입니다 - 기본 2s, 입력은 숫자만 입력해주세요\n"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "RDLOG_REPEAT" "$change" "$RDLOG_REPEAT"
        ;;
        7)
            clear
            echo " TIME_FILTER_COUNT : $TIME_FILTER_COUNT"
            echo -e " 시간 제외 필터 횟수입니다 - 기본 10회, 입력은 숫자만 입력해주세요"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "TIME_FILTER_COUNT" "$change" "$TIME_FILTER_COUNT"
        ;;
        8)
            clear
            echo " KEYWORD : $WORD"
            echo -e " 키워드 포함 로그 검출, 단어|단어 로 입력해 주세요"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "KEYWORD" "$change" "$WORD"
        ;;
        9)
            clear
            echo " RUNNING_TIME : $RUNNING_TIME"
            echo -e " 특정 시간 동안에만 실행, 08:00-18:30 로 입력해 주세요"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "RUNNING_TIME" "$change" "$RUNNING_TIME"
        ;;
        10)
            clear
            echo "NO_RUNNING_TIME : $NO_RUNNING_TIME"
            echo "특정 시간 동안 실행 안함, 08:00-18:30 로 입력해 주세요"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "NO_RUNNING_TIME" "$change" "$NO_RUNNING_TIME"
        ;;
        q)
            echo "설정을 종료합니다"
            clear
            main
        ;;
        *)
            sleep 1
            clear
            option_setting "잘못된 입력입니다"
        ;;
    esac

}

cat_meow(){
    clear
    echo "
        へ 
     （• ˕ •マ  meow~
       |､  ~ヽ         
       じしf_,)〳
    "    
}

main(){


    if [ $OPTION_TRUE -eq 0 ]; then
        clear
        echo "
        start -main.sh-

        へ 
      （• ˕ •マ 
        |､  ~ヽ         
        じしf_,)〳       made by LampCat

        #모든 스크립트는 ctrl+c를 눌러 빠져나올 수 있습니다#

        1. 테스트 스크립트 실행 (MKlog.sh, ReadLog.sh) - 새로운 tab이 열릴 것입니다
        2. 로그 읽는 스크립트 실행 (ReadLog.sh) - DOWN만 감지
        3. 로그 읽는 스크립트 전체 감지 모드로 실행 (ReadLog.sh) - DOWN, CRITICAL 감지
        4. 특정 단어가 포함된 DOWN, CRITICAL 감지
        5. 옵션 설정
        6. 도움이 필요하다면 이곳으로
        "
        printf "$USER_ID@$HOST_NAME> "
        read task_input

        case "$task_input" in
            1)
                test_s
            ;;
            2)
                read_log_d
            ;;
            3)
                read_log_a
            ;;
            4)
                keyword_read_log
            ;;
            5)
                option_setting
            ;;
            6)
                echo -e "\n ====blog===="
                echo " https://oil-lamp-cat.github.io/"
                echo -e "\n ====email===="
                echo -e " raen0730@gmail.com\n"
                exit 1
            ;;
            q)
                echo "종료합니다"
                exit 1
            ;;
            cat)
                cat_meow
                exit 1
            ;;
            * )
                echo "잘못된 입력입니다"
                exit 1
            ;;
        esac
    fi
}

while getopts $OPTIONS opts; do
    case $opts in
    \?)
        echo "invalid option"
        usage
        exit 1;;
    t) 
        echo "테스트 스크립트 실행"
        test_s
        OPTION_TRUE=1
    ;;
    h)
        exit 1
    ;;
    :)
        usage
        exit 1
    ;;
    esac
done

if [ ! -f "$OPTION_FILE" ]; then
    clear
    echo "옵션 파일이 존재하지 않습니다."
    touch "$OPTION_FILE"
    echo "#대괄호를 삭제하지 말고 안에 넣기!
#문제 발생시 : https://oil-lamp-cat.github.io/

#이곳에 읽고자 하는 log의 위치를 넣으세요
LOG_PATH : [./mlat.log]

#알람 출력 빈도입니다 - 기본 0.3s
ALARM_REPEAT : [0.3]

#알람 파일입니다 - OPTION 설정에서 on/off 할 수 있습니다
ALARM_FILE : []
ALARM_ON_OFF : [NO]

#테스트 로그에 사용될 로그 파일 위치입니다, 테스트에 쓰고 싶은 로그 파일을 넣으시면 됩니다
TEST_LOG_FILE : [./mlat.log]

#로그 읽는 빈도수 입니다 - 기본 2s, 2초마다 파일이 변경되었는지 확인
RDLOG_REPEAT : [2]

#시간 제외 필터 횟수입니다, 예를들어 기본 10일 때에는 로그 파일 변경이 10회 감지되고 나서야 시간 필터를 한번 검사합니다
#검사시 로그에 삭제된 시간이 존재한다면 코드의 FILTER_LOG변수에서 그 시간대를 전부 삭제합니다
#테스트 스크립트를 이용하였을 때에는 10회 정도가 적당하였으나 로그 읽는 빈도수, 실제 로그 생성 시간에 맞춰 알맞게 변경하시기 바랍니다
TIME_FILTER_COUNT : [10]

#특정 키워드가 포함된 로그 검출을 위한 옵션 -k를 이용할 때 사용됨
#단어|단어 로 구성되어야함
#아래는 기본 세팅
KEYWORD : [CWP|FUSION]

#특정 시간 동안에만 실행될 수 있게 세팅 ex) H:M, [08:00-18:30]
RUNNING_TIME : []

#특정 시간 동안에는 실행되지 않게 세팅 ex) H:M, [08:00-18:30]
NO_RUNNING_TIME : []
    " > "$OPTION_FILE"
    echo "./OPTION 파일을 생성하였으니 옵션 세팅을 열겠습니다"
    sleep 2
    option_setting
fi

main
```

</div>
</details>

## 특정 시간에 실행, 특정 시간에 실행 X 추가

에다가 추가적으로 만약 파일이 이미 존재한다면 새로 들어오는 로그들만 읽기 위해 `LOG_TIME` 추가

```bash
# log 파일
if [[ $FOLDER = 0 ]]; then
    LOG_FILE="./NEW_LOG_FILE.log"
else
    LOG_FILE=$(grep '^LOG_PATH : \[.*\]$' "$OPTION_FOLDER_PATH" | awk -F '[][]' '{print $2}')
    if [ ! -f "$LOG_FILE" ]; then
        echo "위치에 로그파일이 존재하지 않습니다, 다시 한번 확인해 주세요"
        exit 1
    else
        LOG_TIME+=$(echo "$LOG_FILE" | grep -oP '^\[\d+\]' | tr -d '[]' | sort -u | awk 'BEGIN{sep="|"} {printf "%s%s", sep, $0; sep="|"} END{print ""}')
    fi
fi
```

## 작업 끝 (2024-07-10-17-10)
[추가할 것들](https://github.com/oil-lamp-cat/Log-Reader/issues/1)이 드디어 끝났답니다

하다보니 이제 bash 스크립트에서 옵션 파일에서 값을 가져오거나 조건을 걸어서 제어하는 부분이 꽤나 익숙해졌네요

아래 부분은 영어로 된 작업물!

만약 한글로 된 부분이 필요하다면 제 github에 가면 kr, en버전 모두 있답니다!

<details><summary>main.sh</summary>
<div markdown = "1">

```bash
#!/bin/bash

OPTION_FILE="./OPTION"
OPTIONS=":th?"
OPTION_TRUE=0
USER_ID=$USER
HOST_NAME=$(hostname)

usage()
{
    echo '
    <options>
    -t : run test script
    -f : f [folder path]
    -k : use keyword
    -h : help
    '
}

test_s(){
    gnome-terminal --tab -- bash -c "./MKlog.sh; exec bash"

    gnome-terminal --tab -- bash -c "./ReadLog.sh; exec bash"
}

read_log_d(){
    gnome-terminal -- bash -c "./ReadLog.sh -f $OPTION_FILE; exec bash"

}

read_log_a(){
    gnome-terminal -- bash -c "./ReadLog.sh -a -f $OPTION_FILE; exec bash"
}

keyword_read_log(){
    gnome-terminal -- bash -c "./ReadLog.sh -a -k -f $OPTION_FILE; exec bash"
}

change(){
        local OPTION_TYPE="$1"
        local CHANGE_TO="$2"
        local PREVIOUS="$3"
        echo "Will you change $PREVIOUS  to $CHANGE_TO in $OPTION_TYPE OPTION? Y/N"
        printf "$USER_ID@$HOST_NAME> "
        read yn
        if [ "$OPTION_TYPE" = "LOG_PATH" ] || [ "$OPTION_TYPE" = "TEST_LOG_FILE" ] || [ "$OPTION_TYPE" = "ALARM_FILE" ]; then
            if ! [ -f "$CHANGE_TO" ]; then
                option_setting "File doesn't exist."
                return
            fi
        fi
        if [ "$OPTION_TYPE" = "ALARM_FILE_ON_OFF" ]; then
            if [ "$CHANGE_TO" != "ON" ] && [ "$CHANGE_TO" != "OFF" ]; then
                option_setting "ALARM_FILE_ON_OFF option only able to use ON or OFF."
                return
            fi
        fi
        case "$yn" in
        [yY])
            sed -i "s/^\($OPTION_TYPE : \[\)[^]]*\(\]\)/\1$(echo "$CHANGE_TO" | sed -e 's/[\/&]/\\&/g')\2/" "$OPTION_FILE"
            option_setting "$PREVIOUS is changed to $CHANGE_TO in $OPTION_TYPE OPTION"
        ;;
        [nN])
            option_setting "There are no changes"
        ;;
        *)
            option_setting "$yn is invalid input"
        ;;
    esac
}

option_setting(){
    clear

    local CHANGED_LOG="${1:-NONE}"

    local LOG_FILE=$(grep '^LOG_PATH : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local ALARM_REPEAT=$(grep '^ALARM_REPEAT : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local ALARM_FILE=$(grep '^ALARM_FILE : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local ALARM_FILE_ON_OFF=$(grep '^ALARM_FILE_ON_OFF : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local TEST_LOG_FILE=$(grep '^TEST_LOG_FILE : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local TIME_FILTER_COUNT=$(grep '^TIME_FILTER_COUNT : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local WORD=$(grep '^KEYWORD : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local RDLOG_REPEAT=$(grep '^RDLOG_REPEAT : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local ALARM_RUNNING_TIME=$(grep '^ALARM_RUNNING_TIME : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    local NO_ALARM_RUNNING_TIME=$(grep '^NO_ALARM_RUNNING_TIME : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')

    if [ -z "$ALARM_RUNNING_TIME" ]; then
        ALARM_RUNNING_TIME="EMPTY"
    fi

    if [ -z "$NO_ALARM_RUNNING_TIME" ]; then
        NO_ALARM_RUNNING_TIME="EMPTY"
    fi


    echo -e "\n OPTION setting"
    echo "
    # Enter the number you want to change
    # Or you can press q to go to the main

    1.LOG_PATH                | $LOG_FILE
    2.TEST_LOG_FILE           | $TEST_LOG_FILE
    3.ALARM_REPEAT            | $ALARM_REPEAT
    4.ALARM_FILE              | $ALARM_FILE
    5.ALARM_FILE_ON_OFF       | $ALARM_FILE_ON_OFF
    6.RDLOG_REPEAT            | $RDLOG_REPEAT
    7.TIME_FILTER_COUNT       | $TIME_FILTER_COUNT
    8.KEYWORD                 | $WORD
    9.ALARM_RUNNING_TIME      | $ALARM_RUNNING_TIME
    10.NO_ALARM_RUNNING_TIME  | $NO_ALARM_RUNNING_TIME
    "

    if [ "$CHANGED_LOG" != "NONE" ]; then
        echo -e "   $CHANGED_LOG \n"
    fi

    printf "$USER_ID@$HOST_NAME> "
    read task_input

    case "$task_input" in
        1)
            clear
            echo " LOG_PATH : $LOG_FILE"
            echo -e " Put the location of the log file you want to change\n"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "LOG_PATH" "$change" "$LOG_FILE"
        ;;
        2)
            clear
            echo " TEST_LOG_FILE : $TEST_LOG_FILE"
            echo -e " Put the location of the log file you want to change\n"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "TEST_LOG_FILE" "$change" "$TEST_LOG_FILE"
        ;;
        3)
            clear
            echo " ALARM_REPEAT : $ALARM_REPEAT"
            echo -e " Frequency of alarm output - Default 0.3s, Please enter numbers only\n"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "ALARM_REPEAT" "$change" "$ALARM_REPEAT"
        ;;
        4)
            clear
            echo " ALARM_FILE : $ALARM_FILE"
            echo " The location of the alarm file\n"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "ALARM_FILE" "$change" "$ALARM_FILE"            
        ;;
        5)
            clear
            echo " ALARM_FILE_ON_OFF : $ALARM_FILE_ON_OFF"
            echo " You can use alarm files, ex) ON/OFF"
            echo -e "Able to change them while running a script\n"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "ALARM_FILE_ON_OFF" "$change" "$ALARM_FILE_ON_OFF"   
        ;;
        6)
            clear
            echo " RDLOG_REPEAT : $RDLOG_REPEAT"
            echo -e " Log read frequency - default 2s, please enter numbers only\n"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "RDLOG_REPEAT" "$change" "$RDLOG_REPEAT"
        ;;
        7)
            clear
            echo " TIME_FILTER_COUNT : $TIME_FILTER_COUNT"
            echo " Time-exclude filters - default 10 times, please enter numbers only"
            echo -e "Used for Overflow Protection\n"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "TIME_FILTER_COUNT" "$change" "$TIME_FILTER_COUNT"
        ;;
        8)
            clear
            echo " KEYWORD : $WORD"
            echo -e " Log with keywords, type in words|word\n"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "KEYWORD" "$change" "$WORD"
        ;;
        9)
            clear
            echo " ALARM_RUNNING_TIME : $ALARM_RUNNING_TIME"
            echo " Run for a specific time only, ex) 08:00-18:30"
            echo "(Please type in large|small)"
            echo -e " If you leave it empty, it will run for 24 hours\n"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "ALARM_RUNNING_TIME" "$change" "$ALARM_RUNNING_TIME"
        ;;
        10)
            clear
            echo "NO_ALARM_RUNNING_TIME : $NO_ALARM_RUNNING_TIME"
            echo " Do not run alarms for a specific time, ex) 08:00-18:30"
            echo "(Please type in large|small)"
            echo -e " If you leave it empty, it will run for 24 hours\n"
            printf "$USER_ID@$HOST_NAME> "
            read change
            change "NO_ALARM_RUNNING_TIME" "$change" "$NO_ALARM_RUNNING_TIME"
        ;;
        q)
            echo "Exit the setup"
            clear
            main
        ;;
        *)
            sleep 1
            clear
            option_setting "Invalid input"
        ;;
    esac

}

cat_meow(){
    clear
    echo "
        へ 
     （• ˕ •マ  meow~
       |､  ~ヽ         
       じしf_,)〳
    "    
}

main(){


    if [ $OPTION_TRUE -eq 0 ]; then
        clear
        echo "
        start -main.sh-

        へ 
      （• ˕ •マ 
        |､  ~ヽ         
        じしf_,)〳       made by LampCat

        #All scripts can be exited by pressing ctrl+c#

        1. Run Test Script (MKlog.sh , ReadLog.sh ) - A new tab will be opened
        2. Log Read Script (ReadLog.sh ) - Only DOWN detected
        3. Log Read Script Runs in Full Detection Mode (ReadLog.sh ) - DOWN, CRITICAL Detection
        4. DETECTION OF DOWN, CRITICAL WITH SPECIFIC WORDS
        5. Option setting
        6. If there's any problem
        q. exit
        "
        printf "$USER_ID@$HOST_NAME> "
        read task_input

        case "$task_input" in
            1)
                test_s
            ;;
            2)
                read_log_d
            ;;
            3)
                read_log_a
            ;;
            4)
                keyword_read_log
            ;;
            5)
                option_setting
            ;;
            6)
                echo -e "\n ====blog===="
                echo " https://oil-lamp-cat.github.io/"
                echo -e "\n ====email===="
                echo -e " raen0730@gmail.com\n"
                exit 1
            ;;
            q)
                echo "EXIT"
                sleep 1
                clear
                exit 1
            ;;
            cat)
                cat_meow
                exit 1
            ;;
            * )
                echo "Invalid input"
                exit 1
            ;;
        esac
    fi
}

while getopts $OPTIONS opts; do
    case $opts in
    \?)
        echo "invalid option"
        usage
        exit 1;;
    t) 
        echo "Running a test script"
        test_s
        OPTION_TRUE=1
    ;;
    h)
        exit 1
    ;;
    :)
        usage
        exit 1
    ;;
    esac
done

if [ ! -f "$OPTION_FILE" ]; then
    clear
    echo "There are no 'OPTION' file."
    touch "$OPTION_FILE"
    echo "#Just put in side square bracket!
#If theres problem contact : https://oil-lamp-cat.github.io/

#Put the log path where you want to read it here
LOG_PATH : [./mlat.log]

#Frequency of alarm output - Default 0.3s
ALARM_REPEAT : [0.3]

#Alarm file - can be turned ON/OFF in OPTION settings
ALARM_FILE : [./beep_alarm.wav]
ALARM_FILE_ON_OFF : [OFF]

#The location of the log file to be used for the test log. 
#You can put the log file you want to use for the test.
TEST_LOG_FILE : [./mlat.log]

#Freqency of log reads - Default 2s, checking that files have changed every 2 seconds.
RDLOG_REPEAT : [2]

#Number of time-out filters, for example, when the default is 10, the time filter is checked once after 10 log file changes have been detected
#If there is a time deleted from the log when checked, delete all time zones from the code's FILTER_LOG variable
#When using the test script, about 10 times was appropriate, but please change it according to the frequency of log reading and the actual log generation time
#To prevent overflow
TIME_FILTER_COUNT : [10]

#Used when using option -k for log detection with specific keywords
#word|word, no space between words, for use grep -E option
#Default setting capture CWP and FUSION
KEYWORD : [CWP|FUSION]

#Set to run for a specific time only ex) H:M, [08:00-18:30]
ALARM_RUNNING_TIME : []

#Set it to not run for a certain period of time ex) H:M, [08:00-18:30]
NO_ALARM_RUNNING_TIME : []
    " > "$OPTION_FILE"
    echo "./OPTION file is created, option setting will be open"
    sleep 2
    option_setting
fi

main
```

</div>
</details>

<details><summary>ReadLog.sh</summary>
<div markdown = "1">

```bash
#!/bin/bash

#option
OPTIONS="f:ahk?"

FOLDER=0

KEYWORD=0

#About optioin -a
CHECK_ALL=false

OPTION_FILE="./OPTION"

#Instructions
usage(){
    echo '
    <options>
    -a : Detect DOWN, CRITICAL - (default : only DOWN)
    -f : file path
    -h : help
    '
}

while getopts $OPTIONS opts; do
    case $opts in
    \?)
        echo "invalid option"
        usage
        exit 1
    ;;
    a)
        echo "Detect DOWN, CRITICAL"
        CHECK_ALL=true
    ;;
    f)
        FOLDER=1
    ;;
    k)
        echo "Setting keywords"
        KEYWORD=1
    ;;
    h)
        usage
        exit 1
    ;;
    esac
done

#Initialize file change time
PREVIOUS_DATE=""

#Initialize log start time, set to initial value because log does not have *
LOG_TIME="\*"

#Number of changes required for time cancellation logic - to avoid bottleneck
TIME_FILTER_COUNTER=0

#Alarm frequency
ALARM_REPEAT=$(grep '^ALARM_REPEAT : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')

#alarm file settings
ALARM_FILE=$(grep '^ALARM_FILE : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')

#Whether to use alarm files
ALARM_FILE_ON_OFF=$(grep '^ALARM_FILE_ON_OFF : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')

#Time Filter Count
TIME_FILTER_COUNT=$(grep '^TIME_FILTER_COUNT : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')

# log file
if [[ $FOLDER = 0 ]]; then
    LOG_FILE="./NEW_LOG_FILE.log"
else
    LOG_FILE=$(grep '^LOG_PATH : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
    if [ ! -f "$LOG_FILE" ]; then
        echo "Log file does not exist in the location, please check again"
        exit 1
    else
        #Logic to import only new logs if log files already exist
        LOG_TIME+=$(cat $LOG_FILE | grep -oP '^\[\d+\]' | tr -d '[]' | sort -u | awk 'BEGIN{sep="|"} {printf "%s%s", sep, $0; sep="|"} END{print ""}')
        echo "$LOG_TIME"
        sleep 1
    fi
fi

#Keyword-based detection
if [[ $KEYWORD = 0 ]]; then
    WORD="\s"
else
    WORD=$(grep '^KEYWORD : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
fi

if [ -z "$ALARM_REPEAT" ]; then
    echo "Alarm repetition variable is empty. Please check OPTION"
    exit 1
fi

#Log Check Frequency
RDLOG_REPEAT=$(grep '^RDLOG_REPEAT : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')

if [ -z "$RDLOG_REPEAT" ]; then
    echo "Log check frequency variable is empty, please check OPTION"
    exit 1
fi
echo "

    ██████╗ ██████╗     ██╗      ██████╗  ██████╗ 
    ██╔══██╗██╔══██╗    ██║     ██╔═══██╗██╔════╝ 
    ██████╔╝██║  ██║    ██║     ██║   ██║██║  ███╗
    ██╔══██╗██║  ██║    ██║     ██║   ██║██║   ██║
    ██║  ██║██████╔╝    ███████╗╚██████╔╝╚██████╔╝
    ╚═╝  ╚═╝╚═════╝     ╚══════╝ ╚═════╝  ╚═════╝ 

"

echo "Run script"
sleep 2
clear

# Alarm output
alarm() {
    if [ "$ALARM_FILE_ON_OFF" = "ON" ]; then
        while true
            do 
                aplay $ALARM_FILE
        done >/dev/null 2>&1
    else
        while true
            do 
                printf '\a'
                sleep $ALARM_REPEAT
        done 
    fi
}

time_limit_check(){
#Run Time Limits
    ALARM_RUNNING_TIME=$(grep '^ALARM_RUNNING_TIME : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')

    if [ -n "$ALARM_RUNNING_TIME" ]; then
        RUNNING_START_TIME=$(echo $ALARM_RUNNING_TIME | cut -d'-' -f1 | sed 's/://')
        RUNNING_END_TIME=$(echo $ALARM_RUNNING_TIME | cut -d'-' -f2 | sed 's/://')
    
    fi

    #Stop Time Limits
    NO_ALARM_RUNNING_TIME=$(grep '^NO_ALARM_RUNNING_TIME : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')

    if [ -n "$NO_ALARM_RUNNING_TIME" ]; then
        NO_RUNNING_START_TIME=$(echo $NO_ALARM_RUNNING_TIME | cut -d'-' -f1 | sed 's/://')
        NO_RUNNING_END_TIME=$(echo $NO_ALARM_RUNNING_TIME | cut -d'-' -f2 | sed 's/://')
    fi

    #Current time
    CURRENT_TIME=$(date +%H%M)

    if [ -n "$ALARM_RUNNING_TIME" ] && [ -n "$NO_ALARM_RUNNING_TIME" ]; then
        if [ "$CURRENT_TIME" -ge "$RUNNING_START_TIME" ] && [ "$CURRENT_TIME" -le "$RUNNING_END_TIME" ] && 
           ! ([ "$CURRENT_TIME" -ge "$NO_RUNNING_START_TIME" ] && [ "$CURRENT_TIME" -le "$NO_RUNNING_END_TIME" ]); then
            return 1
        else
            echo "The alarm is off at the current time"
            return 0
        fi

    # ALARM_RUNNING_TIME만 존재하는 경우
    elif [ -n "$ALARM_RUNNING_TIME" ]; then
        if [ "$CURRENT_TIME" -ge "$RUNNING_START_TIME" ] && [ "$CURRENT_TIME" -le "$RUNNING_END_TIME" ]; then
            return 1
        else
            echo "The alarm is off at the current time"
            return 0
        fi

    # If NO_ALARM_RUNNING_TIME only exists
    elif [ -n "$NO_ALARM_RUNNING_TIME" ]; then
        if ! ([ "$CURRENT_TIME" -ge "$NO_RUNNING_START_TIME" ] && [ "$CURRENT_TIME" -le "$NO_RUNNING_END_TIME" ]); then
            return 1
        else
            echo "The alarm is off at the current time"
            return 0
        fi

    # If both ALARM_RUNNING_TIME and NO_ALARM_RUNNING_TIME are missing
    else
        return 1
    fi
}

# Sound alarm function
sound_alarm() {
    
    #Whether to run alarm
    time_limit_check
    limit=$?

    if [ "$limit" -eq 1 ]; then
        echo -e "\n h - Additional Features\n q - End alarm \n m - mute\n"
        echo -e "============================"
        # alarm run function background
        alarm &
        # Save alarm function process ID
        local alarm_process_id=""
        alarm_process_id=$!
    else
        echo -e "\n h - Additional Features\n q - End alarm \n m - It's not the alarm run time\n"
        echo -e "============================"
    fi

    while read -s -n 1 input
    do
        case "$input" in 
            c)
                if [ "$CHECK_ALL" = true ]; then
                    CHECK_ALL=false
                    echo "Detect only DOWN"
                else
                    CHECK_ALL=true
                    echo "Detect DOWN and CRITICAL"
                fi
            ;;
            h)
                echo -e "\n==========Additional Features==========\n"
                echo " c - Down and CRITICAL detection mode inversion"
                echo " k - Keyword-based detection mode inversion"
                echo " l - Check Down and CRITICAL so far"
                echo " o - Change sound ON/OFF"
                echo " s - Save Down and CRITICAL so far"
                echo -e "\n============================"
            ;;
            k) 
                if [[ $KEYWORD = 1 ]]; then
                    WORD="\s"
                    echo "Keyword Detection : NO"
                    KEYWORD=0
                else
                    WORD=$(grep '^KEYWORD : \[.*\]$' "$OPTION_FILE" | awk -F '[][]' '{print $2}')
                    echo "Keyword Detection : YES"
                    KEYWORD=1
                fi
            ;;
            l)
                gnome-terminal --tab -- bash -c "cat $LOG_FILE | grep -E 'DOWN|CRITICAL'; exec bash"
            ;;
            o)
                if [ "$ALARM_FILE_ON_OFF" = "ON" ]; then
                        ALARM_FILE_ON_OFF="OFF"
                        echo "Make a beep sound"
                else
                    ALARM_FILE_ON_OFF="ON"
                    echo "Make sound with ALARM file"
                fi
            ;;
            s)
                DATE_TIME=$(date +"%Y%m%d_%H%M%S")
                grep -E "DOWN|CRITICAL" mlat.log > SAVE_$DATE_TIME.txt
                echo "File saved to ./SAVE_$DATE_TIME.txt"
            ;;
            q)
                if [[ $alarm_process_id != "" ]]; then
                    kill $alarm_process_id
                fi
                clear
                break
            ;;
            m)
                if [[ $alarm_process_id != "" ]]; then
                    kill $alarm_process_id
                    echo -e "\nYou have ended the alarm. You can continue the operation by pressing q."
                else
                    echo -e "\nIt is already muted. You can press q to continue the operation."
                fi
                alarm_process_id=""
                
            ;;
            *)
                echo "$input is an invalid input."
            ;;
        esac
    done
}

# File Change Confirmation Function
check_file_change(){
    # File Existence
    if [ ! -f "$LOG_FILE" ]; then
        echo "Log file not found."
        echo "Run again after 1 second."
        sleep 1
        clear
        return

    fi

    if [[ ! -s "$LOG_FILE" ]]; then
        echo "The file is empty."
        sleep 1
        clear
        return
    fi

    #File Change Detection: Time-Based
    CURRENT_DATE=$(date -r "$LOG_FILE")
    DATE=$(date +'%Y-%m-%d')
    TIME=$(date +'%H:%M:%S')
    if [[ $CHECK_ALL = true ]]; then
        echo "Detecting DOWN and CRITICAL"
    else
        echo "Only detecting DOWN"
    fi
    if [[ $KEYWORD = 1 ]]; then
        echo "Keywords currently set : $WORD"
    fi
    echo "Current Date: $DATE"
    echo "Current time: $TIME"
    if [ "$CURRENT_DATE" != "$PREVIOUS_DATE" ]; then
        echo "Detection of log changes"
        TIME_FILTER_COUNTER=$((TIME_FILTER_COUNTER + 1))
        #Adjustment of time
        PREVIOUS_DATE=$CURRENT_DATE
        NEW_LOG=$(grep -Ev "$LOG_TIME" "$LOG_FILE" | grep -E $WORD )

        #Check the presence or absence of NEW_LOG
        if [[ -z "$NEW_LOG" ]]; then
            return
        fi

        if [ $CHECK_ALL = true ]; then
            #Detect all
            if echo "$NEW_LOG" | grep -qE "CRITICAL|DOWN"; then
                if echo "$NEW_LOG" | grep -q "CRITICAL"; then
                    echo -e "\n CRITICAL detected!"
                fi
                if echo "$NEW_LOG" | grep -q "DOWN"; then
                    echo -e "\n DOWN detected!"
                fi
                ALL_LOG=$(echo "$NEW_LOG" | grep -E "DOWN|CRITICAL")
                echo -e "\n========= DOWN LOG =========\n"
                echo -e "\n$ALL_LOG"
                echo -e "\n============================"
                sound_alarm
            else
                echo "No DOWN and CRITICAL"
            fi
        else
            #When you get grep, use echo to print out the values in the variables and do grep from there!!!
            #If you just write after grep, it's a file name, so there's a problem!!
            if echo "$NEW_LOG" | grep -q "DOWN"; then
                echo -e "\n DOWN detected!"
                DOWN_LOG=$(echo "$NEW_LOG" | grep "DOWN")
                echo -e "\n========= DOWN LOG =========\n"
                echo -e "\n$DOWN_LOG"
                echo -e "\n============================"
                sound_alarm
            else
                echo "NO DOWN"
            fi
        fi

        #Logic to exclude the past time
        LOG_TIME+=$(echo "$NEW_LOG" | grep -oP '^\[\d+\]' | tr -d '[]' | sort -u | awk 'BEGIN{sep="|"} {printf "%s%s", sep, $0; sep="|"} END{print ""}')

        #Time filter - can be changed in OPTION if necessary, set to -ge, not = just in case
        if [ $TIME_FILTER_COUNTER -ge $TIME_FILTER_COUNT ]; then
            echo "Log Time Filter Operated : $TIME_FILTER_COUNTER"
            #Reset back to 0 when running
            TIME_FILTER_COUNTER=0
            EXIST_IN_LOG_TIME=$(head -n 1 "$LOG_FILE" | grep -oP '^\[\d+\]' | tr -d '[]')
            FILTERED_LOG=$(echo "$LOG_TIME" | tr '|' '\n' | awk -v filter="$EXIST_IN_LOG_TIME" '$1 >= filter' | tr '\n' '|' | sed 's/|$//' | sed 's/ $//')
            LOG_TIME=$FILTERED_LOG  
        fi
    else
        echo "No log changes"
    fi
}

# File Change Main Run
while true
do
    check_file_change
    sleep $RDLOG_REPEAT
    clear
    

done
```

</div>
</details>


[github 링크](https://github.com/oil-lamp-cat/Log-Reader)