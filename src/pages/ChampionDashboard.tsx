import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  UserCircle2, Rocket, MessageCircleHeart, Building2, HeartPulse, Target,
  Calendar, Medal, Bell
} from 'lucide-react';
import { supabase } from '../supabase';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import ShareTheMovement from '../components/common/ShareTheMovement';

// The full, original roleConfig is preserved.
const roleConfig: Record<string, any> = {
  citizen: {
    title: "Citizen Champion",
    icon: <UserCircle2 className="h-12 w-12 text-white" />,
    intro: "Thank you for stepping up to support CRC awareness. Together, we are saving lives.",
    actions: [
      { title: "Take the CRC Quiz", description: "Test your knowledge and share with friends", link: "/quiz", icon: <Target className="h-7 w-7" />, color: "yellow" },
      { title: "Book Screening", description: "Schedule your CRC screening appointment", link: "/get-screened", icon: <Calendar className="h-7 w-7" />, color: "green" },
      { title: "Share Your Story", description: "Inspire others with your journey", link: "/share-your-story", icon: <MessageCircleHeart className="h-7 w-7" />, color: "purple" },
      { title: "Refer a Friend", description: "Invite friends to join the movement", link: "/refer-friend", icon: <UserCircle2 className="h-7 w-7" />, color: "pink" }
    ],
    stats: [
      { label: "Quiz Score", value: "0%", icon: <Medal className="h-8 w-8 text-yellow-500" /> },
      { label: "Friends Invited", value: "0", icon: <UserCircle2 className="h-8 w-8 text-blue-500" /> },
      { label: "Actions Completed", value: "0/5", icon: <Target className="h-8 w-8 text-green-500" /> }
    ]
  },
  healthcare: {
    title: "Healthcare Champion",
    icon: <HeartPulse className="h-12 w-12 text-white" />,
    intro: "You're a crucial force in prevention and early detection. Let's protect lives, one patient at a time.",
    actions: [
      { title: "Register Your Clinic", description: "Add your practice to our network", link: "/signup/clinic", icon: <Building2 className="h-7 w-7" />, color: "blue" },
      { title: "Host a CRC Talk", description: "Organize an awareness session", link: "/host-talk", icon: <MessageCircleHeart className="h-7 w-7" />, color: "teal" },
      { title: "Access Resources", description: "Clinical guidelines and materials", link: "/education/resources", icon: <Rocket className="h-7 w-7" />, color: "purple" }
    ],
    stats: [
      { label: "Patients Screened", value: "0", icon: <UserCircle2 className="h-8 w-8 text-blue-500" /> },
      { label: "Talks Hosted", value: "0", icon: <MessageCircleHeart className="h-8 w-8 text-teal-500" /> },
      { label: "Resources Accessed", value: "0", icon: <Rocket className="h-8 w-8 text-purple-500" /> }
    ]
  },
  corporate: {
    title: "Corporate Champion",
    icon: <Building2 className="h-12 w-12 text-white" />,
    intro: "Your organisation is leading by example. Thank you for supporting a healthier nation.",
    actions: [
      { title: "Employee Screening", description: "Organize workplace screening", link: "/corporate/screening", icon: <Target className="h-7 w-7" />, color: "blue" },
      { title: "CSR Dashboard", description: "Track your impact metrics", link: "/dashboard/corporate", icon: <Building2 className="h-7 w-7" />, color: "teal" },
      { title: "Access Resources", description: "Access promotional materials", link: "/education/resources", icon: <Rocket className="h-7 w-7" />, color: "purple" }
    ],
    stats: [
      { label: "Employees Screened", value: "0", icon: <UserCircle2 className="h-8 w-8 text-blue-500" /> },
      { label: "Events Organized", value: "0", icon: <Calendar className="h-8 w-8 text-teal-500" /> },
      { label: "Lives Impacted", value: "0", icon: <HeartPulse className="h-8 w-8 text-red-500" /> }
    ]
  },
  community: {
    title: "Community Champion",
    icon: <MessageCircleHeart className="h-12 w-12 text-white" />,
    intro: "Grassroots heroes like you spark real change. Help us reach more people in your network.",
    actions: [
      { title: "Organize Event", description: "Plan a community awareness event", link: "/organize-event", icon: <Calendar className="h-7 w-7" />, color: "blue" },
      { title: "Access Resources", description: "Access outreach materials", link: "/education/resources", icon: <Rocket className="h-7 w-7" />, color: "teal" },
      { title: "Impact Report", description: "Track your community impact", link: "/impact-report", icon: <Target className="h-7 w-7" />, color: "purple" }
    ],
    stats: [
      { label: "Events Organized", value: "0", icon: <Calendar className="h-8 w-8 text-blue-500" /> },
      { label: "People Reached", value: "0", icon: <UserCircle2 className="h-8 w-8 text-teal-500" /> },
      { label: "Resources Shared", value: "0", icon: <Rocket className="h-8 w-8 text-purple-500" /> }
    ]
  }
};

const ChampionDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const role = roleConfig[searchParams.get("role") || "citizen"] ? searchParams.get("role") || "citizen" : "citizen";
  const [championData, setChampionData] = useState(roleConfig[role]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      setLoading(true);
      setError(null); 
      
      try {
        console.log("[ChampionDashboard] Fetching stats for user:", user?.id);
        
        if (!user) {
          throw new Error('User not authenticated.');
        }
        
        // Try to fetch user stats - with error handling if columns don't exist
        const { data, error } = await supabase
          .from('profiles')
          .select('quiz_score, friends_invited, actions_completed')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("[ChampionDashboard] Database error:", error);
          // If specific columns don't exist, use defaults
          if (error.code === 'PGRST116' || error.message.includes('column') || error.message.includes('does not exist')) { 
            console.log("[ChampionDashboard] Using default stats (columns may not exist yet)");
            setChampionDataWithDefaults();
          } else {
            throw new Error(`Database error: ${error.message}`);
          }
        } else {
          console.log("[ChampionDashboard] Successfully fetched user data:", data);
          setChampionDataWithUserData(data);
        }
        
      } catch (err: any) {
        console.error("[ChampionDashboard] Error:", err);
        setError(err.message);
        // Even if there's an error, show the dashboard with default values
        setChampionDataWithDefaults();
      } finally {
        setLoading(false);
      }
    };

    const setChampionDataWithUserData = (data: any) => {
      const newRole = roleConfig[searchParams.get("role") || "citizen"] || roleConfig.citizen;
      const updatedData = { ...newRole };
      updatedData.stats = [
        { label: "Quiz Score", value: `${data.quiz_score || 0}%`, icon: <Medal className="h-8 w-8 text-yellow-500" /> },
        { label: "Friends Invited", value: `${data.friends_invited || 0}`, icon: <UserCircle2 className="h-8 w-8 text-blue-500" /> },
        { label: "Actions Completed", value: `${data.actions_completed || 1}/5`, icon: <Target className="h-8 w-8 text-green-500" /> }
      ];
      setChampionData(updatedData);
    };

    const setChampionDataWithDefaults = () => {
      const newRole = roleConfig[searchParams.get("role") || "citizen"] || roleConfig.citizen;
      const updatedData = { ...newRole };
      // Keep the default stats from roleConfig
      setChampionData(updatedData);
    };

    if (user) {
      fetchUserStats();
    } else {
      setLoading(false);
      setError('Please log in to view your dashboard.');
    }
  }, [user, location.search]);

  const getIconColorStyle = (color: string) => {
    switch(color) {
      case 'yellow': return 'bg-yellow-100 text-yellow-600';
      case 'green': return 'bg-green-100 text-green-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'pink': return 'bg-pink-100 text-pink-600';
      case 'teal': return 'bg-teal-100 text-teal-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };
  
  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading dashboard...</div>;
  
  // Show dashboard even if there was an error fetching stats
  if (error) {
    console.warn("[ChampionDashboard] Showing dashboard with default data due to error:", error);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-block bg-white bg-opacity-20 p-4 rounded-full mb-4">{championData.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">{championData.title}</h1>
          <p className="mt-2 text-lg text-indigo-200 max-w-2xl mx-auto">{championData.intro}</p>
          <div className="absolute top-8 right-8"><Bell className="h-6 w-6 text-white opacity-50 hover:opacity-100 cursor-pointer" /></div>
          {/* Error note only shown in development */}
          {error && process.env.NODE_ENV === 'development' && (
            <div className="mt-4 text-sm text-yellow-200 bg-yellow-600 bg-opacity-30 px-4 py-2 rounded-lg inline-block">
              Dev Note: Database issue - using defaults
            </div>
          )}
        </div>
      </div>
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {championData.stats.map((stat: any) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center gap-3">
              <div className="flex-shrink-0">{stat.icon}</div>
              <div>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-base font-medium text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Recommended Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {championData.actions.map((action: any) => (
              <Link to={action.link} key={action.title} className="group block bg-white rounded-2xl shadow-md p-6 text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1.5">
                <div className={`p-4 rounded-full inline-block ${getIconColorStyle(action.color)}`}>{action.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{action.title}</h3>
                <p className="mt-1 text-gray-500 text-sm">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Share the Movement Section */}
        <div className="mt-16 pt-10 border-t border-gray-200">
          <ShareTheMovement />
        </div>

        <div className="mt-16 pt-10 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Quick Links</h2>
          <div className="flex justify-center flex-wrap gap-4">
            <Button variant="outline" size="lg" asChild><Link to="/education/resources">View Resources</Link></Button>
            <Button variant="outline" size="lg" asChild><Link to="/profile/champion">Edit My Profile</Link></Button>
            <Button variant="outline" size="lg" asChild><Link to="/support">Get Support</Link></Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChampionDashboard;