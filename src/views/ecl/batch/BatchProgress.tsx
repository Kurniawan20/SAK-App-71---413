'use client'

// React Imports
import { FC } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Alert from '@mui/material/Alert'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'

// Type Imports
import type { ECLCalculationBatch } from '@/data/ecl/eclData'

interface BatchProgressProps {
  batch: ECLCalculationBatch | null
  progressValue: number
  progressStep: number
  onCancel: () => void
}

const BatchProgress: FC<BatchProgressProps> = ({
  batch,
  progressValue,
  progressStep,
  onCancel
}) => {
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
  
  // Calculate estimated time remaining
  const getEstimatedTimeRemaining = (): string => {
    if (progressValue >= 100) return 'Completed'
    
    const remainingPercentage = 100 - progressValue
    const minutesRemaining = Math.ceil(remainingPercentage / 10) // Assuming 10% progress per minute
    
    if (minutesRemaining <= 1) return 'Less than a minute'
    return `Approximately ${minutesRemaining} minutes`
  }
  
  // Get step label
  const getStepLabel = (step: number): string => {
    switch (step) {
      case 0:
        return 'Data Preparation'
      case 1:
        return 'Staging Assessment'
      case 2:
        return 'ECL Calculation'
      case 3:
        return 'Result Processing'
      case 4:
        return 'Completed'
      default:
        return `Step ${step + 1}`
    }
  }
  
  // Get step description
  const getStepDescription = (step: number): string => {
    switch (step) {
      case 0:
        return 'Loading transaction data and preparing calculation inputs'
      case 1:
        return 'Assessing staging criteria and assigning stages to transactions'
      case 2:
        return 'Calculating ECL components (PD, LGD, EAD) and applying adjustments'
      case 3:
        return 'Processing and storing calculation results'
      case 4:
        return 'Batch calculation completed successfully'
      default:
        return ''
    }
  }
  
  // Calculate progress statistics
  const getProgressStats = () => {
    if (!batch) return { processed: 0, remaining: 0, total: 0 }
    
    const total = batch.number_of_transactions
    const processed = Math.floor(total * (progressValue / 100))
    const remaining = total - processed
    
    return { processed, remaining, total }
  }
  
  const stats = getProgressStats()
  
  return (
    <Box>
      {batch ? (
        <>
          <Alert 
            severity={progressValue >= 100 ? 'success' : 'info'} 
            sx={{ mb: 3 }}
          >
            {progressValue >= 100 ? (
              'Batch calculation completed successfully. You can view the results in the History tab.'
            ) : (
              'Batch calculation is in progress. Please do not close this page.'
            )}
          </Alert>
          
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper variant='outlined' sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={2}>
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
                      Total Transactions
                    </Typography>
                    <Typography variant='body1' gutterBottom>
                      {formatNumber(batch.number_of_transactions)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Typography variant='h6' gutterBottom>
                Progress
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant='determinate' 
                      value={progressValue} 
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant='body2' color='text.secondary'>
                      {`${Math.round(progressValue)}%`}
                    </Typography>
                  </Box>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant='subtitle2' align='center'>
                      {formatNumber(stats.processed)}
                    </Typography>
                    <Typography variant='caption' color='text.secondary' align='center' display='block'>
                      Processed
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant='subtitle2' align='center'>
                      {formatNumber(stats.remaining)}
                    </Typography>
                    <Typography variant='caption' color='text.secondary' align='center' display='block'>
                      Remaining
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant='subtitle2' align='center'>
                      {formatNumber(stats.total)}
                    </Typography>
                    <Typography variant='caption' color='text.secondary' align='center' display='block'>
                      Total
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant='subtitle2' gutterBottom>
                  Estimated Time Remaining
                </Typography>
                <Typography variant='body1'>
                  {getEstimatedTimeRemaining()}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <Stepper activeStep={progressStep} orientation='vertical'>
                  {[0, 1, 2, 3, 4].map((step) => (
                    <Step key={step}>
                      <StepLabel>{getStepLabel(step)}</StepLabel>
                      <Typography variant='caption' color='text.secondary' sx={{ ml: 3 }}>
                        {getStepDescription(step)}
                      </Typography>
                    </Step>
                  ))}
                </Stepper>
              </Box>
              
              {progressValue < 100 && (
                <Box sx={{ mt: 4 }}>
                  <Button 
                    variant='outlined' 
                    color='error'
                    onClick={onCancel}
                  >
                    Cancel Batch Calculation
                  </Button>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant='h6' gutterBottom>
                Calculation Statistics
              </Typography>
              
              <Card variant='outlined' sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Total Exposure
                  </Typography>
                  <Typography variant='h6' gutterBottom>
                    {formatCurrency(batch.total_exposure)}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant='subtitle2' color='text.secondary'>
                    Estimated Total ECL
                  </Typography>
                  <Typography variant='h6' color='error.main'>
                    {progressValue >= 60 ? 
                      formatCurrency(batch.total_exposure * 0.03) : 
                      'Calculating...'}
                  </Typography>
                  
                  {progressValue >= 60 && (
                    <Typography variant='caption' color='text.secondary'>
                      Approximately 3.0% of total exposure
                    </Typography>
                  )}
                </CardContent>
              </Card>
              
              <Card variant='outlined'>
                <CardContent>
                  <Typography variant='subtitle2' gutterBottom>
                    Stage Distribution
                  </Typography>
                  
                  {progressValue >= 30 ? (
                    <>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant='caption' color='text.secondary'>
                          Stage 1
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress 
                              variant='determinate' 
                              value={75} 
                              color='success'
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant='body2' color='text.secondary'>
                              75%
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant='caption' color='text.secondary'>
                          Stage 2
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress 
                              variant='determinate' 
                              value={20} 
                              color='warning'
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant='body2' color='text.secondary'>
                              20%
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Box>
                        <Typography variant='caption' color='text.secondary'>
                          Stage 3
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress 
                              variant='determinate' 
                              value={5} 
                              color='error'
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant='body2' color='text.secondary'>
                              5%
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Typography variant='body2' color='text.secondary'>
                      Stage distribution will be available once staging assessment is complete.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      ) : (
        <Alert severity='warning'>
          No batch information available.
        </Alert>
      )}
    </Box>
  )
}

export default BatchProgress
