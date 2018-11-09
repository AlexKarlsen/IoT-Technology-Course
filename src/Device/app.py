import paho.mqtt.client as mqtt
import os
from dotenv import load_dotenv
import json
import config
import constants
import requests
import datetime
import sense

# Define event callbacks


def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT Broker")


def on_message(client, obj, msg):
    tmp = json.loads(msg.payload.decode('utf8'))
    print(msg.topic + " " + str(msg.qos) + " " + str(msg.payload))
    if msg.topic == constants.topics["Threshold"]:
        print(msg.topic)
        config.setThresholdValue(tmp["type"], tmp["value"])
    elif msg.topic == 'device/myDevice':
        config.setThresholdValue(tmp["type"], tmp["threshold"])
        report = config.getSavedState()
        print(report)
        reportedState = {
        "DeviceId": deviceId,
        "ReportedState": report['ReportedState']
        }
        mqttc.publish("report", json.dumps(reportedState))
        print('publish changes')
    else:
        print('No subscription handler')


def on_publish(client, obj, mid):
    print("mid: " + str(mid))


def on_subscribe(client, obj, mid, granted_qos):
    print("Subscribed: " + str(mid) + " " + str(granted_qos))


def on_log(client, obj, level, string):
    print(string)


deviceId = "myDevice"
deviceSubscription = "device/" + deviceId

mqttc = mqtt.Client()
# Assign event callbacks
mqttc.on_message = on_message
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish
mqttc.on_subscribe = on_subscribe


# Uncomment to enable debug messages
# mqttc.on_log = on_log

# Getting environment variables
load_dotenv()
host = os.getenv("HOST")
username = os.getenv("USERNAME")
password = os.getenv("PASSWORD")
port = int(os.getenv("PORT"))

# Connect
mqttc.username_pw_set(username, password)
mqttc.connect(host, port)

# Getting device state from server
deviceConfig = config.getSavedState()
resp = requests.get('http://169.254.202.126:3000/api/device/myDevice')
respObj = resp.json()

# Checking if state on device not matches server state
if deviceConfig["DesiredState"] != respObj["DesiredState"]:
    print('state must be updated')
    config.setDesiredState(respObj["DesiredState"])
    config.setReportedState(respObj["DesiredState"])
    reportedState = {
        "DeviceId": deviceId,
        "ReportedState": respObj["DesiredState"]
    }
    mqttc.publish("report", json.dumps(reportedState))
else:
    print('Is Updated')

# Start subscribe, with QoS level 0
mqttc.subscribe("threshold")
mqttc.subscribe(deviceSubscription)

# Alarms
def onAlarmChange(field, isAlarm):
    if (deviceConfig["Alarms"][field] != isAlarm):
        config.setAlarm(field, isAlarm)
        alarmMsg = {
            "msgType": "Alarm",
            "DeviceId": deviceId,
            "type": field,
            "value": isAlarm
        }
        mqttc.publish('alarm', json.dumps(alarmMsg))

# Publish a message
def handleReading(readings):
    if (readings[0] > deviceConfig["DesiredState"]["Threshold"]["temperature"]["value"]):
        sense.setOutofbounds()
        onAlarmChange("Temperature", True)
    else:
        sense.setInbounds()
        onAlarmChange("Temperature", False)

    message = {
        "DeviceId": deviceId,
        "TelemetryData": [
            {
            "Timestamp": str(datetime.datetime.now()),
            "Type": "Temperature",
            "Value": readings[0],
            "Unit": "Celsius"
            },
            {
            "Timestamp": str(datetime.datetime.now()),
            "Type": "Humidity",
            "Value": readings[1],
            "Unit": "Percent"
            },
            {
                "Timestamp": str(datetime.datetime.now()),
            "Type": "Pressure",
            "Value": readings[2],
            "Unit": "hPa"
            }
        ]
    }
    mqttc.publish("telemetry", json.dumps(message))


# Start reading from sensehat
sense.readPeriodically(5, handleReading)

# Continue the network loop, exit when an error occurs
rc = 0
while rc == 0:
    rc = mqttc.loop()

print("rc: " + str(rc))
