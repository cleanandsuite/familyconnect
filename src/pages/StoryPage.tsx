import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  SkipForward,
  Sparkles,
  TreePine,
  Heart,
  Star,
  BookOpen,
} from "lucide-react";

interface Chapter {
  image: string;
  title: string;
  lines: string[];
  accent: string;
}

const chapters: Chapter[] = [
  {
    image: "/story-chapter1.jpg",
    title: "The Beginning",
    accent: "from-amber-900/70 to-amber-950/90",
    lines: [
      "Long ago, before the stars learned their names,",
      "a single seed of golden light descended from the heavens.",
      "It traveled through clouds of lavender and rose,",
      "past moons that hummed lullabies to sleeping rivers,",
      "until it found a place where the earth whispered 'welcome'.",
      "There, in the heart of an ancient forest,",
      "the seed settled into the warm soil...",
      "and waited for love to make it grow.",
    ],
  },
  {
    image: "/story-chapter2.jpg",
    title: "The Tree of Life",
    accent: "from-emerald-900/60 to-emerald-950/85",
    lines: [
      "From that seed grew the Tree of Life —",
      "a tree unlike any other in all the world.",
      "Its trunk was woven with hearts carved by time,",
      "its roots drank from springs of memory,",
      "and its branches reached toward the sky",
      "like open arms ready to embrace every soul",
      "who would come to rest beneath its leaves.",
      "The tree glowed with a light that never faded,",
      "for it was powered by the love of families",
      "who found their way to its shelter.",
    ],
  },
  {
    image: "/story-chapter3.jpg",
    title: "The Branches",
    accent: "from-indigo-900/70 to-indigo-950/90",
    lines: [
      "Every branch of the Tree holds a story.",
      "Some branches are strong and ancient,",
      "holding the wisdom of grandparents who came before.",
      "Some are new and tender,",
      "reaching out with the curiosity of children.",
      "But here is the magic —",
      "golden threads of light connect every branch to every other,",
      "forming a web so intricate and beautiful",
      "that no story exists alone.",
      "When one branch laughs, the whole tree shimmers.",
      "When one branch weeps, the others hold it close.",
      "This is the truth of family:",
      "we are separate, yet we are one.",
    ],
  },
  {
    image: "/story-chapter4.jpg",
    title: "The Lauj Puab Yib",
    accent: "from-rose-900/60 to-rose-950/85",
    lines: [
      "We are the Lauj Puab Yib —",
      "a family whose roots run deep and wide,",
      "whose branches stretch across mountains and rivers,",
      "across oceans and generations.",
      "Our ancestors gathered beneath this tree,",
      "hands joined, hearts open, voices lifted in song.",
      "They taught us that family is not just blood —",
      "it is the choice to show up, to remember, to love.",
      "From the eldest elder to the newest babe,",
      "each of us carries a spark of that first golden seed.",
      "And when we come together,",
      "the Tree of Life shines brighter than a thousand suns.",
    ],
  },
  {
    image: "/story-chapter5.jpg",
    title: "Your Place in the Story",
    accent: "from-amber-800/60 to-amber-950/85",
    lines: [
      "And now, dear one, it is your turn.",
      "A branch awaits you — glowing, warm, ready.",
      "Your story is a thread in this grand tapestry,",
      "your laughter a note in our family song.",
      "Add your name. Share your memories.",
      "Upload the photos that make your heart smile.",
      "Connect yourself to the ones who came before,",
      "and the ones who will come after.",
      "For the Tree of Life grows stronger",
      "with every story told,",
      "with every love shared,",
      "with every heart that finds its way home.",
      "Welcome to the Lauj Puab Yib.",
      "Welcome to your story.",
    ],
  },
];

function TypewriterText({
  lines,
  isActive,
}: {
  lines: string[];
  isActive: boolean;
}) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    setVisibleLines(0);
    setVisibleChars(0);
  }, [lines]);

  useEffect(() => {
    if (!isActive) return;
    if (visibleLines >= lines.length) return;

    const currentLine = lines[visibleLines];
    if (visibleChars < currentLine.length) {
      const timer = setTimeout(() => setVisibleChars((c) => c + 1), 30);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setVisibleLines((l) => l + 1);
        setVisibleChars(0);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isActive, visibleLines, visibleChars, lines]);

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (i > visibleLines) return null;
        const displayText =
          i === visibleLines ? line.slice(0, visibleChars) : line;
        return (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg sm:text-xl md:text-2xl font-playfair leading-relaxed text-white/95"
          >
            {displayText}
            {i === visibleLines && (
              <span className="inline-block w-0.5 h-6 bg-amber-400 ml-1 animate-pulse" />
            )}
          </motion.p>
        );
      })}
    </div>
  );
}

function FloatingParticle({
  delay,
  x,
}: {
  delay: number;
  x: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, x }}
      animate={{
        opacity: [0, 0.8, 0],
        y: -200,
        x: x + Math.random() * 100 - 50,
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
      className="absolute bottom-0 w-1 h-1 rounded-full bg-amber-300"
      style={{ left: `${x}%` }}
    />
  );
}

export default function StoryPage() {
  const navigate = useNavigate();
  const [currentChapter, setCurrentChapter] = useState(0);
  const [direction, setDirection] = useState(1);
  const [storyComplete, setStoryComplete] = useState(false);

  const chapter = chapters[currentChapter];
  const isLastChapter = currentChapter === chapters.length - 1;

  const goNext = useCallback(() => {
    if (isLastChapter) {
      localStorage.setItem("lauj-story-seen", "true");
      setStoryComplete(true);
      setTimeout(() => navigate("/loading"), 800);
    } else {
      setDirection(1);
      setCurrentChapter((c) => c + 1);
    }
  }, [isLastChapter, navigate]);

  const goPrev = () => {
    if (currentChapter > 0) {
      setDirection(-1);
      setCurrentChapter((c) => c - 1);
    }
  };

  const skipStory = () => {
    localStorage.setItem("lauj-story-seen", "true");
    navigate("/tree");
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") skipStory();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Background Image */}
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={currentChapter}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img
            src={chapter.image}
            alt={chapter.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${chapter.accent} via-black/40 to-transparent`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.5} x={Math.random() * 100} />
        ))}
      </div>

      {/* Skip Button - Always Available */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        onClick={skipStory}
        className="absolute top-6 right-6 z-30 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all text-sm font-medium border border-white/10"
      >
        <SkipForward className="h-4 w-4" />
        Skip Story
      </motion.button>

      {/* Chapter Title Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 left-6 z-30 flex items-center gap-2"
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 border border-white/10">
          <BookOpen className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium">
            Chapter {currentChapter + 1} of {chapters.length}
          </span>
        </div>
      </motion.div>

      {/* Progress Dots */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {chapters.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > currentChapter ? 1 : -1);
              setCurrentChapter(i);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentChapter
                ? "w-8 bg-amber-400"
                : i < currentChapter
                  ? "w-2 bg-white/60"
                  : "w-2 bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Story Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="max-w-3xl px-8 sm:px-16 py-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Chapter Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 flex items-center gap-3"
              >
                <Sparkles className="h-6 w-6 text-amber-400" />
                <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-amber-300">
                  {chapter.title}
                </h2>
              </motion.div>

              {/* Story Text */}
              <TypewriterText
                lines={chapter.lines}
                isActive={true}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-30 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goPrev}
            disabled={currentChapter === 0}
            className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Previous</span>
          </motion.button>

          {/* Center Message */}
          <div className="hidden sm:flex items-center gap-2 text-white/50 text-sm">
            <Star className="h-3 w-3" />
            The Legend of the Lauj Puab Yib
            <Star className="h-3 w-3" />
          </div>

          {/* Next / Begin Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goNext}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all shadow-lg ${
              isLastChapter
                ? "bg-amber-500 text-[#1e3a5f] hover:bg-amber-400"
                : "bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border border-white/10"
            }`}
          >
            {isLastChapter ? (
              <>
                <TreePine className="h-5 w-5" />
                <span>Enter Our Tree</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Completion Overlay */}
      <AnimatePresence>
        {storyComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="h-16 w-16 text-rose-400 fill-rose-400 mx-auto mb-4" />
              </motion.div>
              <h2 className="font-playfair text-3xl font-bold text-white mb-2">
                Welcome Home
              </h2>
              <p className="text-white/60">
                Entering the Lauj Puab Yib Family Tree...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-white/40 text-xs">
        Press ← → to navigate · ESC to skip
      </div>
    </div>
  );
}
