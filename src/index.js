var Chessboard = require('chessboardjs');
import $ from 'jquery'
var games = require('./games.json')
const Chess = require('@ninjapixel/chess')

window.$ = $
window.jQuery = $

const START_BUTTON_CLICK_ACTION = "start_button_click"
const SELECT_SEQUENCE_LENGTH_ACTION = "select_sequence_length"
const CHECK_ANSWER_ACTION = "check_answer"
const SHOW_ANSWER_ACTION = "show_answer"
const NEXT_PUZZLE_ACTION = "next_puzzle"

$("#start_button").click(() => handleAction({ type: START_BUTTON_CLICK_ACTION }))
$("#moves_select").change((e) => handleAction({ type: SELECT_SEQUENCE_LENGTH_ACTION, value: e.currentTarget.value }))
$("#checkanswer_button").click(() => handleAction({ type: CHECK_ANSWER_ACTION, value: $("#answer_input").val() }))
$("#showanswer_button").click(() => handleAction({ type: SHOW_ANSWER_ACTION }))
$("#nextpuzzle_button").click(() => handleAction({ type: NEXT_PUZZLE_ACTION }))

let state = nextPuzzle(5)

moveGame(state)

function reducer(action) {
    return {

    };
}

function handleAction(action) {
    console.log(action)
    moveGame(state)
}

function render(store) {

}

function nextPuzzle(lengthOfMoveSequence) {
    let gameString = games[Math.floor(Math.random()*games.length)]
    
    let gameStringSplit = gameString.split(' ')
    let startingMoveIndex = Math.floor(Math.random()*(gameStringSplit.length-lengthOfMoveSequence+1))
    console.log(gameString, startingMoveIndex)
    let client = new Chess()
    for(let i = 0; i < startingMoveIndex; i++) {
        client.move(gameStringSplit[i])
    }
    let fen = client.fen()
    let theMoves = [];
    for(let i = startingMoveIndex; i < startingMoveIndex + lengthOfMoveSequence; i++) {
        theMoves.push(gameStringSplit[i])
        client.move(gameStringSplit[i])
    }
    let correctAnswer = theMoves.join(' ')
    let fullHistory = client.history({verbose:true}).map(move => move.from + '-' + move.to)
    let movesForChessboardJs = fullHistory.slice(Math.max(fullHistory.length - lengthOfMoveSequence, 1))

    return {
        startPositionFen: fen,
        movesForChessboardJs,
        correctAnswer: correctAnswer,
        isCurrentAnswerCorrect: false,
        isCurrentAnswerCheckedYet: false,
        isShowAnswerButtonVisible: false,
        isNextPuzzleButtonVisible: false,
        whiteAtBottom: true,
        lengthOfMoveSequence: lengthOfMoveSequence,
    }
}

function getMoveHistory(game) {
    let moves = game.split(' ')
    const gameClient = new Chess();
    moves.map(move => {
        gameClient.move(move)
    });
    return gameClient.history({verbose: true})
}

async function moveGame(state) {
    let board = Chessboard('myBoard', {position: state.startPositionFen})
    for(let i = 0; i < state.movesForChessboardJs.length; i++) {
        console.log(state.movesForChessboardJs[i])
        await timeout(2000)
        board.move(state.movesForChessboardJs[i])
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}