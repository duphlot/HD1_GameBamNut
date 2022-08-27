//ptd
#define led1 A5
#define led2 A4
#define led3 A3
#define led4 2
#define led5 3
#define led6 4
#define led7 5

int const button[] = {6, 7, 8, 9, 10, 11, 12};
bool danhdau[8]={false};
int test[8];

void setup() {
  long long n=sizeof(button);
  pinMode(led1,OUTPUT);
  pinMode(led2,OUTPUT);
  pinMode(led3,OUTPUT);
  pinMode(led4,OUTPUT);
  pinMode(led5,OUTPUT);
  pinMode(led6,OUTPUT);
  pinMode(led7,OUTPUT);
  for (int i=0;i<7;i++){
    pinMode(button[i], INPUT_PULLUP);  
  } Serial.begin(9600);
  randomSeed(analogRead(10));
}

void Tat(int x){
  if (x==1) digitalWrite(led1, LOW);
  else if (x==2)digitalWrite(led2, LOW);
  else if (x==3)digitalWrite(led3, LOW);
  else digitalWrite(x-2, LOW);
}

void Bat(int x,long long timed){
  if (x==1) digitalWrite(led1, HIGH);
  else if (x==2)digitalWrite(led2, HIGH);
  else if (x==3)digitalWrite(led3, HIGH);
  else digitalWrite(x-2, HIGH);
  delay(timed);
}

void BatTatDen(int x,long long timed){
  Bat(x,timed);
  Tat(x);
}

void RandomTest()
{ int tam=random(1,8);
  for (int i=0;i<3;i++) tam=random(1,8);
  for (int i=0;i<7; i++){
    while (danhdau[tam]) tam=random(1,8);
    test[i] = tam;
    danhdau[tam]=true;
  }
}

void check(){
  for (int v=0;v<7;v++){
    BatTatDen(test[v],1000);
    for (int i=0;i<=v;i++){
      while (digitalRead(button[test[i]-1]) == 1){
        for (int j=0;j<7;j++) {
          if (j!=test[i]-1 && digitalRead(button[j])==0) gameover();
        }
      } Bat(test[i],500);
    } delay(500);
    for (int i=0;i<=v;i++) Tat(test[i]);
    delay(500);
  }
}

void gameover() {

  for (int i = 0; i <= 100; i++) {
    delay(200);
    tone(A2, 988, 300); 
    delay( 1000 ); 
    noTone(A2);
    tone(A2, 988, 300); 
    delay( 1000 ); 
    noTone(A2);
  } delay(2000);
}

void win(){
  tone(A2, 261.63, 200);
    delay(500);
    noTone(A2);
    tone(A2, 261.63, 200);
    delay(500);
    noTone(A2);
    
    tone(A2, 392, 200);
    delay(500);
    noTone(A2);
    tone(A2, 392, 200);
    delay(500);
    noTone(A2);

    tone(A2, 440, 200);
    delay(500);
    noTone(A2);
    tone(A2, 440, 200);
    delay(500);
    noTone(A2);

    tone(A2, 392, 200);
    delay(750);
    noTone(A2);

    tone(A2, 349, 200);
    delay(500);
    noTone(A2);
    tone(A2, 349, 200);
    delay(500);
    noTone(A2);

    tone(A2, 329, 200);
    delay(500);
    noTone(A2);
    tone(A2, 329, 200);
    delay(500);
    noTone(A2);

    tone(A2, 293, 200);
    delay(500);
    noTone(A2);
    tone(A2, 293, 200);
    delay(500);
    noTone(A2);

    tone(A2, 261, 200);
    delay(750);
    noTone(A2);

    tone(A2, 392, 200);
    delay(500);
    noTone(A2);
    tone(A2, 392, 200);
    delay(500);
    noTone(A2);

    tone(A2, 349, 200);
    delay(500);
    noTone(A2);
    tone(A2, 349, 200);
    delay(500);
    noTone(A2);

    tone(A2, 329, 200);
    delay(500);
    noTone(A2);
    tone(A2, 329, 200);
    delay(500);
    noTone(A2);

    tone(A2, 293, 200);
    delay(750);
    noTone(A2);



    tone(A2, 392, 200);
    delay(500);
    noTone(A2);
    tone(A2, 392, 200);
    delay(500);
    noTone(A2);

    tone(A2, 349, 200);
    delay(500);
    noTone(A2);
    tone(A2, 349, 200);
    delay(500);
    noTone(A2);

    tone(A2, 329, 200);
    delay(500);
    noTone(A2);
    tone(A2, 329, 200);
    delay(500);
    noTone(A2);

    tone(A2, 293, 200);
    delay(750);
    noTone(A2);
    
    delay(500);
}

void loop() {
  memset(danhdau,false,sizeof(danhdau));
  memset(test,0,sizeof(test));
  RandomTest();
  check();
  win();
  delay(10000000);
}
