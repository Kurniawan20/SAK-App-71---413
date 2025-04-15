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
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

// Type Imports
import type { MigrationMatrix } from '@/data/pd/migrationMatrixData'
import type { TransaksiSyariah } from '@/data/master/transaksiData'
import type { PDResult } from '@/data/pd/pdResultData'

// Component Imports
import PDResultChart from './PDResultChart'

interface PDSimulatorPageProps {
  migrationMatrixData: MigrationMatrix[]
  transaksiData: TransaksiSyariah[]
  pdResultData: PDResult[]
}

const PDSimulatorPage = ({ migrationMatrixData, transaksiData, pdResultData }: PDSimulatorPageProps) => {
  // States
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [selectedTransaksi, setSelectedTransaksi] = useState<number | ''>('')
  const [selectedKolektibilitas, setSelectedKolektibilitas] = useState<string>('1')
  const [tenor, setTenor] = useState<number>(12)
  const [isCalculating, setIsCalculating] = useState<boolean>(false)
  const [pdResults, setPdResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState<boolean>(false)
  
  // Get unique periods from migration matrix data
  const uniquePeriods = Array.from(
    new Set(
      migrationMatrixData.map(item => `${item.periode_awal} to ${item.periode_akhir}`)
    )
  )
  
  // Filter matrix data based on selected period
  const filteredMatrixData = migrationMatrixData.filter(item => 
    selectedPeriod === `${item.periode_awal} to ${item.periode_akhir}`
  )
  
  // Handlers
  const handlePeriodChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedPeriod(event.target.value as string)
  }
  
  const handleTransaksiChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTransaksi(event.target.value as number)
    
    // Find the transaction and set its kolektibilitas
    if (event.target.value) {
      const transaction = transaksiData.find(t => t.transaction_id === event.target.value)
      if (transaction) {
        setSelectedKolektibilitas(transaction.kolektibilitas_terkini)
      }
    }
  }
  
  const handleKolektibilitasChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedKolektibilitas(event.target.value as string)
  }
  
  const handleTenorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTenor(parseInt(event.target.value))
  }
  
  const handleCalculate = () => {
    if (!selectedPeriod || !selectedKolektibilitas) return
    
    setIsCalculating(true)
    
    // Simulate calculation process
    setTimeout(() => {
      // Calculate PD for each future period
      const results = []
      let currentKolektibilitas = selectedKolektibilitas
      
      for (let i = 1; i <= tenor; i++) {
        // Get transition probabilities for current kolektibilitas
        const transitions = filteredMatrixData.filter(item => 
          item.dari_kolektibilitas === currentKolektibilitas
        )
        
        // Calculate cumulative PD (probability of moving to Kol-5)
        const pdToDefault = transitions.find(t => t.ke_kolektibilitas === '5')?.probability_value || 0
        
        // For simulation purposes, randomly determine next kolektibilitas based on probabilities
        const rand = Math.random()
        let cumulativeProbability = 0
        
        for (const transition of transitions) {
          cumulativeProbability += transition.probability_value
          if (rand <= cumulativeProbability) {
            currentKolektibilitas = transition.ke_kolektibilitas
            break
          }
        }
        
        // Add result for this period
        results.push({
          period: i,
          kolektibilitas: currentKolektibilitas,
          pdValue: pdToDefault,
          cumulativePd: i === 1 ? pdToDefault : results[i-2].cumulativePd + pdToDefault - (results[i-2].cumulativePd * pdToDefault)
        })
      }
      
      setPdResults(results)
      setShowResults(true)
      setIsCalculating(false)
    }, 1500)
  }
  
  const handleReset = () => {
    setSelectedPeriod('')
    setSelectedTransaksi('')
    setSelectedKolektibilitas('1')
    setTenor(12)
    setPdResults([])
    setShowResults(false)
  }
  
  const getKolektibilitasColor = (kol: string) => {
    switch (kol) {
      case '1': return 'success'
      case '2': return 'info'
      case '3': return 'warning'
      case '4': return 'error'
      case '5': return 'error'
      default: return 'default'
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>PD Simulator</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Simulasi perhitungan Probability of Default (PD) berdasarkan Migration Matrix
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>Input Parameters</Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id='period-select-label'>Migration Matrix Period</InputLabel>
                  <Select
                    labelId='period-select-label'
                    value={selectedPeriod}
                    label='Migration Matrix Period'
                    onChange={handlePeriodChange}
                  >
                    {uniquePeriods.map(period => (
                      <MenuItem key={period} value={period}>
                        {period}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id='transaksi-select-label'>Transaksi (Optional)</InputLabel>
                  <Select
                    labelId='transaksi-select-label'
                    value={selectedTransaksi}
                    label='Transaksi (Optional)'
                    onChange={handleTransaksiChange}
                  >
                    <MenuItem value=''>
                      <em>None (Manual Input)</em>
                    </MenuItem>
                    {transaksiData.map(transaksi => (
                      <MenuItem key={transaksi.transaction_id} value={transaksi.transaction_id}>
                        ID: {transaksi.transaction_id} - Rp {transaksi.pokok_pembiayaan.toLocaleString('id-ID')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id='kolektibilitas-select-label'>Kolektibilitas Awal</InputLabel>
                  <Select
                    labelId='kolektibilitas-select-label'
                    value={selectedKolektibilitas}
                    label='Kolektibilitas Awal'
                    onChange={handleKolektibilitasChange}
                  >
                    {['1', '2', '3', '4', '5'].map(kol => (
                      <MenuItem key={kol} value={kol}>
                        Kolektibilitas {kol}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label='Tenor (Bulan)'
                  type='number'
                  fullWidth
                  value={tenor}
                  onChange={handleTenorChange}
                  inputProps={{ min: 1, max: 60 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button 
                    variant='outlined' 
                    color='secondary'
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                  <Button 
                    variant='contained' 
                    color='primary'
                    onClick={handleCalculate}
                    disabled={!selectedPeriod || !selectedKolektibilitas || isCalculating}
                    startIcon={isCalculating ? <CircularProgress size={20} /> : <i className='ri-calculator-line' />}
                  >
                    {isCalculating ? 'Calculating...' : 'Calculate PD'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      {showResults && (
        <>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h6' sx={{ mb: 4 }}>Simulation Results</Typography>
                
                <Alert severity='info' sx={{ mb: 4 }}>
                  Hasil simulasi menunjukkan perubahan kolektibilitas dan nilai PD untuk {tenor} bulan ke depan
                  berdasarkan migration matrix periode {selectedPeriod}.
                </Alert>
                
                <Box sx={{ mb: 4 }}>
                  <PDResultChart data={pdResults} />
                </Box>
                
                <Divider sx={{ my: 4 }} />
                
                <Typography variant='subtitle1' sx={{ mb: 2 }}>Detailed Results by Period</Typography>
                
                <TableContainer component={Paper} variant='outlined'>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Period (Month)</TableCell>
                        <TableCell>Projected Kolektibilitas</TableCell>
                        <TableCell>Monthly PD</TableCell>
                        <TableCell>Cumulative PD</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pdResults.map(result => (
                        <TableRow key={result.period}>
                          <TableCell>{result.period}</TableCell>
                          <TableCell>
                            <Chip 
                              label={`Kol-${result.kolektibilitas}`} 
                              color={getKolektibilitasColor(result.kolektibilitas)}
                              size='small'
                            />
                          </TableCell>
                          <TableCell>{(result.pdValue * 100).toFixed(2)}%</TableCell>
                          <TableCell>{(result.cumulativePd * 100).toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ mt: 4 }}>
                  <Stack direction='row' spacing={2}>
                    <Button 
                      variant='outlined' 
                      color='primary'
                      startIcon={<i className='ri-download-line' />}
                    >
                      Export Results
                    </Button>
                    <Button 
                      variant='outlined' 
                      color='secondary'
                      startIcon={<i className='ri-save-line' />}
                    >
                      Save Simulation
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default PDSimulatorPage
