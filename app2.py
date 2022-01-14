import spidev
import os
import time
import Adafruit_DHT
import board
import adafruit_tsl2591
import sqlite3
import RPi.GPIO as GPIO
from sqlite3 import Error
from flask import Flask, render_template, request

app = Flask(__name__)

database = r"/home/pi/Wiwarium/sqlite3DB"

# Create a dictionary called pins to store the pin number, name, and pin state:
pins = {
    17: {'name': 'GPIO 17', 'state': GPIO.LOW},
    27: {'name': 'GPIO 27', 'state': GPIO.LOW}
}

# Set each pin as an output and make it low:
for pin in pins:
    GPIO.setup(pin, GPIO.OUT)
    GPIO.output(pin, GPIO.HIGH)


@app.route("/")
def main():
    # For each pin, read the pin state and store it in the pins dictionary:
    for pin in pins:
        pins[pin]['state'] = GPIO.input(pin)
    # Put the pin dictionary into the template data dictionary:
    templateData = {
        'pins': pins
    }
    return render_template('main.html', **templateData)

# The function below is executed when someone requests an URL with the pin number and action in it:


@app.route("/<pinNumber>/<action>")
def action(pinNumber, action):
    # Convert the pin from the URL into an integer:
    pinNumber = int(pinNumber)
    # Get the device name for the pin being changed:
    deviceName = pins[pinNumber]['name']
    # If the action part of the URL is "on," execute the code indented below:
    if action == "on":
        # Set the pin high:
        GPIO.output(pinNumber, GPIO.HIGH)
    if action == "off":
        GPIO.output(pinNumber, GPIO.LOW)

    # For each pin, read the pin state and store it in the pins dictionary:
    for pin in pins:
        pins[pin]['state'] = GPIO.input(pin)

    # Along with the pin dictionary, put the message into the template data dictionary:
    templateData = {
        'pins': pins
    }
    return render_template('controlPanel.html', **templateData)


@app.route("/controlPanel")
def controlPanel():
    return render_template('controlPanel.html')

@app.route("/diagrams")
def diagrams():
    data = {
        'temperature': get_value_from_DB('''SELECT temperature FROM sensors;'''),
        'humidity': get_value_from_DB('''SELECT humidity FROM sensors;'''),
        'soilMoisture': get_value_from_DB('''SELECT soil_moisture/10.23 FROM sensors;'''),
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


def execute_query(conn, query):
    cur = conn.cursor()
    cur.execute(query)
    values = cur.fetchall()
    values = list(zip(*values))
    conn.commit()
    return values


def get_value_from_DB(query):
    conn = create_connection(database)
    with conn:
        value = execute_query(conn, query)
    return value


def main():
    #  light_intensity
    #  soil_moisture
    # humidity
    # timestamp = time.strftime(('%Y-%m-%d %H:%M:%S'))
    # create a database connection
    query = ''' SELECT temperature FROM sensors;'''
    print(get_value_from_DB(query))
    # query = ''' SELECT humidity FROM sensors;'''
    # print(get_value_from_DB(query))
    # query = ''' SELECT soil_moisture FROM sensors;'''
    # print(get_value_from_DB(query))
    # query = ''' SELECT light_intensity FROM sensors;'''
    # print(get_value_from_DB(query))
    # query = ''' SELECT time FROM sensors;'''
    # print(get_value_from_DB(query))


if __name__ == "__main__":
    main()
    app.run(host='0.0.0.0', port=80, debug=True)
