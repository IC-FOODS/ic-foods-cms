/**
 * Publications Page
 * Displays publications loaded from CSV with citation copy functionality
 */

import { useEffect, useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import { loadPublicationsData } from '../utils/dataLoader';
import { ExternalLink, Copy, Check } from 'lucide-react';

export default function Publications() {
  const [publications, setPublications] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    loadPublicationsData().then((data) => {
      // Sort by year descending
      const sorted = data.sort((a, b) => parseInt(b.year) - parseInt(a.year));
      setPublications(sorted);
    });
  }, []);

  const formatCitation = (pub) => {
    return `${pub.authors} (${pub.year}). ${pub.title}. ${pub.journal}.`;
  };

  const copyCitation = async (pub, index) => {
    const citation = formatCitation(pub);
    try {
      await navigator.clipboard.writeText(citation);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy citation:', err);
    }
  };

  return (
    <PageWrapper>
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Publications"
            description="Our research contributions to the global food systems literature."
          />

          <div className="space-y-6">
            {publications.map((pub, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {pub.title}
                    </h3>
                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">{pub.authors}</span>
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="italic">{pub.journal}</span> ({pub.year})
                    </p>
                    {pub.doi && (
                      <p className="text-sm text-gray-500 mb-3">
                        DOI: {pub.doi}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 md:flex-col">
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        View DOI
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    )}
                    {pub.link && (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
                      >
                        Read Paper
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    )}
                    <button
                      onClick={() => copyCitation(pub, index)}
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Citation
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

