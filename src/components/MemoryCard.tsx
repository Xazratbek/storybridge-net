
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Memory } from '@/types';
import { Edit, Trash, Lock, Users, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

interface MemoryCardProps {
  memory: Memory;
  onDelete?: (id: string) => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onDelete }) => {
  const { id, title, content, date, tags, category, mediaType, mediaUrl, isPrivate } = memory;
  
  const formattedDate = date ? format(parseISO(date), 'MMM d, yyyy') : null;
  const truncatedContent = content && content.length > 150 
    ? `${content.substring(0, 150)}...` 
    : content;
  
  // Extract media items if available
  const mediaItems = memory.mediaItems ? 
    (typeof memory.mediaItems === 'string' ? JSON.parse(memory.mediaItems) : memory.mediaItems) 
    : [];
  
  // Get first image for preview if available
  const previewImage = mediaItems?.find((item: any) => item.type === 'image' && item.url)?.url;
  
  // Check if memory has audio or video
  const hasAudio = mediaItems?.some((item: any) => item.type === 'audio' && item.url);
  const hasVideo = mediaItems?.some((item: any) => item.type === 'video' && item.url);
  
  return (
    <Card className="memory-card h-full flex flex-col transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-serif text-purple-800 line-clamp-2">
            {title}
          </CardTitle>
          {isPrivate && (
            <Lock className="h-4 w-4 text-purple-500 shrink-0" />
          )}
        </div>
        <div className="flex items-center text-sm text-purple-600 mt-1">
          <Calendar className="h-3 w-3 mr-1" />
          {formattedDate}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pb-4">
        {previewImage && (
          <div className="aspect-video w-full mb-3 rounded-md overflow-hidden bg-purple-50">
            <img 
              src={previewImage} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {!previewImage && mediaUrl && mediaType === 'image' && (
          <div className="aspect-video w-full mb-3 rounded-md overflow-hidden bg-purple-50">
            <img 
              src={mediaUrl} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <p className="text-gray-600 line-clamp-3 mb-3">
          {truncatedContent || 'No description provided.'}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {hasAudio && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              Audio
            </span>
          )}
          {hasVideo && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              Video
            </span>
          )}
          {category && category !== 'Uncategorized' && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              {category}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {tags && tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded-full border border-purple-100"
            >
              {tag}
            </span>
          ))}
          {tags && tags.length > 3 && (
            <span className="text-xs text-purple-400">
              +{tags.length - 3} more
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t border-purple-100">
        <div className="flex justify-between w-full">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-purple-700 hover:bg-purple-50"
            asChild
          >
            <Link to={`/memory/${id}`}>
              View
            </Link>
          </Button>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-700 hover:bg-purple-50"
              asChild
            >
              <Link to={`/memory/edit/${id}`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={() => onDelete(id)}
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MemoryCard;
