'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'

// Type Imports
import type { 
  ECLParameters,
  ECLCalculationResult,
  StagingRule,
  StagingType,
  TimeHorizon,
  DiscountMethod,
  ECLCalculationType
} from '@/data/ecl/eclData'

// Component Imports
import TransactionSelector from './TransactionSelector'
import StagingAssessment from './StagingAssessment'
import ECLInputParameters from './ECLInputParameters'
import ECLResults from './ECLResults'

// Interface for component props
interface ECLCalculatorProps {
  eclParameters: ECLParameters[]
  eclResults: ECLCalculationResult[]
  // We would also need transaction data, PD and LGD values in a real implementation
}

const ECLCalculator = ({
  eclParameters,
  eclResults
}: ECLCalculatorProps) => {
  // States
  const [activeTab, setActiveTab] = useState<number>(0)
  const [selectedParameterId, setSelectedParameterId] = useState<number | ''>('')
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null)
  const [calculationType, setCalculationType] = useState<ECLCalculationType>('Individual')
  const [manualStage, setManualStage] = useState<StagingType | ''>('')
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon | ''>('')
  const [discountMethod, setDiscountMethod] = useState<DiscountMethod | ''>('')
  const [includeMargin, setIncludeMargin] = useState<boolean>(true)
  const [includeCollateral, setIncludeCollateral] = useState<boolean>(true)
  const [includeGuarantees, setIncludeGuarantees] = useState<boolean>(true)
  const [includeNetting, setIncludeNetting] = useState<boolean>(false)
  const [calculationInProgress, setCalculationInProgress] = useState<boolean>(false)
  const [calculationResult, setCalculationResult] = useState<ECLCalculationResult | null>(null)
  
  // Get selected parameters
  const selectedParameters = eclParameters.find(p => p.parameter_id === selectedParameterId)
  
  // Effect to set default parameters
  useEffect(() => {
    if (eclParameters.length > 0) {
      // Find active parameters
      const activeParameters = eclParameters.find(p => p.is_active)
      
      if (activeParameters) {
        setSelectedParameterId(activeParameters.parameter_id)
        setCalculationType(activeParameters.calculation_type)
        setDiscountMethod(activeParameters.default_discount_method)
        setIncludeMargin(activeParameters.default_margin_inclusion)
        setIncludeCollateral(activeParameters.include_collateral)
        setIncludeGuarantees(activeParameters.include_guarantees)
        setIncludeNetting(activeParameters.include_netting)
      } else {
        setSelectedParameterId(eclParameters[0].parameter_id)
        setCalculationType(eclParameters[0].calculation_type)
        setDiscountMethod(eclParameters[0].default_discount_method)
        setIncludeMargin(eclParameters[0].default_margin_inclusion)
        setIncludeCollateral(eclParameters[0].include_collateral)
        setIncludeGuarantees(eclParameters[0].include_guarantees)
        setIncludeNetting(eclParameters[0].include_netting)
      }
    }
  }, [eclParameters])
  
  // Effect to update time horizon based on stage
  useEffect(() => {
    if (selectedParameters && manualStage) {
      setTimeHorizon(selectedParameters.default_time_horizons[manualStage])
    }
  }, [manualStage, selectedParameters])
  
  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  
  const handleParameterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const parameterId = event.target.value as number
    setSelectedParameterId(parameterId)
    
    // Update other settings based on selected parameters
    const parameters = eclParameters.find(p => p.parameter_id === parameterId)
    if (parameters) {
      setCalculationType(parameters.calculation_type)
      setDiscountMethod(parameters.default_discount_method)
      setIncludeMargin(parameters.default_margin_inclusion)
      setIncludeCollateral(parameters.include_collateral)
      setIncludeGuarantees(parameters.include_guarantees)
      setIncludeNetting(parameters.include_netting)
    }
  }
  
  const handleTransactionSelect = (transactionId: number | null) => {
    setSelectedTransactionId(transactionId)
    
    // Reset calculation result when transaction changes
    setCalculationResult(null)
  }
  
  const handleStageChange = (stage: StagingType) => {
    setManualStage(stage)
    
    // Update time horizon based on stage
    if (selectedParameters) {
      setTimeHorizon(selectedParameters.default_time_horizons[stage])
    }
  }
  
  const handleCalculateECL = () => {
    if (!selectedTransactionId || !manualStage || !timeHorizon || !discountMethod) {
      alert('Please fill in all required fields')
      return
    }
    
    setCalculationInProgress(true)
    
    // Simulate calculation delay
    setTimeout(() => {
      // In a real implementation, this would call an API or perform the actual calculation
      // For now, we'll just use a sample result
      const sampleResult = eclResults.find(r => r.transaction_id === selectedTransactionId) || eclResults[0]
      
      setCalculationResult({
        ...sampleResult,
        calculation_date: new Date().toISOString().split('T')[0],
        assigned_stage: manualStage,
        time_horizon: timeHorizon,
        is_final: false
      })
      
      setCalculationInProgress(false)
      
      // Move to results tab
      setActiveTab(3)
    }, 2000)
  }
  
  const handleSaveResult = () => {
    if (calculationResult) {
      // In a real implementation, this would save the result to the database
      alert('ECL calculation saved successfully!')
      
      // Update the result to mark it as final
      setCalculationResult({
        ...calculationResult,
        is_final: true
      })
    }
  }
  
  const handleResetCalculation = () => {
    setCalculationResult(null)
    setActiveTab(0)
  }
  
  // Render transaction selection tab
  const renderTransactionTab = () => (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Transaction Selection
        </Typography>
        
        <TransactionSelector 
          onTransactionSelect={handleTransactionSelect}
          selectedTransactionId={selectedTransactionId}
        />
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant='contained' 
            color='primary'
            disabled={!selectedTransactionId}
            onClick={() => setActiveTab(1)}
          >
            Next: Staging Assessment
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
  
  // Render staging assessment tab
  const renderStagingTab = () => (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Staging Assessment
        </Typography>
        
        <StagingAssessment 
          transactionId={selectedTransactionId}
          stagingRules={selectedParameters?.default_staging_rules || []}
          onStageSelect={handleStageChange}
          selectedStage={manualStage}
        />
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant='outlined' 
            color='primary'
            onClick={() => setActiveTab(0)}
          >
            Previous: Transaction Selection
          </Button>
          <Button 
            variant='contained' 
            color='primary'
            disabled={!manualStage}
            onClick={() => setActiveTab(2)}
          >
            Next: ECL Parameters
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
  
  // Render ECL parameters tab
  const renderParametersTab = () => (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          ECL Parameters
        </Typography>
        
        <ECLInputParameters 
          timeHorizon={timeHorizon}
          discountMethod={discountMethod}
          includeMargin={includeMargin}
          includeCollateral={includeCollateral}
          includeGuarantees={includeGuarantees}
          includeNetting={includeNetting}
          onTimeHorizonChange={(value) => setTimeHorizon(value)}
          onDiscountMethodChange={(value) => setDiscountMethod(value)}
          onIncludeMarginChange={(value) => setIncludeMargin(value)}
          onIncludeCollateralChange={(value) => setIncludeCollateral(value)}
          onIncludeGuaranteesChange={(value) => setIncludeGuarantees(value)}
          onIncludeNettingChange={(value) => setIncludeNetting(value)}
        />
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant='outlined' 
            color='primary'
            onClick={() => setActiveTab(1)}
          >
            Previous: Staging Assessment
          </Button>
          <Button 
            variant='contained' 
            color='primary'
            disabled={!timeHorizon || !discountMethod}
            onClick={handleCalculateECL}
          >
            Calculate ECL
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
  
  // Render results tab
  const renderResultsTab = () => (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          ECL Calculation Results
        </Typography>
        
        {calculationInProgress ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress />
            <Typography variant='body1' sx={{ ml: 2 }}>
              Calculating ECL...
            </Typography>
          </Box>
        ) : calculationResult ? (
          <>
            <ECLResults result={calculationResult} />
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant='outlined' 
                color='primary'
                onClick={handleResetCalculation}
              >
                New Calculation
              </Button>
              <Button 
                variant='contained' 
                color='primary'
                disabled={calculationResult.is_final}
                onClick={handleSaveResult}
              >
                {calculationResult.is_final ? 'Result Saved' : 'Save Result'}
              </Button>
            </Box>
          </>
        ) : (
          <Alert severity='info'>
            No calculation results available. Please complete the ECL calculation process.
          </Alert>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>ECL Calculator</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Calculate Expected Credit Loss (ECL) for Islamic banking transactions
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Card sx={{ mb: 6 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant='h6'>Calculation Settings</Typography>
            </Box>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id='parameter-select-label'>ECL Parameters</InputLabel>
                  <Select
                    labelId='parameter-select-label'
                    value={selectedParameterId}
                    label='ECL Parameters'
                    onChange={handleParameterChange}
                  >
                    {eclParameters.map(parameter => (
                      <MenuItem key={parameter.parameter_id} value={parameter.parameter_id}>
                        {parameter.name}
                        {parameter.is_active && (
                          <Chip 
                            label='Active' 
                            color='success' 
                            size='small' 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id='calculation-type-label'>Calculation Type</InputLabel>
                  <Select
                    labelId='calculation-type-label'
                    value={calculationType}
                    label='Calculation Type'
                    onChange={(e) => setCalculationType(e.target.value as ECLCalculationType)}
                  >
                    <MenuItem value='Individual'>Individual Assessment</MenuItem>
                    <MenuItem value='Collective'>Collective Assessment</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
          <Tab label='Transaction' />
          <Tab label='Staging' />
          <Tab label='Parameters' />
          <Tab label='Results' />
        </Tabs>
        
        {activeTab === 0 && renderTransactionTab()}
        {activeTab === 1 && renderStagingTab()}
        {activeTab === 2 && renderParametersTab()}
        {activeTab === 3 && renderResultsTab()}
      </Grid>
    </Grid>
  )
}

export default ECLCalculator
