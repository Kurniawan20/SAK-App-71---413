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
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'

// Type Imports
import type { TransaksiSyariah } from '@/data/master/transaksiData'
import type { Agunan, JenisAgunan } from '@/data/lgd/agunanData'
import type { LGDCalculation } from '@/data/lgd/lgdData'

// Helper Imports
import { getDefaultHaircutPersen, calculateExpectedRecovery } from '@/data/lgd/agunanData'
import { calculateLGDPercentage } from '@/data/lgd/lgdData'
import { formatCurrency } from '@/data/master/transaksiData'

// Component Imports
import LGDSummaryCard from './LGDSummaryCard'

interface LGDInputPageProps {
  transaksiData: TransaksiSyariah[]
  agunanData: Agunan[]
  lgdData: LGDCalculation[]
}

const LGDInputPage = ({ transaksiData, agunanData, lgdData }: LGDInputPageProps) => {
  // States
  const [selectedTransaksi, setSelectedTransaksi] = useState<number | ''>('')
  const [filteredAgunan, setFilteredAgunan] = useState<Agunan[]>([])
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false)
  const [newAgunan, setNewAgunan] = useState<Partial<Agunan>>({
    transaction_id: '',
    jenis_agunan: 'Tanah',
    nilai_agunan_awal: 0,
    nilai_pasar_kini: 0,
    haircut_persen: 20,
    tanggal_penilaian: new Date().toISOString().split('T')[0],
    keterangan: ''
  })
  const [lgdSummary, setLgdSummary] = useState<{
    totalNilaiAgunan: number
    totalRecoveryValue: number
    outstandingPokok: number
    lgdPercentage: number
  }>({
    totalNilaiAgunan: 0,
    totalRecoveryValue: 0,
    outstandingPokok: 0,
    lgdPercentage: 0
  })
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [editAgunan, setEditAgunan] = useState<Agunan | null>(null)
  
  // Get transaction details
  const selectedTransaksiDetails = transaksiData.find(t => t.transaction_id === selectedTransaksi)
  
  // Filter agunan based on selected transaction
  useEffect(() => {
    if (selectedTransaksi) {
      const filtered = agunanData.filter(a => a.transaction_id === selectedTransaksi)
      setFilteredAgunan(filtered)
      
      // Calculate LGD summary
      if (selectedTransaksiDetails) {
        const totalNilaiAgunan = filtered.reduce((sum, item) => sum + item.nilai_pasar_kini, 0)
        const totalRecoveryValue = filtered.reduce((sum, item) => 
          sum + calculateExpectedRecovery(item), 0
        )
        const outstandingPokok = selectedTransaksiDetails.pokok_pembiayaan
        const lgdPercentage = calculateLGDPercentage(outstandingPokok, totalRecoveryValue)
        
        setLgdSummary({
          totalNilaiAgunan,
          totalRecoveryValue,
          outstandingPokok,
          lgdPercentage
        })
      }
    } else {
      setFilteredAgunan([])
      setLgdSummary({
        totalNilaiAgunan: 0,
        totalRecoveryValue: 0,
        outstandingPokok: 0,
        lgdPercentage: 0
      })
    }
  }, [selectedTransaksi, agunanData, selectedTransaksiDetails])
  
  // Handlers
  const handleTransaksiChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTransaksi(event.target.value as number)
    
    // Update new agunan with selected transaction
    setNewAgunan({
      ...newAgunan,
      transaction_id: event.target.value as number
    })
  }
  
  const handleAddDialogOpen = () => {
    setOpenAddDialog(true)
    setNewAgunan({
      ...newAgunan,
      transaction_id: selectedTransaksi,
      jenis_agunan: 'Tanah',
      nilai_agunan_awal: 0,
      nilai_pasar_kini: 0,
      haircut_persen: 20,
      tanggal_penilaian: new Date().toISOString().split('T')[0],
      keterangan: ''
    })
  }
  
  const handleAddDialogClose = () => {
    setOpenAddDialog(false)
  }
  
  const handleEditDialogOpen = (agunan: Agunan) => {
    setEditAgunan(agunan)
    setOpenEditDialog(true)
  }
  
  const handleEditDialogClose = () => {
    setOpenEditDialog(false)
    setEditAgunan(null)
  }
  
  const handleNewAgunanChange = (field: string, value: any) => {
    setNewAgunan({ ...newAgunan, [field]: value })
    
    // Auto-update haircut when jenis_agunan changes
    if (field === 'jenis_agunan') {
      setNewAgunan({
        ...newAgunan,
        [field]: value,
        haircut_persen: getDefaultHaircutPersen(value as JenisAgunan)
      })
    }
  }
  
  const handleEditAgunanChange = (field: string, value: any) => {
    if (!editAgunan) return
    
    setEditAgunan({ ...editAgunan, [field]: value })
    
    // Auto-update haircut when jenis_agunan changes
    if (field === 'jenis_agunan') {
      setEditAgunan({
        ...editAgunan,
        [field]: value,
        haircut_persen: getDefaultHaircutPersen(value as JenisAgunan)
      })
    }
  }
  
  const handleAddAgunan = () => {
    // In a real app, this would be an API call
    console.log('Adding new agunan:', newAgunan)
    
    // Show success message or update UI
    alert('Agunan added successfully!')
    setOpenAddDialog(false)
  }
  
  const handleUpdateAgunan = () => {
    if (!editAgunan) return
    
    // In a real app, this would be an API call
    console.log('Updating agunan:', editAgunan)
    
    // Show success message or update UI
    alert('Agunan updated successfully!')
    setOpenEditDialog(false)
    setEditAgunan(null)
  }
  
  const handleDeleteAgunan = (agunanId: number) => {
    // In a real app, this would be an API call
    console.log('Deleting agunan:', agunanId)
    
    // Show confirmation dialog in a real app
    if (window.confirm('Are you sure you want to delete this collateral?')) {
      // Show success message or update UI
      alert('Agunan deleted successfully!')
    }
  }
  
  const handleSaveLGD = () => {
    // In a real app, this would be an API call to save LGD calculation
    const lgdCalculation = {
      transaction_id: selectedTransaksi,
      tanggal_perhitungan: new Date().toISOString().split('T')[0],
      total_nilai_agunan: lgdSummary.totalNilaiAgunan,
      total_recovery_value: lgdSummary.totalRecoveryValue,
      outstanding_pokok: lgdSummary.outstandingPokok,
      lgd_percentage: lgdSummary.lgdPercentage,
      keterangan: 'LGD calculation based on current collateral values'
    }
    
    console.log('Saving LGD calculation:', lgdCalculation)
    
    // Show success message or update UI
    alert('LGD calculation saved successfully!')
  }
  
  // Get color based on LGD percentage
  const getLGDColor = (lgdPercentage: number) => {
    if (lgdPercentage <= 0.2) return 'success'
    if (lgdPercentage <= 0.5) return 'warning'
    return 'error'
  }
  
  // Get color based on collateral type
  const getAgunanColor = (jenisAgunan: JenisAgunan) => {
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
        <Typography variant='h4'>Input Agunan</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Input data agunan untuk perhitungan Loss Given Default (LGD)
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
          <Grid item xs={12}>
            <LGDSummaryCard 
              totalNilaiAgunan={lgdSummary.totalNilaiAgunan}
              totalRecoveryValue={lgdSummary.totalRecoveryValue}
              outstandingPokok={lgdSummary.outstandingPokok}
              lgdPercentage={lgdSummary.lgdPercentage}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant='h6'>Daftar Agunan</Typography>
                  <Button 
                    variant='contained' 
                    color='primary'
                    onClick={handleAddDialogOpen}
                    startIcon={<i className='ri-add-line' />}
                  >
                    Tambah Agunan
                  </Button>
                </Box>
                
                {filteredAgunan.length > 0 ? (
                  <TableContainer component={Paper} variant='outlined'>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Jenis Agunan</TableCell>
                          <TableCell>Nilai Awal</TableCell>
                          <TableCell>Nilai Pasar Kini</TableCell>
                          <TableCell>Haircut (%)</TableCell>
                          <TableCell>Recovery Value</TableCell>
                          <TableCell>Tanggal Penilaian</TableCell>
                          <TableCell>Keterangan</TableCell>
                          <TableCell>Aksi</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredAgunan.map(agunan => (
                          <TableRow key={agunan.agunan_id}>
                            <TableCell>{agunan.agunan_id}</TableCell>
                            <TableCell>
                              <Chip 
                                label={agunan.jenis_agunan} 
                                color={getAgunanColor(agunan.jenis_agunan)}
                                size='small'
                              />
                            </TableCell>
                            <TableCell>{formatCurrency(agunan.nilai_agunan_awal)}</TableCell>
                            <TableCell>{formatCurrency(agunan.nilai_pasar_kini)}</TableCell>
                            <TableCell>{agunan.haircut_persen}%</TableCell>
                            <TableCell>{formatCurrency(calculateExpectedRecovery(agunan))}</TableCell>
                            <TableCell>{new Date(agunan.tanggal_penilaian).toLocaleDateString('id-ID')}</TableCell>
                            <TableCell>{agunan.keterangan}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton 
                                  size='small' 
                                  color='primary'
                                  onClick={() => handleEditDialogOpen(agunan)}
                                >
                                  <i className='ri-edit-line' />
                                </IconButton>
                                <IconButton 
                                  size='small' 
                                  color='error'
                                  onClick={() => handleDeleteAgunan(agunan.agunan_id)}
                                >
                                  <i className='ri-delete-bin-line' />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity='info' sx={{ mt: 2 }}>
                    Belum ada data agunan untuk transaksi ini. Silakan tambahkan agunan.
                  </Alert>
                )}
                
                {filteredAgunan.length > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Button 
                      variant='contained' 
                      color='primary'
                      onClick={handleSaveLGD}
                      startIcon={<i className='ri-save-line' />}
                    >
                      Simpan Perhitungan LGD
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
      
      {/* Add Agunan Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose} maxWidth='md' fullWidth>
        <DialogTitle>
          Tambah Agunan
          <IconButton
            aria-label='close'
            onClick={handleAddDialogClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <i className='ri-close-line' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id='jenis-agunan-label'>Jenis Agunan</InputLabel>
                <Select
                  labelId='jenis-agunan-label'
                  value={newAgunan.jenis_agunan}
                  label='Jenis Agunan'
                  onChange={(e) => handleNewAgunanChange('jenis_agunan', e.target.value)}
                >
                  {['Tanah', 'Bangunan', 'Kendaraan', 'Mesin', 'Deposito', 'Inventory', 'Piutang', 'Lainnya'].map(jenis => (
                    <MenuItem key={jenis} value={jenis}>
                      {jenis}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label='Tanggal Penilaian'
                type='date'
                fullWidth
                value={newAgunan.tanggal_penilaian}
                onChange={(e) => handleNewAgunanChange('tanggal_penilaian', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label='Nilai Agunan Awal'
                type='number'
                fullWidth
                value={newAgunan.nilai_agunan_awal}
                onChange={(e) => handleNewAgunanChange('nilai_agunan_awal', parseFloat(e.target.value))}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>Rp</span>
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label='Nilai Pasar Kini'
                type='number'
                fullWidth
                value={newAgunan.nilai_pasar_kini}
                onChange={(e) => handleNewAgunanChange('nilai_pasar_kini', parseFloat(e.target.value))}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>Rp</span>
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label='Haircut (%)'
                type='number'
                fullWidth
                value={newAgunan.haircut_persen}
                onChange={(e) => handleNewAgunanChange('haircut_persen', parseFloat(e.target.value))}
                InputProps={{
                  endAdornment: <span style={{ marginLeft: 8 }}>%</span>
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label='Recovery Value'
                type='number'
                fullWidth
                value={newAgunan.nilai_pasar_kini ? (newAgunan.nilai_pasar_kini * (1 - (newAgunan.haircut_persen || 0) / 100)) : 0}
                disabled
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>Rp</span>
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label='Keterangan'
                fullWidth
                multiline
                rows={3}
                value={newAgunan.keterangan}
                onChange={(e) => handleNewAgunanChange('keterangan', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Batal</Button>
          <Button 
            variant='contained' 
            color='primary'
            onClick={handleAddAgunan}
            disabled={
              !newAgunan.jenis_agunan ||
              !newAgunan.nilai_agunan_awal ||
              !newAgunan.nilai_pasar_kini ||
              !newAgunan.tanggal_penilaian
            }
          >
            Tambah
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Agunan Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditDialogClose} maxWidth='md' fullWidth>
        <DialogTitle>
          Edit Agunan
          <IconButton
            aria-label='close'
            onClick={handleEditDialogClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <i className='ri-close-line' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editAgunan && (
            <Grid container spacing={3} sx={{ mt: 0 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id='edit-jenis-agunan-label'>Jenis Agunan</InputLabel>
                  <Select
                    labelId='edit-jenis-agunan-label'
                    value={editAgunan.jenis_agunan}
                    label='Jenis Agunan'
                    onChange={(e) => handleEditAgunanChange('jenis_agunan', e.target.value)}
                  >
                    {['Tanah', 'Bangunan', 'Kendaraan', 'Mesin', 'Deposito', 'Inventory', 'Piutang', 'Lainnya'].map(jenis => (
                      <MenuItem key={jenis} value={jenis}>
                        {jenis}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label='Tanggal Penilaian'
                  type='date'
                  fullWidth
                  value={editAgunan.tanggal_penilaian}
                  onChange={(e) => handleEditAgunanChange('tanggal_penilaian', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label='Nilai Agunan Awal'
                  type='number'
                  fullWidth
                  value={editAgunan.nilai_agunan_awal}
                  onChange={(e) => handleEditAgunanChange('nilai_agunan_awal', parseFloat(e.target.value))}
                  InputProps={{
                    startAdornment: <span style={{ marginRight: 8 }}>Rp</span>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label='Nilai Pasar Kini'
                  type='number'
                  fullWidth
                  value={editAgunan.nilai_pasar_kini}
                  onChange={(e) => handleEditAgunanChange('nilai_pasar_kini', parseFloat(e.target.value))}
                  InputProps={{
                    startAdornment: <span style={{ marginRight: 8 }}>Rp</span>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label='Haircut (%)'
                  type='number'
                  fullWidth
                  value={editAgunan.haircut_persen}
                  onChange={(e) => handleEditAgunanChange('haircut_persen', parseFloat(e.target.value))}
                  InputProps={{
                    endAdornment: <span style={{ marginLeft: 8 }}>%</span>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label='Recovery Value'
                  type='number'
                  fullWidth
                  value={calculateExpectedRecovery(editAgunan)}
                  disabled
                  InputProps={{
                    startAdornment: <span style={{ marginRight: 8 }}>Rp</span>
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label='Keterangan'
                  fullWidth
                  multiline
                  rows={3}
                  value={editAgunan.keterangan}
                  onChange={(e) => handleEditAgunanChange('keterangan', e.target.value)}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Batal</Button>
          <Button 
            variant='contained' 
            color='primary'
            onClick={handleUpdateAgunan}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default LGDInputPage
