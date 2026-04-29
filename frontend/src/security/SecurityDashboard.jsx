import React from 'react';

export default function SecurityDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Security Documentation</h1>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h2 className="text-xl font-semibold">✅ Phase 1: Abuse Cases</h2>
              <p className="text-gray-600">5 abuse cases documented with mitigations</p>
              <p className="text-sm text-gray-500 mt-1">AC-001 to AC-005: Brute Force, XSS, Session Hijacking, IDOR, Privilege Escalation</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h2 className="text-xl font-semibold">✅ Phase 2: STRIDE Threat Model</h2>
              <p className="text-gray-600">12+ threats analyzed across 6 categories</p>
              <p className="text-sm text-gray-500 mt-1">Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h2 className="text-xl font-semibold">✅ Phase 2: Attack Tree</h2>
              <p className="text-gray-600">Visual attack paths to critical assets</p>
              <p className="text-sm text-gray-500 mt-1">4 main attack vectors with 11 sub-vectors</p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h2 className="text-xl font-semibold">🔄 Phase 3: Implementation</h2>
              <p className="text-gray-600">Secure coding practices being implemented</p>
              <p className="text-sm text-gray-500 mt-1">Input validation, encryption, rate limiting</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-center text-gray-700">
              📸 Take screenshots of this page for your project report
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}