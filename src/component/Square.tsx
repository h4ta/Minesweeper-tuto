import { squareInfoType } from "../type/type";

type Props = {
  squareInfo: squareInfoType;
  onClick: () => void;
};

export const Square = (props: Props) => {
  const { squareInfo, onClick } = props;
  const [isOpen, bombNum, isFlagged] = squareInfo;

  if (isOpen) {
    switch (bombNum) {
      case 0:
        return <button className="openedSquare" onClick={onClick}></button>;
      case 1: // 文字色を変えるための場合分け
        return (
          <button className="square1Bomb" onClick={onClick}>
            1
          </button>
        );
      case 2:
        return (
          <button className="square2Bomb" onClick={onClick}>
            2
          </button>
        );
      case 3:
        return (
          <button className="square3Bomb" onClick={onClick}>
            3
          </button>
        );
      case -1:
        return (
          <button className="openedSquare" onClick={onClick}>
            💣
          </button>
        );
      default:
        return (
          <button className="squareManyBomb" onClick={onClick}>
            {bombNum}
          </button>
        );
    }
  } else {
    if (isFlagged) {
      return (
        <button className="closedSquare" onClick={onClick}>
          🚩
        </button>
      );
    } else {
      return (
        <button className="closedSquare" onClick={onClick}>
          {bombNum}
        </button>
      );
    }
  }
};
