const uuid = require('uuid/v4')

module.exports = class IpEntity {
    constructor(ip, id) {
        this.RowKey = ip
        this.PartitionKey = id || uuid()
    }
}