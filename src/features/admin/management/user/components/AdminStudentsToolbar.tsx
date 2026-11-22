
// import { FiRefreshCw, FiSearch } from 'react-icons/fi'

// import Input from '@/components/ui/input'
// import Button from '@/components/ui/button'

// interface AdminStudentsToolbarProps {
//   search: string
//   onSearchChange: (value: string) => void
//   onRefresh: () => void
//   loading?: boolean
// }

// export default function AdminStudentsToolbar({
//   search,
//   onSearchChange,
//   onRefresh,
//   loading = false,
// }: AdminStudentsToolbarProps) {
//   return (
//     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//       <div className="flex flex-1 flex-wrap items-center gap-2">
//         {/* Search */}
//         <div className="relative w-full sm:w-80">
//           <Input
//             value={search}
//             onChange={(e) => onSearchChange(e.target.value)}
//             placeholder="Tìm theo tên, mã sinh viên hoặc email..."
//             icon={FiSearch}
//           />
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex gap-2">
//         <Button
//           size="basic"
//           variant="basic"
//           onClick={onRefresh}
//           disabled={loading}
//         >
//           <FiRefreshCw
//             className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
//           />
//           Làm mới
//         </Button>
//       </div>
//     </div>
//   )
// }
