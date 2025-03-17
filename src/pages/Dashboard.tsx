import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import Layout from '@/components/Layout';
import { getCurrentUser } from '@/utils/authUtils';
import { 
  fetchCategories,
  fetchMemories,
  deleteMemory,
  fetchPrompts
} from '@/utils/supabaseUtils';
import { 
  fetchMemoriesFromMongoDB, 
  deleteMemoryFromMongoDB 
} from '@/utils/mongoDbUtils';
import { Memory, Category } from '@/types';
import {
  Calendar,
  PlusCircle,
  BookText,
  Trash2
} from 'lucide-react';

// Import components
import FilterBar from '@/components/dashboard/FilterBar';
import MemoriesTab from '@/components/dashboard/MemoriesTab';
import PromptsTab from '@/components/dashboard/PromptsTab';
import TimelineTab from '@/components/dashboard/TimelineTab';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [deleteMemoryId, setDeleteMemoryId] = useState<string | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  
  // Fetch current user
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoadingUser && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, isLoadingUser, navigate]);

  // Fetch memories from MongoDB
  const { data: memories, isLoading: isLoadingMemories } = useQuery({
    queryKey: ['memories'],
    queryFn: fetchMemoriesFromMongoDB,
    enabled: !!currentUser,
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Fetch prompts
  const { data: prompts } = useQuery({
    queryKey: ['prompts'],
    queryFn: fetchPrompts,
  });

  // Get all unique tags from memories
  const allTags = memories
    ? Array.from(new Set(memories.flatMap(memory => memory.tags)))
    : [];

  // Delete memory mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Delete from both MongoDB and Supabase for redundancy
      const mongoResult = await deleteMemoryFromMongoDB(id);
      const supabaseResult = await deleteMemory(id);
      
      if (!mongoResult && !supabaseResult) {
        throw new Error("Failed to delete memory from both databases");
      }
      
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Memory deleted",
        description: "Your memory has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      setDeleteMemoryId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting memory",
        description: error.message || "Failed to delete memory",
        variant: "destructive",
      });
    },
  });

  const confirmDeleteMemory = (id: string) => {
    setDeleteMemoryId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const cancelDeleteMemory = () => {
    setDeleteMemoryId(null);
    setIsDeleteConfirmationOpen(false);
  };

  const handleDeleteMemory = async () => {
    if (deleteMemoryId) {
      deleteMutation.mutate(deleteMemoryId);
      setIsDeleteConfirmationOpen(false);
    }
  };

  // Filter memories based on search query, category, and tags
  const filteredMemories = React.useMemo(() => {
    if (!memories) return [];

    return memories.filter(memory => {
      const searchMatch = memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          memory.content.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMatch = selectedCategory === 'all' || memory.category === selectedCategory;
      const tagMatch = selectedTag === 'all' || memory.tags.includes(selectedTag);

      return searchMatch && categoryMatch && tagMatch;
    });
  }, [memories, searchQuery, selectedCategory, selectedTag]);

  // For debugging - check if memories are being loaded
  console.log("Memories loaded from MongoDB:", memories);
  
  return (
    <Layout>
      <div className="container py-10">
        <Card className="shadow-md border-memory-light">
          <CardContent className="p-6">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-purple-800 font-serif">
                Your Memories
              </h1>
              <Button
                onClick={() => navigate("/memory/new")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Memory
              </Button>
            </div>

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

            <Tabs defaultValue="memories" className="mt-6">
              <TabsList>
                <TabsTrigger value="memories" className="data-[state=active]:bg-purple-100 text-purple-600">
                  <BookText className="mr-2 h-4 w-4" />
                  Memories
                </TabsTrigger>
                <TabsTrigger value="timeline" className="data-[state=active]:bg-purple-100 text-purple-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="prompts" className="data-[state=active]:bg-purple-100 text-purple-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  Prompts
                </TabsTrigger>
              </TabsList>
              <TabsContent value="memories" className="mt-4">
                <MemoriesTab
                  memories={filteredMemories}
                  onDeleteIntent={confirmDeleteMemory}
                />
              </TabsContent>
              <TabsContent value="timeline" className="mt-4">
                <TimelineTab memories={filteredMemories} />
              </TabsContent>
              <TabsContent value="prompts" className="mt-4">
                <PromptsTab prompts={prompts || []} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteConfirmationOpen} onOpenChange={setIsDeleteConfirmationOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Are you sure you want to delete this memory?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDeleteMemory}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteMemory}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    Deleting <span className="animate-pulse">...</span>
                  </>
                ) : (
                  <>
                    Delete <Trash2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default Dashboard;
