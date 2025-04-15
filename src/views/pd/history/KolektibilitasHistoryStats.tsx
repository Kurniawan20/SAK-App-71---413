'use client'

// React Imports
import React from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Type Imports
import type { KolektibilitasHistory } from '@/data/pd/kolektibilitasHistoryData'

interface KolektibilitasHistoryStatsProps {
  data: KolektibilitasHistory[]
}

const KolektibilitasHistoryStats = ({ data }: KolektibilitasHistoryStatsProps) => {
  // Calculate stats from data
  const calculateStats = () => {
    // Default if data is empty
    if (data.length === 0) {
      return {
        totalChanges: 0,
        upgradeCount: 0,
        downgradeCount: 0,
        stayCount: 0,
        transactionCount: 0,
        kolektibilitasDistribution: {
          '1': 0,
          '2': 0,
          '3': 0,
          '4': 0,
          '5': 0
        },
        mostCommonTransition: { from: '', to: '', count: 0 }
      }
    }
    
    // Total changes
    const totalChanges = data.length
    
    // Count upgrades, downgrades, and stays
    let upgradeCount = 0
    let downgradeCount = 0
    let stayCount = 0
    
    data.forEach(item => {
      const oldKol = parseInt(item.kolektibilitas_lama)
      const newKol = parseInt(item.kolektibilitas_baru)
      
      if (oldKol < newKol) {
        downgradeCount++
      } else if (oldKol > newKol) {
        upgradeCount++
      } else {
        stayCount++
      }
    })
    
    // Count unique transactions
    const uniqueTransactions = new Set(data.map(item => item.transaction_id))
    const transactionCount = uniqueTransactions.size
    
    // Calculate kolektibilitas distribution (final state)
    const latestKolektibilitas: Record<number, string> = {}
    
    // Get the latest kolektibilitas for each transaction
    data.forEach(item => {
      const currentDate = new Date(item.tanggal_perubahan).getTime()
      const existingDate = latestKolektibilitas[item.transaction_id] 
        ? new Date(latestKolektibilitas[item.transaction_id].split('|')[1]).getTime() 
        : 0
      
      if (currentDate >= existingDate) {
        latestKolektibilitas[item.transaction_id] = `${item.kolektibilitas_baru}|${item.tanggal_perubahan}`
      }
    })
    
    // Count distribution
    const kolektibilitasDistribution: Record<string, number> = {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0
    }
    
    Object.values(latestKolektibilitas).forEach(value => {
      const kol = value.split('|')[0]
      kolektibilitasDistribution[kol]++
    })
    
    // Find most common transition
    const transitions: Record<string, number> = {}
    
    data.forEach(item => {
      const key = `${item.kolektibilitas_lama}-${item.kolektibilitas_baru}`
      transitions[key] = (transitions[key] || 0) + 1
    })
    
    let mostCommonTransition = { from: '', to: '', count: 0 }
    
    Object.entries(transitions).forEach(([key, count]) => {
      if (count > mostCommonTransition.count) {
        const [from, to] = key.split('-')
        mostCommonTransition = { from, to, count }
      }
    })
    
    return {
      totalChanges,
      upgradeCount,
      downgradeCount,
      stayCount,
      transactionCount,
      kolektibilitasDistribution,
      mostCommonTransition
    }
  }
  
  // Get stats
  
  const stats = calculateStats()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>Summary Statistics</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CustomAvatar skin='light' variant='rounded' color='primary' sx={{ mr: 3 }}>
                <i className='ri-file-list-3-line' />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='subtitle2' color='text.secondary'>Total Changes</Typography>
                <Typography variant='h6'>{stats.totalChanges}</Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CustomAvatar skin='light' variant='rounded' color='success' sx={{ mr: 3 }}>
                <i className='ri-bank-card-line' />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='subtitle2' color='text.secondary'>Unique Transactions</Typography>
                <Typography variant='h6'>{stats.transactionCount}</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant='subtitle1' sx={{ mb: 2 }}>Change Types</Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant='body2'>Upgrades (Improvement)</Typography>
                <Typography variant='body2' color='success.main'>
                  {stats.upgradeCount} ({((stats.upgradeCount / stats.totalChanges) * 100).toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress 
                variant='determinate' 
                value={(stats.upgradeCount / stats.totalChanges) * 100} 
                color='success'
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant='body2'>Downgrades (Deterioration)</Typography>
                <Typography variant='body2' color='error.main'>
                  {stats.downgradeCount} ({((stats.downgradeCount / stats.totalChanges) * 100).toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress 
                variant='determinate' 
                value={(stats.downgradeCount / stats.totalChanges) * 100} 
                color='error'
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant='body2'>No Change (Same Kolektibilitas)</Typography>
                <Typography variant='body2' color='info.main'>
                  {stats.stayCount} ({((stats.stayCount / stats.totalChanges) * 100).toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress 
                variant='determinate' 
                value={(stats.stayCount / stats.totalChanges) * 100} 
                color='info'
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant='subtitle1' sx={{ mb: 2 }}>Most Common Transition</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip 
                label={`Kol-${stats.mostCommonTransition.from}`} 
                color={getKolektibilitasColor(stats.mostCommonTransition.from)}
                size='small'
                sx={{ mr: 1 }}
              />
              <i className='ri-arrow-right-line' style={{ margin: '0 8px' }} />
              <Chip 
                label={`Kol-${stats.mostCommonTransition.to}`} 
                color={getKolektibilitasColor(stats.mostCommonTransition.to)}
                size='small'
                sx={{ mr: 2 }}
              />
              <Typography variant='body2'>
                ({stats.mostCommonTransition.count} occurrences)
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>Current Kolektibilitas Distribution</Typography>
            
            {Object.entries(stats.kolektibilitasDistribution).map(([kol, count]) => (
              <Box key={kol} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={`Kol-${kol}`} 
                      color={getKolektibilitasColor(kol)}
                      size='small'
                      sx={{ mr: 2 }}
                    />
                    <Typography variant='body2'>
                      {getKolektibilitasDescription(kol)}
                    </Typography>
                  </Box>
                  <Typography variant='body2'>
                    {count} ({((count / stats.transactionCount) * 100).toFixed(1)}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant='determinate' 
                  value={(count / stats.transactionCount) * 100} 
                  color={getKolektibilitasColor(kol) === 'success' ? 'success' : 
                         getKolektibilitasColor(kol) === 'info' ? 'info' : 
                         getKolektibilitasColor(kol) === 'warning' ? 'warning' : 
                         getKolektibilitasColor(kol) === 'error' ? 'error' : 'primary'}
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            ))}
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant='subtitle1' sx={{ mb: 2 }}>Risk Assessment</Typography>
            
            <TableContainer component={Paper} variant='outlined'>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Risk Category</TableCell>
                    <TableCell align='right'>Count</TableCell>
                    <TableCell align='right'>Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography variant='body2' color='success.main'>Low Risk (Kol-1)</Typography>
                    </TableCell>
                    <TableCell align='right'>{stats.kolektibilitasDistribution['1']}</TableCell>
                    <TableCell align='right'>
                      {((stats.kolektibilitasDistribution['1'] / stats.transactionCount) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant='body2' color='info.main'>Medium Risk (Kol-2)</Typography>
                    </TableCell>
                    <TableCell align='right'>{stats.kolektibilitasDistribution['2']}</TableCell>
                    <TableCell align='right'>
                      {((stats.kolektibilitasDistribution['2'] / stats.transactionCount) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant='body2' color='warning.main'>High Risk (Kol-3)</Typography>
                    </TableCell>
                    <TableCell align='right'>{stats.kolektibilitasDistribution['3']}</TableCell>
                    <TableCell align='right'>
                      {((stats.kolektibilitasDistribution['3'] / stats.transactionCount) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant='body2' color='error.main'>Very High Risk (Kol-4,5)</Typography>
                    </TableCell>
                    <TableCell align='right'>
                      {stats.kolektibilitasDistribution['4'] + stats.kolektibilitasDistribution['5']}
                    </TableCell>
                    <TableCell align='right'>
                      {(((stats.kolektibilitasDistribution['4'] + stats.kolektibilitasDistribution['5']) / stats.transactionCount) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

// Helper functions
const getKolektibilitasColor = (kol: string) => {
  switch (kol) {
    case '1': return 'success'
    case '2': return 'info'
    case '3': return 'warning'
    case '4': return 'error'
    case '5': return 'error'
    default: return 'default'
  }
}

const getKolektibilitasDescription = (kol: string) => {
  switch (kol) {
    case '1': return 'Lancar'
    case '2': return 'Dalam Perhatian Khusus'
    case '3': return 'Kurang Lancar'
    case '4': return 'Diragukan'
    case '5': return 'Macet'
    default: return ''
  }
}

export default KolektibilitasHistoryStats
