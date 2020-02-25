// TODO This config for server
// When build server will enable https
// import fs from 'fs'
// import path from 'path'
const config = require('./config')

module.exports = {
    mode: 'spa',
    /*
     ** Headers of the page
     */
    head: {
        title: 'Company',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || ''
            }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },
    /*
     ** Customize the progress-bar color
     * https://github.com/nuxt/nuxt.js/tree/dev/packages/vue-app/template/views/loading
     */
    loading: '~/components/loading.vue',
    /*
     ** Global CSS
     */
    css: [],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: ['~/plugins/axios'],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://bootstrap-vue.js.org/docs/
        'bootstrap-vue/nuxt',
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/pwa',
        // '@nuxtjs/eslint-module',
        '@nuxtjs/auth',
        '@nuxtjs/proxy',
        [
            'nuxt-fontawesome',
            {
                imports: [
                    {
                        set: '@fortawesome/free-solid-svg-icons',
                        icons: ['fas']
                    },
                    {
                        set: '@fortawesome/free-brands-svg-icons',
                        icons: ['fab']
                    }
                ]
            }
        ]
    ],
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {
        baseURL:
            (process.env.BASE_URL || config.API_HOST ? 'http://' + config.API_HOST + ':' + (config.API_PORT || '8000') : 'http://localhost:8000') +
            '/api/v' +
            (config.API_VERSION || 1) +
            '/',
        API_PREFIX: '/api/v' + (config.API_VERSION || 1) + '/',
        API_HOST: config.API_HOST || 'localhost',
        API_PORT: config.API_PORT || '8000',
        API_URL: config.API_HOST ? 'http://' + config.API_HOST + ':' + (config.API_PORT || '8000') : 'http://localhost:8000'
    },
    /*
     ** UI Server configuration
     */
    server: {
        // TODO This config for server
        // When build server will enable https
        // https: {
        //     key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
        //     cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
        // }
        host: config.HOST || 'localhost',
        port: config.PORT || 3000,
        timing: false
    },
    /*
     ** Environment Variables
     */
    env: {
        baseURL: process.env.BASE_URL || config.API_HOST ? 'http://' + config.API_HOST + ':' + (config.API_PORT || '8000') : 'http://localhost:8000',
        apiBaseUrl: ''
    },
    /*
     ** Build configuration
     */
    build: {
        vendor: ['axios']
    }
}
