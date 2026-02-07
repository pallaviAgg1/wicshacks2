import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Menu, X, Info, Map as MapIcon, Bell } from 'lucide-react';
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-slate-900/95 backdrop-blur-xl border-r-white/10 p-0">
                <div className="p-6">
                  {/* Logo in Sidebar */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-black text-lg">ACL</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-white">ACL SafeNav</h2>
                      <p className="text-xs text-slate-400">Festival Safety Companion</p>
                    </div>
                  </div>

                  {/* Info Panel */}
                  <FestivalInfo />

                  {/* Accessibility Guide */}
                  <div className="mt-6">
                    <AccessibilityGuide />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

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
          </div>

          {/* Active Reports Badge */}
          {activeReportsCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-3 py-1.5"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">{activeReportsCount} Active Reports</span>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Map */}
      <div className="absolute inset-0">
        <FestivalMap
          crowdReports={crowdReports}
          onLocationFound={handleLocationFound}
          userLocation={userLocation}
          {...mapFilters}
        />
      </div>

      {/* Map Filters */}
      <MapFilters 
        filters={mapFilters}
        setFilters={setMapFilters}
        isExpanded={filtersExpanded}
        setIsExpanded={setFiltersExpanded}
      />

      {/* Report Hazard Button */}
      <ReportForm 
        userLocation={userLocation}
        onReportSubmitted={refetchReports}
      />

      {/* SOS Button */}
      <SOSButton userLocation={userLocation} />

      {/* Bottom Info Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="absolute bottom-28 left-4 right-28 z-[1000]"
      >
        <div className="bg-black/70 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${userLocation ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm text-slate-300">
              {userLocation ? 'Location active' : 'Enable location for full features'}
            </span>
          </div>
          <Badge className="bg-purple-500/30 text-purple-300 border-purple-500/50">
            Live Map
          </Badge>
        </div>
      </motion.div>
    </div>
  );
}