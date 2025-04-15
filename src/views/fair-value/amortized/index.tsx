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
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'

// Type Imports
import type { TransaksiSyariah } from '@/data/master/transaksiData'
import type { FairValueCalculation } from '@/data/fair-value/fairValueData'
import type { CashFlow } from '@/data/fair-value/fairValueData'

// Helper Imports
import { formatCurrency } from '@/data/master/transaksiData'
import { getCashFlowsByCalculationId } from '@/data/fair-value/cashFlowData'

interface AmortizationSchedule {
  periode: number
  tanggal: string
  saldo_awal: number
  pembayaran: number
  pendapatan_efektif: number
  pendapatan_kontraktual: number
  amortisasi: number
  saldo_akhir: number
}

interface AmortizedCostProps {
  transaksiData: TransaksiSyariah[]
  fairValueData: FairValueCalculation[]
  cashFlowData: CashFlow[]
}

const AmortizedCost = ({ transaksiData, fairValueData, cashFlowData }: AmortizedCostProps) => {
  // States
  const [selectedTransaksi, setSelectedTransaksi] = useState<number | ''>('')
  const [effectiveRate, setEffectiveRate] = useState<number>(0.12)
  const [contractualRate, setContractualRate] = useState<number>(0.10)
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationSchedule[]>([])
  const [selectedTab, setSelectedTab] = useState<number>(0)
  
  // Get transaction details
  const selectedTransaksiDetails = transaksiData.find(t => t.transaction_id === selectedTransaksi)
  
  // Get existing fair value calculation
  const existingCalculation = fairValueData.find(fv => fv.transaction_id === selectedTransaksi)
  
  // Effect to load transaction data
  useEffect(() => {
    if (selectedTransaksi && selectedTransaksiDetails && existingCalculation) {
      // Set effective rate based on fair value calculation
      setEffectiveRate(existingCalculation.discount_rate)
      
      // Set contractual rate (in a real app, this would come from the transaction data)
      setContractualRate(0.10) // Default value for demo
      
      // Get cash flows
      const flows = getCashFlowsByCalculationId(existingCalculation.calculation_id)
      
      if (flows.length > 0) {
        // Generate amortization schedule
        generateAmortizationSchedule(
          existingCalculation.nilai_wajar,
          flows,
          existingCalculation.discount_rate,
          0.10 // Contractual rate
        )
      }
    } else {
      // Reset form
      setEffectiveRate(0.12)
      setContractualRate(0.10)
      setAmortizationSchedule([])
    }
  }, [selectedTransaksi, selectedTransaksiDetails, existingCalculation])
  
  // Handlers
  const handleTransaksiChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTransaksi(event.target.value as number)
  }
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }
  
  const handleEffectiveRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEffectiveRate(parseFloat(event.target.value) / 100)
  }
  
  const handleContractualRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContractualRate(parseFloat(event.target.value) / 100)
  }
  
  const handleGenerateSchedule = () => {
    if (!selectedTransaksiDetails || !existingCalculation) return
    
    // Get cash flows
    const flows = getCashFlowsByCalculationId(existingCalculation.calculation_id)
    
    if (flows.length > 0) {
      // Generate amortization schedule
      generateAmortizationSchedule(
        existingCalculation.nilai_wajar,
        flows,
        effectiveRate,
        contractualRate
      )
    } else {
      // If no cash flows, generate a simple amortization schedule
      const tenor = 24 // Default tenor
      const initialBalance = existingCalculation.nilai_wajar
      const monthlyPayment = initialBalance / tenor
      
      generateSimpleAmortizationSchedule(
        initialBalance,
        monthlyPayment,
        tenor,
        effectiveRate,
        contractualRate
      )
    }
  }
  
  // Generate amortization schedule based on cash flows
  const generateAmortizationSchedule = (
    initialBalance: number,
    cashFlows: CashFlow[],
    effectiveRate: number,
    contractualRate: number
  ) => {
    const schedule: AmortizationSchedule[] = []
    let currentBalance = initialBalance
    
    // Sort cash flows by period
    const sortedFlows = [...cashFlows].sort((a, b) => a.periode - b.periode)
    
    for (let i = 0; i < sortedFlows.length; i++) {
      const flow = sortedFlows[i]
      const monthlyEffectiveRate = effectiveRate / 12
      const monthlyContractualRate = contractualRate / 12
      
      // Calculate effective income
      const effectiveIncome = currentBalance * monthlyEffectiveRate
      
      // Calculate contractual income
      const contractualIncome = initialBalance * monthlyContractualRate
      
      // Calculate amortization
      const amortization = effectiveIncome - contractualIncome
      
      // Calculate ending balance
      const endingBalance = currentBalance - flow.nominal + effectiveIncome
      
      schedule.push({
        periode: flow.periode,
        tanggal: flow.tanggal,
        saldo_awal: currentBalance,
        pembayaran: flow.nominal,
        pendapatan_efektif: effectiveIncome,
        pendapatan_kontraktual: contractualIncome,
        amortisasi: amortization,
        saldo_akhir: endingBalance
      })
      
      // Update current balance for next period
      currentBalance = endingBalance
    }
    
    setAmortizationSchedule(schedule)
  }
  
  // Generate simple amortization schedule
  const generateSimpleAmortizationSchedule = (
    initialBalance: number,
    monthlyPayment: number,
    tenor: number,
    effectiveRate: number,
    contractualRate: number
  ) => {
    const schedule: AmortizationSchedule[] = []
    let currentBalance = initialBalance
    
    for (let i = 1; i <= tenor; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() + i)
      
      const monthlyEffectiveRate = effectiveRate / 12
      const monthlyContractualRate = contractualRate / 12
      
      // Calculate effective income
      const effectiveIncome = currentBalance * monthlyEffectiveRate
      
      // Calculate contractual income
      const contractualIncome = initialBalance * monthlyContractualRate
      
      // Calculate amortization
      const amortization = effectiveIncome - contractualIncome
      
      // Calculate ending balance
      const endingBalance = currentBalance - monthlyPayment + effectiveIncome
      
      schedule.push({
        periode: i,
        tanggal: date.toISOString().split('T')[0],
        saldo_awal: currentBalance,
        pembayaran: monthlyPayment,
        pendapatan_efektif: effectiveIncome,
        pendapatan_kontraktual: contractualIncome,
        amortisasi: amortization,
        saldo_akhir: endingBalance
      })
      
      // Update current balance for next period
      currentBalance = endingBalance
    }
    
    setAmortizationSchedule(schedule)
  }
  
  // Calculate totals
  const totalEffectiveIncome = amortizationSchedule.reduce((sum, item) => sum + item.pendapatan_efektif, 0)
  const totalContractualIncome = amortizationSchedule.reduce((sum, item) => sum + item.pendapatan_kontraktual, 0)
  const totalAmortization = amortizationSchedule.reduce((sum, item) => sum + item.amortisasi, 0)
  const totalPayments = amortizationSchedule.reduce((sum, item) => sum + item.pembayaran, 0)
  
  // Render amortization schedule table
  const renderAmortizationTable = () => {
    if (amortizationSchedule.length === 0) {
      return (
        <Alert severity='info' sx={{ mt: 2 }}>
          Belum ada jadwal amortisasi. Silakan pilih transaksi dan klik tombol "Generate Jadwal".
        </Alert>
      )
    }
    
    return (
      <TableContainer component={Paper} variant='outlined'>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Periode</TableCell>
              <TableCell>Tanggal</TableCell>
              <TableCell>Saldo Awal</TableCell>
              <TableCell>Pembayaran</TableCell>
              <TableCell>Pendapatan Efektif</TableCell>
              <TableCell>Pendapatan Kontraktual</TableCell>
              <TableCell>Amortisasi</TableCell>
              <TableCell>Saldo Akhir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {amortizationSchedule.map(item => (
              <TableRow key={item.periode}>
                <TableCell>{item.periode}</TableCell>
                <TableCell>{new Date(item.tanggal).toLocaleDateString('id-ID')}</TableCell>
                <TableCell>{formatCurrency(item.saldo_awal)}</TableCell>
                <TableCell>{formatCurrency(item.pembayaran)}</TableCell>
                <TableCell>{formatCurrency(item.pendapatan_efektif)}</TableCell>
                <TableCell>{formatCurrency(item.pendapatan_kontraktual)}</TableCell>
                <TableCell>
                  <Typography 
                    color={item.amortisasi >= 0 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(item.amortisasi)}
                  </Typography>
                </TableCell>
                <TableCell>{formatCurrency(item.saldo_akhir)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align='right'>
                <Typography variant='subtitle2'>Total</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='subtitle2'>
                  {formatCurrency(totalPayments)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='subtitle2'>
                  {formatCurrency(totalEffectiveIncome)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='subtitle2'>
                  {formatCurrency(totalContractualIncome)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='subtitle2' color={totalAmortization >= 0 ? 'success.main' : 'error.main'}>
                  {formatCurrency(totalAmortization)}
                </Typography>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
  
  // Render amortization summary
  const renderAmortizationSummary = () => {
    if (amortizationSchedule.length === 0) {
      return (
        <Alert severity='info' sx={{ mt: 2 }}>
          Belum ada jadwal amortisasi. Silakan pilih transaksi dan klik tombol "Generate Jadwal".
        </Alert>
      )
    }
    
    return (
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Ringkasan Amortisasi
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Suku Bunga Efektif:</Typography>
                  <Typography variant='body2' fontWeight='medium'>
                    {(effectiveRate * 100).toFixed(2)}%
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Suku Bunga Kontraktual:</Typography>
                  <Typography variant='body2' fontWeight='medium'>
                    {(contractualRate * 100).toFixed(2)}%
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Selisih Suku Bunga:</Typography>
                  <Typography 
                    variant='body2' 
                    fontWeight='medium'
                    color={(effectiveRate - contractualRate) >= 0 ? 'success.main' : 'error.main'}
                  >
                    {((effectiveRate - contractualRate) * 100).toFixed(2)}%
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Total Pembayaran:</Typography>
                  <Typography variant='body2' fontWeight='medium'>
                    {formatCurrency(totalPayments)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Total Pendapatan Efektif:</Typography>
                  <Typography variant='body2' fontWeight='medium'>
                    {formatCurrency(totalEffectiveIncome)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Total Pendapatan Kontraktual:</Typography>
                  <Typography variant='body2' fontWeight='medium'>
                    {formatCurrency(totalContractualIncome)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Total Amortisasi:</Typography>
                  <Typography 
                    variant='body2' 
                    fontWeight='medium'
                    color={totalAmortization >= 0 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(totalAmortization)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Implikasi Akuntansi
              </Typography>
              
              <Typography variant='body2' paragraph>
                Berdasarkan PSAK 71 dan PSAK 413, instrumen keuangan syariah harus diukur dengan biaya perolehan diamortisasi (amortized cost) menggunakan metode suku bunga efektif.
              </Typography>
              
              <Typography variant='body2' paragraph>
                {totalAmortization >= 0 
                  ? `Terdapat selisih positif (premium) sebesar ${formatCurrency(totalAmortization)} yang perlu diamortisasi selama tenor pembiayaan.`
                  : `Terdapat selisih negatif (discount) sebesar ${formatCurrency(Math.abs(totalAmortization))} yang perlu diamortisasi selama tenor pembiayaan.`}
              </Typography>
              
              <Typography variant='body2'>
                {totalAmortization >= 0 
                  ? 'Premium ini akan mengurangi pendapatan efektif yang diakui dalam laporan laba rugi.'
                  : 'Discount ini akan menambah pendapatan efektif yang diakui dalam laporan laba rugi.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Amortized Cost</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Perhitungan biaya perolehan diamortisasi (amortized cost) untuk instrumen keuangan syariah
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
                
                {existingCalculation && (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant='body2' color='text.secondary'>
                        Nilai Wajar
                      </Typography>
                      <Typography variant='body1' fontWeight='medium'>
                        {formatCurrency(existingCalculation.nilai_wajar)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant='body2' color='text.secondary'>
                        Selisih Nilai
                      </Typography>
                      <Typography 
                        variant='body1' 
                        fontWeight='medium'
                        color={existingCalculation.selisih_nilai >= 0 ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency(existingCalculation.selisih_nilai)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant='body2' color='text.secondary'>
                        Metode Perhitungan
                      </Typography>
                      <Chip 
                        label={existingCalculation.metode_perhitungan} 
                        color='primary'
                        size='small'
                      />
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant='h6' sx={{ mb: 4 }}>
                  Parameter Amortisasi
                </Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label='Suku Bunga Efektif (%)'
                      type='number'
                      fullWidth
                      value={effectiveRate * 100}
                      onChange={handleEffectiveRateChange}
                      InputProps={{
                        endAdornment: <span style={{ marginLeft: 8 }}>%</span>
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label='Suku Bunga Kontraktual (%)'
                      type='number'
                      fullWidth
                      value={contractualRate * 100}
                      onChange={handleContractualRateChange}
                      InputProps={{
                        endAdornment: <span style={{ marginLeft: 8 }}>%</span>
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 4 }}>
                  <Button 
                    variant='contained' 
                    color='primary'
                    onClick={handleGenerateSchedule}
                    startIcon={<i className='ri-calendar-line' />}
                  >
                    Generate Jadwal
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 4 }}>
                  <Tab label='Jadwal Amortisasi' />
                  <Tab label='Ringkasan' />
                </Tabs>
                
                {selectedTab === 0 && renderAmortizationTable()}
                {selectedTab === 1 && renderAmortizationSummary()}
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default AmortizedCost
