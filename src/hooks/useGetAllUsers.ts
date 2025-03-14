import { getAllUsers, User } from "@/services/crud";
import { useQuery } from "@tanstack/react-query";

export const useGetAllUsers = () => {
  return useQuery<User[]>({
    queryKey: ["getOptions"],
    queryFn: getAllUsers,
  });
};
