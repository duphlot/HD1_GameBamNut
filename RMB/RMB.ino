#include <Wire.h>
#include <LiquidCrystal_I2C.h>

const int maxn = 1e6+7;
LiquidCrystal_I2C lcd(0x27, 2, 1, 0, 4, 5, 6, 7, 3, POSITIVE);
int VRx = A0,VRy = A1,SW = 2,xPosition = 0,yPosition = 0,SW_state = 0,mapX = 0,mapY = 0,count, now = 2; 
int local[] = {1,7,12},temp = 0;
struct pair{
  int fi;
  int se;
} ;
pair sav[100];

void setup() {
  lcd.begin(16,2);
  lcd.clear();
  lcd.print("welcum!");
  delay(1000);
  Serial.begin(9600); 
  pinMode(VRx, INPUT);
  pinMode(VRy, INPUT);
  pinMode(SW, INPUT_PULLUP);
}

void count_time(int time){
  int s = 0;
  for (int s=1;s<=time;s++){
    lcd.setCursor(0,1);
    lcd.print("       ");
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
      count--;
      lcd.setCursor(0,1);
      lcd.print(count);
    } delay(50);
    if (SW_state==0) {
      return count;
    }
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
      lcd.clear(),lcd.setCursor(0,0); lcd.print("timer");
      delay(3000);
      sav[temp++] = {now,choose_time()}; 
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
            if (sav[i].fi == 0) lcd.print("high");
            else if (sav[i].fi == 1) lcd.print("medium");
            else lcd.print("low");
            count_time(sav[i].se);
          }exit(0);
        }
      } delay(10000);
    }
  }
}

void loop() {
  choose_mode();
  delay(100000);
}
