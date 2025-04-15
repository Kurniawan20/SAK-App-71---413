'use client'

// React Imports
import { FC, useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

// React Icons
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineSave, AiOutlineInfoCircle } from 'react-icons/ai'

// Chart Components
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend)

// Type Imports
import type { 
  ECLScenario, 
  ECLScenarioType,
  ECLScenarioResult
} from '@/data/ecl/eclData'

// Sample data for demonstration
const sampleECLScenarios: ECLScenario[] = [
  {
    scenario_id: 1,
    name: 'Base Case',
    type: 'Base',
    description: 'Most likely economic scenario based on current market conditions',
    probability: 0.6,
    pd_adjustment_factor: 1.0,
    lgd_adjustment_factor: 1.0,
    is_active: true
  },
  {
    scenario_id: 2,
    name: 'Upside',
    type: 'Upside',
    description: 'Optimistic economic scenario with improved market conditions',
    probability: 0.2,
    pd_adjustment_factor: 0.8,
    lgd_adjustment_factor: 0.9,
    is_active: true
  },
  {
    scenario_id: 3,
    name: 'Downside',
    type: 'Downside',
    description: 'Pessimistic economic scenario with deteriorating market conditions',
    probability: 0.2,
    pd_adjustment_factor: 1.3,
    lgd_adjustment_factor: 1.2,
    is_active: true
  }
]

const sampleECLScenarioResults: ECLScenarioResult[] = [
  {
    result_id: 1,
    scenario_id: 1,
    calculation_date: '2025-03-31',
    segment: 'Retail',
    total_exposure: 1000000,
    weighted_pd: 0.02,
    weighted_lgd: 0.4,
    ecl_amount: 8000,
    coverage_ratio: 0.008
  },
  {
    result_id: 2,
    scenario_id: 2,
    calculation_date: '2025-03-31',
    segment: 'Retail',
    total_exposure: 1000000,
    weighted_pd: 0.016,
    weighted_lgd: 0.36,
    ecl_amount: 5760,
    coverage_ratio: 0.00576
  },
  {
    result_id: 3,
    scenario_id: 3,
    calculation_date: '2025-03-31',
    segment: 'Retail',
    total_exposure: 1000000,
    weighted_pd: 0.026,
    weighted_lgd: 0.48,
    ecl_amount: 12480,
    coverage_ratio: 0.01248
  },
  {
    result_id: 4,
    scenario_id: 1,
    calculation_date: '2025-03-31',
    segment: 'Commercial',
    total_exposure: 5000000,
    weighted_pd: 0.015,
    weighted_lgd: 0.35,
    ecl_amount: 26250,
    coverage_ratio: 0.00525
  },
  {
    result_id: 5,
    scenario_id: 2,
    calculation_date: '2025-03-31',
    segment: 'Commercial',
    total_exposure: 5000000,
    weighted_pd: 0.012,
    weighted_lgd: 0.315,
    ecl_amount: 18900,
    coverage_ratio: 0.00378
  },
  {
    result_id: 6,
    scenario_id: 3,
    calculation_date: '2025-03-31',
    segment: 'Commercial',
    total_exposure: 5000000,
    weighted_pd: 0.0195,
    weighted_lgd: 0.42,
    ecl_amount: 40950,
    coverage_ratio: 0.00819
  }
]

interface ECLScenariosProps {
  // You can add props here if needed
}

const ECLScenarios: FC<ECLScenariosProps> = () => {
  // States
  const [activeTab, setActiveTab] = useState<number>(0)
  const [scenarios, setScenarios] = useState<ECLScenario[]>(sampleECLScenarios)
  const [scenarioResults, setScenarioResults] = useState<ECLScenarioResult[]>(sampleECLScenarioResults)
  const [editingScenario, setEditingScenario] = useState<ECLScenario | null>(null)
  
  // Handler for tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  
  // Handler for editing a scenario
  const handleEditScenario = (scenario: ECLScenario) => {
    setEditingScenario({ ...scenario })
  }
  
  // Handler for saving edited scenario
  const handleSaveScenario = () => {
    if (editingScenario) {
      // Validate total probability equals 1
      const otherScenariosProbability = scenarios
        .filter(s => s.scenario_id !== editingScenario.scenario_id)
        .reduce((sum, s) => sum + s.probability, 0)
      
      const totalProbability = otherScenariosProbability + editingScenario.probability
      
      if (Math.abs(totalProbability - 1) > 0.001) {
        alert(`Total probability must equal 1. Current total: ${totalProbability.toFixed(2)}`)
        return
      }
      
      // Update scenario
      const updatedScenarios = scenarios.map(s => 
        s.scenario_id === editingScenario.scenario_id ? editingScenario : s
      )
      
      setScenarios(updatedScenarios)
      setEditingScenario(null)
    }
  }
  
  // Handler for canceling edit
  const handleCancelEdit = () => {
    setEditingScenario(null)
  }
  
  // Handler for adding a new scenario
  const handleAddScenario = () => {
    const newScenarioId = Math.max(...scenarios.map(s => s.scenario_id), 0) + 1
    
    const newScenario: ECLScenario = {
      scenario_id: newScenarioId,
      name: `New Scenario ${newScenarioId}`,
      type: 'Custom',
      description: 'Custom economic scenario',
      probability: 0,
      pd_adjustment_factor: 1.0,
      lgd_adjustment_factor: 1.0,
      is_active: false
    }
    
    setScenarios([...scenarios, newScenario])
    setEditingScenario(newScenario)
  }
  
  // Handler for deleting a scenario
  const handleDeleteScenario = (scenarioId: number) => {
    // Check if it's a base scenario
    const scenario = scenarios.find(s => s.scenario_id === scenarioId)
    if (scenario?.type === 'Base') {
      alert('Cannot delete the Base scenario')
      return
    }
    
    // Confirm deletion
    if (confirm(`Are you sure you want to delete this scenario?`)) {
      const updatedScenarios = scenarios.filter(s => s.scenario_id !== scenarioId)
      
      // Redistribute probability
      const remainingProbability = scenario?.probability || 0
      const baseScenario = updatedScenarios.find(s => s.type === 'Base')
      
      if (baseScenario) {
        baseScenario.probability += remainingProbability
      }
      
      setScenarios(updatedScenarios)
      
      // Also remove related results
      const updatedResults = scenarioResults.filter(r => r.scenario_id !== scenarioId)
      setScenarioResults(updatedResults)
    }
  }
  
  // Handler for editing scenario field
  const handleEditScenarioField = (field: keyof ECLScenario, value: any) => {
    if (editingScenario) {
      setEditingScenario({ ...editingScenario, [field]: value })
    }
  }
  
  // Get scenario type color
  const getScenarioTypeColor = (type: ECLScenarioType): 'success' | 'warning' | 'error' | 'default' => {
    switch (type) {
      case 'Base':
        return 'default'
      case 'Upside':
        return 'success'
      case 'Downside':
        return 'error'
      case 'Custom':
        return 'warning'
      default:
        return 'default'
    }
  }
  
  // Format number as percentage
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`
  }
  
  // Get scenario results by segment
  const getScenarioResultsBySegment = (segment: string): ECLScenarioResult[] => {
    return scenarioResults.filter(r => r.segment === segment)
  }
  
  // Get segments from results
  const getSegments = (): string[] => {
    return [...new Set(scenarioResults.map(r => r.segment))]
  }
  
  // Calculate weighted ECL by segment
  const calculateWeightedECL = (segment: string): number => {
    const segmentResults = getScenarioResultsBySegment(segment)
    
    return segmentResults.reduce((sum, result) => {
      const scenario = scenarios.find(s => s.scenario_id === result.scenario_id)
      return sum + (result.ecl_amount * (scenario?.probability || 0))
    }, 0)
  }
  
  // Calculate weighted coverage ratio by segment
  const calculateWeightedCoverageRatio = (segment: string): number => {
    const segmentResults = getScenarioResultsBySegment(segment)
    const totalExposure = segmentResults[0]?.total_exposure || 0
    
    const weightedECL = calculateWeightedECL(segment)
    
    return totalExposure > 0 ? weightedECL / totalExposure : 0
  }
  
  // Prepare chart data for ECL by scenario
  const prepareECLChartData = () => {
    const segments = getSegments()
    const scenarioNames = scenarios.map(s => s.name)
    
    // Add "Weighted" as the last scenario
    scenarioNames.push('Weighted')
    
    const datasets = segments.map((segment, index) => {
      const segmentResults = getScenarioResultsBySegment(segment)
      
      // Get ECL amounts for each scenario
      const data = scenarios.map(scenario => {
        const result = segmentResults.find(r => r.scenario_id === scenario.scenario_id)
        return result ? result.ecl_amount : 0
      })
      
      // Add weighted ECL as the last data point
      data.push(calculateWeightedECL(segment))
      
      return {
        label: segment,
        data,
        borderColor: index === 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
        backgroundColor: index === 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'
      }
    })
    
    return {
      labels: scenarioNames,
      datasets
    }
  }
  
  // Prepare chart data for coverage ratio by scenario
  const prepareCoverageRatioChartData = () => {
    const segments = getSegments()
    const scenarioNames = scenarios.map(s => s.name)
    
    // Add "Weighted" as the last scenario
    scenarioNames.push('Weighted')
    
    const datasets = segments.map((segment, index) => {
      const segmentResults = getScenarioResultsBySegment(segment)
      
      // Get coverage ratios for each scenario
      const data = scenarios.map(scenario => {
        const result = segmentResults.find(r => r.scenario_id === scenario.scenario_id)
        return result ? result.coverage_ratio * 100 : 0
      })
      
      // Add weighted coverage ratio as the last data point
      data.push(calculateWeightedCoverageRatio(segment) * 100)
      
      return {
        label: segment,
        data,
        borderColor: index === 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
        backgroundColor: index === 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'
      }
    })
    
    return {
      labels: scenarioNames,
      datasets
    }
  }
  
  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('id-ID', { 
                style: 'currency', 
                currency: 'IDR',
                maximumFractionDigits: 0
              }).format(context.parsed.y)
            }
            return label
          }
        }
      }
    }
  }
  
  // Chart options for coverage ratio
  const coverageRatioChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2) + '%'
            }
            return label
          }
        }
      }
    }
  }
  
  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        ECL Scenarios
      </Typography>
      
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label='Scenario Management' />
        <Tab label='Scenario Analysis' />
      </Tabs>
      
      {activeTab === 0 && (
        <Box>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card variant='outlined'>
                <CardHeader 
                  title='Economic Scenarios'
                  action={
                    <Button 
                      variant='contained' 
                      startIcon={<AiOutlinePlus />}
                      onClick={handleAddScenario}
                    >
                      Add Scenario
                    </Button>
                  }
                />
                <Divider />
                <CardContent>
                  <Alert severity='info' sx={{ mb: 3 }}>
                    Define multiple economic scenarios for ECL calculation. The sum of all scenario probabilities must equal 1.
                  </Alert>
                  
                  <TableContainer component={Paper} variant='outlined'>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Probability</TableCell>
                          <TableCell>PD Adjustment</TableCell>
                          <TableCell>LGD Adjustment</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {scenarios.map(scenario => (
                          <TableRow key={scenario.scenario_id}>
                            <TableCell>
                              {editingScenario?.scenario_id === scenario.scenario_id ? (
                                <TextField
                                  value={editingScenario.name}
                                  onChange={(e) => handleEditScenarioField('name', e.target.value)}
                                  size='small'
                                  fullWidth
                                />
                              ) : (
                                <Typography variant='body2'>
                                  {scenario.name}
                                  <Tooltip title={scenario.description}>
                                    <IconButton size='small'>
                                      <AiOutlineInfoCircle />
                                    </IconButton>
                                  </Tooltip>
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              {editingScenario?.scenario_id === scenario.scenario_id ? (
                                <FormControl fullWidth size='small'>
                                  <InputLabel>Type</InputLabel>
                                  <Select
                                    value={editingScenario.type}
                                    label='Type'
                                    onChange={(e) => handleEditScenarioField('type', e.target.value)}
                                  >
                                    <MenuItem value='Base'>Base</MenuItem>
                                    <MenuItem value='Upside'>Upside</MenuItem>
                                    <MenuItem value='Downside'>Downside</MenuItem>
                                    <MenuItem value='Custom'>Custom</MenuItem>
                                  </Select>
                                </FormControl>
                              ) : (
                                <Chip 
                                  label={scenario.type}
                                  color={getScenarioTypeColor(scenario.type)}
                                  size='small'
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              {editingScenario?.scenario_id === scenario.scenario_id ? (
                                <TextField
                                  value={editingScenario.probability}
                                  onChange={(e) => handleEditScenarioField('probability', parseFloat(e.target.value))}
                                  size='small'
                                  type='number'
                                  inputProps={{ step: 0.05, min: 0, max: 1 }}
                                  fullWidth
                                />
                              ) : (
                                formatPercentage(scenario.probability)
                              )}
                            </TableCell>
                            <TableCell>
                              {editingScenario?.scenario_id === scenario.scenario_id ? (
                                <TextField
                                  value={editingScenario.pd_adjustment_factor}
                                  onChange={(e) => handleEditScenarioField('pd_adjustment_factor', parseFloat(e.target.value))}
                                  size='small'
                                  type='number'
                                  inputProps={{ step: 0.1, min: 0.1 }}
                                  fullWidth
                                />
                              ) : (
                                scenario.pd_adjustment_factor.toFixed(2)
                              )}
                            </TableCell>
                            <TableCell>
                              {editingScenario?.scenario_id === scenario.scenario_id ? (
                                <TextField
                                  value={editingScenario.lgd_adjustment_factor}
                                  onChange={(e) => handleEditScenarioField('lgd_adjustment_factor', parseFloat(e.target.value))}
                                  size='small'
                                  type='number'
                                  inputProps={{ step: 0.1, min: 0.1 }}
                                  fullWidth
                                />
                              ) : (
                                scenario.lgd_adjustment_factor.toFixed(2)
                              )}
                            </TableCell>
                            <TableCell>
                              {editingScenario?.scenario_id === scenario.scenario_id ? (
                                <FormControl fullWidth size='small'>
                                  <Select
                                    value={editingScenario.is_active ? 'active' : 'inactive'}
                                    onChange={(e) => handleEditScenarioField('is_active', e.target.value === 'active')}
                                  >
                                    <MenuItem value='active'>Active</MenuItem>
                                    <MenuItem value='inactive'>Inactive</MenuItem>
                                  </Select>
                                </FormControl>
                              ) : (
                                <Chip 
                                  label={scenario.is_active ? 'Active' : 'Inactive'}
                                  color={scenario.is_active ? 'success' : 'default'}
                                  size='small'
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              {editingScenario?.scenario_id === scenario.scenario_id ? (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button
                                    variant='contained'
                                    size='small'
                                    startIcon={<AiOutlineSave />}
                                    onClick={handleSaveScenario}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    variant='outlined'
                                    size='small'
                                    onClick={handleCancelEdit}
                                  >
                                    Cancel
                                  </Button>
                                </Box>
                              ) : (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <IconButton
                                    size='small'
                                    color='primary'
                                    onClick={() => handleEditScenario(scenario)}
                                  >
                                    <AiOutlineEdit />
                                  </IconButton>
                                  <IconButton
                                    size='small'
                                    color='error'
                                    onClick={() => handleDeleteScenario(scenario.scenario_id)}
                                    disabled={scenario.type === 'Base'}
                                  >
                                    <AiOutlineDelete />
                                  </IconButton>
                                </Box>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
      
      {activeTab === 1 && (
        <Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card variant='outlined'>
                <CardHeader title='ECL by Scenario' />
                <Divider />
                <CardContent>
                  <Box sx={{ height: 400 }}>
                    <Line data={prepareECLChartData()} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant='outlined'>
                <CardHeader title='Coverage Ratio by Scenario' />
                <Divider />
                <CardContent>
                  <Box sx={{ height: 400 }}>
                    <Line data={prepareCoverageRatioChartData()} options={coverageRatioChartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card variant='outlined'>
                <CardHeader title='Scenario Results Summary' />
                <Divider />
                <CardContent>
                  <TableContainer component={Paper} variant='outlined'>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Segment</TableCell>
                          <TableCell>Total Exposure</TableCell>
                          {scenarios.map(scenario => (
                            <TableCell key={scenario.scenario_id}>
                              {scenario.name} ECL
                              <br />
                              <Typography variant='caption'>
                                (Prob: {formatPercentage(scenario.probability)})
                              </Typography>
                            </TableCell>
                          ))}
                          <TableCell>Weighted ECL</TableCell>
                          <TableCell>Weighted Coverage</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getSegments().map(segment => {
                          const segmentResults = getScenarioResultsBySegment(segment)
                          const totalExposure = segmentResults[0]?.total_exposure || 0
                          const weightedECL = calculateWeightedECL(segment)
                          const weightedCoverage = calculateWeightedCoverageRatio(segment)
                          
                          return (
                            <TableRow key={segment}>
                              <TableCell>{segment}</TableCell>
                              <TableCell>
                                {new Intl.NumberFormat('id-ID', { 
                                  style: 'currency', 
                                  currency: 'IDR',
                                  maximumFractionDigits: 0
                                }).format(totalExposure)}
                              </TableCell>
                              {scenarios.map(scenario => {
                                const result = segmentResults.find(r => r.scenario_id === scenario.scenario_id)
                                
                                return (
                                  <TableCell key={scenario.scenario_id}>
                                    {result ? new Intl.NumberFormat('id-ID', { 
                                      style: 'currency', 
                                      currency: 'IDR',
                                      maximumFractionDigits: 0
                                    }).format(result.ecl_amount) : 'N/A'}
                                    <br />
                                    <Typography variant='caption'>
                                      ({result ? formatPercentage(result.coverage_ratio) : 'N/A'})
                                    </Typography>
                                  </TableCell>
                                )
                              })}
                              <TableCell>
                                {new Intl.NumberFormat('id-ID', { 
                                  style: 'currency', 
                                  currency: 'IDR',
                                  maximumFractionDigits: 0
                                }).format(weightedECL)}
                              </TableCell>
                              <TableCell>
                                {formatPercentage(weightedCoverage)}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  )
}

export default ECLScenarios
