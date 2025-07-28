import { supabase, TABLES, handleSupabaseError, handleSupabaseSuccess } from '../lib/supabase.js'

class UserService {
  // Get current user profile
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return handleSupabaseSuccess(null)
      }

      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Update user profile
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Update user plan
  async updatePlan(userId, planType) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update({ plan_type: planType })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get user statistics
  async getUserStats(userId) {
    try {
      // Get counts for user's data
      const [nichesResult, sitesResult, contentResult] = await Promise.all([
        supabase
          .from(TABLES.NICHES)
          .select('id', { count: 'exact' })
          .eq('user_id', userId),
        supabase
          .from(TABLES.NICHE_SITES)
          .select('id', { count: 'exact' })
          .eq('user_id', userId),
        supabase
          .from(TABLES.CONTENT)
          .select('id', { count: 'exact' })
          .eq('niche_id', userId) // This will need to be adjusted based on actual relationships
      ])

      const stats = {
        nichesCount: nichesResult.count || 0,
        sitesCount: sitesResult.count || 0,
        contentCount: contentResult.count || 0
      }

      return handleSupabaseSuccess(stats)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Delete user account (cascade delete all related data)
  async deleteAccount(userId) {
    try {
      // Supabase will handle cascade deletes based on foreign key constraints
      const { error } = await supabase
        .from(TABLES.USERS)
        .delete()
        .eq('id', userId)

      if (error) {
        return handleSupabaseError(error)
      }

      // Also delete from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId)
      
      if (authError) {
        console.warn('Failed to delete auth user:', authError)
      }

      return handleSupabaseSuccess({ deleted: true })
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}

export const userService = new UserService()
export default UserService

