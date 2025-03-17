
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import { Memory } from '@/types';
import { useNavigate } from 'react-router-dom';

type TimelineTabProps = {
  memories: Memory[];
};

const TimelineTab = ({ memories }: TimelineTabProps) => {
  const navigate = useNavigate();

  if (memories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-purple-100">
        <h2 className="text-xl font-medium text-purple-800 mb-4 font-serif">Memory Timeline</h2>
        <div className="text-center p-8">
          <div className="mb-4 bg-purple-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            <Calendar className="h-8 w-8 text-purple-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No memories to display</h3>
          <p className="text-gray-500 mb-6">
            Create memories to see them on your timeline.
          </p>
          <Button 
            onClick={() => navigate("/memory/new")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Memory
          </Button>
        </div>
      </div>
    );
  }

  // Group memories by year
  const memoriesByYear = memories.reduce((acc, memory) => {
    const year = new Date(memory.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(memory);
    return acc;
  }, {} as Record<number, Memory[]>);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-purple-100">
      <h2 className="text-xl font-medium text-purple-800 mb-4 font-serif">Memory Timeline</h2>
      <p className="text-gray-600 mb-6">
        View your memories in chronological order.
      </p>
      
      <div className="space-y-6">
        {Object.entries(memoriesByYear)
          .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
          .map(([year, yearMemories]) => (
            <div key={year}>
              <h3 className="text-lg font-medium text-purple-700 mb-4">{year}</h3>
              <div className="timeline-container">
                {yearMemories
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((memory) => (
                    <div key={memory.id} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-date">{new Date(memory.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
                      <h4 className="font-medium text-gray-900 mt-1 mb-1">{memory.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{memory.content}</p>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-purple-700 hover:bg-purple-50 p-0"
                        asChild
                      >
                        <Link to={`/memory/${memory.id}`}>View memory</Link>
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TimelineTab;
