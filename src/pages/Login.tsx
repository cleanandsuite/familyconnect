import { motion } from "framer-motion";
import { LogIn, TreePine, Star, Heart } from "lucide-react";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3a5f' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-100">
          {/* Header */}
          <div className="relative h-40 bg-gradient-to-br from-[#1e3a5f] to-[#2a5f9e] flex items-center justify-center">
            <div className="absolute top-4 left-4">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400 opacity-60" />
            </div>
            <div className="absolute top-8 right-8">
              <Heart className="h-3 w-3 text-rose-300 fill-rose-300 opacity-60" />
            </div>
            <div className="absolute bottom-6 left-8">
              <Star className="h-3 w-3 text-amber-300 fill-amber-300 opacity-40" />
            </div>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3"
              >
                <TreePine className="h-8 w-8 text-emerald-400" />
              </motion.div>
              <h1 className="font-playfair text-2xl font-bold text-white">
                The Lauj Puab Yib
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            <p className="text-slate-600 mb-8">
              Sign in to discover your place in the Tree of Life, explore the
              Lauj Puab Yib family story, and connect with your loved ones.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                window.location.href = getOAuthUrl();
              }}
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-[#1e3a5f] text-white rounded-xl font-semibold hover:bg-[#2a4f7f] transition-colors shadow-lg"
            >
              <LogIn className="h-5 w-5" />
              Sign in with Kimi
            </motion.button>

            <p className="mt-6 text-xs text-slate-400">
              Secure login powered by Kimi OAuth
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center gap-2 mt-6">
          <Star className="h-3 w-3 text-amber-400 fill-amber-400 opacity-40" />
          <Heart className="h-3 w-3 text-rose-400 fill-rose-400 opacity-40" />
          <Star className="h-3 w-3 text-amber-400 fill-amber-400 opacity-40" />
        </div>
      </motion.div>
    </div>
  );
}
