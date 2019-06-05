function getHead(vm) {
    // 组件可以提供一个 `title` 选项
    // 此选项可以是一个字符串或函数
    const { head } = vm.$options;
    if (head) {
        return typeof head === 'function'
            ? head.call(vm)
            : head;
    }

    return { 
        title: '触电新闻', 
        description: '触电新闻' 
    };
}
  
const serverTitleMixin = {
    created() {
        const head = getHead(this);
        if (head) {
            this.$ssrContext.title = head.title;
            this.$ssrContext.meta = `<meta name="description" content="${head.description}" />`;
        }
    }
};
  
const clientTitleMixin = {
    mounted() {
        const head = getHead(this);
        if (head) {
            document.title = head.title;
        }
    }
};
  
// 可以通过 `webpack.DefinePlugin` 注入 `VUE_ENV`
export default process.env.VUE_ENV === 'server'
    ? serverTitleMixin
    : clientTitleMixin;
