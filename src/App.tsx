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

  // タプル[false, 0]で初期化した9×9配列を作成
  let zeroArr2Dim: Array<Array<squareInfoType>> = new Array(rowSquareNum);
  for (let i = 0; i < rowSquareNum; i++) {
    zeroArr2Dim[i] = new Array(columnSquareNum);
    for (let j = 0; j < columnSquareNum; j++) {
      // 各マスに isOpen: 開いたか、bombNum: 付近の爆弾の個数 の二つの情報を持たせる
      // そのマスが爆弾であるとき、bombNumを-1とする
      zeroArr2Dim[i][j] = [false, 0];
    }
  }

  // 本ゲームの盤面
  const [board, setBoard] = useState<Array<Array<squareInfoType>>>(zeroArr2Dim);

  // ゲームクリア、ゲームオーバーを管理する変数
  const [isGameClear, setIsGameClear] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // ゲーム中かどうか管理する変数
  const [isGameNow, setIsGameNow] = useState<boolean>(false);

  // マス目をクリックして開けた時の動作
  const onClickSquare = (rowNum: number, columnNum: number) => {
    // ゲームオーバーした際はマスを開けられないようにする
    if (isGameOver) {
      return;
    }

    let nowBoard: Array<Array<squareInfoType>> = [...board];

    // 既に開かれたマスがクリックされた場合、何もしない
    if (nowBoard[rowNum][columnNum][0]) {
      return;
    }

    if (!isGameNow) {
      nowBoard = [...placeBomb(rowNum, columnNum)];
      // ゲーム開始
      setIsGameNow(true);
    }

    nowBoard[rowNum][columnNum][0] = true; // isOpen = true

    setBoard(nowBoard);

    // ゲームオーバー
    if (nowBoard[rowNum][columnNum][1] === -1) {
      setIsGameOver(true);
      return;
    }

    // ゲームクリア
    // 現在空いているマス数を数える
    let openedSquaresNum: number = 0;
    nowBoard.forEach((rows) => {
      rows.forEach(([isOpen, bombNum]) => {
        if (isOpen) {
          openedSquaresNum++;
        }
      });
    });
    if (openedSquaresNum === totalSquaresNum - totalBombNum) {
      setIsGameClear(true);
    }

    // 再帰的に空白のマスの周囲を開けていく
    const arroundCoordinates = getArroundCoodinates(rowNum, columnNum);
    if (nowBoard[rowNum][columnNum][1] === 0) {
      // bombNum === 0 の時
      arroundCoordinates.forEach(([row, column]) => {
        if (board[row][column][0] === false) {
          // すでに開けたマスでは実行しないようにする
          onClickSquare(row, column);
        }
      });
    }
  };

  // 初めにマスを開けたとき、爆弾をランダムに配置する動作
  const placeBomb = (
    rowNum: number,
    columnNum: number
  ): Array<Array<squareInfoType>> => {
    // [爆弾、爆弾、..., 爆弾、空白、空白、...、空白] となっている配列をシャッフルし、2次元配列に戻すことで爆弾をランダムに配置することにする
    let board1Dim: Array<squareInfoType> = new Array(totalSquaresNum);
    for (let i = 0; i < totalSquaresNum; i++) {
      if (i < totalBombNum) {
        board1Dim[i] = [false, -1];
      } else {
        board1Dim[i] = [false, 0];
      }
    }

    let placedBombBoard1Dim: Array<squareInfoType>;
    while (true) {
      // 初めに開けたマスに爆弾が配置されたらやり直す
      placedBombBoard1Dim = shuffleArray(board1Dim);
      if (placedBombBoard1Dim[rowSquareNum * rowNum + columnNum][1] !== -1) {
        break;
      }
    }

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
        if (square[1] === -1) {
          return;
        }
        // 盤上に収まる周辺のマスの座標を格納
        const arroundCoordinates: Array<[number, number]> =
          getArroundCoodinates(i, j);

        // 周辺マスの各座標をチェックして爆弾の個数を数える
        let arroundBombNum: number = 0;
        arroundCoordinates.forEach((coordinates) => {
          if (placedBombBoard[coordinates[0]][coordinates[1]][1] === -1) {
            arroundBombNum++;
          }
        });
        square[1] = arroundBombNum;
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
    arroundDirection.forEach((rowDirection) => {
      arroundDirection.forEach((columnDirection) => {
        if (
          rowNum + rowDirection >= 0 &&
          rowNum + rowDirection <= 8 &&
          columnNum + columnDirection >= 0 &&
          columnNum + columnDirection <= 8 && // 領域内かどうか
          (rowDirection !== 0 || columnDirection !== 0) // 自マスでないかどうか
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

  const restart = () => {
    setBoard(zeroArr2Dim);
    setIsGameClear(false);
    setIsGameOver(false);
    setIsGameNow(false);
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
                    onClickSquare(row, column);
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
      ></Guide>
    </>
  );
}
