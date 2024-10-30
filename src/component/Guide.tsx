type Props = {
  isGameClear: boolean;
  isGameOver: boolean;
  isGameNow: boolean;
  restart: () => void;
};

export const Guide = (props: Props) => {
  const { isGameClear, isGameOver, isGameNow, restart } = props;

  // const restart = () => {};

  return (
    <>
      <div>guide here</div>
      {isGameNow ? (
        <>
          <div>playing now</div> <button onClick={restart}>restart</button>
        </>
      ) : (
        <div>Press any space to start</div>
      )}
      {isGameClear && <div>Game Clear!!</div>}
      {isGameOver && <div>Game Over</div>}
    </>
  );
};
