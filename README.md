# TV
## A Simple LAN Remote for LG TVs running WebOS

The file `control.js` is a NodeJS executable file which has the following
syntax:

```bash
./control.js <command> <options>
```

There is some configuration which the remote control needs. Specifically, it
requires the (local) IPv4 address of the TV and its MAC address. This file is
located at the path `~/.config/tv/tv.conf`. The format of this file is simple: 2
lines; the first one being the local IP address and the second line being the
MAC address. Example config file:

```txt
192.168.0.15
00:0a:95:9d:68:16
```

The remote control application currently provides the following commands. These
commands are the ones allowed in the above call syntax.

- `power`: The "power" command has the two options: `on` or `off`. The option
  `on` sends a Wake-on-LAN signal to the TV. This requires the MAC address of
  the TV (provided in the config file). The `off` signal makes a request to the
  TV to power off.
- `notify`: The "notify" command takes a message (string) and requests the TV
  API to display the given message as a Toast notification.
- `volume`: The "volume" command takes an integer (0 - 100) and requests the TV
  to change the audio volume to the specified value.

### Examples

- Change volume: `./control.js volume 20`
- Mute audio: `./control.js volume 0`
- Power off: `./control.js power off`
- Notify: `./control.js notify "hello world!"`
