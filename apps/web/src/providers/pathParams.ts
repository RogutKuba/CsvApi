import { usePathname } from "next/navigation";

export const usePathParams = () => {
  const pathname = usePathname();
};
