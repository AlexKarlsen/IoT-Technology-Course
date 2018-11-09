import time, threading
from sense_hat import SenseHat

sense = SenseHat()

def singleReading():
    return [sense.temp, sense.humidity, sense.pressure]

def readPeriodically(periode, handler):
    handler(singleReading())
    threading.Timer(periode, readPeriodically, [periode, handler]).start()

def setInbounds():
    X = [0, 255, 0] 
    O = [0, 0, 0] 
    mark = [
    O, O, O, O, O, O, O, O,
    O, X, X, O, O, X, X, O,
    O, X, X, O, O, X, X, O,
    O, O, O, O, O, O, O, O,
    O, X, O, O, O, O, X, O,
    O, O, X, O, O, X, O, O,
    O, O, O, X, X, O, O, O,
    O, O, O, O, O, O, O, O
    ]
    sense.set_pixels(mark)

def setOutofbounds():
    X = [255, 0, 0] 
    O = [0, 0, 0] 
    mark = [
    O, O, O, O, O, O, O, O,
    O, X, X, O, O, X, X, O,
    O, X, X, O, O, X, X, O,
    O, O, O, O, O, O, O, O,
    O, O, O, O, O, O, O, O,
    O, O, X, X, X, X, O, O,
    O, X, O, O, O, O, X, O,
    O, O, O, O, O, O, O, O
    ]
    sense.set_pixels(mark)

# Test handler:
def printReadings(r):
    print("--------------- Readings ---------------")
    print("Temp: ", r[0])
    print("Humi: ", r[1])
    print("Pres: ", r[2])
    print("----------------------------------------")

    
### Testing
# readPeriodically(5, printReadings)