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
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Divider from '@mui/material/Divider'
import Slider from '@mui/material/Slider'
import Tooltip from '@mui/material/Tooltip'
import InputAdornment from '@mui/material/InputAdornment'

// Third-party Imports
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend)

// Type Imports
import type { 
  EconomicVariable, 
  EconomicScenario, 
  EconomicForecast 
} from '@/data/fla/economicData'

// Interface for component props
interface EconomicScenariosProps {
  economicVariables: EconomicVariable[]
  economicScenarios: EconomicScenario[]
  economicForecasts: EconomicForecast[]
}

const EconomicScenarios = ({
  economicVariables,
  economicScenarios,
  economicForecasts
}: EconomicScenariosProps) => {
  // States
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [selectedVariable, setSelectedVariable] = useState<number | ''>('')
  const [selectedScenario, setSelectedScenario] = useState<number | ''>('')
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [dialogType, setDialogType] = useState<'variable' | 'scenario' | 'forecast'>('variable')
  const [scenarioProbabilities, setScenarioProbabilities] = useState<{id: number, probability: number}[]>([])
  
  // Get selected variable and scenario details
  const selectedVariableDetails = economicVariables.find(v => v.variable_id === selectedVariable)
  const selectedScenarioDetails = economicScenarios.find(s => s.scenario_id === selectedScenario)
  
  // Effect to initialize scenario probabilities
  useEffect(() => {
    if (economicScenarios.length > 0) {
      setScenarioProbabilities(
        economicScenarios.map(scenario => ({
          id: scenario.scenario_id,
          probability: scenario.probability
        }))
      )
    }
  }, [economicScenarios])
  
  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }
  
  const handleVariableChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedVariable(event.target.value as number)
  }
  
  const handleScenarioChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedScenario(event.target.value as number)
  }
  
  const handleOpenDialog = (type: 'variable' | 'scenario' | 'forecast') => {
    setDialogType(type)
    setOpenDialog(true)
  }
  
  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  
  const handleSaveDialog = () => {
    // In a real app, this would save the data to the backend
    handleCloseDialog()
    alert('Data saved successfully!')
  }
  
  const handleProbabilityChange = (id: number, newValue: number) => {
    const updatedProbabilities = scenarioProbabilities.map(item => 
      item.id === id ? { ...item, probability: newValue } : item
    )
    
    // Calculate the sum of all probabilities except the current one
    const otherProbabilitiesSum = updatedProbabilities
      .filter(item => item.id !== id)
      .reduce((sum, item) => sum + item.probability, 0)
    
    // Check if the sum exceeds 1.0
    if (otherProbabilitiesSum + newValue > 1.0) {
      alert('Total probability cannot exceed 100%')
      return
    }
    
    setScenarioProbabilities(updatedProbabilities)
  }
  
  // Filter forecasts based on selected variable and scenario
  const getFilteredForecasts = () => {
    let filtered = [...economicForecasts]
    
    if (selectedVariable) {
      filtered = filtered.filter(f => f.variable_id === selectedVariable)
    }
    
    if (selectedScenario) {
      filtered = filtered.filter(f => f.scenario_id === selectedScenario)
    }
    
    return filtered.sort((a, b) => a.period.localeCompare(b.period))
  }
  
  // Prepare chart data
  const prepareChartData = () => {
    if (!selectedVariable) return null
    
    const filteredForecasts = economicForecasts.filter(f => f.variable_id === selectedVariable)
    const periods = [...new Set(filteredForecasts.map(f => f.period))].sort()
    
    const datasets = economicScenarios.map(scenario => {
      const scenarioForecasts = filteredForecasts.filter(f => f.scenario_id === scenario.scenario_id)
      
      // Map colors based on scenario type
      const getColor = (type: string) => {
        switch (type) {
          case 'Base': return 'rgba(54, 162, 235, 1)'
          case 'Upside': return 'rgba(75, 192, 192, 1)'
          case 'Downside': return 'rgba(255, 159, 64, 1)'
          case 'Severe Downside': return 'rgba(255, 99, 132, 1)'
          default: return 'rgba(201, 203, 207, 1)'
        }
      }
      
      return {
        label: scenario.name,
        data: periods.map(period => {
          const forecast = scenarioForecasts.find(f => f.period === period)
          return forecast ? forecast.value : null
        }),
        borderColor: getColor(scenario.type),
        backgroundColor: getColor(scenario.type).replace('1)', '0.2)'),
        borderWidth: 2,
        tension: 0.1
      }
    })
    
    return {
      labels: periods.map(p => {
        const [year, month] = p.split('-')
        return `${month}/${year.slice(2)}`
      }),
      datasets
    }
  }
  
  const chartData = prepareChartData()
  const filteredForecasts = getFilteredForecasts()
  
  // Render variable management tab
  const renderVariablesTab = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h6'>Economic Variables</Typography>
          <Button 
            variant='contained' 
            color='primary'
            startIcon={<i className='ri-add-line' />}
            onClick={() => handleOpenDialog('variable')}
          >
            Add Variable
          </Button>
        </Box>
        
        <TableContainer component={Paper} variant='outlined'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {economicVariables.map(variable => (
                <TableRow key={variable.variable_id}>
                  <TableCell>{variable.variable_id}</TableCell>
                  <TableCell>{variable.name}</TableCell>
                  <TableCell>{variable.type}</TableCell>
                  <TableCell>{variable.unit}</TableCell>
                  <TableCell>{variable.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={variable.is_active ? 'Active' : 'Inactive'} 
                      color={variable.is_active ? 'success' : 'default'}
                      size='small'
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
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
  
  // Render scenario management tab
  const renderScenariosTab = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h6'>Economic Scenarios</Typography>
          <Button 
            variant='contained' 
            color='primary'
            startIcon={<i className='ri-add-line' />}
            onClick={() => handleOpenDialog('scenario')}
          >
            Add Scenario
          </Button>
        </Box>
        
        <TableContainer component={Paper} variant='outlined' sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Probability</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {economicScenarios.map(scenario => (
                <TableRow key={scenario.scenario_id}>
                  <TableCell>{scenario.scenario_id}</TableCell>
                  <TableCell>{scenario.name}</TableCell>
                  <TableCell>{scenario.type}</TableCell>
                  <TableCell>{scenario.description}</TableCell>
                  <TableCell>{(scenario.probability * 100).toFixed(1)}%</TableCell>
                  <TableCell>
                    <Chip 
                      label={scenario.is_active ? 'Active' : 'Inactive'} 
                      color={scenario.is_active ? 'success' : 'default'}
                      size='small'
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
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
        
        <Typography variant='h6' sx={{ mb: 2 }}>Scenario Probabilities</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Adjust the probability weights for each scenario. The total probability must equal 100%.
        </Typography>
        
        <Grid container spacing={3}>
          {scenarioProbabilities.map(item => {
            const scenario = economicScenarios.find(s => s.scenario_id === item.id)
            if (!scenario) return null
            
            return (
              <Grid item xs={12} md={6} key={item.id}>
                <Card variant='outlined'>
                  <CardContent>
                    <Typography variant='subtitle1' gutterBottom>
                      {scenario.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Slider
                        value={item.probability * 100}
                        onChange={(_, newValue) => 
                          handleProbabilityChange(item.id, (newValue as number) / 100)
                        }
                        min={0}
                        max={100}
                        step={1}
                        sx={{ flexGrow: 1, mr: 2 }}
                      />
                      <TextField
                        value={(item.probability * 100).toFixed(1)}
                        onChange={e => {
                          const value = parseFloat(e.target.value)
                          if (!isNaN(value) && value >= 0 && value <= 100) {
                            handleProbabilityChange(item.id, value / 100)
                          }
                        }}
                        InputProps={{
                          endAdornment: <InputAdornment position='end'>%</InputAdornment>
                        }}
                        size='small'
                        sx={{ width: 100 }}
                      />
                    </Box>
                    <Typography variant='caption' color='text.secondary'>
                      {scenario.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant='contained' 
            color='primary'
            onClick={() => {
              // Check if probabilities sum to 1
              const sum = scenarioProbabilities.reduce((acc, item) => acc + item.probability, 0)
              if (Math.abs(sum - 1) > 0.001) {
                alert(`Total probability is ${(sum * 100).toFixed(1)}%. It must equal 100%.`)
                return
              }
              
              // In a real app, this would save the probabilities to the backend
              alert('Probabilities saved successfully!')
            }}
          >
            Save Probabilities
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
  
  // Render forecast management tab
  const renderForecastsTab = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h6'>Economic Forecasts</Typography>
          <Button 
            variant='contained' 
            color='primary'
            startIcon={<i className='ri-add-line' />}
            onClick={() => handleOpenDialog('forecast')}
          >
            Add Forecast
          </Button>
        </Box>
        
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='variable-select-label'>Economic Variable</InputLabel>
              <Select
                labelId='variable-select-label'
                value={selectedVariable}
                label='Economic Variable'
                onChange={handleVariableChange}
              >
                <MenuItem value=''>
                  <em>All Variables</em>
                </MenuItem>
                {economicVariables.map(variable => (
                  <MenuItem key={variable.variable_id} value={variable.variable_id}>
                    {variable.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='scenario-select-label'>Economic Scenario</InputLabel>
              <Select
                labelId='scenario-select-label'
                value={selectedScenario}
                label='Economic Scenario'
                onChange={handleScenarioChange}
              >
                <MenuItem value=''>
                  <em>All Scenarios</em>
                </MenuItem>
                {economicScenarios.map(scenario => (
                  <MenuItem key={scenario.scenario_id} value={scenario.scenario_id}>
                    {scenario.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        {selectedVariable && chartData && (
          <Box sx={{ mb: 4, height: 400 }}>
            <Typography variant='subtitle1' gutterBottom>
              {selectedVariableDetails?.name} Forecast Chart
            </Typography>
            <Line 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    title: {
                      display: true,
                      text: selectedVariableDetails?.unit || ''
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Period (MM/YY)'
                    }
                  }
                }
              }}
            />
          </Box>
        )}
        
        <TableContainer component={Paper} variant='outlined'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Variable</TableCell>
                <TableCell>Scenario</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredForecasts.length > 0 ? (
                filteredForecasts.map(forecast => {
                  const variable = economicVariables.find(v => v.variable_id === forecast.variable_id)
                  const scenario = economicScenarios.find(s => s.scenario_id === forecast.scenario_id)
                  
                  return (
                    <TableRow key={forecast.forecast_id}>
                      <TableCell>{forecast.forecast_id}</TableCell>
                      <TableCell>{variable?.name || 'Unknown'}</TableCell>
                      <TableCell>{scenario?.name || 'Unknown'}</TableCell>
                      <TableCell>{forecast.period}</TableCell>
                      <TableCell>
                        {forecast.value} {variable?.unit}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
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
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    <Alert severity='info'>
                      No forecasts found. Please select different filters or add new forecasts.
                    </Alert>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
  
  // Render dialog content based on type
  const renderDialogContent = () => {
    switch (dialogType) {
      case 'variable':
        return (
          <>
            <DialogTitle>
              Add Economic Variable
              <IconButton
                aria-label='close'
                onClick={handleCloseDialog}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <i className='ri-close-line' />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item xs={12}>
                  <TextField
                    label='Variable Name'
                    fullWidth
                    placeholder='e.g., GDP Growth Rate'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Variable Type</InputLabel>
                    <Select label='Variable Type' defaultValue='GDP Growth'>
                      <MenuItem value='GDP Growth'>GDP Growth</MenuItem>
                      <MenuItem value='Inflation Rate'>Inflation Rate</MenuItem>
                      <MenuItem value='Exchange Rate'>Exchange Rate</MenuItem>
                      <MenuItem value='Interest Rate'>Interest Rate</MenuItem>
                      <MenuItem value='Unemployment Rate'>Unemployment Rate</MenuItem>
                      <MenuItem value='Commodity Price'>Commodity Price</MenuItem>
                      <MenuItem value='Property Price Index'>Property Price Index</MenuItem>
                      <MenuItem value='Stock Market Index'>Stock Market Index</MenuItem>
                      <MenuItem value='Custom'>Custom</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label='Unit'
                    fullWidth
                    placeholder='e.g., %, IDR, Index'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Description'
                    fullWidth
                    multiline
                    rows={3}
                    placeholder='Describe the economic variable...'
                  />
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )
      
      case 'scenario':
        return (
          <>
            <DialogTitle>
              Add Economic Scenario
              <IconButton
                aria-label='close'
                onClick={handleCloseDialog}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <i className='ri-close-line' />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item xs={12}>
                  <TextField
                    label='Scenario Name'
                    fullWidth
                    placeholder='e.g., Base Case'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Scenario Type</InputLabel>
                    <Select label='Scenario Type' defaultValue='Base'>
                      <MenuItem value='Base'>Base</MenuItem>
                      <MenuItem value='Upside'>Upside</MenuItem>
                      <MenuItem value='Downside'>Downside</MenuItem>
                      <MenuItem value='Severe Downside'>Severe Downside</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label='Probability (%)'
                    fullWidth
                    type='number'
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>%</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Description'
                    fullWidth
                    multiline
                    rows={3}
                    placeholder='Describe the economic scenario...'
                  />
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )
      
      case 'forecast':
        return (
          <>
            <DialogTitle>
              Add Economic Forecast
              <IconButton
                aria-label='close'
                onClick={handleCloseDialog}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <i className='ri-close-line' />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Economic Variable</InputLabel>
                    <Select label='Economic Variable'>
                      {economicVariables.map(variable => (
                        <MenuItem key={variable.variable_id} value={variable.variable_id}>
                          {variable.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Economic Scenario</InputLabel>
                    <Select label='Economic Scenario'>
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
                    label='Period (YYYY-MM)'
                    fullWidth
                    placeholder='e.g., 2025-01'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label='Value'
                    fullWidth
                    type='number'
                  />
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )
      
      default:
        return null
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Economic Scenarios</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Manage economic variables, scenarios, and forecasts for forward-looking adjustments
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 4 }}>
          <Tab label='Variables' />
          <Tab label='Scenarios' />
          <Tab label='Forecasts' />
        </Tabs>
        
        {selectedTab === 0 && renderVariablesTab()}
        {selectedTab === 1 && renderScenariosTab()}
        {selectedTab === 2 && renderForecastsTab()}
      </Grid>
      
      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='md' fullWidth>
        {renderDialogContent()}
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant='contained' color='primary' onClick={handleSaveDialog}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default EconomicScenarios
