const { fork, exec } = require('child_process')
const Path = require('path')

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

    // use \\$ to escape
    //
    static exec_({cmd, env={}, cwd=null, type='text'}) {
        let env_ = env
        let cwd_ = cwd
        return async ({env={}, cwd=null}={}) => {

            let opt = {
                env: Object.assign(env_, env),
                cwd: Path.resolve(cwd || cwd_ || '.')
            }
            return new Promise(done => {

                exec(cmd, opt, (error, stdout, stderr) => {
                    let a
                    switch(type) {
                    case 'text':
                        a = stdout.trim()
                        break
                    default:
                        a = {error, stdout, stderr}
                        break
                    }

                    done(a)
                })
            })
        }
    }


}

if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = ChildProcess
}
