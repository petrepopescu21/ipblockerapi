var Router = require('koa-router')
var router = new Router()
var Controller = require('./controller')
var iputils = require('./iputils')
var ipentity = require('./classes/ipentity')
var classentity = require('./classes/classentity')

//This will get ALL IPs in memory az.IPS
const az = new Controller()

router.get('/ip', async(ctx) => {
    ctx.body = await az.getIps()
})

router.post('/ip', async(ctx) => {
    var ent = new ipentity(ctx.request.body.ip)
    az.resetCache()
    try {
        await az.getIps()
    } catch (err) {
        ctx.status = err.statusCode
        err.entity = ent
        ctx.body = err
        return
    }
    let verified = await az.verifyIP(ent)
    if (verified.banned == true)
        ent = new ipentity(ctx.request.body.ip, verified.data.PartitionKey)

    try {
        await az.addEntity(ent, "ips")
        ctx.status = 200
        ctx.body = ent.PartitionKey
    } catch (err) {
        ctx.status = err.statusCode
        err.entity = ent
        ctx.body = err
    }


})

router.delete('/ip', (ctx) => {
    //to be implemented
    var ent = new ipentity(ctx.request.body.ip, ctx.request.body.id)
    az.removeEntity(ent, "ips")
    ctx.status = 202
    ctx.body = ""
})

router.get('/ipclass', async(ctx) => {
    ctx.body = await az.getClasses() //to be implemented
})

router.post('/ipclass', async(ctx) => {
    var ent = new classentity(ctx.request.body.ip)
    try {
        await az.addEntity(ent, "classes") //to be implemented
        ctx.status = 202
        ctx.body = ""
    } catch (err) {
        ctx.status = err.statusCode
        err.entity = ent
        ctx.body = err
    }
})

router.delete('/ip', (ctx) => {
    var ent = new classentity(ctx.request.body.ip)
    az.removeEntity(ent, "classes")
    ctx.status = 202
    ctx.body = ""
})


router.delete('/cache', (ctx) => {
    az.resetCache()
    ctx.status = 202
    ctx.body = ""
})

router.get('/ip/:ip', async(ctx, next) => {

    if (ctx.headers.cc == "true")
        var countryCode = iputils.geo(ctx.params.ip)
    var ent = new ipentity(ctx.params.ip)
    //add check IP class
    var found = await az.verifyIP(ent)

    if (found.banned == false) {
        if (countryCode)
            found.countryCode = await countryCode
        ctx.body = found
    }

    if (found.banned == true) {
        found.countryCode = "XX"
        ctx.body = found
    }

})

router.get('/ip/:ip/:uid', (ctx) => {
    var ent = new ipentity(ctx.params.ip, ctx.params.uid)
    az.addOne(ent)
    ctx.body = {
        "banned": true,
        "countryCode": "XX"
    }
})


module.exports = router;