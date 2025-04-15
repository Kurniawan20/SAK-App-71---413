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
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Slider from '@mui/material/Slider'

// Third-party Imports
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, ChartTooltip, Legend)

// Type Imports
import type { 
  EconomicVariable, 
  EconomicScenario,
  CorrelationMatrix,
  VariableCorrelation
} from '@/data/fla/economicData'

import type {
  FLAAdjustment,
  ScenarioAdjustment,
  VariableImpact,
  AdjustmentResult
} from '@/data/fla/adjustmentData'

// Helper components
import SimulationResults from './SimulationResults'
import ScenarioComparison from './ScenarioComparison'

// Interface for component props
interface FLASimulatorProps {
  economicVariables: EconomicVariable[]
  economicScenarios: EconomicScenario[]
  correlationMatrices: CorrelationMatrix[]
  variableCorrelations: VariableCorrelation[]
  flaAdjustments: FLAAdjustment[]
  scenarioAdjustments: ScenarioAdjustment[]
  variableImpacts: VariableImpact[]
  adjustmentResults: AdjustmentResult[]
}

const FLASimulator = ({
  economicVariables,
  economicScenarios,
  correlationMatrices,
  variableCorrelations,
  flaAdjustments,
  scenarioAdjustments,
  variableImpacts,
  adjustmentResults
}: FLASimulatorProps) => {
  // States
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [selectedMatrix, setSelectedMatrix] = useState<number | ''>('')
  const [selectedSegment, setSelectedSegment] = useState<string>('Retail')
  const [selectedScenario, setSelectedScenario] = useState<number | ''>('')
  const [pdBase, setPdBase] = useState<number>(0.05) // 5% base PD
  const [lgdBase, setLgdBase] = useState<number>(0.4) // 40% base LGD
  const [simulationResults, setSimulationResults] = useState<{
    pd: number
    lgd: number
    adjustmentFactor: number
    scenarioProbability: number
    scenarioName: string
  }[]>([])
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false)
  const [customAdjustments, setCustomAdjustments] = useState<{
    variableId: number
    pdImpact: number
    lgdImpact: number
  }[]>([])
  
  // Get selected correlation matrix
  const selectedMatrixDetails = correlationMatrices.find(m => m.matrix_id === selectedMatrix)
  
  // Effect to initialize custom adjustments
  useEffect(() => {
    if (economicVariables.length > 0) {
      setCustomAdjustments(
        economicVariables.map(variable => ({
          variableId: variable.variable_id,
          pdImpact: 0,
          lgdImpact: 0
        }))
      )
    }
  }, [economicVariables])
  
  // Effect to set default matrix
  useEffect(() => {
    if (correlationMatrices.length > 0) {
      setSelectedMatrix(correlationMatrices[0].matrix_id)
    }
  }, [correlationMatrices])
  
  // Effect to set default scenario
  useEffect(() => {
    if (economicScenarios.length > 0) {
      setSelectedScenario(economicScenarios[0].scenario_id)
    }
  }, [economicScenarios])
  
  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }
  
  const handleMatrixChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedMatrix(event.target.value as number)
  }
  
  const handleSegmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedSegment(event.target.value as string)
  }
  
  const handleScenarioChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedScenario(event.target.value as number)
  }
  
  const handlePdBaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value)
    if (!isNaN(value) && value >= 0 && value <= 1) {
      setPdBase(value)
    }
  }
  
  const handleLgdBaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value)
    if (!isNaN(value) && value >= 0 && value <= 1) {
      setLgdBase(value)
    }
  }
  
  const handleCustomAdjustmentChange = (variableId: number, type: 'pd' | 'lgd', value: number) => {
    setCustomAdjustments(prev => 
      prev.map(adj => 
        adj.variableId === variableId 
          ? { ...adj, [type === 'pd' ? 'pdImpact' : 'lgdImpact']: value } 
          : adj
      )
    )
  }
  
  const handleRunSimulation = () => {
    if (!selectedMatrix || !selectedScenario) {
      alert('Please select a correlation matrix and scenario')
      return
    }
    
    // Get correlations for the selected matrix
    const matrixCorrelations = variableCorrelations.filter(vc => vc.matrix_id === selectedMatrix)
    
    // Get scenario adjustments
    const scenarioAdjs = scenarioAdjustments.filter(sa => 
      sa.scenario_id === selectedScenario && 
      (sa.segment === selectedSegment || sa.segment === 'All')
    )
    
    // Calculate weighted adjustments for each scenario
    const results = economicScenarios.map(scenario => {
      // Get scenario adjustment for this scenario
      const scenarioAdj = scenarioAdjustments.find(sa => 
        sa.scenario_id === scenario.scenario_id && 
        (sa.segment === selectedSegment || sa.segment === 'All')
      )
      
      // If no adjustment found, use default values
      const pdAdjFactor = scenarioAdj?.pd_adjustment_factor || 1.0
      const lgdAdjFactor = scenarioAdj?.lgd_adjustment_factor || 1.0
      
      // Apply custom adjustments if advanced options are enabled
      let customPdAdjustment = 1.0
      let customLgdAdjustment = 1.0
      
      if (showAdvancedOptions) {
        // Calculate weighted impact from custom adjustments
        customAdjustments.forEach(adj => {
          const correlation = matrixCorrelations.find(mc => mc.variable_id === adj.variableId)
          if (correlation) {
            // Apply custom PD impact
            customPdAdjustment += (correlation.pd_correlation * adj.pdImpact) / 100
            
            // Apply custom LGD impact
            customLgdAdjustment += (correlation.lgd_correlation * adj.lgdImpact) / 100
          }
        })
      }
      
      // Calculate final adjusted values
      const adjustedPd = pdBase * pdAdjFactor * customPdAdjustment
      const adjustedLgd = lgdBase * lgdAdjFactor * customLgdAdjustment
      
      return {
        pd: adjustedPd,
        lgd: adjustedLgd,
        adjustmentFactor: pdAdjFactor * customPdAdjustment,
        scenarioProbability: scenario.probability,
        scenarioName: scenario.name
      }
    })
    
    setSimulationResults(results)
  }
  
  // Render correlation matrix tab
  const renderCorrelationMatrixTab = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h6'>Correlation Matrix</Typography>
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel id='matrix-select-label'>Correlation Matrix</InputLabel>
            <Select
              labelId='matrix-select-label'
              value={selectedMatrix}
              label='Correlation Matrix'
              onChange={handleMatrixChange}
            >
              {correlationMatrices.map(matrix => (
                <MenuItem key={matrix.matrix_id} value={matrix.matrix_id}>
                  {matrix.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {selectedMatrixDetails && (
          <Box sx={{ mb: 4 }}>
            <Typography variant='subtitle1'>{selectedMatrixDetails.name}</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              {selectedMatrixDetails.description}
            </Typography>
          </Box>
        )}
        
        <TableContainer component={Paper} variant='outlined'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Variable</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>PD Correlation</TableCell>
                <TableCell>LGD Correlation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedMatrix ? (
                variableCorrelations
                  .filter(vc => vc.matrix_id === selectedMatrix)
                  .map(correlation => {
                    const variable = economicVariables.find(v => v.variable_id === correlation.variable_id)
                    
                    // Helper function to get color based on correlation value
                    const getCorrelationColor = (value: number) => {
                      if (value > 0.5) return 'error.main'
                      if (value > 0.2) return 'warning.main'
                      if (value < -0.5) return 'success.main'
                      if (value < -0.2) return 'info.main'
                      return 'text.primary'
                    }
                    
                    return (
                      <TableRow key={correlation.correlation_id}>
                        <TableCell>{variable?.name || 'Unknown'}</TableCell>
                        <TableCell>{variable?.type || 'Unknown'}</TableCell>
                        <TableCell>
                          <Typography 
                            color={getCorrelationColor(correlation.pd_correlation)}
                            fontWeight='medium'
                          >
                            {correlation.pd_correlation.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            color={getCorrelationColor(correlation.lgd_correlation)}
                            fontWeight='medium'
                          >
                            {correlation.lgd_correlation.toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )
                  })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align='center'>
                    <Alert severity='info'>
                      Please select a correlation matrix to view its details.
                    </Alert>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant='subtitle2' gutterBottom>
            Correlation Legend:
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 16, height: 16, bgcolor: 'error.main', borderRadius: '50%', mr: 1 }} />
                <Typography variant='body2'>
                  Strong Positive (&gt; 0.5)
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 16, height: 16, bgcolor: 'warning.main', borderRadius: '50%', mr: 1 }} />
                <Typography variant='body2'>
                  Moderate Positive (0.2 to 0.5)
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 16, height: 16, bgcolor: 'text.primary', borderRadius: '50%', mr: 1 }} />
                <Typography variant='body2'>
                  Weak/No Correlation (-0.2 to 0.2)
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 16, height: 16, bgcolor: 'info.main', borderRadius: '50%', mr: 1 }} />
                <Typography variant='body2'>
                  Moderate Negative (-0.5 to -0.2)
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 16, height: 16, bgcolor: 'success.main', borderRadius: '50%', mr: 1 }} />
                <Typography variant='body2'>
                  Strong Negative (&lt; -0.5)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
  
  // Render simulator tab
  const renderSimulatorTab = () => (
    <>
      <Card sx={{ mb: 6 }}>
        <CardContent>
          <Typography variant='h6' sx={{ mb: 4 }}>
            Simulation Parameters
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id='segment-select-label'>Customer Segment</InputLabel>
                <Select
                  labelId='segment-select-label'
                  value={selectedSegment}
                  label='Customer Segment'
                  onChange={handleSegmentChange}
                >
                  <MenuItem value='Retail'>Retail</MenuItem>
                  <MenuItem value='Commercial'>Commercial</MenuItem>
                  <MenuItem value='Corporate'>Corporate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id='matrix-select-label'>Correlation Matrix</InputLabel>
                <Select
                  labelId='matrix-select-label'
                  value={selectedMatrix}
                  label='Correlation Matrix'
                  onChange={handleMatrixChange}
                >
                  {correlationMatrices.map(matrix => (
                    <MenuItem key={matrix.matrix_id} value={matrix.matrix_id}>
                      {matrix.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id='scenario-select-label'>Primary Scenario</InputLabel>
                <Select
                  labelId='scenario-select-label'
                  value={selectedScenario}
                  label='Primary Scenario'
                  onChange={handleScenarioChange}
                >
                  {economicScenarios.map(scenario => (
                    <MenuItem key={scenario.scenario_id} value={scenario.scenario_id}>
                      {scenario.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label='Base PD'
                value={pdBase}
                onChange={handlePdBaseChange}
                fullWidth
                type='number'
                inputProps={{ min: 0, max: 1, step: 0.01 }}
                helperText='Enter a value between 0 and 1'
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label='Base LGD'
                value={lgdBase}
                onChange={handleLgdBaseChange}
                fullWidth
                type='number'
                inputProps={{ min: 0, max: 1, step: 0.01 }}
                helperText='Enter a value between 0 and 1'
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showAdvancedOptions}
                    onChange={(e) => setShowAdvancedOptions(e.target.checked)}
                  />
                }
                label='Show Advanced Options'
              />
            </Grid>
            
            {showAdvancedOptions && (
              <Grid item xs={12}>
                <Card variant='outlined' sx={{ p: 2 }}>
                  <Typography variant='subtitle1' gutterBottom>
                    Custom Variable Adjustments
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                    Adjust the impact of each economic variable on PD and LGD calculations.
                  </Typography>
                  
                  <TableContainer>
                    <Table size='small'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Variable</TableCell>
                          <TableCell>PD Impact (%)</TableCell>
                          <TableCell>LGD Impact (%)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {customAdjustments.map(adj => {
                          const variable = economicVariables.find(v => v.variable_id === adj.variableId)
                          if (!variable) return null
                          
                          return (
                            <TableRow key={adj.variableId}>
                              <TableCell>{variable.name}</TableCell>
                              <TableCell>
                                <Slider
                                  value={adj.pdImpact}
                                  onChange={(_, newValue) => 
                                    handleCustomAdjustmentChange(adj.variableId, 'pd', newValue as number)
                                  }
                                  min={-50}
                                  max={50}
                                  step={1}
                                  valueLabelDisplay='auto'
                                  valueLabelFormat={(value) => `${value}%`}
                                  sx={{ width: '90%' }}
                                />
                              </TableCell>
                              <TableCell>
                                <Slider
                                  value={adj.lgdImpact}
                                  onChange={(_, newValue) => 
                                    handleCustomAdjustmentChange(adj.variableId, 'lgd', newValue as number)
                                  }
                                  min={-50}
                                  max={50}
                                  step={1}
                                  valueLabelDisplay='auto'
                                  valueLabelFormat={(value) => `${value}%`}
                                  sx={{ width: '90%' }}
                                />
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Grid>
            )}
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant='contained' 
              color='primary'
              onClick={handleRunSimulation}
              startIcon={<i className='ri-play-circle-line' />}
            >
              Run Simulation
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {simulationResults.length > 0 && (
        <>
          <SimulationResults 
            results={simulationResults} 
            basePd={pdBase} 
            baseLgd={lgdBase}
            segment={selectedSegment}
          />
          
          <Box sx={{ mt: 6 }}>
            <ScenarioComparison 
              results={simulationResults}
              basePd={pdBase}
              baseLgd={lgdBase}
            />
          </Box>
        </>
      )}
    </>
  )
  
  // Render adjustments tab
  const renderAdjustmentsTab = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h6'>FLA Adjustments</Typography>
          <Button 
            variant='contained' 
            color='primary'
            startIcon={<i className='ri-add-line' />}
          >
            Create New Adjustment
          </Button>
        </Box>
        
        <TableContainer component={Paper} variant='outlined'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Effective Date</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flaAdjustments.map(adjustment => (
                <TableRow key={adjustment.adjustment_id}>
                  <TableCell>{adjustment.adjustment_id}</TableCell>
                  <TableCell>{adjustment.name}</TableCell>
                  <TableCell>{adjustment.description}</TableCell>
                  <TableCell>{new Date(adjustment.effective_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(adjustment.expiry_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={adjustment.is_active ? 'Active' : 'Inactive'} 
                      color={adjustment.is_active ? 'success' : 'default'}
                      size='small'
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title='View Details'>
                        <IconButton size='small' color='primary'>
                          <i className='ri-eye-line' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Edit'>
                        <IconButton size='small' color='primary'>
                          <i className='ri-edit-line' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Delete'>
                        <IconButton size='small' color='error'>
                          <i className='ri-delete-bin-line' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>FLA Simulator</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Simulate the impact of economic scenarios on PD and LGD values
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 4 }}>
          <Tab label='Correlation Matrix' />
          <Tab label='Simulator' />
          <Tab label='Adjustments' />
        </Tabs>
        
        {selectedTab === 0 && renderCorrelationMatrixTab()}
        {selectedTab === 1 && renderSimulatorTab()}
        {selectedTab === 2 && renderAdjustmentsTab()}
      </Grid>
    </Grid>
  )
}

export default FLASimulator
