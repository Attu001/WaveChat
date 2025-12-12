import axios from 'axios'

export const base_url = "http://localhost:8000/"

// const base_url=

//getting all Users

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(base_url + "auth/login/", {
            email: email,
            password: password
        })
        return response.data
    } catch (e) {
        console.log(e)
        throw e
    }
}


export const registerUser = async (name, email, password) => {

    const response = await axios.post(base_url + "auth/register/", {
        name,
        email,
        password
    })
    return response

}

export const allUsers = async () => {
    try {
        const response = await axios.get(base_url + "api/users")
        return response.data
    } catch (e) {
        console.log(e)
        return
    }

}


export const getProfileByUserId = async (id) => {
    try {
        const response = await axios.get(base_url + `api/singleuser/${id}`)
        return response.data
    } catch (e) {
        console.log(e)
        return
    }
}

