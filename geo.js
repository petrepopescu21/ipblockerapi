var axios = require('axios')

module.exports = async function(ip) {
    var url = 'http://freegeoip.net/json/'+ip
    //console.log(url)
    var res = await axios.get(url)
    return res.data['country_code']
}