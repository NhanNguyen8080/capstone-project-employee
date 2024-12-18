import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { CategorySelect } from '../../components/Product/CategorySelect';
import { BrandSelect } from '../../components/Product/BrandSelect';
import { SportSelect } from '../../components/Product/SportSelect';
import SearchBar from '../../components/Admin/SearchBar';
import ImportFileExcel from './ImportFileExcel';
import TemplateFile from './TemplateFile';
const ImportProduct = () => {
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [productImagesPreview, setProductImagesPreview] = useState([]);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sport, setSport] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isImportExcel, setIsImportExcel] = useState(false)
  const [isImportDirectly, setIsImportDirectly] = useState(false)

  const [formData, setFormData] = useState({
    categoryId: "",
    brandId: "",
    sportId: "",
    productCode: "",
    mainImage: null,
    productImages: [],
    quantity: 0,
    productName: "",
    listedPrice: 0,
    isRent: true,
    price: 0,
    rentPrice: 0,
    size: "",
    description: "",
    color: "",
    condition: 0,
    height: 0,
    length: 0,
    width: 0,
    weight: 0,
    offers: "",
    discount: 0,
  });

  // Update formData when category, brand, or sport changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      categoryId: category,
      brandId: brand,
      sportId: sport,
    }));
  }, [category, brand, sport]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, mainImage: file }));
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProductImagesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setProductImagesPreview((prev) => [...prev, ...previews]);
    console.log(previews);

    setFormData((prev) => ({
      ...prev,
      productImages: [...prev.productImages, ...files],
    }));
  };

  const removeMainImage = () => {
    setFormData((prev) => ({ ...prev, mainImage: null }));
    setMainImagePreview(null);
  };

  const removeProductImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index),
    }));
    setProductImagesPreview((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // Create a new FormData object for submission
    const formDataToSend = new FormData();
    formDataToSend.append("CategoryId", formData.categoryId);
    formDataToSend.append("BrandId", formData.brandId);
    formDataToSend.append("SportId", formData.sportId);
    formDataToSend.append("ProductCode", formData.productCode);

    // Attach main image
    if (formData.mainImage) {
      formDataToSend.append("MainImage", formData.mainImage);
    }

    // Attach product images
    formData.productImages.forEach((image, index) => {
      formDataToSend.append(`ProductImages`, image);
    });

    // Add remaining fields
    Object.keys(formData).forEach((key) => {
      if (
        key !== "mainImage" &&
        key !== "productImages" &&
        formData[key] !== undefined
      ) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(
        "https://capstone-project-703387227873.asia-southeast1.run.app/api/Product/import-product",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        alert("Product imported successfully!");
        setFormData({
          categoryId: "",
          brandId: "",
          sportId: "",
          productCode: "",
          mainImage: null,
          productImages: [],
          quantity: 21,
          productName: "",
          listedPrice: 2147,
          isRent: true,
          price: 2147,
          rentPrice: 2147,
          size: "",
          description: "",
          color: "",
          condition: 0,
          height: 0,
          length: 0,
          width: 0,
          weight: 0,
          offers: "",
          discount: 0,
        });
        setMainImagePreview(null);
        setProductImagesPreview([]);
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        alert(`Failed to import product: ${JSON.stringify(errorData.errors)}`);
      }
    } catch (error) {
      console.error("Error importing product:", error);
      alert("Error importing product");
    }
  };
  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        categoryId: selectedProduct.categoryID || "",
        brandId: selectedProduct.brandId || "",
        sportId: selectedProduct.sportId || "",
        productCode: selectedProduct.productCode || "",
        productName: selectedProduct.productName || "",
        listedPrice: selectedProduct.listedPrice || "",
        isRent: selectedProduct.isRent || false,
        price: selectedProduct.price || "",
        rentPrice: selectedProduct.rentPrice || "",
        size: selectedProduct.size || "",
        color: selectedProduct.color || "",
        condition: selectedProduct.condition || 0,
        height: selectedProduct.height || 0,
        length: selectedProduct.length || 0,
        width: selectedProduct.width || 0,
        weight: selectedProduct.weight || 0,
      }));

      // Set image previews if needed
      setMainImagePreview(selectedProduct.imgAvatarPath || null);
      setProductImagesPreview(selectedProduct.listImages?.$values || []);
    }
  }, [selectedProduct]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  return (

    <div className="container mx-auto p-6 space-y-8">
      <div className='bg-white border border-gray-300 shadow-md rounded-lg p-6'>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Nhập kho từ file Excel</h3>
        <button
          onClick={() => setIsImportExcel(!isImportExcel)}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-500 transition-colors"
        >
          Nhập kho từ file Excel
        </button>
        {isImportExcel && (
          <div className="mt-4 space-y-4">
            <ImportFileExcel />
       <TemplateFile/>
          </div>
        )}
      </div>
      <div className='bg-white border border-gray-300 shadow-md rounded-lg p-6'>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Nhập kho trực tiếp</h3>
        <button
          onClick={() => setIsImportDirectly(!isImportDirectly)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Nhập kho trực tiếp
        </button>
        {isImportDirectly && (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 space-y-4">
                <SearchBar onSelect={handleSelectProduct} />
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Product Information */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="productName">
                        Tên sản phẩm
                      </label>
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        id="productName"
                        name="productName"
                        type="text"
                        value={formData.productName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <CategorySelect
                          category={category}
                          setCategory={setCategory}
                          selectedProduct={selectedProduct}
                        />

                      </div>
                      <div>
                        <BrandSelect
                          brand={brand}
                          setBrand={setBrand}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <SportSelect
                        sport={sport}
                        setSport={setSport}
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="productCode">
                          Mã sản phẩm
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          id="productCode"
                          name="productCode"
                          type="text"
                          value={formData.productCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quantity">
                          Số lượng
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          id="quantity"
                          name="quantity"
                          type="number"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="listedPrice">
                          Giá niêm yết
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          id="listedPrice"
                          name="listedPrice"
                          type="number"
                          value={formData.listedPrice}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
                          Giá mua
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          id="price"
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="rentPrice">
                          Giá thuê
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          id="rentPrice"
                          name="rentPrice"
                          type="number"
                          value={formData.rentPrice}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="size">
                          Size
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          id="size"
                          name="size"
                          type="text"
                          value={formData.size}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="color">
                          Màu sắc
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          id="color"
                          name="color"
                          type="text"
                          value={formData.color}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="condition"
                        >
                          Tình trạng
                        </label>
                        <div className="relative">
                          <input
                            className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            id="condition"
                            name="condition"
                            type="number"
                            value={formData.condition}
                            onChange={handleInputChange}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                            %
                          </span>
                        </div>
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="isRent"
                        >
                          Duyệt thuê
                        </label>
                        <div className="flex items-center space-x-4">
                          <p className="text-gray-700">Đơn hàng được thuê</p>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              className="sr-only peer"
                              id="isRent"
                              name="isRent"
                              type="checkbox"
                              checked={formData.isRent}
                              onChange={handleInputChange}
                            />
                            <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-colors"></div>
                            <div className="w-4 h-4 bg-white rounded-full shadow absolute top-0.5 left-0.5 peer-checked:translate-x-5 transition-transform"></div>
                          </label>
                        </div>
                      </div>

                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="height"
                        >
                          Chiều cao
                        </label>
                        <div className="relative">
                          <input
                            className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            id="height"
                            name="height"
                            type="number"
                            value={formData.height}
                            onChange={handleInputChange}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                            mm
                          </span>
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="length"
                        >
                          Chiều dài
                        </label>
                        <div className="relative">
                          <input
                            className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            id="length"
                            name="length"
                            type="number"
                            value={formData.length}
                            onChange={handleInputChange}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                            mm
                          </span>
                        </div>
                      </div>

                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="width"
                        >
                          Chiều rộng
                        </label>
                        <div className="relative">
                          <input
                            className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            id="width"
                            name="width"
                            type="number"
                            value={formData.width}
                            onChange={handleInputChange}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                            mm
                          </span>
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="weight"
                        >
                          Khối lượng
                        </label>
                        <div className="relative">
                          <input
                            className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            id="weight"
                            name="weight"
                            type="number"
                            value={formData.weight}
                            onChange={handleInputChange}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                            g
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column - Image Upload */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ảnh sản phẩm đại diện
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        {mainImagePreview ? (
                          <div className="relative">
                            <img
                              src={mainImagePreview}
                              alt="Main product"
                              className="max-h-48 rounded-md"
                            />
                            <button
                              type="button"
                              onClick={removeMainImage}
                              className="absolute top-1 right-1 -mt-2 -mr-2 text-black p-1 hover:text-red-500"
                            >
                              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1 text-center">
                            <FontAwesomeIcon icon={faCloudUploadAlt} className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="main-image-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                              >
                                <span>Tải ảnh lên</span>
                                <input
                                  id="main-image-upload"
                                  name="main-image-upload"
                                  type="file"
                                  className="sr-only"
                                  onChange={handleMainImageUpload}
                                />
                              </label>
                              <p className="pl-1">hoặc kéo và thả</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đăng ảnh sản phẩm
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <FontAwesomeIcon icon={faCloudUploadAlt} className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="gallery-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>Tải ảnh</span>
                              <input
                                id="gallery-upload"
                                name="gallery-upload"
                                type="file"
                                className="sr-only"
                                multiple
                                onChange={handleProductImagesUpload}
                              />
                            </label>
                            <p className="pl-1">hoặc kéo và thả</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-4 mt-4">
                      {productImagesPreview.map((img, index) => (
                        <div key={index} className="relative">
                          <div className="group aspect-w-10 aspect-h-7 block overflow-hidden rounded-lg bg-gray-100">
                            {img.loading ? (
                              <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-blue-500 animate-spin absolute inset-0 m-auto" />
                            ) : (
                              <>
                                <img
                                  src={img}
                                  alt={`Product ${index + 1}`}
                                  className="h-20 w-20 object-cover pointer-events-none"
                                />
                                <button
                                  type="button"
                                  className="absolute top-1 right-1 p-1 text-black hover:text-red-500 focus:outline-none"
                                  onClick={() => removeProductImage(index)}
                                >
                                  <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus-ring-offset-2 focus:ring-blue-500"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default ImportProduct;
