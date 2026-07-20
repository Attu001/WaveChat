import axios from 'axios'


const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const base_url = isLocalhost
  ? "http://localhost:8000/"
  : "https://wavechat-backend-renderer.onrender.com/";

const ws_url = isLocalhost
  ? "ws://localhost:8000/"
  : "wss://wavechat-backend-renderer.onrender.com/";

export { base_url, ws_url };






//getting all Users
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(base_url + "auth/login/", {
            email: email,
            password: password
        })
        return response.data
    } catch (e) {
        console.error("Login error:", e)
        throw e
    }
}


export const registerUser = async (name, email, password) => {
    try {
        const response = await axios.post(base_url + "auth/register/", {
            name,
            email,
            password
        })
        return response.data
    } catch (e) {
        console.error("Registration error:", e)
        throw e
    }
}

export const allUsers = async () => {
    try {
        const response = await axios.get(base_url + "auth/all_users/")
        return response.data
    } catch (e) {
        console.error("Fetch users error:", e)
        throw e
    }
}
























