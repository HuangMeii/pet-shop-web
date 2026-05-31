"use client";

import { useAddressManager } from "../hooks/useAddressManager";
import { Modal } from "../Modal";
import AddressAddForm from "./AddressAddForm";
import AddressUpdateForm from "./AddressUpdateForm";

export default function AddressList() {
  const {
    addresses,
    defaultAddress,
    selectedAddressId,
    setSelectedAddressId,
    activeModal,
    editingAddress,
    openList,
    openAdd,
    openUpdate,
    closeAll,
    handleSetDefault,
    handleAdd,
    handleUpdate,
  } = useAddressManager();

  return (
    <div className="space-y-6">
      {defaultAddress && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-red-600 text-xl">📍</span>
              <h3 className="text-gray-800 font-semibold">Địa Chỉ Nhận Hàng</h3>
            </div>
          </div>

          <div className="p-6 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-gray-800 font-bold text-lg">{defaultAddress.label}</h4>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                  Mặc định
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{defaultAddress.phone}</p>
              <p className="text-gray-700 text-sm">{defaultAddress.fullAddress}</p>
            </div>
            <button
              onClick={openList}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Thay Đổi
            </button>
          </div>
        </div>
      )}

      <Modal isOpen={activeModal === "LIST"} onClose={closeAll} title="Địa Chỉ Của Tôi">
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => setSelectedAddressId(address.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition flex items-start gap-3 ${
                selectedAddressId === address.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedAddressId === address.id ? "border-blue-600 bg-blue-600" : "border-gray-300"
              }`}>
                {selectedAddressId === address.id && <span className="text-white text-xs">✓</span>}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-gray-800 font-bold">{address.label}</h4>
                    <p className="text-gray-600 text-sm">{address.phone}</p>
                    <p className="text-gray-600 text-sm mt-1">{address.fullAddress}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openUpdate(address.id);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={openAdd}
            className="w-full bg-white border-2 border-dashed border-red-300 text-red-600 hover:bg-red-50 font-bold py-3 rounded-lg transition"
          >
            + Thêm Địa Chỉ Mới
          </button>
          <div className="flex gap-3 border-t border-gray-100 pt-3">
            <button onClick={closeAll} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg">
              Hủy
            </button>
            <button
              onClick={() => handleSetDefault(selectedAddressId)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === "ADD"} onClose={openList} title="Thêm Địa Chỉ Mới">
        <AddressAddForm onSubmit={handleAdd} onCancel={openList} />
      </Modal>

      <Modal isOpen={activeModal === "UPDATE"} onClose={openList} title="Cập nhật địa chỉ">
        {editingAddress && (
          <AddressUpdateForm
            initialData={editingAddress}
            onSubmit={(data) => handleUpdate(editingAddress.id, data)}
            onCancel={openList}
          />
        )}
      </Modal>
    </div>
  );
}