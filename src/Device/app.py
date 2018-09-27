import paho.mqtt.client as mqtt
import os 
from dotenv import load_dotenv
import json
import config
import constants

config.getSavedState()

# Define event callbacks
def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT Broker")

def on_message(client, obj, msg):
    print(msg.topic + " " + str(msg.qos) + " " + str(msg.payload))
    if msg.topic == constants.topics["threshold"]:
        tmp = json.loads(msg.payload.decode('utf8'))
        #config.setThresholdValue(tmp["type"], tmp["value"])
        #mqttc.publish("ReportedState","Updated")

def on_publish(client, obj, mid):
    print("mid: " + str(mid))

def on_subscribe(client, obj, mid, granted_qos):
    print("Subscribed: " + str(mid) + " " + str(granted_qos))

def on_log(client, obj, level, string):
    print(string)

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

# Start subscribe, with QoS level 0
mqttc.subscribe("threshold")

class Measurement:
  def __init__(self, type, value, unit):
    self.type = type
    self.value = value
    self.unit = unit

tempMeasurement = {
    "type": "temperature", 
    "value": 23, 
    "unit": "celsius"
}

# Publish a message
mqttc.publish(tempMeasurement.get("type"), json.dumps(tempMeasurement))

# Continue the network loop, exit when an error occurs
rc = 0
while rc == 0:
    rc = mqttc.loop()

print("rc: " + str(rc))