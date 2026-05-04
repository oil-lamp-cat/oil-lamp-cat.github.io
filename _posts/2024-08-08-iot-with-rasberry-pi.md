---
title: "라즈베리파이로 iot를 만들어보자"
date: 2024-08-08 15:57:15 +09:00
categories: [Network & Infrastructure]
tags: [Raspberry-Pi, IoT, MySQL, MariaDB]
pin: true
---

# 개요

> 라즈베리파이로 iot 만들기

## 준비물

| 종류               | 수량           | 설명                                      |
| ------------------ | -------------- | ----------------------------------------- |
| 라즈베리파이 ver.4 | 2              | 프론트엔드 및 백엔드 서버, DB 서버 총 2개 |
| 릴레이 모듈        | SRD-05VDC-SL-C | 에어컨, 히터 온오프 제어                  |
| 습온 측정 모듈     | DHT11          | 방 습도 및 온도 측정용 센서               |

### 라즈베리파이 1

1. 사용자(나)가 접속하여 에어컨 제어 및 히터를 제어할 수 있게 한다
2. 방 습도 및 온도를 측정하여 사용자에게 띄워준다
3. 에어컨 및 히터의 사용량에 따른 그래프를 보여준다
4. 사용시간을 계산하여 전기사용량 및 비용을 계산한다

### 라즈베리파이 2

1. DB테이블을 세팅하여 일정 시간마다 온습정보와 에어컨 혹은 히터의 사용량을 저장한다
2. 끝이다

이렇게 보니까 되게 라즈베리파이 1에 db를 만들어서 하나로 구동시키는 것도 방법일 것 같다.. 만 이번에는 외부 db와 통신하는 연습을 할 것이기에 2대를 가지고 구현해본다

## 구성 - 1차

```cmd
.
├── control.py
├── insert_data.php - 삭제
├── insert_data.py
└── templates
    └── iot.html
```

### control.py

이름과 같이 실제 http 서비스를 띄워주고 백엔드 데이터들을 제어하는 역할을 한다

<details><summary>1차</summary>
<div markdown = "1">

```py
import RPi.GPIO as GPIO
import time
import Adafruit_DHT
import requests
from flask import Flask, render_template, jsonify

GPIO.setwarnings(False)
app = Flask(__name__)

hum_temp_pin = 4
relay_Cool = 5
relay_Hot = 6
sensor = Adafruit_DHT.DHT11
GPIO.setmode(GPIO.BCM)
GPIO.setup(relay_Cool, GPIO.OUT)
GPIO.setup(relay_Hot, GPIO.OUT)

relay_status = {'Cool': 0, 'Hot': 0}
hum_temp = {'Humidity': 0, 'Temperature': 0}

@app.route('/')
def home():
    return render_template('iot.html', relay_status=relay_status, hum_temp=hum_temp)

@app.route('/update')
def update():
    humidity, temperature = Adafruit_DHT.read_retry(sensor, hum_temp_pin)
    hum_temp['Humidity'] = humidity
    hum_temp['Temperature'] = temperature
    send_data_to_php(humidity, temperature)
    return jsonify(hum_temp=hum_temp)

def send_data_to_php(humidity, temperature):
    url = "http://라즈베리파이1_IP_ADDRESS/insert_data.php"
    data = {
        'humidity': humidity,
        'temperature': temperature
    }
    requests.post(url, data=data)

@app.route('/toggle_cool')
def toggle_cool():
    relay_status['Cool'] = 1 if relay_status['Cool'] == 0 else 0
    GPIO.output(relay_Cool, GPIO.HIGH if relay_status['Cool'] else GPIO.LOW)
    return jsonify(relay_status=relay_status)

@app.route('/toggle_hot')
def toggle_hot():
    relay_status['Hot'] = 1 if relay_status['Hot'] == 0 else 0
    GPIO.output(relay_Hot, GPIO.HIGH if relay_status['Hot'] else GPIO.LOW)
    return jsonify(relay_status=relay_status)

if __name__ == '__main__':
    app.run(debug=True, port=8080, host='0.0.0.0')

```

</div>
</details>

<details><summary>2차</summary>
<div markdown = "1">

```python
import RPi.GPIO as GPIO
import Adafruit_DHT
from insert_data import insert_data
from flask import Flask, render_template, jsonify

GPIO.setwarnings(False)
app = Flask(__name__)

hum_temp_pin = 4
relay_Cool = 5 #임시
relay_Hot = 14
sensor = Adafruit_DHT.DHT11
GPIO.setmode(GPIO.BCM)
GPIO.setup(relay_Cool, GPIO.OUT)
GPIO.setup(relay_Hot, GPIO.OUT)

relay_status = {'Cool': 0, 'Hot': 0}
hum_temp = {'Humidity': 0, 'Temperature': 0}

@app.route('/')
def home():
    return render_template('iot.html', relay_status=relay_status, hum_temp=hum_temp)

@app.route('/update')
def update():
    humidity, temperature = Adafruit_DHT.read_retry(sensor, hum_temp_pin)
    hum_temp['Humidity'] = humidity
    hum_temp['Temperature'] = temperature
    send_data(humidity, temperature)
    return jsonify(hum_temp=hum_temp)

def send_data(humidity, temperature):
    data = {
        'humidity': humidity,
        'temperature': temperature,
        'cool': relay_status['Cool'],
        'hot': relay_status['Hot']
    }
    insert_data(data)

@app.route('/toggle_cool')
def toggle_cool():
    relay_status['Cool'] = 1 if relay_status['Cool'] == 0 else 0
    GPIO.output(relay_Cool, GPIO.HIGH if relay_status['Cool'] else GPIO.LOW)
    return jsonify(relay_status=relay_status)

@app.route('/toggle_hot')
def toggle_hot():
    relay_status['Hot'] = 1 if relay_status['Hot'] == 0 else 0
    GPIO.output(relay_Hot, GPIO.HIGH if relay_status['Hot'] else GPIO.LOW)
    return jsonify(relay_status=relay_status)

if __name__ == '__main__':
    app.run(debug=True, port=8080, host='0.0.0.0')
```

GPIO핀 값 조정 및 `insert_data` 파이썬으로 교체

</div>
</details>

### insert_data.php - 삭제

라즈베리파이 1에서 얻은 temphue, on,off 데이터를 라즈베리파이 2의 mariaDB로 옮겨 저장

하곤 했었는데 내가 처음 접하는 언어라 그런건가? 아니면 데이터 흐름을 이해하지 못하여 그런것인지 자꾸만 

```html
<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>404 Not Found</title>
</head><body>
<h1>Not Found</h1>
<p>The requested URL was not found on this server.</p>
<hr>
<address>Apache/2.4.61 (Raspbian) Server at 192.xxx.xxx.xxx Port 80</address>
</body></html>
```

위와 같은 오류를 마주하게 되어서 차라리 파이썬을 이용하기로 하였다... 

파이썬이 더 편해용...


<details><summary>1차</summary>
<div markdown = "1">

```php
<?php
$servername = "192.xxx.xxx.xxx";
$username = "xxxx";
$password = "xxxx";
$dbname = "TestDB";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$humidity = $_POST['humidity'];
$temperature = $_POST['temperature'];
$daytime = date('Y-m-d H:i:s');

$sql = "INSERT INTO TempHue (Daytime, Temperature, Humidity) VALUES ('$daytime', '$temperature', '$humidity')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
```

</div>
</details>

일단은 내 노트북 하스팟을 이용하기에 ip를 가릴 필요는 없다만 혹시 모르기에 가렸다

### insert_data.py
`inset_data.php`사용하는 것에 실패하고 내가 자주 쓰던 언어인 python으로 넘어왔다

다시 구현을 해보자면 일단은 다음과 같다

<details><summary>1차</summary>
<div markdown = "1">

```python
import pymysql
from datetime import datetime

def insert_data(data):
    try:
        # 데이터베이스 연결
        connection = pymysql.connect(
            host='192.xxx.xxx.xxx',
            user='xxxx',
            password='xxxx',
            database='TestDB'
        )

        with connection.cursor() as cursor:
            # 현재 날짜와 시간 가져오기
            daytime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            # SQL 쿼리 작성
            sql = "INSERT INTO TempHue (Daytime, Temperature, Humidity) VALUES (%s, %s, %s)"
            values = (daytime, data['temperature'], data['humidity'])

            # 쿼리 실행
            cursor.execute(sql, values)
            connection.commit()
            print("New record created successfully")

    except pymysql.MySQLError as e:
        print(f"Error: {e}")

    finally:
        connection.close()
```

</div>
</details>

### iot.html

사용자에게 보여줄 페이지

<details><summary>1차</summary>
<div markdown = "1">

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>IoT Dashboard</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        function updateData() {
            $.ajax({
                url: '/update',
                method: 'GET',
                success: function(data) {
                    $('#humidity').text(data.hum_temp.Humidity);
                    $('#temperature').text(data.hum_temp.Temperature);
                }
            });
        }

        function toggleCool() {
            $.ajax({
                url: '/toggle_cool',
                method: 'GET',
                success: function(data) {
                    $('#cool_status').text(data.relay_status.Cool ? '1' : '0');
                }
            });
        }

        function toggleHot() {
            $.ajax({
                url: '/toggle_hot',
                method: 'GET',
                success: function(data) {
                    $('#hot_status').text(data.relay_status.Hot ? '1' : '0');
                }
            });
        }

        $(document).ready(function() {
            $('#cool_button').click(toggleCool);
            $('#hot_button').click(toggleHot);
            setInterval(updateData, 5000); // 5초마다 데이터 갱신
        });
    </script>
</head>
<body>
    <h1>IoT Dashboard</h1>
    <h2>Relay Status</h2>
    <p>Cool: <span id="cool_status">{{ relay_status['Cool'] }}</span></p>
    <button id="cool_button">Toggle Cool</button>
    <p>Hot: <span id="hot_status">{{ relay_status['Hot'] }}</span></p>
    <button id="hot_button">Toggle Hot</button>

    <h2>Temperature and Humidity</h2>
    <p>Humidity: <span id="humidity">{{ hum_temp['Humidity'] }}</span>%</p>
    <p>Temperature: <span id="temperature">{{ hum_temp['Temperature'] }}</span>°C</p>
</body>
</html>
```

</div>
</details>
</br>

## 구성 - 2차

```
.
├── control.py - flask
├── graph.py - 그래프 생성
├── insert_data.php - 삭제
├── insert_data.py - DB 저장
├── mktable.py - 테이블 백업용
└── templates
    ├── graph1.html - Temp, Hue
    ├── graph2.html - Cool, Hot
    └── iot.html - 메인 html
```

외부에서 접속은 불가하기에 이번에는 굳이 ip를 가리지는 않겠다

### control.py

그래프 생성, 그래프 띄우기 등 여러가지가 추가되었다.

<details><summary>control.py</summary>
<div markdown = "1">

```python
import RPi.GPIO as GPIO
import Adafruit_DHT
from insert_data import insert_data
from graph import create_graph_temp_hue, create_graph_cool_hot
import os
from flask import Flask, render_template, jsonify, send_from_directory

GPIO.setwarnings(False)
app = Flask(__name__)

hum_temp_pin = 4
relay_Cool = 5  # 임시
relay_Hot = 14
sensor = Adafruit_DHT.DHT11
GPIO.setmode(GPIO.BCM)
GPIO.setup(relay_Cool, GPIO.OUT)
GPIO.setup(relay_Hot, GPIO.OUT)

G1path = "templates/graph1.html"
G2path = "templates/graph2.html"

relay_status = {'Cool': 0, 'Hot': 0}
hum_temp = {'Humidity': 0, 'Temperature': 0}

@app.route('/')
def home():
    return render_template('iot.html', relay_status=relay_status, hum_temp=hum_temp)

@app.route('/update')
def update():
    humidity, temperature = Adafruit_DHT.read_retry(sensor, hum_temp_pin)
    hum_temp['Humidity'] = humidity
    hum_temp['Temperature'] = temperature
    send_data(humidity, temperature)
    return jsonify(hum_temp=hum_temp)

def send_data(humidity, temperature):
    data = {
        'humidity': humidity,
        'temperature': temperature,
        'cool': relay_status['Cool'],
        'hot': relay_status['Hot']
    }
    insert_data(data)

@app.route('/graph1')
def graph1():
    if not os.path.exists(G1path):
        create_graph_temp_hue()  # 그래프가 없으면 생성
    return send_from_directory('templates', 'graph1.html')

@app.route('/graph2')
def graph2():
    if not os.path.exists(G2path):
        create_graph_cool_hot()  # 그래프가 없으면 생성
    return send_from_directory('templates', 'graph2.html')

@app.route('/generate_graph1')
def generate_graph1():
    create_graph_temp_hue()
    return send_from_directory('templates', 'graph1.html')

@app.route('/generate_graph2')
def generate_graph2():
    create_graph_cool_hot()
    return send_from_directory('templates', 'graph2.html')

@app.route('/toggle_cool')
def toggle_cool():
    relay_status['Cool'] = 1 if relay_status['Cool'] == 0 else 0
    GPIO.output(relay_Cool, GPIO.HIGH if relay_status['Cool'] else GPIO.LOW)
    return jsonify(relay_status=relay_status)

@app.route('/toggle_hot')
def toggle_hot():
    relay_status['Hot'] = 1 if relay_status['Hot'] == 0 else 0
    GPIO.output(relay_Hot, GPIO.HIGH if relay_status['Hot'] else GPIO.LOW)
    return jsonify(relay_status=relay_status)

if __name__ == '__main__':
    app.run(debug=True, port=8080, host='0.0.0.0')
```

</div>
</details>

### graph.py

Temperature과 Humidity, Cool, Hot 그래프를 생성한다

데이터는 라즈베리파이2에 있는 MariaDB에 있다

문제점 : 네트워크 통신이다보니 새로 만드는데 속도가 꽤나 느리다

해결 : 이전에 만들어 놓은 그래프를 띄워놓고 후에 새로운 그래프가 만들어지면 그것을 띄운다

<details><summary>graph.py</summary>
<div markdown = "1">

```python
import pymysql
import plotly.graph_objs as go
import plotly
import json

def create_graph_temp_hue():
    # MariaDB 연결
    connection = pymysql.connect(
        host='192.168.137.243',
        user='dev',
        password='pwd',
        db='TestDB',
        charset='utf8',
        cursorclass=pymysql.cursors.DictCursor
    )
    
    try:
        with connection.cursor() as cursor:
            # 쿼리 업데이트: Temperature, Humidity 데이터를 가져오기
            sql = """
                SELECT Daytime, 
                       SUM(Humidity) AS Humidity, 
                       SUM(Temperature) AS Temperature
                FROM TempHue
                GROUP BY Daytime
                ORDER BY Daytime
            """
            cursor.execute(sql)
            data = cursor.fetchall()
            
            # 데이터 가공
            daytimes = [row['Daytime'] for row in data]
            humidities = [row['Humidity'] for row in data]
            temperatures = [row['Temperature'] for row in data]

            # 그래프 생성
            fig = go.Figure()
            
            # Humidity 데이터 - 곡선 그래프
            fig.add_trace(go.Scatter(x=daytimes, y=humidities, mode='lines', name='Humidity'))
            
            # Temperature 데이터 - 곡선 그래프
            fig.add_trace(go.Scatter(x=daytimes, y=temperatures, mode='lines', name='Temperature'))
            
            # 레이아웃 업데이트
            fig.update_layout(
                title='Temperature and Humidity Over Time',
                xaxis_title='Daytime',
                yaxis_title='Value',
                legend_title='Legend'
            )

            # 그래프를 JSON 형식으로 변환
            graph_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
            
            # 생성한 그래프를 HTML로 저장
            with open("templates/graph1.html", "w") as f:
                f.write(f'<div id="graph_div1"></div><script src="https://cdn.plot.ly/plotly-latest.min.js"></script><script>var graph_json = {graph_json}; Plotly.newPlot("graph_div1", graph_json.data, graph_json.layout);</script>')

    finally:
        connection.close()

def create_graph_cool_hot():
    # MariaDB 연결
    connection = pymysql.connect(
        host='192.168.137.243',
        user='dev',
        password='pwd',
        db='TestDB',
        charset='utf8',
        cursorclass=pymysql.cursors.DictCursor
    )
    
    try:
        with connection.cursor() as cursor:
            # 쿼리 업데이트: Cool과 Hot 데이터를 가져오기
            sql = """
                SELECT Daytime, 
                       SUM(Cool) AS Cool, 
                       SUM(Hot) AS Hot
                FROM TempHue
                GROUP BY Daytime
                ORDER BY Daytime
            """
            cursor.execute(sql)
            data = cursor.fetchall()
            
            # 데이터 가공
            daytimes = [row['Daytime'] for row in data]
            cools = [row['Cool'] for row in data]
            hots = [row['Hot'] for row in data]

            # 그래프 생성
            fig = go.Figure()
            
            # Cool 데이터 - 막대 그래프
            fig.add_trace(go.Bar(x=daytimes, y=cools, name='Cool'))
            
            # Hot 데이터 - 막대 그래프
            fig.add_trace(go.Bar(x=daytimes, y=hots, name='Hot'))
            
            # 레이아웃 업데이트
            fig.update_layout(
                title='Cool and Hot Over Time',
                xaxis_title='Daytime',
                yaxis_title='Count',
                legend_title='Legend',
                barmode='group'  # 막대 그래프를 나란히 배치
            )

            # 그래프를 JSON 형식으로 변환
            graph_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
            
            # 생성한 그래프를 HTML로 저장
            with open("templates/graph2.html", "w") as f:
                f.write(f'<div id="graph_div2"></div><script src="https://cdn.plot.ly/plotly-latest.min.js"></script><script>var graph_json = {graph_json}; Plotly.newPlot("graph_div2", graph_json.data, graph_json.layout);</script>')

    finally:
        connection.close()
```

</div>
</details>

### insert_data.py

데이터를 라즈베리파이2의 db로 보낸다

문제 : 느리다
해결법 : 라즈베리파이1에 db를 만들고 가져다 쓰는 것이 훨씬 빠를것

<details><summary>insert_data.py</summary>
<div markdown = "1">

```python
import pymysql
from datetime import datetime

def insert_data(data):
    try:
        # 데이터베이스 연결
        connection = pymysql.connect(
            host='192.168.137.243',
            user='dev',
            password='pwd',
            database='TestDB'
        )

        with connection.cursor() as cursor:
            # 현재 날짜와 시간 가져오기
            daytime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            # SQL 쿼리 작성
            sql = "INSERT INTO TempHue (Daytime, Temperature, Humidity, Cool, Hot) VALUES (%s, %s, %s, %s, %s)"
            values = (daytime, data['temperature'], data['humidity'], data['cool'], data['hot'])

            # 쿼리 실행
            cursor.execute(sql, values)
            connection.commit()
            print("New record created successfully")

    except pymysql.MySQLError as e:
        print(f"Error: {e}")

    finally:
        connection.close()
```

</div>
</details>

### mktable.py

실제 작동시에는 없어도 된다

테이블을 삭제하였을 때 백업 용으로 만들어 놓았다

<details><summary>mktable.py</summary>
<div markdown = "1">

```python
#테이블 삭제되면 백업용

import pymysql

conn = pymysql.connect(host='192.168.137.243', user='dev', password='pwd', db='TestDB', charset='utf8')

cur = conn.cursor()

sql = '''CREATE TABLE TempHue(Daytime varchar(50), Temperature varchar(20), Humidity varchar(20), Cool varchar(20), Hot varchar(20))'''

cur.execute(sql)

conn.commit()

conn.close()

print("done")
```
</div>
</details>

### graph1.html

`Temperature`과 `Humidity` 데이터를 담고 있는 html 그래프이다

`graph.py`를 통해 만들어진다

선 그래프이다

### graph2.html

`Cool`과 `Hot` 릴레이 데이터를 담고 있는 html 그래프이다

`graph.py`를 통해 만들어진다

막대 그래프이다

### iot.html

실제 가장 메인이 되는 html 코드이다

<details><summary>iot.html</summary>
<div markdown = "1">

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>IoT Dashboard</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <script>
        function updateData() {
            $.ajax({
                url: '/update',
                method: 'GET',
                success: function(data) {
                    $('#humidity').text(data.hum_temp.Humidity);
                    $('#temperature').text(data.hum_temp.Temperature);
                }
            });
        }

        function toggleCool() {
            $.ajax({
                url: '/toggle_cool',
                method: 'GET',
                success: function(data) {
                    $('#cool_status').text(data.relay_status.Cool ? '1' : '0');
                }
            });
        }

        function toggleHot() {
            $.ajax({
                url: '/toggle_hot',
                method: 'GET',
                success: function(data) {
                    $('#hot_status').text(data.relay_status.Hot ? '1' : '0');
                }
            });
        }

        function loadTempHueGraph() {
            if ($('#graph1').is(':visible')) {
                $('#graph1').slideUp(); // 그래프 숨기기
            } else {
                $.ajax({
                    url: '/graph1',
                    method: 'GET',
                    success: function(data) {
                        $('#graph1').html(data).slideDown();
                        //실행 후 새로운 그래프 가져오기
                        $.ajax({
                            url: '/generate_graph1',
                            method: 'GET',
                            success: function(newGraphData1) {
                                $('#graph1').html(newGraphData1);
                            },
                            error: function() {
                                $('#graph1').html('<p>Error generating new Temperature and Humidity graph.</p>');
                            }
                        });
                    },
                    error: function() {
                        $('#graph1').html('<p>Error loading Temperature and Humidity graph.</p>');
                    }
                });
            }
        }

        function loadCoolHotGraph() {
            if ($('#graph2').is(':visible')) {
                $('#graph2').slideUp(); // 그래프 숨기기
            } else {
                $.ajax({
                    url: '/graph2',
                    method: 'GET',
                    success: function(data) {
                        $('#graph2').html(data).slideDown();
                        //실행 후 새로운 그래프 가져오기
                        $.ajax({
                            url: '/generate_graph2',
                            method: 'GET',
                            success: function(newGraphData2) {
                                $('#graph2').html(newGraphData2);
                            },
                            error: function(){
                                $('#graph2').html('<p>Error loading Cool and Hot graph.</p>')
                            }
                        })
                    },
                    error: function() {
                        $('#graph2').html('<p>Error loading Cool and Hot graph.</p>');
                    }
                });
            }
        }

        $(document).ready(function() {
            $('#cool_button').click(toggleCool);
            $('#hot_button').click(toggleHot);
            $('#temphue_graph_button').click(loadTempHueGraph);
            $('#cool_hot_graph_button').click(loadCoolHotGraph);
            setInterval(updateData, 5000); // 5 seconds interval for data refresh
        });
    </script>
</head>
<body>
    <h1>IoT Dashboard</h1>
    <h2>Relay Status</h2>
    <p>Cool: <span id="cool_status">{{ relay_status['Cool'] }}</span></p>
    <button id="cool_button">Toggle Cool</button>
    <p>Hot: <span id="hot_status">{{ relay_status['Hot'] }}</span></p>
    <button id="hot_button">Toggle Hot</button>

    <h2>Temperature and Humidity</h2>
    <p>Humidity: <span id="humidity">{{ hum_temp['Humidity'] }}</span>%</p>
    <p>Temperature: <span id="temperature">{{ hum_temp['Temperature'] }}</span>°C</p>

    <h2>Graphs</h2>
    <button id="temphue_graph_button">Temperature and Humidity Graph</button>
    <button id="cool_hot_graph_button">Cool and Hot Graph</button>
    <div id="graph1" style="display:none;"></div> <!-- Temperature and Humidity graph -->
    <div id="graph2" style="display:none;"></div> <!-- Cool and Hot graph -->
</body>
</html>
```

</div>
</details>

## 구성 - 3차 (2024-08-19)

아... 드디어 해결

당장 전날만 해도 잘 작동하던 코드가 다음날이 되니 갑자기

```
asde@raspberrypi:~/iot/webapp $ python control.py
Traceback (most recent call last):
  File "/home/asde/iot/webapp/control.py", line 16, in <module>
    GPIO.setup(relay_Cool, GPIO.OUT)
RuntimeError: Not running on a RPi!
```

라며 `이건 라즈베리파이에서 작동중인 코드가 아니에욧!` 이러는데 미칠 지경이었다.. 아니 어제는 됬잖아요...

난 분명 ssh에서 실행중이었고 코드는 라즈베리파이4에서 실행중이었기에.. 일단은 마음을 가다듬고 검색을 해보았다

여기저기 찾아봤지만 지금 생각해보면 아무래도 노트북에서 작업한다고 vscode에 ssh로 파일을 열어서 실행한 것이 문제가 되지 않았나 하는 생각이 든다

처음에는 pip를 통해 다 지우고 다시 설치 하려고 했더니 `Adafruit_dht`은 이제 오래되서 지원을 안한다고 하질 않나.. 결국에는 `Adafruit_CircuitPython_DHT`을 설치해서 해결했다만.. 또 파이썬이 문제인가 싶어서 파이썬을 삭제했다가 다시 깔았더니 용량이 부족하다고 하기에..

뭐 결국에는 RPI(라즈베리파이)에 있던 모든 자료를 scp명령어를 통해 내 노트북으로 가져와 라즈비안을 다시 설치했다

scp명령어가 이렇게 유용할 줄은 생각도 못했다. 사용법이라면

> 로컬에서 원격으로 보낼 때

```
scp [전송할 파일 경로] [유저명]@[IP주소]:[받을 경로]
```

> 원격에서 로컬로 보낼 때

```
scp [유저명]@[IP주소]:[전송할 파일 경로] [받을 경로]
```

> 원격에서 원격으로 보낼 때는

```
scp [유저명]@[IP주소]:[전송할 파일 경로] [유저명]@[IP주소]:[받을 경로]
```

으로 사용하면 된다고 한다

그중에 나는 RPI에서 로컬로 가져와야 했기에

```
scp asde@라즈베리파이IP:/home/asde/iot D:/ssh
```

를 이용하였다

그 후 다시 싹 포멧하고 이번에는 저번과 달리 파이썬 가상환경 venv를 이용하기로 했다

파이썬을 다룬지 좀 되서 까먹었었는데 가상환경을 이용하면 루트 패키지를 건드리지 않고 안전하게 작업할 수 있기에 거진 필수 작업이다. 그렇게 만들어진 tree는 다음과 같다

```
(iotvenv) asde@raspberrypi:~/iot/webapp $ tree -L 2
.
├── control.py
├── graph.py
├── insert_data.php
├── insert_data.py
├── iotvenv
│   ├── bin
│   ├── etc
│   ├── include
│   ├── lib
│   ├── lib64 -> lib
│   ├── pyvenv.cfg
│   └── share
├── mktable.py
├── __pycache__
│   ├── graph.cpython-311.pyc
│   └── insert_data.cpython-311.pyc
├── requirements.txt
└── templates
    ├── favicon.ico
    ├── graph1.html
    ├── graph2.html
    └── iot.html
```

`iotvenv`가 바로 파이썬 가상환경이고 안에 내용물이 너무 많아 `tree -L 2`로 깊이 설정을 해줘 편하게 볼 수 있다

일단 이번에는 바뀐 부분만 확인하자

### requirements.txt

혹시 내가 나중에 필요할까 하여 저장해 둔다

```
Adafruit-Blinka==8.47.0
adafruit-circuitpython-busdevice==5.2.9
adafruit-circuitpython-connectionmanager==3.1.1
adafruit-circuitpython-dht==4.0.4
adafruit-circuitpython-requests==4.1.6
adafruit-circuitpython-typing==1.11.0
Adafruit-PlatformDetect==3.73.0
Adafruit-PureIO==1.1.11
binho-host-adapter==0.1.6
blinker==1.8.2
click==8.1.7
Flask==3.0.3
Flask-Cors==4.0.1
itsdangerous==2.2.0
Jinja2==3.1.4
MarkupSafe==2.1.5
packaging==24.1
plotly==5.23.0
pyftdi==0.55.4
PyMySQL==1.1.1
pyserial==3.5
pyusb==1.2.1
rpi-ws281x==5.0.0
RPi.GPIO==0.7.1
sysv-ipc==1.1.0
tenacity==9.0.0
typing_extensions==4.12.2
Werkzeug==3.0.3
```

### control.py

이번에는 DB, 웹 서버 모두 라즈베리파이 하나를 이용하여 만들었다

아무래도 데이터 전송되는 속도가 로컬이 훨씬 빠르기에 이 방법이 좋을듯 싶었다

그리고 위에서 말했듯 `Adafruit_dht`는 오래되어서 못쓰기에 (직접 레포지토리를 받아서 쓸 수는 있다) `Adafruit_CircuitPython_DHT`을 이용했다

<details><summary>control.py</summary>
<div markdown = "1">

```python
import RPi.GPIO as GPIO
import board
import adafruit_dht
from insert_data import insert_data
from graph import create_graph_temp_hue, create_graph_cool_hot
import os
from flask import Flask, render_template, jsonify, send_from_directory

GPIO.setwarnings(False)
app = Flask(__name__)

relay_Cool = 5  # 임시
relay_Hot = 14

GPIO.setmode(GPIO.BCM)
GPIO.setup(relay_Cool, GPIO.OUT)
GPIO.setup(relay_Hot, GPIO.OUT)

# DHT11 센서 객체 생성
dht_device = adafruit_dht.DHT11(board.D17, use_pulseio=False)

G1path = "templates/graph1.html"
G2path = "templates/graph2.html"

relay_status = {'Cool': 0, 'Hot': 0}
hum_temp = {'Humidity': 0, 'Temperature': 0}

@app.route('/')
def home():
    return render_template('iot.html', relay_status=relay_status, hum_temp=hum_temp)

@app.route('/update')
def update():
    try:
        temperature = dht_device.temperature
        humidity = dht_device.humidity
        
        hum_temp['Humidity'] = humidity
        hum_temp['Temperature'] = temperature
        
        send_data(humidity, temperature)
    except RuntimeError as e:
        print(f"Error reading DHT11 sensor: {e}")
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'error': 'An unexpected error occurred.'}), 500
    return jsonify(hum_temp=hum_temp)

def send_data(humidity, temperature):
    data = {
        'humidity': humidity,
        'temperature': temperature,
        'cool': relay_status['Cool'],
        'hot': relay_status['Hot']
    }
    insert_data(data)

@app.route('/graph1')
def graph1():
    if not os.path.exists(G1path):
        create_graph_temp_hue()  # 그래프가 없으면 생성
    print("create_graph_temp_hue 함수 호출됨")
    return send_from_directory('templates', 'graph1.html')

@app.route('/graph2')
def graph2():
    if not os.path.exists(G2path):
        create_graph_cool_hot()  # 그래프가 없으면 생성
    return send_from_directory('templates', 'graph2.html')

@app.route('/generate_graph1')
def generate_graph1():
    create_graph_temp_hue()
    return send_from_directory('templates', 'graph1.html')

@app.route('/generate_graph2')
def generate_graph2():
    create_graph_cool_hot()
    return send_from_directory('templates', 'graph2.html')

@app.route('/toggle_cool')
def toggle_cool():
    print("릴레이 실행됨c")
    relay_status['Cool'] = 1 if relay_status['Cool'] == 0 else 0
    GPIO.output(relay_Cool, GPIO.HIGH if relay_status['Cool'] else GPIO.LOW)
    return jsonify(relay_status=relay_status)

@app.route('/toggle_hot')
def toggle_hot():
    print("릴레이 실행됨2")
    relay_status['Hot'] = 1 if relay_status['Hot'] == 0 else 0
    GPIO.output(relay_Hot, GPIO.HIGH if relay_status['Hot'] else GPIO.LOW)
    return jsonify(relay_status=relay_status)

if __name__ == '__main__':
    app.run(debug=True, port=8080, host='0.0.0.0')

```

</div>
</details>

### insert_data.py, graph.py

로컬 DB로 변경 되었으니 그것만 바꿔주면 된다

```python
connection = pymysql.connect(
            host='localhost', #이 부분
            user='dev',
            password='pwd',
            database='TestDB'
        )
```

## 중간점검 모음집

### 2024-08-08

php에서 파이썬으로 넘어오고 테스트를 해보았다

```
192.xxx.xxx.xxx - - [08/Aug/2024 02:53:00] "GET / HTTP/1.1" 200 -
New record created successfully
192.xxx.xxx.xxx - - [08/Aug/2024 02:53:16] "GET /update HTTP/1.1" 200 -
```

설마?

```
MariaDB [TestDB]> SELECT * FROM TempHue;
+---------------------+-------------+----------+
| Daytime             | Temperature | Humidity |
+---------------------+-------------+----------+
| 2024-07-27 10:57:48 | 31          | 56       |
| 2024-07-27 10:57:50 | 31          | 56       |
| 2024-07-27 10:57:51 | 31          | 56       |
| 2024-07-27 10:57:53 | 31          | 55       |
+---------------------+-------------+----------+
4 rows in set (0.001 sec)
```

에서

```
MariaDB [TestDB]> SELECT * FROM TempHue;
+---------------------+-------------+----------+
| Daytime             | Temperature | Humidity |
+---------------------+-------------+----------+
| 2024-07-27 10:57:48 | 31          | 56       |
| 2024-07-27 10:57:50 | 31          | 56       |
| 2024-07-27 10:57:51 | 31          | 56       |
| 2024-07-27 10:57:53 | 31          | 55       |
| 2024-08-08 02:53:16 | 31          | 65       |
+---------------------+-------------+----------+
5 rows in set (0.001 sec)
```
이거지!!!!!!!!!!!!!!!!

일단 데이터가 저장되는 부분은 해결했으니 릴레이 저장할 수 있도록 테이블을 추가해야겠다

### 2024-08-08 2차

```
asde@raspberrypi:~/iot/webapp $ python control.py
Traceback (most recent call last):
  File "/home/asde/iot/webapp/control.py", line 4, in <module>
    from graph import mkgraph
  File "/home/asde/iot/webapp/graph.py", line 2, in <module>
    import pandas as pd
  File "/usr/local/lib/python3.9/dist-packages/pandas/__init__.py", line 19, in <module>
    raise ImportError(
ImportError: Unable to import required dependencies:
numpy: Error importing numpy: you should not try to import numpy from
        its source directory; please exit the numpy source tree, and relaunch
        your python interpreter from there.
```

라즈베리파이에서 판다스 문제인지 뭔 짓을 다 해봐도 문제가 생기기에 찾아보니 의존성 문제인 것 같다고는 하는데

[[라즈베리파이] numpy 관련 Pandas import error](https://amatoroi.tistory.com/54)

난 모르겠다

### 2024-08-08 3차

![image](https://github.com/user-attachments/assets/39fd918a-3385-498c-b824-491b86e16397)

일단 그래프를 넣는것 까지는 해냈다

지금 계속 시도해 보고 있는 것이 버튼을 누르면 그래프가 사라졌으면 좋겠는데... 정말 질기다

그래프를 사라지게 하면 그냥 시작부터 그래프가 없고

그래프를 냅두면 사라지지 않고... 끄응... 내가 디자인은 진짜 별로라 기능부터 만들고 있는데 쉽지 않다

다른 기능들 Hot, Cool 토글, 실시간 온도 저장 및 디스플레이는 아주 잘된다

사실 그래프가 보이는 것만으로 따지면 아주 잘된다만 쉽지 않다

리액트 쓰는게 좋으려나...

### 2024-08-09 

보아하니 데이터의 시간이 자꾸 이상하게 하루가 지났음에도 8월 8일 이라기에 확인을 해보니 라즈베리파이 시간이 유럽으로 잡혀있었다

어쩐지...

아니 그런데 다른 문제가 생겼다 

[![video](https://res.cloudinary.com/marcomontalbano/image/upload/v1723174577/video_to_markdown/images/youtube--E8QD6WVKMUY-c05b58ac6eb4c4700831b2b3070cd403.jpg)](https://youtu.be/E8QD6WVKMUY "video")

어째서 그래프를 띄우고 생성하는 부분이 데이터 통신을 하지도 않고 실행이 될 수 있단 말인가?

이거 해결해야하는데...

### 2024-08-19 , Unable to set line 4 to input 문제

장장 10일만에 드디어 라즈베리파이를 고치는데 성공했다

정확히는 고친다기보다는 이것저것 시도해 보다가 포맷한 거지만..

```
MariaDB [TestDB]> SELECT * FROM TempHue;
+---------------------+-------------+----------+------+------+
| Daytime             | Temperature | Humidity | Cool | Hot  |
+---------------------+-------------+----------+------+------+
| 2024-08-18 21:53:09 | 50          | 50       | 1    | 0    |
| 2024-08-19 11:26:14 | NULL        | NULL     | 0    | 0    |
| 2024-08-19 11:46:03 | NULL        | NULL     | 0    | 0    |
| 2024-08-19 11:46:08 | NULL        | NULL     | 0    | 0    |
| 2024-08-19 12:15:56 | 31          | 60       | 0    | 0    |
| 2024-08-19 12:16:00 | 31          | 61       | 0    | 0    |
| 2024-08-19 12:16:04 | 31          | 60       | 0    | 0    |
+---------------------+-------------+----------+------+------+
7 rows in set (0.001 sec)
```

DB를 보면 NULL인 부분이 있는데 신기하게도 코드를 이것저것 뜯어보는 중에 그래도 값이 들어가기는 했었나보다

flask 콘솔 로그를 보면

```shell
asde@raspberrypi:~/iot/webapp $ python control.py
 * Serving Flask app 'control'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8080
 * Running on http://192.168.137.134:8080
Press CTRL+C to quit
 * Restarting with stat
Unable to set line 4 to input
 * Debugger is active!
 * Debugger PIN: 138-328-485
```

중간에 이상하게 `Unable to set line 4 to input`이라는 부분이 있는데 이 친구가 어떻게 보면 이번 가장 큰 문제였다

코드가 RPI에서 실행되고 있지 않아요! 하는 문제는 그저 파이썬 실행이 내 컴퓨터로 맞물려 버리는 정말 이상한 상황이었지만 위 문제는 도무지 찾아봐도 정보가 없었다 심지어 github페이지에도 [adafruit/Adafruit_CircuitPython_DHT/issue](https://github.com/adafruit/Adafruit_CircuitPython_DHT/issues) 비슷한 문제들이 있었지만 결국 해결되지 않았다

그러다 딱 하나 눈에 들어온 문장이 있었다. `pulseio`라는 친구가 문제라고 하기에 더 찾아보니 `use_pulseio=False`라는 옵션을 넣을 수 있었다

```python
dht_device = adafruit_dht.DHT11(board.D17, use_pulseio=False)
```

와 진짜 설마 하고 넣은뒤 실행시켜보니 

```shell
(iotvenv) asde@raspberrypi:~/iot/webapp $ python control.py
 * Serving Flask app 'control'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8080
 * Running on http://192.168.137.134:8080
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 138-328-485
```

이 맛에 코딩하지 이게 되네

### Error reading DHT11 sensor: Checksum did not validate. Try again. 문제

아니 이건 또 뭐람...

[[RaspberryPi 4B & DHT11] Checksum did not validate. /A full buffer was not returned. #72](https://github.com/adafruit/Adafruit_CircuitPython_DHT/issues/72)

3년전 글인데 아직도 해결이 안 되었다..? 어우... 그래도 조금만 더 찾아보자

[issue](https://github.com/adafruit/Adafruit_CircuitPython_DHT/issues/33#issuecomment-2027533058)

허..

```
온도 센서를 바꿨기 때문에 더 이상 문제가 되지 않습니다. 하지만 다음 프로젝트에서는 다시 추가하겠습니다. 습도를 추적할 수 있는 것이 좋아요. 고마워요-숀
야후 메일: 검색, 정리, 정복

  2024년 3월 29일 금요일 오전 11시 30분 ***@**.**>는 다음과 같이 썼습니다:


2년이 지났지만, 여전히 같은 문제에 부딪혔습니다. 올래스터의 제안을 따르고 "use_pulseio = True"(대부분의 설명서에 나와 있듯이, "use_so False")를 사용하는 것이 제게 효과가 있었습니다.

—
이 이메일에 직접 회신하거나 GitHub에서 보거나 구독을 취소하십시오.
말씀하신 내용을 전달받으셨기 때문에 전달드립니다. 메시지 ID : ***@***.***>
```

결국 use_pulseio를 쓰거나 오류를 마주하거나...

일단은 그냥 쓰기로 했다

```
(iotvenv) asde@raspberrypi:~/iot/webapp $ python control.py
 * Serving Flask app 'control'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8080
 * Running on http://192.168.137.134:8080
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 138-328-485
192.168.137.1 - - [19/Aug/2024 13:03:09] "GET /update HTTP/1.1" 200 -
192.168.137.1 - - [19/Aug/2024 13:03:09] "GET / HTTP/1.1" 200 -
create_graph_temp_hue 함수 호출됨
192.168.137.1 - - [19/Aug/2024 13:03:11] "GET /graph1 HTTP/1.1" 200 -
DONE cgth
192.168.137.1 - - [19/Aug/2024 13:03:11] "GET /generate_graph1 HTTP/1.1" 200 -
Error reading DHT11 sensor: Checksum did not validate. Try again.
192.168.137.1 - - [19/Aug/2024 13:03:15] "GET /update HTTP/1.1" 500 -
192.168.137.1 - - [19/Aug/2024 13:03:20] "GET /update HTTP/1.1" 200 -
```

어떻게 하던간에 바로 당장에 해결 방법은 없고 계속 작동하면서 거진 5번중 1번 생기는 문제이며 DB에는 오류가 저장되지 않기에 문제가 없다고 판단했다

### 이번엔 그래프가...

![image](https://github.com/user-attachments/assets/d5ffca52-e32e-4f49-858d-5a80a86fb306)

아니 왜? 어째서? 데이터도 있는데 가져오질 못하니..

아  graph.py 코드를 잘못짰었네

### 2024-08-19 영상

<iframe width="560" height="315" src="https://www.youtube.com/embed/8yL2oCGO0xQ" title="Raspberry Pi로 IOT를 만들어보자" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>