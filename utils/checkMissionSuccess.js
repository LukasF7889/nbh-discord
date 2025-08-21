const checkMissionSuccess = (player, mission) => {
  if (!player || !mission) return;
  const { challenge } = mission;
  const feedback = { success: false, message: "" };
  const check = [
    "intelligence",
    "charisma",
    "strength",
    "dexterity",
    "perception",
  ];

  for (const att of check) {
    console.log(
      `Check ${att}: Player: ${player[att]} | Challenge: ${challenge[att]}`
    );
    if (player[att] < challenge[att]) {
      return {
        success: false,
        message: `${mission.message[att]} - ${att} check failed`,
      };
    }
  }

  return { success: true, message: mission.message.success };
};

export default checkMissionSuccess;
