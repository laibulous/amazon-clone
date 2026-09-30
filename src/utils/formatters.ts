/**
 * Formats a number as USD currency ($XX.XX)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Splits a price into dollars and cents for Amazon-style price typography ($ 34 .99)
 */
export const splitPrice = (price: number): { dollars: string; cents: string } => {
  const parts = price.toFixed(2).split('.');
  return {
    dollars: parts[0],
    cents: parts[1],
  };
};

/**
 * Formats review counts (e.g. 18,450)
 */
export const formatReviewCount = (count: number): string => {
  return new Intl.NumberFormat('en-US').format(count);
};

/**
 * Formats date for Amazon estimated delivery (e.g. "Tomorrow, Oct 1" or "Two-Day Delivery")
 */
export const getEstimatedDelivery = (isPrime: boolean = true): string => {
  const date = new Date();
  const daysToAdd = isPrime ? 1 : 4;
  date.setDate(date.getDate() + daysToAdd);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};
