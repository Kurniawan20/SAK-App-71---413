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
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'

// Type Imports
import type { TransaksiSyariah } from '@/data/master/transaksiData'
import type { FairValueCalculation, MetodePerhitungan, CashFlow } from '@/data/fair-value/fairValueData'

// Helper Imports
import { formatCurrency } from '@/data/master/transaksiData'
import { calculatePresentValue, calculateFairValueDCF } from '@/data/fair-value/fairValueData'
import { getCashFlowsByCalculationId } from '@/data/fair-value/cashFlowData'

// Components
import FairValueSummary from './FairValueSummary'

interface FairValueCalculatorProps {
  transaksiData: TransaksiSyariah[]
  fairValueData: FairValueCalculation[]
  cashFlowData: CashFlow[]
}

const FairValueCalculator = ({ transaksiData, fairValueData, cashFlowData }: FairValueCalculatorProps) => {
  // States
  const [selectedTransaksi, setSelectedTransaksi] = useState<number | ''>('')
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [calculationMethod, setCalculationMethod] = useState<MetodePerhitungan>('DCF')
  const [discountRate, setDiscountRate] = useState<number>(0.12)
  const [cashFlows, setCashFlows] = useState<{ periode: number; tanggal: string; nominal: number; present_value: number }[]>([])
  const [fairValueResult, setFairValueResult] = useState<{
    nilai_tercatat: number
    nilai_wajar: number
    selisih_nilai: number
  } | null>(null)
  const [openAddCashFlowDialog, setOpenAddCashFlowDialog] = useState<boolean>(false)
  const [newCashFlow, setNewCashFlow] = useState<{
    periode: number
    tanggal: string
    nominal: number
  }>({
    periode: 1,
    tanggal: new Date().toISOString().split('T')[0],
    nominal: 0
  })
  
  // Get transaction details
  const selectedTransaksiDetails = transaksiData.find(t => t.transaction_id === selectedTransaksi)
  
  // Get existing fair value calculation
  const existingCalculation = fairValueData.find(fv => fv.transaction_id === selectedTransaksi)
  
  // Effect to load existing calculation data
  useEffect(() => {
    if (selectedTransaksi && existingCalculation) {
      setCalculationMethod(existingCalculation.metode_perhitungan)
      setDiscountRate(existingCalculation.discount_rate)
      
      // Load cash flows if method is DCF
      if (existingCalculation.metode_perhitungan === 'DCF') {
        const flows = getCashFlowsByCalculationId(existingCalculation.calculation_id)
        setCashFlows(flows)
      } else {
        setCashFlows([])
      }
      
      // Set fair value result
      setFairValueResult({
        nilai_tercatat: existingCalculation.nilai_tercatat,
        nilai_wajar: existingCalculation.nilai_wajar,
        selisih_nilai: existingCalculation.selisih_nilai
      })
    } else {
      // Reset form if no transaction selected or no existing calculation
      setCalculationMethod('DCF')
      setDiscountRate(0.12)
      setCashFlows([])
      setFairValueResult(null)
      
      // If transaction selected but no existing calculation, initialize with transaction data
      if (selectedTransaksi && selectedTransaksiDetails) {
        // Initialize with transaction data
        const nilai_tercatat = selectedTransaksiDetails.pokok_pembiayaan
        
        // Generate sample cash flows for DCF
        const sampleFlows = []
        const monthlyPayment = nilai_tercatat / 24 // Assume 24 months tenor
        
        for (let i = 1; i <= 24; i++) {
          const date = new Date()
          date.setMonth(date.getMonth() + i)
          
          sampleFlows.push({
            periode: i,
            tanggal: date.toISOString().split('T')[0],
            nominal: monthlyPayment,
            present_value: calculatePresentValue(monthlyPayment, discountRate, i / 12)
          })
        }
        
        setCashFlows(sampleFlows)
      }
    }
  }, [selectedTransaksi, existingCalculation, selectedTransaksiDetails, discountRate])
  
  // Handlers
  const handleTransaksiChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTransaksi(event.target.value as number)
  }
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }
  
  const handleCalculationMethodChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCalculationMethod(event.target.value as MetodePerhitungan)
  }
  
  const handleDiscountRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountRate(parseFloat(event.target.value))
  }
  
  const handleAddCashFlowDialogOpen = () => {
    setOpenAddCashFlowDialog(true)
    setNewCashFlow({
      periode: cashFlows.length + 1,
      tanggal: new Date().toISOString().split('T')[0],
      nominal: 0
    })
  }
  
  const handleAddCashFlowDialogClose = () => {
    setOpenAddCashFlowDialog(false)
  }
  
  const handleNewCashFlowChange = (field: string, value: any) => {
    setNewCashFlow({ ...newCashFlow, [field]: value })
  }
  
  const handleAddCashFlow = () => {
    const presentValue = calculatePresentValue(
      newCashFlow.nominal,
      discountRate,
      newCashFlow.periode / 12
    )
    
    const newFlow = {
      ...newCashFlow,
      present_value: presentValue
    }
    
    setCashFlows([...cashFlows, newFlow])
    setOpenAddCashFlowDialog(false)
  }
  
  const handleDeleteCashFlow = (periode: number) => {
    setCashFlows(cashFlows.filter(cf => cf.periode !== periode))
  }
  
  const handleCalculateFairValue = () => {
    if (!selectedTransaksiDetails) return
    
    let fairValue = 0
    const nilai_tercatat = selectedTransaksiDetails.pokok_pembiayaan
    
    if (calculationMethod === 'DCF') {
      // Calculate fair value using DCF method
      fairValue = calculateFairValueDCF(cashFlows, discountRate)
    } else if (calculationMethod === 'Market Comparison') {
      // For demo purposes, use a simple market comparison approach
      fairValue = nilai_tercatat * 0.95 // Assume 5% discount from carrying value
    } else if (calculationMethod === 'Income Approach') {
      // For demo purposes, use a simple income approach
      fairValue = nilai_tercatat * 0.97 // Assume 3% discount from carrying value
    } else if (calculationMethod === 'Manual Override') {
      // For manual override, use the carrying value as fair value
      fairValue = nilai_tercatat
    }
    
    // Set fair value result
    setFairValueResult({
      nilai_tercatat,
      nilai_wajar: fairValue,
      selisih_nilai: fairValue - nilai_tercatat
    })
  }
  
  const handleSaveFairValue = () => {
    if (!fairValueResult) return
    
    // In a real app, this would be an API call
    console.log('Saving fair value calculation:', {
      transaction_id: selectedTransaksi,
      metode_perhitungan: calculationMethod,
      nilai_tercatat: fairValueResult.nilai_tercatat,
      nilai_wajar: fairValueResult.nilai_wajar,
      selisih_nilai: fairValueResult.selisih_nilai,
      discount_rate: discountRate,
      tenor_sisa: cashFlows.length,
      tanggal_perhitungan: new Date().toISOString().split('T')[0],
      keterangan: `Perhitungan nilai wajar menggunakan metode ${calculationMethod}`
    })
    
    // Show success message
    alert('Perhitungan nilai wajar berhasil disimpan!')
  }
  
  // Recalculate present values when discount rate changes
  useEffect(() => {
    if (calculationMethod === 'DCF' && cashFlows.length > 0) {
      const updatedFlows = cashFlows.map(cf => ({
        ...cf,
        present_value: calculatePresentValue(cf.nominal, discountRate, cf.periode / 12)
      }))
      
      setCashFlows(updatedFlows)
    }
  }, [discountRate, calculationMethod])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Fair Value Calculator</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Perhitungan nilai wajar (fair value) untuk instrumen keuangan syariah
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
                    Nasabah ID
                  </Typography>
                  <Typography variant='body1' fontWeight='medium'>
                    {selectedTransaksiDetails.nasabah_id}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary'>
                    Akad ID
                  </Typography>
                  <Typography variant='body1' fontWeight='medium'>
                    {selectedTransaksiDetails.akad_id}
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
                <Typography variant='h6' sx={{ mb: 4 }}>
                  Metode Perhitungan
                </Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id='calculation-method-label'>Metode Perhitungan</InputLabel>
                      <Select
                        labelId='calculation-method-label'
                        value={calculationMethod}
                        label='Metode Perhitungan'
                        onChange={handleCalculationMethodChange}
                      >
                        <MenuItem value='DCF'>Discounted Cash Flow (DCF)</MenuItem>
                        <MenuItem value='Market Comparison'>Market Comparison</MenuItem>
                        <MenuItem value='Income Approach'>Income Approach</MenuItem>
                        <MenuItem value='Manual Override'>Manual Override</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {calculationMethod === 'DCF' && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        label='Discount Rate (%)'
                        type='number'
                        fullWidth
                        value={discountRate * 100}
                        onChange={(e) => setDiscountRate(parseFloat(e.target.value) / 100)}
                        InputProps={{
                          endAdornment: <span style={{ marginLeft: 8 }}>%</span>
                        }}
                      />
                    </Grid>
                  )}
                </Grid>
                
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                  <Button 
                    variant='contained' 
                    color='primary'
                    onClick={handleCalculateFairValue}
                    startIcon={<i className='ri-calculator-line' />}
                  >
                    Hitung Nilai Wajar
                  </Button>
                  
                  {fairValueResult && (
                    <Button 
                      variant='outlined' 
                      color='success'
                      onClick={handleSaveFairValue}
                      startIcon={<i className='ri-save-line' />}
                    >
                      Simpan Hasil
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {calculationMethod === 'DCF' && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant='h6'>Cash Flow Projection</Typography>
                    
                    <Button 
                      variant='outlined' 
                      color='primary'
                      onClick={handleAddCashFlowDialogOpen}
                      startIcon={<i className='ri-add-line' />}
                    >
                      Tambah Cash Flow
                    </Button>
                  </Box>
                  
                  {cashFlows.length > 0 ? (
                    <TableContainer component={Paper} variant='outlined'>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Periode</TableCell>
                            <TableCell>Tanggal</TableCell>
                            <TableCell>Nominal</TableCell>
                            <TableCell>Present Value</TableCell>
                            <TableCell>Aksi</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {cashFlows.map(cf => (
                            <TableRow key={cf.periode}>
                              <TableCell>{cf.periode}</TableCell>
                              <TableCell>{new Date(cf.tanggal).toLocaleDateString('id-ID')}</TableCell>
                              <TableCell>{formatCurrency(cf.nominal)}</TableCell>
                              <TableCell>{formatCurrency(cf.present_value)}</TableCell>
                              <TableCell>
                                <IconButton 
                                  size='small' 
                                  color='error'
                                  onClick={() => handleDeleteCashFlow(cf.periode)}
                                >
                                  <i className='ri-delete-bin-line' />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={2} align='right'>
                              <Typography variant='subtitle2'>Total</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant='subtitle2'>
                                {formatCurrency(cashFlows.reduce((sum, cf) => sum + cf.nominal, 0))}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant='subtitle2'>
                                {formatCurrency(cashFlows.reduce((sum, cf) => sum + cf.present_value, 0))}
                              </Typography>
                            </TableCell>
                            <TableCell />
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity='info'>
                      Belum ada data cash flow. Silakan tambahkan cash flow.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {fairValueResult && (
            <Grid item xs={12}>
              <FairValueSummary 
                nilai_tercatat={fairValueResult.nilai_tercatat}
                nilai_wajar={fairValueResult.nilai_wajar}
                selisih_nilai={fairValueResult.selisih_nilai}
                metode_perhitungan={calculationMethod}
              />
            </Grid>
          )}
        </>
      )}
      
      {/* Add Cash Flow Dialog */}
      <Dialog open={openAddCashFlowDialog} onClose={handleAddCashFlowDialogClose} maxWidth='sm' fullWidth>
        <DialogTitle>
          Tambah Cash Flow
          <IconButton
            aria-label='close'
            onClick={handleAddCashFlowDialogClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <i className='ri-close-line' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label='Periode'
                type='number'
                fullWidth
                value={newCashFlow.periode}
                onChange={(e) => handleNewCashFlowChange('periode', parseInt(e.target.value))}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label='Tanggal'
                type='date'
                fullWidth
                value={newCashFlow.tanggal}
                onChange={(e) => handleNewCashFlowChange('tanggal', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label='Nominal'
                type='number'
                fullWidth
                value={newCashFlow.nominal}
                onChange={(e) => handleNewCashFlowChange('nominal', parseFloat(e.target.value))}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>Rp</span>
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddCashFlowDialogClose}>Batal</Button>
          <Button 
            variant='contained' 
            color='primary'
            onClick={handleAddCashFlow}
            disabled={!newCashFlow.nominal}
          >
            Tambah
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default FairValueCalculator
