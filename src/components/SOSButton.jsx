// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, Phone, Heart, Droplets, MapPin, Users, Accessibility, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { base44 } from '@/api/base44Client';
import { toast } from "sonner";

const EMERGENCY_TYPES = [
  { id: 'medical', label: 'Medical Help', icon: Heart, color: 'bg-red-500', description: 'Injury, illness, or health emergency' },
  { id: 'panic_attack', label: 'Panic/Anxiety', icon: HelpCircle, color: 'bg-purple-500', description: 'Panic attack or anxiety episode' },
  { id: 'dehydration', label: 'Dehydration', icon: Droplets, color: 'bg-cyan-500', description: 'Need water or feeling faint' },
  { id: 'lost', label: "I'm Lost", icon: MapPin, color: 'bg-amber-500', description: 'Need help finding location' },
  { id: 'feeling_unsafe', label: 'Feeling Unsafe', icon: Users, color: 'bg-orange-500', description: 'Uncomfortable situation' },
  { id: 'accessibility_help', label: 'Accessibility', icon: Accessibility, color: 'bg-blue-500', description: 'Need accessibility assistance' },
];

export default function SOSButton({ userLocation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async () => {
    if (!selectedType) return;

    setIsSubmitting(true);
    const emergencyData = {
      emergency_type: selectedType,
      description,
      latitude: userLocation?.lat || 30.2669,
      longitude: userLocation?.lng || -97.7729,
      contact_phone: phone,
      status: 'pending'
    };

    try {
      // 1. Attempt Online Submission
      await base44.entities.SOSRequest.create(emergencyData);

      toast.success('Help is on the way!', {
        description: 'A festival volunteer has been notified of your location.'
      });

      resetForm();
    } catch (error) {
      // 2. Offline Fallback: Trigger Native SMS
      console.error("SOS Post Failed, triggering SMS Fallback", error);
      toast.error('Network failed. Switching to SMS...', {
        description: 'Please hit SEND in your messaging app!'
      });

      // Construct SMS Body
      const mapLink = `https://www.google.com/maps?q=${emergencyData.latitude},${emergencyData.longitude}`;
      const typeLabel = EMERGENCY_TYPES.find(t => t.id === selectedType)?.label || selectedType;
      const smsBody = `SOS: ${typeLabel}. \nLoc: ${mapLink} \nDetails: ${description || 'None'}`;

      // Determine Recipient (User's contact OR Default Backup)
      // "555-0199" is the placeholder Base Command number
      const recipient = phone || "469-403-1344";

      // Trigger SMS Intent
      window.location.href = `sms:${recipient}?&body=${encodeURIComponent(smsBody)}`;

      // We still reset the form so they aren't stuck
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsOpen(false);
    setSelectedType(null);
    setDescription('');
    setPhone('');
    setStep(1);
  };

  return (
    <>
      {/* SOS Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-2xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.4)', '0 0 0 20px rgba(239, 68, 68, 0)', '0 0 0 0 rgba(239, 68, 68, 0.4)']
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity }
        }}
      >
        <ShieldAlert className="w-10 h-10 text-white" />
      </motion.button>

      {/* SOS Modal */}
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
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Need Help?</h2>
                    <p className="text-sm text-slate-400">Select what you need assistance with</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Emergency Call Banner */}
              <a
                href="tel:911"
                className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-xl mb-6"
              >
                <Phone className="w-6 h-6 text-red-500" />
                <div className="flex-1">
                  <div className="font-semibold text-red-400">Life-threatening emergency?</div>
                  <div className="text-sm text-red-300">Tap to call 911 immediately</div>
                </div>
              </a>

              {step === 1 && (
                <>
                  {/* Emergency Type Selection */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {EMERGENCY_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedType === type.id;
                      return (
                        <motion.button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`p-4 rounded-xl text-left transition-all ${isSelected
                            ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-500'
                            : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-700'
                            }`}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center mb-2`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="font-medium text-white text-sm">{type.label}</div>
                          <div className="text-xs text-slate-400 mt-1">{type.description}</div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!selectedType}
                    className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg font-semibold rounded-xl"
                  >
                    Continue
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  {/* Additional Details */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label className="text-slate-300 mb-2 block">Additional Details (optional)</Label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your situation..."
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300 mb-2 block">Phone Number (optional)</Label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="For callback if needed"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>

                    {/* Location Display */}
                    <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <MapPin className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-400">
                        {userLocation ? 'Your location will be shared' : 'Location services unavailable'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="flex-1 h-14 border-slate-700 text-slate-300"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 h-14 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-lg font-semibold"
                    >
                      {isSubmitting ? 'Sending...' : 'Send SOS'}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}