let CHINROH_HAIS = [0, 8, 9, 17, 18, 26];
let SANGEN_HAIS = [31, 32, 33];
let RYUISO_HAIS = [19, 20, 21, 23, 25, 32];
let FEN_HAIS = [27, 28, 29, 30];

function getYaku(tehaiOrigin, agariHaiOrigin, sutehaiNum, jikaze, bakaze, doraHyoujiOrigin){
    let tehai = tehaiOrigin.concat();
    let agariHai = agariHaiOrigin;
    let doraHyouji = doraHyoujiOrigin;
    // Hai class object --> number
    if(typeof(tehaiOrigin) !== "number"){
        tehai = new Array(34).fill(0);
        tehaiOrigin.forEach(function(value){
            tehai[value.num] += 1;
        });
    }
    if(typeof(agariHai) !== "number"){
        agariHai = agariHaiOrigin.num;
    }
    if(typeof(doraHyouji) !== "number"){
        doraHyouji = doraHyoujiOrigin.num;
    }
    let dora = getDoraNum(doraHyouji);

    let yakuArr=[], yakumanArr=[], fan=[], fanYakuman=[], fu=30;
    if(isKokushi(tehai)){
        yakumanArr = ["国士無双"];
        fanYakuman = [13];
    }else if(isMentsuTe(tehai)){
        let result = getMentsuTeYaku(tehai, agariHai, dora, jikaze, bakaze);
        yakuArr = result["yaku"];
        yakumanArr = result["yakuman"];
        fan = result["fan"];
        fanYakuman = result["fanYakuman"];
        fu = result["fu"];
    }else if(isChitoi(tehai)){
        let result = getChitoiYaku(tehai, dora);
        yakuArr = result["yaku"];
        yakumanArr = result["yakuman"];
        fan = result["fan"];
        fanYakuman = result["fanYakuman"];
        fu = result["fu"];
    }
    // 天和， ツモ
    if(sutehaiNum === 0){
        yakumanArr = ["天和"].concat(yakumanArr);
        fanYakuman.push(13);
    }
    yakuArr = ["門前清自摸和"].concat(yakuArr);
    fan = [1].concat(fan);
    if(!yakuArr.includes("平和") && !yakuArr.includes("七対子")){
        fu += 2;
        // fu の切り捨て
        fu = Math.ceil(fu/10) * 10;
    }

    console.log(dora);
    let point = getPoint(yakuArr, yakumanArr, fan, fu);
    let totalFan = 0;
    fan.forEach(function(value){
        totalFan += value;
    });
    if(totalFan > 13){
        totalFan = 13;
    }
    if(yakumanArr.length > 0){
        return {yaku: yakumanArr,
                fan: fanYakuman,
                totalFan: 13,
                fu: 20,
                point: point}
    }else{
        return {yaku: yakuArr,
                fan: fan,
                totalFan: totalFan,
                fu: fu,
                point: point}
    }
}

function getChitoiYaku(tehai, dora){
    let yakuArr = [], fan = [];
    let yakumanArr = [], fanYakuman = [];
    // 清老頭, 字一色
    let flgChinroh = true, flgTsuiso = true;
    tehai.forEach(function(value, index){
        if(value > 0 && !CHINROH_HAIS.includes(index)){
            flgChinroh = false;
        }
        if(value > 0 && index < 27){
            flgTsuiso = false;
        }
    });
    if(flgChinroh || flgTsuiso){
        if(flgChinroh){
            yakumanArr.push("清老頭");
            fanYakuman.push(13);
        }else if(flgTsuiso) {
            yakumanArr.push("字一色");
            fanYakuman.push(13);
        }
        return {yaku: [],
                yakuman: yakumanArr,
                fan: [],
                fanYakuman: fanYakuman,
                fu: 30}
    }
    // 普通の役
    // 七対子
    yakuArr.push("七対子");
    fan.push(2);
    // タンヤオ， 混老頭
    let flgTanyao = true, flgHonroh = true;
    tehai.forEach(function(value, index){
        if(value > 0 && !YAOCHU_HAIS.includes(index)){
            flgHonroh = false;
        }else if(value > 0 && YAOCHU_HAIS.includes(index)){
            flgTanyao = false;
        }
    });
    if(flgTanyao){
        yakuArr.push("断么九");
        fan.push(1);
    }else if(flgHonroh){
        yakuArr.push("混老頭");
        fan.push(2);
    }
    // 混一色， 清一色
    let sumManzu=0, sumPinzu=0, sumSouzu=0, sumJihai=0;
    tehai.forEach(function(value, index){
        let haiType = Math.floor(index/9);
        if(value > 0 && haiType === 0){
            sumManzu += value;
        }else if(value > 0 && haiType === 1){
            sumPinzu += value;
        }else if(value > 0 && haiType === 2){
            sumSouzu += value;
        }else if(value > 0 && haiType === 3){
            sumJihai += value;
        }
    });
    if(sumJihai !== 0 &&
        (sumJihai + sumManzu === 14 || sumJihai + sumPinzu === 14 || sumJihai + sumSouzu === 14)){
        yakuArr.push("混一色");
        fan.push(3);
    }else if(sumManzu === 14 || sumPinzu === 14 || sumSouzu === 14){
        yakuArr.push("清一色");
        fan.push(6);
    }
    if(tehai[dora] > 0){
        yakuArr.push("ドラ");
        fan.push(2);
    }
    return {yaku: yakuArr,
            yakuman: yakumanArr,
            fan: fan,
            fanYakuman: fanYakuman,
            fu: 25}
}

function getMentsuTeYaku(tehai, agariHai, dora, jikaze, bakaze){
    let atama=[], shuntsu=[], anko=[];
    let getAgariKei = function(tmpTehai, tmpAtama=[], tmpShuntsu=[], tmpAnko=[], idx=0){
        // 終了条件
        if(idx === 34 && tmpAtama.length === 1 && (tmpShuntsu.length + tmpAnko.length) === 4){
            atama.push(tmpAtama[0]);
            shuntsu.push(tmpShuntsu);
            anko.push(tmpAnko);
        }else if(tmpTehai[idx] === 0){
            getAgariKei(tmpTehai, tmpAtama, tmpShuntsu, tmpAnko, idx+1);
        }
        // 順子がとれるよ
        if(idx < 27 && idx%9 <= 6 && tmpTehai[idx] >= 1 && tmpTehai[idx+1] >= 1 && tmpTehai[idx+2] >= 1){
            let copyTehai = tmpTehai.concat();
            copyTehai[idx] -= 1;
            copyTehai[idx+1] -= 1;
            copyTehai[idx+2] -= 1;
            let copyTmpShuntsu = tmpShuntsu.concat();
            copyTmpShuntsu.push(idx);
            getAgariKei(copyTehai, tmpAtama, copyTmpShuntsu, tmpAnko, idx);
        }
        // アタマがとれるよ
        if(tmpTehai[idx] >= 2 && tmpAtama.length === 0){
            let copyTehai = tmpTehai.concat();
            copyTehai[idx] -= 2;
            let copyTmpAtama = tmpAtama.concat();
            copyTmpAtama.push(idx);
            getAgariKei(copyTehai, copyTmpAtama, tmpShuntsu, tmpAnko, idx);
        }
        // 暗刻がとれるよ
        if(tmpTehai[idx] >= 3){
            let copyTehai = tmpTehai.concat();
            copyTehai[idx] -= 3;
            let copyTmpAnko = tmpAnko.concat();
            copyTmpAnko.push(idx);
            getAgariKei(copyTehai, tmpAtama, tmpShuntsu, copyTmpAnko, idx);
        }
    };
    getAgariKei(tehai);
    let maxFan = 0;
    let maxYaku=[], maxFanList=[], maxFu=30;
    for(let i=0; i<atama.length; i++){
        let result = calcYaku(atama[i], shuntsu[i], anko[i], agariHai, dora, bakaze, jikaze);
        if(result["yakuman"].length > 0){
            return {yaku: result["yaku"],
                    yakuman: result["yakuman"],
                    fan: result["fan"],
                    fanYakuman: result["fanYakuman"],
                    fu: result["fu"]}
        }else{
            let totalFan = 0;
            result["fan"].forEach(function(value){
                totalFan += value;
            });
            if(totalFan > maxFan || (totalFan === maxFan && result["fu"] > maxFu)){
                maxYaku = result["yaku"];
                maxFanList = result["fan"];
                maxFu = result["fu"];
            }
        }
    }
    return {yaku: maxYaku,
            yakuman: [],
            fan: maxFanList,
            fanYakuman: [],
            fu: maxFu}
}

function calcYaku(atama, shuntsu, anko, agariHai, dora, bakaze, jikaze){
    let yaku=[], yakuman=[], fan=[], fanYakuman=[];
    // 暗刻タイプの役
    if(anko.length === 4){
        // 四暗刻
        yakuman.push("四暗刻");
        fanYakuman.push(13);
        // 清老頭，字一色，大四喜
        let flgChinroh=true, flgTsuiso=true, flgDaisusi=true;
        anko.forEach(function(value){
           if(!CHINROH_HAIS.includes(value)){
               flgChinroh = false;
           }
           if(!SANGEN_HAIS.includes(value) && !FEN_HAIS.includes(value)){
               flgTsuiso = false;
           }
           if(!FEN_HAIS.includes(value)){
               flgDaisusi = false;
           }
        });
        if(flgChinroh && CHINROH_HAIS.includes(atama)){
            yakuman.push("清老頭");
            fanYakuman.push(13);
        }
        if(flgTsuiso && (SANGEN_HAIS.includes(atama) || FEN_HAIS.includes(atama))){
            yakuman.push("字一色");
            fanYakuman.push(13);
        }
        if(flgDaisusi && FEN_HAIS.includes(atama)){
            yakuman.push("大四喜");
            fanYakuman.push(13);
        }
    }
    // 暗刻 3 つ以上の役
    if(anko.length >= 3){
        // 三暗刻
        yaku.push("三暗刻");
        fan.push(2);
        // 三色同刻
        if(anko.some(function(value){
            return anko.includes(value+9) && anko.includes(value+18);
        })){
            yaku.push("三色同刻");
            fan.push(2);
        }
        // 大三元， 小四喜
        let flgDaisangen=true, flgShoususi=true;
        anko.forEach(function(value){
           if(!SANGEN_HAIS.includes(value)) {
               flgDaisangen = false;
           }
           if(!FEN_HAIS.includes(value)){
               flgShoususi = false;
           }
        });
        if(flgDaisangen && SANGEN_HAIS.includes(atama)){
            yakuman.push("大三元");
            fanYakuman.push(13);
        }
        if(flgShoususi && FEN_HAIS.includes(atama)){
            yakuman.push("小四喜");
            fanYakuman.push(13);
        }
    }
    // 暗刻 2 つ以上の役
    if(atama.length >= 2){
        let flgShousangen = true;
        anko.forEach(function(value){
           if(!SANGEN_HAIS.includes(value)){
               flgShousangen = false;
           }
        });
        if(flgShousangen && SANGEN_HAIS.includes(atama)){
            yaku.push("小三元");
            yaku.push(2);
        }
    }
    // 順子 2 つ以上(一盃口， 二盃口)
    if(shuntsu.length >= 2){
        let sameShuntsuCnt = 0, skipNext=false;
        for(let i=0; i<shuntsu.length; i++){
            if(!skipNext && shuntsu[i] === shuntsu[i+1]){
                sameShuntsuCnt += 1;
                skipNext = true;
            }else{
                skipNext = false;
            }
        }
        if(sameShuntsuCnt === 1){
            yaku.push("一盃口");
            fan.push(1);
        }else if(sameShuntsuCnt === 2){
            yaku.push("二盃口");
            fan.push(3);
        }
    }
    // 順子 3 つ以上
    if(shuntsu.length >= 3){
        // 一気通貫
        if(shuntsu.some(function(value){
            return value%9===0 &&
                    shuntsu.includes(value+3) &&
                    shuntsu.includes(value+6);
        })){
            yaku.push("一気通貫");
            fan.push(2);
        }
        // 三色同順
        if(shuntsu.some(function(value){
            return shuntsu.includes(value+9) && shuntsu.includes(value+18);
        })){
            yaku.push("三色同順");
            fan.push(2);
        }
    }
    // 順子 4 つ
    let flgPinfu = false;
    if(shuntsu.length === 4){
        shuntsu.forEach(function(value){
           if(value%9 !== 0 && value%9 !== 6 &&
               (value === agariHai || value+2 === agariHai)){
               flgPinfu = true;
           }else if(value%9 === 0 && value === agariHai){
               flgPinfu = true;
           }else if(value%9 === 6 && value+2 === agariHai){
               flgPinfu = true;
           }
        });
        // アタマ判定
        if(SANGEN_HAIS.includes(atama) || atama === jikaze || atama === bakaze){
            flgPinfu = false;
        }
        if(flgPinfu){
            yaku.push("平和");
            fan.push(1);
        }
    }
    // タンヤオ，チャンタ系
    if(shuntsu.length > 0){
        let chantaCnt=0, junCnt=0;
        shuntsu.forEach(function(value){
           if(CHINROH_HAIS.includes(value) || CHINROH_HAIS.includes(value+2)){
               junCnt += 1;
           }
           if(YAOCHU_HAIS.includes(value) || YAOCHU_HAIS.includes(value+2)){
               chantaCnt += 1;
           }
        });
        if(anko.length > 0){
            anko.forEach(function(value){
                if(CHINROH_HAIS.includes(value)){
                    junCnt += 1;
                }
                if(YAOCHU_HAIS.includes(value)){
                    chantaCnt += 1;
                }
            })
        }
        if(junCnt === 4 && CHINROH_HAIS.includes(atama)){
            yaku.push("純全帯么九");
            fan.push(3);
        }else if(chantaCnt === 4 && YAOCHU_HAIS.includes(atama)){
            yaku.push("混全帯么九");
            fan.push(2);
        }else if(chantaCnt === 0 && !YAOCHU_HAIS.includes(atama)){
            yaku.push("断么九");
            fan.push(1);
        }
    }
    // 混一色，清一色
    let sumEachColor = [0, 0, 0, 0];
    let colorHaiArr = new Array(9).fill(0);
    if(anko.length > 0){
        anko.forEach(function(value){
            sumEachColor[Math.floor(value/9)] += 1;
            colorHaiArr[value%9] += 3;
        });
    }
    if(shuntsu.length > 0){
        shuntsu.forEach(function(value){
            sumEachColor[Math.floor(value/9)] += 1;
            colorHaiArr[value%9] += 1;
            colorHaiArr[(value%9)+1] += 1;
            colorHaiArr[(value%9)+2] += 1;
        });
    }
    sumEachColor[Math.floor(atama/9)] += 1;
    colorHaiArr[atama%9] += 2;
    if((sumEachColor[0] === 0 && sumEachColor[1] === 0) ||
        (sumEachColor[0] === 0 && sumEachColor[2] === 0) ||
        (sumEachColor[1] === 0 && sumEachColor[2] === 0)){
        if(sumEachColor[3] !== 0){
            yaku.push("混一色");
            fan.push(3);
        }else{
            yaku.push("清一色");
            fan.push(6);
            // 九蓮宝燈
            let flgChuren=true, headExist=false;
            let churenArr = [3, 1, 1, 1, 1, 1, 1, 1, 3];
            colorHaiArr.forEach(function(value, index){
                if(churenArr[index]+1 === value && !headExist){
                    headExist = true;
                }else if(churenArr[index] !== value){
                    flgChuren = false;
                }
            });
            if(flgChuren){
                yakuman.push("九蓮宝燈");
                fanYakuman.push(13);
            }
        }
        // 緑一色
        let flgRyuiso = true;
        if(!RYUISO_HAIS.includes(atama)){
            console.log(atama);
            flgRyuiso = false;
        }
        if(shuntsu.length > 0){
            shuntsu.forEach(function(value){
                if(value !== 19){
                    console.log(value);
                    flgRyuiso = false;
                }
            });
        }
        if(anko.length > 0){
            anko.forEach(function(value){
                if(!RYUISO_HAIS.includes(value)){
                    console.log(value);
                    flgRyuiso = false;
                }
            });
        }
        if(flgRyuiso){
            yakuman.push("緑一色");
            fanYakuman.push(13);
        }
    }
    // 風牌， 三元牌
    if(anko.length > 0){
        anko.forEach(function(value){
            if(value === jikaze){
                yaku.push("自風");
                fan.push(1);
            }
            if(value === bakaze){
                yaku.push("場風");
                fan.push(1);
            }
            if(value === 31){
                yaku.push("白");
                fan.push(1);
            }else if(value === 32){
                yaku.push("發");
                fan.push(1);
            }else if(value === 33){
                yaku.push("中");
                fan.push(1);
            }
        });
    }
    // ドラ
    let doraCnt = 0;
    if(shuntsu.length > 0){
        shuntsu.forEach(function(value){
            if(value === dora || value+1 === dora || value+2 === dora){
                doraCnt += 1;
            }
        });
    }
    if(anko.length > 0){
        anko.forEach(function(value){
            if(value === dora){
                doraCnt += 3;
            }
        });
    }
    if(atama === dora){
        doraCnt += 2;
    }
    if(doraCnt > 0){
        yaku.push("ドラ");
        fan.push(doraCnt);
    }

    if(flgPinfu){
        return {yaku: yaku,
                yakuman: yakuman,
                fan: fan,
                fanYakuman: fanYakuman,
                fu: 20}
    }
    // 符計算
    let fuTotal = 20;
    // 暗刻
    if(anko.length > 0){
        anko.forEach(function(value){
            if(YAOCHU_HAIS.includes(value)){
                fuTotal += 8;
            }else{
                fuTotal += 4;
            }
        });
    }
    // アタマ
    if([bakaze, jikaze, 31, 32, 33].includes(atama)){
        fuTotal += 2;
    }
    // 待ちの形
    let machiGukei = false;
    if(shuntsu.length > 0){
        for(let i=0; i<shuntsu.length; i++){
            if(shuntsu[i]+1 === agariHai ||
                (shuntsu[i]%9 === 0 && shuntsu[i]+2 === agariHai) ||
                (shuntsu[i]%9 === 6 && shuntsu[i] === agariHai)){
                machiGukei = true;
            }
        }
    }
    if(atama === agariHai){
        machiGukei = true;
    }
    if(machiGukei){
        fuTotal += 2;
    }
    return {yaku: yaku,
            yakuman: yakuman,
            fan: fan,
            fanYakuman: fanYakuman,
            fu: fuTotal}
}

function getDoraNum(doraHyouji){
    if(doraHyouji < 27){
        if(doraHyouji%9 === 8){
            return doraHyouji - 8;
        }else{
            return doraHyouji + 1;
        }
    }else{
        if(doraHyouji === 30){
            return 27;
        }else if(doraHyouji === 33){
            return 31;
        }else{
            return doraHyouji + 1;
        }
    }
}

function getPoint(yaku, yakuman, fan, fu){
    if(yakuman.length > 0){
        return 32000;
    }
    let totalFan = 0;
    fan.forEach(function(value){
        totalFan += value;
    });
    if(totalFan >= 13){
        return 32000;
    }else if(totalFan >= 11){
        return 24000;
    }else if(totalFan >= 8){
        return 16000;
    }else if(totalFan >= 6){
        return 12000;
    }else if(totalFan === 5){
        return 8000;
    }else if(totalFan === 4){
        if(fu === 20){
            return 5200;
        }else if(fu === 25){
            return 6400;
        }else if(fu === 30){
            return 7700;
        }else{
            return 8000;
        }
    }else if(totalFan === 3){
        if(fu === 20){
            return 2700;
        }else if(fu === 25){
            return 3200;
        }else if(fu === 30){
            return 3900;
        }else if(fu === 40){
            return 5200;
        }else if(fu === 50){
            return 6400;
        }else if(fu === 60){
            return 7700;
        }else{
            return 8000;
        }
    }else if(totalFan === 2){
        if(fu === 20){
            return 1500;
        }else if(fu === 25){
            return 1600;
        }else if(fu === 30){
            return 2000;
        }else if(fu === 40){
            return 2600;
        }else if(fu === 50){
            return 3200;
        }else if(fu === 60){
            return 3900;
        }else if(fu === 70){
            return 4500;
        }else if(fu === 80){
            return 5200;
        }
    }else if(totalFan === 1){
        if(fu === 30){
            return 1000;
        }else if(fu === 40){
            return 1300;
        }else if(fu === 50){
            return 1600;
        }else if(fu === 60){
            return 2000;
        }else if(fu === 70){
            return 2300;
        }
    }
    return 120000;
}
