const crypto = require("crypto");

class Md5 {
    MD5 (input) {
        return crypto.createHash('md5').update(input).digest("hex")
    }
}

module.exports = new Md5()