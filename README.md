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
  - Local-first database, [Dexie](https://dexie.org/)
- Backend - [Neutralinojs](https://neutralino.js.org/)

## Development

```bash
yarn
yarn dev
```

## TODO

- Frontend

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
  - Ensure that Neutralino lib is only being called from the `./backend` so that we can swap to a different backend solution if need-be
  - Ensure that all strings are stored in i18n and there is no static text
  - Is there anything we can do to optimise the build? The app needs to be as least resource-hungry as possible
  - Build "fullscreen" mode, a-la Steam Big Picture
    - Intro movie (later)
    - Should be easily navigable with a controller
    - Should expose custom saved collections
  - System storage usage screen(?)
    - Do we need this? It might be nice to know how much space you have used on your games and how much you have left

- Backend
  - Create temporary "fake" API to fetch data from Steam and [igdb](https://api-docs.igdb.com/#game)
    - Move igdb to external service with caching later
  - Identify running processes
    - [tasklist](https://github.com/sindresorhus/tasklist/tree/main)?
    - [pid-cwd](https://github.com/zikaari/pid-cwd/blob/master/lib/win.js) to identify app dir (do we need this?)
