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
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

// Type Imports
import type { AkadSyariah } from '@/data/master/akadData'

// Component Imports
import EditAkadDialog from './EditAkadDialog'

interface AkadListTableProps {
  data: AkadSyariah[]
  onEdit: (akad: AkadSyariah) => void
  onDelete: (id: number) => void
}

// Helper function to get color based on jenis_akad
const getAkadColor = (jenisAkad: AkadSyariah['jenis_akad']) => {
  const colorMap: Record<AkadSyariah['jenis_akad'], 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    'Murabahah': 'primary',
    'Musyarakah': 'secondary',
    'Mudharabah': 'error',
    'Ijarah': 'warning',
    'Istishna': 'info',
    'Salam': 'success',
    'Qardh': 'primary',
    'Wakalah': 'secondary',
    'Kafalah': 'error'
  }
  
  return colorMap[jenisAkad]
}

const AkadListTable = ({ data, onEdit, onDelete }: AkadListTableProps) => {
  // States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedAkad, setSelectedAkad] = useState<AkadSyariah | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)

  // Computed
  const filteredData = data.filter(
    akad =>
      akad.nama_akad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      akad.jenis_akad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      akad.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, akad: AkadSyariah) => {
    setAnchorEl(event.currentTarget)
    setSelectedAkad(akad)
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

  const handleEditSubmit = (akad: AkadSyariah) => {
    onEdit(akad)
    setEditDialogOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (selectedAkad) {
      onDelete(selectedAkad.akad_id)
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
          placeholder='Cari akad syariah...'
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
        <Table sx={{ minWidth: 650 }} aria-label='akad syariah table'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nama Akad</TableCell>
              <TableCell>Jenis Akad</TableCell>
              <TableCell>Deskripsi</TableCell>
              <TableCell>Tanggal Dibuat</TableCell>
              <TableCell>Terakhir Diubah</TableCell>
              <TableCell align='center'>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map(akad => (
              <TableRow key={akad.akad_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component='th' scope='row'>
                  {akad.akad_id}
                </TableCell>
                <TableCell>{akad.nama_akad}</TableCell>
                <TableCell>
                  <Chip
                    label={akad.jenis_akad}
                    color={getAkadColor(akad.jenis_akad)}
                    size='small'
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title={akad.deskripsi}>
                    <Typography noWrap sx={{ maxWidth: 300 }}>
                      {akad.deskripsi}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{formatDate(akad.created_at)}</TableCell>
                <TableCell>{formatDate(akad.updated_at)}</TableCell>
                <TableCell align='center'>
                  <IconButton onClick={e => handleMenuOpen(e, akad)}>
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
      {selectedAkad && (
        <EditAkadDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          akad={selectedAkad}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus akad {selectedAkad?.nama_akad}? Tindakan ini tidak dapat dibatalkan.
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

export default AkadListTable
