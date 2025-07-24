import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Path to Python script
    const scriptPath = path.join(process.cwd(), "scripts", "pathfinding.py")

    // Spawn Python process
    const pythonProcess = spawn("python", [scriptPath, JSON.stringify(body)])

    let result = ""
    let error = ""

    // Collect output
    pythonProcess.stdout.on("data", (data) => {
      result += data.toString()
    })

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString()
    })

    // Wait for process to complete
    await new Promise((resolve, reject) => {
      pythonProcess.on("close", (code) => {
        if (code === 0) {
          resolve(code)
        } else {
          reject(new Error(`Python process exited with code ${code}: ${error}`))
        }
      })

      pythonProcess.on("error", (err) => {
        reject(err)
      })
    })

    // Parse and return result
    const pathfindingResult = JSON.parse(result)
    return NextResponse.json(pathfindingResult)
  } catch (error) {
    console.error("Pathfinding API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
