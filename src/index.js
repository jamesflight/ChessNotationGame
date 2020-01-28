var Chessboard = require('chessboardjs');
import $ from 'jquery'
var games = require('./games.json')
const Chess = require('@ninjapixel/chess')

window.$ = $
window.jQuery = $

const RESTART_ACTION = "restart_action"
const SELECT_SEQUENCE_LENGTH_ACTION = "select_sequence_length"
const CHECK_ANSWER_ACTION = "check_answer"
const SHOW_ANSWER_ACTION = "show_answer"
const NEXT_PUZZLE_ACTION = "next_puzzle"

let state = nextPuzzle(2)
render(state)
let board = Chessboard('myBoard', {position: state.startPositionFen, showNotation: false})
moveGame(state)


$("#moves_select").change((e) => handleAction({ type: SELECT_SEQUENCE_LENGTH_ACTION, value: e.currentTarget.value }))
$('#answer_input').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        handleAction({ type: CHECK_ANSWER_ACTION, value: $("#answer_input").val() })
    }
});
$("#restart_button").click(() => handleAction({ type: RESTART_ACTION }))
$("#showanswer_button").click(() => handleAction({ type: SHOW_ANSWER_ACTION }))
$("#nextpuzzle_button").click(() => handleAction({ type: NEXT_PUZZLE_ACTION }))

function handleAction(action) {
    switch (action.type) {
        case SELECT_SEQUENCE_LENGTH_ACTION:
            state = nextPuzzle(parseInt(action.value))
            setupGame(state)
            break
        case CHECK_ANSWER_ACTION:
            state.isCurrentAnswerCheckedYet = true
            state.isCurrentAnswerCorrect = action.value == state.correctAnswer ? true : false
            break
        case SHOW_ANSWER_ACTION:
            state.isAnswerVisible = true
            break
        case NEXT_PUZZLE_ACTION:
            state = nextPuzzle(state.lengthOfMoveSequence)
            moveGame(state)
            break
        case RESTART_ACTION:
            moveGame(state)
            break
    }

    render(state)
}

function render(state) {
    $('#answer_input').removeClass('is-invalid')
    $('#answer_input').removeClass('is-valid')
    $('#answer_text').hide()
    $('#answer_text').text(state.correctAnswer)
    $('#showanswer_button').hide()

    if (state.isCurrentAnswerCheckedYet && state.isCurrentAnswerCorrect) {
        $('#answer_input').addClass('is-valid')
    }

    if (state.isCurrentAnswerCheckedYet && ! state.isCurrentAnswerCorrect) {
        $('#answer_input').addClass('is-invalid')
        $('#showanswer_button').show()
    }

    if (state.isAnswerVisible) {
        $('#answer_text').show()
        $('#showanswer_button').hide()
    }
}

function nextPuzzle(lengthOfMoveSequence) {
    let gameString = games[Math.floor(Math.random()*games.length)]
    
    let gameStringSplit = gameString.split(' ')
    let startingMoveIndex = Math.floor(Math.random()*(gameStringSplit.length-lengthOfMoveSequence+1))

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
    let correctAnswer = theMoves.join(' ').trim()
    let fullHistory = client.history({verbose:true}).map(move => move.from + '-' + move.to)
    let movesForChessboardJs = fullHistory.slice(Math.max(fullHistory.length - lengthOfMoveSequence, 1))

    let whiteAtBottom = Math.random() > 0.5

    console.info('Full game:', gameStringSplit)
    console.info('Starting move index:', startingMoveIndex)
    console.info('Full history (chess client):', fullHistory)
    console.info('Moves for chessboard js:', movesForChessboardJs)

    return {
        startPositionFen: fen,
        movesForChessboardJs,
        correctAnswer: correctAnswer,
        isCurrentAnswerCorrect: false,
        isCurrentAnswerCheckedYet: false,
        isAnswerVisible: false,
        whiteAtBottom,
        lengthOfMoveSequence,
    }
}

function setupGame(state) {
    if (state.whiteAtBottom) {
        board.orientation('white')
    } else {
        board.orientation('black')
    }
    board.position(state.startPositionFen)
}

async function moveGame(state) {
    setupGame(state)
    for(let i = 0; i < state.movesForChessboardJs.length; i++) {
        await timeout(1000)
        board.move(state.movesForChessboardJs[i])
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}