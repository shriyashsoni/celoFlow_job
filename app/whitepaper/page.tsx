'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Download, FileText, Zap } from 'lucide-react';
import { Footer } from '@/components/footer';

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] sticky top-0 z-50 bg-black/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FFD600] rounded flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            CeloFlow
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-[#1a1a1a] hover:bg-[#0a0a0a]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="mb-12">
          <div className="inline-block bg-[#FFD600]/10 border border-[#FFD600]/30 rounded px-4 py-2 mb-4">
            <span className="text-[#FFD600] text-sm font-bold">Technical Documentation</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-balance">
            CeloFlow Whitepaper
          </h1>
          <p className="text-xl text-[#cccccc] mb-8">
            Real-Time Salary Streaming on Celo: A Technical Architecture for Per-Second Payments
          </p>
          <div className="flex gap-4">
            <Button className="bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" className="border-[#1a1a1a] hover:bg-[#0a0a0a]">
              <FileText className="w-4 h-4 mr-2" />
              View Full Document
            </Button>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-[#1a1a1a]">
        <h2 className="text-2xl font-bold mb-8">Table of Contents</h2>
        <div className="space-y-4">
          {[
            '1. Abstract',
            '2. Introduction',
            '3. Problem Statement',
            '4. Technical Architecture',
            '5. Smart Contract Design',
            '6. Security Considerations',
            '7. Economic Model',
            '8. Roadmap',
            '9. Conclusion',
            '10. References'
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-[#cccccc] hover:text-[#FFD600] transition-colors cursor-pointer">
              <span className="w-2 h-2 bg-[#FFD600] rounded-full" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Abstract */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-[#1a1a1a]">
        <h2 className="text-3xl font-bold mb-6">1. Abstract</h2>
        <div className="space-y-4 text-[#cccccc] leading-relaxed">
          <p>
            This whitepaper presents CeloFlow, a decentralized protocol for streaming salary payments in real-time on the Celo blockchain. Traditional salary systems require employees to wait for monthly payday, creating financial uncertainty and cash flow challenges. CeloFlow enables employers to stream salaries continuously to employees on a per-second basis, providing financial flexibility and immediate access to earned income.
          </p>
          <p>
            Built on Celo's mobile-first blockchain and leveraging cUSD stablecoins, CeloFlow combines smart contract automation with accessibility, enabling salary streaming that's fast, transparent, and inclusive. This document outlines our technical architecture, security model, and economic incentives.
          </p>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-[#1a1a1a]">
        <h2 className="text-3xl font-bold mb-6">2. Problem Statement</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#FFD600] mb-3">Current State of Payroll</h3>
            <p className="text-[#cccccc] leading-relaxed mb-4">
              Traditional salary systems operate on a fixed monthly or bi-weekly cycle. This creates several inefficiencies:
            </p>
            <ul className="space-y-3 text-[#cccccc]">
              <li className="flex gap-3">
                <span className="text-[#FFD600] font-bold">•</span>
                <span>Employees face cash flow challenges between pay periods</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#FFD600] font-bold">•</span>
                <span>Gig workers and contractors wait weeks or months for payment</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#FFD600] font-bold">•</span>
                <span>Global payments require expensive intermediaries and take days</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#FFD600] font-bold">•</span>
                <span>No transparency into what portion of salary has been earned</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-[#1a1a1a]">
        <h2 className="text-3xl font-bold mb-6">3. Technical Architecture</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-[#FFD600] mb-3">Core Components</h3>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6 space-y-4 text-[#cccccc]">
              <div>
                <h4 className="font-bold text-white mb-2">Smart Contracts</h4>
                <p>Solidity contracts deployed on Celo handle stream creation, token transfers, and withdrawal logic with per-second precision.</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Frontend Application</h4>
                <p>React/Next.js interface with ethers.js integration for wallet connection and transaction signing.</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Celo Blockchain</h4>
                <p>Proof-of-Stake blockchain with 5-second blocks, sub-cent transaction costs, and native stablecoin support.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#FFD600] mb-3">Stream Lifecycle</h3>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
              <ol className="space-y-4 text-[#cccccc]">
                <li className="flex gap-3">
                  <span className="text-[#FFD600] font-bold min-w-8">1.</span>
                  <span><strong>Creation:</strong> Employer creates stream specifying recipient, amount, and duration</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FFD600] font-bold min-w-8">2.</span>
                  <span><strong>Streaming:</strong> Smart contract calculates accrued amount per second</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FFD600] font-bold min-w-8">3.</span>
                  <span><strong>Withdrawal:</strong> Employee can withdraw available balance at any time</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FFD600] font-bold min-w-8">4.</span>
                  <span><strong>Completion:</strong> Stream ends after specified duration or early cancellation</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Contract */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-[#1a1a1a]">
        <h2 className="text-3xl font-bold mb-6">4. Smart Contract Design</h2>
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6 mb-6">
          <pre className="text-xs text-[#cccccc] overflow-x-auto">
{`// Core Stream Structure
struct Stream {
  address employer;
  address employee;
  uint256 amount;      // Total amount to stream
  uint256 startTime;   // Stream start timestamp
  uint256 duration;    // Duration in seconds
  uint256 withdrawn;   // Amount already withdrawn
}

// Per-second calculation
function accrued(uint256 streamId) external view returns (uint256) {
  Stream memory stream = streams[streamId];
  uint256 elapsed = min(now - stream.startTime, stream.duration);
  return (stream.amount * elapsed) / stream.duration - stream.withdrawn;
}`}
          </pre>
        </div>
        <p className="text-[#cccccc] leading-relaxed">
          The smart contract maintains precision through fixed-point arithmetic to ensure accurate per-second calculations. All state changes emit events for transparency and off-chain indexing.
        </p>
      </section>

      {/* Security */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-[#1a1a1a]">
        <h2 className="text-3xl font-bold mb-6">5. Security Considerations</h2>
        <div className="space-y-6">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#FFD600] mb-3">Reentrancy Protection</h3>
            <p className="text-[#cccccc]">Checks-effects-interactions pattern and OpenZeppelin's ReentrancyGuard prevent reentrancy attacks.</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#FFD600] mb-3">Access Control</h3>
            <p className="text-[#cccccc]">Only employers can create/cancel streams. Only employees can withdraw from their streams.</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#FFD600] mb-3">Arithmetic Safety</h3>
            <p className="text-[#cccccc]">Solidity 0.8.0+ with built-in overflow/underflow protection ensures calculation accuracy.</p>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-[#1a1a1a]">
        <h2 className="text-3xl font-bold mb-6">6. Future Roadmap</h2>
        <div className="space-y-6">
          {[
            { phase: 'Phase 1', title: 'Launch', status: 'Complete', items: ['Core streaming', 'Mobile wallet support'] },
            { phase: 'Phase 2', title: 'Growth', status: 'In Progress', items: ['Multi-token support', 'Advanced analytics'] },
            { phase: 'Phase 3', title: 'Scale', status: 'Planned', items: ['Layer 2 integration', 'Cross-chain bridges'] },
            { phase: 'Phase 4', title: 'Evolution', status: 'Planned', items: ['DAO governance', 'Advanced features'] }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-[#FFD600] font-bold text-sm">{item.phase}</div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                </div>
                <div className="px-3 py-1 bg-[#FFD600]/10 border border-[#FFD600]/30 rounded text-xs font-bold text-[#FFD600]">
                  {item.status}
                </div>
              </div>
              <ul className="space-y-2 text-[#cccccc] text-sm">
                {item.items.map((subitem, sidx) => (
                  <li key={sidx} className="flex gap-2">
                    <span className="text-[#FFD600]">→</span>
                    <span>{subitem}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-[#1a1a1a] mb-12">
        <div className="bg-[#0a0a0a] border border-[#FFD600]/30 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore CeloFlow?</h2>
          <p className="text-[#cccccc] mb-8">
            Start streaming salary or receiving payments in real-time today.
          </p>
          <Link href="/">
            <Button className="bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold">
              Launch App
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
