/**
 * Home Page
 * Landing page with hero, focus areas, stats, featured projects, and CTA
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Hero from '../components/common/Hero';
import Stats from '../components/common/Stats';
import CallToAction from '../components/common/CallToAction';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import { loadProjectsData } from '../utils/dataLoader';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    loadProjectsData().then((projects) => {
      // Get first 3 active projects
      const active = projects.filter((p) => p.status === 'active').slice(0, 3);
      setFeaturedProjects(active);
    });
  }, []);

  const focusAreas = [
    {
      title: 'Food Security',
      description:
        'Advancing research to ensure global food security through data-driven insights and evidence-based policy recommendations.',
      icon: '🌾',
    },
    {
      title: 'Climate Resilience',
      description:
        'Developing strategies to help food systems adapt to climate change and build resilience in vulnerable communities.',
      icon: '🌍',
    },
    {
      title: 'Nutrition Equity',
      description:
        'Addressing nutrition disparities and ensuring equitable access to healthy, affordable food for all populations.',
      icon: '⚖️',
    },
    {
      title: 'Innovation',
      description:
        'Leveraging technology and innovation to transform food systems and improve outcomes for farmers and consumers.',
      icon: '💡',
    },
  ];

  const stats = [
    { value: '150+', label: 'Countries Tracked' },
    { value: '50+', label: 'Research Projects' },
    { value: '200+', label: 'Publications' },
    { value: '100+', label: 'Partners' },
  ];

  return (
    <PageWrapper>
      <Hero
        title="Advancing Global Food Systems Research"
        subtitle="International Consortium"
        description="We are a global research organization dedicated to understanding and improving food systems worldwide. Through innovative research, data-driven insights, and collaborative partnerships, we work to ensure food security, nutrition equity, and sustainable agriculture for all."
        primaryCTA={{ label: 'Explore Our Research', href: '/projects' }}
        secondaryCTA={{ label: 'Meet the Team', href: '/team' }}
        image="/images/hero.jpg"
      />

      <Stats stats={stats} />

      {/* Focus Areas */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Focus Areas"
            description="We address critical challenges in global food systems through interdisciplinary research and collaboration."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {focusAreas.map((area, index) => (
              <Card key={index} className="text-center">
                <div className="text-5xl mb-4">{area.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {area.title}
                </h3>
                <p className="text-gray-600">{area.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Featured Projects"
            description="Explore our active research initiatives making an impact on global food systems."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <Card key={index}>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {project.start_year} - {project.end_year || 'Ongoing'}
                  </span>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                    >
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button href="/projects" size="lg">
              View All Projects
            </Button>
          </div>
        </div>
      </section>

      <CallToAction
        title="Join Us in Building Better Food Systems"
        description="Partner with us to advance food security research and create lasting impact."
        primaryCTA={{ label: 'Get in Touch', href: '/contact' }}
        secondaryCTA={{ label: 'Learn More', href: '/about' }}
      />
    </PageWrapper>
  );
}

