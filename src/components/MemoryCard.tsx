import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Memory } from '@/types';
import { Edit, Trash2, Eye, Calendar, Bookmark, Lock, Tag, Music, Film, Image } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getMediaBinaryById } from '@/utils/mongoDbUtils';

type MemoryCardProps = {
  memory: Memory;
  onDelete: (id: string) => void;
};

const MemoryCard = ({ memory, onDelete }: MemoryCardProps) => {
  const navigate = useNavigate();
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  
  // Convert binary data to URL for display if needed
  useEffect(() => {
    const loadMediaBinary = async () => {
      if (memory.mediaItems && memory.mediaItems.length > 0) {
        const firstMedia = memory.mediaItems[0];
        
        if (firstMedia.url) {
          setMediaUrl(firstMedia.url);
        } else if (firstMedia.id) {
          const binary = await getMediaBinaryById(firstMedia.id);
          if (binary) {
            // Convert binary data to blob URL
            const blob = new Blob([binary.data.buffer], { type: binary.contentType });
            const url = URL.createObjectURL(blob);
            setMediaUrl(url);
            
            // Clean up the blob URL when component unmounts
            return () => {
              URL.revokeObjectURL(url);
            };
          }
        }
      } else if (memory.mediaUrl) {
        setMediaUrl(memory.mediaUrl);
      }
    };
    
    loadMediaBinary();
  }, [memory]);

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'audio':
        return <Music className="mr-2 h-4 w-4" />;
      case 'video':
        return <Film className="mr-2 h-4 w-4" />;
      case 'image':
        return <Image className="mr-2 h-4 w-4" />;
      default:
        return <BookText className="mr-2 h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Unknown Date';
    }
  };
  
  // Render the media based on mediaType
  const renderMedia = () => {
    if (!mediaUrl) return null;
    
    if (memory.mediaType === 'image') {
      return (
        <div className="relative aspect-video rounded-md overflow-hidden mb-3">
          <img 
            src={mediaUrl} 
            alt={memory.title} 
            className="w-full h-full object-cover"
          />
        </div>
      );
    } else if (memory.mediaType === 'audio') {
      return (
        <div className="mb-3">
          <audio controls className="w-full">
            <source src={mediaUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    } else if (memory.mediaType === 'video') {
      return (
        <div className="relative aspect-video rounded-md overflow-hidden mb-3">
          <video controls className="w-full h-full object-cover">
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video element.
          </video>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-purple-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-medium text-purple-800">{memory.title}</CardTitle>
        <div className="flex items-center space-x-2">
          {memory.isPrivate ? (
            <Lock className="h-4 w-4 text-gray-500" title="Private Memory" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" title="Public Memory" />
          )}
        </div>
      </CardHeader>
      <CardContent className="py-3 text-gray-700">
        {renderMedia()}
        <p>{memory.content.length > 100 ? `${memory.content.substring(0, 100)}...` : memory.content}</p>
        <div className="flex flex-wrap mt-2">
          {memory.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="mr-1 mb-1 text-purple-600 bg-purple-50 border-purple-200">
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center py-3">
        <div className="flex items-center text-gray-500">
          <Calendar className="mr-2 h-4 w-4" />
          <span className="text-sm">{formatDate(memory.date)}</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/memory/edit/${memory.id}`)}
            className="text-blue-500 hover:bg-blue-50"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(memory.id)}
            className="text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MemoryCard;
