
import React from 'react';
import PromptCard from '@/components/PromptCard';
import { Prompt } from '@/types';

type PromptsTabProps = {
  prompts: Prompt[];
  onPromptClick?: (promptId: string) => void; // Made optional with a default value
};

const PromptsTab = ({ prompts, onPromptClick = () => {} }: PromptsTabProps) => {
  const handlePromptClick = (prompt: Prompt) => {
    if (onPromptClick) {
      onPromptClick(prompt.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-purple-100">
      <h2 className="text-xl font-medium text-purple-800 mb-4 font-serif">Memory Prompts</h2>
      <p className="text-gray-600 mb-6">
        Not sure what to write about? These prompts will help you capture meaningful memories.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prompts?.map((prompt) => (
          <PromptCard 
            key={prompt.id} 
            prompt={prompt} 
            onClick={handlePromptClick}
          />
        ))}
      </div>
    </div>
  );
};

export default PromptsTab;
