import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, AlertTriangle, Droplets, Users, Mountain, Ban, MapPin, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { base44 } from '@/api/base44Client';
import { toast } from "sonner";

const REPORT_TYPES = [
  { id: 'mud', label: 'Mud/Slippery', icon: Droplets, color: 'bg-amber-700' },
  { id: 'crowd_dense', label: 'Dense Crowd', icon: Users, color: 'bg-red-500' },
  { id: 'obstacle', label: 'Obstacle', icon: AlertTriangle, color: 'bg-orange-500' },
  { id: 'flooding', label: 'Flooding', icon: Droplets, color: 'bg-blue-500' },
  { id: 'uneven_terrain', label: 'Uneven Ground', icon: Mountain, color: 'bg-stone-500' },
  { id: 'blocked_path', label: 'Blocked Path', icon: Ban, color: 'bg-red-600' },
];

export default function ReportForm({ userLocation, onReportSubmitted }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType || !userLocation) {
      toast.error('Please select a report type and enable location');
      return;
    }

    setIsSubmitting(true);
    try {
      await base44.entities.CrowdReport.create({
        report_type: selectedType,
        description,
        severity,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        status: 'active',
        upvotes: 1
      });

      toast.success('Report submitted!', {
        description: 'Thank you for helping others navigate safely.'
      });

      setIsOpen(false);
      setSelectedType('');
      setDescription('');
      setSeverity('medium');
      onReportSubmitted?.();
    } catch (error) {
      toast.error('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Report Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 h-14 px-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 shadow-xl flex items-center gap-2 text-white font-semibold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-5 h-5" />
        Report Hazard
      </motion.button>

      {/* Report Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 rounded-t-3xl sm:rounded-3xl p-6 max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Report Hazard</h2>
                    <p className="text-sm text-slate-400">Help others navigate safely</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Location Status */}
              <div className={`flex items-center gap-2 p-3 rounded-lg mb-6 ${
                userLocation ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <MapPin className={`w-5 h-5 ${userLocation ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-sm ${userLocation ? 'text-green-400' : 'text-red-400'}`}>
                  {userLocation ? 'Location detected - report will be placed at your position' : 'Please enable location services'}
                </span>
              </div>

              {/* Report Type Selection */}
              <Label className="text-slate-300 mb-3 block">What do you want to report?</Label>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {REPORT_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <motion.button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-xl text-left transition-all ${
                        isSelected 
                          ? 'bg-gradient-to-br from-amber-500/30 to-orange-500/30 border-2 border-amber-500' 
                          : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-700'
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center mb-2`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="font-medium text-white text-sm">{type.label}</div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Severity */}
              <Label className="text-slate-300 mb-3 block">Severity Level</Label>
              <RadioGroup value={severity} onValueChange={setSeverity} className="flex gap-3 mb-6">
                {['low', 'medium', 'high'].map((level) => (
                  <label
                    key={level}
                    className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                      severity === level 
                        ? level === 'high' ? 'border-red-500 bg-red-500/20' 
                          : level === 'medium' ? 'border-amber-500 bg-amber-500/20'
                          : 'border-green-500 bg-green-500/20'
                        : 'border-slate-700 bg-slate-800/50'
                    }`}
                  >
                    <RadioGroupItem value={level} className="sr-only" />
                    <span className={`font-medium capitalize ${
                      severity === level 
                        ? level === 'high' ? 'text-red-400' 
                          : level === 'medium' ? 'text-amber-400'
                          : 'text-green-400'
                        : 'text-slate-400'
                    }`}>
                      {level}
                    </span>
                  </label>
                ))}
              </RadioGroup>

              {/* Description */}
              <Label className="text-slate-300 mb-2 block">Additional Details (optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the hazard..."
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 mb-6"
              />

              {/* Submit */}
              <Button 
                onClick={handleSubmit}
                disabled={!selectedType || !userLocation || isSubmitting}
                className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-lg font-semibold rounded-xl"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}