'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'

// Type Imports
import type { Nasabah } from '@/data/master/nasabahData'

// Component Imports
import EditNasabahDialog from './EditNasabahDialog'

interface NasabahListTableProps {
  data: Nasabah[]
  onEdit: (nasabah: Nasabah) => void
  onDelete: (id: number) => void
}

const NasabahListTable = ({ data, onEdit, onDelete }: NasabahListTableProps) => {
  // States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedNasabah, setSelectedNasabah] = useState<Nasabah | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)

  // Computed
  const filteredData = data.filter(
    nasabah =>
      nasabah.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nasabah.no_identitas.includes(searchTerm) ||
      nasabah.segmentasi.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(0)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, nasabah: Nasabah) => {
    setAnchorEl(event.currentTarget)
    setSelectedNasabah(nasabah)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEditClick = () => {
    setEditDialogOpen(true)
    handleMenuClose()
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
    handleMenuClose()
  }

  const handleEditSubmit = (nasabah: Nasabah) => {
    onEdit(nasabah)
    setEditDialogOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (selectedNasabah) {
      onDelete(selectedNasabah.nasabah_id)
      setDeleteDialogOpen(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ p: 5, pb: 3 }}>
        <TextField
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder='Cari nasabah...'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <i className='ri-search-line' />
              </InputAdornment>
            )
          }}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='nasabah table'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Jenis</TableCell>
              <TableCell>No. Identitas</TableCell>
              <TableCell>Segmentasi</TableCell>
              <TableCell>Tanggal Dibuat</TableCell>
              <TableCell>Terakhir Diubah</TableCell>
              <TableCell align='center'>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map(nasabah => (
              <TableRow key={nasabah.nasabah_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component='th' scope='row'>
                  {nasabah.nasabah_id}
                </TableCell>
                <TableCell>{nasabah.nama}</TableCell>
                <TableCell>
                  <Chip
                    label={nasabah.jenis_nasabah}
                    color={nasabah.jenis_nasabah === 'Perorangan' ? 'primary' : 'secondary'}
                    size='small'
                  />
                </TableCell>
                <TableCell>{nasabah.no_identitas}</TableCell>
                <TableCell>
                  <Chip
                    label={nasabah.segmentasi}
                    color={
                      nasabah.segmentasi === 'Retail'
                        ? 'info'
                        : nasabah.segmentasi === 'Commercial'
                        ? 'warning'
                        : 'error'
                    }
                    size='small'
                  />
                </TableCell>
                <TableCell>{formatDate(nasabah.created_at)}</TableCell>
                <TableCell>{formatDate(nasabah.updated_at)}</TableCell>
                <TableCell align='center'>
                  <IconButton onClick={e => handleMenuOpen(e, nasabah)}>
                    <i className='ri-more-2-fill' />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <i className='ri-pencil-line' style={{ marginRight: '8px' }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <i className='ri-delete-bin-line' style={{ marginRight: '8px' }} />
          Hapus
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      {selectedNasabah && (
        <EditNasabahDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          nasabah={selectedNasabah}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus nasabah {selectedNasabah?.nama}? Tindakan ini tidak dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
          <Button onClick={handleDeleteConfirm} color='error'>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default NasabahListTable
