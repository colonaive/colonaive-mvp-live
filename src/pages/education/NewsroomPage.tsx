import React from 'react';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, ArrowRight, Tag } from 'lucide-react';

const newsItems = [
  {
    title: "Project COLONAiVE™ Launches National Movement",
    date: "March 1, 2025",
    tag: "Press Release",
    excerpt: "A groundbreaking initiative to eliminate colorectal cancer as a major health threat in Singapore by 2045 through early detection and prevention.",
    link: "/about-us"
  },
  {
    title: "New Study Shows Promise in Early Detection",
    date: "February 15, 2025",
    tag: "Research",
    excerpt: "Recent findings demonstrate the effectiveness of combined screening approaches in reducing colorectal cancer mortality rates.",
    link: "/education/clinicians"
  },
  {
    title: "Corporate Champions Join the Movement",
    date: "February 1, 2025",
    tag: "Partnership",
    excerpt: "Leading organizations commit to supporting nationwide colorectal cancer screening initiatives through CSR programs.",
    link: "/csr-showcase"
  }
];

const NewsroomPage: React.FC = () => {
  return (
    <div className="pt-32">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Newspaper className="h-12 w-12 text-white mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-6">Newsroom</h1>
            <p className="text-xl mb-0">
              Stay updated with the latest news and developments in our fight against colorectal cancer.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="max-w-4xl mx-auto py-12">
          <div className="grid gap-6">
            {newsItems.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{item.date}</span>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      {item.tag}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                  <p className="text-gray-600 mb-4">{item.excerpt}</p>
                  <Link to={item.link}>
                    <Button variant="outline" className="group">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-none">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Stay Informed</h2>
                <p className="text-gray-700 mb-6">
                  Subscribe to our newsletter for the latest updates on our movement and colorectal cancer prevention.
                </p>
                <Button>Subscribe to Updates</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NewsroomPage;