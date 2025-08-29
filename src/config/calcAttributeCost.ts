const calcAttributeCost = (level) => {
  if (level <= 3) return 1;
  return Math.floor(Math.pow(level - 1, 1));
};

export default calcAttributeCost;
