'use client'

// React Imports
import { FC, useState, useEffect } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

// React Icons
import { 
  AiOutlineCalculator, 
  AiOutlineSave, 
  AiOutlineClear,
  AiOutlineCheck,
  AiOutlineWarning
} from 'react-icons/ai'

// Type Imports
import type { 
  KafalahContract, 
  KafalahFeeCalculation,
  KafalahProvision,
  KafalahType
} from '@/data/kafalah/kafalahData'

// Data Imports
import { 
  getKafalahContracts,
  getKafalahFeeCalculations,
  getKafalahProvisions
} from '@/data/kafalah/kafalahData'

interface KafalahCalculatorProps {
  // You can add props here if needed
}

const KafalahCalculator: FC<KafalahCalculatorProps> = () => {
  // States
  const [activeTab, setActiveTab] = useState<number>(0)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [contracts, setContracts] = useState<KafalahContract[]>([])
  const [selectedContract, setSelectedContract] = useState<KafalahContract | null>(null)
  const [feeCalculations, setFeeCalculations] = useState<KafalahFeeCalculation[]>([])
  const [provisions, setProvisions] = useState<KafalahProvision[]>([])
  
  // Form states for new calculation
  const [newCalculation, setNewCalculation] = useState({
    contractId: 0,
    kafalahType: '' as KafalahType,
    amount: 0,
    startDate: '',
    endDate: '',
    feeMethod: 'Flat',
    feePercentage: 3.0,
    riskFactor: 0.5,
    collateralAmount: 0,
    collateralType: ''
  })
  
  // Calculation results
  const [calculationResults, setCalculationResults] = useState({
    totalDays: 0,
    feeAmount: 0,
    provisionAmount: 0,
    provisionPercentage: 0,
    netExposure: 0
  })
  
  // Load data
  useEffect(() => {
    const loadData = () => {
      const contractsData = getKafalahContracts()
      const feeCalculationsData = getKafalahFeeCalculations()
      const provisionsData = getKafalahProvisions()
      
      setContracts(contractsData)
      setFeeCalculations(feeCalculationsData)
      setProvisions(provisionsData)
    }
    
    loadData()
  }, [])
  
  // Handler for tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  
  // Handler for step change
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }
  
  const handleReset = () => {
    setActiveStep(0)
    setNewCalculation({
      contractId: 0,
      kafalahType: '' as KafalahType,
      amount: 0,
      startDate: '',
      endDate: '',
      feeMethod: 'Flat',
      feePercentage: 3.0,
      riskFactor: 0.5,
      collateralAmount: 0,
      collateralType: ''
    })
    setCalculationResults({
      totalDays: 0,
      feeAmount: 0,
      provisionAmount: 0,
      provisionPercentage: 0,
      netExposure: 0
    })
    setSelectedContract(null)
  }
  
  // Handler for contract selection
  const handleContractSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    const contractId = event.target.value as number
    const contract = contracts.find(c => c.contract_id === contractId) || null
    
    setSelectedContract(contract)
    
    if (contract) {
      setNewCalculation({
        ...newCalculation,
        contractId: contract.contract_id,
        kafalahType: contract.type,
        amount: contract.amount,
        startDate: contract.effective_date,
        endDate: contract.expiry_date,
        collateralAmount: contract.collateral_amount || 0,
        collateralType: contract.collateral_type || ''
      })
    }
  }
  
  // Handler for input change
  const handleInputChange = (field: string, value: any) => {
    setNewCalculation({
      ...newCalculation,
      [field]: value
    })
  }
  
  // Handler for calculating fee
  const handleCalculateFee = () => {
    // Calculate days between start and end date
    const startDate = new Date(newCalculation.startDate)
    const endDate = new Date(newCalculation.endDate)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    // Calculate fee amount based on method
    let feeAmount = 0
    
    if (newCalculation.feeMethod === 'Flat') {
      feeAmount = (newCalculation.amount * newCalculation.feePercentage / 100)
    } else if (newCalculation.feeMethod === 'Reducing') {
      // Simplified reducing method for demonstration
      feeAmount = (newCalculation.amount * newCalculation.feePercentage / 100) * 0.85
    } else if (newCalculation.feeMethod === 'Stepped') {
      // Simplified stepped method for demonstration
      if (diffDays <= 90) {
        feeAmount = (newCalculation.amount * newCalculation.feePercentage / 100) * 0.5
      } else if (diffDays <= 180) {
        feeAmount = (newCalculation.amount * newCalculation.feePercentage / 100) * 0.75
      } else {
        feeAmount = (newCalculation.amount * newCalculation.feePercentage / 100)
      }
    }
    
    // Calculate net exposure
    const netExposure = newCalculation.amount - newCalculation.collateralAmount
    
    // Calculate provision amount
    const provisionPercentage = newCalculation.riskFactor * (netExposure > 0 ? 2.0 : 1.0)
    const provisionAmount = netExposure * provisionPercentage / 100
    
    setCalculationResults({
      totalDays: diffDays,
      feeAmount,
      provisionAmount,
      provisionPercentage,
      netExposure
    })
    
    // Move to next step
    handleNext()
  }
  
  // Handler for saving calculation
  const handleSaveCalculation = () => {
    // In a real application, this would save to the backend
    // For now, we'll just show a success message and move to the next step
    handleNext()
  }
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`
  }
  
  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  // Calculate days between dates
  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  
  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        Kafalah Calculator
      </Typography>
      
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label='New Calculation' />
        <Tab label='Calculation History' />
      </Tabs>
      
      {activeTab === 0 && (
        <Card variant='outlined'>
          <CardHeader 
            title='Kafalah Fee & Provision Calculator'
            subheader='Calculate fees and provisions for Kafalah contracts'
          />
          <Divider />
          <CardContent>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              <Step>
                <StepLabel>Select Contract & Parameters</StepLabel>
              </Step>
              <Step>
                <StepLabel>Review Calculation Results</StepLabel>
              </Step>
              <Step>
                <StepLabel>Confirmation</StepLabel>
              </Step>
            </Stepper>
            
            {activeStep === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Select Kafalah Contract</InputLabel>
                    <Select
                      value={selectedContract?.contract_id || ''}
                      label='Select Kafalah Contract'
                      onChange={handleContractSelect}
                    >
                      <MenuItem value=''>
                        <em>Select a contract</em>
                      </MenuItem>
                      {contracts.map(contract => (
                        <MenuItem key={contract.contract_id} value={contract.contract_id}>
                          {contract.reference_number} - {contract.nasabah_name} ({formatCurrency(contract.amount)})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {selectedContract && (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label='Nasabah'
                        value={selectedContract.nasabah_name}
                        fullWidth
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        label='Beneficiary'
                        value={selectedContract.beneficiary_name}
                        fullWidth
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        label='Kafalah Type'
                        value={newCalculation.kafalahType}
                        fullWidth
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        label='Kafalah Amount'
                        value={newCalculation.amount}
                        fullWidth
                        type='number'
                        InputProps={{
                          readOnly: true,
                          startAdornment: <InputAdornment position='start'>Rp</InputAdornment>
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        label='Start Date'
                        type='date'
                        value={newCalculation.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        fullWidth
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        label='End Date'
                        type='date'
                        value={newCalculation.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        fullWidth
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Fee Calculation Method</InputLabel>
                        <Select
                          value={newCalculation.feeMethod}
                          label='Fee Calculation Method'
                          onChange={(e) => handleInputChange('feeMethod', e.target.value)}
                        >
                          <MenuItem value='Flat'>Flat Rate</MenuItem>
                          <MenuItem value='Reducing'>Reducing Balance</MenuItem>
                          <MenuItem value='Stepped'>Stepped Rate</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        label='Fee Percentage'
                        type='number'
                        value={newCalculation.feePercentage}
                        onChange={(e) => handleInputChange('feePercentage', parseFloat(e.target.value))}
                        fullWidth
                        InputProps={{
                          endAdornment: <InputAdornment position='end'>%</InputAdornment>
                        }}
                        inputProps={{
                          step: 0.1,
                          min: 0.1,
                          max: 10
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Typography variant='subtitle2'>Provision Parameters</Typography>
                      </Divider>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        label='Collateral Amount'
                        type='number'
                        value={newCalculation.collateralAmount}
                        onChange={(e) => handleInputChange('collateralAmount', parseFloat(e.target.value))}
                        fullWidth
                        InputProps={{
                          startAdornment: <InputAdornment position='start'>Rp</InputAdornment>
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        label='Collateral Type'
                        value={newCalculation.collateralType}
                        onChange={(e) => handleInputChange('collateralType', e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        label='Risk Factor'
                        type='number'
                        value={newCalculation.riskFactor}
                        onChange={(e) => handleInputChange('riskFactor', parseFloat(e.target.value))}
                        fullWidth
                        inputProps={{
                          step: 0.1,
                          min: 0,
                          max: 1
                        }}
                        helperText='Risk factor between 0 (lowest) and 1 (highest)'
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          variant='outlined'
                          onClick={handleReset}
                          sx={{ mr: 1 }}
                          startIcon={<AiOutlineClear />}
                        >
                          Reset
                        </Button>
                        <Button
                          variant='contained'
                          onClick={handleCalculateFee}
                          startIcon={<AiOutlineCalculator />}
                          disabled={!selectedContract || !newCalculation.startDate || !newCalculation.endDate}
                        >
                          Calculate
                        </Button>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            )}
            
            {activeStep === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Alert severity='info' sx={{ mb: 3 }}>
                    Please review the calculation results below before saving.
                  </Alert>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant='outlined'>
                    <CardHeader title='Kafalah Fee Calculation' />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant='subtitle2'>Contract Reference:</Typography>
                          <Typography variant='body2'>{selectedContract?.reference_number}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant='subtitle2'>Nasabah:</Typography>
                          <Typography variant='body2'>{selectedContract?.nasabah_name}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant='subtitle2'>Start Date:</Typography>
                          <Typography variant='body2'>{formatDate(newCalculation.startDate)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant='subtitle2'>End Date:</Typography>
                          <Typography variant='body2'>{formatDate(newCalculation.endDate)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant='subtitle2'>Total Days:</Typography>
                          <Typography variant='body2'>{calculationResults.totalDays} days</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant='subtitle2'>Fee Method:</Typography>
                          <Typography variant='body2'>{newCalculation.feeMethod}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant='subtitle2'>Kafalah Amount:</Typography>
                          <Typography variant='body2'>{formatCurrency(newCalculation.amount)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant='subtitle2'>Fee Percentage:</Typography>
                          <Typography variant='body2'>{formatPercentage(newCalculation.feePercentage)}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant='subtitle1' color='primary' fontWeight='bold'>
                            Fee Amount: {formatCurrency(calculationResults.feeAmount)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant='outlined'>
                    <CardHeader title='Kafalah Provision Calculation' />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant='subtitle2'>Kafalah Amount:</Typography>
                          <Typography variant='body2'>{formatCurrency(newCalculation.amount)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant='subtitle2'>Collateral Amount:</Typography>
                          <Typography variant='body2'>{formatCurrency(newCalculation.collateralAmount)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant='subtitle2'>Net Exposure:</Typography>
                          <Typography variant='body2'>{formatCurrency(calculationResults.netExposure)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant='subtitle2'>Risk Factor:</Typography>
                          <Typography variant='body2'>{newCalculation.riskFactor}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant='subtitle2'>Provision Percentage:</Typography>
                          <Typography variant='body2'>{formatPercentage(calculationResults.provisionPercentage)}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant='subtitle1' color='error' fontWeight='bold'>
                            Provision Amount: {formatCurrency(calculationResults.provisionAmount)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant='outlined'
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Button
                      variant='contained'
                      onClick={handleSaveCalculation}
                      startIcon={<AiOutlineSave />}
                    >
                      Save Calculation
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}
            
            {activeStep === 2 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant='h6' color='success.main' gutterBottom>
                  <AiOutlineCheck size={30} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  Calculation Saved Successfully
                </Typography>
                <Typography variant='body1' paragraph>
                  The Kafalah fee and provision calculation has been saved and is awaiting approval.
                </Typography>
                <Typography variant='body2' color='text.secondary' paragraph>
                  Reference: {selectedContract?.reference_number}
                  <br />
                  Fee Amount: {formatCurrency(calculationResults.feeAmount)}
                  <br />
                  Provision Amount: {formatCurrency(calculationResults.provisionAmount)}
                </Typography>
                <Button
                  variant='contained'
                  onClick={handleReset}
                  sx={{ mt: 2 }}
                >
                  Start New Calculation
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
      
      {activeTab === 1 && (
        <Card variant='outlined'>
          <CardHeader 
            title='Calculation History'
            subheader='History of Kafalah fee and provision calculations'
          />
          <Divider />
          <CardContent>
            <TableContainer component={Paper} variant='outlined'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Contract Reference</TableCell>
                    <TableCell>Nasabah</TableCell>
                    <TableCell>Calculation Date</TableCell>
                    <TableCell>Fee Method</TableCell>
                    <TableCell>Fee Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feeCalculations.map(calc => {
                    const contract = contracts.find(c => c.contract_id === calc.contract_id)
                    
                    return (
                      <TableRow key={calc.calculation_id}>
                        <TableCell>{contract?.reference_number}</TableCell>
                        <TableCell>{contract?.nasabah_name}</TableCell>
                        <TableCell>{formatDate(calc.calculation_date)}</TableCell>
                        <TableCell>{calc.fee_method}</TableCell>
                        <TableCell>{formatCurrency(calc.fee_amount)}</TableCell>
                        <TableCell>
                          {calc.is_approved ? (
                            <Typography variant='body2' color='success.main'>
                              <AiOutlineCheck style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                              Approved
                            </Typography>
                          ) : (
                            <Typography variant='body2' color='warning.main'>
                              <AiOutlineWarning style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                              Pending
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default KafalahCalculator
