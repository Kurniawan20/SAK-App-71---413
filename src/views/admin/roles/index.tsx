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
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

// React Icons
import { 
  AiOutlineEdit, 
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineExpandMore,
  AiOutlineUser,
  AiOutlineTeam,
  AiOutlineSetting
} from 'react-icons/ai'

// Type Imports
import type { 
  Role,
  Permission,
  PermissionCategory,
  PermissionAction
} from '@/data/admin/userData'

// Data Imports
import { 
  getRoles,
  getPermissions,
  getPermissionsByCategory
} from '@/data/admin/userData'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`role-tabpanel-${index}`}
      aria-labelledby={`role-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

interface RolesAndPermissionsProps {
  // You can add props here if needed
}

const RolesAndPermissions: FC<RolesAndPermissionsProps> = () => {
  // States
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [roleDialogOpen, setRoleDialogOpen] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([])
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedPermissions: [] as number[]
  })
  
  // Load data
  useEffect(() => {
    const loadData = () => {
      const rolesData = getRoles()
      const permissionsData = getPermissions()
      
      setRoles(rolesData)
      setFilteredRoles(rolesData)
      setPermissions(permissionsData)
    }
    
    loadData()
  }, [])
  
  // Apply filters
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const result = roles.filter(
        role =>
          role.name.toLowerCase().includes(query) ||
          role.description.toLowerCase().includes(query)
      )
      setFilteredRoles(result)
    } else {
      setFilteredRoles(roles)
    }
  }, [roles, searchQuery])
  
  // Handler for search query change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }
  
  // Handler for tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  
  // Handler for opening role dialog in create mode
  const handleOpenCreateRoleDialog = () => {
    setIsEditMode(false)
    setSelectedRole(null)
    setFormData({
      name: '',
      description: '',
      selectedPermissions: []
    })
    setRoleDialogOpen(true)
  }
  
  // Handler for opening role dialog in edit mode
  const handleOpenEditRoleDialog = (role: Role) => {
    setIsEditMode(true)
    setSelectedRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      selectedPermissions: role.permissions.map(p => p.permission_id)
    })
    setRoleDialogOpen(true)
  }
  
  // Handler for closing role dialog
  const handleCloseRoleDialog = () => {
    setRoleDialogOpen(false)
    setSelectedRole(null)
  }
  
  // Handler for opening delete dialog
  const handleOpenDeleteDialog = (role: Role) => {
    setSelectedRole(role)
    setDeleteDialogOpen(true)
  }
  
  // Handler for closing delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setSelectedRole(null)
  }
  
  // Handler for form field changes
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Handler for permission selection
  const handlePermissionSelection = (permissionId: number) => {
    setFormData(prev => {
      const selectedPermissions = [...prev.selectedPermissions]
      
      if (selectedPermissions.includes(permissionId)) {
        return {
          ...prev,
          selectedPermissions: selectedPermissions.filter(id => id !== permissionId)
        }
      } else {
        return {
          ...prev,
          selectedPermissions: [...selectedPermissions, permissionId]
        }
      }
    })
  }
  
  // Handler for category selection
  const handleCategorySelection = (category: PermissionCategory, isSelected: boolean) => {
    const categoryPermissions = permissions.filter(p => p.category === category)
    const categoryPermissionIds = categoryPermissions.map(p => p.permission_id)
    
    setFormData(prev => {
      let selectedPermissions = [...prev.selectedPermissions]
      
      if (isSelected) {
        // Add all category permissions that aren't already selected
        categoryPermissionIds.forEach(id => {
          if (!selectedPermissions.includes(id)) {
            selectedPermissions.push(id)
          }
        })
      } else {
        // Remove all category permissions
        selectedPermissions = selectedPermissions.filter(id => !categoryPermissionIds.includes(id))
      }
      
      return {
        ...prev,
        selectedPermissions
      }
    })
  }
  
  // Handler for module selection
  const handleModuleSelection = (module: string, isSelected: boolean) => {
    const modulePermissions = permissions.filter(p => p.module === module)
    const modulePermissionIds = modulePermissions.map(p => p.permission_id)
    
    setFormData(prev => {
      let selectedPermissions = [...prev.selectedPermissions]
      
      if (isSelected) {
        // Add all module permissions that aren't already selected
        modulePermissionIds.forEach(id => {
          if (!selectedPermissions.includes(id)) {
            selectedPermissions.push(id)
          }
        })
      } else {
        // Remove all module permissions
        selectedPermissions = selectedPermissions.filter(id => !modulePermissionIds.includes(id))
      }
      
      return {
        ...prev,
        selectedPermissions
      }
    })
  }
  
  // Handler for saving role
  const handleSaveRole = () => {
    // In a real application, this would call an API to save the role
    alert(`${isEditMode ? 'Updated' : 'Created'} role: ${formData.name}`)
    
    // Close the dialog
    handleCloseRoleDialog()
  }
  
  // Handler for deleting role
  const handleDeleteRole = () => {
    // In a real application, this would call an API to delete the role
    alert(`Deleted role: ${selectedRole?.name}`)
    
    // Close the dialog
    handleCloseDeleteDialog()
  }
  
  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A'
    
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  // Check if form is valid
  const isFormValid = (): boolean => {
    return !!(formData.name && formData.description && formData.selectedPermissions.length > 0)
  }
  
  // Check if all permissions in a category are selected
  const isCategoryFullySelected = (category: PermissionCategory): boolean => {
    const categoryPermissions = permissions.filter(p => p.category === category)
    const categoryPermissionIds = categoryPermissions.map(p => p.permission_id)
    
    return categoryPermissionIds.every(id => formData.selectedPermissions.includes(id))
  }
  
  // Check if some permissions in a category are selected
  const isCategoryPartiallySelected = (category: PermissionCategory): boolean => {
    const categoryPermissions = permissions.filter(p => p.category === category)
    const categoryPermissionIds = categoryPermissions.map(p => p.permission_id)
    
    return categoryPermissionIds.some(id => formData.selectedPermissions.includes(id)) && 
           !isCategoryFullySelected(category)
  }
  
  // Check if all permissions in a module are selected
  const isModuleFullySelected = (module: string): boolean => {
    const modulePermissions = permissions.filter(p => p.module === module)
    const modulePermissionIds = modulePermissions.map(p => p.permission_id)
    
    return modulePermissionIds.every(id => formData.selectedPermissions.includes(id))
  }
  
  // Check if some permissions in a module are selected
  const isModulePartiallySelected = (module: string): boolean => {
    const modulePermissions = permissions.filter(p => p.module === module)
    const modulePermissionIds = modulePermissions.map(p => p.permission_id)
    
    return modulePermissionIds.some(id => formData.selectedPermissions.includes(id)) && 
           !isModuleFullySelected(module)
  }
  
  // Get unique categories
  const getUniqueCategories = (): PermissionCategory[] => {
    const categories = permissions.map(p => p.category)
    return [...new Set(categories)] as PermissionCategory[]
  }
  
  // Get unique modules by category
  const getUniqueModulesByCategory = (category: PermissionCategory): string[] => {
    const modules = permissions
      .filter(p => p.category === category)
      .map(p => p.module)
    
    return [...new Set(modules)]
  }
  
  // Get permissions by module
  const getPermissionsByModule = (module: string): Permission[] => {
    return permissions.filter(p => p.module === module)
  }
  
  // Get permission action display name
  const getActionDisplayName = (action: PermissionAction): string => {
    switch (action) {
      case 'View':
        return 'View'
      case 'Create':
        return 'Create'
      case 'Edit':
        return 'Edit'
      case 'Delete':
        return 'Delete'
      case 'Approve':
        return 'Approve'
      case 'Export':
        return 'Export'
      default:
        return action
    }
  }
  
  // Get permission action color
  const getActionColor = (action: PermissionAction): 'primary' | 'success' | 'error' | 'warning' | 'info' | 'default' => {
    switch (action) {
      case 'View':
        return 'info'
      case 'Create':
        return 'success'
      case 'Edit':
        return 'primary'
      case 'Delete':
        return 'error'
      case 'Approve':
        return 'warning'
      case 'Export':
        return 'default'
      default:
        return 'default'
    }
  }
  
  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        Roles & Permissions
      </Typography>
      
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label='Roles' />
        <Tab label='Permissions' />
      </Tabs>
      
      <TabPanel value={activeTab} index={0}>
        <Card variant='outlined' sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder='Search roles...'
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
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant='contained'
                    startIcon={<AiOutlinePlus />}
                    onClick={handleOpenCreateRoleDialog}
                  >
                    Add Role
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        <Grid container spacing={3}>
          {filteredRoles.map(role => (
            <Grid item xs={12} md={6} key={role.role_id}>
              <Card variant='outlined'>
                <CardHeader
                  title={role.name}
                  subheader={`${role.user_count} ${role.user_count === 1 ? 'user' : 'users'}`}
                  action={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title='Edit Role'>
                        <IconButton
                          size='small'
                          color='primary'
                          onClick={() => handleOpenEditRoleDialog(role)}
                        >
                          <AiOutlineEdit />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title='Delete Role'>
                        <IconButton
                          size='small'
                          color='error'
                          onClick={() => handleOpenDeleteDialog(role)}
                          disabled={role.name === 'Admin'} // Prevent deleting Admin role
                        >
                          <AiOutlineDelete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />
                <Divider />
                <CardContent>
                  <Typography variant='body2' paragraph>
                    {role.description}
                  </Typography>
                  
                  <Typography variant='subtitle2' gutterBottom>
                    Permissions:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {role.permissions.slice(0, 10).map(permission => (
                      <Chip
                        key={permission.permission_id}
                        label={`${permission.module} - ${permission.action}`}
                        size='small'
                        color={getActionColor(permission.action)}
                      />
                    ))}
                    {role.permissions.length > 10 && (
                      <Chip
                        label={`+${role.permissions.length - 10} more`}
                        size='small'
                        variant='outlined'
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='caption' color='text.secondary'>
                      Created: {formatDate(role.created_date)}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Last Modified: {formatDate(role.last_modified_date)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
      
      <TabPanel value={activeTab} index={1}>
        <Card variant='outlined'>
          <CardHeader title='System Permissions' />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              {getUniqueCategories().map(category => (
                <Grid item xs={12} key={category}>
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<AiOutlineExpandMore />}>
                      <Typography variant='subtitle1'>{category}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper} variant='outlined'>
                        <Table size='small'>
                          <TableHead>
                            <TableRow>
                              <TableCell>Module</TableCell>
                              <TableCell>Permission</TableCell>
                              <TableCell>Description</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {getUniqueModulesByCategory(category).flatMap(module => 
                              getPermissionsByModule(module).map(permission => (
                                <TableRow key={permission.permission_id}>
                                  <TableCell>{permission.module}</TableCell>
                                  <TableCell>
                                    <Chip
                                      label={permission.action}
                                      size='small'
                                      color={getActionColor(permission.action)}
                                    />
                                  </TableCell>
                                  <TableCell>{permission.description}</TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>
      
      {/* Role Dialog */}
      <Dialog
        open={roleDialogOpen}
        onClose={handleCloseRoleDialog}
        maxWidth='lg'
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? 'Edit Role' : 'Create New Role'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label='Role Name'
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                fullWidth
                required
                disabled={isEditMode && selectedRole?.name === 'Admin'} // Prevent editing Admin role name
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label='Description'
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant='subtitle1' gutterBottom>
                Permissions
              </Typography>
              <Typography variant='body2' color='text.secondary' paragraph>
                Select the permissions for this role. Users with this role will have access to the selected features.
              </Typography>
              
              <Box sx={{ maxHeight: '400px', overflow: 'auto', p: 1 }}>
                {getUniqueCategories().map(category => (
                  <Accordion key={category} defaultExpanded>
                    <AccordionSummary expandIcon={<AiOutlineExpandMore />}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isCategoryFullySelected(category)}
                            indeterminate={isCategoryPartiallySelected(category)}
                            onChange={(e) => handleCategorySelection(category, e.target.checked)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        }
                        label={<Typography variant='subtitle2'>{category}</Typography>}
                        onClick={(e) => e.stopPropagation()}
                        sx={{ mr: 2 }}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ ml: 4 }}>
                        {getUniqueModulesByCategory(category).map(module => (
                          <Box key={module} sx={{ mb: 2 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={isModuleFullySelected(module)}
                                  indeterminate={isModulePartiallySelected(module)}
                                  onChange={(e) => handleModuleSelection(module, e.target.checked)}
                                />
                              }
                              label={<Typography variant='body2'>{module}</Typography>}
                            />
                            
                            <Box sx={{ ml: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                              {getPermissionsByModule(module).map(permission => (
                                <FormControlLabel
                                  key={permission.permission_id}
                                  control={
                                    <Checkbox
                                      checked={formData.selectedPermissions.includes(permission.permission_id)}
                                      onChange={() => handlePermissionSelection(permission.permission_id)}
                                      size='small'
                                    />
                                  }
                                  label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Chip
                                        label={permission.action}
                                        size='small'
                                        color={getActionColor(permission.action)}
                                        sx={{ mr: 1 }}
                                      />
                                      <Typography variant='caption'>
                                        {permission.description}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              ))}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleDialog}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleSaveRole}
            disabled={!isFormValid() || (isEditMode && selectedRole?.name === 'Admin')} // Prevent editing Admin role
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
          Delete Role
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the role <strong>{selectedRole?.name}</strong>?
          </Typography>
          {selectedRole?.user_count > 0 && (
            <Alert severity='warning' sx={{ mt: 2 }}>
              This role is currently assigned to {selectedRole.user_count} {selectedRole.user_count === 1 ? 'user' : 'users'}.
              These users will need to be reassigned to a different role.
            </Alert>
          )}
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
            onClick={handleDeleteRole}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default RolesAndPermissions
