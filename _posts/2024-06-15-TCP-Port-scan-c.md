---
title: "[C,C++] 포트 스캐닝 (Synscan, full-open-scan)"
date: 2024-06-15 23:56:15 +09:00
categories: [Security & Hacking]
tags: [C, C++, 포트스캔, 보안도구]
pin: true
---

# 지난번에 이어서

지난번에는 `Bash shell`을 이용한 포트 스캐너를 만들었다

사실 가장 최근에 다른 작업을 잠시 하게 되며 흥미를 가지게 된 언어여서 가능하면 `Bash`를 이용해 `nmap`에 있는 기능들을 구현해 보고자 하였다

허나 `shell`만의 기능으로는 `3-way-handshake` 외의 기능은 구현하기에 어려움이 있었고 다른 언어와 섞어 스크립트를 구현하고자 한다

사실 처음에는 LUA라는 언어를 사용해볼까 하는 생각을 한 적이 있다

LUA는 nmap의 근간이 되는 언어이기에 nmap과 비슷한 기능을 구현할 수 있다면 가장 최적의 언어가 아닐까 싶었다

그러다 [RustScan](https://github.com/RustScan/RustScan)이라는 nmap보다 더 빠른 속도를 가진다고 하는 다른 스캐너를 발견하게 되었다

그래서 또 다시 코드를 살펴보기 시작했지만...

아직 나의 실력으로는 코드를 이해하기에 어려움이 있었다

만약 코드를 뜯어본다 하여도 그 시간이 매우 오래 걸릴 것이라 생각해 이번에는 일단 내가 써본적이 있는 언어인 `C`언어를 선택하게 되었다

python이 탈락한 이유는... 느리다

사실 가장 쉽게 짤 수 있게 사람들이 많이 글을 올려놓기도 하였다만 나는 그 글에 나오는 스캔 방식이 결국 `bash`로 만들었던 기능과 유사했기에 이번에는 `C`를 이용할 것이다

## Tcp Half Open Scan - Tcp SYN Scan

![tcp_halfopenscan](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/76f2a664-4fff-44d2-8170-08fe679dc673)

`Tcp SYN Scan`은 SYN을 보내고 SYN/ACK를 받으면 바로 RST패킷을 보내 연결되지 않도록하여 스텔스 스캔이라고 불리기도 한다

세션 연결에 대한 로그가 남지 않지만 SYN 전송에 대한 기록이 남기에 엄연히 말하자면 완전한 스텔스는 아닌 모양이다

# 코드 구현

자 이제 진짜 시작이다

1. 타겟에 SYN 신호를 보냄
2. SYN/ACK 신호가 돌아오면 열린 포트
3. RST 혹은 FIN 패킷을 보내 바로 연결 되기 전에 종료
4. RST/ACK 플래그가 돌아오면 닫힌 포트

일단 소켓 프로그래밍에 관해 아는 것이 없기에 [블로그를 참조](https://velog.io/@dltmdrl1244/%EC%86%8C%EC%BC%93%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D13-raw-%EC%86%8C%EC%BC%93)하여 공부를 좀 해보자
[요것도](https://velog.io/@ilov1112/%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D-RAW-SOCKET)

[이것도](https://nitwit.tistory.com/18)

[IF_INET](https://coding-leaf.tistory.com/39)

[Raw Socket](https://velog.io/@euijoo3233/0223)

[TCP/IP 소켓](https://hannom.tistory.com/26)

[sys/socket](https://seongmok.com/43)

[C언어 인자 받기](https://bo5mi.tistory.com/165)

[구조체](https://www.tcpschool.com/c/c_struct_intro)

[소켓 프로그래밍](https://www.hackerschool.org/HS_Boards/zboard.php?id=Free_Lectures&no=32)

[sockaddr_in 구조체](https://blog.naver.com/jkssleeky/220603262892)

## 1차

일단 stealth scan을 구현하기 전 소켓 프로그래밍에 익숙해지기 위한 `TCP Full Open Scan`을 만들어보자

```c
#include <stdio.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <string.h>
#include <arpa/inet.h>
#include <unistd.h> //close 쓰기 위해

int main(int argc, char* argv[]){ // 인자 받기
    int sockfd; //소켓 초기화
    struct sockaddr_in dest_addr; //소켓 구조체 선언
    int port = 0; // 포트 초기화
    int ret = 0; // 연결 결과 초기화
    for(port = 1; port <= 1024; port ++) // 스캔 포트 수 1 ~ 1024까지
    {
        sockfd = socket(PF_INET, SOCK_STREAM, 0); //소켓 생성
        memset((char*)&dest_addr,0,sizeof(dest_addr)); //메모리 초기화 함수
        dest_addr.sin_family = AF_INET; //프로토콜 주소체계 저장
        dest_addr.sin_port = htons(port); //사용할 포트 저장
        dest_addr.sin_addr.s_addr = inet_addr(argv[1]); //IP할당
        ret = connect(sockfd,(struct sockaddr*)&dest_addr,sizeof(dest_addr)); //연결
        if(ret != -1){ // 결과 -1 이면 포트 생존
            printf("%d Port Open\n", port);
        }
        close(sockfd); //소켓 닫기
    }
    printf("DONE \n");
    return 0;
}
```
![스크린샷 2024-06-16 10-51-03](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/4a261884-cef7-480d-ada2-e66695690f75)

정확히 631번 포트에서 포트 열림을 확인할 수 있었다

다른 포트에서는 [RST, ACK]닫혔다는 패킷이 보인다

## 2차

이제 `Raw Socket`을 만들 차례이다

[Raw IP, Raw Socket](https://dev-jaeho.tistory.com/4)

[AF_INET vs PF_INET](https://www.bangseongbeom.com/af-inet-vs-pf-inet.html)

[PF_INET과 AF_INET의 차이점](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=ifkiller&logNo=70081338273)

[[TCP/IP 소켓]소켓의 타입과 프로토콜의 설정](https://hannom.tistory.com/27)

[types.h 파일](https://www.ibm.com/docs/ko/aix/7.3?topic=files-typesh-file)

[소켓프로그래밍#1 : 소켓의 이해와 기본 뼈대](https://velog.io/@dltmdrl1244/%EC%86%8C%EC%BC%93%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D1-%EC%86%8C%EC%BC%93%EC%9D%98-%EC%9D%B4%ED%95%B4%EC%99%80-%EA%B8%B0%EB%B3%B8-%EB%BC%88%EB%8C%80)

[[C] 소켓 옵션 제어 ( getsockopt, setsockopt )](https://letitkang.tistory.com/243)

[setsockopt(2) - socket의 속성을 설정하는 함수](https://www.it-note.kr/122)

[TCP Sequence Number와 ACK Number](https://eunhyee.tistory.com/246)

[checksum](https://hojak99.tistory.com/246)

```c
socket(PF_INET, SOCK_STREAM, 0)
```

저번에는 소켓을 만들 때 `PF`를 사용하여 프로토콜 체계를 이용하여 `SOCK_STREAM`으로 안정적인 연결을 지양했었다

하지만 이번에는 `AF`를 이용해 `SOCK_RAW` raw 소켓을 만들어 스텔스 스캔을 구현해보자

```c
raw_socket = socket(AF_INET,SOCK_RAW,IPPROTO_RAW);
```
날것 그대로의 소캣

... 잠시 머리가 아파 중지.. 로컬호스트로 스캔을 했을 때 wireshark에도 잡히지 않아서 머리가 지끈지끈..

## 3차

[c언어 명령행 인자 argc argv : 옵션을 어떻게 처리할까?](https://codingdog.tistory.com/entry/c%EC%96%B8%EC%96%B4-%EB%AA%85%EB%A0%B9%ED%96%89-%EC%9D%B8%EC%9E%90-argc-argv-%EC%98%B5%EC%85%98%EC%9D%84-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%B2%98%EB%A6%AC%ED%95%A0%EA%B9%8C)

[[C언어와 친구들] int argc와 char *argv[]란?](https://bo5mi.tistory.com/165)

### C -Threading을 이용

처음 C로 3-way-handshaking을 구현했을 때에는 thread를 이용해 속도를 비약적으로 향상시켰었다

nmap으로 `127.0.0.1`을 통해 tryhackme 머신을 스캔해 보았을 때 2.3초가 걸리던 것을 C언어를 통해 0.5초까지 줄일 수 있었다

<details><summary>C - Threading</summary>
<div markdown = "1">

```c
//기본 함수
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <pthread.h> //스레드

// 추가적인 함수들
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <sys/time.h>


#define MAX_PORTS 100  // 최대 포트 번호 범위
#define NUM_THREADS 100  // 사용할 스레드 수 (임의로 설정)

struct ScanThreadArgs {
    const char *host;
    int start_port;
    int end_port;
};

// TCP 연결을 시도하여 포트가 열려 있는지 확인하는 함수 (스레드용)
void *scan_ports(void *args) {
    struct ScanThreadArgs *scan_args = (struct ScanThreadArgs *) args;

    for (int port = scan_args->start_port; port <= scan_args->end_port; port++) {
        struct sockaddr_in addr;
        int sockfd, result;

        // 소켓 생성
        if ((sockfd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP)) < 0) {
            perror("socket"); //오류잡이
            continue;
        }

        // 주소 구조체 초기화
        memset(&addr, 0, sizeof(addr));
        addr.sin_family = AF_INET;
        addr.sin_addr.s_addr = inet_addr(scan_args->host);
        addr.sin_port = htons(port);

        // 연결 시도
        result = connect(sockfd, (struct sockaddr *) &addr, sizeof(addr));

        // 연결 결과 확인
        if (result == 0) {
            printf("Port %d open\n", port);
        }

        // 소켓 닫기
        close(sockfd);
    }

    pthread_exit(NULL);
}

// 초 단위 시간을 시, 분, 초로 변환하여 출력하는 함수
void print_time(struct timeval *timeval) {
    struct tm *local_time;
    char time_str[30];

    // 초 단위 시간을 struct tm 구조체로 변환
    local_time = localtime(&timeval->tv_sec);

    // 시간을 시:분:초 형식의 문자열로 변환
    strftime(time_str, sizeof(time_str), "%T", local_time);

    // 변환된 문자열과 마이크로초 출력
    printf("%s.%06ld", time_str, timeval->tv_usec);
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: %s <host>\n", argv[0]);
        return 1;
    }

    char *host = argv[1];
    struct timeval start_time, end_time, elapsed_time;

    // 프로그램 시작 시간 기록
    gettimeofday(&start_time, NULL);
    printf("Program start time: ");
    print_time(&start_time);
    printf("\n");

    // 스레드 배열 및 인자 초기화
    pthread_t threads[NUM_THREADS];
    struct ScanThreadArgs thread_args[NUM_THREADS];
    int ports_per_thread = MAX_PORTS / NUM_THREADS;

    // 스레드 생성 및 실행
    for (int i = 0; i < NUM_THREADS; i++) {
        thread_args[i].host = host;
        thread_args[i].start_port = i * ports_per_thread + 1;
        thread_args[i].end_port = (i + 1) * ports_per_thread;

        if (pthread_create(&threads[i], NULL, scan_ports, (void *) &thread_args[i]) != 0) {
            fprintf(stderr, "Error creating thread %d\n", i);
            return 1;
        }
    }

    // 모든 스레드 종료 대기
    for (int i = 0; i < NUM_THREADS; i++) {
        pthread_join(threads[i], NULL);
    }

    // 프로그램 종료 시간 기록
    gettimeofday(&end_time, NULL);
    printf("Program end time: ");
    print_time(&end_time);
    printf("\n");

    // 총 걸린 시간 계산
    timersub(&end_time, &start_time, &elapsed_time);
    printf("Total elapsed time: %ld seconds %ld microseconds\n", elapsed_time.tv_sec, elapsed_time.tv_usec);

    return 0;
}

```

</div>
</details>

### C++ - async await을 이용

하지만 가만히 생각해보니 쓰레드는 결국 하드웨어에 따라 사용할 수 있는 수가 달라지다보니 이번에는 다른 방법을 사용해 보기로 하였다

그렇게 생각해 낸 것이 async await을 이용한 비동기 처리다

하지만 지금까지 짰던 C언어에서는 불가능 하기에 이번에는 C++를 이용하기로 하였다

<details><summary>C - async await</summary>
<div markdown = "1">

```cpp
#include <iostream>
#include <vector>
#include <future>
#include <cstring> //c언어 스트링 함수 쓰려고
#include <unistd.h>

// 추가적인 헤더파일
#include <sys/time.h> //시간
#include <sys/socket.h> //소켓
#include <arpa/inet.h>



#define MAX_PORTS 1000  // 최대 포트 번호 범위

// TCP 연결을 시도하여 포트가 열려 있는지 확인하는 함수 (비동기 방식)
int scan_port_async(const std::string &host, int port) {
    struct sockaddr_in addr;
    int sockfd, result;

    // 소켓 생성
    if ((sockfd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP)) < 0) {
        perror("socket");
        return -1;
    }

    // 주소 구조체 초기화
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = inet_addr(host.c_str());
    addr.sin_port = htons(port);

    // 연결 시도
    result = connect(sockfd, (struct sockaddr *) &addr, sizeof(addr));

    // 소켓 닫기
    close(sockfd);

    // 연결 결과 반환
    if (result == 0) {
        return port;  // 포트 열림
    } else if (errno == ECONNREFUSED) {
        return 0;  // 포트 닫힘
    } else {
        perror("connect");
        return -1; // 에러 발생
    }
}

// 초 단위 시간을 시, 분, 초로 변환하여 출력하는 함수
void print_time(struct timeval *timeval) {
    struct tm *local_time;
    char time_str[30];

    // 초 단위 시간을 struct tm 구조체로 변환
    local_time = localtime(&timeval->tv_sec);

    // 시간을 시:분:초 형식의 문자열로 변환
    strftime(time_str, sizeof(time_str), "%T", local_time);

    // 변환된 문자열과 마이크로초 출력
    std::cout << time_str << "." << timeval->tv_usec;
}

int main(int argc, char *argv[]) {
    if (argc < 2) { //만약 옵션이 들어오지 않았다면
        std::cerr << "Usage: " << argv[0] << " <host>" << std::endl;
        return 1;
    }

    std::string host = argv[1]; //ip 할당
    struct timeval start_time, end_time, elapsed_time;

    // 프로그램 시작 시간 기록
    gettimeofday(&start_time, nullptr);
    std::cout << "Program start time: ";
    print_time(&start_time);
    std::cout << std::endl;

    std::vector<std::future<int>> futures;
    std::vector<int> open_ports;

    // 비동기적으로 포트 스캔 실행
    for (int port = 1; port <= MAX_PORTS; ++port) {
        futures.push_back(std::async(std::launch::async, scan_port_async, host, port));
    }

    // 모든 비동기 작업 완료 및 결과 처리
    int open_ports_count = 0, closed_ports = 0, error_ports = 0;
    for (auto &future : futures) {
        int result = future.get(); // 비동기 작업 결과 가져오기

        if (result > 0) {
            open_ports.push_back(result);
            open_ports_count;
        } else if (result == 0) {
            ++closed_ports;
        } else {
            ++error_ports;
        }
    }

    // 프로그램 종료 시간 기록
    gettimeofday(&end_time, nullptr);
    std::cout << "Program end time: ";
    print_time(&end_time);
    std::cout << std::endl;

    // 총 걸린 시간 계산
    timersub(&end_time, &start_time, &elapsed_time);
    std::cout << "Total elapsed time: " << elapsed_time.tv_sec << " seconds " << elapsed_time.tv_usec << " microseconds" << std::endl;

    // 결과 출력
    if (!open_ports.empty()) {
        std::cout << "Open ports:";
        for (auto port : open_ports) {
            std::cout << " " << port;
        }
        std::cout << std::endl;
    } else {
        std::cout << "No open ports found." << std::endl;
    }

    std::cout << "Open ports: " << open_ports_count << std::endl;
    std::cout << "Closed ports: " << closed_ports << std::endl;
    std::cout << "Errors: " << error_ports << std::endl;

    return 0;
}

```

</div>
</details>
<br/>

매~우 흡족

## 4차

일단 왜 작동을 안했는지는 찾았다

아무래도 내가 아예 처음부터 배우고 있다보니 여기저기서 코드를 가져와 만들었는데(거의 프랑켄 슈타인)

그 과정에서 패킷이전송되는 것과 받는과정은 wireshark를 통해 확인 했으나 마지막 단계인 `recvfrom`가 갑자기 패킷 전송보다 먼저 실행되면서

'응 패킷 안오네? 계속 대기할거야' 상태가 되어버린다...

C언어를 배우고 나서 정말 이런 경우는 처음이라 (사실 socket프로그래밍은 아예 최초) 일단 좀 더 찾아봐야 해결할 수 있을 것 같다

```c
// 수신용 패킷 생성
sleep(0.2);
```

[네트워크 프로그래밍](https://gdngy.tistory.com/186)

와.. 충격

`sendto`가 실행되고 패킷을 준비한 뒤 보내기 전에 C++코드는 계속 실행되서 `recvfrom`이 먼저 실행되어 멈춰버린 것이였다.. 어쩐지.. wireshark에서도 보내는 패킷도 안보이더라니..

속도가 생명인데 아무래도 중간에 조건을 하나 걸어줘야겠다

> 7/3

아.. 역시 코드가 무슨 역할인지 모르고 그냥 예시를 복사하면 이런 일이 생기는거다..

속도의 문제가 아니였다...

간단히 생각해보면 당연한 것이

sendto를 통해 패킷을 전송한 후 코드에서 바로 recv를 무한루프 돌리면서 내가 원하는 패킷이 왔나 채크하고 있는데 당연히 다음 작업으로 넘어갈 수 있을리가 없다

아무래도 thread를 하나 만들어서 리스너를 뒤에서 실행시켜줘야겠다

아래는 중간 테스트 코드이다

테스트 할 때에는 리스너를 먼저 실행하고 패킷 보내면 된다

<details><summary>패킷 보내기</summary>
<div markdown = "1">

```C
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <unistd.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <arpa/inet.h>
#include <linux/ip.h>
#include <linux/tcp.h>
#include <cstring>
#include <errno.h>
#include <sys/wait.h>

#define LOCAL_IP "172.30.1.32"

//int send_packet(){}

unsigned short in_cksum(u_short *addr, int len)
{

        int         sum=0;

        int         nleft=len;

        u_short     *w=addr;

        u_short     answer=0;

 

        while (nleft > 1){

        sum += *w++;

        nleft -= 2;

        }

 

        if (nleft == 1){

        *(u_char *)(&answer) = *(u_char *)w ;

        sum += answer;

        }

 

        sum = (sum >> 16) + (sum & 0xffff);

        sum += (sum >> 16);

        answer = ~sum;

        return(answer);

}

 

// 가상 헤더 구조체 선언

struct pseudohdr {

        u_int32_t   saddr;

        u_int32_t   daddr;

        u_int8_t    useless;

        u_int8_t    protocol;

        u_int16_t   tcplength;

};

bool syn_ack_response(char* recv_packet, in_addr dest_address)
{
        struct iphdr *iph = (struct iphdr *)recv_packet;
        char iph_protocol = iph->protocol;
        long source_addr = iph->saddr;
        int iph_size = iph->ihl * 4;

        if (iph_protocol == IPPROTO_TCP && source_addr == dest_address.s_addr)
        {
                struct tcphdr *tcph = (struct tcphdr *)(recv_packet + iph_size);
        if (tcph->syn == 1 && tcph->ack == 1)
                return true;
        }
        return false;
}

int main( int argc, char **argv )

{

        unsigned char packet[40];

        int raw_socket, recv_socket;

        int on=1, len ;

        char recv_packet[100], compare[100];

        struct iphdr *iphdr;

        struct tcphdr *tcphdr;

        struct in_addr source_address, dest_address;

        struct sockaddr_in address, target_addr;

        struct pseudohdr *pseudo_header;

        struct in_addr ip;

        struct hostent *target;

        int port;
 

        if( argc < 2 ){

                fprintf( stderr, "Usage : %s Target\n", argv[0] );

                exit(1);

        }

        source_address.s_addr = inet_addr( LOCAL_IP );

        dest_address.s_addr = inet_addr( argv[1] );

        strcpy( compare, argv[1] );

        printf( "\n[Wise Scanner Started.]\n\n" );
 
        // 1번에서부터 500번까지 스캔

        for( port=1; port<140; port++ ){
                printf("%d", port);

                // raw socket 생성

                raw_socket = socket( AF_INET, SOCK_RAW, IPPROTO_RAW );
                if(raw_socket == -1)
                {
                        printf("오류");
                }

                setsockopt( raw_socket, IPPROTO_IP, IP_HDRINCL, (char *)&on, sizeof(on));
                if(setsockopt( raw_socket, IPPROTO_IP, IP_HDRINCL, (char *)&on, sizeof(on)) == -1) {    
                        fprintf(stderr, "socket 생성 error: %s\n", std::strerror(errno));
                        return -1;
                }
 

                // TCP, IP 헤더 초기화

                iphdr = (struct iphdr *)packet;

                memset( (char *)iphdr, 0, 20 );

                tcphdr = (struct tcphdr *)(packet + 20 );

                memset( (char *)tcphdr, 0, 20 );

 

                // TCP 헤더 제작

                tcphdr->source = htons( 777 );

                tcphdr->dest = htons( port );

                tcphdr->seq = htonl( 92929292 );

                tcphdr->ack_seq = htonl( 12121212 );

                tcphdr->doff = 5;

                tcphdr->syn = 1;

                tcphdr->window = htons( 512 );

 

                // 가상 헤더 생성.

                pseudo_header =(struct pseudohdr *)((char*)tcphdr-sizeof(struct pseudohdr));

                pseudo_header->saddr = source_address.s_addr;

                pseudo_header->daddr = dest_address.s_addr;

                pseudo_header->protocol = IPPROTO_TCP;

                pseudo_header->tcplength = htons( sizeof(struct tcphdr) );

 

                // TCP 체크섬 계산.

                tcphdr->check = in_cksum( (u_short *)pseudo_header,sizeof(struct pseudohdr) + sizeof(struct tcphdr) );

 

                // IP 헤더 제작

                iphdr->version = 4;

                iphdr->ihl = 5;

                iphdr->protocol = IPPROTO_TCP;

                iphdr->tot_len = 40;

                iphdr->id = htons( 12345 );

                iphdr->ttl = 60;

                iphdr->saddr = source_address.s_addr;

                iphdr->daddr = dest_address.s_addr;

                // IP 체크섬 계산.

                iphdr->check = in_cksum( (u_short *)iphdr, sizeof(struct iphdr));

 

                address.sin_family = AF_INET;

                address.sin_port = htons( port );

                address.sin_addr.s_addr = dest_address.s_addr;

 

                // 패킷 전송

                if(sendto( raw_socket, &packet, sizeof(packet), 0x0,(struct sockaddr *)&address, sizeof(address)) < 0)
                        std::cerr << "ERROR sending packet" << std::endl;
                
                close( raw_socket );
        }
        printf( "\n[Scan ended.]\n\n" );

}
```

</div>
</details>
<br/>

<details><summary>패킷 받기</summary>
<div markdown = "1">

```C
#include <iostream>
#include <cstring>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/ip.h>
#include <netinet/tcp.h>
#include <unistd.h>

#define BUFFER_SIZE 4096

int main() {
    int raw_socket;
    char buffer[BUFFER_SIZE] = {0};

    // Raw 소켓 생성
    if ((raw_socket = socket(AF_INET, SOCK_RAW, IPPROTO_TCP)) < 0) {
        perror("socket creation failed");
        return 1;
    }

    const char* target_ip = "127.0.0.1";

    std::cout << "started" << std::endl;
    while (true) {
        memset(buffer, 0, BUFFER_SIZE);
        ssize_t packet_size = recv(raw_socket, buffer, BUFFER_SIZE, 0);
        if (packet_size == -1) {
            perror("recv failed");
            break;
        }

        // IP 헤더와 TCP 헤더 파싱
        struct iphdr *ip_header = (struct iphdr*) buffer;
        struct tcphdr *tcp_header = (struct tcphdr*) (buffer + ip_header->ihl*4);

        // SYN 패킷인지 확인
        char dst_ip_str[INET_ADDRSTRLEN];
        inet_ntop(AF_INET, &(ip_header->daddr), dst_ip_str, INET_ADDRSTRLEN);
        if (tcp_header->syn && strcmp(dst_ip_str, target_ip) == 0) {
            std::cout << "========================" << std::endl;
            std::cout << "Received a SYN packet!" << std::endl;
            std::cout << "Source IP: " << inet_ntoa(*(struct in_addr *)&ip_header->saddr) << std::endl;
            std::cout << "Source Port: " << ntohs(tcp_header->source) << std::endl;
            std::cout << "Destination IP: " << inet_ntoa(*(struct in_addr *)&ip_header->daddr) << std::endl;
            std::cout << "Destination Port: " << ntohs(tcp_header->dest) << std::endl;
        }
    }

    close(raw_socket);
    return 0;
}
```

</div>
</details>
<br/>

# 4-1차 이번에는 좀더 코드를 보기 좋게

다른 사람이 만든 예제를 보고 따라하는 중이지만 이번에는 코드를 이해하면서 작성중!

오랜만에 해더파일 작성하려고 하니까 꽤 어렵네요

학교 자료를 보면서 다시 공부했답니다

일단은 `main`실행하면 ip를 받아오고 ip가 2개 이상이면 하나 선택해서 그 ip를 출발 ip로!

나중에 다른 3way-handshaking코드나 udp scan을 구현하게 되면 그것도 한번에 합치려고 make를 이용했습니다

<details><summary>MakeFile</summary>
<div markdown = "1">

```MakeFile
HOS: main.o utils.o SynScanner.o 
	g++ main.o utils.o SynScanner.o -o HOS -pthread

main.o: main.cpp
	g++ -c main.cpp

utils.o: utils.cpp
	g++ -c utils.cpp

SynScanner.o: SynScanner.cpp
	g++ -c SynScanner.cpp

clean:
	rm *.o HOS
```

</div>
</details>
<br/>

<details><summary>main.cpp</summary>
<div markdown = "1">

```cpp
#include "SynScanner.h"

int main(int argc, char ** argv)
{
    if(argc < 2 )
    {
        fprintf( stderr, "Usage : %s Target\n", argv[0] );
        exit(1);
    }

    char* host = argv[1];

    syn_scan(host);
}
```

</div>
</details>
<br/>

<details><summary>SynScanner.cpp</summary>
<div markdown = "1">

```cpp
#include "utils.h"
#include "SynScanner.h"

void syn_scan(char* host)
{   
    //임시
    int ports = 139;

    //unsigned char packet[40];
    char packet[4096] = {0};

    struct iphdr *iphdr;
    struct tcphdr *tcphdr;
    struct sockaddr_in address;

    std::string ipv4 = getIPv4Address();

    //ip from
    long source_address = inet_addr(ipv4.c_str());
    //ip to
    long dest_address = inet_addr(host);
    short flags = TH_SYN;

    //socket 생성
    int send_sock = socket( AF_INET, SOCK_RAW, IPPROTO_RAW );
    if (send_sock < 0)
        cerr << "ERROR opening socket" << endl;
    int recv_sock = socket(AF_INET, SOCK_RAW, IPPROTO_TCP);
    if (recv_sock < 0)
        cerr << "ERROR opening socket" << endl;

    // TCP, IP 헤더 초기화
    //iphdr = (struct iphdr *)packet;
    //memset( (char *)iphdr, 0, 20 );
    //tcphdr = (struct tcphdr *)(packet + 20 );
    //memset( (char *)tcphdr, 0, 20 );

    struct ip *iph = (struct ip *) packet;
    struct tcphdr *tcph = (struct tcphdr *) (packet + sizeof (struct ip));
    
    create_iph(iph, source_address, dest_address);
    create_tcph(tcph, ports, flags);
    set_tcph_checksum(tcph, source_address, dest_address);

    address.sin_family = AF_INET;

    if (sendto (send_sock, &packet, sizeof(packet), 0x0, (struct sockaddr *)&address, sizeof (address)) < 0)
            cerr << "ERROR sending packet" << endl;
}
```

</div>
</details>
<br/>

<details><summary>SynScanner.h</summary>
<div markdown = "1">

```cpp
#ifndef SYN_SCANNER_H
#define SYN_SCANNER_H

#include <stdio.h>
#include <stdlib.h>
#include <iostream>

using namespace std;

void syn_scan(char* host);

#endif
```

</div>
</details>
<br/>

<details><summary>util.cpp</summary>
<div markdown = "1">

```cpp
#include "utils.h"

unsigned short checksum(unsigned short *addr, int len) {
    int nleft = len;
    int sum = 0;
    unsigned short *w = addr;
    unsigned short answer = 0;

    while (nleft > 1)  {
        sum += *w++;
        nleft -= 2;
    }

    if (nleft == 1) {
        *(unsigned char *)(&answer) = *(unsigned char *)w ;
        sum += answer;
    }

    sum = (sum >> 16) + (sum & 0xffff);
    sum += (sum >> 16);
    answer = ~sum;
    return(answer);
}

void set_tcph_checksum(struct tcphdr *tcph, long source_addr, long dest_addr) {
    tcph->th_sum = 0;
    struct tcp_pheader tcp_ph;
    tcp_ph.source_address = source_addr;
    tcp_ph.dest_address = dest_addr;
    tcp_ph.reserved = 0;
    tcp_ph.protocol = IPPROTO_TCP;
    tcp_ph.tcp_length = htons( sizeof(struct tcphdr) );
    memcpy(&tcp_ph.tcph, tcph, sizeof (struct tcphdr));
    tcph->th_sum = checksum( (unsigned short*) &tcp_ph , sizeof (struct tcp_pheader));
}

void create_tcph(struct tcphdr *tcph, short port, short flags) {
    int rand_port = random_number(DYNAMIC_PORT, MAX_PORT);
    tcph->th_sport = htons(rand_port); // has to be > than the dynamically assigned range
    tcph->th_dport = htons(port);
    tcph->th_seq = 0; 
    tcph->th_ack = 0;
    tcph->th_off = sizeof(struct tcphdr) / 4; // number of 32-bit words in tcp header(where tcph begins)
    tcph->th_flags = flags;    
    tcph->th_win = htons(65535);              // maximum allowed window size 
    tcph->th_sum = 0;
    tcph->th_urp = 0;
    //임시
    tcph->th_dport = htons(port);
}

void create_iph(struct ip *iph, long source_addr, long dest_addr) {
    iph->ip_hl = 5;
    iph->ip_v = 4;
    iph->ip_tos = 0;
    iph->ip_len = sizeof(struct ip) + sizeof (struct tcphdr);
    iph->ip_id = 0;    
    iph->ip_off = 0;
    iph->ip_ttl = 255;
    iph->ip_p = IPPROTO_TCP;
    iph->ip_src.s_addr = source_addr;
    iph->ip_dst.s_addr = dest_addr;
    iph->ip_sum = 0; // kernel calculates checksum
}

int random_number(int min, int max){
	std::random_device seeder;

	std::mt19937 rng(seeder());
	std::uniform_int_distribution<int> gen(min, max);
	int r = gen(rng);
	return r;
}

std::string getIPv4Address() {
    char hostname[256];
    if (gethostname(hostname, sizeof(hostname)) == -1) {
        perror("gethostname");
        exit(1);
    }

    struct addrinfo hints, *info, *p;
    int gai_result;

    std::memset(&hints, 0, sizeof(hints));
    hints.ai_family = AF_INET; // Force IPv4
    hints.ai_socktype = SOCK_STREAM;

    if ((gai_result = getaddrinfo(hostname, "http", &hints, &info)) != 0) {
        fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(gai_result));
        exit(1);
    }

    std::vector<std::string> ipAddresses;
    for (p = info; p != nullptr; p = p->ai_next) {
        void *addr;
        struct sockaddr_in *ipv4 = (struct sockaddr_in *)p->ai_addr;
        addr = &(ipv4->sin_addr);

        // Convert the IP to a string and store it:
        char ipstr[INET_ADDRSTRLEN];
        inet_ntop(p->ai_family, addr, ipstr, sizeof(ipstr));
        ipAddresses.push_back(ipstr);
    }

    freeaddrinfo(info); // free the linked list

    if (ipAddresses.size() == 1) {
        return ipAddresses[0]; // Return the single IP address
    } else if (ipAddresses.empty()) {
        return "No IPv4 addresses found.";
    } else {
        std::cout << "Available IPv4 addresses:\n";
        for (int i = 0; i < ipAddresses.size(); ++i) {
            std::cout << i + 1 << ": " << ipAddresses[i] << "\n";
        }

        std::cout << "Select an IP address (1-" << ipAddresses.size() << "): ";
        int choice;
        std::cin >> choice;

        if (choice < 1 || choice > static_cast<int>(ipAddresses.size())) {
            return "Invalid selection.";
        }

        return ipAddresses[choice - 1]; // Return the selected IP address
    }
}
```

</div>
</details>
<br/>

<details><summary>utils.h</summary>
<div markdown = "1">

```cpp
//일단 전에 짜둔 코드에서 있는거 없는거 다 가져왔지용

#include <random>
#include <netdb.h>

#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <unistd.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <arpa/inet.h>
#include <netinet/ip.h>
#include <netinet/tcp.h>
#include <cstring>
#include <errno.h>
#include <sys/wait.h>

const int MAX_PORT = 65535;
const int DYNAMIC_PORT = 49152;

/* "Pseudo tcp header" used for checksum calculation */
struct tcp_pheader {
    unsigned int source_address; // 4 byte/s
    unsigned int dest_address;   // 4 byte/s
    unsigned char reserved;      // 1 byte/s
    unsigned char protocol;      // 1 byte/s
    unsigned short tcp_length;   // 2 byte/s
    struct tcphdr tcph;
};

int random_number(int min, int max);
void set_tcph_checksum(struct tcphdr *tcph, long source_addr, long dest_addr);
void create_tcph(struct tcphdr *tcph, short port, short flags);
void create_iph(struct ip *iph, long source_addr, long dest_addr);
std::string getIPv4Address();
```

</div>
</details>
<br/>

<details><summary>receive.cpp</summary>
<div markdown = "1">
<br/>
아직 패킷 받는 곳까지 구현하지 못해서 일단은 따로 빼놨지요

```cpp
#include <iostream>
#include <cstring>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/ip.h>
#include <netinet/tcp.h>
#include <unistd.h>

#define BUFFER_SIZE 4096

int main() {
    int raw_socket;
    char buffer[BUFFER_SIZE] = {0};

    // Raw 소켓 생성
    if ((raw_socket = socket(AF_INET, SOCK_RAW, IPPROTO_TCP)) < 0) {
        perror("socket creation failed");
        return 1;
    }

    const char* target_ip = "127.0.0.1";

    std::cout << "started" << std::endl;
    while (true) {
        memset(buffer, 0, BUFFER_SIZE);
        ssize_t packet_size = recv(raw_socket, buffer, BUFFER_SIZE, 0);
        if (packet_size == -1) {
            perror("recv failed");
            break;
        }

        // IP 헤더와 TCP 헤더 파싱
        struct iphdr *ip_header = (struct iphdr*) buffer;
        struct tcphdr *tcp_header = (struct tcphdr*) (buffer + ip_header->ihl*4);

        // SYN 패킷인지 확인
        char dst_ip_str[INET_ADDRSTRLEN];
        inet_ntop(AF_INET, &(ip_header->daddr), dst_ip_str, INET_ADDRSTRLEN);
        if (tcp_header->syn && strcmp(dst_ip_str, target_ip) == 0) {
            std::cout << "========================" << std::endl;
            std::cout << "Received a SYN packet!" << std::endl;
            std::cout << "Source IP: " << inet_ntoa(*(struct in_addr *)&ip_header->saddr) << std::endl;
            std::cout << "Source Port: " << ntohs(tcp_header->source) << std::endl;
            std::cout << "Destination IP: " << inet_ntoa(*(struct in_addr *)&ip_header->daddr) << std::endl;
            std::cout << "Destination Port: " << ntohs(tcp_header->dest) << std::endl;
        }
    }

    close(raw_socket);
    return 0;
}

```

</div>
</details>
<br/>

처음은 따라서 만들어가는 것을 시작으로 끝에는 자신만의 것을 만들 수 있기를!

# 5차 

이번에는 리스너를 아예 따로 스레딩 걸어주기로 하였다

[[C++] 멀티 쓰레드, 프로세스, 쓰레드 이해하기, C++ 예제](https://giveme-happyending.tistory.com/224)

[[C/C++ 프로그래밍 : 중급] 13. 스레드](https://gdngy.tistory.com/185)

[[C++ ] std::thread 스레드 사용법](https://eteo.tistory.com/679)

[C++ vector사용법 및 설명 (장&단점)](https://hwan-shell.tistory.com/119)

[[Thread] detach vs join](https://velog.io/@dandb3/Thread-detach-vs-join)

<details><summary>main.cpp</summary>
<div markdown = "1">
<br/>

```cpp
#include "SynScanner.h"

int main(int argc, char ** argv)
{
    if(argc < 2 )
    {
        fprintf( stderr, "Usage : %s Target\n", argv[0] );
        exit(1);
    }

    char* host = argv[1];

    syn_scan(host);
}
```

</div>
</details>
<br/>

<details><summary>SynScanner.cpp</summary>
<div markdown = "1">
<br/>

```cpp
#include "utils.h"
#include "SynScanner.h"

void syn_scan(char* host)
{   
    //임시
    int ports = 1;

    unsigned char packet[40];
    //char packet[4096] = {0};

    struct iphdr *iphdr;
    struct tcphdr *tcphdr;
    struct sockaddr_in address;

    std::string ipv4 = getIPv4Address();

    //ip from
    long source_address = inet_addr(ipv4.c_str());
    //ip to
    long dest_address = inet_addr(host);
    short flags = TH_SYN;

    //socket 생성
    int send_sock = socket( AF_INET, SOCK_RAW, IPPROTO_RAW );
    if (send_sock < 0)
        cerr << "ERROR opening socket" << endl;
    int recv_sock = socket(AF_INET, SOCK_RAW, IPPROTO_TCP);
    if (recv_sock < 0)
        cerr << "ERROR opening socket" << endl;

    // TCP, IP 헤더 초기화
    //iphdr = (struct iphdr *)packet;
    //memset( (char *)iphdr, 0, 20 );
    //tcphdr = (struct tcphdr *)(packet + 20 );
    //memset( (char *)tcphdr, 0, 20 );

    struct ip *iph = (struct ip *) packet;
    struct tcphdr *tcph = (struct tcphdr *) (packet + 20);
    
    create_iph(iph, source_address, dest_address);
    create_tcph(tcph, ports, flags);

    thread sniffer(packet_sniffer, recv_sock, dest_address);

    for (ports; ports < 140; ports++)
    {
        set_tcph_port(tcph, ports);
        set_tcph_checksum(tcph, source_address, dest_address);

        address.sin_family = AF_INET;

        if (sendto (send_sock, &packet, sizeof(packet), 0x0, (struct sockaddr *)&address, sizeof (address)) < 0)
                cerr << "ERROR sending packet" << endl;
        int INTERVAL = 500;
        int rand_interval = random_number(0, INTERVAL / 5);
        this_thread::sleep_for (chrono::milliseconds(INTERVAL + rand_interval));
    }
    sniffer.detach();
    close(send_sock);
    close(recv_sock);
}

```

</div>
</details>
<br/>

<details><summary>SynScanner.h</summary>
<div markdown = "1">
<br/>

```cpp
#ifndef SYN_SCANNER_H
#define SYN_SCANNER_H

#include <stdio.h>
#include <stdlib.h>
#include <iostream>


using namespace std;

void syn_scan(char* host);

#endif
```

</div>
</details>
<br/>

<details><summary>utils.cpp</summary>
<div markdown = "1">
<br/>

```cpp
#include "utils.h"

unsigned short checksum(unsigned short *addr, int len) {
    int nleft = len;
    int sum = 0;
    unsigned short *w = addr;
    unsigned short answer = 0;

    while (nleft > 1)  {
        sum += *w++;
        nleft -= 2;
    }

    if (nleft == 1) {
        *(unsigned char *)(&answer) = *(unsigned char *)w ;
        sum += answer;
    }

    sum = (sum >> 16) + (sum & 0xffff);
    sum += (sum >> 16);
    answer = ~sum;
    return(answer);
}

void set_tcph_checksum(struct tcphdr *tcph, long source_addr, long dest_addr) {
    tcph->th_sum = 0;
    struct tcp_pheader tcp_ph;
    tcp_ph.source_address = source_addr;
    tcp_ph.dest_address = dest_addr;
    tcp_ph.reserved = 0;
    tcp_ph.protocol = IPPROTO_TCP;
    tcp_ph.tcp_length = htons( sizeof(struct tcphdr) );
    memcpy(&tcp_ph.tcph, tcph, sizeof (struct tcphdr));
    tcph->th_sum = checksum( (unsigned short*) &tcp_ph , sizeof (struct tcp_pheader));
}

void create_tcph(struct tcphdr *tcph, short port, short flags) {
    int rand_port = random_number(DYNAMIC_PORT, MAX_PORT);
    tcph->th_sport = htons(rand_port); // has to be > than the dynamically assigned range
    tcph->th_dport = htons(port);
    tcph->th_win = htons(1460);
    tcph->th_seq = htonl(0); 
    tcph->th_ack = htonl(0);
    tcph->th_off = sizeof(struct tcphdr) / 4; // number of 32-bit words in tcp header(where tcph begins)
    tcph->th_flags = flags;    
    tcph->th_win = htons(65535);              // maximum allowed window size 
    tcph->th_sum = 0;
    tcph->th_urp = 0;
}

void set_tcph_port(struct tcphdr *tcph, short port) {
    tcph->th_dport = htons(port);
}

void create_iph(struct ip *iph, long source_addr, long dest_addr) {
    iph->ip_hl = 5;
    iph->ip_v = 4;
    iph->ip_tos = 0;
    iph->ip_len = htons(sizeof(struct ip) + sizeof (struct tcphdr));
    iph->ip_id = htons(0);    
    iph->ip_off = 0;
    iph->ip_ttl = 255;
    iph->ip_p = IPPROTO_TCP;
    iph->ip_src.s_addr = source_addr;
    iph->ip_dst.s_addr = dest_addr;
    iph->ip_sum = 0; // kernel calculates checksum
}

int random_number(int min, int max){
	std::random_device seeder;

	std::mt19937 rng(seeder());
	std::uniform_int_distribution<int> gen(min, max);
	int r = gen(rng);
	return r;
}

void packet_sniffer(int recv_sock, long dest_addr)//, std::string host
{
    while(true)
    {
        char recv_packet[4096] = {0};
        int bytes_received = recv(recv_sock ,recv_packet, sizeof(recv_packet), 0);

        if (bytes_received < 0) {
            std::cerr << "Error receiving packet" << std::endl;
            continue;
        }

        //std::cout << "Bytes received: " << bytes_received << std::endl;

        // 받은 패킷 내용을 헥사덤프로 출력
        // for (int i = 0; i < bytes_received; i++) {
        //     printf("%02x ", (unsigned char)recv_packet[i]);
        // }
        //printf("\n");
    
        bool port_is_open = syn_ack_response(recv_packet, dest_addr);
        //std::cout << port_is_open << std::endl;
        if (port_is_open) {
            struct tcphdr *tcph=(struct tcphdr*)(recv_packet + sizeof(struct ip));
            int port = ntohs(tcph->th_sport);
            std::cout << port <<std::endl;

            //thread_mutex.lock();
            //report[host].push_back(port);
            //thread_mutex.unlock();
        }
    }
}

bool syn_ack_response(char* recv_packet, long dest_addr) {
    struct ip *iph = (struct ip*)recv_packet;
    //std::cout << "IP: " << iph <<std::endl;
    char iph_protocol = iph->ip_p;
    long source_addr = iph->ip_src.s_addr;
    int iph_size = iph->ip_hl*4;

    //std::cout << "IP Protocol: " << static_cast<int>(iph_protocol) << std::endl;
    //std::cout << "Source IP: " << inet_ntoa(*(struct in_addr *)&source_addr) << std::endl;

    if(iph_protocol == IPPROTO_TCP &&source_addr == dest_addr) {
        //printf("됨");
        struct tcphdr *tcph=(struct tcphdr*)(recv_packet + iph_size);
        //std::cout << "TCP Flags: " << static_cast<int>(tcph->th_flags) << std::endl;
        if(tcph->th_flags == (TH_SYN|TH_ACK))
            return true;
    }
    return false;
}

std::string getIPv4Address() {
    char hostname[256];
    if (gethostname(hostname, sizeof(hostname)) == -1) {
        perror("gethostname");
        exit(1);
    }

    struct addrinfo hints, *info, *p;
    int gai_result;

    std::memset(&hints, 0, sizeof(hints));
    hints.ai_family = AF_INET; // Force IPv4
    hints.ai_socktype = SOCK_STREAM;

    if ((gai_result = getaddrinfo(hostname, "http", &hints, &info)) != 0) {
        fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(gai_result));
        exit(1);
    }

    std::vector<std::string> ipAddresses;
    for (p = info; p != nullptr; p = p->ai_next) {
        void *addr;
        struct sockaddr_in *ipv4 = (struct sockaddr_in *)p->ai_addr;
        addr = &(ipv4->sin_addr);

        // Convert the IP to a string and store it:
        char ipstr[INET_ADDRSTRLEN];
        inet_ntop(p->ai_family, addr, ipstr, sizeof(ipstr));
        ipAddresses.push_back(ipstr);
    }

    freeaddrinfo(info); // free the linked list

    if (ipAddresses.size() == 1) {
        return ipAddresses[0]; // Return the single IP address
    } else if (ipAddresses.empty()) {
        return "No IPv4 addresses found.";
    } else {
        std::cout << "Available IPv4 addresses:\n";
        for (int i = 0; i < ipAddresses.size(); ++i) {
            std::cout << i + 1 << ": " << ipAddresses[i] << "\n";
        }

        std::cout << "Select an IP address (1-" << ipAddresses.size() << "): ";
        int choice;
        std::cin >> choice;

        if (choice < 1 || choice > static_cast<int>(ipAddresses.size())) {
            return "Invalid selection.";
        }

        return ipAddresses[choice - 1]; // Return the selected IP address
    }
}
```

</div>
</details>
<br/>

<details><summary>utils.h</summary>
<div markdown = "1">
<br/>

```cpp
#include <random>
#include <netdb.h>
#include <thread>

//일단 원래 필요했던 것들 전부 포함
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <unistd.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <arpa/inet.h>
#include <netinet/ip.h>
#include <netinet/tcp.h>
#include <cstring>
#include <errno.h>
#include <sys/wait.h>

using std::thread;

const int MAX_PORT = 65535;
const int DYNAMIC_PORT = 49152;

/* "Pseudo tcp header" used for checksum calculation */
struct tcp_pheader {
    unsigned int source_address; // 4 byte/s
    unsigned int dest_address;   // 4 byte/s
    unsigned char reserved;      // 1 byte/s
    unsigned char protocol;      // 1 byte/s
    unsigned short tcp_length;   // 2 byte/s
    struct tcphdr tcph;
};

int random_number(int min, int max);
void set_tcph_checksum(struct tcphdr *tcph, long source_addr, long dest_addr);
void create_tcph(struct tcphdr *tcph, short port, short flags);
void create_iph(struct ip *iph, long source_addr, long dest_addr);
void set_tcph_port(struct tcphdr *tcph, short port);
void packet_sniffer(int recv_sock, long dest_addr); //, std::string host
bool syn_ack_response(char* recv_packet, long dest_addr);
std::string getIPv4Address();
```

</div>
</details>
<br/>

아직! 만드는 중이기에 github에 올리기는 미숙하고 테스트 중인 부분들이 많아 일단은 일지에 기록한다

그리고 더 찾아보니까 nmap 소스코드가 `rua`뿐 아니라 `c` `cpp`로도 이루어져 있었다...

난 메인 페이지에 `rua`로 만들어졌다길래 도전했지...

여러분 소스는 있는거 쓰세요...

그래도 꽤 공부가 되고 있어서 기분은 좋다

중간에 패킷이 전송은 되는데 돌아오질 않아서 당최 무슨일인가 싶었지만 알고보니 내가 열어둔 가상 머신이 죽었었다는...

아 맞다 혹시몰라 `MakeFIle`도 저장
<details><summary>MakeFile</summary>
<div markdown = "1">
<br/>

```make
PSCANNER: main.o utils.o SynScanner.o 
	g++ main.o utils.o SynScanner.o -o PSCANNER -pthread

main.o: main.cpp
	g++ -c main.cpp

utils.o: utils.cpp
	g++ -c utils.cpp

SynScanner.o: SynScanner.cpp
	g++ -c SynScanner.cpp

clean:
	rm -rf *.o PSCANNER
```

</div>
</details>
<br/>

# 6차 - (2024-07-05)

> synscanner 완성

[C++ 게임 서버 프로그래밍: 비동기 처리를 위한 std::future, std::promise, std::packaged_task 이해하기](https://velog.io/@enamu/C-future-promise-packagedtask)

[[C++] char*, char[], string 변수의 차이](https://erjuer.tistory.com/57)

으악 다 만들기는 했는데 역시나 nmap의 속도를 이기기에는 무리가 많이 있네요...

2초라니!! 2초 세상에

난 9초나 걸리는데!!!

![image](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/b202b0f0-4343-4cf8-a042-05817a6918de)

그래도 결과는 같게 나오니까 다르면 이제 그 때는 문제가 많은데 지금은 속도만 다르니까 기분이 좋네요 빵끗


그래도 이번 작업은 도전이니까!

그래도 처음에는 `socket`이 무엇이고 `C++`어떻게 짜는지도 모르고 있었는데 2주동안 정말 노력 많이 했네요

확실히 저는 이런게 재밌어요

그런데 뭔가 아쉽달까?

찾아보니 `Synscan`은 큰 폭에서는 `stealth scan`으로 치지만 따로 `xmas scan`, `null scan`등이 있다고 하더군요

나중에 이것도 만들어야겠지?

<details><summary>main.cpp</summary>
<div markdown = "1">
<br/>

```cpp
/*main.cpp*/

#include "SynScanner.h"
#include "utils.h"

std::map<std::string, std::list<int>> report;


void usage(const char* program_name)
{
    std::cerr << "Usage: " << program_name << "[-p port_range] Target" << std::endl;
}

int main(int argc, char ** argv)
{
    //char* host = argv[1];
    int start_port = 1;
    int end_port = 65535;
    int opt;
    int mode=0;

    while ((opt = getopt(argc, argv, "p:hs")) != -1)
    {
        switch (opt)
        {
            case 'p':
            {
                char* dash = std::strchr(optarg, '-');
                if(dash)
                {
                    *dash = '\0';
                    start_port = std::atoi(optarg);
                    end_port = std::atoi(dash + 1);
                }
                else
                {
                    std::cerr << "불가능한 포트 범위";
                    exit(1);
                }
                break;
            }
            case 's':
            {
                mode=1;
                break;
            }
            case '?':
            case 'h':
            {
                usage(argv[0]);
                exit(1);
            }
            default:
            {
                mode=0;
            }
        }
    }

    if (optind >= argc) {
        usage(argv[0]);
        exit(1);
    }

    std::string host = argv[optind];

    switch (mode)
    {
        case 0:
        {
            std::cout << "full open scan을 시작합니다." << std::endl;
            sleep(1);
            break;
        }
        case 1:
        {
            std::cout << "syn scan을 시작합니다." << std::endl;
            sleep(1);
            syn_scan(host, start_port, end_port);
            break;
        }
        default:
        {
            std::cout << "mode 선택 오류 발생" << std::endl;
            break;
        }
    }

    resault_report();
}
```

</div>
</details>
<br/>

<details><summary>Synscanner.cpp</summary>
<div markdown = "1">
<br/>

```cpp
/*Synscanner.cpp*/

#include "utils.h"
#include "SynScanner.h"

void send_packet(int send_sock, const unsigned char* packet, size_t packet_size, const struct sockaddr* address) {
    if (sendto(send_sock, packet, packet_size, 0, address, sizeof(struct sockaddr)) < 0) {
        cerr << "ERROR sending packet" << endl;
    }
}


void syn_scan(std::string desthost, int start_port, int end_port)
{   
    unsigned char packet[40];

    struct timeval start_time, end_time, elapsed_time;
    struct iphdr *iphdr;
    struct tcphdr *tcphdr;
    struct sockaddr_in address;

    std::vector<std::future<int>> futures;
    std::string ipv4 = getIPv4Address();

    //ip from
    long source_address = inet_addr(ipv4.c_str());
    //ip to
    long dest_address = inet_addr(desthost.c_str());
    short flags = TH_SYN;

    //socket 생성
    int send_sock = socket( AF_INET, SOCK_RAW, IPPROTO_RAW );
    if (send_sock < 0)
        cerr << "ERROR opening socket" << endl;
    int recv_sock = socket(AF_INET, SOCK_RAW, IPPROTO_TCP);
    if (recv_sock < 0)
        cerr << "ERROR opening socket" << endl;

    struct ip *iph = (struct ip *) packet;
    struct tcphdr *tcph = (struct tcphdr *) (packet + 20);
    
    create_iph(iph, source_address, dest_address);
    create_tcph(tcph, flags);

    gettimeofday(&start_time, nullptr);

    thread sniffer(packet_sniffer, recv_sock, (struct in_addr ){inet_addr(desthost.c_str())});
    for (int port=start_port; port <= end_port; port++)
    {
        set_tcph_port(tcph, port);
        set_tcph_checksum(tcph, source_address, dest_address);

        address.sin_family = AF_INET;

        auto future = std::async(std::launch::async, send_packet, send_sock, packet, sizeof(packet), (struct sockaddr *)&address);
    }   
    sniffer.detach();
    close(send_sock);
    close(recv_sock);

    gettimeofday(&end_time, nullptr);

    timersub(&end_time, &start_time, &elapsed_time);
    std::cout << "Total elapsed time: " << elapsed_time.tv_sec << " seconds " << elapsed_time.tv_usec << " microseconds" << std::endl;
}
```

</div>
</details>
<br/>
<details><summary>Synscanner.h</summary>
<div markdown = "1">
<br/>

```cpp
/*Synscanner.h*/

#ifndef SYNSCANNER_H
#define SYNSCANNER_H

#include <iostream>
#include <vector>
#include <future>
#include <chrono>
#include <thread>

using namespace std;

void syn_scan(std::string desthost, int start_port, int end_port);

#endif
```

</div>
</details>
<br/>

<details><summary>utils.cpp</summary>
<div markdown = "1">
<br/>

```cpp
/*utils.cpp*/

#include "utils.h"

std::mutex mtx;

unsigned short checksum(unsigned short *addr, int len) {
    int nleft = len;
    int sum = 0;
    unsigned short *w = addr;
    unsigned short answer = 0;

    while (nleft > 1)  {
        sum += *w++;
        nleft -= 2;
    }

    if (nleft == 1) {
        *(unsigned char *)(&answer) = *(unsigned char *)w ;
        sum += answer;
    }

    sum = (sum >> 16) + (sum & 0xffff);
    sum += (sum >> 16);
    answer = ~sum;
    return(answer);
}

void set_tcph_checksum(struct tcphdr *tcph, long source_addr, long dest_addr) {
    tcph->th_sum = 0;
    struct tcp_pheader tcp_ph;
    tcp_ph.source_address = source_addr;
    tcp_ph.dest_address = dest_addr;
    tcp_ph.reserved = 0;
    tcp_ph.protocol = IPPROTO_TCP;
    tcp_ph.tcp_length = htons( sizeof(struct tcphdr) );
    memcpy(&tcp_ph.tcph, tcph, sizeof (struct tcphdr));
    tcph->th_sum = checksum( (unsigned short*) &tcp_ph , sizeof (struct tcp_pheader));
}

void create_tcph(struct tcphdr *tcph, short flags) {
    int rand_port = random_number(DYNAMIC_PORT, MAX_PORT);
    tcph->th_sport = htons(rand_port); // has to be > than the dynamically assigned range
    tcph->th_win = htons(1460);
    tcph->th_dport = htons(1);
    tcph->th_seq = htonl(0); 
    tcph->th_ack = htonl(0);
    tcph->th_off = sizeof(struct tcphdr) / 4; // number of 32-bit words in tcp header(where tcph begins)
    tcph->th_flags = flags;    
    tcph->th_win = htons(65535);              // maximum allowed window size 
    tcph->th_sum = 0;
    tcph->th_urp = 0;
}

void set_tcph_port(struct tcphdr *tcph, short port) {
    tcph->th_dport = htons(port);
}

void create_iph(struct ip *iph, long source_addr, long dest_addr) {
    iph->ip_hl = 5;
    iph->ip_v = 4;
    iph->ip_tos = 0;
    iph->ip_len = htons(sizeof(struct ip) + sizeof (struct tcphdr));
    iph->ip_id = htons(0);    
    iph->ip_off = 0;
    iph->ip_ttl = 255;
    iph->ip_p = IPPROTO_TCP;
    iph->ip_src.s_addr = source_addr;
    iph->ip_dst.s_addr = dest_addr;
    iph->ip_sum = 0; // kernel calculates checksum
}

int random_number(int min, int max){
	std::random_device seeder;

	std::mt19937 rng(seeder());
	std::uniform_int_distribution<int> gen(min, max);
	int r = gen(rng);
	return r;
}

void resault_report()
{
    std::cout << "Scan results:" << std::endl;
    mtx.lock();
    for (const auto& pair : report)
    {
        std::cout << "Host: " << pair.first << std::endl;
        for (int port : pair.second)
        {
            std::cout << "Port: " << port << " is open." << std::endl;
        }
    }
    mtx.unlock();
}

void packet_sniffer(int recv_sock, struct in_addr dest_addr)
{
    char* host = inet_ntoa(dest_addr);
    std::string host_str(host);
    while(true)
    {
        char recv_packet[4096] = {0};
        int bytes_received = recv(recv_sock ,recv_packet, sizeof(recv_packet), 0);

        if (bytes_received < 0) {
            std::cerr << "Error receiving packet" << std::endl;
            continue;
        }

        bool port_is_open = syn_ack_response(recv_packet, dest_addr);
        if (port_is_open) {
            struct tcphdr *tcph=(struct tcphdr*)(recv_packet + sizeof(struct ip));
            int port = ntohs(tcph->th_sport);

            mtx.lock();
            report[host].push_back(port);
            mtx.unlock();
        }
    }
}

// 초 단위 시간을 시, 분, 초로 변환하여 출력하는 함수
void print_time(struct timeval *timeval) {
    struct tm *local_time;
    char time_str[30];

    // 초 단위 시간을 struct tm 구조체로 변환
    local_time = localtime(&timeval->tv_sec);

    // 시간을 시:분:초 형식의 문자열로 변환
    strftime(time_str, sizeof(time_str), "%T", local_time);

    // 변환된 문자열과 마이크로초 출력
    std::cout << time_str << "." << timeval->tv_usec;
}

bool syn_ack_response(char* recv_packet, struct in_addr dest_addr) {
    struct ip *iph = (struct ip*)recv_packet;
    char iph_protocol = iph->ip_p;
    long source_addr = iph->ip_src.s_addr;
    int iph_size = iph->ip_hl*4;


    if(iph_protocol == IPPROTO_TCP && memcmp(&source_addr, &dest_addr, sizeof(struct in_addr)) == 0) {
        struct tcphdr *tcph=(struct tcphdr*)(recv_packet + iph_size);
        if(tcph->th_flags == (TH_SYN|TH_ACK))
            return true;
    }
    return false;
}

std::string getIPv4Address() {
    char hostname[256];
    if (gethostname(hostname, sizeof(hostname)) == -1) {
        perror("gethostname");
        exit(1);
    }

    struct addrinfo hints, *info, *p;
    int gai_result;

    std::memset(&hints, 0, sizeof(hints));
    hints.ai_family = AF_INET; // Force IPv4
    hints.ai_socktype = SOCK_STREAM;

    if ((gai_result = getaddrinfo(hostname, "http", &hints, &info)) != 0) {
        fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(gai_result));
        exit(1);
    }

    std::vector<std::string> ipAddresses;
    for (p = info; p != nullptr; p = p->ai_next) {
        void *addr;
        struct sockaddr_in *ipv4 = (struct sockaddr_in *)p->ai_addr;
        addr = &(ipv4->sin_addr);

        // Convert the IP to a string and store it:
        char ipstr[INET_ADDRSTRLEN];
        inet_ntop(p->ai_family, addr, ipstr, sizeof(ipstr));
        ipAddresses.push_back(ipstr);
    }

    freeaddrinfo(info); // free the linked list

    if (ipAddresses.size() == 1) {
        return ipAddresses[0]; // Return the single IP address
    } else if (ipAddresses.empty()) {
        return "No IPv4 addresses found.";
    } else {
        std::cout << "Available IPv4 addresses:\n";
        for (int i = 0; i < ipAddresses.size(); ++i) {
            std::cout << i + 1 << ": " << ipAddresses[i] << "\n";
        }

        std::cout << "Select an IP address (1-" << ipAddresses.size() << "): ";
        int choice;
        std::cin >> choice;

        if (choice < 1 || choice > static_cast<int>(ipAddresses.size())) {
            return "Invalid selection.";
        }

        return ipAddresses[choice - 1]; // Return the selected IP address
    }
}
```

</div>
</details>
<br/>
<details><summary>utils.h</summary>
<div markdown = "1">
<br/>

```cpp
/*utils.h*/

#include <random>
#include <netdb.h>
#include <thread>
#include <future>
#include <sys/time.h>
#include <mutex>
#include <map>
#include <list>
#include <string.h>

//일단 원래 필요했던 것들 전부 포함
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <unistd.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <arpa/inet.h>
#include <netinet/ip.h>
#include <netinet/tcp.h>
#include <cstring>
#include <errno.h>
#include <sys/wait.h>

using std::thread;
extern std::map<std::string, std::list<int>> report;
extern std::mutex mtx;


const int MAX_PORT = 65535;
const int DYNAMIC_PORT = 49152;

/* "Pseudo tcp header" used for checksum calculation */
struct tcp_pheader {
    unsigned int source_address; // 4 byte/s
    unsigned int dest_address;   // 4 byte/s
    unsigned char reserved;      // 1 byte/s
    unsigned char protocol;      // 1 byte/s
    unsigned short tcp_length;   // 2 byte/s
    struct tcphdr tcph;
};

int random_number(int min, int max);
void resault_report();
void set_tcph_checksum(struct tcphdr *tcph, long source_addr, long dest_addr);
void create_tcph(struct tcphdr *tcph, short flags);
void create_iph(struct ip *iph, long source_addr, long dest_addr);
void set_tcph_port(struct tcphdr *tcph, short port);
void packet_sniffer(int recv_sock, struct in_addr dest_addr);
void print_time(struct timeval *timeval);
bool syn_ack_response(char* recv_packet, struct in_addr dest_addr);
std::string getIPv4Address();
```

</div>
</details>
<br/>

> **2024-07-05-22-34 ENDING**