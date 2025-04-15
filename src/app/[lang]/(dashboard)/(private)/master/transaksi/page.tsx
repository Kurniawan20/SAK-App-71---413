// Component Imports
import TransaksiList from '@/views/master/transaksi/list'

// Data Imports
import transaksiData from '@/data/master/transaksiData'

const TransaksiListPage = () => {
  return <TransaksiList transaksiData={transaksiData} />
}

export default TransaksiListPage
