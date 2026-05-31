import { useState } from "react";
import type { Address, AddressFormData } from "../type";

interface Props {
  initialData: Address;
  onSubmit: (data: Partial<Address>) => void;
  onCancel: () => void;
}

export default function AddressUpdateForm({ initialData, onSubmit, onCancel }: Props) {
  // Initialize state based on the passed data
  const [formData, setFormData] = useState<AddressFormData>(() => {
    const parts = initialData.fullAddress.split(",");
    return {
      id: initialData.id,
      name: initialData.label,
      phone: initialData.phone,
      location: parts.slice(-3).join(",").trim() || "TP. Hồ Chí Minh, Quận 11, Phường 5",
      address: parts[0]?.trim() || initialData.fullAddress,
      type: "house",
    };
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    const fullAddress = `${formData.address}, ${formData.location}`;
    onSubmit({
      label: formData.name,
      phone: formData.phone,
      fullAddress: fullAddress,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ cụ thể</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Simplified Location Select for brevity */}
      <div>
         <label className="block text-sm font-semibold text-gray-700 mb-2">Khu vực</label>
         <select 
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg"
         >
            <option value="TP. Hồ Chí Minh, Quận 11, Phường 5">TP. Hồ Chí Minh, Quận 11, Phường 5</option>
            <option value="TP. Hồ Chí Minh, Quận 1, Phường Bến Nghé">TP. Hồ Chí Minh, Quận 1, Phường Bến Nghé</option>
         </select>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button onClick={onCancel} className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold py-3 rounded-lg transition">
          Trở Lại
        </button>
        <button onClick={handleSubmit} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition">
          Hoàn thành
        </button>
      </div>
    </div>
  );
}