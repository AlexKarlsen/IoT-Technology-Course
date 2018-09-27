import time, threading
from sense_hat import SenseHat

def singleReading():
    s = SenseHat()
    return [s.temp, s.humidity, s.pressure]

def printReadings(r):
    print("--------------- Readings ---------------")
    print("Temp: ", r[0])
    print("Humi: ", r[1])
    print("Pres: ", r[2])
    print("----------------------------------------")

def readPeriodically(periode, handler)
    handler(singleReading())
    threading.Timer(periode, readPeriodically, [periode, handler]).start()

#readPeriodically(5, printReadings)