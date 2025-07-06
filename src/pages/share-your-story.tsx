// /home/project/src/pages/share-your-story.tsx

import { useState } from "react";
import ShareYourStoryForm from "../components/ShareYourStoryForm";
import { SubmissionSuccess } from "../components/SubmissionSuccess";
import { supabase } from "../supabase";
import toast from 'react-hot-toast';
import { MessageSquareHeart } from "lucide-react"; // Import an icon

export default function ShareYourStoryPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (data: any): Promise<boolean> => {
    // ... This entire function remains unchanged and works perfectly ...
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to share your story.");
      return false;
    }
    const { error } = await supabase.from("stories").insert([{
      user_id: user.id,
      story_type: data.storyType,
      experience_type: data.experienceType,
      location: data.location,
      content: data.content,
      is_public: data.isPublic,
      anonymous: data.anonymous,
      can_contact: data.canContact,
      approved: false, 
      submitted_at: new Date().toISOString(),
    }]);
    if (error) {
      console.error("Error submitting story:", error);
      toast.error("Submission failed. Please try again.");
      return false;
    }
    setIsSubmitted(true);
    return true; 
  };

  return (
    // Add background color and padding to match your site's theme
    <div className="bg-gray-50/50">
      <div className="container mx-auto max-w-4xl py-12 md:py-20 px-4">
        
        {/* Conditionally render the success screen or the form */}
        {isSubmitted ? (
          <SubmissionSuccess />
        ) : (
          <>
            {/* NEW: Add a visually appealing header for the page */}
            <div className="text-center mb-10">
              <div className="mx-auto bg-blue-100 rounded-full p-4 w-fit mb-4">
                <MessageSquareHeart className="h-12 w-12 text-blue-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
                Share Your Experience
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Your story can provide hope and valuable insight to others on a similar journey. Thank you for making a difference.
              </p>
            </div>
            
            <ShareYourStoryForm onSubmit={handleSubmit} />
          </>
        )}
      </div>
    </div>
  );
}