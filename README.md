
# About this project
This is a fullstack Wordle-inspired application where the user can start a game, guess a word, and receive feedback on each guess. When the game is completed, the result can be saved to a highscore list.

The project is built as a fullstack application with three main routes:

- a **game page**, where the user can configure and play the game
- a **server-rendered highscore page**, where results can be filtered via URL parameters *(e.g. ?length=5&unique=true)*
- a **static information page**, describing the project

The frontend is built with React, while the backend is built with Node.js/Express and runs on port 5080. The server handles important parts of the game logic, including word selection, feedback, and timing. This ensures that the client cannot manipulate the game logic, which removes the possibility of cheating.

### Tech Stack
- Frontend: React, TypeScript, Vite, SCSS
- Backend: Node.js, Express
- Database: MongoDB
- Testing: Playwright

*** 

# Running this project
Run the following commands from the root folder:
- `npm install` - Install all dependencies
- `npm start` - Start both frontend and backend
- `npm test` - Run integration tests

*** 

## **REST API**

### `GET /api/word`

Starts a new game

#### Query parameters
- `length` – number of letters  
- `unique` – whether duplicate letters are allowed  

#### Response
- `gameId`


### `POST /api/guess`

Submit a guess

#### Body
- `gameId`  
- `guess`  

#### Response
- `feedback`  
- `isCorrect`  
- `guessesCount`  
- `timeMs`  


### `POST /api/highscores`

Save a completed game to highscores

#### Body
- `gameId`  
- `name`  


### `GET /api/highscores`

Fetch highscores *(with optional filters)*

***

## Notes
- Server runs on `port 5080`
- Client runs on `port 5173` (dev)
- Tests use a controlled test mode

**Design may be further improved*

