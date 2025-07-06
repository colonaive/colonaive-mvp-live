import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    category: "Screening",
    questions: [
      {
        q: "When should I start CRC screening?",
        a: "For average-risk individuals, screening should begin at age 50. However, if you have a family history of colorectal cancer or other risk factors, your doctor may recommend starting earlier."
      },
      {
        q: "What screening options are available?",
        a: "Several options exist including colonoscopy (gold standard), blood-based tests like ColonAiQ®, and FIT tests. Each has its own advantages and your healthcare provider can help determine the best option for you."
      }
    ]
  },
  {
    category: "Symptoms & Risk Factors",
    questions: [
      {
        q: "What are the early warning signs?",
        a: "Early signs may include changes in bowel habits, blood in stool, persistent abdominal discomfort, unexplained weight loss, and fatigue. However, early-stage CRC often has no symptoms, which is why regular screening is crucial."
      },
      {
        q: "What increases my risk of CRC?",
        a: "Risk factors include age (over 50), family history of CRC, certain inherited syndromes, inflammatory bowel disease, obesity, smoking, heavy alcohol use, and a diet high in red/processed meats."
      }
    ]
  },
  {
    category: "Prevention",
    questions: [
      {
        q: "How can I reduce my risk?",
        a: "You can reduce your risk through regular screening, maintaining a healthy weight, eating a diet rich in fruits and vegetables, limiting red meat consumption, staying physically active, avoiding smoking, and limiting alcohol intake."
      },
      {
        q: "Are there any dietary recommendations?",
        a: "A diet high in fiber, fruits, vegetables, and whole grains, while low in processed meats and red meat, may help reduce your risk. Adequate calcium and vitamin D intake may also be beneficial."
      }
    ]
  }
];

const FAQsPage: React.FC = () => {
  return (
    <div className="pt-32">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="h-12 w-12 text-white mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl mb-0">
              Find answers to common questions about colorectal cancer screening, prevention, and early detection.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="max-w-3xl mx-auto py-12">
          {faqs.map((category, index) => (
            <div key={index} className="mb-12 last:mb-0">
              <h2 className="text-2xl font-bold mb-6">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <Card key={faqIndex}>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-3">{faq.q}</h3>
                      <p className="text-gray-600">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              Still have questions? Our Champion Support Team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/clinics">
                <Button variant="primary">
                  Find a Healthcare Provider
                </Button>
              </Link>
              <Link to="/education">
                <Button variant="indigo">
                  Browse Educational Resources
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FAQsPage;