var router = require('koa-router')();
var fs = require('fs');
router.get('/', async function (ctx, next)
{

    console.log(ctx.params);
    var readFiles = async function ()
    {
        return new Promise(function (resolve, reject)
        {
            fs.readFile("./docs/" + ctx.params.name + "/" + ctx.params.chapter, 'utf-8', function (err, data)
            {
                if (err)
                {
                    console.log("error");
                } else
                {
                    resolve(data);
                }
            });

        });
    };

    ctx.body = JSON.stringify(await readFiles());
});

module.exports = router;
