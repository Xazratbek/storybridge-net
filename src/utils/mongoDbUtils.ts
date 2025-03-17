
import { Binary } from 'mongodb';
import { client, connectToMongoDB } from '@/integrations/mongodb/client';
import { Memory, MediaItem } from '@/types';
import { toast } from "@/components/ui/use-toast";

// Initialize MongoDB connection
let isConnected = false;

const ensureConnection = async () => {
  if (!isConnected) {
    await connectToMongoDB();
    isConnected = true;
  }
};

// Convert File to Binary data
const fileToBinary = async (file: File): Promise<Binary> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        const binary = new Binary(new Uint8Array(reader.result));
        resolve(binary);
      } else {
        reject(new Error('Failed to convert file to binary'));
      }
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsArrayBuffer(file);
  });
};

// Memory operations
export const saveMemoryToMongoDB = async (memory: Memory, mediaFiles: { id: string, file: File }[] = []): Promise<Memory | null> => {
  try {
    await ensureConnection();
    const db = client.db('memorykeeper');
    const memoriesCollection = db.collection('memories');
    const mediaCollection = db.collection('media');

    // Process media files
    const mediaPromises = mediaFiles.map(async ({ id, file }) => {
      const binary = await fileToBinary(file);
      const mediaDoc = {
        memoryId: memory.id,
        mediaId: id,
        filename: file.name,
        contentType: file.type,
        data: binary,
        createdAt: new Date()
      };
      
      await mediaCollection.insertOne(mediaDoc);
      return {
        id,
        type: file.type.split('/')[0] as 'image' | 'audio' | 'video',
        filename: file.name,
        contentType: file.type
      };
    });

    const processedMedia = await Promise.all(mediaPromises);
    
    // Create memory document
    const memoryDoc = {
      ...memory,
      mediaItems: processedMedia,
      createdAt: new Date(memory.createdAt || new Date()),
      updatedAt: new Date(memory.updatedAt || new Date()),
    };
    
    // Save or update memory
    if (memory.id) {
      // Update existing memory
      await memoriesCollection.updateOne(
        { id: memory.id },
        { $set: memoryDoc },
        { upsert: true }
      );
    } else {
      // Insert new memory
      await memoriesCollection.insertOne(memoryDoc);
    }
    
    return memory;
  } catch (error: any) {
    toast({
      title: "Error saving memory to MongoDB",
      description: error.message,
      variant: "destructive",
    });
    console.error("MongoDB Error:", error);
    return null;
  }
};

export const fetchMemoriesFromMongoDB = async (): Promise<Memory[]> => {
  try {
    await ensureConnection();
    const db = client.db('memorykeeper');
    const memoriesCollection = db.collection('memories');
    
    const memoriesDocs = await memoriesCollection.find({}).toArray();
    
    return memoriesDocs.map(doc => ({
      id: doc.id,
      title: doc.title,
      content: doc.content || "",
      date: doc.date,
      createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: doc.updatedAt?.toISOString() || new Date().toISOString(),
      tags: doc.tags || [],
      category: doc.category || "Uncategorized",
      mediaType: doc.mediaType as 'text' | 'audio' | 'video' | 'image',
      mediaUrl: doc.mediaUrl,
      isPrivate: doc.isPrivate,
      authorId: doc.authorId,
      sharedWith: doc.sharedWith || [],
      mediaItems: doc.mediaItems || []
    }));
  } catch (error: any) {
    toast({
      title: "Error fetching memories from MongoDB",
      description: error.message,
      variant: "destructive",
    });
    console.error("MongoDB Error:", error);
    return [];
  }
};

export const fetchMemoryByIdFromMongoDB = async (id: string): Promise<Memory | null> => {
  try {
    await ensureConnection();
    const db = client.db('memorykeeper');
    const memoriesCollection = db.collection('memories');
    
    const memoryDoc = await memoriesCollection.findOne({ id });
    
    if (!memoryDoc) {
      return null;
    }
    
    return {
      id: memoryDoc.id,
      title: memoryDoc.title,
      content: memoryDoc.content || "",
      date: memoryDoc.date,
      createdAt: memoryDoc.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: memoryDoc.updatedAt?.toISOString() || new Date().toISOString(),
      tags: memoryDoc.tags || [],
      category: memoryDoc.category || "Uncategorized",
      mediaType: memoryDoc.mediaType as 'text' | 'audio' | 'video' | 'image',
      mediaUrl: memoryDoc.mediaUrl,
      isPrivate: memoryDoc.isPrivate,
      authorId: memoryDoc.authorId,
      sharedWith: memoryDoc.sharedWith || [],
      mediaItems: memoryDoc.mediaItems || []
    };
  } catch (error: any) {
    toast({
      title: "Error fetching memory from MongoDB",
      description: error.message,
      variant: "destructive",
    });
    console.error("MongoDB Error:", error);
    return null;
  }
};

export const deleteMemoryFromMongoDB = async (id: string): Promise<boolean> => {
  try {
    await ensureConnection();
    const db = client.db('memorykeeper');
    const memoriesCollection = db.collection('memories');
    const mediaCollection = db.collection('media');
    
    // Delete memory document
    await memoriesCollection.deleteOne({ id });
    
    // Delete all related media
    await mediaCollection.deleteMany({ memoryId: id });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Error deleting memory from MongoDB",
      description: error.message,
      variant: "destructive",
    });
    console.error("MongoDB Error:", error);
    return false;
  }
};

// Get binary media by ID
export const getMediaBinaryById = async (mediaId: string): Promise<{ data: Binary, contentType: string } | null> => {
  try {
    await ensureConnection();
    const db = client.db('memorykeeper');
    const mediaCollection = db.collection('media');
    
    const mediaDoc = await mediaCollection.findOne({ mediaId });
    
    if (!mediaDoc) {
      return null;
    }
    
    return {
      data: mediaDoc.data,
      contentType: mediaDoc.contentType
    };
  } catch (error) {
    console.error("Error fetching media binary:", error);
    return null;
  }
};
