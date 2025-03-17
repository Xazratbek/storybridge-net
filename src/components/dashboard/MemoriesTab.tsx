
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, BookText } from 'lucide-react';
import MemoryCard from '@/components/MemoryCard';
import { Memory } from '@/types';
import { useNavigate } from 'react-router-dom';

type MemoriesTabProps = {
  memories: Memory[];
  onDeleteIntent: (id: string) => void;
};

const MemoriesTab = ({ memories, onDeleteIntent }: MemoriesTabProps) => {
  const navigate = useNavigate();

  if (memories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-purple-100">
        <div className="mb-4 bg-purple-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
          <BookText className="h-8 w-8 text-purple-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No memories found</h3>
        <p className="text-gray-500 mb-6">
          Start preserving your precious memories today.
        </p>
        <Button 
          onClick={() => navigate("/memory/new")}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Memory
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {memories.map((memory) => (
        <MemoryCard 
          key={memory.id} 
          memory={memory} 
          onDelete={onDeleteIntent}
        />
      ))}
    </div>
  );
};

export default MemoriesTab;
