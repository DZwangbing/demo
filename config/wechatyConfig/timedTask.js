const schedule = require('node-schedule');
let { getDailyNews } = require("./requestMsg");

// 每日9:00新闻推送
const dailyPushFunc = (roomList)=>{
    schedule.scheduleJob('0 0 9 * * *',async ()=>{
        const sayValue = await getDailyNews();
        for(let roomKey in roomList){
            const room = await bot.Room.find({ id: roomList[roomKey].id });
            room.say(sayValue)
        }
    });
}

module.exports = { dailyPushFunc };