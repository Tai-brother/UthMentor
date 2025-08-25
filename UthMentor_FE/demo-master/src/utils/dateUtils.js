// File: src/utils/dateUtils.js
export const TEST_DATE = '2025-06-13';
export const TEST_TIME = '18:38:50';

export const getCurrentDate = () => {
  return TEST_DATE;
};

export const getCurrentTime = () => {
  return TEST_TIME;
};

export const getCurrentDateTime = () => {
  return `${TEST_DATE} ${TEST_TIME}`;
};