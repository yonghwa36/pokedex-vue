<template>
    <div>
        <div class="pokemonLogo">
            <img :src="require(`../../../assets/logo-pixel.gif`)">
        </div>
        <input class="search" type="text" v-model="searchText" placeholder="Search for pokemon..." @input="handleInput" />
        <h1>Favorite Pokemon</h1>
        <v-simple-table dense>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left">{{ $t('number') }}</th>
                        <th class="text-left">{{ $t('image') }}</th>
                        <th class="text-left">{{ $t('name') }}</th>
                        <th class="text-left">{{ $t('type') }}</th>
                        <th class="text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="pokemon-table-row" v-for="pokemon in pokemons" :key="pokemon.id">
                        <td>#{{ pokemon.id }}</td>
                        <td>
                            <img :src="pokemon.imageURL" height="96" width="96" @click="onClickViewDetails(pokemon)" />
                        </td>
                        <td>{{ pokemon.name }}</td>
                        <td><pokemon-type-chip v-for="type in pokemon.types" :type="type.type.name"
                                :key="type.type.name + pokemon.id"></pokemon-type-chip>
                        </td>
                        <td>
                            <v-btn icon @click="onClickFavorite(pokemon)">
                                <v-icon v-if="!favouritedPokemonList.includes(pokemon.id)">mdi-heart</v-icon>
                                <v-icon v-if="favouritedPokemonList.includes(pokemon.id)" color="red">mdi-heart</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
        <div class="text-center">
            <v-pagination :value="pageNumber" :length="noOfPages" :disabled="isLoading" color="red" circle
                @input="onChangePageNumber(arguments[0])"></v-pagination>
        </div>
        <v-progress-linear v-show="isLoading" indeterminate color="teal"></v-progress-linear>
    </div>
</template>

<script>
import { RouteHandler } from '@/router';
import { PokemonTableDataHandler } from '@/store/modules/pokemonTable';
import PokemonStoreHttpRequest from '@/facade/PokemonStoreHttpRequest';
import PokemonTypeChip from './PokemonTypeChip.vue';

export default {
    components: {
        'pokemon-type-chip': PokemonTypeChip
    },
    data() {
        return {
            favouritedPokemonList: [],
            searchText: '',
            noOfPages: 0
        };
    },
    watch: {
    },
    computed: {
        pokemons() {
            return PokemonTableDataHandler.getItems(this);
        },

        pageNumber() {
            return PokemonTableDataHandler.getPageNumber(this);
        },

        pageSize() {
            return PokemonTableDataHandler.getPageSize(this);
        },

        isLoading() {
            return PokemonTableDataHandler.isLoading(this);
        },
    },
    async created() {
        await fetch("http://localhost:3001/ids").then(res => res.json()).then(result => {
            for (var i = 0; i < result.length; i++) {
                this.favouritedPokemonList.push(result[i].id);
            }
        }).then(() => {
            this.noOfPages = Math.ceil(this.favouritedPokemonList.length / this.pageSize);
        }).catch(err => console.log("err ", err))
        await PokemonStoreHttpRequest.refreshFavoriteData(this);
    },
    methods: {
        onChangePageNumber(pageNumber) {
            PokemonTableDataHandler.setPageNumber(this, pageNumber);
            PokemonStoreHttpRequest.refreshFavoriteData(this);
        },

        onClickRow(pokemon) {
            PokemonTableDataHandler.setSelectedPokemon(this, pokemon);
            this.$emit('clickRow', pokemon);
        },
        async onClickFavorite(pokemon) {
            if (this.favouritedPokemonList.includes(pokemon.id)) {
                await fetch(`http://localhost:3001/ids/${pokemon.id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }).then(resp => {
                        console.log(resp);

                        const indexInArray = this.favouritedPokemonList.indexOf(pokemon.id);
                        this.favouritedPokemonList.splice(indexInArray, 1);

                        fetch("http://localhost:3001/ids").then(res => res.json()).then(result => {
                            for (var i = 0; i < result.length; i++) {
                                this.favouritedPokemonList.push(result[i].id);
                            }
                        }).then(() => {
                            this.noOfPages = Math.ceil(this.favouritedPokemonList.length / this.pageSize);
                        })
                            .catch(err => console.log("err ", err));
                        PokemonStoreHttpRequest.refreshFavoriteData(this);

                    }).catch(error => {
                        console.log(error);
                    });
            } else {
                await fetch('http://localhost:3001/ids', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        "id": pokemon.id
                    })
                }).then(resp => {
                    console.log(resp);
                    fetch("http://localhost:3001/ids").then(res => res.json()).then(result => {
                        for (var i = 0; i < result.length; i++) {
                            this.favouritedPokemonList.push(result[i].id);
                        }
                    }).then(() => {
                        this.noOfPages = Math.ceil(this.favouritedPokemonList.length / this.pageSize);
                    }).catch(err => console.log("err ", err));
                    PokemonStoreHttpRequest.refreshFavoriteData(this);
                })
            }
        },

        onClickViewDetails(pokemon) {
            PokemonTableDataHandler.setSelectedPokemon(this, pokemon);
            RouteHandler.goToDetailsPage(this);
        },

        async handleInput(event) {
            const pokemonNameStrg = event.target.value.toLowerCase().trim();
            if (pokemonNameStrg.length > 0) {
                await PokemonStoreHttpRequest.filterDataByName(this, event.target.value);
                this.noOfPages = 1;
            } else {
                await fetch("http://localhost:3001/ids").then(res => res.json()).then(result => {
                    for (var i = 0; i < result.length; i++) {
                        this.favouritedPokemonList.push(result[i].id);
                    }
                }).then(() => {
                    this.noOfPages = Math.ceil(this.favouritedPokemonList.length / this.pageSize);
                }).catch(err => console.log("err ", err))
                await PokemonStoreHttpRequest.refreshFavoriteData(this);
            }
        }
    }
};
</script>

<style scoped>
.pokemon-table-row {
    cursor: pointer;
}

.pokemon-table-row td {
    width: 25%;
}

.search {
    color: grey;
    border-style: dotted;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-bottom: 1rem;
    font-size: xx-large;
}

.pokemonLogo {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}
</style>

