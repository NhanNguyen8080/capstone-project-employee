import React, { useState, useEffect } from "react";
import { Typography, Card, Spinner, Input, Button, Switch } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import {
  fetchCategories,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} from "../../services/categoryService.js";
import CategoryActions from "../../components/Admin/CategoryActions.jsx";
import AddCategoryModal from "../../components/Admin/AddCategoryModal.jsx";
import EditCategoryModal from "../../components/Admin/EditCategoryModal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { fetchProductsbyBranch } from "../../services/warehouseService.js";
import { addProduct, changeProductStatus, deleteProductById, fetchAllProducts, updateProductById } from "../../services/productService.js";
import ProductActions from "../../components/Admin/ProductActions.jsx";
import ChangeStatusButton from "../../components/Admin/ChangeStatusButton.jsx";
import ChangeProductStatusButton from "../../components/Admin/ChangeProductStatusButton.jsx";
import EditProductModal from "../../components/Admin/EditProductModal.jsx";
import AddProductModal from "../../components/Admin/AddProductModal.jsx";
import { updateProductAPI } from "../../api/apiProduct.js";
import ConfirmDeleteModal from "../../components/Admin/ConfirmDeleteProductModal.jsx";
import ConfirmDeleteProductModal from "../../components/Admin/ConfirmDeleteProductModal.jsx";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState(""); // Search input state

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem("token");
  const [isReload, setIsReload] = useState(false); // Add reload state


  // Fetch products
  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await fetchAllProducts();

      const activeProducts = response
        .sort((a, b) => b.id - a.id);
      setProducts(activeProducts);
      setFilteredProducts(activeProducts);
      setCurrentPage(1);
    } catch (err) {
      setError("Đã xảy ra lỗi khi lấy dữ liệu sản phẩm.");
      toast.error("Không thể lấy dữ liệu sản phẩm!", { position: "top-right" });
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProductData();
    setIsReload(false);
  }, [isReload]);



  // Filter categories based on the search term
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.productName?.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.productCode?.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset pagination when search changes
  }, [searchTerm, products]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 99999 }}
      />
      <div className="container mx-auto p-4">
        <Card className="shadow-lg">
          <div className="flex justify-between items-center p-4">
            <Typography variant="h4" className="p-4 text-center">
              Quản lý <span className="text-orange-500">[Sản phẩm]</span> ({filteredProducts.length})
            </Typography>
            <Button
              onClick={() => setIsAddModalOpen(true)}
            >
              <FontAwesomeIcon icon={faPlus} />{" "}
              Tạo mới
            </Button>
          </div>

          {/* Search Bar */}
          <div className="p-4">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full p-2 border border-gray-300 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex justify-center p-4">
              <Spinner className="h-10 w-10" />
            </div>
          ) : error ? (
            <Typography variant="h6" color="red" className="text-center p-4">
              {error}
            </Typography>
          ) : (
            <div className="overflow-x-auto p-4">
              <table className="min-w-full border border-gray-200 bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-4 border-b">#</th>
                    <th className="p-4 border-b">Ảnh</th>
                    <th className="p-4 border-b">Tên sản phẩm</th>
                    <th className="p-4 border-b">Thuộc tính</th>
                    <th className="p-4 border-b">Giá niêm yết</th>
                    <th className="p-4 border-b">Giá bán</th>
                    <th className="p-4 border-b">Giá thuê</th>
                    <th className="p-4 border-b">Trạng thái</th>
                    <th className="p-4 border-b"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="p-4 border-b">{indexOfFirstItem + index + 1}</td>
                      <td className="p-4 border-b">
                        <img
                          src={product.imgAvatarPath}
                          alt={product.productName}
                          className="h-10 w-10 object-cover rounded"
                        />
                      </td>
                      <td className="p-4 border-b">{product.productName}</td>
                      <td className="p-4 border-b">{product.color} - {product.size} - {product.condition}</td>
                      <td className="p-4 border-b">{product.listedPrice ? product.listedPrice.toLocaleString('vi-VN') : 0}</td>
                      <td className="p-4 border-b">{product.price.toLocaleString('vi-VN')}</td>
                      <td className="p-4 border-b">{product.rentPrice === 0 ? "" : product.rentPrice.toLocaleString('vi-VN')}</td>
                      <td className="p-4 border-b">
                        <ChangeProductStatusButton
                          product={product}
                          isActive={product.status}
                        />
                      </td>
                      <td className="p-4 border-b">
                        <ProductActions
                          category={product}
                          onEdit={() => {
                            setSelectedProduct(product);
                            setIsEditModalOpen(true);
                            setIsEditModal(true);
                          }}
                          onView={() => {
                            setSelectedProduct(product);
                            setIsEditModalOpen(true);
                            setIsEditModal(false);
                          }}
                          onDelete={() => {
                            setSelectedProduct(product);
                            setIsConfirmDeleteModalOpen(true);
                          }}
                        />
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="flex justify-center mt-4">
                {[...Array(totalPages).keys()].map((number) => (
                  <button
                    key={number + 1}
                    onClick={() => handlePageChange(number + 1)}
                    className={`px-3 py-1 mx-1 border rounded ${currentPage === number + 1 ? "bg-black text-white" : "bg-gray-200"
                      }`}
                  >
                    {number + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Add Product Modal */}
        {isAddModalOpen && (
          <AddProductModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            // onAddProduct={handleAddProduct}
            setIsReload={setIsReload}

          />
        )}

        {/* Edit Product Modal */}
        {isEditModalOpen && selectedProduct && (
          <EditProductModal
            isEdit={isEditModal}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            product={selectedProduct}
            setIsReload={setIsReload}
          />
        )}

        {/* Confirm Delete Product Modal */}
        {isConfirmDeleteModalOpen && selectedProduct && (
          <ConfirmDeleteProductModal
            isOpen={isConfirmDeleteModalOpen}
            onClose={() => setIsConfirmDeleteModalOpen(false)}
            product={selectedProduct}
            setIsReload={setIsReload}
          />
        )}
      </div>
    </>
  );
};

export default ProductManagement;
