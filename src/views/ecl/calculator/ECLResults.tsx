'use client'

// React Imports
import { FC } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import LinearProgress from '@mui/material/LinearProgress'
import Tooltip from '@mui/material/Tooltip'

// Third-party Imports
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js'

// Register ChartJS components
ChartJS.register(ArcElement, ChartTooltip, Legend)

// Type Imports
import type { ECLCalculationResult } from '@/data/ecl/eclData'

interface ECLResultsProps {
  result: ECLCalculationResult
}

const ECLResults: FC<ECLResultsProps> = ({ result }) => {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`
  }
  
  // Get stage color
  const getStageColor = (stage: string): 'success' | 'warning' | 'error' => {
    switch (stage) {
      case 'Stage 1':
        return 'success'
      case 'Stage 2':
        return 'warning'
      case 'Stage 3':
        return 'error'
      default:
        return 'success'
    }
  }
  
  // Prepare chart data
  const chartData = {
    labels: ['Expected Credit Loss', 'Remaining Exposure'],
    datasets: [
      {
        data: [
          result.expected_credit_loss,
          result.exposure_at_default - result.expected_credit_loss
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }
    ]
  }
  
  // Calculate ECL components for the table
  const eclComponents = [
    {
      component: 'EAD × PD × LGD',
      formula: `${formatCurrency(result.exposure_at_default)} × ${formatPercentage(result.probability_of_default)} × ${formatPercentage(result.loss_given_default)}`,
      value: result.exposure_at_default * result.probability_of_default * result.loss_given_default,
      description: 'Base ECL calculation before discounting'
    },
    {
      component: 'Discount Factor',
      formula: `1 / (1 + ${formatPercentage(result.discount_rate)})^t`,
      value: result.time_horizon === '12-Month' ? 1 / (1 + result.discount_rate) : 1 / (1 + result.discount_rate / 2),
      description: 'Present value adjustment factor'
    },
    {
      component: 'Final ECL',
      formula: 'EAD × PD × LGD × Discount Factor',
      value: result.expected_credit_loss,
      description: 'Final Expected Credit Loss amount'
    }
  ]
  
  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ECL Calculation Summary
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {result.transaction_id}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary">
                    Calculation Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {result.calculation_date}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary">
                    Calculation Type
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {result.calculation_type}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Assigned Stage
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <Chip 
                      label={result.assigned_stage}
                      color={getStageColor(result.assigned_stage)}
                      size="small"
                    />
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary">
                    Time Horizon
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {result.time_horizon}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <Chip 
                      label={result.is_final ? 'Final' : 'Draft'}
                      color={result.is_final ? 'success' : 'warning'}
                      size="small"
                    />
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Exposure at Default (EAD)
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {formatCurrency(result.exposure_at_default)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Expected Credit Loss (ECL)
                  </Typography>
                  <Typography variant="h6" color="error.main" gutterBottom>
                    {formatCurrency(result.expected_credit_loss)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Probability of Default (PD)
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatPercentage(result.probability_of_default)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Loss Given Default (LGD)
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatPercentage(result.loss_given_default)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Discount Rate
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatPercentage(result.discount_rate)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    ECL Percentage
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatPercentage(result.ecl_percentage)}
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                ECL Coverage Ratio
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={result.ecl_percentage * 100} 
                    color={
                      result.ecl_percentage < 0.01 ? 'success' :
                      result.ecl_percentage < 0.05 ? 'info' :
                      result.ecl_percentage < 0.2 ? 'warning' : 'error'
                    }
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">
                    {formatPercentage(result.ecl_percentage)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                ECL as a percentage of Exposure at Default
              </Typography>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ECL Calculation Components
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Component</TableCell>
                      <TableCell>Formula</TableCell>
                      <TableCell align="right">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {eclComponents.map((component, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Tooltip title={component.description}>
                            <Typography variant="body2">{component.component}</Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{component.formula}</TableCell>
                        <TableCell align="right">{formatCurrency(component.value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Note: The actual calculation may involve more complex factors such as time value of money, 
                cash flow timing, and forward-looking adjustments.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ECL Visualization
              </Typography>
              
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <Doughnut 
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw as number;
                            return `${label}: ${formatCurrency(value)} (${((value / result.exposure_at_default) * 100).toFixed(2)}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="h5">
                  {formatPercentage(result.ecl_percentage)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ECL Coverage Ratio
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Accounting Implications
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Account</TableCell>
                      <TableCell>Debit</TableCell>
                      <TableCell>Credit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Impairment Loss (P&L)</TableCell>
                      <TableCell>{formatCurrency(result.expected_credit_loss)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Allowance for ECL (Balance Sheet)</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{formatCurrency(result.expected_credit_loss)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  PSAK 71 & 413 Compliance Notes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This calculation follows the Expected Credit Loss model required by PSAK 71 and PSAK 413 for Islamic financial instruments.
                  The ECL is calculated based on probability-weighted scenarios, incorporating forward-looking information.
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  For {result.assigned_stage === 'Stage 1' ? '12-month' : 'lifetime'} ECL, the calculation considers:
                  <ul>
                    <li>Probability of Default (PD) over the {result.time_horizon === '12-Month' ? 'next 12 months' : 'remaining lifetime'}</li>
                    <li>Loss Given Default (LGD) based on recovery expectations</li>
                    <li>Exposure at Default (EAD) considering expected repayments</li>
                    <li>Time value of money using appropriate discount rate</li>
                  </ul>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ECLResults
