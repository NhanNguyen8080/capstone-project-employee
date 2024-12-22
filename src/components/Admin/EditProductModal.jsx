import React, { useState, useEffect } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faSave, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getAllImagesVideosByProductId } from "../../services/imageVideosService";
import { SportSelect } from "../Product/SportSelect";
import { fetchSportDetails } from "../../services/sportService";
import { fetchCategoryDetails } from "../../services/categoryService";
import { getBrandDetails } from "../../services/brandService";
import { CategorySelect } from "../Product/CategorySelect";
import { BrandSelect } from "../Product/BrandSelect";

const EditProductModal = ({ isEdit, isOpen, onClose, onEditProduct, product }) => {
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [price, setPrice] = useState(0);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState(0);
  const [height, setHeight] = useState(0);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [weight, setWeight] = useState(0);
  const [isRent, setIsRent] = useState(false);
  const [sportId, setSportId] = useState(0);
  const [productMainImage, setProductMainImage] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [sportName, setSportName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sport, setSport] = useState("");
  useEffect(() => {
    console.log(product);
    console.log(productImages);

    if (product) {
      setProductName(product.productName || "");
      setProductCode(product.productCode || "");
      setPrice(product.price || 0);
      setColor(product.color || "");
      setSize(product.size || "");
      setCondition(product.condition || 0);
      setHeight(product.height || 0);
      setLength(product.length || 0);
      setWidth(product.width || 0);
      setWeight(product.weight || 0);
      setIsRent(product.isRent || false);
      setSportName(product.sportName || "");
      setProductMainImage(product.imgAvatarPath || "");
      getProductImages(product.id)
    }
  }, [product]);

  const selectedSport = async () => {
    try {
      const data = await fetchSportDetails(product.sportId);
      console.log(data.id);
      setSport(data.id)
    } catch (error) {
      console.error("Failed to fetch sport", error);
    }
  }

  const selectedCategory = async () => {
    try {
      const data = await fetchCategoryDetails(product.categoryID);
      console.log(data.id);
      setCategory(data.id)
    } catch (error) {
      console.error("Failed to fetch category", error);
    }
  }

  const selectedBrand = async () => {
    try {
      const data = await getBrandDetails(product.brandId);
      console.log(data);
      setBrand(data.id)
    } catch (error) {
      console.error("Failed to fetch brand", error);
    }
  }

  console.log(brand);


  useEffect(() => {
    if (product) {
      selectedSport()
      selectedCategory()
      selectedBrand()
    }
  }, product)

  const getProductImages = async (productId) => {
    try {
      const data = await getAllImagesVideosByProductId(productId);
      console.log(data);

      // Extract imageUrl and set them to productImagesPreview
      const imageUrls = data.map(item => item.imageUrl);
      setProductImages(imageUrls);
    }
    catch (error) {
      console.error("Error:", error);
    }
  }

  const removeMainImage = () => {
    // setFormData((prev) => ({ ...prev, mainImage: null }));
    setProductMainImage(null);
  };

  const removeProductImage = (index) => {
    // setFormData((prev) => ({
    //   ...prev,
    //   productImages: prev.productImages.filter((_, i) => i !== index),
    // }));
    setProductImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // setFormData((prev) => ({ ...prev, mainImage: file }));
      setProductMainImage(URL.createObjectURL(file));
    }
  };

  const handleProductImagesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setProductImages((prev) => [...prev, ...previews]);
    console.log(previews);

    // setFormData((prev) => ({
    //   ...prev,
    //   productImages: [...prev.productImages, ...files],
    // }));
  };

  const validateProduct = () => {
    const errors = [];

    if (!productName.trim()) errors.push("Product name is required.");
    if (!productCode.trim()) errors.push("Product code is required.");
    if (price <= 0) errors.push("Price must be greater than 0.");
    if (!color.trim()) errors.push("Color is required.");
    if (!size.trim()) errors.push("Size is required.");
    if (condition <= 0) errors.push("Condition must be a positive number.");
    if (height <= 0) errors.push("Height must be greater than 0.");
    if (length <= 0) errors.push("Length must be greater than 0.");
    if (width <= 0) errors.push("Width must be greater than 0.");
    if (weight <= 0) errors.push("Weight must be greater than 0.");
    if (sportId <= 0) errors.push("Sport ID must be a positive number.");
    if (!productMainImage.trim()) errors.push("Main product image is required.");
    if (productImages.length === 0) errors.push("At least one product image is required.");
    if (!brandName.trim()) errors.push("Brand name is required.");
    if (!categoryName.trim()) errors.push("Category name is required.");
    if (!sportName.trim()) errors.push("Sport name is required.");

    if (errors.length > 0) {
      alert("Validation Errors:\n" + errors.join("\n"));
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateProduct) {
      console.log("Product is valid!");

      return;
    }

    const payload = {
      productName: productName.trim(),
      productCode: productCode.trim(),
      price: parseFloat(price),
      color: color.trim(),
      size: size.trim(),
      condition: parseInt(condition, 10),
      height: parseFloat(height),
      length: parseFloat(length),
      width: parseFloat(width),
      weight: parseFloat(weight),
      isRent,
      sportId: parseInt(sportId, 10),
      productMainImage: productMainImage.trim(),
      productImages: productImages, // Assuming it's already an array of valid images
      brandName: brandName.trim(),
      categoryName: categoryName.trim(),
      sportName: sportName.trim(),
    };

    onEditProduct(product.id, payload);

    onClose();
  };

  return (
    <Dialog open={isOpen} handler={onClose}>
      <div className="p-6 bg-white rounded shadow-lg h-screen overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold">Chỉnh Sửa Sản Phẩm</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="flex">
          <div className="mr-2 mt-4 w-1/2">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
              Tên Sản Phẩm
            </label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              disabled={!isEdit} // Disable when not in edit mode
              className={`w-full mt-2 border rounded px-3 py-2 ${!isEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
            />
          </div>
          <div className="ml-2 mt-4 w-1/2">
            <label htmlFor="productCode" className="block text-sm font-medium text-gray-700">
              Mã Sản Phẩm
            </label>
            <input
              type="text"
              id="productCode"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              disabled={!isEdit} // Disable when not in edit mode
              className={`w-full mt-2 border rounded px-3 py-2 ${!isEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
            />
          </div>
        </div>

        <div className="flex">
          <div className="mr-2 w-1/2 mt-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Giá Bán
            </label>
            <div className="relative">
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                disabled={!isEdit} // Disable when not in edit mode
                className={`w-full mt-2 border rounded px-3 py-2 ${!isEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
              />
              <span className="absolute inset-y-0 right-8 flex items-center text-gray-500">
                ₫
              </span>
            </div>
          </div>
          <div className="ml-2 w-1/2 mt-4">
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">
              Màu Sắc
            </label>
            <input
              type="text"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={!isEdit} // Disable when not in edit mode
              className={`w-full mt-2 border rounded px-3 py-2 ${!isEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
            />
          </div>
        </div>
        <div className="flex">
          <div className="mr-2 w-1/2 mt-4">
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              Size
            </label>
            <input
              type="text"
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              disabled={!isEdit} // Disable when not in edit mode
              className={`w-full mt-2 border rounded px-3 py-2 ${!isEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
            />
          </div>
          <div className="ml-2 w-1/2 mt-4">
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
              Tình Trạng
            </label>
            <input
              type="number"
              id="condition"
              value={condition}
              onChange={(e) => setCondition(parseInt(e.target.value, 10) || 0)}
              disabled={!isEdit} // Disable when not in edit mode
              className={`w-full mt-2 border rounded px-3 py-2 ${!isEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
            />
          </div>
        </div>
        <div className="flex">
          <div className="w-1/4 mr-2 mt-4">


            <label htmlFor="height" className="block text-sm font-medium text-gray-700">
              Chiều Cao
            </label>
            <div className="relative">
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                disabled={!isEdit} // Disable when not in edit mode
                className={`w-full mt-2 border rounded px-3 py-2 ${!isEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
              />
              <span className="absolute inset-y-0 right-7 flex items-center text-gray-500">
                mm
              </span>
            </div>
          </div>
          <div className="w-1/4 mx-2 mt-4">
            <label htmlFor="length" className="block text-sm font-medium text-gray-700">
              Chiều Dài
            </label>
            <div className="relative">
              <input
                type="number"
                id="length"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                disabled={!isEdit} // Disable when not in edit mode
                className={`w-full mt-2 border rounded px-3 py-2 ${!isEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
              />
              <span className="absolute inset-y-0 right-7 flex items-center text-gray-500">
                mm
              </span>
            </div>

          </div>
          <div className="w-1/4 mx-2 mt-4">
            <label htmlFor="width" className="block text-sm font-medium text-gray-700">
              Chiều Rộng
            </label>
            <div className="relative">
              <input
                type="number"
                id="width"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                disabled={!isEdit} // Disable when not in edit mode
                className={`w-full mt-2 border rounded px-3 py-2 ${!isEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
              />
              <span className="absolute inset-y-0 right-7 flex items-center text-gray-500">
                mm
              </span>
            </div>

          </div>
          <div className="w-1/4 ml-2 mt-4">
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
              Trọng Lượng
            </label>
            <div className="relative">
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                disabled={!isEdit} // Disable when not in edit mode
                className={`w-full mt-2 border rounded px-3 py-2 ${!isEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
              />
              <span className="absolute inset-y-0 right-7 flex items-center text-gray-500">
                g
              </span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-1/4 mr-2 mt-4">
            <SportSelect
              sport={sport}
              setSport={setSport}
            />
          </div>
          <div className="w-1/4 mx-2 mt-4">
            <CategorySelect
              category={category}
              setCategory={setCategory}
            />
          </div>
          <div className="w-1/4 mx-2 mt-4">

            <BrandSelect
              brand={brand}
              setBrand={setBrand}
            />
          </div>
          <div className="w-1/4 ml-2 mt-4">
            <label htmlFor="isRent" className="block text-sm font-medium text-gray-700">
              Có Cho Thuê
            </label>
            <input
              type="checkbox"
              id="isRent"
              checked={isRent}
              onChange={(e) => setIsRent(e.target.checked)}
              disabled={!isEdit} // Disable when not in edit mode
              className={`w-full mt-2 border rounded px-3 py-2 ${!isEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
            />
          </div>
        </div>
        <div className="flex">
          <div className="mr-2 mt-4 w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh sản phẩm đại diện
            </label>
            <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-md">
              {productMainImage ? (
                <div className="relative">
                  <img
                    src={productMainImage}
                    alt="Main product"
                    className="max-h-32 rounded-md"
                  />
                  {isEdit && (
                    <button
                      type="button"
                      onClick={removeMainImage}
                      className="absolute top-1 right-1 -mt-2 -mr-2 text-black p-1 hover:text-red-500"
                    >
                      <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <FontAwesomeIcon icon={faCloudUploadAlt} className="mx-auto h-12 w-12 text-gray-400" />
                  {isEdit ? (
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
                  ) : (
                    <p className="text-gray-500">Không thể chỉnh sửa</p>
                  )}
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="ml-2 mt-4 w-2/3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đăng ảnh sản phẩm
            </label>
            <div className="mt-1 flex items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative h-40">
              {productImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-grow text-center">
                  <FontAwesomeIcon
                    icon={faCloudUploadAlt}
                    className="h-12 w-12 text-gray-400 mb-2"
                  />
                  {isEdit ? (
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
                  ) : (
                    <p className="text-gray-500">Không thể chỉnh sửa</p>
                  )}
                  <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex-grow">
                    <div className="flex gap-2 overflow-x-auto">
                      {productImages.map((img, index) => (
                        <div
                          key={index}
                          className="relative flex-shrink-0 h-24 w-24 rounded-lg overflow-hidden"
                        >
                          <img
                            src={img}
                            alt={`Product ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          {isEdit && (
                            <button
                              type="button"
                              className="absolute top-1 right-1 p-1 text-black hover:text-red-500 focus:outline-none"
                              onClick={() => removeProductImage(index)}
                            >
                              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {isEdit && productImages.length < 5 && (
                    <label
                      htmlFor="gallery-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ml-4"
                    >
                      <span>Thêm ảnh</span>
                      <input
                        id="gallery-upload"
                        name="gallery-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleProductImagesUpload}
                      />
                    </label>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>



        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50"
          >
            Hủy
          </button>
          {isEdit && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
            >
              <FontAwesomeIcon icon={faSave} className="mr-1" />
              Lưu
            </button>
          )}

        </div>

      </div>
    </Dialog>
  );
};

export default EditProductModal;
