// eslint-disable-next-line id-match
const Cookie = process.client ? require('js-cookie') : undefined
export default function({ $axios }) {
    // eslint-disable-next-line id-match
    $axios.onRequest((config) => {
        // eslint-disable-next-line dot-notation
        // sessionStorage.getItem('token')
        config.headers.common['Authorization'] = Cookie.get('token')
        return config
    })
}