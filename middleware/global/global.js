class Params {
    constructor(req, res, data){
        this.req = req;
        this.res = res;
        this.data = data;
    }
    // 获取参数
    getParams(){
        return { ...this.req.query, ...this.req.params, ...this.req.body };
    }
    // 参数验证
    validator(){
        return new Promise((resolve, reject)=>{
            let lackParams = [], params = this.getParams();
            for(let i=2;i<this.data.length;i++){
                if(params[this.data[i]] === undefined){
                    lackParams.push(this.data[i])
                }
            }
            if(lackParams.length){
                this.res.send(403, JSON.stringify({ status: "err", msg: `参数不全，缺少 ${lackParams.join("、")}` }));
            }else resolve(params);
        })
    }
}


global.$paramsValidator = function(req,res){
    return new Params(req, res, arguments).validator();
}