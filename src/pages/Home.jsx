import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Zap, Globe, TrendingUp } from 'lucide-react';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '80px 0' }}>
        <div className="container text-center">
          <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '24px' }}>
            Turn your ideas into profitable niche websites
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '40px', opacity: 0.9 }}>
            AI-powered research and automation to launch and monetize niche sites quickly
          </p>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '18px', padding: '16px 32px' }}>
            Start Building Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 className="text-center mb-8" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            Everything you need to succeed
          </h2>
          
          <div className="grid grid-2" style={{ marginTop: '48px' }}>
            <div className="card text-center">
              <Target size={48} style={{ color: '#3b82f6', margin: '0 auto 16px' }} />
              <h3 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                Niche Keyword Research
              </h3>
              <p className="text-gray-600">
                Analyze search trends, competition, and monetization potential to identify the most promising niche keywords.
              </p>
            </div>

            <div className="card text-center">
              <TrendingUp size={48} style={{ color: '#3b82f6', margin: '0 auto 16px' }} />
              <h3 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                Competitive Analysis
              </h3>
              <p className="text-gray-600">
                Evaluate existing competition, content quality, backlink profiles, and revenue models in your niche.
              </p>
            </div>

            <div className="card text-center">
              <Zap size={48} style={{ color: '#3b82f6', margin: '0 auto 16px' }} />
              <h3 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                AI Content Generation
              </h3>
              <p className="text-gray-600">
                Leverage AI-powered tools to automate content creation with high-quality articles and product descriptions.
              </p>
            </div>

            <div className="card text-center">
              <Globe size={48} style={{ color: '#3b82f6', margin: '0 auto 16px' }} />
              <h3 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                Turnkey Site Setup
              </h3>
              <p className="text-gray-600">
                Get professional-looking niche sites up and running quickly with pre-configured templates and hosting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: '#f8fafc', padding: '60px 0' }}>
        <div className="container text-center">
          <h2 className="mb-6" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Ready to build your niche empire?
          </h2>
          <p className="text-gray-600 mb-8" style={{ fontSize: '1.125rem' }}>
            Join thousands of entrepreneurs who are building profitable niche websites with our platform.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary">
              Get Started Free
            </Link>
            <Link to="/pricing" className="btn btn-secondary">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;