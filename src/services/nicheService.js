import { supabase, TABLES, handleSupabaseError, handleSupabaseSuccess } from '../lib/supabase.js'

class NicheService {
  // Create a new niche
  async createNiche(nicheData) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return handleSupabaseError(new Error('User not authenticated'))
      }

      const { data, error } = await supabase
        .from(TABLES.NICHES)
        .insert([{
          ...nicheData,
          user_id: user.id
        }])
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

  // Get all niches for current user
  async getUserNiches() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return handleSupabaseError(new Error('User not authenticated'))
      }

      const { data, error } = await supabase
        .from(TABLES.NICHES)
        .select(`
          *,
          keywords:${TABLES.KEYWORDS}(count),
          content:${TABLES.CONTENT}(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get a specific niche by ID
  async getNiche(nicheId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.NICHES)
        .select(`
          *,
          keywords:${TABLES.KEYWORDS}(*),
          content:${TABLES.CONTENT}(*)
        `)
        .eq('id', nicheId)
        .single()

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Update a niche
  async updateNiche(nicheId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.NICHES)
        .update(updates)
        .eq('id', nicheId)
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

  // Delete a niche (cascade deletes keywords and content)
  async deleteNiche(nicheId) {
    try {
      const { error } = await supabase
        .from(TABLES.NICHES)
        .delete()
        .eq('id', nicheId)

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess({ deleted: true })
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get niche analytics/stats
  async getNicheStats(nicheId) {
    try {
      const [keywordsResult, contentResult] = await Promise.all([
        supabase
          .from(TABLES.KEYWORDS)
          .select('search_volume, competition_level, cpc_value')
          .eq('niche_id', nicheId),
        supabase
          .from(TABLES.CONTENT)
          .select('word_count, reading_time')
          .eq('niche_id', nicheId)
      ])

      if (keywordsResult.error) {
        return handleSupabaseError(keywordsResult.error)
      }

      if (contentResult.error) {
        return handleSupabaseError(contentResult.error)
      }

      const keywords = keywordsResult.data || []
      const content = contentResult.data || []

      const stats = {
        keywordCount: keywords.length,
        totalSearchVolume: keywords.reduce((sum, k) => sum + (k.search_volume || 0), 0),
        averageCPC: keywords.length > 0 
          ? keywords.reduce((sum, k) => sum + (k.cpc_value || 0), 0) / keywords.length 
          : 0,
        competitionBreakdown: {
          low: keywords.filter(k => k.competition_level === 'low').length,
          medium: keywords.filter(k => k.competition_level === 'medium').length,
          high: keywords.filter(k => k.competition_level === 'high').length
        },
        contentCount: content.length,
        totalWordCount: content.reduce((sum, c) => sum + (c.word_count || 0), 0),
        averageReadingTime: content.length > 0
          ? content.reduce((sum, c) => sum + (c.reading_time || 0), 0) / content.length
          : 0
      }

      return handleSupabaseSuccess(stats)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Search niches by name or description
  async searchNiches(query) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return handleSupabaseError(new Error('User not authenticated'))
      }

      const { data, error } = await supabase
        .from(TABLES.NICHES)
        .select('*')
        .eq('user_id', user.id)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get trending niches (mock implementation - would need external data)
  async getTrendingNiches() {
    try {
      // This is a mock implementation
      // In a real app, this would integrate with external APIs or trend data
      const trendingNiches = [
        {
          name: 'Sustainable Living',
          description: 'Eco-friendly lifestyle and products',
          searchVolume: 45000,
          competitionLevel: 'medium',
          monetizationPotential: 75,
          trend: 'rising'
        },
        {
          name: 'Remote Work Tools',
          description: 'Productivity tools for remote workers',
          searchVolume: 38000,
          competitionLevel: 'high',
          monetizationPotential: 85,
          trend: 'stable'
        },
        {
          name: 'Plant-Based Nutrition',
          description: 'Vegan and vegetarian diet information',
          searchVolume: 52000,
          competitionLevel: 'medium',
          monetizationPotential: 70,
          trend: 'rising'
        }
      ]

      return handleSupabaseSuccess(trendingNiches)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}

export const nicheService = new NicheService()
export default NicheService

