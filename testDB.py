import spidev
import os
import time
import Adafruit_DHT
import RPi.GPIO as GPIO
import board
import adafruit_tsl2591
import sqlite3
from sqlite3 import Error

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

def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)

    return conn

def query(conn, values):
    sql = ''' INSERT INTO sensors (humidity,soil_moisture,temperature,light_intensity,time) values (?,?,?,?,?);'''
    cur = conn.cursor()
    cur.execute(sql, values)
    conn.commit()

def main():
    database = r"/home/pi/Wiwarium/sqlite3DB"
    light_intensity = round(sensor.lux, 1)
    soil_moisture = readChannel(0)
    humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
    humidity = round(humidity,1)
    temperature = round(temperature,1)
    timestamp = time.strftime(('%Y-%m-%d %H:%M:%S'))
    # create a database connection
    conn = create_connection(database)
    with conn:
        values = (humidity,soil_moisture,temperature,light_intensity,timestamp)
        query(conn, values)

if __name__ == '__main__':
    main()