# upring-control

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coveralls-badge]][coveralls-url]

Control panel for [UpRing][upring].

![screenshot][screenshot-url]

## Install

```
npm i upring-control pino -g
```

## Usage

```sh
upring-control 192.168.1.185:7979 # adjust to an ip of one of your hosts
```

**upring-control** can also act as a base swim node if needed.

### Full help

```
Usage: upring-control [OPTS] [BASE]

Options:
  -t/--timeout MILLIS     milliseconds to wait to join the ring, default 200
  -p/--port PORT          the port on which the control panel will be exposes, default 8008
  -P/--points             the number of points for each peer, default 100
  -v/--verbose            enable debug logs
  -V/--version            print the version number
  -h/--help               shows this help
```


## Acknowledgements

This project is kindly sponsored by [nearForm](http://nearform.com).

## License

MIT

[upring]: https://github.com/mcollina/upring
[logo-url]: https://raw.githubusercontent.com/mcollina/upring/master/upring.png
[screenshot-url]: https://raw.githubusercontent.com/mcollina/upring-control/master/control.png
[npm-badge]: https://badge.fury.io/js/upring.svg
[npm-url]: https://badge.fury.io/js/upring
[travis-badge]: https://api.travis-ci.org/mcollina/upring.svg
[travis-url]: https://travis-ci.org/mcollina/upring
