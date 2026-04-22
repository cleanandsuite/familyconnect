import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Sparkles as SparklesCanvas } from "@/components/Sparkles";
import {
  GitFork,
  Image,
  Users,
  Heart,
  Star,
  ArrowRight,
  TreePine,
  BookOpen,
  Crown,
  Play,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: "easeOut" as const },
  }),
};

export default function Home() {
  const navigate = useNavigate();

  const handleWatchStory = () => {
    localStorage.removeItem("lauj-story-seen");
    navigate("/story");
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/story-chapter2.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#faf7f2]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        <SparklesCanvas />

        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <span className="text-white/90 text-sm font-medium tracking-widest uppercase" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                The Legend of the Tree of Life
              </span>
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-playfair text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-4"
            style={{ textShadow: '0 4px 12px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)' }}
          >
            The Lauj Puab
            <br />
            <span className="text-amber-300" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)' }}>Yib Family</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg sm:text-xl max-w-2xl mb-8 font-light text-white"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)' }}
          >
            Every branch tells a story. Every root holds a memory.
            <br className="hidden sm:block" />
            Discover how we are all connected beneath the Tree of Life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWatchStory}
              className="flex items-center gap-2 px-8 py-4 bg-amber-500 text-[#1e3a5f] rounded-full font-semibold shadow-xl hover:shadow-2xl hover:bg-amber-400 transition-all"
            >
              <Play className="h-5 w-5" />
              Watch Our Story
            </motion.button>
            <Link to="/tree">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 bg-white/90 backdrop-blur-sm text-[#1e3a5f] rounded-full font-semibold shadow-xl hover:shadow-2xl transition-shadow"
              >
                <TreePine className="h-5 w-5" />
                Explore Our Tree
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </Link>
          </motion.div>

          {/* Family Motto */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 flex items-center gap-3 text-white/80 text-sm px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full"
          >
            <Heart className="h-3 w-3 text-rose-400 fill-rose-400" />
            <span className="italic font-playfair">
              "Rooted in love, connected forever"
            </span>
            <Heart className="h-3 w-3 text-rose-400 fill-rose-400" />
          </motion.div>
        </div>
      </section>

      {/* The Story Preview Section */}
      <section className="py-24 px-4 bg-[#1e3a5f] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("/story-chapter3.jpg")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(20px)",
            }}
          />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            custom={0}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-medium text-amber-400 tracking-widest uppercase">
                Our Legend
              </span>
            </div>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-4">
              The Tree of Life
            </h2>
            <p className="text-white/70 max-w-xl mx-auto text-lg">
              A magical story of how the Lauj Puab Yib family came to be,
              and how every branch connects us all.
            </p>
          </motion.div>

          {/* Story Chapter Preview Cards */}
          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {[
              { img: "/story-chapter1.jpg", title: "The Beginning", num: "I" },
              { img: "/story-chapter2.jpg", title: "The Tree of Life", num: "II" },
              { img: "/story-chapter3.jpg", title: "The Branches", num: "III" },
              { img: "/story-chapter4.jpg", title: "The Lauj Puab Yib", num: "IV" },
              { img: "/story-chapter5.jpg", title: "Your Place", num: "V" },
            ].map((ch, i) => (
              <motion.div
                key={ch.title}
                custom={i + 1}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative group cursor-pointer"
                onClick={handleWatchStory}
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={ch.img}
                    alt={ch.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-2xl font-playfair font-bold text-amber-400/80">
                      {ch.num}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-playfair text-sm font-semibold text-white">
                      {ch.title}
                    </p>
                  </div>
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                      <Play className="h-4 w-4 text-[#1e3a5f] ml-0.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            custom={6}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWatchStory}
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-[#1e3a5f] rounded-full font-semibold hover:bg-amber-400 transition-colors shadow-lg"
            >
              <BookOpen className="h-5 w-5" />
              Read the Full Story
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            custom={0}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Crown className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-[#d4a574] tracking-widest uppercase">
                Discover
              </span>
            </div>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-[#1e3a5f] mb-4">
              Our Family Story
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              A place where generations meet, memories live on, and love
              continues to grow beneath the Tree of Life.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: GitFork,
                title: "Family Tree",
                description:
                  "Explore our interconnected family tree. See how each branch connects and discover your place in our Lauj Puab Yib story.",
                color: "bg-emerald-50 text-emerald-700",
                link: "/tree",
                image: "/family-tree-hero.jpg",
              },
              {
                icon: Image,
                title: "Photo Gallery",
                description:
                  "Browse through cherished family photos. Upload new memories and preserve our history for generations to come.",
                color: "bg-amber-50 text-amber-700",
                link: "/gallery",
                image: "/gallery-hero.jpg",
              },
              {
                icon: Users,
                title: "Directory",
                description:
                  "Find contact information for all Lauj Puab Yib family members. Keep in touch and stay connected with loved ones.",
                color: "bg-rose-50 text-rose-700",
                link: "/directory",
                image: "/family-reunion.jpg",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  custom={i + 1}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Link to={feature.link}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-amber-50"
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4 ${feature.color}`}
                        >
                          <Icon className="h-4 w-4" />
                          {feature.title}
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-[#1e3a5f] font-medium text-sm group">
                          Explore
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/story-chapter4.jpg"
            alt="Family"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1e3a5f]/85" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <Heart className="h-12 w-12 text-rose-400 fill-rose-400 mx-auto mb-6" />
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-6 italic leading-relaxed">
            "Like the branches of a tree, we all grow in different directions,
            yet our roots remain as one."
          </h2>
          <p className="text-amber-400 text-lg font-playfair">
            — The Lauj Puab Yib Family
          </p>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <img
              src="/story-chapter5.jpg"
              alt="Join Us"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/90 to-[#1e3a5f]/50 flex items-center">
              <div className="px-8 sm:px-12">
                <h3 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-4">
                  Add Your Branch
                </h3>
                <p className="text-white/80 mb-6 max-w-md">
                  Every family member has a unique place in our tree. Add your
                  story, share your photos, and keep the Lauj Puab Yib legacy growing.
                </p>
                <Link to="/tree">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-[#1e3a5f] rounded-full font-semibold hover:bg-amber-300 transition-colors"
                  >
                    <TreePine className="h-5 w-5" />
                    Explore the Family Tree
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e3a5f] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TreePine className="h-5 w-5 text-amber-400" />
              <span className="font-playfair text-lg font-semibold">
                The Lauj Puab Yib Family
              </span>
            </div>
            <p className="text-white/60 text-sm italic font-playfair">
              Rooted in love, connected forever.
            </p>
            <button
              onClick={handleWatchStory}
              className="flex items-center gap-1 text-amber-400/80 hover:text-amber-400 text-sm transition-colors"
            >
              <BookOpen className="h-3 w-3" />
              Replay Our Story
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
