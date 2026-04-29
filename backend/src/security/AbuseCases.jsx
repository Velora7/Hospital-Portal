import React from 'react';
import { AlertTriangle, Skull, Shield, Lock, Eye, Terminal } from 'lucide-react';

export default function AbuseCases() {
  const abuseCases = [
    {
      id: "AC-001",
      name: "Brute Force Login Attack",
      severity: "HIGH",
      attackerGoal: "Gain unauthorized access to patient/doctor accounts",
      attackScenario: `
        Attacker uses automated tools to try thousands of password combinations 
        on the login page, hoping to guess a weak password.
      `,
      affectedComponent: "Login Form (/login)",
      potentialDamage: "Account takeover, data breach, privacy violation",
      mitigation: `
        ✓ Account lockout after 5 failed attempts
        ✓ CAPTCHA after 3 failed attempts  
        ✓ Rate limiting (10 requests per minute)
        ✓ Strong password policy enforcement
      `,
      icon: <Terminal size={24} />
    },
    {
      id: "AC-002", 
      name: "Message Tampering/Injection",
      severity: "CRITICAL",
      attackerGoal: "Inject malicious code or modify message content",
      attackScenario: `
        Attacker sends a message containing: <script>alert('Hacked!')</script>
        or tries to modify message IDs to see other patients' conversations.
      `,
      affectedComponent: "Messaging System",
      potentialDamage: "XSS attacks, data theft, session hijacking",
      mitigation: `
        ✓ Input sanitization (DOMPurify)
        ✓ Message encryption (AES-256)
        ✓ UUID instead of sequential IDs
        ✓ Content Security Policy headers
      `,
      icon: <Skull size={24} />
    },
    {
      id: "AC-003",
      name: "Session Hijacking",
      severity: "HIGH", 
      attackerGoal: "Steal user session token to impersonate them",
      attackScenario: `
        Attacker uses XSS or network sniffing to steal session cookie,
        then uses it to access the system as the victim user.
      `,
      affectedComponent: "Session Management",
      potentialDamage: "Complete account takeover",
      mitigation: `
        ✓ HttpOnly cookies (not accessible via JavaScript)
        ✓ Secure flag (HTTPS only)
        ✓ Session timeout after 15 minutes
        ✓ Session regeneration on login
      `,
      icon: <Eye size={24} />
    },
    {
      id: "AC-004",
      name: "IDOR - View Other Patients' Messages",
      severity: "CRITICAL",
      attackerGoal: "Access messages belonging to other patients",
      attackScenario: `
        Attacker changes message ID in URL from ?id=123 to ?id=124
        to try viewing another patient's private conversations.
      `,
      affectedComponent: "Message API Endpoints",
      potentialDamage: "Massive privacy breach, HIPAA violation",
      mitigation: `
        ✓ Authorization checks for every request
        ✓ Use UUIDs (not sequential numbers)
        ✓ Verify user has permission to access resource
        ✓ Log all access attempts
      `,
      icon: <Lock size={24} />
    },
    {
      id: "AC-005",
      name: "Privilege Escalation",
      severity: "HIGH",
      attackerGoal: "Patient gains doctor privileges",
      attackScenario: `
        Attacker modifies JWT token or API request to change role from 
        'patient' to 'doctor' to access restricted features.
      `,
      affectedComponent: "Role-Based Access Control (RBAC)",
      potentialDamage: "Unauthorized access to sensitive functions",
      mitigation: `
        ✓ Server-side role validation (never trust client)
        ✓ JWT token signature verification
        ✓ Role checks on every API endpoint
        ✓ Regular security audits
      `,
      icon: <AlertTriangle size={24} />
    }
  ];

  return (
    <div className="abuse-cases-container p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-4 rounded-full">
              <AlertTriangle size={48} className="text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Abuse Cases Documentation
          </h1>
          <p className="text-gray-600 text-lg">
            Security Threats & Mitigation Strategies for HealthShield Portal
          </p>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg inline-block">
            <p className="text-sm text-yellow-800">
              ⚠️ Total: {abuseCases.length} identified abuse cases | 
              Severity: {abuseCases.filter(a => a.severity === "CRITICAL").length} Critical, 
              {abuseCases.filter(a => a.severity === "HIGH").length} High
            </p>
          </div>
        </div>

        {/* Abuse Cases Grid */}
        <div className="grid gap-6">
          {abuseCases.map((abuseCase) => (
            <div 
              key={abuseCase.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-8 border-red-500 hover:shadow-xl transition"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-500 p-3 rounded-xl">
                      {abuseCase.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{abuseCase.name}</h2>
                      <p className="text-gray-300 text-sm">ID: {abuseCase.id}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full font-bold text-sm ${
                    abuseCase.severity === "CRITICAL" 
                      ? "bg-red-600 text-white" 
                      : "bg-orange-500 text-white"
                  }`}>
                    Severity: {abuseCase.severity}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Attack Scenario */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <Terminal size={20} className="text-red-600" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-800">Attack Scenario</h3>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {abuseCase.attackScenario}
                      </p>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm">
                          <span className="font-semibold">Target:</span> {abuseCase.affectedComponent}
                        </p>
                        <p className="text-sm mt-1">
                          <span className="font-semibold">Goal:</span> {abuseCase.attackerGoal}
                        </p>
                        <p className="text-sm mt-1">
                          <span className="font-semibold text-red-600">Damage:</span> {abuseCase.potentialDamage}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mitigation */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Shield size={20} className="text-green-600" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-800">Mitigation Strategy</h3>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <div className="space-y-2">
                        {abuseCase.mitigation.split('\n').map((item, idx) => (
                          item.trim() && (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-green-600 mt-1">✓</span>
                              <span className="text-gray-700">{item.trim().replace('✓', '')}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Implementation Status */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        abuseCase.id === "AC-001" ? "bg-green-500" : 
                        abuseCase.id === "AC-002" ? "bg-yellow-500" : "bg-red-500"
                      }`} />
                      <span className="text-sm text-gray-600">
                        Status: {
                          abuseCase.id === "AC-001" ? "Implemented" :
                          abuseCase.id === "AC-002" ? "Partial" : "Planned"
                        }
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        // Show detailed mitigation steps
                        alert(`Detailed mitigation for ${abuseCase.name}:\n${abuseCase.mitigation}`);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Implementation Details →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Table */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Abuse Cases Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Abuse Case</th>
                  <th className="p-3 text-left">Severity</th>
                  <th className="p-3 text-left">Mitigated</th>
                </tr>
              </thead>
              <tbody>
                {abuseCases.map(abuse => (
                  <tr key={abuse.id} className="border-t">
                    <td className="p-3 font-mono text-sm">{abuse.id}</td>
                    <td className="p-3">{abuse.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        abuse.severity === "CRITICAL" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                      }`}>
                        {abuse.severity}
                      </span>
                    </td>
                    <td className="p-3">
                      {abuse.id === "AC-001" ? "✅ Yes" : 
                       abuse.id === "AC-002" ? "⚠️ Partial" : "❌ No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
