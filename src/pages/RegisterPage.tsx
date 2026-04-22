import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { motion, AnimatePresence } from "framer-motion";
import {
  TreePine,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Camera,
  Upload,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Heart,
  Loader2,
} from "lucide-react";
// import confetti from "canvas-confetti";

type Step = "personal" | "contact" | "success";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("personal");
  const [direction, setDirection] = useState(1);

  // Personal info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [maidenName, setMaidenName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [generation, setGeneration] = useState(1);

  // Contact info
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const createMember = trpc.family.create.useMutation();
  const createContact = trpc.contact.create.useMutation();
  const utils = trpc.useUtils();

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const goNext = () => {
    setDirection(1);
    setStep("contact");
  };

  const goBack = () => {
    setDirection(-1);
    setStep("personal");
  };

  const handleSubmit = async () => {
    // Create family member
    const member = await createMember.mutateAsync({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      maidenName: maidenName.trim() || undefined,
      birthDate: birthDate || undefined,
      bio: bio.trim() || undefined,
      avatar: avatar || undefined,
      generation,
    });

    // Create contact info
    if (email || phone || address) {
      await createContact.mutateAsync({
        memberId: member.id,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        zipCode: zipCode.trim() || undefined,
        country: country.trim() || undefined,
      });
    }

    // Invalidate queries
    utils.family.list.invalidate();
    utils.contact.list.invalidate();

    // Success
    setStep("success");

    // Redirect to loading page after 2 seconds
    setTimeout(() => {
      navigate("/loading");
    }, 2500);
  };

  const isPersonalValid = firstName.trim() && lastName.trim();

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] pt-16">
      {/* Header */}
      <div className="relative h-48 overflow-hidden">
        <img
          src="/story-chapter5.jpg"
          alt="Join Us"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#faf7f2] via-[#faf7f2]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <TreePine className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium text-[#d4a574] tracking-widest uppercase">
                Join the Family
              </span>
            </div>
            <h1 className="font-playfair text-3xl font-bold text-[#1e3a5f]">
              Add Your Branch
            </h1>
            <p className="text-slate-600 mt-1 text-sm">
              Register yourself on the Lauj Puab Yib family tree
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-2xl mx-auto px-4 mt-6">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              step === "personal"
                ? "bg-[#1e3a5f] text-white"
                : step === "contact" || step === "success"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
            }`}
          >
            {step === "contact" || step === "success" ? (
              <Check className="h-4 w-4" />
            ) : (
              <User className="h-4 w-4" />
            )}
            About You
          </div>
          <div className="flex-1 h-0.5 bg-amber-100">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: "0%" }}
              animate={{
                width:
                  step === "personal"
                    ? "0%"
                    : step === "contact"
                      ? "50%"
                      : "100%",
              }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              step === "contact"
                ? "bg-[#1e3a5f] text-white"
                : step === "success"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
            }`}
          >
            {step === "success" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            Contact Info
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait" custom={direction}>
          {step === "personal" && (
            <motion.div
              key="personal"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Avatar Upload */}
              <div className="flex justify-center">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2a5f9e] flex items-center justify-center cursor-pointer hover:shadow-xl transition-shadow border-4 border-white shadow-lg overflow-hidden group"
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-8 w-8 text-white/80" />
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
              </div>
              <p className="text-center text-xs text-slate-400 -mt-4">
                Tap to add your photo
              </p>

              {/* Name Fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your first name"
                    className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition-all text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Your family name"
                    className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition-all text-sm bg-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Maiden Name
                  </label>
                  <input
                    type="text"
                    value={maidenName}
                    onChange={(e) => setMaidenName(e.target.value)}
                    placeholder="If applicable"
                    className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition-all text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#d4a574]" />
                      Birth Date
                    </div>
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition-all text-sm bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Generation
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[0, 1, 2, 3, 4, 5].map((gen) => (
                    <button
                      key={gen}
                      onClick={() => setGeneration(gen)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        generation === gen
                          ? "bg-[#1e3a5f] text-white shadow-md"
                          : "bg-white text-slate-600 hover:bg-amber-50 border border-amber-200"
                      }`}
                    >
                      Gen {gen}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-[#d4a574]" />
                    Your Story
                  </div>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a little about yourself - your passions, your dreams, what makes you YOU..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition-all text-sm bg-white resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goNext}
                disabled={!isPersonalValid}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1e3a5f] text-white rounded-xl font-semibold hover:bg-[#2a4f7f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          )}

          {step === "contact" && (
            <motion.div
              key="contact"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-[#d4a574]" />
                    Email
                  </div>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition-all text-sm bg-white"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-emerald-500" />
                    Phone
                  </div>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition-all text-sm bg-white"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-rose-400" />
                    Address
                  </div>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address"
                  className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition-all text-sm bg-white"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition-all text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="ST"
                    className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition-all text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Zip
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="00000"
                    className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition-all text-sm bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                  className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition-all text-sm bg-white"
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goBack}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white text-[#1e3a5f] rounded-xl font-semibold border border-amber-200 hover:bg-amber-50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={createMember.isPending}
                  className="flex-[2] flex items-center justify-center gap-2 py-3.5 bg-[#1e3a5f] text-white rounded-xl font-semibold hover:bg-[#2a4f7f] transition-colors disabled:opacity-50 shadow-lg"
                >
                  {createMember.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Add Me to the Tree
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6"
              >
                <TreePine className="h-10 w-10 text-emerald-600" />
              </motion.div>
              <h2 className="font-playfair text-3xl font-bold text-[#1e3a5f] mb-3">
                Welcome to the Tree!
              </h2>
              <p className="text-slate-600 mb-2">
                {firstName} {lastName}, your branch has been added to the
                Lauj Puab Yib family tree.
              </p>
              <div className="flex items-center justify-center gap-2 text-amber-600 text-sm">
                <Heart className="h-4 w-4 fill-rose-400 text-rose-400" />
                <span>Redirecting you to our family tree...</span>
                <Heart className="h-4 w-4 fill-rose-400 text-rose-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
