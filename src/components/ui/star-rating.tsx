import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  totalReviews?: number;
  showNumber?: boolean;
  size?: number;
  className?: string;
}

export const StarRating = ({ 
  rating, 
  totalReviews = 0, 
  showNumber = true, 
  size = 16,
  className = ""
}: StarRatingProps) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  // Stelle piene
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={i}
        size={size}
        className="fill-yellow-400 text-yellow-400"
      />
    );
  }

  // Stella parziale
  if (hasHalfStar) {
    stars.push(
      <div key="half" className="relative">
        <Star
          size={size}
          className="text-muted-foreground/30"
        />
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${(rating % 1) * 100}%` }}
        >
          <Star
            size={size}
            className="fill-yellow-400 text-yellow-400"
          />
        </div>
      </div>
    );
  }

  // Stelle vuote
  const remainingStars = 5 - Math.ceil(rating);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(
      <Star
        key={`empty-${i}`}
        size={size}
        className="text-muted-foreground/30"
      />
    );
  }

  if (totalReviews === 0) {
    return (
      <div className={`flex items-center gap-1 text-muted-foreground ${className}`}>
        <span className="text-sm">Nessuna recensione</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {stars}
      </div>
      {showNumber && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating.toFixed(1)} ({totalReviews})
        </span>
      )}
    </div>
  );
};