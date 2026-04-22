import { useEffect, useRef, useState, useCallback } from "react";
import { trpc } from "@/providers/trpc";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  UserPlus,
  X,
  Loader2,
  TreePine,
  Calendar,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";
import * as d3 from "d3";

interface TreeNode {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string | null;
  birthDate: string | null;
  bio: string | null;
  avatar: string | null;
  generation: number;
  x: number;
  y: number;
  children?: TreeNode[];
  spouses?: number[];
}

export default function TreePage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: treeData, isLoading } = trpc.relationships.getTreeData.useQuery();
  const [selectedMember, setSelectedMember] = useState<TreeNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const buildTree = useCallback(() => {
    if (!treeData || !svgRef.current) return;

    const { members, relationships } = treeData;
    if (members.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = containerRef.current?.clientWidth || 1200;

    const g = svg.append("g");

    // Build node map
    const nodeMap = new Map<number, TreeNode>();
    members.forEach((m) => {
      nodeMap.set(m.id, { ...m, x: 0, y: 0 });
    });

    // Build adjacency
    const childrenMap = new Map<number, number[]>();
    const spouseMap = new Map<number, number[]>();

    relationships.forEach((r) => {
      if (r.relationType === "parent") {
        // memberId is parent of relatedMemberId
        if (!childrenMap.has(r.memberId)) childrenMap.set(r.memberId, []);
        childrenMap.get(r.memberId)!.push(r.relatedMemberId);
      } else if (r.relationType === "spouse") {
        if (!spouseMap.has(r.memberId)) spouseMap.set(r.memberId, []);
        if (!spouseMap.has(r.relatedMemberId)) spouseMap.set(r.relatedMemberId, []);
        spouseMap.get(r.memberId)!.push(r.relatedMemberId);
        spouseMap.get(r.relatedMemberId)!.push(r.memberId);
      }
    });

    // Position nodes by generation
    const genGroups = new Map<number, TreeNode[]>();
    members.forEach((m) => {
      const node = nodeMap.get(m.id)!;
      if (!genGroups.has(m.generation)) genGroups.set(m.generation, []);
      genGroups.get(m.generation)!.push(node);
    });

    const sortedGens = Array.from(genGroups.keys()).sort((a, b) => a - b);
    const nodeRadius = 45;
    const levelHeight = 160;
    const nodeSpacing = 140;

    sortedGens.forEach((gen, genIdx) => {
      const genMembers = genGroups.get(gen)!;
      const totalWidth = (genMembers.length - 1) * nodeSpacing;
      genMembers.forEach((node, idx) => {
        node.x = idx * nodeSpacing - totalWidth / 2 + width / 2;
        node.y = genIdx * levelHeight + 100;
      });
    });

    // Draw spouse links
    const drawnSpouse = new Set<string>();
    relationships.forEach((r) => {
      if (r.relationType === "spouse") {
        const key = [r.memberId, r.relatedMemberId].sort().join("-");
        if (drawnSpouse.has(key)) return;
        drawnSpouse.add(key);

        const source = nodeMap.get(r.memberId);
        const target = nodeMap.get(r.relatedMemberId);
        if (!source || !target) return;

        g.append("line")
          .attr("x1", source.x)
          .attr("y1", source.y)
          .attr("x2", target.x)
          .attr("y2", target.y)
          .attr("stroke", "#e8b4b8")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "8,4");

        // Heart at midpoint
        const mx = (source.x + target.x) / 2;
        const my = (source.y + target.y) / 2;
        g.append("circle")
          .attr("cx", mx)
          .attr("cy", my)
          .attr("r", 8)
          .attr("fill", "#e8b4b8")
          .attr("stroke", "#d4868a")
          .attr("stroke-width", 1);
      }
    });

    // Draw parent-child links (curved)
    relationships.forEach((r) => {
      if (r.relationType === "parent") {
        const source = nodeMap.get(r.memberId);
        const target = nodeMap.get(r.relatedMemberId);
        if (!source || !target) return;

        const path = d3.path();
        const midY = (source.y + target.y) / 2;
        path.moveTo(source.x, source.y + nodeRadius);
        path.bezierCurveTo(source.x, midY, target.x, midY, target.x, target.y - nodeRadius);

        g.append("path")
          .attr("d", path.toString())
          .attr("fill", "none")
          .attr("stroke", "#a8d5ba")
          .attr("stroke-width", 2.5)
          .attr("opacity", 0.7);
      }
    });

    // Draw nodes
    const nodeGroups = g
      .selectAll<SVGGElement, TreeNode>(".node")
      .data(Array.from(nodeMap.values()))
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")
      .on("click", (_, d) => {
        setSelectedMember(d);
      });

    // Node circle with glow
    nodeGroups
      .append("circle")
      .attr("r", nodeRadius)
      .attr("fill", "white")
      .attr("stroke", "#d4a574")
      .attr("stroke-width", 3)
      .style("filter", "drop-shadow(0 4px 8px rgba(212, 165, 116, 0.3))");

    // Avatar or initials
    nodeGroups.each(function (d) {
      const group = d3.select(this);
      if (d.avatar) {
        group
          .append("defs")
          .append("clipPath")
          .attr("id", `clip-${d.id}`)
          .append("circle")
          .attr("r", nodeRadius - 4);

        group
          .append("image")
          .attr("xlink:href", d.avatar)
          .attr("x", -nodeRadius + 4)
          .attr("y", -nodeRadius + 4)
          .attr("width", (nodeRadius - 4) * 2)
          .attr("height", (nodeRadius - 4) * 2)
          .attr("clip-path", `url(#clip-${d.id})`)
          .attr("preserveAspectRatio", "xMidYMid slice");
      } else {
        group
          .append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em")
          .attr("font-size", "18px")
          .attr("font-weight", "600")
          .attr("fill", "#1e3a5f")
          .text(`${d.firstName[0]}${d.lastName[0]}`);
      }
    });

    // Name label below
    nodeGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", nodeRadius + 20)
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("fill", "#1e3a5f")
      .text((d) => d.firstName);

    nodeGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", nodeRadius + 34)
      .attr("font-size", "11px")
      .attr("fill", "#6b7280")
      .text((d) => d.lastName);

    // Apply zoom/pan
    g.attr("transform", `translate(${pan.x},${pan.y}) scale(${zoom})`);
  }, [treeData, zoom, pan]);

  useEffect(() => {
    buildTree();
  }, [buildTree]);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.2, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.2, 0.3));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Seed data if empty
  const seedMutation = trpc.family.create.useMutation();
  const relMutation = trpc.relationships.create.useMutation();
  const utils = trpc.useUtils();

  const seedData = async () => {
    // Create grandparents
    const g1 = await seedMutation.mutateAsync({
      firstName: "Arthur",
      lastName: "Johnson",
      birthDate: "1940-03-15",
      bio: "Family patriarch and storyteller",
      generation: 0,
    });
    const g2 = await seedMutation.mutateAsync({
      firstName: "Eleanor",
      lastName: "Johnson",
      maidenName: "Smith",
      birthDate: "1942-07-22",
      bio: "Family matriarch and amazing cook",
      generation: 0,
    });

    // Create parents
    const p1 = await seedMutation.mutateAsync({
      firstName: "Robert",
      lastName: "Johnson",
      birthDate: "1965-11-08",
      bio: "Father of three, teacher",
      generation: 1,
    });
    const p2 = await seedMutation.mutateAsync({
      firstName: "Margaret",
      lastName: "Johnson",
      maidenName: "Davis",
      birthDate: "1968-04-30",
      bio: "Mother and artist",
      generation: 1,
    });

    // Create children
    const c1 = await seedMutation.mutateAsync({
      firstName: "Emily",
      lastName: "Johnson",
      birthDate: "1990-06-12",
      bio: "Eldest daughter, doctor",
      generation: 2,
    });
    const c2 = await seedMutation.mutateAsync({
      firstName: "James",
      lastName: "Johnson",
      birthDate: "1993-09-25",
      bio: "Son, software engineer",
      generation: 2,
    });
    const c3 = await seedMutation.mutateAsync({
      firstName: "Sophia",
      lastName: "Johnson",
      birthDate: "1996-01-18",
      bio: "Youngest, student",
      generation: 2,
    });

    // Create relationships
    await relMutation.mutateAsync({ memberId: g1.id, relatedMemberId: g2.id, relationType: "spouse" });
    await relMutation.mutateAsync({ memberId: g1.id, relatedMemberId: p1.id, relationType: "parent" });
    await relMutation.mutateAsync({ memberId: g2.id, relatedMemberId: p1.id, relationType: "parent" });
    await relMutation.mutateAsync({ memberId: p1.id, relatedMemberId: p2.id, relationType: "spouse" });
    await relMutation.mutateAsync({ memberId: p1.id, relatedMemberId: c1.id, relationType: "parent" });
    await relMutation.mutateAsync({ memberId: p1.id, relatedMemberId: c2.id, relationType: "parent" });
    await relMutation.mutateAsync({ memberId: p1.id, relatedMemberId: c3.id, relationType: "parent" });
    await relMutation.mutateAsync({ memberId: p2.id, relatedMemberId: c1.id, relationType: "parent" });
    await relMutation.mutateAsync({ memberId: p2.id, relatedMemberId: c2.id, relationType: "parent" });
    await relMutation.mutateAsync({ memberId: p2.id, relatedMemberId: c3.id, relationType: "parent" });
    await relMutation.mutateAsync({ memberId: c1.id, relatedMemberId: c2.id, relationType: "sibling" });
    await relMutation.mutateAsync({ memberId: c1.id, relatedMemberId: c3.id, relationType: "sibling" });
    await relMutation.mutateAsync({ memberId: c2.id, relatedMemberId: c3.id, relationType: "sibling" });

    utils.relationships.getTreeData.invalidate();
  };

  const hasMembers = treeData && treeData.members.length > 0;

  return (
    <div className="min-h-screen bg-[#faf7f2] pt-16">
      {/* Header */}
      <div className="bg-white border-b border-amber-100 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TreePine className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium text-[#d4a574] tracking-widest uppercase">
                Interactive
              </span>
            </div>
            <h1 className="font-playfair text-3xl font-bold text-[#1e3a5f]">
              Family Tree
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {!hasMembers && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={seedData}
                disabled={seedMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {seedMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                Add Sample Family
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Tree Canvas */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: "calc(100vh - 140px)" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-[#d4a574]" />
          </div>
        ) : !hasMembers ? (
          <div className="flex flex-col items-center justify-center h-full">
            <TreePine className="h-16 w-16 text-amber-200 mb-4" />
            <h3 className="font-playfair text-2xl font-bold text-[#1e3a5f] mb-2">
              Your Family Tree is Empty
            </h3>
            <p className="text-slate-500 mb-6 text-center max-w-md">
              Be the first to add your branch to the Lauj Puab Yib family tree,
              or start with a sample family to see how it works.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-[#1e3a5f] rounded-full font-semibold hover:bg-amber-400 transition-colors shadow-lg"
                >
                  <UserPlus className="h-5 w-5" />
                  Join the Family
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={seedData}
                disabled={seedMutation.isPending}
                className="flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white rounded-full font-semibold hover:bg-[#2a4f7f] transition-colors disabled:opacity-50"
              >
                {seedMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <TreePine className="h-5 w-5" />
                )}
                Create Sample Family
              </motion.button>
            </div>
          </div>
        ) : (
          <>
            <svg
              ref={svgRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            />

            {/* Zoom Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleZoomIn}
                className="p-2.5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-[#1e3a5f]"
              >
                <ZoomIn className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleZoomOut}
                className="p-2.5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-[#1e3a5f]"
              >
                <ZoomOut className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleReset}
                className="p-2.5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-[#1e3a5f]"
              >
                <Maximize2 className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Legend */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <h4 className="font-semibold text-[#1e3a5f] text-sm mb-2">Legend</h4>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-8 h-0.5 bg-[#a8d5ba]" />
                  Parent - Child
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-8 h-0.5 border-t-2 border-dashed border-[#e8b4b8]" />
                  Spouse
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-3 h-3 rounded-full bg-[#d4a574]" />
                  Family Member
                </div>
              </div>
            </div>
          </>
        )}

        {/* Member Detail Panel */}
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3 }}
              className="absolute top-4 right-4 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden z-20"
            >
              <div className="relative h-32 bg-gradient-to-br from-[#1e3a5f] to-[#2a5f9e]">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-3 right-3 p-1.5 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                  <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                    {selectedMember.avatar ? (
                      <img
                        src={selectedMember.avatar}
                        alt={selectedMember.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-[#1e3a5f]">
                        {selectedMember.firstName[0]}
                        {selectedMember.lastName[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-12 pb-6 px-6 text-center">
                <h3 className="font-playfair text-xl font-bold text-[#1e3a5f]">
                  {selectedMember.firstName} {selectedMember.lastName}
                </h3>
                {selectedMember.maidenName && (
                  <p className="text-sm text-slate-500">
                    (née {selectedMember.maidenName})
                  </p>
                )}
                <div className="flex items-center justify-center gap-4 mt-3 text-sm text-slate-600">
                  {selectedMember.birthDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#d4a574]" />
                      {selectedMember.birthDate}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5 text-rose-400" />
                    Gen {selectedMember.generation}
                  </div>
                </div>
                {selectedMember.bio && (
                  <p className="mt-4 text-sm text-slate-600 italic">
                    &ldquo;{selectedMember.bio}&rdquo;
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
