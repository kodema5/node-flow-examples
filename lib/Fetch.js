// > lib://?path=Fetch.js
//
const fetch = require('node-fetch')

class Fetch {


    // > run://Fetch/get?url=http://github.com/kodema5&output=text&_then=log
    //
    static async get({ url, output='json', payload }) {
        let u = new URL(url)
        for (let k in payload) {
            u.searchParams.set(k, payload[k])
        }
        let r = await fetch(u.href)
        return await Fetch._output(r, output)
    }

    static async get_({ url, output='json' }) {

        return async payload => await Fetch.get({
            url, output, payload
        })
    }

    // run://Fetch/post?url=http://github.com/kodema5&output=text&_then=log
    //
    static async post({ url, output='json', type='form', payload }) {
        let u = new URL(url)

        let o = { method: 'post' }
        if (type=='json') {
            Object.assign(o, {
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            })
        }
        // form
        else {
            let p = new URLSearchParams()
            for (let k in payload) {
                p.append(k, payload[k])
            }
            Object.assign(o, {
                body: p.toString(),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
        }

        let r = await fetch(u.href, o)
        return await Fetch._output(r, output)
    }

    static async post_({ url, output='json', type='form' }) {
        return async payload => await Fetch.post({
            url, output, type, payload
        })
    }


    // an internal to format output
    //
    static async _output(res, output='json') {
        return await res[output]()
    }
}

if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = Fetch
}