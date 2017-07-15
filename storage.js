var azure = require('azure-storage')

module.exports = class TableService {

    constructor() {
        this.tableSvc = azure.createTableService()
        this.IPS = this.getListAsync()
        this.CLS = this.getClassesAsync()
    }

    resetCache() {
        this.IPS = null
        this.CLS = null
        return true
    }

    getIps() {
        if (this.IPS) {
            return this.IPS
        } else {
            return this.IPS = this.getListAsync()
        }
    }

    getClasses() {
        if (this.CLS) {
            return this.CLS
        } else {
            return this.CLS = this.getClassesAsync()
        }
    }

    async getOne(ent) {
        let list = await this.getIps()
        var found = await new Promise((resolve, reject) => {
            for (let i = 0; i <= list.length; i++) {
                if (ent.RowKey == list[i].RowKey) {
                    resolve(list[i])
                    break;
                } else if (i = list.length - 1) {
                    resolve(false)
                }
            }
        })
        //console.log(found)
        if (typeof found == "object") {
            console.log(found)

            return {
                "banned": true,
                "data": found
            }
        } else {
            return {
                "banned": false
            }
        }


    }

    addOne(ent) {
        this.tableSvc.insertEntity('ips', ent, (error, result, response) => {
            this.resetCache()
        })
    }

    async getListAsync() {
        return await new Promise((resolve, reject) => {
            this.tableSvc.queryEntities('ips', new azure.TableQuery(), null, (error, result, response) => {
                if (!error) {
                    resolve(response.body.value)
                } else reject(error)
            })
        })
    }

    async getClassesAsync() {
        return await new Promise((resolve, reject) => {
            this.tableSvc.queryEntities('classes', new azure.TableQuery(), null, (error, result, response) => {
                if (!error) {
                    var data =  []
                    for (var i = 0; i< response.body.value.length; i++) {
                        data.push(response.body.value[i].RowKey+"/"+response.body.value[i].Subnet)
                        if (i==response.body.value.length - 1)
                        resolve(data)
                    }
                } else reject(error)
            })
        })
    }
}