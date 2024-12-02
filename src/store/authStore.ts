import { create } from 'zustand';
import type { AuthState, User } from '../types';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface UpdateProfileData {
  name: string;
  bio?: string;
  email: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (userError) throw userError;

        set({
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            bio: userData.bio || '',
            profileImage: userData.profile_image,
            rating: userData.rating,
            reviewCount: userData.review_count,
            isVerified: userData.is_verified,
            isAdmin: userData.is_admin,
            identityVerified: userData.identity_verified,
            skills: [],
          },
          isAuthenticated: true,
        });

        toast.success('Logged in successfully');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Failed to log in');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (email: string, password: string, name: string) => {
    set({ isLoading: true });
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Wait for the database trigger to create the user profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;

      set({
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          bio: userData.bio || '',
          profileImage: userData.profile_image,
          rating: userData.rating,
          reviewCount: userData.review_count,
          isVerified: userData.is_verified,
          isAdmin: userData.is_admin,
          identityVerified: userData.identity_verified,
          skills: [],
        },
        isAuthenticated: true,
      });

      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, isAuthenticated: false });
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out');
    }
  },

  updateProfile: async (data: UpdateProfileData) => {
    set({ isLoading: true });
    try {
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('users')
        .update({
          name: data.name,
          bio: data.bio,
          email: data.email,
        })
        .eq('id', user.id);

      if (error) throw error;

      set(state => ({
        user: state.user ? {
          ...state.user,
          ...data,
        } : null,
      }));

      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Profile update failed:', error);
      toast.error(error.message || 'Failed to update profile');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  requestIdentityVerification: async (documents: File[]) => {
    set({ isLoading: true });
    try {
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('No user logged in');

      for (const document of documents) {
        const filePath = `${user.id}/${document.name}`;
        const { error: uploadError } = await supabase.storage
          .from('verification-documents')
          .upload(filePath, document, {
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase
          .from('verification_documents')
          .insert({
            type: 'identity',
            name: document.name,
            url: filePath,
            user_id: user.id,
            status: 'pending',
          });

        if (dbError) throw dbError;
      }

      toast.success('Identity verification documents submitted');
    } catch (error: any) {
      console.error('Identity verification failed:', error);
      toast.error(error.message || 'Failed to submit identity verification');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  requestSkillVerification: async (skillId: string, documents: File[]) => {
    set({ isLoading: true });
    try {
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('No user logged in');

      for (const document of documents) {
        const filePath = `${user.id}/${skillId}/${document.name}`;
        const { error: uploadError } = await supabase.storage
          .from('verification-documents')
          .upload(filePath, document, {
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase
          .from('verification_documents')
          .insert({
            type: 'skill',
            name: document.name,
            url: filePath,
            user_id: user.id,
            skill_id: skillId,
            status: 'pending',
          });

        if (dbError) throw dbError;
      }

      toast.success('Skill verification documents submitted');
    } catch (error: any) {
      console.error('Skill verification failed:', error);
      toast.error(error.message || 'Failed to submit skill verification');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));