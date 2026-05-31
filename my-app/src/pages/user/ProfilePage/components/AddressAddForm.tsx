import { useState } from "react";
import type { Address } from "../type";

interface Props {
  onSubmit: (data: Omit<Address, "id" | "isDefault">) => void;
  onCancel: () => void;
}

export default function AddressAddForm({ onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState({ label: "", phone: "", fullAddress: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim() || !formData.phone.trim() || !formData.fullAddress.trim()) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2.5">
          Tên địa chỉ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="VD: Yên Nhi, Lâm Thái..."
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2.5">
          Số điện thoại <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="VD: (+84) 793 472 637"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2.5">
          Địa chỉ đầy đủ <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.fullAddress}
          onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Nhập địa chỉ đầy đủ..."
          rows={3}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
          ➕ Thêm Địa Chỉ
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg transition">
          Hủy
        </button>
      </div>
    </form>
  );
}