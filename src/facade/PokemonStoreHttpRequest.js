import PokemonHttpRequest from '@/http/PokemonHttpRequest';
import { PokemonTableDataHandler } from '@/store/modules/pokemonTable';
import { ErrorDialogHandler } from '@/store/modules/errorDialog';

export default {
    refreshData(context, sortColumn) {
        const pageNumber = PokemonTableDataHandler.getPageNumber(context);
        const pageSize = PokemonTableDataHandler.getPageSize(context);

        PokemonTableDataHandler.startLoading(context);

        PokemonHttpRequest.getPageByNumberAndSize(pageNumber, pageSize, sortColumn)
            .then((pokemons) => {
                PokemonTableDataHandler.setItems(context, pokemons);
            })
            .catch((error) => {
                ErrorDialogHandler.showError(context, error);
                PokemonTableDataHandler.stopLoading(context);
            })
            .then(() => {
                PokemonTableDataHandler.stopLoading(context);
            });
    },
    getPokemonDataById(context, selectedPokemonId) {
        let pokemonId = 0;
        if (selectedPokemonId == 0) {
            pokemonId = sessionStorage.getItem('selectedPokemon');
        } else {
            pokemonId = selectedPokemonId;
        }

        PokemonHttpRequest.getByNameOrId(pokemonId)
            .then((pokemons) => {
                PokemonTableDataHandler.setSelectedPokemon(context, pokemons);
            })
            .catch((error) => {
                ErrorDialogHandler.showError(context, error);
                PokemonTableDataHandler.stopLoading(context);
            })
            .then(() => {
                PokemonTableDataHandler.stopLoading(context);
            });
    },
    async filterDataByName(context, pokemonName) {
        const pokemonNameStrg = pokemonName.toLowerCase().trim();
        if (pokemonNameStrg.length > 0) {
            const pageNumber = PokemonTableDataHandler.getPageNumber(context);
            const pageSize = PokemonTableDataHandler.getPageSize(context);

            await PokemonTableDataHandler.startLoading(context);

            PokemonHttpRequest.getPokemonByName(pokemonNameStrg, pageNumber, pageSize)
                .then((pokemons) => {
                    PokemonTableDataHandler.setItems(context, pokemons);
                })
                .catch(() => {
                    // ErrorDialogHandler.showError(context, error);
                    PokemonTableDataHandler.stopLoading(context);
                })
                .then(() => {
                    PokemonTableDataHandler.stopLoading(context);
                });
        }
    },
    refreshFavoriteData(context) {
        const pageNumber = PokemonTableDataHandler.getPageNumber(context);
        const pageSize = PokemonTableDataHandler.getPageSize(context);

        PokemonTableDataHandler.startLoading(context);

        PokemonHttpRequest.getFavoritePage(pageNumber, pageSize)
            .then((pokemons) => {
                PokemonTableDataHandler.setItems(context, pokemons);
            })
            .catch((error) => {
                ErrorDialogHandler.showError(context, error);
                PokemonTableDataHandler.stopLoading(context);
            })
            .then(() => {
                PokemonTableDataHandler.stopLoading(context);
            });
    }
};
