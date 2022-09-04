import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const uploadImage = async (selectedFile: File) => {
  return await supabase.storage
    .from("images")
    .upload(selectedFile.name, selectedFile);
};

export const getImageUrl = (imageName: string) => {
  const imagePath = `${SUPABASE_URL}/storage/v1/object/public/${imageName}`;
  return imagePath;
};
