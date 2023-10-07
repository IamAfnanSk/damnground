<div align="center">
  <h1>Damnground</h1>

  <p>An online code playground for fun.</p>
</div>

# Damnground

### The frontend codebase of the damnground project

This is the front-end part of the project which uses [damnbasher](https://github.com/IamAfnanSk/damnbasher) and [damnbackend](https://github.com/IamAfnanSk/damnbackend) and basically this is all the font end.

## Features

- A code editor on frontend
- A terminal on frontend
- Multiple resizable windows
- Multiple file support in monaco editor
- Code files are saved and restored when someone refreshes the page (uses backend database to persist user code)
- A working terminal

## Bonus features

- Textmate grammers support
- Real CLI connected to real server
- File manager
- Complete sync

## Tech

Damnbasher uses these tech to power itself:

- React - For frontend
- Xterm.js - For terminal
- Monaco editor - Text editor
- Typescript - For everything

## Installation

Install the dependencies and devDependencies and start the server.

```sh
cd damnground
npm i
node run start:dev
```

For production environments...

```sh
npm run build
```

## Author

# Afnan Shaikh
