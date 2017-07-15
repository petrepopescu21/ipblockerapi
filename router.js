var Router = require('koa-router')
var router = new Router()
var Controller = require('./controller')
var geo = require('./geo')
var ipentity = require('./ipentity')

//This will get ALL IPs in memory az.IPS
const az = new Controller()

router.get('/ip',async (ctx)=>{
    ctx.body = await az.getIps()
})

router.post('/ip',async (ctx)=>{
    ctx.body = await az.addIp()
})

router.delete('/ip',(ctx)=>{
    az.removeIp(ctx.request.body)
    ctx.status = 202
    ctx.body = ""
})

router.get('/class ',async (ctx)=>{
    ctx.body = await az.getClasses()
})

router.post('/class',(ctx)=>{
    az.addClass(ctx.request.body)
    ctx.status = 202
    ctx.body = ""
})

router.delete('/class',(ctx)=>{
    az.removeClass(ctx.request.body)
    ctx.status = 202
    ctx.body = ""
})

router.delete('/cache', (ctx)=>{
    az.resetCache()
    ctx.status = 202
    ctx.body = ""
})

router.get('/ip/:ip',async (ctx,next)=>{

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

router.get('/ip/:ip/:uid',(ctx)=>{
    var ent = new ipentity(ctx.params.ip,ctx.params.uid)
    az.addOne(ent)
    ctx.body = {"banned":true,"countryCode":"XX"}
})


module.exports = router;