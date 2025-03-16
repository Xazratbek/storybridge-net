
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Memory, Prompt } from "@/types";
import { CalendarIcon, X, Mic, Video, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentUser } from "@/utils/authUtils";

// MOCK DATA - In a real app, this would come from an API
const MOCK_MEMORIES: Memory[] = [];
const MOCK_PROMPTS: Prompt[] = [
  {
    id: "1",
    question: "What is your favorite family tradition?",
    category: "family",
  },
  {
    id: "2",
    question: "Describe a time when you overcame a significant challenge.",
    category: "personal",
  },
  {
    id: "3",
    question: "What was your childhood home like?",
    category: "childhood",
  },
  {
    id: "4",
    question: "Share a story your grandparents told you.",
    category: "family",
  },
  {
    id: "5",
    question: "What's the most valuable life lesson you've learned?",
    category: "personal",
  },
];

const MemoryForm = () => {
  const { id, promptId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaType, setMediaType] = useState<"text" | "audio" | "video">("text");
  
  // Get memory by ID if we're editing
  useEffect(() => {
    if (id) {
      // In a real app, we would fetch this from the backend
      const memoryToEdit = MOCK_MEMORIES.find(m => m.id === id);
      if (memoryToEdit) {
        setTitle(memoryToEdit.title);
        setContent(memoryToEdit.content);
        setDate(new Date(memoryToEdit.date));
        setTags(memoryToEdit.tags);
        setCategory(memoryToEdit.category);
        setIsPrivate(memoryToEdit.isPrivate);
        setMediaType(memoryToEdit.mediaType);
      }
    }
  }, [id]);
  
  // Set content from prompt if we have a promptId
  useEffect(() => {
    if (promptId) {
      const selectedPrompt = MOCK_PROMPTS.find(p => p.id === promptId);
      if (selectedPrompt) {
        setTitle(`Response to: ${selectedPrompt.question}`);
      }
    }
  }, [promptId]);
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Not logged in",
        description: "Please log in to save memories",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!title || !content || !date) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, we would send this data to a backend API
      // For now, we'll just simulate success
      
      const newMemory: Memory = {
        id: id || String(Date.now()),
        title,
        content,
        date: date.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags,
        category,
        mediaType,
        isPrivate,
        authorId: currentUser.id,
        sharedWith: [],
      };
      
      // In a real app, we would save this to a database
      console.log("Memory saved:", newMemory);
      
      toast({
        title: id ? "Memory updated" : "Memory saved",
        description: "Your memory has been successfully saved.",
      });
      
      // Go back to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving memory:", error);
      toast({
        title: "Error",
        description: "Failed to save memory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-memory-paper bg-paper-texture">
      <Navbar />
      <div className="container py-8">
        <Card className="border-memory-light shadow-md max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">
              {id ? "Edit Memory" : "Create New Memory"}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your memory a title"
                  required
                />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button
                  type="button"
                  variant={mediaType === "text" ? "default" : "outline"}
                  onClick={() => setMediaType("text")}
                  className={mediaType === "text" ? "bg-memory-DEFAULT hover:bg-memory-dark" : ""}
                >
                  Text
                </Button>
                <Button
                  type="button"
                  variant={mediaType === "audio" ? "default" : "outline"}
                  onClick={() => setMediaType("audio")}
                  className={mediaType === "audio" ? "bg-memory-DEFAULT hover:bg-memory-dark" : ""}
                >
                  <Mic className="mr-2 h-4 w-4" />
                  Audio
                </Button>
                <Button
                  type="button"
                  variant={mediaType === "video" ? "default" : "outline"}
                  onClick={() => setMediaType("video")}
                  className={mediaType === "video" ? "bg-memory-DEFAULT hover:bg-memory-dark" : ""}
                >
                  <Video className="mr-2 h-4 w-4" />
                  Video
                </Button>
              </div>
              
              {mediaType === "text" && (
                <div className="space-y-2">
                  <Label htmlFor="content">Memory Details</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your memory here..."
                    className="min-h-[200px]"
                    required
                  />
                </div>
              )}
              
              {mediaType === "audio" && (
                <div className="space-y-2 p-6 border-2 border-dashed rounded-md border-memory-light text-center">
                  <p className="text-muted-foreground">Audio recording is not available in this demo version.</p>
                  <p className="text-sm text-muted-foreground">In the full version, you'll be able to record or upload audio memories.</p>
                </div>
              )}
              
              {mediaType === "video" && (
                <div className="space-y-2 p-6 border-2 border-dashed rounded-md border-memory-light text-center">
                  <p className="text-muted-foreground">Video upload is not available in this demo version.</p>
                  <p className="text-sm text-muted-foreground">In the full version, you'll be able to upload video memories.</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>When did this memory occur?</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Childhood, Family, Travel"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddTag}
                    className="bg-memory-DEFAULT hover:bg-memory-dark"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-memory-light text-memory-dark text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="h-4 w-4 rounded-full flex items-center justify-center text-memory-dark hover:bg-memory-DEFAULT hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="privacy"
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />
                <Label htmlFor="privacy">Keep this memory private</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-memory-DEFAULT hover:bg-memory-dark"
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Memory"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default MemoryForm;
