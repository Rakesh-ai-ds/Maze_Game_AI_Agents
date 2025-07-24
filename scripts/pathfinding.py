import json
import sys
from collections import deque
import heapq
import math

class MazePathfinder:
    def __init__(self, maze_layout, start_pos, end_pos):
        self.maze = maze_layout
        self.start = start_pos
        self.end = end_pos
        self.rows = len(maze_layout)
        self.cols = len(maze_layout[0]) if maze_layout else 0
        
    def is_valid_position(self, row, col):
        """Check if position is valid and not a wall"""
        return (0 <= row < self.rows and 
                0 <= col < self.cols and 
                self.maze[row][col] == 0)  # 0 = path, 1 = wall
    
    def get_neighbors(self, row, col):
        """Get valid neighboring positions"""
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # right, down, left, up
        neighbors = []
        
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc
            if self.is_valid_position(new_row, new_col):
                neighbors.append((new_row, new_col))
        
        return neighbors
    
    def bfs_shortest_path(self):
        """Find shortest path using Breadth-First Search"""
        if not self.is_valid_position(self.start[0], self.start[1]):
            return {"error": "Invalid start position"}
        
        if not self.is_valid_position(self.end[0], self.end[1]):
            return {"error": "Invalid end position"}
        
        queue = deque([(self.start[0], self.start[1], [])])
        visited = set()
        visited.add((self.start[0], self.start[1]))
        
        while queue:
            row, col, path = queue.popleft()
            
            # Check if we reached the destination
            if (row, col) == (self.end[0], self.end[1]):
                final_path = path + [(row, col)]
                return {
                    "algorithm": "BFS",
                    "path": final_path,
                    "length": len(final_path),
                    "success": True
                }
            
            # Explore neighbors
            for next_row, next_col in self.get_neighbors(row, col):
                if (next_row, next_col) not in visited:
                    visited.add((next_row, next_col))
                    new_path = path + [(row, col)]
                    queue.append((next_row, next_col, new_path))
        
        return {"error": "No path found", "success": False}
    
    def heuristic(self, pos1, pos2):
        """Manhattan distance heuristic for A*"""
        return abs(pos1[0] - pos2[0]) + abs(pos1[1] - pos2[1])
    
    def astar_shortest_path(self):
        """Find shortest path using A* algorithm"""
        if not self.is_valid_position(self.start[0], self.start[1]):
            return {"error": "Invalid start position"}
        
        if not self.is_valid_position(self.end[0], self.end[1]):
            return {"error": "Invalid end position"}
        
        # Priority queue: (f_score, g_score, position, path)
        heap = [(0, 0, self.start, [])]
        visited = set()
        
        while heap:
            f_score, g_score, (row, col), path = heapq.heappop(heap)
            
            if (row, col) in visited:
                continue
                
            visited.add((row, col))
            current_path = path + [(row, col)]
            
            # Check if we reached the destination
            if (row, col) == (self.end[0], self.end[1]):
                return {
                    "algorithm": "A*",
                    "path": current_path,
                    "length": len(current_path),
                    "success": True,
                    "cost": g_score
                }
            
            # Explore neighbors
            for next_row, next_col in self.get_neighbors(row, col):
                if (next_row, next_col) not in visited:
                    new_g_score = g_score + 1
                    h_score = self.heuristic((next_row, next_col), self.end)
                    new_f_score = new_g_score + h_score
                    
                    heapq.heappush(heap, (new_f_score, new_g_score, (next_row, next_col), current_path))
        
        return {"error": "No path found", "success": False}
    
    def dijkstra_shortest_path(self):
        """Find shortest path using Dijkstra's algorithm"""
        if not self.is_valid_position(self.start[0], self.start[1]):
            return {"error": "Invalid start position"}
        
        if not self.is_valid_position(self.end[0], self.end[1]):
            return {"error": "Invalid end position"}
        
        # Priority queue: (distance, position, path)
        heap = [(0, self.start, [])]
        distances = {self.start: 0}
        visited = set()
        
        while heap:
            current_dist, (row, col), path = heapq.heappop(heap)
            
            if (row, col) in visited:
                continue
                
            visited.add((row, col))
            current_path = path + [(row, col)]
            
            # Check if we reached the destination
            if (row, col) == (self.end[0], self.end[1]):
                return {
                    "algorithm": "Dijkstra",
                    "path": current_path,
                    "length": len(current_path),
                    "success": True,
                    "cost": current_dist
                }
            
            # Explore neighbors
            for next_row, next_col in self.get_neighbors(row, col):
                if (next_row, next_col) not in visited:
                    new_distance = current_dist + 1
                    
                    if (next_row, next_col) not in distances or new_distance < distances[(next_row, next_col)]:
                        distances[(next_row, next_col)] = new_distance
                        heapq.heappush(heap, (new_distance, (next_row, next_col), current_path))
        
        return {"error": "No path found", "success": False}

def world_to_grid(world_x, world_z, world_size=60, grid_size=30):
    """Convert world coordinates to grid coordinates"""
    grid_x = int((world_x + world_size/2) / world_size * grid_size)
    grid_z = int((world_z + world_size/2) / world_size * grid_size)
    return (grid_z, grid_x)  # Note: grid uses (row, col) format

def grid_to_world(grid_row, grid_col, world_size=60, grid_size=30):
    """Convert grid coordinates to world coordinates"""
    world_x = (grid_col / grid_size * world_size) - world_size/2
    world_z = (grid_row / grid_size * world_size) - world_size/2
    return (world_x, world_z)

def main():
    try:
        # Read input from command line arguments
        if len(sys.argv) != 2:
            print(json.dumps({"error": "Invalid arguments"}))
            return
        
        input_data = json.loads(sys.argv[1])
        
        maze_layout = input_data.get('maze')
        start_world = input_data.get('start')
        end_world = input_data.get('end')
        algorithm = input_data.get('algorithm', 'astar')
        
        if not all([maze_layout, start_world, end_world]):
            print(json.dumps({"error": "Missing required data"}))
            return
        
        # Convert world coordinates to grid coordinates
        start_grid = world_to_grid(start_world[0], start_world[1])
        end_grid = world_to_grid(end_world[0], end_world[1])
        
        # Create pathfinder instance
        pathfinder = MazePathfinder(maze_layout, start_grid, end_grid)
        
        # Choose algorithm
        if algorithm.lower() == 'bfs':
            result = pathfinder.bfs_shortest_path()
        elif algorithm.lower() == 'dijkstra':
            result = pathfinder.dijkstra_shortest_path()
        else:  # default to A*
            result = pathfinder.astar_shortest_path()
        
        # Convert path back to world coordinates if successful
        if result.get('success') and 'path' in result:
            world_path = []
            for grid_row, grid_col in result['path']:
                world_x, world_z = grid_to_world(grid_row, grid_col)
                world_path.append([world_x, 2, world_z])  # y=2 for ground level
            
            result['worldPath'] = world_path
            result['gridPath'] = result['path']
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": f"Python execution error: {str(e)}"}))

if __name__ == "__main__":
    main()
