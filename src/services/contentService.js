import { supabase, TABLES, handleSupabaseError, handleSupabaseSuccess } from '../lib/supabase.js'

class ContentService {
  // Create new content
  async createContent(contentData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CONTENT)
        .insert([contentData])
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

  // Get content by niche
  async getContentByNiche(nicheId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CONTENT)
        .select(`
          *,
          niche:${TABLES.NICHES}(name)
        `)
        .eq('niche_id', nicheId)
        .order('created_at', { ascending: false })

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get content by niche site
  async getContentByNicheSite(nicheSiteId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CONTENT)
        .select(`
          *,
          niche_site:${TABLES.NICHE_SITES}(name)
        `)
        .eq('niche_site_id', nicheSiteId)
        .order('created_at', { ascending: false })

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get all content for current user
  async getUserContent() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return handleSupabaseError(new Error('User not authenticated'))
      }

      const { data, error } = await supabase
        .from(TABLES.CONTENT)
        .select(`
          *,
          niche:${TABLES.NICHES}!inner(name, user_id),
          niche_site:${TABLES.NICHE_SITES}(name, user_id)
        `)
        .or(`niche.user_id.eq.${user.id},niche_site.user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get specific content by ID
  async getContent(contentId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CONTENT)
        .select(`
          *,
          niche:${TABLES.NICHES}(name),
          niche_site:${TABLES.NICHE_SITES}(name)
        `)
        .eq('id', contentId)
        .single()

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Update content
  async updateContent(contentId, updates) {
    try {
      // Calculate word count and reading time if body is updated
      if (updates.body) {
        const wordCount = updates.body.split(/\s+/).length
        const readingTime = Math.ceil(wordCount / 200) // Assuming 200 words per minute
        
        updates.word_count = wordCount
        updates.reading_time = readingTime
      }

      const { data, error } = await supabase
        .from(TABLES.CONTENT)
        .update(updates)
        .eq('id', contentId)
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

  // Delete content
  async deleteContent(contentId) {
    try {
      const { error } = await supabase
        .from(TABLES.CONTENT)
        .delete()
        .eq('id', contentId)

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess({ deleted: true })
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Search content by title or body
  async searchContent(query, nicheId = null, nicheSiteId = null) {
    try {
      let queryBuilder = supabase
        .from(TABLES.CONTENT)
        .select(`
          *,
          niche:${TABLES.NICHES}(name),
          niche_site:${TABLES.NICHE_SITES}(name)
        `)
        .or(`title.ilike.%${query}%,body.ilike.%${query}%`)

      if (nicheId) {
        queryBuilder = queryBuilder.eq('niche_id', nicheId)
      }

      if (nicheSiteId) {
        queryBuilder = queryBuilder.eq('niche_site_id', nicheSiteId)
      }

      const { data, error } = await queryBuilder
        .order('created_at', { ascending: false })

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get content analytics
  async getContentAnalytics(nicheId = null, nicheSiteId = null) {
    try {
      let queryBuilder = supabase
        .from(TABLES.CONTENT)
        .select('word_count, reading_time, created_at')

      if (nicheId) {
        queryBuilder = queryBuilder.eq('niche_id', nicheId)
      }

      if (nicheSiteId) {
        queryBuilder = queryBuilder.eq('niche_site_id', nicheSiteId)
      }

      const { data, error } = await queryBuilder

      if (error) {
        return handleSupabaseError(error)
      }

      const content = data || []
      
      const analytics = {
        totalContent: content.length,
        totalWordCount: content.reduce((sum, c) => sum + (c.word_count || 0), 0),
        averageWordCount: content.length > 0 
          ? content.reduce((sum, c) => sum + (c.word_count || 0), 0) / content.length 
          : 0,
        totalReadingTime: content.reduce((sum, c) => sum + (c.reading_time || 0), 0),
        averageReadingTime: content.length > 0
          ? content.reduce((sum, c) => sum + (c.reading_time || 0), 0) / content.length
          : 0,
        contentByMonth: this._groupContentByMonth(content)
      }

      return handleSupabaseSuccess(analytics)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get recent content
  async getRecentContent(limit = 10) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return handleSupabaseError(new Error('User not authenticated'))
      }

      const { data, error } = await supabase
        .from(TABLES.CONTENT)
        .select(`
          *,
          niche:${TABLES.NICHES}!inner(name, user_id),
          niche_site:${TABLES.NICHE_SITES}(name, user_id)
        `)
        .or(`niche.user_id.eq.${user.id},niche_site.user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Bulk create content
  async bulkCreateContent(contentArray) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CONTENT)
        .insert(contentArray)
        .select()

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Helper method to group content by month
  _groupContentByMonth(content) {
    const grouped = {}
    
    content.forEach(item => {
      const date = new Date(item.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = 0
      }
      grouped[monthKey]++
    })

    return grouped
  }

  // Get content performance metrics (mock implementation)
  async getContentPerformance(contentId) {
    try {
      // This would integrate with analytics services in a real app
      const mockMetrics = {
        views: Math.floor(Math.random() * 10000),
        shares: Math.floor(Math.random() * 500),
        engagement: Math.floor(Math.random() * 100),
        conversionRate: (Math.random() * 10).toFixed(2),
        revenue: (Math.random() * 1000).toFixed(2)
      }

      return handleSupabaseSuccess(mockMetrics)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}

export const contentService = new ContentService()
export default ContentService

