
'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { Profile } from '@/types';
import { toast } from 'sonner';

export default function AccountPage() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (error) console.warn(error);
        else setProfile(data);
      }
      setLoading(false);
    }
    getProfile();
  }, [supabase]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    const filePath = `${profile.id}/${Date.now()}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

    if (uploadError) {
    toast.error("Upload Failed", { description: "There was an error uploading your picture." });
    return;
  }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

    const { error: updateError } = await supabase.from('profiles').update({ image_url: publicUrl }).eq('id', profile.id);

   if (updateError) {
    toast.error("Update Failed", { description: "Could not save the new profile picture." });
  } else {
      window.location.reload(); 
      toast.success("Success!", { description: "Your profile picture has been updated." });
  }};

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold">Account Settings</h1>
      <div className="mt-6 flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile?.image_url || undefined} alt="User avatar" />
          <AvatarFallback>{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <label htmlFor="avatar-upload" className="cursor-pointer bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-md">
            Upload New Picture
          </label>
          <input id="avatar-upload" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </div>
      </div>
    </div>
  );
}