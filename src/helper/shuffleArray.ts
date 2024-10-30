import { squareInfoType } from "../type/type";

export const shuffleArray = (
  array: Array<squareInfoType>
): Array<squareInfoType> => {
  const cloneArray = [...array];

  for (let i = cloneArray.length - 1; i >= 0; i--) {
    let rand = Math.floor(Math.random() * (i + 1));
    let tmpStorage = cloneArray[i];
    cloneArray[i] = cloneArray[rand];
    cloneArray[rand] = tmpStorage;
  }

  return cloneArray;
};
