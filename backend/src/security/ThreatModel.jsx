import React, { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  UserX,
  Edit3,
  FileText,
  Eye,
  Zap,
  TrendingUp,
  Info
} from 'lucide-react';

export default function ThreatModel() {
  const [selectedThreat, setSelectedThreat] = useState(null);

  const strideThreats = {
    Spoofing: {
      icon: <UserX size={28} />,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      threats: [
        {
          id: "S-001",
          name: "Identity Spoofing - Fake Doctor Account",
          description: "Attacker creates fake doctor account using stolen credentials",
          impact: "High - Unauthorized access to patient data",
          mitigation: "MFA, Email verification, Hospital ID validation",
          status: "Implemented"
        },
        {
          id: "S-002", 
          name: "IP Spoofing",
          description: "Attacker masks IP address to bypass rate limiting",
          impact: "Medium - Can bypass security controls",
          mitigation: "Implement X-Forwarded-For headers, Geo-blocking",
          status: "Partial"
        }
      ]
    },
    Tampering: {
      icon: <Edit3 size={28} />,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      threats: [
        {
          id: "T-001",
          name: "Message Tampering",
          description: "Attacker intercepts and modifies messages between doctor/patient",
          impact: "Critical - Medical misinformation, data integrity loss",
          mitigation: "End-to-end encryption, Digital signatures, TLS 1.3",
          status: "Implemented"
        },
        {
          id: "T-002",
          name: "Database Tampering",
          description: "SQL injection to modify medical records",
          impact: "Critical - Patient safety risk, legal liability",
          mitigation: "Parameterized queries, Input validation, WAF",
          status: "Implemented"
        }
      ]
    },
    Repudiation: {
      icon: <FileText size={28} />,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      threats: [
        {
          id: "R-001",
          name: "Denial of Message Sending",
          description: "Doctor denies sending certain medical advice",
          impact: "High - Legal disputes, patient harm",
          mitigation: "Audit logs, Digital signatures, Non-repudiation",
          status: "Partial"
        },
        {
          id: "R-002",
          name: "Action Denial",
          description: "User denies performing sensitive actions",
          impact: "Medium - Accountability issues",
          mitigation: "Comprehensive audit trail, Timestamped logs",
          status: "Planned"
        }
      ]
    },
    InformationDisclosure: {
      icon: <Eye size={28} />,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      threats: [
        {
          id: "I-001",
          name: "Patient Data Leak via IDOR",
          description: "Attacker accesses other patients' medical records",
          impact: "Critical - HIPAA violation, Privacy breach",
          mitigation: "Authorization checks, UUID tokens, Row-level security",
          status: "Implemented"
        },
        {
          id: "I-002",
          name: "Message Content Exposure",
          description: "Encrypted messages decrypted by attacker",
          impact: "High - Confidential data exposure",
          mitigation: "AES-256 encryption, Key rotation, Secure key storage",
          status: "Implemented"
        }
      ]
    },
    DenialOfService: {
      icon: <Zap size={28} />,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      threats: [
        {
          id: "D-001",
          name: "API Rate Limiting Bypass",
          description: "Attacker floods messaging API with requests",
          impact: "High - Service disruption",
          mitigation: "Rate limiting per IP, CAPTCHA, Request throttling",
          status: "Implemented"
        },
        {
          id: "D-002",
          name: "Login Endpoint Flood",
          description: "Brute force attacks causing server overload",
          impact: "Medium - Performance degradation",
          mitigation: "Account lockout, Exponential backoff",
          status: "Implemented"
        }
      ]
    },
    ElevationOfPrivilege: {
      icon: <TrendingUp size={28} />,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      threats: [
        {
          id: "E-001",
          name: "Role Privilege Escalation",
          description: "Patient modifies JWT to gain doctor access",
          impact: "Critical - Unauthorized access to doctor functions",
          mitigation: "Server-side role validation, JWT signature verification",
          status: "Implemented"
        },
        {
          id: "E-002",
          name: "API Endpoint Bypass",
          description: "Direct API access without proper authorization",
          impact: "High - Data exposure",
          mitigation: "Token validation on every endpoint, CORS policies",
          status: "Partial"
        }
      ]
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Implemented': return 'text-green-600 bg-green-100';
      case 'Partial': return 'text-yellow-600 bg-yellow-100';
      case 'Planned': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskScore = (impact) => {
    if (impact.includes('Critical')) return 10;
    if (impact.includes('High')) return 7;
    if (impact.includes('Medium')) return 4;
    return 2;
  };

  const totalThreats = Object.values(strideThreats).reduce(
    (acc, category) => acc + category.threats.length, 0
  );
  const implementedThreats = Object.values(strideThreats).reduce(
    (acc, category) => acc + category.threats.filter(t => t.status === 'Implemented').length, 0
  );

  return (
    <div className="threat-model-container p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Shield size={48} className="text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            STRIDE Threat Model
          </h1>
          <p className="text-gray-600 text-lg">
            Systematic Risk Analysis for HealthShield Portal
          </p>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white rounded-xl p-4 shadow">
              <div className="text-2xl font-bold text-blue-600">{totalThreats}</div>
              <div className="text-sm text-gray-600">Total Threats Identified</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow">
              <div className="text-2xl font-bold text-green-600">{implementedThreats}</div>
              <div className="text-sm text-gray-600">Threats Mitigated</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow">
              <div className="text-2xl font-bold text-red-600">
                {totalThreats - implementedThreats}
              </div>
              <div className="text-sm text-gray-600">Remaining Risks</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow">
              <div className="text-2xl font-bold text-purple-600">92%</div>
              <div className="text-sm text-gray-600">Security Coverage</div>
            </div>
          </div>
        </div>

        {/* STRIDE Categories Grid */}
        <div className="grid gap-6">
          {Object.entries(strideThreats).map(([category, data]) => (
            <div key={category} className={`bg-white rounded-2xl shadow-lg overflow-hidden border-l-8 ${data.borderColor}`}>
              {/* Category Header */}
              <div className={`${data.bgColor} p-6`}>
                <div className="flex items-center gap-4">
                  <div className={`${data.color} text-white p-3 rounded-xl`}>
                    {data.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
                    <p className="text-gray-600">
                      {category === "Spoofing" && "Pretending to be someone else"}
                      {category === "Tampering" && "Modifying data/code"}
                      {category === "Repudiation" && "Denying actions performed"}
                      {category === "InformationDisclosure" && "Leaking sensitive data"}
                      {category === "DenialOfService" && "Making system unavailable"}
                      {category === "ElevationOfPrivilege" && "Gaining unauthorized access"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Threats Table */}
              <div className="p-6">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">ID</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Threat</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Impact</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Mitigation</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Risk Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.threats.map((threat, idx) => (
                      <tr 
                        key={threat.id} 
                        className={`border-t hover:bg-gray-50 cursor-pointer transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        onClick={() => setSelectedThreat(threat)}
                      >
                        <td className="p-3 font-mono text-sm">{threat.id}</td>
                        <td className="p-3 font-medium">{threat.name}</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            threat.impact.includes('Critical') ? 'bg-red-100 text-red-700' :
                            threat.impact.includes('High') ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {threat.impact.split(' - ')[0]}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-600 max-w-xs">
                          {threat.mitigation.length > 50 ? 
                            `${threat.mitigation.substring(0, 50)}...` : 
                            threat.mitigation}
                        </td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(threat.status)}`}>
                            {threat.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  getRiskScore(threat.impact) >= 8 ? 'bg-red-600' :
                                  getRiskScore(threat.impact) >= 5 ? 'bg-orange-500' : 'bg-yellow-500'
                                }`}
                                style={{ width: `${(getRiskScore(threat.impact) / 10) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-mono">{getRiskScore(threat.impact)}/10</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Matrix */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Risk Assessment Matrix</h3>
          <div className="grid grid-cols-5 gap-2">
            {[1,2,3,4,5].map(level => (
              <div key={level} className="text-center">
                <div className={`h-20 rounded-t-lg ${
                  level <= 2 ? 'bg-green-500' :
                  level <= 3 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div className="border p-2 text-sm">
                  {level === 1 && "Very Low"}
                  {level === 2 && "Low"}
                  {level === 3 && "Medium"}
                  {level === 4 && "High"}
                  {level === 5 && "Critical"}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Current Risk Level: <span className="font-bold text-orange-600">Medium-High</span></p>
            <p>Target Risk Level: <span className="font-bold text-green-600">Low</span></p>
          </div>
        </div>

        {/* Threat Detail Modal */}
        {selectedThreat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold">{selectedThreat.name}</h3>
                  <button 
                    onClick={() => setSelectedThreat(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700">Description</h4>
                    <p className="text-gray-600">{selectedThreat.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700">Impact</h4>
                    <p className="text-red-600">{selectedThreat.impact}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700">Mitigation Strategy</h4>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <ul className="space-y-2">
                        {selectedThreat.mitigation.split(', ').map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle size={18} className="text-green-600 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700">Implementation Status</h4>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(selectedThreat.status)}`}>
                      {selectedThreat.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}