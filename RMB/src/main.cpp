#include <Arduino.h>
#include <Wire.h>
#include <servo.h>
#include <LiquidCrystal_I2C.h>
// ptd
#define int long long
const int maxn = 100;
LiquidCrystal_I2C lcd(0x27, 2, 1, 0, 4, 5, 6, 7, 3, POSITIVE);
int VRx = A0,VRy = A1,SW = 2,xPosition = 0,yPosition = 0,SW_state = 0,mapX = 0,mapY = 0,count, now = 2; 
int local[] = {1,7,12},temp = 0;
struct pair{
  int fi;
  int se;
} ;
pair sav[maxn];
Servo servo; 

void setup() {
  servo.attach(11);
  Serial.begin(9600); 
  pinMode(VRx, INPUT);
  pinMode(VRy, INPUT);
  pinMode(SW, INPUT_PULLUP);
  lcd.begin(16,2);
  lcd.clear();
  lcd.print("welcum!");
  delay(1000);
}

void count_time(int time){
  for (int s=1;s<=time;s++){
    lcd.setCursor(0,1);
    lcd.print("             ");
    lcd.setCursor(0,1);
    lcd.print(s);
    delay(800);
  }
}

int choose_time(){
  count = 0;
  while (1){
    xPosition = analogRead(VRx);
    yPosition = analogRead(VRy);
    SW_state = digitalRead(SW);
    mapX = map(xPosition, 0, 1023, -512, 512);
    mapY = map(yPosition, 0, 1023, -512, 512);
    if ((mapX>=-515)&& (mapX<=-510)&&(mapY>=-250)&& (mapY<=-50)){
       count++;
       lcd.setCursor(0,1);
      lcd.print(count);
    }
    if ((mapX>=168)&& (mapX<=175)&&(mapY>=-250)&& (mapY<=-50)){
      count = max(count-1,0);
      lcd.setCursor(0,1);
      lcd.print(count);
    } delay(50);
    if ((mapX<=-166)&& (mapX>=-175)&&(mapY>=-515)&& (mapY<=-510)) return -1;
    if (SW_state==0) return count;
  } 
}

void choose(int lo,int hi){
  xPosition = analogRead(VRx);
  yPosition = analogRead(VRy);
  SW_state = digitalRead(SW);
  mapX = map(xPosition, 0, 1023, -512, 512);
  mapY = map(yPosition, 0, 1023, -512, 512);
  if ((mapX>=-175)&& (mapX<=-170)&&(mapY>=165)&& (mapY<=175)) {
    now = max(now-1,lo);
    lcd.setCursor(0,1); lcd.print("                ");
    lcd.setCursor(local[now],1);
    lcd.print("**");
    delay(700); 
  } if ((mapX<=-166)&& (mapX>=-175)&&(mapY>=-515)&& (mapY<=-510)) {
    now = min(now+1,hi);
    lcd.setCursor(0,1); lcd.print("                ");
    lcd.setCursor(local[now],1);
    lcd.print("**");
    delay(700);
  } 
}

void choose_mode(){
  lcd.clear();
  lcd.print("Choose mode!");
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("high medium low");
  lcd.setCursor(12,1);
  lcd.print("**");
  now = 2;
  while (1){
    choose(0,2);
   if (SW_state==0){  
      lcd.clear(),lcd.setCursor(0,0); lcd.print("timer     back->");
      delay(3000);
      sav[temp++] = {now,choose_time()}; 
      if (sav[temp-1].se != -1){
        lcd.clear(),lcd.setCursor(0,0); lcd.print("more mode ?");
        delay(3000);
        lcd.clear(),lcd.setCursor(0,0); lcd.print("YES    NO");
        now = 0;
        lcd.setCursor(local[now],1);
        lcd.print("**");
        while (true){
          choose(0,1);
          if (SW_state==0 && now <= 0) delay(3000),choose_mode(),exit(0);
          else if (SW_state==0) {
            lcd.clear();
            for (int i=0;i<temp;i++){
              lcd.setCursor(0,0);
              lcd.print("                  ");
              lcd.setCursor(0,0);
              if (sav[i].fi == 0) servo.write(90),lcd.print("high");
              else if (sav[i].fi == 1) servo.write(155),lcd.print("medium");
              else servo.write(180),lcd.print("low");
              count_time(sav[i].se);
            } delay(1000);
            lcd.clear();
            lcd.setCursor(0,0);
            lcd.print(" Cock Finish!!");
            exit(0);
          }
        } delay(10000);
      } else {
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("high medium low");
        lcd.setCursor(12,1);
        lcd.print("**");
  now = 2;
      }
    }
  }
}

void loop(){
  choose_mode();
  delay(100000);
  // servo.write(0);
  // delay(10000);
  // servo.write(90);
  // delay(10000);
  // servo.write(180);
  // delay(100000);
  // for (int i=0;i<90;i++){
  //   servo.write(i);
  //   delay(15);
  // } delay(10000);
}
