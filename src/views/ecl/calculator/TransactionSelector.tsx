'use client'

// React Imports
import { FC, useState, useEffect } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

// Sample transaction data (in a real app, this would come from an API or props)
interface Transaction {
  transaction_id: number
  nasabah_id: number
  nasabah_name: string
  akad_id: number
  akad_name: string
  pokok_pembiayaan: number
  margin: number
  status_transaksi: 'aktif' | 'lunas' | 'macet'
  kolektibilitas_terkini: number
  dpd: number
  tenor: number
  remaining_tenor: number
  segment: 'Retail' | 'Commercial' | 'Corporate'
}

const sampleTransactions: Transaction[] = [
  {
    transaction_id: 1001,
    nasabah_id: 5001,
    nasabah_name: 'PT Berkah Abadi',
    akad_id: 101,
    akad_name: 'Murabahah',
    pokok_pembiayaan: 100000000,
    margin: 15000000,
    status_transaksi: 'aktif',
    kolektibilitas_terkini: 1,
    dpd: 0,
    tenor: 36,
    remaining_tenor: 24,
    segment: 'Commercial'
  },
  {
    transaction_id: 1002,
    nasabah_id: 5002,
    nasabah_name: 'Ahmad Hidayat',
    akad_id: 102,
    akad_name: 'Musyarakah',
    pokok_pembiayaan: 75000000,
    margin: 12000000,
    status_transaksi: 'aktif',
    kolektibilitas_terkini: 2,
    dpd: 45,
    tenor: 24,
    remaining_tenor: 12,
    segment: 'Retail'
  },
  {
    transaction_id: 1003,
    nasabah_id: 5003,
    nasabah_name: 'PT Sejahtera Makmur',
    akad_id: 103,
    akad_name: 'Mudharabah',
    pokok_pembiayaan: 50000000,
    margin: 8000000,
    status_transaksi: 'macet',
    kolektibilitas_terkini: 5,
    dpd: 120,
    tenor: 48,
    remaining_tenor: 30,
    segment: 'Corporate'
  }
]

interface TransactionSelectorProps {
  onTransactionSelect: (transactionId: number | null) => void
  selectedTransactionId: number | null
}

const TransactionSelector: FC<TransactionSelectorProps> = ({
  onTransactionSelect,
  selectedTransactionId
}) => {
  // States
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(sampleTransactions)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterSegment, setFilterSegment] = useState<string>('all')
  
  // Effect to set selected transaction based on ID
  useEffect(() => {
    if (selectedTransactionId) {
      const transaction = sampleTransactions.find(t => t.transaction_id === selectedTransactionId)
      if (transaction) {
        setSelectedTransaction(transaction)
      }
    } else {
      setSelectedTransaction(null)
    }
  }, [selectedTransactionId])
  
  // Effect to filter transactions based on search and filters
  useEffect(() => {
    let filtered = sampleTransactions
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        t.transaction_id.toString().includes(query) ||
        t.nasabah_name.toLowerCase().includes(query) ||
        t.akad_name.toLowerCase().includes(query)
      )
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status_transaksi === filterStatus)
    }
    
    // Apply segment filter
    if (filterSegment !== 'all') {
      filtered = filtered.filter(t => t.segment === filterSegment)
    }
    
    setFilteredTransactions(filtered)
  }, [searchQuery, filterStatus, filterSegment])
  
  // Handler for transaction selection
  const handleTransactionSelect = (transaction: Transaction | null) => {
    setSelectedTransaction(transaction)
    onTransactionSelect(transaction ? transaction.transaction_id : null)
  }
  
  // Get collectibility status label and color
  const getKolektibilitasLabel = (kol: number): { label: string, color: 'success' | 'warning' | 'error' | 'default' } => {
    switch (kol) {
      case 1:
        return { label: 'Lancar', color: 'success' }
      case 2:
        return { label: 'Dalam Perhatian Khusus', color: 'warning' }
      case 3:
        return { label: 'Kurang Lancar', color: 'error' }
      case 4:
        return { label: 'Diragukan', color: 'error' }
      case 5:
        return { label: 'Macet', color: 'error' }
      default:
        return { label: 'Unknown', color: 'default' }
    }
  }
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  return (
    <Box>
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={sampleTransactions}
            getOptionLabel={(option) => `${option.transaction_id} - ${option.nasabah_name} (${option.akad_name})`}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Search Transaction" 
                variant="outlined"
                fullWidth
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            )}
            onChange={(event, value) => handleTransactionSelect(value)}
            value={selectedTransaction}
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="aktif">Active</MenuItem>
              <MenuItem value="lunas">Paid Off</MenuItem>
              <MenuItem value="macet">Default</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Segment</InputLabel>
            <Select
              value={filterSegment}
              label="Segment"
              onChange={(e) => setFilterSegment(e.target.value)}
            >
              <MenuItem value="all">All Segments</MenuItem>
              <MenuItem value="Retail">Retail</MenuItem>
              <MenuItem value="Commercial">Commercial</MenuItem>
              <MenuItem value="Corporate">Corporate</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      {selectedTransaction ? (
        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Selected Transaction Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Transaction ID
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedTransaction.transaction_id}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary">
                  Customer
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedTransaction.nasabah_name} (ID: {selectedTransaction.nasabah_id})
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary">
                  Contract Type
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedTransaction.akad_name}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary">
                  Segment
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedTransaction.segment}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Principal Amount
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatCurrency(selectedTransaction.pokok_pembiayaan)}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary">
                  Margin
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatCurrency(selectedTransaction.margin)}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <Chip 
                    label={selectedTransaction.status_transaksi === 'aktif' ? 'Active' : 
                           selectedTransaction.status_transaksi === 'lunas' ? 'Paid Off' : 'Default'}
                    color={selectedTransaction.status_transaksi === 'aktif' ? 'success' : 
                           selectedTransaction.status_transaksi === 'lunas' ? 'info' : 'error'}
                    size="small"
                  />
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary">
                  Collectibility
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <Chip 
                    label={getKolektibilitasLabel(selectedTransaction.kolektibilitas_terkini).label}
                    color={getKolektibilitasLabel(selectedTransaction.kolektibilitas_terkini).color}
                    size="small"
                  />
                  {selectedTransaction.dpd > 0 && (
                    <Typography variant="caption" color="error.main" sx={{ ml: 1 }}>
                      (DPD: {selectedTransaction.dpd} days)
                    </Typography>
                  )}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Alert severity="info" sx={{ mb: 4 }}>
          Please select a transaction to calculate ECL
        </Alert>
      )}
      
      <Typography variant="h6" gutterBottom>
        Available Transactions
      </Typography>
      
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Contract</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Collectibility</TableCell>
              <TableCell>Segment</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => {
                const kolStatus = getKolektibilitasLabel(transaction.kolektibilitas_terkini)
                
                return (
                  <TableRow 
                    key={transaction.transaction_id}
                    selected={selectedTransaction?.transaction_id === transaction.transaction_id}
                  >
                    <TableCell>{transaction.transaction_id}</TableCell>
                    <TableCell>{transaction.nasabah_name}</TableCell>
                    <TableCell>{transaction.akad_name}</TableCell>
                    <TableCell>{formatCurrency(transaction.pokok_pembiayaan)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.status_transaksi === 'aktif' ? 'Active' : 
                               transaction.status_transaksi === 'lunas' ? 'Paid Off' : 'Default'}
                        color={transaction.status_transaksi === 'aktif' ? 'success' : 
                               transaction.status_transaksi === 'lunas' ? 'info' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={kolStatus.label}
                        color={kolStatus.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{transaction.segment}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => handleTransactionSelect(transaction)}
                      >
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Alert severity="info">
                    No transactions found matching the search criteria
                  </Alert>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default TransactionSelector
