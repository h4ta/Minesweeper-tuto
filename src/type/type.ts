/** 一マスが保有する各情報の型
 * @property isOpen そのマスが開けられているか管理するプロパティ
 * @property bombNum 自身周辺の8マスに含まれている爆弾の個数を管理するプロパティ。自身のマスに爆弾がある場合、-1とする。
 * @property isFlagged そのマスにフラグが置かれているか管理するプロパティ
 *  **/
export interface squareInfoType {
  isOpen: boolean;
  bombNum: number;
  isFlagged: boolean;
}
