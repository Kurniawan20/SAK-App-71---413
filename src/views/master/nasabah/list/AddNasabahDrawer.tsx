'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

// Type Imports
import type { Nasabah } from '@/data/master/nasabahData'

interface AddNasabahDrawerProps {
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

const AddNasabahDrawer = ({ open, onClose, onSubmit, lastId }: AddNasabahDrawerProps) => {
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
        nasabah_id: lastId + 1,
        created_at: now,
        updated_at: now
      })
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400, md: 500 } } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: theme => theme.spacing(3, 4) }}>
        <Typography variant='h6'>Tambah Nasabah Baru</Typography>
        <IconButton onClick={onClose}>
          <i className='ri-close-line' />
        </IconButton>
      </Box>
      
      <Divider sx={{ my: '0 !important' }} />
      
      <Box sx={{ p: theme => theme.spacing(5, 4) }}>
        <Grid container spacing={5}>
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
          
          <Grid item xs={12}>
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
          
          <Grid item xs={12}>
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
          
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='outlined' color='secondary' onClick={onClose} sx={{ mr: 3 }}>
              Batal
            </Button>
            <Button variant='contained' onClick={handleSubmit}>
              Simpan
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  )
}

export default AddNasabahDrawer
