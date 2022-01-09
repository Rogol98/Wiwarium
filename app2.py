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
    # Pass the template data into the template main.html and return it to the user
    return render_template('main.html', **templateData)

# The function below is executed when someone requests an URL with the pin number and action in it:


@app.route("/<changePin>/<action>")
def action(changePin, action):
    # Convert the pin from the URL into an integer:
    changePin = int(changePin)
    # Get the device name for the pin being changed:
    deviceName = pins[changePin]['name']
    # If the action part of the URL is "on," execute the code indented below:
    if action == "on":
        # Set the pin high:
        GPIO.output(changePin, GPIO.HIGH)
        # Save the status message to be passed into the template:
        message = "Turned " + deviceName + " on."
    if action == "off":
        GPIO.output(changePin, GPIO.LOW)
        message = "Turned " + deviceName + " off."

    # For each pin, read the pin state and store it in the pins dictionary:
    for pin in pins:
        pins[pin]['state'] = GPIO.input(pin)

    # Along with the pin dictionary, put the message into the template data dictionary:
    templateData = {
        'pins': pins
    }

    return render_template('main.html', **templateData)


@app.route("/diagrams")
def diagrams():
   return 0


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


def query(conn, query):
    cur = conn.cursor()
    values = cur.execute(query)
    conn.commit()
    return values

def get_temperature():
    conn = create_connection(database)
    with conn:
        query_temperature = ''' SELECT temperature FROM sensors;'''
        temperature = query(conn, query_temperature)
    return temperature

def main():
   #  light_intensity
   #  soil_moisture
   # humidity
   # timestamp = time.strftime(('%Y-%m-%d %H:%M:%S'))
    # create a database connection
   temperature = get_temperature() 
   print(get_temperature())
   print(temperature)


if __name__ == "__main__":
    main()
    app.run(host='0.0.0.0', port=80, debug=True)
