'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

// Type Imports
import type { MigrationMatrix } from '@/data/pd/migrationMatrixData'

interface AddMigrationMatrixDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (matrix: MigrationMatrix) => void
}

const AddMigrationMatrixDialog = ({ open, onClose, onAdd }: AddMigrationMatrixDialogProps) => {
  // Initialize matrix with default values
  const initializeMatrix = () => {
    const kolektibilitasValues = ['1', '2', '3', '4', '5']
    const initialMatrix: Record<string, Record<string, number>> = {}
    
    kolektibilitasValues.forEach(fromValue => {
      initialMatrix[fromValue] = {}
      kolektibilitasValues.forEach(toValue => {
        // Set diagonal to 0.8 (high stay probability) and distribute the rest
        if (fromValue === toValue) {
          initialMatrix[fromValue][toValue] = 0.8
        } else if (parseInt(fromValue) < parseInt(toValue)) {
          // Downgrade probability (higher for closer values)
          const diff = parseInt(toValue) - parseInt(fromValue)
          initialMatrix[fromValue][toValue] = diff === 1 ? 0.1 : 0.05 / diff
        } else {
          // Upgrade probability (higher for closer values)
          const diff = parseInt(fromValue) - parseInt(toValue)
          initialMatrix[fromValue][toValue] = diff === 1 ? 0.05 : 0.025 / diff
        }
      })
      
      // Normalize to ensure sum is 1.0
      const sum = Object.values(initialMatrix[fromValue]).reduce((a, b) => a + b, 0)
      if (sum !== 1.0) {
        const factor = 1.0 / sum
        Object.keys(initialMatrix[fromValue]).forEach(toValue => {
          initialMatrix[fromValue][toValue] *= factor
        })
      }
    })
    
    return initialMatrix
  }
  
  // States
  const [periodeAwal, setPeriodeAwal] = useState<string>('')
  const [periodeAkhir, setPeriodeAkhir] = useState<string>('')
  const [matrixValues, setMatrixValues] = useState<Record<string, Record<string, number>>>(initializeMatrix())
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Handlers
  const handlePeriodeAwalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPeriodeAwal(e.target.value)
    validateForm({ ...errors, periodeAwal: '' })
  }
  
  const handlePeriodeAkhirChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPeriodeAkhir(e.target.value)
    validateForm({ ...errors, periodeAkhir: '' })
  }
  
  const handleMatrixValueChange = (fromValue: string, toValue: string, value: number) => {
    const newMatrixValues = { ...matrixValues }
    newMatrixValues[fromValue][toValue] = value
    
    // Check if row sum is approximately 1.0 (allowing for floating point errors)
    const rowSum = Object.values(newMatrixValues[fromValue]).reduce((a, b) => a + b, 0)
    const rowErrors = { ...errors }
    
    if (Math.abs(rowSum - 1.0) > 0.01) {
      rowErrors[`row_${fromValue}`] = `Total probability for row Kol-${fromValue} should be 1.00 (currently ${rowSum.toFixed(2)})`
    } else {
      delete rowErrors[`row_${fromValue}`]
    }
    
    setMatrixValues(newMatrixValues)
    setErrors(rowErrors)
  }
  
  const validateForm = (currentErrors: Record<string, string>) => {
    const newErrors = { ...currentErrors }
    
    if (!periodeAwal) {
      newErrors.periodeAwal = 'Periode awal is required'
    }
    
    if (!periodeAkhir) {
      newErrors.periodeAkhir = 'Periode akhir is required'
    }
    
    // Check if all rows sum to approximately 1.0
    const kolektibilitasValues = ['1', '2', '3', '4', '5']
    kolektibilitasValues.forEach(fromValue => {
      const rowSum = Object.values(matrixValues[fromValue]).reduce((a, b) => a + b, 0)
      if (Math.abs(rowSum - 1.0) > 0.01) {
        newErrors[`row_${fromValue}`] = `Total probability for row Kol-${fromValue} should be 1.00 (currently ${rowSum.toFixed(2)})`
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = () => {
    if (!validateForm(errors)) return
    
    // Convert matrix to array of MigrationMatrix objects
    const matrixArray: Omit<MigrationMatrix, 'matrix_id'>[] = []
    
    Object.keys(matrixValues).forEach(fromValue => {
      Object.keys(matrixValues[fromValue]).forEach(toValue => {
        matrixArray.push({
          periode_awal: periodeAwal,
          periode_akhir: periodeAkhir,
          dari_kolektibilitas: fromValue,
          ke_kolektibilitas: toValue,
          probability_value: matrixValues[fromValue][toValue],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      })
    })
    
    // Add all matrix values at once
    matrixArray.forEach(matrix => {
      onAdd(matrix as MigrationMatrix)
    })
    
    // Reset form
    setPeriodeAwal('')
    setPeriodeAkhir('')
    setMatrixValues(initializeMatrix())
    setErrors({})
  }
  
  const handleClose = () => {
    // Reset form
    setPeriodeAwal('')
    setPeriodeAkhir('')
    setMatrixValues(initializeMatrix())
    setErrors({})
    onClose()
  }
  
  // Create matrix input form
  const renderMatrixInputs = () => {
    const kolektibilitasValues = ['1', '2', '3', '4', '5']
    
    return (
      <TableContainer component={Paper} variant='outlined' sx={{ mt: 3 }}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>From / To</TableCell>
              {kolektibilitasValues.map(value => (
                <TableCell key={value} align='center' sx={{ fontWeight: 'bold' }}>
                  Kol-{value}
                </TableCell>
              ))}
              <TableCell align='center' sx={{ fontWeight: 'bold' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kolektibilitasValues.map(fromValue => {
              const rowSum = Object.values(matrixValues[fromValue]).reduce((a, b) => a + b, 0)
              const isRowValid = Math.abs(rowSum - 1.0) <= 0.01
              
              return (
                <TableRow key={fromValue}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Kol-{fromValue}</TableCell>
                  {kolektibilitasValues.map(toValue => (
                    <TableCell key={`${fromValue}-${toValue}`} align='center'>
                      <TextField
                        type='number'
                        value={matrixValues[fromValue][toValue]}
                        onChange={(e) => handleMatrixValueChange(
                          fromValue, 
                          toValue, 
                          parseFloat(e.target.value)
                        )}
                        inputProps={{ 
                          min: 0, 
                          max: 1,
                          step: 0.01,
                          style: { textAlign: 'center' }
                        }}
                        size='small'
                        sx={{ width: 70 }}
                      />
                    </TableCell>
                  ))}
                  <TableCell 
                    align='center' 
                    sx={{ 
                      fontWeight: 'bold',
                      color: isRowValid ? 'success.main' : 'error.main'
                    }}
                  >
                    {rowSum.toFixed(2)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='lg' fullWidth>
      <DialogTitle>
        Add New Migration Matrix
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <i className='ri-close-line' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 0 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label='Periode Awal'
              type='date'
              fullWidth
              value={periodeAwal}
              onChange={handlePeriodeAwalChange}
              error={!!errors.periodeAwal}
              helperText={errors.periodeAwal}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='Periode Akhir'
              type='date'
              fullWidth
              value={periodeAkhir}
              onChange={handlePeriodeAkhirChange}
              error={!!errors.periodeAkhir}
              helperText={errors.periodeAkhir}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant='subtitle1'>Migration Matrix Values</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              Enter probability values for transitions between kolektibilitas. Each row must sum to 1.00 (100%).
            </Typography>
            
            {renderMatrixInputs()}
            
            {Object.keys(errors).filter(key => key.startsWith('row_')).map(key => (
              <Alert severity='error' sx={{ mt: 2 }} key={key}>
                {errors[key]}
              </Alert>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          variant='contained' 
          color='primary'
          onClick={handleSubmit}
          disabled={Object.keys(errors).length > 0}
        >
          Add Matrix
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddMigrationMatrixDialog
