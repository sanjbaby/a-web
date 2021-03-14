export const validateJson = (json) => {
  try {
    JSON.parse(json);
  } catch (e) {
    return false;
  }
  return true;
};

export const validateJsonError = (json) => {
  try {
    JSON.parse(json);
  } catch (e) {
    return e.message;
  }
  return "";
};

export const validateEmail = (email) => {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

export const validateEmailList = (list) => {
  return list === "" || list.replace(/\s/g, "").split(",").every(validateEmail);
};
