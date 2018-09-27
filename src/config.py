import json
import constants

config = {}
def getSavedState():
    global config
    with open("config.json", "r") as jsonFile:
        config = json.load(jsonFile)
    print(config)

def getThresholdValue(field):
    global config
    return config["threshold"][field]["value"]

def setThresholdValue(field, value):
    global config
    config["threshold"][field]["value"] = value
    with open("config.json", "w+") as jsonFile:
        json.dump(config, jsonFile)