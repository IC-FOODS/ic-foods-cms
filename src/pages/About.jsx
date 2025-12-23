/**
 * About Page
 * Information about the organization, mission, and values
 */

import PageWrapper from '../components/layout/PageWrapper';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';

export default function About() {
  const values = [
    {
      title: 'Excellence',
      description:
        'We maintain the highest standards in research methodology, data quality, and scientific rigor.',
    },
    {
      title: 'Collaboration',
      description:
        'We believe in the power of partnerships and work closely with researchers, policymakers, and communities worldwide.',
    },
    {
      title: 'Impact',
      description:
        'Our research is designed to create real-world change and improve food systems for people everywhere.',
    },
    {
      title: 'Transparency',
      description:
        'We are committed to open science, data sharing, and making our findings accessible to all.',
    },
  ];

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About IC-FOODS
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            The International Consortium for Food Systems Research (IC-FOODS)
            is a global research organization dedicated to advancing
            understanding of food systems and improving food security,
            nutrition, and sustainability worldwide.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                To conduct world-class research that informs evidence-based
                policies and practices, ultimately improving food security,
                nutrition equity, and the sustainability of food systems
                globally.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We bring together researchers, policymakers, practitioners, and
                communities to address the complex challenges facing our global
                food systems, from climate change and resource scarcity to
                nutrition disparities and supply chain vulnerabilities.
              </p>
            </div>
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                A world where all people have access to safe, nutritious, and
                affordable food, produced through sustainable and equitable food
                systems that support both human well-being and planetary health.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Values"
            description="The principles that guide our work and shape our organization."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index}>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Approach"
            description="How we work to achieve our mission."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <div className="text-4xl font-bold text-primary-600 mb-4">01</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Interdisciplinary Research
              </h3>
              <p className="text-gray-600">
                We bring together experts from diverse fields including
                agriculture, nutrition, economics, data science, and policy to
                address complex food system challenges.
              </p>
            </Card>
            <Card>
              <div className="text-4xl font-bold text-primary-600 mb-4">02</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Data-Driven Insights
              </h3>
              <p className="text-gray-600">
                We leverage cutting-edge data science, machine learning, and
                remote sensing technologies to generate actionable insights from
                vast datasets.
              </p>
            </Card>
            <Card>
              <div className="text-4xl font-bold text-primary-600 mb-4">03</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Global Collaboration
              </h3>
              <p className="text-gray-600">
                We work with partners across continents, from leading universities
                to local communities, ensuring our research is globally relevant
                and locally applicable.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

