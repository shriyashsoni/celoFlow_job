'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Zap } from 'lucide-react';
import { Footer } from '@/components/footer';

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-[#1a1a1a] sticky top-0 z-50 bg-black/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFD600] rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-black font-bold" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CeloFlow</span>
          </div>
          <ConnectButton />
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
        <div className="max-w-4xl">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 text-balance">
            Stream Salary.
            <br />
            <span className="text-[#FFD600]">Get Paid Per Second.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#cccccc] mb-8 max-w-2xl leading-relaxed">
            Real-time salary streaming on Celo blockchain. No waiting for payday. Earn and withdraw whenever you want.
          </p>

          <ConnectButton.Custom>
            {({ openConnectModal, mounted, account, chain }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div className="flex flex-col sm:flex-row gap-4">
                  {connected ? (
                    <Button
                      onClick={() => router.push('/dashboard')}
                      size="lg"
                      className="bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold text-lg"
                    >
                      Go to Dashboard
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={openConnectModal}
                      size="lg"
                      className="bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold text-lg"
                    >
                      Connect Wallet
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#1a1a1a] hover:bg-[#0a0a0a] text-white font-bold text-lg"
                    disabled
                  >
                    Learn More
                  </Button>
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-b border-[#1a1a1a]">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#FFD600] mb-2">$0.000042</div>
            <div className="text-[#cccccc]">Earned this second</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">1,234</div>
            <div className="text-[#cccccc]">Active streams</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">$5.2M</div>
            <div className="text-[#cccccc]">Total streamed</div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Why CeloFlow</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Real-Time Streaming',
              description: 'Get paid per second. No more waiting for monthly payday. Your salary streams continuously.',
            },
            {
              title: 'Instant Withdraw',
              description: 'Withdraw any amount anytime. Direct to your wallet. No fees, no delays.',
            },
            {
              title: 'Powered by Celo & MiniPay',
              description: 'Built on blockchain. Secure, transparent, and accessible to everyone with a smartphone.',
            },
          ].map((feature, idx) => (
            <Card key={idx} className="bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#FFD600]/30 transition-colors">
              <CardContent className="pt-8">
                <div className="w-12 h-12 bg-[#FFD600]/10 rounded-lg mb-4 flex items-center justify-center">
                  <div className="w-6 h-6 bg-[#FFD600] rounded" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-[#cccccc]">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-[#1a1a1a]">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to stream your salary?</h2>
          <p className="text-[#cccccc] mb-8 max-w-2xl mx-auto">
            Connect your wallet and start streaming or receiving salary in real-time on Celo.
          </p>
          <ConnectButton.Custom>
            {({ openConnectModal, mounted, account, chain }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return connected ? (
                <Button
                  onClick={() => router.push('/dashboard')}
                  size="lg"
                  className="bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button
                  onClick={openConnectModal}
                  size="lg"
                  className="bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold"
                >
                  Connect Wallet to Get Started
                </Button>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </section>

      <Footer />
    </div>
  );
}
