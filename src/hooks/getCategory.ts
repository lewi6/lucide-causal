import { useQuery } from "@tanstack/react-query";

export const useGetOptions = (searchTerm: string, showOptions: boolean) => {
  const fetchOptions = useQuery<Option[]>({
    queryKey: ["getOptions", searchTerm],
    queryFn: () => getOptions(searchTerm),
    // enabled: showOptions && searchTerm.length > 0,
  });

  return {
    data: fetchOptions.data?.map((option) => {
      return { label: option.name, value: option.value };
    }),
    isLoading: fetchOptions.isLoading,
  };
};
interface Option {
  id: string;
  name: string;
  value: number;
  category: string;
}

async function getOptions(search: string): Promise<Option[]> {
  const response = await fetch(
    `https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete?search=${encodeURIComponent(
      search
    )}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}
