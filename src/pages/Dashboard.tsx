
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Memory, Prompt } from "@/types";
import { Plus, BookOpen, Calendar, Tag, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import MemoryCard from "@/components/MemoryCard";
import PromptCard from "@/components/PromptCard";
import Timeline from "@/components/Timeline";
import { getCurrentUser } from "@/utils/authUtils";
import { fetchMemories, fetchPrompts } from "@/utils/supabaseUtils";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  
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
        description: "Please log in to view your dashboard",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [currentUser, isLoadingUser, navigate, toast]);

  // Fetch memories
  const { data: memories = [], isLoading: isLoadingMemories } = useQuery({
    queryKey: ['memories'],
    queryFn: fetchMemories,
    enabled: !!currentUser,
  });

  // Fetch prompts
  const { data: prompts = [], isLoading: isLoadingPrompts } = useQuery({
    queryKey: ['prompts'],
    queryFn: fetchPrompts,
  });
  
  const handleCreateMemory = () => {
    navigate("/memory/new");
  };
  
  const handlePromptClick = (prompt: Prompt) => {
    navigate(`/memory/new/prompt/${prompt.id}`);
  };
  
  const handleMemoryClick = (memory: Memory) => {
    navigate(`/memory/${memory.id}`);
  };
  
  const filteredMemories = memories.filter(memory => {
    if (activeTab === "all") return true;
    if (activeTab === "private") return memory.isPrivate;
    if (activeTab === "shared") return !memory.isPrivate;
    if (activeTab === "family") return memory.category.toLowerCase() === "family";
    return true;
  });

  // Show loading state
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-memory-paper bg-paper-texture">
        <Navbar />
        <div className="container py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-memory-light/40 rounded w-1/4"></div>
            <div className="h-[500px] bg-memory-light/40 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-memory-paper bg-paper-texture">
      <Navbar />
      
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-memory-dark">Your Memory Collection</h1>
            <p className="text-muted-foreground">Preserve and organize your life stories</p>
          </div>
          
          <Button
            onClick={handleCreateMemory}
            className="bg-memory-DEFAULT hover:bg-memory-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Memory
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all" className="data-[state=active]:bg-memory-DEFAULT data-[state=active]:text-white">
                  All Memories
                </TabsTrigger>
                <TabsTrigger value="private" className="data-[state=active]:bg-memory-DEFAULT data-[state=active]:text-white">
                  Private
                </TabsTrigger>
                <TabsTrigger value="shared" className="data-[state=active]:bg-memory-DEFAULT data-[state=active]:text-white">
                  Shared
                </TabsTrigger>
                <TabsTrigger value="family" className="data-[state=active]:bg-memory-DEFAULT data-[state=active]:text-white">
                  Family
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-serif flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-memory-DEFAULT" />
                      All Memories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingMemories ? (
                      <div className="grid grid-cols-1 gap-4 animate-pulse">
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="h-48 bg-gray-100 rounded-lg"></div>
                        ))}
                      </div>
                    ) : filteredMemories.length === 0 ? (
                      <div className="text-center p-8 border-2 border-dashed border-memory-light rounded-lg">
                        <p className="text-muted-foreground">You haven't saved any memories yet.</p>
                        <Button 
                          onClick={handleCreateMemory} 
                          variant="outline" 
                          className="mt-4"
                        >
                          Create Your First Memory
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {filteredMemories.map((memory) => (
                          <MemoryCard
                            key={memory.id}
                            memory={memory}
                            onClick={() => handleMemoryClick(memory)}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="private" className="mt-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-serif flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-memory-DEFAULT" />
                      Private Memories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingMemories ? (
                      <div className="grid grid-cols-1 gap-4 animate-pulse">
                        {[1, 2].map((item) => (
                          <div key={item} className="h-48 bg-gray-100 rounded-lg"></div>
                        ))}
                      </div>
                    ) : filteredMemories.length === 0 ? (
                      <div className="text-center p-8 border-2 border-dashed border-memory-light rounded-lg">
                        <p className="text-muted-foreground">No private memories found.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {filteredMemories.map((memory) => (
                          <MemoryCard
                            key={memory.id}
                            memory={memory}
                            onClick={() => handleMemoryClick(memory)}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="shared" className="mt-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-serif flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-memory-DEFAULT" />
                      Shared Memories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingMemories ? (
                      <div className="grid grid-cols-1 gap-4 animate-pulse">
                        {[1, 2].map((item) => (
                          <div key={item} className="h-48 bg-gray-100 rounded-lg"></div>
                        ))}
                      </div>
                    ) : filteredMemories.length === 0 ? (
                      <div className="text-center p-8 border-2 border-dashed border-memory-light rounded-lg">
                        <p className="text-muted-foreground">No shared memories found.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {filteredMemories.map((memory) => (
                          <MemoryCard
                            key={memory.id}
                            memory={memory}
                            onClick={() => handleMemoryClick(memory)}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="family" className="mt-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-serif flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-memory-DEFAULT" />
                      Family Memories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingMemories ? (
                      <div className="grid grid-cols-1 gap-4 animate-pulse">
                        {[1, 2].map((item) => (
                          <div key={item} className="h-48 bg-gray-100 rounded-lg"></div>
                        ))}
                      </div>
                    ) : filteredMemories.length === 0 ? (
                      <div className="text-center p-8 border-2 border-dashed border-memory-light rounded-lg">
                        <p className="text-muted-foreground">No family memories found.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {filteredMemories.map((memory) => (
                          <MemoryCard
                            key={memory.id}
                            memory={memory}
                            onClick={() => handleMemoryClick(memory)}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8">
              <h2 className="text-2xl font-serif font-bold text-memory-dark mb-4 flex items-center">
                <Calendar className="mr-2 h-6 w-6 text-memory-DEFAULT" />
                Memory Timeline
              </h2>
              <Card>
                <CardContent className="p-6">
                  <Timeline 
                    memories={memories} 
                    onMemoryClick={handleMemoryClick} 
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div>
            <div className="sticky top-4">
              <h2 className="text-2xl font-serif font-bold text-memory-dark mb-4 flex items-center">
                <MessageCircle className="mr-2 h-6 w-6 text-memory-DEFAULT" />
                Memory Prompts
              </h2>
              <Card className="bg-memory-light/10">
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">
                    Not sure what to write about? Try one of these prompts to spark your memory.
                  </p>
                  {isLoadingPrompts ? (
                    <div className="space-y-4 animate-pulse">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="h-16 bg-gray-100 rounded-lg"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {prompts.map((prompt) => (
                        <PromptCard 
                          key={prompt.id} 
                          prompt={prompt} 
                          onClick={handlePromptClick} 
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <h2 className="text-2xl font-serif font-bold text-memory-dark mt-8 mb-4 flex items-center">
                <Tag className="mr-2 h-6 w-6 text-memory-DEFAULT" />
                Popular Tags
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(memories.flatMap(m => m.tags))).map((tag, index) => (
                      <div 
                        key={index}
                        className="px-3 py-1 rounded-full bg-memory-light text-memory-dark text-sm cursor-pointer hover:bg-memory-DEFAULT hover:text-white transition-colors"
                      >
                        {tag}
                      </div>
                    ))}
                    {memories.length === 0 && (
                      <div className="text-center w-full p-2">
                        <p className="text-muted-foreground">No tags available yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
