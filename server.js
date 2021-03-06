require('dotenv').config()


var axios = require('axios')
var Koa = require('koa')
var Router = require('koa-router')
const koaBody = require('koa-body');

const app = new Koa()
const router = require('./router')

app.use(koaBody({strict:false}))

//Check key
app.use(async (ctx,next)=>{
    if (ctx.req.headers.secret == process.env.SECRET)
        await next()
    else ctx.body = "Bye"
})

app.use(router.routes())
app.listen(process.env.PORT)