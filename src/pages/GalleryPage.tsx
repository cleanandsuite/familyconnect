import { useState, useRef } from "react";
import { trpc } from "@/providers/trpc";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  X,
  Loader2,
  ImageIcon,
} from "lucide-react";

export default function GalleryPage() {
  const { data: photos, isLoading } = trpc.photos.list.useQuery();
  const utils = trpc.useUtils();
  const createPhoto = trpc.photos.create.useMutation({
    onSuccess: () => {
      utils.photos.list.invalidate();
      setUploadOpen(false);
      setPreviewUrl(null);
      setTitle("");
      setDescription("");
    },
  });

  const [uploadOpen, setUploadOpen] = useState(false);
  interface PhotoDisplay {
    url: string;
    title: string;
    desc: string | null;
    date: Date;
  }
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoDisplay | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!previewUrl || !title.trim()) return;
    createPhoto.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      url: previewUrl,
      thumbnailUrl: previewUrl,
    });
  };

  const samplePhotos = [
    { url: "/hero-castle.jpg", title: "Family Castle", desc: "Our magical family gathering place" },
    { url: "/family-tree-hero.jpg", title: "The Family Tree", desc: "Our roots run deep" },
    { url: "/family-reunion.jpg", title: "Summer Reunion 2024", desc: "All together again" },
    { url: "/gallery-hero.jpg", title: "Memory Book", desc: "Pages of cherished moments" },
  ];

  const displayPhotos = photos && photos.length > 0 ? photos.map(p => ({ url: p.url, title: p.title, desc: p.description, date: p.createdAt })) : samplePhotos.map(p => ({ url: p.url, title: p.title, desc: p.desc, date: new Date() }));

  return (
    <div className="min-h-screen bg-[#faf7f2] pt-16">
      {/* Header */}
      <div className="relative h-72 overflow-hidden">
        <img
          src="/gallery-hero.jpg"
          alt="Gallery"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#faf7f2] via-[#faf7f2]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-[#d4a574] tracking-widest uppercase">
                Memories
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="font-playfair text-4xl font-bold text-[#1e3a5f]">
                  Photo Gallery
                </h1>
                <p className="text-slate-600 mt-1">
                  Cherished moments and precious memories
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setUploadOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1e3a5f] text-white rounded-full font-medium hover:bg-[#2a4f7f] transition-colors shadow-lg"
              >
                <Upload className="h-4 w-4" />
                Upload Photo
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#d4a574]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayPhotos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="font-semibold text-sm truncate">{photo.title}</p>
                    {photo.desc && (
                      <p className="text-xs text-white/80 truncate">{photo.desc}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setUploadOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-amber-100">
                <h3 className="font-playfair text-lg font-bold text-[#1e3a5f]">
                  Upload Photo
                </h3>
                <button
                  onClick={() => setUploadOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {/* File Input */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-amber-200 rounded-xl p-6 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-40 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-amber-50 rounded-full">
                        <ImageIcon className="h-6 w-6 text-[#d4a574]" />
                      </div>
                      <p className="text-sm text-slate-600">
                        Click to select a photo
                      </p>
                      <p className="text-xs text-slate-400">
                        JPG, PNG up to 10MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your photo a title"
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition-all text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's the story behind this photo?"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition-all text-sm resize-none"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpload}
                  disabled={!previewUrl || !title.trim() || createPhoto.isPending}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1e3a5f] text-white rounded-xl font-medium hover:bg-[#2a4f7f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createPhoto.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Upload Photo
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-10 right-0 p-2 text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full max-h-[70vh] object-contain rounded-xl"
              />
              <div className="mt-4 text-center">
                <h3 className="font-playfair text-xl font-bold text-white">
                  {selectedPhoto.title}
                </h3>
                {selectedPhoto.desc && (
                  <p className="text-white/70 mt-1">{selectedPhoto.desc}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
