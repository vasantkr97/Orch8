import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Code, Zap, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-lime-500/30 selection:text-lime-500 font-sans">
      
      <Navbar />

      {/* Hero Section - Text Only */}
      <section className="relative pt-32 pb-20 lg:pt-48 flex flex-col justify-center items-center overflow-hidden">
        {/* Focused Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-lime-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10 w-full mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
             {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-lime-400 mb-6 hover:bg-white/10 transition-colors cursor-default">
              <Sparkles className="w-3 h-3" />
              <span>Orch8 v2.0</span>
            </div>
           
            {/* Headline */}
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tighter text-white mb-6 leading-[0.9]">
              AI-Native <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                Automation
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-normal font-medium text-balance">
              The high-performance workflow engine for AI agents. <br className="hidden md:block"/> Connect LLMs, APIs, and data in a visual fair-code environment.
            </p>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-3.5 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Start for free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-lg border border-zinc-800 transition-all flex items-center justify-center gap-2"
              >
                View Documentation
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Preview Section - Separated & Elevated */}
      <section className="relative pb-32 px-6">
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-6xl"
          >
            {/* Elevation Glow - focused underneath */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[95%] bg-lime-500/10 blur-[80px] -z-10 rounded-full opacity-60"></div>

            <motion.div 
               whileHover={{ scale: 1.01 }}
               transition={{ duration: 0.5 }}
               className="relative rounded-xl bg-[#0A0A0A] border border-white/10 p-2 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] ring-1 ring-white/5 overflow-hidden"
            >
                {/* Window Controls */}
                <div className="h-10 bg-[#0F0F0F] border-b border-white/5 rounded-t-lg flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
                    {/* Add a fake URL bar for realism */}
                    <div className="ml-4 h-6 w-64 bg-black/50 rounded flex items-center px-3 text-[10px] text-gray-600 font-mono">
                        orch8.app/workflow/editor
                    </div>
                </div>

                {/* Content */}
                <div className="relative">
                     {/* Scanline Effect - retained but subtle */}
                    <motion.div 
                        initial={{ top: "-100%" }}
                        animate={{ top: "200%" }}
                        transition={{ duration: 4, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
                        className="absolute left-0 right-0 h-48 bg-gradient-to-b from-transparent via-white/5 to-transparent z-10 pointer-events-none mix-blend-overlay"
                    />
                    
                    <img 
                        src="/Screenshot (10).png" 
                        alt="Orch8 Workflow Canvas" 
                        className="w-full h-auto rounded-b-lg opacity-100 block"
                    />
                </div>
            </motion.div>
        </motion.div>
      </section>

      {/* Trusted By - Minimal */}
      <section className="py-10 border-y border-white/5 bg-zinc-900/30 backdrop-blur-sm">
         <div className="max-w-7xl mx-auto px-6 flex justify-center gap-12 sm:gap-20 grayscale opacity-40">
             {/* Simple Text Logos for minimalism */}
             <span className="font-bold text-lg font-logo tracking-wider">ACME</span>
             <span className="font-bold text-lg font-logo tracking-wider">ORBITAL</span>
             <span className="font-bold text-lg font-logo tracking-wider">NEXUS</span>
             <span className="font-bold text-lg font-logo tracking-wider">STRATA</span>
             <span className="font-bold text-lg font-logo tracking-wider hidden sm:block">QUANTUM</span>
         </div>
      </section>

      {/* Features - Dense & Animated */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 md:text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to <span className="text-lime-400">scale</span></h2>
                <p className="text-gray-400">Stop stitching together disparate tools. Orch8 gives you a unified control plane for your entire AI workforce.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-xl bg-zinc-900/20 border border-white/5 hover:border-lime-500/20 hover:bg-zinc-900/40 transition-all group cursor-default"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        <div className="h-10 w-10 rounded-lg bg-zinc-900 flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <feature.icon className="w-5 h-5 text-lime-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Footer - Compact */}
      <footer className="py-8 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-zinc-500 text-xs">
            <p>© 2026 Orch8 Inc.</p>
            <div className="flex gap-6 mt-2 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
            </div>
        </div>
       </footer>

    </div>
  );
}

const features = [
    {
        icon: Bot,
        title: "AI-Native Nodes",
        description: "First-class support for LLMs (GPT-4, Gemini, Claude). Chain prompts, handle context, and manage embeddings natively."
    },
    {
        icon: Zap,
        title: "Sub-ms Latency",
        description: "Built on a high-performance Rust execution engine. Run thousands of concurrent workflows with minimal overhead."
    },
    {
        icon: Code,
        title: "TypeScript Functions",
        description: "Escape the limits of no-code. Write custom TypeScript functions with full IntelliSense and npm package support."
    }
];
