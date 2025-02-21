"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PaginationButtonProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  preserveParams?: string[];
}

export function PaginationButton({
  currentPage,
  totalPages,
  baseUrl,
  preserveParams = [],
}: PaginationButtonProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    router.push(`${baseUrl}?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
} 