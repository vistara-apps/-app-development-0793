import { supabase, TABLES, handleSupabaseError, handleSupabaseSuccess } from '../lib/supabase.js'

class NicheSiteService {
  // Create a new niche site
  async createNicheSite(siteData) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return handleSupabaseError(new Error('User not authenticated'))
      }

      const { data, error } = await supabase
        .from(TABLES.NICHE_SITES)
        .insert([{
          ...siteData,
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

  // Get all niche sites for current user
  async getUserNicheSites() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return handleSupabaseError(new Error('User not authenticated'))
      }

      const { data, error } = await supabase
        .from(TABLES.NICHE_SITES)
        .select(`
          *,
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

  // Get a specific niche site by ID
  async getNicheSite(siteId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.NICHE_SITES)
        .select(`
          *,
          content:${TABLES.CONTENT}(*)
        `)
        .eq('id', siteId)
        .single()

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Update a niche site
  async updateNicheSite(siteId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.NICHE_SITES)
        .update(updates)
        .eq('id', siteId)
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

  // Delete a niche site (cascade deletes content)
  async deleteNicheSite(siteId) {
    try {
      const { error } = await supabase
        .from(TABLES.NICHE_SITES)
        .delete()
        .eq('id', siteId)

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess({ deleted: true })
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Update site revenue
  async updateRevenue(siteId, revenue) {
    try {
      const { data, error } = await supabase
        .from(TABLES.NICHE_SITES)
        .update({ revenue })
        .eq('id', siteId)
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

  // Get site analytics/stats
  async getSiteStats(siteId) {
    try {
      const [siteResult, contentResult] = await Promise.all([
        supabase
          .from(TABLES.NICHE_SITES)
          .select('revenue, created_at')
          .eq('id', siteId)
          .single(),
        supabase
          .from(TABLES.CONTENT)
          .select('word_count, reading_time, created_at')
          .eq('niche_site_id', siteId)
      ])

      if (siteResult.error) {
        return handleSupabaseError(siteResult.error)
      }

      if (contentResult.error) {
        return handleSupabaseError(contentResult.error)
      }

      const site = siteResult.data
      const content = contentResult.data || []

      const stats = {
        revenue: site.revenue || 0,
        contentCount: content.length,
        totalWordCount: content.reduce((sum, c) => sum + (c.word_count || 0), 0),
        averageWordCount: content.length > 0 
          ? content.reduce((sum, c) => sum + (c.word_count || 0), 0) / content.length 
          : 0,
        totalReadingTime: content.reduce((sum, c) => sum + (c.reading_time || 0), 0),
        siteAge: this._calculateSiteAge(site.created_at),
        contentByMonth: this._groupContentByMonth(content),
        revenuePerContent: content.length > 0 ? (site.revenue || 0) / content.length : 0
      }

      return handleSupabaseSuccess(stats)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Search niche sites by name
  async searchNicheSites(query) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return handleSupabaseError(new Error('User not authenticated'))
      }

      const { data, error } = await supabase
        .from(TABLES.NICHE_SITES)
        .select('*')
        .eq('user_id', user.id)
        .ilike('name', `%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get sites by monetization method
  async getSitesByMonetization(monetizationMethod) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return handleSupabaseError(new Error('User not authenticated'))
      }

      const { data, error } = await supabase
        .from(TABLES.NICHE_SITES)
        .select('*')
        .eq('user_id', user.id)
        .eq('monetization_method', monetizationMethod)
        .order('revenue', { ascending: false })

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get top performing sites by revenue
  async getTopSites(limit = 10) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return handleSupabaseError(new Error('User not authenticated'))
      }

      const { data, error } = await supabase
        .from(TABLES.NICHE_SITES)
        .select('*')
        .eq('user_id', user.id)
        .order('revenue', { ascending: false })
        .limit(limit)

      if (error) {
        return handleSupabaseError(error)
      }

      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Get portfolio overview
  async getPortfolioOverview() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return handleSupabaseError(new Error('User not authenticated'))
      }

      const { data, error } = await supabase
        .from(TABLES.NICHE_SITES)
        .select('revenue, monetization_method, created_at')
        .eq('user_id', user.id)

      if (error) {
        return handleSupabaseError(error)
      }

      const sites = data || []
      
      const overview = {
        totalSites: sites.length,
        totalRevenue: sites.reduce((sum, s) => sum + (s.revenue || 0), 0),
        averageRevenue: sites.length > 0 
          ? sites.reduce((sum, s) => sum + (s.revenue || 0), 0) / sites.length 
          : 0,
        monetizationBreakdown: this._groupByMonetization(sites),
        revenueByMonth: this._groupRevenueByMonth(sites),
        topRevenueSite: sites.reduce((max, site) => 
          (site.revenue || 0) > (max.revenue || 0) ? site : max, 
          { revenue: 0 }
        )
      }

      return handleSupabaseSuccess(overview)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }

  // Helper method to calculate site age in days
  _calculateSiteAge(createdAt) {
    const created = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now - created)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
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

  // Helper method to group sites by monetization method
  _groupByMonetization(sites) {
    const grouped = {}
    
    sites.forEach(site => {
      const method = site.monetization_method || 'unknown'
      if (!grouped[method]) {
        grouped[method] = { count: 0, revenue: 0 }
      }
      grouped[method].count++
      grouped[method].revenue += site.revenue || 0
    })

    return grouped
  }

  // Helper method to group revenue by month
  _groupRevenueByMonth(sites) {
    // This is a simplified version - in a real app, you'd track revenue over time
    const grouped = {}
    
    sites.forEach(site => {
      const date = new Date(site.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = 0
      }
      grouped[monthKey] += site.revenue || 0
    })

    return grouped
  }

  // Clone a site structure (without content)
  async cloneSite(siteId, newName) {
    try {
      const { data: originalSite, error: fetchError } = await supabase
        .from(TABLES.NICHE_SITES)
        .select('*')
        .eq('id', siteId)
        .single()

      if (fetchError) {
        return handleSupabaseError(fetchError)
      }

      const { id, created_at, updated_at, ...siteData } = originalSite
      
      const clonedSite = {
        ...siteData,
        name: newName,
        url: null, // Reset URL for new site
        revenue: 0 // Reset revenue for new site
      }

      return await this.createNicheSite(clonedSite)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}

export const nicheSiteService = new NicheSiteService()
export default NicheSiteService

