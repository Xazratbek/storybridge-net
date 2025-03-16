
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Memory } from "@/types";
import { Calendar, Lock, Share2 } from "lucide-react";
import { format } from "date-fns";

interface MemoryCardProps {
  memory: Memory;
  onClick?: () => void;
}

const MemoryCard = ({ memory, onClick }: MemoryCardProps) => {
  const formattedDate = memory.date ? format(new Date(memory.date), "MMMM d, yyyy") : "";
  const truncatedContent = memory.content.length > 150 
    ? memory.content.substring(0, 150) + "..." 
    : memory.content;
    
  return (
    <Card 
      className="memory-card cursor-pointer hover:translate-y-[-4px] transition-all duration-300"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-serif font-semibold text-memory-dark">{memory.title}</h3>
          {memory.isPrivate ? (
            <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-600 border-red-200">
              <Lock className="h-3 w-3" />
              Private
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-600 border-green-200">
              <Share2 className="h-3 w-3" />
              Shared
            </Badge>
          )}
        </div>
        <div className="flex items-center text-sm text-muted-foreground pt-1">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formattedDate}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{truncatedContent}</p>
      </CardContent>
      <CardFooter className="pt-0 flex flex-wrap gap-2">
        {memory.tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="bg-memory-light/30 text-memory-dark hover:bg-memory-light/50">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
};

export default MemoryCard;
