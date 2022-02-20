import spidev
import os
import time
import threading
import Adafruit_DHT
import board
import adafruit_tsl2591
import sqlite3
import RPi.GPIO as GPIO
from sqlite3 import Error
from flask import Flask, render_template, request

i2c = board.I2C()
sensor = adafruit_tsl2591.TSL2591(i2c)
sensor.gain = adafruit_tsl2591.GAIN_LOW
# soil moisture converter
spi = spidev.SpiDev()
spi.open(0, 0)
spi.max_speed_hz = 1000000

GPIO.setmode(GPIO.BCM)

DHT_SENSOR = Adafruit_DHT.DHT22
DHT_PIN = 4


def read_channel(channel):
    val = spi.xfer2([1, (8+channel) << 4, 0])
    data = ((val[1] & 3) << 8) + val[2]
    return data


app = Flask(__name__)

database = r"/home/pi/Wiwarium/sqlite3DB"

pins = {
    17: {'name': 'GPIO 17', 'state': GPIO.LOW},
    # 27: {'name': 'GPIO 27', 'state': GPIO.LOW}, 
    23: {'name': 'GPIO 23', 'state': GPIO.LOW},
    24: {'name': 'GPIO 24', 'state': GPIO.LOW}
}

# Set each pin as an output and make it low:
for pin in pins:
    GPIO.setup(pin, GPIO.OUT)
    GPIO.output(pin, GPIO.HIGH)

@app.route("/controlPanel")
def main():
    for pin in pins:
        pins[pin]['state'] = GPIO.input(pin)
    templateData = {
        'pins': pins
    }
    return render_template('controlPanel.html', **templateData)

@app.route("/<pinNumber>/<action>")
def action(pinNumber, action):
    pinNumber = int(pinNumber)
    if action == "on":
        GPIO.output(pinNumber, GPIO.HIGH)
    if action == "off":
        GPIO.output(pinNumber, GPIO.LOW)

    for pin in pins:
        pins[pin]['state'] = GPIO.input(pin)

    templateData = {
        'pins': pins
    }
    return render_template('controlPanel.html', **templateData)

@app.route("/")
def control_panel():
    return render_template('main.html')

@app.route("/diagrams")
def diagrams():
    data = {
        'temperature': get_value_from_DB('''SELECT temperature FROM sensors;'''),
        'humidity': get_value_from_DB('''SELECT humidity FROM sensors;'''),
        'soilMoisture': get_value_from_DB('''SELECT ROUND(100-soil_moisture/10.23,1) FROM sensors;'''),
        'luminosity': get_value_from_DB('''SELECT light_intensity FROM sensors;'''),
        'time': get_value_from_DB('''SELECT time FROM sensors;'''),
    }
    return render_template('diagrams.html', data=data)

def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)

    return conn

def query_select(conn, query):
    cur = conn.cursor()
    cur.execute(query)
    values = cur.fetchall()
    values = list(zip(*values))
    conn.commit()
    return values

def query_insert(conn, values):
    sql = ''' INSERT INTO sensors (humidity,soil_moisture,temperature,light_intensity,time) values (?,?,?,?,?);'''
    cur = conn.cursor()
    cur.execute(sql, values)
    conn.commit()

def get_value_from_DB(query):
    conn = create_connection(database)
    with conn:
        value = query_select(conn, query)
    return value

def main():
    while True:
        print("inside main")
        light_intensity = round(sensor.lux, 1)
        soil_moisture = read_channel(0)
        humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
        humidity = round(humidity, 1)
        temperature = round(temperature, 1)
        timestamp = time.strftime(('%Y-%m-%d %H:%M:%S'))
        conn = create_connection(database)
        with conn:
            values = (humidity, soil_moisture, temperature,
                    light_intensity, timestamp)
            query_insert(conn, values)
        print("Done!")

        time.sleep(600)

def runApp():
    app.run(host='0.0.0.0', port=80, debug=False, threaded=True)


if __name__ == "__main__":
    print("started program")
    t1 = threading.Thread(target=runApp)
    t2 = threading.Thread(target=main)
    t1.start()
    t2.start()
    t1.join()
    t2.join()
