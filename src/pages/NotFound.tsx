
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/contexts/TranslationContext';
import Layout from '@/components/Layout';
import { BookOpen, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout fullWidth>
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="relative mb-10">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <BookOpen className="w-56 h-56 text-indigo-500 dark:text-indigo-300" />
          </div>
          <div className="relative z-10 font-serif">
            <h1 className="text-9xl font-bold text-indigo-600 dark:text-indigo-400">404</h1>
            <div className="h-2 w-40 bg-indigo-600 dark:bg-indigo-400 mx-auto my-6 rounded-full"></div>
          </div>
        </div>
        
        <h2 className="text-3xl font-serif font-bold mb-4 text-slate-800 dark:text-slate-200">
          {t("common.pageNotFound")}
        </h2>
        
        <p className="max-w-md text-slate-600 dark:text-slate-400 mb-8">
          {t("common.pageNotFoundDesc")}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.goBack")}
          </Button>
          
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              {t("common.goHome")}
            </Link>
          </Button>
        </div>
        
        <div className="mt-16 p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg max-w-md border border-indigo-100 dark:border-indigo-800">
          <p className="text-indigo-700 dark:text-indigo-300 italic font-serif">
            "Memories are the treasures that we keep locked deep within the storehouse of our souls, to keep our hearts warm when we are lonely."
          </p>
          <p className="mt-2 text-indigo-600 dark:text-indigo-400 text-sm">— Becky Aligada</p>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
