<template>
    <v-app-bar app color="red" dark>
        <div class="d-flex align-center">
            <v-toolbar-title @click="onClickGoToHome()">{{ $t('pokedex') }}</v-toolbar-title>
        </div>
        <v-spacer></v-spacer>
        <v-menu left bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" outlined @click="onClickGoToFavorite()">
                    {{ $t('favorite') }}
                </v-btn>
            </template>
        </v-menu>
    </v-app-bar>
</template>

<script>
import InternationalizationHandler from '@/handlers/InternationalizationHandler';
import { RouteHandler } from '@/router';

export default {
    computed: {
        idioms() {
            return InternationalizationHandler.getIdioms();
        },

        currentIdiomText() {
            return InternationalizationHandler.getCurrentIdiomText();
        }
    },

    methods: {
        selectIdiom(idiom) {
            InternationalizationHandler.setLocale(idiom.locale);
        },

        getIconByIdiom(idiom) {
            if (this.isCurrentIdiom(idiom)) {
                return 'mdi-radiobox-marked';
            }
            return 'mdi-radiobox-blank';
        },

        isCurrentIdiom(idiom) {
            return InternationalizationHandler.getCurrentLocale() === idiom.locale;
        },

        onClickInfoIconButton() {
            RouteHandler.goToAboutPage(this);
        },

        onClickGoToHome() {
            RouteHandler.goToHomePage(this);
        },

        onClickGoToFavorite() {
            RouteHandler.goToFavoritedPage(this);
        }
    }
};
</script>
