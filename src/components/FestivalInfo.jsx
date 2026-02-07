import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Thermometer, Wind, Music, Clock, ChevronRight, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { base44 } from '@/api/base44Client';

export default function FestivalInfo() {
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFestivalInfo();
  }, []);

  const fetchFestivalInfo = async () => {
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Get current information about ACL Festival Austin Texas. Include:
        1. Current weather in Austin, TX (temperature, conditions, humidity)
        2. Latest ACL Festival news or updates (2-3 headlines)
        3. Any safety alerts or advisories
        
        Current date context: February 2026`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            weather: {
              type: "object",
              properties: {
                temperature: { type: "number" },
                condition: { type: "string" },
                humidity: { type: "number" },
                wind_speed: { type: "number" }
              }
            },
            news: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  headline: { type: "string" },
                  summary: { type: "string" },
                  url: { type: "string" }
                }
              }
            },
            alerts: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setWeather(response.weather);
      setNews(response.news || []);
    } catch (error) {
      console.error('Failed to fetch info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('rain') || cond.includes('storm')) return CloudRain;
    if (cond.includes('cloud')) return Cloud;
    return Sun;
  };

  if (loading) {
    return (
      <Card className="bg-black/40 backdrop-blur-md border-white/10">
        <CardContent className="p-4 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
        </CardContent>
      </Card>
    );
  }

  const WeatherIcon = weather ? getWeatherIcon(weather.condition) : Sun;

  return (
    <div className="space-y-4">
      {/* Weather Card */}
      {weather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 backdrop-blur-md border-white/10 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-300 uppercase tracking-wider mb-1">Austin Weather</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">{weather.temperature}°</span>
                    <span className="text-lg text-purple-200">F</span>
                  </div>
                  <p className="text-purple-200 capitalize mt-1">{weather.condition}</p>
                </div>
                <div className="text-right">
                  <WeatherIcon className="w-16 h-16 text-purple-300 mb-2" />
                  <div className="flex items-center gap-2 text-xs text-purple-300">
                    <Wind className="w-3 h-3" />
                    <span>{weather.wind_speed} mph</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* News/Updates */}
      {news.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-black/40 backdrop-blur-md border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Music className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-semibold text-white">Festival Updates</h3>
              </div>
              <div className="space-y-3">
                {news.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <h4 className="text-sm font-medium text-white mb-1">{item.headline}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{item.summary}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}