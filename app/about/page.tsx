'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Users, Target, Zap } from 'lucide-react';
import { Footer } from '@/components/footer';

export default function AboutPage() {
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
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-balance">
          About
          <br />
          <span className="text-[#FFD600]">CeloFlow</span>
        </h1>
        <p className="text-xl text-[#cccccc] max-w-2xl leading-relaxed">
          We're building the future of work by enabling real-time salary payments on blockchain. Financial freedom, every second.
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-[#1a1a1a]">
        <h2 className="text-4xl font-bold mb-12">Our Mission</h2>
        <p className="text-lg text-[#cccccc] mb-8 leading-relaxed max-w-3xl">
          At CeloFlow, we believe that financial freedom should be accessible to everyone. Traditional salary systems require workers to wait for monthly payday, creating cash flow challenges especially in emerging markets. We're changing that.
        </p>
        <p className="text-lg text-[#cccccc] mb-8 leading-relaxed max-w-3xl">
          By leveraging Celo's blockchain and MiniPay's mobile accessibility, we've built a system where salary streams continuously, second by second. Employers can manage payroll efficiently. Employees get instant access to their earnings. Everyone wins.
        </p>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-[#1a1a1a]">
        <h2 className="text-4xl font-bold mb-12">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardContent className="pt-8">
              <div className="w-12 h-12 bg-[#FFD600]/10 rounded-lg mb-4 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#FFD600]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Financial Inclusion</h3>
              <p className="text-[#cccccc]">
                We're committed to bringing banking and payments to everyone, especially those underserved by traditional systems.
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardContent className="pt-8">
              <div className="w-12 h-12 bg-[#FFD600]/10 rounded-lg mb-4 flex items-center justify-center">
                <Target className="w-6 h-6 text-[#FFD600]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Transparency</h3>
              <p className="text-[#cccccc]">
                Every transaction is on-chain, verifiable, and transparent. No hidden fees or delays.
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardContent className="pt-8">
              <div className="w-12 h-12 bg-[#FFD600]/10 rounded-lg mb-4 flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#FFD600]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-[#cccccc]">
                We're constantly innovating to make salary streaming faster, cheaper, and more accessible to all.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-[#1a1a1a]">
        <h2 className="text-4xl font-bold mb-12">Built on Celo</h2>
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-bold mb-4">Why Celo?</h3>
          <ul className="space-y-4 text-[#cccccc]">
            <li className="flex gap-3">
              <span className="text-[#FFD600] font-bold">•</span>
              <span><strong>Mobile-First:</strong> Celo is designed for mobile wallets like MiniPay, perfect for emerging markets</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FFD600] font-bold">•</span>
              <span><strong>Stablecoins:</strong> cUSD provides stability without cryptocurrency volatility for real payments</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FFD600] font-bold">•</span>
              <span><strong>Fast & Cheap:</strong> Sub-second blocks and low fees make per-second payments practical</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FFD600] font-bold">•</span>
              <span><strong>Community:</strong> Celo's mission aligns perfectly with ours on financial inclusion</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-[#1a1a1a]">
        <h2 className="text-4xl font-bold mb-12">Our Journey</h2>
        <div className="space-y-8">
          {[
            { date: 'Q4 2023', title: 'Idea Genesis', desc: 'Founded CeloFlow to solve real-time salary payments' },
            { date: 'Q1 2024', title: 'MVP Launch', desc: 'Deployed first smart contract on Celo Alfajores testnet' },
            { date: 'Q2 2024', title: 'Beta Release', desc: 'Launched beta with first employers and employees' },
            { date: 'Q3 2024', title: 'Mainnet Launch', desc: 'Went live on Celo mainnet with cUSD support' },
            { date: 'Q4 2024', title: 'Growth Phase', desc: 'Scaling to support 10,000+ users' },
          ].map((milestone, idx) => (
            <div key={idx} className="flex gap-6 relative">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-[#FFD600] rounded-full mt-2" />
                {idx < 4 && <div className="w-0.5 h-24 bg-[#1a1a1a] my-2" />}
              </div>
              <div className="pb-8">
                <div className="text-[#FFD600] font-bold text-sm mb-1">{milestone.date}</div>
                <h4 className="text-xl font-bold text-white mb-2">{milestone.title}</h4>
                <p className="text-[#cccccc]">{milestone.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-[#1a1a1a]">
        <div className="bg-[#0a0a0a] border border-[#FFD600]/30 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Revolution</h2>
          <p className="text-[#cccccc] mb-8 max-w-2xl mx-auto">
            Be part of the future of work. Start streaming salary today or receive payments in real-time.
          </p>
          <Link href="/">
            <Button className="bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold text-lg">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
