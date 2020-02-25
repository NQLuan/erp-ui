const Cookie = process.client ? require('js-cookie') : undefined
export default function({ redirect }) {
    if (Cookie.get('token') !== undefined) {
        redirect('/')
    }
}
