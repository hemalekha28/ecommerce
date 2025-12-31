import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/cartContext';
import { formatPrice } from '../utils/helpers';

// Fallback image component
const FallbackImage = () => (
  <div className="fallback-image">
    <div className="fallback-icon">
      <FiShoppingCart size={32} />
    </div>
  </div>
);

const ProductCard = ({ product, showActions = true }) => {
  const { addToCart, wishlist, addToWishlist, removeFromWishlist, isInCart, getItemQuantityInCart } = useCart();
  const navigate = useNavigate();

  // Check if product is in wishlist
  const isWishlisted = wishlist.some(item => item._id === product._id);
  
  // Check if product is in cart
  const inCart = isInCart(product._id);
  const cartQuantity = getItemQuantityInCart(product._id);

  // Fallback image from public directory
  const fallbackImageUrl = '/assets/no-image-placeholder.svg';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isWishlisted) {
        removeFromWishlist(product._id);
      } else {
        addToWishlist(product);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  // Get category name
  const getCategoryName = () => {
    if (!product.category) return '';
    return typeof product.category === 'string' 
      ? product.category 
      : product.category.name || '';
  };

  const categoryName = getCategoryName();

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FiStar key={i} fill="currentColor" />);
    }

    if (hasHalfStar) {
      stars.push(<FiStar key="half" fill="currentColor" opacity="0.5" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FiStar key={`empty-${i}`} fill="none" />);
    }

    return stars;
  };

  // Function to get the correct image URL with better error handling
  const getImageUrl = (imagePath) => {
    if (!imagePath) return fallbackImageUrl;
      
    // If it's already a full URL or blob URL, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
      return imagePath;
    }
      
    // Handle relative paths - construct full backend URL
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
    // Remove any leading slashes and 'uploads' directory duplication
    let cleanPath = imagePath.replace(/^\/+/, ''); // Remove leading slashes
      
    // If path doesn't include 'uploads', add it
    if (!cleanPath.startsWith('uploads/')) {
      cleanPath = `uploads/${cleanPath}`;
    }
      
    return `${baseUrl}/${cleanPath}`;
  };

  return (
    <div className="product-card">
      {/* Image Container */}
      <div className="image-container">
        <Link to={`/product/${product._id}`}>
          <div className="image-wrapper">
            <img
              src={getImageUrl(product.image) || fallbackImageUrl}
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackImageUrl;
                e.target.className = 'product-image fallback';
                e.target.style.objectFit = 'contain';
                e.target.style.padding = '1rem';
              }}
            />
          </div>
        </Link>

        {/* Badges */}
        {inCart && (
          <div className="in-cart-badge">
            <FiCheck size={14} />
            In Cart ({cartQuantity})
          </div>
        )}

        {product.stock === 0 && (
          <div className="out-of-stock">Out of Stock</div>
        )}

        {showActions && (
          <button
            className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        {categoryName && <div className="category">{categoryName}</div>}
        
        <h3 className="product-name">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>
        
        <div className="price">{formatPrice(product.price)}</div>
        
        {product.rating > 0 && (
          <div className="rating">
            <div className="stars">
              {renderStars(product.rating)}
            </div>
            <span className="review-count">({product.numreviews || 0})</span>
          </div>
        )}

        {showActions && (
          <button
            className={`add-to-cart-btn ${!product.stock ? 'out-of-stock' : ''}`}
            onClick={handleAddToCart}
            disabled={!product.stock}
          >
            <FiShoppingCart size={18} />
            {product.stock ? (inCart ? 'In Cart' : 'Add to Cart') : 'Out of Stock'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;