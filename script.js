const searchStates = { states: [] };

function noResults() {
    $('#error-message').text('Nothing found');
}

function errorMessage(responseMessage) {
    $('#error-message').text(`There was an error: ${responseMessage}`);
}

function showParks(responseJson) {
    if (responseJson.data.length > 0) {
        responseJson.data.map(park => {
            $('#results-list').append(
                `<li>
                <h3>${park.fullName}</h3>
                <span><i class="fas fa-map-marker-alt"></i>${park.states}</span>
                <p>${park.description}</p>
                <p><a href="${park.url}">${park.name} website</a></p>
            </li>`
            );
            $('#results-section').removeClass('hidden');
        });
    } 

    else {
        noResults();
    }
}

function returnQueryString(params) {
    return Object.keys(params).map(key => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    }).join('&');
}

function fetchParks(query, states, limit) {
     console.log(states);
    const params = {};

    params.q = query;

    if (states.length > 0) {
        params.stateCode = states;
    }

    params.limit = limit || 10;

    params.api_key = key.X_Api_Key;

    const urlRoot = 'https://developer.nps.gov/api/v1/parks?';
    const url = urlRoot + returnQueryString(params);

    fetch(url)
        .then(response => {
            if (response.ok) {
               return response.json();
            }
            throw new Error(response.statusText);
        })
        .then( responseJson => {

            showParks(responseJson);
        })
        .catch(err => {

            errorMessage(err.message);
        })
}

function listenToForm() {
    $('#search-form').on('submit', (e) => {
        e.preventDefault();
        const query = $('#search-input').val();
        const limit = $('#results-count').val();
        const states = searchStates.states;
        $('#results-list').empty();
        $('#error-message').text('');
        fetchParks(query, states, limit);
    })
}


function listenToDropdown() {
    $('#states-select').change(function(e){
        searchStates.states.push(e.target.value);
        $('#state-filters-added').removeClass('hidden');
        $('#state-filters-added span').text(`${searchStates.states.join(', ')}`);
        $(this).val('');
    });
}

function clearForm() {
    $('#clear-form').on('click', (e) => {
        emptyElements();
    })
}

function emptyElements() {
    $('#results-list').empty();
    $('#search-input').val('');
    $('#results-count').val('');
    $('#states-select').val('');
    $('#state-filters-added span').text('');
    $('#state-filters-added').addClass('hidden');
    $('#error-message').text('');
    searchStates.states = [];
}

function statesDropdown(statesArr) {
    statesArr.map(state => {
        $('#states-select').append(
            `<option>${state['value']}</option>`
        )
    });
}

listenToDropdown();
listenToForm();
clearForm();
statesDropdown(states);