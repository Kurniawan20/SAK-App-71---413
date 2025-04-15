'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
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
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Alert from '@mui/material/Alert'

// Type Imports
import type { TransaksiSyariah } from '@/data/master/transaksiData'
import type { Agunan } from '@/data/lgd/agunanData'
import type { LGDCalculation } from '@/data/lgd/lgdData'

// Helper Imports
import { formatCurrency } from '@/data/master/transaksiData'
import { calculateExpectedRecovery } from '@/data/lgd/agunanData'

interface LGDAnalysisPageProps {
  transaksiData: TransaksiSyariah[]
  agunanData: Agunan[]
  lgdData: LGDCalculation[]
}

const LGDAnalysisPage = ({ transaksiData, agunanData, lgdData }: LGDAnalysisPageProps) => {
  // States
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [selectedTransaksi, setSelectedTransaksi] = useState<number | ''>('')
  const [filteredLGD, setFilteredLGD] = useState<LGDCalculation | null>(null)
  const [filteredAgunan, setFilteredAgunan] = useState<Agunan[]>([])
  
  // Get transaction details
  const selectedTransaksiDetails = transaksiData.find(t => t.transaction_id === selectedTransaksi)
  
  // Filter LGD and agunan based on selected transaction
  useEffect(() => {
    if (selectedTransaksi) {
      const filtered = lgdData.find(l => l.transaction_id === selectedTransaksi)
      setFilteredLGD(filtered || null)
      
      const filteredAgunan = agunanData.filter(a => a.transaction_id === selectedTransaksi)
      setFilteredAgunan(filteredAgunan)
    } else {
      setFilteredLGD(null)
      setFilteredAgunan([])
    }
  }, [selectedTransaksi, lgdData, agunanData])
  
  // Handlers
  const handleTransaksiChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTransaksi(event.target.value as number)
  }
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }
  
  // Get color based on LGD percentage
  const getLGDColor = (lgdPercentage: number): 'success' | 'warning' | 'error' => {
    if (lgdPercentage <= 0.2) return 'success'
    if (lgdPercentage <= 0.5) return 'warning'
    return 'error'
  }
  
  // Get color based on collateral type
  const getAgunanColor = (jenisAgunan: string): 'success' | 'info' | 'warning' | 'error' | 'default' => {
    const colors: Record<string, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
      'Tanah': 'success',
      'Bangunan': 'success',
      'Kendaraan': 'info',
      'Mesin': 'info',
      'Deposito': 'success',
      'Inventory': 'warning',
      'Piutang': 'warning',
      'Lainnya': 'error'
    }
    
    return colors[jenisAgunan] || 'default'
  }
  
  // Calculate total recovery value
  const totalRecoveryValue = filteredAgunan.reduce((sum, item) => 
    sum + calculateExpectedRecovery(item), 0
  )
  
  // Function to render LGD Summary
  const renderLGDSummary = () => {
    if (!filteredLGD || !selectedTransaksiDetails) return null
    
    const coverageRatio = selectedTransaksiDetails.pokok_pembiayaan > 0 
      ? Math.min(filteredLGD.total_recovery_value / selectedTransaksiDetails.pokok_pembiayaan, 1) 
      : 0
    
    return (
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
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
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 4 }}>
                Perhitungan LGD
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Tanggal Perhitungan
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  {new Date(filteredLGD.tanggal_perhitungan).toLocaleDateString('id-ID')}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Total Nilai Agunan
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  {formatCurrency(filteredLGD.total_nilai_agunan)}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Total Recovery Value
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  {formatCurrency(filteredLGD.total_recovery_value)}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Outstanding Pokok
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  {formatCurrency(filteredLGD.outstanding_pokok)}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Coverage Ratio
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  {(coverageRatio * 100).toFixed(2)}%
                </Typography>
              </Box>
              
              <Box>
                <Typography variant='body2' color='text.secondary'>
                  LGD
                </Typography>
                <Chip 
                  label={`${(filteredLGD.lgd_percentage * 100).toFixed(2)}%`} 
                  color={getLGDColor(filteredLGD.lgd_percentage)}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
  
  // Function to render Collateral Details
  const renderCollateralDetails = () => {
    if (filteredAgunan.length === 0) {
      return (
        <Alert severity='info' sx={{ mt: 2 }}>
          Tidak ada data agunan untuk transaksi ini.
        </Alert>
      )
    }
    
    return (
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
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4} align='right'>
                <Typography variant='subtitle2'>Total</Typography>
              </TableCell>
              <TableCell colSpan={2}>
                <Typography variant='subtitle2'>
                  {formatCurrency(totalRecoveryValue)}
                </Typography>
              </TableCell>
              <TableCell colSpan={2} />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
  
  // Function to render LGD Visualization
  const renderLGDVisualization = () => {
    if (!filteredLGD || !selectedTransaksiDetails) {
      return (
        <Alert severity='info' sx={{ mt: 2 }}>
          Pilih transaksi untuk melihat visualisasi LGD.
        </Alert>
      )
    }
    
    // Calculate percentages for visualization
    const outstandingPokok = filteredLGD.outstanding_pokok
    const recoveryValue = Math.min(filteredLGD.total_recovery_value, outstandingPokok)
    const lossValue = outstandingPokok - recoveryValue
    
    const recoveryPercentage = (recoveryValue / outstandingPokok) * 100
    const lossPercentage = (lossValue / outstandingPokok) * 100
    
    return (
      <Card>
        <CardContent>
          <Typography variant='h6' sx={{ mb: 4 }}>
            Visualisasi LGD
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box sx={{ 
              width: '100%', 
              maxWidth: 600,
              height: 50, 
              display: 'flex',
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              <Box 
                sx={{ 
                  width: `${recoveryPercentage}%`, 
                  bgcolor: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                {recoveryPercentage > 10 && `${recoveryPercentage.toFixed(1)}%`}
              </Box>
              <Box 
                sx={{ 
                  width: `${lossPercentage}%`, 
                  bgcolor: 'error.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                {lossPercentage > 10 && `${lossPercentage.toFixed(1)}%`}
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: 'success.main', borderRadius: '50%' }} />
                <Typography variant='body2'>Recovery</Typography>
              </Box>
              <Typography variant='h6'>{formatCurrency(recoveryValue)}</Typography>
              <Typography variant='body2'>{recoveryPercentage.toFixed(1)}%</Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: 'error.main', borderRadius: '50%' }} />
                <Typography variant='body2'>Loss</Typography>
              </Box>
              <Typography variant='h6'>{formatCurrency(lossValue)}</Typography>
              <Typography variant='body2'>{lossPercentage.toFixed(1)}%</Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant='subtitle2' gutterBottom>
              Interpretasi:
            </Typography>
            <Typography variant='body2'>
              LGD sebesar {(filteredLGD.lgd_percentage * 100).toFixed(2)}% menunjukkan bahwa jika terjadi default pada pembiayaan ini, 
              bank diperkirakan akan kehilangan {(filteredLGD.lgd_percentage * 100).toFixed(2)}% dari nilai outstanding pokok.
              {filteredLGD.lgd_percentage <= 0.2 ? (
                ' Nilai LGD yang rendah menunjukkan bahwa agunan yang dimiliki cukup untuk menutupi sebagian besar risiko pembiayaan.'
              ) : filteredLGD.lgd_percentage <= 0.5 ? (
                ' Nilai LGD sedang menunjukkan bahwa agunan yang dimiliki cukup untuk menutupi sebagian risiko pembiayaan, namun masih terdapat potensi kerugian yang signifikan.'
              ) : (
                ' Nilai LGD yang tinggi menunjukkan bahwa agunan yang dimiliki tidak cukup untuk menutupi sebagian besar risiko pembiayaan, sehingga potensi kerugian sangat tinggi.'
              )}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Analisis LGD</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Analisis Loss Given Default (LGD) berdasarkan nilai agunan dan outstanding pembiayaan
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
      
      {selectedTransaksi && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 4 }}>
                <Tab label='Ringkasan LGD' />
                <Tab label='Detail Agunan' />
                <Tab label='Visualisasi LGD' />
              </Tabs>
              
              {selectedTab === 0 && renderLGDSummary()}
              {selectedTab === 1 && renderCollateralDetails()}
              {selectedTab === 2 && renderLGDVisualization()}
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

export default LGDAnalysisPage
