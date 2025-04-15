'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
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
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'

// Type Imports
import type { TransaksiSyariah } from '@/data/master/transaksiData'
import type { LGDHistory } from '@/data/lgd/lgdHistoryData'

// Helper Imports
import { formatCurrency } from '@/data/master/transaksiData'

interface LGDHistoryPageProps {
  transaksiData: TransaksiSyariah[]
  lgdHistoryData: LGDHistory[]
}

const LGDHistoryPage = ({ transaksiData, lgdHistoryData }: LGDHistoryPageProps) => {
  // States
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [selectedTransaksi, setSelectedTransaksi] = useState<number | ''>('')
  const [startDate, setStartDate] = useState<string>('2024-01-01')
  const [endDate, setEndDate] = useState<string>('2025-12-31')
  const [filteredHistory, setFilteredHistory] = useState<LGDHistory[]>([])
  
  // Get transaction details
  const selectedTransaksiDetails = transaksiData.find(t => t.transaction_id === selectedTransaksi)
  
  // Filter history based on selected transaction and date range
  useEffect(() => {
    let filtered = [...lgdHistoryData]
    
    if (selectedTransaksi) {
      filtered = filtered.filter(h => h.transaction_id === selectedTransaksi)
    }
    
    filtered = filtered.filter(h => {
      const historyDate = new Date(h.tanggal_perhitungan)
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      return historyDate >= start && historyDate <= end
    })
    
    // Sort by date
    filtered.sort((a, b) => new Date(a.tanggal_perhitungan).getTime() - new Date(b.tanggal_perhitungan).getTime())
    
    setFilteredHistory(filtered)
  }, [selectedTransaksi, startDate, endDate, lgdHistoryData])
  
  // Handlers
  const handleTransaksiChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTransaksi(event.target.value as number)
  }
  
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value)
  }
  
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value)
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
  
  // Render History Table
  const renderHistoryTable = () => {
    if (filteredHistory.length === 0) {
      return (
        <Alert severity='info' sx={{ mt: 2 }}>
          Tidak ada data riwayat LGD untuk kriteria yang dipilih.
        </Alert>
      )
    }
    
    return (
      <TableContainer component={Paper} variant='outlined'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tanggal</TableCell>
              <TableCell>Total Nilai Agunan</TableCell>
              <TableCell>Recovery Value</TableCell>
              <TableCell>Outstanding Pokok</TableCell>
              <TableCell>LGD</TableCell>
              <TableCell>Keterangan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHistory.map(history => (
              <TableRow key={history.history_id}>
                <TableCell>{new Date(history.tanggal_perhitungan).toLocaleDateString('id-ID')}</TableCell>
                <TableCell>{formatCurrency(history.total_nilai_agunan)}</TableCell>
                <TableCell>{formatCurrency(history.total_recovery_value)}</TableCell>
                <TableCell>{formatCurrency(history.outstanding_pokok)}</TableCell>
                <TableCell>
                  <Chip 
                    label={`${(history.lgd_percentage * 100).toFixed(2)}%`} 
                    color={getLGDColor(history.lgd_percentage)}
                    size='small'
                  />
                </TableCell>
                <TableCell>{history.keterangan}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
  
  // Render History Chart
  const renderHistoryChart = () => {
    if (filteredHistory.length === 0) {
      return (
        <Alert severity='info' sx={{ mt: 2 }}>
          Tidak ada data riwayat LGD untuk kriteria yang dipilih.
        </Alert>
      )
    }
    
    return (
      <Box sx={{ mt: 4 }}>
        <Box sx={{ height: 300, position: 'relative', mb: 4 }}>
          {/* Chart container */}
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            alignItems: 'flex-end',
            borderBottom: '1px solid',
            borderLeft: '1px solid',
            borderColor: 'divider',
            p: 2
          }}>
            {/* Y-axis labels */}
            <Box sx={{ position: 'absolute', left: -40, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography variant='caption'>100%</Typography>
              <Typography variant='caption'>75%</Typography>
              <Typography variant='caption'>50%</Typography>
              <Typography variant='caption'>25%</Typography>
              <Typography variant='caption'>0%</Typography>
            </Box>
            
            {/* Chart bars */}
            {filteredHistory.map((history, index) => (
              <Box 
                key={history.history_id}
                sx={{ 
                  height: `${history.lgd_percentage * 100}%`, 
                  width: `${80 / filteredHistory.length}%`,
                  bgcolor: theme => theme.palette[getLGDColor(history.lgd_percentage)].main,
                  mx: 0.5,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  position: 'relative',
                  '&:hover': {
                    opacity: 0.8
                  },
                  cursor: 'pointer'
                }}
                title={`${new Date(history.tanggal_perhitungan).toLocaleDateString('id-ID')}: ${(history.lgd_percentage * 100).toFixed(2)}%`}
              >
                <Box sx={{ 
                  position: 'absolute', 
                  top: -24, 
                  left: 0, 
                  right: 0, 
                  textAlign: 'center'
                }}>
                  <Typography variant='caption' sx={{ color: theme => theme.palette[getLGDColor(history.lgd_percentage)].main }}>
                    {(history.lgd_percentage * 100).toFixed(0)}%
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* X-axis labels */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', px: 2 }}>
          {filteredHistory.map(history => (
            <Typography key={history.history_id} variant='caption' sx={{ transform: 'rotate(-45deg)', transformOrigin: 'top left', width: 80, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {new Date(history.tanggal_perhitungan).toLocaleDateString('id-ID')}
            </Typography>
          ))}
        </Box>
      </Box>
    )
  }
  
  // Render Statistics
  const renderStatistics = () => {
    if (filteredHistory.length === 0) {
      return (
        <Alert severity='info' sx={{ mt: 2 }}>
          Tidak ada data riwayat LGD untuk kriteria yang dipilih.
        </Alert>
      )
    }
    
    // Calculate statistics
    const avgLGD = filteredHistory.reduce((sum, item) => sum + item.lgd_percentage, 0) / filteredHistory.length
    const minLGD = Math.min(...filteredHistory.map(item => item.lgd_percentage))
    const maxLGD = Math.max(...filteredHistory.map(item => item.lgd_percentage))
    
    const latestLGD = filteredHistory[filteredHistory.length - 1].lgd_percentage
    const firstLGD = filteredHistory[0].lgd_percentage
    const lgdTrend = latestLGD - firstLGD
    
    const avgRecoveryValue = filteredHistory.reduce((sum, item) => sum + item.total_recovery_value, 0) / filteredHistory.length
    const avgAgunanValue = filteredHistory.reduce((sum, item) => sum + item.total_nilai_agunan, 0) / filteredHistory.length
    
    return (
      <Grid container spacing={4} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Statistik LGD
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Rata-rata LGD:</Typography>
                  <Chip 
                    label={`${(avgLGD * 100).toFixed(2)}%`} 
                    color={getLGDColor(avgLGD)}
                    size='small'
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>LGD Minimum:</Typography>
                  <Chip 
                    label={`${(minLGD * 100).toFixed(2)}%`} 
                    color={getLGDColor(minLGD)}
                    size='small'
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>LGD Maksimum:</Typography>
                  <Chip 
                    label={`${(maxLGD * 100).toFixed(2)}%`} 
                    color={getLGDColor(maxLGD)}
                    size='small'
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>LGD Terkini:</Typography>
                  <Chip 
                    label={`${(latestLGD * 100).toFixed(2)}%`} 
                    color={getLGDColor(latestLGD)}
                    size='small'
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Tren LGD:</Typography>
                  <Chip 
                    label={lgdTrend > 0 ? `+${(lgdTrend * 100).toFixed(2)}%` : `${(lgdTrend * 100).toFixed(2)}%`} 
                    color={lgdTrend > 0 ? 'error' : lgdTrend < 0 ? 'success' : 'default'}
                    size='small'
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Statistik Nilai Agunan
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Rata-rata Nilai Agunan:</Typography>
                  <Typography variant='body2' fontWeight='medium'>
                    {formatCurrency(avgAgunanValue)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Rata-rata Recovery Value:</Typography>
                  <Typography variant='body2' fontWeight='medium'>
                    {formatCurrency(avgRecoveryValue)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Rata-rata Haircut:</Typography>
                  <Typography variant='body2' fontWeight='medium'>
                    {((1 - (avgRecoveryValue / avgAgunanValue)) * 100).toFixed(2)}%
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Nilai Agunan Terkini:</Typography>
                  <Typography variant='body2' fontWeight='medium'>
                    {formatCurrency(filteredHistory[filteredHistory.length - 1].total_nilai_agunan)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Recovery Value Terkini:</Typography>
                  <Typography variant='body2' fontWeight='medium'>
                    {formatCurrency(filteredHistory[filteredHistory.length - 1].total_recovery_value)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Riwayat LGD</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Riwayat perhitungan Loss Given Default (LGD) berdasarkan perubahan nilai agunan
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              Filter Data
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id='transaksi-select-label'>Transaksi</InputLabel>
                  <Select
                    labelId='transaksi-select-label'
                    value={selectedTransaksi}
                    label='Transaksi'
                    onChange={handleTransaksiChange}
                  >
                    <MenuItem value=''>
                      <em>Semua Transaksi</em>
                    </MenuItem>
                    {transaksiData.map(transaksi => (
                      <MenuItem key={transaksi.transaction_id} value={transaksi.transaction_id}>
                        ID: {transaksi.transaction_id} - {formatCurrency(transaksi.pokok_pembiayaan)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label='Tanggal Mulai'
                  type='date'
                  fullWidth
                  value={startDate}
                  onChange={handleStartDateChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label='Tanggal Akhir'
                  type='date'
                  fullWidth
                  value={endDate}
                  onChange={handleEndDateChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      {selectedTransaksiDetails && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 4 }}>
                Detail Transaksi
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={3}>
                  <Typography variant='body2' color='text.secondary'>
                    ID Transaksi
                  </Typography>
                  <Typography variant='body1' fontWeight='medium'>
                    {selectedTransaksiDetails.transaction_id}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Typography variant='body2' color='text.secondary'>
                    Nasabah ID
                  </Typography>
                  <Typography variant='body1' fontWeight='medium'>
                    {selectedTransaksiDetails.nasabah_id}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Typography variant='body2' color='text.secondary'>
                    Pokok Pembiayaan
                  </Typography>
                  <Typography variant='body1' fontWeight='medium'>
                    {formatCurrency(selectedTransaksiDetails.pokok_pembiayaan)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Typography variant='body2' color='text.secondary'>
                    Kolektibilitas Terkini
                  </Typography>
                  <Chip 
                    label={`Kol-${selectedTransaksiDetails.kolektibilitas_terkini}`} 
                    color={selectedTransaksiDetails.kolektibilitas_terkini <= 2 ? 'success' : 
                           selectedTransaksiDetails.kolektibilitas_terkini === 3 ? 'warning' : 'error'}
                    size='small'
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
      
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 4 }}>
              <Tab label='Tabel Riwayat' />
              <Tab label='Grafik Riwayat' />
              <Tab label='Statistik' />
            </Tabs>
            
            {selectedTab === 0 && renderHistoryTable()}
            {selectedTab === 1 && renderHistoryChart()}
            {selectedTab === 2 && renderStatistics()}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default LGDHistoryPage
