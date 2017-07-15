const uuid = require('uuid/v4')

module.exports = class IpEntity {
    constructor(ip) {
        let arr = ip.split('/')
        this.RowKey = arr[0]
        this.Subnet = arr[1]
        this.PartitionKey = "classes"
    }
}