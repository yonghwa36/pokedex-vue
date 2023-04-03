import HttpRequest from './HttpRequest';
import Configuration from '@/Configuration';
import PokemonDetailsModel from '@/model/PokemonDetailsModel';
import PokemonModel from '@/model/PokemonModel';
import PokemonEvolutionChainModel from '@/model/PokemonEvolutionChainModel';
PokemonModel;

export default {
    getPageByNumberAndSize(pageNumber, pageSize, sortColumn) {
        const initialPokemonNumber = pageSize * (pageNumber - 1) + 1;
        const promises = [];

        for (let i = 0; i < pageSize; i++) {
            if (initialPokemonNumber + i <= Configuration.MAX_NUMBER_OF_POKEMONS) {
                const promise = this.getByNameOrId(initialPokemonNumber + i);
                promises.push(promise);
            }
        }

        return Promise.all(promises).then((pokemonModels) => {
            if (sortColumn != undefined && sortColumn != '') {
                var sortOrder = 1;
                if (sortColumn[0] === "-") {
                    sortOrder = -1;
                    sortColumn = sortColumn.substr(1);
                }
                if (sortColumn === 'id' || sortColumn === '-id') {

                    return pokemonModels.sort((pokemon1, pokemon2) => {
                        var result = pokemon1.id < pokemon2.id ? -1 : pokemon1.id > pokemon2.id ? 1 : 0;
                        return result * sortOrder;
                    });

                } else if (sortColumn === 'name' || sortColumn === '-name') {
                    return pokemonModels.sort((pokemon1, pokemon2) => {
                        var result = pokemon1.name < pokemon2.name ? -1 : pokemon1.name > pokemon2.name ? 1 : 0;
                        return result * sortOrder;
                    });
                } else if (sortColumn === 'hp' || sortColumn === '-hp') {
                    return pokemonModels.sort((pokemon1, pokemon2) => {
                        var result = pokemon1.points[0].value < pokemon2.points[0].value ? -1 : pokemon1.points[0].value > pokemon2.points[0].value ? 1 : 0;
                        return result * sortOrder;
                    });
                } else if (sortColumn === 'attack' || sortColumn === '-attack') {
                    return pokemonModels.sort((pokemon1, pokemon2) => {
                        var result = pokemon1.points[1].value < pokemon2.points[1].value ? -1 : pokemon1.points[1].value > pokemon2.points[1].value ? 1 : 0;
                        return result * sortOrder;
                    });
                } else if (sortColumn === 'defense' || sortColumn === '-defense') {
                    return pokemonModels.sort((pokemon1, pokemon2) => {
                        var result = pokemon1.points[2].value < pokemon2.points[2].value ? -1 : pokemon1.points[2].value > pokemon2.points[2].value ? 1 : 0;
                        return result * sortOrder;
                    });
                }
            }

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
