import paho.mqtt.client as mqtt

def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT Broker")


def on_message(client, obj, msg):
    tmp = json.loads(msg.payload.decode('utf8'))
    print(msg.topic + " " + str(msg.qos) + " " + str(msg.payload))
    if msg.topic == constants.topics["Threshold"]:
        print(msg.topic)
        config.setThresholdValue(tmp["type"], tmp["value"])
        deviceConfig = config.getSavedState()
        print(deviceConfig)
    elif msg.topic == deviceSubscription:
        config.setThresholdValue(tmp["type"], tmp["threshold"])
        config.setThresholdValue(tmp["type"], tmp["value"])
        deviceConfig = config.getSavedState()
        report = config.getSavedState()
        print(report)
        reportedState = {
            "msgType": "Report",
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