function createTagElements() {
    for (let i = 0; i < 2 ; i++) {
        let id
        if (i == 0) { id = 'hTag' }
        else { id = 'vTag' }
        for (let j = 0; j < 3; j++) {
            const tag = levelTags[i][j]
            let tagElement
            if (tagList['types'].includes(tag) && tag != 'monotype' && tag != 'duel-type') {
                // type
                tagElement = document.createElement('img')
                tagElement.src = '../img/type/'+tag+'.png'
                tagElement.alt = toTitleCase(tag)
            } else {
                // other tag
                tagElement = document.createElement('p')
                if (Object.keys(tagTitles).includes(tag)) {
                    tagElement.innerHTML = tagTitles[tag]
                } else {
                    tagElement.innerHTML = toTitleCase(tag.replace('-',' '))
                }
            }
            document.getElementById(id+j).innerHTML = ''
            document.getElementById(id+j).append(tagElement)
        }
    }
}

function generateLevels() {
    while (true) {
        // generate 1st top tag
        levelTags[0][0] = getRandomTag(0)
        
        // generate 3 side tags that are compatible with 1st top tag
        for (let i = 0; i < 3; i++) {
            // loop 100 times or until valid tag is found
            for (let x = 0; x < 100; x++) {
                const testTag = getRandomTag(i)
                // check if tag isnt already selected
                if (!levelTags[0].includes(testTag) && !levelTags[1].includes(testTag)) {
                    // find possible answers
                    possibleAnswers[i][0] = []
                    Object.keys(pokedata).forEach(key => {
                        if (pokedata[key]['tags'].includes(levelTags[0][0]) && pokedata[key]['tags'].includes(testTag)) {
                            possibleAnswers[i][0].push(key)
                        }
                    });
                    // check if number of possible answers matches the difficulty
                    if (possibleAnswers[i][0].length >= minPossibilities[difficulty]) {
                        levelTags[1][i] = testTag
                        break
                    }
                }
            }
        }

        // generate 2 more top tags that are compatible with all 3 side tags
        for (let i = 1; i < 3; i++) {
            // loop 100 times or until valid tag is found
            for (let x = 0; x < 100; x++) {
                const testTag = getRandomTag(i)
                // check if tag isnt already selected
                if (!levelTags[0].includes(testTag) && !levelTags[1].includes(testTag)) {
                    for (let j = 0; j < 3; j++) {
                        // find possible answers
                        possibleAnswers[j][i] = []
                        Object.keys(pokedata).forEach(key => {
                            if (pokedata[key]['tags'].includes(testTag) && pokedata[key]['tags'].includes(levelTags[1][j])) {
                                possibleAnswers[j][i].push(key)
                            }
                        });
                    }
                    // check if number of possible answers matches the difficulty
                    if (possibleAnswers[0][i].length >= minPossibilities[difficulty] && possibleAnswers[1][i].length >= minPossibilities[difficulty] && possibleAnswers[2][i].length >= minPossibilities[difficulty]) {
                        levelTags[0][i] = testTag
                        break
                    }
                }
            }
        }
        // infinite loop until 6 total tags are selected
        if (levelTags[0].length == 3 && levelTags[1].length == 3) { break }
    }
}

function generatePremadeLevel(tags1, tags2) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            Object.keys(pokedata).forEach(key => {
                if (pokedata[key]['tags'].includes(tags1[i]) && pokedata[key]['tags'].includes(tags2[j])) {
                    possibleAnswers[j][i].push(key)
                }
            })
        }
    }
}

function getRandomTag(x) {
    const random = Math.random()
    const tagKeys = Object.keys(tagChances[x])
    let result
    if (selectedGroups.length > 0) {
        tagKeys.forEach(key => {
            if (random < tagChances[x][key]) {
                result = key
            }
        });
    } else { result = 'types' }
    let availableTags
    if (result == 'other') {
        const randomGroup = Math.floor(Math.random() * selectedGroups.length)
        availableTags = tagList[result][selectedGroups[randomGroup]]
    } else {
        availableTags = tagList[result]
    }
    const randomTag = Math.floor(Math.random() * availableTags.length)
    return availableTags[randomTag]
}

function updatePP() {
    document.getElementById('pp').innerHTML = 'PP<br/>'+powerPoints+'/'+maxPowerPoints[difficulty]
    if (powerPoints == 0) {
        levelComplete = true
        document.getElementById('puzzle').classList.add('complete')

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                document.getElementById('square'+i+'-'+j).removeAttribute('onclick')
            }
        }
    }
}

function selectSquare(x, y) {
    const searchbar = document.getElementById('searchbar')
    searchbar.value = ''
    searchbar.focus()
    searchbar.setAttribute('onkeyup','searchPokemon('+x+','+y+')')

    document.getElementById('searchOutput').innerHTML = ''
    document.getElementById('pp').classList = ''
    document.getElementById('square'+x+'-'+y).classList = ''

    const searchTitle = document.getElementById('searchTitle')
    let tags = [levelTags[0][y],levelTags[1][x]]

    for (let i = 0; i < 2; i++) {
        // notice message
        const noticeElement = document.getElementById('searchNotice'+i)
        if (Object.keys(noticeMessages).includes(tags[i])) {
            noticeElement.innerHTML = noticeMessages[tags[i]]
            noticeElement.classList.remove('hidden')
        } else {
            noticeElement.classList.add('hidden')
        }
        // reformat tag
        if (Object.keys(tagTitles).includes(tags[i])) {
            tags[i] = tagTitles[tags[i]]
        } else {
            tags[i] = toTitleCase(tags[i].replace('-',' '))
        }
    }
    searchTitle.innerHTML = tags[0]+'/'+tags[1]

    openModal('searchModal')
}

function searchPokemon(x, y) {
    const input = document.getElementById('searchbar').value
    const output = document.getElementById('searchOutput')

    if (input.length >= 3) {
        let result
        const pkmnKeys = Object.keys(pokedata)
        if (input != '') {
            const options = {
                threshold: 0.4,
                distance: 0
            }
            const fuse = new Fuse(pkmnKeys, options)
            result = fuse.search(input)
        } else { result = null }
    
        output.innerHTML = ''
        if (result) {
            for (let i = 0; i < result.length; i++) {
                const pkmnData = pokedata[pkmnKeys[result[i]]]
                const pkmn = document.createElement('div')
                pkmn.classList.add('pkmn')
                if (Object.keys(answered).includes(pkmnKeys[result[i]])) {
                    pkmn.classList.add('no-select')
                }
    
                const image = document.createElement('img')
                image.src = imageUrl+pkmnData['sprite']
                image.alt = pkmnData['name']
                pkmn.append(image)
    
                const dexnum = document.createElement('div')
                dexnum.classList.add('dexnum')
                dexnum.innerHTML = '#'+pkmnData['pokedex']
                pkmn.append(dexnum)
    
                const name = document.createElement('div')
                name.innerHTML = pkmnData['name']
                pkmn.append(name)
    
                const button = document.createElement('button')
                button.innerHTML = 'Select'
                button.setAttribute('onclick','makeGuess(\''+pkmnKeys[result[i]]+'\','+x+','+y+')')
                pkmn.append(button)
    
                output.append(pkmn)
                if (i != (result.length-1)) {
                    output.append(document.createElement('hr'))
                }
            }
        }
    } else {
        output.innerHTML = ''
    }
}

function makeGuess(guess, x, y) {
    powerPoints -= 1
    updatePP()
    closeModal('searchModal')

    if (possibleAnswers[x][y].includes(guess) && !Object.keys(answered).includes(guess)) {
        // correct
        const squareElement = document.getElementById('square'+x+'-'+y)
        squareElement.classList.add('no-select')
        squareElement.removeAttribute('onclick')

        const image = document.createElement('img')
        image.src = imageUrl+pokedata[guess]['sprite']
        image.alt = pokedata[guess]['name']
        squareElement.append(image)

        const pName = document.createElement('p')
        pName.innerHTML = pokedata[guess]['name']
        squareElement.append(pName)

        document.getElementById('pp').classList.add('correct')
        document.getElementById('square'+x+'-'+y).classList.add('correct')

        answered[guess] = [x,y]
        if (Object.keys(answered).length == 9) {
            levelComplete = true
        }
    } else {
        // incorrect
        document.getElementById('pp').classList.add('incorrect')
        document.getElementById('square'+x+'-'+y).classList.add('incorrect')
    }
}

function startGame() {
    let params
    if (level != null) {
        // premade level
        levelTags = levelCatalogue[level]
        document.getElementById('seed').innerHTML = 'Level: '+level
        params = '?level='+level
        generatePremadeLevel(levelTags[0],levelTags[1])
    } else {
        // seeded level
        if (seed == null || seed == '') { seed = getRandomSeed(9) }
        Math.seedrandom(seed)
        document.getElementById('seed').innerHTML = 'Seed: '+seed
        params = '?seed='+seed
        generateLevels()
    }
    selectedGroups.forEach(group => {
        params += '&'+group
    })
    window.history.replaceState(null, null, params)
    createTagElements()
    updatePP()

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const square = document.getElementById('square'+i+'-'+j)
            square.setAttribute('onclick','selectSquare('+i+','+j+')')
        }
    }
}

function randomLevel() {
    let params = '?seed='+getRandomSeed(9)
    selectedGroups.forEach(group => {
        params += '&'+group
    })
    return params
}

function premadeLevel(levelName) {
    let params = '?level='+levelName
    selectedGroups.forEach(group => {
        params += '&'+group
    })
    return params
}

// init
let levelTags = [[],[]]
let possibleAnswers = [
    [
        [],
        [],
        []
    ],
    [
        [],
        [],
        []
    ],
    [
        [],
        [],
        []
    ]
]
const minPossibilities = [6,4,2,1]
const maxPowerPoints = [12,11,10,9]

let answered = {}
let levelComplete = false

let difficulty = 3
let powerPoints = maxPowerPoints[difficulty]
let selectedGroups = []
if (hasUrlParam('regions')) { selectedGroups.push('regions') }
if (hasUrlParam('categories')) { selectedGroups.push('categories') }
if (hasUrlParam('evoStatus')) { selectedGroups.push('evoStatus') }
if (hasUrlParam('gender')) { selectedGroups.push('gender') }
let seed = getUrlParam('seed')
let level = getUrlParam('level')

const excludeTags = [
    'unknown-origin',
    'default-form',
    'alternate-form'
]

const tagChances = [
    {
        "types": "1", // 95%
        "other": "0.05" // 5%
    },
    {
        "types": "1", // 70%
        "other": "0.3", // 30%
    },
    {
        "types": "1", // 20%
        "other": "0.8", // 80%
    }
]

const levelCatalogue = {
    "2023-10-28": [
        ['dark','water','mega'],
        ['flying','grass','hoenn']
    ],
    "2023-10-29": [
        ['flying','fire','monotype'],
        ['grass','psychic','galar']
    ],
    "2023-10-30": [
        ['psychic','grass','kanto'],
        ['flying','water','fairy']
    ],
    "2023-10-31": [
        ['posion','ghost','gmax'],
        ['dragon','normal','final-stage']
    ],
    "2023-11-01": [
        ['steel','dragon','kanto'],
        ['grass','ground','fossil']
    ],
    "2023-11-02": [
        ['electric','dragon','johto'],
        ['normal','rock','mega']
    ],
    "2023-11-03": [
        ['mega','monotype','baby'],
        ['electric','fairy','psychic']
    ],
    "2023-11-04": [
        ['psychic','fire','galar'],
        ['flying','ground','gmax']
    ],
    "2023-11-05": [
        ['grass','psychic','alola'],
        ['flying','ice','legendary']
    ],
    "2023-11-06": [
        ['dark','dragon','monotype'],
        ['steel','poison','first-stage']
    ],
    "2023-11-07": [
        ['normal','mega','water'],
        ['sinnoh','hoenn','kalos']
    ],
    "2023-11-08": [
        ['steel','dragon','first-stage'],
        ['ghost','rock','legendary']
    ],
    "2023-11-09": [
        ['electric','ice','galar'],
        ['water','steel','legendary']
    ],
    "2023-11-10": [
        ['psychic','poison','steel'],
        ['galar','paldea','fairy']
    ],
    "2023-11-11": [
        ['fire','psychic','paldea'],
        ['flying','ground','legendary']
    ],
    "2023-11-12": [
        ['monotype','unova','paradox'],
        ['fire','water','fairy']
    ],
    "2023-11-13": [
        ['kanto','legendary','mythical'],
        ['mega','psychic','fighting']
    ],
    "2023-11-14": [
        ['flying','bug','hisui'],
        ['poison','steel','stone-evolution']
    ],
    "2023-11-15": [
        ['steel','ghost','kanto'],
        ['dragon','grass','monotype']
    ],
    "2023-11-16": [
        ['ghost','flying','sinnoh'],
        ['grass','bug','legendary']
    ],
    "2023-11-17": [
        ['steel','rock','ice'],
        ['legendary','hoenn','psychic']
    ],
    "2023-11-18": [
        ['steel','bug','final-stage'],
        ['ground','rock','mega']
    ],
    "2023-11-19": [
        ['psychic','ghost','middle-stage'],
        ['dark','fighting','kalos']
    ],
    "2023-11-20": [
        ['dark','bug','fire'],
        ['unova','monotype','first-stage']
    ],
    "2023-11-21": [
        ['poison','flying','kanto'],
        ['fighting','fire','stone-evolution']
    ],
    "2023-11-22": [
        ['grass','ghost','kalos'],
        ['first-stage','trade-evolution','final-stage']
    ],
    "2023-11-23": [
        ['fairy','poison','single-stage'],
        ['ghost','normal','johto']
    ],
    "2023-11-24": [
        ['alola','baby','psychic'],
        ['normal','fairy','monotype']
    ],
    "2023-11-25": [
        ['steel','unova','bug'],
        ['mythical','single-stage','fire']
    ]
}

const noticeMessages = {
    "monotype": "Pokemon with only a single type",
    "duel-type": "Pokemon with any second type",
    "legendary": "Does not include mythical Pokemon or ultra beasts",
    "stone-evolution": "Post-evolution Pokemon only, also includes evolutions achieved by using items other than stones",
    "trade-evolution": "Post-evolution Pokemon only, also includes evolutions achieved by trading whilst holding an item",
    "friendship-evolution": "Post-evolution Pokemon only",
    "split-evolution": "Post-evolution Pokemon only, includes both base and alternate split evolutions",
    "first-stage": "The first Pokemon in an evolutionary line",
    "middle-stage": "The second Pokemon in 3-stage evolutionary lines only",
    "final-stage": "The final Pokemon in an evolutionary line",
    "single-stage": "Pokemon without an evolutionary line",
    "gender-differences": "Pokemon with visible differences between genders"
}

document.getElementById('randomLevel').href = randomLevel()

if (seed != null || level != null) {
    startGame()
} else {
    // window.location.href = 'settings/'
    selectedGroups.push('regions')
    selectedGroups.push('categories')
    selectedGroups.push('evoStatus')
    selectedGroups.push('gender')
    window.location.href = randomLevel()
}
