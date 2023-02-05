
export const getCorrectDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  //date.setDays(10);
  date.setHours(16);
  date.setMinutes(54);
  date.setSeconds(3);
  return date;
};

