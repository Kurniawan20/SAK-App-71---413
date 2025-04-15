'use client'

// React Imports
import { FC, useState, useEffect } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import InputAdornment from '@mui/material/InputAdornment'
import Avatar from '@mui/material/Avatar'

// React Icons
import { 
  AiOutlineSearch, 
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlineInfoCircle,
  AiOutlineDownload,
  AiOutlineFilter,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineWarning,
  AiOutlineHistory
} from 'react-icons/ai'

// Type Imports
import type { 
  ActivityLog,
  ActivityType,
  ActivityStatus,
  User
} from '@/data/admin/userData'

// Data Imports
import { 
  getActivityLogs,
  getActivityLogsByType,
  getActivityLogsByStatus,
  getActivityLogsByUser,
  getActivityLogsByDateRange,
  getUsers
} from '@/data/admin/userData'

interface ActivityLogsProps {
  // You can add props here if needed
}

const ActivityLogs: FC<ActivityLogsProps> = () => {
  // States
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [userFilter, setUserFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false)
  
  // Load data
  useEffect(() => {
    const loadData = () => {
      const logsData = getActivityLogs()
      const usersData = getUsers()
      
      setLogs(logsData)
      setFilteredLogs(logsData)
      setUsers(usersData)
      
      // Set default date range to last 7 days
      const today = new Date()
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 7)
      
      setStartDate(sevenDaysAgo.toISOString().split('T')[0])
      setEndDate(today.toISOString().split('T')[0])
    }
    
    loadData()
  }, [])
  
  // Apply filters
  useEffect(() => {
    let result = logs
    
    // Apply date range filter
    if (startDate && endDate) {
      result = getActivityLogsByDateRange(startDate, endDate)
    }
    
    // Apply user filter
    if (userFilter !== 'all') {
      const userId = parseInt(userFilter)
      result = result.filter(log => log.user_id === userId)
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(log => log.activity_type === typeFilter)
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(log => log.status === statusFilter)
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        log =>
          log.username.toLowerCase().includes(query) ||
          log.activity_description.toLowerCase().includes(query) ||
          log.module.toLowerCase().includes(query) ||
          (log.details && log.details.toLowerCase().includes(query))
      )
    }
    
    setFilteredLogs(result)
    setPage(0) // Reset to first page when filters change
  }, [logs, userFilter, typeFilter, statusFilter, startDate, endDate, searchQuery])
  
  // Handler for search query change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }
  
  // Handler for user filter change
  const handleUserFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserFilter(event.target.value)
  }
  
  // Handler for type filter change
  const handleTypeFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypeFilter(event.target.value)
  }
  
  // Handler for status filter change
  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(event.target.value)
  }
  
  // Handler for start date change
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value)
  }
  
  // Handler for end date change
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value)
  }
  
  // Handler for opening details dialog
  const handleOpenDetailsDialog = (log: ActivityLog) => {
    setSelectedLog(log)
    setDetailsDialogOpen(true)
  }
  
  // Handler for closing details dialog
  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false)
    setSelectedLog(null)
  }
  
  // Handler for page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }
  
  // Handler for rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  
  // Handler for exporting logs
  const handleExportLogs = () => {
    // In a real application, this would call an API to export the logs
    alert('Exporting activity logs')
  }
  
  // Handler for clearing filters
  const handleClearFilters = () => {
    setSearchQuery('')
    setUserFilter('all')
    setTypeFilter('all')
    setStatusFilter('all')
    
    // Reset date range to last 7 days
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)
    
    setStartDate(sevenDaysAgo.toISOString().split('T')[0])
    setEndDate(today.toISOString().split('T')[0])
  }
  
  // Handler for toggling filter expansion
  const handleToggleFilterExpansion = () => {
    setIsFilterExpanded(!isFilterExpanded)
  }
  
  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }
  
  // Get status color
  const getStatusColor = (status: ActivityStatus): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'Success':
        return 'success'
      case 'Failed':
        return 'error'
      case 'Warning':
        return 'warning'
      default:
        return 'default'
    }
  }
  
  // Get status icon
  const getStatusIcon = (status: ActivityStatus) => {
    switch (status) {
      case 'Success':
        return <AiOutlineCheck />
      case 'Failed':
        return <AiOutlineClose />
      case 'Warning':
        return <AiOutlineWarning />
      default:
        return null
    }
  }
  
  // Get type color
  const getTypeColor = (type: ActivityType): 'primary' | 'success' | 'error' | 'warning' | 'info' | 'default' => {
    switch (type) {
      case 'Login':
      case 'Logout':
        return 'primary'
      case 'Create':
        return 'success'
      case 'Update':
        return 'info'
      case 'Delete':
        return 'error'
      case 'Export':
      case 'Import':
        return 'default'
      case 'Approve':
      case 'Reject':
        return 'warning'
      default:
        return 'default'
    }
  }
  
  // Get user by ID
  const getUserById = (userId: number): User | undefined => {
    return users.find(user => user.user_id === userId)
  }
  
  // Get user initials for avatar
  const getUserInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }
  
  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        Activity Logs
      </Typography>
      
      <Card variant='outlined' sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder='Search logs...'
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AiOutlineSearch />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  label='Start Date'
                  type='date'
                  value={startDate}
                  onChange={handleStartDateChange}
                  InputLabelProps={{
                    shrink: true
                  }}
                  size='small'
                />
                
                <TextField
                  label='End Date'
                  type='date'
                  value={endDate}
                  onChange={handleEndDateChange}
                  InputLabelProps={{
                    shrink: true
                  }}
                  size='small'
                />
                
                <Button
                  variant='outlined'
                  startIcon={isFilterExpanded ? <AiOutlineFilter /> : <AiOutlineFilter />}
                  onClick={handleToggleFilterExpansion}
                  size='small'
                >
                  {isFilterExpanded ? 'Hide Filters' : 'More Filters'}
                </Button>
                
                <Box sx={{ flexGrow: 1 }} />
                
                <Button
                  variant='outlined'
                  startIcon={<AiOutlineDownload />}
                  onClick={handleExportLogs}
                  size='small'
                >
                  Export Logs
                </Button>
              </Box>
            </Grid>
            
            {isFilterExpanded && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size='small'>
                    <InputLabel>User</InputLabel>
                    <Select
                      value={userFilter}
                      label='User'
                      onChange={handleUserFilterChange}
                    >
                      <MenuItem value='all'>All Users</MenuItem>
                      {users.map(user => (
                        <MenuItem key={user.user_id} value={user.user_id.toString()}>
                          {user.full_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size='small'>
                    <InputLabel>Activity Type</InputLabel>
                    <Select
                      value={typeFilter}
                      label='Activity Type'
                      onChange={handleTypeFilterChange}
                    >
                      <MenuItem value='all'>All Types</MenuItem>
                      <MenuItem value='Login'>Login</MenuItem>
                      <MenuItem value='Logout'>Logout</MenuItem>
                      <MenuItem value='Create'>Create</MenuItem>
                      <MenuItem value='Update'>Update</MenuItem>
                      <MenuItem value='Delete'>Delete</MenuItem>
                      <MenuItem value='Export'>Export</MenuItem>
                      <MenuItem value='Import'>Import</MenuItem>
                      <MenuItem value='Approve'>Approve</MenuItem>
                      <MenuItem value='Reject'>Reject</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size='small'>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label='Status'
                      onChange={handleStatusFilterChange}
                    >
                      <MenuItem value='all'>All Statuses</MenuItem>
                      <MenuItem value='Success'>Success</MenuItem>
                      <MenuItem value='Failed'>Failed</MenuItem>
                      <MenuItem value='Warning'>Warning</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Button
                    variant='outlined'
                    onClick={handleClearFilters}
                    fullWidth
                  >
                    Clear Filters
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
      
      <Card variant='outlined'>
        <CardHeader 
          title={`Activity Logs (${filteredLogs.length})`}
          subheader={`Showing logs from ${formatDate(startDate + 'T00:00:00')} to ${formatDate(endDate + 'T23:59:59')}`}
        />
        <Divider />
        <CardContent>
          {filteredLogs.length === 0 ? (
            <Alert severity='info'>
              No activity logs found matching the current filters.
            </Alert>
          ) : (
            <>
              <TableContainer component={Paper} variant='outlined'>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Activity</TableCell>
                      <TableCell>Module</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLogs
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(log => {
                        const user = getUserById(log.user_id)
                        
                        return (
                          <TableRow key={log.activity_id}>
                            <TableCell>{formatDate(log.timestamp)}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar 
                                  src={user?.profile_image} 
                                  alt={user?.full_name || log.username}
                                  sx={{ width: 30, height: 30, mr: 1 }}
                                >
                                  {!user?.profile_image && getUserInitials(user?.full_name || log.username)}
                                </Avatar>
                                <Typography variant='body2'>{log.username}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Chip 
                                  label={log.activity_type}
                                  size='small'
                                  color={getTypeColor(log.activity_type)}
                                  sx={{ mr: 1 }}
                                />
                                <Typography variant='body2'>{log.activity_description}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{log.module}</TableCell>
                            <TableCell>{log.ip_address}</TableCell>
                            <TableCell>
                              <Chip 
                                icon={getStatusIcon(log.status)}
                                label={log.status}
                                size='small'
                                color={getStatusColor(log.status)}
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title='View Details'>
                                <IconButton
                                  size='small'
                                  color='primary'
                                  onClick={() => handleOpenDetailsDialog(log)}
                                >
                                  <AiOutlineInfoCircle />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                component='div'
                count={filteredLogs.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50, 100]}
              />
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>
          Activity Log Details
        </DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant='outlined'>
                  <CardHeader title='Activity Information' />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Activity Type:</Typography>
                        <Chip 
                          label={selectedLog.activity_type}
                          size='small'
                          color={getTypeColor(selectedLog.activity_type)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Status:</Typography>
                        <Chip 
                          icon={getStatusIcon(selectedLog.status)}
                          label={selectedLog.status}
                          size='small'
                          color={getStatusColor(selectedLog.status)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='subtitle2'>Description:</Typography>
                        <Typography variant='body2'>{selectedLog.activity_description}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Module:</Typography>
                        <Typography variant='body2'>{selectedLog.module}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Timestamp:</Typography>
                        <Typography variant='body2'>{formatDate(selectedLog.timestamp)}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant='outlined'>
                  <CardHeader title='User Information' />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar 
                            src={getUserById(selectedLog.user_id)?.profile_image} 
                            alt={getUserById(selectedLog.user_id)?.full_name || selectedLog.username}
                            sx={{ width: 40, height: 40, mr: 2 }}
                          >
                            {!getUserById(selectedLog.user_id)?.profile_image && 
                              getUserInitials(getUserById(selectedLog.user_id)?.full_name || selectedLog.username)}
                          </Avatar>
                          <Box>
                            <Typography variant='subtitle2'>{getUserById(selectedLog.user_id)?.full_name || 'Unknown User'}</Typography>
                            <Typography variant='caption' color='text.secondary'>
                              {selectedLog.username}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>User ID:</Typography>
                        <Typography variant='body2'>{selectedLog.user_id}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>IP Address:</Typography>
                        <Typography variant='body2'>{selectedLog.ip_address}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='subtitle2'>Department:</Typography>
                        <Typography variant='body2'>{getUserById(selectedLog.user_id)?.department || 'Unknown'}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              {selectedLog.details && (
                <Grid item xs={12}>
                  <Card variant='outlined'>
                    <CardHeader title='Additional Details' />
                    <Divider />
                    <CardContent>
                      <Typography variant='body2'>{selectedLog.details}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ActivityLogs
