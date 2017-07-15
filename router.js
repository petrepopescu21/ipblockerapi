var Router = require('koa-router')
var router = new Router()
var TableService = require('./storage')
var geo = require('./geo')
var ipentity = require('./ipentity')

//This will get ALL IPs in memory az.IPS
const az = new TableService()

router.get('/ipList',async (ctx)=>{
    ctx.body = await az.getIps()
})

router.get('/classList',async (ctx)=>{
    ctx.body = await az.getClasses()
})


router.get('/resetBlockList', (ctx)=>{
    az.resetCache()
    ctx.status = 202
    ctx.body = "Accepted"
})

router.get('/:ip',async (ctx,next)=>{

    if (ctx.headers.cc == "true")
    var countryCode = geo(ctx.params.ip)
    var ent = new ipentity(ctx.params.ip)
    var found = await az.getOne(ent)
    
    if (found.banned==false) {
        console.log(countryCode)
        if(countryCode)
            found.countryCode = await countryCode
        ctx.body = found
    }

    if (found.banned==true) {
        found.countryCode = "XX"
        ctx.body = found
    }
    
})

router.get('/:ip/:uid',(ctx)=>{
    var ent = new ipentity(ctx.params.ip,ctx.params.uid)
    az.addOne(ent)
    ctx.body = {"banned":true,"countryCode":"XX"}
})


module.exports = router;