// https://github.com/lightswitch05/foscam-client
const Foscam = require('foscam-client')

class Camera {

    constructor({host, port=88, user='', pass=''}) {
        this.camera = new Foscam({
            host, port, username:user, password:pass
        })
    }

    async snapshot() {
        return await this.camera.snapPicture2()
    }
}

if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = Camera
}

