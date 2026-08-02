import { type PaginationProps } from "~/types";

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  onPageChange,
  currentPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex justify-center gap-2 mt-8">
      {Array.from({ length: totalPages }, (_, idx) => {
        const page = idx + 1;
        const isCurrent = currentPage === page;

        return (
          <button
            key={page}
            type="button"
            aria-label={`Page ${page}`}
            aria-current={isCurrent ? "page" : undefined}
            className={`px-3 py-1 cursor-pointer rounded ${isCurrent ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"} `}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        );
      })}
    </nav>
  );
};

export default Pagination;
