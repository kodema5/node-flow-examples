// a pool of objects
// https://github.com/coopernurse/node-pool
//
const genericPool = require('generic-pool')
class Pool {

    // factory needs .create, .destroy, [.validate]
    constructor({factory, min=0, max=1}) {
        this.pool = genericPool.createPool(factory, {
            min,
            max,
            testOnBorrow: factory.validate !== undefined,
            testOnReturn: factory.validate !== undefined
        })
    }

    async run(payload, callback) {
        let r = await this.pool.acquire()
        if (!r) {
            await this.pool.destroy(r)
            return
        }

        if (typeof r == 'function') {
            let v = await r(payload)
            await this.pool.release(r)
            return v
        }

        if (!callback) return

        let a = await callback(r)
        return a===false
            ? await this.pool.destroy(r)
            : await this.pool.release(r)
    }

    async end() {
        await this.pool.drain()
        await this.pool.clear()
    }

    static async init_({fn, min=0, max}) {
        fn = Array.isArray(fn) ? fn : [fn]
        max = max || fn.length

        let factory = new Factory(fn.map((o) => [o, false]))
        return new Pool({
            factory, min, max
        })
    }

}

class Factory extends Map {
    async create() {
        for (let [obj,used] of this) {
            if (used || !this.isValid(obj)) continue
            this.set(obj, true)
            return obj
        }
    }

    async destroy(obj) {
        this.delete(obj)
    }

    async validate(obj) {
        return this.has(obj) && this.isValid(obj)
    }

    isValid(obj) {
        let f = obj && obj.valid!==false
        if (!f && this.has(obj)) {
            this.delete(obj)
        }
        return f
    }
}


if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = Pool
}

// ; (async () => {
//     let url = ['a', 'b', 'c', 'd']
//     let pool = await Pool.init_({objects:url,max:url.length})

//     for(let i=0, n=10; i<n; i++) {
//         pool.run({}, async (r) => {
//             console.log('---@run', i, r)
//             return new Promise((done) => {
//                 setTimeout(() => {
//                     console.log('---@done', i, r)
//                     done(i)
//                 }, 100)
//             })
//         })
//     }
// })()
