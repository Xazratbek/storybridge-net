
import { Memory } from "@/types";
import { format } from "date-fns";
import { useState } from "react";
import MemoryCard from "@/components/MemoryCard";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TimelineProps {
  memories: Memory[];
  onMemoryClick: (memory: Memory) => void;
}

const Timeline = ({ memories, onMemoryClick }: TimelineProps) => {
  const [expandedYear, setExpandedYear] = useState<string | null>(null);
  
  // Sort memories by date
  const sortedMemories = [...memories].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Group memories by year
  const memoriesByYear: Record<string, Memory[]> = {};
  
  sortedMemories.forEach(memory => {
    const year = format(new Date(memory.date), "yyyy");
    if (!memoriesByYear[year]) {
      memoriesByYear[year] = [];
    }
    memoriesByYear[year].push(memory);
  });
  
  // Get years in descending order
  const years = Object.keys(memoriesByYear).sort((a, b) => parseInt(b) - parseInt(a));
  
  const toggleYear = (year: string) => {
    if (expandedYear === year) {
      setExpandedYear(null);
    } else {
      setExpandedYear(year);
    }
  };
  
  return (
    <div className="space-y-8 py-4">
      {years.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed border-indigo-200 rounded-lg">
          <p className="text-muted-foreground">No memories in your timeline yet.</p>
        </div>
      ) : (
        years.map(year => (
          <div key={year} className="border-l-2 border-indigo-200 pl-4">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center text-xl font-serif font-semibold text-indigo-800"
                onClick={() => toggleYear(year)}
              >
                {year}
                {expandedYear === year ? 
                  <ChevronUp className="ml-2 h-4 w-4" /> : 
                  <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
            </div>
            
            {expandedYear === year && (
              <div className="space-y-6 ml-4">
                {memoriesByYear[year].map(memory => (
                  <div key={memory.id} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-date mb-2">
                      {format(new Date(memory.date), "MMMM d")}
                    </div>
                    <MemoryCard 
                      memory={memory}
                      onClick={onMemoryClick}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Timeline;
