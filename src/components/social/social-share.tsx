"use client";

import { useState } from "react";
import { Share2, Twitter, Facebook, Linkedin, Link, Copy } from "lucide-react";

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  via?: string; // Twitter handle without @
  className?: string;
}

/**
 * Social Share Component
 *
 * Provides buttons for sharing content on various social media platforms
 * and copying the link to clipboard.
 */
export function SocialShare({
  url = typeof window !== "undefined" ? window.location.href : "",
  title = "Check this out!",
  description = "",
  hashtags = [],
  via,
  className = "",
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const hashtagString = hashtags.join(",");

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${via ? `&via=${via}` : ""}${hashtagString ? `&hashtags=${hashtagString}` : ""}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
    setShowDropdown(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        setShowDropdown(false);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        aria-label="Share this content"
      >
        <Share2 size={16} />
        Share
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-20">
            <div className="py-2">
              {/* Native Share (if supported) */}
              {"share" in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-3"
                >
                  <Share2 size={16} />
                  Share...
                </button>
              )}

              {/* Twitter */}
              <button
                onClick={() => handleShare("twitter")}
                className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-3"
              >
                <Twitter size={16} />
                Twitter
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleShare("facebook")}
                className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-3"
              >
                <Facebook size={16} />
                Facebook
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => handleShare("linkedin")}
                className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-3"
              >
                <Linkedin size={16} />
                LinkedIn
              </button>

              <hr className="my-2" />

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-3"
              >
                {copied ? (
                  <Copy size={16} className="text-green-600" />
                ) : (
                  <Link size={16} />
                )}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
