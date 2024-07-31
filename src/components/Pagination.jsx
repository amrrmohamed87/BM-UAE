import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Pagination = ({
  rowsPerPage,
  handleRowsPerPage,
  currentPage,
  totalPages,
  setCurrentPage,
}) => (
  <div className="flex items-center gap-6">
    <div className="flex items-center gap-1">
      <p>Rows per Page:</p>
      <input
        type="number"
        value={rowsPerPage}
        onChange={handleRowsPerPage}
        className="w-10 pl-3 border rounded-md shadow"
      />
    </div>
    <p>
      Page {currentPage} of {totalPages}
    </p>
    <div className="flex items-center gap-1">
      <button
        className="px-2 py-1 rounded-md cursor-pointer border-2 bg-blue-900 transition-all duration-200 hover:bg-blue-500"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(1)}
      >
        <ChevronsLeft size={20} className="text-white" />
      </button>
      <button
        className="px-2 py-1 rounded-md cursor-pointer border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-500"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
      >
        <ChevronLeft size={20} className="text-white" />
      </button>
      <button
        className="px-2 py-1 rounded-md cursor-pointer border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-500"
        disabled={currentPage >= totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
      >
        <ChevronRight size={20} className="text-white" />
      </button>
      <button
        className="px-2 py-1 rounded-md cursor-pointer border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-500"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(totalPages)}
      >
        <ChevronsRight size={20} className="text-white" />
      </button>
    </div>
  </div>
);

export default Pagination;
