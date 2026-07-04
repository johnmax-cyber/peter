import { supabase } from '@/lib/supabase'
import { User } from '@/types/database'
import { useAuthStore } from './auth-store'

export const useAuth = () => {
  const { setUser, setLoading, setError, user, isLoading, error } = useAuthStore()

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return { error }
    }
    if (data.user) {
      const profile: User = {
        id: data.user.id,
        email: data.user.email ?? '',
        full_name: fullName,
        avatar_url: null,
        role: 'student',
        email_verified: false,
        created_at: data.user.created_at ?? new Date().toISOString(),
        updated_at: data.user.updated_at ?? new Date().toISOString()
      }
      setUser(profile)
    }
    setLoading(false)
    return { data }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return { error }
    }
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      setUser(profile as User)
    }
    setLoading(false)
    return { data }
  }

  const signOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setLoading(false)
  }

  const initialize = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setUser(profile as User)
      }
    } catch (err) {
      console.error('Auth initialization error:', err)
    } finally {
      setLoading(false)
    }
  }

  return { user, isLoading, error, signUp, signIn, signOut, initialize }
}