'use client'

// React Imports
import { FC } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Alert from '@mui/material/Alert'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

// React Icons
import { AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai'

// Type Imports
import type { 
  StagingRule,
  StagingCriteria,
  StagingType
} from '@/data/ecl/eclData'

interface RuleEditorProps {
  rule: StagingRule
  onChange: (rule: StagingRule) => void
}

const RuleEditor: FC<RuleEditorProps> = ({ rule, onChange }) => {
  // Available fields for criteria
  const availableFields = [
    { field: 'dpd', label: 'Days Past Due', type: 'number' },
    { field: 'kolektibilitas_terkini', label: 'Current Collectibility', type: 'number' },
    { field: 'pd_current', label: 'Current PD', type: 'number' },
    { field: 'pd_origination', label: 'Origination PD', type: 'number' },
    { field: 'pd_increase_percentage', label: 'PD Increase (%)', type: 'number' },
    { field: 'restructured', label: 'Restructured', type: 'boolean' },
    { field: 'watchlist', label: 'Watchlist', type: 'boolean' },
    { field: 'industry_outlook', label: 'Industry Outlook', type: 'string' }
  ]
  
  // Available operators based on field type
  const getAvailableOperators = (fieldType: string) => {
    switch (fieldType) {
      case 'number':
        return [
          { value: 'equals', label: 'Equals (=)' },
          { value: 'not_equals', label: 'Not Equals (≠)' },
          { value: 'greater_than', label: 'Greater Than (>)' },
          { value: 'less_than', label: 'Less Than (<)' },
          { value: 'in', label: 'In (list)' },
          { value: 'not_in', label: 'Not In (list)' }
        ]
      case 'boolean':
        return [
          { value: 'equals', label: 'Equals (=)' },
          { value: 'not_equals', label: 'Not Equals (≠)' }
        ]
      case 'string':
        return [
          { value: 'equals', label: 'Equals (=)' },
          { value: 'not_equals', label: 'Not Equals (≠)' },
          { value: 'contains', label: 'Contains' },
          { value: 'not_contains', label: 'Not Contains' },
          { value: 'in', label: 'In (list)' },
          { value: 'not_in', label: 'Not In (list)' }
        ]
      default:
        return []
    }
  }
  
  // Handler for rule name change
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...rule, name: event.target.value })
  }
  
  // Handler for rule description change
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...rule, description: event.target.value })
  }
  
  // Handler for stage result change
  const handleStageResultChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChange({ ...rule, stage_result: event.target.value as StagingType })
  }
  
  // Handler for active status change
  const handleActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...rule, is_active: event.target.checked })
  }
  
  // Handler for adding a new criteria
  const handleAddCriteria = () => {
    const newCriteria: StagingCriteria = {
      criteria_id: Math.max(...rule.criteria.map(c => c.criteria_id), 0) + 1,
      field: 'dpd',
      operator: 'greater_than',
      value: 0,
      logic_operator: rule.criteria.length > 0 ? 'AND' : undefined
    }
    
    onChange({ ...rule, criteria: [...rule.criteria, newCriteria] })
  }
  
  // Handler for removing a criteria
  const handleRemoveCriteria = (criteriaId: number) => {
    const updatedCriteria = rule.criteria.filter(c => c.criteria_id !== criteriaId)
    
    // Update logic operators if needed
    if (updatedCriteria.length > 0) {
      updatedCriteria[0].logic_operator = undefined
    }
    
    onChange({ ...rule, criteria: updatedCriteria })
  }
  
  // Handler for updating a criteria
  const handleUpdateCriteria = (criteriaId: number, field: string, value: any) => {
    const updatedCriteria = rule.criteria.map(c => {
      if (c.criteria_id === criteriaId) {
        return { ...c, [field]: value }
      }
      return c
    })
    
    onChange({ ...rule, criteria: updatedCriteria })
  }
  
  // Get field type
  const getFieldType = (fieldName: string): string => {
    const field = availableFields.find(f => f.field === fieldName)
    return field ? field.type : 'string'
  }
  
  // Render value input based on field type
  const renderValueInput = (criteria: StagingCriteria) => {
    const fieldType = getFieldType(criteria.field)
    
    switch (fieldType) {
      case 'number':
        return (
          <TextField
            label='Value'
            type='number'
            value={criteria.value}
            onChange={(e) => handleUpdateCriteria(criteria.criteria_id, 'value', parseFloat(e.target.value))}
            fullWidth
          />
        )
      case 'boolean':
        return (
          <FormControl fullWidth>
            <InputLabel>Value</InputLabel>
            <Select
              value={criteria.value === true ? 'true' : 'false'}
              label='Value'
              onChange={(e) => handleUpdateCriteria(criteria.criteria_id, 'value', e.target.value === 'true')}
            >
              <MenuItem value='true'>True</MenuItem>
              <MenuItem value='false'>False</MenuItem>
            </Select>
          </FormControl>
        )
      case 'string':
        if (criteria.field === 'industry_outlook') {
          return (
            <FormControl fullWidth>
              <InputLabel>Value</InputLabel>
              <Select
                value={criteria.value || ''}
                label='Value'
                onChange={(e) => handleUpdateCriteria(criteria.criteria_id, 'value', e.target.value)}
              >
                <MenuItem value='Positive'>Positive</MenuItem>
                <MenuItem value='Stable'>Stable</MenuItem>
                <MenuItem value='Negative'>Negative</MenuItem>
                <MenuItem value='Severe'>Severe</MenuItem>
              </Select>
            </FormControl>
          )
        }
        return (
          <TextField
            label='Value'
            value={criteria.value || ''}
            onChange={(e) => handleUpdateCriteria(criteria.criteria_id, 'value', e.target.value)}
            fullWidth
          />
        )
      default:
        return null
    }
  }
  
  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <TextField
            label='Rule Name'
            value={rule.name}
            onChange={handleNameChange}
            fullWidth
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label='Description'
            value={rule.description}
            onChange={handleDescriptionChange}
            fullWidth
            multiline
            rows={2}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Stage Result</InputLabel>
            <Select
              value={rule.stage_result}
              label='Stage Result'
              onChange={handleStageResultChange}
            >
              <MenuItem value='Stage 1'>Stage 1</MenuItem>
              <MenuItem value='Stage 2'>Stage 2</MenuItem>
              <MenuItem value='Stage 3'>Stage 3</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch 
                checked={rule.is_active}
                onChange={handleActiveChange}
              />
            }
            label='Active'
          />
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }}>
        <Chip label='Rule Criteria' />
      </Divider>
      
      {rule.criteria.length === 0 ? (
        <Alert severity='info' sx={{ mb: 3 }}>
          This is a default rule with no criteria. It will match all transactions.
        </Alert>
      ) : (
        <TableContainer component={Paper} variant='outlined' sx={{ mb: 3 }}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Field</TableCell>
                <TableCell>Operator</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Logic</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rule.criteria.map((criteria, index) => (
                <TableRow key={criteria.criteria_id}>
                  <TableCell>
                    <FormControl fullWidth size='small'>
                      <InputLabel>Field</InputLabel>
                      <Select
                        value={criteria.field}
                        label='Field'
                        onChange={(e) => handleUpdateCriteria(criteria.criteria_id, 'field', e.target.value)}
                      >
                        {availableFields.map(field => (
                          <MenuItem key={field.field} value={field.field}>
                            {field.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth size='small'>
                      <InputLabel>Operator</InputLabel>
                      <Select
                        value={criteria.operator}
                        label='Operator'
                        onChange={(e) => handleUpdateCriteria(criteria.criteria_id, 'operator', e.target.value)}
                      >
                        {getAvailableOperators(getFieldType(criteria.field)).map(op => (
                          <MenuItem key={op.value} value={op.value}>
                            {op.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    {renderValueInput(criteria)}
                  </TableCell>
                  <TableCell>
                    {index > 0 && (
                      <FormControl fullWidth size='small'>
                        <InputLabel>Logic</InputLabel>
                        <Select
                          value={criteria.logic_operator || 'AND'}
                          label='Logic'
                          onChange={(e) => handleUpdateCriteria(criteria.criteria_id, 'logic_operator', e.target.value)}
                        >
                          <MenuItem value='AND'>AND</MenuItem>
                          <MenuItem value='OR'>OR</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size='small' 
                      color='error'
                      onClick={() => handleRemoveCriteria(criteria.criteria_id)}
                    >
                      <AiOutlineDelete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      <Button 
        variant='outlined' 
        startIcon={<AiOutlinePlus />}
        onClick={handleAddCriteria}
      >
        Add Criteria
      </Button>
      
      {rule.criteria.length > 0 && (
        <Alert severity='info' sx={{ mt: 3 }}>
          <Typography variant='subtitle2'>Rule Logic:</Typography>
          <Typography variant='body2'>
            {rule.criteria.map((c, i) => {
              const field = availableFields.find(f => f.field === c.field)?.label || c.field
              const operator = getAvailableOperators(getFieldType(c.field)).find(o => o.value === c.operator)?.label || c.operator
              
              return (
                <span key={c.criteria_id}>
                  {i > 0 && c.logic_operator && <strong> {c.logic_operator} </strong>}
                  {field} {operator} {c.value !== undefined ? c.value.toString() : ''}
                </span>
              )
            })}
          </Typography>
        </Alert>
      )}
    </Box>
  )
}

export default RuleEditor
