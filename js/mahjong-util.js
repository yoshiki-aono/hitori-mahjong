const TYPE_HAI = ["man", "pin", "sou", "ji"];

class Hai{
  constructor(haiNum){
    this.num = haiNum;
    this.type = TYPE_HAI[Math.floor(haiNum/9)];
    this.typeNum = haiNum % 9;
    this.imgSrc = "pai_images\\" + this.type + String(this.typeNum + 1) + "-66-90-l-emb.png";
  }

  static isEqualTo(haiA, haiB){
    return haiA.num === haiB.num;
  }

  static compareFunc(haiA, haiB){
    if(haiA.num > haiB.num) {
      return 1;
    }else{
      return -1;
    }
  }
}

class Yamahai{
  constructor(yamaStr) {
    this.randomGen = yamaStr === undefined;
    this.yama = [];
    if(this.randomGen){
      this.yama = this.makeRandomYama();
    }else{
      this.yama = this.readYamaStr(yamaStr);
    }
  }

  getYama(){
    return this.yama;
  }

  readYamaStr(yamaStr){
    let yamaIntList = yamaStr.split(',').map(str => parseInt(str, 10));
    let yama = [];
    for(let i=0; i<yamaIntList.length; i++){
      yama.push(new Hai(yamaIntList[i]));
    }
    return yama;
  }

  makeRandomYama(){
    let yama = [];
    for(let kind=0; kind<34; kind++){
      for(let i=0; i<4; i++){
        yama.push(new Hai(kind));
      }
    }
    let n = yama.length;
    let temp=0, i=0;
    while(n){
      i = Math.floor(Math.random() * n--);
      temp = yama[n];
      yama[n] = yama[i];
      yama[i] = temp;
    }
    return yama;
  }
}
