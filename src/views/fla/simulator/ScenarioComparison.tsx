'use client'

// React Imports
import { FC } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ScenarioComparisonProps {
  results: {
    pd: number
    lgd: number
    adjustmentFactor: number
    scenarioProbability: number
    scenarioName: string
  }[]
  basePd: number
  baseLgd: number
}

const ScenarioComparison: FC<ScenarioComparisonProps> = ({ results, basePd, baseLgd }) => {
  // Prepare chart data for PD comparison
  const pdChartData = {
    labels: ['Base'].concat(results.map(result => result.scenarioName)),
    datasets: [
      {
        label: 'PD Values (%)',
        data: [basePd * 100].concat(results.map(result => result.pd * 100)),
        backgroundColor: [
          'rgba(128, 128, 128, 0.7)',  // Base - Gray
          'rgba(54, 162, 235, 0.7)',   // Base Scenario - Blue
          'rgba(75, 192, 192, 0.7)',   // Upside - Green
          'rgba(255, 159, 64, 0.7)',   // Downside - Orange
          'rgba(255, 99, 132, 0.7)'    // Severe Downside - Red
        ],
        borderColor: [
          'rgba(128, 128, 128, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  }
  
  // Prepare chart data for LGD comparison
  const lgdChartData = {
    labels: ['Base'].concat(results.map(result => result.scenarioName)),
    datasets: [
      {
        label: 'LGD Values (%)',
        data: [baseLgd * 100].concat(results.map(result => result.lgd * 100)),
        backgroundColor: [
          'rgba(128, 128, 128, 0.7)',  // Base - Gray
          'rgba(54, 162, 235, 0.7)',   // Base Scenario - Blue
          'rgba(75, 192, 192, 0.7)',   // Upside - Green
          'rgba(255, 159, 64, 0.7)',   // Downside - Orange
          'rgba(255, 99, 132, 0.7)'    // Severe Downside - Red
        ],
        borderColor: [
          'rgba(128, 128, 128, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  }
  
  return (
    <Card>
      <CardContent>
        <Typography variant='h6' sx={{ mb: 4 }}>
          Scenario Comparison
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant='subtitle1' gutterBottom>
            PD Comparison Across Scenarios
          </Typography>
          <Box sx={{ height: 300 }}>
            <Bar 
              data={pdChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'PD Value (%)'
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `PD: ${context.raw}%`;
                      }
                    }
                  }
                }
              }}
            />
          </Box>
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        <Box>
          <Typography variant='subtitle1' gutterBottom>
            LGD Comparison Across Scenarios
          </Typography>
          <Box sx={{ height: 300 }}>
            <Bar 
              data={lgdChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'LGD Value (%)'
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `LGD: ${context.raw}%`;
                      }
                    }
                  }
                }
              }}
            />
          </Box>
        </Box>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant='subtitle2' gutterBottom>
            Interpretation:
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            The charts above compare the PD and LGD values across different economic scenarios against the base values. 
            Upside scenarios typically result in lower PD and LGD values, while downside scenarios lead to higher values, 
            reflecting increased credit risk in adverse economic conditions. The weighted average of these scenarios, 
            based on their assigned probabilities, determines the final forward-looking adjusted values.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ScenarioComparison
