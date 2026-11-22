
// import { useMemo } from 'react'
// import { FiUsers } from 'react-icons/fi'


// import Pagination from '@/components/ui/pagination'
// import useGetAdminStudents from '@/features/manager/application/hooks/useGetAdminStudents'
// import AdminStudentsToolbar from '@/features/admin/management/user/components/AdminStudentsToolbar'
// import AdminStudentTable from '@/features/admin/management/user/components/AdminStudentTable'

// export default function AdminStudentPage() {
//   const {
//     adminStudentDataList,
//     loading,

//     currentStudentPage,
//     pageStudentSize,
//     setCurrentStudentPage,
//     setPageStudentSize,

//     search,
//     setSearch,

//     refresh,
//   } = useGetAdminStudents()

//   const students = adminStudentDataList?.items ?? []

//   // Handle page size change
//   const handlePageSizeChange = (size: number) => {
//     setPageStudentSize(size)
//     setCurrentStudentPage(1)
//   }

//   // Statistics
//   const statistics = useMemo(() => {
//     const totalStudents = adminStudentDataList?.totalCount ?? 0

//     const activeStudents = students.filter(
//       (student) => student.isActive,
//     ).length

//     const inactiveStudents = students.filter(
//       (student) => !student.isActive,
//     ).length

//     return {
//       totalStudents,
//       activeStudents,
//       inactiveStudents,
//     }
//   }, [adminStudentDataList?.totalCount, students])

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div>
//         <div className="flex items-center gap-2">
//           <FiUsers className="h-6 w-6 text-brand-orange" />

//           <h1 className="text-2xl font-semibold text-text-primary">
//             Quản lý sinh viên
//           </h1>
//         </div>

//         <p className="mt-1 text-sm text-text-secondary">
//           Quản lý danh sách và trạng thái tài khoản sinh viên trong hệ thống.
//         </p>
//       </div>

//       {/* Statistics */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//         <div className="rounded-lg border border-border-default bg-bg-primary p-4">
//           <p className="text-sm text-text-secondary">
//             Tổng sinh viên
//           </p>

//           <p className="mt-2 text-2xl font-semibold text-text-primary">
//             {statistics.totalStudents}
//           </p>
//         </div>

//         <div className="rounded-lg border border-border-default bg-bg-primary p-4">
//           <p className="text-sm text-text-secondary">
//             Đang hoạt động
//           </p>

//           <p className="mt-2 text-2xl font-semibold text-emerald-600">
//             {statistics.activeStudents}
//           </p>

//           <p className="mt-1 text-xs text-text-muted">
//             Trong trang hiện tại
//           </p>
//         </div>

//         <div className="rounded-lg border border-border-default bg-bg-primary p-4">
//           <p className="text-sm text-text-secondary">
//             Đã khóa
//           </p>

//           <p className="mt-2 text-2xl font-semibold text-danger">
//             {statistics.inactiveStudents}
//           </p>

//           <p className="mt-1 text-xs text-text-muted">
//             Trong trang hiện tại
//           </p>
//         </div>
//       </div>

//       {/* Toolbar */}
//       <AdminStudentsToolbar
//         search={search}
//         onSearchChange={setSearch}
//         onRefresh={refresh}
//         loading={loading}
//       />

//       {/* Student Table */}
//       <AdminStudentTable
//         students={students}
//         loading={loading}
//       />

//       {/* Pagination */}
//       {adminStudentDataList && adminStudentDataList.totalPages > 0 && (
//         <Pagination
//           currentPage={currentStudentPage}
//           onPageChange={setCurrentStudentPage}
//           totalPages={adminStudentDataList.totalPages}
//           pageSize={pageStudentSize}
//           onPageSizeChange={handlePageSizeChange}
//         />
//       )}
//     </div>
//   )
// }
