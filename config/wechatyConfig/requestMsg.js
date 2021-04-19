const request = require("request")
const urlencode = require("urlencode")
const config = require("./wechaty.config");
const name = config.name;
const db = require("../dbConfig/db");

/**
 * @description 机器人请求接口 处理函数
 * @param {String} info 发送文字
 * @return {Promise} 相应内容
 */
function requestRobot(info) {
    return new Promise((resolve, reject) => {
        let url = `https://open.drea.cc/bbsapi/chat/get?keyWord=${urlencode(info)}`
        request(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let res = JSON.parse(body)
                if (res.isSuccess) {
                    let send = res.data.reply
                    send = send.replace(/Smile/g, name)
                    resolve(send)
                } else {
                    if (res.code == 1010) {
                        resolve("没事别老艾特我，我还以为爱情来了")
                    } else {
                        resolve("你在说什么，我听不懂啊。\n等我家主子回复你")
                    }
                }
            } else {
                resolve("你在说什么，我脑子有点短路诶！")
            }
        })
    })
}

/**
 * @description 筛选最热门的新闻、获取录入的通知 处理函数
 */
function getDailyNews(){
    return new Promise((resolve, reject)=>{
        db.query(`SELECT ******`,(rows,err)=>{
            if(!err){
                resolve()
            }else{
                reject()
            }
        })
    })
}

module.exports = { requestRobot, getDailyNews }