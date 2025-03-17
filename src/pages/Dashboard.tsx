
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import Layout from '@/components/Layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMemories, deleteMemory, fetchPrompts, fetchCategories } from "@/utils/supabaseUtils";
import { getCurrentUser } from "@/utils/authUtils";
import { Memory } from '@/types';
import { 
  Plus, 
  BookText, 
  Lightbulb, 
  Clock, 
  Trash2
} from 'lucide-react';

// Import new components
import FilterBar from '@/components/dashboard/FilterBar';
import MemoriesTab from '@/components/dashboard/MemoriesTab';
import PromptsTab from '@/components/dashboard/PromptsTab';
import TimelineTab from '@/components/dashboard/TimelineTab';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState<string>("memories");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
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
    if (selectedCategory !== 'all' && memory.category !== selectedCategory) return false;
    
    // Filter by tag
    if (selectedTag !== 'all' && !memory.tags.includes(selectedTag)) return false;
    
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
  useEffect(() => {
    if (!isLoadingUser && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, isLoadingUser, navigate]);
  
  // Handle prompt click
  const handlePromptClick = (promptId: string) => {
    navigate(`/memory/new/${promptId}`);
  };
  
  // Loading state
  if (isLoadingUser || isLoadingMemories || isLoadingPrompts) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-purple-200 rounded w-48 mx-auto"></div>
            <div className="h-4 bg-purple-100 rounded w-64"></div>
            <div className="h-32 bg-purple-100 rounded-lg w-80"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Error state
  if (isErrorMemories) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-64">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Memories</h2>
          <p className="text-gray-600 mb-4">{memoriesError?.message || "An error occurred while loading your memories."}</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['memories'] })}>
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
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
            <FilterBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              categories={categories}
              allTags={allTags}
            />
          )}
        </div>
        
        <TabsContent value="memories" className="mt-0">
          <MemoriesTab 
            memories={filteredMemories} 
            onDeleteIntent={handleDeleteIntent} 
          />
        </TabsContent>
        
        <TabsContent value="prompts" className="mt-0">
          <PromptsTab 
            prompts={prompts || []} 
            onPromptClick={handlePromptClick} 
          />
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-0">
          <TimelineTab memories={filteredMemories} />
        </TabsContent>
      </Tabs>
      
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
    </Layout>
  );
};

export default Dashboard;
