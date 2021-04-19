let express = require('express');
let router = express.Router();
let qr = require('qr-image');
let { Contact, Message, ScanStatus, Wechaty, log } = require("wechaty");
let { PuppetPadlocal } = require("wechaty-puppet-padlocal");
let { isRoomName, isAddRoom } = require("../config/wechatyConfig/onMessage");
let { dailyPushFunc } = require("../config/wechatyConfig/timedTask");
const config = require("../config/wechatyConfig/wechaty.config");
let { requestRobot } = require("../config/wechatyConfig/requestMsg");
let { name, token } = config, loginStatus = false;


router.get('/getQrCode', async function (req, res, next) {
    let params = await global.$paramsValidator(req, res), sendStatus = true;
    if(!loginStatus){
        bot.on("scan", (qrcode, status)=>{
            if(!sendStatus) return;
            sendStatus = false;
            var code = qr.image(qrcode, {type: 'png'});
            res.setHeader('Content-type', 'image/png');
            code.pipe(res);
        }).start();
    }else{
        res.send(200, JSON.stringify({ status: "err", msg: '已有账号登陆' }));
    }
})

router.get('/botStop', async function (req, res, next) {
    bot.stop()
    res.send(200, JSON.stringify({ status: "ok", data: { status: 0 } }));
})

router.get('/botStatus', async function (req, res, next) {
    res.send(200, JSON.stringify({ status: "ok", data: { status: loginStatus?1:0 } }));
})

const puppet = new PuppetPadlocal({
    token
})
const bot = new Wechaty({
    name: "PadLocalBot",
    puppet
})
    .on("login", async user => {
        loginStatus = true;
        // 存储群列表
        let roomListRes = await bot.Room.findAll(), roomList = {};
        roomListRes.map((room,roomIndex)=>{
            try{
                roomList[room.payload.topic?room.payload.topic:`无名氏_${roomIndex}`] = room.id;
            }catch{}
        })
        config.room.roomList = roomList;
        // 每日新闻 定点推送
        dailyPushFunc(roomList);
    })
    .on("logout", (user, reason) => {
        loginStatus = false;
        log.info("模拟器", `${user}退出登录 ${reason}`);
    })
    .on('friendship', async friendship => {     //好友请求
        try {
            const contact = friendship.contact();
            switch (friendship.type()) {
                case bot.Friendship.Type.Receive:
                    await friendship.accept()
                    const timer = setTimeout(async _ => {
                        await contact.say(`hi ${contact.name()}，我是${name}哦!\n主子不在，您也可以尝试给我发送需求，我也可以帮到您哦。`)
                        clearTimeout(timer);
                    },1500)
                    break;
                case bot.Friendship.Type.Confirm:
                    log.info("模拟器", `friend ship confirmed`);
                    break
                }
        }catch{}
    })
    .on("message", async (msg) => {     //消息处理
        if (msg.type() == Message.Type.Text) {
            if (msg.room()) {   //群聊
                const room = await msg.room()
                if (await msg.mentionSelf()) {  // 收到消息，提到自己
                    let self = await msg.to()
                    self = "@" + self.name()
                    // 获取消息内容
                    let sendText = msg.text().replace(self, "")
                    let res = await requestRobot(sendText)
                    // 返回消息，并@来自人
                    room.say(res, msg.from())
                    return
                }
            } else {
                if(msg.payload.fromId == 'weixin') return;
                // 回复信息是加群
                if (await isAddRoom(msg)) return
                // 加入群
                if (await isRoomName(bot, msg)) return
                // 聊天
                let res = await requestRobot(msg.text())
                await msg.say(res)
            }
        } else {
            if (!msg.room()){
                await msg.say("我才上一年级就不要发这么复杂的了...")
            }
        }
    })
    .on("error", (error) => {
        log.info("模拟器", `错误: ${error.toString()}`);
    });

module.exports = router;