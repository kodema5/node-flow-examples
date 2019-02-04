# ip-camera-snapshot

returns a snapshot from a foscam camera

```
> lib://?path=Foscam
> cam://Foscam?host=10.72.23.119&user=ataru&pass=kyoro-kyoro
```
setup the foscam


```
> lib://?path=Express
> web://Express
> run://web.get?path=/snapshot&type=jpeg&_call=cam.snapshot
> run://web.listen?port=3000
```
sets up the web-interface for the snapshot