# real-time io with socket-io

* open localhost:3000
* type in msg
* use ^C to terminate program

## setting socket-io server

> lib://?path=Express
\
> web://Express
\
> run://web.static?folder=./socket-io-chat

setup a web-server to server with static page

> lib://?path=SocketIo.js
\
> socketio://SocketIo?server=!web.server

setup socket.io

> got-message://str_?template=got ${this.msg}. thank you.&_name=msg
\
> emit-to-chat-message://socketio.emit_?event=chat message

create a message emitter

> log-server-msg://log_?prefix=socket.io got message
\
> run://socketio.listen?event=chat message&_call=got-message,emit-to-chat-message,log-server-msg

set listener for "chat message" event

> run://web.listen?_then=log

start the server


## setting a socket-io client

> lib://?path=SocketIoClient.js
\
> socket://SocketIoClient.init_?url=http://localhost:3000

setup a socket to listen to server

> log-client-msg://log_?prefix=socket.io-client got message
\
> run://socket.listen?event=chat message&_call=log-client-msg

setup a listener

> send-msg://socket.emit_?event=chat message
\
> send-msg://?msg=socket.io-client message

sending a message
