import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Zap, Download } from 'lucide-react';

function ContentGeneration() {
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    tone: 'professional',
    length: 'medium',
    keywords: ''
  });
  
  const { generateContent, content, loading } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.topic) return;

    await generateContent(formData);
    
    // Reset form after successful generation
    setFormData({
      title: '',
      topic: '',
      tone: 'professional',
      length: 'medium',
      keywords: ''
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const generateSampleContent = (topic) => {
    const samples = [
      `How to Get Started with ${topic}`,
      `The Ultimate ${topic} Guide for Beginners`,
      `Top 10 ${topic} Tips and Tricks`,
      `Common ${topic} Mistakes to Avoid`,
      `Best ${topic} Tools and Resources`
    ];
    
    setFormData(prev => ({
      ...prev,
      title: samples[Math.floor(Math.random() * samples.length)],
      topic: topic
    }));
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px' }}>
          Content Generation
        </h1>
        <p className="text-gray-600">
          Create high-quality, SEO-optimized content with AI assistance
        </p>
      </div>

      <div className="grid grid-2">
        {/* Content Generation Form */}
        <div className="card">
          <h2 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Generate New Content
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Article Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your article title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Topic/Niche</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., sustainable gardening, pet training"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Writing Tone</label>
              <select
                name="tone"
                value={formData.tone}
                onChange={handleChange}
                className="form-input"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="conversational">Conversational</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Content Length</label>
              <select
                name="length"
                value={formData.length}
                onChange={handleChange}
                className="form-input"
              >
                <option value="short">Short (500-800 words)</option>
                <option value="medium">Medium (800-1500 words)</option>
                <option value="long">Long (1500+ words)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Keywords (optional)</label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                className="form-input"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? <div className="loading"></div> : <Zap size={20} />}
              Generate Content
            </button>
          </form>

          {/* Quick Templates */}
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>
              Quick Templates
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Gardening', 'Digital Marketing', 'Pet Care', 'Fitness', 'Cooking'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => generateSampleContent(topic)}
                  className="btn btn-secondary"
                  style={{ fontSize: '14px', padding: '8px 16px' }}
                >
                  {topic} Article
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generated Content List */}
        <div className="card">
          <h2 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Your Content Library
          </h2>
          
          {content.length === 0 ? (
            <div className="text-center" style={{ padding: '40px 0' }}>
              <FileText size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
              <p className="text-gray-600">
                No content generated yet. Create your first article!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {content.map((item) => (
                <div key={item.id} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '12px'
                  }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                      {item.title}
                    </h3>
                    <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                      <Download size={14} />
                      Export
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {item.body.substring(0, 150)}...
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    <span>{item.wordCount} words</span>
                    <span>{item.readingTime} min read</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Tips */}
      <div className="card" style={{ marginTop: '32px' }}>
        <h2 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          Content Generation Tips
        </h2>
        <div className="grid grid-2">
          <div>
            <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>SEO Best Practices</h4>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#6b7280' }}>
              <li>Include target keywords naturally throughout content</li>
              <li>Use descriptive headings and subheadings</li>
              <li>Write compelling meta descriptions</li>
              <li>Optimize for featured snippets</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Content Quality</h4>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#6b7280' }}>
              <li>Focus on providing value to readers</li>
              <li>Use clear, concise language</li>
              <li>Include relevant examples and data</li>
              <li>Edit and proofread before publishing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentGeneration;