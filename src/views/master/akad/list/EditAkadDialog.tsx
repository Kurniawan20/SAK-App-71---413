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
import type { AkadSyariah } from '@/data/master/akadData'

interface EditAkadDialogProps {
  open: boolean
  onClose: () => void
  akad: AkadSyariah
  onSubmit: (akad: AkadSyariah) => void
}

const EditAkadDialog = ({ open, onClose, akad, onSubmit }: EditAkadDialogProps) => {
  // States
  const [formData, setFormData] = useState<AkadSyariah>(akad)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Effects
  useEffect(() => {
    if (open) {
      setFormData(akad)
      setErrors({})
    }
  }, [open, akad])

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
    
    if (!formData.nama_akad.trim()) {
      newErrors.nama_akad = 'Nama akad harus diisi'
    }
    
    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = 'Deskripsi harus diisi'
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
      <DialogTitle>Edit Akad Syariah</DialogTitle>
      <DialogContent>
        <Grid container spacing={4} sx={{ mt: 0 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Nama Akad'
              name='nama_akad'
              value={formData.nama_akad}
              onChange={handleChange}
              error={!!errors.nama_akad}
              helperText={errors.nama_akad}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id='jenis-akad-label'>Jenis Akad</InputLabel>
              <Select
                labelId='jenis-akad-label'
                name='jenis_akad'
                value={formData.jenis_akad}
                onChange={handleChange}
                label='Jenis Akad'
              >
                <MenuItem value='Murabahah'>Murabahah</MenuItem>
                <MenuItem value='Musyarakah'>Musyarakah</MenuItem>
                <MenuItem value='Mudharabah'>Mudharabah</MenuItem>
                <MenuItem value='Ijarah'>Ijarah</MenuItem>
                <MenuItem value='Istishna'>Istishna</MenuItem>
                <MenuItem value='Salam'>Salam</MenuItem>
                <MenuItem value='Qardh'>Qardh</MenuItem>
                <MenuItem value='Wakalah'>Wakalah</MenuItem>
                <MenuItem value='Kafalah'>Kafalah</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Deskripsi'
              name='deskripsi'
              value={formData.deskripsi}
              onChange={handleChange}
              multiline
              rows={4}
              error={!!errors.deskripsi}
              helperText={errors.deskripsi}
            />
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

export default EditAkadDialog
