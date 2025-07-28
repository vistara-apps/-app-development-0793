import { supabase, TABLES, handleSupabaseError, handleSupabaseSuccess } from '../lib/supabase.js'

class KeywordService {
  // Create a new keyword
  async createKeyword(keywordData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.KEYWORDS)
        .insert([keywordData])
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

  // Create multiple keywords at once
  async createKeywords(keywordsData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.KEYWORDS)
        .insert(keywordsData)
        .select()

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get all keywords for a specific niche
  async getKeywordsByNiche(nicheId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.KEYWORDS)
        .select('*')
        .eq('niche_id', nicheId)
        .order('search_volume', { ascending: false })

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get a specific keyword by ID
  async getKeyword(keywordId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.KEYWORDS)
        .select(`
          *,
          niche:${TABLES.NICHES}(*)
        `)
        .eq('id', keywordId)
        .single()

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Update a keyword
  async updateKeyword(keywordId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.KEYWORDS)
        .update(updates)
        .eq('id', keywordId)
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

  // Delete a keyword
  async deleteKeyword(keywordId) {
    try {
      const { error } = await supabase
        .from(TABLES.KEYWORDS)
        .delete()
        .eq('id', keywordId)

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess({ deleted: true })
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Delete all keywords for a niche
  async deleteKeywordsByNiche(nicheId) {
    try {
      const { error } = await supabase
        .from(TABLES.KEYWORDS)
        .delete()
        .eq('niche_id', nicheId)

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess({ deleted: true })
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Search keywords by name
  async searchKeywords(nicheId, query) {
    try {
      const { data, error } = await supabase
        .from(TABLES.KEYWORDS)
        .select('*')
        .eq('niche_id', nicheId)
        .ilike('name', `%${query}%`)
        .order('search_volume', { ascending: false })

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get keywords by competition level
  async getKeywordsByCompetition(nicheId, competitionLevel) {
    try {
      const { data, error } = await supabase
        .from(TABLES.KEYWORDS)
        .select('*')
        .eq('niche_id', nicheId)
        .eq('competition_level', competitionLevel)
        .order('search_volume', { ascending: false })

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get top keywords by search volume
  async getTopKeywords(nicheId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from(TABLES.KEYWORDS)
        .select('*')
        .eq('niche_id', nicheId)
        .order('search_volume', { ascending: false })
        .limit(limit)

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get keywords with highest CPC value
  async getHighValueKeywords(nicheId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from(TABLES.KEYWORDS)
        .select('*')
        .eq('niche_id', nicheId)
        .order('cpc_value', { ascending: false })
        .limit(limit)

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get keyword analytics for a niche
  async getKeywordAnalytics(nicheId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.KEYWORDS)
        .select('search_volume, competition_level, cpc_value')
        .eq('niche_id', nicheId)

      if (error) {
        return handleSupabaseError(error)
      }

      const keywords = data || []
      
      const analytics = {
        totalKeywords: keywords.length,
        totalSearchVolume: keywords.reduce((sum, k) => sum + (k.search_volume || 0), 0),
        averageSearchVolume: keywords.length > 0 
          ? keywords.reduce((sum, k) => sum + (k.search_volume || 0), 0) / keywords.length 
          : 0,
        averageCPC: keywords.length > 0 
          ? keywords.reduce((sum, k) => sum + (k.cpc_value || 0), 0) / keywords.length 
          : 0,
        competitionBreakdown: {
          low: keywords.filter(k => k.competition_level === 'low').length,
          medium: keywords.filter(k => k.competition_level === 'medium').length,
          high: keywords.filter(k => k.competition_level === 'high').length
        },
        topSearchVolume: Math.max(...keywords.map(k => k.search_volume || 0), 0),
        topCPC: Math.max(...keywords.map(k => k.cpc_value || 0), 0)
      }

      return handleSupabaseSuccess(analytics)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Bulk update keywords
  async bulkUpdateKeywords(updates) {
    try {
      const promises = updates.map(({ id, ...updateData }) =>
        supabase
          .from(TABLES.KEYWORDS)
          .update(updateData)
          .eq('id', id)
          .select()
          .single()
      )

      const results = await Promise.all(promises)
      
      const errors = results.filter(result => result.error)
      if (errors.length > 0) {
        return handleSupabaseError(new Error(`Failed to update ${errors.length} keywords`))
      }

      const data = results.map(result => result.data)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}

export const keywordService = new KeywordService()
export default KeywordService

