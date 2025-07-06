import React, { useState, useEffect } from 'react';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { Building2, Users, Heart, Loader2 } from 'lucide-react';
import { supabase } from '../supabase'; // Make sure this path is correct

// Define a type for the showcase data
interface ShowcaseSponsor {
  id: string;
  company_name: string;
  sponsorship_tier: string;
}

// Helper to get tier details
const getTierDetails = (tier: string) => {
    if (tier.toLowerCase().includes('diamond')) {
        return { icon: <Building2 className="mx-auto h-12 w-12 text-blue-600 mb-4" />, borderColor: 'border-blue-600', tierName: 'Diamond Tier' };
    }
    if (tier.toLowerCase().includes('platinum')) {
        return { icon: <Users className="mx-auto h-12 w-12 text-teal-600 mb-4" />, borderColor: 'border-teal-500', tierName: 'Platinum Tier' };
    }
    return { icon: <Heart className="mx-auto h-12 w-12 text-pink-600 mb-4" />, borderColor: 'border-yellow-500', tierName: 'Gold Tier' };
};

const CSRShowcasePage: React.FC = () => {
    const [sponsors, setSponsors] = useState<ShowcaseSponsor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSponsors = async () => {
            setLoading(true);
            const { data, error } = await supabase
              .from('corporate_sponsorships')
              .select(`
                id,
                sponsorship_tier,
                corporates ( company_name )
              `)
              .eq('status', 'active') // Only show active sponsors
              .eq('is_publicly_visible', true) // Only show sponsors who agreed to be public
              .limit(6); // Show up to 6 sponsors

            if (error) {
                console.error("Error fetching showcase sponsors:", error);
            } else if (data) {
                const formattedData = data
                    .filter(item => item.corporates) // Ensure corporate data exists
                    .map(item => ({
                        id: item.id,
                        sponsorship_tier: item.sponsorship_tier || 'Partner',
                        company_name: item.corporates!.company_name
                    }));
                setSponsors(formattedData);
            }
            setLoading(false);
        };
        fetchSponsors();
    }, []);

  return (
    <div className="pt-32">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <Container><div className="text-center max-w-4xl mx-auto"><h1 className="text-4xl md:text-5xl font-bold mb-4">Corporate Champions</h1><p className="text-xl mb-6">Recognizing organizations that lead Singapore's fight against colorectal cancer through their commitment to screening and prevention.</p><Link to="/signup/corporate"><button className="bg-white text-blue-600 font-medium px-6 py-3 rounded-md shadow hover:bg-blue-50 transition">Become a Corporate Champion →</button></Link></div></Container>
      </div>

      {/* CSR Sample Showcase */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Our Esteemed Partners</h2>
            <p className="text-lg text-gray-600">We are proud to partner with organizations committed to creating a healthier Singapore.</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center gap-3 text-lg"><Loader2 className="h-8 w-8 animate-spin" />Loading Partners...</div>
          ) : sponsors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sponsors.map((sponsor) => {
                  const tierDetails = getTierDetails(sponsor.sponsorship_tier);
                  return (
                      <Card key={sponsor.id} className={`border-t-4 ${tierDetails.borderColor}`}>
                          <CardContent className="p-8 text-center">
                              {tierDetails.icon}
                              <h3 className="text-xl font-semibold">{sponsor.company_name}</h3>
                              <p className="text-sm text-gray-500 mb-4">{tierDetails.tierName}</p>
                              {/* You can add a description here if you add it to your table */}
                          </CardContent>
                      </Card>
                  );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500">
                <p>Our partnership program is just getting started.</p>
                <p className="mt-2 font-semibold">Your company could be the first to be featured here!</p>
            </div>
          )}

        </Container>
      </section>
    </div>
  );
};

export default CSRShowcasePage;