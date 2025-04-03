---
title: "[Python] TCP 서버 통신 & 로그 분석 프로젝트"
date: 2025-1-23 20:58:15 +09:00
categories: [python, 서버]
tags: [작업, GUI]
pin: true
---

## 파이썬으로 하는 TCP 통신
![Image](https://github.com/user-attachments/assets/f334310e-b5ec-4d1a-88c3-8f6d3278b968)

내가 이번에 하려는 작업은 다음과 같다

1. `장치(Device)`에서 정보를 받아서 `서버1(Server1)`에 데이터를 보낸다
2. `서버1(Server1)`에서 필요한 정보를 걸러낸 뒤에 걸러낸 정보는 또 따로 저장하고 나머지 필요한 정보들을 `서버2(Server2)`에 다시 보낸다
3. `서버2(Server2)`와 다시 `서버1(Server1)` 통신 하면서 빠진 파일이 있는지 확인
4. 만약 빠진 파일이 있거나 걸러낸 정보 중에 보내고 싶은 것이 있다면 `GUI`를 통해 확인 후 다시 전송

솔직히 뭔가 C언어로 할 때에는 꽤나 복잡한 과정이 있었던지라 (뭐 사실 단순 TCP 통신이 아니기는 했지만) [TCP 포트스캐너 with.C](https://oil-lamp-cat.github.io/posts/TCP-Port-scan-c/) 파이썬으로 이렇게 쉽게 뚝딱 만들 수 있을 것이라고는 생각을 못했다

## 간단하게 구현한 서버, 클라이언트 코드

> 서버측
<details><summary>Server_Receive.py</summary>
<div markdown = "1">

```python
import socket
import configparser

# ConfigParser 객체 생성
config = configparser.ConfigParser()

# 설정 파일 읽기
config.read("config.ini")

# 서버 설정 값 가져오기
host = config["server"]["host"] # 서버의 IP 주소 또는 도메인 이름
port = int(config["server"]["port"]) # 포트 번호

print(f"Server Host: {host}")
print(f"Server Port: {port}")   

# 서버 소켓 생성
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((host, port))
server_socket.listen(5)

print(f"서버가 {host}:{port}에서 대기 중입니다...")

while True:
    # 클라이언트 연결 대기
    client_socket, client_address = server_socket.accept()
    print(f"클라이언트 {client_address}가 연결되었습니다.")
    
    try:
        # 클라이언트로부터 요청 받기
        data = client_socket.recv(1024).decode("utf-8")
        if not data:
            continue

        # 요청 파싱
        parts = data.split("&&")
        if len(parts) != 0:
            name = parts[0]
            message = parts[1]
            response = f"어서와! {name}"

            # 클라이언트 이름과 메시지 출력
            print(f"클라이언트 이름: {name}")
            print(f"클라이언트 메시지: {message}")
        else:
            response = "유효하지 않은 요청"

        # 응답 클라이언트에게 전송
        client_socket.send(response.encode("utf-8"))

    except Exception as e:
        print(f"오류 발생: {e}")

    finally:
        # 클라이언트 소켓 닫기
        print("연결종료")
        client_socket.close()
        user_input = input("다음 작업을 진행하려면 'y', 종료하려면 'n'을 입력하세요: ").strip().lower()
        
        if user_input == 'y':
            print("서버 연결을 다시 시도합니다 \n")
        elif user_input == 'n':
            print("프로그램을 종료합니다. \n")
            
            exit()
        else:
            print("유효하지 않은 입력입니다. 'y' 또는 'n'을 입력하세요. \n")
```

</div>
</details>

.

> 클라이언트 측

<details><summary>Client_Send.py</summary>
<div markdown = "1">

```python
import socket

# 서버 설정
server_address = "127.0.0.1"  # 서버의 실제 IP 주소 또는 도메인 이름
server_port = 12345         # 서버 포트 번호

# 서버에 연결
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect((server_address, server_port))

# 데이터 전송
name = "tester"
message = "Hello, World!"

request = f"{name}&&{message}"
client_socket.send(request.encode("utf-8"))

# 서버로부터 응답 받기
response = client_socket.recv(1024).decode("utf-8")
print(f"{name} : {message}")
print(f"서버 : {response}\n")

# 클라이언트 소켓 닫기
client_socket.close()
```

</div>
</details>

일단 서버측과 클라이언트 코드는 끝났으나 사실상 이제 시작이다! GUI를 구현해야하고 GUI 뿐만 아니라 서버 통신 외의 추가적인 기능들을 더 만들어야 한다

하지만 이번 코드는 혹시 모를 보안 문제가 있을 수 있기에 작동 장면만 찍어서 영상으로 올리도록 하겠다

아 GUI는 괜찮을지도?

> 서버측 로그

![Image](https://github.com/user-attachments/assets/23f7f556-fa17-4aec-8519-f822bd2622b7)

> 클라이언트 측 로그

![Image](https://github.com/user-attachments/assets/130a4156-6db2-43a6-9a29-09b5c45947ad)

## 문제점(?) 발견 - Server_Receive.py 이미 사용 중인 주소 문제

내가 짠 코드를 실행시킨 후에는 내가 의도한 대로 실행되어 문제가 없었으나 처음 코드를 실행시키는 과정에서 왜인지 모르게 문제가 발생했다

일단 퇴근해서 윈도우에서도 한 번 실행시켜봐야겠다

> Ubuntu 20.04 LTS

![Image](https://github.com/user-attachments/assets/4cd13d43-fb60-4ff7-ac9e-b11de18c307f)

위 사진을 보면 알 수 있듯 처음 `Server_Receive.py`를 실행시켰을 때에는 분명히 코드에 소켓을 종료하는 `client_socket.close()`가 있음에도 불구하고 서버를 종료했다가 곧바로 실행시키면 위와 같이 운영체제가 소켓을 바로 해제하지 않고 `TIME_WAIT`상태로 유지하기 때문에 생기는 문제로 리눅스에서 발생하는 문제인가 싶어 윈도우에서 테스트를 해보았다

> Windows 10 Pro 22H2

![Image](https://github.com/user-attachments/assets/aa5dc012-70c4-4768-8e9b-782385c66c64)

윈도우 상황에서는 분명 우분투와 같이 바로 종료 후 실행해 보아도 문제 없이 실행 되는 것을 알 수 있다

음... 내가 생각한 가설은 몇가지 있다

1. 우분투에서 파이썬의 소켓 종료 속도가 느리다
2. 우분투에서 로컬로 서버를 실행시키고 있기에 같은 IP의 Client, Server가 존재하여 문제가 생긴다
3. IP의 문제가 아니라 포트의 문제일 것이다. 파이썬이 우분투의 포트를 열고 닫음에 있어 대기시간이 있다

실제로 태스트를 해보았을 때에 우분투에서는 제대로 다시 서버를 사용할 수 있을 때 까지 최소 13초의 시간이 필요했다. 그런데 다른 환경에서 테스트 하기에는 시간이 걸리니 다른 누군가가 위 코드를 복사해서 테스트 해볼 수 있기를

## GUI 구현하기 (Customtkinter)

나는 GUI를 다뤄보기는 했지만 정말 가지고 놀 생각으로 `shimejiee`를 파이썬으로 구현하고 싶어서 건들여만 봤지 이번처럼 아예 프로그램에 쓸 GUI를 만드는 것은 처음이 되겠다

[tkinter를 공부해보자!](https://oil-lamp-cat.github.io/posts/tkinter-%EA%B3%B5%EB%B6%80%ED%95%98%EA%B8%B0/), [PySide6를 공부해보자!](https://oil-lamp-cat.github.io/posts/PySide6%EB%A5%BC-%EA%B3%B5%EB%B6%80%ED%95%B4%EB%B3%B4%EC%9E%90/), [Pyqt5를 공부해보자!](https://oil-lamp-cat.github.io/posts/Pyqt5-%EA%B3%B5%EB%B6%80%ED%95%98%EA%B8%B0/)와 같은 여러 시도는 있었으나 결국 그 이후 CLI만 다루다가 이번에 갑작스럽게 도전하게 되었다

파이썬으로 GUI를 구현하는 방법은 여러가지가 있다

- flask로 html 코드로 구현
- tkinter
- pyqt
- pyside

그리고 이번에 사용해볼 방법은 여기에는 포함되어있지 않은 [customtkinter](https://customtkinter.tomschimansky.com/documentation/)되시겠다

![Image](https://github.com/user-attachments/assets/44c22e4d-e29e-4cdc-9860-ad042ade4bcb)

일단 가장 간단한 기본 코드를 `ChatGPT`에게 받았다 이제 이걸 통해서 내가 원하는 GUI를 구현할 차례이다

만... GUI 너무 어렵다 나한테는... 도당체 뭐가 뭔지..

## 서버 클라이언트 코드 2차

<details><summary>Client_Send.py</summary>
<div markdown = "1">

```python
import socket
import time

# TCP 서버의 IP와 포트 설정
TCP_IP = '127.0.0.1'  # 서버 IP
TCP_PORT = 12345      # 서버 포트

# 파일 경로 설정
file_path = "합치는중/test.txt"

try:
    # 소켓 생성
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((TCP_IP, TCP_PORT))
    print(f"서버 {TCP_IP}:{TCP_PORT}에 연결되었습니다.")

    # 파일 읽기
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            line = line.strip()  # 줄 끝의 공백 제거
            if line:  # 빈 줄 무시
                client_socket.sendall(line.encode('utf-8'))  # 데이터 전송
                print(f"보냄: {line}")

                # 서버로부터 응답 받기
                response = client_socket.recv(1024).decode('utf-8')  # 최대 1024 바이트 수신
                print(f"서버 응답: {response}")

                time.sleep(1)  # 1초 대기

    print("파일의 모든 줄을 전송했습니다.")
except FileNotFoundError:
    print(f"파일을 찾을 수 없습니다: {file_path}")
except ConnectionError:
    print("TCP 서버와 연결할 수 없습니다.")
except Exception as e:
    print(f"오류 발생: {e}")
finally:
    client_socket.close()
    print("연결이 종료되었습니다.")
```

</div>
</details>

테스트 파일을 한 줄씩 읽어서 서버로 보내는 작업을 추가하였다

<details><summary>Server_Receive.py</summary>
<div markdown = "1">

```python
import socket
import configparser

# ConfigParser 객체 생성
config = configparser.ConfigParser()

# 설정 파일 읽기
config.read("config.ini")

# 서버 설정 값 가져오기
host = config["server"]["host"]  # 서버의 IP 주소 또는 도메인 이름
port = int(config["server"]["port"])  # 포트 번호

print(f"Server Host: {host}")
print(f"Server Port: {port}")

def run_server():
    # 서버 소켓 생성
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(5)

    print(f"서버가 {host}:{port}에서 대기 중입니다...")

    while True:
        client_socket, client_address = server_socket.accept()
        print(f"클라이언트 {client_address}가 연결되었습니다.")

        try:
            while True:
                # 클라이언트로부터 요청 받기
                data = client_socket.recv(1024).decode("utf-8")  # 최대 1024 바이트 수신
                if not data:  # 클라이언트가 연결을 종료한 경우
                    print(f"클라이언트 {client_address} 연결 종료.")
                    break

                # 요청 파싱 및 응답 생성
                response = f"수신된 데이터: {data}"  # 적절한 응답 설정
                print(f"받은 데이터: {data}")

                # 응답 클라이언트에게 전송
                client_socket.send(response.encode("utf-8"))
                print(f"응답 전송 완료: {response}")

        except Exception as e:
            print(f"오류 발생: {e}")
        finally:
            # 클라이언트 소켓 닫기
            client_socket.close()
            print(f"클라이언트 {client_address}와의 연결이 종료되었습니다.")

if __name__ == "__main__":
    run_server()
```

</div>
</details>

서버에서는 한 줄씩 받아서 확인 후에 다시 클라이언트에게 응답을 전송하는 식으로 작동중이다

## 앱 코드 1차 (2025-01-28)

음.. 일단 간단하게 GUI를 구현하고 그에 따른 통신 기능까지는 넣어봤다

![Image](https://github.com/user-attachments/assets/d7b71a7c-9aa6-455c-aec0-9661b3eba2a8)

오는 통신을 리스트에 넣어서 보여준다

<details><summary>App.py</summary>
<div markdown = "1">

```py
import customtkinter as ctk
import socket
import configparser
import threading

class LTCApp:
    def __init__(self, root):
        self.root = root
        self.root.title("LTC")
        self.root.geometry("800x600")  # 초기 크기 설정 (원하는 크기로 조정 가능)
        ctk.set_appearance_mode("dark")
        
        
        # 초기화: 화면 구성
        self.create_main_frame()

        # TCP 소켓 초기화
        self.load_config()
        self.server_socket = None
        self.client_socket = None
        self.server_thread = None
        self.stop_thread_flag = threading.Event()  # 스레드 종료 플래그 추가
        
        # TCP 통신 연결 상태
        self.device1_connected = False  # Device 1 연결 상태
        self.device2_connected = False  # Device 2 연결 상태

    def load_config(self):
        # ConfigParser 객체 생성
        config = configparser.ConfigParser()

        # 설정 파일 읽기
        config.read("config.ini")

        # 서버 설정 값 가져오기
        self.Receive_IP = config["TCP_Receive"]["host"]
        self.Receive_Port = int(config["TCP_Receive"]["port"])
        self.Send_IP = config["TCP_Send"]["host"]
        self.Send_Port = config["TCP_Send"]["port"]

        print(f"TCP Receive IP : {self.Receive_IP}")
        print(f"TCP Receive Port : {self.Receive_Port}")
        print(f"TCP Send IP : {self.Send_IP}")
        print(f"TCP Send Port : {self.Send_Port}")
        
    def create_main_frame(self):
        # 메인 프레임 (모니터링 영역)
        self.main_frame = ctk.CTkFrame(self.root)
        self.main_frame.pack(fill="both", expand=True)

        # Monitor 구역
        self.monitor_frame = ctk.CTkFrame(self.main_frame)
        self.monitor_frame.pack(padx=10, pady=10, fill="x")

        self.monitor_frame.grid_rowconfigure(0, weight=1)  # 한 줄로 크기 비례 조정
        self.monitor_frame.grid_columnconfigure(0, weight=1)  # 왼쪽 열 비율 50%
        self.monitor_frame.grid_columnconfigure(1, weight=1)  # 오른쪽 열 비율 50%

        # 왼쪽 부분 (Device1 to PC)
        left_frame = ctk.CTkFrame(self.monitor_frame)
        left_frame.grid(row=0, column=0, padx=10, pady=10, sticky="nsew")  # "nsew"로 네 방향으로 확장

        # Device1 to PC 레이블
        self.device1_label = ctk.CTkLabel(left_frame, text="Device1 to PC", font=("Helvetica", 20, "bold"))
        self.device1_label.pack(padx=10)

        # Device1 상태 레이블
        self.device1_status = ctk.CTkLabel(left_frame, text="Disconnected", text_color="red", font=("Helvetica", 20, "bold"))
        self.device1_status.pack(padx=10)

        # 오른쪽 부분 (Device2 to PC)
        right_frame = ctk.CTkFrame(self.monitor_frame)
        right_frame.grid(row=0, column=1, padx=10, pady=10, sticky="nsew")  # "nsew"로 네 방향으로 확장

        # Device2 to PC 레이블
        self.device2_label = ctk.CTkLabel(right_frame, text="PC to Device2", font=("Helvetica", 20, "bold"))
        self.device2_label.pack(padx=10)

        # Device2 상태 레이블
        self.device2_status = ctk.CTkLabel(right_frame, text="Disconnected", text_color="red", font=("Helvetica", 20, "bold"))
        self.device2_status.pack(padx=10)

        # 설정 버튼 (상단 우측)
        self.settings_button = ctk.CTkButton(self.root, text="Settings", command=self.setup_settings_tab, font=("Helvetica", 20, "bold"))
        self.settings_button.pack(padx=10, pady=10, side="right", anchor="ne")

        # 로그 출력 구역
        self.log_frame = ctk.CTkFrame(self.main_frame)
        self.log_frame.pack(padx=10, pady=10, fill="both", expand=True)

        # 왼쪽과 오른쪽 로그 영역 (동적으로 크기 조정)
        self.left_log = ctk.CTkTextbox(self.log_frame, font=("Helvetica", 20, "bold"))
        self.left_log.grid(row=0, column=0, sticky="nsew", padx=10, pady=10)

        self.right_log = ctk.CTkTextbox(self.log_frame, font=("Helvetica", 20, "bold"))
        self.right_log.grid(row=0, column=1, sticky="nsew", padx=10, pady=10)

        # 실패한 로그 모음 구역
        self.failed_frame = ctk.CTkFrame(self.main_frame)
        self.failed_frame.pack(padx=10, pady=10, fill="x")

        self.failed_left = ctk.CTkTextbox(self.failed_frame, font=("Helvetica", 20, "bold"))
        self.failed_left.grid(row=0, column=0, padx=10, pady=10, sticky="nsew")

        self.failed_right = ctk.CTkTextbox(self.failed_frame, font=("Helvetica", 20, "bold"))
        self.failed_right.grid(row=0, column=1, padx=10, pady=10, sticky="nsew")

        # 레이아웃 비율 설정 (창 크기 변경 시 위젯 크기 비례적으로 변경)
        self.main_frame.grid_rowconfigure(0, weight=1)
        self.main_frame.grid_columnconfigure(0, weight=1)
        self.main_frame.grid_columnconfigure(1, weight=1)

        self.log_frame.grid_rowconfigure(0, weight=1)
        self.log_frame.grid_columnconfigure(0, weight=1)
        self.log_frame.grid_columnconfigure(1, weight=1)

        self.failed_frame.grid_rowconfigure(0, weight=1)
        self.failed_frame.grid_columnconfigure(0, weight=1)
        self.failed_frame.grid_columnconfigure(1, weight=1)

    ###
    ### 설정창
    ###
    def setup_settings_tab(self):
        # Toplevel을 사용하여 새 창 생성
        settings_window = ctk.CTkToplevel(self.root)
        settings_window.title("Settings")
        settings_window.geometry("700x400")
        
        # 설정 창을 최상위 창으로 설정
        settings_window.attributes("-topmost", True)  # 설정 창을 항상 최상위로 설정
        
        # settings_frame을 창 가운데에 배치
        settings_frame = ctk.CTkFrame(settings_window, width=600, height=200)
        settings_frame.place(relx=0.5, rely=0.5, anchor="center")  # 창의 가운데로 배치
        
        # Device 1 레이블
        device1_label = ctk.CTkLabel(settings_frame, text="Device 1", font=("Helvetica", 20, "bold"))
        device1_label.grid(row=0, column=0, padx=10, pady=10, columnspan=2, sticky="w")  # Device 1 레이블
        
        # IP 입력 (Device 1)
        ip_label1 = ctk.CTkLabel(settings_frame, text="IP:", font=("Helvetica", 20, "bold"))
        ip_label1.grid(row=1, column=0, padx=10, pady=10, sticky="w")  # 왼쪽 정렬
        ip_entry1 = ctk.CTkEntry(settings_frame, font=("Helvetica", 20, "bold"))
        ip_entry1.grid(row=1, column=1, padx=10, pady=10, sticky="ew")  # 가로로 확장
        ip_entry1.insert(0, self.Receive_IP)
        
        # Port 입력 (Device 1)
        port_label1 = ctk.CTkLabel(settings_frame, text="Port:", font=("Helvetica", 20, "bold"))
        port_label1.grid(row=2, column=0, padx=10, pady=10, sticky="w")  # 왼쪽 정렬
        port_entry1 = ctk.CTkEntry(settings_frame, font=("Helvetica", 20, "bold"))
        port_entry1.grid(row=2, column=1, padx=10, pady=10, sticky="ew")  # 가로로 확장
        port_entry1.insert(0, self.Receive_Port)
        
        # Device 1 Connect/Disconnect 버튼
        self.connect_button1 = ctk.CTkButton(settings_frame, text="Connect", command=self.connect_device1, font=("Helvetica", 20, "bold"))
        self.connect_button1.grid(row=3, column=0, pady=10)  # Device 1의 버튼을 하단에 배치
        self.disconnect_button1 = ctk.CTkButton(settings_frame, text="Disconnect", command=self.disconnect_device1, state="disabled", font=("Helvetica", 20, "bold"))
        self.disconnect_button1.grid(row=3, column=1, pady=10)  # Device 1의 Disconnect 버튼

        # Device 2 레이블
        device2_label = ctk.CTkLabel(settings_frame, text="Device 2", font=("Helvetica", 20, "bold"))
        device2_label.grid(row=0, column=2, padx=10, pady=10, columnspan=2, sticky="w")  # Device 2 레이블
        
        # IP 입력 (Device 2)
        ip_label2 = ctk.CTkLabel(settings_frame, text="IP:", font=("Helvetica", 20, "bold"))
        ip_label2.grid(row=1, column=2, padx=10, pady=10, sticky="w")  # 왼쪽 정렬
        ip_entry2 = ctk.CTkEntry(settings_frame, font=("Helvetica", 20, "bold"))
        ip_entry2.grid(row=1, column=3, padx=10, pady=10, sticky="ew")  # 가로로 확장
        ip_entry2.insert(0, self.Send_IP)
        
        # Port 입력 (Device 2)
        port_label2 = ctk.CTkLabel(settings_frame, text="Port:", font=("Helvetica", 20, "bold"))
        port_label2.grid(row=2, column=2, padx=10, pady=10, sticky="w")  # 왼쪽 정렬
        port_entry2 = ctk.CTkEntry(settings_frame, font=("Helvetica", 20, "bold"))
        port_entry2.grid(row=2, column=3, padx=10, pady=10, sticky="ew")  # 가로로 확장
        port_entry2.insert(0, self.Send_Port)
                
        # Device 2 Connect/Disconnect 버튼
        self.connect_button2 = ctk.CTkButton(settings_frame, command=self.connect_device2, font=("Helvetica", 20, "bold"))
        self.connect_button2.grid(row=3, column=2, pady=10)  # Device 2의 버튼을 하단에 배치
        self.disconnect_button2 = ctk.CTkButton(settings_frame, command=self.disconnect_device2, state="disabled", font=("Helvetica", 20, "bold"))
        self.disconnect_button2.grid(row=3, column=3, pady=10)  # Device 2의 Disconnect 버튼
        
        # Device 1 버튼 상태 설정
        if self.device1_connected:
            self.connect_button1.configure(state="disabled")
            self.disconnect_button1.configure(state="normal")
        else:
            self.connect_button1.configure(state="normal")
            self.disconnect_button1.configure(state="disabled")
        
        # Device 2 버튼 상태 설정
        if self.device2_connected:
            self.connect_button2.configure(state="disabled")
            self.disconnect_button2.configure(state="normal")
        else:
            self.connect_button2.configure(state="normal")
            self.disconnect_button2.configure(state="disabled")
    
        # 값을 저장할 변수
        def save_settings():
            # IP 입력된 값 가져오기
            ip_value1 = str(ip_entry1.get())
            ip_value2 = str(ip_entry2.get())
            # Port 입력된 값 가져오기
            port_value1 = str(port_entry1.get())
            port_value2 = str(port_entry2.get())
            
            # config.ini 파일에 저장
            config = configparser.ConfigParser()
            config.read("config.ini")
            config['TCP_Receive']['host'] = ip_value1
            config['TCP_Receive']['port'] = port_value1
            config['TCP_Send']['host'] = ip_value2
            config['TCP_Send']['port'] = port_value2
            
            with open('config.ini', 'w') as file:
                config.write(file)  # config.ini 파일에 저장
            
            self.Receive_IP = ip_value1
            self.Receive_Port = port_value1
            self.Send_IP = ip_value2
            self.Send_Port = port_value2
            
            print(f"Device 1 : {ip_value1}, {port_value1}\nDevice 2 : {ip_value2}, {port_value2}")  # 콘솔에 출력
            
            # 콘솔에 출력, 실제로는 파일에 저장하는 로직 등을 추가할 수 있음
    
        # Save Settings 버튼
        save_button = ctk.CTkButton(settings_frame, text="Save Settings", font=("Helvetica", 20, "bold"), command=save_settings)
        save_button.grid(row=4, column=0, columnspan=5, padx=10, pady=20)
    
    ###
    ### 통신 구현부 (받기)
    ###
    def connect_device1(self):
        print("Device 1 연결 중")
        self.device1_status.configure(text="Trying...", text_color="orange")
        
        # 연결 시도 상태로 업데이트
        self.stop_thread_flag.clear()  # 스레드 종료 플래그 초기화
        
        # 서버 소켓을 별도의 스레드에서 실행
        self.server_thread = threading.Thread(target=self.start_server)
        self.server_thread.daemon = True
        self.server_thread.start()

    def start_server(self):
        try:
            self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.server_socket.bind((self.Receive_IP, self.Receive_Port))
            self.server_socket.listen(5)
            print(f"서버가 {self.Receive_IP}:{self.Receive_Port}에서 대기 중입니다...")
            self.connect_button1.configure(state="disabled")
            self.disconnect_button1.configure(state="normal")
            self.device1_connected = True
            
            while not self.stop_thread_flag.is_set():
                try:
                    if self.server_socket is None:
                        break
                    client_socket, client_address = self.server_socket.accept()
                    print(f"클라이언트 {client_address}가 연결되었습니다.")
                    self.device1_status.configure(text="Connected", text_color="green")
                    self.device1_connected = True
                    while not self.stop_thread_flag.is_set():
                        data = client_socket.recv(1024).decode("utf-8")
                        if not data:
                            print(f"클라이언트 {client_address} 연결 종료.")
                            self.connect_button1.configure(state="normal")
                            self.disconnect_button1.configure(state="disabled")
                            self.device1_connected = False
                            break

                        print(f"받은 데이터: {data}")
                        self.left_log.insert(ctk.END, f"{data}\n")
                        self.left_log.yview_moveto(1)

                        client_socket.send(f"수신된 데이터: {data}".encode("utf-8"))

                except Exception as e:
                    print(f"클라이언트 처리 중 오류 발생: {e}")
                    self.device1_connected = False
                finally:
                    if 'client_socket' in locals() and client_socket:
                        client_socket.close()
                        print(f"클라이언트 소켓 종료.")
                        self.device1_connected = False

        except Exception as e:
            print(f"서버 설정 중 오류 발생: {e}")
        finally:
            if self.server_socket:
                self.device1_connected = False
                try:
                    self.server_socket.close()
                    print("서버 소켓이 성공적으로 종료되었습니다.")
                except Exception as e:
                    print(f"서버 소켓 종료 중 오류 발생: {e}")
            self.server_socket = None


    def disconnect_device1(self):
        print("Device 1 연결 해제")
        self.device1_status.configure(text="Disconnecting...", text_color="orange")

        # 먼저 소켓 통신을 종료하기 전에 스레드 종료 플래그를 설정
        self.stop_thread_flag.set()  # 스레드 종료 플래그 설정

        # 서버 종료를 별도의 스레드로 처리
        disconnect_thread = threading.Thread(target=self._disconnect_server)
        disconnect_thread.daemon = True
        disconnect_thread.start()

    def _disconnect_server(self):
        # 서버와 클라이언트 소켓이 아직 열려 있다면 종료
        if self.server_socket:
            try:
                self.server_socket.close()
                self.server_socket = None
                print("서버 소켓이 성공적으로 종료되었습니다.")
            except Exception as e:
                print(f"서버 소켓 종료 중 오류 발생: {e}")

        if self.client_socket:
            try:
                self.client_socket.close()
                self.client_socket = None
                print("클라이언트 소켓이 성공적으로 종료되었습니다.")
            except Exception as e:
                print(f"클라이언트 소켓 종료 중 오류 발생: {e}")

        # UI 상태 업데이트
        self.device1_status.configure(text="Disconnected", text_color="red")
        self.connect_button1.configure(state="normal")
        self.disconnect_button1.configure(state="disabled")
        
    ###
    ### 통신 구현부 (보내기) - 아직 작업중
    ###
    def connect_device2(self):
        print("Device 2 연결 중")
        # 연결 시도 상태로 업데이트
        self.device2_status.configure(text="Trying...", text_color="orange")
        
        # 연결 로직을 추가할 수 있습니다.
        # 예를 들어, 연결 성공 후
        self.root.after(2000, self.device2_connected)  # 2초 후 연결 성공 처리 (여기서는 예시)

    def device2_connected(self):
        # 연결 성공 시 상태를 초록색으로 업데이트
        self.device2_status.configure(text="Connected", text_color="green")

        # 연결 버튼 상태 업데이트
        self.connect_button2.configure(state="disabled")
        self.disconnect_button2.configure(state="normal")

    def disconnect_device2(self):
        print("Device 2 연결 해제")
        # 연결 해제 로직을 추가할 수 있습니다.
        self.device2_status.configure(text="Disconnected", text_color="red")

        self.connect_button2.configure(state="normal")
        self.disconnect_button2.configure(state="disabled")

# 메인 실행부
if __name__ == "__main__":
    root = ctk.CTk()
    app = LTCApp(root)
    root.mainloop()
```

</div>
</details>

일단 오늘은 여기까지만 하고 정리를 먼저 해보자

> 지금까지 만들어진 것들

1. TCP 통신 연결(내가 서버일 경우) 후에 로그를 받아서 추가하는 기능
2. 연결이 끊기거나 연결되었을 때 Disconnect, Connect가 뜨며 색 변경
3. 왐마 많이 남았네

> 추가하거나 처리해야하는 부분

1. 내용을 TCP로 보내는 부분을 완성해야한다
2. 로그를 선택할 수 있고 로그를 조절(다시 보내기, 선택)할 수 있어야 한다. 지금은 text로 추가되는 중이라...
3. 추가적으로 선택할 로그 파일을 선택할 수 있어야 한다
4. 로그를 1시간 단위로 저장할 수 있어야 한다
5. 들어오거나 나가는 로그에서 뺴내야할 부분을 빼야한다
6. GUI 개정.. 가능하려나?

## 추가하거나 바꿔야 하는 것들 2025-01-29

1. 소켓 통신을 종료한 후에도 포트가 열려있다고 뜨는 문제 (해결, 휴먼 에러였던걸로)

장치1 - pc 통신에서 장치 1이 죽은 후에 통신이 disconnected되는데 그 이후 다시 통신을 연결시도하면 아래와 같은 문제가 발생

- 포트 열린것인지 확인하는 루트 필요
- 소켓이 확실히 닫혔는지 확인 필요(했는데 왜 안되는건데)
- 뭐가 문제인건지..

아 알았다 출력만 종료되었다고 뜨는거지 disconnect_device1()함수를 실행하지 않아가지고 끊기지 않은거였어 아놔 진짜

```cmd
TCP Receive Port : 12345
TCP Send IP : 127.0.0.1
TCP Send Port : 23456
Device 1 연결 중
서버가 127.0.0.1:12345에서 대기 중입니다...
클라이언트 ('127.0.0.1', 17229)가 연결되었습니다.
받은 데이터: 1
받은 데이터: 2
받은 데이터: 3
받은 데이터: 4
받은 데이터: 5
받은 데이터: 6
받은 데이터: 7
받은 데이터: 8
받은 데이터: 9
받은 데이터: 10
받은 데이터: 11
받은 데이터: 12
클라이언트 ('127.0.0.1', 17229) 연결 종료.
클라이언트 소켓 종료.
PS E:\Programing\AirPortProject\Log_TCP_classifier> & e:/Programing/AirPortProject/Log_TCP_classifier/venvwin/Scripts/python.exe e:/Programing/AirPortProject/Log_TCP_classifier/APP.py
TCP Receive IP : 127.0.0.1
TCP Receive Port : 12345
TCP Send IP : 127.0.0.1
TCP Send Port : 23456
Device 1 연결 중
서버가 127.0.0.1:12345에서 대기 중입니다...
클라이언트 ('127.0.0.1', 17238)가 연결되었습니다.
받은 데이터: 1
받은 데이터: 2
받은 데이터: 3
받은 데이터: 4
받은 데이터: 5
받은 데이터: 6
받은 데이터: 7
받은 데이터: 8
받은 데이터: 9
클라이언트 ('127.0.0.1', 17238) 연결 종료.
클라이언트 소켓 종료.
Device 1 연결 중
서버 설정 중 오류 발생: [WinError 10048] 각 소켓 주소(프로토콜/네서버 설정 중 오류 발생: [WinError 10048] 각 소켓 주소(프로토콜/네트워크 주소/포트)는 하나만 사용할 수 있습니다
서버 소켓이 성공적으로 종료되었습니다.
Device 1 연결 중
서버 설정 중 오류 발생: [WinError 10048] 각 소켓 주소(프로토콜/네트워크 주소/포트)는 하나만 사용할 수 있습니다
서버 소켓이 성공적으로 종료되었습니다.
PS E:\Programing\AirPortProject\Log_TCP_classifier>
```

```py
finally:
    if 'client_socket' in locals() and client_socket:
        client_socket.close() #이거 왜 클라이언트 소켓이 종료되는거임?
        self.device1_status.configure(text="Disconnected", text_color="red")
        print(f"클라이언트 소켓 종료.")
        self.device1_connected = False
```

찾음 왜 클라이언트 소켓을 종료했지? 서버 소켓이 아니라?

아 맞네 클라이언트 소켓은 종료 안되는게 맞네 뭐야

이거 서버 소켓이 살아있는게 맞고 그냥 disconnect랑 connect로 뜨는게 잘못된 거였네 아놔 요거는 내가 바꿔야 하는 부분이네

아 해결했다 ㅋㅋㅋㅋㅋ

```py
while not self.stop_thread_flag.is_set():
    data = client_socket.recv(1024).decode("utf-8")
    if not data:
        print(f"클라이언트 {client_address} 연결 종료.")
        # self.connect_button1.configure(state="normal")
        # self.disconnect_button1.configure(state="disabled")
        self.device1_connected = False
        break

    print(f"받은 데이터: {data}")
    self.left_log.insert(ctk.END, f"{data}\n")
    self.left_log.yview_moveto(1)

    client_socket.send(f"수신된 데이터: {data}".encode("utf-8"))
```

딱 여기 부분이 문제였답니다!

당연히 프로그램이 실행 된 뒤에 connect 를 누르면 서버 소켓이 켜지고 만약에 클라이언트에 연결이 되었다가 해제 된다고 해도 클라이언트 소켓이 죽어야지 서버 소켓은 계속 켜져 있어야 하니까 맞는 상황인거지

서버 소켓을 끊고 싶으면 disconnect 버튼이 활성화 되어있다가 눌러야 꺼져야 하는게 정상인거였네

### 남은 작업?

> 목록

1. 변수명 재작업
2. 로그를 선택할 수 있고 로그가 들어올 때 마다 스크롤을 아래로 내리기, 우클릭시에 팝업창 띄우기 (팝업창 띄우는걸 그냥 창 띄우기로 바꾸면? [Anyone has idea how to create a sort of floating menu window via customtkinter? #2473](https://github.com/TomSchimansky/CustomTkinter/discussions/2473)
3. 로그를 선택할 수 있으며(사실상 지금 구현해야하는 가장 중요한 부분) 로그를 보낼 수 있어야함 (이 작업은 장치2와 PC가 연결되는 작업을 마치고 가능할듯)
4. 로그가 안보내졌다면 로그 옆에 빨간색 불 들어오게 하는데 솔직히 내가 장치2의 코드를 모르니까 받았다고 `ack`신호가 오는걸 확인해야 할 것 같기는 한데 요건 좀 더 공부를 해보고 장치1에서 PC로 로그를 받는 부분은 못 받았으면 그냥 그건 어떻게 확인할 방법이 없음..
5. 장치2와 PC의 통신 (장치2가 서버, PC가 클라이언트일 경우)
6. 잘못 보내졌거나 안보내진 로그 확인 가능하게 (오른쪽 아래)
7. 버려야할 로그 확인 하는 부분 완성 (왼쪽 아래)
8. 에러가 발생했을 경우에 소리를 내면서 오류 내용을 창으로 띄우기
9. 프로그램 작동 테스트 창 추가 (이것도 부가적인 기능이기에 필수 아님)
10. 보내거나 확인 할 파일 선택 기능 (이거는 넣을지는 고민해보고, 일단 다른 기능부터 완성 하고 생각)

## 추가하거나 바꿔야 하는 것들, 혹은 바뀐 것들 2025-02-03

위 해야하는 목록에서 `2번`을 구현하는 중이였다

아 참고로 아직 1,2번은 안했다 저것은 내가 해야하는 순서가 아닌 그냥 나열해 놓은 것이기 때문이다

일단 내가 작업을 해보았을 때에 `2번`단계의 `로그를 선택할 수 있고`에서 문제가 발생하였고 `로그가 들어올 때마다 스크롤 내리기`에서도 문제가 발생했다

일단

> 1 . 로그를 선택할 수 있고

부분의 이야기를 하자면 이렇다

나는 로그를 선택할 때에 shift를 누른 상태라면 여러개를 선택하고 땐 상태라면 방금 클릭한 하나의 로그만 선택되기를 바랬다

하지만 `Customtikinter`의 `CTKListbox`를 이용하였을 때에는 `mode`를 설정하여 `multi`와 단일 선택 모드를 왔다갔다 할 수는 있었다. 그런데 내가 생각한 것 처럼 안된다. 모듈을 사용해보면 `multi`모드를 사용했을 때에 `1,2,3,4`를 선택하면 잘 된다 그런데 여기서 `1`을 선택하면 `2,3,4`가 선택이 된 상태이다. 나는 이게 아닌 `1`을 선택하면 `1`만 선택되기를 바랬다

그리하여 생각한 방법이 `mode`를 shift눌렀을 때 키 바인딩을 걸어서 상태를 변경시켜주면 되겠네 라는 아이디어를 떠올렸다

만 해결됬으면 이렇게 안쓰겠지? 

키 바인딩에는 성공하였으나 모드가 변경되면서 선택한 목록도 같이 변경이 되더라.. shift를 누르고 `1,2,3,4`를 선택하면 때고 `1`을 선택하면 잘 되지만 다시 shift를 누르는 순간 `1,2,3,4`가 다시 선택이 되어있다....

아니 이거 좀 더 봐야할게 놀랍게도 `CTK`가 아니라 `tikinter`에서는 정말로 잘된다... 디자인을 버려야 하나? 싶은 생각이 드는 부분이다...

아니면 걍 아예 `CTKListbox`모듈을 뜯어봐야지 (일단 해보기는 했다... 성과는 없었지만)

> 2 . 로그가 들어올 때마다 스크롤 내리기

로그가 들어올 때에 

```
1
2
3
4
5
6
7
```

의 순서로 들어오게 된다, 그리고 들어온 로그의 수가 창을 넘어가면 스크롤이 점점 길어지게 된다

나는 여기서 문제가 발생했다. 스크롤이 가장 최신 로그를 보여주기를 바랬는데 음... 전혀 미동이 없었다

아 물론 내가 이것저것 시도를 안해본 것은 아니다

![Image](https://github.com/user-attachments/assets/8ea363b9-d64a-4e38-9163-b4d2b956427f)

chatgpt와 많은 이야기도 해보고 외국 친구들에게 물어보기도 했다

하지만 다들 tkinter로는 구현이 되는데 `CTKListbox`로는 불가능하다는 답변만이...

진짜로 한번 날 잡고 모듈을 뜯어볼까 하는 차에!

일 끝나고 집에 오던중 떠오른 생각

로그를 출력할 때에 위가 과거 아래가 최신일 필요가 있나?

아래가 과거 위가 최신이면?

```
7
6
5
4
3
2
1
```

이렇게 하면 문제가 없는게 아닐까?

해결 방법을 찾았다!

하지만 일단 원래 하려던 방법에서도 문제점을 떠올렸기에 한번 써본다. 나중에 해결할 수 있으면 더 좋고

 - 로그가 들어올 때에 계속 스크롤을 아래로 내릴텐데 그거 감당 가능한가?
    - 마우스가 체크박스 안에 들어오면 스크롤 내리는 것을 멈추게 한다
    - 마우스가 체크박스 밖으로 나가면 다시 스크롤을 자동으로 아래로 내린다

일단 위 과정은 내일 직접 코드를 짜서 확인해 보자 일단 오늘은 자고 내일 일어나서 생각하자

### 추가해야하는(하고싶은) 목록

- 로그 받는 부분의 리스트 표현 문제 해결 (왼쪽 위)
- 세팅 부분의 전체적인 개편 필요 [Anyone has idea how to create a sort of floating menu window via customtkinter? #2473](https://github.com/TomSchimansky/CustomTkinter/discussions/2473)를 참고하여
- 로그 보내기를 floating menu를 통해 구현 가능할지도? (좌클릭 선택 우클릭 메뉴 열기 바인딩 해서 하면?)
- TCP 통신으로 로그 보내기 부분 완성 (오른쪽 위)
- 오류난 로그 보내기 및 정리 부분 (왼쪽 아래)
- 정규식 처리로 보낼것과 안보낼 것 구분
- 로그 저장
- 보내지지 않은 로그 빨간색 추가 표시 및 경보
- 오른쪽 아래는 뭐 넣지?
- 파일 선택으로 한번에 보내기 (github에서 좋은 예시를 봤던거 같은데)
- 프로그램 작동 테스트 창 추가(세팅부분 개편에 추가될 내용, not 필수)
- 언어 및 폰트 사이즈 조정(세팅 부분에서 추가될 내용, not 필수)
- 솔직히 디자인 한번 싹 갈아엎고 싶으... (comfyui gui making 프로그램을 이용할까 생각중)

일단 크게는 이렇게 더 해야한다... 많이 남았네?

더 자잘하게는 많은 것이 남았지만! 일단 이정도만 써놓자, 사실 로그 받는 부분을 완벽히 구현한다면 다른 부분은 복사 붙여넣기 작업이 될 것이기에 간단하게 할 수 있을 것이다

## 2025-02-04 로그 받는 부분 리스트 표현 문제

리스트를 추가할 때에 위가 최신인 것으로 바꿔보고자 하였다

```py
def insert(self, index, option, update=True, **args):
    """add new option in the listbox"""

    if str(index).lower() == "end":
        index = f"END{self.end_num}"
        self.end_num += 1

    if index in self.buttons:
        self.buttons[index].destroy()

    self.buttons[index] = customtkinter.CTkButton(
        self,
        text=option,
        fg_color=self.button_fg_color,
        anchor=self.justify,
        text_color=self.text_color,
        font=self.font,
        hover_color=self.hover_color,
        **args,
    )
    self.buttons[index].configure(command=lambda num=index: self.select(num))
    
    if type(index) is int:
        self.buttons[index].grid(padx=0, pady=(0, 5), sticky="nsew", column=0, row=index)
    else:
        self.buttons[index].grid(padx=0, pady=(0, 5), sticky="nsew", column=0)
        
    if update:
        self.update()

    if self.multiple:
        self.buttons[index].bind(
            "<Shift-1>", lambda e: self.select_multiple(self.buttons[index])
        )
```

그런데 코드를 뜯어보니 옵션이 end 밖에 없네?

어.. 이건 진짜로 생각도 못했다

```py
self.receive_log.insert("end", f"{insert_data}")
```

이 부분의 `end`값을 `top`으로 바꾸면 될 줄 알았는데 어림도 없네...

하지만!

```py
def move_up(self, index):
        """Move the option up in the listbox"""
        if index > 0:
            current_key = list(self.buttons.keys())[index]
            previous_key = list(self.buttons.keys())[index - 1]

            # Store the text of the button to be moved
            current_text = self.buttons[current_key].cget("text")

            # Update the text of the buttons
            self.buttons[current_key].configure(
                text=self.buttons[previous_key].cget("text")
            )
            self.buttons[previous_key].configure(text=current_text)

            # Clear the selection from the current option
            self.deselect(current_key)

            # Update the selection
            self.select(previous_key)

            # Update the scrollbar position
            if self._parent_canvas.yview() != (0.0, 1.0):
                self._parent_canvas.yview("scroll", -int(100 / 6), "units")
```

이 부분을 이용한다면?

은 위 코드에 따르면 선택한 것만 올리는 것이니 안되고

어?! 이거 뭐야!

```py
# Update the scrollbar position
if self._parent_canvas.yview() != (0.0, 1.0):
    self._parent_canvas.yview("scroll", -int(100 / 6), "units")
```

이 부분을 이용해볼까?

일단 전체를 가져가서 추가한 후에 `ctk_lstbox.py`모듈에 직접 추가해서 테스트를 해보면?

```py
insert_data=str(datetime.now().strftime("%H:%M:%S"))+"  "+data
self.receive_log.insert("end", f"{insert_data}") #"end",
self.receive_log.scroll_down()
# 스크롤 자동 다운좀 제발 ...
#self.receive_log.move_down(1)
#self.receive_log.scroll_to_index("end")
```

정말로 스크롤이 아래로 내려가기는 한다! 분명히 작지만 로그가 들어올 때 마다 조금씩 내려간다!

조금씩 내려가는 문제는 딱 한 줄씩 내려갈 수 있게 세팅하면 될 것이고

로그가 들어올 때 마다 스크롤이 내려가는 문제는는 프레임에 마우스가 올라와있을 때에는 다시 고정될 수 있게 하거나 우클릭을 눌렀을 때에 팝업을 띄워서 설정할 수 있게 세팅하면 될지도????

```py
def scroll_down(self):
    if self._parent_canvas.yview() != (0.0, 1.0):
        self._parent_canvas.yview("scroll", int(100), "units")
```

스크롤이 적게 내려가는 문제는 위와같이 `int(100/6)`의 수치를 `int(100)`으로 설정하여 딱 늘어난 만큼(버튼 크기)만 스크롤이 움직이게 세팅하였다

```py
print(f"받은 데이터: {data}")
insert_data=str(datetime.now().strftime("%H:%M:%S"))+"  "+data
self.receive_log.insert("end", f"{insert_data}") #"end",
self.receive_log.scroll_down()
```

그럼 이제 다시 `App.py`로 돌아가서 `scroll_down`이 마우스가 프레임에 들어와있지 않을 때에만 실행될 수 있게 하고 원한다면 우클릭 메뉴에서 스크롤 다운 기능을 끄고 킬 수 있게 구현하면 된다!!

그리고 13시 10분 구현 성공!!!!! 이게 되네!!!

```py
self.is_mouse_inside1 = False
self.is_mouse_inside2 = False
self.is_mouse_inside3 = False
self.is_mouse_inside4 = False
```

마우스 들어왔는지 아닌지 변수 설정

```py
## 마우스 이벤트 부분
def on_mouse_enter1(self, event):
    """ 마우스가 리스트박스 위에 올라갔을 때 실행 """
    print("들어옴")
    self.is_mouse_inside1 = True

def on_mouse_leave1(self, event):
    """ 마우스가 리스트박스에서 나갔을 때 실행 """
    print("나감")
    self.is_mouse_inside1 = False
```

```py
### 마우스 이벤트 인식 부분
self.receive_log.bind("<Enter>", self.on_mouse_enter1)
self.receive_log.bind("<Leave>", self.on_mouse_leave1)
```

마우스가 로그 그리드 안에 들어왔는지 아닌지 확인하는 부분을 추가했다

## 2025-02-04 17시 37분 마우스 우클릭 메뉴 팝업

`Customtikinter`에서 팝업 메뉴를 만들고 싶어서 찾다보니 [Here is a modern popup menu class you can use:](https://github.com/TomSchimansky/CustomTkinter/discussions/2473#discussioncomment-9856783)라는 것을 찾아서 가져다 추가했다

```py
from customtkinter import *
import sys

class CTkFloatingWindow(CTkToplevel):
    """
    On-screen popup window class for customtkinter
    Author: Akascape
    """
    def __init__(self,
                 master=None,
                 corner_radius=15,
                 border_width=1,
                 **kwargs):
        
        super().__init__(takefocus=1)
        
        self.focus()
        self.master_window = master
        self.corner = corner_radius
        self.border = border_width
        self.hidden = True

        # add transparency to suitable platforms
        if sys.platform.startswith("win"):
            self.after(100, lambda: self.overrideredirect(True))
            self.transparent_color = self._apply_appearance_mode(self._fg_color)
            self.attributes("-transparentcolor", self.transparent_color)
        elif sys.platform.startswith("darwin"):
            self.overrideredirect(True)
            self.transparent_color = 'systemTransparent'
            self.attributes("-transparent", True)
        else:
            self.attributes("-type", "splash")
            self.transparent_color = '#000001'
            self.corner = 0
            self.withdraw()
             
        self.frame = CTkFrame(self, bg_color=self.transparent_color, corner_radius=self.corner,
                              border_width=self.border, **kwargs)
        self.frame.pack(expand=True, fill="both")
        
        self.master.bind("<Button-1>", lambda event: self._withdraw(), add="+") # hide menu when clicked outside
        self.bind("<Button-1>", lambda event: self._withdraw()) # hide menu when clicked inside
        self.master.bind("<Configure>", lambda event: self._withdraw()) # hide menu when master window is changed
        
        self.resizable(width=False, height=False)
        self.transient(self.master_window)
         
        self.update_idletasks()
        
        self.withdraw()
        
    def _withdraw(self):
        if not self.hidden:
            self.withdraw()
            self.hidden = True
        
    def popup(self, x=None, y=None):
        self.x = x
        self.y = y
        self.deiconify()
        self.focus()
        self.geometry('+{}+{}'.format(self.x, self.y))
        self.hidden = False
```

마우스 이벤트 인식하는 부분은 이렇게 된다

```py
        #---#중략#---#

        ### 마우스 이벤트 인식 부분
        self.receive_log.bind("<Enter>", self.on_mouse_enter1)
        self.receive_log.bind("<Leave>", self.on_mouse_leave1)
        self.receive_log.bind("<Button-3>", self.on_right_click)
        
    def on_right_click(self, event):
        """ 우클릭 이벤트 핸들러 """
        if self.float_window_rlm is None or not self.float_window_rlm.winfo_exists():
            self.create_popup_menu()  # 메뉴 생성
        self.do_popup(event)
        
    ## 마우스 이벤트 부분
    def on_mouse_enter1(self, event):
        """ 마우스가 리스트박스 위에 올라갔을 때 실행 """
        #print("들어옴")
        self.is_mouse_inside1 = True

    def on_mouse_leave1(self, event):
        """ 마우스가 리스트박스에서 나갔을 때 실행 """
        #print("나감")
        self.is_mouse_inside1 = False
        
    def do_popup(self, event):
        """ 팝업 메뉴 표시 """
        self.float_window_rlm.popup(event.x_root, event.y_root)

    ###
    ### receive log menu
    ###
    def create_popup_menu(self):
        """ 팝업 메뉴 생성 """
        self.float_window_rlm = ctkf(self.root)

        menu_button = ctk.CTkButton(self.float_window_rlm.frame, text="Option 1", fg_color="transparent", command=lambda: print("Option 1 Selected"))
        menu_button.pack(expand=True, fill="x", padx=10, pady=(10, 0))

        menu_button2 = ctk.CTkButton(self.float_window_rlm.frame, text="Option 2", fg_color="transparent", command=lambda: print("Option 2 Selected"))
        menu_button2.pack(expand=True, fill="x", padx=10, pady=(5, 0))

        menu_button3 = ctk.CTkButton(self.float_window_rlm.frame, text="Option 3", fg_color="transparent", command=lambda: print("Option 3 Selected"))
        menu_button3.pack(expand=True, fill="x", padx=10, pady=(5, 10))
```

## 2025-02-05 9시 25분 로그 저장부 기본 구현

```py
def save_receive_log(self, data):
    now = datetime.now()

    # 날짜 및 시간 폴더/파일 경로 설정
    date_folder = now.strftime("logs/received/%Y-%m-%d")  # logs/YYYY-MM-DD
    hour_file = now.strftime(f"{date_folder}/%Y-%m-%d-%H.txt")  # logs/YYYY-MM-DD/HH.txt

    # 폴더가 없으면 생성
    os.makedirs(date_folder, exist_ok=True)

    # 로그 데이터 생성
    timestamp = now.strftime("%H:%M:%S")
    insert_data = f"{timestamp}  {data}\n"

    # 파일에 로그 저장
    with open(hour_file, "a", encoding="utf-8") as f:
        f.write(insert_data)

    # UI에도 로그 추가
    #self.receive_log.insert("end", insert_data)
    print(f"로그 저장 완료: {hour_file}")
```

사실 이제 여기서 쪼개서 보낼 데이터도 뽑아내야 하고 솎아내야 하는 부분도 존재하게 될 것이다만 고것은 조금 뒤에 하는걸로

## 2025-02-05 17시 10분, 로그 다시 보내기 및 클라이언트 소켓 생성

```py
def send_log(self, log_message):
    """로그를 Device2에 전송"""
    if self.device2_connected and self.client_socket:
        try:
            self.client_socket.sendall(log_message.encode('utf-8'))
            print(f"보낸 로그: {log_message}")
        except socket.error as e:
            print(f"로그 전송 실패: {e}")
            self.device2_status.configure(text="Disconnected", text_color="red")
            self.device2_connected = False
            self.client_socket.close()
            self.client_socket = None
    else:
        print("Device2에 연결되어 있지 않습니다.")

def save_send_log(self, log_data):
    """새 로그가 들어오면 send_log를 호출"""
    self.send_log(log_data)

def save_resend_log(self, log_data):
    """다시 보내야 하는 로그를 처리"""
    self.send_log(log_data)
```

로그를 보내는 부분은 위와 같이 구현했고

```py
def start_server(self):
    try:
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.bind((self.Receive_IP, self.Receive_Port))
        self.server_socket.listen(5)
        print(f"서버가 {self.Receive_IP}:{self.Receive_Port}에서 대기 중입니다...")
        self.connect_button1.configure(state="disabled")
        self.disconnect_button1.configure(state="normal")
        self.device1_connected = True
        
        while not self.stop_thread_flag_receive.is_set():
            try:
                if self.server_socket is None:
                    break
                client_socket, client_address = self.server_socket.accept()
                print(f"클라이언트 {client_address}가 연결되었습니다.")
                self.device1_status.configure(text="Connected", text_color="green")
                self.device1_connected = True
                while not self.stop_thread_flag_receive.is_set():
                    data = client_socket.recv(1024).decode("utf-8")
                    if not data:
                        print(f"클라이언트 {client_address} 연결 종료.")
                        self.device1_connected = False
                        break

                    print(f"받은 데이터: {data}")
                    insert_data=str(datetime.now().strftime("%H:%M:%S"))+"  "+data
                    self.receive_log.insert("end", f"{insert_data}")
                    
                    # 로그 저장부
                    self.save_receive_log(data)
                    
                    if self.device2_connected == True:
                        self.save_send_log(data)
                    elif self.device2_connected == False:
                        self.save_resend_log(data)
                    else:
                        print("잘못된 입력입니다")
                    
                    # 스크롤 다운 쿠현부
                    if self.is_mouse_inside1 == False:
                        self.receive_log.scroll_down()
                    # 스크롤 자동 다운좀 제발 ...

                    client_socket.send(f"수신된 데이터: {data}".encode("utf-8"))

            except Exception as e:
                print(f"클라이언트 처리 중 오류 발생: {e}")
                self.device1_status.configure(text="Disconnected", text_color="red")
                self.device1_connected = False
            finally:
                if 'client_socket' in locals() and client_socket:
                    client_socket.close()
                    self.device1_status.configure(text="Disconnected", text_color="red")
                    print(f"클라이언트 소켓 종료.")
                    self.device1_connected = False

    except Exception as e:
        self.device1_status.configure(text="Server Error", text_color="red")
        print(f"서버 설정 중 오류 발생: {e}")
    finally:
        if self.server_socket:
            self.device1_connected = False
            try:
                self.server_socket.close()
                print("서버 소켓이 성공적으로 종료되었습니다.")
            except Exception as e:
                print(f"서버 소켓 종료 중 오류 발생: {e}")
        self.server_socket = None
```

로그를 보내거나 문제가 생긴 로그에 관한 내용을 위와 같이 만들었다

```py
def start_client(self):
    try:
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket.settimeout(5)  # 5초 후 타임아웃
        client_socket.connect((self.Send_IP, self.Send_Port))
        
        self.device2_status.configure(text="Connected", text_color="green")
        self.device2_connected = True
        print("Device 2 연결 성공!")
        
        # 필요하면 client_socket을 유지하면서 데이터 송수신 구현 가능
        self.client_socket = client_socket

    except socket.timeout:
        print("연결 시간이 초과되었습니다.")
        self.device2_connected = False
        self.device2_status.configure(text="Timeout", text_color="red")

    except socket.error as e:
        print(f"TCP 서버와 연결할 수 없습니다: {e}")
        self.device2_connected = False
        self.device2_status.configure(text="Failed", text_color="red")
```

클라이언트 실행부는 또 위와 같이 만들기는 했지만 바뀔수도?

그리고 뭔가를 하기 전에 테스트 하는 것을 구현해야겠다

## 2025-02-11 12시 47분, 로그 테스트부 구현에 생긴 문제

이번에는 로그를 테스트 하는 부분을 구현하려 하였으나 

```py
    ###
    ### Receive 로그 테스트 구현부
    ###
    def SendTestLog(self):
        self.send_log_thread = threading.Thread(target=self.ClientTestLog)
        self.send_log_thread.start()
    
    def ClientTestLog(self):
        print("클라이언트 실행됨")
        file_path = self.Test_File
        
        try:
            #소켓 생성
            client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            client_socket.connect((self.Receive_IP, self.Receive_Port))
            print(f"서버 {self.Receive_IP}:{self.Receive_Port}에 연결되었습니다.")
        
            # 파일 읽기
            with open(file_path, 'r', encoding='utf-8') as file:
                for line in file:
                    line = line.strip()  # 줄 끝의 공백 제거
                    if line:  # 빈 줄 무시
                        client_socket.sendall(line.encode('utf-8'))  # 데이터 전송
                        print(f"보냄: {line}")

                        # 서버로부터 응답 받기
                        response = client_socket.recv(1024).decode('utf-8')  # 최대 1024 바이트 수신
                        print(f"서버 응답: {response}")

                        time.sleep(1)  # 1초 대기

            print("파일의 모든 줄을 전송했습니다.")
        except FileNotFoundError:
            print(f"파일을 찾을 수 없습니다: {file_path}")
        except ConnectionError:
            print("TCP 서버와 연결할 수 없습니다.")
        except Exception as e:
            print(f"오류 발생: {e}")
        finally:
            client_socket.close()
            print("연결이 종료되었습니다.")
```

위 부분에서 분명히 클라이언트를 실행하여 서버에 로그를 읽어 보낸다고 했을 때에 

```
TCP Receive IP : 127.0.0.1
TCP Receive Port : 12345
TCP Send IP : 127.0.0.1
TCP Send Port : 23456
ttr실행됨
Device 1 연결 중
서버가 127.0.0.1:12345에서 대기 중입니다...
클라이언트 실행됨
서버 127.0.0.1:12345에 연결되었습니다.
보냄: 1
클라이언트 ('127.0.0.1', 52594)가 연결되었습니다.
받은 데이터: 1
보냄: 2
보냄: 3
보냄: 4
보냄: 5
보냄: 6
로그 저장 완료: logs/received/2025-02-11/2025-02-11-00.txt
클라이언트 처리 중 오류 발생: 'NoneType' object is not callable
클라이언트 소켓 종료.
TCP 서버와 연결할 수 없습니다.
연결이 종료되었습니다.
```

이런 식으로 서버가 아직 받은 데이터를 저장하고 있을 때에 이미 클라이언트가 서버에서 다시 응답을 받지 못했는데 혼자 계속 파일을 보내게 된다

그냥 원래 쓰던 로그 전송 테스트 할 때 쓴 코드를 import해서 끌고와야겠다 그게 훨씬 더 잘 작동할 듯 하다

## 2025-02-11 22시 16분, 테스트부 통신 문제

```
TCP Receive IP : 127.0.0.1
TCP Receive Port : 12345
TCP Send IP : 127.0.0.1
TCP Send Port : 23456
ttr실행됨
Device 1 연결 중
클라이언트 실행됨
서버가 127.0.0.1:12345에서 대기 중입니다...
서버 127.0.0.1:12345에 연결되었습니다.
보냄: Trying 127.0.0.1...
클라이언트 ('127.0.0.1', 55597)가 연결되었습니다.
받은 데이터: Trying 127.0.0.1...
로그 저장 완료: logs/received/2025-02-11/2025-02-11-22.txt
클라이언트 처리 중 오류 발생: 'NoneType' object is not callable
서버 응답:
클라이언트 소켓 종료.
보냄: Connected to cv02.
TCP 서버와 연결할 수 없습니다.
연결이 종료되었습니다.
PS E:\Programing\AirPortProject\Log_TCP_classifier> 
```

아니 이건 또 무슨 문제인걸까?

```py
    def start_server(self):
        try:
            self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.server_socket.bind((self.Receive_IP, self.Receive_Port))
            self.server_socket.listen(5)
            print(f"서버가 {self.Receive_IP}:{self.Receive_Port}에서 대기 중입니다...")
            self.connect_button1.configure(state="disabled")
            self.disconnect_button1.configure(state="normal")
            self.device1_connected = True
            
            while not self.stop_thread_flag_receive.is_set():
                try:
                    if self.server_socket is None:
                        break
                    client_socket, client_address = self.server_socket.accept()
                    print(f"클라이언트 {client_address}가 연결되었습니다.")
                    self.device1_status.configure(text="Connected", text_color="green")
                    self.device1_connected = True
                    while not self.stop_thread_flag_receive.is_set():
                        data = client_socket.recv(1024).decode("utf-8")
                        if not data:
                            print(f"클라이언트 {client_address} 연결 종료.")
                            self.device1_connected = False
                            break

                        print(f"받은 데이터: {data}")
                        insert_data=str(datetime.now().strftime("%H:%M:%S"))+"  "+data
                        self.receive_log.insert("end", f"{insert_data}")
                        
                        # 로그 저장부
                        self.save_receive_log(data)
                        
                        if self.device2_connected == True:
                            self.save_send_log(data)
                        elif self.device2_connected == False:
                            self.save_resend_log(data)
                        else:
                            print("잘못된 입력입니다")
                        
                        # 스크롤 다운 쿠현부
                        if self.is_mouse_inside1 == False:
                            self.receive_log.scroll_down()

                        client_socket.send(f"수신된 데이터: {data}".encode("utf-8"))

                except Exception as e:
                    print(f"클라이언트 처리 중 오류 발생: {e}")
                    self.device1_status.configure(text="Disconnected", text_color="red")
                    self.device1_connected = False
                finally:
                    if 'client_socket' in locals() and client_socket:
                        client_socket.close()
                        self.device1_status.configure(text="Disconnected", text_color="red")
                        print(f"클라이언트 소켓 종료.")
                        self.device1_connected = False

        except Exception as e:
            self.device1_status.configure(text="Server Error", text_color="red")
            print(f"서버 설정 중 오류 발생: {e}")
        finally:
            if self.server_socket:
                self.device1_connected = False
                try:
                    self.server_socket.close()
                    print("서버 소켓이 성공적으로 종료되었습니다.")
                except Exception as e:
                    print(f"서버 소켓 종료 중 오류 발생: {e}")
            self.server_socket = None
```

이 부분과

```py
    ###
    ### Receive 로그 테스트 구현부
    ###
    def SendTestLog(self):
        self.send_log_thread = threading.Thread(target=self.ClientTestLog)
        self.send_log_thread.start()
    
    def ClientTestLog(self):
        print("클라이언트 실행됨")
        file_path = self.Test_File
        
        try:
            #소켓 생성
            client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            client_socket.connect((self.Receive_IP, self.Receive_Port))
            print(f"서버 {self.Receive_IP}:{self.Receive_Port}에 연결되었습니다.")
        
            # 파일 읽기
            with open(file_path, 'r', encoding='utf-8') as file:
                for line in file:
                    line = line.strip()  # 줄 끝의 공백 제거
                    if line:  # 빈 줄 무시
                        client_socket.sendall(line.encode('utf-8'))  # 데이터 전송
                        print(f"보냄: {line}")

                        # 서버로부터 응답 받기
                        response = client_socket.recv(1024).decode('utf-8')  # 최대 1024 바이트 수신
                        print(f"서버 응답: {response}")

                        time.sleep(1)  # 1초 대기

            print("파일의 모든 줄을 전송했습니다.")
        except FileNotFoundError:
            print(f"파일을 찾을 수 없습니다: {file_path}")
        except ConnectionError:
            print("TCP 서버와 연결할 수 없습니다.")
        except Exception as e:
            print(f"오류 발생: {e}")
        finally:
            client_socket.close()
            print("연결이 종료되었습니다.")
```

이 부분에서 서로 통신하는 도중에 문제가 생긴 것 같은데...

전역 변수와 지역변수 그러니까 client_socket의 이름이 같아서 생긴 문제도 아닌 듯 하고...

일단 여기저기에 print를 넣어서 확인해보자

```py
                        if self.device2_connected == True:
                            self.save_send_log(data)
                        elif self.device2_connected == False:
                            self.save_resend_log(data)
                        else:
                            print("잘못된 입력입니다")
```

확인 결과 이 부분(420에서 425번째 줄)에서 문제가 발생했는데... 아...아닌데?

```py
        # 초기화: 화면 구성
        self.create_main_frame()

        # TCP 소켓 초기화
        self.load_config()
        self.server_socket = None
        self.client_socket = None
        self.server_thread = None
        self.stop_thread_flag_receive = threading.Event()  # 스레드 종료 플래그 추가
        self.client_thread = None
        # TCP 통신 연결 상태
        self.device1_connected = False  # Device 1 연결 상태
        self.device2_connected = False  # Device 2 연결 상태
```

초기화 되어있는데?

```
로그 저장 완료: logs/received/2025-02-11/2025-02-11-22.txt
여기?
여기3
클라이언트 처리 중 오류 발생: 'NoneType' object is not callable
서버 응답:
클라이언트 소켓 종료.
보냄: Connected to cv02.
TCP 서버와 연결할 수 없습니다.
연결이 종료되었습니다.
PS E:\Programing\AirPortProject\Log_TCP_classifier> 
```

```py
                        if self.device2_connected == True:
                            print("여기2")
                            self.save_send_log(data)
                        elif self.device2_connected == False:
                            print("여기3")
                            self.save_resend_log(data)
                        else:
                            print("잘못된 입력입니다")
```

잡았다 요놈

`save_resend_log`에서 문제가 발생한 것이 분명하다


는

```py
    def save_resend_log(self, log_data):
        """다시 보내야 하는 로그를 처리"""
        self.send_log(log_data)
```

이렇게 되어있고 그렇다는 것은? 다시 테스트 해보자

```py
    def save_resend_log(self, log_data):
        """다시 보내야 하는 로그를 처리"""
        print("여기4")
        self.send_log(log_data)
```

```
로그 저장 완료: logs/received/2025-02-11/2025-02-11-22.txt
여기4
클라이언트 처리 중 오류 발생: 'NoneType' object is not callable
서버 응답:
클라이언트 소켓 종료.
보냄: Connected to cv02.
TCP 서버와 연결할 수 없습니다.
연결이 종료되었습니다.
PS E:\Programing\AirPortProject\Log_TCP_classifier> 
```

잘 지나가네? 뭐지 진짜? 그럼 다음은 `send_log`인건데...

```py
    def send_log(self, log_message):
        """로그를 Device2에 전송"""
        print("센드 로귿 들어온" + log_message)
        if self.device2_connected and self.client_socket:
            try:
                self.client_socket.sendall(log_message.encode('utf-8'))
                print(f"보낸 로그: {log_message}")
            except socket.error as e:
                print(f"로그 전송 실패: {e}")
                self.device2_status.configure(text="Disconnected", text_color="red")
                self.device2_connected = False
                self.client_socket.close()
                self.client_socket = None
        else:
            print("Device2에 연결되어 있지 않습니다.")

    def save_send_log(self, log_data):
        """새 로그가 들어오면 send_log를 호출"""
        self.send_log(log_data)

    def save_resend_log(self, log_data):
        """다시 보내야 하는 로그를 처리"""
        print(f"로그 데이타 {log_data}")
        print("여기4")
        self.send_log(log_data)
```

의 실행 결과가 

```
로그 저장 완료: logs/received/2025-02-11/2025-02-11-22.txt
로그 데이타 127.0.0.1...
여기4
클라이언트 처리 중 오류 발생: 'NoneType' object is not callable
서버 응답:
클라이언트 소켓 종료.
보냄: Connected to cv02.
TCP 서버와 연결할 수 없습니다.
연결이 종료되었습니다.
PS E:\Programing\AirPortProject\Log_TCP_classifier> 
```

가 될 수 있는건가?

와... GPT는 신이야...

![Image](https://github.com/user-attachments/assets/649a781d-9c8c-48a3-843a-137867d61b07)

GPT가 말하길 혹시 내가 변수를 NONE으로 설정하지 않았냐고 하길래 내가 설마 그랬겠어 했는데 ...

![Image](https://github.com/user-attachments/assets/36fc939a-b529-43d3-a1c8-726c9414537c)

요깃네?

와 해결!

## 2025-02-11 22시 56분

와! 또 문제가!

```
클라이언트 ('127.0.0.1', 55937)가 연결되었습니다.
받은 데이터: Trying 127.0.0.1...
로그 저장 완료: logs/received/2025-02-11/2025-02-11-22.txt
로그 데이타 Trying 127.0.0.1...
여기4
센드 로귿 들어온Trying 127.0.0.1...
Device2에 연결되어 있지 않습니다.
클라이언트 처리 중 오류 발생: 'CTkListbox' object has no attribute 'scroll_down'
서버 응답: 
클라이언트 소켓 종료.
보냄: Connected to cv02.
TCP 서버와 연결할 수 없습니다.
연결이 종료되었습니다.
```

아니 선생님 이건 또 뭡니까..

아 미친...알았다..

이 부분은 내가 노트북에서 작업하다가 컴퓨터로 가져와서 하드를 연결하고 vscode를 열었을 때에 `venv`에 파이썬이 없다는 어이가 없는 문제가 발생해서 다시 pip로 모듈을 설치했고 전에 추가했던 scrollDown함수가 없어진 상황이다.. 이거 기록해 뒀었나... 라고 하기 전에 휴지통에서 아직 삭제되지 않은 venv파일을 끄집어 냈다. 그냥 CTKFloatingWindow마냥 하나 직접 넣을까보다

![Image](https://github.com/user-attachments/assets/10c4028a-3d1d-4212-b954-7790ad37e92f)

찾았다! 그럼 이제 그냥 통째로 복사해서 파일을 추가하자

![Image](https://github.com/user-attachments/assets/c038e8b9-676f-489e-8592-a8d55361ae7a)

App.py의 import 부분을 바꾸고

![Image](https://github.com/user-attachments/assets/fa16655f-ee07-469a-916f-9710faf312d7)

추가해주면!(요건 나중에 내가 기억하려고)

![Image](https://github.com/user-attachments/assets/2f7aa088-853f-439f-ad43-94e2f1fb6c25)

이렇게 내가 구현하려 했던 부분이 확실하게 작동하는 것을 알 수 있다!

근데 생각해보니 테스트 부분이랑 실사용 부분이랑 조금만 바꿔서 쓰면 바로 다른 기능도 따라 구현할 수 있을 것 같다는 생각이?

## 2025-02-12 9시 7분, 파이썬 venv, no python 문제

이거는 아마도 따로 기록을 해야할 부분인 것 같다

정말로 간단한 문제이지만 파이썬 경로에 대하여 잘 모른다면 아마 정말로 많이 해매게 될 것이다 (내가 그랬다)

아침에 출근하고 노트북에 외장하드를 연결하고 실행하는 순간 오류 문구를 발견했다

```
No Python at '"C:\Users\user\AppData\Local\Programs\Python\Python311\python.exe'
```

아니 파이썬이 없다뇨? 생각해보니 어제 마지막 작업을 할 때에도 분명 노트북에서는 잘 되다가 컴퓨터(데스크탑)에서는 파이썬을 불러오지 못해 문제가 생겼었다

분명 그 때는 아예 venv를 새로 만들었었더라지

그리하여 이번에는 `venv` 설정파일을 뜯어보기로 했다

참고로 설정 파일의 이름은 가상환경 파일 안에 `pyvenv.cfg`라는 이름으로 되어있을 것이다

```
home = C:\Users\user\AppData\Local\Programs\Python\Python311
include-system-site-packages = false
version = 3.11.4
executable = C:\Users\user\AppData\Local\Programs\Python\Python311\python.exe
command = C:\Users\user\AppData\Local\Programs\Python\Python311\python.exe -m venv E:\Programing\파일 경로\Log_TCP_classifier\venvwin
```

열어보면 위와 같이 되어있을 것인데 위 예시는 내 컴퓨터 그러니까 desktop에서의 환경이다

그리고 비교를 위해 노트북에서도 venv를 생성한 후에 비교해보자

```
home = C:\Users\raen0\AppData\Local\Programs\Python\Python311
include-system-site-packages = false
version = 3.11.4
executable = C:\Users\raen0\AppData\Local\Programs\Python\Python311\python.exe
command = C:\Users\raen0\AppData\Local\Programs\Python\Python311\python.exe -m venv E:\Programing\파일경로\Log_TCP_classifier\venvwin_notebook
```

보아하니 `C:\Users\`다음 부분, 즉 desktop과 노트북의 윈도우 계정 이름이 다르다는 것을 확인할 수 있었다 

`raen0와 user`

이러니 python을 못찾는게 정상인것이였다...

만약에 가상환경 하나만 남긴 뒤에 계정의 이름이 다른 두 컴퓨터 사이에서 사용하고자 한다면 

`C:\Users\계정이름`과 같은 방식으로 옮길 때 마다 파이썬의 경로를 변경해 주면 된다

나는 귀찮아서 그냥 하나를 더 만들기로 한다

어쩌피 필요한 모듈중에 2개는 따로 직접 코드를 추가했기에 문제가 없다는 사실

혹시나 윈도우 계정이 무엇이 있는지 모르겠다 한다면 

`C:\Users`에 들어가 확인해 보길 바란다

![Image](https://github.com/user-attachments/assets/e52cf32a-c945-423b-b9d7-2c49756bf499)

## 2025-03-18, 20시 10분, 전체 구조 리펙토링

최근에 일이 좀 많기도 했고 아무래도 일을 끝내고 오면 거의 뻗어버려 코드를 더 발전시키지 못했었다

는 아니고 사실 내가 기존에 짜둔 코드가 너무 스파게티라... 나도 더 어떻게 건들어야할까 하는생각이 들어 잠시 중단했었다


하지만! 내가 누구? 호기심이 생기면 끝까지 파고드는 인간!

마친 사회복무로 보은에 왔겠다 바~로 그냥 6시 끝나고 밥 먹은 후 숙소에 온 뒤로 쭉 노트북을 켜고 기어코 구조를 싹 바꿨다는 사실!

내가 바꾼 구조는 다음과 같다

![Image](https://github.com/user-attachments/assets/a8ef3624-ef6d-491c-93d2-5ba3703d8674)

음.. 하나씩 설명해보자면

![Image](https://github.com/user-attachments/assets/63c25415-b467-4f0f-9552-1cc621678a28)

이렇게 되시겠다

보아하니 `logs`폴더에는 몇가지 빠진 것도 있고 아마 또 기능을 추가하다 보면 파일이 더 많아질 수도 있지만 일단 온 뒤 2일 동안 고심끝에 구현한 구조는 이렇게 된다

그럼 바뀐 코드를 뜯어보자, 실행되는 순서로 살펴보도록 하자

```py
# main.py

from app.UI.main_window import MainWindow

if __name__ == "__main__":
    app = MainWindow()
    app.mainloop()
```

메인 코드이다. 라고 해도 말이지 그저 앱 실행을 위한 코드일 뿐이다

```py
# main_window.py

import customtkinter as ctk
from app.controllers.tcp_controller import TCPController
from app.UI.settings_window import SettingsWindow
from app.UI.modules.ctk_listbox import CTkListbox
from config.config_manager import ConfigManager

class MainWindow(ctk.CTk):
    def __init__(self):
        super().__init__()

        # 메인 윈도우 GUI 기본 설정
        self.title("LTC")
        self.geometry("800x650")

        # 설정 파일 가져오기
        self.get_window_config()

        # 메인 윈도우 GUI
        self._setup_ui()

        # TCPController 초기화할 때 self(MainWindow 객체)를 전달
        self.tcp_controller = TCPController(self)
        # self.tcp_controller = TCPController(self)

    def _setup_ui(self):
        # 메인 프레임 (모니터링 영역)
        self.main_frame = ctk.CTkFrame(self.master)
        self.main_frame.pack(fill="both", expand=True)

        # Monitor 구역
        self.monitor_frame = ctk.CTkFrame(self.main_frame)
        self.monitor_frame.pack(padx=10, pady=10, fill="x")

        self.monitor_frame.grid_rowconfigure(0, weight=1)  # 한 줄로 크기 비례 조정
        self.monitor_frame.grid_columnconfigure(0, weight=1)  # 왼쪽 열 비율 조정
        self.monitor_frame.grid_columnconfigure(1, weight=0)  # 설정 버튼 영역 (고정 크기)
        self.monitor_frame.grid_columnconfigure(2, weight=1)  # 오른쪽 열 비율 조정

        # 왼쪽 부분 (Device1 to PC)
        left_frame = ctk.CTkFrame(self.monitor_frame)
        left_frame.grid(row=0, column=0, padx=10, pady=10, sticky="nsew")  # "nsew"로 네 방향으로 확장

        # Device1 to PC 레이블
        self.device1_label = ctk.CTkLabel(left_frame, text=f"{self.device1_name} to {self.local_device_name}", font=(f"{self.font}", self.font_size, "bold"))
        self.device1_label.pack(padx=10)

        # Device1 상태 레이블
        self.device1_status = ctk.CTkLabel(left_frame, text="Disconnected", text_color="red", font=(f"{self.font}", self.font_size, "bold"))
        self.device1_status.pack(padx=10)

        # 설정 버튼 부분 (프레임)
        self.settings_frame = ctk.CTkFrame(self.monitor_frame)
        self.settings_frame.grid(row=0, column=1)

        # 설정 버튼 (프레임 내 중앙 정렬)
        self.settings_button = ctk.CTkButton(self.settings_frame, text="menu", command=SettingsWindow , font=(f"{self.font}", self.font_size, "bold"))
        self.settings_button.pack(expand=True, padx=10, pady=10)
        
        # 오른쪽 부분 (Device2 to PC)
        right_frame = ctk.CTkFrame(self.monitor_frame)
        right_frame.grid(row=0, column=2, padx=10, pady=10, sticky="nsew")  # "nsew"로 네 방향으로 확장

        # Device2 to PC 레이블
        self.device2_label = ctk.CTkLabel(right_frame, text=f"{self.local_device_name} to {self.device2_name}", font=(f"{self.font}", self.font_size, "bold"))
        self.device2_label.pack(padx=10)

        # Device2 상태 레이블
        self.device2_status = ctk.CTkLabel(right_frame, text="Disconnected", text_color="red", font=(f"{self.font}", self.font_size, "bold"))
        self.device2_status.pack(padx=10)

        # 로그 출력 구역
        self.log_frame = ctk.CTkFrame(self.main_frame)
        self.log_frame.pack(padx=10, pady=10, fill="both", expand=True)

        # 왼쪽과 오른쪽 로그 영역 (동적으로 크기 조정)
        self.receive_log_grid = CTkListbox(self.log_frame, font=(f"{self.font}", self.font_size, "bold"), multiple_selection=True)
        self.receive_log_grid.grid(row=0, column=0, sticky="nsew", padx=10, pady=10)

        self.send_log_grid = CTkListbox(self.log_frame, font=(f"{self.font}", self.font_size, "bold"))
        self.send_log_grid.grid(row=0, column=1, sticky="nsew", padx=10, pady=10)

        # 실패한 로그 모음 구역
        self.failed_frame = ctk.CTkFrame(self.main_frame)
        self.failed_frame.pack(padx=10, pady=10, fill="x")

        self.failed_receive_left = CTkListbox(self.failed_frame, font=(f"{self.font}", self.font_size, "bold"))
        self.failed_receive_left.grid(row=0, column=0, padx=10, pady=10, sticky="nsew")

        self.failed_send_right = CTkListbox(self.failed_frame, font=(f"{self.font}", self.font_size, "bold"))
        self.failed_send_right.grid(row=0, column=1, padx=10, pady=10, sticky="nsew")

        # 레이아웃 비율 설정 (창 크기 변경 시 위젯 크기 비례적으로 변경)
        self.main_frame.grid_rowconfigure(0, weight=1)
        self.main_frame.grid_columnconfigure(0, weight=1)
        self.main_frame.grid_columnconfigure(1, weight=1)

        self.log_frame.grid_rowconfigure(0, weight=1)
        self.log_frame.grid_columnconfigure(0, weight=1)
        self.log_frame.grid_columnconfigure(1, weight=1)

        self.failed_frame.grid_rowconfigure(0, weight=1)
        self.failed_frame.grid_columnconfigure(0, weight=1)
        self.failed_frame.grid_columnconfigure(1, weight=1)

    def get_window_config(self):
        config_manager = ConfigManager()
        self.resolution = config_manager.get_resolution_config()
        self.font, self.font_size = config_manager.get_font_config()
        self.local_device_name, self.device1_name, self.device2_name = config_manager.get_device_name_config()
```

긴 줄의 코드가 보이지만 사실 원래 코드에서 처음 프로그램이 켜지면 보이는 GUI만 따로 빼낸 것이다

쉽게말해 긴 코드 전부 프레임을 만들고 버튼을 어디 위치에 넣고 하는 작업이라는 의미

```py
# settings_window.py

import customtkinter as ctk
from app.controllers.tcp_controller import TCPController
from config.config_manager import ConfigManager

class SettingsWindow(ctk.CTkToplevel):
    def __init__(self):
        super().__init__()
        self.tcp_controll = TCPController()
        self.config_manager = ConfigManager()
        self.get_settings_window_config()
        self._setup_ui()

    def _setup_ui(self):
        # 기본 설정
        self.title("Settings")
        self.geometry("700x400")
        self.attributes("-topmost", True)

        # 메뉴바
        self.menu_bar = ctk.CTkTabview(self)
        self.menu_bar.pack(pady=10, padx=20, fill="both", expand=True)

        # 메뉴
        self.menu_bar.add("settings")
        self.menu_bar.add("TCP test")
        self.menu_bar.set("settings") # 기본 세팅

        self.settings_menu()
        # self.tcp_test_menu()
    
    def settings_menu(self):
        # settings_frame을 창 가운데에 배치
            settings_frame = ctk.CTkFrame(self.menu_bar.tab("settings"))
            settings_frame.place(relx=0.5, rely=0.5, anchor="center")  # 창의 가운데로 배치
            
            # Device 1 레이블
            device1_label = ctk.CTkLabel(settings_frame, text="Device 1", font=("Helvetica", 20, "bold"))
            device1_label.grid(row=0, column=0, padx=10, pady=10, columnspan=2, sticky="w")  # Device 1 레이블
            
            # IP 입력 (Device 1)
            ip_label1 = ctk.CTkLabel(settings_frame, text="IP:", font=("Helvetica", 20, "bold"))
            ip_label1.grid(row=1, column=0, padx=10, pady=10, sticky="w")  # 왼쪽 정렬
            ip_entry1 = ctk.CTkEntry(settings_frame, font=("Helvetica", 20, "bold"))
            ip_entry1.grid(row=1, column=1, padx=10, pady=10, sticky="ew")  # 가로로 확장
            ip_entry1.insert(0, self.tcp_recieve_ip)
            
            # Port 입력 (Device 1)
            port_label1 = ctk.CTkLabel(settings_frame, text="Port:", font=("Helvetica", 20, "bold"))
            port_label1.grid(row=2, column=0, padx=10, pady=10, sticky="w")  # 왼쪽 정렬
            port_entry1 = ctk.CTkEntry(settings_frame, font=("Helvetica", 20, "bold"))
            port_entry1.grid(row=2, column=1, padx=10, pady=10, sticky="ew")  # 가로로 확장
            port_entry1.insert(0, self.tcp_recieve_port)
            
            # Device 1 Connect/Disconnect 버튼
            self.connect_button1 = ctk.CTkButton(settings_frame, text="Connect", command=self.tcp_controll.connect_device1, font=("Helvetica", 20, "bold"))
            self.connect_button1.grid(row=3, column=0, pady=10)  # Device 1의 버튼을 하단에 배치
            self.disconnect_button1 = ctk.CTkButton(settings_frame, text="Disconnect", command=self.tcp_controll.disconnect_device1, state="disabled", font=("Helvetica", 20, "bold"))
            self.disconnect_button1.grid(row=3, column=1, pady=10)  # Device 1의 Disconnect 버튼

            # Device 2 레이블
            device2_label = ctk.CTkLabel(settings_frame, text="Device 2", font=("Helvetica", 20, "bold"))
            device2_label.grid(row=0, column=2, padx=10, pady=10, columnspan=2, sticky="w")  # Device 2 레이블
            
            # IP 입력 (Device 2)
            ip_label2 = ctk.CTkLabel(settings_frame, text="IP:", font=("Helvetica", 20, "bold"))
            ip_label2.grid(row=1, column=2, padx=10, pady=10, sticky="w")  # 왼쪽 정렬
            ip_entry2 = ctk.CTkEntry(settings_frame, font=("Helvetica", 20, "bold"))
            ip_entry2.grid(row=1, column=3, padx=10, pady=10, sticky="ew")  # 가로로 확장
            ip_entry2.insert(0, self.tcp_send_ip)
            
            # Port 입력 (Device 2)
            port_label2 = ctk.CTkLabel(settings_frame, text="Port:", font=("Helvetica", 20, "bold"))
            port_label2.grid(row=2, column=2, padx=10, pady=10, sticky="w")  # 왼쪽 정렬
            port_entry2 = ctk.CTkEntry(settings_frame, font=("Helvetica", 20, "bold"))
            port_entry2.grid(row=2, column=3, padx=10, pady=10, sticky="ew")  # 가로로 확장
            port_entry2.insert(0, self.tcp_send_port)
                    
            # Device 2 Connect/Disconnect 버튼
            self.connect_button2 = ctk.CTkButton(settings_frame,text="Connect", command=self.tcp_controll.connect_device2, font=("Helvetica", 20, "bold"))
            self.connect_button2.grid(row=3, column=2, pady=10)  # Device 2의 버튼을 하단에 배치
            self.disconnect_button2 = ctk.CTkButton(settings_frame,text="Disconnect", command=self.tcp_controll.disconnect_device2, state="disabled", font=("Helvetica", 20, "bold")) #command=self.disconnect_device2
            self.disconnect_button2.grid(row=3, column=3, pady=10)  # Device 2의 Disconnect 버튼

    def _save_settings(self):
        ip = self.ip_entry.get()
        self.config_manager.update_config("TCP_Receive", "host", ip)

    def get_settings_window_config(self):
        self.tcp_recieve_ip, self.tcp_recieve_port = self.config_manager.get_tcp_receive_config()
        self.tcp_send_ip, self.tcp_send_port = self.config_manager.get_tcp_send_config()
        self.resolution = self.config_manager.get_resolution_config()
        self.font, self.font_size = self.config_manager.get_font_config()
        self.local_device_name, self.device1_name, self.device2_name = self.config_manager.get_device_name_config()
```

여기부터 이제 아직 구현이 덜 된 부분이 존재할 것이다

기본적으로는 설정창으로 `폰트`, `폰트 사이즈`, `해상도`, `tcp 통신에 필요한 ip, port`, `tcp 테스트`까지의 기능이 들어있다만 아직 완성하기엔...

특히 내가 독학으로 공부하는 것이다 보니 스파게티코드로 짜는 것이 아니라 이렇게 구조를 나눠서 구현했을 경우에 스레드 끼리의 충돌이 빈번하게 일어날 것이라 계속해서 찾아보며 구현하는 중이다

```py
# tcp_controller.py

from app.services.tcp_service import TCPServer, TCPClient
from app.controllers.log_controller import LogSaver
from config.config_manager import ConfigManager

class TCPController:
    def __init__(self, main_window):
        self.config_manager = ConfigManager()
        self.main_window = main_window

        self.get_device1_config()
        self.get_device2_config()
        
        self.log_saver = LogSaver()

        self.server = None
        self.client = None
        
        # 연결 상태 추적
        self.device1_connected = False
        self.device2_connected = False

    def connect_device1(self):
        if not self.device1_connected:
            try:
                self.server = TCPServer(self.device1_ip, self.device1_port, self._on_data_received)
                self.server.start()
                self.device1_connected = True
                # GUI 업데이트 - 연결 상태 변경
                self.main_window.after(0, lambda: self.main_window.device1_status.configure(text="Connected", text_color="green"))
                return True
            except Exception as e:
                print(f"Device1 연결 오류: {e}")
                return False
        return False

    def disconnect_device1(self):
        if self.device1_connected and self.server:
            try:
                self.server.stop()
                self.server = None
                self.device1_connected = False
                # GUI 업데이트 - 연결 상태 변경
                self.main_window.after(0, lambda: self.main_window.device1_status.configure(text="Disconnected", text_color="red"))
                return True
            except Exception as e:
                print(f"Device1 연결 종료 오류: {e}")
                return False
        return False

    def connect_device2(self):
        if not self.device2_connected:
            try:
                self.client = TCPClient(self.device2_ip, self.device2_port)
                self.client.start()
                self.device2_connected = True
                # GUI 업데이트 - 연결 상태 변경
                self.main_window.after(0, lambda: self.main_window.device2_status.configure(text="Connected", text_color="green"))
                return True
            except Exception as e:
                print(f"Device2 연결 오류: {e}")
                return False
        return False

    def disconnect_device2(self):
        if self.device2_connected and self.client:
            try:
                self.client.stop()
                self.client = None
                self.device2_connected = False
                # GUI 업데이트 - 연결 상태 변경
                self.main_window.after(0, lambda: self.main_window.device2_status.configure(text="Disconnected", text_color="red"))
                return True
            except Exception as e:
                print(f"Device2 연결 종료 오류: {e}")
                return False
        return False

    def _on_data_received(self, data):
        # tkinter는 스레드에 안전하지 않으므로, after 메서드를 사용하여 
        # GUI 업데이트를 메인 스레드에서 실행
        self.main_window.after(0, lambda: self.main_window.receive_log_grid.insert("end", data))
        self.log_saver.save(data, "receive")
    
    def get_device1_config(self):
        self.device1_ip, self.device1_port = self.config_manager.get_tcp_receive_config()
    
    def get_device2_config(self):
        self.device2_ip, self.device2_port = self.config_manager.get_tcp_send_config()
    
    def send_data(self, data):
        if self.device2_connected and self.client:
            success = self.client.send_data(data)
            if success:
                # 전송 로그 저장
                self.main_window.after(0, lambda: self.main_window.send_log_grid.insert("end", data))
                self.log_saver.save(data, "send")
                return True
            else:
                # 실패 로그 저장
                self.main_window.after(0, lambda: self.main_window.failed_send_right.insert("end", data))
                return False
        return False
```

아까 구조에 관해 설명할 때 말했듯 TCP 통신의 실행, 종료 등을 다루는 부분이 되겠다

하지만 이제 실제로 서버가 실행되고 종료되는 부분은 이 다음에 나올 코드이다

```py
# tcp_service.py

import socket
import threading

class TCPServer:
    def __init__(self, ip, port, callback):
        self.ip = ip
        self.port = port
        self.callback = callback
        self.server_socket = None

    def start(self):
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.bind((self.ip, self.port))
        self.server_socket.listen(5)
        self.thread = threading.Thread(target=self._run_server)
        self.thread.start()

    def stop(self):
        self.running = False
        if self.server_socket:
            # 서버 소켓 종료
            self.server_socket.close()
            self.server_socket = None

    def _run_server(self):
        while self.running:
            try:
                # 소켓 타임아웃 설정으로 주기적으로 running 확인 가능
                self.server_socket.settimeout(1.0)
                try:
                    client_socket, addr = self.server_socket.accept()
                    data = client_socket.recv(1024).decode("utf-8")
                    self.callback(data)
                    client_socket.close()
                except socket.timeout:
                    continue  # 타임아웃 시 계속 진행
            except Exception as e:
                if self.running:
                    print(f"서버 오류: {e}")
                break  # 오류 발생시 루프 종료


class TCPClient:
    def __init__(self, ip, port):
        self.ip = ip
        self.port = port
        self.client_socket = None

    def start(self):
        self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.client_socket.connect((self.ip, self.port))

    def stop(self):
        if self.client_socket:
            self.client_socket.close()
            self.client_socket = None
    
    def send_data(self, data):
        if self.client_socket:
            try:
                self.client_socket.send(data.encode("utf-8"))
                return True
            except Exception as e:
                print(f"데이터 전송 오류: {e}")
                return False
        return False
```

위 코드가 드디어 tcp 통신을 위한 코드가 되겠지만 지금은 메인 페이지만이 그나마 원래 구현하고자 했던 `App.py`와 가장 동일한 GUI를 가지고 있고

정확히는 그마저도 popup창이 없고 연결이 되어어도 로그나 저장이 안되는 등 매우 많은 문제가 있다

```py
# config_manager.py

import configparser
import os

class ConfigManager:
    def __init__(self):
        self.config = configparser.ConfigParser()
        if not os.path.exists("config/config.ini"):
            self._create_default_config()
        self.config.read("config/config.ini")

    def _create_default_config(self):
        self.config["TCP_Receive"] = {"host": "127.0.0.1", "port": "5000"}
        self.config["TCP_Send"] = {"host": "127.0.0.1", "port": "5001"}
        self.config["Test_File_Path"] = {"name": "test_logs.txt"}
        self.config["Resolution"] = {"resolution": "1080x1090"}
        self.config["Font"] = {"font": "Helvetica", "size": "20"}
        self.config["DeviceName"] = {"local_device": "ME", "device1": "PC1", "device2": "PC2"}
        with open("config/config.ini", "w") as f:
            self.config.write(f)

    def get_tcp_receive_config(self):
        return (self.config["TCP_Receive"]["host"], int(self.config["TCP_Receive"]["port"]))

    def get_tcp_send_config(self):
        return (self.config["TCP_Send"]["host"], int(self.config["TCP_Send"]["port"]))

    def update_config(self, section, key, value):
        self.config[section][key] = str(value)
        with open("config/config.ini", "w") as f:
            self.config.write(f)

    def get_resolution_config(self):
        return (self.config["Resolution"]["resolution"])
    
    def get_font_config(self):
        return (self.config["Font"]["font"], int(self.config["Font"]["size"]))
    
    def get_device_name_config(self):
        return (self.config["DeviceName"]["local_device"], self.config["DeviceName"]["device1"], self.config["DeviceName"]["device2"])
```

모든 프로그램에는 `설정`이라는 것이 존재하고 나 또한 그를 위한 코드를 하나 짜두었다

### 소감?

솔직히 처음에 구조를 다시 만들어보자 라고 다짐했을 때에는 가장 처음에 떠오른 생각이 어떻게? 였다

내가 뭐 구조를 깔끔하게 하는 방법을 배운 것도 아니고, 파이썬으로 클래스 객체를 만들어보며 놀아보지 않았기에 이번 도전은 사실상 파이썬을 해봤다고는 하지만 내게 처음 도전하는 거나 마찬가지였다

실제로 코드를 구현하는 중에 구조를 4번 정도 갈아엎었기에 지금 나온 구조는 `ReReReRenew_LTC_Project`가 되겠다

그래도 역시 요즘은 세상이 좋아졌으매 인공지능에게 물어봐가며 코드를 계선하니 확실히 기존 하나의 파일에 모든 코드를 떄려박은 것 보다 훨~씬 보기가 편해졌다

일단 이번 작업부터 끝내고 나면 다음부터는 시작 전에 구조부터 확실히 하고 가야겠다

아참 인공지능 쓸 때에 나는 보통 `chatgpt4o`를 사용했는데 정작 써보니 `claude`요놈이 진짜 효자다 문제가 있다면 유료라는 점이겠지만 그정도의 단점을 상쇠할 만큼 내게 도움을 주고 있다

일단 오늘은 여기까지 하고 잔 뒤에 내일 수업 끝나면 다시 완성을 향해 가야겠다

아 그리고 마지막으로 내 코드 좀 큰 오류(tcp 통신부와 GUI의 연결)가 있어 복사해서 실행해보면 메인 GUI는 진입이 되는데 설정창에서는 막히게 될 것이다

## 2025-03-19, 21시 38분, 클래스 사이의 변수 공유

사실 내가 이것저것 많이 짜보기는 했지만 정식으로 시작부터 끝까지 강의를 보거나 책을 보며 파이썬 공부를 해보지 않은지라 사실 이번에 구조 리펙토링 과정에서 `class`에 관한 부분이 꽤나 많이 부족한 상황이였다

그리고 이번에 `main_windows.py`와 `settings_window.py`의 UI를 `tcp_controller.py`에 보내서 사용해야하는데.. 보통의 경우에 `def` 함수에 인자를 보내는 방법은 알지만 과연 `class`에서 어떻게 구현을 하는 것이 좋을까 하는 생각이 많아졌다

코드를 통해 예시를 들어보자면

```py
class MainWindow(ctk.CTk):
    def __init__(self):
        super().__init__()

        # 메인 윈도우 GUI
        self._setup_ui()

    def _setup_ui(self):
        self.receive_log_grid = CTkListbox
        (
            self.log_frame, 
            font=(f"{self.font}", 
            self.font_size, "bold"), 
            multiple_selection=True
        )
        self.receive_log_grid.grid
        (
            row=0, 
            column=0, 
            sticky="nsew", 
            padx=10, 
            pady=10
        )
```

예시 코드는 내 실제 `main_windows.py`에서 가져온 것이다

설명을 해보자면 이제 앱의 메인 화면의 `UI`에 관한 부분이고 다음으로 가져와야하는 세팅의 `UI` 부분을 가져와보자

```py
class SettingsWindow(ctk.CTkToplevel):
    def __init__(self, main_window=None):
        super().__init__()

         # TCP 컨트롤러 생성
        self.tcp_controller = TCPController()
        self.tcp_controller.set_main_window(main_window)
        self.tcp_controller.set_setting_window(self)

        # 중략
        self.get_settings_window_config()        
        self._setup_ui()

    def _setup_ui(self):

        # 중략

        self.settings_menu()

    def settings_menu(self):
        # Device 1 Connect/Disconnect 버튼
        self.connect_button1 = ctk.CTkButton
        (
            settings_frame, 
            text="Connect", 
            command=self.tcp_controller.connect_device1, 
            font=("Helvetica", 20, "bold")
        )
        self.connect_button1.grid
        (
            row=3, 
            column=0, 
            pady=10
        )

```

위가 `settings_window.py`에서 가져온 것이고 여기서 드디어 `tcp_controller.py`의 객체(class)를 생성해 주었다

전체적인 설명은 이 다음 `tcp_controller.py` 코드까지 보고 이어가겠다

```py
class TCPController:
    def __init__(self):
        self.config_manager = ConfigManager()

        self.get_device1_config()
        self.get_device2_config()
        
        self.log_saver = LogSaver()

        self.server = None
        self.client = None
        
        # 연결 상태 추적
        self.device1_connected = False
        self.device2_connected = False

    def set_main_window(self, main_window):
        # 메인 윈도우 참조 설정
        self.main_window = main_window
    
    def set_setting_window(self, setting_window):
        # 세팅 윈도우 참조 설정
        self.setting_window = setting_window
```

위가 바로 TCP 통신을 조정하기 위한 부분이 되겠다

따로 서버나 클라이언트를 실행하는 코드는 `tcp_service.py`에 들어있다

만 여기도 또 문제가 있으니 이건 나중에

### class에 self 변수 넘겨주기

나의 문제는 이러했다

`main_window.py`에서 `연결중` 이라던가 `서버 에러 발생` 혹은 로그가 들어오면 로그를 쭉 띄워주는 UI가 구현되어있는데 결국 통신을 하는 부분은 바로 `tcp_controller.py`에 들어있다

그런데 `tcp_controller.py`는 `settings_window.py`에서 처음 객체를 생성하게 된다

그렇다면 변수를 어떻게 옯겨가야하는가?

```
main_window.py -> settings_window.py -> tcp_controller.py
```

이렇게 진행되어야한다

근데 나는 여기서 문제가 생겼다

하나씩 직접 인수로 전해주자니 말이 안되게 코드가 길어진다

분명 나는 짧고 효율적이게 만들고 싶었는데!

심지어 만약 나중에 다른 프로젝트에서 이 객체를 쓰고자 한다면 싹 갈아엎어야 한다

그렇게 생각해낸 방법은 다음과 같다

---

> main_window.py -> settings_window.py

```py
self.settings_button = ctk.CTkButton
(
    self.settings_frame, 
    text="menu", 
    command=lambda: SettingsWindow(self) ,
    font=(f"{self.font}", 
    self.font_size, 
    "bold")
)
```

`command` 부분을 유심히 살펴보자

어제 쓴 코드에 관한 글을 보면 분명

`command=SettingsWindow`

라고 되어있었을 것이다

하지만 이번에는 `main_window.py`의 변수들을 모두 `settings_window.py`의 `SettingWindow` class 객체에 넘겨주기 위해서 `lambda`를 이용하였다

알아보니 그냥 `command`를 이용하면 인수를 넘겨줄 수 없기에 `lambda`를 이용하여 `SettingWindow`객체에 `self` 즉 지금 이 코드는 `main_window.py`에 들어있기에 메인 UI의 버튼들을 넘겨줄 수 있게 되었다

처음에는 여기서 바로 `TCPController`에 넘겨줄까 하였으나 애초에 `TCPController`는 설정 창에서 실행시켜야 하기에 일단 설정으로 옮겨놨다

---
> settings_window.py -> tcp_controller.py

```py
class SettingsWindow(ctk.CTkToplevel):
    def __init__(self, main_window=None):
        super().__init__()
        # 설정 값 불러오기
        self.config_manager = ConfigManager()
        
        # main_window.py에서 가져온 변수 끌고오기
        self.main_window = main_window
        
        # TCP 컨트롤러 생성
        self.tcp_controller = TCPController()
        self.tcp_controller.set_main_window(main_window)
        self.tcp_controller.set_setting_window(self)
```

솔직히 지금 이 글을 쓰면서 변수를 끌고온다고 표현하는 것이 맞는지 모르겠다. 뭔가 다른 단어가 있을 것 같은 기분?

위 코드에 대해 설명하자면 아까 `main_window.py`에서 `self`를 인수로 넘겨주며 객체를 생성하였고 그렇게 생성된 객체에서는 `self.main_window = main_window`를 통해 변수들을 사용할 수 있게 선언하였다

만 이건 생각해보니 `SettingsWindow` 객체에서 사용할 것이 아니라면 쓸 필요가 없다, 일단은 살려두자 혹시 모르니

그 후 드디어 `TCPController` 객체를 생성하도록 하자!

```py
# TCP 컨트롤러 생성
self.tcp_controller = TCPController()
self.tcp_controller.set_main_window(main_window)
self.tcp_controller.set_setting_window(self)
```

첫줄에서 객체를 생성하고 

두번째 줄에서는 `set_main_window`를 통해 `main_window`의 변수를 넘겨준 뒤

세번째 줄에서는 `set_setting_window`를 통해 `self` 이번에는 `SettingsWindow`의 변수를 넘겨주게 되었다

그렇다면 어떻게 변수를 넘겨줬다는 말일까?

---
> tcp_controller.py에서 변수 받기

```py
def set_main_window(self, main_window):
    # 메인 윈도우 참조 설정
    self.main_window = main_window

def set_setting_window(self, setting_window):
    # 세팅 윈도우 참조 설정
    self.setting_window = setting_window
```

이렇게 들여온 변수들을 `self` 이번에는 `settings_window.py`의 변수들을 넘겨주어 `TCPController` 객체에서 `self.main_window`와 `self.setting_window`와 같이 선언하여 사용할 수 있게 하였다

여기서 혹시 문제가 될만한 부분은 GUI가 작동하는 과정에 있어 쓰레딩에서 root의 코드를 조정하게 되었을 때에 충돌이 나지 않을까 하는 생각이 든다

### 오늘의 문제 (TCP 통신과정에 생긴 문제)

GUI의 기본적인 부분을 어느정도 손본 뒤에 정말로 로그가 잘 오가는지 테스트를 해보기로 했다

일단은 로그를 받는 부분을 테스트 해보았는데

이 때 로그를 보내는 코드는 

```py
import socket
import time



# TCP 서버의 IP와 포트 설정
TCP_IP = '127.0.0.1'  # 서버 IP
TCP_PORT = 12345      # 서버 포트

# 파일 경로 설정
file_path = "test.txt"

try:
    # 소켓 생성
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((TCP_IP, TCP_PORT))
    print(f"서버 {TCP_IP}:{TCP_PORT}에 연결되었습니다.")

    # 파일 읽기
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            line = line.strip()  # 줄 끝의 공백 제거
            if line:  # 빈 줄 무시
                client_socket.sendall(line.encode('utf-8'))  # 데이터 전송
                print(f"보냄: {line}")

                # 서버로부터 응답 받기
                response = client_socket.recv(1024).decode('utf-8')  # 최대 1024 바이트 수신
                print(f"서버 응답: {response}")

                time.sleep(1)  # 1초 대기

    print("파일의 모든 줄을 전송했습니다.")
except FileNotFoundError:
    print(f"파일을 찾을 수 없습니다: {file_path}")
except ConnectionError:
    print("TCP 서버와 연결할 수 없습니다.")
except Exception as e:
    print(f"오류 발생: {e}")
finally:
    client_socket.close()
    print("연결이 종료되었습니다.")
```

전에 만들어둔 코드를 사용하였다

헌데 여기서 문제가 발생!

로그가 들어온 후에 

![Image](https://github.com/user-attachments/assets/0939883e-2d7c-4cc9-bb6b-ab1341f36e9c)

위와 같이 하나를 보내고 받은 뒤 이상하게 더이상 로그를 보내지 않다가 갑자기 연결이 끊겨버린다

![Image](https://github.com/user-attachments/assets/9cff8800-b332-4d03-92fd-54333c20847b)

아무리 생각해도 이상해서 `wireshark`로 로그를 찍어봤다

분명히 연결되고 처음 통신은 되는데 그 이후 랜덤하게 몇번의 로그를 주고받고 앱에서 더이상 아무런 페킷도 보내지 않는다는 것을 확인했다...

오잉? 일단 이 부분은 늦은 시간이니 내일 다시 생각해보기로 하자

22시 56분

## 2025-03-20, 15시 44분, TCP 통신 과정에 생긴 오류

오늘은 어제 못했던 `tcp`통신 상의 문제에 대해서 해결하고 있다

일단 첫번째 문제라고 하자면

내가 구조를 분리하기 전 코드에서는 TCP 통신과정이 이렇게 되었다

```
client  server
  |  ---> |     SYN
  |  <--- |     SYN, ACK
  |  ---> |     ACK
  |  ---> |     PSH, ACK
  |  <--- |     ACK
  |  <--- |     PSH, ACK
  |  ---> |     ACK
  |  ---> |     PSH, ACK

    .....

  | --->  |     FIN, ACK
```

위와 같은 방식으로 연결되곤 하는데

패킷순이 아닌 글로 설명을 해보도록 하겠다

`client와 server에 연결`

`client가 server에 로그 전송`

`server가 client에 확인 로그 전송`

위와 같은 방식으로 통신을 이루어질 수 있게 코드를 구현했었는데

이번에 구조를 모두 뜯어고치면서 확인 로그 전송에 관한 부분을 없앴기에 테스트용 로그 전송 코드에 문제가 있었다는 것을 알 수 있었다

```py
# 파일 읽기
with open(file_path, 'r', encoding='utf-8') as file:
    for line in file:
        line = line.strip()  # 줄 끝의 공백 제거
        if line:  # 빈 줄 무시
            client_socket.sendall(line.encode('utf-8'))  # 데이터 전송
            print(f"보냄: {line}")

            # 서버로부터 응답 받기
            #response = client_socket.recv(1024).decode('utf-8')  # 최대 1024 바이트 수신
            #print(f"서버 응답: {response}")

            time.sleep(1)  # 1초 대기
```

위와 같이 서버 응답 부분을 아예 삭제한 뒤에 테스트를 해보았을 때

[사진 삽입부]

드디어 통신이 원활하게 이루어지기 시작했다!

만... 어째 이상하게 wireshark에서 통신은 확실하게 성공하였으나 UI 부분에서 아예 `_update_ui_with_data`에 로그가 들어가는 순간부터 멈춰버리는 오류가 발생하고 있다

아니네.. 

```py
#self.callback(data)
#print("콜백 성공")
```

이런 식으로 UI update를 하지 못하게 막아도 

```
스레드 설정 완료
트라이중
스레드 시작
서버 실행
1 ('127.0.0.1', 45724)
트라이중
서버 종료
```

cmd에서는 위와 같이 로그가 뜰 뿐이지만 분명히 wireshark에서는 통신이 원활이 이루어지고 있다

또 다른 문제라고 하자면 `disconnect`를 눌러 서버의 연결을 종료하여도 패킷을 보니 서버에서 `FIN` 신호를 보내지 않는다는 것을 알 수 있었다

근데 저거 콜백을 제거하기 전에는 서버 종료가 되던데 뭐지?

### 1차 문제 정리

- TCP 통신은 잘 이루어지나 GUI에 표시 안됨
- 그 전에 CLI 창에도 표시되지 않음
- disconnect 버튼을 눌러도 서버가 종료되지 않음

## 2025-04-3, 10시 59분

일단 매우 많은 부분이 변경되고 있는 중이다.

기본적으로 파일을 나눠서 로직을 짜다보니 tcp 통신에 있어 기본 클라이언트 및 서버를 위해 클래스로 구현하였고 지금 여기 적을 것은 내가 생각하기에 일단 내가 잘 알지 못했던 부분이기도 하다

### 프로그램의 종료 문제

내가 앱을 만들 때에 당연하다면 당연하달까 GUI를 메인으로 삼고 tcp 통신을 쓰레드로 넣어놓다 보니 앱을 종료하여도(창을 꺼도) 쓰레드가 죽지 않고 살아있는 문제가 생겼다

1. 서버와 클라이언트 스레드가 while 루프에서 계속 실행 중이기 때문에 프로그램이 종료되지 않음

2. 프로그램 종료 시 서버와 클라이언트의 stop 메서드가 호출되지 않아 소켓이 닫히지 않음

3. 스레드가 종료되기 전에 메인 스레드가 종료되면서 문제가 발생

음... 이걸 어찌 해결한담

일단은 메인 앱이 꺼지면서 스레드를 종료할 수 있는 방법이 없어진 것이니 `main_windows.py`를 살펴보자

이번에 바꾼 부분은 다음과 같다

```py
class MainWindow(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.tcp_controller = TCPController()

        # 창 닫기 이벤트 처리
        self.protocol("WM_DELETE_WINDOW", self.on_closing)

    def on_closing(self):
        # TCPController의 모든 스레드 종료
        self.tcp_controller.stop_all()
        print("모든 스레드가 종료되었습니다.")
        self.destroy()  # 창 닫기
```

바로 창 닫기 이벤트를 처리할 수 있다는 것이다!!

아무래도 메인 윈도우에서 세팅 창을 열고 그 창에서 tcp 통신 스레드를 열다보니 그럼 메인 윈도우의 창 닫기를 감지할 수 있으면 되는 것 아닐까? 하는 생각에서 찾아낸 방법이다

![Image](https://github.com/user-attachments/assets/05a5c521-f14a-4176-b533-46c67ae6d52b)

드디어! 굳이 `ctrl_c`를 누르지 않더라도 종료할 수있게 되었다!