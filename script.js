let monTypes = ["Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"];
let monSecTypes = ["None", "Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"];

const typeChart = {
    normal: { fighting: 2, ghost: 0 },
    fire: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, ice: 0.5, bug: 0.5, steel: 0.5, fairy: 0.5 },
    water: { grass: 2, electric: 2, water: 0.5, fire: 0.5, ice: 0.5, steel: 0.5 },
    grass: { fire: 2, ice: 2, poison: 2, flying: 2, bug: 2, grass: 0.5, water: 0.5, ground: 0.5, electric: 0.5 },
    electric: { ground: 2, electric: 0.5, flying: 0.5, steel: 0.5 },
    ice: { fire: 2, fighting: 2, rock: 2, steel: 2, ice: 0.5 },
    fighting: { flying: 2, psychic: 2, fairy: 2, bug: 0.5, rock: 0.5, dark: 0.5 },
    poison: { ground: 2, psychic: 2, poison: 0.5, grass: 0.5, fairy: 0.5 },
    ground: { water: 2, grass: 2, ice: 2, poison: 0.5, rock: 0.5, electric: 0 },
    flying: { electric: 2, ice: 2, rock: 2, grass: 0.5, fighting: 0.5, bug: 0.5 },
    psychic: { bug: 2, ghost: 2, dark: 2, fighting: 0.5, psychic: 0.5 },
    bug: { fire: 2, flying: 2, rock: 2, grass: 0.5, fighting: 0.5, ground: 0.5 },
    rock: { water: 2, grass: 2, fighting: 2, ground: 2, steel: 2, normal: 0.5, fire: 0.5, poison: 0.5, flying: 0.5 },
    ghost: { ghost: 2, dark: 2, poison: 0.5, bug: 0.5, normal: 0, fighting: 0 },
    dragon: { ice: 2, dragon: 2, fairy: 2, fire: 0.5, water: 0.5, grass: 0.5, electric: 0.5 },
    dark: { fighting: 2, bug: 2, fairy: 2, ghost: 0.5, dark: 0.5, psychic: 0 },
    steel: { fire: 2, fighting: 2, ground: 2, normal: 0.5, grass: 0.5, ice: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 0.5, dragon: 0.5, steel: 0.5, fairy: 0.5 },
    fairy: { poison: 2, steel: 2, dragon: 0.5, fighting: 0.5, bug: 0.5, dark: 0 },
    none: {}
};

const GEN_LIMITS = [
    { maxId: 151, name: 'Gen 1' },
    { maxId: 251, name: 'Gen 2' },
    { maxId: 386, name: 'Gen 3' },
    { maxId: 493, name: 'Gen 4' },
    { maxId: 649, name: 'Gen 5' },
    { maxId: 721, name: 'Gen 6' },
    { maxId: 809, name: 'Gen 7' },
    { maxId: 905, name: 'Gen 8' },
];

function loadMonTypes(){
    for (let i = 0; i < monTypes.length; i++) {
    const option = document.createElement("option");
    option.textContent = monTypes[i]; // The text displayed in the dropdown
    option.value = monTypes[i].toLowerCase(); // The value sent with the form
    document.getElementById("monType").appendChild(option);
}

for (let i = 0; i < monSecTypes.length; i++) {
    const option = document.createElement("option");
    option.textContent = monSecTypes[i]; 
    option.value = monSecTypes[i].toLowerCase(); 
    document.getElementById("monSecType").appendChild(option);
}

}

function displayTyping() {
    const primary = document.getElementById("monType").value;
    const secondary = document.getElementById("monSecType").value;
    const display = document.getElementById("displayTyping");
    
    display.innerHTML = ""; 

    // We loop through every possible type to see how it performs AGAINST our defender
    let gridItems = monTypes.map(type => {
        const attacking = type.toLowerCase();
        
        // 1. Get multiplier for the primary type (Default to 1 if not in chart)
        let mult1 = (typeChart[primary] && typeChart[primary].hasOwnProperty(attacking)) 
                    ? typeChart[primary][attacking] 
                    : 1;

        // 2. Get multiplier for the secondary type
        let mult2 = 1;
        if (secondary !== 'none') {
            mult2 = (typeChart[secondary] && typeChart[secondary].hasOwnProperty(attacking)) 
                    ? typeChart[secondary][attacking] 
                    : 1;
        }

        const totalMultiplier = mult1 * mult2;

        // 3. Determine the label based on the combined multiplier
        let effectiveness = "Neutral";
        let statusClass = "neutral"; // For extra CSS styling if you want

        if (totalMultiplier === 0) effectiveness = "Immune";
        else if (totalMultiplier === 0.25) effectiveness = "4x Resist";
        else if (totalMultiplier === 0.5) effectiveness = "Resists";
        else if (totalMultiplier === 2) effectiveness = "Weak";
        else if (totalMultiplier === 4) effectiveness = "4x Weak";

        // Return the HTML for this specific type card
        return `
            <div class="type-item" style="background-color: var(--${attacking});">
                <strong>${type}</strong><br>
                ${totalMultiplier}x<br>
                <small>${effectiveness}</small>
            </div>`;
    }).join('');

    display.innerHTML = `<h3>Defensive Profile:</h3><div class="type-grid">${gridItems}</div>`;
}

window.addEventListener('load', function() {
    loadMonTypes();
    console.log('Window load event fired: All resources loaded!');
});

function randomMon() {
    const randomId = Math.floor(Math.random() * 898) + 1; // Random number between 1 and 898
    fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
        .then(response => response.json())
        .then(data => {
            updateDisplayInfo(data);
        })
        .catch(error => {
            console.error('Error fetching random Pokemon:', error);
            alert('Failed to fetch a random Pokemon. Please try again.');
        });
}

function searchMon() {
    const query = document.getElementById("mon").value.trim().toLowerCase();
    if (!query) {
        alert('Please enter a Pokemon name or ID.');
        return;
    }
    
    fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
        .then(response => {
            if (!response.ok) {
                // Try fuzzy matching if exact match fails
                return suggestPokemon(query).then(suggestion => {
                    if (suggestion) {
                        alert(`Did you mean: ${suggestion}?`);
                        return fetch(`https://pokeapi.co/api/v2/pokemon/${suggestion}`)
                            .then(r => r.json());
                    }
                    throw new Error('Pokemon not found');
                });
            }
            return response.json();
        })
        .then(data => updateDisplayInfo(data))
        .catch(error => {
            console.error('Error fetching Pokemon:', error);
            alert('Pokemon not found. Please check the name or ID and try again.');
        });
}

async function suggestPokemon(query) {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const data = await response.json();
        
        const allNames = data.results.map(p => p.name);
        let bestMatch = null;
        let bestDistance = 3; // Allow up to 3 character differences
        
        for (const name of allNames) {
            const distance = levenshteinDistance(query, name);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = name;
            }
        }
        return bestMatch;
    } catch (error) {
        console.error('Error fetching Pokemon list:', error);
        return null;
    }
}

function updateMonDisplay() {
    const query = document.getElementById("mon").value.trim().toLowerCase();
    if (!query) {
        document.getElementById("monDisplay").innerHTML = '';
        return;
    }
}

function updateDisplayInfo(data) {
    // Clear previous display
    document.getElementById("displayName").textContent = '';
    document.getElementById("displayNum").textContent = '';
    document.getElementById("displayFront").src = '';
    document.getElementById("displayBack").src = '';
    document.getElementById("displayType").textContent = '';
    document.getElementById("displayGen").textContent = '';
    document.getElementById("displayHeight").textContent = '';
    document.getElementById("displayWeight").textContent = '';
    document.getElementById("displayAbility").textContent = '';
    document.getElementById("displayAbility2").textContent = '';
    document.getElementById("displayHidden").textContent = '';

    // Update with new data
    document.getElementById("displayName").textContent = data.name.toUpperCase();
    document.getElementById("displayNum").textContent = `#${data.id}`;

    document.getElementById("displayFront").src = data.sprites.front_default;
    document.getElementById("displayBack").src = data.sprites.back_default;

    const types = data.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)).join(', ');
    document.getElementById("displayType").textContent = `Type: ${types}`;

    // Determine generation
    let gen = '';
    const genMatch = GEN_LIMITS.find(g => data.id <= g.maxId);
    gen = genMatch ? genMatch.name : 'Gen 9';
    document.getElementById("displayGen").textContent = `Generation: ${gen}`;

    document.getElementById("displayHeight").textContent = `Height: ${data.height / 10} m`;
    document.getElementById("displayWeight").textContent = `Weight: ${data.weight / 10} kg`;

    // Abilities
    const abilities = data.abilities.filter(a => !a.is_hidden);
    const hidden = data.abilities.find(a => a.is_hidden);

    if (abilities.length > 0) {
        document.getElementById("displayAbility").textContent = `Ability: ${abilities[0].ability.name.charAt(0).toUpperCase() + abilities[0].ability.name.slice(1)}`;
    }
    if (abilities.length > 1) {
        document.getElementById("displayAbility2").textContent = `Ability 2: ${abilities[1].ability.name.charAt(0).toUpperCase() + abilities[1].ability.name.slice(1)}`;
    }
    if (hidden) {
        document.getElementById("displayHidden").textContent = `Hidden Ability: ${hidden.ability.name.charAt(0).toUpperCase() + hidden.ability.name.slice(1)}`;
    }
}

let guesserMode = "";
let guesserCounter = 0;
let maxGuesses = 3;
let numHints = 0;
let currentPokemonData = null;
let hintsGenerated = [];

function monGuesser() {
    guesserMode = "guessing";
    guesserCounter = 0;
    hintsGenerated = [];
    document.getElementById("guess").value = '';
    document.getElementById("guess").disabled = false;
    document.getElementById("monGuesserName").textContent = '?';
    document.getElementById("monGuesserSprite").src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text x="50%" y="50%" font-size="24" text-anchor="middle" dy=".3em">?</text></svg>';
    document.getElementById("missCount").textContent = '';
    document.getElementById("hint1").textContent = '';
    document.getElementById("hint2").textContent = '';
    document.getElementById("hint3").textContent = '';
    
    // Remove old cry button if it exists
    const oldButton = document.getElementById("cryCryButton");
    if (oldButton) {
        oldButton.remove();
    }
    
    setGuesserMode();
    fetchGuesser();
}

function fetchGuesser() {
    const randomId = Math.floor(Math.random() * 898) + 1;
    fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
        .then(response => response.json())
        .then(data => {
            currentPokemonData = data;
            guesserMode = "active";
            guesserCounter = 0;
            document.getElementById("guess").value = '';
            document.getElementById("guess").disabled = false;
            document.getElementById("missCount").textContent = '';
            createHints(data);
        })
        .catch(error => {
            console.error('Error fetching random Pokemon for guesser:', error);
            alert('Failed to start the guesser. Please try again.');
        });
}

function createHints(pokemonData) {
    hintsGenerated = [];
    const difficulty = document.getElementById("difficulty").value;
    
    // Generate hint pool from pokemon data
    const hintPool = [];
    
    // Type hints
    pokemonData.types.forEach(t => {
        hintPool.push(`Type: ${t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}`);
    });
    
    // Generation hint
    const genMatch = GEN_LIMITS.find(g => pokemonData.id <= g.maxId);
    const gen = genMatch ? genMatch.name : 'Gen 9';
    hintPool.push(`Generation: ${gen}`);
    
    // Height/Weight hints
    hintPool.push(`Height: ${(pokemonData.height / 10).toFixed(1)}m`);
    hintPool.push(`Weight: ${(pokemonData.weight / 10).toFixed(1)}kg`);
    
    // Ability hints
    pokemonData.abilities.forEach(a => {
        const abilityName = a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1);
        if (a.is_hidden) {
            hintPool.push(`Hidden Ability: ${abilityName}`);
        } else {
            hintPool.push(`Ability: ${abilityName}`);
        }
    });
    
    // Base stats hints - add stat hints for medium/hard
    if (difficulty !== 'easy') {
        pokemonData.stats.forEach(stat => {
            const statName = stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1);
            if (stat.base_stat > 100) {
                hintPool.push(`High ${statName}: ${stat.base_stat}`);
            }
        });
    }
    
    // Shuffle and select hints based on difficulty
    let hintsToDisplay = numHints;
    if (difficulty === 'easy') {
        hintsToDisplay = 4;
    } else if (difficulty === 'medium') {
        hintsToDisplay = 3;
    } else {
        hintsToDisplay = 2;
    }
    
    // Shuffle hint pool and select
    const shuffledHints = hintPool.sort(() => 0.5 - Math.random()).slice(0, hintsToDisplay);
    hintsGenerated = shuffledHints;
    
    // Display hints
    document.getElementById("hint1").textContent = hintsGenerated[0] || '';
    document.getElementById("hint2").textContent = hintsGenerated[1] || '';
    document.getElementById("hint3").textContent = hintsGenerated[2] || '';
    
    // Add cry button if available
    if (pokemonData.cries && pokemonData.cries.latest) {
        const cryButton = document.getElementById("cryCryButton");
        if (cryButton) {
            cryButton.onclick = () => playCry(pokemonData.cries.latest);
        } else {
            // Create button if it doesn't exist
            const hintsContainer = document.getElementById("monHints");
            const button = document.createElement("button");
            button.id = "cryCryButton";
            button.textContent = "🔊 Hear the Cry";
            button.onclick = () => playCry(pokemonData.cries.latest);
            button.style.marginTop = "10px";
            button.style.padding = "8px 16px";
            button.style.cursor = "pointer";
            hintsContainer.appendChild(button);
        }
    }
}

function playCry(cryUrl) {
    const audio = new Audio(cryUrl);
    audio.play().catch(error => {
        console.error('Error playing cry:', error);
        alert('Could not play the cry audio.');
    });
}

function setGuesserMode() {
    let mode = document.getElementById("difficulty");
    let selected = mode.value;
    if (selected === "easy") {
        maxGuesses = 5;
        numHints = 3;
    } else if (selected === "medium") {
        maxGuesses = 4;
        numHints = 3;
    } else if (selected === "hard") {
        maxGuesses = 3;
        numHints = 2;
    }
}

function submitGuess() {
    if (guesserMode !== "active") return;
    
    const guess = document.getElementById("guess").value.trim().toLowerCase();
    if (!guess) {
        alert('Please enter a Pokemon name or ID.');
        return;
    }
    
    const correctAnswer = currentPokemonData.name.toLowerCase();
    
    // Allow guessing by name or ID
    const isCorrect = guess === correctAnswer || guess === String(currentPokemonData.id);
    
    if (isCorrect) {
        guesserMode = "completed";
        document.getElementById("monGuesserName").textContent = currentPokemonData.name.toUpperCase();
        document.getElementById("monGuesserSprite").src = currentPokemonData.sprites.front_default;
        document.getElementById("guess").disabled = true;
        alert(`Correct! It's ${currentPokemonData.name.toUpperCase()}! You got it in ${guesserCounter + 1} guess(es).`);
    } else {
        guesserCounter++;
        document.getElementById("missCount").textContent += 'X ';
        
        if (guesserCounter >= maxGuesses) {
            guesserMode = "completed";
            document.getElementById("monGuesserName").textContent = currentPokemonData.name.toUpperCase();
            document.getElementById("monGuesserSprite").src = currentPokemonData.sprites.front_default;
            document.getElementById("guess").disabled = true;
            alert(`Game Over! The answer was ${currentPokemonData.name.toUpperCase()}.`);
        } else {
            alert(`Incorrect! You have ${maxGuesses - guesserCounter} guess(es) left.`);
        }
    }
    
    document.getElementById("guess").value = '';
}

// Utility function for fuzzy matching Pokemon names
function levenshteinDistance(a, b) {
    const matrix = [];
    
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[b.length][a.length];
}