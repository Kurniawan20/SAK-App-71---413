'use client'

// React Imports
import { FC, useState, useEffect } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'

// Type Imports
import type { StagingRule, StagingType } from '@/data/ecl/eclData'

// Sample transaction data for staging assessment
interface TransactionStaging {
  transaction_id: number
  dpd: number
  kolektibilitas_terkini: number
  pd_current: number
  pd_origination: number
  pd_increase_percentage: number
  restructured: boolean
  watchlist: boolean
  industry_outlook: 'Positive' | 'Stable' | 'Negative' | 'Severe'
}

const sampleTransactionStaging: { [key: number]: TransactionStaging } = {
  1001: {
    transaction_id: 1001,
    dpd: 0,
    kolektibilitas_terkini: 1,
    pd_current: 0.02,
    pd_origination: 0.015,
    pd_increase_percentage: 33.33,
    restructured: false,
    watchlist: false,
    industry_outlook: 'Stable'
  },
  1002: {
    transaction_id: 1002,
    dpd: 45,
    kolektibilitas_terkini: 2,
    pd_current: 0.15,
    pd_origination: 0.05,
    pd_increase_percentage: 200,
    restructured: false,
    watchlist: true,
    industry_outlook: 'Negative'
  },
  1003: {
    transaction_id: 1003,
    dpd: 120,
    kolektibilitas_terkini: 5,
    pd_current: 1.0,
    pd_origination: 0.08,
    pd_increase_percentage: 1150,
    restructured: true,
    watchlist: true,
    industry_outlook: 'Severe'
  }
}

interface StagingAssessmentProps {
  transactionId: number | null
  stagingRules: StagingRule[]
  onStageSelect: (stage: StagingType) => void
  selectedStage: StagingType | ''
}

const StagingAssessment: FC<StagingAssessmentProps> = ({
  transactionId,
  stagingRules,
  onStageSelect,
  selectedStage
}) => {
  // States
  const [automaticStage, setAutomaticStage] = useState<StagingType | ''>('')
  const [manualOverride, setManualOverride] = useState<boolean>(false)
  const [overrideReason, setOverrideReason] = useState<string>('')
  const [stagingHistory, setStagingHistory] = useState<StagingType[]>([])
  
  // Get transaction staging data
  const transactionStaging = transactionId ? sampleTransactionStaging[transactionId] : null
  
  // Effect to determine automatic stage based on rules
  useEffect(() => {
    if (transactionId && transactionStaging) {
      // Sort rules by priority (lower number = higher priority)
      const sortedRules = [...stagingRules].sort((a, b) => a.priority - b.priority)
      
      // Find the first rule that matches
      for (const rule of sortedRules) {
        let ruleMatches = true
        
        // Check all criteria in the rule
        for (const criteria of rule.criteria) {
          const fieldValue = transactionStaging[criteria.field as keyof TransactionStaging]
          
          // Skip if field doesn't exist
          if (fieldValue === undefined) {
            ruleMatches = false
            break
          }
          
          // Check if criteria matches
          switch (criteria.operator) {
            case 'equals':
              if (fieldValue !== criteria.value) ruleMatches = false
              break
            case 'not_equals':
              if (fieldValue === criteria.value) ruleMatches = false
              break
            case 'greater_than':
              if (fieldValue <= criteria.value) ruleMatches = false
              break
            case 'less_than':
              if (fieldValue >= criteria.value) ruleMatches = false
              break
            case 'contains':
              if (!String(fieldValue).includes(String(criteria.value))) ruleMatches = false
              break
            case 'not_contains':
              if (String(fieldValue).includes(String(criteria.value))) ruleMatches = false
              break
            case 'in':
              if (!Array.isArray(criteria.value) || !criteria.value.includes(fieldValue)) ruleMatches = false
              break
            case 'not_in':
              if (!Array.isArray(criteria.value) || criteria.value.includes(fieldValue)) ruleMatches = false
              break
            default:
              ruleMatches = false
          }
          
          // If any criteria doesn't match, the rule doesn't match
          if (!ruleMatches) break
        }
        
        // If rule matches or it's the default rule (no criteria), use its stage
        if (ruleMatches || rule.criteria.length === 0) {
          setAutomaticStage(rule.stage_result)
          
          // If not in manual override mode, set the selected stage
          if (!manualOverride) {
            onStageSelect(rule.stage_result)
          }
          
          break
        }
      }
      
      // Generate sample staging history
      const history: StagingType[] = []
      
      // Add some historical stages based on transaction ID
      if (transactionId === 1001) {
        history.push('Stage 1', 'Stage 1', 'Stage 1', 'Stage 1', 'Stage 1', 'Stage 1')
      } else if (transactionId === 1002) {
        history.push('Stage 1', 'Stage 1', 'Stage 1', 'Stage 1', 'Stage 2', 'Stage 2')
      } else if (transactionId === 1003) {
        history.push('Stage 1', 'Stage 1', 'Stage 2', 'Stage 2', 'Stage 3', 'Stage 3')
      }
      
      setStagingHistory(history)
    } else {
      setAutomaticStage('')
      setStagingHistory([])
    }
  }, [transactionId, transactionStaging, stagingRules, manualOverride, onStageSelect])
  
  // Handler for manual stage selection
  const handleManualStageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const stage = event.target.value as StagingType
    onStageSelect(stage)
  }
  
  // Handler for manual override toggle
  const handleManualOverrideToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const override = event.target.checked
    setManualOverride(override)
    
    // If turning off manual override, revert to automatic stage
    if (!override && automaticStage) {
      onStageSelect(automaticStage)
    }
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
  
  // Render staging rules
  const renderStagingRules = () => {
    // Sort rules by priority
    const sortedRules = [...stagingRules].sort((a, b) => a.priority - b.priority)
    
    return (
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Priority</TableCell>
              <TableCell>Rule Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Criteria</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRules.map((rule) => {
              // Determine if rule is triggered for this transaction
              let isTriggered = false
              let criteriaMatched = true
              
              if (transactionStaging) {
                for (const criteria of rule.criteria) {
                  const fieldValue = transactionStaging[criteria.field as keyof TransactionStaging]
                  
                  // Skip if field doesn't exist
                  if (fieldValue === undefined) {
                    criteriaMatched = false
                    break
                  }
                  
                  // Check if criteria matches
                  switch (criteria.operator) {
                    case 'equals':
                      if (fieldValue !== criteria.value) criteriaMatched = false
                      break
                    case 'not_equals':
                      if (fieldValue === criteria.value) criteriaMatched = false
                      break
                    case 'greater_than':
                      if (fieldValue <= criteria.value) criteriaMatched = false
                      break
                    case 'less_than':
                      if (fieldValue >= criteria.value) criteriaMatched = false
                      break
                    case 'contains':
                      if (!String(fieldValue).includes(String(criteria.value))) criteriaMatched = false
                      break
                    case 'not_contains':
                      if (String(fieldValue).includes(String(criteria.value))) criteriaMatched = false
                      break
                    case 'in':
                      if (!Array.isArray(criteria.value) || !criteria.value.includes(fieldValue)) criteriaMatched = false
                      break
                    case 'not_in':
                      if (!Array.isArray(criteria.value) || criteria.value.includes(fieldValue)) criteriaMatched = false
                      break
                    default:
                      criteriaMatched = false
                  }
                  
                  // If any criteria doesn't match, the rule doesn't match
                  if (!criteriaMatched) break
                }
                
                // Rule is triggered if all criteria match or it's the default rule
                isTriggered = criteriaMatched || rule.criteria.length === 0
              }
              
              return (
                <TableRow key={rule.rule_id} selected={isTriggered}>
                  <TableCell>{rule.priority}</TableCell>
                  <TableCell>{rule.name}</TableCell>
                  <TableCell>{rule.description}</TableCell>
                  <TableCell>
                    {rule.criteria.length > 0 ? (
                      rule.criteria.map((criteria, index) => (
                        <Typography key={index} variant="caption" display="block">
                          {criteria.field} {criteria.operator} {criteria.value}
                          {index < rule.criteria.length - 1 && criteria.logic_operator && (
                            <strong> {criteria.logic_operator} </strong>
                          )}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="caption">Default rule (no criteria)</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={rule.stage_result}
                      color={getStageColor(rule.stage_result)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {isTriggered ? (
                      <Chip label="Triggered" color="primary" size="small" />
                    ) : (
                      <Chip label="Not Triggered" variant="outlined" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
  
  // Render transaction staging data
  const renderTransactionStagingData = () => {
    if (!transactionStaging) return null
    
    return (
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Staging Assessment Factors
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Days Past Due (DPD)
              </Typography>
              <Typography variant="body1" gutterBottom>
                {transactionStaging.dpd} days
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary">
                Current Collectibility
              </Typography>
              <Typography variant="body1" gutterBottom>
                {transactionStaging.kolektibilitas_terkini}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary">
                Restructured
              </Typography>
              <Typography variant="body1" gutterBottom>
                {transactionStaging.restructured ? 'Yes' : 'No'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Current PD
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatPercentage(transactionStaging.pd_current * 100)}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary">
                Origination PD
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatPercentage(transactionStaging.pd_origination * 100)}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary">
                PD Increase
              </Typography>
              <Typography 
                variant="body1" 
                color={transactionStaging.pd_increase_percentage > 100 ? 'error.main' : 'text.primary'}
                gutterBottom
              >
                {formatPercentage(transactionStaging.pd_increase_percentage)}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary">
                Industry Outlook
              </Typography>
              <Typography variant="body1" gutterBottom>
                <Chip 
                  label={transactionStaging.industry_outlook}
                  color={
                    transactionStaging.industry_outlook === 'Positive' ? 'success' :
                    transactionStaging.industry_outlook === 'Stable' ? 'info' :
                    transactionStaging.industry_outlook === 'Negative' ? 'warning' : 'error'
                  }
                  size="small"
                />
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }
  
  // Render staging history
  const renderStagingHistory = () => {
    if (stagingHistory.length === 0) return null
    
    return (
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Staging History
          </Typography>
          
          <Stepper orientation="vertical">
            {stagingHistory.map((stage, index) => (
              <Step key={index} active={index === stagingHistory.length - 1}>
                <StepLabel StepIconProps={{ 
                  icon: <Chip 
                    label={stage}
                    color={getStageColor(stage)}
                    size="small"
                  />
                }}>
                  {`Month ${6 - index}`}
                </StepLabel>
                <StepContent>
                  <Typography variant="caption">
                    {index === stagingHistory.length - 1 ? 'Current Stage' : `Historical Stage (Month ${6 - index})`}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>
    )
  }
  
  // Render stage selection
  const renderStageSelection = () => {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Stage Assignment
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Automatic Stage Assignment
              </Typography>
              
              {automaticStage ? (
                <Chip 
                  label={automaticStage}
                  color={getStageColor(automaticStage)}
                />
              ) : (
                <Typography variant="body2">
                  No automatic stage assignment available
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={manualOverride}
                    onChange={handleManualOverrideToggle}
                    color="primary"
                  />
                }
                label="Manual Override"
              />
              
              {manualOverride && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Manual Stage</InputLabel>
                  <Select
                    value={selectedStage}
                    label="Manual Stage"
                    onChange={handleManualStageChange}
                  >
                    <MenuItem value="Stage 1">Stage 1</MenuItem>
                    <MenuItem value="Stage 2">Stage 2</MenuItem>
                    <MenuItem value="Stage 3">Stage 3</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Grid>
            
            {manualOverride && selectedStage && automaticStage && selectedStage !== automaticStage && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  You are manually overriding the automatic stage assignment from {automaticStage} to {selectedStage}.
                  Please provide a reason for this override.
                </Alert>
                
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Override Reason</InputLabel>
                  <Select
                    value={overrideReason || ''}
                    label="Override Reason"
                    onChange={(e) => setOverrideReason(e.target.value)}
                  >
                    <MenuItem value="expert_judgment">Expert Judgment</MenuItem>
                    <MenuItem value="additional_information">Additional Information Not Captured by Rules</MenuItem>
                    <MenuItem value="regulatory_requirement">Regulatory Requirement</MenuItem>
                    <MenuItem value="management_decision">Management Decision</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Box>
      {transactionId ? (
        <>
          {renderTransactionStagingData()}
          {renderStagingHistory()}
          
          <Typography variant="h6" gutterBottom>
            Staging Rules
          </Typography>
          {renderStagingRules()}
          
          <Box sx={{ mt: 4 }}>
            {renderStageSelection()}
          </Box>
        </>
      ) : (
        <Alert severity="info">
          Please select a transaction first to perform staging assessment
        </Alert>
      )}
    </Box>
  )
}

export default StagingAssessment
