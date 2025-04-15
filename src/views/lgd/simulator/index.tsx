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
import Slider from '@mui/material/Slider'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'

// Type Imports
import type { TransaksiSyariah } from '@/data/master/transaksiData'
import type { Agunan, JenisAgunan } from '@/data/lgd/agunanData'

// Helper Imports
import { getDefaultHaircutPersen, calculateExpectedRecovery } from '@/data/lgd/agunanData'
import { calculateLGDPercentage } from '@/data/lgd/lgdData'
import { formatCurrency } from '@/data/master/transaksiData'

interface RecoverySimulatorProps {
  transaksiData: TransaksiSyariah[]
  agunanData: Agunan[]
}

const RecoverySimulator = ({ transaksiData, agunanData }: RecoverySimulatorProps) => {
  // States
  const [selectedTransaksi, setSelectedTransaksi] = useState<number | ''>('')
  const [filteredAgunan, setFilteredAgunan] = useState<Agunan[]>([])
  const [simulatedAgunan, setSimulatedAgunan] = useState<Agunan[]>([])
  const [scenarioName, setScenarioName] = useState<string>('Base Case')
  const [scenarios, setScenarios] = useState<{
    name: string
    haircuts: Record<string, number>
    lgdResult: number
    recoveryValue: number
  }[]>([])
  
  // Get transaction details
  const selectedTransaksiDetails = transaksiData.find(t => t.transaction_id === selectedTransaksi)
  
  // Filter agunan based on selected transaction
  useEffect(() => {
    if (selectedTransaksi) {
      const filtered = agunanData.filter(a => a.transaction_id === selectedTransaksi)
      setFilteredAgunan(filtered)
      setSimulatedAgunan(JSON.parse(JSON.stringify(filtered))) // Deep copy
    } else {
      setFilteredAgunan([])
      setSimulatedAgunan([])
    }
  }, [selectedTransaksi, agunanData])
  
  // Handlers
  const handleTransaksiChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTransaksi(event.target.value as number)
    setScenarios([])
  }
  
  const handleHaircutChange = (agunanId: number, value: number) => {
    setSimulatedAgunan(prev => 
      prev.map(item => 
        item.agunan_id === agunanId ? { ...item, haircut_persen: value } : item
      )
    )
  }
  
  const handleMarketValueChange = (agunanId: number, value: number) => {
    setSimulatedAgunan(prev => 
      prev.map(item => 
        item.agunan_id === agunanId ? { ...item, nilai_pasar_kini: value } : item
      )
    )
  }
  
  const handleScenarioNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScenarioName(event.target.value)
  }
  
  const handleAddScenario = () => {
    if (!selectedTransaksiDetails) return
    
    // Calculate total recovery value
    const totalRecoveryValue = simulatedAgunan.reduce((sum, item) => 
      sum + (item.nilai_pasar_kini * (1 - (item.haircut_persen / 100))), 0
    )
    
    // Calculate LGD
    const lgdResult = calculateLGDPercentage(selectedTransaksiDetails.pokok_pembiayaan, totalRecoveryValue)
    
    // Create haircut map
    const haircuts: Record<string, number> = {}
    simulatedAgunan.forEach(item => {
      haircuts[item.agunan_id] = item.haircut_persen
    })
    
    // Add scenario
    const newScenario = {
      name: scenarioName,
      haircuts,
      lgdResult,
      recoveryValue: totalRecoveryValue
    }
    
    setScenarios(prev => [...prev, newScenario])
    
    // Reset scenario name
    setScenarioName(`Scenario ${scenarios.length + 2}`)
  }
  
  const handleResetSimulation = () => {
    setSimulatedAgunan(JSON.parse(JSON.stringify(filteredAgunan))) // Reset to original values
  }
  
  const handleStressTest = () => {
    // Apply stress test by increasing haircuts by 20%
    setSimulatedAgunan(prev => 
      prev.map(item => ({
        ...item,
        haircut_persen: Math.min(item.haircut_persen + 20, 100) // Cap at 100%
      }))
    )
  }
  
  const handleOptimisticTest = () => {
    // Apply optimistic test by decreasing haircuts by 10%
    setSimulatedAgunan(prev => 
      prev.map(item => ({
        ...item,
        haircut_persen: Math.max(item.haircut_persen - 10, 0) // Floor at 0%
      }))
    )
  }
  
  // Calculate total recovery value and LGD
  const totalRecoveryValue = simulatedAgunan.reduce((sum, item) => 
    sum + (item.nilai_pasar_kini * (1 - (item.haircut_persen / 100))), 0
  )
  
  const lgdResult = selectedTransaksiDetails 
    ? calculateLGDPercentage(selectedTransaksiDetails.pokok_pembiayaan, totalRecoveryValue)
    : 0
  
  // Get color based on LGD percentage
  const getLGDColor = (lgdPercentage: number): 'success' | 'warning' | 'error' => {
    if (lgdPercentage <= 0.2) return 'success'
    if (lgdPercentage <= 0.5) return 'warning'
    
    return 'error'
  }
  
  // Get color based on collateral type
  const getAgunanColor = (jenisAgunan: JenisAgunan): 'success' | 'info' | 'warning' | 'error' | 'default' => {
    const colors: Record<JenisAgunan, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
      'Tanah': 'success',
      'Bangunan': 'success',
      'Kendaraan': 'info',
      'Mesin': 'info',
      'Deposito': 'success',
      'Inventory': 'warning',
      'Piutang': 'warning',
      'Lainnya': 'error'
    }
    
    return colors[jenisAgunan]
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Recovery Simulator</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Simulasi recovery value dan LGD dengan berbagai skenario haircut
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant='h6'>Pilih Transaksi</Typography>
            </Box>
            
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id='transaksi-select-label'>Transaksi</InputLabel>
              <Select
                labelId='transaksi-select-label'
                value={selectedTransaksi}
                label='Transaksi'
                onChange={handleTransaksiChange}
              >
                <MenuItem value=''>
                  <em>Pilih Transaksi</em>
                </MenuItem>
                {transaksiData.map(transaksi => (
                  <MenuItem key={transaksi.transaction_id} value={transaksi.transaction_id}>
                    ID: {transaksi.transaction_id} - {formatCurrency(transaksi.pokok_pembiayaan)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
      
      {selectedTransaksi && selectedTransaksiDetails && (
        <>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant='h6' sx={{ mb: 4 }}>
                  Informasi Transaksi
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary'>
                    ID Transaksi
                  </Typography>
                  <Typography variant='body1' fontWeight='medium'>
                    {selectedTransaksiDetails.transaction_id}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary'>
                    Pokok Pembiayaan
                  </Typography>
                  <Typography variant='body1' fontWeight='medium'>
                    {formatCurrency(selectedTransaksiDetails.pokok_pembiayaan)}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary'>
                    Status Transaksi
                  </Typography>
                  <Chip 
                    label={selectedTransaksiDetails.status_transaksi} 
                    color={selectedTransaksiDetails.status_transaksi === 'aktif' ? 'success' : 
                           selectedTransaksiDetails.status_transaksi === 'lunas' ? 'info' : 'error'}
                    size='small'
                  />
                </Box>
                
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Kolektibilitas Terkini
                  </Typography>
                  <Chip 
                    label={`Kol-${selectedTransaksiDetails.kolektibilitas_terkini}`} 
                    color={selectedTransaksiDetails.kolektibilitas_terkini <= 2 ? 'success' : 
                           selectedTransaksiDetails.kolektibilitas_terkini === 3 ? 'warning' : 'error'}
                    size='small'
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant='h6'>Hasil Simulasi</Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                      variant='outlined' 
                      color='warning'
                      onClick={handleStressTest}
                      startIcon={<i className='ri-arrow-up-line' />}
                    >
                      Stress Test
                    </Button>
                    <Button 
                      variant='outlined' 
                      color='success'
                      onClick={handleOptimisticTest}
                      startIcon={<i className='ri-arrow-down-line' />}
                    >
                      Optimistic
                    </Button>
                    <Button 
                      variant='outlined' 
                      color='secondary'
                      onClick={handleResetSimulation}
                      startIcon={<i className='ri-refresh-line' />}
                    >
                      Reset
                    </Button>
                  </Box>
                </Box>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 3,
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1
                    }}>
                      <Typography variant='h6' sx={{ mb: 1 }}>
                        Loss Given Default (LGD)
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        border: `8px solid`,
                        borderColor: theme => theme.palette[getLGDColor(lgdResult)].main,
                        mb: 2
                      }}>
                        <Typography variant='h3'>
                          {(lgdResult * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                      
                      <Chip 
                        label={lgdResult <= 0.2 ? 'Risiko Rendah' : lgdResult <= 0.5 ? 'Risiko Sedang' : 'Risiko Tinggi'}
                        color={getLGDColor(lgdResult)}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      height: '100%'
                    }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant='body2' color='text.secondary'>
                          Total Nilai Agunan
                        </Typography>
                        <Typography variant='h6'>
                          {formatCurrency(simulatedAgunan.reduce((sum, item) => sum + item.nilai_pasar_kini, 0))}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant='body2' color='text.secondary'>
                          Total Recovery Value
                        </Typography>
                        <Typography variant='h6'>
                          {formatCurrency(totalRecoveryValue)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant='body2' color='text.secondary'>
                          Outstanding Pokok
                        </Typography>
                        <Typography variant='h6'>
                          {formatCurrency(selectedTransaksiDetails.pokok_pembiayaan)}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant='body2' color='text.secondary'>
                          Coverage Ratio
                        </Typography>
                        <Typography variant='h6'>
                          {(Math.min(totalRecoveryValue / selectedTransaksiDetails.pokok_pembiayaan, 1) * 100).toFixed(2)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    label='Nama Skenario'
                    value={scenarioName}
                    onChange={handleScenarioNameChange}
                    size='small'
                    sx={{ width: 200 }}
                  />
                  <Button 
                    variant='contained' 
                    color='primary'
                    onClick={handleAddScenario}
                    startIcon={<i className='ri-save-line' />}
                  >
                    Simpan Skenario
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h6' sx={{ mb: 4 }}>
                  Simulasi Haircut Agunan
                </Typography>
                
                {simulatedAgunan.length > 0 ? (
                  <TableContainer component={Paper} variant='outlined'>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Jenis Agunan</TableCell>
                          <TableCell>Nilai Pasar Kini</TableCell>
                          <TableCell>Haircut (%)</TableCell>
                          <TableCell>Recovery Value</TableCell>
                          <TableCell>Keterangan</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {simulatedAgunan.map(agunan => (
                          <TableRow key={agunan.agunan_id}>
                            <TableCell>
                              <Chip 
                                label={agunan.jenis_agunan} 
                                color={getAgunanColor(agunan.jenis_agunan)}
                                size='small'
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                type='number'
                                value={agunan.nilai_pasar_kini}
                                onChange={(e) => handleMarketValueChange(agunan.agunan_id, parseFloat(e.target.value) || 0)}
                                size='small'
                                InputProps={{
                                  startAdornment: <span style={{ marginRight: 8 }}>Rp</span>
                                }}
                                sx={{ width: 200 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ width: 200 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant='caption'>{agunan.haircut_persen}%</Typography>
                                </Box>
                                <Slider
                                  value={agunan.haircut_persen}
                                  onChange={(_, value) => handleHaircutChange(agunan.agunan_id, value as number)}
                                  min={0}
                                  max={100}
                                  step={1}
                                  color={
                                    agunan.haircut_persen <= 30 ? 'success' :
                                    agunan.haircut_persen <= 60 ? 'warning' : 'error'
                                  }
                                />
                              </Box>
                            </TableCell>
                            <TableCell>
                              {formatCurrency(agunan.nilai_pasar_kini * (1 - (agunan.haircut_persen / 100)))}
                            </TableCell>
                            <TableCell>{agunan.keterangan}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2} align='right'>
                            <Typography variant='subtitle2'>Total</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant='subtitle2'>
                              {(simulatedAgunan.reduce((sum, item) => sum + item.haircut_persen, 0) / simulatedAgunan.length).toFixed(2)}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant='subtitle2'>
                              {formatCurrency(totalRecoveryValue)}
                            </Typography>
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity='info'>
                    Tidak ada data agunan untuk transaksi ini.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {scenarios.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant='h6' sx={{ mb: 4 }}>
                    Perbandingan Skenario
                  </Typography>
                  
                  <TableContainer component={Paper} variant='outlined'>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nama Skenario</TableCell>
                          <TableCell>Recovery Value</TableCell>
                          <TableCell>LGD</TableCell>
                          <TableCell>Coverage Ratio</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {scenarios.map((scenario, index) => (
                          <TableRow key={index}>
                            <TableCell>{scenario.name}</TableCell>
                            <TableCell>{formatCurrency(scenario.recoveryValue)}</TableCell>
                            <TableCell>
                              <Chip 
                                label={`${(scenario.lgdResult * 100).toFixed(2)}%`} 
                                color={getLGDColor(scenario.lgdResult)}
                                size='small'
                              />
                            </TableCell>
                            <TableCell>
                              {(Math.min(scenario.recoveryValue / selectedTransaksiDetails.pokok_pembiayaan, 1) * 100).toFixed(2)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          )}
        </>
      )}
    </Grid>
  )
}

export default RecoverySimulator
