import { squareInfoType } from "../type/type";

/**
 * 受け取った配列をシャッフルする関数。(破壊的操作)
 * @param array
 */
export const shuffleArray = (array: Array<squareInfoType>) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
