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
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import Switch from '@mui/material/Switch'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

// React Icons
import { 
  AiOutlineUser, 
  AiOutlineMail, 
  AiOutlinePhone,
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineCheck,
  AiOutlineStop,
  AiOutlineWarning,
  AiOutlineHistory
} from 'react-icons/ai'

// Type Imports
import type { 
  User,
  UserStatus,
  UserRole,
  Department,
  Role
} from '@/data/admin/userData'

// Data Imports
import { 
  getUsers,
  getRoles,
  getUsersByRole,
  getUsersByDepartment,
  getUsersByStatus
} from '@/data/admin/userData'

interface UserManagementProps {
  // You can add props here if needed
}

const UserManagement: FC<UserManagementProps> = () => {
  // States
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userDialogOpen, setUserDialogOpen] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState<boolean>(false)
  const [statusFilterValue, setStatusFilterValue] = useState<string>('all')
  const [roleFilterValue, setRoleFilterValue] = useState<string>('all')
  const [departmentFilterValue, setDepartmentFilterValue] = useState<string>('all')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  
  // Form states
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    department: '',
    role: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    is_mfa_enabled: false
  })
  
  // Load data
  useEffect(() => {
    const loadData = () => {
      const usersData = getUsers()
      const rolesData = getRoles()
      
      setUsers(usersData)
      setFilteredUsers(usersData)
      setRoles(rolesData)
    }
    
    loadData()
  }, [])
  
  // Apply filters
  useEffect(() => {
    let result = users
    
    // Apply status filter
    if (statusFilterValue !== 'all') {
      result = getUsersByStatus(statusFilterValue as UserStatus)
    }
    
    // Apply role filter
    if (roleFilterValue !== 'all') {
      result = result.filter(user => user.role === roleFilterValue)
    }
    
    // Apply department filter
    if (departmentFilterValue !== 'all') {
      result = result.filter(user => user.department === departmentFilterValue)
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        user =>
          user.username.toLowerCase().includes(query) ||
          user.full_name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      )
    }
    
    setFilteredUsers(result)
  }, [users, statusFilterValue, roleFilterValue, departmentFilterValue, searchQuery])
  
  // Handler for search query change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }
  
  // Handler for status filter change
  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilterValue(event.target.value)
  }
  
  // Handler for role filter change
  const handleRoleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoleFilterValue(event.target.value)
  }
  
  // Handler for department filter change
  const handleDepartmentFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDepartmentFilterValue(event.target.value)
  }
  
  // Handler for opening user dialog in create mode
  const handleOpenCreateUserDialog = () => {
    setIsEditMode(false)
    setSelectedUser(null)
    setFormData({
      username: '',
      full_name: '',
      email: '',
      department: '',
      role: '',
      phone_number: '',
      password: '',
      confirm_password: '',
      is_mfa_enabled: false
    })
    setUserDialogOpen(true)
  }
  
  // Handler for opening user dialog in edit mode
  const handleOpenEditUserDialog = (user: User) => {
    setIsEditMode(true)
    setSelectedUser(user)
    setFormData({
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      department: user.department,
      role: user.role,
      phone_number: user.phone_number || '',
      password: '',
      confirm_password: '',
      is_mfa_enabled: user.is_mfa_enabled
    })
    setUserDialogOpen(true)
  }
  
  // Handler for closing user dialog
  const handleCloseUserDialog = () => {
    setUserDialogOpen(false)
    setSelectedUser(null)
    setShowPassword(false)
  }
  
  // Handler for opening delete dialog
  const handleOpenDeleteDialog = (user: User) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }
  
  // Handler for closing delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setSelectedUser(null)
  }
  
  // Handler for opening reset password dialog
  const handleOpenResetPasswordDialog = (user: User) => {
    setSelectedUser(user)
    setResetPasswordDialogOpen(true)
  }
  
  // Handler for closing reset password dialog
  const handleCloseResetPasswordDialog = () => {
    setResetPasswordDialogOpen(false)
    setSelectedUser(null)
  }
  
  // Handler for form field changes
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Handler for toggling password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  
  // Handler for saving user
  const handleSaveUser = () => {
    // In a real application, this would call an API to save the user
    alert(`${isEditMode ? 'Updated' : 'Created'} user: ${formData.username}`)
    
    // Close the dialog
    handleCloseUserDialog()
  }
  
  // Handler for deleting user
  const handleDeleteUser = () => {
    // In a real application, this would call an API to delete the user
    alert(`Deleted user: ${selectedUser?.username}`)
    
    // Close the dialog
    handleCloseDeleteDialog()
  }
  
  // Handler for resetting password
  const handleResetPassword = () => {
    // In a real application, this would call an API to reset the password
    alert(`Reset password for user: ${selectedUser?.username}`)
    
    // Close the dialog
    handleCloseResetPasswordDialog()
  }
  
  // Handler for changing user status
  const handleChangeUserStatus = (user: User, newStatus: UserStatus) => {
    // In a real application, this would call an API to change the user status
    alert(`Changed status for ${user.username} to ${newStatus}`)
  }
  
  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Never'
    
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Get status color
  const getStatusColor = (status: UserStatus): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'Active':
        return 'success'
      case 'Inactive':
        return 'default'
      case 'Locked':
        return 'error'
      case 'Pending':
        return 'warning'
      default:
        return 'default'
    }
  }
  
  // Get status icon
  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case 'Active':
        return <AiOutlineCheck />
      case 'Inactive':
        return <AiOutlineStop />
      case 'Locked':
        return <AiOutlineLock />
      case 'Pending':
        return <AiOutlineWarning />
      default:
        return null
    }
  }
  
  // Check if form is valid
  const isFormValid = (): boolean => {
    if (
      !formData.username ||
      !formData.full_name ||
      !formData.email ||
      !formData.department ||
      !formData.role
    ) {
      return false
    }
    
    if (!isEditMode && (!formData.password || !formData.confirm_password)) {
      return false
    }
    
    if (formData.password !== formData.confirm_password) {
      return false
    }
    
    return true
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
        User Management
      </Typography>
      
      <Card variant='outlined' sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder='Search users...'
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
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl size='small' sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilterValue}
                    label='Status'
                    onChange={handleStatusFilterChange}
                  >
                    <MenuItem value='all'>All Statuses</MenuItem>
                    <MenuItem value='Active'>Active</MenuItem>
                    <MenuItem value='Inactive'>Inactive</MenuItem>
                    <MenuItem value='Locked'>Locked</MenuItem>
                    <MenuItem value='Pending'>Pending</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size='small' sx={{ minWidth: 120 }}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={roleFilterValue}
                    label='Role'
                    onChange={handleRoleFilterChange}
                  >
                    <MenuItem value='all'>All Roles</MenuItem>
                    <MenuItem value='Admin'>Admin</MenuItem>
                    <MenuItem value='Manager'>Manager</MenuItem>
                    <MenuItem value='Analyst'>Analyst</MenuItem>
                    <MenuItem value='Auditor'>Auditor</MenuItem>
                    <MenuItem value='Viewer'>Viewer</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size='small' sx={{ minWidth: 150 }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={departmentFilterValue}
                    label='Department'
                    onChange={handleDepartmentFilterChange}
                  >
                    <MenuItem value='all'>All Departments</MenuItem>
                    <MenuItem value='Risk Management'>Risk Management</MenuItem>
                    <MenuItem value='Finance'>Finance</MenuItem>
                    <MenuItem value='Compliance'>Compliance</MenuItem>
                    <MenuItem value='Treasury'>Treasury</MenuItem>
                    <MenuItem value='IT'>IT</MenuItem>
                    <MenuItem value='Operations'>Operations</MenuItem>
                  </Select>
                </FormControl>
                
                <Box sx={{ flexGrow: 1 }} />
                
                <Button
                  variant='contained'
                  startIcon={<AiOutlinePlus />}
                  onClick={handleOpenCreateUserDialog}
                >
                  Add User
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Card variant='outlined'>
        <CardHeader 
          title={`Users (${filteredUsers.length})`}
        />
        <Divider />
        <CardContent>
          {filteredUsers.length === 0 ? (
            <Alert severity='info'>
              No users found matching the current filters.
            </Alert>
          ) : (
            <TableContainer component={Paper} variant='outlined'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={user.profile_image} 
                            alt={user.full_name}
                            sx={{ mr: 2 }}
                          >
                            {!user.profile_image && getUserInitials(user.full_name)}
                          </Avatar>
                          <Box>
                            <Typography variant='subtitle2'>{user.full_name}</Typography>
                            <Typography variant='caption' color='text.secondary'>
                              {user.username}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role}
                          size='small'
                          color={user.role === 'Admin' ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={getStatusIcon(user.status)}
                          label={user.status}
                          size='small'
                          color={getStatusColor(user.status)}
                        />
                      </TableCell>
                      <TableCell>{formatDate(user.last_login)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title='Edit User'>
                            <IconButton
                              size='small'
                              color='primary'
                              onClick={() => handleOpenEditUserDialog(user)}
                            >
                              <AiOutlineEdit />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title='Reset Password'>
                            <IconButton
                              size='small'
                              color='warning'
                              onClick={() => handleOpenResetPasswordDialog(user)}
                            >
                              <AiOutlineLock />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title='Delete User'>
                            <IconButton
                              size='small'
                              color='error'
                              onClick={() => handleOpenDeleteDialog(user)}
                            >
                              <AiOutlineDelete />
                            </IconButton>
                          </Tooltip>
                          
                          {user.status !== 'Active' && (
                            <Tooltip title='Activate User'>
                              <IconButton
                                size='small'
                                color='success'
                                onClick={() => handleChangeUserStatus(user, 'Active')}
                              >
                                <AiOutlineCheck />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {user.status === 'Active' && (
                            <Tooltip title='Deactivate User'>
                              <IconButton
                                size='small'
                                color='default'
                                onClick={() => handleChangeUserStatus(user, 'Inactive')}
                              >
                                <AiOutlineStop />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      
      {/* User Dialog */}
      <Dialog
        open={userDialogOpen}
        onClose={handleCloseUserDialog}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label='Username'
                value={formData.username}
                onChange={(e) => handleFormChange('username', e.target.value)}
                fullWidth
                required
                disabled={isEditMode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AiOutlineUser />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label='Full Name'
                value={formData.full_name}
                onChange={(e) => handleFormChange('full_name', e.target.value)}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label='Email'
                type='email'
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AiOutlineMail />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label='Phone Number'
                value={formData.phone_number}
                onChange={(e) => handleFormChange('phone_number', e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AiOutlinePhone />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  label='Department'
                  onChange={(e) => handleFormChange('department', e.target.value)}
                >
                  <MenuItem value='Risk Management'>Risk Management</MenuItem>
                  <MenuItem value='Finance'>Finance</MenuItem>
                  <MenuItem value='Compliance'>Compliance</MenuItem>
                  <MenuItem value='Treasury'>Treasury</MenuItem>
                  <MenuItem value='IT'>IT</MenuItem>
                  <MenuItem value='Operations'>Operations</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label='Role'
                  onChange={(e) => handleFormChange('role', e.target.value)}
                >
                  {roles.map(role => (
                    <MenuItem key={role.role_id} value={role.name}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {!isEditMode && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required variant='outlined'>
                    <InputLabel htmlFor='password'>Password</InputLabel>
                    <OutlinedInput
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleFormChange('password', e.target.value)}
                      startAdornment={
                        <InputAdornment position='start'>
                          <AiOutlineLock />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge='end'
                          >
                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label='Password'
                    />
                    <FormHelperText>
                      Password must be at least 8 characters long
                    </FormHelperText>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required variant='outlined'>
                    <InputLabel htmlFor='confirm-password'>Confirm Password</InputLabel>
                    <OutlinedInput
                      id='confirm-password'
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirm_password}
                      onChange={(e) => handleFormChange('confirm_password', e.target.value)}
                      startAdornment={
                        <InputAdornment position='start'>
                          <AiOutlineLock />
                        </InputAdornment>
                      }
                      label='Confirm Password'
                    />
                    {formData.password !== formData.confirm_password && formData.confirm_password && (
                      <FormHelperText error>
                        Passwords do not match
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_mfa_enabled}
                    onChange={(e) => handleFormChange('is_mfa_enabled', e.target.checked)}
                  />
                }
                label='Enable Multi-Factor Authentication'
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleSaveUser}
            disabled={!isFormValid()}
          >
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>
          Delete User
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the user <strong>{selectedUser?.full_name}</strong> ({selectedUser?.username})?
          </Typography>
          <Typography variant='body2' color='error' sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={handleDeleteUser}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Reset Password Dialog */}
      <Dialog
        open={resetPasswordDialogOpen}
        onClose={handleCloseResetPasswordDialog}
      >
        <DialogTitle>
          Reset Password
        </DialogTitle>
        <DialogContent>
          <Typography>
            Reset password for user <strong>{selectedUser?.full_name}</strong> ({selectedUser?.username})?
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
            A temporary password will be generated and sent to the user's email address.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetPasswordDialog}>
            Cancel
          </Button>
          <Button
            variant='contained'
            color='warning'
            onClick={handleResetPassword}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UserManagement
