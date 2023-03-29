import PokemonHttpRequest from '@/http/PokemonHttpRequest';
import { PokemonTableDataHandler } from '@/store/modules/pokemonTable';
import { ErrorDialogHandler } from '@/store/modules/errorDialog';

export default {
    refreshData(context) {
        const pageNumber = PokemonTableDataHandler.getPageNumber(context);
        const pageSize = PokemonTableDataHandler.getPageSize(context);

        PokemonTableDataHandler.startLoading(context);

        PokemonHttpRequest.getPageByNumberAndSize(pageNumber, pageSize)
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
    }
};
