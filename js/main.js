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