
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type MediaItem = {
  type: 'image' | 'audio' | 'video' | 'text';
  url?: string;
  title?: string;
  content?: string;
};

export type Memory = {
  id: string;
  title: string;
  content: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
  mediaType: 'text' | 'audio' | 'video' | 'image';
  mediaUrl?: string;
  isPrivate: boolean;
  authorId: string;
  sharedWith: string[];
  mediaItems?: MediaItem[];
};

export type Prompt = {
  id: string;
  question: string;
  category: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Tag = {
  id: string;
  name: string;
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};
