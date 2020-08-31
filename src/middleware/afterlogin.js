const Cookie = require('js-cookie')
export default function({ redirect }) {
    if (Cookie.get('token') !== undefined) {
        redirect('/')
    }
}
