const config = require("./wechaty.config");
let { name, room } = config;
/**
 * @description 回复信息是关键字 “加群” 处理函数
 * @param {Object} msg 消息对象
 * @return {Promise} true-是 false-不是
 */
 async function isAddRoom(msg) {
    let roomList = room.roomList;
    if (msg.text() == "加群") {
        let roomListName = Object.keys(roomList)
        let info = `${name}当前管理群聊有${roomListName.length}个，回复群聊名即可加入哦\n\n`
        roomListName.map(v => {
            info += v + "\n"
        })
        msg.say(info)
        return true
    }
    return false
}

/**
 * @description 回复信息是所管理的群聊名 处理函数
 * @param {Object} bot 实例对象
 * @param {Object} msg 消息对象
 * @return {Promise} true-是群聊 false-不是群聊
 */
async function isRoomName(bot, msg) {
    let roomList = room.roomList;
    if (Object.keys(roomList).some(v => v == msg.text())) {
        const room = await bot.Room.find({ id: roomList[msg.text()] })
        // 是否在房间中
        if (await room.has(msg.from())) {
            await msg.say("您已经在房间中了")
            return true
        }
        // 发送群邀请
        await room.add(msg.from())
        await msg.say(`已向您发送加入 ${msg.text()} 邀请`)
        const timer = setTimeout(async _ => {
            room.say(`欢迎${msg.from().payload.name}加入${msg.text()}~`)
            clearTimeout(timer);
        },1500)
        return true
    }
    return false
}


module.exports = { isRoomName, isAddRoom };