export default function OverviewTab() {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Thống kê nhanh</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tổng đơn hàng:</span>
              <span className="text-2xl font-bold text-blue-600">12</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Đơn hàng đang chờ:</span>
              <span className="text-2xl font-bold text-orange-600">2</span>
            </div>
          </div>
        </div>
      </div>
    )
}