
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import MemoryCard from '@/components/MemoryCard';
import PromptCard from '@/components/PromptCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMemories, deleteMemory, fetchPrompts, fetchCategories } from "@/utils/supabaseUtils";
import { getCurrentUser } from "@/utils/authUtils";
import { Memory } from '@/types';
import { 
  Plus, 
  Search, 
  Calendar, 
  Tag, 
  Filter, 
  Trash2, 
  BookText, 
  Brain, 
  Clock, 
  Lightbulb, 
  Folder,
  X
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState<string>("memories");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  
  // Fetch current user
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });
  
  // Fetch memories
  const { 
    data: memories, 
    isLoading: isLoadingMemories,
    isError: isErrorMemories,
    error: memoriesError
  } = useQuery({
    queryKey: ['memories'],
    queryFn: fetchMemories,
    enabled: !!currentUser,
  });
  
  // Fetch prompts
  const { 
    data: prompts, 
    isLoading: isLoadingPrompts 
  } = useQuery({
    queryKey: ['prompts'],
    queryFn: fetchPrompts,
  });

  // Fetch categories
  const { 
    data: categories, 
    isLoading: isLoadingCategories 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
  
  // Delete memory mutation
  const deleteMutation = useMutation({
    mutationFn: deleteMemory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      toast({
        title: "Memory deleted",
        description: "Your memory has been successfully deleted."
      });
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete memory",
        variant: "destructive",
      });
    },
  });
  
  // Handle delete memory
  const handleDeleteIntent = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };
  
  // Filter and sort memories
  const filteredMemories = memories?.filter(memory => {
    // Filter by author
    if (currentUser && memory.authorId !== currentUser.id) return false;
    
    // Filter by search query
    if (searchQuery && !memory.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !memory.content?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory && memory.category !== selectedCategory) return false;
    
    // Filter by tag
    if (selectedTag && !memory.tags.includes(selectedTag)) return false;
    
    return true;
  }).sort((a, b) => {
    // Sort by date descending
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }) || [];
  
  // Extract all unique tags from memories
  const allTags = Array.from(
    new Set(
      memories?.flatMap(memory => memory.tags || []) || []
    )
  );
  
  // Redirect if not authenticated
  if (!isLoadingUser && !currentUser) {
    navigate("/login");
    return null;
  }
  
  // Handle prompt click
  const handlePromptClick = (promptId: string) => {
    navigate(`/memory/new/${promptId}`);
  };
  
  // Loading state
  if (isLoadingUser || isLoadingMemories || isLoadingPrompts) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-purple-200 rounded w-48 mx-auto"></div>
              <div className="h-4 bg-purple-100 rounded w-64"></div>
              <div className="h-32 bg-purple-100 rounded-lg w-80"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (isErrorMemories) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col justify-center items-center h-64">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Memories</h2>
            <p className="text-gray-600 mb-4">{memoriesError?.message || "An error occurred while loading your memories."}</p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['memories'] })}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-memory-paper">
      <Navbar />
      
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-purple-800 mb-2 font-serif">Welcome, {currentUser?.name}</h1>
            <p className="text-gray-600">Preserve your memories for future generations.</p>
          </div>
          
          <Button 
            onClick={() => navigate("/memory/new")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Memory
          </Button>
        </div>
        
        <Tabs defaultValue="memories" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="bg-purple-100">
              <TabsTrigger value="memories" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <BookText className="mr-2 h-4 w-4" />
                My Memories
              </TabsTrigger>
              <TabsTrigger value="prompts" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Lightbulb className="mr-2 h-4 w-4" />
                Memory Prompts
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Clock className="mr-2 h-4 w-4" />
                Timeline
              </TabsTrigger>
            </TabsList>
            
            {activeTab === "memories" && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search memories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 border-purple-200 focus:border-purple-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px] border-purple-200">
                    <Folder className="mr-2 h-4 w-4 text-purple-500" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="w-[140px] border-purple-200">
                    <Tag className="mr-2 h-4 w-4 text-purple-500" />
                    <SelectValue placeholder="Tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <TabsContent value="memories" className="mt-0">
            {filteredMemories.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-purple-100">
                <div className="mb-4 bg-purple-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <BookText className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No memories found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || selectedCategory || selectedTag ? 
                    "Try adjusting your filters or search query." : 
                    "Start preserving your precious memories today."}
                </p>
                <Button 
                  onClick={() => navigate("/memory/new")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Memory
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMemories.map((memory) => (
                  <MemoryCard 
                    key={memory.id} 
                    memory={memory} 
                    onDelete={handleDeleteIntent}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="prompts" className="mt-0">
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
                    onClick={() => handlePromptClick(prompt.id)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-purple-100">
              <h2 className="text-xl font-medium text-purple-800 mb-4 font-serif">Memory Timeline</h2>
              <p className="text-gray-600 mb-6">
                View your memories in chronological order.
              </p>
              
              {filteredMemories.length === 0 ? (
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
              ) : (
                <div className="space-y-6">
                  {/* Group memories by year */}
                  {Object.entries(
                    filteredMemories.reduce((acc, memory) => {
                      const year = new Date(memory.date).getFullYear();
                      if (!acc[year]) acc[year] = [];
                      acc[year].push(memory);
                      return acc;
                    }, {} as Record<number, Memory[]>)
                  )
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
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the memory and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
