//peggy 2

class Bot {
    makeMove(gamestate) {

        const amountOfDynamite = countDynamite(gamestate,'p1');
        if(amountOfDynamite<100){
            return makeRandomRPSDW();
        }
        else{
            return makeRandomRPS();
        }
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
