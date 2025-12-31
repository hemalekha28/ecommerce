# ProductDetail Page - Deployment & Troubleshooting Guide

## 🚀 DEPLOYMENT CHECKLIST

### Before Deploying:
- [ ] Test all product routes (verify URL updates reflect product ID)
- [ ] Test image loading with actual product URLs
- [ ] Verify API endpoints return correct data structure
- [ ] Test cart context functions (addToCart, isInWishlist, getItemQuantityInCart)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Verify TailwindCSS is configured in project
- [ ] Check React Router is properly set up
- [ ] Ensure backend API is running during tests

### After Deploying:
- [ ] Monitor API response times
- [ ] Check error logs for missing API endpoints
- [ ] Verify images load from CDN/storage
- [ ] Test notification toasts appear/disappear
- [ ] Monitor cart sync between pages
- [ ] Track user interactions (add to cart, wishlist clicks)

---

## 🔧 POTENTIAL ISSUES & SOLUTIONS

### Issue 1: Images Not Loading
**Symptom**: Fallback UI shows instead of product images

**Diagnosis**:
```javascript
// Check API response in browser DevTools
// Network tab → products endpoint → check image URLs
```

**Solutions**:
1. Verify `product.image` field exists in API response
2. Check image URLs are absolute URLs (not relative)
3. Verify image URLs are accessible from frontend domain
4. Check CORS headers if images from different domain
5. Verify image file paths on backend storage

**Code to debug**:
```javascript
// Add to console in ProductDetail
console.log('Product data:', product);
console.log('Image URL:', product?.image);
console.log('Image exists:', !!product?.image);
```

---

### Issue 2: Stock Not Updating When Clicking Products
**Symptom**: Same stock value shows for different products

**Diagnosis**:
```javascript
// Check useEffect dependency
useEffect(() => {
  loadProductData();
}, [id]); // ← Must include 'id'
```

**Solutions**:
1. Verify `useEffect` has `[id]` dependency array
2. Check `useParams()` hook is being used correctly
3. Verify API returns different stock values for different products
4. Clear browser cache (Ctrl+Shift+Delete)
5. Hard refresh page (Ctrl+Shift+R)

**Debugging**:
```javascript
// In ProductDetail component
console.log('Current product ID:', id);
console.log('Current product:', product);
console.log('Stock value:', product?.stock);

// Should change when URL changes
```

---

### Issue 3: "Add to Cart" Button Disabled Unexpectedly
**Symptom**: Button is grayed out even when stock available

**Diagnosis**:
```javascript
// Check canAddToCart calculation
const canAddToCart = !disabled && maxQuantity > 0 && (cartQuantity + quantity) <= maxQuantity;
```

**Solutions**:
1. Check `product.stock` is valid number (not string)
2. Verify `getItemQuantityInCart()` returns correct value
3. Check quantity doesn't exceed stock manually
4. Verify `disabled` prop is false (maxQuantity > 0)

**Debug code**:
```javascript
const cartQuantity = getItemQuantityInCart(product.id);
const maxQuantity = product.stock;
const currentQuantity = 1; // or actual quantity

console.log('Stock:', maxQuantity);
console.log('In cart:', cartQuantity);
console.log('Selected:', currentQuantity);
console.log('Total:', cartQuantity + currentQuantity);
console.log('Can add:', (cartQuantity + currentQuantity) <= maxQuantity);
```

---

### Issue 4: Reviews Not Displaying
**Symptom**: Empty state shows even when reviews exist

**Diagnosis**:
```javascript
// Check reviews data
console.log('Reviews:', reviews);
console.log('Reviews length:', reviews.length);
console.log('Is array:', Array.isArray(reviews));
```

**Solutions**:
1. Verify API endpoint `/reviews/product/{id}` exists
2. Check API returns array (not wrapped object)
3. Verify `api.getProductReviews(id)` extracts data correctly
4. Check review creation date format
5. Verify review objects have required fields:
   - `_id`
   - `rating`
   - `comment`
   - `user.name` (or handle missing)
   - `createdAt`

**Fix for wrapped response**:
```javascript
// In loadProductData, if reviews wrapped:
const reviewsData = reviewsResponse?.data || reviewsResponse;
setReviews(Array.isArray(reviewsData) ? reviewsData : []);
```

---

### Issue 5: Notifications Don't Appear
**Symptom**: No toast message when adding to cart/wishlist

**Diagnosis**:
```javascript
// Check notification state
console.log('Notification:', notification);
```

**Solutions**:
1. Verify `SimpleNotification` component renders when `notification` is not null
2. Check `z-50` class exists in Tailwind config
3. Verify `top-4 right-4` positioning is correct
4. Check auto-dismiss timeout isn't interfering
5. Verify `type` prop matches accepted values ('success', 'error', 'warning', 'info')

**Common fix**:
```javascript
// Ensure Tailwind config has:
safelist: [
  'fixed', 'top-4', 'right-4', 'flex', 'gap-3',
  'px-5', 'py-3', 'rounded-lg', 'shadow-lg',
  'bg-green-500', 'bg-red-500', 'bg-amber-500', 'bg-blue-500',
  'text-white', 'z-50'
]
```

---

### Issue 6: Images Show Wrong Aspect Ratio
**Symptom**: Images stretched, distorted, or wrong proportions

**Diagnosis**:
```javascript
// Check CSS
className="w-full h-full object-cover"
style={{ objectFit: 'cover' }}
```

**Solutions**:
1. Ensure container has fixed aspect ratio: `aspectRatio: '1 / 1'`
2. Verify both `className` and `style` have `object-cover`
3. Remove any hardcoded width/height on image
4. Check parent div isn't restricting size

**Test fix**:
```javascript
// Should maintain 1:1 ratio and crop image, not stretch
<div style={{ aspectRatio: '1 / 1', overflow: 'hidden' }}>
  <img
    className="w-full h-full object-cover"
    src={imageUrl}
    alt="product"
  />
</div>
```

---

### Issue 7: Mobile View Looks Bad
**Symptom**: Layout broken, text too big, buttons misaligned on phone

**Diagnosis**:
```javascript
// Check responsive classes
grid-cols-1 lg:grid-cols-2  // 1 column mobile, 2 desktop
text-sm md:text-base        // Size scaling
p-4 md:p-6 lg:p-8           // Padding scaling
```

**Solutions**:
1. Test on actual mobile device (not just DevTools)
2. Check viewport meta tag in HTML:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1">
   ```
3. Verify TailwindCSS breakpoints in `tailwind.config.js`:
   ```js
   screens: {
     sm: '640px',
     md: '768px',
     lg: '1024px',
     xl: '1280px',
   }
   ```
4. Test rotation (portrait → landscape)
5. Disable browser zoom if testing

---

### Issue 8: Cart Context Functions Missing
**Symptom**: Error "addToCart is not defined" or similar

**Diagnosis**:
```javascript
// Check hook usage
const { addToCart, addToWishlist, isInWishlist, getItemQuantityInCart } = useCart();
```

**Solutions**:
1. Verify `cartContext.jsx` exports `useCart` hook
2. Verify app is wrapped in `CartProvider`:
   ```javascript
   // In main.jsx or App.jsx
   <CartProvider>
     <App />
   </CartProvider>
   ```
3. Check `useCart` hook definition exists
4. Verify cart context is in correct path: `src/context/cartContext.jsx`
5. Check imports use correct path

**Test hook**:
```javascript
// Add to component
try {
  const cartFunctions = useCart();
  console.log('Cart functions available:', Object.keys(cartFunctions));
} catch (err) {
  console.error('Cart context error:', err.message);
}
```

---

### Issue 9: API Calls Timeout/Fail
**Symptom**: Loading spinner never goes away, or error page shows

**Diagnosis**:
```javascript
// Check API configuration
const API_BASE = 'http://localhost:5000/api';
```

**Solutions**:
1. Verify backend is running on port 5000
2. Check API endpoints exist:
   - `GET /api/products/{id}`
   - `GET /api/reviews/product/{id}`
3. Verify CORS is configured on backend
4. Check network tab in DevTools for actual errors
5. Test API manually with curl/Postman:
   ```bash
   curl http://localhost:5000/api/products/123
   curl http://localhost:5000/api/reviews/product/123
   ```
6. Verify response format matches expectations

**Debug API calls**:
```javascript
const loadProductData = async () => {
  try {
    console.log('Fetching product:', id);
    const productData = await api.getProduct(id);
    console.log('Product response:', productData);
    
    const reviewsData = await api.getProductReviews(id);
    console.log('Reviews response:', reviewsData);
  } catch (err) {
    console.error('API Error:', err.response?.data || err.message);
  }
};
```

---

## 📊 Performance Monitoring

### Metrics to Track:
```javascript
// Add to component
useEffect(() => {
  const startTime = performance.now();
  
  loadProductData().finally(() => {
    const endTime = performance.now();
    console.log('Load time:', (endTime - startTime).toFixed(2), 'ms');
  });
}, [id]);
```

### Acceptable Ranges:
- Page load: < 1 second
- Image load: < 2 seconds
- API response: < 500ms
- Component render: < 100ms

---

## 🔐 Security Considerations

1. **SQL Injection**: API should use parameterized queries
2. **XSS Prevention**: React auto-escapes, but watch user input
3. **CSRF**: Ensure tokens in API calls
4. **Auth**: Verify tokens passed to API
5. **Image URLs**: Validate URLs before loading
6. **Reviews**: Validate review data before displaying

---

## 📱 Testing Commands

```bash
# Open DevTools Console
# Test 1: Product data
JSON.stringify(product, null, 2)

# Test 2: Reviews
JSON.stringify(reviews, null, 2)

# Test 3: Cart functions
addToCart(product, 1)
isInWishlist(product.id)
getItemQuantityInCart(product.id)
```

---

## ✅ Verification Checklist

- [ ] All required API fields present in response
- [ ] Images load and display correctly
- [ ] Stock value controls button disabled state
- [ ] Reviews render when present
- [ ] Notifications appear and disappear
- [ ] Cart quantity prevents exceeding stock
- [ ] Mobile layout responsive and usable
- [ ] Product updates instantly on navigation
- [ ] Error states show user-friendly messages
- [ ] No console errors on load

---

## 🆘 Getting Help

If component still has issues:

1. Check browser console for errors:
   ```
   F12 → Console tab → Look for red errors
   ```

2. Check Network tab for failed requests:
   ```
   F12 → Network tab → Look for 4xx/5xx responses
   ```

3. Verify all required props passed to sub-components

4. Check React DevTools for component state

5. Test each sub-component in isolation

---

**This guide covers 95% of common issues. If problem persists, add detailed logging to identify exact failure point.**
