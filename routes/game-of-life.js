module.exports = function life() {

  'use strict';

  const M = Math;

  function randomRow() {
    return '00000000'.split('').reduce((prev, cur) => {
      return prev + String(M.round(M.random() * 0.6));
    }, '');
  }

  return {

    state: null,

    seed() {
      return this.state = '00000000'.split('').map((row) => {
        return randomRow();
      });
    },

    getNeighbors(state, row, col) {
      let neighbors = [
        state[row-1] && state[row-1][col-1] || 0, // tl
        state[row-1] && state[row-1][col] || 0,   // t
        state[row-1] && state[row-1][col+1] || 0, // tr
        state[row][col+1] || 0,                   // r
        state[row+1] && state[row+1][col+1] || 0, // br
        state[row+1] && state[row+1][col] || 0,   // b
        state[row+1] && state[row+1][col-1] || 0, // bl
        state[row][col-1] || 0,                   // l
      ];
      return neighbors.reduce((total, val) => {
        return total + Number(val) || 0;
      }, 0);
    },

    generate(s) {

      let state = s || this.state;
      let neighborCount;

      return state = state.map((row, i) => {
        return row.split('').map((cell, j) => {

          neighborCount = this.getNeighbors(state, i, j);

          //check if cell is living
          if(cell) {
            if(neighborCount === 2 || neighborCount === 3) {
              return 1;
            } else {
              return 0;
            }
          } else {
            if(neighborCount === 3) {
              return 1;
            } else {
              return 0;
            }
          }
        }).join('');
      });
    }

  };
};
