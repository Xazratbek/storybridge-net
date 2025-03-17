
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Layout from '@/components/Layout';
import { getCurrentUser } from "@/utils/authUtils";
import { fetchCategories } from "@/utils/supabaseUtils";
import { useQuery } from "@tanstack/react-query";
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { Settings as SettingsIcon, Bell, Moon, Sun, Monitor, Languages, Lock } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();
  
  // Fetch current user
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });
  
  // Fetch categories for default category selection
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
  
  // Redirect if not authenticated
  if (!isLoadingUser && !currentUser) {
    navigate("/login");
    return null;
  }
  
  // Loading state
  if (isLoadingUser || isLoadingCategories) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-indigo-200 rounded w-48 mx-auto"></div>
            <div className="h-4 bg-indigo-100 rounded w-64"></div>
            <div className="h-32 bg-indigo-100 rounded-lg w-80"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-800 dark:text-indigo-400 mb-2 font-serif">
            {t("common.settings")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("common.preferences")}
          </p>
        </div>
        
        <Tabs defaultValue="appearance">
          <div className="flex justify-between mb-6">
            <TabsList>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                {t("common.theme")}
              </TabsTrigger>
              <TabsTrigger value="language" className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                {t("common.language")}
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                {t("common.notifications")}
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {t("common.privacy")}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>{t("common.theme")}</CardTitle>
                <CardDescription>
                  {t("common.preferences")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={`p-4 rounded-lg border-2 ${settings.theme === 'light' ? 'border-indigo-600 dark:border-indigo-400' : 'border-transparent'} hover:border-indigo-600 dark:hover:border-indigo-400 cursor-pointer transition-all`}
                    onClick={() => updateSettings({ theme: 'light' })}
                  >
                    <div className="flex justify-center mb-4">
                      <Sun className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-center font-medium">{t("common.light")}</h3>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-lg border-2 ${settings.theme === 'dark' ? 'border-indigo-600 dark:border-indigo-400' : 'border-transparent'} hover:border-indigo-600 dark:hover:border-indigo-400 cursor-pointer transition-all`}
                    onClick={() => updateSettings({ theme: 'dark' })}
                  >
                    <div className="flex justify-center mb-4">
                      <Moon className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-center font-medium">{t("common.dark")}</h3>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-lg border-2 ${settings.theme === 'system' ? 'border-indigo-600 dark:border-indigo-400' : 'border-transparent'} hover:border-indigo-600 dark:hover:border-indigo-400 cursor-pointer transition-all`}
                    onClick={() => updateSettings({ theme: 'system' })}
                  >
                    <div className="flex justify-center mb-4">
                      <Monitor className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-center font-medium">{t("common.system")}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>{t("common.language")}</CardTitle>
                <CardDescription>
                  {t("common.preferences")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={`p-4 rounded-lg border-2 ${settings.language === 'en' ? 'border-indigo-600 dark:border-indigo-400' : 'border-transparent'} hover:border-indigo-600 dark:hover:border-indigo-400 cursor-pointer transition-all`}
                    onClick={() => updateSettings({ language: 'en' })}
                  >
                    <div className="text-center mb-4 text-4xl">🇺🇸</div>
                    <h3 className="text-center font-medium">{t("common.english")}</h3>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-lg border-2 ${settings.language === 'ru' ? 'border-indigo-600 dark:border-indigo-400' : 'border-transparent'} hover:border-indigo-600 dark:hover:border-indigo-400 cursor-pointer transition-all`}
                    onClick={() => updateSettings({ language: 'ru' })}
                  >
                    <div className="text-center mb-4 text-4xl">🇷🇺</div>
                    <h3 className="text-center font-medium">{t("common.russian")}</h3>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-lg border-2 ${settings.language === 'uz' ? 'border-indigo-600 dark:border-indigo-400' : 'border-transparent'} hover:border-indigo-600 dark:hover:border-indigo-400 cursor-pointer transition-all`}
                    onClick={() => updateSettings({ language: 'uz' })}
                  >
                    <div className="text-center mb-4 text-4xl">🇺🇿</div>
                    <h3 className="text-center font-medium">{t("common.uzbek")}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>{t("common.notifications")}</CardTitle>
                <CardDescription>
                  {t("common.preferences")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications-enabled" className="text-base">
                      {t("common.notifications")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("common.notifications")}
                    </p>
                  </div>
                  <Switch
                    id="notifications-enabled"
                    checked={settings.notificationsEnabled}
                    onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>{t("common.privacy")}</CardTitle>
                <CardDescription>
                  {t("common.preferences")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="privacy-mode">{t("common.privacy")}</Label>
                  <Select 
                    value={settings.privacyMode} 
                    onValueChange={(value) => updateSettings({ privacyMode: value as 'private' | 'shared' | 'family' })}
                  >
                    <SelectTrigger id="privacy-mode">
                      <SelectValue placeholder={t("common.privacy")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">{t("common.private")}</SelectItem>
                      <SelectItem value="shared">{t("common.shared")}</SelectItem>
                      <SelectItem value="family">{t("common.family")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-category">{t("common.defaultCategory")}</Label>
                  <Select 
                    value={settings.defaultCategory} 
                    onValueChange={(value) => updateSettings({ defaultCategory: value })}
                  >
                    <SelectTrigger id="default-category">
                      <SelectValue placeholder={t("common.defaultCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
