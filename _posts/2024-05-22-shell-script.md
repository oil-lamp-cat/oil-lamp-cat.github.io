---
title: "Shell Script"
date: 2024-5-22 09:25:15 +09:00
categories: [System & Linux]
tags: [Linux, Shell-Script, Bash]
pin: true
---

# 쉘(Shell)이란?

운영체제에서 커널과 사용자 사이에서 사용자의 명령어를 해석하고 그 처리 결과를 뿌려주는 시스템 프로그램이다

내가 사용할 리눅스에서 사용되는 shell은 `./bash`, `./sh`, `./zsh`등이 있다

# Dash Script
./sh

## Shell Script 생성
Shell Script를 생성하기 위한 두가지 명령어가 있다

`touch [Option] [FileName]`

`vim [FileName]`

파일을 생성하고 한번 실행까지 해보자

```
raen@raen:~/문서/ShellScriptStudy$ touch TouchSh.sh
raen@raen:~/문서/ShellScriptStudy$ vim VimSh.sh
raen@raen:~/문서/ShellScriptStudy$ ls
TouchSh.sh  VimSh.sh
```

이 중 `vim`명령어의 경우에는 파일이 없다면 생성과 동시에 실행 하기에 빠져나오기 위해 `ESC + : + wq`를 눌러 빠져나올 수 있다

실행하기 위한 명령어는 `sh [FileName]`, `bash [FileName]`, `chmod 755 [FileName] + ./[FileName]` 중 하나를 사용하면 된다

마지막 방법인 chmod 755를 사용하는 이유는 권한문제라고 하는데 나중에 더 다루기로 하자

```
raen@raen:~/문서/ShellScriptStudy$ ls
TouchSh.sh  VimSh.sh
raen@raen:~/문서/ShellScriptStudy$ sh TouchSh.sh 
```

라고 해서 실행시켜보아도 당연히 아직은 아무 코드도 없기에 출력되는 것이 없다

## 첫번쨰 행 - Shebang

쉘 스크립트를 작성할 떄는 꼭 첫번쨰 행에 어떤 쉘로 스크립트를 실행할 것인지 정의해줘야 한다다

```
#!/bin/sh
```

그 쉘에는 여러 종류가 있다

- sh : 가장 기초적인 유닉스 쉘
- ksh : sh를 확장해서 만든 콘쉘
- csh : C언어를 기반으로 만든 쉘
- bash : 브라이언 폭스에 의해 만들어진 쉘로 sh와 대부분 호환된다

## 출력 - echo

이제 한번 코드의 제 1 관문인 Hello World를 출력해보자

`vim VimSh.sh` 명령어를 통해 scipt 편집으로 들어가 `i`를 눌러 커서 왼쪽에 문자 삽입 모드로 스크립트를 넣자

```
#! /bin/sh

echo "Hello, World"
```

```
raen@raen:~/문서/ShellScriptStudy$ sh VimSh.sh 
Hello, World
```

추가적으로  `#`를 행 맨 앞에 넣어 주석처리 할 수 있다

## 입력 - read

입력하기 위해 `read`를 사용한다

입력한 변수를 출력하기 위해서는 `$`를 이용하면 된다

```
#! /bin/sh


read NAME
echo "Hello, $NAME"
```

실행해보면

```
raen@raen:~/문서/ShellScriptStudy$ sh VimSh.sh 
Raen
Hello, Raen
```

이런식으로 출력된다

## 변수

변수에는 몇가지 규칙이 있다

1. 변수의 이름은 영문, 숫자, 언더바를 사용할 수 있다
2. `=`을 이용해 변수를 생성, 대입할 수 있다
3. `=`의 앞 뒤에 공백이 있어서는 안된다
4. 문자열의 경우 `""`로 감싼다
5. 하나의 변수에는 하나의 값만 보존된다
6. 변수치환을 위해 `$변수이름`으로 치환할 수 있다
7. 변수를 할당하지 않고 치환하게 되면 `null`값이 나온다
8. `\`를 통해 변수가 아닌 채로 사용할 수 있게 된다

한번 직접 해보도록 하자

```
#!/bin/sh

var1="변수1"
var_2="_변수2"
VAR_3="뼌쑤3"

echo "var1 = $var1, var_2 = $var_2, VAR_3 = $VAR_3, 빈것 = $var_null"
```

위처럼 입력하면

```
raen@raen:~/문서/ShellScriptStudy$ sh Variable.sh 
var1 = 변수1, var_2 = _변수2, VAR_3 = 뼌쑤3, 빈것 =
```

생각한 대로 잘 나온다

그렇다면 중간에 변수 값을 삭제 혹은 덮어 쓰거나 덮어쓰는 것을 막는 방법은 무었일까?

`unset`으로 변수를 삭제할 수 있다

덮어 쓰는 방법은 말 그대로 변수를 재할당 해주면 된다

`readonly`를 사용하여 덮어쓰기를 방지한다

직접 해보면

```
raen@raen:~/문서/ShellScriptStudy$ sh Variable_2.sh 
변수 = 변수
변경 후  = 뼌쑤
변수가 있었는데
없어졌네요 
Variable_2.sh: 21: var: is read only
```

## 특별한 변수 

|  변수   |                                         기능                                          |
| :-----: | :-----------------------------------------------------------------------------------: |
|   $0    |                                     스크립트 이름                                     |
| $1 ~ $9 | 입력 값들이 순서대로 저장되며, 인수 혹은 위치 매개변수(Positional Parameter)라고 표현 |
|   $#    |                              스크립트에 전달된 인수의 수                              |
|   $*    |                             모든 인수를 모아 하나로 처리                              |
|   $@    |                                모든 인수를 하나씩 처리                                |
|   $?    |                     직전에 실행한 커맨드의 종료값, 0 성공, 1 실패                     |
|   $$    |                               쉘 스크립트의 프로세스 ID                               |
|   $!    |                       마지막으로 실행한 백그라운드 프로세스 ID                        |

스크립트를 짜 시도해 봅시다

```
#!/bin/sh

echo "\$0-스크립트 이름 : $0"
echo "\$1-1번째 인수 : $1"
echo "\$2-2번째 인수 : $2"
echo "\$3-3번째 인수 : $3"
echo "\$#-인수의 수 : $#"
echo "\$* : $*"
echo "\$@ : $@"
echo "\$? : $?"
echo "\$$ : $$"
echo "\$! : $!"
```

이 스크립트를 인수 없이 그냥 실행하게 되면

```
raen@raen:~/문서/ShellScriptStudy$ sh UniqueVariable.sh 
$0-스크립트 이름 : UniqueVariable.sh
$1-1번째 인수 : 
$2-2번째 인수 : 
$3-3번째 인수 : 
$#-인수의 수 : 0
$* : 
$@ : 
$? : 0
$$ : 8045
$! : 
```

이런 결과가 나오게 된다

입력된 인수가 없으니 당연한 결과다

그럼 인수를 넣고 실행시키면?

```
raen@raen:~/문서/ShellScriptStudy$ sh UniqueVariable.sh insu1 insu2 insu3
$0-스크립트 이름 : UniqueVariable.sh
$1-1번째 인수 : insu1
$2-2번째 인수 : insu2
$3-3번째 인수 : insu3
$#-인수의 수 : 3
$* : insu1 insu2 insu3
$@ : insu1 insu2 insu3
$? : 0
$$ : 8542
$! : 
```

이렇게 실행 결과가 나온답니다!

그런데 아무리 봐도 `$*`과 `$@`의 차이를 모르겠어서 찾다가 아주 좋은 블로그를 발견했습니다

[Jaeyeon Baek - [sh] "$*" 과 "$@"의 차이](https://jybaek.tistory.com/477)

간단하게 요약하자면 `$*`명령어는 인수를 통째로 하나로 취급하고 `$@`명령어는 인수 각각을 하나의 단어로 취급한다는 의미이다

## 변수와 특수문자

|문법|설명|
|${var}|변수 값을 바꿔 넣는다|
|${var:-문자열}|변수가 아직 세팅되지 않거나 공백의 문자열일 경우 `문자열`을 반환한다. `var 에는 저장되지 않는다`|
|${var:=문자열}|변수가 아직 세팅되지 않거나 공백의 문자열의 `문자열`을 반환한다. `var에 저장된다.`|
|${var:?문자열}|변수가 아직 세팅되지 않거나 공백 문자열의 경우 치환에 실패하고 에러가 표시된다|
|${var:+문자열}|변수가 세팅되지 않은 경우 문자열 반환 `var에는 저장되지 않는다`|

직접 해보자

```
#!/bin/sh

echo "1 - ${var:-문자열1}"
echo "2 - var = ${var}"
echo "3 - ${var:=문자열3}"
echo "4 - var = ${var}"
unset var
echo "5 - ${var:+문자열5}"
echo "6 - var = $var"
var="새로운 문자열"
echo "7 - ${var:+문자열7}"
echo "8 - var = $var"
echo "9 - ${var:?에러}"
echo "10 - var = ${var}"
```

결과는?

```
raen@raen:~/문서/ShellScriptStudy$ sh VariableSC.sh 
1 - 문자열1
2 - var = 
3 - 문자열3
4 - var = 문자열3
5 - 
6 - var = 
7 - 문자열7
8 - var = 새로운 문자열
9 - 새로운 문자열
10 - var = 새로운 문자열
```

## 연산자

| 연산자 |           의미           |
| :----: | :----------------------: |
|   +    |           덧셈           |
|   -    |           뺄셈           |
|  \\*   |           제곱           |
|   /    |          나눗셈          |
|   %    |          나머지          |
|   =    |           저장           |
|   ==   |           동일           |
|   !=   |           다름           |
|  -eq   |           동일           |
|  -ne   |           다름           |
|  -gt   |         보다 큼          |
|  -lt   |        보다 작음         |
|  -ge   |     보다 크거나 같음     |
|  -le   |     보다 작거나 같음     |
|   !    |           아님           |
|   -a   |        -이고-이면        |
|   -z   |    문자열이 비었는가     |
|   -n   | 문자열이 비어있지 않은가 |

## if 조건문

if 조건문의 기본 문법은 다음과 같다

```
if [조건] then
elif [조건] then
fi
```

## switch 조건문

switch 조건문의 기본 문법은 다음과 같다

```
case [변수] in [조건]) 스크립트;; esac
```

요건 한번 써보도록 하죠

```
#!/bin/sh

read GENDER

case "$GENDER" in
        "male") echo "남성입니다";;
        "female") echo "여성입니다";;
        *) echo "잘못된 입력입니다"
esac
```

보아하니 쉘에서 `*`는 전부? 라는 의미인 것 같네요

```
raen@raen:~/문서/ShellScriptStudy$ sh switch.sh 
male
남성입니다
```

## while 반복문

```
while [조건] do 스크립트 done
```

조건이 일치할 때마다 반복된다

`break`로 종료할 수 있다

`continue`로 현재 루프를 건너뛸 수 있다

한번 0-4까지 출력하는 스크립트를 짜보죠

```
#!/bin/sh

a=0
while [ $a -lt 5 ]
do
        echo $a
        a=`expr $a + 1`
done
```

이 때 주의하셔야 할 것이 바로 `공백`입니다

`while [조건문]` 에서 이 조건문의 시작부분 $a 앞에 공백을 두지 않을 경우 `while.sh: 4: [0: not found`과 같은 오류를 마주하게 될 것입니다

또한 저기 보이는 `expr`은 변수에 수치를 넣기 전 계산을 해주기 위해 필요한 명령어입니다

```
raen@raen:~/문서/ShellScriptStudy$ sh while.sh 
0
1
2
3
4
```

## until 반복문

```
untile [조건] do script done
```

조건이 일치할 때 까지 반복

```
#!/bin/sh

a=0
until [ ! $a -lt 5 ]
do
        echo $a
        a=`expr $a + 1`
done
```

결과는

```
raen@raen:~/문서/ShellScriptStudy$ sh UntilLoop.sh 
0
1
2
3
4
```

성공

## for 반복문

```
for 변수 in 조건 do 스크립트 done
```

조건과 변수가 일치하면 스크립트가 실행된다

```
#!/bin/sh

for var in 0 1 2 3 4
do
        echo $var
done

```

조건 값이 변수에 들어가서 스크립트가 실행되었네요

```
raen@raen:~/문서/ShellScriptStudy$ sh forLoop.sh 
0
1
2
3
4
```

## 함수

다른 언어를 해 보았다면 꽤나 익숙할겁니다

```
함수이름(){
    스크립트
}

#함수 호출
함수이름
```

인수는 그저 뒤에 붙여 쓰면 됩니다

```
#!/bin/sh

Function(){
        echo "함수 테스트"
}

FunctionParam(){
        echo "인수:$1"
}

Function
FunctionParam param1
```

결과는?

```
raen@raen:~/문서/ShellScriptStudy$ sh Functionsh.sh 
함수 테스트
인수:param1
```

좋습니다

# Bash Script
./bash

## 예약 변수

이미 정의된 변수

|   변수   |              설명              |
| :------: | :----------------------------: |
|   HOME   |       사용자 홈 디렉토리       |
|   PATH   |   실행 파일의 경로, 환경변수   |
|   LANG   | 프로그램 실행 시 지원되는 언어 |
|   UID    |          사용자의 UID          |
|  SHELL   | 사용자가 로그인시 실행되는 쉘  |
|   USER   |       사용자의 계정 이름       |
| FUNCNAME |  현재 실행되고 있는 함수 이름  |
|   TERM   |         로그인 터미널          |

```
#!/bin/bash

echo "HOME : $HOME"
echo "PATH : $PATH"
echo "LANG : $LANG"
echo "UID : $UID"
echo "SHELL : $SHELL"
echo "FUNCNAME : $FUNCNAME"
echo "TERM : $TERM"
```

위 스크립트를 이용해 한번에 전부 확인할 수 있다

추가적으로 

- set : 셸 변수 출력
- env : 환경 변수 출력
- export : 자식 프로세스에서도 변수 사용 가능하게 함, 전역 변수처럼
- unset : 선언된 변수 제거

## 쉘 이스케이프 문자

`\f` 앞 문자열 만큼 열을 밀어서 이동

`\n` 줄바꿈

`\r` 앞 문자열의 앞 부분부터 뒷 문자열 만큼 대체하고 반환

`\t` 탭

## 쉘 산술 연산

Bash 변수는 `문자열`이기에 특수한 문법을 사용하여 계산하여야 한다

### `expr`

`(역 따옴표)로 감싸주어야 한다

피연산자와 연산자 사이에 공백이 필요하다

우선순위를 지정하기위해 `()`를 사용하려면 `\`을 이용해 특수문자라고 상기시켜줘야 한다

`*`(곱셈 문자)는 `\`처리해주어야 한다

```
num=`expr \( 3 \* 5 \) / 4 + 7`
```

### `let`

```
#!/bin/bash

num1=42
num2=9
 
let re=num1+num2 #Add
echo "add:$re"

let re=num1-num2 #Sub
echo "sub:$re"

let re=num1*num2 #Mul
echo "mul:$re"

let re=num1/num2 #Div
echo "div:$re"

let re=num1%num2 #Mod
echo "mod:$re"
```

### `$(())`

```
#!/bin/bash

num1=42
num2=9
 
echo add:$((num1+num2))
echo sub:$((num1-num2))
echo mul:$((num1*num2))
echo div:$((num1/num2))
echo mod:$((num1%num2))
```

## 배열 생성

배열에 관해 설명하기 전 `dash`는 배열을 사용 할 수 없더군요

```
Array.sh: 3: Syntax error: "(" unexpected
```

그래서 이번에는 `bash`를 사용하겠습니다

```
#!/bin/bash

array_name=("value1" "value2" "value3")

echo "array_name[0] = ${array_name[0]}"
echo "array_name[1] = ${array_name[1]}"
echo "array_name[2] = ${array_name[2]}"

echo "array_all[*] = ${array_name[*]}"
echo "array_all[*] = ${array_name[@]}"

```

첫 줄에 /bin/sh가 아닌 /bin/bash가 되었습니다

찾아보다가 안 사실인데 sh는 dash라고 하더군요

```
raen@raen:~/문서/ShellScriptStudy$ bash Array.sh 
array_name[0] = value1
array_name[1] = value2
array_name[2] = value3
array_all[*] = value1 value2 value3
array_all[*] = value1 value2 value3
```

잘 나오는군요

## 배열 추가

기존 배열 0, 1, 2 번을 바탕으로 추가해 봅시다

```
#!/bin/bash

arr=("array1" "array2" "array3")

echo "처음 전체 배열 : ${arr[*]}"

arr[3]="array4" #3번에 배열 추가
arr+=("array5") #4번에 배열 추가
arr[${#arr[@]}]="array6" #배열의 인덱스를 이용해 5번에 추가

echo "바뀐 배열 : ${arr[*]}"
echo "배열 길이 : ${#arr[@]}"

echo "2~3 잘라서 출력 : ${arr[@]:2:3}"
```

마지막에 `arr[@]`부분을 `arr[*]`로 바꾸면 안될 줄 알았는데 되네요... 이 부분은 좀 더 공부해봐야겠어요

```
raen@raen:~/문서/ShellScriptStudy$ bash ArrayAdd.sh 
처음 전체 배열 : array1 array2 array3
바뀐 배열 : array1 array2 array3 array4 array5 array6
배열 길이 : 6
2~3 잘라서 출력 : array3 array4 array5
```

## 배열 삭제

`/`를 이용해 원하는 문자열 부분을 삭제할 수 있다

그러나 `unset`을 이용한 삭제를 권고한다고 한다 

아무래도 `/`는 전체를 다 돌며 같은것이 있을 경우 삭제하지만 `unset`은 특정 인덱스의 요소를 삭제하기에 그런 듯 싶다

```
#!/bin/bash

arr=(1 2 3)

echo "처음 배열 : ${arr[@]}"

remove_element=(3)

arr=( "${arr[@]/$remove_element}" )

echo ${arr[@]}

unset arr[1]

echo ${arr[@]}

unset arr #전체 배열 삭제

echo ${arr[@]}
```

결과는

```
raen@raen-960QFG:~/문서/ShellScriptStudy$ bash ArrayDelete.sh 
처음 배열 : 1 2 3
1 2
1

```

## MAP - 파이썬의 딕셔너리

`key`와 `value`로 이루어진 배열

기본 문법은 `declare -A 변수` 형태이다



## 비교식

| 비표 표현 |          설명          |
| :-------: | :--------------------: |
|     !     |       논리 부정        |
|     ~     |       비트 부정        |
|    **     |         지수화         |
|    <<     |  비트 왼쪽으로 옮기기  |
|    >>     | 비트 오른쪽으로 옮기기 |
|     &     |     비트 단위 AND      |
|    \|     |      비트 단위 OR      |
|    &&     |        논리 AND        |
|   \|\|    |        논리 OR         |
|   num++   |        후위증가        |
|   num--   |        후위감소        |
|    num    |        전위증가        |
|   --num   |        전위감소        |
