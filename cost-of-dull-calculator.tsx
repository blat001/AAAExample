import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

const CostOfDullCalculator = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Market Context
    geography: '',
    industry: '',
    campaignType: '',
    
    // Step 2: Current Campaign Data
    currentSpend: '',
    marketShare: '',
    shareOfVoice: '',
    campaignDuration: '',
    
    // Step 3: Ad Effectiveness
    neutralResponseRate: '',
    adClassification: '',
    
    // Step 4: Target Goals
    targetGrowth: '',
    timeFrame: '',
    businessPriority: ''
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getMultipliers = (classification) => {
    const multipliers = {
      'non-dull': { marketShare: 1.0, profit: 1.0, effectiveness: 1.3 },
      'moderately-dull': { marketShare: 1.8, profit: 1.5, effectiveness: 0.8 },
      'very-dull': { marketShare: 2.2, profit: 1.8, effectiveness: 0.4 },
      'extremely-dull': { marketShare: 2.6, profit: 2.0, effectiveness: 0.1 }
    };
    return multipliers[classification] || multipliers['very-dull'];
  };

  const getIndustryAdjustment = (industry) => {
    const adjustments = {
      'retail': 1.75,
      'fmcg': 1.5,
      'b2b': 2.15,
      'tech': 1.6,
      'other': 1.0
    };
    return adjustments[industry] || 1.0;
  };

  const getGeographyMultiplier = (geography) => {
    return geography === 'us' ? 13 : 1;
  };

  const calculateResults = () => {
    const spend = parseFloat(formData.currentSpend) || 0;
    const marketShare = parseFloat(formData.marketShare) || 5;
    const shareOfVoice = parseFloat(formData.shareOfVoice) || 15;
    const targetGrowth = parseFloat(formData.targetGrowth) || 1;
    
    // Determine classification
    let classification = formData.adClassification;
    if (!classification && formData.neutralResponseRate) {
      const neutralRate = parseFloat(formData.neutralResponseRate);
      if (neutralRate >= 62) classification = 'extremely-dull';
      else if (neutralRate >= 51) classification = 'very-dull';
      else if (neutralRate >= 44) classification = 'moderately-dull';
      else classification = 'non-dull';
    }
    
    const multipliers = getMultipliers(classification);
    const industryAdjustment = getIndustryAdjustment(formData.industry);
    const geoMultiplier = getGeographyMultiplier(formData.geography);
    
    // Core calculations
    const baseESov = shareOfVoice - marketShare;
    const dullPenalty = classification !== 'non-dull' ? 7 : 0;
    const requiredESov = baseESov + dullPenalty;
    
    const additionalSpendRequired = spend * (multipliers.marketShare - 1) * industryAdjustment;
    const totalEfficiencyLoss = additionalSpendRequired * geoMultiplier;
    
    // Market share growth prediction
    const predictedGrowth = (requiredESov * multipliers.effectiveness) / 100;
    
    // Savings potential calculations
    const savingsToModerate = classification === 'extremely-dull' || classification === 'very-dull' 
      ? spend * (multipliers.marketShare - getMultipliers('moderately-dull').marketShare) * industryAdjustment
      : 0;
    
    const savingsToNonDull = classification !== 'non-dull'
      ? spend * (multipliers.marketShare - 1) * industryAdjustment
      : 0;
    
    const creativeROI = savingsToNonDull > 0 ? (savingsToNonDull / (spend * 0.05)) * 100 : 0; // Assume 5% of spend for creative improvement
    
    setResults({
      classification,
      additionalSpendRequired,
      costMultiplier: multipliers.marketShare * industryAdjustment,
      totalEfficiencyLoss,
      predictedGrowth,
      savingsToModerate,
      savingsToNonDull,
      creativeROI,
      requiredESov,
      industryAdjustment,
      geoMultiplier,
      currency: formData.geography === 'us' ? '$' : '£'
    });
  };

  const formatCurrency = (amount, currency = '£') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === '$' ? 'USD' : 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Step 1: Market Context</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Geographic Market</label>
          <select 
            value={formData.geography} 
            onChange={(e) => handleInputChange('geography', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Market</option>
            <option value="uk">UK</option>
            <option value="us">US</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Industry/Category</label>
          <select 
            value={formData.industry} 
            onChange={(e) => handleInputChange('industry', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Industry</option>
            <option value="retail">Retail/Durables</option>
            <option value="fmcg">FMCG</option>
            <option value="b2b">B2B</option>
            <option value="tech">Tech/Innovation</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
          <select 
            value={formData.campaignType} 
            onChange={(e) => handleInputChange('campaignType', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Campaign Type</option>
            <option value="tv">TV</option>
            <option value="digital">Digital</option>
            <option value="social">Social</option>
            <option value="multi-channel">Multi-channel</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Step 2: Current Campaign Data</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Annual Media Spend ({formData.geography === 'us' ? '$' : '£'})
          </label>
          <input 
            type="number" 
            value={formData.currentSpend} 
            onChange={(e) => handleInputChange('currentSpend', e.target.value)}
            placeholder="e.g., 1000000"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Market Share (% - use 5% if unknown)
          </label>
          <input 
            type="number" 
            value={formData.marketShare} 
            onChange={(e) => handleInputChange('marketShare', e.target.value)}
            placeholder="5"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Share of Voice (% - use 15% if unknown)
          </label>
          <input 
            type="number" 
            value={formData.shareOfVoice} 
            onChange={(e) => handleInputChange('shareOfVoice', e.target.value)}
            placeholder="15"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Duration (Months)</label>
          <input 
            type="number" 
            value={formData.campaignDuration} 
            onChange={(e) => handleInputChange('campaignDuration', e.target.value)}
            placeholder="12"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Step 3: Ad Effectiveness Assessment</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Method 1: Neutral Response Rate (%)
          </label>
          <input 
            type="number" 
            value={formData.neutralResponseRate} 
            onChange={(e) => handleInputChange('neutralResponseRate', e.target.value)}
            placeholder="e.g., 45"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="mt-2 text-sm text-gray-600">
            <p><strong>Guidelines:</strong></p>
            <p>• Non-dull: 32-39% neutral responses</p>
            <p>• Moderately Dull: 44-49% neutral responses</p>
            <p>• Very Dull: 51-56% neutral responses</p>
            <p>• Extremely Dull: 62-65% neutral responses</p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Method 2: Ad Classification (Alternative)
          </label>
          <select 
            value={formData.adClassification} 
            onChange={(e) => handleInputChange('adClassification', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Classification</option>
            <option value="non-dull">Interesting/Engaging (emotional, entertaining, fame-building)</option>
            <option value="moderately-dull">Moderately Dull (some engagement, mixed rational/emotional)</option>
            <option value="very-dull">Very Dull (primarily rational, informational)</option>
            <option value="extremely-dull">Extremely Dull (purely factual, no emotional connection)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Step 4: Target Goals</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Market Share Growth (% increase desired)
          </label>
          <input 
            type="number" 
            value={formData.targetGrowth} 
            onChange={(e) => handleInputChange('targetGrowth', e.target.value)}
            placeholder="1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Frame</label>
          <select 
            value={formData.timeFrame} 
            onChange={(e) => handleInputChange('timeFrame', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Time Frame</option>
            <option value="annual">Annual</option>
            <option value="quarterly">Quarterly</option>
            <option value="bi-annual">Bi-annual</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Priority</label>
          <select 
            value={formData.businessPriority} 
            onChange={(e) => handleInputChange('businessPriority', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Priority</option>
            <option value="brand-building">Brand Building</option>
            <option value="immediate-sales">Immediate Sales</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!results) return null;
    
    const { classification, additionalSpendRequired, costMultiplier, totalEfficiencyLoss, 
            savingsToModerate, savingsToNonDull, creativeROI, currency } = results;
    
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="mr-2 text-red-600" />
            Cost of Dull Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Current Classification</p>
              <p className="text-lg font-semibold text-red-600 capitalize">
                {classification.replace('-', ' ')}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Cost Multiplier</p>
              <p className="text-lg font-semibold text-red-600">
                {costMultiplier.toFixed(2)}x
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Additional Annual Spend Required</p>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(additionalSpendRequired, currency)}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Efficiency Loss</p>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(totalEfficiencyLoss, currency)}
              </p>
            </div>
          </div>
        </div>
        
        {classification !== 'non-dull' && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="mr-2 text-green-600" />
              Savings Potential
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savingsToModerate > 0 && (
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Moving to Moderately Dull</p>
                  <p className="text-lg font-semibold text-green-600">
                    Save {formatCurrency(savingsToModerate, currency)} annually
                  </p>
                </div>
              )}
              
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Moving to Non-dull</p>
                <p className="text-lg font-semibold text-green-600">
                  Save {formatCurrency(savingsToNonDull, currency)} annually
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">ROI of Creative Investment</p>
                <p className="text-lg font-semibold text-green-600">
                  {creativeROI.toFixed(0)}% return
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Recommendations</h3>
          <div className="space-y-2">
            {classification === 'extremely-dull' && (
              <p className="text-red-600">⚠️ Immediate creative overhaul needed - you're losing {formatCurrency(totalEfficiencyLoss, currency)} annually</p>
            )}
            {classification === 'very-dull' && (
              <p className="text-orange-600">📈 Significant opportunity to improve efficiency by {formatCurrency(savingsToNonDull, currency)}</p>
            )}
            {classification === 'moderately-dull' && (
              <p className="text-yellow-600">🎯 Good opportunity to optimize - potential savings of {formatCurrency(savingsToNonDull, currency)}</p>
            )}
            {classification === 'non-dull' && (
              <p className="text-green-600">✅ Excellent! Your creative is efficient. Maintain this approach.</p>
            )}
            <p className="text-gray-600">💡 Creative investment typically pays back 6-7x in media efficiency gains</p>
            <p className="text-gray-600">📊 Consider testing emotional engagement levels to validate classification</p>
          </div>
        </div>
      </div>
    );
  };

  const canProceed = () => {
    switch(step) {
      case 1:
        return formData.geography && formData.industry && formData.campaignType;
      case 2:
        return formData.currentSpend;
      case 3:
        return formData.neutralResponseRate || formData.adClassification;
      case 4:
        return formData.targetGrowth && formData.timeFrame && formData.businessPriority;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Calculator className="mr-3 text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">Cost of Dull Calculator</h1>
        </div>
        <p className="text-gray-600">
          Calculate the financial impact of dull advertising based on research by Adam Morgan, Peter Field, and System1
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-center space-x-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === num ? 'bg-blue-600 text-white' : 
              step > num ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > num ? <CheckCircle size={16} /> : num}
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderResults()}
        
        <div className="flex justify-between mt-8">
          <button 
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {step < 4 ? (
            <button 
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : step === 4 ? (
            <button 
              onClick={() => {
                calculateResults();
                setStep(5);
              }}
              disabled={!canProceed()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <DollarSign className="mr-2" size={16} />
              Calculate Results
            </button>
          ) : (
            <button 
              onClick={() => {
                setStep(1);
                setFormData({
                  geography: '',
                  industry: '',
                  campaignType: '',
                  currentSpend: '',
                  marketShare: '',
                  shareOfVoice: '',
                  campaignDuration: '',
                  neutralResponseRate: '',
                  adClassification: '',
                  targetGrowth: '',
                  timeFrame: '',
                  businessPriority: ''
                });
                setResults(null);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start New Calculation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostOfDullCalculator;