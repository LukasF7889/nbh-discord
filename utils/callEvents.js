import MissionEvents from "../models/missionEvents.js";

const rollD20 = () => {
  const dieRoll = Math.floor(Math.max(1, Math.random() * 20));
  return dieRoll;
};

const callEvents = async (player, mission) => {
  let feedback = [];

  //check number of events
  const numberOfEvents = mission.duration / 5;
  const events = await MissionEvents.aggregate([
    { $sample: { size: numberOfEvents } },
  ]);

  for (const event of events) {
    const dice = rollD20();
    const isSuccess = dice + player[event.type] >= event.difficulty;

    feedback.push({
      description: event.description,
      type: event.type,
      difficulty: event.difficulty,
      playerValue: player[event.type],
      dice,
      total: dice + player[event.type],
      isSuccess,
    });
  }

  return feedback;
};

export default callEvents;
