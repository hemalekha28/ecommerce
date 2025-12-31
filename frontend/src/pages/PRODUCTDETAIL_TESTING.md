# ProductDetail - Testing & Verification Guide

## 🧪 AUTOMATED TEST CASES

### Test 1: Product Data Loading
```javascript
// Expected: Product data loads when component mounts
describe('ProductDetail - Data Loading', () => {
  test('should load product data on mount', async () => {
    // Mock API response
    const mockProduct = {
      id: '123',
      name: 'Test Product',
      price: 99.99,
      stock: 50,
      image: 'https://...',
      rating: 4.5,
      numReviews: 24
    };
    
    api.getProduct = jest.fn().mockResolvedValue(mockProduct);
    api.getProductReviews = jest.fn().mockResolvedValue([]);
    
    // Render component
    render(<ProductDetail />);
    
    // Assert product renders
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });
  });
});
```

### Test 2: Stock Badge Logic
```javascript
// Expected: Stock badge shows correct status based on quantity
test('should show correct stock status', () => {
  const testCases = [
    { stock: 50, expectedText: 'In Stock' },
    { stock: 5, expectedText: 'Low Stock (5 left)' },
    { stock: 0, expectedText: 'Out of Stock' }
  };
  
  testCases.forEach(({ stock, expectedText }) => {
    render(<StockBadge stock={stock} />);
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });
});
```

### Test 3: Image Fallback
```javascript
// Expected: Fallback UI shows when image fails
test('should show fallback when image fails to load', async () => {
  const product = { name: 'Test', image: 'broken-url.jpg' };
  
  render(<ProductImage product={product} />);
  
  // Simulate image load error
  const img = screen.getByAltText('Test');
  fireEvent.error(img);
  
  // Assert fallback shows
  await waitFor(() => {
    expect(screen.getByText('Image not available')).toBeInTheDocument();
  });
});
```

### Test 4: Quantity Validation
```javascript
// Expected: Quantity selector respects max stock
test('should not allow quantity to exceed stock', () => {
  const product = { id: '123', stock: 10 };
  
  render(
    <ProductInfo 
      product={product} 
      maxQuantity={10}
      cartQuantity={0}
    />
  );
  
  // Get plus button and click 11 times
  const plusBtn = screen.getByRole('button', { name: /\+/ });
  
  // Should stop at 10
  for (let i = 0; i < 11; i++) {
    fireEvent.click(plusBtn);
  }
  
  expect(screen.getByDisplayValue('10')).toBeInTheDocument();
});
```

### Test 5: Reviews Rendering
```javascript
// Expected: Reviews display correctly
test('should render reviews when available', () => {
  const reviews = [
    {
      _id: '1',
      rating: 5,
      comment: 'Great!',
      user: { name: 'John' },
      createdAt: '2024-01-15T10:00:00Z'
    }
  ];
  
  render(<ReviewsSection reviews={reviews} />);
  
  expect(screen.getByText('Great!')).toBeInTheDocument();
  expect(screen.getByText('John')).toBeInTheDocument();
});

// Expected: Empty state shows when no reviews
test('should show empty state when no reviews', () => {
  render(<ReviewsSection reviews={[]} />);
  expect(screen.getByText('No reviews yet')).toBeInTheDocument();
});
```

---

## 🔍 MANUAL TESTING CHECKLIST

### Functionality Tests
```
Navigation & Loading:
[ ] Navigate to /products/product1 → loads correctly
[ ] Navigate to /products/product2 → all data updates
[ ] Navigate back to /products/product1 → shows previous product
[ ] Product ID changes → new reviews load

Image Tests:
[ ] Image displays correct aspect ratio (square)
[ ] Hover on image → zoom effect works
[ ] Try invalid image URL → fallback shows
[ ] Mobile view → image fits screen width

Stock Tests:
[ ] Product stock 50 → shows "In Stock" (green)
[ ] Product stock 5 → shows "Low Stock (5 left)" (amber)
[ ] Product stock 0 → shows "Out of Stock" (red), button disabled

Details Tests:
[ ] Product name displays correctly
[ ] Price formats with currency ($99.99)
[ ] Category badge shows correct category
[ ] Rating shows as decimal (4.5 stars)
[ ] Review count displays

Reviews Tests:
[ ] Product with reviews → all reviews display
[ ] Product without reviews → empty state shows
[ ] Review cards show: rating, comment, user, date
[ ] Verified purchase badge shows when applicable

Cart Tests:
[ ] Click "Add to Cart" → notification appears
[ ] Add to cart → quantity resets to 1
[ ] Max quantity = stock → add button disabled if exceeded
[ ] Already in cart message → shows current cart quantity
```

### Responsive Design Tests
```
Mobile (< 768px):
[ ] Single column layout
[ ] Image full width
[ ] Text readable without zooming
[ ] Buttons touch-friendly (40px+ height)
[ ] Horizontal scroll not needed

Tablet (768px - 1024px):
[ ] 2-column layout starts forming
[ ] Spacing adjusts
[ ] All content visible

Desktop (> 1024px):
[ ] 2-column layout active
[ ] Proper spacing between columns
[ ] Cards have shadows
[ ] Hover effects work
```

### Browser Compatibility
```
[ ] Chrome (latest)
[ ] Firefox (latest)
[ ] Safari (latest)
[ ] Edge (latest)
[ ] Mobile Safari (iOS 14+)
[ ] Chrome Mobile (Android)
```

---

## 🐛 DEBUGGING COMMANDS

### Browser Console Tests
```javascript
// Test 1: Check product data
console.log('Product:', product);
console.log('Stock:', product?.stock);
console.log('Rating:', product?.rating);

// Test 2: Check reviews
console.log('Reviews:', reviews);
console.log('Reviews length:', reviews.length);

// Test 3: Check cart functions
addToCart(product, 1);
console.log('Added to cart');

// Test 4: Check wishlist
isInWishlist(product.id);

// Test 5: Get cart quantity
getItemQuantityInCart(product.id);
```

### Network Debugging
```
F12 → Network tab:

1. Search for: /products/
   - Check response status (200)
   - Check response body has all fields
   - Check response time (< 500ms)

2. Search for: /reviews/
   - Check response status (200)
   - Check response is array
   - Check review objects have required fields

3. Look for any 4xx/5xx errors
```

### React DevTools
```
1. Open React DevTools
2. Find ProductDetail component
3. Check state values:
   - product (should have data)
   - loading (should be false after load)
   - error (should be null if no error)
   - reviews (should be array)

4. Trigger state changes:
   - Click "Add to Cart" → notification appears
   - Change quantity → input updates
   - Click wishlist → heart fills
```

---

## 🎬 SCENARIO TESTING

### Scenario 1: First Visit
1. User navigates to `/products/abc123`
2. Spinner appears (loading state)
3. Product details load
4. Images appear
5. Reviews load (if exist)
6. Spinner disappears
7. All data displays correctly

**Expected Result**: ✅ Smooth loading experience

---

### Scenario 2: Product Switch
1. User on `/products/abc123`
2. User navigates to `/products/xyz789`
3. Product data changes instantly
4. New images appear
5. Stock status updates
6. Reviews update
7. Cart quantity recalculates

**Expected Result**: ✅ Data consistent with new product

---

### Scenario 3: Add to Cart
1. User on product with stock > 0
2. User selects quantity (e.g., 3)
3. User clicks "Add to Cart"
4. Success notification appears
5. Notification auto-dismisses after 3s
6. Quantity resets to 1
7. Cart total updates

**Expected Result**: ✅ Item added, notification shown, form reset

---

### Scenario 4: Quantity Validation
1. Product stock = 10
2. User already has 7 in cart
3. User tries to add 5 more
4. Total would be 12 > 10
5. Button becomes disabled
6. Warning message shows
7. User adjusts to 3 more (total 10)
8. Button enables
9. Can click "Add to Cart"

**Expected Result**: ✅ Prevents overselling

---

### Scenario 5: Out of Stock
1. Product stock = 0
2. Stock badge shows "Out of Stock" (red)
3. Add to Cart button disabled
4. Quantity selector disabled
5. Message shows product unavailable
6. User can still view reviews

**Expected Result**: ✅ Prevents out-of-stock purchase

---

### Scenario 6: Image Error
1. Product has invalid image URL
2. Image fails to load
3. Loading spinner appears then disappears
4. Fallback UI shows (icon + message)
5. Page otherwise functional

**Expected Result**: ✅ Graceful fallback

---

### Scenario 7: API Error
1. Backend not running
2. API call fails
3. Error message shows to user
4. Redirect link appears
5. After 2 seconds, auto-redirect to products page

**Expected Result**: ✅ User informed, redirected

---

## 📊 PERFORMANCE TESTING

### Metrics to Measure
```javascript
// In console:

// Test 1: Load time
performance.mark('productLoadStart');
// ... wait for load ...
performance.mark('productLoadEnd');
performance.measure('productLoad', 'productLoadStart', 'productLoadEnd');
console.log(performance.getEntriesByName('productLoad')[0].duration);
// Expected: < 1000ms

// Test 2: Image load time
const img = new Image();
const startTime = performance.now();
img.onload = () => {
  console.log('Image load time:', performance.now() - startTime, 'ms');
};
img.src = 'image-url';
// Expected: < 2000ms

// Test 3: State update time
const before = performance.now();
// Trigger state change (e.g., change quantity)
// Use React DevTools Profiler
// Expected: < 100ms
```

---

## ✅ FINAL VERIFICATION

Run through this checklist to verify everything works:

### Data & API
- [ ] Product data loads correctly
- [ ] Stock value displays correctly
- [ ] Price formats with currency
- [ ] Rating shows correct stars
- [ ] Reviews load (when available)
- [ ] Product updates on navigation
- [ ] API errors handled gracefully

### UI/UX
- [ ] Images display (or fallback shows)
- [ ] Stock badge shows correct status
- [ ] Quantity selector works
- [ ] Add to Cart button works
- [ ] Wishlist toggle works
- [ ] Notifications appear
- [ ] Mobile layout responsive
- [ ] Desktop layout 2-column

### Edge Cases
- [ ] Stock = 0 → button disabled
- [ ] No reviews → empty state shows
- [ ] Cart quantity + new qty > stock → button disabled
- [ ] Invalid image URL → fallback shows
- [ ] API error → error page + redirect
- [ ] Product not found → error page

### Performance
- [ ] Page loads in < 1 second
- [ ] Images lazy load
- [ ] No unnecessary re-renders
- [ ] Notifications auto-dismiss
- [ ] Smooth transitions/animations

### Accessibility
- [ ] Can tab through all buttons
- [ ] Can increase/decrease quantity with keyboard
- [ ] Star ratings have proper color contrast
- [ ] All images have alt text
- [ ] Form labels exist

---

## 🎯 SIGN-OFF CRITERIA

Component is production-ready when:

✅ All test cases pass  
✅ All scenarios work correctly  
✅ No console errors  
✅ Responsive on all devices  
✅ Performance acceptable  
✅ Accessibility meets standards  
✅ Error handling comprehensive  
✅ Edge cases handled  
✅ Documentation complete  

---

**Once all checks pass, component is ready for production deployment.**
