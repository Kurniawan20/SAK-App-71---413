'use client'

// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Type Imports
import type { MigrationMatrix } from '@/data/pd/migrationMatrixData'

interface MigrationMatrixHeatmapProps {
  data: MigrationMatrix[]
}

const MigrationMatrixHeatmap = ({ data }: MigrationMatrixHeatmapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Set dimensions
    const cellSize = 80
    const padding = 40
    const fontSize = 12
    
    // Draw grid
    const kolektibilitasValues = ['1', '2', '3', '4', '5']
    const gridSize = kolektibilitasValues.length
    
    // Set canvas size
    canvas.width = (gridSize * cellSize) + (padding * 2)
    canvas.height = (gridSize * cellSize) + (padding * 2)
    
    // Draw labels
    ctx.font = `${fontSize}px Arial`
    ctx.fillStyle = '#333'
    ctx.textAlign = 'center'
    
    // Draw column headers (To)
    ctx.fillText('To Kolektibilitas', canvas.width / 2, padding / 2)
    kolektibilitasValues.forEach((value, index) => {
      ctx.fillText(`Kol-${value}`, padding + (index * cellSize) + (cellSize / 2), padding - 10)
    })
    
    // Draw row headers (From)
    ctx.save()
    ctx.translate(padding / 2, canvas.height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('From Kolektibilitas', 0, 0)
    ctx.restore()
    
    kolektibilitasValues.forEach((value, index) => {
      ctx.fillText(`Kol-${value}`, padding - 10, padding + (index * cellSize) + (cellSize / 2))
    })
    
    // Draw cells
    kolektibilitasValues.forEach((fromValue, fromIndex) => {
      kolektibilitasValues.forEach((toValue, toIndex) => {
        const matrixItem = data.find(
          item => item.dari_kolektibilitas === fromValue && item.ke_kolektibilitas === toValue
        )
        
        const probabilityValue = matrixItem ? matrixItem.probability_value : 0
        
        // Calculate cell position
        const x = padding + (toIndex * cellSize)
        const y = padding + (fromIndex * cellSize)
        
        // Draw cell background
        ctx.fillStyle = getProbabilityColor(probabilityValue)
        ctx.fillRect(x, y, cellSize, cellSize)
        
        // Draw cell border
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, cellSize, cellSize)
        
        // Draw probability value
        ctx.fillStyle = probabilityValue > 0.5 ? '#fff' : '#333'
        ctx.fillText(`${(probabilityValue * 100).toFixed(1)}%`, x + (cellSize / 2), y + (cellSize / 2))
      })
    })
    
    // Draw legend
    const legendX = padding
    const legendY = padding + (gridSize * cellSize) + 20
    const legendWidth = 30
    const legendHeight = 15
    const legendGap = 5
    const legendValues = [0, 0.1, 0.3, 0.5, 0.8, 1]
    
    ctx.fillText('Probability Legend:', legendX, legendY)
    
    legendValues.forEach((value, index) => {
      const x = legendX + 100 + (index * (legendWidth + legendGap))
      
      // Draw legend box
      ctx.fillStyle = getProbabilityColor(value)
      ctx.fillRect(x, legendY - 10, legendWidth, legendHeight)
      
      // Draw legend border
      ctx.strokeStyle = '#ccc'
      ctx.lineWidth = 0.5
      ctx.strokeRect(x, legendY - 10, legendWidth, legendHeight)
      
      // Draw legend text
      ctx.fillStyle = '#333'
      ctx.fillText(`${(value * 100)}%`, x + (legendWidth / 2), legendY + 20)
    })
    
  }, [data])
  
  // Get color based on probability value
  const getProbabilityColor = (value: number) => {
    if (value >= 0.8) return '#1e88e5' // High stay probability (blue)
    if (value >= 0.5) return '#43a047' // Good probability (green)
    if (value >= 0.3) return '#ffb74d' // Medium probability (orange)
    if (value >= 0.1) return '#f57c00' // Low-medium probability (dark orange)
    if (value > 0) return '#e53935'    // Low probability (red)
    return '#f5f5f5'                   // Zero probability (light gray)
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <canvas ref={canvasRef} style={{ maxWidth: '100%' }} />
    </Box>
  )
}

export default MigrationMatrixHeatmap
