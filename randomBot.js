//peggy

class Bot {
    makeMove(gamestate) {
        return makeRandomRPS();
    }
}

function makeRandomRPS(){
    return convertToLetter(getRandomInt(3));
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
