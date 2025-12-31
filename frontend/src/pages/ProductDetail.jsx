import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiShoppingCart, 
  FiShoppingBag, 
  FiHeart, 
  FiMinus, 
  FiPlus, 
  FiArrowLeft, 
  FiArrowRight,
  FiCheck, 
  FiAlertCircle, 
  FiTruck, 
  FiRotateCcw, 
  FiLock, 
  FiPhone, 
  FiX, 
  FiLoader,
  FiTag,
  FiAward,
  FiPackage
} from 'react-icons/fi';
import { useCart } from '../context/cartContext';
import { useNotification } from '../context/notificationContext';
import { api } from '../utils/api';
import { formatPrice } from '../utils/helpers';

// Simple Notification Toast Component
const SimpleNotification = ({ message, type = 'success', onClose }) => {
  return (
    <div className={`notification-toast ${type}`}>
      {type === 'success' && <FiCheck size={20} />}
      {type === 'error' && <FiAlertCircle size={20} />}
      {type === 'warning' && <FiAlertCircle size={20} />}
      {type === 'info' && <FiAlertCircle size={20} />}
      <span>{message}</span>
      <button onClick={onClose} className="notification-close">
        <FiX size={18} />
      </button>
    </div>
  );
};

// Sub-component: Product Image Gallery with modern styling
const ProductImage = ({ product, selectedImageIndex = 0, onImageError = null }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(selectedImageIndex);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageFailed(true);
    setIsLoading(false);
    if (onImageError) onImageError();
  };

  // Handle various image URL formats
  const getImageUrl = (img) => {
    if (!img) return null;
    
    // If it's already a full URL, return as is
    if (img.startsWith('http')) {
      return img;
    }
    
    // Construct the full URL to the backend
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    // Remove any leading slashes and handle 'uploads' directory
    let cleanPath = img.replace(/^\/*/, '');
    
    // If path doesn't include 'uploads', add it
    if (!cleanPath.startsWith('uploads/')) {
      cleanPath = `uploads/${cleanPath}`;
    }
    
    return `${baseUrl}/${cleanPath}`;
  };

  // Get all images (main image + additional images if available)
  const allImages = [
    product.image,
    ...(product.images || [])
  ].filter(Boolean);

  const currentImage = allImages[currentImageIndex];
  const imageUrl = getImageUrl(currentImage);

  if (!imageUrl || imageFailed) {
    return (
      <div className="product-image-placeholder">
        <span>Image not available</span>
      </div>
    );
  }

  return (
    <div className="product-image-container">
      {/* Main Image */}
      <div className="main-image-wrapper">
        {isLoading && (
          <div className="image-loading">
            <FiLoader className="spinner" />
          </div>
        )}
        <img
          src={imageUrl}
          alt={product.name || 'Product image'}
          className={`main-image ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Image Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
              }}
              className="nav-arrow prev-arrow"
              aria-label="Previous image"
            >
              <FiArrowLeft size={20} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(prev => (prev + 1) % allImages.length);
              }}
              className="nav-arrow next-arrow"
              aria-label="Next image"
            >
              <FiArrowRight size={20} />
            </button>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="thumbnail-container">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
              className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
              aria-label={`View image ${index + 1}`}
            >
              <img 
                src={getImageUrl(img)} 
                alt={`Thumbnail ${index + 1}`} 
                className="thumbnail-image"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Sub-component: Stock Badge with modern status indicator
const StockBadge = ({ stock }) => {
  const inStock = stock > 0;
  const lowStock = inStock && stock <= 10;
  
  return (
    <div className="flex items-center">
      <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium ${
        inStock 
          ? lowStock 
            ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-500/20' 
            : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500/20'
          : 'bg-rose-50 text-rose-800 ring-1 ring-rose-500/20'
      }`}>
        <span className={`w-2 h-2 rounded-full mr-2.5 ${
          inStock 
            ? lowStock 
              ? 'bg-amber-500' 
              : 'bg-emerald-500'
            : 'bg-rose-500'
        }`}></span>
        {inStock 
          ? lowStock 
            ? `Low Stock (${stock} left)` 
            : 'In Stock'
          : 'Out of Stock'}
      </span>
    </div>
  );
};

// Sub-component: Product Info Section - REDESIGNED for Professional Look
const ProductInfo = ({ 
  product, 
  onAddToCart, 
  onBuyNow, 
  onAddToWishlist, 
  isInWishlist, 
  cartQuantity = 0, 
  maxQuantity = 0,
  quantity = 1,
  onQuantityChange,
  disabled = false,
  isAddingToCart = false,
  isBuyingNow = false
}) => {
  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, Math.min(quantity + delta, maxQuantity));
    onQuantityChange?.(newQuantity);
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value) || 1;
    const newQuantity = Math.max(1, Math.min(value, maxQuantity));
    onQuantityChange?.(newQuantity);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;
    try {
      onAddToCart?.(product, quantity);
      showNotification(`${product.name} added to cart!`, 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Failed to add to cart. Please try again.', 'error');
    }
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;
    try {
      onAddToCart?.(product, quantity);
      navigate('/checkout');
    } catch (error) {
      console.error('Error processing buy now:', error);
      showNotification('Failed to process your request. Please try again.', 'error');
    }
  };

  const canAddToCart = !disabled && maxQuantity > 0 && quantity > 0 && (cartQuantity + quantity) <= maxQuantity;
  const isOutOfStock = maxQuantity === 0 || disabled;

  // Debug logs
  console.log('ProductInfo - canAddToCart:', canAddToCart, {
    disabled,
    maxQuantity,
    quantity,
    cartQuantity,
    'cartQuantity + quantity': cartQuantity + quantity,
    isOutOfStock
  });

  return (
    <div className="product-details-section">
      {/* Category Badge */}
      <span className="product-category-badge">
        {product?.category || 'Product'}
      </span>

      {/* Product Name */}
      <h1 className="product-detail-name">
        {product?.name}
      </h1>

      {/* Price Section */}
      <div className="product-price-section">
        <p className="product-price-label">PRICE</p>
        <div className="product-price-display">
          <span className="product-current-price">
            {product?.price ? `₹${Math.round(product.price)}` : 'N/A'}
          </span>
          {product?.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="product-original-price">
                ₹{Math.round(product.originalPrice)}
              </span>
              <span className="product-discount-badge">
                Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Stock Status */}
      <StockBadge stock={product?.stock || 0} />

      {/* Description */}
      <div className="product-description-box">
        <p className="product-description-text">
          {product?.description}
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="quantity-selector-box">
        <label className="quantity-label">
          SELECT QUANTITY
        </label>
        <div className="quantity-controls">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1 || isOutOfStock}
            className="quantity-button"
            type="button"
          >
            <FiMinus size={22} />
          </button>

          <input
            type="number"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={handleQuantityInput}
            disabled={isOutOfStock}
            className="quantity-input"
            aria-label="Quantity"
          />

          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= maxQuantity || isOutOfStock}
            className="quantity-button"
            type="button"
          >
            <FiPlus size={22} />
          </button>

          {maxQuantity > 0 && (
            <span className="quantity-max-label">
              Max: <span className="quantity-max-value">{maxQuantity}</span>
            </span>
          )}
        </div>

        {cartQuantity > 0 && (
          <p className="quantity-info">
            ✓ {cartQuantity} already in cart • Total: <span className="font-bold text-blue-600">{cartQuantity + quantity}/{maxQuantity}</span>
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons-container">
            {/* Row 1: Buy Now + Wishlist */}
            <div className="buttons-row">
              <button
                onClick={handleBuyNow}
                disabled={!canAddToCart || isOutOfStock || isBuyingNow}
                className={`flex-1 bg-white border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isBuyingNow ? 'opacity-75 cursor-not-allowed' : ''} ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                type="button"
              >
                {isBuyingNow ? (
                  <>
                    <FiLoader className="animate-spin mr-2 inline" size={20} />
                    Processing...
                  </>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  'Buy Now'
                )}
              </button>

              <button
                onClick={() => {
                  const productId = product?._id || product?.id;
                  if (!productId) {
                    console.error('Cannot add to wishlist: Invalid product ID');
                    return;
                  }
                  onAddToWishlist(product);
                }}
                className={`btn-wishlist ${isInWishlist(product?._id || product?.id) ? 'active' : ''}`}
                aria-label={isInWishlist(product?._id || product?.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <FiHeart 
                  size={30} 
                  fill={isInWishlist(product?._id || product?.id) ? 'currentColor' : 'none'} 
                />
              </button>
            </div>

            {/* Row 2: Add to Cart (Full Width) */}
            <div className="w-full">
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart || isOutOfStock || isAddingToCart}
                className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${!canAddToCart || isOutOfStock ? 'opacity-75 cursor-not-allowed' : ''} ${isAddingToCart ? 'opacity-75 cursor-wait' : ''}`}
                type="button"
              >
                {isAddingToCart ? (
                  <>
                    <FiLoader className="animate-spin mr-2" size={20} />
                    Adding...
                  </>
                ) : canAddToCart ? (
                  <>
                    <FiShoppingCart className="mr-2" size={20} />
                    Add to Cart
                  </>
                ) : (
                  'Select Options'
                )}
              </button>
            </div>
      </div>

      {isOutOfStock && (
        <div className="out-of-stock-alert">
          <FiAlertCircle size={24} />
          This product is currently OUT OF STOCK
        </div>
      )}

      {/* Trust Badges */}
      <div className="trust-badges-section">
        <p className="trust-badges-title">Why Shop With Us</p>
        <div className="trust-badges-list">
          <div className="trust-badge-item shipping">
            <FiTruck className="trust-badge-icon" size={28} />
            <span className="trust-badge-text">Free shipping on orders over $50</span>
          </div>
          <div className="trust-badge-item returns">
            <FiRotateCcw className="trust-badge-icon" size={28} />
            <span className="trust-badge-text">30-day hassle-free returns</span>
          </div>
          <div className="trust-badge-item security">
            <FiLock className="trust-badge-icon" size={28} />
            <span className="trust-badge-text">Secure payment processing</span>
          </div>
          <div className="trust-badge-item support">
            <FiPhone className="trust-badge-icon" size={28} />
            <span className="trust-badge-text">24/7 customer support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component: Reviews Section
const ReviewsSection = ({ reviews = [], productName = '' }) => {
  if (reviews.length === 0) {
    return (
      <div className="reviews-empty-state">
        <div className="reviews-empty-icon">💬</div>
        <h3 className="reviews-empty-title">No Customer Reviews Yet</h3>
        <p className="reviews-empty-text">Be the first to share your experience with this product!</p>
      </div>
    );
  }

  return (
    <div className="reviews-list">
      {reviews.map((review) => (
        <div key={review._id} className="review-item">
          <div className="review-header">
            <div className="flex-1">
              <p className="review-user-name">{review.user?.name || 'Anonymous Customer'}</p>
              {review.isVerifiedPurchase && (
                <p className="review-verified-badge">
                  <FiCheck size={16} /> Verified Purchase
                </p>
              )}
            </div>
            <p className="review-date">
              {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <p className="review-comment">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    addToCart, 
    wishlist, 
    isAddingToCart, 
    getItemQuantityInCart,
    addToWishlist,
    removeFromWishlist
  } = useCart();
  
  // Use the local notification state instead of useNotification
  // const { showNotification } = useNotification();
  
  // Single source of truth for product state
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [notification, setNotification] = useState(null);
  
  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist && wishlist.some(item => item._id === productId || item.id === productId);
  };

  // Show notification helper function
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    // Auto-hide notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  // Single API call to fetch product data
  useEffect(() => {
    let isMounted = true;
    
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        
        if (!isMounted) return;
        
        if (data.success) {
          const productData = data.data.product;
          setProduct(productData);
          setQuantity(1);
          
          // Load reviews if available
          if (productData.reviews) {
            setReviews(productData.reviews);
          }
        } else {
          throw new Error(data.message || 'Failed to load product');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load product');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchProduct();
    
    return () => {
      isMounted = false;
    };
  }, [id]);
  
  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    const maxAvailable = product?.stock || 0;
    const cartQuantity = getItemQuantityInCart ? getItemQuantityInCart(product?._id) : 0;
    const availableQuantity = Math.max(0, maxAvailable - cartQuantity);
    
    if (newQuantity < 1 || newQuantity > availableQuantity) return;
    setQuantity(newQuantity);
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    const productId = product._id || product.id;
    if (!productId) {
      showNotification('Invalid product', 'error');
      return;
    }
    
    if (product.stock <= 0) {
      showNotification('This product is out of stock', 'error');
      return;
    }
    
    try {
      await addToCart({
        ...product,
        id: productId,
        productId: productId
      }, quantity);
      
      showNotification('Added to cart!', 'success');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      showNotification(err.message || 'Failed to add to cart', 'error');
    }
  };
  
  // Handle buy now
  const handleBuyNow = async () => {
    if (!product) return;
    
    if (product.stock <= 0) {
      showNotification('This product is out of stock', 'error');
      return;
    }
    
    setIsBuyingNow(true);
    try {
      await addToCart({
        ...product,
        id: product._id,
        productId: product._id
      }, quantity);
      
      navigate('/checkout?buyNow=true');
    } catch (err) {
      console.error('Failed to process buy now:', err);
      showNotification('Failed to process order', 'error');
    } finally {
      setIsBuyingNow(false);
    }
  };

  // Calculate stock information
  const productId = product?._id || product?.id;
  const cartQuantity = getItemQuantityInCart ? getItemQuantityInCart(productId) : 0;
  const productStock = Number(product?.stock) || 0;
  const availableQuantity = Math.max(0, productStock - cartQuantity);
  const inStock = availableQuantity > 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="product-loading">
        <FiLoader className="animate-spin" />
        <span>Loading product details...</span>
      </div>
    );
  }
  
  // Error state
  if (error || !product) {
    return (
      <div className="product-error">
        <FiAlertCircle className="product-error-icon" />
        <h2>{error || 'Product not found'}</h2>
        <p className="product-error-message">We couldn't find the product you're looking for.</p>
        <button 
          onClick={() => navigate(-1)}
          className="btn-retry"
        >
          <FiArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="back-button"
      >
        <FiArrowLeft /> Back to Products
      </button>
      
      {/* Main product content */}
      <div className="product-card">
        {/* Product images */}
        <div className="product-image-container">
          <ProductImage product={product} selectedImageIndex={selectedImage} />
        </div>
        
        {/* Product info */}
        <div className="product-info">
          <span className="product-category">{product.category || 'Uncategorized'}</span>
          <h1 className="product-title">{product.name}</h1>
          
          {/* Price and stock status */}
          <div className="product-price">
            <span className="price-current">${product.price?.toFixed(2) || '0.00'}</span>
            <StockBadge stock={availableQuantity} />
          </div>
          
          {/* Description */}
          <div className="product-description">
            <p>{product.description || 'No description available.'}</p>
          </div>
          
          {/* Quantity selector */}
          <div className="quantity-selector">
            <label>Quantity</label>
            <div className="quantity-control">
              <button 
                type="button" 
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <FiMinus />
              </button>
              <input
                type="number"
                className="quantity-input"
                value={quantity}
                readOnly
              />
              <button 
                type="button"
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= availableQuantity}
              >
                <FiPlus />
              </button>
              <span className="quantity-available">
                {availableQuantity} {availableQuantity === 1 ? 'item' : 'items'} available
              </span>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="product-actions">
            <button 
              className={`btn-add-to-cart ${!inStock ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={!inStock || isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <FiLoader className="animate-spin" />
                  <span>Adding...</span>
                </>
              ) : inStock ? (
                <>
                  <FiShoppingCart />
                  <span>Add to Cart</span>
                </>
              ) : (
                <span>Out of Stock</span>
              )}
            </button>
            
            <button 
              className={`btn-buy-now ${!inStock ? 'disabled' : ''}`}
              onClick={handleBuyNow}
              disabled={!inStock || isBuyingNow}
            >
              {isBuyingNow ? (
                <>
                  <FiLoader className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Buy Now</span>
              )}
            </button>
            
            <button
              className={`btn-wishlist ${isInWishlist(product?._id || product?.id) ? 'active' : ''}`}
              onClick={() => {
                const productId = product?._id || product?.id;
                if (!productId) {
                  console.error('Cannot update wishlist: Invalid product ID');
                  return;
                }
                isInWishlist(productId) ? removeFromWishlist(productId) : addToWishlist(product);
                showNotification(
                  isInWishlist(productId) 
                    ? 'Removed from wishlist' 
                    : 'Added to wishlist',
                  'success'
                );
              }}
            >
              <FiHeart 
                fill={isInWishlist(product?._id || product?.id) ? 'currentColor' : 'none'}
              />
              <span>{isInWishlist(product?._id || product?.id) ? 'Saved to Wishlist' : 'Save to Wishlist'}</span>
            </button>
          </div>
          
          {/* Product details */}
          <div className="product-meta">
            <div className="meta-item">
              <div className="meta-icon">
                <FiShoppingBag />
              </div>
              <div className="meta-text">
                <div className="meta-label">Category</div>
                <div className="meta-value">{product.category || 'N/A'}</div>
              </div>
            </div>
            
            <div className="meta-item">
              <div className="meta-icon">
                <FiTag />
              </div>
              <div className="meta-text">
                <div className="meta-label">SKU</div>
                <div className="meta-value">{product.sku || 'N/A'}</div>
              </div>
            </div>
            
            {product.brand && (
              <div className="meta-item">
                <div className="meta-icon">
                  <FiAward />
                </div>
                <div className="meta-text">
                  <div className="meta-label">Brand</div>
                  <div className="meta-value">{product.brand}</div>
                </div>
              </div>
            )}
            
            <div className="meta-item">
              <div className="meta-icon">
                <FiPackage />
              </div>
              <div className="meta-text">
                <div className="meta-label">Availability</div>
                <div className={`meta-value ${inStock ? 'in-stock' : 'out-of-stock'}`}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h2>
            Customer Reviews
            {reviews.length > 0 && <span className="reviews-count">({reviews.length})</span>}
          </h2>
          <p className="reviews-subtitle">
            {reviews.length === 0 ? 'Share your experience first!' : 'What customers are saying'}
          </p>
        </div>
        
        <div className="reviews-content">
          <ReviewsSection reviews={reviews} productName={product.name} />
        </div>
      </div>
      
      {/* Notification */}
      {notification && (
        <SimpleNotification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
    </div>
  );
};

export default ProductDetail;