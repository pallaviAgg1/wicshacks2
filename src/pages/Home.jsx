// @ts-nocheck
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Menu, X, Info, Map as MapIcon, Bell, Music, Accessibility, DoorOpen, ShieldAlert, Droplets } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import FestivalMap from '@/components/FestivalMap';
import SOSButton from '@/components/SOSButton';
import ReportForm from '@/components/ReportForm';
import MapFilters from '@/components/MapFilters';
import FestivalInfo from '@/components/FestivalInfo';
import AccessibilityGuide from '@/components/AccessibilityGuide';

export default function Home() {
  const [userLocation, setUserLocation] = useState(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapFilters, setMapFilters] = useState({
    showCrowdDensity: true,
    showAccessibility: true,
    showExits: true,
    showStages: true,
    showWater: true,
    showMedical: true,
  });
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  const { data: crowdReports = [], refetch: refetchReports, isError: reportsError } = useQuery({
    queryKey: ['crowdReports'],
    queryFn: () => base44.entities.CrowdReport.filter({ status: 'active' }, '-created_date', 50),
    retry: 1,
    retryDelay: 1000,
  });

  const handleLocationFound = useCallback((latlng) => {
    setUserLocation(latlng);
  }, []);

  const activeReportsCount = crowdReports.filter(r => r.status === 'active').length;

  return (
    <div className="fixed inset-0 bg-slate-950 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-transparent to-pink-900/20 pointer-events-none" />

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-0 left-0 right-0 z-[1001] bg-gradient-to-b from-black/80 to-transparent p-4"
      >
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-white font-black text-sm">ACL</span>
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-tight">SafeNav</h1>
              <p className="text-[10px] text-purple-300 uppercase tracking-widest">Festival Guide</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Active Reports Badge */}
            {activeReportsCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="hidden md:flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-3 py-1.5"
              >
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-300">{activeReportsCount} Active Reports</span>
              </motion.div>
            )}

            {/* Accessibility Guide Button */}
            <div className="relative z-[1002]">
              <AccessibilityGuide />
            </div>

            {/* Map Legend Button */}
            <div className="relative z-[1002]">
              <button
                onClick={() => setIsLegendOpen(!isLegendOpen)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-200 shadow-lg
                  ${isLegendOpen
                    ? 'bg-white text-black hover:bg-gray-100'
                    : 'bg-black/80 text-white hover:bg-black/90 backdrop-blur-md border border-white/10'
                  }
                `}
              >
                {isLegendOpen ? <X size={18} /> : <Info size={18} />}
                <span>Legend</span>
              </button>

              {/* Legend Dropdown */}
              {isLegendOpen && (
                <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-md rounded-xl p-4 text-xs text-white border border-white/10 shadow-xl w-48 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="space-y-2.5">
                    {mapFilters.showCrowdDensity && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Crowd Density</div>
                        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span> High Traffic</div>
                        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Medium Traffic</div>
                        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Low Traffic</div>
                      </div>
                    )}

                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">features</div>
                      <div className="flex items-center gap-2"><Music size={14} className="text-purple-400" /> Stages</div>
                      <div className="flex items-center gap-2"><Accessibility size={14} className="text-blue-400" /> ADA Accessible</div>
                      <div className="flex items-center gap-2"><DoorOpen size={14} className="text-green-400" /> Exits</div>
                      <div className="flex items-center gap-2"><ShieldAlert size={14} className="text-red-400" /> Medical</div>
                      <div className="flex items-center gap-2"><Droplets size={14} className="text-cyan-400" /> Water Stations</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-20 left-4 z-[1000]"
      >
        <div className="bg-black/70 backdrop-blur-md rounded-2xl p-2 px-4 flex items-center gap-3 border border-white/10">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)] ${userLocation ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs font-medium text-slate-300">
              {userLocation ? 'Location Active' : 'Enable Location'}
            </span>
          </div>
          <div className="w-px h-4 bg-white/20"></div>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px] py-0 h-5">
            Live Map
          </Badge>
        </div>
      </motion.div >

      {/* Map */}
      < div className="absolute inset-0" >
        <FestivalMap
          crowdReports={crowdReports}
          onLocationFound={handleLocationFound}
          userLocation={userLocation}
          {...mapFilters}
        />
      </div >



      {/* Report Hazard Button */}
      < ReportForm
        userLocation={userLocation}
        onReportSubmitted={refetchReports}
      />

      {/* SOS Button */}
      < SOSButton userLocation={userLocation} />


    </div >
  );
}