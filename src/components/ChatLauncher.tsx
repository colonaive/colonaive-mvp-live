import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ChatLauncher Component for Project COLONAiVE™
 *
 * Displays a floating action button (FAB) to initiate a chat.
 * Shows a tooltip on hover and focus.
 */
export function ChatLauncher({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    // Container fixed to bottom-right. z-50 is standard max, use higher if needed.
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Relative container to anchor the absolute tooltip */}
      <div className="relative">
        {/* Tooltip displayed on hover/focus, animated with Framer Motion */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              // Tooltip styles: Consider using theme colors (e.g., bg-neutral-800)
              className="absolute bottom-full right-0 mb-3 rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-white shadow-md whitespace-nowrap"
              // Prevent tooltip from blocking mouse events on the button
              style={{ pointerEvents: "none" }}
              role="tooltip" // Accessibility: Identify element as a tooltip
            >
              {/* Tooltip arrow (decorative) */}
              <div
                className="absolute bottom-[-4px] right-5 h-2 w-2 bg-gray-800 transform rotate-45"
                aria-hidden="true"
              />
              Chat with Us, Champion!
            </motion.div>
          )}
        </AnimatePresence>

        {/* The actual chat button */}
        <motion.button
          type="button" // Explicitly set button type
          aria-label="Open chat" // Accessibility: Crucial for icon-only buttons
          // Show/hide tooltip on hover
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          // Show/hide tooltip on keyboard focus
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          onClick={onClick}
          // Framer Motion animations for interaction feedback
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          // Styling: Rounded FAB with shadow, bg/text colors, hover effect, and focus ring.
          // Consider using semantic theme colors (e.g., bg-primary-600)
          className="group flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 p-3 text-white shadow-lg transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        >
          <MessageSquare
            className="h-6 w-6"
            aria-hidden="true" // Icon is decorative, label is provided by aria-label
          />
        </motion.button>
      </div>
    </div>
  );
}