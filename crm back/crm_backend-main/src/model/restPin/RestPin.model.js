const { token } = require("morgan");
const { ResetPinSchema } = require("./RestPin.schema");

const { randomPinNumber } = require("../../utils/randomGenerator");

const setPasswordRestPin = async (email) => {
  //reand 6 digit
  const pinLength = 6;
  const randPin = await randomPinNumber(pinLength);

  const restObj = {
    email,
    pin: randPin,    
  };

  return new Promise((resolve, reject) => {
    ResetPinSchema(restObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

const getPinByEmailPin = async (email, pin) => {
  try {
    const data = await ResetPinSchema.findOne({ email, pin });
    return data;
  } catch (error) {
    console.error("Error finding pin:", error);
    return null;
  }
};

const deletePin = async (email, pin) => {
  try {
    const result = await ResetPinSchema.findOneAndDelete({ email, pin });
    return result;
  } catch (error) {
    console.error("Error deleting pin:", error);
    throw error;
  }
};

module.exports = {
  setPasswordRestPin,
  getPinByEmailPin,
  deletePin,
};