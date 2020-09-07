import axios from 'axios'

export async function getManagementRequestOff(page=1) {
    try {
        const request = await axios.get(`/workday/request/management?page=${page}`)
        return request
    }
    catch(error){
        console.log(error);
        return []
    }
}


export async function getMyRequest(page=1) {
    try {
        const request = await axios.get(`/workday/request/user?page=${page}`)
        return request
    }
    catch(error) {
        console.log(error)
        return []
    }
}


export async function actionRequest(form_data) {
    try {
        let data = await axios.post('/workday/action', form_data)
        return data
    } catch(error) {
        console.log(error)
        return []
    }
}