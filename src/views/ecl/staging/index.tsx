'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

// React Icons
import { AiOutlineEdit, AiOutlineDelete, AiOutlineCopy, AiOutlinePlus } from 'react-icons/ai'
import { BsArrowUp, BsArrowDown } from 'react-icons/bs'

// Type Imports
import type { 
  StagingRule,
  StagingCriteria,
  StagingType,
  ECLParameters
} from '@/data/ecl/eclData'

// Component Imports
import RuleEditor from './RuleEditor'
import RuleSimulator from './RuleSimulator'

// Interface for component props
interface StagingRulesManagerProps {
  eclParameters: ECLParameters[]
  stagingRules: StagingRule[]
}

const StagingRulesManager = ({
  eclParameters,
  stagingRules: initialStagingRules
}: StagingRulesManagerProps) => {
  // States
  const [activeTab, setActiveTab] = useState<number>(0)
  const [selectedParameterId, setSelectedParameterId] = useState<number | ''>('')
  const [stagingRules, setStagingRules] = useState<StagingRule[]>(initialStagingRules)
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(null)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [dialogType, setDialogType] = useState<'new' | 'edit' | 'copy' | 'delete'>('new')
  const [editRule, setEditRule] = useState<StagingRule | null>(null)
  
  // Get selected parameters
  const selectedParameters = eclParameters.find(p => p.parameter_id === selectedParameterId)
  
  // Get selected rule
  const selectedRule = stagingRules.find(r => r.rule_id === selectedRuleId)
  
  // Effect to set default parameters
  useEffect(() => {
    if (eclParameters.length > 0) {
      // Find active parameters
      const activeParameters = eclParameters.find(p => p.is_active)
      
      if (activeParameters) {
        setSelectedParameterId(activeParameters.parameter_id)
      } else {
        setSelectedParameterId(eclParameters[0].parameter_id)
      }
    }
  }, [eclParameters])
  
  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  
  const handleParameterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const parameterId = event.target.value as number
    setSelectedParameterId(parameterId)
    
    // Update staging rules based on selected parameters
    const parameters = eclParameters.find(p => p.parameter_id === parameterId)
    if (parameters) {
      setStagingRules(parameters.default_staging_rules)
    }
  }
  
  const handleOpenNewRuleDialog = () => {
    setDialogType('new')
    setEditRule({
      rule_id: Math.max(...stagingRules.map(r => r.rule_id), 0) + 1,
      name: '',
      description: '',
      criteria: [],
      stage_result: 'Stage 1',
      priority: stagingRules.length + 1,
      is_active: true
    })
    setOpenDialog(true)
  }
  
  const handleOpenEditRuleDialog = (ruleId: number) => {
    const rule = stagingRules.find(r => r.rule_id === ruleId)
    if (rule) {
      setDialogType('edit')
      setEditRule({ ...rule })
      setOpenDialog(true)
    }
  }
  
  const handleOpenCopyRuleDialog = (ruleId: number) => {
    const rule = stagingRules.find(r => r.rule_id === ruleId)
    if (rule) {
      setDialogType('copy')
      setEditRule({
        ...rule,
        rule_id: Math.max(...stagingRules.map(r => r.rule_id), 0) + 1,
        name: `${rule.name} (Copy)`,
        priority: stagingRules.length + 1
      })
      setOpenDialog(true)
    }
  }
  
  const handleOpenDeleteRuleDialog = (ruleId: number) => {
    setDialogType('delete')
    setSelectedRuleId(ruleId)
    setOpenDialog(true)
  }
  
  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditRule(null)
  }
  
  const handleSaveRule = () => {
    if (!editRule) return
    
    // Validate rule
    if (!editRule.name) {
      alert('Rule name is required')
      return
    }
    
    // Update or add rule
    const updatedRules = dialogType === 'edit' 
      ? stagingRules.map(r => r.rule_id === editRule.rule_id ? editRule : r)
      : [...stagingRules, editRule]
    
    // Sort by priority
    const sortedRules = [...updatedRules].sort((a, b) => a.priority - b.priority)
    
    setStagingRules(sortedRules)
    handleCloseDialog()
  }
  
  const handleDeleteRule = () => {
    if (!selectedRuleId) return
    
    const updatedRules = stagingRules.filter(r => r.rule_id !== selectedRuleId)
    setStagingRules(updatedRules)
    handleCloseDialog()
  }
  
  const handleMovePriority = (ruleId: number, direction: 'up' | 'down') => {
    const ruleIndex = stagingRules.findIndex(r => r.rule_id === ruleId)
    if (ruleIndex === -1) return
    
    const newRules = [...stagingRules]
    const rule = newRules[ruleIndex]
    
    if (direction === 'up' && ruleIndex > 0) {
      // Swap priorities with the rule above
      const aboveRule = newRules[ruleIndex - 1]
      const tempPriority = rule.priority
      rule.priority = aboveRule.priority
      aboveRule.priority = tempPriority
      
      // Swap positions in array
      newRules[ruleIndex] = aboveRule
      newRules[ruleIndex - 1] = rule
    } else if (direction === 'down' && ruleIndex < newRules.length - 1) {
      // Swap priorities with the rule below
      const belowRule = newRules[ruleIndex + 1]
      const tempPriority = rule.priority
      rule.priority = belowRule.priority
      belowRule.priority = tempPriority
      
      // Swap positions in array
      newRules[ruleIndex] = belowRule
      newRules[ruleIndex + 1] = rule
    }
    
    setStagingRules(newRules)
  }
  
  const handleToggleRuleActive = (ruleId: number) => {
    const updatedRules = stagingRules.map(rule => {
      if (rule.rule_id === ruleId) {
        return { ...rule, is_active: !rule.is_active }
      }
      return rule
    })
    
    setStagingRules(updatedRules)
  }
  
  // Get stage color
  const getStageColor = (stage: StagingType): 'success' | 'warning' | 'error' => {
    switch (stage) {
      case 'Stage 1':
        return 'success'
      case 'Stage 2':
        return 'warning'
      case 'Stage 3':
        return 'error'
      default:
        return 'success'
    }
  }
  
  // Render rules management tab
  const renderRulesTab = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h6'>Staging Rules</Typography>
          <Button 
            variant='contained' 
            color='primary'
            startIcon={<AiOutlinePlus />}
            onClick={handleOpenNewRuleDialog}
          >
            Add New Rule
          </Button>
        </Box>
        
        <Alert severity='info' sx={{ mb: 4 }}>
          Rules are evaluated in order of priority (lowest number first). The first rule that matches will determine the stage.
        </Alert>
        
        <TableContainer component={Paper} variant='outlined'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Priority</TableCell>
                <TableCell>Rule Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Criteria</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stagingRules.length > 0 ? (
                stagingRules.map((rule) => (
                  <TableRow key={rule.rule_id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='body2' sx={{ mr: 1 }}>
                          {rule.priority}
                        </Typography>
                        <Box>
                          <IconButton 
                            size='small' 
                            onClick={() => handleMovePriority(rule.rule_id, 'up')}
                            disabled={rule.priority === 1}
                          >
                            <BsArrowUp fontSize='small' />
                          </IconButton>
                          <IconButton 
                            size='small' 
                            onClick={() => handleMovePriority(rule.rule_id, 'down')}
                            disabled={rule.priority === stagingRules.length}
                          >
                            <BsArrowDown fontSize='small' />
                          </IconButton>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{rule.name}</TableCell>
                    <TableCell>{rule.description}</TableCell>
                    <TableCell>
                      {rule.criteria.length > 0 ? (
                        rule.criteria.map((criteria, index) => (
                          <Typography key={index} variant='caption' display='block'>
                            {criteria.field} {criteria.operator} {criteria.value}
                            {index < rule.criteria.length - 1 && criteria.logic_operator && (
                              <strong> {criteria.logic_operator} </strong>
                            )}
                          </Typography>
                        ))
                      ) : (
                        <Typography variant='caption'>Default rule (no criteria)</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={rule.stage_result}
                        color={getStageColor(rule.stage_result)}
                        size='small'
                      />
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={rule.is_active}
                        onChange={() => handleToggleRuleActive(rule.rule_id)}
                        size='small'
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title='Edit'>
                          <IconButton 
                            size='small' 
                            color='primary'
                            onClick={() => handleOpenEditRuleDialog(rule.rule_id)}
                          >
                            <AiOutlineEdit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Copy'>
                          <IconButton 
                            size='small' 
                            color='info'
                            onClick={() => handleOpenCopyRuleDialog(rule.rule_id)}
                          >
                            <AiOutlineCopy />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete'>
                          <IconButton 
                            size='small' 
                            color='error'
                            onClick={() => handleOpenDeleteRuleDialog(rule.rule_id)}
                          >
                            <AiOutlineDelete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    <Alert severity='warning'>
                      No staging rules found. Click "Add New Rule" to create one.
                    </Alert>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
  
  // Render simulator tab
  const renderSimulatorTab = () => (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Staging Rules Simulator
        </Typography>
        
        <RuleSimulator stagingRules={stagingRules} />
      </CardContent>
    </Card>
  )
  
  // Render dialog content based on type
  const renderDialogContent = () => {
    switch (dialogType) {
      case 'new':
      case 'edit':
      case 'copy':
        return (
          <>
            <DialogTitle>
              {dialogType === 'new' ? 'Add New Rule' : 
               dialogType === 'edit' ? 'Edit Rule' : 'Copy Rule'}
              <IconButton
                aria-label='close'
                onClick={handleCloseDialog}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <AiOutlineDelete />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {editRule && (
                <RuleEditor 
                  rule={editRule}
                  onChange={setEditRule}
                />
              )}
            </DialogContent>
          </>
        )
      
      case 'delete':
        return (
          <>
            <DialogTitle>
              Delete Rule
              <IconButton
                aria-label='close'
                onClick={handleCloseDialog}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <AiOutlineDelete />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Alert severity='warning' sx={{ mb: 3 }}>
                Are you sure you want to delete this rule? This action cannot be undone.
              </Alert>
              
              {selectedRule && (
                <Box>
                  <Typography variant='subtitle2'>Rule Name:</Typography>
                  <Typography variant='body2' gutterBottom>{selectedRule.name}</Typography>
                  
                  <Typography variant='subtitle2'>Description:</Typography>
                  <Typography variant='body2' gutterBottom>{selectedRule.description}</Typography>
                  
                  <Typography variant='subtitle2'>Stage Result:</Typography>
                  <Chip 
                    label={selectedRule.stage_result}
                    color={getStageColor(selectedRule.stage_result)}
                    size='small'
                  />
                </Box>
              )}
            </DialogContent>
          </>
        )
      
      default:
        return null
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Staging Rules Manager</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Define and manage rules for PSAK 71 staging assessment
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Card sx={{ mb: 6 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant='h6'>ECL Parameters</Typography>
            </Box>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id='parameter-select-label'>ECL Parameters</InputLabel>
                  <Select
                    labelId='parameter-select-label'
                    value={selectedParameterId}
                    label='ECL Parameters'
                    onChange={handleParameterChange}
                  >
                    {eclParameters.map(parameter => (
                      <MenuItem key={parameter.parameter_id} value={parameter.parameter_id}>
                        {parameter.name}
                        {parameter.is_active && (
                          <Chip 
                            label='Active' 
                            color='success' 
                            size='small' 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
          <Tab label='Rules Management' />
          <Tab label='Rules Simulator' />
        </Tabs>
        
        {activeTab === 0 && renderRulesTab()}
        {activeTab === 1 && renderSimulatorTab()}
      </Grid>
      
      {/* Dialogs */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='md' fullWidth>
        {renderDialogContent()}
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          {dialogType === 'delete' ? (
            <Button variant='contained' color='error' onClick={handleDeleteRule}>
              Delete
            </Button>
          ) : (
            <Button variant='contained' color='primary' onClick={handleSaveRule}>
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default StagingRulesManager
