
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser, logoutUser } from "@/utils/authUtils";
import { useNavigate } from "react-router-dom";
import { BookOpen, LogOut, Settings, User as UserIcon } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };
  
  return (
    <nav className="w-full py-4 px-6 flex items-center justify-between bg-memory-paper border-b border-memory-light shadow-sm">
      <div className="flex items-center space-x-2">
        <BookOpen className="h-6 w-6 text-memory-DEFAULT" />
        <Link to="/" className="text-xl font-serif font-bold text-memory-dark">
          Memory Preservation Network
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        {currentUser ? (
          <>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/dashboard")}
              className="text-memory-dark hover:text-memory-DEFAULT hover:bg-memory-accent/50"
            >
              Dashboard
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                    <AvatarFallback className="bg-memory-light text-memory-dark">
                      {currentUser.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost" className="text-memory-dark hover:text-memory-DEFAULT hover:bg-memory-accent/50">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-memory-DEFAULT hover:bg-memory-dark text-white">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
