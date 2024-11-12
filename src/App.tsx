import { useState } from "react";
import "./styles.css";
import { Square } from "./component/Square";
import { squareInfoType } from "./type/type";
import { shuffleArray } from "./helper/shuffleArray";
import { Guide } from "./component/Guide";

export default function App() {
  const rowSquareNum: number = 9;
  const columnSquareNum: number = 9;
  const boardRowNums: Array<number> = [...Array(rowSquareNum)].map((_, i) => i);
  const boardColumnNums: Array<number> = [...Array(columnSquareNum)].map(
    (_, i) => i
  );
  const totalSquaresNum: number = boardRowNums.length * boardColumnNums.length;

  // 配置される爆弾の個数
  const totalBombNum: number = 10;

  // タプル[false, 0, false]で初期化した9×9配列を作成
  let zeroArr2Dim: Array<Array<squareInfoType>> = new Array(rowSquareNum);
  for (let i = 0; i < rowSquareNum; i++) {
    zeroArr2Dim[i] = new Array(columnSquareNum);
    for (let j = 0; j < columnSquareNum; j++) {
      zeroArr2Dim[i][j] = {
        isOpen: false,
        bombNum: 0,
        isFlagged: false,
      };
    }
  }

  // 本ゲームの盤面
  const [board, setBoard] = useState<Array<Array<squareInfoType>>>(zeroArr2Dim);

  // ゲームクリア、ゲームオーバーを管理する変数
  const [isGameClear, setIsGameClear] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // ゲーム中かどうか管理する変数
  const [isGameNow, setIsGameNow] = useState<boolean>(false);

  // クリックする際、マスを開く状態か、フラグを置く状態か管理する変数
  const [isFlaggingNow, setIsFlaggingNow] = useState<boolean>(false);
  // フラグ設置可能数を管理する変数
  const [leftFlagNum, setLeftFlagNum] = useState<number>(totalBombNum);

  // マス目をクリックして開けた時の動作
  const onClickSquare = (
    rowNum: number,
    columnNum: number,
    receivedBoard?: Array<Array<squareInfoType>>
  ) => {
    // ゲームオーバー、またクリアした際はマスを開けられないようにする
    if (isGameOver || isGameClear) {
      return;
    }

    // 現在の盤面の状態。再帰で呼び出された際は、引数のboardを取得する
    let nowBoard: Array<Array<squareInfoType>>;
    if (receivedBoard) {
      nowBoard = [...receivedBoard];
    } else {
      nowBoard = [...board];
    }

    // 既に開かれたマスがクリックされた場合、何もしない
    if (nowBoard[rowNum][columnNum].isOpen) {
      return;
    }

    // クリックの直前に空いていたマス数を数える
    let openedSquaresNum: number = 0;
    nowBoard.forEach((rows) => {
      rows.forEach((square) => {
        if (square.isOpen) {
          openedSquaresNum++;
        }
      });
    });

    if (openedSquaresNum === 0) {
      // ゲーム開始
      setIsGameNow(true);
      // 初めに開いたマスが爆弾だけでなく、空白でないマスになった時も配置しなおす
      while (true) {
        nowBoard = [...placeBomb()];
        if (nowBoard[rowNum][columnNum].bombNum === 0) {
          break;
        }
      }
    }

    nowBoard[rowNum][columnNum].isOpen = true;

    setBoard(nowBoard);

    // フラグが開かれた際、フラグ設置可能数を戻す
    if (nowBoard[rowNum][columnNum].isFlagged) {
      setLeftFlagNum((n) => n + 1);
    }

    // ゲームオーバー
    if (nowBoard[rowNum][columnNum].bombNum === -1) {
      setIsGameOver(true);
      return;
    }

    // ゲームクリア;
    if (openedSquaresNum + 1 === totalSquaresNum - totalBombNum) {
      // 爆弾以外のすべてのマスを開けたとき、クリアとする
      setIsGameClear(true);
    }

    // 再帰的に空白のマスの周囲を開けていく
    const arroundCoordinates = getArroundCoodinates(rowNum, columnNum);
    if (nowBoard[rowNum][columnNum].bombNum === 0) {
      arroundCoordinates.forEach(([row, column]) => {
        if (board[row][column].isOpen === false) {
          // すでに開けたマスでは実行しないようにする
          onClickSquare(row, column, nowBoard); // boardのstateが変更される前に再帰関数が実行されてしまうので、その時のboardを渡すようにする
        }
      });
    }
  };

  // 初めにマスを開けたとき、爆弾をランダムに配置する動作
  const placeBomb = (): Array<Array<squareInfoType>> => {
    // [爆弾、爆弾、..., 爆弾、空白、空白、...、空白] となっている配列をシャッフルし、2次元配列に戻すことで爆弾をランダムに配置することにする
    let board1Dim: Array<squareInfoType> = new Array(totalSquaresNum);
    for (let i = 0; i < totalSquaresNum; i++) {
      if (i < totalBombNum) {
        board1Dim[i] = {
          isOpen: false,
          bombNum: -1,
          isFlagged: false,
        };
      } else {
        board1Dim[i] = {
          isOpen: false,
          bombNum: 0,
          isFlagged: false,
        };
      }
    }

    let placedBombBoard1Dim: Array<squareInfoType> = shuffleArray(board1Dim);

    // 二次元配列に戻す
    const placedBombBoard: Array<Array<squareInfoType>> = new Array(
      rowSquareNum
    );
    for (let i = 0; i < rowSquareNum; i++) {
      placedBombBoard[i] = new Array(columnSquareNum);
      for (let j = 0; j < columnSquareNum; j++) {
        placedBombBoard[i][j] = placedBombBoard1Dim[rowSquareNum * i + j];
      }
    }

    // 各マスで周辺の爆弾個数を数える
    placedBombBoard.forEach((row, i) => {
      row.forEach((square, j) => {
        // 自身が爆弾であるときは数えない
        if (square.bombNum === -1) {
          return;
        }
        // 盤上に収まる周辺のマスの座標を格納
        const arroundCoordinates: Array<[number, number]> =
          getArroundCoodinates(i, j);

        // 周辺マスの各座標をチェックして爆弾の個数を数える
        let arroundBombNum: number = 0;
        arroundCoordinates.forEach((coordinates) => {
          if (placedBombBoard[coordinates[0]][coordinates[1]].bombNum === -1) {
            arroundBombNum++;
          }
        });
        square.bombNum = arroundBombNum;
      });
    });

    return placedBombBoard;
  };

  // 盤上に収まる周辺のマスの座標を配列にして渡す関数
  const getArroundCoodinates = (
    rowNum: number,
    columnNum: number
  ): Array<[number, number]> => {
    const arroundDirection: Array<number> = [-1, 0, 1];
    const arroundCoordinates: Array<[number, number]> = new Array(0);
    let nowBoard: Array<Array<squareInfoType>> = [...board];
    arroundDirection.forEach((rowDirection) => {
      arroundDirection.forEach((columnDirection) => {
        if (
          rowNum + rowDirection >= 0 &&
          rowNum + rowDirection <= 8 &&
          columnNum + columnDirection >= 0 &&
          columnNum + columnDirection <= 8 && // 領域内かどうか
          (rowDirection !== 0 || columnDirection !== 0) && // 自マスでないかどうか
          nowBoard[rowNum + rowDirection][columnNum + columnDirection]
            .isOpen === false
        ) {
          arroundCoordinates.push([
            rowNum + rowDirection,
            columnNum + columnDirection,
          ]);
        }
      });
    });

    return arroundCoordinates;
  };

  // マスにフラグを設置、すでに置かれているときは解除
  const placeFlag = (rowNum: number, columnNum: number) => {
    if (leftFlagNum <= 0 || isGameClear || isGameOver) {
      return;
    }
    let nowBoard: Array<Array<squareInfoType>> = [...board];
    // フラグを解除する際はフラグの数を1つ戻す(増やす)
    if (nowBoard[rowNum][columnNum].isFlagged) {
      setLeftFlagNum((n) => n + 1);
    } else {
      setLeftFlagNum((n) => n - 1);
    }
    nowBoard[rowNum][columnNum].isFlagged =
      !nowBoard[rowNum][columnNum].isFlagged; // そのマスのisFlaggedをトグル
    setBoard(nowBoard);
  };

  const restart = () => {
    setBoard(zeroArr2Dim);
    setIsGameClear(false);
    setIsGameOver(false);
    setIsGameNow(false);
    setIsFlaggingNow(false);
    setLeftFlagNum(totalBombNum);
  };

  return (
    <>
      {boardRowNums.map((row) => {
        return (
          <div className="board-row">
            {boardColumnNums.map((column) => {
              return (
                <Square
                  squareInfo={board[row][column]}
                  onClick={() => {
                    if (isFlaggingNow) {
                      placeFlag(row, column);
                    } else {
                      onClickSquare(row, column);
                    }
                  }}
                />
              );
            })}
          </div>
        );
      })}
      <Guide
        isGameClear={isGameClear}
        isGameOver={isGameOver}
        isGameNow={isGameNow}
        restart={restart}
        isFlaggingNow={isFlaggingNow}
        setIsFlaggingNow={setIsFlaggingNow}
        leftFlagNum={leftFlagNum}
      ></Guide>
    </>
  );
}
