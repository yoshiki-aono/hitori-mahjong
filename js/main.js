let app = new Vue({
  el:'#app',
  data:{
    doraHyouji : null,
    tehai : [],
    sutehai : [],
    yamahai : [],
    agari : false,
    yaku: [],
    fan: [],
    fu: 20,
    totalFan: 0,
  },
  created: function() {
    this.yamahai = new Yamahai().getYama();
    this.doraHyouji = this.yamahai.shift();
    for(let i=0; i<14; i++){
      this.tehai.push(this.yamahai.shift());
    }
    this.tehai.sort(Hai.compareFunc);
    this.agari = isAgari(this.tehai);
  },
  methods: {
    //牌の交換
    change: function(index) {
      if(!this.agari && this.sutehai.length < 17){
        let suteTargetHai = this.tehai[index];
        this.tehai.splice(index, 1);

        this.sutehai.push(suteTargetHai);
        this.tehai.sort(Hai.compareFunc);

        let tsumoHai = this.yamahai.shift();
        this.tehai.push(tsumoHai);
      }else if(this.sutehai.length === 17){
        let suteTargetHai = this.tehai[index];
        this.tehai.splice(index, 1);

        this.sutehai.push(suteTargetHai);
        this.tehai.sort(Hai.compareFunc);
      }

      if(!this.agari && isAgari(this.tehai)){
        this.agari = true;
        let result = getYaku(this.tehai, this.tehai[13], this.sutehai.length, 27, 27, this.doraHyouji);
        this.yaku = result["yaku"];
        this.fan = result["fan"];
        this.totalFan = result["totalFan"];
        this.fu = result["fu"];
        this.point = result["point"];
      }
    }
  }
});
