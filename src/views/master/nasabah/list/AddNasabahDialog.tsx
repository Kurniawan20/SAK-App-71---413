'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'

// Type Imports
import type { Nasabah } from '@/data/master/nasabahData'

interface AddNasabahDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (nasabah: Nasabah) => void
  lastId: number
}

const defaultFormData: Omit<Nasabah, 'nasabah_id' | 'created_at' | 'updated_at'> = {
  nama: '',
  alamat: '',
  jenis_nasabah: 'Perorangan',
  no_identitas: '',
  segmentasi: 'Retail'
}

const AddNasabahDialog = ({ open, onClose, onSubmit, lastId }: AddNasabahDialogProps) => {
  // States
  const [formData, setFormData] = useState<Omit<Nasabah, 'nasabah_id' | 'created_at' | 'updated_at'>>(defaultFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Effects
  useEffect(() => {
    if (open) {
      setFormData(defaultFormData)
      setErrors({})
    }
  }, [open])

  // Handlers
  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }))
      
      // Clear error when field is changed
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    }
  }
  
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }))
      
      // Clear error when field is changed
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama nasabah harus diisi'
    }
    
    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat harus diisi'
    }
    
    if (!formData.no_identitas.trim()) {
      newErrors.no_identitas = 'No. Identitas harus diisi'
    } else if (
      (formData.jenis_nasabah === 'Perorangan' && formData.no_identitas.length !== 16) ||
      (formData.jenis_nasabah === 'Korporasi' && formData.no_identitas.length !== 13)
    ) {
      newErrors.no_identitas = formData.jenis_nasabah === 'Perorangan' 
        ? 'No. KTP harus 16 digit' 
        : 'No. NPWP harus 13 digit'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const now = new Date().toISOString()
      onSubmit({
        ...formData,
        nasabah_id: lastId + 1,
        created_at: now,
        updated_at: now
      })
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: 6
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: theme => theme.spacing(3, 4) }}>
        <Typography variant='h6'>Tambah Nasabah Baru</Typography>
        <IconButton onClick={onClose} edge="end" aria-label="close">
          <i className='ri-close-line' />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: theme => theme.spacing(4) }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Nama'
              name='nama'
              value={formData.nama}
              onChange={handleTextFieldChange}
              error={!!errors.nama}
              helperText={errors.nama}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Alamat'
              name='alamat'
              value={formData.alamat}
              onChange={handleTextFieldChange}
              multiline
              rows={3}
              error={!!errors.alamat}
              helperText={errors.alamat}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='jenis-nasabah-label'>Jenis Nasabah</InputLabel>
              <Select
                labelId='jenis-nasabah-label'
                name='jenis_nasabah'
                value={formData.jenis_nasabah}
                onChange={handleSelectChange}
                label='Jenis Nasabah'
              >
                <MenuItem value='Perorangan'>Perorangan</MenuItem>
                <MenuItem value='Korporasi'>Korporasi</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={formData.jenis_nasabah === 'Perorangan' ? 'No. KTP' : 'No. NPWP'}
              name='no_identitas'
              value={formData.no_identitas}
              onChange={handleTextFieldChange}
              error={!!errors.no_identitas}
              helperText={errors.no_identitas}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id='segmentasi-label'>Segmentasi</InputLabel>
              <Select
                labelId='segmentasi-label'
                name='segmentasi'
                value={formData.segmentasi}
                onChange={handleSelectChange}
                label='Segmentasi'
              >
                <MenuItem value='Retail'>Retail</MenuItem>
                <MenuItem value='Commercial'>Commercial</MenuItem>
                <MenuItem value='Corporate'>Corporate</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 4, py: 3, justifyContent: 'flex-end' }}>
        <Button variant='outlined' color='secondary' onClick={onClose}>
          Batal
        </Button>
        <Button variant='contained' onClick={handleSubmit} sx={{ ml: 2 }}>
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddNasabahDialog
