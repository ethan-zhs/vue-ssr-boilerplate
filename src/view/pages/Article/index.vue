<template>
    <div @click="testAction" :class="$style.wrapper">
        <h1 :class="$style.title">{{news.title}}</h1>
        <div :class="$style['article-content']" v-html="content"></div>
    </div>
</template>
<script>

import { createNamespacedHelpers } from 'vuex';
import prefetchApi from '../../utils/prefetchUtil';
import headMixin from '../../mixin/headMixin';

// 模块命名空间添加
const { mapGetters, mapActions } = createNamespacedHelpers('article');

export default {
    name: 'article-news',

    mixins: [headMixin],

    head() {
        return {
            title: this.news.title,
            description: this.news.summary
        };
    },


    asyncData({ store, route }) {
        const callList = [
            { action: 'article/getNewsContent', payload: route.params.id }
        ];

        return prefetchApi(store, callList);
    },

    data() {
        return {
            
        };
    },

    destroyed() {
        this.$store.unregisterModule('article');
    },

    computed: {
        ...mapGetters([
            'requesting',
            'news',
            'content'
        ])
    },

    create() {
        
    },

    mounted() {
        console.log(this.$store);
    },
    
    methods: {
        ...mapActions({
            testAction: 'testAction'
        })
    }
};
</script>
<style lang="stylus" module>
    @import 'index.less'
</style>