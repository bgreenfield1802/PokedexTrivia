function toggleTabMenu() {
    const tabsElement = document.getElementById('tabs')
    const toggleElement = document.getElementById('tabToggle')
    const mainElement = document.getElementById('content')
    if (tabsElement.classList.contains('closed')) { 
        tabsElement.classList.remove('closed') 
        toggleElement.innerHTML = '&#9660;'
        mainElement.classList.add('menu-open')
    }
    else { 
        tabsElement.classList.add('closed') 
        toggleElement.innerHTML = '&#9650;'
        mainElement.classList.remove('menu-open')
    }
}

function addFilter(filter) {
    if (filters.length < filterLimit) {
        filters.push(filter)
        document.getElementById(filter).setAttribute('onclick','removeFilter(\''+filter+'\')')
        setActiveFilters()
        processFilterChange()
        createCardElements()
        createPageNavigation()
    }
}

function removeFilter(filter) {
    pid = 0
    const filterIndex = filters.indexOf(filter)
    filters.splice(filterIndex, 1)
    document.getElementById(filter).setAttribute('onclick','addFilter(\''+filter+'\')')
    setActiveFilters()
    processFilterChange()
    createCardElements()
    createPageNavigation()
}

function setActiveFilters() {
    document.getElementById('searchbar').value = ''
    for (let i = 0; i < filterList.length; i++) {
        document.getElementById(filterList[i]).classList = 'tab'
    }
    for (let i = 0; i < filters.length; i++) {
        const activeFilterElement = document.getElementById(filters[i])
        activeFilterElement.classList.add('active'+i)
        activeFilterElement.setAttribute('onclick','removeFilter(\''+filters[i]+'\')')
    }
}

function processFilterChange(pkmnIndex) {
    let referenceData = {}
    if (pkmnIndex == null) { referenceData = pokedata }
    else {
        const pkmnKeys = Object.keys(pokedata)
        for (let i = 0; i < pkmnIndex.length; i++) {
            referenceData[pkmnKeys[pkmnIndex[i]]] = pokedata[pkmnKeys[pkmnIndex[i]]]
        }
    }

    pid = 0
    data = {}
    if (filters.length > 0) {
        const pkmnKeys = Object.keys(referenceData)
        for (let i = 0; i < pkmnKeys.length; i++) {
            if (filters.every(x => referenceData[pkmnKeys[i]]['tags'].includes(x))) {
                data[pkmnKeys[i]] = referenceData[pkmnKeys[i]]
            }
        }
        if (Object.keys(data).length == 0) { data = false }
    }
    else { data = referenceData }
    window.history.replaceState(null, null, '?pid='+pid+createUrlFilters())
}

function createUrlFilters() {
    let urlFilters = ''
    for (let i = 0; i < filters.length; i++) {
        if (i == 0) { urlFilters = '&tag='+filters[i] }
        else { urlFilters = urlFilters+'+'+filters[i] }
    }
    return urlFilters
}

function createCardElements() {
    const container = document.getElementById('pkmnContainer')
    container.innerHTML = ''
    if (data != false && Object.keys(data).length > 0) {
        for (let i = pid; i < (parseInt(pid)+cardsDisplayed); i++) {
            if (i < Object.keys(data).length) {
                const pkmnKeys = Object.keys(data)
                const pkmn = document.createElement('div')
                pkmn.classList.add('pkmn')
                pkmn.title = ''
                for (let j = 0; j < data[pkmnKeys[i]]['tags'].length; j++) {
                    pkmn.title += toTitleCase(data[pkmnKeys[i]]['tags'][j].replaceAll('-',' '))
                    if (j+1 !== data[pkmnKeys[i]]['tags'].length) { pkmn.title += ', ' }
                }
                // types
                const types = document.createElement('div')
                types.classList.add('types')
                let typeList = []
                const allTypes = ['bug','dark','dragon','electric','fairy','fighting','fire','flying',
                    'ghost','grass','ground','ice','normal','poison','psychic','rock','steel','water']
                for (let j = 0; j < data[pkmnKeys[i]]['tags'].length; j++) {
                    if (allTypes.includes(data[pkmnKeys[i]]['tags'][j])) {
                        typeList.push(data[pkmnKeys[i]]['tags'][j])
                    }
                }
                for (let j = 0; j < typeList.length; j++) {
                    const typeImg = document.createElement('img')
                    typeImg.src = '../img/type/'+typeList[j]+'-icon.png'
                    typeImg.alt = typeList[j]
                    types.append(typeImg)
                }
                pkmn.append(types)
    
                // dexnum
                const dexnum = document.createElement('div')
                dexnum.classList.add('dexnum')
                dexnum.innerHTML = '#'+data[pkmnKeys[i]]['pokedex']
                pkmn.append(dexnum)
    
                // image
                const imageContainer = document.createElement('div')
                imageContainer.classList.add('image')
                const image = document.createElement('img')
                let sprite
                if (!shinySprites){ sprite = 'sprite' } else { sprite = 'shiny_sprite' }
                image.src = imageUrl+data[pkmnKeys[i]][sprite]
                image.alt = data[pkmnKeys[i]]['name']
                imageContainer.append(image)
                pkmn.append(imageContainer)
    
                // info
                const info = document.createElement('div')
                info.classList.add('info')
                // name
                const name = document.createElement('a')
                name.classList.add('name')
                name.href = 'https://www.serebii.net/pokemon/'
                name.target = '_blank'
                name.innerHTML = data[pkmnKeys[i]]['name']
                info.append(name)
                // size
                const size = document.createElement('div')
                size.classList.add('size')
                size.innerHTML = 'Height: '+data[pkmnKeys[i]]['height']/10+'m<br>Weight: '
                        +data[pkmnKeys[i]]['weight']/10+'kg'
                info.append(size)
                // abilities
                const abilityContainer = document.createElement('div')
                abilityContainer.classList.add('ability-container')
                const title = document.createElement('div')
                title.classList.add('title')
                title.innerHTML = 'Abilities:'
                abilityContainer.append(title)
                const abilities = document.createElement('div')
                abilities.classList.add('abilities')
                abilities.innerHTML = ''
                for (let j = 0; j < data[pkmnKeys[i]]['abilities'].length; j++) {
                    abilities.innerHTML += toTitleCase(data[pkmnKeys[i]]['abilities'][j].replaceAll('-',' '))
                    if (j+1 !== data[pkmnKeys[i]]['abilities'].length) { abilities.innerHTML += '<br>' }
                }
                abilityContainer.append(abilities)
                info.append(abilityContainer)
                // stat table
                const statTable = document.createElement('table')
                statTable.classList.add('stat-table')
                let row = document.createElement('tr')
                let headers = ['HP','ATK','DEF','SPA','SPD','SPE']
                for (let j = 0; j < headers.length; j++) {
                    const header = document.createElement('th')
                    header.innerHTML = headers[j]
                    row.append(header)
                }
                statTable.append(row)
                row = document.createElement('tr')
                headers = data[pkmnKeys[i]]['stats']
                for (let j = 0; j < headers.length; j++) {
                    const header = document.createElement('td')
                    header.innerHTML = headers[j]
                    row.append(header)
                }
                statTable.append(row)
                info.append(statTable)
                pkmn.append(info)
    
                container.append(pkmn)
            }
        }
    } else {
        const error = document.createElement('div')
        error.classList.add('error')
        let message = document.createElement('p')
        message.innerHTML = ('No Pokemon found with search terms:')
        error.append(message)
        message = document.createElement('p')
        if (document.getElementById('searchbar').value != '') {
            message.innerHTML += document.getElementById('searchbar').value
            if (filters.length > 0) { message.innerHTML += ', ' }
        }
        for (let i = 0; i < filters.length; i++) {
            message.innerHTML += toTitleCase(filters[i].replace('-',' '))
            if (i != (filters.length-1)) { message.innerHTML += ', ' }
        }
        error.append(message)
        container.append(error)
    }
}

function createPageNavigation() {
    const pages = Math.ceil(Object.keys(data).length/cardsDisplayed)
    const currentPage = (pid/cardsDisplayed)+1

    const navigation = document.getElementById('navigation')
    navigation.innerHTML = ''
    let button
    const tag = createUrlFilters()

    document.getElementById('backButton').classList.add('hidden')
    document.getElementById('nextButton').classList.add('hidden')

    let displayedPages = []
    if (currentPage-2 <= 1) { 
        for (let i = 1; i <= 5; i++) {
            if (i <= pages) { displayedPages.push(i) }
        }
    }
    else if (currentPage+2 >= pages) { 
        for (let i = (pages-4); i <= pages; i++) {
            if (i <= pages && i > 0) { displayedPages.push(i) }
        }
    }
    else {
        for (let i = (currentPage-2); i <= (currentPage+2); i++) {
            displayedPages.push(i)
        }
    }

    // double back button
    if (currentPage > 3 && displayedPages.length == 5 && pages > 5) {
        button = document.createElement('div')
        button.setAttribute('onclick','gotoPage(0)')
        button.classList.add('arrow-button')
        button.innerHTML = '&lt;&lt;'
        navigation.append(button)
    }

    // back button
    if (currentPage > 1) {
        // document.getElementById('backButton').setAttribute('onclick','previousPage()')
        document.getElementById('backButton').classList.remove('hidden')
    }

    // numbered buttons
    for (let i = 0; i < displayedPages.length; i++) {
        button = document.createElement('div')
        button.setAttribute('onclick','gotoPage('+(displayedPages[i]-1)*cardsDisplayed+')')
        button.classList.add('page-button')
        if (currentPage == displayedPages[i]) { button.classList.add('current') }
        button.innerHTML = displayedPages[i]
        navigation.append(button)
    }

    // next button
    if (currentPage < pages) {
        // document.getElementById('nextButton').setAttribute('onclick','nextPage()')
        document.getElementById('nextButton').classList.remove('hidden')
    }

    // double next button
    if (currentPage < (pages-2) && displayedPages.length == 5 && pages > 5) {
        button = document.createElement('div')
        button.setAttribute('onclick','gotoPage('+(pages-1)*cardsDisplayed+')')
        button.classList.add('arrow-button')
        button.innerHTML = '&gt;&gt;'
        navigation.append(button)
    }
}

function nextPage() {
    pid = parseInt(pid)+cardsDisplayed
    window.history.replaceState(null, 'Admin', '?pid='+pid+createUrlFilters())
    createCardElements()
    createPageNavigation()
}

function previousPage() {
    pid = parseInt(pid)-cardsDisplayed
    if (pid < 0) { pid = 0 }
    window.history.replaceState(null, 'Admin', '?pid='+pid+createUrlFilters())
    createCardElements()
    createPageNavigation()
}

function gotoPage(pageId) {
    pid = pageId
    window.history.replaceState(null, 'Admin', '?pid='+pid+createUrlFilters())
    createCardElements()
    createPageNavigation()
}

function searchPokemon() {
    const input = document.getElementById('searchbar').value

    let result
    if (input != '') {
        const pkmnKeys = Object.keys(pokedata)
        const pkmnNames = []
        for (let i = 0; i < pkmnKeys.length; i++) {
            pkmnNames.push(pokedata[pkmnKeys[i]]['name'])
        }
        const options = {
            threshold: 0.3,
            keys: ['pokedex','name','abilities','tags']
        }
        const fuse = new Fuse(pkmnNames, options)
        result = fuse.search(input)
    } else { result = null }

    processFilterChange(result)
    createCardElements()
    createPageNavigation()
}

// tabs
for (let i = 0; i < filterList.length; i++) {
    const tab = document.createElement('div')
    tab.classList.add('tab')
    tab.setAttribute('onclick','addFilter(\''+filterList[i]+'\')')
    tab.innerHTML = toTitleCase(filterList[i].replace('-',' '))
    tab.id = filterList[i]
    document.getElementById('tabs').append(tab)
}

// init
shinySprites = false
const cardsDisplayed = 24
const filterLimit = 3

let pid = getUrlParam('pid')
if (pid == null) { pid = 0 }
else if (pid % cardsDisplayed) { pid = 0 }

let data = {}
let filters = []
let urlFilters = getUrlParam('tag')
if (urlFilters != null) { filters = urlFilters.split(' ') }

setActiveFilters()
processFilterChange()

createCardElements()
createPageNavigation()