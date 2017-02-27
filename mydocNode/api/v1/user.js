var router = require('koa-router')();
var User = require('../../models/user.js');
var crypto = require('crypto');

/*1-1
var mongoose = require('mongoose');
var monSchema = new mongoose.Schema({
    email: { type: String, unique: false },
    password: String,
    phone: { type: String, unique: false },
});
var db = mongoose.connect('mongodb://localhost:27017/mydoc');
*/

router.post('/', async function (ctx, next)
{
    console.log(ctx.request.body);
    /*1-2
        db.connection.on("error", function (error)
        {
            console.log("数据库连接失败：" + error);
        });
    
        db.connection.on("open", function ()
        {
            console.log("数据库连接成功");
    
            var monModel = db.model('user', monSchema);
            var content = {
                email: ctx.request.body.email,
                phone: ctx.request.body.phone,
                password: ctx.request.body.password,
            };
            var monInsert = new monModel(content);
            monInsert.save(function (err)
            {
    
                if (err)
                {
                    console.log(err);
                } else
                {
                    console.log('写入数据成功');
                    db.connection.close();
                }
            });
        });
    
        db.connection.on('disconnected', function ()
        {
            console.log('数据库连接断开');
        });
        */

    /*2
        var db = mongoose.connect('mongodb://localhost/mydoc');
    
        db.connection.on("error", function (error)
        {
            console.log("数据库连接失败：" + error);
        });
    
        db.connection.on("open", function ()
        {
            console.log("数据库连接成功");
    
            var Schema = mongoose.Schema;
    
            //定义模式Student_Schema
            var Student_Schema = new Schema({
                name: String,
                id: Number,
                phone: String,
                date: Date
            }, {
                    versionKey: false
                });
    
            //定义模型Student，注意数据库存的是students
            mongoose.model("Student", Student_Schema);
    
            var MyStudent = mongoose.model("Student");
            var sam = new MyStudent({
                name: "sam976",
                id: 123,
                phone: "18706888888",
                date: Date.now()
            });
    
    
            sam.save(function (err) { });
        });
        */
        
    //生成密码的md5值
    var md5 = crypto.createHash('md5'),
        password = md5.update(ctx.request.body.password).digest('hex');
    var newUser = new User({
        password: password,
        email: ctx.request.body.email,
        phone: ctx.request.body.phone,
    });
    var reg = async function ()
    {
        return new Promise(function (resolve, reject)
        {
            //检查用户名是否已经存在
            User.get(newUser, function (err, user)
            {
                if (err)
                {
                    resolve({ "status": 10, "message": "系统故障" });
                }
                if (user)
                {
                    console.log("手机或邮箱账号已被注册");
                    resolve({ "status": 11, "message": "手机或邮箱账号已被注册" });
                } else
                {
                    console.log("新增用户");
                    //如果不存在则新增用户
                    newUser.save(function (err, user)
                    {
                        if (err)
                        {
                            resolve({ "status": 12, "message": "系统故障" });
                        }
                        resolve({ "status": 0, "message": "注册成功" });
                    });
                }
            });
        });
    }
    ctx.body = await reg()

});

router.get('/', async function (ctx, next)
{

    console.log(ctx.query);

    //生成密码的md5值
    var md5 = crypto.createHash('md5'),
        password = md5.update(ctx.query.password).digest('hex');
    var newUser = new User({
        password: password,
        email: ctx.query.email,
        phone: ctx.query.phone,
    });

    var login = async function ()
    {
        return new Promise(function (resolve, reject)
        {
            //检查用户名是否已经存在
            User.get(newUser, function (err, user)
            {
                if (err)
                {
                    resolve({ "status": 16, "message": "系统故障" });
                }
                if (!user)
                {
                    console.log("没有该用户");
                    resolve({ "status": 17, "message": "没有该用户" });
                } else
                {
                    var successObj = { "status": 0, "message": "登录成功" }
                    successObj.user=user;
                    resolve(successObj)
                }
            });
        });
    }
    ctx.body = await login()

});
module.exports = router;
