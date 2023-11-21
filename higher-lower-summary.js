


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

console.log(seed)
console.log(levels)
console.log(difficulty)