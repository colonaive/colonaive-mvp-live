import React from 'react';
import { Container } from '../../../components/ui/Container';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  Search,
  Clock,
  ShieldCheck,
  Microscope,
  AlertCircle,
  CalendarCheck,
  HeartPulse,
  Users,
  CheckCircle,
  Utensils,
  Droplets,
  Moon,
  ArrowRight,
  Shield,
  Heart,
  UserCheck,
  Timer,
  Coffee,
  Zap
} from 'lucide-react';

const ColonoscopyGoldStandard: React.FC = () => {
  const benefits = [
    {
      icon: <Search className="h-6 w-6 text-blue-500" />,
      title: "Detection + Removal",
      description: "Finds and removes precancerous polyps in a single session"
    },
    {
      icon: <Microscope className="h-6 w-6 text-teal-500" />,
      title: "Comprehensive View",
      description: "Complete visualization of the colon and rectum"
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-500" />,
      title: "Long Interval",
      description: "Only needed once every 10 years with normal results"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-green-500" />,
      title: "Life-Saving Potential",
      description: "Dramatically reduces CRC incidence and mortality"
    }
  ];

  const preparationSteps = [
    {
      day: "3 Days Before",
      icon: <Utensils className="h-6 w-6 text-orange-500" />,
      title: "Start Low-Fiber Diet",
      instructions: [
        "Avoid whole grains, nuts, seeds, popcorn",
        "No raw fruits or vegetables with skin/seeds",
        "Choose white bread, white rice, lean meats",
        "Avoid quinoa, brown rice, or fibrous foods"
      ]
    },
    {
      day: "1 Day Before",
      icon: <Droplets className="h-6 w-6 text-blue-500" />,
      title: "Clear Liquids Only",
      instructions: [
        "Water, clear broths, plain gelatin",
        "Apple juice, white grape juice, sports drinks",
        "Coffee/tea (no milk or cream)",
        "Avoid red, purple, or orange colored liquids"
      ]
    },
    {
      day: "Evening Before",
      icon: <Moon className="h-6 w-6 text-purple-500" />,
      title: "Bowel Preparation",
      instructions: [
        "Take prescribed laxative as directed",
        "Stay near bathroom for 3-4 hours",
        "Drink plenty of clear fluids",
        "Continue until stools are clear like urine"
      ]
    }
  ];

  const comfortTips = [
    {
      icon: <Shield className="h-5 w-5 text-green-600" />,
      tip: "Use diaper cream or petroleum jelly around the anal area before prep starts"
    },
    {
      icon: <Coffee className="h-5 w-5 text-brown-600" />,
      tip: "Chill your prep solution and use a straw to make it more palatable"
    },
    {
      icon: <Heart className="h-5 w-5 text-red-600" />,
      tip: "Stay in the bathroom with entertainment (books, tablet, phone charger)"
    },
    {
      icon: <Zap className="h-5 w-5 text-yellow-600" />,
      tip: "Use soft, gentle toilet paper or moist wipes for comfort"
    }
  ];

  const considerations = [
    {
      age: "45+",
      description: "New recommended age to begin screening for average-risk individuals",
      note: "Lowered from 50 due to rising rates in younger adults"
    },
    {
      age: "40+",
      description: "Consider starting earlier if you have:",
      factors: [
        "Family history of CRC or polyps",
        "Personal history of inflammatory bowel disease",
        "Certain inherited syndromes (Lynch syndrome, FAP)",
        "African ancestry (higher risk group)"
      ]
    }
  ];

  return (
    <div className="pt-32">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6">Why Colonoscopy Is Still the Gold Standard</h1>
            <p className="text-lg sm:text-xl mb-4">
              Understanding the most effective tool for colorectal cancer prevention and early detection.
            </p>
            <p className="text-base opacity-90">
              Safe, comfortable, and life-saving when done by experienced professionals
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            
            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-xl text-gray-600">
                When it comes to preventing colorectal cancer (CRC), no tool has proven more effective than colonoscopy.
                Its unique ability to both detect and remove precancerous polyps makes it the gold standard in CRC prevention.
              </p>
            </div>

            {/* Safety and Comfort Reassurance */}
            <div className="bg-green-50 border-l-4 border-green-500 p-8 rounded-r-lg mb-12">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-green-800 mb-4">You're in Safe, Expert Hands</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-green-700 mb-2">During the Procedure:</h3>
                      <ul className="text-green-700 space-y-1">
                        <li>• Most patients sleep comfortably under sedation</li>
                        <li>• Procedure typically takes 30-60 minutes</li>
                        <li>• Performed by trained colorectal surgeons/gastroenterologists</li>
                        <li>• Continuous monitoring of vital signs</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-700 mb-2">What You'll Feel:</h3>
                      <ul className="text-green-700 space-y-1">
                        <li>• Minimal to no discomfort with sedation</li>
                        <li>• Slight gas pressure (normal and temporary)</li>
                        <li>• Like a comfortable nap for most patients</li>
                        <li>• Wake up feeling refreshed and relieved</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Colonoscopy Matters */}
            <h2 className="text-2xl font-bold mb-6">Why Colonoscopy Matters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div aria-hidden="true" className="flex-shrink-0">{benefit.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Preparation Instructions */}
            <h2 className="text-2xl font-bold mb-6">Complete Preparation Guide</h2>
            <p className="text-gray-600 mb-8">
              <cite index="53-1">Proper preparation is essential to a successful colonoscopy.</cite> Follow these step-by-step instructions to ensure the best possible results:
            </p>

            <div className="space-y-8 mb-12">
              {preparationSteps.map((step, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 md:w-1/3">
                        <div className="flex items-center gap-3 mb-4">
                          {step.icon}
                          <div>
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{step.day}</div>
                            <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 md:w-2/3">
                        <ul className="space-y-2">
                          {step.instructions.map((instruction, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{instruction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comfort Tips */}
            <div className="bg-blue-50 rounded-lg p-8 mb-12">
              <h3 className="text-xl font-bold text-blue-800 mb-6 text-center">Tips for Maximum Comfort During Prep</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comfortTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {tip.icon}
                    <span className="text-blue-700">{tip.tip}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-blue-700 text-center font-medium">
                  <cite index="54-1">Remember: The prep process may be temporarily inconvenient, but it might help save your life.</cite>
                </p>
              </div>
            </div>

            {/* What to Expect During Procedure */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 mb-12">
              <h2 className="text-2xl font-bold text-center mb-6">What to Expect During Your Colonoscopy</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <UserCheck className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Before You Start</h3>
                  <p className="text-sm text-gray-600">You'll change into a comfortable gown and have an IV placed for sedation</p>
                </div>
                <div className="text-center">
                  <Timer className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">During the Procedure</h3>
                  <p className="text-sm text-gray-600">You'll sleep comfortably while the doctor examines your colon using a flexible scope</p>
                </div>
                <div className="text-center">
                  <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">After You Wake Up</h3>
                  <p className="text-sm text-gray-600">Recovery is quick - most patients feel normal within a few hours</p>
                </div>
              </div>
            </div>

            {/* When Should You Consider Colonoscopy */}
            <h2 className="text-2xl font-bold mb-6">When Should You Consider Colonoscopy?</h2>
            <div className="space-y-6 mb-12">
              {considerations.map((item, index) => (
                <Card key={index} className="bg-gradient-to-r from-gray-50 to-white">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="sm:w-16 flex-shrink-0 text-left sm:text-center mb-2 sm:mb-0">
                        <div className="text-3xl font-bold text-blue-600">{item.age}</div>
                      </div>
                      <div className="flex-grow">
                        <p className="text-lg font-semibold mb-2">{item.description}</p>
                        {item.factors && (
                          <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            {item.factors.map((factor, idx) => (
                              <li key={idx}>{factor}</li>
                            ))}
                          </ul>
                        )}
                        {item.note && (
                          <p className="text-gray-600 mt-2 italic">{item.note}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Reassuring Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-gradient-to-b from-blue-50 to-white text-center">
                <CardContent className="p-6">
                  <HeartPulse aria-hidden="true" className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                  <p className="text-gray-600">Prevention rate when polyps are removed early</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-b from-teal-50 to-white text-center">
                <CardContent className="p-6">
                  <CalendarCheck aria-hidden="true" className="h-8 w-8 text-teal-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-teal-600 mb-2">10</div>
                  <p className="text-gray-600">Years between screenings with normal results</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-b from-purple-50 to-white text-center">
                <CardContent className="p-6">
                  <Users aria-hidden="true" className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-purple-600 mb-2">60%</div>
                  <p className="text-gray-600">Reduction in CRC deaths through screening</p>
                </CardContent>
              </Card>
            </div>

            {/* Key Reminder */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-12">
              <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" aria-hidden="true" />
                Remember
              </h3>
              <p className="text-blue-700">
                <cite index="52-1">Most colorectal cancers begin as benign polyps. Removing them early through colonoscopy can literally prevent cancer from developing.</cite> This simple procedure could be the most important 60 minutes of your life.
              </p>
            </div>

            {/* Enhanced Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-8 text-white text-center">
              <div className="flex items-center justify-center mb-6">
                <CheckCircle className="h-12 w-12 text-green-300" />
              </div>
              <h2 className="text-2xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
              <p className="text-lg mb-8 opacity-90">
                A colonoscopy remains the gold standard for preventing colorectal cancer. The preparation is temporary, but the peace of mind lasts a lifetime.
              </p>
              
              <div className="space-y-4 max-w-lg mx-auto">
                <h3 className="text-xl font-bold">Take the first step today:</h3>
                <Link to="/find-a-specialist" className="block">
                  <Button className="w-full py-3 text-lg bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                    Book a Colonoscopy Consultation with a Specialist
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/find-a-gp" className="block">
                  <Button variant="outline" className="w-full py-3 text-lg border-white text-white hover:bg-white hover:text-blue-600 font-semibold">
                    Discuss Screening Options with a GP
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              
              <p className="mt-8 opacity-75 italic">
                Project COLONAiVE™ is here to support you on your journey toward early detection, prevention, and peace of mind.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default ColonoscopyGoldStandard;