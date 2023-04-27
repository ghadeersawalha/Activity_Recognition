#include "Wire.h"
#include <MPU6050_light.h>

#include "BluetoothSerial.h"

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

#if !defined(CONFIG_BT_SPP_ENABLED)
#error Serial Bluetooth not available or not enabled. It is only available for the ESP32 chip.
#endif

BluetoothSerial SerialBT;

MPU6050 mpu(Wire);

int N_SERIES_ENTRIES = 40;

long timer = 0;

float Xacc;
float Yacc;
float Zacc;

int action;

int series = 0;

int count = 61;

void setup() {
  Serial.begin(115200);
  SerialBT.begin("ESP32test");
  delay(1000);
  Wire.begin();
  
  byte status = mpu.begin();
  SerialBT.println(F("MPU6050 status: "));
  SerialBT.println(status);
  while(status!=0){ } // stop everything if could not connect to MPU6050
}

void loop() {
  if(count >= N_SERIES_ENTRIES){
    SerialBT.println("@@ 1: JAB | 2: HOOK | 3: UPPERCUT | 4: STANCE");
    int input;
    while (true) {
      if (SerialBT.available() > 0) {
        input = SerialBT.parseInt();
        if (input >= 1 && input <= 4) {
          break;
        }
      }
    }
    
    action = input;
    series+=1;
    count = 0;
  }
  
  while (count < N_SERIES_ENTRIES && millis() - timer > 30){
    mpu.update();
    Xacc =mpu.getAccX();
    Yacc = mpu.getAccY();
    Zacc = mpu.getAccZ();
    
    SerialBT.print(series);
    SerialBT.print(",");
    SerialBT.print(Xacc);
    SerialBT.print(",");
    SerialBT.print(Yacc);
    SerialBT.print(",");
    SerialBT.print(Zacc);
    SerialBT.print(",");
    SerialBT.println(action);
    count+=1;
    timer = millis();
  }
  
 }
