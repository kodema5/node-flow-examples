let id = parseInt(process.argv[2])
console.log('--', id)

function long({n}) {
    let s = 0
    for (let i=0; i<(n); i++)
        s = s + i
    return s
}

process.on('message', ({n}) => {
    let data = long({n})
    setTimeout(() => {
        process.send({n, id, data})
    }, id)

})