const Cookie = require('js-cookie')
export default function({ redirect }) {
    // If the user is not authenticated
    if (Cookie.get('token') === undefined) {
        redirect('/login')
    }
}
