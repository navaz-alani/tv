#!/usr/local/bin/node

const fs = require("fs");
const path = require('path')

const lgtv = require("lgtv2");
const wol = require("wakeonlan");

const ARGV_OF = 1;
const CONFIG_PATH = path.join(process.env.HOME, ".config/tv/tv.conf");

let config = {ip: "", mac: ""};

const tv = () => {
  if (process.argv.length < 2 + ARGV_OF) {
    console.error("usage: tv <one of: power,volume,notify> [option]");
    return;
  }
  const command = process.argv[1 + ARGV_OF];
  let callback;
  switch (command) {
    case "power": {
      const arg = process.argv[2 + ARGV_OF];
      if (arg == undefined) {
        console.error("expected one of 'on', 'off' for command 'power'");
        return;
      } else if (arg === "on") {
        callback = (_) => {
          wol(config.mac)
            .then(() => console.log("wake signal sent"))
            .catch(() => console.error("error waking tv up"));
        }
      } else if (arg === "off") {
        callback = (lgtv) => lgtv.request("ssap://system/turnOff");
      } else {
        console.error("expected one of 'on', 'off' for command'power'");
        return;
      }
      break;
    }
    case "volume": {
      const arg = process.argv[2 + ARGV_OF];
      if (arg == undefined || !/^\d+$/.test(arg)) {
        console.error("expected numeric option for commmand 'volume'")
      } else {
        callback = (lgtv) => {
          lgtv.request('ssap://audio/setVolume', {volume: parseInt(arg)}, (res) => {
            console.log(res);
          });
        }
      }
      break;
    }
    case "notify": {
      const arg = process.argv[2 + ARGV_OF];
      if (arg == undefined || arg.length == 0) {
        console.error("expected message for command 'notify'");
        return;
      } else {
        callback = (lgtv) => lgtv.request('ssap://system.notifications/createToast', {message: arg});
      }
      break;
    }
    default: {
      console.error("unrecogized command ", command);
      return;
    }
  }

  let lgtvConn = lgtv({url: `ws://${config.ip}`});
  lgtvConn.on("connect", () => {
    callback(lgtvConn);
    lgtvConn.disconnect();
  });
}

const main = () => {
  fs.readFile(CONFIG_PATH, "ascii", (err, data) => {
    if (err) return console.error(err);
    const lines = data.split('\n');
    if (lines.length != 3) { // 3 lines since file ends with newline
      return console.error(`
      config file invalid: expected 2 lines with following format;
      <tv local ipv4 address>
      <tv mac address>
      `);
    }
    config.ip = lines[0];
    config.mac = lines[1];

    tv();
  });
}

main();
