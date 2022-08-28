//ptd
#define led1 A5
#define led2 A4
#define led3 A3
#define led4 2
#define led5 3
#define led6 4
#define led7 5

int const button[] = {6, 7, 8, 9, 10, 11, 12};
bool danhdau[8];
int test[8];
long long vong3[100];

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
  randomSeed(analogRead(0));
}

void Tat(int x){
  if (x==1) digitalWrite(led1, LOW);
  else if (x==2)digitalWrite(led2, LOW);
  else if (x==3)digitalWrite(led3, LOW);
  else digitalWrite(x-2, LOW);
}

void Bat(int x){
  if (x==1) digitalWrite(led1, HIGH);
  else if (x==2)digitalWrite(led2, HIGH);
  else if (x==3)digitalWrite(led3, HIGH);
  else digitalWrite(x-2, HIGH);
}

void BatTatDen(int x,long long timed){
  Bat(x);
  delay(timed);
  Tat(x);
}

void RandomTest(int n)
{ 
  for (int i=1;i<=n;i++) danhdau[i]=false,test[i-1]=0;
  int tam=random(1,1000) % n + 1;
  for (int i=0;i<13;i++) tam=random(1,1000) % n + 1;
  for (int i=0;i<n; i++){
    while (danhdau[tam]) tam=random(1,1000) % n + 1;
    test[i] = tam;
    danhdau[tam]=true;
  }
}

void checkvong1(int n){
  for (int v=0;v<n;v++){
    BatTatDen(test[v],1000);
    for (int i=0;i<=v;i++){
      while (digitalRead(button[test[i]-1]) == 1){
        for (int j=0;j<n;j++) {
          if (j!=test[i]-1 && digitalRead(button[j])==0) gameover();
        }
      } Bat(test[i]); delay(500);
    } delay(500);
    for (int i=0;i<=v;i++) Tat(test[i]);
    delay(500);
  }
}

void checkvong2(int n){
  for (int v=0;v<n;v+=2){
    Bat(test[v]); Bat(test[v+1]);
    delay(500);
    Tat(test[v]); Tat(test[v+1]);
    for (int i=0;i<=v;i+=2){
      while (digitalRead(button[test[i]-1]) == 1 && digitalRead(button[test[i+1]-1]) == 1){
        for (int j=0;j<n;j++) {
          if (j!=test[i]-1 && j!=test[i+1]-1 && digitalRead(button[j])==0) gameover();
        }
      } Bat(test[i]);  Bat(test[i+1]);
    } delay(500);
    for (int i=0;i<=v;i+=2) Tat(test[i]),Tat(test[i+1]);
    delay(500);
  }  
}

void checkvong3(int n){
  int tam=random(1,2),v=0,dem=0;
  while (v<n){
    int temp=0,i=0;
    tam=random(1,2); Bat(test[v]);
    if (tam==2) Bat(test[v+1]); 
    delay(500); Tat(test[v]); Tat(test[v+1]);
    while (i<=v){
      if (vong3[temp]==1){
        while (digitalRead(button[test[i]-1]) == 1){
          for (int j=0;j<n;j++) {
            if (j!=test[i]-1 && digitalRead(button[j])==0) gameover();
          }
        }  Bat(test[i]);
      } else {
        while (digitalRead(button[test[i]-1]) == 1 && digitalRead(button[test[i+1]-1]) == 1){
          for (int j=0;j<n;j++) {
            if (j!=test[i]-1 && j!=test[i+1]-1 && digitalRead(button[j])==0) gameover();
          }
        } Bat(test[i]);  Bat(test[i+1]);
      }i+=vong3[temp]; temp++;
    } delay(500);
    for (int i=0;i<=n;i++) Tat(test[i]);
    delay(500);
    v+=tam; vong3[dem]=tam; dem++;
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


void loop() {
  RandomTest(7);
  checkvong1(4);
  delay(2000);
  RandomTest(7);
  checkvong2(7);
  delay(2000);
  RandomTest(7);
  checkvong3(7);
  delay(10000000);
}
