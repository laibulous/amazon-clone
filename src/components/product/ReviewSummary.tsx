import React from 'react';
import { Sparkles, Star } from 'lucide-react';
import { formatReviewCount } from '../../utils/formatters';

interface ReviewSummaryProps {
  rating: number;
  reviewCount: number;
  productTitle: string;
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  rating,
  reviewCount,
  productTitle,
}) => {
  // Hardcoded realistic sentiment breakdown based on rating and product title
  const getSentimentText = () => {
    const shortTitle = productTitle.split(' ').slice(0, 3).join(' ');
    if (rating >= 4.7) {
      return `Customers overwhelmingly praise the ${shortTitle} for its exceptional build quality, intuitive operation, and reliable everyday performance. Reviewers frequently emphasize its premium aesthetic and great value for money, with many noting it exceeded expectations straight out of the box.`;
    }
    if (rating >= 4.4) {
      return `Customers appreciate the dependable performance, comfortable ergonomics, and thoughtful feature set of the ${shortTitle}. Most verified buyers highlight its consistency and ease of use, with minor mentions of a brief initial learning curve.`;
    }
    return `Customers find the ${shortTitle} practical and functional for daily needs. Reviewers appreciate its straightforward setup and solid basic features, while noting standard tradeoffs expected in this category.`;
  };

  // Realistic rating distribution calculated from overall score
  const getDistribution = (score: number) => {
    if (score >= 4.8) {
      return [
        { stars: 5, percentage: 84 },
        { stars: 4, percentage: 11 },
        { stars: 3, percentage: 3 },
        { stars: 2, percentage: 1 },
        { stars: 1, percentage: 1 },
      ];
    }
    if (score >= 4.5) {
      return [
        { stars: 5, percentage: 76 },
        { stars: 4, percentage: 15 },
        { stars: 3, percentage: 5 },
        { stars: 2, percentage: 2 },
        { stars: 1, percentage: 2 },
      ];
    }
    return [
      { stars: 5, percentage: 65 },
      { stars: 4, percentage: 20 },
      { stars: 3, percentage: 9 },
      { stars: 2, percentage: 4 },
      { stars: 1, percentage: 2 },
    ];
  };

  const distribution = getDistribution(rating);

  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/30 to-blue-50/40 rounded-2xl p-6 sm:p-7 border border-indigo-100/90 shadow-2xs space-y-5">
      {/* AI Header Badge */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">
                Customers Say
              </h3>
              <span className="text-[10px] font-bold tracking-wider uppercase bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200/50">
                AI Summary
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Synthesized from {formatReviewCount(reviewCount)} verified reviews
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-indigo-100/80 shadow-2xs">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
          <span className="text-xs font-bold text-gray-900">{rating.toFixed(1)}</span>
          <span className="text-[11px] text-gray-400 font-medium">/ 5.0</span>
        </div>
      </div>

      {/* AI Generated Sentiment Paragraph */}
      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-white/70 backdrop-blur-xs p-4 rounded-xl border border-indigo-50/80">
        "{getSentimentText()}"
      </p>

      {/* Horizontal Progress Bars for Star Ratings */}
      <div className="space-y-2.5 pt-1">
        <p className="text-xs font-semibold text-gray-800 mb-2">Rating Distribution</p>
        {distribution.map(({ stars, percentage }) => (
          <div key={stars} className="flex items-center gap-3 text-xs">
            <span className="w-12 text-gray-600 font-medium shrink-0 flex items-center gap-1">
              <span>{stars}</span>
              <span className="text-gray-400">star</span>
            </span>

            {/* Progress Track */}
            <div className="flex-1 h-2 bg-gray-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Percentage */}
            <span className="w-9 text-right text-gray-500 font-medium text-[11px] shrink-0 font-mono">
              {percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSummary;
