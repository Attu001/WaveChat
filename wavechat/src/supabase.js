import { createClient } from "@supabase/supabase-js";

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
        .from("users_profile")
        .select("*");

    if (error) {
        console.log("Fetch error:", error);
        return;
    }

    console.log("Profiles:", data);
};



const getProfileByEmail = async (email) => {
    const { data, error } = await supabase
        .from("user_profile")
        .select("*")
        .eq("email", email)

    if (error) console.log(error);

    return data;
};

const handleSignup = async (user) => {
    const { fullname, email, password } = user;

    // 1️⃣ Check if email already exists in your profile table
    const existing = await getProfileByEmail(email);
    console.log("Existing user:", existing);


    if (existing !== null) {
        return { success: false, message: "Email already registered!" };
    }

    // 2️⃣ SignUp with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (signUpError) {
        return { success: false, message: signUpError.message };
    }

    const userId = signUpData.user?.id;

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



export { getProfiles, getProfileByEmail, handleSignup };



