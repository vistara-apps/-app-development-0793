import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Users, DollarSign, Eye, Calendar } from 'lucide-react';

function Analytics() {
  const { sites, content } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedSite, setSelectedSite] = useState('all');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalVisitors: 12450,
      totalRevenue: 2840,
      totalViews: 34200,
      conversionRate: 2.3
    },
    trafficData: [
      { date: '2024-01-01', visitors: 340, revenue: 45 },
      { date: '2024-01-02', visitors: 420, revenue: 62 },
      { date: '2024-01-03', visitors: 380, revenue: 58 },
      { date: '2024-01-04', visitors: 520, revenue: 78 },
      { date: '2024-01-05', visitors: 460, revenue: 71 },
      { date: '2024-01-06', visitors: 390, revenue: 55 },
      { date: '2024-01-07', visitors: 610, revenue: 89 }
    ],
    topContent: [
      { title: 'Ultimate Gardening Guide', views: 4500, revenue: 340 },
      { title: 'Best Plant Care Tips', views: 3200, revenue: 280 },
      { title: 'Organic Fertilizer Review', views: 2800, revenue: 220 },
      { title: 'Indoor Plant Setup', views: 2100, revenue: 180 },
      { title: 'Seasonal Planting Guide', views: 1900, revenue: 150 }
    ],
    trafficSources: [
      { source: 'Organic Search', visitors: 8520, percentage: 68 },
      { source: 'Social Media', visitors: 1860, percentage: 15 },
      { source: 'Direct', visitors: 1245, percentage: 10 },
      { source: 'Referrals', visitors: 825, percentage: 7 }
    ]
  };

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  return (
    <div className="container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px' 
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px' }}>
            Analytics
          </h1>
          <p className="text-gray-600">
            Track your niche site performance and revenue
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="form-input"
            style={{ width: '200px' }}
          >
            <option value="all">All Sites</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
          
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="form-input"
            style={{ width: '150px' }}
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-2 mb-8">
        <div className="metric-card" style={{ background: '#3b82f6' }}>
          <Users size={32} style={{ margin: '0 auto 16px' }} />
          <div className="metric-value">{analyticsData.overview.totalVisitors.toLocaleString()}</div>
          <div className="metric-label">Total Visitors</div>
        </div>
        
        <div className="metric-card" style={{ background: '#10b981' }}>
          <DollarSign size={32} style={{ margin: '0 auto 16px' }} />
          <div className="metric-value">${analyticsData.overview.totalRevenue.toLocaleString()}</div>
          <div className="metric-label">Revenue</div>
        </div>
        
        <div className="metric-card" style={{ background: '#8b5cf6' }}>
          <Eye size={32} style={{ margin: '0 auto 16px' }} />
          <div className="metric-value">{analyticsData.overview.totalViews.toLocaleString()}</div>
          <div className="metric-label">Page Views</div>
        </div>
        
        <div className="metric-card" style={{ background: '#f59e0b' }}>
          <TrendingUp size={32} style={{ margin: '0 auto 16px' }} />
          <div className="metric-value">{analyticsData.overview.conversionRate}%</div>
          <div className="metric-label">Conversion Rate</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Traffic Chart */}
        <div className="card">
          <h2 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Traffic & Revenue Trend
          </h2>
          
          <div style={{ 
            height: '300px', 
            backgroundColor: '#f8fafc', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="text-gray-600 text-center">
              <TrendingUp size={48} style={{ margin: '0 auto 8px' }} />
              <div>Interactive Chart View</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>
                Traffic trending up 24% this month
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="card">
          <h2 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Top Performing Content
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {analyticsData.topContent.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '8px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {item.title}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {item.views.toLocaleString()} views
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: '#10b981' }}>
                    ${item.revenue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: '32px' }}>
        {/* Traffic Sources */}
        <div className="card">
          <h2 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Traffic Sources
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {analyticsData.trafficSources.map((source, index) => (
              <div key={index}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '8px' 
                }}>
                  <span style={{ fontWeight: '600' }}>{source.source}</span>
                  <span>{source.visitors.toLocaleString()} ({source.percentage}%)</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Site Performance */}
        <div className="card">
          <h2 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Site Performance
          </h2>
          
          {sites.length === 0 ? (
            <div className="text-center" style={{ padding: '40px 0' }}>
              <Calendar size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
              <p className="text-gray-600">
                No sites created yet. Build your first site to see performance data.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sites.map((site) => (
                <div key={site.id} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                      {site.name}
                    </h3>
                    <span className="text-gray-600 text-sm">
                      {site.niche}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{site.traffic}</div>
                      <div className="text-gray-600 text-sm">Visitors</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>${site.revenue}</div>
                      <div className="text-gray-600 text-sm">Revenue</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#10b981' }}>Active</div>
                      <div className="text-gray-600 text-sm">Status</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="card" style={{ marginTop: '32px' }}>
        <h2 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Insights & Recommendations
        </h2>
        
        <div className="grid grid-2">
          <div>
            <h3 style={{ fontWeight: '600', marginBottom: '12px', color: '#10b981' }}>
              What's Working
            </h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#6b7280' }}>
              <li>Organic search traffic increased 24% this month</li>
              <li>Conversion rate improved with new content strategy</li>
              <li>Social media engagement driving quality traffic</li>
              <li>Long-form content performing better than expected</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ fontWeight: '600', marginBottom: '12px', color: '#f59e0b' }}>
              Areas for Improvement
            </h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#6b7280' }}>
              <li>Page load speed could be optimized</li>
              <li>Email capture rate needs improvement</li>
              <li>Mobile traffic conversion is below average</li>
              <li>Content publishing frequency should increase</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;