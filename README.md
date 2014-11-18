vsbnat
======

A tool used to visit a server behind NAT

how to use it
====

In a machine with public ip, run

```
node relayServer.js
```

it will listen requests on its 8080 port.

In a machine behind NAT, run

```
node client.js
```

It will connect relayServer with a long connection. Then all the requests to public machine will be tranfered to the server behind NAT. IP and port of the server behind NAT can be configured in client.js.
