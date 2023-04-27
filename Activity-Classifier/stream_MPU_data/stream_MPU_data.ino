#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <BluetoothSerial.h>

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

#if !defined(CONFIG_BT_SPP_ENABLED)
#error Serial Bluetooth not available or not enabled. It is only available for the ESP32 chip.
#endif

BluetoothSerial SerialBT;
Adafruit_MPU6050 mpu;

long timer = 0;

float Xacc;
float Yacc;
float Zacc;

void setup() {
  Serial.begin(115200);
  SerialBT.begin("ESP32test");
  delay(1000);
  Wire.begin();

  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    SerialBT.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  mpu.setAccelerometerRange(MPU6050_RANGE_2_G);
  Serial.println("MPU6050 initialized successfully");
  SerialBT.println("MPU6050 initialized successfully");
  delay(2000); // Add a delay after initialization
}

void loop() {
  while (millis() - timer > 10){
    sensors_event_t accel, gyro, temp;
    mpu.getEvent(&accel, &gyro, &temp);
    Xacc = accel.acceleration.x;
    Yacc = accel.acceleration.y;
    Zacc = accel.acceleration.z;

    // Format the data as "DATA:X,Y,Z;"
    String formattedData = "DATA:" + String(Xacc) + "," + String(Yacc) + "," + String(Zacc) + ";";

    Serial.println(formattedData);
    SerialBT.println(formattedData);

    timer = millis();
  }
}


