import Vue from 'vue';
import VueRouter from 'vue-router';
import PokeDexView from '../views/PokeDexView/PokeDexView.vue';
import FavouritedPokeDexView from '../views/FavouritedPokeDexView/FavouritedPokeDexView.vue';
import PokeDexDetailsView from '../views/PokeDexDetailsView/PokeDexDetailsView.vue';

Vue.use(VueRouter);

const Route = {
    HOME: '/',
    ABOUT: '/about',
    FAVORITED: '/favorited',
    DETAILS: '/details'
};

const routes = [
    {
        path: Route.HOME,
        name: 'PokeDexView',
        component: PokeDexView
    },
    {
        path: Route.ABOUT,
        name: 'AboutView',
        component: () => import('../views/AboutView.vue')
    },
    {
        path: Route.FAVORITED,
        name: 'FavouritedPokeDexView',
        component: FavouritedPokeDexView
    },
    {
        path: Route.DETAILS,
        name: 'PokeDexDetailsView',
        component: PokeDexDetailsView
    },
    { path: '/:pathMatch(.*)*', component: PokeDexView }
];

const router = new VueRouter({
    routes
});

export default router;

export const RouteHandler = {
    goToHomePage(context) {
        goToRouteIfNotThereYet(context, Route.HOME);
    },

    goToAboutPage(context) {
        goToRouteIfNotThereYet(context, Route.ABOUT);
    },
    goToFavoritedPage(context) {
        goToRouteIfNotThereYet(context, Route.FAVORITED);
    },
    goToDetailsPage(context) {
        goToRouteIfNotThereYet(context, Route.DETAILS);
    }
};

const goToRouteIfNotThereYet = (context, route) => {
    if (context.$route.path != route) {
        context.$router.push(route);
    }
};
