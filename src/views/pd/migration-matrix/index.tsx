'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'

// Type Imports
import type { MigrationMatrix } from '@/data/pd/migrationMatrixData'

// Component Imports
import MigrationMatrixStats from './MigrationMatrixStats'
import MigrationMatrixHeatmap from './MigrationMatrixHeatmap'
import AddMigrationMatrixDialog from './AddMigrationMatrixDialog'

interface MigrationMatrixPageProps {
  migrationMatrixData: MigrationMatrix[]
}

const MigrationMatrixPage = ({ migrationMatrixData }: MigrationMatrixPageProps) => {
  // States
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false)
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2024-01-01 to 2024-03-31')
  const [matrixData, setMatrixData] = useState<MigrationMatrix[]>(migrationMatrixData)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [editItem, setEditItem] = useState<MigrationMatrix | null>(null)
  
  // Get unique periods from data
  const uniquePeriods = Array.from(
    new Set(
      matrixData.map(item => `${item.periode_awal} to ${item.periode_akhir}`)
    )
  )
  
  // Filter data based on selected period
  const filteredData = matrixData.filter(item => 
    `${item.periode_awal} to ${item.periode_akhir}` === selectedPeriod
  )
  
  // Handlers
  const handleAddDialogOpen = () => {
    setOpenAddDialog(true)
  }
  
  const handleAddDialogClose = () => {
    setOpenAddDialog(false)
  }
  
  const handlePeriodChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedPeriod(event.target.value as string)
  }
  
  const handleEditItem = (item: MigrationMatrix) => {
    setEditItem(item)
    setOpenEditDialog(true)
  }
  
  const handleEditDialogClose = () => {
    setOpenEditDialog(false)
    setEditItem(null)
  }
  
  const handleAddMatrix = (newMatrix: MigrationMatrix) => {
    // In a real app, this would be an API call
    setMatrixData([...matrixData, { ...newMatrix, matrix_id: matrixData.length + 1 }])
    setOpenAddDialog(false)
  }
  
  const handleUpdateMatrix = (updatedMatrix: MigrationMatrix) => {
    // In a real app, this would be an API call
    setMatrixData(matrixData.map(item => 
      item.matrix_id === updatedMatrix.matrix_id ? updatedMatrix : item
    ))
    setOpenEditDialog(false)
    setEditItem(null)
  }
  
  // Create matrix view (5x5 grid)
  const createMatrixView = () => {
    const kolektibilitasValues = ['1', '2', '3', '4', '5']
    
    return (
      <TableContainer component={Paper} variant='outlined'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>From / To</TableCell>
              {kolektibilitasValues.map(value => (
                <TableCell key={value} align='center' sx={{ fontWeight: 'bold' }}>
                  Kol-{value}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {kolektibilitasValues.map(fromValue => (
              <TableRow key={fromValue}>
                <TableCell sx={{ fontWeight: 'bold' }}>Kol-{fromValue}</TableCell>
                {kolektibilitasValues.map(toValue => {
                  const matrixItem = filteredData.find(
                    item => item.dari_kolektibilitas === fromValue && item.ke_kolektibilitas === toValue
                  )
                  
                  const probabilityValue = matrixItem ? matrixItem.probability_value : 0
                  const bgColor = getProbabilityColor(probabilityValue)
                  
                  return (
                    <TableCell 
                      key={`${fromValue}-${toValue}`} 
                      align='center'
                      onClick={() => {
                        if (matrixItem) handleEditItem(matrixItem)
                      }}
                      sx={{ 
                        backgroundColor: bgColor,
                        color: probabilityValue > 0.5 ? 'white' : 'inherit',
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.8
                        }
                      }}
                    >
                      {(probabilityValue * 100).toFixed(2)}%
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
  
  // Get color based on probability value
  const getProbabilityColor = (value: number) => {
    if (value >= 0.8) return '#1e88e5' // High stay probability (blue)
    if (value >= 0.5) return '#43a047' // Good probability (green)
    if (value >= 0.3) return '#ffb74d' // Medium probability (orange)
    if (value >= 0.1) return '#f57c00' // Low-medium probability (dark orange)
    if (value > 0) return '#e53935'    // Low probability (red)
    return 'transparent'               // Zero probability
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Migration Matrix</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Matriks migrasi untuk perhitungan Probability of Default (PD) PSAK 71 & 413
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <MigrationMatrixStats data={filteredData} />
      </Grid>
      
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant='h6'>Migration Matrix</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl sx={{ minWidth: 250 }}>
                  <InputLabel id='period-select-label'>Periode</InputLabel>
                  <Select
                    labelId='period-select-label'
                    value={selectedPeriod}
                    label='Periode'
                    onChange={handlePeriodChange}
                  >
                    {uniquePeriods.map(period => (
                      <MenuItem key={period} value={period}>
                        {period}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button 
                  variant='contained' 
                  color='primary'
                  onClick={handleAddDialogOpen}
                  startIcon={<i className='ri-add-line' />}
                >
                  Tambah Data
                </Button>
              </Box>
            </Box>
            
            <Alert severity='info' sx={{ mb: 4 }}>
              Klik pada sel matriks untuk mengedit nilai probabilitas transisi antar kolektibilitas.
            </Alert>
            
            {createMatrixView()}
            
            <Box sx={{ mt: 6 }}>
              <Typography variant='h6' sx={{ mb: 3 }}>Visualisasi Heatmap</Typography>
              <MigrationMatrixHeatmap data={filteredData} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Add Migration Matrix Dialog */}
      <AddMigrationMatrixDialog 
        open={openAddDialog}
        onClose={handleAddDialogClose}
        onAdd={handleAddMatrix}
      />
      
      {/* Edit Migration Matrix Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditDialogClose} maxWidth='sm' fullWidth>
        <DialogTitle>
          Edit Probability Value
          <IconButton
            aria-label='close'
            onClick={handleEditDialogClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <i className='ri-close-line' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editItem && (
            <Box sx={{ pt: 2 }}>
              <Typography variant='subtitle1' sx={{ mb: 3 }}>
                Editing transition from Kol-{editItem.dari_kolektibilitas} to Kol-{editItem.ke_kolektibilitas}
              </Typography>
              
              <TextField
                label='Probability Value'
                type='number'
                fullWidth
                value={editItem.probability_value}
                onChange={(e) => setEditItem({
                  ...editItem,
                  probability_value: parseFloat(e.target.value)
                })}
                inputProps={{ 
                  min: 0, 
                  max: 1,
                  step: 0.01
                }}
                sx={{ mb: 3 }}
              />
              
              <Alert severity='warning'>
                Pastikan total probability untuk setiap baris (dari kolektibilitas yang sama) berjumlah 1.00 (100%).
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button 
            variant='contained' 
            color='primary'
            onClick={() => editItem && handleUpdateMatrix(editItem)}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default MigrationMatrixPage
