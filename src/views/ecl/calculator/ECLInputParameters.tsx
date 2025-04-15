'use client'

// React Imports
import { FC } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

// Type Imports
import type { TimeHorizon, DiscountMethod } from '@/data/ecl/eclData'

interface ECLInputParametersProps {
  timeHorizon: TimeHorizon | ''
  discountMethod: DiscountMethod | ''
  includeMargin: boolean
  includeCollateral: boolean
  includeGuarantees: boolean
  includeNetting: boolean
  onTimeHorizonChange: (value: TimeHorizon) => void
  onDiscountMethodChange: (value: DiscountMethod) => void
  onIncludeMarginChange: (value: boolean) => void
  onIncludeCollateralChange: (value: boolean) => void
  onIncludeGuaranteesChange: (value: boolean) => void
  onIncludeNettingChange: (value: boolean) => void
}

const ECLInputParameters: FC<ECLInputParametersProps> = ({
  timeHorizon,
  discountMethod,
  includeMargin,
  includeCollateral,
  includeGuarantees,
  includeNetting,
  onTimeHorizonChange,
  onDiscountMethodChange,
  onIncludeMarginChange,
  onIncludeCollateralChange,
  onIncludeGuaranteesChange,
  onIncludeNettingChange
}) => {
  // Sample data for EAD, PD, and LGD
  const exposureAtDefault = 100000000
  const probabilityOfDefault = 0.02
  const lossGivenDefault = 0.45
  const discountRate = 0.12
  const effectiveMaturity = 24 // months
  
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
  
  // Handle time horizon change
  const handleTimeHorizonChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onTimeHorizonChange(event.target.value as TimeHorizon)
  }
  
  // Handle discount method change
  const handleDiscountMethodChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onDiscountMethodChange(event.target.value as DiscountMethod)
  }
  
  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Time Horizon & Discounting
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Time Horizon</InputLabel>
                    <Select
                      value={timeHorizon}
                      label="Time Horizon"
                      onChange={handleTimeHorizonChange}
                    >
                      <MenuItem value="12-Month">12-Month ECL</MenuItem>
                      <MenuItem value="Lifetime">Lifetime ECL</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="text.secondary">
                    {timeHorizon === '12-Month' ? 
                      'Calculate ECL for the next 12 months only' : 
                      'Calculate ECL for the entire remaining life of the financial instrument'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Discount Method</InputLabel>
                    <Select
                      value={discountMethod}
                      label="Discount Method"
                      onChange={handleDiscountMethodChange}
                    >
                      <MenuItem value="Effective Rate">Effective Rate</MenuItem>
                      <MenuItem value="Contractual Rate">Contractual Rate</MenuItem>
                      <MenuItem value="Original EIR">Original EIR</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="text.secondary">
                    {discountMethod === 'Effective Rate' ? 
                      'Use the effective interest rate for discounting' : 
                      discountMethod === 'Contractual Rate' ? 
                      'Use the contractual rate for discounting' : 
                      'Use the original effective interest rate for discounting'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Discount Rate"
                    value={formatPercentage(discountRate)}
                    fullWidth
                    disabled
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="The rate used to discount expected cash shortfalls to present value">
                            <IconButton size="small">
                              <AiOutlineQuestionCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Effective Maturity"
                    value={`${effectiveMaturity} months`}
                    fullWidth
                    disabled
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="The remaining maturity used for lifetime ECL calculations">
                            <IconButton size="small">
                              <AiOutlineQuestionCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Calculation Options
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={includeMargin}
                        onChange={(e) => onIncludeMarginChange(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Include Margin in EAD"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Include the profit margin in the Exposure at Default calculation
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={includeCollateral}
                        onChange={(e) => onIncludeCollateralChange(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Include Collateral in LGD"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Consider collateral value in Loss Given Default calculations
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={includeGuarantees}
                        onChange={(e) => onIncludeGuaranteesChange(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Include Guarantees in LGD"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Consider guarantees in Loss Given Default calculations
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={includeNetting}
                        onChange={(e) => onIncludeNettingChange(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Apply Netting Agreements"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Apply netting agreements in exposure calculations
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ECL Components
              </Typography>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                These values are derived from the PD and LGD engines, and can be adjusted if needed.
              </Alert>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Exposure at Default (EAD)"
                    value={formatCurrency(exposureAtDefault)}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="The expected exposure amount at the time of default">
                            <IconButton size="small">
                              <AiOutlineQuestionCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Probability of Default (PD)"
                    value={formatPercentage(probabilityOfDefault)}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="The likelihood of default over the specified time horizon">
                            <IconButton size="small">
                              <AiOutlineQuestionCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Loss Given Default (LGD)"
                    value={formatPercentage(lossGivenDefault)}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="The percentage of exposure expected to be lost in case of default">
                            <IconButton size="small">
                              <AiOutlineQuestionCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Adjustments
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Forward-Looking Adjustment"
                    value="Applied from FLA Module"
                    fullWidth
                    disabled
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Macroeconomic adjustments applied to PD and LGD values">
                            <IconButton size="small">
                              <AiOutlineQuestionCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Management Overlay"
                    placeholder="Enter management overlay percentage"
                    fullWidth
                    defaultValue="0%"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Additional adjustment based on management judgment">
                            <IconButton size="small">
                              <AiOutlineQuestionCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ECLInputParameters
