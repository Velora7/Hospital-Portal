import React, { useState } from 'react';
import { GitBranch, Target, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function AttackTree() {
  const [selectedNode, setSelectedNode] = useState(null);

  const attackTree = {
    root: {
      name: "Steal Patient Medical Records",
      goal: "CRITICAL ASSET",
      children: [
        {
          name: "1. Compromise Authentication",
          type: "OR",
          children: [
            {
              name: "1.1 Brute Force Attack",
              mitigations: ["Rate limiting", "Account lockout", "CAPTCHA"],
              status: "mitigated"
            },
            {
              name: "1.2 Phishing Attack",
              mitigations: ["MFA", "Security awareness training", "Email filtering"],
              status: "partial"
            },
            {
              name: "1.3 Session Hijacking",
              mitigations: ["HttpOnly cookies", "Secure flag", "Session timeout"],
              status: "mitigated"
            },
            {
              name: "1.4 Credential Theft",
              mitigations: ["Password hashing", "Breach monitoring"],
              status: "mitigated"
            }
          ]
        },
        {
          name: "2. Exploit Vulnerabilities",
          type: "OR",
          children: [
            {
              name: "2.1 SQL Injection",
              mitigations: ["Parameterized queries", "Input validation", "WAF"],
              status: "mitigated"
            },
            {
              name: "2.2 Cross-Site Scripting (XSS)",
              mitigations: ["DOMPurify", "CSP headers", "Output encoding"],
              status: "mitigated"
            },
            {
              name: "2.3 IDOR Vulnerability",
              mitigations: ["UUID tokens", "Authorization checks", "Access control"],
              status: "partial"
            }
          ]
        },
        {
          name: "3. Insider Threat",
          type: "OR",
          children: [
            {
              name: "3.1 Malicious Doctor",
              mitigations: ["Audit logs", "Least privilege", "Background checks"],
              status: "partial"
            },
            {
              name: "3.2 Database Admin Abuse",
              mitigations: ["Database encryption", "Access logging", "Separation of duties"],
              status: "planned"
            }
          ]
        },
        {
          name: "4. Network Attack",
          type: "OR",
          children: [
            {
              name: "4.1 Man-in-the-Middle",
              mitigations: ["TLS 1.3", "HSTS", "Certificate pinning"],
              status: "mitigated"
            },
            {
              name: "4.2 DNS Spoofing",
              mitigations: ["DNSSEC", "DoH", "Network monitoring"],
              status: "planned"
            }
          ]
        }
      ]
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'mitigated': return <CheckCircle size={16} className="text-green-600" />;
      case 'partial': return <AlertCircle size={16} className="text-yellow-600" />;
      case 'planned': return <XCircle size={16} className="text-red-600" />;
      default: return null;
    }
  };

  const renderNode = (node, level = 0) => {
    return (
      <div key={node.name} className="relative" style={{ marginLeft: `${level * 24}px` }}>
        <div className={`flex items-start gap-3 p-3 rounded-lg border-2 ${
          level === 0 ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'
        } hover:shadow-md transition cursor-pointer`}
        onClick={() => setSelectedNode(node)}>
          <div className="flex-shrink-0 mt-1">
            {level === 0 ? <Target size={20} className="text-red-600" /> : <GitBranch size={18} className="text-gray-500" />}
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${level === 0 ? 'text-red-800' : 'text-gray-800'}`}>
                {node.name}
              </span>
              {node.type && (
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                  {node.type}
                </span>
              )}
              {node.status && (
                <span className="flex items-center gap-1 text-xs">
                  {getStatusIcon(node.status)}
                  <span className="capitalize">{node.status}</span>
                </span>
              )}
            </div>
            {node.mitigations && (
              <div className="text-xs text-gray-500 mt-1">
                {node.mitigations.length} mitigations applied
              </div>
            )}
          </div>
        </div>
        {node.children && (
          <div className="ml-6 border-l-2 border-dashed border-gray-300 pl-4 mt-2">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const calculateRiskScore = () => {
    let total = 0;
    let mitigated = 0;
    
    const countStatus = (node) => {
      if (node.status) {
        total++;
        if (node.status === 'mitigated') mitigated++;
      }
      if (node.children) {
        node.children.forEach(child => countStatus(child));
      }
    };
    
    countStatus(attackTree.root);
    return { total, mitigated, percentage: (mitigated / total) * 100 };
  };

  const risk = calculateRiskScore();

  return (
    <div className="attack-tree-container p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-4 rounded-full">
              <GitBranch size={48} className="text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Attack Tree Analysis
          </h1>
          <p className="text-gray-600 text-lg">
            Visual Attack Paths to Critical Assets
          </p>
          
          {/* Risk Summary */}
          <div className="mt-6 inline-block bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-sm text-gray-600">Total Attack Vectors</div>
                <div className="text-2xl font-bold">{risk.total}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Mitigated</div>
                <div className="text-2xl font-bold text-green-600">{risk.mitigated}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Risk Coverage</div>
                <div className="text-2xl font-bold text-blue-600">{risk.percentage.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Attack Tree Visualization */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Target className="text-red-600" />
            Attack Tree: {attackTree.root.name}
          </h2>
          
          <div className="space-y-2">
            {renderNode(attackTree.root)}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold mb-4">Legend</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600" />
              <span>Mitigated</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-yellow-600" />
              <span>Partially Mitigated</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle size={20} className="text-red-600" />
              <span>Not Mitigated</span>
            </div>
          </div>
        </div>

        {/* Mitigation Priority */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <h3 className="font-bold text-yellow-800 mb-3">⚠️ Priority Mitigation Actions</h3>
          <ul className="space-y-2 text-yellow-700">
            <li>1. Implement IDOR protection for all message endpoints (Critical)</li>
            <li>2. Add database access logging and monitoring (High)</li>
            <li>3. Implement DNSSEC for domain protection (Medium)</li>
            <li>4. Deploy Web Application Firewall (WAF) (High)</li>
          </ul>
        </div>

        {/* Node Detail Modal */}
        {selectedNode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedNode.name}</h3>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {selectedNode.mitigations && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Mitigations:</h4>
                  <ul className="space-y-1">
                    {selectedNode.mitigations.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle size={14} className="text-green-600 mt-0.5" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Status:</h4>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  selectedNode.status === 'mitigated' ? 'bg-green-100 text-green-700' :
                  selectedNode.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {getStatusIcon(selectedNode.status)}
                  <span className="capitalize">{selectedNode.status}</span>
                </span>
              </div>
              
              {selectedNode.type && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Node Type:</h4>
                  <p className="text-sm text-gray-600">
                    {selectedNode.type === 'OR' ? 'Any child can achieve the goal' : 'All children required'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}