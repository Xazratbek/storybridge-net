
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
import { Prompt } from "@/types";
import { CalendarIcon, X, Mic, Video, Save, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { 
  fetchMemoryById, 
  createMemory, 
  updateMemory, 
  uploadFile, 
  fetchPrompts 
} from "@/utils/supabaseUtils";
import { getCurrentUser } from "@/utils/authUtils";
import { useQuery, useMutation } from "@tanstack/react-query";

const MemoryForm = () => {
  const { id, promptId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [isPrivate, setIsPrivate] = useState(true);
  const [mediaType, setMediaType] = useState<"text" | "audio" | "video">("text");
  const [file, setFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | undefined>();

  // Fetch current user
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoadingUser && !currentUser) {
      toast({
        title: "Not logged in",
        description: "Please log in to save memories",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [currentUser, isLoadingUser, navigate, toast]);

  // Fetch prompts
  const { data: prompts } = useQuery({
    queryKey: ['prompts'],
    queryFn: fetchPrompts,
  });

  // Fetch memory if editing
  const { data: memory, isLoading: isLoadingMemory } = useQuery({
    queryKey: ['memory', id],
    queryFn: () => id ? fetchMemoryById(id) : null,
    enabled: !!id,
  });

  // Create/update memory mutation
  const memoryMutation = useMutation({
    mutationFn: async (formData: any) => {
      if (id) {
        return updateMemory(formData);
      } else {
        return createMemory(formData);
      }
    },
    onSuccess: () => {
      toast({
        title: id ? "Memory updated" : "Memory saved",
        description: "Your memory has been successfully saved.",
      });
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save memory",
        variant: "destructive",
      });
    },
  });

  // Set form data if editing existing memory
  useEffect(() => {
    if (memory) {
      setTitle(memory.title);
      setContent(memory.content);
      setDate(memory.date ? new Date(memory.date) : new Date());
      setTags(memory.tags);
      setCategory(memory.category);
      setIsPrivate(memory.isPrivate);
      setMediaType(memory.mediaType);
      setMediaUrl(memory.mediaUrl);
    }
  }, [memory]);

  // Set content from prompt if we have a promptId
  useEffect(() => {
    if (promptId && prompts) {
      const selectedPrompt = prompts.find(p => p.id === promptId);
      if (selectedPrompt) {
        setTitle(`Response to: ${selectedPrompt.question}`);
      }
    }
  }, [promptId, prompts]);
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
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
    
    let finalMediaUrl = mediaUrl;
    
    // Upload file if provided
    if (file && (mediaType === "audio" || mediaType === "video")) {
      const uploadedUrl = await uploadFile(file, mediaType);
      if (uploadedUrl) {
        finalMediaUrl = uploadedUrl;
      }
    }
    
    const memoryData = {
      id: id || "",
      title,
      content,
      date: date ? date.toISOString() : new Date().toISOString(),
      tags,
      category,
      mediaType,
      mediaUrl: finalMediaUrl,
      isPrivate,
      authorId: currentUser.id,
      sharedWith: [],
      createdAt: "",
      updatedAt: "",
    };
    
    memoryMutation.mutate(memoryData);
  };
  
  // Handle loading states
  if (isLoadingUser || (id && isLoadingMemory)) {
    return (
      <div className="min-h-screen bg-memory-paper bg-paper-texture">
        <Navbar />
        <div className="container py-8">
          <Card className="border-memory-light shadow-md max-w-3xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="animate-pulse">
                <div className="h-6 bg-memory-light/40 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-4 bg-memory-light/40 rounded w-3/4 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Memory Details</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Provide a description for your audio memory..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="audio">Audio File</Label>
                    <div className="border-2 border-dashed rounded-md border-memory-light p-4">
                      <Input
                        id="audio"
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="audio" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Upload className="h-6 w-6 text-memory-dark" />
                          <span className="text-sm text-center">
                            {file ? file.name : "Click to upload audio file"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            MP3, WAV or M4A (max 20MB)
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              {mediaType === "video" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Memory Details</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Provide a description for your video memory..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="video">Video File</Label>
                    <div className="border-2 border-dashed rounded-md border-memory-light p-4">
                      <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="video" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Upload className="h-6 w-6 text-memory-dark" />
                          <span className="text-sm text-center">
                            {file ? file.name : "Click to upload video file"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            MP4, MOV or WebM (max 100MB)
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
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
                disabled={memoryMutation.isPending}
                className="bg-memory-DEFAULT hover:bg-memory-dark"
              >
                <Save className="mr-2 h-4 w-4" />
                {memoryMutation.isPending ? "Saving..." : "Save Memory"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default MemoryForm;
