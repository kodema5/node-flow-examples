// https://github.com/apocas/dockerode
// https://docs.docker.com/engine/api/v1.39/#operation/ContainerCreate

const Dockerode = require('dockerode')
const Stream = require('stream')
const Readline = require('readline')
const Path = require('path')


// for most, is to spawn docker, most of time,

class Docker {
    constructor(params) {
        params = params || { socketPath: Docker.socketPath() }
        this.docker = new Dockerode(params || {})
    }

    async list({}, callback) {
        let cs = await this.docker.listContainers({all:true})
        cs.forEach((c) => console.log(c))
    }

    // start/run
    async start({
        image="ubuntu",
        name,
        cmd,            // 'bash'
        env=[],         // 'POSTGRES_PASSWORD=rei'
        tty=false,
        port,           // '5432:5432' host:docker
        volume,         // '.:/work'
        cwd ="",        // 'working directory
        removeOld=false,
        log=false
    }) {
        let me = this

        if (name) {
            let c = await me.get(name)
            if (c) {
                if (!removeOld) return c
                await c.stop()
            }
        }

        let cfg = {
            name,
            Image:image,
            Env:env,
            WorkingDir: cwd,
            HostConfig: {AutoRemove:true},
            Tty:tty,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            OpenStdin: true,
            StdinOnce: false
        }

        if (cmd) {
            cfg.Cmd = Array.isArray(cmd) ? cmd : [cmd]
        }

        let hCfg = { AutoRemove: true }

        if (port) {
            port = port.split(':')
            cfg.ExposedPorts = { [port[1] + '/tcp']: {} }
            hCfg.PortBindings = { [port[1] + '/tcp']: [{ HostPort: port[0]}] }
            hCfg.PublishAllPorts = true
        }

        if (volume) {
            volume = volume.split(':')
            cfg.Volumes = { [volume[1]]: {} }
            hCfg.Binds =[ Path.resolve(volume[0]) + ':' + volume[1]]
        }

        cfg.HostConfig = hCfg

        let c = await this.docker.createContainer(cfg)
        await c.start()

        if (log) {
            let s = await c.attach({stream:true, stdout:true, stderr:true, stdin:true })
            s.pipe(process.stdout)
        }

        return c
    }

    async exec({name, Cmd=[], Env=[]}) {
        let c = await this.get(name)
        if (!c) return
        await c.exec({Cmd, Env})
    }


    async post({name, payload}) {
        let c = await this.get(name)
        if (!c) return

        return new Promise(async done => {
            let s = await c.attach({stream:true, stdout:true, stderr:true, stdin:true })
            let io = new Stream.PassThrough()
            let rl = Readline.createInterface({input:io})
            s.pipe(io)
            rl.on('line', (line) => done(line))
            s.write(payload + '\n')
        })
    }

    async post_({name}) {
        let me = this
        return async (payload) => me.post({name, payload})
    }

    async stop({name}) {
        let me = this
        if (name=='*') {
            let cs = await me.docker.listContainers()
            cs.forEach(async (c) => {
                let a = me.docker.getContainer(c.Id)
                if (!a) return
                await a.stop()
                await a.remove()
            })
            return
        }

        let c = await this.get(name)
        if (!c) return
        await c.stop()
        await c.remove()
    }

    // removes exited container
    async prune() {
        let me = this
        let cs = await me.docker.listContainers({all:true})

        let names = []
        cs.filter((c) => c.State == 'exited').forEach(async (c) => {
            names = names.concat(c.Names)
            me.docker.getContainer(c.Id).remove()
        })
        return names
    }

    async get(name) {
        let me = this
        name = '/' + name
        let all = await me.docker.listContainers({filters:{name:[name]}})

        let cs = all.filter((c) => c.Names.join()===name)
        if (cs.length!==1) return
        let c = await me.docker.getContainer(cs[0].Id)
        return c
    }

    static socketPath() {
        return process.platform == 'win32'
            ? '//./pipe/docker_engine'
            : '/var/run/docker.sock'
    }
}

if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = Docker
}



// ;(async () => {
//     var d = new Docker({ socketPath:  '//./pipe/docker_engine' })
//     await d.stop({name:'test-bash'})
//     await d.start({name:'test-bash', cmd:'bash', Tty:false})
//     let fn = await d.post_({name:'test-bash'})
//     console.log('---', await fn('echo "{a:123}"'))
//     console.log('---', await fn('echo "abc"'))
//     console.log('---', await fn('exit'))
// })()


// ;(async () => {
//     var d = new Docker({ socketPath:  '//./pipe/docker_engine' })
//     await d.start({
//         image:'postgres',
//         name: 'pg1',
//         tty: true,
//         log: true,
//         env:[
//             'POSTGRES_USERNAME=postgres',
//             'POSTGRES_PASSWORD=rei'
//         ],
//         port:'5432:5432'
//     })
// })(0)


// ;(async () => {
//     var d = new Docker()
//     await d.start({
//         image:'pgsql-dev',
//         name: 'pg1',
//         tty: true,
//         log: true,
//         volume: '.:/work',
//         port:'5432:5432',
//         removeOld: true
//     })
// })(0)