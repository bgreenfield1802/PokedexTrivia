// #region FUNCTIONS
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

function hasUrlParam(param) {
    const urlString = window.location.href
    const url = new URL(urlString)
    return url.searchParams.has(param);
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function openModal(id) {
    const overlay = document.getElementById('modalOverlay')
    overlay.classList.remove('hidden')
    overlay.setAttribute('onclick','closeModal(\''+id+'\')')

    document.getElementById(id).classList.remove('hidden')
}

function closeModal(id) {
    const overlay = document.getElementById('modalOverlay')
    overlay.classList.add('hidden')
    overlay.removeAttribute('onclick')

    document.getElementById(id).classList.add('hidden')
}
// #endregion

// indexes
const difficultyIndex = ['Easy','Medium','Hard','Expert']

const imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'

const filterList = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
    "monotype",
    "duel-type",
    "kanto",
    "johto",
    "hoenn",
    "sinnoh",
    "unova",
    "kalos",
    "alola",
    "unknown-origin",
    "galar",
    "hisui",
    "paldea",
    "mega",
    "gmax",
    "starter",
    "fossil",
    "fusion",
    "paradox",
    "pseudo-legendary",
    "legendary",
    "mythical",
    "ultra-beast",
    "baby",
    "stone-evolution",
    "trade-evolution",
    "friendship-evolution",
    "split-evolution",
    "first-stage",
    "middle-stage",
    "final-stage",
    "single-stage",
    "male-only",
    "female-only",
    "genderless",
    "gender-differences",
    "default-form",
    "alternate-form"
]

const tagList = {
    "types": [
        "bug",
        "dark",
        "dragon",
        "electric",
        "fairy",
        "fighting",
        "fire",
        "flying",
        "ghost",
        "grass",
        "ground",
        "ice",
        "normal",
        "poison",
        "psychic",
        "rock",
        "steel",
        "water",
        "monotype",
        "duel-type"
    ],
    "other": {
        "regions": [
            "kanto",
            "johto",
            "hoenn",
            "sinnoh",
            "unova",
            "kalos",
            "alola",
            "unknown-origin",
            "galar",
            "hisui",
            "paldea"
        ],
        "categories": [
            "mega",
            "gmax",
            "starter",
            "fossil",
            "fusion",
            "paradox",
            "pseudo-legendary",
            "legendary",
            "mythical",
            "ultra-beast",
            "baby"
        ],
        "evoStatus": [
            "stone-evolution",
            "trade-evolution",
            "friendship-evolution",
            "split-evolution",
            "first-stage",
            "middle-stage",
            "final-stage",
            "single-stage"
        ],
        "gender": [
            "male-only",
            "female-only",
            "genderless",
            "gender-differences"
        ]
    }
}

const tagTitles = {
    "mega": "Mega Evolution",
    "gmax": "Gigantamax"
}