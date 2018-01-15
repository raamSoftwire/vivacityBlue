//peggy 4
// figures out what would've beaten their last move, then plays
// what would've beaten that

class Bot {
    makeMove(gamestate) {
        const rounds = gamestate.rounds;
        let previousOpponentMove ="";
        if(rounds.length===0){
            previousOpponentMove="D";
        }
        else {
            previousOpponentMove = rounds[rounds.length - 1]['p2'];
        }

        const amountOfDynamite = countDynamite(gamestate,'p1');

        const suggestedMove = beatMove(previousOpponentMove);


        if(amountOfDynamite<100){
            return beatMove(suggestedMove);
        }
        else{
            return makeRandomRPS();
        }
    }
}

function beatMove(move){
    switch (move){
        case "R":
            return 'P';
            break;
        case "P":
            return 'S';
            break;
        case "S":
            return 'R';
            break;
        case "D":
            return 'W';
            break;
        case "W":
            return makeRandomRPS();
            break;
    }
}

function countDynamite(gamestate, player){
    const rounds = gamestate.rounds;
    let dynamiteCounter = 0;

    for(i=0; i<rounds.length, i++;){
        if(rounds[i][player] === "D")
            dynamiteCounter++;
    }
}

function makeRandomRPS(){
    return convertToLetter(getRandomInt(3));
}

function makeRandomRPSDW() {
    return convertToLetter(getRandomInt(5));
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function convertToLetter(int){
    switch (int) {
        case 0:
            return 'R';
            break;
        case 1:
            return 'P';
            break;
        case 2:
            return 'S';
            break;
        case 3:
            return 'D';
            break;
        case 4:
            return 'W';
            break;
    }
}

module.exports = new Bot();
