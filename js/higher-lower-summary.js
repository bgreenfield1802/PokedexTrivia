


// init
let difficulty
let levels
let correctAnswers = []
let compareInfo = []
let comparedPkmn = []
let seed = getUrlParam('seed')

const urlLvls = getUrlParam('lvls')
if (urlLvls != null && urlLvls >= 0 && urlLvls <= 3) { levels = urlLvls }
const urlDiff = getUrlParam('diff')
if (urlLvls != null && urlDiff >= 0 && urlDiff <= 3) { difficulty = urlDiff }

if (seed != null) {
    document.getElementById('seed').value = seed
}
if (levels != null) {
    document.getElementById('levels'+levels).checked = true
}
if (difficulty != null) {
    document.getElementById('difficulty'+difficulty).checked = true
}

console.log(seed)
console.log(levels)
console.log(difficulty)