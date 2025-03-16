
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { toast } from "@/components/ui/use-toast";

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<User | null> => {
  try {
    // Sign up the user
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
      // Check if email confirmation is required
      if (!data.user.email_confirmed_at) {
        toast({
          title: "Verification email sent",
          description: "Please check your email to verify your account.",
        });
        return null;
      }

      // Return user data
      return {
        id: data.user.id,
        name: name,
        email: data.user.email || "",
        avatar: data.user.user_metadata.avatar_url,
      };
    }
    
    toast({
      title: "Account created",
      description: "Your account has been created successfully.",
    });
    
    return null;
  } catch (error: any) {
    console.error("Registration error:", error);
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
      try {
        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          // If profile doesn't exist but user does, create a default profile
          const defaultProfile = {
            id: data.user.id,
            name: data.user.user_metadata.name || data.user.email?.split('@')[0] || "User",
            email: data.user.email || "",
            avatar: data.user.user_metadata.avatar_url
          };

          // Store user in local state
          localStorage.setItem("currentUser", JSON.stringify(defaultProfile));
          
          toast({
            title: "Welcome!",
            description: "You've successfully logged in.",
          });
          
          return defaultProfile;
        }

        // Profile exists, use that data
        const userData = {
          id: data.user.id,
          name: profileData.name,
          email: data.user.email || "",
          avatar: profileData.avatar,
        };

        // Store user in local state
        localStorage.setItem("currentUser", JSON.stringify(userData));
        
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        
        return userData;
      } catch (profileError) {
        console.error("Error processing user profile:", profileError);
        toast({
          title: "Login issue",
          description: "Logged in but couldn't fetch your profile.",
          variant: "destructive",
        });
        return null;
      }
    }

    return null;
  } catch (error: any) {
    console.error("Login error:", error);
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
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    toast({
      title: "Logout failed",
      description: error.message,
      variant: "destructive",
    });
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // First check local storage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    // If not in local storage, check session
    const { data } = await supabase.auth.getSession();

    if (data && data.session && data.session.user) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return null;
        }

        const userData = {
          id: data.session.user.id,
          name: profileData.name,
          email: data.session.user.email || "",
          avatar: profileData.avatar,
        };

        // Update local storage
        localStorage.setItem("currentUser", JSON.stringify(userData));
        
        return userData;
      } catch (error) {
        console.error("Error processing current user:", error);
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};
