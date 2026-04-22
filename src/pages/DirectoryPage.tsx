import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Loader2,
  User,
  Heart,
} from "lucide-react";

export default function DirectoryPage() {
  const { data: members, isLoading: membersLoading } = trpc.family.list.useQuery();
  const { data: contacts } = trpc.contact.list.useQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGen, setSelectedGen] = useState<number | null>(null);

  const filteredMembers = (members || []).filter((m) => {
    const matchesSearch =
      !searchQuery ||
      `${m.firstName} ${m.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesGen = selectedGen === null || m.generation === selectedGen;
    return matchesSearch && matchesGen;
  });

  const generations = Array.from(
    new Set((members || []).map((m) => m.generation)),
  ).sort((a, b) => a - b);

  const getContactForMember = (memberId: number) => {
    return contacts?.find((c) => c.memberId === memberId);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] pt-16">
      {/* Header */}
      <div className="relative h-64 overflow-hidden">
        <img
          src="/family-reunion.jpg"
          alt="Family"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#faf7f2] via-[#faf7f2]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-rose-500" />
              <span className="text-sm font-medium text-[#d4a574] tracking-widest uppercase">
                Connections
              </span>
            </div>
            <h1 className="font-playfair text-4xl font-bold text-[#1e3a5f]">
              Family Directory
            </h1>
            <p className="text-slate-600 mt-1">
              Stay connected with your loved ones
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search family members..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition-all text-sm bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedGen(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedGen === null
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-white text-slate-600 hover:bg-amber-50 border border-amber-200"
              }`}
            >
              All
            </button>
            {generations.map((gen) => (
              <button
                key={gen}
                onClick={() => setSelectedGen(gen)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedGen === gen
                    ? "bg-[#1e3a5f] text-white"
                    : "bg-white text-slate-600 hover:bg-amber-50 border border-amber-200"
                }`}
              >
                Generation {gen}
              </button>
            ))}
          </div>
        </div>

        {/* Members Grid */}
        {membersLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#d4a574]" />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-20">
            <User className="h-12 w-12 text-amber-200 mx-auto mb-4" />
            <h3 className="font-playfair text-xl font-bold text-[#1e3a5f] mb-2">
              No Members Found
            </h3>
            <p className="text-slate-500">
              {members && members.length > 0
                ? "Try adjusting your search or filters"
                : "Add family members to see them here"}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member, i) => {
              const contact = getContactForMember(member.id);
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-amber-50"
                >
                  {/* Card Header */}
                  <div className="relative h-24 bg-gradient-to-br from-[#1e3a5f] to-[#2a5f9e]">
                    <div className="absolute -bottom-8 left-4">
                      <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.firstName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-bold text-[#1e3a5f]">
                            {member.firstName[0]}
                            {member.lastName[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-white/20 rounded-full text-xs text-white font-medium">
                        Gen {member.generation}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="pt-10 pb-5 px-5">
                    <h3 className="font-playfair text-lg font-bold text-[#1e3a5f]">
                      {member.firstName} {member.lastName}
                    </h3>
                    {member.maidenName && (
                      <p className="text-xs text-slate-500">
                        (née {member.maidenName})
                      </p>
                    )}
                    {member.birthDate && (
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Heart className="h-3 w-3 text-rose-400" />
                        Born {member.birthDate}
                      </p>
                    )}
                    {member.bio && (
                      <p className="text-sm text-slate-600 mt-2 italic line-clamp-2">
                        &ldquo;{member.bio}&rdquo;
                      </p>
                    )}

                    {/* Contact Info */}
                    {contact && (
                      <div className="mt-4 pt-4 border-t border-amber-100 space-y-2">
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="h-3.5 w-3.5 text-[#d4a574]" />
                            <a
                              href={`mailto:${contact.email}`}
                              className="hover:text-[#1e3a5f] transition-colors"
                            >
                              {contact.email}
                            </a>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="h-3.5 w-3.5 text-emerald-500" />
                            <a
                              href={`tel:${contact.phone}`}
                              className="hover:text-[#1e3a5f] transition-colors"
                            >
                              {contact.phone}
                            </a>
                          </div>
                        )}
                        {(contact.city || contact.state) && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="h-3.5 w-3.5 text-rose-400" />
                            {[contact.city, contact.state, contact.country]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
