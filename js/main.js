function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPokemon() {
    const id = getRandomInt(0,(Object.keys(pokedata).length)-1)
    return Object.keys(pokedata)[id]
}

function getRandomSeed(length) {
    let seed = ''
    for (let i = 0; i < length; i++) {
        seed += String(getRandomInt(0,9))
    }
    if (getRandomInt(0,1)) { seed = String(parseInt(seed)*-1) }
    return seed
}

function getUrlParam(param) {
    const urlString = window.location.href
    const url = new URL(urlString)
    return url.searchParams.get(param);
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

// indexes
const difficultyIndex = ['Easy','Medium','Hard','Expert']
const difficultyRanges = [[21,35],[11,20],[4,10],[1,3]]
const levelsIndex = [5,10,25,100]
const multiplierIndex = [1, 1.1, 1.25, 1.5, 1.75, 2, 2.5]

const imageUrl = 'https://raw.githubusercontent.com/Popokedata[]keAPI/sprites/master/sprites/pokemon/'

