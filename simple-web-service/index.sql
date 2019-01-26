-- helo there

drop schema if exists dev cascade;

create schema dev;

-- using type, it auto-cast them to appropriate data-type
--
drop type if exists dev.abc_t;
create type dev.abc_t as (
    a numeric,
    b numeric,
    c numeric,
    x numeric
);

create or replace function dev.abc(p dev.abc_t) returns jsonb as $$
declare
begin
    p.x = p.c + p.a + p.b;
    return to_jsonb(p);
end;
$$ language plpgsql;

-- select dev.search(jsonb_populate_record(null::dev.abc_t, '{"a":1,"b":2,"c":"3"}'::jsonb));