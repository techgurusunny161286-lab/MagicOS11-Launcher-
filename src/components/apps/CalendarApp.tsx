import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, Check } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { triggerHaptic } from '../../utils/haptics';

interface CalendarAppProps {
  onClose: () => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  location?: string;
  color: string;
  day: number;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: 'ev1', title: 'Product Launch & Review', time: '10:00 AM - 11:30 AM', location: 'Virtual Room A', color: 'bg-cyan-500', day: 2 },
  { id: 'ev2', title: 'Coffee with Sarah Connor', time: '03:00 PM - 03:45 PM', location: 'Blue Bottle Cafe', color: 'bg-emerald-500', day: 2 },
  { id: 'ev3', title: 'Team Sync: MagicOS 11', time: '05:00 PM - 06:00 PM', location: 'HQ Conference', color: 'bg-purple-500', day: 3 },
  { id: 'ev4', title: 'Weekend Hiking Trip', time: 'All Day', location: 'Muir Woods', color: 'bg-amber-500', day: 5 },
];

export const CalendarApp: React.FC<CalendarAppProps> = ({ onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 2)); // Oct 2026
  const [selectedDay, setSelectedDay] = useState(2);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('02:00 PM - 03:00 PM');

  const daysInMonth = 31;
  const startDayOffset = 4; // Oct 1, 2026 was Thursday

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) return;
    triggerHaptic('doubleTick');
    playTapSound(600);

    const colors = ['bg-cyan-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newEv: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: newEventTitle.trim(),
      time: newEventTime,
      color: randomColor,
      day: selectedDay
    };

    setEvents(prev => [...prev, newEv]);
    setNewEventTitle('');
    setIsAddingEvent(false);
  };

  const dayEvents = events.filter(e => e.day === selectedDay);

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="p-3.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon size={18} className="text-cyan-400" />
          <h2 className="font-bold text-base text-white">October 2026</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tick');
              setIsAddingEvent(true);
            }}
            className="w-8 h-8 rounded-full bg-cyan-500 text-neutral-950 font-bold flex items-center justify-center shadow-md active:scale-95"
            title="Add Event"
          >
            <Plus size={18} strokeWidth={2.8} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Month Grid */}
        <div className="p-4 rounded-3xl bg-neutral-900/70 border border-neutral-800/80 shadow-md">
          {/* Days of week */}
          <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-neutral-400 mb-2">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2 text-neutral-700"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isSelected = dayNum === selectedDay;
              const hasEvents = events.some(e => e.day === dayNum);

              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  onClick={() => {
                    triggerHaptic('tick');
                    setSelectedDay(dayNum);
                  }}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-neutral-950 font-black shadow-lg scale-105'
                      : 'hover:bg-neutral-800 text-neutral-200'
                  }`}
                >
                  <span>{dayNum}</span>
                  {hasEvents && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-neutral-950' : 'bg-cyan-400'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule for Selected Day */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-xs text-white">
              Schedule · Friday, Oct {selectedDay}
            </h3>
            <span className="text-[11px] text-neutral-400">{dayEvents.length} events</span>
          </div>

          <div className="space-y-2">
            {dayEvents.length === 0 ? (
              <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/60 text-center text-xs text-neutral-500">
                No events scheduled for this day
              </div>
            ) : (
              dayEvents.map(ev => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-start gap-3 shadow-md"
                >
                  <div className={`w-3.5 h-3.5 rounded-full ${ev.color} mt-0.5 shrink-0 shadow-sm`} />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-white truncate">{ev.title}</h4>
                    <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                      <Clock size={11} />
                      <span>{ev.time}</span>
                    </p>
                    {ev.location && (
                      <p className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} />
                        <span>{ev.location}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddingEvent && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xl flex flex-col justify-end p-4 animate-in fade-in"
          onClick={() => setIsAddingEvent(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[380px] mx-auto bg-neutral-900 border border-neutral-700 rounded-[32px] p-5 flex flex-col gap-3 shadow-2xl"
          >
            <h3 className="text-sm font-bold text-white">Add Calendar Event</h3>
            <input
              type="text"
              placeholder="Event Title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              placeholder="Time range (e.g. 02:00 PM - 03:00 PM)"
              value={newEventTime}
              onChange={(e) => setNewEventTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={handleAddEvent}
              disabled={!newEventTitle.trim()}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-neutral-950 font-bold text-xs shadow-md mt-1"
            >
              Save Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
