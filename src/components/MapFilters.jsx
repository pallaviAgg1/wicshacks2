import React from 'react';
import { motion } from 'framer-motion';
import { Users, Accessibility, DoorOpen, Music, Droplets, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const FILTER_OPTIONS = [
  { id: 'showCrowdDensity', label: 'Crowd Density', icon: Users, color: 'text-red-400' },
  { id: 'showStages', label: 'Stages', icon: Music, color: 'text-purple-400' },
  { id: 'showAccessibility', label: 'ADA Features', icon: Accessibility, color: 'text-blue-400' },
  { id: 'showExits', label: 'Exits', icon: DoorOpen, color: 'text-green-400' },
  { id: 'showWater', label: 'Water Stations', icon: Droplets, color: 'text-cyan-400' },
  { id: 'showMedical', label: 'Medical Tents', icon: Heart, color: 'text-red-400' },
];

export default function MapFilters({ filters, setFilters, isExpanded, setIsExpanded }) {
  const handleToggle = (id) => {
    setFilters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <motion.div 
      className="absolute top-4 right-4 z-[1000] bg-black/80 backdrop-blur-md rounded-2xl overflow-hidden"
      initial={false}
      animate={{ width: isExpanded ? 220 : 'auto' }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-white hover:bg-white/10 transition-colors"
      >
        <span className="font-medium text-sm">Map Layers</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Filter Options */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-3 pb-3 space-y-2"
        >
          {FILTER_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <div 
                key={option.id}
                className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${option.color}`} />
                  <Label className="text-sm text-slate-300 cursor-pointer">{option.label}</Label>
                </div>
                <Switch
                  checked={filters[option.id]}
                  onCheckedChange={() => handleToggle(option.id)}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}