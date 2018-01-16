//peggy 6
// plays dynamite after first tie

class Bot {
    makeMove(gamestate) {
        const rounds = gamestate.rounds;
        const amountOfDynamite = countDynamite(gamestate,'p1');
        let myNextMove = '';
        if(rounds.length===0){
            myNextMove = makeRandomRPSD();
        }
        else {
            if(lastMoveWasATie(gamestate) && amountOfDynamite>0){
                myNextMove = 'D';
            }
            else{
                let previousOpponentMove ='';
                if(rounds.length===0){
                    previousOpponentMove = makeRandomRPSD();
                }
                else {
                    previousOpponentMove = rounds[rounds.length - 1]['p2'];
                }

                let suggestedMove = beatMove(previousOpponentMove);


                if(amountOfDynamite>0){
                    myNextMove = beatMove(suggestedMove);
                }
                else{
                    myNextMove = makeRandomRPS();
                }
            }
        }
        return myNextMove;
    }
}

function lastMoveWasATie(gamestate){
    const rounds = gamestate.rounds;
    let check = false;
    if(rounds.length===0){
        check = false;
    }
    else if (rounds[rounds.length - 1]['p1'] === rounds[rounds.length - 1]['p2']){
        check = true;
    }
    return check;
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

function makeRandomRPSD() {
    return convertToLetter(getRandomInt(4));
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
