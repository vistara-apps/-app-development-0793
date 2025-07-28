import React from 'react';
import { useApp } from '../context/AppContext';
import { Target, FileText, Globe, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user, niches, content, sites } = useApp();

  const stats = [
    {
      label: 'Niches Researched',
      value: niches.length,
      icon: Target,
      color: '#3b82f6'
    },
    {
      label: 'Content Created',
      value: content.length,
      icon: FileText,
      color: '#10b981'
    },
    {
      label: 'Sites Built',
      value: sites.length,
      icon: Globe,
      color: '#8b5cf6'
    },
    {
      label: 'Total Revenue',
      value: `$${sites.reduce((total, site) => total + site.revenue, 0)}`,
      icon: TrendingUp,
      color: '#f59e0b'
    }
  ];

  return (
    <div className="container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px' }}>
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your niche site building journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-2 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="metric-card" style={{ background: stat.color }}>
            <stat.icon size={32} style={{ margin: '0 auto 16px' }} />
            <div className="metric-value">{stat.value}</div>
            <div className="metric-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <h2 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Quick Actions
        </h2>
        <div className="grid grid-2">
          <Link to="/research" className="card" style={{ 
            textDecoration: 'none', 
            color: 'inherit',
            border: '2px dashed #e5e7eb',
            textAlign: 'center',
            padding: '40px 20px'
          }}>
            <Target size={48} style={{ color: '#3b82f6', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px' }}>
              Research New Niche
            </h3>
            <p className="text-gray-600">
              Discover profitable opportunities
            </p>
          </Link>

          <Link to="/content" className="card" style={{ 
            textDecoration: 'none', 
            color: 'inherit',
            border: '2px dashed #e5e7eb',
            textAlign: 'center',
            padding: '40px 20px'
          }}>
            <FileText size={48} style={{ color: '#10b981', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px' }}>
              Generate Content
            </h3>
            <p className="text-gray-600">
              Create AI-powered articles
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Recent Activity
        </h2>
        
        {niches.length === 0 && content.length === 0 && sites.length === 0 ? (
          <div className="text-center" style={{ padding: '40px 0' }}>
            <p className="text-gray-600 mb-4">
              You haven't started any projects yet. Let's get you started!
            </p>
            <Link to="/research" className="btn btn-primary">
              Start Your First Niche Research
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {niches.slice(-3).map((niche) => (
              <div key={niche.id} style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Target size={20} style={{ color: '#3b82f6' }} />
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>
                    Researched "{niche.name}" niche
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {new Date(niche.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            
            {content.slice(-3).map((item) => (
              <div key={item.id} style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <FileText size={20} style={{ color: '#10b981' }} />
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>
                    Generated "{item.title}"
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {item.wordCount} words • {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;