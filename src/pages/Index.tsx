
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { BookOpen, Camera, Clock, FileText, Lock, MessageCircle, Share2, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-memory-paper bg-paper-texture">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-memory-DEFAULT/20 blur-xl"></div>
              <div className="relative bg-memory-DEFAULT text-white p-4 rounded-full">
                <BookOpen className="h-12 w-12" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-memory-dark mb-6 max-w-3xl">
            Preserve Your Memories for Generations to Come
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Your personal history matters. Record, organize, and share your life stories in a secure, private space dedicated to memory preservation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register">
              <Button className="text-lg px-8 py-6 bg-memory-DEFAULT hover:bg-memory-dark">
                Start Preserving Memories
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="text-lg px-8 py-6 border-memory-DEFAULT text-memory-DEFAULT hover:bg-memory-accent/50">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Feature Section */}
      <section className="container py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-memory-dark mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A simple, intuitive platform designed specifically for preserving your personal and family history.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-memory-light/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-8 w-8 text-memory-DEFAULT" />
            </div>
            <h3 className="text-xl font-serif font-bold text-memory-dark mb-3">Record Memories</h3>
            <p className="text-muted-foreground">
              Document your stories in text format, with support for audio and video coming soon.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-memory-light/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="h-8 w-8 text-memory-DEFAULT" />
            </div>
            <h3 className="text-xl font-serif font-bold text-memory-dark mb-3">Guided Prompts</h3>
            <p className="text-muted-foreground">
              Never stare at a blank page again. Our prompts help spark meaningful memories worth preserving.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-memory-light/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Clock className="h-8 w-8 text-memory-DEFAULT" />
            </div>
            <h3 className="text-xl font-serif font-bold text-memory-dark mb-3">Timeline View</h3>
            <p className="text-muted-foreground">
              Organize your memories chronologically to create a rich tapestry of your life's journey.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-memory-light/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Lock className="h-8 w-8 text-memory-DEFAULT" />
            </div>
            <h3 className="text-xl font-serif font-bold text-memory-dark mb-3">Privacy Controls</h3>
            <p className="text-muted-foreground">
              You decide what's private and what's shared. Keep memories personal or share with selected family members.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-memory-light/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Share2 className="h-8 w-8 text-memory-DEFAULT" />
            </div>
            <h3 className="text-xl font-serif font-bold text-memory-dark mb-3">Family Sharing</h3>
            <p className="text-muted-foreground">
              Collaborate with family members to build a richer, more complete family history together.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-memory-light/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Camera className="h-8 w-8 text-memory-DEFAULT" />
            </div>
            <h3 className="text-xl font-serif font-bold text-memory-dark mb-3">Multiple Formats</h3>
            <p className="text-muted-foreground">
              Your memories aren't just text. Soon you'll be able to add photos, audio recordings, and videos.
            </p>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="bg-memory-DEFAULT/5 py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-memory-dark mb-4">
              Why Preserve Your Memories?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The stories we share shape who we are and connect generations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <p className="italic text-lg mb-6">
                "After my grandmother passed away, I realized how many of her stories were lost forever. This platform helps me ensure my children and grandchildren will know who I was and what mattered to me."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-memory-light mr-4"></div>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Family Historian</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-md">
              <p className="italic text-lg mb-6">
                "The guided prompts helped me record memories I'd almost forgotten. Now my grandchildren ask me to share specific stories they've read in my collection."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-memory-light mr-4"></div>
                <div>
                  <p className="font-semibold">Robert Chen</p>
                  <p className="text-sm text-muted-foreground">Retired Teacher</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-md">
              <p className="italic text-lg mb-6">
                "Our family is scattered across the country, but we all contribute to our shared memory collection. It's brought us closer despite the distance."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-memory-light mr-4"></div>
                <div>
                  <p className="font-semibold">Maya Patel</p>
                  <p className="text-sm text-muted-foreground">Mom of Three</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container py-16 md:py-24">
        <div className="bg-memory-DEFAULT text-white rounded-xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCcgdmlld0JveD0nMCAwIDQwIDQwJz48ZyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPjxnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsMC4xKScgZmlsbC1vcGFjaXR5PScwLjInPjxwYXRoIGQ9J00wIDM4LjU5bDIuODMtMi44MyAxLjQxIDEuNDFMMS40MSA0MEgwdi0xLjQxek0wIDE5LjU5bDIuODMtMi44MyAxLjQxIDEuNDFMMS40MSAyMUgwdi0xLjQxek0wIDAuNTlsMi44My0yLjgzIDEuNDEgMS40MUwxLjQxIDJIMHYtMS40MXpNMTkgNDAuNTlsMi44My0yLjgzIDEuNDEgMS40MUwyMC40MSA0MkgxOXYtMS40MXpNMTkgMjEuNTlsMi44My0yLjgzIDEuNDEgMS40MUwyMC40MSAyM0gxOXYtMS40MXpNMTkgMi41OWwyLjgzLTIuODMgMS40MSAxLjQxTDIwLjQxIDRIMTl2LTEuNDF6TTM4IDQwLjU5bDIuODMtMi44MyAxLjQxIDEuNDFMMzkuNDEgNDJIMzh2LTEuNDF6TTM4IDIxLjU5bDIuODMtMi44MyAxLjQxIDEuNDFMMzkuNDEgMjNIMzh2LTEuNDF6TTM4IDIuNTlsMi44My0yLjgzIDEuNDEgMS40MUwzOS40MSA0SDM4di0xLjQxeidcLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Start Preserving Your Legacy Today
              </h2>
              <p className="text-lg text-white/90 max-w-lg">
                Don't let your precious memories fade away. Create your account now and begin documenting your life's journey for future generations.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-white text-memory-DEFAULT hover:bg-memory-accent">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-memory-dark text-white py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <BookOpen className="h-8 w-8 mr-2" />
              <span className="text-xl font-serif font-bold">Memory Preservation Network</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-memory-accent">Privacy Policy</a>
              <a href="#" className="hover:text-memory-accent">Terms of Service</a>
              <a href="#" className="hover:text-memory-accent">About Us</a>
              <a href="#" className="hover:text-memory-accent">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-memory-light/60">
            <p>© {new Date().getFullYear()} Memory Preservation Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
