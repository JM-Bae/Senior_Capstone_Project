
import machine
import utime
#import time


#machine.Pin(2, machine.Pin.OUT)


while True:
  trig=machine.Pin(5, machine.Pin.OUT)
  trig.off() #//stop reading
  utime.sleep_us(1)
  trig.on()
  utime.sleep_us(1)
  trig.off()
  echo=machine.Pin(4, machine.Pin.IN)
  while echo.value() == 0:
    pass
  t1 = utime.ticks_us()
  while echo.value() == 1:
    pass
  t2 = utime.ticks_us()
  cm = (t2 - t1) / 58.0
  print(cm)
  if cm < 30:
    machine.Pin(2, machine.Pin.OUT)
    machine.Pin(0, machine.Pin.OUT)
  else:
    machine.Pin(2, machine.Pin.IN)
    machine.Pin(0, machine.Pin.IN)

    
  utime.sleep(.01)

