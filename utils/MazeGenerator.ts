"use client"

export interface MazeCell {
  x: number
  z: number
  walls: {
    north: boolean
    south: boolean
    east: boolean
    west: boolean
  }
  visited: boolean
  isPath: boolean
}

export interface WallData {
  position: [number, number, number]
  size: [number, number, number]
  color: string
  type: "outer" | "inner" | "decorative"
}

export class MazeGenerator {
  private width: number
  private height: number
  private grid: MazeCell[][]
  private stack: MazeCell[]

  constructor(width = 15, height = 15) {
    this.width = width
    this.height = height
    this.grid = []
    this.stack = []
    this.initializeGrid()
  }

  private initializeGrid(): void {
    this.grid = []
    for (let z = 0; z < this.height; z++) {
      this.grid[z] = []
      for (let x = 0; x < this.width; x++) {
        this.grid[z][x] = {
          x,
          z,
          walls: { north: true, south: true, east: true, west: true },
          visited: false,
          isPath: false,
        }
      }
    }
  }

  private getCell(x: number, z: number): MazeCell | undefined {
    if (x < 0 || x >= this.width || z < 0 || z >= this.height) {
      return undefined
    }
    return this.grid[z][x]
  }

  private getUnvisitedNeighbors(cell: MazeCell): MazeCell[] {
    const neighbors: MazeCell[] = []
    const { x, z } = cell

    const north = this.getCell(x, z - 1)
    const south = this.getCell(x, z + 1)
    const east = this.getCell(x + 1, z)
    const west = this.getCell(x - 1, z)

    if (north && !north.visited) neighbors.push(north)
    if (south && !south.visited) neighbors.push(south)
    if (east && !east.visited) neighbors.push(east)
    if (west && !west.visited) neighbors.push(west)

    return neighbors
  }

  private removeWall(current: MazeCell, next: MazeCell): void {
    const dx = current.x - next.x
    const dz = current.z - next.z

    if (dx === 1) {
      current.walls.west = false
      next.walls.east = false
    } else if (dx === -1) {
      current.walls.east = false
      next.walls.west = false
    }

    if (dz === 1) {
      current.walls.north = false
      next.walls.south = false
    } else if (dz === -1) {
      current.walls.south = false
      next.walls.north = false
    }
  }

  public generateMaze(): MazeCell[][] {
    // Start from random position
    const startX = Math.floor(Math.random() * this.width)
    const startZ = Math.floor(Math.random() * this.height)
    const current = this.grid[startZ][startX]

    current.visited = true
    current.isPath = true
    this.stack.push(current)

    while (this.stack.length > 0) {
      const current = this.stack[this.stack.length - 1]
      const neighbors = this.getUnvisitedNeighbors(current)

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)]
        next.visited = true
        next.isPath = true

        this.removeWall(current, next)
        this.stack.push(next)
      } else {
        this.stack.pop()
      }
    }

    // Create additional random paths for more interesting maze
    this.createRandomPaths()

    return this.grid
  }

  private createRandomPaths(): void {
    const pathCount = Math.floor(this.width * this.height * 0.1) // 10% additional paths

    for (let i = 0; i < pathCount; i++) {
      const x = Math.floor(Math.random() * this.width)
      const z = Math.floor(Math.random() * this.height)
      const cell = this.grid[z][x]

      if (Math.random() > 0.5) {
        cell.walls.east = false
        const eastCell = this.getCell(x + 1, z)
        if (eastCell) eastCell.walls.west = false
      } else {
        cell.walls.south = false
        const southCell = this.getCell(x, z + 1)
        if (southCell) southCell.walls.north = false
      }
    }
  }

  public generateWalls(): WallData[] {
    const walls: WallData[] = []
    const cellSize = 4
    const wallHeight = 4
    const wallThickness = 0.5

    // Generate outer boundary walls
    walls.push(
      {
        position: [0, 2, (this.height * cellSize) / 2],
        size: [this.width * cellSize + 2, wallHeight, 1],
        color: "#1a202c",
        type: "outer",
      },
      {
        position: [0, 2, (-this.height * cellSize) / 2],
        size: [this.width * cellSize + 2, wallHeight, 1],
        color: "#1a202c",
        type: "outer",
      },
      {
        position: [(this.width * cellSize) / 2, 2, 0],
        size: [1, wallHeight, this.height * cellSize + 2],
        color: "#1a202c",
        type: "outer",
      },
      {
        position: [(-this.width * cellSize) / 2, 2, 0],
        size: [1, wallHeight, this.height * cellSize + 2],
        color: "#1a202c",
        type: "outer",
      },
    )

    // Generate inner maze walls
    for (let z = 0; z < this.height; z++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.grid[z][x]
        const worldX = (x - this.width / 2) * cellSize
        const worldZ = (z - this.height / 2) * cellSize

        // Add walls based on cell walls
        if (cell.walls.north && z > 0) {
          walls.push({
            position: [worldX, 2, worldZ - cellSize / 2],
            size: [cellSize, wallHeight, wallThickness],
            color: this.getRandomWallColor(),
            type: "inner",
          })
        }

        if (cell.walls.south && z < this.height - 1) {
          walls.push({
            position: [worldX, 2, worldZ + cellSize / 2],
            size: [cellSize, wallHeight, wallThickness],
            color: this.getRandomWallColor(),
            type: "inner",
          })
        }

        if (cell.walls.east && x < this.width - 1) {
          walls.push({
            position: [worldX + cellSize / 2, 2, worldZ],
            size: [wallThickness, wallHeight, cellSize],
            color: this.getRandomWallColor(),
            type: "inner",
          })
        }

        if (cell.walls.west && x > 0) {
          walls.push({
            position: [worldX - cellSize / 2, 2, worldZ],
            size: [wallThickness, wallHeight, cellSize],
            color: this.getRandomWallColor(),
            type: "inner",
          })
        }
      }
    }

    return walls
  }

  private getRandomWallColor(): string {
    const colors = ["#2d3748", "#4a5568", "#718096", "#2b6cb0", "#3182ce", "#2c5282"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  public getMapLayout(): number[][] {
    const layout: number[][] = []

    // Create a larger resolution map for better accuracy
    const mapWidth = this.width * 2
    const mapHeight = this.height * 2

    // Initialize with walls
    for (let z = 0; z < mapHeight; z++) {
      layout[z] = []
      for (let x = 0; x < mapWidth; x++) {
        layout[z][x] = 1 // Default to wall
      }
    }

    // Mark paths based on actual maze cells
    for (let z = 0; z < this.height; z++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.grid[z][x]
        const mapX = x * 2 + 1
        const mapZ = z * 2 + 1

        if (cell.visited) {
          layout[mapZ][mapX] = 0 // Path

          // Add connections between cells
          if (!cell.walls.north && z > 0) {
            layout[mapZ - 1][mapX] = 0
          }
          if (!cell.walls.south && z < this.height - 1) {
            layout[mapZ + 1][mapX] = 0
          }
          if (!cell.walls.east && x < this.width - 1) {
            layout[mapZ][mapX + 1] = 0
          }
          if (!cell.walls.west && x > 0) {
            layout[mapZ][mapX - 1] = 0
          }
        }
      }
    }

    return layout
  }

  public getMapDimensions() {
    return {
      width: this.width * 2,
      height: this.height * 2,
      cellSize: 4,
      worldWidth: this.width * 4,
      worldHeight: this.height * 4,
    }
  }

  public getStartPosition(): { x: number; y: number; z: number } {
    return { x: 0, y: 2, z: (this.height / 2 - 1) * 4 }
  }

  public getEndPosition(): { x: number; y: number; z: number } {
    return { x: 0, y: 2, z: -(this.height / 2 - 1) * 4 }
  }

  public getCheckpoints(): Array<{ x: number; y: number; z: number; id: number }> {
    const checkpoints = []
    const cellSize = 4

    // Generate 3-5 random checkpoints
    const checkpointCount = 3 + Math.floor(Math.random() * 3)

    for (let i = 0; i < checkpointCount; i++) {
      let attempts = 0
      let validPosition = false

      while (!validPosition && attempts < 50) {
        const x = Math.floor(Math.random() * this.width)
        const z = Math.floor(Math.random() * this.height)
        const cell = this.grid[z][x]

        if (cell.isPath) {
          const worldX = (x - this.width / 2) * cellSize
          const worldZ = (z - this.height / 2) * cellSize

          checkpoints.push({
            x: worldX,
            y: 2,
            z: worldZ,
            id: i + 1,
          })
          validPosition = true
        }
        attempts++
      }
    }

    return checkpoints
  }
}
