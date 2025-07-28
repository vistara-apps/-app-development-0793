import { aiService } from './aiService.js'
import { nicheService } from './nicheService.js'
import { keywordService } from './keywordService.js'

class ResearchService {
  constructor() {
    this.aiService = aiService
    this.nicheService = nicheService
    this.keywordService = keywordService
  }

  // Comprehensive niche research workflow
  async conductNicheResearch(nicheIdea) {
    try {
      // Step 1: AI-powered niche analysis
      const aiResearch = await this.aiService.researchNiche(nicheIdea)
      
      if (!aiResearch.success) {
        return aiResearch
      }

      const { niche, keywords, opportunities, painPoints, contentIdeas } = aiResearch.data

      // Step 2: Create niche in database
      const nicheResult = await this.nicheService.createNiche({
        name: niche.name,
        description: niche.description,
        search_volume: niche.searchVolume,
        competition_level: niche.competitionLevel,
        monetization_potential: niche.monetizationPotential
      })

      if (!nicheResult.success) {
        return nicheResult
      }

      const createdNiche = nicheResult.data

      // Step 3: Save keywords to database
      const keywordsToSave = keywords.map(keyword => ({
        name: keyword.name,
        search_volume: keyword.searchVolume,
        competition_level: keyword.competitionLevel,
        cpc_value: keyword.cpcValue,
        niche_id: createdNiche.id
      }))

      const keywordsResult = await this.keywordService.createKeywords(keywordsToSave)

      if (!keywordsResult.success) {
        console.warn('Failed to save keywords:', keywordsResult.error)
      }

      // Step 4: Return comprehensive research data
      return {
        success: true,
        data: {
          niche: createdNiche,
          keywords: keywordsResult.success ? keywordsResult.data : [],
          opportunities,
          painPoints,
          contentIdeas,
          researchSummary: {
            totalKeywords: keywords.length,
            averageSearchVolume: keywords.reduce((sum, k) => sum + k.searchVolume, 0) / keywords.length,
            competitionBreakdown: this._analyzeCompetition(keywords),
            monetizationScore: niche.monetizationPotential
          }
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Research Reddit pain points for a niche
  async researchRedditPainPoints(niche) {
    try {
      // This would integrate with Reddit API in a real implementation
      // For now, we'll use AI to simulate Reddit research
      const prompt = `Research pain points and problems discussed on Reddit related to the "${niche}" niche.

Simulate what you would find by analyzing Reddit posts, comments, and discussions in relevant subreddits.

Focus on:
- Common complaints and frustrations
- Unmet needs and desires
- Questions people frequently ask
- Problems they're trying to solve
- Product/service gaps they mention

Provide realistic pain points that would actually be discussed on Reddit.

Response format:
{
  "painPoints": [
    {
      "problem": "specific problem description",
      "frequency": "how often mentioned (high/medium/low)",
      "subreddits": ["relevant subreddit names"],
      "sentiment": "overall sentiment (frustrated/confused/seeking)",
      "businessOpportunity": "potential business opportunity this represents"
    }
  ],
  "trendingTopics": [
    "trending topic 1",
    "trending topic 2"
  ],
  "commonQuestions": [
    "frequently asked question 1",
    "frequently asked question 2"
  ]
}`

      const response = await this.aiService.client.generateStructuredResponse(prompt, {
        painPoints: [{
          problem: 'string',
          frequency: 'string',
          subreddits: ['string'],
          sentiment: 'string',
          businessOpportunity: 'string'
        }],
        trendingTopics: ['string'],
        commonQuestions: ['string']
      })

      return {
        success: true,
        data: response
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Analyze search trends for keywords
  async analyzeSearchTrends(keywords) {
    try {
      // This would integrate with Google Trends API in a real implementation
      // For now, we'll simulate trend analysis
      const trendData = keywords.map(keyword => ({
        keyword: keyword.name || keyword,
        trend: this._generateMockTrend(),
        seasonality: this._generateSeasonality(),
        relatedQueries: this._generateRelatedQueries(keyword.name || keyword),
        geographicInterest: this._generateGeographicData()
      }))

      return {
        success: true,
        data: {
          trends: trendData,
          summary: {
            overallTrend: this._calculateOverallTrend(trendData),
            bestPerformingKeywords: trendData
              .sort((a, b) => b.trend.growth - a.trend.growth)
              .slice(0, 5),
            seasonalInsights: this._generateSeasonalInsights(trendData)
          }
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Generate content calendar based on research
  async generateContentCalendar(nicheId, months = 3) {
    try {
      // Get niche data and keywords
      const nicheResult = await this.nicheService.getNiche(nicheId)
      if (!nicheResult.success) {
        return nicheResult
      }

      const niche = nicheResult.data
      const keywords = niche.keywords || []

      // Generate content ideas using AI
      const contentIdeasResult = await this.aiService.generateContentIdeas(
        niche.name, 
        'mixed', 
        months * 8 // ~8 pieces of content per month
      )

      if (!contentIdeasResult.success) {
        return contentIdeasResult
      }

      const contentIdeas = contentIdeasResult.data

      // Organize into calendar format
      const calendar = this._organizeIntoCalendar(contentIdeas, months)

      return {
        success: true,
        data: {
          niche: niche.name,
          timeframe: `${months} months`,
          calendar,
          summary: {
            totalContent: contentIdeas.length,
            contentTypes: this._analyzeContentTypes(contentIdeas),
            difficultyBreakdown: this._analyzeDifficulty(contentIdeas),
            estimatedWorkload: this._calculateWorkload(contentIdeas)
          }
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Validate niche viability
  async validateNicheViability(nicheData) {
    try {
      const { searchVolume, competitionLevel, monetizationPotential, keywords = [] } = nicheData

      const viabilityScore = this._calculateViabilityScore({
        searchVolume,
        competitionLevel,
        monetizationPotential,
        keywordCount: keywords.length
      })

      const recommendations = this._generateViabilityRecommendations(viabilityScore, nicheData)

      return {
        success: true,
        data: {
          viabilityScore,
          rating: this._getViabilityRating(viabilityScore),
          recommendations,
          strengths: this._identifyStrengths(nicheData),
          weaknesses: this._identifyWeaknesses(nicheData),
          nextSteps: this._suggestNextSteps(viabilityScore, nicheData)
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Helper methods
  _analyzeCompetition(keywords) {
    const total = keywords.length
    const low = keywords.filter(k => k.competitionLevel === 'low').length
    const medium = keywords.filter(k => k.competitionLevel === 'medium').length
    const high = keywords.filter(k => k.competitionLevel === 'high').length

    return {
      low: { count: low, percentage: (low / total * 100).toFixed(1) },
      medium: { count: medium, percentage: (medium / total * 100).toFixed(1) },
      high: { count: high, percentage: (high / total * 100).toFixed(1) }
    }
  }

  _generateMockTrend() {
    return {
      growth: (Math.random() * 200 - 100).toFixed(1), // -100% to +100%
      direction: Math.random() > 0.5 ? 'rising' : 'declining',
      stability: Math.random() > 0.7 ? 'stable' : 'volatile'
    }
  }

  _generateSeasonality() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map(month => ({
      month,
      interest: Math.floor(Math.random() * 100)
    }))
  }

  _generateRelatedQueries(keyword) {
    return [
      `best ${keyword}`,
      `${keyword} guide`,
      `how to ${keyword}`,
      `${keyword} tips`,
      `${keyword} reviews`
    ]
  }

  _generateGeographicData() {
    const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany']
    return countries.map(country => ({
      country,
      interest: Math.floor(Math.random() * 100)
    }))
  }

  _calculateOverallTrend(trendData) {
    const avgGrowth = trendData.reduce((sum, t) => sum + parseFloat(t.trend.growth), 0) / trendData.length
    return {
      averageGrowth: avgGrowth.toFixed(1),
      direction: avgGrowth > 0 ? 'positive' : 'negative',
      confidence: Math.random() > 0.5 ? 'high' : 'medium'
    }
  }

  _generateSeasonalInsights(trendData) {
    return [
      'Peak interest typically occurs in Q4',
      'Summer months show decreased search volume',
      'Back-to-school season drives increased interest'
    ]
  }

  _organizeIntoCalendar(contentIdeas, months) {
    const calendar = {}
    const ideasPerMonth = Math.ceil(contentIdeas.length / months)

    for (let i = 0; i < months; i++) {
      const monthDate = new Date()
      monthDate.setMonth(monthDate.getMonth() + i)
      const monthKey = monthDate.toISOString().slice(0, 7) // YYYY-MM format

      calendar[monthKey] = contentIdeas.slice(i * ideasPerMonth, (i + 1) * ideasPerMonth)
    }

    return calendar
  }

  _analyzeContentTypes(contentIdeas) {
    const types = {}
    contentIdeas.forEach(idea => {
      types[idea.type] = (types[idea.type] || 0) + 1
    })
    return types
  }

  _analyzeDifficulty(contentIdeas) {
    const difficulty = { easy: 0, medium: 0, hard: 0 }
    contentIdeas.forEach(idea => {
      difficulty[idea.difficulty] = (difficulty[idea.difficulty] || 0) + 1
    })
    return difficulty
  }

  _calculateWorkload(contentIdeas) {
    const totalWords = contentIdeas.reduce((sum, idea) => sum + (idea.estimatedWordCount || 0), 0)
    const estimatedHours = totalWords / 500 // Assuming 500 words per hour
    return {
      totalWords,
      estimatedHours: Math.ceil(estimatedHours),
      estimatedDays: Math.ceil(estimatedHours / 8)
    }
  }

  _calculateViabilityScore({ searchVolume, competitionLevel, monetizationPotential, keywordCount }) {
    let score = 0

    // Search volume score (0-30 points)
    if (searchVolume > 50000) score += 30
    else if (searchVolume > 20000) score += 25
    else if (searchVolume > 10000) score += 20
    else if (searchVolume > 5000) score += 15
    else score += 10

    // Competition score (0-25 points)
    if (competitionLevel === 'low') score += 25
    else if (competitionLevel === 'medium') score += 15
    else score += 5

    // Monetization score (0-30 points)
    score += (monetizationPotential / 100) * 30

    // Keyword diversity score (0-15 points)
    if (keywordCount > 20) score += 15
    else if (keywordCount > 10) score += 10
    else if (keywordCount > 5) score += 5

    return Math.round(score)
  }

  _getViabilityRating(score) {
    if (score >= 80) return 'Excellent'
    if (score >= 65) return 'Good'
    if (score >= 50) return 'Fair'
    if (score >= 35) return 'Poor'
    return 'Very Poor'
  }

  _generateViabilityRecommendations(score, nicheData) {
    const recommendations = []

    if (score < 50) {
      recommendations.push('Consider researching additional niches with higher potential')
    }

    if (nicheData.competitionLevel === 'high') {
      recommendations.push('Focus on long-tail keywords to avoid high competition')
    }

    if (nicheData.searchVolume < 10000) {
      recommendations.push('Look for related niches with higher search volume')
    }

    if (nicheData.monetizationPotential < 50) {
      recommendations.push('Research additional monetization methods for this niche')
    }

    return recommendations
  }

  _identifyStrengths(nicheData) {
    const strengths = []

    if (nicheData.searchVolume > 20000) {
      strengths.push('High search volume indicates strong market demand')
    }

    if (nicheData.competitionLevel === 'low') {
      strengths.push('Low competition provides easier market entry')
    }

    if (nicheData.monetizationPotential > 70) {
      strengths.push('High monetization potential for revenue generation')
    }

    return strengths
  }

  _identifyWeaknesses(nicheData) {
    const weaknesses = []

    if (nicheData.searchVolume < 5000) {
      weaknesses.push('Low search volume may limit audience reach')
    }

    if (nicheData.competitionLevel === 'high') {
      weaknesses.push('High competition will make ranking difficult')
    }

    if (nicheData.monetizationPotential < 40) {
      weaknesses.push('Limited monetization options may affect profitability')
    }

    return weaknesses
  }

  _suggestNextSteps(score, nicheData) {
    const steps = []

    if (score >= 65) {
      steps.push('Proceed with content creation and site development')
      steps.push('Develop a comprehensive content calendar')
      steps.push('Research and implement monetization strategies')
    } else if (score >= 50) {
      steps.push('Conduct additional keyword research to improve potential')
      steps.push('Analyze competitor strategies for insights')
      steps.push('Consider niche refinement or sub-niche focus')
    } else {
      steps.push('Research alternative niches with better potential')
      steps.push('Analyze successful competitors in related niches')
      steps.push('Consider combining multiple micro-niches')
    }

    return steps
  }
}

export const researchService = new ResearchService()
export default ResearchService

