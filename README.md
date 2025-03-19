# stakload

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
  - Local-first database with an async fork of [nedb](https://github.com/louischatriot/nedb) - [nedb-promises](https://github.com/bajankristof/nedb-promises/)

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

- Features

  - Search for game metadata. Some games don't return a result, we should offer the ability to manually map a game
  - Data backup/sync. Not sure how useful installation data will be, but the rest should be backed up
  - HLTB. Look at [hltb-for-deck](https://github.com/hulkrelax/hltb-for-deck/blob/main/src/hooks/useHltb.ts) for inspiration
  - Fullscreen "Gaming" mode. Controller-friendly UI
    - Intro movie
  - Manual addition of games. Need to consider manually setting installation directory and other important fields etc.
  - Logo
  - System storage usage screen. Not sure how necessary this is, but could be a nice to have
  - Add launcher icons to homescreen. Potentially should be managed independently of configured integrations?
  - Configurability of default view (ie. desktop vs. "gaming")
  - Introduce last played timestamp functionality - currently this is just pulling quick launch games
  - Build home view when there are no games

- Chores
  - Update grey styling across the board, should use CSS variables (with possibility of later theming)
  - Revisit game controls (launch/install/uninstall etc.)
  - Accessibility across entire app. Look at Mantine docs for accessibility info
  - If app crashes, window controls disappear (windows/linux). We should mitigate this
  - Fix bug with full window scrolling rather than just the main contents (behaviour seen on integrations page, but may happen everywhere)
  - Last sync timestamp
  - Look at dependency graph, anything we can kill?
  - Ensure that all strings are stored in i18n and there is no static text
  - Optimise app build
  - Migrate Epic games integration away from Legendary. Not sure this is necessary as we rely on the launcher for other libraries and it should be consistent
  - Filtering UI looks clunky, it needs to match the theme
  - "Save collection" modal needs to not look like crap
  - Break down GameDetailsView into components, maybe make into a view? Currently a mess
  - Refactor any components that are:
    - Using prop styling, move it to CSS Modules
    - Too big and should be broken down
  - Identify issue with BattleNetClientService not performing actions in launcher. Perhaps look at alternative methods
  - Update SystemService to work cross-platform
  - Update IncompatibilityIcon functionality so that it identifies platform support
  - Total refactor of integration settings view
  - Add option to re-sync/refresh metadata to context menu
  - Migrate sync notification (with updates) into notification panel
