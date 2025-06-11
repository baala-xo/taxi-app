function numIslands(grid: string[][]): number {
    if (!grid || grid.length === 0) {
      return 0;
    }
  




    const rows = grid.length;
    const cols = grid[0].length;
    let islandCount = 0;
  
    const dfs = (r: number, c: number) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') {
    
        return;


    }
  
      grid[r][c] = '0';
  
    
    
    
    
      dfs(r + 1, c);
      dfs(r - 1, c);
      dfs(r, c + 1);
      dfs(r, c - 1);
    };
  
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === '1') {
          islandCount++;
          dfs(r, c);
        }
    
    }
    


}
  
    return islandCount;



}