'use client'

// React Imports
import { useState } from 'react'

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
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Alert from '@mui/material/Alert'

import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// Type Imports
import type { KolektibilitasHistory } from '@/data/pd/kolektibilitasHistoryData'
import type { TransaksiSyariah } from '@/data/master/transaksiData'

// Component Imports
import KolektibilitasHistoryChart from './KolektibilitasHistoryChart'
import KolektibilitasHistoryStats from './KolektibilitasHistoryStats'

interface KolektibilitasHistoryPageProps {
  historyData: KolektibilitasHistory[]
  transaksiData: TransaksiSyariah[]
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`history-tabpanel-${index}`}
      aria-labelledby={`history-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

const a11yProps = (index: number) => {
  return {
    id: `history-tab-${index}`,
    'aria-controls': `history-tabpanel-${index}`,
  }
}

const KolektibilitasHistoryPage = ({ historyData, transaksiData }: KolektibilitasHistoryPageProps) => {
  // States
  const [selectedTransaksi, setSelectedTransaksi] = useState<number | ''>('')
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  })
  const [activeTab, setActiveTab] = useState<number>(0)
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false)
  const [newHistoryData, setNewHistoryData] = useState<Partial<KolektibilitasHistory>>({
    transaction_id: '',
    kolektibilitas_lama: '',
    kolektibilitas_baru: '',
    tanggal_perubahan: '',
    keterangan: ''
  })
  
  // Filter history data based on selected transaction and date range
  const filteredHistoryData = historyData.filter(item => {
    let matchesTransaction = true
    let matchesDateRange = true
    
    if (selectedTransaksi) {
      matchesTransaction = item.transaction_id === selectedTransaksi
    }
    
    if (dateRange.start) {
      matchesDateRange = matchesDateRange && new Date(item.tanggal_perubahan) >= new Date(dateRange.start)
    }
    
    if (dateRange.end) {
      matchesDateRange = matchesDateRange && new Date(item.tanggal_perubahan) <= new Date(dateRange.end)
    }
    
    return matchesTransaction && matchesDateRange
  })
  
  // Get transaction details
  const selectedTransaksiDetails = transaksiData.find(t => t.transaction_id === selectedTransaksi)
  
  // Handlers
  const handleTransaksiChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTransaksi(event.target.value as number)
  }
  
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({ ...dateRange, start: event.target.value })
  }
  
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({ ...dateRange, end: event.target.value })
  }
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  
  const handleAddDialogOpen = () => {
    setOpenAddDialog(true)
    setNewHistoryData({
      transaction_id: selectedTransaksi || '',
      kolektibilitas_lama: selectedTransaksiDetails?.kolektibilitas_terkini || '',
      kolektibilitas_baru: '',
      tanggal_perubahan: new Date().toISOString().split('T')[0],
      keterangan: ''
    })
  }
  
  const handleAddDialogClose = () => {
    setOpenAddDialog(false)
  }
  
  const handleNewHistoryChange = (field: string, value: any) => {
    setNewHistoryData({ ...newHistoryData, [field]: value })
  }
  
  const handleAddHistory = () => {
    // In a real app, this would be an API call
    console.log('Adding new history:', newHistoryData)
    setOpenAddDialog(false)
    
    // Show success message or update UI
    alert('Kolektibilitas history added successfully!')
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
  
  const getKolektibilitasChangeIcon = (oldKol: string, newKol: string) => {
    const oldNum = parseInt(oldKol)
    const newNum = parseInt(newKol)
    
    if (oldNum < newNum) {
      return <i className='ri-arrow-down-line' style={{ color: '#f44336' }} />
    } else if (oldNum > newNum) {
      return <i className='ri-arrow-up-line' style={{ color: '#4caf50' }} />
    } else {
      return <i className='ri-arrow-right-line' style={{ color: '#2196f3' }} />
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Kolektibilitas History</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Riwayat perubahan kolektibilitas untuk analisis Probability of Default (PD)
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant='h6'>Filter Data</Typography>
              <Button 
                variant='contained' 
                color='primary'
                onClick={handleAddDialogOpen}
                startIcon={<i className='ri-add-line' />}
                disabled={!selectedTransaksi}
              >
                Tambah Perubahan
              </Button>
            </Box>
            
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
                      <em>All Transactions</em>
                    </MenuItem>
                    {transaksiData.map(transaksi => (
                      <MenuItem key={transaksi.transaction_id} value={transaksi.transaction_id}>
                        ID: {transaksi.transaction_id} - Rp {transaksi.pokok_pembiayaan.toLocaleString('id-ID')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label='Start Date'
                  type='date'
                  fullWidth
                  value={dateRange.start}
                  onChange={handleStartDateChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label='End Date'
                  type='date'
                  fullWidth
                  value={dateRange.end}
                  onChange={handleEndDateChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      {selectedTransaksi && selectedTransaksiDetails && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 3 }}>Transaction Details</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant='subtitle2' color='text.secondary'>Transaction ID</Typography>
                  <Typography variant='body1'>{selectedTransaksiDetails.transaction_id}</Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant='subtitle2' color='text.secondary'>Pokok Pembiayaan</Typography>
                  <Typography variant='body1'>
                    Rp {selectedTransaksiDetails.pokok_pembiayaan.toLocaleString('id-ID')}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant='subtitle2' color='text.secondary'>Current Kolektibilitas</Typography>
                  <Chip 
                    label={`Kol-${selectedTransaksiDetails.kolektibilitas_terkini}`} 
                    color={getKolektibilitasColor(selectedTransaksiDetails.kolektibilitas_terkini)}
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
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label='history tabs'>
                <Tab label='History Table' {...a11yProps(0)} />
                <Tab label='History Chart' {...a11yProps(1)} />
                <Tab label='Statistics' {...a11yProps(2)} />
              </Tabs>
            </Box>
            
            <TabPanel value={activeTab} index={0}>
              {filteredHistoryData.length > 0 ? (
                <TableContainer component={Paper} variant='outlined'>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>Change</TableCell>
                        <TableCell>To</TableCell>
                        <TableCell>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredHistoryData.map(history => (
                        <TableRow key={history.history_id}>
                          <TableCell>{history.transaction_id}</TableCell>
                          <TableCell>{new Date(history.tanggal_perubahan).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell>
                            <Chip 
                              label={`Kol-${history.kolektibilitas_lama}`} 
                              color={getKolektibilitasColor(history.kolektibilitas_lama)}
                              size='small'
                            />
                          </TableCell>
                          <TableCell>
                            {getKolektibilitasChangeIcon(history.kolektibilitas_lama, history.kolektibilitas_baru)}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`Kol-${history.kolektibilitas_baru}`} 
                              color={getKolektibilitasColor(history.kolektibilitas_baru)}
                              size='small'
                            />
                          </TableCell>
                          <TableCell>{history.keterangan}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity='info' sx={{ mt: 2 }}>
                  No history data found for the selected filters.
                </Alert>
              )}
            </TabPanel>
            
            <TabPanel value={activeTab} index={1}>
              {filteredHistoryData.length > 0 ? (
                <KolektibilitasHistoryChart data={filteredHistoryData} />
              ) : (
                <Alert severity='info'>
                  No history data found for the selected filters.
                </Alert>
              )}
            </TabPanel>
            
            <TabPanel value={activeTab} index={2}>
              {filteredHistoryData.length > 0 ? (
                <KolektibilitasHistoryStats data={filteredHistoryData} />
              ) : (
                <Alert severity='info'>
                  No history data found for the selected filters.
                </Alert>
              )}
            </TabPanel>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Add History Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose} maxWidth='md' fullWidth>
        <DialogTitle>
          Add Kolektibilitas Change
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
                <InputLabel id='transaction-select-label'>Transaction ID</InputLabel>
                <Select
                  labelId='transaction-select-label'
                  value={newHistoryData.transaction_id}
                  label='Transaction ID'
                  onChange={(e) => handleNewHistoryChange('transaction_id', e.target.value)}
                >
                  {transaksiData.map(transaksi => (
                    <MenuItem key={transaksi.transaction_id} value={transaksi.transaction_id}>
                      ID: {transaksi.transaction_id} - Rp {transaksi.pokok_pembiayaan.toLocaleString('id-ID')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label='Date'
                type='date'
                fullWidth
                value={newHistoryData.tanggal_perubahan}
                onChange={(e) => handleNewHistoryChange('tanggal_perubahan', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id='old-kol-select-label'>From Kolektibilitas</InputLabel>
                <Select
                  labelId='old-kol-select-label'
                  value={newHistoryData.kolektibilitas_lama}
                  label='From Kolektibilitas'
                  onChange={(e) => handleNewHistoryChange('kolektibilitas_lama', e.target.value)}
                >
                  {['1', '2', '3', '4', '5'].map(kol => (
                    <MenuItem key={`old-${kol}`} value={kol}>
                      Kolektibilitas {kol}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id='new-kol-select-label'>To Kolektibilitas</InputLabel>
                <Select
                  labelId='new-kol-select-label'
                  value={newHistoryData.kolektibilitas_baru}
                  label='To Kolektibilitas'
                  onChange={(e) => handleNewHistoryChange('kolektibilitas_baru', e.target.value)}
                >
                  {['1', '2', '3', '4', '5'].map(kol => (
                    <MenuItem key={`new-${kol}`} value={kol}>
                      Kolektibilitas {kol}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label='Notes'
                fullWidth
                multiline
                rows={3}
                value={newHistoryData.keterangan}
                onChange={(e) => handleNewHistoryChange('keterangan', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button 
            variant='contained' 
            color='primary'
            onClick={handleAddHistory}
            disabled={
              !newHistoryData.transaction_id ||
              !newHistoryData.kolektibilitas_lama ||
              !newHistoryData.kolektibilitas_baru ||
              !newHistoryData.tanggal_perubahan
            }
          >
            Add History
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default KolektibilitasHistoryPage
