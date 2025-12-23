/**
 * Projects Page
 * Displays projects loaded from CSV with filtering
 */

import { useEffect, useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { loadProjectsData, formatYearRange } from '../utils/dataLoader';
import { ExternalLink } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProjectsData().then((data) => {
      setProjects(data);
      setFilteredProjects(data);
    });
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((p) => p.status.toLowerCase() === filter.toLowerCase())
      );
    }
  }, [filter, projects]);

  const filters = [
    { value: 'all', label: 'All Projects' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <PageWrapper>
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Projects"
            description="Research initiatives addressing critical challenges in global food systems."
          />

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === f.value
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <Card key={index}>
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant={
                      project.status === 'active' ? 'active' : 'completed'
                    }
                  >
                    {project.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {formatYearRange(project.start_year, project.end_year)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-4">
                  {project.description}
                </p>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                  >
                    Learn more
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                )}
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No projects found with the selected filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}

