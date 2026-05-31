import { useState } from "react";
interface Address {
  id: string;
  label: string;
  phone: string;
  fullAddress: string;
  isDefault: boolean;
}
// interface AddressFormData {
//   id: string;
//   name: string;
//   phone: string;
//   location: string;
//   address: string;
//   type: "house" | "office";
// }

const MOCK_ADDRESSES: Address[] = [
  { id: "addr_001", label: "Yên Nhi", phone: "(+84) 793 472 637", fullAddress: "506/49/60C, Lạc Long Quân...", isDefault: true },
  { id: "addr_002", label: "Lâm Thái Yên Nhi", phone: "(+84) 793 472 637", fullAddress: "568/5/21, Phường 5...", isDefault: false },
];

export const useAddressManager = () => {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  
  const [activeModal, setActiveModal] = useState<"LIST" | "ADD" | "UPDATE" | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState(addresses.find((a) => a.isDefault)?.id || "");
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const defaultAddress = addresses.find((a) => a.isDefault);

  const openList = () => setActiveModal("LIST");
  const openAdd = () => setActiveModal("ADD");
  const closeAll = () => setActiveModal(null);

  const openUpdate = (id: string) => {
    const addr = addresses.find((a) => a.id === id);
    if (addr) {
      setEditingAddress(addr);
      setActiveModal("UPDATE");
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
    closeAll();
  };

  const handleAdd = (newAddr: Omit<Address, "id" | "isDefault">) => {
    const address: Address = {
      ...newAddr,
      id: `addr_${Date.now()}`,
      isDefault: false,
    };
    setAddresses([...addresses, address]);
    closeAll();
  };

  const handleUpdate = (id: string, updatedData: Partial<Address>) => {
    setAddresses(addresses.map((a) => (a.id === id ? { ...a, ...updatedData } : a)));
    closeAll();
  };

  return {
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
  };
};