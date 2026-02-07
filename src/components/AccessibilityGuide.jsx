// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accessibility, X, ChevronRight, Ear, Eye, Brain, Heart,
  MapPin, Phone, Info, Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ACCESSIBILITY_SECTIONS = [
  {
    id: 'mobility',
    title: 'Mobility Assistance',
    icon: Accessibility,
    color: 'from-blue-500 to-cyan-500',
    content: [
      'Wheelchair rentals available at Main Entrance ($25/day, $50 deposit)',
      'ADA viewing platforms at all main stages',
      'Accessible restrooms throughout the venue',
      'Golf cart transportation for those with mobility issues',
      'Designated drop-off zones near ADA entrance',
    ],
    tip: 'Request a mobility escort by texting ACL to 69050'
  },
  {
    id: 'sensory',
    title: 'Sensory Sensitivities',
    icon: Ear,
    color: 'from-purple-500 to-pink-500',
    content: [
      'Quiet zones located near the North and East exits',
      'Free earplugs available at medical tents',
      'Noise-reducing headphones available for checkout',
      'Sensory bags with fidget tools at Guest Services',
      'Low-stimulation viewing areas behind main stages',
    ],
    tip: 'Quiet zones have limited capacity - arrive early'
  },
  {
    id: 'visual',
    title: 'Visual Impairments',
    icon: Eye,
    color: 'from-amber-500 to-orange-500',
    content: [
      'Braille maps available at information booths',
      'Audio descriptions of performances available via app',
      'Companion passes for guide assistance',
      'Tactile navigation strips on main pathways',
      'Service animals welcome - water stations marked on map',
    ],
    tip: 'Download audio descriptions before arriving for offline access'
  },
  {
    id: 'anxiety',
    title: 'Anxiety & Mental Health',
    icon: Brain,
    color: 'from-green-500 to-teal-500',
    content: [
      'Chill Zone tents for decompression',
      'Trained peer support volunteers available',
      'Crisis counselors at medical tents',
      'Buddy system sign-up at Guest Services',
      'Text-based support: Text ACL to 741741',
    ],
    tip: 'It\'s okay to step away - your wellbeing comes first'
  },
  {
    id: 'medical',
    title: 'Medical Conditions',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    content: [
      'Medical tents staffed 24/7 with EMTs',
      'Refrigerated medication storage available',
      'Private nursing/insulin areas at medical tents',
      'AED stations throughout the venue',
      'Allergy-friendly food vendors marked on map',
    ],
    tip: 'Register medical needs at Guest Services for priority assistance'
  },
];

const IMPORTANT_CONTACTS = [
  { label: 'Festival Security', phone: '512-ACL-SAFE' },
  { label: 'Medical Emergency', phone: '911' },
  { label: 'ADA Services', phone: '512-ACL-ADA1' },
  { label: 'Lost & Found', phone: '512-ACL-LOST' },
];

export default function AccessibilityGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Open Button */}
      {/* Open Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-200 shadow-lg bg-black/80 text-white hover:bg-black/90 backdrop-blur-md border border-white/10"
      >
        <Accessibility size={18} />
        <span>Accessibility</span>
      </button>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-b from-slate-900 to-transparent backdrop-blur-xl p-4">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Accessibility className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Accessibility Guide</h1>
                    <p className="text-sm text-purple-300">Your festival, your way</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 pb-8">

              {/* Accessibility Sections */}
              <Accordion type="single" collapsible className="space-y-3">
                {ACCESSIBILITY_SECTIONS.map((section, idx) => {
                  const Icon = section.icon;
                  return (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <AccordionItem
                        value={section.id}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-white/5">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-medium">{section.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <ul className="space-y-2 mb-4">
                            {section.content.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                                <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="bg-purple-500/20 rounded-xl p-3 flex items-start gap-2">
                            <Info className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-purple-200">{section.tip}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  );
                })}
              </Accordion>

              {/* Emergency Contacts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-400" />
                  Important Contacts
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {IMPORTANT_CONTACTS.map((contact, idx) => (
                    <a
                      key={idx}
                      href={`tel:${contact.phone.replace(/-/g, '')}`}
                      className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors"
                    >
                      <p className="text-xs text-slate-400 mb-1">{contact.label}</p>
                      <p className="text-white font-medium">{contact.phone}</p>
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* Close Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-lg font-semibold"
                >
                  Back to Map
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}