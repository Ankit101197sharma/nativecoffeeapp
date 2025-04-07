import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qwcguzkfshgxjtwywteg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3Y2d1emtmc2hneGp0d3l3dGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMjM3MjAsImV4cCI6MjA1ODg5OTcyMH0.uQ_xRPWfDbnmkff_ZW0egnXnuHqKkBV1E5VSmu2mAGw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }
});

// Safe session getter
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data?.session || null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Safe user getter
export const getUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data?.user || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Get access token safely
export const getAccessToken = async () => {
  const session = await getSession();
  return session?.access_token || null;
};