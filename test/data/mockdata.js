function generateObj () {
    return {
        teamBuyings:  [
            {
                id: 0,
                discount: '2.8',
                joinedNum: '5',
                img: './img/good_bg1.png', // 团购图片
                endTime:  new Date(Date.now + 30*24*3600000) , // 结束时间
                title: '【直降5元】好吃的早餐营养餐【直降5元】好吃的早餐营养餐【直降5元】好吃的早餐营养餐【直降5元】好吃的早餐营养餐',
                describe: '五花肉（又称肋条肉、三层肉）位于猪的腹部，猪腹部脂肪组织很多，其中又夹带着肌肉组织。五花肉（又称肋条肉、三层肉）位于猪的腹部，猪腹部脂肪组织很多，其中又夹带着肌肉组织。',
                price: 30.00, 
            }
        ],
    }
}


module.exports = function() {

    var obj = generateObj()

    for(var key in obj) {
        obj[key]  = {
            error: 0,
            msg: '',
            data: obj[key] 
        }
    }
    return obj
}
