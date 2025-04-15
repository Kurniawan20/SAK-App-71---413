'use client'

// React Imports
import { FC } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

interface SimulationResultsProps {
  results: {
    pd: number
    lgd: number
    adjustmentFactor: number
    scenarioProbability: number
    scenarioName: string
  }[]
  basePd: number
  baseLgd: number
  segment: string
}

const SimulationResults: FC<SimulationResultsProps> = ({ results, basePd, baseLgd, segment }) => {
  // Calculate weighted average PD and LGD
  const weightedPd = results.reduce(
    (acc, result) => acc + result.pd * result.scenarioProbability,
    0
  )
  
  const weightedLgd = results.reduce(
    (acc, result) => acc + result.lgd * result.scenarioProbability,
    0
  )
  
  // Calculate percentage changes
  const pdPercentChange = ((weightedPd - basePd) / basePd) * 100
  const lgdPercentChange = ((weightedLgd - baseLgd) / baseLgd) * 100
  
  // Prepare chart data
  const scenarioChartData = {
    labels: results.map(result => result.scenarioName),
    datasets: [
      {
        data: results.map(result => result.scenarioProbability * 100),
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',  // Base - Blue
          'rgba(75, 192, 192, 0.7)',  // Upside - Green
          'rgba(255, 159, 64, 0.7)',  // Downside - Orange
          'rgba(255, 99, 132, 0.7)'   // Severe Downside - Red
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  }
  
  return (
    <Card>
      <CardContent>
        <Typography variant='h6' sx={{ mb: 4 }}>
          Simulation Results for {segment} Segment
        </Typography>
        
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%'
            }}>
              <Typography variant='subtitle1' gutterBottom>
                Scenario Probability Distribution
              </Typography>
              <Box sx={{ height: 250, width: '100%' }}>
                <Doughnut 
                  data={scenarioChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant='outlined' sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='subtitle1' gutterBottom>
                      Probability of Default (PD)
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant='body2' color='text.secondary'>
                        Base PD:
                      </Typography>
                      <Typography variant='body1' fontWeight='medium'>
                        {(basePd * 100).toFixed(2)}%
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant='body2' color='text.secondary'>
                        Weighted PD:
                      </Typography>
                      <Typography variant='body1' fontWeight='medium'>
                        {(weightedPd * 100).toFixed(2)}%
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant='body2' color='text.secondary'>
                        Change:
                      </Typography>
                      <Typography 
                        variant='body1' 
                        fontWeight='medium'
                        color={pdPercentChange >= 0 ? 'error.main' : 'success.main'}
                      >
                        {pdPercentChange >= 0 ? '+' : ''}{pdPercentChange.toFixed(2)}%
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant='caption' color='text.secondary'>
                      {pdPercentChange >= 0 
                        ? 'PD has increased due to forward-looking adjustments, indicating higher credit risk.' 
                        : 'PD has decreased due to forward-looking adjustments, indicating lower credit risk.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant='outlined' sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant='subtitle1' gutterBottom>
                      Loss Given Default (LGD)
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant='body2' color='text.secondary'>
                        Base LGD:
                      </Typography>
                      <Typography variant='body1' fontWeight='medium'>
                        {(baseLgd * 100).toFixed(2)}%
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant='body2' color='text.secondary'>
                        Weighted LGD:
                      </Typography>
                      <Typography variant='body1' fontWeight='medium'>
                        {(weightedLgd * 100).toFixed(2)}%
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant='body2' color='text.secondary'>
                        Change:
                      </Typography>
                      <Typography 
                        variant='body1' 
                        fontWeight='medium'
                        color={lgdPercentChange >= 0 ? 'error.main' : 'success.main'}
                      >
                        {lgdPercentChange >= 0 ? '+' : ''}{lgdPercentChange.toFixed(2)}%
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant='caption' color='text.secondary'>
                      {lgdPercentChange >= 0 
                        ? 'LGD has increased due to forward-looking adjustments, indicating higher potential losses.' 
                        : 'LGD has decreased due to forward-looking adjustments, indicating lower potential losses.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant='subtitle1' gutterBottom>
              Detailed Scenario Results
            </Typography>
            
            <TableContainer component={Paper} variant='outlined'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Scenario</TableCell>
                    <TableCell>Probability</TableCell>
                    <TableCell>PD</TableCell>
                    <TableCell>PD Adjustment</TableCell>
                    <TableCell>LGD</TableCell>
                    <TableCell>LGD Adjustment</TableCell>
                    <TableCell>Weighted Impact</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((result, index) => {
                    // Calculate percentage changes
                    const pdChange = ((result.pd - basePd) / basePd) * 100
                    const lgdChange = ((result.lgd - baseLgd) / baseLgd) * 100
                    
                    // Calculate weighted impact (simplified)
                    const weightedImpact = (pdChange + lgdChange) * result.scenarioProbability
                    
                    // Get color based on impact
                    const getImpactColor = (value: number): 'success' | 'info' | 'warning' | 'error' => {
                      if (value < -10) return 'success'
                      if (value < 0) return 'info'
                      if (value < 10) return 'warning'
                      return 'error'
                    }
                    
                    return (
                      <TableRow key={index}>
                        <TableCell>{result.scenarioName}</TableCell>
                        <TableCell>{(result.scenarioProbability * 100).toFixed(1)}%</TableCell>
                        <TableCell>{(result.pd * 100).toFixed(2)}%</TableCell>
                        <TableCell>
                          <Typography 
                            color={pdChange >= 0 ? 'error.main' : 'success.main'}
                            variant='body2'
                          >
                            {pdChange >= 0 ? '+' : ''}{pdChange.toFixed(2)}%
                          </Typography>
                        </TableCell>
                        <TableCell>{(result.lgd * 100).toFixed(2)}%</TableCell>
                        <TableCell>
                          <Typography 
                            color={lgdChange >= 0 ? 'error.main' : 'success.main'}
                            variant='body2'
                          >
                            {lgdChange >= 0 ? '+' : ''}{lgdChange.toFixed(2)}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${weightedImpact >= 0 ? '+' : ''}${weightedImpact.toFixed(2)}%`}
                            color={getImpactColor(weightedImpact)}
                            size='small'
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default SimulationResults
