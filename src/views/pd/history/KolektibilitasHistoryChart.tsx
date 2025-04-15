'use client'

// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// Type Imports
import type { KolektibilitasHistory } from '@/data/pd/kolektibilitasHistoryData'

interface KolektibilitasHistoryChartProps {
  data: KolektibilitasHistory[]
}

const KolektibilitasHistoryChart = ({ data }: KolektibilitasHistoryChartProps) => {
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
    const padding = 50
    
    // Set canvas size
    canvas.width = 800
    canvas.height = 400
    
    const width = canvas.width - (padding * 2)
    const height = canvas.height - (padding * 2)
    
    // Sort data by date
    const sortedData = [...data].sort((a, b) => 
      new Date(a.tanggal_perubahan).getTime() - new Date(b.tanggal_perubahan).getTime()
    )
    
    // Group data by transaction
    const transactionGroups: Record<number, KolektibilitasHistory[]> = {}
    
    sortedData.forEach(item => {
      if (!transactionGroups[item.transaction_id]) {
        transactionGroups[item.transaction_id] = []
      }
      transactionGroups[item.transaction_id].push(item)
    })
    
    // Get date range
    const startDate = new Date(sortedData[0].tanggal_perubahan)
    const endDate = new Date(sortedData[sortedData.length - 1].tanggal_perubahan)
    const dateRange = endDate.getTime() - startDate.getTime()
    
    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.strokeStyle = '#ccc'
    ctx.lineWidth = 1
    ctx.stroke()
    
    // Draw x-axis labels (dates)
    ctx.font = '12px Arial'
    ctx.fillStyle = theme.palette.text.primary
    ctx.textAlign = 'center'
    
    // Calculate number of date labels to show
    const numDateLabels = Math.min(6, Math.floor(width / 100))
    const dateStep = dateRange / (numDateLabels - 1)
    
    for (let i = 0; i < numDateLabels; i++) {
      const date = new Date(startDate.getTime() + (i * dateStep))
      const x = padding + (i * (width / (numDateLabels - 1)))
      ctx.fillText(date.toLocaleDateString('id-ID'), x, canvas.height - padding + 20)
      
      // Draw vertical grid line
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, canvas.height - padding)
      ctx.strokeStyle = '#eee'
      ctx.stroke()
    }
    
    // Draw y-axis labels (kolektibilitas)
    ctx.textAlign = 'right'
    
    const kolValues = [1, 2, 3, 4, 5]
    const yStep = height / (kolValues.length - 1)
    
    kolValues.forEach((kol, index) => {
      const y = canvas.height - padding - (index * yStep)
      ctx.fillText(`Kol-${kol}`, padding - 10, y + 5)
      
      // Draw horizontal grid line
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.strokeStyle = '#eee'
      ctx.stroke()
    })
    
    // Draw title
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Kolektibilitas History Over Time', canvas.width / 2, padding - 20)
    
    // Draw transaction lines
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      '#9c27b0', // purple
      '#00bcd4', // cyan
      '#795548', // brown
      '#607d8b', // blue grey
      '#ff9800'  // orange
    ]
    
    // Draw legend
    const legendX = canvas.width - padding - 150
    const legendY = padding + 20
    const legendWidth = 15
    const legendHeight = 15
    const legendGap = 10
    const legendTextGap = 5
    
    Object.entries(transactionGroups).forEach(([transactionId, items], groupIndex) => {
      const color = colors[groupIndex % colors.length]
      
      // Add to legend
      const y = legendY + (groupIndex * (legendHeight + legendGap))
      
      ctx.fillStyle = color
      ctx.fillRect(legendX, y, legendWidth, legendHeight)
      
      ctx.fillStyle = theme.palette.text.primary
      ctx.font = '12px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(`Transaction ${transactionId}`, legendX + legendWidth + legendTextGap, y + legendHeight - 2)
      
      // Draw line for this transaction
      ctx.beginPath()
      
      items.forEach((item, index) => {
        const itemDate = new Date(item.tanggal_perubahan)
        const x = padding + ((itemDate.getTime() - startDate.getTime()) / dateRange * width)
        const y = canvas.height - padding - ((parseInt(item.kolektibilitas_baru) - 1) / 4 * height)
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        
        // Draw point
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fill()
        
        // Draw kolektibilitas label
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(item.kolektibilitas_baru, x, y + 3)
      })
      
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()
    })
    
  }, [data, theme])

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 400 }} />
    </Box>
  )
}

export default KolektibilitasHistoryChart
