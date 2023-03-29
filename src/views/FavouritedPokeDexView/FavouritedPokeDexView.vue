<template>
    <div>
        <h2>Favorite Pokemon</h2>
    </div>
</template>

<script>
export default {
    components: {
    },
    async created() {
        await fetch("http://localhost:3001/ids").then(res => res.json()).then(result => {
            for (var i = 0; i < result.length; i++) {
                this.favouritedPokemonList.push(result[i].id);
            }
        }).catch(err => console.log("err ", err))
    },

    data() {
        return { favouritedPokemonList: [] };
    },

    methods: {
    }
};
</script>
