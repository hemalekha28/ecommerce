import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/cartContext';
import { formatPrice } from '../utils/helpers';

const Wishlist = () => {
  const { addToCart, removeFromWishlist, wishlist } = useCart();

  // Helper function to get consistent product ID
  const getProductId = (product) => {
    return product._id || product.id;
  };

  // Helper function to get correct image URL
  const getImageUrl = (product) => {
    if (!product.image) {
      // Create a simple fallback image using canvas
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 300, 200);
      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Product Image', 150, 100);
      return canvas.toDataURL();
    }
    
    // If image is already a full URL, use it as is
    if (product.image.startsWith('http')) {
      return product.image;
    }
    
    // If it's just a filename, construct the full URL
    return `http://localhost:5000/uploads/${product.image}`;
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  const handleMoveToCart = (product) => {
    const productId = getProductId(product);
    addToCart(product);
    removeFromWishlist(productId);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (wishlist.length === 0) {
    return (
      <div className="container" style={{ padding: '2rem 0', minHeight: '60vh' }}>
        <div className="card" style={{ 
          padding: '4rem 2rem', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: 'none',
          boxShadow: '0 8px 20px rgba(250, 204, 21, 0.2)'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 2rem',
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(250, 112, 154, 0.3)'
          }}>
            <FiHeart size={48} color="white" />
          </div>
          <h2 style={{ 
            marginBottom: '1rem', 
            color: '#1f2937',
            fontSize: '2rem',
            fontWeight: '700'
          }}>Your wishlist is empty</h2>
          <p style={{ 
            marginBottom: '2rem', 
            color: '#6b7280',
            fontSize: '1.125rem'
          }}>
            Save items you love for later by clicking the heart icon on any product.
          </p>
          <Link 
            to="/products" 
            className="btn btn-primary btn-lg"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontWeight: '600',
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        color: 'white',
        boxShadow: '0 10px 25px rgba(250, 112, 154, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <FiHeart size={28} color="white" />
            </div>
            <div>
              <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '2rem', fontWeight: '700', color: 'white' }}>My Wishlist</h1>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem' }}>
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
        </div>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          zIndex: 0
        }}></div>
      </div>

      <div className="grid grid-3">
        {wishlist.map((product) => {
          const productId = getProductId(product);
          return (
            <div key={productId} className="card">
              <Link to={`/product/${productId}`}>
                <img
                  src={getImageUrl(product)}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
                  }}
                />
              </Link>

              <div className="card-body">
                <Link to={`/product/${productId}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600', 
                    marginBottom: '0.5rem',
                    color: 'var(--dark)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.name}
                  </h3>
                </Link>

                <div style={{ marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                    {product.category}
                  </span>
                </div>

                <div style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '700', 
                  color: 'var(--primary)', 
                  marginBottom: '1rem' 
                }}>
                  {formatPrice(product.price)}
                </div>

                {product.rating && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginBottom: '1rem' 
                  }}>
                    <div style={{ display: 'flex', color: '#f59e0b' }}>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          style={{
                            color: i < Math.floor(product.rating) ? '#f59e0b' : '#e5e7eb'
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                      {product.rating} ({product.numreviews || 0} reviews)
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="btn btn-primary btn-full"
                    disabled={!product.stock}
                    style={{
                      background: product.stock ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e5e7eb',
                      border: 'none',
                      color: product.stock ? 'white' : '#9ca3af',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      fontWeight: '600',
                      boxShadow: product.stock ? '0 4px 6px rgba(102, 126, 234, 0.2)' : 'none',
                      transition: 'all 0.3s ease',
                      cursor: product.stock ? 'pointer' : 'not-allowed'
                    }}
                    onMouseEnter={(e) => {
                      if (product.stock) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(102, 126, 234, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (product.stock) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(102, 126, 234, 0.2)';
                      }
                    }}
                  >
                    <FiShoppingCart />
                    {product.stock ? 'Move to Cart' : 'Out of Stock'}
                  </button>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-secondary"
                      disabled={!product.stock}
                      style={{ 
                        flex: 1,
                        background: product.stock ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : '#e5e7eb',
                        border: 'none',
                        color: product.stock ? 'white' : '#9ca3af',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        fontWeight: '600',
                        boxShadow: product.stock ? '0 4px 6px rgba(79, 172, 254, 0.2)' : 'none',
                        transition: 'all 0.3s ease',
                        cursor: product.stock ? 'pointer' : 'not-allowed'
                      }}
                      onMouseEnter={(e) => {
                        if (product.stock) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 12px rgba(79, 172, 254, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (product.stock) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 6px rgba(79, 172, 254, 0.2)';
                        }
                      }}
                    >
                      Add to Cart
                    </button>
                    
                    <button
                      onClick={() => handleRemoveFromWishlist(productId)}
                      className="btn btn-danger"
                      title="Remove from wishlist"
                      style={{ 
                        minWidth: '44px',
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        border: 'none',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '10px',
                        fontWeight: '600',
                        boxShadow: '0 4px 6px rgba(245, 87, 108, 0.2)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(245, 87, 108, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(245, 87, 108, 0.2)';
                      }}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center" style={{ marginTop: '3rem' }}>
        <Link 
          to="/products" 
          className="btn btn-primary"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontWeight: '600',
            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
          }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;