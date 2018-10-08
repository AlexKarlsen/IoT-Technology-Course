import paho.mqtt.client as mqtt
import os 
from dotenv import load_dotenv
import json
import config
import constants
import requests
import datetime

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
        config.setThresholdValue(tmp["type"],tmp["threshold"])
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
#mqttc.on_log = on_log

# Getting environment variables
load_dotenv()
host = os.getenv("HOST")
username = os.getenv("USERNAME")
password = os.getenv("PASSWORD")
port = int(os.getenv("PORT"))

# Connect
mqttc.username_pw_set(username, password)
mqttc.connect(host, port)

deviceConfig = config.getSavedState()
print(config)
resp = requests.get('http://localhost:3000/api/device/myDevice')
respObj = resp.json()
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

# Publish a message
testMessage = {
    "DeviceId": deviceId,
    "TelemetryData": {
        "Timestamp": str(datetime.datetime.now()),
        "Type": "Temperature",
        "Value": 23,
        "Unit": "Celsius"
    }
}
mqttc.publish("telemetry", json.dumps(testMessage))

# Continue the network loop, exit when an error occurs
rc = 0
while rc == 0:
    rc = mqttc.loop()

print("rc: " + str(rc))