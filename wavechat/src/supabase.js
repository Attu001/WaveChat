import { createClient } from "@supabase/supabase-js";
import { useId } from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// for login user
export async function loginUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { success: false, message: error.message };
    }

    return {
        success: true,
        user: data.user,
        session: data.session,
    };
}

// for getting all user
const getProfiles = async () => {
    const { data, error } = await supabase
        .from("user_profile")
        .select("*");
    if (error) {
        console.log("Fetch error:", error);
        return;
    }

    return data;
};



const getProfileByEmail = async (email) => {
    const { data, error } = await supabase
        .from("user_profile")
        .select("*")
        .eq("email", email)

    if (error) console.log(error);

    return data;
};

const getProfileByUserId = async (id) => {
    const { data, error } = await supabase
        .from("user_profile")
        .select("fullname")
        .eq("id", id)
    if (error){
        return
        console.log(error)
    } ;

    return data;
}

const handleSignup = async (user) => {
    const { fullname, email, password } = user;

    // 1️⃣ Check if email already exists in your profile table
    const existing = await getProfileByEmail(email);
    console.log("Existing user:", existing);


    if (existing && existing.length > 0)  {
        return { success: false, message: "Email already registered!" };
    }

    // 2️⃣ SignUp with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (signUpError) {
        console.log("Signup error:", signUpError);
        return { success: false, message: signUpError.message };
    }

    const userId = signUpData.user?.id;
    console.log(userId)

    // 3️⃣ Insert user profile
    if (userId) {
        const { error: insertError } = await supabase
            .from("user_profile")
            .insert([
                { id: userId, fullname, email }
            ]);

        if (insertError) {
            return { success: false, message: insertError.message };
        }
    }

    return { success: true };
};

const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.log("Error getting session:", error);
        return null;
    }
    return data.session;
};



export { getProfiles, getProfileByEmail, handleSignup , getSession,getProfileByUserId};



