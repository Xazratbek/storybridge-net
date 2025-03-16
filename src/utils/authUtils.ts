
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { toast } from "@/components/ui/use-toast";

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      return {
        id: data.user.id,
        name: name,
        email: data.user.email || "",
        avatar: data.user.user_metadata.avatar_url,
      };
    }
    
    toast({
      title: "Verification email sent",
      description: "Please check your email to verify your account.",
    });
    
    return null;
  } catch (error: any) {
    toast({
      title: "Registration failed",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        id: data.user.id,
        name: profileData.name,
        email: data.user.email || "",
        avatar: profileData.avatar,
      };
    }

    return null;
  } catch (error: any) {
    toast({
      title: "Login failed",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    localStorage.removeItem("currentUser");
  } catch (error: any) {
    toast({
      title: "Logout failed",
      description: error.message,
      variant: "destructive",
    });
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await supabase.auth.getSession();

    if (data && data.session && data.session.user) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.session.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        id: data.session.user.id,
        name: profileData.name,
        email: data.session.user.email || "",
        avatar: profileData.avatar,
      };
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};
