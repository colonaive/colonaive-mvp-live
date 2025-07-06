/*
import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';

const mockEvents = [
  { title: 'GP Webinar - CRC Triage', date: '7 May 2025, 7:00PM', url: '#' },
  { title: 'New Patient Guide: CRC Symptoms', date: '2 May 2025', url: '#' },
  { title: 'Colonoscopy Spotlight: Prof. Eu', date: '30 April 2025', url: '#' },
  { title: 'Understanding Polyps: Early Warning Signs', date: '28 April 2025', url: '#' },
  { title: 'Nurses CRC Refresher Workshop', date: '27 April 2025', url: '#' },
  { title: 'SGH GI Conference', date: '25 April 2025', url: '#' },
  { title: 'Public Forum: CRC Prevention', date: '24 April 2025', url: '#' },
  { title: 'Launch: CRC Early-Onset Campaign', date: '23 April 2025', url: '#' },
  { title: 'Primary Care Update: CRC Toolkit', date: '22 April 2025', url: '#' },
  { title: 'ColonAiQ x Innoquest Launch', date: '21 April 2025', url: '#' },
  { title: 'Colorectal Innovation Day', date: '19 April 2025', url: '#' },
  { title: 'Employer CRC Awareness Day', date: '18 April 2025', url: '#' },
  { title: 'Family Health Week', date: '17 April 2025', url: '#' },
  { title: 'AI in Diagnostics Roundtable', date: '15 April 2025', url: '#' },
  { title: 'CRC Community Leader Briefing', date: '12 April 2025', url: '#' },
];

export const UpcomingEventsPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // Show popup after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const toggleMinimize = () => setIsMinimized(!isMinimized);
  const closePopup = () => setIsVisible(false);

  return isVisible ? (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white rounded-lg shadow-lg p-4 w-80 z-50">
      <h3 className="font-bold text-lg mb-2">Upcoming Events & Updates</h3>
      <ul className={`space-y-2 ${isMinimized ? 'h-12 overflow-hidden' : 'h-auto'}`} ref={scrollListRef}>
        {mockEvents.slice(0, 5).map((event, index) => (
          <li key={index}>
            <a href={event.url} className="text-blue-200 underline">
              {event.title} - {event.date}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex justify-end space-x-4 mt-2">
        <button onClick={toggleMinimize} className="text-white underline">
          {isMinimized ? 'Expand' : 'Minimize'}
        </button>
        <button onClick={closePopup} className="text-white underline">
          Close
        </button>
      </div>
    </div>
  ) : null;
};
*/
