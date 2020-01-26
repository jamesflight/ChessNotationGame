/*
* This CLI util takes a CSV file containing strings of chess games in regular chess notation (e.g. see games.csv)
* and converts them into a json file
*
*    usage:
*        $(basename $0)

*/

const Chess = require('@ninjapixel/chess').Chess
var fs = require('fs')
let games = fs.readFileSync('./cli/games.csv', 'utf8').split('\n')

games = games.filter((game) => game.split(" ").length >= 20);

for (let i = 0; i < games.length; ++i) {
    let chess = new Chess()
    let moves = games[i].split(' ')
    for (let j = 0; j < moves.length; ++j) {
        let result = chess.move(moves[j])
        if (result == null) {
            console.log('null happened')
        }
    }
}

fs.writeFileSync('./src/games.json', JSON.stringify(games))

// for (i = 0; i < games.length; ++i) {
//     const moves = pairArray(games[i].split(' '))

//     if (moves.length < 10) {
//         continue
//     }

//     for(j = 0; j < moves.length - 10)

//     const gameClient = new Chess();

//     moves.forEach((move) => {
//         if (! move[1]) {
//             return
//         }
//         gameClient.move(move[0])
//         gameClient.move(move[1])
//     });
// }


// function pairArray(a) {
//     var temp = a.slice()
//     var arr = []

//     while (temp.length) {
//       arr.push(temp.splice(0,2))
//     }
  
//     return arr
// }