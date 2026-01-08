import axios from 'axios'

// export const base_url = "http://localhost:8000/"
export const ws_url="ws://wavechat-backend-renderer.onrender.com/ws/chat/"
export const base_url="https://wavechat-backend-renderer.onrender.com/"

// export const ws_url ="ws://localhost:8000/"


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
        return e    
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
        const response = await axios.get(base_url + "auth/all_users/")
        return response.data
    } catch (e) {
        console.log(e)
        return e
    }

}


export const getProfileByUserId = async (id) => {
    try {
        const response = await axios.post(base_url+"auth/profile/",{"id":id})
        return response.data
    } catch (e) {
        console.log(e)
        return
    }
}


// export const getWebSocketConnection=(userId1,userId2)=>{
//     try{
//         const newWebSocketConnect= new WebSocket(WebSocket_url+`${userId1}+${userId2}/`)
//         console.log("connected to websocket")
//     }catch(e){
//         console.log(e)
//         console.log("error to connect the websocket")

//     }
// }

