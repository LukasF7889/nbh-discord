export const calcLevelUp = (level) => {
    if (level <= 1)
        return 0;
    return Math.floor(100 * Math.pow(level - 1, 1.5));
};
export const energyForLevel = (level) => {
    return 100 + (level - 1) * 15;
};
//# sourceMappingURL=calcLevelup.js.map