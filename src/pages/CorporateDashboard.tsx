import React, { useState, useEffect } from 'react';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Calendar, 
  Award, 
  FileText, 
  Heart, 
  Bell, 
  ChevronRight,
  Target,
  Zap,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

// Define the shape of our dashboard data
interface DashboardData {
  companyName: string;
  tier: string | null;
  livesImpacted: number;
  screeningsFunded: number;
  earlyDetections: number;
  employeeParticipation: number;
  partnershipStartDate: string;
  nextEvent?: string;
}

const CorporateDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError("You must be logged in to view this page.");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching corporate data for user:", user.id);

        // First, get the user's profile to confirm they're a corporate contact
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('user_type, corporate_id')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw new Error("Could not verify your account type.");
        }

        if (profileData.user_type !== 'corporate_contact') {
          throw new Error("You don't have access to the corporate dashboard.");
        }

        // Get corporate details using the corporate_id from the profile
        const corporateId = profileData.corporate_id;
        if (!corporateId) {
          throw new Error("Your account is not linked to a company.");
        }

        // Get company name
        const { data: corporateData, error: corporateError } = await supabase
          .from('corporates')
          .select('company_name')
          .eq('id', corporateId)
          .single();

        if (corporateError) {
          console.error("Corporate fetch error:", corporateError);
          throw new Error("Could not fetch company information.");
        }

        // Get sponsorship details
        const { data: sponsorshipData, error: sponsorshipError } = await supabase
          .from('corporate_sponsorships')
          .select('pledge_amount, sponsorship_tier, created_at')
          .eq('corporate_id', corporateId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (sponsorshipError && sponsorshipError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error("Sponsorship fetch error:", sponsorshipError);
          throw new Error("Could not fetch sponsorship details.");
        }

        // Get the CRC test unit cost to calculate impact
        const { data: costData, error: costError } = await supabase
          .from('app_settings')
          .select('setting_value')
          .eq('setting_name', 'crc_test_unit_cost')
          .single();

        const unitCost = costData?.setting_value?.cost || 355; // Default to 355 if not found

        // Calculate impact metrics
        const pledgeAmount = sponsorshipData?.pledge_amount || 0;
        const livesImpacted = Math.floor(Number(pledgeAmount) / unitCost);

        // Assemble the dashboard data
        const dashboardData: DashboardData = {
          companyName: corporateData.company_name,
          tier: sponsorshipData?.sponsorship_tier || 'Partner',
          livesImpacted: livesImpacted,
          screeningsFunded: livesImpacted,
          earlyDetections: Math.floor(livesImpacted * 0.05), // Estimate: 5% of screenings detect early issues
          employeeParticipation: 1, // Default to 1 (the contact person)
          partnershipStartDate: sponsorshipData ? new Date(sponsorshipData.created_at).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          }) : new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          }),
          nextEvent: 'Quarterly Impact Review - ' + new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
          })
        };

        setData(dashboardData);
      } catch (err: any) {
        console.error("Dashboard error:", err);
        setError(err.message || "An unexpected error occurred while fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-lg text-gray-600">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <h2>Loading Corporate Dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-32 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-red-600">Dashboard Error</h2>
          <p className="text-gray-700 mb-6">{error || "Could not load dashboard data."}</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-32">
      <Container className="py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{data.companyName}</h1>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">Corporate CSR Partner</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-sm font-medium px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                    {data.tier}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              View Partnership Agreement
            </Button>
            <Bell className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Lives Impacted</p>
                  <p className="text-3xl font-bold text-blue-800">{data.livesImpacted}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-green-700 font-medium">Screenings Funded</p>
                  <p className="text-3xl font-bold text-green-800">{data.screeningsFunded}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Early Detections</p>
                  <p className="text-3xl font-bold text-purple-800">{data.earlyDetections}</p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-0">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-amber-700 font-medium">Employee Participation</p>
                  <p className="text-3xl font-bold text-amber-800">{data.employeeParticipation}</p>
                </div>
                <Heart className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Partnership Overview */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    Partnership Overview
                  </h2>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Partnership Start</p>
                      <p className="font-medium">{data.partnershipStartDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Current Tier</p>
                      <p className="font-medium">{data.tier}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg mt-4">
                  <h3 className="font-medium text-blue-800 mb-2">Tier Upgrade Progress</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '47%' }}></div>
                  </div>
                  <p className="text-sm text-blue-700">
                    {data.livesImpacted}/500 lives impacted (47%) toward Platinum Champion tier
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Impact Report */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Impact Report
                  </h2>
                  <Button variant="outline" size="sm">Download PDF</Button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm text-gray-500 mb-1">Screenings Funded</p>
                      <p className="text-2xl font-bold text-blue-600">{data.screeningsFunded}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm text-gray-500 mb-1">Early Detections</p>
                      <p className="text-2xl font-bold text-green-600">{data.earlyDetections}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">Health Impact</h3>
                    <p className="text-sm text-green-700">
                      Your company's contribution has potentially saved {data.earlyDetections} lives through early detection, 
                      and provided peace of mind to {data.screeningsFunded - data.earlyDetections} individuals with negative results.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Upcoming Events
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800">{data.nextEvent || 'Quarterly Impact Review - June 1, 2025'}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-blue-600">Employee Wellness Program</p>
                      <Button variant="outline" size="sm" className="text-xs py-1 px-2">Details</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="font-medium">CSR Planning Session</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-600">Coming Soon</p>
                      <Button variant="outline" size="sm" className="text-xs py-1 px-2">Schedule</Button>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">View All Events</Button>
              </CardContent>
            </Card>
            
            {/* Quick Links */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                
                <div className="space-y-2">
                  <Link to="/corporate/employee-screening" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg group">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span>Employee Screening Program</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </Link>
                  
                  <Link to="/corporate/marketing-assets" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg group">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span>Marketing Assets</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </Link>
                  
                  <Link to="/corporate/impact-dashboard" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg group">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span>Impact Dashboard</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Support */}
            <Card className="bg-gradient-to-br from-blue-50 to-teal-50 border-0">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Need Support?</h2>
                <p className="text-gray-700 mb-4">
                  Our dedicated CSR partnership team is here to help you maximize your impact.
                </p>
                <Button className="w-full">Contact CSR Team</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CorporateDashboard;