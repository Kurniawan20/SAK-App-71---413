'use client'

// React Imports
import { FC } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import LinearProgress from '@mui/material/LinearProgress'
import Tooltip from '@mui/material/Tooltip'

// Third-party Imports
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js'

// Register ChartJS components
ChartJS.register(ArcElement, ChartTooltip, Legend)

// Type Imports
import type { 
  EconomicVariable
} from '@/data/fla/economicData'

import type {
  FLAAdjustment,
  VariableImpact
} from '@/data/fla/adjustmentData'

interface AdjustmentSummaryProps {
  adjustment: FLAAdjustment
  variableImpacts: VariableImpact[]
  economicVariables: EconomicVariable[]
}

const AdjustmentSummary: FC<AdjustmentSummaryProps> = ({
  adjustment,
  variableImpacts,
  economicVariables
}) => {
  // Helper function to get variable name
  const getVariableName = (variableId: number): string => {
    const variable = economicVariables.find(v => v.variable_id === variableId)
    return variable ? variable.name : 'Unknown'
  }
  
  // Helper function to get variable type
  const getVariableType = (variableId: number): string => {
    const variable = economicVariables.find(v => v.variable_id === variableId)
    return variable ? variable.type : 'Unknown'
  }
  
  // Helper function to get variable unit
  const getVariableUnit = (variableId: number): string => {
    const variable = economicVariables.find(v => v.variable_id === variableId)
    return variable ? variable.unit : ''
  }
  
  // Prepare chart data for variable impacts
  const variableImpactChartData = {
    labels: variableImpacts.map(impact => getVariableName(impact.variable_id)),
    datasets: [
      {
        data: variableImpacts.map(impact => impact.impact_weight * 100),
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(201, 203, 207, 0.7)',
          'rgba(255, 99, 71, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(201, 203, 207, 1)',
          'rgba(255, 99, 71, 1)'
        ],
        borderWidth: 1
      }
    ]
  }
  
  return (
    <Card>
      <CardContent>
        <Typography variant='h6' sx={{ mb: 4 }}>
          Adjustment Summary
        </Typography>
        
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 4 }}>
              <Typography variant='subtitle2' color='text.secondary'>
                Adjustment Name
              </Typography>
              <Typography variant='body1' fontWeight='medium'>
                {adjustment.name}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant='subtitle2' color='text.secondary'>
                Description
              </Typography>
              <Typography variant='body1'>
                {adjustment.description}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant='subtitle2' color='text.secondary'>
                Effective Period
              </Typography>
              <Typography variant='body1'>
                {new Date(adjustment.effective_date).toLocaleDateString()} to {new Date(adjustment.expiry_date).toLocaleDateString()}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant='subtitle2' color='text.secondary'>
                Status
              </Typography>
              <Chip 
                label={adjustment.is_active ? 'Active' : 'Inactive'} 
                color={adjustment.is_active ? 'success' : 'default'}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography variant='subtitle1' gutterBottom>
              Economic Variable Impact Weights
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: 250 }}>
                  <Pie 
                    data={variableImpactChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            boxWidth: 12
                          }
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.label}: ${context.raw}%`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TableContainer component={Paper} variant='outlined' sx={{ maxHeight: 250, overflow: 'auto' }}>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Variable</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Weight</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {variableImpacts.map(impact => (
                        <TableRow key={impact.impact_id}>
                          <TableCell>{getVariableName(impact.variable_id)}</TableCell>
                          <TableCell>{getVariableType(impact.variable_id)}</TableCell>
                          <TableCell>{(impact.impact_weight * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant='subtitle1' gutterBottom>
              Variable Impact Details
            </Typography>
            
            <Box>
              {variableImpacts.map(impact => {
                const variableName = getVariableName(impact.variable_id)
                const variableUnit = getVariableUnit(impact.variable_id)
                
                return (
                  <Box key={impact.impact_id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant='body2'>
                        {variableName}
                      </Typography>
                      <Typography variant='body2' fontWeight='medium'>
                        {(impact.impact_weight * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                    <Tooltip title={`Impact weight: ${(impact.impact_weight * 100).toFixed(1)}%`}>
                      <LinearProgress 
                        variant='determinate' 
                        value={impact.impact_weight * 100} 
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Tooltip>
                  </Box>
                )
              })}
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant='subtitle2' gutterBottom>
            Adjustment Methodology:
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            This forward-looking adjustment applies weighted impacts from multiple economic variables to adjust PD and LGD values.
            The adjustment factors are applied to base PD and LGD values across different scenarios and customer segments.
            Each economic variable's impact is weighted according to its correlation with credit risk metrics and its predictive power.
            The resulting adjusted values reflect expected changes in credit risk due to forecasted economic conditions.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AdjustmentSummary
