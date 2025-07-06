import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/Card'; // Assuming these exist and are styled
import { Button } from './ui/Button'; // Assuming this handles disabled/loading states visually
import { useChampionStore } from '../store/championStore';
// import { Loader2 } from 'lucide-react'; // Example: Import a spinner icon if desired

export const ChampionSignUpForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added for loading state
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const setChampionInfo = useChampionStore(state => state.setChampionInfo);

  const handleSubmit = async (e: React.FormEvent) => { // Make async if store/API call is async
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);

    // Simulate submission delay / potential API call
    // In a real app, you might await an API call here
    // setChampionInfo(firstName, email); // Assuming this is synchronous

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    setChampionInfo(firstName, email); // Update store after simulated delay/call
    setSubmitted(true);
    setIsLoading(false);

    // Optional: Navigate immediately or after a very short delay
    // Kept the 2-second delay for reading the message as per original logic,
    // but the loading state improves UX during the wait.
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (submitted) {
    return (
      <Card>
        {/* Added aria-live for screen reader announcements */}
        <CardContent className="p-6 text-center sm:p-8" aria-live="polite">
          <h2 className="text-2xl font-bold mb-4">Thank you, Champion {firstName}!</h2>
          {/* Used slightly more muted color from Tailwind palette if appropriate */}
          <p className="text-muted-foreground"> {/* Or stick with text-gray-600 if preferred */}
            Your email has been received. We'll notify you when your CRC-Safe Dashboard is ready.
          </p>
          {/* Optional: Add a visual cue like a checkmark icon */}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 sm:p-8"> {/* Example: Responsive padding */}
        <h2 className="text-2xl font-bold mb-6">Join as a Champion</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1"> {/* text-foreground or text-gray-700 */}
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName" // Added name attribute
              required
              aria-required="true" // Added aria-required
              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50" // Example: Using common Shadcn/ui-like classes - ADJUST if using plain HTML/Tailwind
              // Or keep original closer style: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane" // Added placeholder
              disabled={isLoading} // Disable input when loading
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1"> {/* text-foreground or text-gray-700 */}
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email" // Added name attribute
              required
              aria-required="true" // Added aria-required
              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50" // Example: Using common Shadcn/ui-like classes - ADJUST if using plain HTML/Tailwind
               // Or keep original closer style: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane.doe@email.com" // Added placeholder
              disabled={isLoading} // Disable input when loading
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Example spinner */}
                Submitting...
              </>
            ) : (
              'Champion Sign-Up'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};