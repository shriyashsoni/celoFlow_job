import { Footer } from '@/components/footer';
import { ChevronDown } from 'lucide-react';

export const metadata = {
  title: 'FAQ - CeloFlow',
  description: 'Frequently asked questions about CeloFlow real-time salary streaming',
};

export default function FAQ() {
  const faqs = [
    {
      question: 'What is CeloFlow?',
      answer: 'CeloFlow is a real-time salary streaming platform built on Celo blockchain. It allows employers to stream salary payments per second to employees, and employees to withdraw their earnings anytime without waiting for payday.',
    },
    {
      question: 'How does real-time streaming work?',
      answer: 'When an employer creates a salary stream, the amount is divided by the duration in seconds. The employee continuously earns their salary per second, and can withdraw any amount at any time from their accumulated earnings.',
    },
    {
      question: 'What wallet do I need?',
      answer: 'You need a Celo-compatible wallet such as MetaMask, Valora, or MiniPay. We recommend MiniPay for the best mobile experience and maximum accessibility.',
    },
    {
      question: 'What stablecoin is used?',
      answer: 'CeloFlow uses cUSD (Celo USD), a decentralized stablecoin on the Celo blockchain. It maintains a 1:1 peg with the US Dollar, ensuring price stability.',
    },
    {
      question: 'Are there any fees?',
      answer: 'CeloFlow charges minimal transaction fees only for blockchain interactions. Most operations are free. Future versions may include optional premium features.',
    },
    {
      question: 'Can employers cancel streams?',
      answer: 'Yes, employers can cancel a stream and receive a refund of any unstreamed amount. This is smart contract enforced to protect both parties.',
    },
    {
      question: 'Is my data safe?',
      answer: 'All transactions are on the Celo blockchain, which is immutable and transparent. Your private keys control your wallet - CeloFlow never has access to them.',
    },
    {
      question: 'Can I use CeloFlow on mobile?',
      answer: 'Yes! CeloFlow is fully optimized for mobile through MiniPay. You can stream and withdraw salary directly from your phone.',
    },
    {
      question: 'What happens if the network goes down?',
      answer: 'Salary streams are smart contracts on the blockchain. If the network experiences downtime, your streams pause but resume automatically when the network is back online.',
    },
    {
      question: 'How do I withdraw my earnings?',
      answer: 'Simply click the Withdraw button in your Employee Dashboard and choose how much to withdraw. The funds go directly to your connected wallet.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-[#cccccc] text-lg">Everything you need to know about CeloFlow</p>
        </div>
      </header>

      {/* FAQ Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group border border-[#1a1a1a] rounded-lg bg-[#0a0a0a] p-6 hover:border-[#FFD600]/30 transition-colors"
            >
              <summary className="flex items-center justify-between cursor-pointer">
                <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                <ChevronDown className="w-5 h-5 text-[#FFD600] group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-[#cccccc] mt-4 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
          <p className="text-[#cccccc] mb-6">
            Can't find the answer you're looking for? Please reach out to our support team.
          </p>
          <a
            href="mailto:support@celoflow.com"
            className="inline-block px-6 py-3 bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold rounded-lg transition-colors"
          >
            Contact Support
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
