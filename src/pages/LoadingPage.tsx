import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { TreePine, Sparkles, Heart } from "lucide-react";

export default function LoadingPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3500;
    const interval = 50;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      setProgress(Math.min((current / steps) * 100, 100));
      if (current >= steps) {
        clearInterval(timer);
        navigate("/tree");
      }
    }, interval);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#1e3a5f] relative overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/story-chapter2.jpg"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[#1e3a5f]/70" />
      </div>

      {/* Glow */}
      <div className="absolute w-64 h-64 rounded-full bg-amber-500/15 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* Rotating Tree Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute w-28 h-28 rounded-full border-2 border-dashed border-amber-400/25"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute w-20 h-20 rounded-full border border-amber-400/15"
          />
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/25"
          >
            <TreePine className="h-8 w-8 text-[#1e3a5f]" />
          </motion.div>
        </div>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span className="text-amber-400/80 text-xs tracking-widest uppercase font-medium">
              The Lauj Puab Yib Family
            </span>
            <Sparkles className="h-3 w-3 text-amber-400" />
          </div>
          <h1
            className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-3"
            style={{ textShadow: "0 4px 12px rgba(0,0,0,0.8)" }}
          >
            Entering the Tree of Life...
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/50 text-xs">
            <Heart className="h-3 w-3 text-rose-400 fill-rose-400" />
            <span>Connecting you to your roots</span>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mt-8 max-w-xs mx-auto">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all"
              style={{ width: `${progress}%`, transitionDuration: "50ms" }}
            />
          </div>
          <p className="text-white/25 text-[10px] mt-2">{Math.round(progress)}%</p>
        </div>

        <p className="mt-10 text-white/20 text-xs italic font-playfair">
          "Rooted in love, connected forever"
        </p>
      </div>
    </div>
  );
}
