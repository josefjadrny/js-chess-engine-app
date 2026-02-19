# js-chess-engine-app

A single-page React app demo for the [js-chess-engine](https://github.com/josefjadrny/js-chess-engine) chess library.

[**Live Demo**](http://chess.josefjadrny.info)

## About

This app demonstrates how to build a chess UI on top of the `js-chess-engine` backend API. It connects to a running `js-chess-engine` API server and lets you play chess against the computer in your browser.

## Features

- Play chess against an AI opponent
- 5 difficulty levels: Beginner, Easy, Intermediate, Advanced, Expert
- Move confirmation toggle
- Sound effects (move and capture sounds)
- Move history display
- Checkmate and stalemate detection
- Castling and en passant support
- Game state persisted in localStorage (survives page refresh)
- Displays the running engine version

## Tech Stack

- React 18
- Communicates with a `js-chess-engine` REST API server

## Getting Started

### Prerequisites

- Node.js >= 24.0.0
- A running [js-chess-engine](https://github.com/josefjadrny/js-chess-engine) API server

### Environment Variables

Create a `.env` file in the project root:

```
REACT_APP_JS_CHESS_API=http://localhost:3001/   # URL of your js-chess-engine API server (trailing slash required)
REACT_APP_ANALYTICS_CODE=                        # Optional: Google Analytics tracking ID
```

### Install and Run

```bash
npm install
npm start
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

## API Endpoints Used

The app expects the following endpoints on the `js-chess-engine` server:

| Method | Path       | Description                        |
|--------|------------|------------------------------------|
| POST   | `/moves`   | Get all legal moves for the position |
| POST   | `/move`    | Make a move                        |
| POST   | `/ai-move` | Get the AI's best move             |
| GET    | `/version` | Get the engine version             |

## License

MIT
