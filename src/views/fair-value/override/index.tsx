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
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

// Type Imports
import type { TransaksiSyariah } from '@/data/master/transaksiData'
import type { FairValueCalculation } from '@/data/fair-value/fairValueData'

// Helper Imports
import { formatCurrency } from '@/data/master/transaksiData'

// Components
import FairValueSummary from '../calculator/FairValueSummary'

interface ManualOverrideProps {
  transaksiData: TransaksiSyariah[]
  fairValueData: FairValueCalculation[]
}

const ManualOverride = ({ transaksiData, fairValueData }: ManualOverrideProps) => {
  // States
  const [selectedTransaksi, setSelectedTransaksi] = useState<number | ''>('')
  const [manualFairValue, setManualFairValue] = useState<number>(0)
  const [overrideReason, setOverrideReason] = useState<string>('')
  const [approvalRequired, setApprovalRequired] = useState<boolean>(true)
  const [fairValueResult, setFairValueResult] = useState<{
    nilai_tercatat: number
    nilai_wajar: number
    selisih_nilai: number
  } | null>(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)
  const [overrideHistory, setOverrideHistory] = useState<{
    transaction_id: number
    tanggal: string
    nilai_tercatat: number
    nilai_wajar_original: number
    nilai_wajar_override: number
    selisih: number
    alasan: string
    status: 'Pending' | 'Approved' | 'Rejected'
  }[]>([])
  
  // Get transaction details
  const selectedTransaksiDetails = transaksiData.find(t => t.transaction_id === selectedTransaksi)
  
  // Get existing fair value calculation
  const existingCalculation = fairValueData.find(fv => fv.transaction_id === selectedTransaksi)
  
  // Effect to load transaction data
  useEffect(() => {
    if (selectedTransaksi && selectedTransaksiDetails && existingCalculation) {
      // Set manual fair value to existing fair value
      setManualFairValue(existingCalculation.nilai_wajar)
      
      // Set fair value result
      setFairValueResult({
        nilai_tercatat: existingCalculation.nilai_tercatat,
        nilai_wajar: existingCalculation.nilai_wajar,
        selisih_nilai: existingCalculation.selisih_nilai
      })
      
      // Check if there's an override history for this transaction
      const history = overrideHistory.find(h => h.transaction_id === selectedTransaksi)
      if (history) {
        setManualFairValue(history.nilai_wajar_override)
        setOverrideReason(history.alasan)
      }
    } else {
      // Reset form
      setManualFairValue(0)
      setOverrideReason('')
      setFairValueResult(null)
    }
  }, [selectedTransaksi, selectedTransaksiDetails, existingCalculation, overrideHistory])
  
  // Handlers
  const handleTransaksiChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTransaksi(event.target.value as number)
  }
  
  const handleManualFairValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManualFairValue(parseFloat(event.target.value))
    
    // Update fair value result
    if (selectedTransaksiDetails) {
      const nilai_tercatat = selectedTransaksiDetails.pokok_pembiayaan
      setFairValueResult({
        nilai_tercatat,
        nilai_wajar: parseFloat(event.target.value),
        selisih_nilai: parseFloat(event.target.value) - nilai_tercatat
      })
    }
  }
  
  const handleOverrideReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOverrideReason(event.target.value)
  }
  
  const handleApprovalRequiredChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApprovalRequired(event.target.checked)
  }
  
  const handleConfirmDialogOpen = () => {
    setOpenConfirmDialog(true)
  }
  
  const handleConfirmDialogClose = () => {
    setOpenConfirmDialog(false)
  }
  
  const handleSaveOverride = () => {
    if (!selectedTransaksiDetails || !fairValueResult) return
    
    // In a real app, this would be an API call
    console.log('Saving manual override:', {
      transaction_id: selectedTransaksi,
      nilai_tercatat: fairValueResult.nilai_tercatat,
      nilai_wajar_original: existingCalculation ? existingCalculation.nilai_wajar : fairValueResult.nilai_tercatat,
      nilai_wajar_override: manualFairValue,
      selisih: manualFairValue - fairValueResult.nilai_tercatat,
      alasan: overrideReason,
      status: approvalRequired ? 'Pending' : 'Approved'
    })
    
    // Add to override history
    const newHistory = {
      transaction_id: selectedTransaksi as number,
      tanggal: new Date().toISOString().split('T')[0],
      nilai_tercatat: fairValueResult.nilai_tercatat,
      nilai_wajar_original: existingCalculation ? existingCalculation.nilai_wajar : fairValueResult.nilai_tercatat,
      nilai_wajar_override: manualFairValue,
      selisih: manualFairValue - fairValueResult.nilai_tercatat,
      alasan: overrideReason,
      status: approvalRequired ? 'Pending' : 'Approved' as 'Pending' | 'Approved' | 'Rejected'
    }
    
    setOverrideHistory([...overrideHistory, newHistory])
    
    // Close dialog
    setOpenConfirmDialog(false)
    
    // Show success message
    alert('Manual override berhasil disimpan!')
  }
  
  // Get status color
  const getStatusColor = (status: 'Pending' | 'Approved' | 'Rejected'): 'warning' | 'success' | 'error' => {
    switch (status) {
      case 'Pending':
        return 'warning'
      case 'Approved':
        return 'success'
      case 'Rejected':
        return 'error'
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Manual Override</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Override manual untuk nilai wajar (fair value) instrumen keuangan syariah
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
                        Nilai Wajar (Perhitungan Awal)
                      </Typography>
                      <Typography variant='body1' fontWeight='medium'>
                        {formatCurrency(existingCalculation.nilai_wajar)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant='body2' color='text.secondary'>
                        Selisih Nilai (Perhitungan Awal)
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
                        Metode Perhitungan Awal
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
                  Manual Override
                </Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <TextField
                      label='Nilai Wajar Manual'
                      type='number'
                      fullWidth
                      value={manualFairValue}
                      onChange={handleManualFairValueChange}
                      InputProps={{
                        startAdornment: <span style={{ marginRight: 8 }}>Rp</span>
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label='Alasan Override'
                      multiline
                      rows={4}
                      fullWidth
                      value={overrideReason}
                      onChange={handleOverrideReasonChange}
                      placeholder='Jelaskan alasan melakukan override nilai wajar...'
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={approvalRequired}
                          onChange={handleApprovalRequiredChange}
                          color='primary'
                        />
                      }
                      label="Memerlukan Persetujuan"
                    />
                    <Typography variant='caption' color='text.secondary' display='block'>
                      {approvalRequired 
                        ? 'Override akan disimpan dengan status Pending dan memerlukan persetujuan dari pihak berwenang.' 
                        : 'Override akan langsung disetujui dan diterapkan.'}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 4 }}>
                  <Button 
                    variant='contained' 
                    color='primary'
                    onClick={handleConfirmDialogOpen}
                    startIcon={<i className='ri-save-line' />}
                    disabled={!manualFairValue || !overrideReason}
                  >
                    Simpan Override
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {fairValueResult && (
            <Grid item xs={12}>
              <FairValueSummary 
                nilai_tercatat={fairValueResult.nilai_tercatat}
                nilai_wajar={fairValueResult.nilai_wajar}
                selisih_nilai={fairValueResult.selisih_nilai}
                metode_perhitungan='Manual Override'
              />
            </Grid>
          )}
          
          {overrideHistory.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant='h6' sx={{ mb: 4 }}>
                    Riwayat Override
                  </Typography>
                  
                  <TableContainer component={Paper} variant='outlined'>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Transaksi ID</TableCell>
                          <TableCell>Tanggal</TableCell>
                          <TableCell>Nilai Tercatat</TableCell>
                          <TableCell>Nilai Wajar Awal</TableCell>
                          <TableCell>Nilai Wajar Override</TableCell>
                          <TableCell>Selisih</TableCell>
                          <TableCell>Alasan</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {overrideHistory.map((history, index) => (
                          <TableRow key={index}>
                            <TableCell>{history.transaction_id}</TableCell>
                            <TableCell>{new Date(history.tanggal).toLocaleDateString('id-ID')}</TableCell>
                            <TableCell>{formatCurrency(history.nilai_tercatat)}</TableCell>
                            <TableCell>{formatCurrency(history.nilai_wajar_original)}</TableCell>
                            <TableCell>{formatCurrency(history.nilai_wajar_override)}</TableCell>
                            <TableCell>
                              <Typography 
                                color={history.selisih >= 0 ? 'success.main' : 'error.main'}
                              >
                                {formatCurrency(history.selisih)}
                              </Typography>
                            </TableCell>
                            <TableCell>{history.alasan}</TableCell>
                            <TableCell>
                              <Chip 
                                label={history.status} 
                                color={getStatusColor(history.status)}
                                size='small'
                              />
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
      
      {/* Confirm Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleConfirmDialogClose} maxWidth='sm' fullWidth>
        <DialogTitle>
          Konfirmasi Override
          <IconButton
            aria-label='close'
            onClick={handleConfirmDialogClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <i className='ri-close-line' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant='body1' paragraph>
            Anda akan melakukan override nilai wajar untuk transaksi ini. Detail override:
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant='body2' color='text.secondary'>
              Transaksi ID
            </Typography>
            <Typography variant='body1' fontWeight='medium'>
              {selectedTransaksi}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant='body2' color='text.secondary'>
              Nilai Wajar Awal
            </Typography>
            <Typography variant='body1' fontWeight='medium'>
              {existingCalculation ? formatCurrency(existingCalculation.nilai_wajar) : 'N/A'}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant='body2' color='text.secondary'>
              Nilai Wajar Override
            </Typography>
            <Typography variant='body1' fontWeight='medium'>
              {formatCurrency(manualFairValue)}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant='body2' color='text.secondary'>
              Selisih
            </Typography>
            <Typography 
              variant='body1' 
              fontWeight='medium'
              color={existingCalculation && (manualFairValue - existingCalculation.nilai_wajar) >= 0 ? 'success.main' : 'error.main'}
            >
              {existingCalculation ? formatCurrency(manualFairValue - existingCalculation.nilai_wajar) : 'N/A'}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Status
            </Typography>
            <Typography variant='body1' fontWeight='medium'>
              {approvalRequired ? 'Pending (Memerlukan Persetujuan)' : 'Approved (Langsung Diterapkan)'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose}>Batal</Button>
          <Button 
            variant='contained' 
            color='primary'
            onClick={handleSaveOverride}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default ManualOverride
