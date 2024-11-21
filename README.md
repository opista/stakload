# trulaunch

An AIO games library manager.

## Features

- Integrate all of the popular games libraries
- Install/uninstall games directly from the app
- Launch games directly from the app
- Create custom filters
- Launch fullscreen mode for console-like experience

## Architecture

- Frontend - [React](https://react.dev/git)
  - State is managed using [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction), and is persisted using [electron-conf](https://github.com/alex8088/electron-conf)
- Backend - [Electron](https://www.electronjs.org/)
  - Local-first database with [Acebase](https://github.com/appy-one/acebase)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## TODO

- Frontend

  - Look at migrating over to Next.js? Routing will be easier, can offload tasks to backend
  - [BUG] Back to top doesn't always appear when scrolling (list and details)
  - [BUG] Clock freezes on mac (not really relevant as this is a windows only app)
  - Collapse entire sidebar? Look at fastmail UI for inspo. Header also moves with sidebar resize
  - Build out game filters
    - User should be able to save a collection of filters as a collection (like Steam)
    - User should be able to update and delete a filter
  - Break down GameDetails into components, maybe make into a view?
  - Look at dependency graph, anything we can kill?
  - Refactor any components that are:
    - Using prop styling, move it to CSS Modules
    - Too big and should be broken down
  - Ensure that all strings are stored in i18n and there is no static text
  - Is there anything we can do to optimise the build? The app needs to be as least resource-hungry as possible
  - Build "fullscreen" mode, a-la Steam Big Picture
    - Intro movie (later)
    - Should be easily navigable with a controller
    - Should expose custom saved collections
  - System storage usage screen(?)
    - Do we need this? It might be nice to know how much space you have used on your games and how much you have left

- Backend
  - Set up a logger
  - Create temporary "fake" API to fetch data from Steam and [igdb](https://api-docs.igdb.com/#game)
    - Move igdb to external service with caching later
  - Identify running processes
    - [tasklist](https://github.com/sindresorhus/tasklist/tree/main)?
    - [pid-cwd](https://github.com/zikaari/pid-cwd/blob/master/lib/win.js) to identify app dir (do we need this?)
