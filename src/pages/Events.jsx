/**
 * Events Page
 * Displays events loaded from CSV
 */

import { useEffect, useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { loadEventsData, formatDate } from '../utils/dataLoader';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEventsData().then((data) => {
      // Sort by date
      const sorted = data.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      setEvents(sorted);
    });
  }, []);

  const isUpcoming = (dateString) => {
    return new Date(dateString) >= new Date();
  };

  const isPast = (dateString) => {
    return new Date(dateString) < new Date();
  };

  return (
    <PageWrapper>
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Events"
            description="Join us at conferences, workshops, and meetings around the world."
          />

          <div className="space-y-6">
            {events.map((event, index) => {
              const upcoming = isUpcoming(event.date);
              const past = isPast(event.date);

              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-primary-100 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-primary-600">
                          {new Date(event.date).getDate()}
                        </span>
                        <span className="text-xs text-primary-600 uppercase">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {event.title}
                        </h3>
                        {upcoming && (
                          <Badge variant="primary">Upcoming</Badge>
                        )}
                        {past && <Badge variant="default">Past Event</Badge>}
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-5 h-5 mr-2" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 mr-2" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-gray-600 mb-4">{event.description}</p>
                      )}
                      {event.link && (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Learn more
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

