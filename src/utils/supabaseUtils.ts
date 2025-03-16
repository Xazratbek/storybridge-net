
import { supabase } from "@/integrations/supabase/client";
import { Memory, Prompt, Category, Tag, Profile } from "@/types";
import { toast } from "@/components/ui/use-toast";

// Memory operations
export const fetchMemories = async (): Promise<Memory[]> => {
  try {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      throw error;
    }

    return data.map((memory) => ({
      id: memory.id,
      title: memory.title,
      content: memory.content || "",
      date: memory.date,
      createdAt: memory.created_at,
      updatedAt: memory.updated_at,
      tags: memory.tags || [],
      category: memory.category || "Uncategorized",
      mediaType: memory.media_type as 'text' | 'audio' | 'video',
      mediaUrl: memory.media_url,
      isPrivate: memory.is_private,
      authorId: memory.author_id,
      sharedWith: memory.shared_with || [],
    }));
  } catch (error: any) {
    toast({
      title: "Error fetching memories",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

export const fetchMemoryById = async (id: string): Promise<Memory | null> => {
  try {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content || "",
      date: data.date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      tags: data.tags || [],
      category: data.category || "Uncategorized",
      mediaType: data.media_type as 'text' | 'audio' | 'video',
      mediaUrl: data.media_url,
      isPrivate: data.is_private,
      authorId: data.author_id,
      sharedWith: data.shared_with || [],
    };
  } catch (error: any) {
    toast({
      title: "Error fetching memory",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const createMemory = async (memory: Omit<Memory, "id" | "createdAt" | "updatedAt">): Promise<Memory | null> => {
  try {
    const { data, error } = await supabase
      .from("memories")
      .insert({
        title: memory.title,
        content: memory.content,
        date: memory.date,
        tags: memory.tags,
        category: memory.category,
        media_type: memory.mediaType,
        media_url: memory.mediaUrl,
        is_private: memory.isPrivate,
        author_id: memory.authorId,
        shared_with: memory.sharedWith,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content || "",
      date: data.date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      tags: data.tags || [],
      category: data.category || "Uncategorized",
      mediaType: data.media_type as 'text' | 'audio' | 'video',
      mediaUrl: data.media_url,
      isPrivate: data.is_private,
      authorId: data.author_id,
      sharedWith: data.shared_with || [],
    };
  } catch (error: any) {
    toast({
      title: "Error creating memory",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const updateMemory = async (memory: Memory): Promise<Memory | null> => {
  try {
    const { data, error } = await supabase
      .from("memories")
      .update({
        title: memory.title,
        content: memory.content,
        date: memory.date,
        tags: memory.tags,
        category: memory.category,
        media_type: memory.mediaType,
        media_url: memory.mediaUrl,
        is_private: memory.isPrivate,
        shared_with: memory.sharedWith,
      })
      .eq("id", memory.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content || "",
      date: data.date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      tags: data.tags || [],
      category: data.category || "Uncategorized",
      mediaType: data.media_type as 'text' | 'audio' | 'video',
      mediaUrl: data.media_url,
      isPrivate: data.is_private,
      authorId: data.author_id,
      sharedWith: data.shared_with || [],
    };
  } catch (error: any) {
    toast({
      title: "Error updating memory",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const deleteMemory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("memories")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error: any) {
    toast({
      title: "Error deleting memory",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

// Prompt operations
export const fetchPrompts = async (): Promise<Prompt[]> => {
  try {
    const { data, error } = await supabase
      .from("prompts")
      .select("*");

    if (error) {
      throw error;
    }

    return data.map((prompt) => ({
      id: prompt.id,
      question: prompt.question,
      category: prompt.category || "",
    }));
  } catch (error: any) {
    toast({
      title: "Error fetching prompts",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

// Category operations
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*");

    if (error) {
      throw error;
    }

    return data.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description || "",
    }));
  } catch (error: any) {
    toast({
      title: "Error fetching categories",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

// Tag operations
export const fetchTags = async (): Promise<Tag[]> => {
  try {
    const { data, error } = await supabase
      .from("tags")
      .select("*");

    if (error) {
      throw error;
    }

    return data.map((tag) => ({
      id: tag.id,
      name: tag.name,
    }));
  } catch (error: any) {
    toast({
      title: "Error fetching tags",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

// Profile operations
export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    };
  } catch (error: any) {
    toast({
      title: "Error fetching profile",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

// File storage operations
export const uploadFile = async (file: File, path: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error } = await supabase.storage
      .from("memories")
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("memories")
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error: any) {
    toast({
      title: "Error uploading file",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const deleteFile = async (path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from("memories")
      .remove([path]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error: any) {
    toast({
      title: "Error deleting file",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};
