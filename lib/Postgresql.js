const { Pool } = require('pg')

const path = require('path')
process.env.PGPASSFILE = process.env.PGPASSFILE
    || path.join(process.cwd(), '.pgpass')


class Pg {

    constructor({ url, max = 10 }) {
        // url: postgres://dev@localhost:5432/dev
        //
        this.pool = new Pool({
            connectionString: url,
            max
        })
        this.listeners = []
    }

    async query({sql, scalar=false}) {
        let rs = await this.pool.query({ text: sql })
        return scalar ? Pg.getScalar(rs) : rs.rows
    }

    // works only for $1=jsonb
    async query_({sql, scalar=false}) {
        return async (payload) => {
            let q = {
                text: sql,
                ...(sql.indexOf('$1')>=0 && { values:[JSON.stringify(payload)] })
            }

            let rs = await this.pool.query(q)
            return scalar ? Pg.getScalar(rs) : rs.rows
        }
    }

    async listen({channel}, callback) {
        let c = await this.pool.connect()
        c.on('notification', (a) => {
            a = a || {}
            try {
                callback(JSON.parse(a.payload))
            } catch(x) {
                callback(a.payload)
            }
        })
        c.query(`LISTEN ${channel}`)
        this.listeners.push(c)
    }

    async notify({channel, payload}) {
        await this.pool
            .query(`NOTIFY ${channel}, '${JSON.stringify(payload)}'`)
    }

    async notify_({channel}) {
        let me = this
        return async (payload) => me.notify({ channel, payload})
    }

    async end() {
        this.listeners.forEach(async (c) => await c.end())
        await this.pool.end()
    }

    static getScalar(rs) {
        return rs.fields[0] && rs.rows[0]
            ? rs.rows[0][rs.fields[0].name]
            : rs.rows
    }
}

if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = Pg
}