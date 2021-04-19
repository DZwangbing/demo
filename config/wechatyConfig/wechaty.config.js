module.exports = {
    token: "puppet_padlocal_ff2a6580148d4361bc0401889298a653",
    name: "小罗罗",
    room: {
        _roomList: {
            粉丝群: "21009093922@chatroom"
        },
        set roomList(roomList){
            this._roomList = roomList;
        },
        get roomList(){
            return this._roomList;
        }
    }
}