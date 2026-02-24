import { Footer } from '@/components/footer';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Pricing - CeloFlow',
  description: 'Simple and transparent pricing for CeloFlow real-time salary streaming',
};

export default function Pricing() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-[#cccccc] text-lg max-w-2xl mx-auto">
            No hidden fees. Only pay for what you use. Get started free.
          </p>
        </div>
      </header>

      {/* Pricing Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {/* Core Pricing */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Stream with Confidence</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Employer Tier */}
            <div className="border border-[#1a1a1a] rounded-lg p-8 bg-[#0a0a0a] hover:border-[#FFD600]/30 transition-colors">
              <h3 className="text-2xl font-bold mb-2">For Employers</h3>
              <p className="text-[#cccccc] mb-6">Create salary streams</p>

              <div className="mb-8">
                <div className="text-4xl font-bold text-[#FFD600] mb-2">Free</div>
                <p className="text-[#999999] text-sm">+ blockchain gas fees only</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Unlimited salary streams',
                  'Any amount, any duration',
                  'Global employee payments',
                  'Real-time dashboard',
                  'Dispute resolution',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#FFD600] flex-shrink-0" />
                    <span className="text-[#cccccc]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold">
                Start Streaming
              </Button>
            </div>

            {/* Employee Tier */}
            <div className="border-2 border-[#FFD600] rounded-lg p-8 bg-[#0a0a0a] relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FFD600] text-black px-4 py-1 rounded font-bold text-sm">
                Most Popular
              </div>

              <h3 className="text-2xl font-bold mb-2">For Employees</h3>
              <p className="text-[#cccccc] mb-6">Receive & withdraw salary</p>

              <div className="mb-8">
                <div className="text-4xl font-bold text-[#FFD600] mb-2">Free</div>
                <p className="text-[#999999] text-sm">+ blockchain gas fees only</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Unlimited salary streams',
                  'Instant withdrawals',
                  'Real-time earnings tracking',
                  'Mobile-first experience',
                  'Transparent transactions',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#FFD600] flex-shrink-0" />
                    <span className="text-[#cccccc]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold">
                Get Wallet
              </Button>
            </div>

            {/* Enterprise */}
            <div className="border border-[#1a1a1a] rounded-lg p-8 bg-[#0a0a0a] hover:border-[#FFD600]/30 transition-colors">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-[#cccccc] mb-6">Custom solutions</p>

              <div className="mb-8">
                <div className="text-4xl font-bold text-[#FFD600] mb-2">Custom</div>
                <p className="text-[#999999] text-sm">Contact our sales team</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Custom integrations',
                  'Priority support',
                  'Bulk operations',
                  'White-label options',
                  'Advanced analytics',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#FFD600] flex-shrink-0" />
                    <span className="text-[#cccccc]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant="outline" className="w-full border-[#1a1a1a] hover:bg-[#0a0a0a]">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>

        {/* Fee Breakdown */}
        <section className="mt-20 pt-16 border-t border-[#1a1a1a]">
          <h2 className="text-3xl font-bold mb-8 text-center">Fee Breakdown</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-center">
              <h4 className="font-bold text-lg mb-2">CeloFlow Fees</h4>
              <p className="text-[#FFD600] text-3xl font-bold">$0</p>
              <p className="text-[#cccccc] text-sm mt-2">
                CeloFlow charges no platform fees
              </p>
            </div>

            <div className="p-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-center">
              <h4 className="font-bold text-lg mb-2">Gas Fees</h4>
              <p className="text-[#FFD600] text-3xl font-bold">&lt;$0.01</p>
              <p className="text-[#cccccc] text-sm mt-2">
                Minimal blockchain transaction fees
              </p>
            </div>

            <div className="p-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-center">
              <h4 className="font-bold text-lg mb-2">Hidden Fees</h4>
              <p className="text-[#FFD600] text-3xl font-bold">None</p>
              <p className="text-[#cccccc] text-sm mt-2">
                Complete transparency guaranteed
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-20 pt-16 border-t border-[#1a1a1a]">
          <h2 className="text-3xl font-bold mb-8 text-center">Pricing Questions</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <details className="group border border-[#1a1a1a] rounded-lg p-6 bg-[#0a0a0a] cursor-pointer hover:border-[#FFD600]/30 transition-colors">
              <summary className="font-bold text-lg">What are gas fees?</summary>
              <p className="text-[#cccccc] mt-4">
                Gas fees are minimal blockchain transaction costs. Since Celo is highly efficient, they're typically under $0.01 per transaction - much cheaper than traditional banking.
              </p>
            </details>

            <details className="group border border-[#1a1a1a] rounded-lg p-6 bg-[#0a0a0a] cursor-pointer hover:border-[#FFD600]/30 transition-colors">
              <summary className="font-bold text-lg">Is there a minimum payment?</summary>
              <p className="text-[#cccccc] mt-4">
                No minimum. You can stream any amount starting from $1. Scale up as your business grows.
              </p>
            </details>

            <details className="group border border-[#1a1a1a] rounded-lg p-6 bg-[#0a0a0a] cursor-pointer hover:border-[#FFD600]/30 transition-colors">
              <summary className="font-bold text-lg">Do you charge for withdrawals?</summary>
              <p className="text-[#cccccc] mt-4">
                No. We don't charge for withdrawals. You only pay blockchain gas fees, which are minimal on Celo.
              </p>
            </details>

            <details className="group border border-[#1a1a1a] rounded-lg p-6 bg-[#0a0a0a] cursor-pointer hover:border-[#FFD600]/30 transition-colors">
              <summary className="font-bold text-lg">What about future premium features?</summary>
              <p className="text-[#cccccc] mt-4">
                We may introduce optional premium features in the future (e.g., advanced analytics, custom integrations). Core functionality will always be free.
              </p>
            </details>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-20 pt-16 border-t border-[#1a1a1a] text-center">
          <h2 className="text-4xl font-bold mb-6">Get started for free today</h2>
          <p className="text-[#cccccc] mb-8 max-w-2xl mx-auto">
            No credit card required. No hidden fees. Join thousands using CeloFlow for real-time salary streaming.
          </p>
          <a
            href="/"
            className="inline-block px-8 py-4 bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold rounded-lg transition-colors text-lg"
          >
            Connect Your Wallet
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
