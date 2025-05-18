export function checkWinner(board, symbol) {
  // Rows
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === symbol &&
      board[i][1] === symbol &&
      board[i][2] === symbol
    ) {
      return [
        [i, 0],
        [i, 1],
        [i, 2],
      ];
    }
  }

  // Columns
  for (let i = 0; i < 3; i++) {
    if (
      board[0][i] === symbol &&
      board[1][i] === symbol &&
      board[2][i] === symbol
    ) {
      return [
        [0, i],
        [1, i],
        [2, i],
      ];
    }
  }

  // Diagonal top-left to bottom-right
  if (
    board[0][0] === symbol &&
    board[1][1] === symbol &&
    board[2][2] === symbol
  ) {
    return [
      [0, 0],
      [1, 1],
      [2, 2],
    ];
  }

  // Diagonal top-right to bottom-left
  if (
    board[0][2] === symbol &&
    board[1][1] === symbol &&
    board[2][0] === symbol
  ) {
    return [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
  }

  return null;
}

export function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const backendURL = "http://localhost:4000";
