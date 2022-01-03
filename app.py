from flask import Flask, render_template, request
import spidev
import os
import time
import Adafruit_DHT
import RPi.GPIO as GPIO
import board
import adafruit_tsl2591

app = Flask(__name__)

# light sensor
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


def readChannel(channel):
    val = spi.xfer2([1, (8+channel) << 4, 0])
    data = ((val[1] & 3) << 8) + val[2]
    return data


@app.route('/')
def index():
    luminosity = round(sensor.lux, 1)
    soil_moisture = readChannel(0)
    humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
    return render_template('index.html', luminosity=luminosity, soil_moisture=soil_moisture, temperature=temperature, humidity=humidity)


if __name__ == '__main__':
    app.run(host="0.0.0.0",port=80, debug=True)
