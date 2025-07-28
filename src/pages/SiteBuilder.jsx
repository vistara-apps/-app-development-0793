import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, Palette, Settings, ExternalLink } from 'lucide-react';

function SiteBuilder() {
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    template: 'blog',
    monetization: 'affiliate',
    domain: ''
  });
  
  const { createSite, sites, niches } = useApp();

  const templates = [
    { id: 'blog', name: 'Blog', description: 'Perfect for content-driven niche sites' },
    { id: 'review', name: 'Review Site', description: 'Ideal for product reviews and comparisons' },
    { id: 'directory', name: 'Directory', description: 'List and categorize niche businesses' },
    { id: 'marketplace', name: 'Marketplace', description: 'Connect buyers and sellers in your niche' }
  ];

  const monetizationMethods = [
    { id: 'affiliate', name: 'Affiliate Marketing', description: 'Promote products and earn commissions' },
    { id: 'ads', name: 'Display Ads', description: 'Google AdSense and other ad networks' },
    { id: 'products', name: 'Digital Products', description: 'Sell courses, ebooks, or tools' },
    { id: 'services', name: 'Services', description: 'Offer consulting or freelance services' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.niche) return;

    const siteData = {
      ...formData,
      url: formData.domain || `${formData.name.toLowerCase().replace(/\s+/g, '-')}.com`,
      status: 'building',
      traffic: 0,
      revenue: 0
    };

    const site = createSite(siteData);
    alert(`Site "${site.name}" created successfully!`);
    
    // Reset form
    setFormData({
      name: '',
      niche: '',
      template: 'blog',
      monetization: 'affiliate',
      domain: ''
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px' }}>
          Site Builder
        </h1>
        <p className="text-gray-600">
          Create professional niche websites with our turnkey templates
        </p>
      </div>

      <div className="grid grid-2">
        {/* Site Creation Form */}
        <div className="card">
          <h2 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Create New Site
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Site Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="My Awesome Niche Site"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Niche/Topic</label>
              <select
                name="niche"
                value={formData.niche}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select a niche</option>
                {niches.map((niche) => (
                  <option key={niche.id} value={niche.name}>
                    {niche.name}
                  </option>
                ))}
                <option value="custom">Custom Niche</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Site Template</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {templates.map((template) => (
                  <label key={template.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: formData.template === template.id ? '#eff6ff' : 'white'
                  }}>
                    <input
                      type="radio"
                      name="template"
                      value={template.id}
                      checked={formData.template === template.id}
                      onChange={handleChange}
                      style={{ marginRight: '12px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600' }}>{template.name}</div>
                      <div className="text-gray-600 text-sm">{template.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Monetization Method</label>
              <select
                name="monetization"
                value={formData.monetization}
                onChange={handleChange}
                className="form-input"
              >
                {monetizationMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Custom Domain (optional)</label>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className="form-input"
                placeholder="mynicheSite.com"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Globe size={20} />
              Create Site
            </button>
          </form>
        </div>

        {/* Template Preview & Features */}
        <div>
          <div className="card mb-6">
            <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              Template Features
            </h3>
            
            {(() => {
              const selectedTemplate = templates.find(t => t.id === formData.template);
              return selectedTemplate ? (
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>
                    {selectedTemplate.name}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {selectedTemplate.description}
                  </p>
                  
                  <div style={{ 
                    height: '200px', 
                    backgroundColor: '#f3f4f6', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <div className="text-gray-600 text-center">
                      <Globe size={48} style={{ margin: '0 auto 8px' }} />
                      <div>Template Preview</div>
                    </div>
                  </div>

                  <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#6b7280' }}>
                    <li>Responsive mobile design</li>
                    <li>SEO-optimized structure</li>
                    <li>Fast loading speeds</li>
                    <li>Social media integration</li>
                    <li>Analytics ready</li>
                  </ul>
                </div>
              ) : (
                <div className="text-gray-600">Select a template to see features</div>
              );
            })()}
          </div>

          {/* Monetization Info */}
          <div className="card">
            <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              Monetization Setup
            </h3>
            
            {(() => {
              const selectedMethod = monetizationMethods.find(m => m.id === formData.monetization);
              return selectedMethod ? (
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>
                    {selectedMethod.name}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {selectedMethod.description}
                  </p>
                  
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      We'll help you set up:
                    </div>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
                      {formData.monetization === 'affiliate' && (
                        <>
                          <li>Amazon Associates integration</li>
                          <li>Commission tracking</li>
                          <li>Product comparison tables</li>
                        </>
                      )}
                      {formData.monetization === 'ads' && (
                        <>
                          <li>Google AdSense setup</li>
                          <li>Ad placement optimization</li>
                          <li>Revenue tracking</li>
                        </>
                      )}
                      {formData.monetization === 'products' && (
                        <>
                          <li>Payment processing</li>
                          <li>Digital delivery system</li>
                          <li>Customer management</li>
                        </>
                      )}
                      {formData.monetization === 'services' && (
                        <>
                          <li>Booking system</li>
                          <li>Client portal</li>
                          <li>Invoice generation</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-gray-600">Select a monetization method to see setup details</div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Existing Sites */}
      {sites.length > 0 && (
        <div className="card" style={{ marginTop: '32px' }}>
          <h2 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Your Sites
          </h2>
          
          <div className="grid grid-3">
            {sites.map((site) => (
              <div key={site.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Globe size={20} style={{ color: '#3b82f6' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                    {site.name}
                  </h3>
                </div>
                
                <div className="text-gray-600 text-sm mb-4">
                  <div>Niche: {site.niche}</div>
                  <div>Template: {templates.find(t => t.id === site.template)?.name}</div>
                  <div>Created: {new Date(site.createdAt).toLocaleDateString()}</div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold' }}>{site.traffic}</div>
                    <div className="text-gray-600 text-sm">Monthly Visitors</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold' }}>${site.revenue}</div>
                    <div className="text-gray-600 text-sm">Monthly Revenue</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary" style={{ flex: 1, fontSize: '12px', padding: '8px' }}>
                    <Settings size={14} />
                    Manage
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1, fontSize: '12px', padding: '8px' }}>
                    <ExternalLink size={14} />
                    Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SiteBuilder;