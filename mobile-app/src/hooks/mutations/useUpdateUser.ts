import { UseMutationResult, useMutation } from "@tanstack/react-query";

import { updateUser } from "@/services/user.service";
import { User } from "@/types";

type UpdateUserPayload = {
  userId: string;
  name?: string;
  lastName?: string;
  photo?: string;
};

type UseUpdateUserOptions = {
  onSuccess?: (data: User) => void;
  onError?: (error: Error) => void;
};

export const useUpdateUser = (
  options?: UseUpdateUserOptions
): UseMutationResult<User, Error, UpdateUserPayload> => {
  return useMutation<User, Error, UpdateUserPayload>({
    mutationFn: ({ userId, ...payload }) => updateUser(userId, payload),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

