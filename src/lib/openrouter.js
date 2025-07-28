const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

class OpenRouterClient {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.baseURL = OPENROUTER_API_URL
  }

  async createChatCompletion({
    model = 'openai/gpt-3.5-turbo',
    messages,
    temperature = 0.7,
    max_tokens = 1000,
    stream = false
  }) {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is required')
    }

    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Niche Site Builder'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`OpenRouter API error: ${response.status} - ${error.error?.message || 'Unknown error'}`)
    }

    return await response.json()
  }

  async generateText(prompt, options = {}) {
    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ]

    const response = await this.createChatCompletion({
      messages,
      ...options
    })

    return response.choices[0]?.message?.content || ''
  }

  async generateStructuredResponse(prompt, schema, options = {}) {
    const enhancedPrompt = `${prompt}

Please respond with a valid JSON object that matches this schema:
${JSON.stringify(schema, null, 2)}

Ensure your response is valid JSON and follows the schema exactly.`

    const response = await this.generateText(enhancedPrompt, options)
    
    try {
      return JSON.parse(response)
    } catch (error) {
      console.error('Failed to parse JSON response:', response)
      throw new Error('Invalid JSON response from AI')
    }
  }
}

// Create and export the client instance
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
export const openRouterClient = new OpenRouterClient(apiKey)

// Available models for different use cases
export const MODELS = {
  FAST: 'openai/gpt-3.5-turbo',
  BALANCED: 'openai/gpt-4-turbo-preview',
  CREATIVE: 'anthropic/claude-3-haiku',
  RESEARCH: 'openai/gpt-4',
  CODING: 'openai/gpt-4'
}

export default OpenRouterClient

