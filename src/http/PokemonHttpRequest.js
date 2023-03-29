import HttpRequest from './HttpRequest';
import Configuration from '@/Configuration';
import PokemonDetailsModel from '@/model/PokemonDetailsModel';
import PokemonModel from '@/model/PokemonModel';
import PokemonEvolutionChainModel from '@/model/PokemonEvolutionChainModel';
PokemonModel;

export default {
    getPageByNumberAndSize(pageNumber, pageSize) {
        const initialPokemonNumber = pageSize * (pageNumber - 1) + 1;
        const promises = [];

        for (let i = 0; i < pageSize; i++) {
            if (initialPokemonNumber + i <= Configuration.MAX_NUMBER_OF_POKEMONS) {
                const promise = this.getByNameOrId(initialPokemonNumber + i);
                promises.push(promise);
            }
        }

        return Promise.all(promises).then((pokemonModels) => {
            return pokemonModels.sort((pokemon1, pokemon2) => pokemon1.id > pokemon2.id);
        });
    },

    getByNameOrId(nameOrId) {
        const url = '/pokemon/' + nameOrId;
        return HttpRequest.getRequest(url).then((response) => {
            return new PokemonModel(response.data);
        });
    },

    getMoreInfoById(pokemonId) {
        const url = '/pokemon-species/' + pokemonId;
        return HttpRequest.getRequest(url).then((response) => {
            return new PokemonDetailsModel(response.data);
        });
    },

    getEvolutionChainByURL(url) {
        return HttpRequest.getRequest(url).then((response) => {
            return new PokemonEvolutionChainModel(response.data);
        });
    },
    getPokemonByName(pokemonName) {
        const promises = [];

        const promise = this.getByNameOrId(pokemonName);
        promises.push(promise);

        return Promise.all(promises).then((pokemonModels) => {
            return pokemonModels.sort((pokemon1, pokemon2) => pokemon1.id > pokemon2.id);
        });
    },
    async getFavoritePage(pageNumber, pageSize) {
        const initialPokemonNumber = pageSize * (pageNumber - 1);
        const promises = [];
        let favouritedPokemonList = [];

        await fetch("http://localhost:3001/ids").then(res => res.json()).then(result => {
            for (var i = 0; i < result.length; i++) {
                favouritedPokemonList.push(result[i].id);
            }

            console.log("favouritedPokemonList ", favouritedPokemonList);
        }).then(() => {
            favouritedPokemonList.sort((a, b) => {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            });
        }).then(() => {
            for (let i = 0; i < pageSize; i++) {
                if (initialPokemonNumber + i < favouritedPokemonList.length) {
                    const promise = this.getByNameOrId(favouritedPokemonList[initialPokemonNumber + i]);
                    promises.push(promise);
                }
            }
        }).catch(err => console.log("err ", err));

        return Promise.all(promises).then((pokemonModels) => {
            return pokemonModels.sort((pokemon1, pokemon2) => pokemon1.id > pokemon2.id);
        });
    }
};
