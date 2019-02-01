const { fork } = require('child_process')

class ChildProcess {

    // to split long computation routines
    //
    static fork_({file, args}) {
        args = Array.isArray(args) ? args : [args]
        const p = fork(file, args)
        return async (payload) => {
            return new Promise(done => {
                p.on('message', (r) => done(r))
                p.send(payload)
            })
        }
    }

}

if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = ChildProcess
}
