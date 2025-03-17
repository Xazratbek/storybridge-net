
import { useEffect } from "react";
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { BookOpen, LogOut, Settings, User as UserIcon, Moon, Sun, Languages } from "lucide-react";
import { getCurrentUser, logoutUser } from "@/utils/authUtils";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useSettings } from "@/contexts/SettingsContext";
import { useTranslation } from "@/contexts/TranslationContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings, toggleTheme, setLanguage } = useSettings();
  const { t } = useTranslation();

  // Fetch current user with React Query
  const { data: currentUser, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });
  
  // Refetch user data when the component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  const handleLogout = async () => {
    await logoutUser();
    refetch();
    toast({
      title: t("common.logout"),
      description: t("common.success"),
    });
    navigate("/");
  };
  
  return (
    <nav className="w-full py-4 px-6 flex items-center justify-between bg-slate-50 border-b border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
      <div className="flex items-center space-x-2">
        <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        <Link to="/" className="text-xl font-serif font-bold text-slate-800 dark:text-slate-100">
          Memory Preservation Network
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="text-slate-700 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-700"
        >
          {settings.theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-slate-700 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-700"
            >
              <Languages className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("common.language")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setLanguage('en')} className={settings.language === 'en' ? 'bg-slate-100 dark:bg-slate-700' : ''}>
              {t("common.english")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('ru')} className={settings.language === 'ru' ? 'bg-slate-100 dark:bg-slate-700' : ''}>
              {t("common.russian")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('uz')} className={settings.language === 'uz' ? 'bg-slate-100 dark:bg-slate-700' : ''}>
              {t("common.uzbek")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {currentUser ? (
          <>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/dashboard")}
              className="text-slate-700 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-700"
            >
              {t("common.dashboard")}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200">
                      {currentUser.name?.substring(0, 2).toUpperCase() || "MN"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>{t("common.myAccount")}</DropdownMenuLabel>
                <DropdownMenuItem className="text-sm opacity-50">
                  {currentUser.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>{t("common.profile")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t("common.settings")}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("common.logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost" className="text-slate-700 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-700">
                {t("common.login")}
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {t("common.register")}
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
