# pooled forks


to separate extensive computations in node-js file from main event-loop.

## fork

fork a node-module. it communicates with process.on('message',..) and process.send

```
> lib://?name=Fork
> fn1://Fork.fork_?file=pooled-forks.js&args=100
> fn2://Fork.fork_?file=pooled-forks.js&args=200
> fn3://Fork.fork_?file=pooled-forks.js&args=300
```
3 fork functions are created that can be called as usual

```
> run://fn1,log?n=100
{ n: 100, id: 100, data: 4950 }
```

## pooled forks

to put the functions in a pool,
that will queue and selects available function to call

```
> lib://?name=Pool
> pool://Pool.init_?fn=!fn1&fn=!fn2&fn=!fn3
```

supposed a parallel run, as below

```
> pool-run-1://pool.run?n=1000&_then=log
> pool-run-2://pool.run?n=2000&_then=log
> pool-run-3://pool.run?n=3000&_then=log
> pool-run-4://pool.run?n=4000&_then=log
> pool-run-5://pool.run?n=5000&_then=log

> par://?names=pool-run-1,pool-run-2,pool-run-3,pool-run-4,pool-run-5&_then=END
{ n: 1000, id: 100, data: 499500 }
{ n: 2000, id: 200, data: 1999000 }
{ n: 4000, id: 100, data: 7998000 }
{ n: 3000, id: 300, data: 4498500 }
{ n: 5000, id: 200, data: 12497500 }
```
