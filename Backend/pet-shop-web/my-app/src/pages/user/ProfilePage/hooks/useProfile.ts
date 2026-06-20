import {useCallback} from "react";
import {useAuth} from "../../../../context/authContext";
import * as customerService from "../../../../services/customerService";
import * as userService from "../../../../services/userService";
import type {UserResponse, UserUpdateRequest} from "../../../../types/userTypes.ts";

export function useProfile() {
  const {user, setUser, loading, logout: authLogout} = useAuth();

  const refetch = useCallback(async () => {
    const customer = await customerService.getInfo();
    setUser(customer);
    return customer;
  }, [setUser]);

  const updateProfile = useCallback(
      async (userId: string, request: UserUpdateRequest): Promise<UserResponse> => {
        const res = await userService.updateUser(userId, request);
        refetch();
        return res;
      },
      [refetch],
  );

  const logout = useCallback(() => {
    authLogout();
  }, [authLogout]);

  return {
    user,
    loading,
    refetch,
    updateProfile,
    logout,
  };
}
