import Link from 'next/link';
import { Footer } from '@/components/footer';
import { ArrowRight, Calendar, User } from 'lucide-react';

export const metadata = {
  title: 'Blog - CeloFlow',
  description: 'Latest updates and insights about real-time salary streaming on Celo',
};

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: 'The Future of Salary: Real-Time Payments',
      excerpt: 'Traditional payday is outdated. Learn why real-time salary streaming is the future of work and financial freedom.',
      date: 'Feb 15, 2024',
      author: 'CeloFlow Team',
      category: 'Insights',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'Getting Started with CeloFlow: A Complete Guide',
      excerpt: 'New to CeloFlow? This step-by-step guide walks you through connecting your wallet, creating streams, and making your first withdrawal.',
      date: 'Feb 10, 2024',
      author: 'Sarah Chen',
      category: 'Tutorial',
      readTime: '8 min read',
    },
    {
      id: 3,
      title: 'Why Celo? Building on Africa\'s Blockchain',
      excerpt: 'Discover why we chose Celo for CeloFlow and how it enables financial inclusion across the globe through mobile-first design.',
      date: 'Feb 5, 2024',
      author: 'Alex Kumar',
      category: 'Technology',
      readTime: '6 min read',
    },
    {
      id: 4,
      title: 'CeloFlow x Web3: Revolutionizing Payroll',
      excerpt: 'Explore how blockchain technology and smart contracts are transforming traditional payroll systems for the better.',
      date: 'Jan 28, 2024',
      author: 'CeloFlow Team',
      category: 'Web3',
      readTime: '7 min read',
    },
    {
      id: 5,
      title: 'Employer Case Study: ABC Company\'s Journey',
      excerpt: 'See how ABC Company reduced payroll complexity by 80% and improved employee satisfaction with CeloFlow streaming.',
      date: 'Jan 20, 2024',
      author: 'Marcus Johnson',
      category: 'Case Study',
      readTime: '6 min read',
    },
    {
      id: 6,
      title: 'Financial Inclusion Through Decentralized Payments',
      excerpt: 'Real-time salary streaming opens doors for millions in emerging markets. Learn how CeloFlow is democratizing finance.',
      date: 'Jan 15, 2024',
      author: 'CeloFlow Team',
      category: 'Impact',
      readTime: '5 min read',
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Insights': 'bg-[#FFD600]/10 text-[#FFD600]',
      'Tutorial': 'bg-blue-500/10 text-blue-400',
      'Technology': 'bg-purple-500/10 text-purple-400',
      'Web3': 'bg-green-500/10 text-green-400',
      'Case Study': 'bg-orange-500/10 text-orange-400',
      'Impact': 'bg-red-500/10 text-red-400',
    };
    return colors[category] || 'bg-[#1a1a1a] text-[#cccccc]';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-5xl font-bold mb-4">CeloFlow Blog</h1>
          <p className="text-[#cccccc] text-lg max-w-2xl">
            Insights, tutorials, and updates about real-time salary streaming and blockchain technology.
          </p>
        </div>
      </header>

      {/* Blog Posts */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group border border-[#1a1a1a] rounded-lg bg-[#0a0a0a] p-6 hover:border-[#FFD600]/30 transition-all hover:shadow-lg hover:shadow-[#FFD600]/10"
            >
              {/* Category */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold mb-3 group-hover:text-[#FFD600] transition-colors">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="text-[#cccccc] mb-6 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-sm text-[#999999] mb-4 pb-4 border-t border-[#1a1a1a]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                </div>
                <span>{post.readTime}</span>
              </div>

              {/* Read More */}
              <a
                href="#"
                className="inline-flex items-center gap-2 text-[#FFD600] hover:gap-4 transition-all font-semibold"
              >
                Read Article
                <ArrowRight className="w-4 h-4" />
              </a>
            </article>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-20 p-12 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-center">
          <h3 className="text-3xl font-bold mb-3">Stay Updated</h3>
          <p className="text-[#cccccc] mb-8 max-w-2xl mx-auto">
            Get the latest articles, insights, and updates delivered to your inbox.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#1a1a1a] text-white rounded-lg placeholder-[#666666] focus:outline-none focus:border-[#FFD600]"
            />
            <button className="px-6 py-3 bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
