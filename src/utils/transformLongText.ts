export const transformLongText = (text: string) => {
  return text.slice(0, 8) + "....." + text.slice(-8);
};
