import { Dispatch, SetStateAction } from "react";

type Props = {
  isGameClear: boolean;
  isGameOver: boolean;
  isGameNow: boolean;
  restart: () => void;
  isFlaggingNow: boolean;
  setIsFlaggingNow: Dispatch<SetStateAction<boolean>>;
  leftFlagNum: number;
  setLeftFlagNum: Dispatch<SetStateAction<number>>;
};

export const Guide = (props: Props) => {
  const {
    isGameClear,
    isGameOver,
    isGameNow,
    restart,
    isFlaggingNow,
    setIsFlaggingNow,
    leftFlagNum,
    setLeftFlagNum,
  } = props;

  return (
    <>
      {isGameNow ? (
        <>
          <div>
            <div>🚩: {leftFlagNum}</div>
          </div>
          <button onClick={restart}>restart</button>
          <button onClick={() => setIsFlaggingNow((state) => !state)}>
            {isFlaggingNow ? "change to open" : "change to flag"}
          </button>
        </>
      ) : (
        <div>Press any space to start</div>
      )}
      {isGameClear && <div>Game Clear!!</div>}
      {isGameOver && <div>Game Over</div>}
    </>
  );
};
