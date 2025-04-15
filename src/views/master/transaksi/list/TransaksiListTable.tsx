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
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

// Core Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog'

// Type Imports
import type { TransaksiSyariah, KolektibilitasType } from '@/data/master/transaksiData'

// Component Imports
import EditTransaksiDialog from './EditTransaksiDialog'

// Helper Imports
import { formatCurrency, getKolektibilitasLabel, getKolektibilitasColor } from '@/data/master/transaksiData'

interface TransaksiListTableProps {
  data: TransaksiSyariah[]
  onEdit: (transaksi: TransaksiSyariah) => void
  onDelete: (id: number) => void
}

// Helper function to get status color
const getStatusColor = (status: TransaksiSyariah['status_transaksi']): 'success' | 'warning' | 'error' => {
  const colorMap = {
    'aktif': 'success',
    'lunas': 'warning',
    'macet': 'error'
  } as const
  
  return colorMap[status]
}

const TransaksiListTable = ({ data, onEdit, onDelete }: TransaksiListTableProps) => {
  // States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedTransaksi, setSelectedTransaksi] = useState<TransaksiSyariah | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)

  // Computed
  const filteredData = data.filter(
    transaksi =>
      (transaksi.nasabah?.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaksi.akad?.nama_akad || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaksi.transaction_id.toString().includes(searchTerm) ||
      transaksi.status_transaksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getKolektibilitasLabel(transaksi.kolektibilitas_terkini).toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleEditClick = (transaksi: TransaksiSyariah) => {
    setSelectedTransaksi(transaksi)
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (transaksi: TransaksiSyariah) => {
    setSelectedTransaksi(transaksi)
    setDeleteDialogOpen(true)
  }

  const handleEditSubmit = (transaksi: TransaksiSyariah) => {
    onEdit(transaksi)
    setEditDialogOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (selectedTransaksi) {
      onDelete(selectedTransaksi.transaction_id)
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
          placeholder='Cari transaksi...'
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
        <Table sx={{ minWidth: 650 }} aria-label='transaksi syariah table'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nasabah</TableCell>
              <TableCell>Akad</TableCell>
              <TableCell>Tanggal Akad</TableCell>
              <TableCell>Pokok</TableCell>
              <TableCell>Margin</TableCell>
              <TableCell>Tenor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Kolektibilitas</TableCell>
              <TableCell align='center'>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map(transaksi => (
              <TableRow key={transaksi.transaction_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component='th' scope='row'>
                  {transaksi.transaction_id}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar 
                      skin='light'
                      color={transaksi.nasabah?.jenis_nasabah === 'Perorangan' ? 'primary' : 'secondary'}
                      sx={{ mr: 2, width: 30, height: 30 }}
                    >
                      <i className={transaksi.nasabah?.jenis_nasabah === 'Perorangan' ? 'ri-user-line' : 'ri-building-line'} style={{ fontSize: '0.875rem' }} />
                    </CustomAvatar>
                    <Typography variant='body2'>{transaksi.nasabah?.nama || '-'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title={transaksi.akad?.deskripsi || ''}>
                    <Chip
                      label={transaksi.akad?.nama_akad || '-'}
                      size='small'
                      color='primary'
                      variant='outlined'
                    />
                  </Tooltip>
                </TableCell>
                <TableCell>{formatDate(transaksi.tanggal_akad)}</TableCell>
                <TableCell>{formatCurrency(transaksi.pokok_pembiayaan)}</TableCell>
                <TableCell>{formatCurrency(transaksi.margin)}</TableCell>
                <TableCell>{transaksi.tenor_bulan} bulan</TableCell>
                <TableCell>
                  <Chip
                    label={transaksi.status_transaksi.toUpperCase()}
                    color={getStatusColor(transaksi.status_transaksi)}
                    size='small'
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${transaksi.kolektibilitas_terkini} - ${getKolektibilitasLabel(transaksi.kolektibilitas_terkini)}`}
                    color={getKolektibilitasColor(transaksi.kolektibilitas_terkini)}
                    size='small'
                  />
                </TableCell>
                <TableCell align='center'>
                  <OptionMenu
                    iconButtonProps={{ size: 'small' }}
                    options={[
                      {
                        text: 'Edit',
                        icon: 'ri-pencil-line',
                        menuItemProps: { onClick: () => handleEditClick(transaksi) }
                      },
                      {
                        text: 'Hapus',
                        icon: 'ri-delete-bin-line',
                        menuItemProps: { onClick: () => handleDeleteClick(transaksi) }
                      }
                    ]}
                  />
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

      {/* No Action Menu needed here as we're using OptionMenu in the table */}

      {/* Edit Dialog */}
      {selectedTransaksi && (
        <EditTransaksiDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          transaksi={selectedTransaksi}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        type="delete-customer"
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  )
}

export default TransaksiListTable
