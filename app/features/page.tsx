import { Footer } from '@/components/footer';
import { Zap, Clock, Lock, Smartphone, BarChart3, Shield } from 'lucide-react';

export const metadata = {
  title: 'Features - CeloFlow',
  description: 'Explore CeloFlow features for real-time salary streaming',
};

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Real-Time Streaming',
      description: 'Salary streams per second. No waiting for monthly payday. Employees earn continuously throughout the day.',
    },
    {
      icon: Clock,
      title: 'Instant Withdrawals',
      description: 'Withdraw any amount, anytime. Direct to your wallet with no delays, no intermediaries, no fees.',
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Built for mobile through MiniPay. Send and receive salary directly from your phone without any friction.',
    },
    {
      icon: Lock,
      title: 'Blockchain Security',
      description: 'Smart contracts enforce agreements. All transactions are transparent, immutable, and cryptographically secured.',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track earnings per second with live dashboards. See hourly, daily, and monthly breakdowns instantly.',
    },
    {
      icon: Shield,
      title: 'Dispute Resolution',
      description: 'Built-in mechanisms for handling payment disputes. Both employers and employees are protected by the protocol.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-5xl font-bold mb-4">Powerful Features</h1>
          <p className="text-[#cccccc] text-lg max-w-2xl">
            Everything you need for real-time salary streaming and payment management.
          </p>
        </div>
      </header>

      {/* Features Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group p-8 border border-[#1a1a1a] rounded-lg bg-[#0a0a0a] hover:border-[#FFD600]/30 transition-all hover:shadow-lg hover:shadow-[#FFD600]/10"
              >
                <div className="w-12 h-12 bg-[#FFD600]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#FFD600]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[#FFD600]" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[#cccccc] leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Employer Features */}
        <section className="mt-20 pt-16 border-t border-[#1a1a1a]">
          <h2 className="text-4xl font-bold mb-12 text-center">For Employers</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#FFD600]">✓ Simplified Payroll</h3>
              <p className="text-[#cccccc]">
                No more complex payroll systems. Create salary streams and let blockchain handle the rest. Reduce overhead by 80%.
              </p>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#FFD600]">✓ Improve Retention</h3>
              <p className="text-[#cccccc]">
                Real-time payments boost employee satisfaction. Immediate access to earnings means happier, more loyal team members.
              </p>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#FFD600]">✓ Global Reach</h3>
              <p className="text-[#cccccc]">
                Hire talent worldwide. Send payments instantly to any Celo wallet, anywhere on the planet with no borders.
              </p>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#FFD600]">✓ Cost Efficient</h3>
              <p className="text-[#cccccc]">
                Minimal transaction fees. Save on traditional payment processing costs and banking intermediaries.
              </p>
            </div>
          </div>
        </section>

        {/* Employee Features */}
        <section className="mt-20 pt-16 border-t border-[#1a1a1a]">
          <h2 className="text-4xl font-bold mb-12 text-center">For Employees</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#FFD600]">✓ Financial Freedom</h3>
              <p className="text-[#cccccc]">
                No more waiting for payday. Access your earnings whenever you need them. Emergency fund? Done in seconds.
              </p>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#FFD600]">✓ Better Planning</h3>
              <p className="text-[#cccccc]">
                Live dashboard shows exactly what you've earned. Plan your finances with real-time, transparent data.
              </p>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#FFD600]">✓ Mobile First</h3>
              <p className="text-[#cccccc]">
                Manage everything on your phone with MiniPay. No laptop required. Work from anywhere, get paid instantly.
              </p>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#FFD600]">✓ Full Control</h3>
              <p className="text-[#cccccc]">
                Your wallet, your keys, your money. CeloFlow never has access to your funds. You stay in complete control.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-20 pt-16 border-t border-[#1a1a1a] text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-[#cccccc] mb-8 max-w-2xl mx-auto">
            Join thousands of employers and employees already using CeloFlow for real-time salary streaming.
          </p>
          <a
            href="/"
            className="inline-block px-8 py-4 bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold rounded-lg transition-colors text-lg"
          >
            Get Started Now
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
