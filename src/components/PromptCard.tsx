
import { Prompt } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

interface PromptCardProps {
  prompt: Prompt;
  onClick: (prompt: Prompt) => void;
}

const PromptCard = ({ prompt, onClick }: PromptCardProps) => {
  return (
    <Card 
      className="prompt-card animate-fade-up" 
      onClick={() => onClick(prompt)}
    >
      <CardContent className="p-0 flex items-start">
        <HelpCircle className="h-6 w-6 text-memory-DEFAULT mr-3 mt-0.5 flex-shrink-0" />
        <p className="text-lg font-serif text-memory-dark">{prompt.question}</p>
      </CardContent>
    </Card>
  );
};

export default PromptCard;
