'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'

// Type Imports
import type { Nasabah } from '@/data/master/nasabahData'

interface EditNasabahDialogProps {
  open: boolean
  onClose: () => void
  nasabah: Nasabah
  onSubmit: (nasabah: Nasabah) => void
}

const EditNasabahDialog = ({ open, onClose, nasabah, onSubmit }: EditNasabahDialogProps) => {
  // States
  const [formData, setFormData] = useState<Nasabah>(nasabah)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Effects
  useEffect(() => {
    if (open) {
      setFormData(nasabah)
      setErrors({})
    }
  }, [open, nasabah])

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
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
        updated_at: now
      })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Edit Nasabah</DialogTitle>
      <DialogContent>
        <Grid container spacing={4} sx={{ mt: 0 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Nama'
              name='nama'
              value={formData.nama}
              onChange={handleChange}
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
              onChange={handleChange}
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
                onChange={handleChange}
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
              onChange={handleChange}
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
                onChange={handleChange}
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
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button onClick={handleSubmit} variant='contained'>Simpan</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditNasabahDialog
