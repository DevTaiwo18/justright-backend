    const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB');
};

const formatCurrency = (amount) => {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
};

const calculateProfitMargin = (buyingPrice, sellingPrice) => {
  if (buyingPrice === 0) return 0;
  return ((sellingPrice - buyingPrice) / buyingPrice * 100).toFixed(2);
};

const generateReportFilename = (type, startDate, endDate) => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return `${type}_report_${start}_to_${end}.pdf`;
};

module.exports = {
  formatDate,
  formatCurrency,
  calculateProfitMargin,
  generateReportFilename
};