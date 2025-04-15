'use client'

// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

interface PDResultChartProps {
  data: any[]
}

const PDResultChart = ({ data }: PDResultChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const theme = useTheme()
  
  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Set dimensions
    const padding = 40
    const width = canvas.width - (padding * 2)
    const height = canvas.height - (padding * 2)
    
    // Draw grid
    const periods = data.map(d => d.period)
    const maxPeriod = Math.max(...periods)
    
    // Set canvas size
    canvas.width = 800
    canvas.height = 400
    
    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.strokeStyle = '#ccc'
    ctx.lineWidth = 1
    ctx.stroke()
    
    // Draw x-axis labels (periods)
    ctx.font = '12px Arial'
    ctx.fillStyle = theme.palette.text.primary
    ctx.textAlign = 'center'
    
    const xStep = width / maxPeriod
    for (let i = 0; i <= maxPeriod; i += Math.ceil(maxPeriod / 10)) {
      const x = padding + (i * xStep)
      ctx.fillText(i.toString(), x, canvas.height - padding + 20)
      
      // Draw vertical grid line
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, canvas.height - padding)
      ctx.strokeStyle = '#eee'
      ctx.stroke()
    }
    
    // Draw y-axis labels (PD values)
    ctx.textAlign = 'right'
    
    const maxPD = Math.max(...data.map(d => d.cumulativePd))
    const yStep = height / 10
    
    for (let i = 0; i <= 10; i++) {
      const y = canvas.height - padding - (i * yStep)
      const value = (i / 10) * Math.ceil(maxPD * 10) / 10
      ctx.fillText(`${(value * 100).toFixed(1)}%`, padding - 10, y + 5)
      
      // Draw horizontal grid line
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.strokeStyle = '#eee'
      ctx.stroke()
    }
    
    // Draw title
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Cumulative PD over Time', canvas.width / 2, padding - 15)
    
    // Draw cumulative PD line
    ctx.beginPath()
    ctx.moveTo(padding, canvas.height - padding)
    
    data.forEach((point, index) => {
      const x = padding + (point.period * xStep)
      const y = canvas.height - padding - (point.cumulativePd * height / Math.ceil(maxPD * 10) * 10)
      
      ctx.lineTo(x, y)
      
      // Draw point
      ctx.fillStyle = theme.palette.primary.main
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })
    
    ctx.strokeStyle = theme.palette.primary.main
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Draw kolektibilitas changes
    let lastKol = data[0].kolektibilitas
    let lastX = padding
    let lastY = canvas.height - padding - (data[0].cumulativePd * height / Math.ceil(maxPD * 10) * 10)
    
    data.forEach((point, index) => {
      if (index === 0) return
      
      const x = padding + (point.period * xStep)
      const y = canvas.height - padding - (point.cumulativePd * height / Math.ceil(maxPD * 10) * 10)
      
      if (point.kolektibilitas !== lastKol) {
        // Draw vertical line to indicate kolektibilitas change
        ctx.beginPath()
        ctx.moveTo(x, padding)
        ctx.lineTo(x, canvas.height - padding)
        ctx.strokeStyle = getKolektibilitasColor(point.kolektibilitas)
        ctx.setLineDash([5, 3])
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.setLineDash([])
        
        // Add label for kolektibilitas change
        ctx.fillStyle = getKolektibilitasColor(point.kolektibilitas)
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(point.kolektibilitas, x, y + 3)
        
        lastKol = point.kolektibilitas
      }
      
      lastX = x
      lastY = y
    })
    
    // Draw legend
    const legendX = padding
    const legendY = padding + 20
    const legendWidth = 15
    const legendHeight = 15
    const legendGap = 10
    const legendTextGap = 5
    
    // Cumulative PD line
    ctx.beginPath()
    ctx.moveTo(legendX, legendY)
    ctx.lineTo(legendX + legendWidth, legendY)
    ctx.strokeStyle = theme.palette.primary.main
    ctx.lineWidth = 2
    ctx.stroke()
    
    ctx.fillStyle = theme.palette.text.primary
    ctx.font = '12px Arial'
    ctx.textAlign = 'left'
    ctx.fillText('Cumulative PD', legendX + legendWidth + legendTextGap, legendY + 4)
    
    // Kolektibilitas changes
    const kolValues = ['1', '2', '3', '4', '5']
    kolValues.forEach((kol, index) => {
      const y = legendY + ((index + 1) * (legendHeight + legendGap))
      
      ctx.fillStyle = getKolektibilitasColor(kol)
      ctx.beginPath()
      ctx.arc(legendX + (legendWidth / 2), y, 6, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 10px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(kol, legendX + (legendWidth / 2), y + 3)
      
      ctx.fillStyle = theme.palette.text.primary
      ctx.font = '12px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(`Kolektibilitas ${kol}`, legendX + legendWidth + legendTextGap, y + 4)
    })
    
  }, [data, theme])
  
  // Get color for kolektibilitas
  const getKolektibilitasColor = (kol: string) => {
    switch (kol) {
      case '1': return theme.palette.success.main
      case '2': return theme.palette.info.main
      case '3': return theme.palette.warning.main
      case '4': return theme.palette.error.main
      case '5': return '#880E4F' // dark pink
      default: return theme.palette.grey[500]
    }
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 400 }} />
    </Box>
  )
}

export default PDResultChart
