import json
import constants

config = {}
def getSavedState():
    global config
    with open("config.json", "r") as jsonFile:
        config = json.load(jsonFile)
    return config

def getReportedState(field):
    global config
    return config["ReportedState"]

def setThresholdValue(field, value):
    global config
    config["DesiredState"]["Threshold"][field] = value
    config["ReportedState"]["Threshold"][field] = value
    with open("config.json", "w+") as jsonFile:
        json.dump(config, jsonFile)

def setDesiredState(field):
    global config
    config["DesiredState"] = field
    with open("config.json", "w+") as jsonFile:
        json.dump(config, jsonFile)

def setReportedState(field):
    global config
    config["ReportedState"] = field
    with open("config.json", "w+") as jsonFile:
        json.dump(config, jsonFile)