function setComparison(comparedPkmn, compareInfo) {
    // pokemon
    for (let i = 0; i < 2; i++) {
        const pkmnId = comparedPkmn[i]
        const statIndex = compareInfo[1]
        let side
        if (i == 0) { side='left' }
        else { side='right' }
        
        document.getElementById(side).setAttribute('onclick','makeGuess(\''+pkmnId+'\',\''+side+'\')')
        let name = '<p>#'+pokedata[pkmnId]['pokedex']+'</p>'
        name += '<h3>'+pokedata[pkmnId]['name']+'</h3>'
        document.getElementById(side+'Name').innerHTML = name
        const imgElement = document.getElementById(side+'Img')
        imgElement.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+pokedata[pkmnId]['sprite']
        imgElement.alt = pokedata[pkmnId]['name']
        const stats = ['HP','Atk','Def','SpA','SpD','Spe','BST']
        document.getElementById(side+'Stat').innerHTML = stats[statIndex]+': ???'
    }
    // question
    const stats = ['HEALTH','ATTACK','DEFENCE','SP.ATTACK','SP.DEFENCE','SPEED','TOTAL']
    const compElement = document.getElementById('comparison')
    compElement.classList = 'comparison '+compareInfo[0].toLowerCase()
    compElement.innerHTML = compareInfo[0].toUpperCase()+'<br/>'+stats[compareInfo[1]]
}

function getPokemonStat(pkmnId, statIndex) {
    if (statIndex != 6) {
        return pokedata[pkmnId]['stats'][statIndex]
    } else {
        let bst = 0
        for (let i = 0; i < 6; i++) {
            bst += pokedata[pkmnId]['stats'][i]
        }
        return bst
    }
}

function generateRandomComparison() {
    const comparison = []
    if (getRandomInt(0,1) == 0) { comparison.push('higher') }
    else { comparison.push('lower') }
    comparison.push(getRandomInt(0,6))
    return comparison
}

function generateRandomPokemon(diffculty, comparison) {
    let rolls
    while (true) {
        rolls = 0
        const randomPkmn = []
        randomPkmn.push(getRandomPokemon())
        const pkmn1Stat = getPokemonStat(randomPkmn[0],comparison[1])
        while (rolls < 1000) {
            rolls += 1
            const pkmn = getRandomPokemon()
            const pkmn2Stat = getPokemonStat(pkmn,comparison[1])
            const difference = Math.abs(pkmn1Stat-pkmn2Stat)
    
            if ((difference >= difficultyRanges[diffculty][0] && difference <= difficultyRanges[diffculty][1])) {
                randomPkmn.push(pkmn)
                return randomPkmn
            }
        }
    }
}

function revealStats(pkmn1, pkmn2, statIndex) {
    const stats = ['HP','Atk','Def','SpA','SpD','Spe','BST']
    document.getElementById('leftStat').innerHTML = stats[statIndex]+': '+getPokemonStat(pkmn1, statIndex)
    document.getElementById('rightStat').innerHTML = stats[statIndex]+': '+getPokemonStat(pkmn2, statIndex)
}

function getWinner() {
    const pkmn1 = comparedPkmn[level-1][0]
    const pkmn2 = comparedPkmn[level-1][1]
    const comparison = compareInfo[level-1][0]
    const statIndex = compareInfo[level-1][1]
    if (comparison == 'higher') {
        if (getPokemonStat(pkmn1, statIndex) > getPokemonStat(pkmn2, statIndex)) {
            return pkmn1
        } else { return pkmn2 }
    } else if (comparison == 'lower') {
        if (getPokemonStat(pkmn1, statIndex) < getPokemonStat(pkmn2, statIndex)) {
            return pkmn1
        } else { return pkmn2 }
    }
}

function makeGuess(guess, side) {
    document.getElementById(side).classList.add('selected')
    const leftElement = document.getElementById('left')
    const rightElement = document.getElementById('right')
    const centerElement = document.getElementById('center')
    const continueButton = document.getElementById('continueButton')
    const pointElement = document.getElementById('points')

    leftElement.classList.remove('no-answer')
    rightElement.classList.remove('no-answer')
    continueButton.classList.remove('no-answer')
    continueButton.setAttribute('onclick','nextLevel()')
    if (guess == getWinner()) {
        // correct
        leftElement.classList.add('correct')
        rightElement.classList.add('correct')
        centerElement.classList.add('correct')
        // points
        let multiplier
        if (streak < multiplierIndex.length) {
            multiplier = multiplierIndex[streak]
        } else {
            multiplier = multiplierIndex[multiplierIndex.length-1]
        }
        multiplier = multiplier*multiplierIndex[difficulty]

        points += Math.round(10*multiplier)
        streak += 1

        correctAnswers.push(1)
        pointElement.innerHTML = ('Pts: '+points)
        
        document.getElementById(side).classList.add('answer')
    } else {
        // incorrect
        leftElement.classList.add('incorrect')
        rightElement.classList.add('incorrect')
        centerElement.classList.add('incorrect')
        correctAnswers.push(0)

        streak = 0
        pointElement.innerHTML = ('Pts: '+points)
        
        if (side == 'left') { rightElement.classList.add('answer') }
        else { leftElement.classList.add('answer') }
    }
    leftElement.removeAttribute('onclick')
    rightElement.removeAttribute('onclick')


    revealStats(comparedPkmn[level-1][0], comparedPkmn[level-1][1], compareInfo[level-1][1])
}

function nextLevel() {
    level += 1
    if (level <= levelsIndex[levels]) {
        // next level
        setComparison(comparedPkmn[level-1],compareInfo[level-1])
        const leftElement = document.getElementById('left')
        const rightElement = document.getElementById('right')
        const centerElement = document.getElementById('center')
        const continueButton = document.getElementById('continueButton')

        leftElement.classList.add('no-answer')
        rightElement.classList.add('no-answer')
        continueButton.classList.add('no-answer')

        continueButton.removeAttribute('onclick')

        leftElement.classList.remove('correct')
        rightElement.classList.remove('correct')
        centerElement.classList.remove('correct')

        leftElement.classList.remove('incorrect')
        rightElement.classList.remove('incorrect')
        centerElement.classList.remove('incorrect')

        leftElement.classList.remove('answer')
        rightElement.classList.remove('answer')

        leftElement.classList.remove('selected')
        rightElement.classList.remove('selected')

        let levelsDisplay = levelsIndex[levels]
        if (levelsIndex[levels] >= 1000) { levelsDisplay = '&#8734;' }
        document.getElementById('level').innerHTML = level+'/'+levelsDisplay
    } else {
        // summary screen
        let params = '?seed='+seed
        params += '&lvls='+levels
        params += '&diff='+difficulty
        window.location.href = "summary/"+params
    }
}

function startGame() {
    seed = document.getElementById('seed').value
    levels = document.querySelector('input[name="levels"]:checked').value
    difficulty = document.querySelector('input[name="difficulty"]:checked').value

    // seed randomizer
    if (seed == null || seed == '') { seed = getRandomSeed(12) }
    Math.seedrandom(seed)
    
    // generate levels
    for (let i = 0; i < levelsIndex[levels]; i++) {
        compareInfo.push(generateRandomComparison())
        comparedPkmn.push(generateRandomPokemon(difficulty, compareInfo[i]))
    }

    // set url
    let params = ''
    params += '?seed='+seed
    params += '&lvls='+levels
    params += '&diff='+difficulty
    window.history.replaceState(null, null, params)

    // set elements
    document.getElementById('difficulty').innerHTML = difficultyIndex[difficulty]
    document.getElementById('difficulty').classList.add(difficultyIndex[difficulty].toLowerCase())

    document.getElementById('menu').classList.add('hidden')
    document.getElementById('quiz').classList.remove('hidden')

    // start
    nextLevel()
}

// indexes
const difficultyRanges = [[21,35],[11,20],[4,10],[1,3]]
const levelsIndex = [5,10,25,100]
const difficultyIndex = ['Easy','Medium','Hard','Expert']
const multiplierIndex = [1, 1.1, 1.25, 1.5, 1.75, 2, 2.5]

// init
let difficulty = 1
let levels = 1
let level = 0
let points = 0
let streak = 0
let multiplier = 1
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