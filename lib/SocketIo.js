const SocketIo = require('socket.io')
class Server {
    constructor({server}) {
        this.io = new SocketIo(server)
    }

    listen({namespace='/', event}, callback) {
        let me = this
        me.io.of(namespace).on('connection', (socket) => {
            socket.on(event, async (payload, ack) => {
                let a = await callback(payload)
                if (ack) ack(a)
            })
        })
    }

    emit_({namespace='/', event}) {
        let me = this
        return async (payload) => {
            me.io.of(namespace).emit(event, payload)
        }
    }
}

if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = Server
}


// const SocketIoClient = require('socket.io-client')

// class Client {
//     constructor({socket}) {
//         this.socket = socket
//     }

//     emit_({eventName}) {
//         let me = this, s = me.socket

//         return async (payload, ack) => {
//             if (ack) {
//                 s.emit(eventName, payload, ack)
//             } else {
//                 s.send(eventName, payload)
//             }
//         }
//     }


//     async listen({eventName}, callback) {
//         this.socket.on(eventName, async (payload, cb) => {
//             let a = await callback(payload)
//             if (cb) cb(a)
//         })
//     }
// }


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