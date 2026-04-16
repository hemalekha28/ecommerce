import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiHeadphones,
  FiArrowRight
} from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { api } from '../utils/api';
import Carousel from '../components/Carousel';
import Image from '../components/Image';
import '../styles/home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await api.getProducts();

        const featured = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const categories = [
    {
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=electronics'
    },
    {
      name: 'Clothing',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=clothing'
    },
    {
      name: 'Home & Garden',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=home'
    },
    {
      name: 'Sports',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=sports'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Carousel */}
      <Carousel
        slides={[
          {
            image:
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop',
            badge: 'Limited Time',
            title: 'Premium Gadgets, Exclusive Prices',
            subtitle: 'Upgrade your setup with top-rated electronics and accessories.',
            primaryCta: { href: '/products?category=electronics', label: 'Shop Electronics' },
            secondaryCta: { href: '/products?sortBy=rating', label: 'Best Sellers' },
          },
          {
            image:
              'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
            badge: 'New Season',
            title: 'Style Redefined',
            subtitle: 'Discover curated fashion picks for every occasion.',
            primaryCta: { href: '/products?category=clothing', label: 'Shop Clothing' },
            secondaryCta: { href: '/products', label: 'Explore All' },
          },
          {
            image:
              'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop',
            badge: 'Editor’s Pick',
            title: 'Home & Living Essentials',
            subtitle: 'Handpicked decor to make your space truly yours.',
            primaryCta: { href: '/products?category=home', label: 'Shop Home' },
            secondaryCta: { href: '/products?sortBy=rating', label: 'Top Rated' },
          },
        ]}
      />

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card feature-card-1">
              <div className="feature-icon">
                <FiTruck size={32} />
              </div>
              <h3>Free Shipping</h3>
              <p>Free shipping on orders over ₹2,500</p>
            </div>
            <div className="feature-card feature-card-2">
              <div className="feature-icon">
                <FiShield size={32} />
              </div>
              <h3>Secure Payment</h3>
              <p>100% secure payment processing</p>
            </div>
            <div className="feature-card feature-card-3">
              <div className="feature-icon">
                <FiHeadphones size={32} />
              </div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support</p>
            </div>
            <div className="feature-card feature-card-4">
              <div className="feature-icon">
                <FiShoppingBag size={32} />
              </div>
              <h3>Easy Returns</h3>
              <p>30-day hassle-free returns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Find exactly what you're looking for</p>
          </div>

          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.link}
                className="category-card"
              >
                <div className="category-image-container">
                  <Image
                    src={category.image}
                    alt={category.name}
                    className="category-image"
                    fallback="/assets/no-image-placeholder.svg"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <span className="shop-now">
                    Shop now <FiArrowRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Our top-rated products loved by customers</p>
          </div>

          {loading ? (
            <div className="products-loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/products" className="btn-view-all">
              Explore All Products
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{
        padding: '4rem 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }} className="py-16 text-white">
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          zIndex: 0
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '250px',
          height: '250px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          zIndex: 0
        }}></div>
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ marginBottom: '1rem' }}>Stay Updated</h2>
          <p style={{ marginBottom: '2rem', opacity: 0.9, fontSize: '1.125rem' }} className="mt-2 opacity-90">
            Subscribe to our newsletter for the latest deals and product updates
          </p>
          <form
            style={{ display: 'flex', justifyContent: 'center', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="form-input rounded-md"
              style={{
                flex: 1,
                padding: '0.875rem 1.25rem',
                borderRadius: '12px',
                border: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <button
              type="submit"
              className="btn btn-secondary"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '0.875rem 2rem',
                borderRadius: '12px',
                fontWeight: '600',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;