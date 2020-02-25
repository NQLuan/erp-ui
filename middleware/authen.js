const Cookie = process.client ? require('js-cookie') : undefined
export default function({ redirect }) {
    // If the user is not authenticated
    if (Cookie.get('token') === undefined) {
        redirect('/login')
    }
}
