import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  };

  const updateProfile = async ({ name, email, photoURL }) => {
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
    if (userError || !currentUser) throw userError || new Error("User not found");

    const updates = {
      id: currentUser.id,
      username: name,
      avatar_url: photoURL,
      updated_at: new Date().toISOString(),
    };

    const { error: dbError } = await supabase
      .from('profiles')
      .upsert(updates, { returning: 'minimal' });

    if (dbError) throw dbError;

    const { data: updatedUser, error: authError } = await supabase.auth.updateUser({
      data: {
        name,
        photoURL,
      },
    });

    if (authError) throw authError;

    const { data: refreshed } = await supabase.auth.getUser();
    setUser(refreshed.user);
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      getProfile,
      updateProfile,
      signIn,
      signUp,
      signOut,
      resetPassword,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
