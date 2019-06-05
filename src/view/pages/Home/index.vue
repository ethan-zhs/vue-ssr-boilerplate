<template>
    <div :class="$style.wrapper">
        Hello World
    </div>
</template>
<script>

import { createNamespacedHelpers } from 'vuex';
import homeStore from './store';

// 模块命名空间添加
const { mapGetters, mapActions } = createNamespacedHelpers('home');

export default {
    name: 'home',

    data() {
        return {
            
        };
    },

    create() {
        
    },

    mounted() {
        
    },
    
    methods: {

    }
};
</script>
<style lang="stylus" module>
    @import 'index.less'
</style>