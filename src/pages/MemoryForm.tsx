import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Prompt } from "@/types";
import { CalendarIcon, X, Mic, Video, Save, Upload, ImageIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { 
  fetchMemoryById, 
  createMemory, 
  updateMemory, 
  uploadFile,
  fetchPrompts,
  fetchCategories
} from "@/utils/supabaseUtils";
import { 
  saveMemoryToMongoDB,
  fetchMemoryByIdFromMongoDB
} from "@/utils/mongoDbUtils";
import { getCurrentUser } from "@/utils/authUtils";
import { useQuery, useMutation } from "@tanstack/react-query";

type PrivacyLevel = "private" | "shared" | "family";
type MediaItem = {
  id: string;
  type: "text" | "image" | "audio" | "video";
  content?: string;
  file?: File;
  url?: string;
};

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
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>("private");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [mediaUploading, setMediaUploading] = useState(false);

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

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
  
  // Fetch memory if editing
  const { data: memory, isLoading: isLoadingMemory } = useQuery({
    queryKey: ['memory', id],
    queryFn: () => id ? fetchMemoryByIdFromMongoDB(id) : null,
    enabled: !!id,
  });

  // Create/update memory mutation
  const memoryMutation = useMutation({
    mutationFn: async (formData: any) => {
      // Get any media files that need to be uploaded
      const mediaFilesToUpload = mediaItems
        .filter(item => item.file)
        .map(item => ({ id: item.id, file: item.file! }));
      
      // First attempt to save to MongoDB
      const mongoResult = await saveMemoryToMongoDB(formData, mediaFilesToUpload);
      
      if (!mongoResult) {
        throw new Error("Failed to save memory to MongoDB");
      }
      
      // Also save basic data to Supabase for redundancy
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
      
      // Set privacy level based on memory properties
      if (memory.isPrivate) {
        setPrivacyLevel("private");
      } else if (memory.sharedWith && memory.sharedWith.length > 0) {
        setPrivacyLevel("shared");
      } else {
        setPrivacyLevel("family");
      }

      // Set media items
      if (memory.mediaType && memory.mediaUrl) {
        setMediaItems([
          {
            id: Date.now().toString(),
            type: memory.mediaType,
            url: memory.mediaUrl,
          }
        ]);
      }
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
  
  const handleAddMediaItem = (type: "text" | "image" | "audio" | "video") => {
    setMediaItems([
      ...mediaItems,
      {
        id: Date.now().toString(),
        type,
        content: type === "text" ? "" : undefined,
      }
    ]);
  };
  
  const handleRemoveMediaItem = (id: string) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
  };
  
  const handleMediaFileChange = (id: string, file: File) => {
    setMediaItems(mediaItems.map(item => 
      item.id === id ? { ...item, file } : item
    ));
  };
  
  const handleTextContentChange = (id: string, content: string) => {
    setMediaItems(mediaItems.map(item => 
      item.id === id ? { ...item, content } : item
    ));
  };

  const uploadMediaFiles = async () => {
    setMediaUploading(true);
    const itemsWithUrls = [...mediaItems];
    
    try {
      for (let i = 0; i < itemsWithUrls.length; i++) {
        const item = itemsWithUrls[i];
        
        if (item.file) {
          const uploadedUrl = await uploadFile(item.file, item.type);
          if (uploadedUrl) {
            itemsWithUrls[i] = {
              ...item,
              url: uploadedUrl
            };
          }
        }
      }
      
      setMediaUploading(false);
      return itemsWithUrls;
    } catch (error) {
      setMediaUploading(false);
      throw error;
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
    
    if (!title || !date) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Prepare data for memory creation/update
      const isPrivate = privacyLevel === "private";
      const sharedWith = privacyLevel === "shared" ? ["PLACEHOLDER_USER_ID"] : [];
      
      // Find the primary media item to use for the main memory record
      const primaryMedia = mediaItems.find(item => item.url || item.file);
      
      const memoryData = {
        id: id || crypto.randomUUID(),
        title,
        content: content || mediaItems.filter(item => item.type === "text")
          .map(item => item.content)
          .join("\n\n"),
        date: date ? date.toISOString() : new Date().toISOString(),
        tags,
        category,
        mediaType: primaryMedia?.type || "text",
        mediaUrl: primaryMedia?.url,
        isPrivate,
        authorId: currentUser.id,
        sharedWith,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mediaItems: mediaItems.map(item => ({
          id: item.id,
          type: item.type,
          url: item.url,
          content: item.content
        }))
      };
      
      memoryMutation.mutate(memoryData);
    } catch (error: any) {
      toast({
        title: "Error saving memory",
        description: error.message || "An error occurred while saving your memory",
        variant: "destructive",
      });
    }
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
        <Card className="border-memory-light shadow-md max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-purple-800">
              {id ? "Edit Memory" : "Create New Memory"}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-purple-800">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your memory a title"
                  className="border-purple-200 focus:border-purple-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content" className="text-purple-800">Main Memory Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your memory here..."
                  className="min-h-[150px] border-purple-200 focus:border-purple-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-purple-800">When did this memory occur?</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-purple-200",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-purple-500" />
                      {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="border-purple-200"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category" className="text-purple-800">Category</Label>
                <Select 
                  value={category} 
                  onValueChange={setCategory}
                >
                  <SelectTrigger className="border-purple-200">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Uncategorized">Uncategorized</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-purple-800">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    className="border-purple-200 focus:border-purple-400"
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
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="h-4 w-4 rounded-full flex items-center justify-center text-purple-700 hover:bg-purple-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-purple-800">Privacy Level</Label>
                <RadioGroup 
                  value={privacyLevel} 
                  onValueChange={(value) => setPrivacyLevel(value as PrivacyLevel)}
                  className="flex space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" className="text-purple-600" />
                    <Label htmlFor="private">Private (Only you)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shared" id="shared" className="text-purple-600" />
                    <Label htmlFor="shared">Shared (Specific people)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="family" id="family" className="text-purple-600" />
                    <Label htmlFor="family">Family (All family members)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-4 border-t border-purple-100 pt-6">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-medium text-purple-800">Media Items</Label>
                  <div className="flex space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddMediaItem("text")}
                      className="border-purple-200 text-purple-700"
                    >
                      <Plus className="mr-1 h-4 w-4" /> Text
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddMediaItem("image")}
                      className="border-purple-200 text-purple-700"
                    >
                      <ImageIcon className="mr-1 h-4 w-4" /> Image
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddMediaItem("audio")}
                      className="border-purple-200 text-purple-700"
                    >
                      <Mic className="mr-1 h-4 w-4" /> Audio
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddMediaItem("video")}
                      className="border-purple-200 text-purple-700"
                    >
                      <Video className="mr-1 h-4 w-4" /> Video
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {mediaItems.length === 0 && (
                    <div className="text-center py-6 bg-purple-50 rounded-lg border-2 border-dashed border-purple-200">
                      <p className="text-purple-700">Add media items to enhance your memory</p>
                    </div>
                  )}
                  
                  {mediaItems.map((item) => (
                    <Card key={item.id} className="border-purple-200">
                      <div className="p-4">
                        <div className="flex justify-between mb-2">
                          <Label className="capitalize text-purple-700">{item.type}</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMediaItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {item.type === "text" && (
                          <Textarea
                            value={item.content || ""}
                            onChange={(e) => handleTextContentChange(item.id, e.target.value)}
                            placeholder="Enter additional text memory..."
                            className="min-h-[100px] border-purple-200 focus:border-purple-400"
                          />
                        )}
                        
                        {item.type === "image" && (
                          <div className="space-y-2">
                            <div className="border-2 border-dashed rounded-md border-purple-200 p-4">
                              <Input
                                id={`image-${item.id}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files && handleMediaFileChange(item.id, e.target.files[0])}
                                className="hidden"
                              />
                              <label htmlFor={`image-${item.id}`} className="cursor-pointer">
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <Upload className="h-6 w-6 text-purple-600" />
                                  <span className="text-sm text-center">
                                    {item.file ? item.file.name : "Click to upload image"}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    JPG, PNG, GIF (max 10MB)
                                  </span>
                                </div>
                              </label>
                            </div>
                            {item.url && (
                              <div className="mt-2 relative aspect-video rounded-md overflow-hidden">
                                <img 
                                  src={item.url} 
                                  alt="Uploaded" 
                                  className="w-full h-full object-contain bg-purple-50" 
                                />
                              </div>
                            )}
                          </div>
                        )}
                        
                        {item.type === "audio" && (
                          <div className="space-y-2">
                            <div className="border-2 border-dashed rounded-md border-purple-200 p-4">
                              <Input
                                id={`audio-${item.id}`}
                                type="file"
                                accept="audio/*"
                                onChange={(e) => e.target.files && handleMediaFileChange(item.id, e.target.files[0])}
                                className="hidden"
                              />
                              <label htmlFor={`audio-${item.id}`} className="cursor-pointer">
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <Upload className="h-6 w-6 text-purple-600" />
                                  <span className="text-sm text-center">
                                    {item.file ? item.file.name : "Click to upload audio file"}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    MP3, WAV or M4A (max 20MB)
                                  </span>
                                </div>
                              </label>
                            </div>
                            {item.url && (
                              <div className="mt-2">
                                <audio controls className="w-full">
                                  <source src={item.url} type="audio/mpeg" />
                                  Your browser does not support the audio element.
                                </audio>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {item.type === "video" && (
                          <div className="space-y-2">
                            <div className="border-2 border-dashed rounded-md border-purple-200 p-4">
                              <Input
                                id={`video-${item.id}`}
                                type="file"
                                accept="video/*"
                                onChange={(e) => e.target.files && handleMediaFileChange(item.id, e.target.files[0])}
                                className="hidden"
                              />
                              <label htmlFor={`video-${item.id}`} className="cursor-pointer">
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <Upload className="h-6 w-6 text-purple-600" />
                                  <span className="text-sm text-center">
                                    {item.file ? item.file.name : "Click to upload video file"}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    MP4, MOV or WebM (max 100MB)
                                  </span>
                                </div>
                              </label>
                            </div>
                            {item.url && (
                              <div className="mt-2">
                                <video controls className="w-full rounded-md">
                                  <source src={item.url} type="video/mp4" />
                                  Your browser does not support the video element.
                                </video>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-purple-100 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="border-purple-200 text-purple-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={memoryMutation.isPending || mediaUploading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {memoryMutation.isPending || mediaUploading ? "Saving..." : "Save Memory"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default MemoryForm;
