import time, threading
from sense_hat import SenseHat

class Sensor:
    def __init__(self):
        print("Object created!") # Test
        self.s = SenseHat()
        self.running = True

    def singleReading():
        return [self.s.temp, self.s.humidity, self.s.pressure]

    def readPeriodically(periode, handler):
        if self.running:
            handler(self.singleReading())
            threading.Timer(periode, self.readPeriodically, [periode, handler]).start()

    def stopReading():
        self.running = False

    def setInbounds():
        X = [0, 255, 0] 
        O = [255, 255, 255] 
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
        self.s.set_pixels(mark)

    def setOutofbounds():
        X = [255, 0, 0] 
        O = [255, 255, 255] 
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
        self.s.set_pixels(mark)

# Test handler:
    def printReadings(r):
        print("--------------- Readings ---------------")
        print("Temp: ", r[0])
        print("Humi: ", r[1])
        print("Pres: ", r[2])
        print("----------------------------------------")

    
# Testing
s1 = Sensor()