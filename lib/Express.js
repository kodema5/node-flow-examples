const express = require('express')
const Path = require('path')

class Express {

    constructor() {
        this.app = express()
        this.server = require('http').Server(this.app)

        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended:true }))
    }


    index({file}) {
        this.app.get('/', (req, res) => res.sendFile(Path.resolve(file)))
    }

    static({path ='/', folder = '.'}) {
        this.app.use(path, express.static(Path.resolve(folder)))
    }

    all({path}, callback) {
        this.app.all(path, async (req, res) => {
            return await Express.process(req, res, callback)
        })
    }

    delete({path}, callback) {
        this.app.delete(path, async (req, res) => {
            return await Express.process(req, res, callback)
        })
    }

    get({path}, callback) {
        this.app.get(path, async (req, res) => {
            return await Express.process(req, res, callback)
        })
    }

    post({path}, callback) {
        this.app.post(path, async (req, res) => {
            return await Express.process(req, res, callback)
        })
    }

    put({path}, callback) {
        this.app.put(path, async (req, res) => {
            return await Express.process(req, res, callback)
        })
    }

    async listen({port=3000}) {
        let me = this
        return new Promise(done => {
            me.server.listen(port, () => done())
        })
    }

    end() {
        if (!this.server) return
        this.server.close()
    }

    static async process(req, res, callback) {
        let payload = Object.assign(req.params, req.query, req.body)
        let data = await callback(payload)
        if (typeof data!=='string') {
            res.json(data)
        } else {
            res.send(data)
        }
    }
}

if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = Express
}
