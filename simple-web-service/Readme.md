# a simple web service


* run ```psql -U postgres -d postgres -f simple-web-service/index.sql```
* run ```node-flow -l lib -f simple-web-service/Readme.md```

> lib://?path=Postgresql
\
> pg://Postgresql?url=postgres://postgres:rei@localhost:5432/postgres
\
> pg-abc://pg.query_?sql=select dev.abc(jsonb_populate_record(null::dev.abc_t,$1::jsonb))&scalar=true

initiate pg and maps dev.abc stored-function to pg-abc

> log-calc-abc://log_?prefix=calc_abc notification
\
> run://pg.listen?channel=calc_abc&_call=pg-abc,log-calc-abc
\
> pg-calc-abc://pg.notify_?channel=calc_abc

publish-subscribe with pg


> log-got://log_?prefix=got
>
> lib://?path=Express
\
> web://Express
\
> var-pg-abc-default-values://var_?a=1&b=2&c=0
\
> run://web.get?path=/pg-abc&_call=log-got,var-pg-abc-default-values,pg-abc
\
> run://web.post?path=/pg-abc&_call=log-got,var-pg-abc-default-values,pg-abc
\
> run://web.get?path=/pg-calc-abc&_call=log-got,var-pg-abc-default-values,pg-calc-abc
\
> run://web.listen?port=3000

an express-based web-service, accepts get/post to /pg-abc to call pg-abc

> lib://?path=Fetch
\
> fetch-pg-abc-get://Fetch.get_?url=http://localhost:3000/pg-abc
\
> fetch-pg-abc-post-form://Fetch.post_?url=http://localhost:3000/pg-abc
\
> fetch-pg-abc-post-json://Fetch.post_?type=json&url=http://localhost:3000/pg-abc
\
> fetch-pg-calc-abc://Fetch.get_?url=http://localhost:3000/pg-calc-abc
\
> run://fetch-pg-abc-get,log?c=1
\
> run://fetch-pg-abc-post-form,log?c=2
\
> run://fetch-pg-abc-post-json,log?c=3
\
> run://fetch-pg-calc-abc?c=4

simulate a web-calls to service

> log-end://log_?prefix=END.
\
> run://timeout?ms=1000&_call=log-end,END

terminates program after 1s

