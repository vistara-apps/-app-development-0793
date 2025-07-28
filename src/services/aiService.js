import { openRouterClient, MODELS } from '../lib/openrouter.js'

class AIService {
  constructor() {
    this.client = openRouterClient
  }

  // Generate niche-specific content
  async generateContent({ title, niche, contentType = 'article', wordCount = 800, tone = 'informative' }) {
    const prompt = `Write a ${contentType} about "${title}" for the ${niche} niche.

Requirements:
- Target word count: ${wordCount} words
- Tone: ${tone}
- Include relevant keywords naturally
- Structure with clear headings and subheadings
- Make it engaging and valuable for the target audience
- Include actionable insights or tips

Please provide the content in the following JSON format:
{
  "title": "Optimized title",
  "body": "Full article content with HTML formatting",
  "wordCount": actual_word_count,
  "readingTime": estimated_reading_time_in_minutes,
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "metaDescription": "SEO meta description"
}`

    try {
      const response = await this.client.generateStructuredResponse(prompt, {
        title: 'string',
        body: 'string',
        wordCount: 'number',
        readingTime: 'number',
        keywords: ['string'],
        metaDescription: 'string'
      }, {
        model: MODELS.BALANCED,
        temperature: 0.7,
        max_tokens: 2000
      })

      return {
        success: true,
        data: response
      }
    } catch (error) {
      console.error('Content generation error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Research niche keywords and opportunities
  async researchNiche(nicheIdea) {
    const prompt = `Analyze the niche "${nicheIdea}" and provide comprehensive research data.

Consider:
- Market demand and search volume potential
- Competition level analysis
- Monetization opportunities
- Target audience demographics
- Content opportunities
- Seasonal trends
- Pain points and problems to solve
- Reddit communities and discussions related to this niche

Provide response in JSON format:
{
  "niche": {
    "name": "refined niche name",
    "description": "detailed description",
    "searchVolume": estimated_monthly_searches,
    "competitionLevel": "low|medium|high",
    "monetizationPotential": score_0_to_100
  },
  "keywords": [
    {
      "name": "keyword phrase",
      "searchVolume": estimated_volume,
      "competitionLevel": "low|medium|high",
      "cpcValue": estimated_cpc_in_dollars
    }
  ],
  "opportunities": [
    "opportunity 1",
    "opportunity 2"
  ],
  "painPoints": [
    "pain point 1",
    "pain point 2"
  ],
  "contentIdeas": [
    "content idea 1",
    "content idea 2"
  ]
}`

    try {
      const response = await this.client.generateStructuredResponse(prompt, {
        niche: {
          name: 'string',
          description: 'string',
          searchVolume: 'number',
          competitionLevel: 'string',
          monetizationPotential: 'number'
        },
        keywords: [{
          name: 'string',
          searchVolume: 'number',
          competitionLevel: 'string',
          cpcValue: 'number'
        }],
        opportunities: ['string'],
        painPoints: ['string'],
        contentIdeas: ['string']
      }, {
        model: MODELS.RESEARCH,
        temperature: 0.3,
        max_tokens: 1500
      })

      return {
        success: true,
        data: response
      }
    } catch (error) {
      console.error('Niche research error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Analyze competitive landscape
  async analyzeCompetition(niche, competitors = []) {
    const competitorList = competitors.length > 0 
      ? competitors.join(', ') 
      : 'top competitors in this space'

    const prompt = `Analyze the competitive landscape for the "${niche}" niche.

${competitors.length > 0 ? `Focus on these specific competitors: ${competitorList}` : 'Identify and analyze the main competitors in this space.'}

Provide analysis on:
- Market positioning of competitors
- Content strategies they use
- Monetization methods
- Strengths and weaknesses
- Market gaps and opportunities
- Differentiation strategies
- Traffic and authority estimates

Response format:
{
  "overview": "competitive landscape summary",
  "competitors": [
    {
      "name": "competitor name",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "contentStrategy": "their content approach",
      "monetization": "how they make money",
      "estimatedTraffic": "traffic estimate",
      "marketPosition": "their position in market"
    }
  ],
  "opportunities": [
    "gap or opportunity 1",
    "gap or opportunity 2"
  ],
  "recommendations": [
    "strategic recommendation 1",
    "strategic recommendation 2"
  ]
}`

    try {
      const response = await this.client.generateStructuredResponse(prompt, {
        overview: 'string',
        competitors: [{
          name: 'string',
          strengths: ['string'],
          weaknesses: ['string'],
          contentStrategy: 'string',
          monetization: 'string',
          estimatedTraffic: 'string',
          marketPosition: 'string'
        }],
        opportunities: ['string'],
        recommendations: ['string']
      }, {
        model: MODELS.RESEARCH,
        temperature: 0.4,
        max_tokens: 1800
      })

      return {
        success: true,
        data: response
      }
    } catch (error) {
      console.error('Competition analysis error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Generate keyword variations and related terms
  async generateKeywords(seedKeyword, count = 20) {
    const prompt = `Generate ${count} related keywords and variations for the seed keyword "${seedKeyword}".

Include:
- Long-tail variations
- Question-based keywords
- Commercial intent keywords
- Informational keywords
- Local variations if applicable

For each keyword, estimate:
- Search volume potential
- Competition level
- Commercial value

Response format:
{
  "keywords": [
    {
      "name": "keyword phrase",
      "type": "informational|commercial|navigational|transactional",
      "searchVolume": estimated_monthly_volume,
      "competitionLevel": "low|medium|high",
      "cpcValue": estimated_cpc,
      "difficulty": score_1_to_100
    }
  ]
}`

    try {
      const response = await this.client.generateStructuredResponse(prompt, {
        keywords: [{
          name: 'string',
          type: 'string',
          searchVolume: 'number',
          competitionLevel: 'string',
          cpcValue: 'number',
          difficulty: 'number'
        }]
      }, {
        model: MODELS.RESEARCH,
        temperature: 0.5,
        max_tokens: 1200
      })

      return {
        success: true,
        data: response.keywords
      }
    } catch (error) {
      console.error('Keyword generation error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Generate content ideas for a niche
  async generateContentIdeas(niche, contentType = 'mixed', count = 10) {
    const prompt = `Generate ${count} content ideas for the "${niche}" niche.

Content type focus: ${contentType}
(mixed = variety of content types, blog = blog posts, video = video content, etc.)

For each idea, provide:
- Compelling title
- Content type (blog post, how-to guide, listicle, review, etc.)
- Target keywords
- Estimated difficulty to create
- Potential for engagement/shares

Response format:
{
  "contentIdeas": [
    {
      "title": "compelling title",
      "type": "content type",
      "description": "brief description of content",
      "targetKeywords": ["keyword1", "keyword2"],
      "difficulty": "easy|medium|hard",
      "engagementPotential": "low|medium|high",
      "estimatedWordCount": word_count
    }
  ]
}`

    try {
      const response = await this.client.generateStructuredResponse(prompt, {
        contentIdeas: [{
          title: 'string',
          type: 'string',
          description: 'string',
          targetKeywords: ['string'],
          difficulty: 'string',
          engagementPotential: 'string',
          estimatedWordCount: 'number'
        }]
      }, {
        model: MODELS.CREATIVE,
        temperature: 0.8,
        max_tokens: 1500
      })

      return {
        success: true,
        data: response.contentIdeas
      }
    } catch (error) {
      console.error('Content ideas generation error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export const aiService = new AIService()
export default AIService

