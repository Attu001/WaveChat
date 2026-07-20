import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rdvmbrlhgwgefposupvq.supabase.co";
const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkdm1icmxoZ3dnZWZwb3N1cHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNTgzMzQsImV4cCI6MjA3OTYzNDMzNH0.EWjxVAzcr1tBX_Mn6SmJjpf17Ro4KsZt5K4wsISUkw8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a profile picture to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export const uploadProfilePic = async (file, userId) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { data, error } = await supabase.storage
        .from("profile-pics")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
        });

    if (error) {
        console.error("Upload error:", error);
        throw error;
    }

    // Get the public URL
    const {
        data: { publicUrl },
    } = supabase.storage.from("profile-pics").getPublicUrl(filePath);

    return publicUrl;
};
