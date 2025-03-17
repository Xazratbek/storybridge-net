
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useToast } from "@/components/ui/use-toast";
import Layout from '@/components/Layout';
import { getCurrentUser } from "@/utils/authUtils";
import { useQuery } from "@tanstack/react-query";
import { User, Camera, Save, X } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Fetch current user
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });
  
  const [name, setName] = useState<string>(currentUser?.name || "");
  const [email, setEmail] = useState<string>(currentUser?.email || "");
  const [avatar, setAvatar] = useState<string | undefined>(currentUser?.avatar);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Redirect if not authenticated
  if (!isLoading && !currentUser) {
    navigate("/login");
    return null;
  }
  
  const handleSaveProfile = () => {
    // Here you would implement the actual profile update logic
    // For now, we'll just show a toast
    toast({
      title: t("common.success"),
      description: t("common.personalInfo") + " " + t("common.save"),
    });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    // Reset form values to original
    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");
    setAvatar(currentUser?.avatar);
    setIsEditing(false);
  };
  
  // Loading state
  if (isLoading) {
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
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-800 dark:text-indigo-400 mb-2 font-serif">
              {t("common.profile")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("common.personalInfo")}
            </p>
          </div>
          
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              {t("common.edit")}
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSaveProfile}>
                <Save className="mr-2 h-4 w-4" />
                {t("common.save")}
              </Button>
            </div>
          )}
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("common.personalInfo")}</CardTitle>
            <CardDescription>
              {t("common.personalInfo")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
                  <AvatarFallback className="text-3xl bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200">
                    {name?.substring(0, 2).toUpperCase() || "MN"}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing && (
                  <Button variant="outline" size="sm" className="mt-2">
                    <Camera className="mr-2 h-4 w-4" />
                    {t("common.uploadAvatar")}
                  </Button>
                )}
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("common.fullName")}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t("common.emailAddress")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("common.updatePassword")}</CardTitle>
            <CardDescription>
              {t("common.updatePassword")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">{t("common.currentPassword")}</Label>
                <Input id="current-password" type="password" disabled={!isEditing} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">{t("common.newPassword")}</Label>
                <Input id="new-password" type="password" disabled={!isEditing} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t("common.confirmPassword")}</Label>
                <Input id="confirm-password" type="password" disabled={!isEditing} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {isEditing && (
              <Button disabled={!isEditing} variant="outline">
                {t("common.updatePassword")}
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">{t("common.deleteAccount")}</CardTitle>
            <CardDescription>
              {t("common.deleteAccountWarning")}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  {t("common.deleteAccount")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("common.deleteAccount")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("common.deleteAccountWarning")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                    {t("common.deleteAccount")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
