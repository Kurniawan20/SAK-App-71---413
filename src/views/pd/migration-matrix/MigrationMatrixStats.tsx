'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Avatar from '@mui/material/Avatar'

// Type Imports
import type { MigrationMatrix } from '@/data/pd/migrationMatrixData'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

interface MigrationMatrixStatsProps {
  data: MigrationMatrix[]
}

const MigrationMatrixStats = ({ data }: MigrationMatrixStatsProps) => {
  // Calculate stats from data
  const calculateStats = () => {
    // Default period if data is empty
    if (data.length === 0) {
      return {
        period: 'No Data',
        stayProbability: 0,
        downgradeProbability: 0,
        upgradeProbability: 0,
        defaultProbability: 0
      }
    }
    
    // Get period from first data item
    const period = `${data[0].periode_awal} to ${data[0].periode_akhir}`
    
    // Calculate average stay probability (diagonal elements)
    const stayItems = data.filter(item => item.dari_kolektibilitas === item.ke_kolektibilitas)
    const stayProbability = stayItems.reduce((sum, item) => sum + item.probability_value, 0) / stayItems.length
    
    // Calculate downgrade probability (below diagonal)
    const downgradeItems = data.filter(item => 
      parseInt(item.dari_kolektibilitas) < parseInt(item.ke_kolektibilitas)
    )
    const totalDowngradeProbability = downgradeItems.reduce((sum, item) => sum + item.probability_value, 0)
    const downgradeProbability = totalDowngradeProbability / 5 // Average across 5 kolektibilitas
    
    // Calculate upgrade probability (above diagonal)
    const upgradeItems = data.filter(item => 
      parseInt(item.dari_kolektibilitas) > parseInt(item.ke_kolektibilitas)
    )
    const totalUpgradeProbability = upgradeItems.reduce((sum, item) => sum + item.probability_value, 0)
    const upgradeProbability = totalUpgradeProbability / 5 // Average across 5 kolektibilitas
    
    // Calculate default probability (transitions to Kol-5)
    const defaultItems = data.filter(item => item.ke_kolektibilitas === '5' && item.dari_kolektibilitas !== '5')
    const defaultProbability = defaultItems.reduce((sum, item) => sum + item.probability_value, 0) / 4 // Average across 4 kolektibilitas (excluding 5)
    
    return {
      period,
      stayProbability,
      downgradeProbability,
      upgradeProbability,
      defaultProbability
    }
  }
  
  // Get stats
  const stats = calculateStats()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(5)} !important` }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' variant='rounded' color='primary' sx={{ mr: 3 }}>
                <i className='ri-time-line' />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h6'>Periode</Typography>
                <Typography variant='body2'>{stats.period}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(5)} !important` }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' variant='rounded' color='success' sx={{ mr: 3 }}>
                <i className='ri-arrow-right-circle-line' />
              </CustomAvatar>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  <Typography variant='h6'>Stay Probability</Typography>
                  <Typography variant='subtitle2' sx={{ color: 'success.main' }}>
                    {(stats.stayProbability * 100).toFixed(2)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant='determinate' 
                  value={stats.stayProbability * 100} 
                  color='success'
                  sx={{ height: 6, mt: 1, borderRadius: 1 }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(5)} !important` }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' variant='rounded' color='warning' sx={{ mr: 3 }}>
                <i className='ri-arrow-down-circle-line' />
              </CustomAvatar>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  <Typography variant='h6'>Downgrade</Typography>
                  <Typography variant='subtitle2' sx={{ color: 'warning.main' }}>
                    {(stats.downgradeProbability * 100).toFixed(2)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant='determinate' 
                  value={stats.downgradeProbability * 100} 
                  color='warning'
                  sx={{ height: 6, mt: 1, borderRadius: 1 }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(5)} !important` }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' variant='rounded' color='error' sx={{ mr: 3 }}>
                <i className='ri-close-circle-line' />
              </CustomAvatar>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  <Typography variant='h6'>Default Risk</Typography>
                  <Typography variant='subtitle2' sx={{ color: 'error.main' }}>
                    {(stats.defaultProbability * 100).toFixed(2)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant='determinate' 
                  value={stats.defaultProbability * 100} 
                  color='error'
                  sx={{ height: 6, mt: 1, borderRadius: 1 }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default MigrationMatrixStats
