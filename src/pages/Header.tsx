// ✅ REMOVED the duplicate function from this file.

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const [isTrialsHovered, setIsTrialsHovered] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const menuLeaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const headerRef = useRef<HTMLElement>(null);
    const { user, isAuthenticated, signOut, userType } = useAuth();

    const joinLinks = getJoinLinks(isAuthenticated);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchQuery('');
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    const handleClose = () => {
      setIsOpen(false);
      setActiveSubmenu(null);
    };

    const handleMenuEnter = (menuKey: string) => {
      if (menuLeaveTimeout.current) clearTimeout(menuLeaveTimeout.current);
      setActiveSubmenu(menuKey);
    };

    const handleMenuLeave = () => {
      menuLeaveTimeout.current = setTimeout(() => {
        setActiveSubmenu(null);
      }, 200);
    };

    const handleSignOut = async () => {
      const { error } = await signOut();
      if (error) {
        alert(`Sign out failed: ${error.message}`);
      } else {
        navigate('/'); 
      }
    };

    const renderChampionButton = () => {
      if (isAuthenticated && user) {
        const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        // Using the centralized, correct function
        const dashboardPath = getDashboardRoute(userType);

        // This logic must also use the correct 'gpclinic' value
        let profileSettingsPath = '/profile/champion';
        if (userType === 'gpclinic') {
          profileSettingsPath = '/profile/gp-clinic';
        } else if (userType === 'specialist') {
          profileSettingsPath = '/profile/specialist';
        } else if (userType === 'corporate_contact') {
          profileSettingsPath = '/dashboard/corporate';
        }
      }
    }
}