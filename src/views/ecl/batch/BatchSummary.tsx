'use client'

// React Imports
import { FC } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// Third-party Imports
import { Doughnut, Bar } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

// Type Imports
import type { ECLCalculationBatch } from '@/data/ecl/eclData'

interface BatchSummaryProps {
  batch: ECLCalculationBatch
}

const BatchSummary: FC<BatchSummaryProps> = ({ batch }) => {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  // Format number
  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('id-ID').format(value)
  }
  
  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`
  }
  
  // Calculate ECL percentage
  const eclPercentage = (batch.total_ecl / batch.total_exposure) * 100
  
  // Sample data for stage distribution
  const stageDistribution = {
    'Stage 1': 75,
    'Stage 2': 20,
    'Stage 3': 5
  }
  
  // Sample data for segment distribution
  const segmentDistribution = {
    'Retail': 45,
    'Commercial': 35,
    'Corporate': 20
  }
  
  // Sample data for akad type distribution
  const akadDistribution = {
    'Murabahah': 60,
    'Musyarakah': 20,
    'Mudharabah': 15,
    'Ijarah': 5
  }
  
  // Prepare chart data for stage distribution
  const stageChartData = {
    labels: Object.keys(stageDistribution),
    datasets: [
      {
        data: Object.values(stageDistribution),
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 99, 132, 0.7)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  }
  
  // Prepare chart data for segment distribution
  const segmentChartData = {
    labels: Object.keys(segmentDistribution),
    datasets: [
      {
        label: 'Segment Distribution',
        data: Object.values(segmentDistribution),
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 205, 86, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 205, 86, 1)'
        ],
        borderWidth: 1
      }
    ]
  }
  
  // Sample data for ECL by segment
  const eclBySegment = [
    { segment: 'Retail', ecl: batch.total_ecl * 0.45, exposure: batch.total_exposure * 0.45 },
    { segment: 'Commercial', ecl: batch.total_ecl * 0.35, exposure: batch.total_exposure * 0.35 },
    { segment: 'Corporate', ecl: batch.total_ecl * 0.20, exposure: batch.total_exposure * 0.20 }
  ]
  
  // Sample data for ECL by stage
  const eclByStage = [
    { stage: 'Stage 1', ecl: batch.total_ecl * 0.15, exposure: batch.total_exposure * 0.75 },
    { stage: 'Stage 2', ecl: batch.total_ecl * 0.35, exposure: batch.total_exposure * 0.20 },
    { stage: 'Stage 3', ecl: batch.total_ecl * 0.50, exposure: batch.total_exposure * 0.05 }
  ]
  
  return (
    <Box>
      <Paper variant='outlined' sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle2' color='text.secondary'>
              Batch Name
            </Typography>
            <Typography variant='body1' gutterBottom>
              {batch.batch_name}
            </Typography>
            
            <Typography variant='subtitle2' color='text.secondary'>
              Calculation Date
            </Typography>
            <Typography variant='body1' gutterBottom>
              {batch.calculation_date}
            </Typography>
            
            <Typography variant='subtitle2' color='text.secondary'>
              Created By
            </Typography>
            <Typography variant='body1' gutterBottom>
              {batch.created_by}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle2' color='text.secondary'>
              Status
            </Typography>
            <Typography variant='body1' gutterBottom>
              <Chip 
                label={batch.status}
                color={
                  batch.status === 'Completed' ? 'success' :
                  batch.status === 'Failed' ? 'error' :
                  batch.status === 'In Progress' ? 'info' : 'warning'
                }
              />
            </Typography>
            
            <Typography variant='subtitle2' color='text.secondary'>
              Created Date
            </Typography>
            <Typography variant='body1' gutterBottom>
              {batch.created_date}
            </Typography>
            
            <Typography variant='subtitle2' color='text.secondary'>
              Completed Date
            </Typography>
            <Typography variant='body1' gutterBottom>
              {batch.completed_date || 'Not completed yet'}
            </Typography>
          </Grid>
          
          {batch.notes && (
            <Grid item xs={12}>
              <Typography variant='subtitle2' color='text.secondary'>
                Notes
              </Typography>
              <Typography variant='body1'>
                {batch.notes}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
      
      <Typography variant='h6' gutterBottom>
        Calculation Summary
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='subtitle2' color='text.secondary'>
                Total Transactions
              </Typography>
              <Typography variant='h5' gutterBottom>
                {formatNumber(batch.number_of_transactions)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='subtitle2' color='text.secondary'>
                Total Exposure
              </Typography>
              <Typography variant='h5' gutterBottom>
                {formatCurrency(batch.total_exposure)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='subtitle2' color='text.secondary'>
                Total ECL
              </Typography>
              <Typography variant='h5' color='error.main' gutterBottom>
                {formatCurrency(batch.total_ecl)}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {formatPercentage(eclPercentage)} of total exposure
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card variant='outlined' sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Stage Distribution
              </Typography>
              
              <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
                <Doughnut 
                  data={stageChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw as number;
                            return `${label}: ${value}%`;
                          }
                        }
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
          
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                ECL by Stage
              </Typography>
              
              <TableContainer>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Stage</TableCell>
                      <TableCell align='right'>Exposure</TableCell>
                      <TableCell align='right'>ECL</TableCell>
                      <TableCell align='right'>Coverage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {eclByStage.map((item, index) => {
                      const coverage = (item.ecl / item.exposure) * 100
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Chip 
                              label={item.stage}
                              color={
                                item.stage === 'Stage 1' ? 'success' :
                                item.stage === 'Stage 2' ? 'warning' : 'error'
                              }
                              size='small'
                            />
                          </TableCell>
                          <TableCell align='right'>{formatCurrency(item.exposure)}</TableCell>
                          <TableCell align='right'>{formatCurrency(item.ecl)}</TableCell>
                          <TableCell align='right'>{formatPercentage(coverage)}</TableCell>
                        </TableRow>
                      )
                    })}
                    <TableRow>
                      <TableCell><strong>Total</strong></TableCell>
                      <TableCell align='right'><strong>{formatCurrency(batch.total_exposure)}</strong></TableCell>
                      <TableCell align='right'><strong>{formatCurrency(batch.total_ecl)}</strong></TableCell>
                      <TableCell align='right'><strong>{formatPercentage(eclPercentage)}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant='outlined' sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Segment Distribution
              </Typography>
              
              <Box sx={{ height: 250 }}>
                <Bar 
                  data={segmentChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw as number;
                            return `${label}: ${value}%`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
          
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                ECL by Segment
              </Typography>
              
              <TableContainer>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Segment</TableCell>
                      <TableCell align='right'>Exposure</TableCell>
                      <TableCell align='right'>ECL</TableCell>
                      <TableCell align='right'>Coverage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {eclBySegment.map((item, index) => {
                      const coverage = (item.ecl / item.exposure) * 100
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>{item.segment}</TableCell>
                          <TableCell align='right'>{formatCurrency(item.exposure)}</TableCell>
                          <TableCell align='right'>{formatCurrency(item.ecl)}</TableCell>
                          <TableCell align='right'>{formatPercentage(coverage)}</TableCell>
                        </TableRow>
                      )
                    })}
                    <TableRow>
                      <TableCell><strong>Total</strong></TableCell>
                      <TableCell align='right'><strong>{formatCurrency(batch.total_exposure)}</strong></TableCell>
                      <TableCell align='right'><strong>{formatCurrency(batch.total_ecl)}</strong></TableCell>
                      <TableCell align='right'><strong>{formatPercentage(eclPercentage)}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Typography variant='h6' sx={{ mt: 4, mb: 2 }}>
        ECL Coverage Ratio by Segment
      </Typography>
      
      <Grid container spacing={2}>
        {eclBySegment.map((item, index) => {
          const coverage = (item.ecl / item.exposure) * 100
          
          return (
            <Grid item xs={12} key={index}>
              <Box sx={{ mb: 1 }}>
                <Typography variant='subtitle2'>
                  {item.segment}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant='determinate' 
                      value={coverage > 10 ? 10 : coverage} // Cap at 10% for visualization
                      color={
                        coverage < 1 ? 'success' :
                        coverage < 5 ? 'info' :
                        coverage < 10 ? 'warning' : 'error'
                      }
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 50 }}>
                    <Typography variant='body2' color='text.secondary'>
                      {formatPercentage(coverage)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          )
        })}
      </Grid>
      
      <Typography variant='h6' sx={{ mt: 4, mb: 2 }}>
        ECL Coverage Ratio by Stage
      </Typography>
      
      <Grid container spacing={2}>
        {eclByStage.map((item, index) => {
          const coverage = (item.ecl / item.exposure) * 100
          
          return (
            <Grid item xs={12} key={index}>
              <Box sx={{ mb: 1 }}>
                <Typography variant='subtitle2'>
                  {item.stage}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant='determinate' 
                      value={coverage > 20 ? 20 : coverage} // Cap at 20% for visualization
                      color={
                        item.stage === 'Stage 1' ? 'success' :
                        item.stage === 'Stage 2' ? 'warning' : 'error'
                      }
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 50 }}>
                    <Typography variant='body2' color='text.secondary'>
                      {formatPercentage(coverage)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default BatchSummary
