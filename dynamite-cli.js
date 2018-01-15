/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const fs = __webpack_require__(1);
const play = __webpack_require__(2);

// Check if the arguments are numbers for games, dynamite, and score to win
if ((process.argv[4] && isNaN(process.argv[4])) || (process.argv[5] && isNaN(process.argv[5])) || (process.argv[6] && isNaN(process.argv[6])) || process.argv.length < 4) {
    console.log('Specify 2 arguments with the file path to the bots:');
    console.log('\n\tnode dynamite-cli.js myBot1.js myBot2.js\n');
    console.log('You may also optionally specify the number of matches, score to win, and number of dynamite (in that order)');
    console.log('\n\tnode dynamite-cli.js myBot1.js myBot2.js 10 1000 100\n');
    process.exit(1);
}

const args = {
    botPath1: process.argv[2],
    botPath2: process.argv[3],
    games: process.argv[4],
    scoreToWin: process.argv[5],
    dynamite: process.argv[6]
};

let games = args.games ? process.argv[4]: 1;
let scoreToWin = args.scoreToWin ? process.argv[5] : 1000;
let dynamite = args.dynamite ? process.argv[6] : 100;

// Options for the game
const options = {scoreToWin: scoreToWin, roundLimit: null, dynamite: dynamite, games: games};
options.roundLimit = options.scoreToWin*2.5;

// Load a bot using eval
function loadBot(path) {
    const botContent = fs.readFileSync(path, 'utf-8');
    const module = {};
    eval(botContent);
    return module.exports;
}


const bot1 = loadBot(args.botPath1);
const bot2 = loadBot(args.botPath2);

// Dummy runner client that directly references the loaded bots using IDs 1 and 2
class CliRunnerClient {
    createInstance(botId) {
        return Promise.resolve(botId);
    }

    makeMove(instanceId, gamestate) {
        switch(instanceId) {
            case 1: return Promise.resolve(bot1.makeMove(gamestate));
            case 2: return Promise.resolve(bot2.makeMove(gamestate));
            default: return Promise.reject('No such bot');
        }
    }

    deleteInstance(instanceId) {
        return Promise.resolve();
    }
}

const cliRunnerClient = new CliRunnerClient();

function playGames(gamesRemaining){
    if (gamesRemaining > 0){
        play(1, 2, cliRunnerClient, options)
            .then(output => {
                console.log('Game ' + (options.games-gamesRemaining+1) + ' Results:');
                console.log('Winner: p'+output.winner);
                console.log('Score: '+JSON.stringify(output.score));
                console.log('Reason: '+output.reason);
                playGames(gamesRemaining-1);
            })
            .catch((err) => console.error('UNEXPECTED ERROR:',err));
    }
}

playGames(options.games);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(3);

function play (botId1, botId2, runnerClient, gameOptions, tournamentInstanceId) {

    const bot1 = runnerClient.createInstance(botId1);
    const bot2 = runnerClient.createInstance(botId2);
    // Delete bots if the other fails to instantiate
    bot1.then(botId1 => bot2.catch(() => runnerClient.deleteInstance(botId1)));
    bot2.then(botId2 => bot1.catch(() => runnerClient.deleteInstance(botId2)));

    return Promise.all([bot1, bot2])
        .then(instanceIds => new Game(instanceIds, runnerClient, gameOptions ))
        .then(game => game.play()
            .then(output => {
                game.deleteBots();
                const winnerId = output.score[1] > output.score[2] ? botId1 : botId2;
                const result = {
                    winner: output.winner,
                    score: output.score,
                    winnerId: winnerId,
                    reason: output.reason,
                    gamestate: output.gamestate,
                    botIds: {
                        1: botId1,
                        2: botId2
                    },
                    tournamentInstanceId: tournamentInstanceId
                };
                if (output.err && output.err.reason) {
                    result.errorBotId = output.err.errorPlayer === 1 ? botId1 : botId2;
                    result.winnerId = output.err.errorPlayer === 1 ? botId2 : botId1; //Overwrite winner if one bot errors
                    result.errorReason = output.err.reason;
                }
                return result;
            }));
}

module.exports = play;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// N.B. Avoid importing modules here where possible,
// these will be included in the bundled dynamite-cli.js
const {BotError} = __webpack_require__(4);

class Game {

    constructor (botIds, runnerClient, options) {
        this.botIds = {1: botIds[0], 2: botIds[1]};
        this.score = {1: 0, 2: 0};
        this.dynamite = {1: options.dynamite, 2: options.dynamite};
        this.gamestate = {1:{rounds:[]}, 2:{rounds:[]}};

        this.scoreToWin = options.scoreToWin;
        this.roundLimit = options.roundLimit;
        this.runnerClient = runnerClient;
        this.nextRoundPoints = 1;
    }

    updateDynamite(moves) {
        for (let i = 1; i <= 2; i++) {
            if (moves[i] === 'D') {
                this.dynamite[i] -= 1;
            }
            if (this.dynamite[i] < 0) {
                throw new BotError(i, 'dynamite');
            }
        }
    }

    updateGamestate(moves) {
        this.gamestate[1].rounds.push({p1: moves[1], p2: moves[2]});
        this.gamestate[2].rounds.push({p1: moves[2], p2: moves[1]});
    }

    updateScore(moves) {
        if (moves[1] === moves[2]) {
            this.nextRoundPoints += 1;
            return;
        }
        if (
            (moves[1] === 'D' && moves[2] !== 'W') ||
            (moves[1] === 'W' && moves[2] === 'D') ||
            (moves[1] === 'R' && moves[2] === 'S') ||
            (moves[1] === 'S' && moves[2] === 'P') ||
            (moves[1] === 'P' && moves[2] === 'R') ||
            (moves[1] !== 'D' && moves[2] === 'W')
        ) {
            this.score[1] += this.nextRoundPoints;
        } else {
            this.score[2] += this.nextRoundPoints;
        }
        this.nextRoundPoints = 1;

    }

    getOutput(reason, err) {
        const output = {
            botIds: this.botIds,
            winner: Object.keys(this.score).find(key => this.score[key] === Math.max(this.score[1], this.score[1])),
            reason: reason,
            score: this.score,
            gamestate: this.gamestate[1]
        };
        if (err) {
            output.err = err;
        }
        return output;
    }

    play () {
        if (this.scoreToWin <= Math.max(this.score[1], this.score[2])) {
            return this.getOutput('score');
        }
        if (this.gamestate[1].rounds.length >= this.roundLimit) {
            return this.getOutput('round limit');
        }
        return Promise.all([
            this.runnerClient.makeMove(this.botIds[1], this.gamestate[1])
                .catch(err => this.handleBotError(err.response.body, 1)),
            this.runnerClient.makeMove(this.botIds[2], this.gamestate[2])
                .catch(err => this.handleBotError(err.response.body, 2)),
        ])
            .then(res => {
                const moves = {1: res[0], 2: res[1]};
                this.updateGamestate(moves);
                this.updateDynamite(moves);
                this.updateScore(moves);
            })
            .then(() => this.play())
            .catch(err => this.getOutput('error', err));
    }

    handleBotError(err, playerNum) {
        if (err.errName && err.errName === 'InvalidMoveError') {
            throw new BotError(playerNum, 'invalidMove');
        } else {
            throw new BotError(playerNum, 'error');
        }
    }

    deleteBots() {
        return Promise.all([
            this.runnerClient.deleteInstance(this.botIds[1]),
            this.runnerClient.deleteInstance(this.botIds[2])
        ]);
    }

}

module.exports = Game;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

class BotError extends Error {
    constructor(errorPlayer, reason) {
        super(reason);
        this.status = 400;
        Error.captureStackTrace(this);
        this.name = this.constructor.name;
        this.errorPlayer = errorPlayer;
        this.reason = reason;
        // Valid reasons are: 'invalidMove', 'dynamite' and 'error'. If these are changed or added to then
        // frontend/src/helpers/errorMatchResultHelper.js and frontend/src/botMatchForm.jsx getMatchResultText() need
        // to be updated.
    }
}

module.exports = {BotError};

/***/ })
/******/ ]);