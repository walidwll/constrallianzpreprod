

export const formatCurrency = (amount) => {
    return (amount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };
  
  export const formatDateToLocal = (dateStr, locale = 'en-US') => {
    const date = new Date(dateStr);
  
    // Validate the date object
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
  
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
  };
  