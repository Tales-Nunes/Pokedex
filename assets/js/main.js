const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-pokemon-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}"
                     loading="lazy" >
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml

        addPokemonClickListeners()
    })
}

function addPokemonClickListeners() {
    document.querySelectorAll('.pokemon').forEach(pokemonElement => {
        pokemonElement.addEventListener('click', () => {
            const pokemonId = pokemonElement.getAttribute('data-pokemon-id')
            showPokemonDetails(pokemonId)
        })
    })
}

function showPokemonDetails(pokemonId) {
    pokeApi.getPokemonById(pokemonId).then(pokemon => {
        showPokemonModal(pokemon)
    })
}

function showPokemonModal(pokemon) {
    const modalHtml = `
        <div class="pokemon-modal">
            <div class="modal-content ${pokemon.type}">
                <button class="close-modal">&times;</button>
                <div class="modal-header">
                    <span class="number">#${pokemon.number}</span>
                    <h2 class="name">${pokemon.name}</h2>
                </div>
                
                <div class="modal-body">
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                    
                    <div class="pokemon-info">
                        <p><strong>Type:</strong> ${pokemon.types.join(', ')}</p>
                        <p><strong>Height:</strong> ${pokemon.height} m</p>
                        <p><strong>Weight:</strong> ${pokemon.weight} kg</p>
                        
                        <h3>Abilities:</h3>
                        <ul>
                            ${pokemon.abilities.map(ability => `<li>${ability}</li>`).join('')}
                        </ul>
                        
                        <h3>Stats:</h3>
                        <ul class="stats">
                            ${pokemon.stats.map(stat => `
                                <li>
                                    <span class="stat-name">${stat.name}:</span>
                                    <span class="stat-value">${stat.value}</span>
                                    <div class="stat-bar">
                                        <div class="stat-bar-fill" style="width: ${stat.value}%"></div>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `
    
    document.body.insertAdjacentHTML('beforeend', modalHtml)

    document.querySelector('.close-modal').addEventListener('click', () => {
        document.querySelector('.pokemon-modal').remove()
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})