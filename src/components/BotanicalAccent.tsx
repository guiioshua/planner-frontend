import { cn } from "@/lib/utils";

interface BotanicalAccentProps {
  className?: string;
  variant?: "branch" | "leaf" | "corner";
}

export function BotanicalAccent({ className, variant = "branch" }: BotanicalAccentProps) {
  if (variant === "branch") {
    return (
      <svg viewBox="0 0 200 60" fill="none" className={cn("text-champagne", className)} xmlns="http://www.w3.org/2000/svg">
        <path d="M10 50 Q50 20 100 30 T190 15" stroke="currentColor" strokeWidth="0.8" fill="none" />
        <path d="M60 35 Q55 20 70 15" stroke="currentColor" strokeWidth="0.6" fill="none" />
        <path d="M90 28 Q85 15 100 10" stroke="currentColor" strokeWidth="0.6" fill="none" />
        <path d="M120 25 Q125 12 140 18" stroke="currentColor" strokeWidth="0.6" fill="none" />
        <path d="M150 18 Q145 5 160 8" stroke="currentColor" strokeWidth="0.6" fill="none" />
        <ellipse cx="70" cy="13" rx="4" ry="7" stroke="currentColor" strokeWidth="0.5" fill="none" transform="rotate(-20 70 13)" />
        <ellipse cx="100" cy="8" rx="4" ry="7" stroke="currentColor" strokeWidth="0.5" fill="none" transform="rotate(-10 100 8)" />
        <ellipse cx="142" cy="16" rx="3" ry="6" stroke="currentColor" strokeWidth="0.5" fill="none" transform="rotate(15 142 16)" />
      </svg>
    );
  }

  if (variant === "leaf") {
    return (
      <svg viewBox="0 0 40 60" fill="none" className={cn("text-champagne", className)} xmlns="http://www.w3.org/2000/svg">
        <path d="M20 55 Q5 30 20 5 Q35 30 20 55Z" stroke="currentColor" strokeWidth="0.6" fill="none" />
        <path d="M20 50 L20 10" stroke="currentColor" strokeWidth="0.4" fill="none" />
        <path d="M20 20 Q12 25 8 22" stroke="currentColor" strokeWidth="0.4" fill="none" />
        <path d="M20 30 Q28 35 32 32" stroke="currentColor" strokeWidth="0.4" fill="none" />
        <path d="M20 40 Q12 45 8 42" stroke="currentColor" strokeWidth="0.4" fill="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 80" fill="none" className={cn("text-champagne", className)} xmlns="http://www.w3.org/2000/svg">
      <path d="M5 75 Q5 5 75 5" stroke="currentColor" strokeWidth="0.6" fill="none" />
      <path d="M15 60 Q10 50 20 45" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <path d="M30 40 Q20 35 30 25" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <path d="M50 22 Q40 18 48 10" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <ellipse cx="22" cy="43" rx="3" ry="6" stroke="currentColor" strokeWidth="0.4" fill="none" transform="rotate(-30 22 43)" />
      <ellipse cx="32" cy="23" rx="3" ry="5" stroke="currentColor" strokeWidth="0.4" fill="none" transform="rotate(-20 32 23)" />
    </svg>
  );
}
