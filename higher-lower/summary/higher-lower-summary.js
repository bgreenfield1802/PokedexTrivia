function createRow(comparedPkmn, compareInfo, selected, level) {
    const statNames = ['HEALTH','ATTACK','DEFENCE','SP.ATTACK','SP.DEFENCE','SPEED','TOTAL']

    const row = document.createElement('div')
    row.classList.add('row')

    let correctness
    let pkmn1Stat = 0
    let pkmn2Stat = 0
    if (compareInfo[1] != 6) {
        pkmn1Stat = pokedata[comparedPkmn[0]]['stats'][compareInfo[1]]
        pkmn2Stat = pokedata[comparedPkmn[1]]['stats'][compareInfo[1]]
    } else {
        pkmn1Stat = pokedata[comparedPkmn[0]]['stats'].reduce((partialSum, a) => partialSum + a, 0)
        pkmn2Stat = pokedata[comparedPkmn[1]]['stats'].reduce((partialSum, a) => partialSum + a, 0)
    }
    if (selected == 'left') {
        if ((compareInfo[0] == 'higher' && pkmn1Stat > pkmn2Stat) || (compareInfo[0] == 'lower' && pkmn1Stat < pkmn2Stat)) {
            correctness = 'correct'
        } else { correctness = 'incorrect' }
    } else {
        if ((compareInfo[0] == 'higher' && pkmn2Stat > pkmn1Stat) || (compareInfo[0] == 'lower' && pkmn2Stat < pkmn1Stat)) {
            correctness = 'correct'
        } else { correctness = 'incorrect' }
    }
    const comparison = document.createElement('div')
    comparison.classList.add('comparison')
    comparison.classList.add(selected)
    comparison.classList.add(correctness)
    
    comparison.append(createPkmnSummary(comparedPkmn[0], compareInfo, pkmn1Stat))

    const compareContainer = document.createElement('div')
    compareContainer.classList.add('compare-container')
    const levelElement = document.createElement('div')
    levelElement.classList.add('level')
    levelElement.innerHTML = level+'/'+levelsIndex[levels]
    compareContainer.append(levelElement)
    const compareStat = document.createElement('div')
    compareStat.classList.add('compare-stat')
    compareStat.classList.add(compareInfo[0])
    compareStat.innerHTML = compareInfo[0].toUpperCase()+'<br/>'+statNames[compareInfo[1]]
    compareContainer.append(compareStat)
    comparison.append(compareContainer)

    comparison.append(createPkmnSummary(comparedPkmn[1], compareInfo, pkmn2Stat))

    row.append(comparison)
    document.getElementById('answers').append(row)
}

function createPkmnSummary(pkmn, compareInfo, pkmnStat) {
    const stats = ['HP','Atk','Def','SpA','SpD','Spe','BST']
    const pkmnSummary = document.createElement('div')
    pkmnSummary.classList.add('pkmn-summary')
    const dexnum = document.createElement('p')
    dexnum.innerHTML = '#'+pokedata[pkmn]['pokedex']
    pkmnSummary.append(dexnum)
    const pkmnName = document.createElement('h3')
    pkmnName.innerHTML = pokedata[pkmn]['name']
    pkmnSummary.append(pkmnName)
    pkmnSummary.append(document.createElement('hr'))
    const pkmnImg = document.createElement('img')
    pkmnImg.src = imageUrl+pokedata[pkmn]['sprite']
    pkmnImg.alt = pokedata[pkmn]['name']
    pkmnSummary.append(pkmnImg)
    pkmnSummary.append(document.createElement('hr'))
    const statDisplay = document.createElement('h3')
    statDisplay.innerHTML = stats[compareInfo[1]]+': '+pkmnStat
    pkmnSummary.append(statDisplay)
    return pkmnSummary
}

// init
if (sessionStorage.summary == undefined) {
    window.location.href = '../../higher-lower/'
}
const summaryData = JSON.parse(sessionStorage.summary)

const seed = summaryData['seed']
const levels = summaryData['levels']
const difficulty = summaryData['difficulty']
const answers = summaryData['answers']
const correct = summaryData['correct']
const highestStreak = summaryData['highestStreak']
const fastestChoice = summaryData['fastestChoice']
const compareInfo = summaryData['compareInfo']
const comparedPkmn = summaryData['comparedPkmn']
const points = summaryData['points']

document.getElementById('seed').innerHTML = 'Seed: '+seed
document.getElementById('points').innerHTML = 'Points: '+points
document.getElementById('difficulty').innerHTML = difficultyIndex[difficulty]
document.getElementById('difficulty').classList.add(difficultyIndex[difficulty].toLowerCase())
document.getElementById('levels').innerHTML = 'Correct: '+correct+'/'+levelsIndex[levels]
document.getElementById('streak').innerHTML = 'Highest Streak: '+highestStreak
document.getElementById('fastest').innerHTML = 'Fastest Choice: '+fastestChoice+'s'

for (let i = 0; i < answers.length; i++) {
    createRow(comparedPkmn[i],compareInfo[i],answers[i],(i+1))
    if (i != answers.length-1) {
        document.getElementById('answers').append(document.createElement('hr'))
    }
}