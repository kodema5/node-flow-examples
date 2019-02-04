# node-flow-examples

STATUS - EXPERIMENTAL

* install [node-flow](https://github.com/kodema5/node-flow)
* use ```docker-compose up/down``` to setup the services
* run ```npm install``` to download needed packages

# examples

to run, ```node-flow -l lib -f [filename.md]```

* [simple-web-service.md](simple-web-service.md)

    is a test bed for creating a simple express web-api,
    calls pg stored procedure,
    and using fetch to simulate http-calls.

* [socket-io.md](socket-io.md)

    shows use of socket.io server and client for a real-time communication

* [pooled-forks.md](pooled-forks.md)

    pools a set of forked node-modules to execute parallel calculations

* [ip-camera-snapshot.md](ip-camera-snapshot.md)

    a web url that retrieves snapshot from a foscam ip-camera
