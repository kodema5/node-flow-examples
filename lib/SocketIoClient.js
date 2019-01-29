

const SocketIoClient = require('socket.io-client')

class Socket {

    constructor({socket}) {
        this.socket = socket
    }

    emit_({event}) {
        let me = this, s = me.socket
        return async (payload, ack) => {
            if (ack) {
                s.emit(event, payload, ack)
            } else {
                s.emit(event, payload)
            }
        }
    }


    async listen({event}, callback) {
        this.socket.on(event, async (payload, cb) => {
            let a = await callback(payload)
            if (cb) cb(a)
        })
    }

    static async init_({url, path}) {
        return new Promise(done => {
            let socket = SocketIoClient.connect(url, { path:path, reconnect:true })
            socket.on('connect', function() {
                done(new Socket({socket}))
            })
        })
    }
}

if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = Socket
}


// SocketIO = {

//     constructor() {
//         console.log('----here')
//     }

//     static a() { return 123 }

//     static async io_client({url, path}) {
//         return new Promise(done => {
//             let socket = SocketIoClient.connect(url, { path:path, reconnect:true })
//             socket.on('connect', function() {
//                 done(new Client({socket}))
//             })
//         })
//     }

//     static server_({server}) {
//         console.log('---here')
//         return new Server({server})
//     }
// }



// // this.io = require('socket.io')(this.server)

// ;(async () => {
//     let c = await SocketIO.client({url:'http://localhost:3000'})


//     c.listen({eventName:'chat message'}, (msg) => {
//         console.log('----got-message', msg)
//     })

//     let f = c.emit_({eventName:'chat message'})
//     setTimeout(function() {
//          f("this is from client----")
//     }, 1000)
// })();