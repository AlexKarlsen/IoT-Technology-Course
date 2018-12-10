import paho.mqtt.client as mqtt
import os
from dotenv import load_dotenv
import json
import requests
import datetime
import constants
import config
import sense
import mqtthelper

### Functions
## Alarms
def onAlarmChange(field, isAlarm):
    config.setAlarm(field, isAlarm)
    alarmMsg = {
        "msgType": "Alarm",
        "DeviceId": deviceId,
        "type": field,
        "value": isAlarm
    }
    print('Alarming...{}'.format(isAlarm))
    mqttc.publish('alarm', json.dumps(alarmMsg))

## Publish a message
def handleReading(readings):
    print(readings[0])
    print(deviceConfig["DesiredState"]["Threshold"]["Temperature"]["value"])
    if (readings[0] > deviceConfig["DesiredState"]["Threshold"]["Temperature"]["value"]):
        sense.setOutofbounds()
        onAlarmChange("Temperature", True)   
    if (readings[0] < deviceConfig["DesiredState"]["Threshold"]["Temperature"]["value"]):
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

sense.setInbounds()

## Local test variables
# apiEndpoint = 'http://localhost:3000/api/device/myDevice'
## PI variables
apiEndpoint = 'https://iottech18.herokuapp.com/api/device/myDevice'

deviceConfig = config.getSavedState()
deviceId = "myDevice"
deviceSubscription = "device/" + deviceId

## MQTT 
mqttc = mqtthelper.create()
## Getting device state from server
deviceConfig = config.getSavedState()
resp = requests.get(apiEndpoint)
respObj = resp.json()

## Checking if state on device not matches server state
if deviceConfig["DesiredState"] != respObj["DesiredState"]:
    print('state must be updated')
    config.setDesiredState(respObj["DesiredState"])
    config.setReportedState(respObj["DesiredState"])
    config.setAlarmState(respObj["Alarms"])
    reportedState = {
        "DeviceId": deviceId,
        "ReportedState": respObj["DesiredState"]
    }
    mqttc.publish("report", json.dumps(reportedState))
else:
    print('Is Updated')

## Start reading periodically from sensehat
sense.readPeriodically(5, handleReading)

## Continue the network loop, exit if an error occurs
rc = 0
while rc == 0:
    rc = mqttc.loop()
print("rc: " + str(rc))



