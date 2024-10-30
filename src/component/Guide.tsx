import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

type Props = {
  isGameClear: boolean;
  isGameOver: boolean;
  isGameNow: boolean;
  restart: () => void;
  isFlaggingNow: boolean;
  setIsFlaggingNow: Dispatch<SetStateAction<boolean>>;
  leftFlagNum: number;
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
  } = props;

  // クリア時間を計測する
  const [playingTime, setPlayingTime] = useState<number>(0);
  const intervalId = useRef<number | null>(null);

  const startTimer = () => {
    if (intervalId.current) return;
    intervalId.current = window.setInterval(
      () => setPlayingTime((n) => n + 1),
      1000
    );
  };

  const stopTimer = () => {
    if (!intervalId.current) return;
    clearInterval(intervalId.current);
    intervalId.current = null;
  };

  const resetTimer = () => {
    stopTimer();
    setPlayingTime(0);
  };

  useEffect(() => {
    if (isGameNow) {
      startTimer();
    }
  }, [isGameNow]);

  useEffect(() => {
    if (isGameClear || isGameOver) {
      stopTimer();
    }
  }, [isGameClear, isGameOver]);

  return (
    <>
      {isGameNow ? (
        <>
          <div>
            <div>
              time {("0" + Math.floor(playingTime / 60).toString()).slice(-2)}:
              {("0" + (playingTime % 60).toString()).slice(-2)}
              {/*分:秒を取得し0埋めする */}
            </div>
            <div>🚩: {leftFlagNum}</div>
          </div>
          <button
            onClick={() => {
              restart();
              resetTimer();
            }}
          >
            restart
          </button>
          <button onClick={() => setIsFlaggingNow((state) => !state)}>
            {isFlaggingNow ? "change to open" : "change to flag"}
          </button>
        </>
      ) : (
        <div>Press any space to start</div>
      )}
      {isGameClear && (
        <>
          <div>Game Clear!!</div>
          <div>
            Your clear time{" "}
            {("0" + Math.floor(playingTime / 60).toString()).slice(-2)}:
            {("0" + (playingTime % 60).toString()).slice(-2)}
          </div>
        </>
      )}
      {isGameOver && <div>Game Over</div>}
    </>
  );
};
