'use client';

import { useState } from 'react';
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ScaleIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  BanknotesIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { 
  mockLegalDocuments, 
  mockNonCompeteAnalyses,
  jurisdictionCompliance,
  calculateComplianceCost,
  type LegalDocument,
  type NonCompeteAnalysis,
  type ComplianceCheck 
} from '@/lib/legal';

export function LegalDashboard() {
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<NonCompeteAnalysis | null>(null);
  const [viewMode, setViewMode] = useState<'documents' | 'compliance' | 'noncompete' | 'jurisdictions'>('documents');
  
  const documents = mockLegalDocuments;
  const nonCompeteAnalyses = mockNonCompeteAnalyses;
  
  const stats = [
    { 
      name: 'Active Documents', 
      value: documents.filter(d => ['draft', 'review'].includes(d.status)).length, 
      icon: DocumentTextIcon,
      color: 'text-blue-600',
      change: '3 in review'
    },
    { 
      name: 'Compliance Checks', 
      value: documents.reduce((sum, d) => sum + d.complianceChecks.length, 0),
      icon: ShieldCheckIcon,
      color: 'text-green-600',
      change: '2 high-risk items'
    },
    { 
      name: 'Non-Compete Risk', 
      value: nonCompeteAnalyses.filter(a => ['high', 'prohibitive'].includes(a.violationRisk)).length,
      icon: ExclamationTriangleIcon,
      color: 'text-red-600',
      change: '8 team members'
    },
    { 
      name: 'Est. Legal Costs', 
      value: '$4.2M', 
      icon: CurrencyDollarIcon,
      color: 'text-purple-600',
      change: 'For current liftouts'
    },
  ];

  const complianceByCategory = documents.flatMap(d => d.complianceChecks).reduce((acc, check) => {
    acc[check.category] = (acc[check.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Legal & Compliance</h1>
          <p className="text-gray-600">Contract automation, compliance tracking, and risk management</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setViewMode('documents')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'documents' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setViewMode('compliance')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'compliance' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Compliance
          </button>
          <button
            onClick={() => setViewMode('noncompete')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'noncompete' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Non-Compete
          </button>
          <button
            onClick={() => setViewMode('jurisdictions')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'jurisdictions' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Jurisdictions
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {item.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-sm text-gray-500">{item.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Documents View */}
      {viewMode === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Documents List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Legal Documents</h3>
                <p className="text-sm text-gray-500">Contract generation and document management workflow</p>
              </div>
              <div className="divide-y divide-gray-200">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-6 cursor-pointer hover:bg-gray-50 ${
                      selectedDocument?.id === doc.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-gray-900">
                            {doc.title}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            doc.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                            doc.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                            doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                            doc.status === 'executed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                        
                        <div className="flex items-center space-x-6 mt-3">
                          <div className="flex items-center space-x-1">
                            <ScaleIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{doc.jurisdiction}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              v{doc.version} • {doc.lastModified.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <UserGroupIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {doc.parties.length} parties
                            </span>
                          </div>
                        </div>

                        {/* Compliance Status */}
                        <div className="flex items-center space-x-4 mt-3">
                          {doc.complianceChecks.filter(c => c.status === 'compliant').length > 0 && (
                            <div className="flex items-center space-x-1">
                              <CheckCircleIcon className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600">
                                {doc.complianceChecks.filter(c => c.status === 'compliant').length} compliant
                              </span>
                            </div>
                          )}
                          {doc.complianceChecks.filter(c => c.status === 'needs_review').length > 0 && (
                            <div className="flex items-center space-x-1">
                              <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm text-yellow-600">
                                {doc.complianceChecks.filter(c => c.status === 'needs_review').length} need review
                              </span>
                            </div>
                          )}
                          {doc.complianceChecks.filter(c => c.status === 'non_compliant').length > 0 && (
                            <div className="flex items-center space-x-1">
                              <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-red-600">
                                {doc.complianceChecks.filter(c => c.status === 'non_compliant').length} non-compliant
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          doc.riskAssessment.overallRisk === 'low' ? 'bg-green-100 text-green-800' :
                          doc.riskAssessment.overallRisk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          doc.riskAssessment.overallRisk === 'high' ? 'bg-red-100 text-red-800' :
                          'bg-red-200 text-red-900'
                        }`}>
                          {doc.riskAssessment.overallRisk} risk
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Document Details */}
          <div className="lg:col-span-1">
            {selectedDocument ? (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Document Details</h3>
                  <p className="text-sm text-gray-500">{selectedDocument.type.replace(/_/g, ' ')}</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Review Status */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Review Status</h4>
                    <div className="space-y-2">
                      {selectedDocument.reviewers.map((reviewer) => (
                        <div key={reviewer.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{reviewer.name}</p>
                            <p className="text-xs text-gray-500">{reviewer.firmName}</p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            reviewer.status === 'completed' ? 'bg-green-100 text-green-800' :
                            reviewer.status === 'in_review' ? 'bg-yellow-100 text-yellow-800' :
                            reviewer.status === 'escalated' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {reviewer.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Risk Assessment</h4>
                    <div className="space-y-3">
                      {selectedDocument.riskAssessment.risks.slice(0, 3).map((risk) => (
                        <div key={risk.id} className="border-l-2 border-orange-200 pl-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{risk.category.replace(/_/g, ' ')}</p>
                            <span className="text-sm font-medium text-orange-600">
                              {risk.riskScore}% risk
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mitigation Plan */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Mitigation Strategies</h4>
                    <div className="space-y-3">
                      {selectedDocument.riskAssessment.mitigationPlan.slice(0, 2).map((strategy) => (
                        <div key={strategy.id} className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-blue-900">{strategy.strategy}</p>
                          <p className="text-sm text-blue-700 mt-1">{strategy.implementation}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-blue-600">{strategy.timeline}</span>
                            <span className="text-xs text-blue-600">
                              ${strategy.cost?.toLocaleString()} • {strategy.effectiveness}% effective
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center text-gray-500">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Select a document</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a legal document to view detailed information
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compliance View */}
      {viewMode === 'compliance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Compliance Categories */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Compliance Categories</h3>
              <p className="text-sm text-gray-500">Track compliance across different legal areas</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(complianceByCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{category.replace(/_/g, ' ')}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: `${Math.min(100, (count / 5) * 100)}%`}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{count} checks</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Jurisdiction Requirements */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Jurisdiction Requirements</h3>
              <p className="text-sm text-gray-500">Key compliance requirements by location</p>
            </div>
            <div className="divide-y divide-gray-200">
              {jurisdictionCompliance.slice(0, 3).map((jurisdiction) => (
                <div key={jurisdiction.jurisdiction} className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <GlobeAltIcon className="h-5 w-5 text-blue-500" />
                    <h4 className="text-lg font-medium text-gray-900">{jurisdiction.jurisdiction}</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Notice Period</span>
                      <span className="text-sm font-medium text-gray-900">
                        {jurisdiction.employmentLaws.noticeRequirements} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Non-Compete</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {jurisdiction.employmentLaws.nonCompeteEnforcement}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">
                        {jurisdiction.regulations.industrySpecific.length} industry-specific requirements
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Non-Compete View */}
      {viewMode === 'noncompete' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Non-Compete Analyses */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Non-Compete Analysis</h3>
                <p className="text-sm text-gray-500">Risk assessment and enforcement likelihood for team members</p>
              </div>
              <div className="divide-y divide-gray-200">
                {nonCompeteAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className={`p-6 cursor-pointer hover:bg-gray-50 ${
                      selectedAnalysis?.id === analysis.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedAnalysis(analysis)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-gray-900">
                            {analysis.teamMemberId.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => 
                              txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                            )}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            analysis.violationRisk === 'low' ? 'bg-green-100 text-green-800' :
                            analysis.violationRisk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            analysis.violationRisk === 'high' ? 'bg-red-100 text-red-800' :
                            'bg-red-200 text-red-900'
                          }`}>
                            {analysis.violationRisk} risk
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{analysis.currentEmployer}</p>
                        
                        {analysis.nonCompeteTerms && (
                          <div className="flex items-center space-x-6 mt-3">
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {analysis.nonCompeteTerms.duration} months
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BanknotesIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                ${analysis.nonCompeteTerms.compensation?.toLocaleString()} garden leave
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <GlobeAltIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {analysis.enforceability.jurisdiction}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {analysis.enforceability.enforcementLikelihood}% enforcement
                        </div>
                        <div className="text-sm text-gray-500">
                          ${analysis.legalCosts.defenseCosts.toLocaleString()} legal costs
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Details */}
          <div className="lg:col-span-1">
            {selectedAnalysis ? (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Risk Analysis</h3>
                  <p className="text-sm text-gray-500">Detailed enforcement assessment</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Enforcement Factors */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Key Factors</h4>
                    <div className="space-y-3">
                      {selectedAnalysis.enforceability.factors.slice(0, 3).map((factor) => (
                        <div key={factor.factor} className="border-l-2 border-blue-200 pl-3">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              factor.impact === 'strengthens' ? 'bg-red-100 text-red-800' :
                              factor.impact === 'weakens' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {factor.impact}
                            </span>
                            <span className="text-xs text-gray-500">Weight: {factor.weight}/10</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mt-1">{factor.factor}</p>
                          <p className="text-sm text-gray-600">{factor.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mitigation Options */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Mitigation Options</h4>
                    <div className="space-y-3">
                      {selectedAnalysis.mitigationOptions.slice(0, 2).map((option) => (
                        <div key={option.id} className="bg-green-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-green-900 capitalize">
                              {option.strategy.replace(/_/g, ' ')}
                            </p>
                            <span className="text-sm font-medium text-green-700">
                              {option.successProbability}% success
                            </span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">{option.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-green-600">{option.timeline}</span>
                            <span className="text-xs text-green-600">
                              ${option.cost.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Recommendations</h4>
                    <div className="space-y-1">
                      {selectedAnalysis.enforceability.recommendations.slice(0, 2).map((rec, index) => (
                        <p key={index} className="text-sm text-blue-700">• {rec}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center text-gray-500">
                  <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Select an analysis</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a non-compete analysis to view detailed assessment
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Jurisdictions View */}
      {viewMode === 'jurisdictions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cost Calculator */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Compliance Cost Calculator</h3>
              <p className="text-sm text-gray-500">Estimate legal costs by jurisdiction and liftout type</p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jurisdiction</label>
                    <div className="space-y-2">
                      {['New York', 'California', 'Delaware', 'Texas', 'Florida'].map((jurisdiction) => (
                        <div key={jurisdiction} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm font-medium text-gray-900">{jurisdiction}</span>
                          <span className="text-sm text-gray-600">
                            ${calculateComplianceCost(jurisdiction, 8, 'competitive').toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Liftout Type Impact</label>
                    <div className="space-y-2">
                      {[
                        { type: 'competitive', label: 'Direct Competitor', multiplier: '1.5x' },
                        { type: 'defensive', label: 'Defensive Move', multiplier: '1.3x' },
                        { type: 'expansion', label: 'Market Expansion', multiplier: '1.2x' },
                        { type: 'capability', label: 'New Capability', multiplier: '1.0x' },
                      ].map((item) => (
                        <div key={item.type} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm font-medium text-gray-900">{item.label}</span>
                          <span className="text-sm text-gray-600">{item.multiplier}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Jurisdiction Comparison */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Jurisdiction Comparison</h3>
              <p className="text-sm text-gray-500">Employment law differences across key markets</p>
            </div>
            <div className="divide-y divide-gray-200">
              {[
                { jurisdiction: 'California', nonCompete: 'Prohibited', cost: 'Low', risk: 'Low' },
                { jurisdiction: 'New York', nonCompete: 'Moderate', cost: 'High', risk: 'Medium' },
                { jurisdiction: 'Delaware', nonCompete: 'Strong', cost: 'Medium', risk: 'Medium' },
                { jurisdiction: 'Texas', nonCompete: 'Moderate', cost: 'Medium', risk: 'Medium' },
                { jurisdiction: 'Florida', nonCompete: 'Strong', cost: 'High', risk: 'High' },
              ].map((item) => (
                <div key={item.jurisdiction} className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium text-gray-900">{item.jurisdiction}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.risk === 'Low' ? 'bg-green-100 text-green-800' :
                      item.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.risk} risk
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Non-Compete:</span>
                      <p className="font-medium text-gray-900">{item.nonCompete}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Legal Cost:</span>
                      <p className="font-medium text-gray-900">{item.cost}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Overall Risk:</span>
                      <p className="font-medium text-gray-900">{item.risk}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}