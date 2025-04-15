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
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'

// Type Imports
import type { TransaksiSyariah, KolektibilitasType } from '@/data/master/transaksiData'

// Data Imports
import nasabahData from '@/data/master/nasabahData'
import akadData from '@/data/master/akadData'
import { getKolektibilitasLabel } from '@/data/master/transaksiData'

interface AddTransaksiDrawerProps {
  open: boolean
  onClose: () => void
  onSubmit: (transaksi: TransaksiSyariah) => void
  lastId: number
}

const defaultFormData: Omit<TransaksiSyariah, 'transaction_id' | 'created_at' | 'updated_at' | 'nasabah' | 'akad'> = {
  nasabah_id: 0,
  akad_id: 0,
  tanggal_akad: new Date().toISOString().split('T')[0],
  pokok_pembiayaan: 0,
  margin: 0,
  tenor_bulan: 0,
  status_transaksi: 'aktif',
  kolektibilitas_terkini: 1,
  tanggal_update_kolektibilitas: new Date().toISOString().split('T')[0]
}

const AddTransaksiDrawer = ({ open, onClose, onSubmit, lastId }: AddTransaksiDrawerProps) => {
  // States
  const [formData, setFormData] = useState<Omit<TransaksiSyariah, 'transaction_id' | 'created_at' | 'updated_at' | 'nasabah' | 'akad'>>(defaultFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Effects
  useEffect(() => {
    if (open) {
      setFormData({
        ...defaultFormData,
        tanggal_akad: new Date().toISOString().split('T')[0],
        tanggal_update_kolektibilitas: new Date().toISOString().split('T')[0]
      })
      setErrors({})
    }
  }, [open])

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    if (name) {
      // Handle special case for numeric fields
      if (['pokok_pembiayaan', 'margin', 'tenor_bulan', 'nasabah_id', 'akad_id', 'kolektibilitas_terkini'].includes(name)) {
        const numValue = Number(value)
        setFormData(prev => ({ 
          ...prev, 
          [name]: isNaN(numValue) ? 0 : numValue 
        }))
      } else {
        setFormData(prev => ({ ...prev, [name]: value }))
      }
      
      // Clear error when field is changed
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.nasabah_id) {
      newErrors.nasabah_id = 'Nasabah harus dipilih'
    }
    
    if (!formData.akad_id) {
      newErrors.akad_id = 'Akad harus dipilih'
    }
    
    if (!formData.tanggal_akad) {
      newErrors.tanggal_akad = 'Tanggal akad harus diisi'
    }
    
    if (formData.pokok_pembiayaan <= 0) {
      newErrors.pokok_pembiayaan = 'Pokok pembiayaan harus lebih dari 0'
    }
    
    if (formData.tenor_bulan <= 0) {
      newErrors.tenor_bulan = 'Tenor harus lebih dari 0'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const now = new Date().toISOString()
      
      // Get references
      const selectedNasabah = nasabahData.find(n => n.nasabah_id === formData.nasabah_id)
      const selectedAkad = akadData.find(a => a.akad_id === formData.akad_id)
      
      onSubmit({
        ...formData,
        transaction_id: lastId + 1,
        created_at: now,
        updated_at: now,
        nasabah: selectedNasabah,
        akad: selectedAkad
      })
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500, md: 600 } } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: theme => theme.spacing(3, 4) }}>
        <Typography variant='h6'>Tambah Transaksi Syariah Baru</Typography>
        <IconButton onClick={onClose}>
          <i className='ri-close-line' />
        </IconButton>
      </Box>
      
      <Divider sx={{ my: '0 !important' }} />
      
      <Box sx={{ p: theme => theme.spacing(5, 4), overflowY: 'auto' }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.nasabah_id}>
              <InputLabel id='nasabah-label'>Nasabah</InputLabel>
              <Select
                labelId='nasabah-label'
                name='nasabah_id'
                value={formData.nasabah_id}
                onChange={handleChange}
                label='Nasabah'
              >
                <MenuItem value={0} disabled>Pilih Nasabah</MenuItem>
                {nasabahData.map(nasabah => (
                  <MenuItem key={nasabah.nasabah_id} value={nasabah.nasabah_id}>
                    {nasabah.nama} ({nasabah.jenis_nasabah})
                  </MenuItem>
                ))}
              </Select>
              {errors.nasabah_id && <FormHelperText>{errors.nasabah_id}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.akad_id}>
              <InputLabel id='akad-label'>Akad</InputLabel>
              <Select
                labelId='akad-label'
                name='akad_id'
                value={formData.akad_id}
                onChange={handleChange}
                label='Akad'
              >
                <MenuItem value={0} disabled>Pilih Akad</MenuItem>
                {akadData.map(akad => (
                  <MenuItem key={akad.akad_id} value={akad.akad_id}>
                    {akad.nama_akad} ({akad.jenis_akad})
                  </MenuItem>
                ))}
              </Select>
              {errors.akad_id && <FormHelperText>{errors.akad_id}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Tanggal Akad'
              name='tanggal_akad'
              type='date'
              value={formData.tanggal_akad}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errors.tanggal_akad}
              helperText={errors.tanggal_akad}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Tenor (Bulan)'
              name='tenor_bulan'
              type='number'
              value={formData.tenor_bulan}
              onChange={handleChange}
              error={!!errors.tenor_bulan}
              helperText={errors.tenor_bulan}
              InputProps={{
                endAdornment: <InputAdornment position='end'>bulan</InputAdornment>
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Pokok Pembiayaan'
              name='pokok_pembiayaan'
              type='number'
              value={formData.pokok_pembiayaan}
              onChange={handleChange}
              error={!!errors.pokok_pembiayaan}
              helperText={errors.pokok_pembiayaan}
              InputProps={{
                startAdornment: <InputAdornment position='start'>Rp</InputAdornment>
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Margin'
              name='margin'
              type='number'
              value={formData.margin}
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position='start'>Rp</InputAdornment>
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='status-label'>Status Transaksi</InputLabel>
              <Select
                labelId='status-label'
                name='status_transaksi'
                value={formData.status_transaksi}
                onChange={handleChange}
                label='Status Transaksi'
              >
                <MenuItem value='aktif'>Aktif</MenuItem>
                <MenuItem value='lunas'>Lunas</MenuItem>
                <MenuItem value='macet'>Macet</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='kolektibilitas-label'>Kolektibilitas</InputLabel>
              <Select
                labelId='kolektibilitas-label'
                name='kolektibilitas_terkini'
                value={formData.kolektibilitas_terkini}
                onChange={handleChange}
                label='Kolektibilitas'
              >
                {[1, 2, 3, 4, 5].map(kol => (
                  <MenuItem key={kol} value={kol}>
                    {kol} - {getKolektibilitasLabel(kol as KolektibilitasType)}
                  </MenuItem>
                ))}
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

export default AddTransaksiDrawer
