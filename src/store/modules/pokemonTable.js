import StoreMutationsType from '@/store/StoreMutationsType';

export const PokemonTableDataHandler = {
    getItems(context) {
        state.favoritedPokemon = sessionStorage.getItem('favouritedList') === null ? [] : sessionStorage.getItem('favouritedList').split(',');
        return context.$store.getters.items;
    },

    setItems(context, items) {
        context.$store.commit(StoreMutationsType.SET_POKEMON_TABLE_ITEMS, items);
    },

    getPageNumber(context) {
        return context.$store.getters.pageNumber;
    },

    setPageNumber(context, pageNumber) {
        context.$store.commit(StoreMutationsType.SET_POKEMON_TABLE_PAGE_NUMBER, pageNumber);
    },

    getPageSize(context) {
        return context.$store.getters.pageSize;
    },

    setPageSize(context, pageSize) {
        context.$store.commit(StoreMutationsType.SET_POKEMON_TABLE_PAGE_SIZE, pageSize);
    },

    getSelectedPokemon(context) {
        return context.$store.getters.selectedPokemon;
    },

    getSelectedPokemonById() {
        var pokemonId = sessionStorage.getItem('selectedPokemon');
        return pokemonId;
    },

    setSelectedPokemon(context, selectedPokemon) {
        sessionStorage.setItem('selectedPokemon', selectedPokemon.id)
        context.$store.commit(StoreMutationsType.SET_SELECTED_POKEMON, selectedPokemon);
    },

    getFavoritedPokemon() {
        return state.favoritedPokemon;
    },

    setFavoritePokemon(context, selectedPokemon) {
        sessionStorage.removeItem('favouritedList');
        if (state.favoritedPokemon.includes(selectedPokemon.id)) {
            const indexInArray = state.favoritedPokemon.indexOf(selectedPokemon.id);
            state.favoritedPokemon.splice(indexInArray, 1);
        } else {
            context.$store.commit(StoreMutationsType.SET_FAVORITED_POKEMON, selectedPokemon);
        }

        sessionStorage.setItem('favouritedList', state.favoritedPokemon);
    },

    getFavoritedPokemonList(context) {
        // var temp = context.$store.getters.items;
        state.favoritedPokemon = sessionStorage.getItem('favouritedList') === null ? [] : sessionStorage.getItem('favouritedList').split(',');
        return context.$store.getters.items;
    },

    isLoading(context) {
        return context.$store.getters.isLoading;
    },

    startLoading(context) {
        context.$store.commit(StoreMutationsType.SET_POKEMON_TABLE_LOADING_ON);
    },

    stopLoading(context) {
        context.$store.commit(StoreMutationsType.SET_POKEMON_TABLE_LOADING_OFF);
    },

    // getFavoritedItems() {
    //     let favoritedPokemon = state.items;
    //     console.log("favoritedPokemon", state.items);
    //     console.log("favoritedPokemon", state.items.filter(x => x.id === favoritedPokemon));
    //     return state.items.filter(x => x.id === favoritedPokemon);
    // }
};

const state = {
    items: [],
    pageNumber: 1,
    pageSize: 15,
    selectedPokemon: null,
    loading: false,
    favoritedPokemon: [],

};

const getters = {
    items: (state) => {
        return state.items;
    },

    pageNumber: (state) => {
        return state.pageNumber;
    },

    pageSize: (state) => {
        return state.pageSize;
    },

    selectedPokemon: (state) => {
        return state.selectedPokemon;
    },

    isLoading: (state) => {
        return state.loading;
    }
};

const mutations = {
    [StoreMutationsType.SET_POKEMON_TABLE_ITEMS]: (state, items) => {
        state.items = items;
    },

    [StoreMutationsType.SET_POKEMON_TABLE_PAGE_NUMBER]: (state, pageNumber) => {
        state.pageNumber = pageNumber;
    },

    [StoreMutationsType.SET_POKEMON_TABLE_PAGE_SIZE]: (state, pageSize) => {
        state.pageSize = pageSize;
    },

    [StoreMutationsType.SET_SELECTED_POKEMON]: (state, selectedPokemon) => {
        state.selectedPokemon = selectedPokemon;
    },

    [StoreMutationsType.SET_POKEMON_TABLE_LOADING_ON]: (state) => {
        state.loading = true;
    },

    [StoreMutationsType.SET_POKEMON_TABLE_LOADING_OFF]: (state) => {
        state.loading = false;
    },

    [StoreMutationsType.SET_FAVORITED_POKEMON]: (state, selectedPokemon) => {
        state.favoritedPokemon.push(selectedPokemon.id);
    },

    [StoreMutationsType.GET_FAVORITED_POKEMON]: (state) => {
        state.items = state.items.filter(x => state.favoritedPokemon.includes(x));
    },
};

export default {
    state,
    getters,
    mutations
};
