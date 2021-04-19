var mysql = require("mysql")
var pool = mysql.createPool({
    host: "",
    port:"",
    user: "",
    password: "",
    database: ""
});

function query(sql,callback){
    pool.getConnection((err,connection)=>{
        if(err){
            console.log('连接失败'+err)
            return;
        }else{
            pool.query(sql, function (err,rows) {
                callback(rows,err)
                connection.release();
            })
        }
    });
}

exports.query = query