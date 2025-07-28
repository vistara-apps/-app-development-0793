import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { researchService } from '../services/researchService.js';
import { competitiveAnalysisService } from '../services/competitiveAnalysisService.js';
import { Search, Target, TrendingUp, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

function NicheResearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState(null);
  const [loadingCompetitive, setLoadingCompetitive] = useState(false);
  
  const { dispatch } = useApp();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');
    setAnalysisResult(null);
    setCompetitiveAnalysis(null);
    
    try {
      // Conduct comprehensive niche research
      const result = await researchService.conductNicheResearch(searchQuery);
      
      if (result.success) {
        setAnalysisResult(result.data);
        setSuccess('Niche research completed successfully!');
        
        // Update app state with new niche
        dispatch({ type: 'ADD_NICHE', payload: result.data.niche });
        
        // Start competitive analysis in background
        handleCompetitiveAnalysis(searchQuery);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to conduct niche research. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompetitiveAnalysis = async (niche) => {
    setLoadingCompetitive(true);
    
    try {
      const result = await competitiveAnalysisService.analyzeCompetitors(niche);
      
      if (result.success) {
        setCompetitiveAnalysis(result.data);
      }
    } catch (err) {
      console.error('Competitive analysis failed:', err);
    } finally {
      setLoadingCompetitive(false);
    }
  };

  const handleSaveNiche = () => {
    if (analysisResult) {
      setSuccess(`Niche "${analysisResult.niche.name}" has been saved to your dashboard!`);
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px' }}>
          Niche Research
        </h1>
        <p className="text-gray-600">
          Discover profitable niche opportunities with AI-powered analysis
        </p>
      </div>

      {/* Search Form */}
      <div className="card mb-8">
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label className="form-label">Enter Niche Idea</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                placeholder="e.g., sustainable gardening, pet training, fitness for seniors"
                style={{ flex: 1 }}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <div className="loading"></div> : <Search size={20} />}
                Analyze
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              Analysis Results for "{analysisResult.name}"
            </h2>
            <button onClick={handleSaveNiche} className="btn btn-primary">
              Save Niche
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-3 mb-8">
            <div className="metric-card" style={{ background: '#3b82f6' }}>
              <Target size={32} style={{ margin: '0 auto 16px' }} />
              <div className="metric-value">{analysisResult.searchVolume.toLocaleString()}</div>
              <div className="metric-label">Monthly Searches</div>
            </div>
            
            <div className="metric-card" style={{ 
              background: analysisResult.competitionLevel === 'low' ? '#10b981' : 
                         analysisResult.competitionLevel === 'medium' ? '#f59e0b' : '#ef4444' 
            }}>
              <TrendingUp size={32} style={{ margin: '0 auto 16px' }} />
              <div className="metric-value">{analysisResult.competitionLevel.toUpperCase()}</div>
              <div className="metric-label">Competition Level</div>
            </div>
            
            <div className="metric-card" style={{ background: '#8b5cf6' }}>
              <DollarSign size={32} style={{ margin: '0 auto 16px' }} />
              <div className="metric-value">{analysisResult.monetizationPotential}/10</div>
              <div className="metric-label">Monetization Score</div>
            </div>
          </div>

          <div className="grid grid-2">
            {/* Keywords Analysis */}
            <div className="card">
              <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                Top Keywords
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {analysisResult.keywords.slice(0, 5).map((keyword) => (
                  <div key={keyword.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{keyword.name}</div>
                      <div className="text-gray-600 text-sm">
                        {keyword.searchVolume.toLocaleString()} searches/month
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '600' }}>${keyword.cpcValue}</div>
                      <div className="text-gray-600 text-sm">CPC</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competition Analysis */}
            <div className="card">
              <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                Top Competitors
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {analysisResult.competitors.map((competitor, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{competitor.domain}</div>
                      <div className="text-gray-600 text-sm">
                        Authority: {competitor.authority}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '600' }}>{competitor.traffic}</div>
                      <div className="text-gray-600 text-sm">Traffic/month</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card" style={{ marginTop: '24px' }}>
            <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              Recommendations
            </h3>
            <div className="grid grid-2">
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#10b981' }}>
                  Opportunities
                </h4>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                  <li>High search volume with manageable competition</li>
                  <li>Multiple monetization opportunities available</li>
                  <li>Growing trend in search interest</li>
                </ul>
              </div>
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#f59e0b' }}>
                  Challenges
                </h4>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                  <li>Some established competitors in the space</li>
                  <li>Seasonal variations in search volume</li>
                  <li>Content quality standards are high</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NicheResearch;
