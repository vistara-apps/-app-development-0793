import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '1 niche research per month',
        '5 AI-generated articles',
        'Basic keyword analysis',
        'Community support'
      ]
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      popular: true,
      features: [
        'Unlimited niche research',
        '100 AI-generated articles',
        'Advanced competitive analysis',
        'Turnkey site templates',
        'Email support',
        'SEO optimization tools'
      ]
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: '/month',
      features: [
        'Everything in Pro',
        'Unlimited AI content',
        'White-label solutions',
        'Priority support',
        'Custom integrations',
        'Team collaboration'
      ]
    }
  ];

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '16px' }}>
          Choose Your Plan
        </h1>
        <p className="text-gray-600" style={{ fontSize: '1.125rem' }}>
          Start building profitable niche websites today
        </p>
      </div>

      <div className="grid grid-3">
        {plans.map((plan, index) => (
          <div key={index} className="card" style={{ position: 'relative' }}>
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#3b82f6',
                color: 'white',
                padding: '6px 24px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                Most Popular
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>
                {plan.name}
              </h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {plan.price}
                <span style={{ fontSize: '1rem', color: '#6b7280' }}>
                  {plan.period}
                </span>
              </div>
            </div>

            <ul style={{ listStyle: 'none', marginBottom: '32px' }}>
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  marginBottom: '12px' 
                }}>
                  <Check size={20} style={{ color: '#10b981' }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link 
              to="/register" 
              className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: '100%', textAlign: 'center' }}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center" style={{ marginTop: '48px', padding: '40px 0' }}>
        <p className="text-gray-600">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </div>
  );
}

export default Pricing;