const YAOCHU_HAIS = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];

function isAgari(tehai){
    if(typeof(tehai[0]) !== 'number'){
        // number じゃない場合 Hai クラスのオブジェクトであると仮定
        let tehaiArr = new Array(34).fill(0);
        tehai.forEach(function(value){
            tehaiArr[value.num] += 1;
        });
        return (isChitoi(tehaiArr) || isKokushi(tehaiArr) || isMentsuTe(tehaiArr))
    }else{
        return (isChitoi(tehai) || isKokushi(tehai) || isMentsuTe(tehai))
    }
}

function isMentsuTe(tehai){
    let atama = 1, mentsu = 4;
    // 字牌を見る
    for(let i=27; i<34; i++){
        if(tehai[i] === 1 || tehai[i] === 4){
            return false;
        }else if(tehai[i] === 2){
            atama -= 1;
        }else if(tehai[i] === 3) {
            mentsu -= 1;
        }
    }
    if(atama < 0){
        return false;
    }
    // 数牌を見る マンズ・ピンズ・ソーズ の 3 つにわける
    for(let haiType of [0, 1, 2]){
        let sumHaiEachType = 0;
        let tehaiEachType = tehai.slice(9*haiType, 9*(haiType+1));
        tehaiEachType.forEach(function(value){
            sumHaiEachType += value;
        });
        if(sumHaiEachType === 0){
        }else if(sumHaiEachType % 3 === 0){
            // 面子だけとれるパターン
            if(!_takeMentsu(tehaiEachType)){
                return false;
            }
        }else if(sumHaiEachType % 3 === 1){
            // どうとっても牌が余るためアガリがない
            return false;
        }else if(sumHaiEachType % 3 === 2){
            // 面子とアタマがとれる
            if(atama === 0) {
                return false;
            }
            let isAbleToTakeAtamaMentsu = false;
            let atamaCand = [];
            tehaiEachType.forEach(function(value, index){
                if(value >= 2){
                    atamaCand.push(index);
                }
            });
            for(let atamaHai of atamaCand){
                let copyTehai = tehaiEachType.concat();
                copyTehai[atamaHai] -= 2;
                if(_takeMentsu(copyTehai, 0)){
                    isAbleToTakeAtamaMentsu = true;
                    break;
                }
            }
            if(!isAbleToTakeAtamaMentsu){
                return false;
            }
        }
    }
    return true;
}

function _takeMentsu(tehai, idx=0){
    // 終了条件判定
    let sum_tehai = 0;
    tehai.forEach(function(value){
        sum_tehai += value;
    });
    if(sum_tehai === 0){
        return true;
    }else if(sum_tehai%3 !== 0){
        return false;
    }else if(idx === 9){
        return false;  // tehai は長さ 9 の配列
    }
    // 再帰処理により面子をとる
    // idx 番目の牌を持っていない場合
    if(tehai[idx] === 0){
        return _takeMentsu(tehai, idx+1);
    // idx 番目の牌を 3 枚以上持っている場合
    }else if(tehai[idx] >= 3){
        let copyTehai = tehai.concat();
        copyTehai[idx] -= 3;
        return _takeMentsu(copyTehai, idx);
    // idx 番目の牌を 1 枚以上持っている場合
    }else if(tehai[idx] >= 1){
        let copyTehai = tehai.concat();
        if(copyTehai[idx+1] >= 1 && copyTehai[idx+2] >= 1){
            copyTehai[idx] -= 1;
            copyTehai[idx+1] -= 1;
            copyTehai[idx+2] -= 1;
            return _takeMentsu(copyTehai, idx);
        }else if(tehai[idx] < 3){
            return false;
        }
    }
}

function isChitoi(tehai){
    if(tehai.length !== 34){
        return false;
    }
    return !tehai.some(function(value){
        return (value === 1 || value === 3 || value === 4)
    });
}

function isKokushi(tehai){
    if(tehai.length !== 34){
        return false;
    }
    let flgKokushi = true;
    for(let yaochuHai of YAOCHU_HAIS){
        if(tehai[yaochuHai] !== 1 && tehai[yaochuHai] !== 2){
            flgKokushi = false;
            break;
        }
    }
    return flgKokushi;
}
