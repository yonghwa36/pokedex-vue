<template>
    <div>
        <h1>Pokemon Details</h1>
        <v-card v-if="selectedPokemon != null"><v-card-title>
                <span class="text-h5">
                    {{ selectedPokemon.name }} <span style="color: #c0c0c0">#{{ selectedPokemon.id }}</span>
                </span><v-spacer></v-spacer>
                <v-btn icon>
                    <ShareNetwork network="facebook" url="https://news.vuejs.org/issues/180" title="Say hi to Pokemon!"
                        description="I’d like to introduce you to all the pokemon"
                        quote="Visit this page to know more about Pokemon" hashtags="vuejs,vite" style="color: #1877f2;">
                        <v-icon>mdi-facebook</v-icon>
                    </ShareNetwork>
                    <ShareNetwork network="twitter" url="https://news.vuejs.org/issues/180" title="Say hi to Pokemon!"
                        description="I’d like to introduce you to all the pokemon"
                        quote="Visit this page to know more about Pokemon" hashtags="vuejs,vite" style="color: #1da1f2;">
                        <v-icon>mdi-twitter</v-icon>
                    </ShareNetwork>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="4" md="4">
                            <img :src="selectedPokemon.imageURL" height="96" width="96" /></v-col>

                        <v-col cols="12" sm="4" md="4">
                            <span class="pokemon-point" v-for="point in selectedPokemon.points" :key="point.name">
                                <b>{{ $t('pokemonPointType.' + point.name) }}:</b> {{ point.value }}
                            </span>
                        </v-col>

                        <v-col cols="12" sm="4" md="4">
                            <b>{{ $t('height') }}:</b> {{ selectedPokemon.heightInMeters }} m <br />
                            <b>{{ $t('weight') }}:</b> {{ selectedPokemon.weightInKg }} kg <br />
                            <b>{{ $t('baseExperience') }}:</b> {{ selectedPokemon.baseExperience }}
                        </v-col>

                        <v-col cols="12">
                            <pokemon-type-chip v-for="type in selectedPokemon.types" :type="type.type.name"
                                :key="type.type.name + selectedPokemon.id"></pokemon-type-chip>
                        </v-col>

                        <v-col v-if="hasDescription" cols="12">
                            <b>{{ $t('description') }}</b>
                            <br />
                            {{ description }}
                        </v-col>

                        <v-col cols="12" v-show="hasEvolution">
                            <b>{{ $t('chainOfEvolution') }}</b>
                            <pokemon-evolution-chain :evolutionChain="evolutionChainModel"></pokemon-evolution-chain>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" dark outlined @click="goToPreviousPokemon()">
                    <v-icon left>mdi-arrow-left</v-icon>{{ $t('previous') }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark outlined @click="goToHomePage()">
                    <v-icon left>mdi-home</v-icon>{{ $t('home') }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark outlined @click="goToNextPokemon()">
                    <v-icon left>mdi-arrow-right</v-icon>{{ $t('next') }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import { RouteHandler } from '@/router';
import { PokemonTableDataHandler } from '@/store/modules/pokemonTable';
import PokemonStoreHttpRequest from '@/facade/PokemonStoreHttpRequest';
import { ErrorDialogHandler } from '@/store/modules/errorDialog';
import PokemonHttpRequest from '@/http/PokemonHttpRequest';
import PokemonEvolutionChain from '@/views/PokeDexDetailsView/components/PokemonEvolutionChain.vue';
import PokemonTypeChip from '@/views/PokeDexDetailsView/components/PokemonTypeChip.vue';
export default {
    created() {
        var getSelectedPokemon = PokemonTableDataHandler.getSelectedPokemon(this)
        var selectedPokemonId = 0;
        if (getSelectedPokemon != null) {
            selectedPokemonId = getSelectedPokemon.id;
        } else {
            selectedPokemonId = sessionStorage.getItem('selectedPokemon');
        }
        PokemonStoreHttpRequest.getPokemonDataById(this, selectedPokemonId);
        this.refreshInformations();

    },
    components: {
        'pokemon-evolution-chain': PokemonEvolutionChain,
        'pokemon-type-chip': PokemonTypeChip
    },
    data: () => ({
        pokemonDetailsModel: null,
        evolutionChainModel: null,
        nextPokemonId: 0,
        previousPokemonId: 0
    }),
    computed: {
        pokemonId() {
            if (this.selectedPokemon == null) {
                return null;
            }
            return this.selectedPokemon.id;
        },
        hasDescription() {
            return this.description != null;
        },
        description() {
            if (this.pokemonDetailsModel == null) {
                return null;
            }

            return this.pokemonDetailsModel.getDescription();
        },

        hasEvolution() {
            return this.evolutionChainModel != null && this.evolutionChainModel.hasEvolution();
        },
        selectedPokemon() {
            return PokemonTableDataHandler.getSelectedPokemon(this);
        }
    },
    watch: {
        value(visible) {
            if (!visible) {
                this.pokemonDetailsModel = null;
                this.evolutionChainModel = null;
            } else {
                this.refreshInformations();
            }
        },

    },
    methods: {
        refreshInformations() {
            if (this.pokemonId != null) {
                PokemonHttpRequest.getMoreInfoById(this.pokemonId)
                    .then((pokemonDetailsModel) => {
                        this.pokemonDetailsModel = pokemonDetailsModel;
                        this.refreshEvolutionChain();
                    })
                    .catch((error) => {
                        ErrorDialogHandler.showError(this, error);
                    });
            }
        },

        refreshEvolutionChain() {
            if (this.pokemonDetailsModel != null) {
                const url = this.pokemonDetailsModel.getEvolutionChainURL();
                PokemonHttpRequest.getEvolutionChainByURL(url)
                    .then((evolutionChainModel) => {
                        this.evolutionChainModel = evolutionChainModel;
                    })
                    .catch((error) => {
                        ErrorDialogHandler.showError(this, error);
                    });
            }
        },
        goToHomePage() {
            RouteHandler.goToHomePage(this);
        },
        goToPreviousPokemon() {
            this.nextPokemonId = this.pokemonId - 1;
            PokemonStoreHttpRequest.getPokemonDataById(this, this.nextPokemonId);

            this.refreshInformations();
        },
        goToNextPokemon() {
            this.nextPokemonId = this.pokemonId + 1;
            PokemonStoreHttpRequest.getPokemonDataById(this, this.nextPokemonId);

            this.refreshInformations();
        }
    }
};
</script>
<style scoped>
.pokemon-point::after {
    content: '\a';
    white-space: pre;
}
</style>