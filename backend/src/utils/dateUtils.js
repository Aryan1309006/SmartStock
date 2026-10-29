const MS_PER_DAY = 1000 * 60 * 60 * 24;

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const parseLocalDate = (dateVal) => {
  if (!dateVal) return null;
  if (dateVal instanceof Date) {
    const d = new Date(dateVal);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  const str = String(dateVal).trim();
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, y, m, d] = match;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    date.setHours(0, 0, 0, 0);
    return date;
  }
  const date = new Date(str);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

const getDaysRemaining = (expiryDate, today = startOfToday()) => {
  const expiry = parseLocalDate(expiryDate);
  if (!expiry) return 0;
  return Math.ceil((expiry.getTime() - today.getTime()) / MS_PER_DAY);
};

const getMonthKey = (dateValue) => {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const getCurrentMonthKey = () => getMonthKey(new Date());

const getDateKey = (dateValue) => {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
};

module.exports = {
  MS_PER_DAY,
  startOfToday,
  parseLocalDate,
  getDaysRemaining,
  getMonthKey,
  getCurrentMonthKey,
  getDateKey,
};
