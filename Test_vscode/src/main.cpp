// I would never fall in love again, until I found you
#include <Arduino.h>
//ptd
const int led[] = {A5, A4, A3, 2, 3, 4, 5};
const int button[] = {6, 7, 8, 9, 10, 11, 12};

void setup() {
  for (int i=0;i<7;i++) pinMode(led[i],OUTPUT);
  for (int i=0;i<7;i++) pinMode(button[i],INPUT_PULLUP);
}

void loop() {
  for (int i=0;i<100;i++){
    digitalWrite(led[i%7],HIGH);
    delay(500);
    digitalWrite(led[i%7],LOW);
  }
}