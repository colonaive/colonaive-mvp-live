import ShareYourStoryForm from "../components/ShareYourStoryForm";
import { supabase } from "../supabase";
import { toast } from "../utils/toast";

export default function ShareYourStoryPage() {
  const handleSubmit = async (data: any) => {
    const user = supabase.auth.user();

    if (!user) {
      toast.error("You must be logged in to share your story.");
      return false; // ❗ prevents success toast in form
    }

    const { error } = await supabase.from("stories").insert([
      {
        user_id: user.id,
        story_type: data.storyType,
        experience_type: data.experienceType,
        location: data.location,
        content: data.content,
        is_public: data.isPublic,
        anonymous: data.anonymous,
        can_contact: data.canContact,
        submitted_at: new Date().toISOString(),
        approved: false,
        published_at: null
      }
    ]);

    if (error) {
      console.error("Error submitting story:", error);
      toast.error("Something went wrong while submitting your story.");
      return false;
    }

    return true; // ✅ tells form to show toast and reset
  };

  return (
    <div className="py-10">
      <ShareYourStoryForm onSubmit={handleSubmit} />
    </div>
  );
}
