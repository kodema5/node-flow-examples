# multi-pg

spawns multiple postgres dockers

creates a docker manager
```
> lib://?name=Docker
> docker://Docker
```

spawns 5 instances of pg dockers, use %3d for =

since desired setup is likely have different than standard,
creating/building a custom image maybe more beneficial

```
> pg-launch://docker.start?image=postgres&env=POSTGRES_USERNAME%3Dpostgres&env=POSTGRES_PASSWORD%3Drei
> pg1://pg-launch!?name=pg1&port=5432:5432
> pg2://pg-launch!?name=pg2&port=5433:5432
> pg3://pg-launch!?name=pg3&port=5434:5432
> pg4://pg-launch!?name=pg4&port=5435:5432
> pg5://pg-launch!?name=pg5&port=5436:5432
> log://?a=start
```

access each postgresql after 10s to wait for initialization
if there is away to check? :-/

```
> lib://?path=ChildProcess
> get-pg-port://ChildProcess.exec_?cmd=psql -U postgres -d postgres -p %25PORT%25 -f ./multi-pg.sql&env.PGPASSWORD=rei&_then=log
> get-pg1-port://get-pg-port?env.PORT=5432
> get-pg2-port://get-pg-port?env.PORT=5433
> get-pg3-port://get-pg-port?env.PORT=5434
> get-pg4-port://get-pg-port?env.PORT=5435
> get-pg5-port://get-pg-port?env.PORT=5436
> log-b://log_?prefix=access

> timeout://?ms=10000&_call=log-b,get-pg1-port,get-pg2-port,get-pg3-port,get-pg4-port,get-pg5-port
```

end dockers after 11 seconds
```
> log-c://log_?prefix=cleaning
> end-dockers://ChildProcess.exec_?cmd=docker stop pg1 pg2 pg3 pg4 pg5&_then=log
> timeout://?ms=11000&_call=log-c,end-dockers,END
```