'use client'

// React Imports
import { FC, useState, useEffect } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Slider from '@mui/material/Slider'
import InputAdornment from '@mui/material/InputAdornment'

// React Icons
import { AiOutlinePlayCircle, AiOutlineReload } from 'react-icons/ai'

// Type Imports
import type { 
  StagingRule,
  StagingCriteria,
  StagingType
} from '@/data/ecl/eclData'

interface RuleSimulatorProps {
  stagingRules: StagingRule[]
}

interface SimulationInput {
  dpd: number
  kolektibilitas_terkini: number
  pd_current: number
  pd_origination: number
  pd_increase_percentage: number
  restructured: boolean
  watchlist: boolean
  industry_outlook: 'Positive' | 'Stable' | 'Negative' | 'Severe'
}

const RuleSimulator: FC<RuleSimulatorProps> = ({ stagingRules }) => {
  // Default simulation input
  const defaultInput: SimulationInput = {
    dpd: 0,
    kolektibilitas_terkini: 1,
    pd_current: 0.02,
    pd_origination: 0.015,
    pd_increase_percentage: 33.33,
    restructured: false,
    watchlist: false,
    industry_outlook: 'Stable'
  }
  
  // States
  const [input, setInput] = useState<SimulationInput>(defaultInput)
  const [simulationResult, setSimulationResult] = useState<{
    stage: StagingType | null
    matchedRule: StagingRule | null
    evaluationSteps: { rule: StagingRule, matched: boolean, reason: string }[]
  } | null>(null)
  
  // Handler for input change
  const handleInputChange = (field: keyof SimulationInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }))
    
    // If PD values change, recalculate PD increase percentage
    if (field === 'pd_current' || field === 'pd_origination') {
      const pdCurrent = field === 'pd_current' ? value : input.pd_current
      const pdOrigination = field === 'pd_origination' ? value : input.pd_origination
      
      if (pdOrigination > 0) {
        const increasePercentage = ((pdCurrent - pdOrigination) / pdOrigination) * 100
        setInput(prev => ({ ...prev, pd_increase_percentage: parseFloat(increasePercentage.toFixed(2)) }))
      }
    }
  }
  
  // Handler for running simulation
  const handleRunSimulation = () => {
    // Sort rules by priority
    const sortedRules = [...stagingRules].filter(r => r.is_active).sort((a, b) => a.priority - b.priority)
    
    const evaluationSteps: { rule: StagingRule, matched: boolean, reason: string }[] = []
    let matchedRule: StagingRule | null = null
    let resultStage: StagingType | null = null
    
    // Evaluate each rule
    for (const rule of sortedRules) {
      let ruleMatches = true
      let matchReason = ''
      
      // If no criteria, it's a default rule that always matches
      if (rule.criteria.length === 0) {
        matchedRule = rule
        resultStage = rule.stage_result
        evaluationSteps.push({ rule, matched: true, reason: 'Default rule with no criteria - always matches' })
        break
      }
      
      // Evaluate each criteria in the rule
      for (let i = 0; i < rule.criteria.length; i++) {
        const criteria = rule.criteria[i]
        const fieldValue = input[criteria.field as keyof SimulationInput]
        
        // Skip if field doesn't exist
        if (fieldValue === undefined) {
          ruleMatches = false
          matchReason = `Field "${criteria.field}" not found in input`
          break
        }
        
        // Check if criteria matches
        let criteriaMatches = false
        let criteriaReason = ''
        
        switch (criteria.operator) {
          case 'equals':
            criteriaMatches = fieldValue === criteria.value
            criteriaReason = `${fieldValue} ${criteriaMatches ? '=' : '≠'} ${criteria.value}`
            break
          case 'not_equals':
            criteriaMatches = fieldValue !== criteria.value
            criteriaReason = `${fieldValue} ${criteriaMatches ? '≠' : '='} ${criteria.value}`
            break
          case 'greater_than':
            criteriaMatches = fieldValue > criteria.value
            criteriaReason = `${fieldValue} ${criteriaMatches ? '>' : '≤'} ${criteria.value}`
            break
          case 'less_than':
            criteriaMatches = fieldValue < criteria.value
            criteriaReason = `${fieldValue} ${criteriaMatches ? '<' : '≥'} ${criteria.value}`
            break
          case 'contains':
            criteriaMatches = String(fieldValue).includes(String(criteria.value))
            criteriaReason = `"${fieldValue}" ${criteriaMatches ? 'contains' : 'does not contain'} "${criteria.value}"`
            break
          case 'not_contains':
            criteriaMatches = !String(fieldValue).includes(String(criteria.value))
            criteriaReason = `"${fieldValue}" ${criteriaMatches ? 'does not contain' : 'contains'} "${criteria.value}"`
            break
          case 'in':
            criteriaMatches = Array.isArray(criteria.value) && criteria.value.includes(fieldValue)
            criteriaReason = `${fieldValue} ${criteriaMatches ? 'is' : 'is not'} in [${criteria.value}]`
            break
          case 'not_in':
            criteriaMatches = !Array.isArray(criteria.value) || !criteria.value.includes(fieldValue)
            criteriaReason = `${fieldValue} ${criteriaMatches ? 'is not' : 'is'} in [${criteria.value}]`
            break
          default:
            criteriaMatches = false
            criteriaReason = `Unknown operator: ${criteria.operator}`
        }
        
        // If criteria doesn't match, check the logic operator
        if (!criteriaMatches) {
          // If this is not the first criteria and has OR logic, we can still match the rule
          if (i > 0 && criteria.logic_operator === 'OR') {
            // Continue to next criteria
            matchReason += `${criteria.field} ${criteriaReason} (OR) - Continuing\n`
            continue
          }
          
          // If it's the first criteria or has AND logic, the rule doesn't match
          ruleMatches = false
          matchReason += `${criteria.field} ${criteriaReason} - Rule doesn't match\n`
          break
        } else {
          matchReason += `${criteria.field} ${criteriaReason} - Criteria matches\n`
          
          // If this is not the last criteria and has AND logic, we need to check the next criteria
          if (i < rule.criteria.length - 1 && criteria.logic_operator === 'AND') {
            // Continue to next criteria
            continue
          }
          
          // If it's the last criteria or has OR logic, the rule matches
          ruleMatches = true
        }
      }
      
      evaluationSteps.push({ rule, matched: ruleMatches, reason: matchReason })
      
      // If rule matches, use its stage and stop evaluation
      if (ruleMatches) {
        matchedRule = rule
        resultStage = rule.stage_result
        break
      }
    }
    
    setSimulationResult({
      stage: resultStage,
      matchedRule,
      evaluationSteps
    })
  }
  
  // Handler for resetting simulation
  const handleResetSimulation = () => {
    setInput(defaultInput)
    setSimulationResult(null)
  }
  
  // Get stage color
  const getStageColor = (stage: StagingType): 'success' | 'warning' | 'error' => {
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
  
  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`
  }
  
  return (
    <Box>
      <Alert severity='info' sx={{ mb: 4 }}>
        Use this simulator to test your staging rules with different input values.
        Adjust the parameters below and click "Run Simulation" to see which rule matches and what stage is assigned.
      </Alert>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Simulation Parameters
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label='Days Past Due (DPD)'
                    type='number'
                    value={input.dpd}
                    onChange={(e) => handleInputChange('dpd', parseInt(e.target.value))}
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>days</InputAdornment>
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Current Collectibility</InputLabel>
                    <Select
                      value={input.kolektibilitas_terkini}
                      label='Current Collectibility'
                      onChange={(e) => handleInputChange('kolektibilitas_terkini', e.target.value)}
                    >
                      <MenuItem value={1}>1 - Lancar</MenuItem>
                      <MenuItem value={2}>2 - Dalam Perhatian Khusus</MenuItem>
                      <MenuItem value={3}>3 - Kurang Lancar</MenuItem>
                      <MenuItem value={4}>4 - Diragukan</MenuItem>
                      <MenuItem value={5}>5 - Macet</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label='Current PD'
                    type='number'
                    value={input.pd_current}
                    onChange={(e) => handleInputChange('pd_current', parseFloat(e.target.value))}
                    fullWidth
                    inputProps={{ step: 0.001, min: 0, max: 1 }}
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>({(input.pd_current * 100).toFixed(2)}%)</InputAdornment>
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label='Origination PD'
                    type='number'
                    value={input.pd_origination}
                    onChange={(e) => handleInputChange('pd_origination', parseFloat(e.target.value))}
                    fullWidth
                    inputProps={{ step: 0.001, min: 0, max: 1 }}
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>({(input.pd_origination * 100).toFixed(2)}%)</InputAdornment>
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant='subtitle2' gutterBottom>
                    PD Increase: {formatPercentage(input.pd_increase_percentage)}
                  </Typography>
                  <Slider
                    value={input.pd_increase_percentage}
                    onChange={(e, value) => handleInputChange('pd_increase_percentage', value as number)}
                    min={-100}
                    max={500}
                    step={1}
                    valueLabelDisplay='auto'
                    valueLabelFormat={formatPercentage}
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 100, label: '100%' },
                      { value: 200, label: '200%' }
                    ]}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={input.restructured}
                        onChange={(e) => handleInputChange('restructured', e.target.checked)}
                      />
                    }
                    label='Restructured'
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={input.watchlist}
                        onChange={(e) => handleInputChange('watchlist', e.target.checked)}
                      />
                    }
                    label='Watchlist'
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Industry Outlook</InputLabel>
                    <Select
                      value={input.industry_outlook}
                      label='Industry Outlook'
                      onChange={(e) => handleInputChange('industry_outlook', e.target.value)}
                    >
                      <MenuItem value='Positive'>Positive</MenuItem>
                      <MenuItem value='Stable'>Stable</MenuItem>
                      <MenuItem value='Negative'>Negative</MenuItem>
                      <MenuItem value='Severe'>Severe</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button 
                  variant='contained' 
                  color='primary'
                  startIcon={<AiOutlinePlayCircle />}
                  onClick={handleRunSimulation}
                >
                  Run Simulation
                </Button>
                <Button 
                  variant='outlined' 
                  startIcon={<AiOutlineReload />}
                  onClick={handleResetSimulation}
                >
                  Reset
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Simulation Results
              </Typography>
              
              {simulationResult ? (
                <>
                  <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant='subtitle1' gutterBottom>
                      Assigned Stage:
                    </Typography>
                    {simulationResult.stage ? (
                      <Chip 
                        label={simulationResult.stage}
                        color={getStageColor(simulationResult.stage)}
                        sx={{ fontSize: '1.2rem', py: 2, px: 3 }}
                      />
                    ) : (
                      <Alert severity='warning'>
                        No stage assigned. No matching rule found.
                      </Alert>
                    )}
                  </Box>
                  
                  {simulationResult.matchedRule && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant='subtitle1' gutterBottom>
                        Matched Rule:
                      </Typography>
                      <Paper variant='outlined' sx={{ p: 2 }}>
                        <Typography variant='subtitle2'>
                          {simulationResult.matchedRule.name}
                        </Typography>
                        <Typography variant='body2' color='text.secondary' gutterBottom>
                          {simulationResult.matchedRule.description}
                        </Typography>
                        <Typography variant='caption'>
                          Priority: {simulationResult.matchedRule.priority}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                  
                  <Typography variant='subtitle1' gutterBottom>
                    Rule Evaluation Steps:
                  </Typography>
                  <Stepper orientation='vertical'>
                    {simulationResult.evaluationSteps.map((step, index) => (
                      <Step key={index} active={step.matched}>
                        <StepLabel
                          StepIconProps={{
                            icon: step.matched ? '✓' : '✗'
                          }}
                        >
                          <Typography variant='subtitle2'>
                            {step.rule.name}
                            <Chip 
                              label={step.rule.stage_result}
                              color={getStageColor(step.rule.stage_result)}
                              size='small'
                              sx={{ ml: 1 }}
                            />
                          </Typography>
                        </StepLabel>
                        <StepContent>
                          <Typography variant='body2' sx={{ whiteSpace: 'pre-line' }}>
                            {step.reason}
                          </Typography>
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                </>
              ) : (
                <Alert severity='info'>
                  Adjust the parameters and click "Run Simulation" to see the results.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RuleSimulator
