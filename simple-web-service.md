# a simple web service



sets-up an expressjs based web-end point and publish-subscribe for a postgresql stored procedure

## setup

* ```docker-compose up```
* ```psql -U postgres -d postgres -f simple-web-service.sql``` (pwd:rei)
* ```node-flow -l lib -f simple-web-service.md```

## setting-up pg

```
> lib://?path=Postgresql
> pg://Postgresql?url=postgres://postgres:rei@localhost:5432/postgres
> pg-abc://pg.query_?sql=select dev.abc(jsonb_populate_record(null::dev.abc_t,$1::jsonb))&scalar=true
```
initiate pg and maps dev.abc stored-function to pg-abc.
a pg query returns an array of object, scalar=true returns the first row and key.

## adding /pg-abc GET/POST flow

```
> lib://?path=Express
> web://Express
> var-pg-abc-default-values://var_?a=1&b=2&c=0
```

setups the default values

```
> run://web.get?path=/pg-abc&_call=var-pg-abc-default-values,pg-abc
> run://web.post?path=/pg-abc&_call=var-pg-abc-default-values,pg-abc
```
sets-up /pg-abc GET/POST end-points that returns the pg-abc value

## /pg-async-abc end point

pg has listen-notify with a listener client (potentially in different server)

```
> log-ok://log_?prefix=ok
> log-bad://log_?prefix=bad
> equ-x-7://equ_?x=7&_true=log-ok&_false=log-bad

> run://pg.listen?channel=async_abc&_call=pg-abc,equ-x-7
```

sets-up a listener to a channel, that calls pg-abc,
then console.log (or something-else in future).

```
> pg-async-abc://pg.notify_?channel=async_abc
```

pg-calc-abc sends the notifications to a listener

```
> run://web.get?path=/pg-async-abc&_call=var-pg-abc-default-values,pg-async-abc
```

sets-up /pg-calc-abc end-point

## starting-up the web-server

```
> run://web.listen?port=3000
```

## testing with fetch

```
> lib://?path=Fetch
> fetch-pg-abc-get://Fetch.get_?url=http://localhost:3000/pg-abc
> fetch-pg-abc-post-form://Fetch.post_?url=http://localhost:3000/pg-abc
> fetch-pg-abc-post-json://Fetch.post_?type=json&url=http://localhost:3000/pg-abc
> fetch-pg-async-abc://Fetch.get_?url=http://localhost:3000/pg-async-abc

> equ-x-4://equ_?x=4&_true=log-ok&_false=log-bad
> equ-x-5://equ_?x=5&_true=log-ok&_false=log-bad
> equ-x-6://equ_?x=6&_true=log-ok&_false=log-bad

> run://fetch-pg-abc-get,equ-x-4?c=1
> run://fetch-pg-abc-post-form,equ-x-5?c=2
> run://fetch-pg-abc-post-json,equ-x-6?c=3
> run://fetch-pg-async-abc?c=4
```

simulate a web-calls to service

## ending after 1s
```
> log-end://log_?prefix=END.
> run://timeout?ms=1000&_call=log-end,END
```

