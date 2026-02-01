# Core Web Vitals Optimization Guide

## Performance Checklist

### ✅ Already Implemented

1. **Image Optimization**
   - Next.js Image component with automatic optimization
   - Modern formats (AVIF, WebP)
   - Lazy loading enabled
   - Responsive sizes configured

2. **Font Optimization**
   - font-display: swap configured
   - Google Fonts with Next.js font optimization
   - Reduced FOIT (Flash of Invisible Text)

3. **Code Splitting**
   - Automatic code splitting via Next.js
   - Optimized package imports

4. **Compression**
   - Gzip compression enabled

### 🔄 Additional Optimizations to Implement

## 1. Largest Contentful Paint (LCP) - Target: < 2.5s

### Current Issues to Address:
```typescript
// Add priority loading for hero images
<Image
  src="/images/valoryline.jpeg"
  alt="..."
  fill
  priority  // ✅ Already added
  placeholder="blur" // Add blur placeholder
  blurDataURL="data:image/..." // Generate blur placeholder
/>
```

### Recommendations:
1. **Preload Critical Assets**:
   ```html
   <!-- Add to app/layout.tsx head -->
   <link rel="preload" href="/images/logo.png" as="image" />
   <link rel="preload" href="/fonts/playfair.woff2" as="font" crossOrigin="anonymous" />
   ```

2. **Optimize Hero Image**:
   - Current hero image should be < 200KB
   - Serve WebP for modern browsers
   - Use blur placeholder for perceived performance

3. **Reduce Server Response Time**:
   - Use Vercel Edge Network
   - Enable edge caching for static assets
   - Consider ISR (Incremental Static Regeneration) for product pages

## 2. First Input Delay (FID) - Target: < 100ms

### Already Optimized:
- Code splitting reduces main thread work
- Optimized package imports

### Further Optimizations:
1. **Defer Non-Critical JavaScript**:
   ```typescript
   // Load analytics after page interactive
   useEffect(() => {
     if (typeof window !== 'undefined') {
       // Load analytics
     }
   }, []);
   ```

2. **Minimize Third-Party Scripts**:
   - Load social widgets on interaction
   - Defer chat widgets
   - Use facades for embedded content

## 3. Cumulative Layout Shift (CLS) - Target: < 0.1

### Already Implemented:
- Image dimensions specified (width/height)
- Next.js Image prevents layout shift

### Best Practices:
1. **Reserve Space for Dynamic Content**:
   ```css
   /* For loading states */
   .skeleton {
     min-height: 300px;
     aspect-ratio: 16/9;
   }
   ```

2. **Avoid Inserting Content Above Existing**:
   - Banners should be in reserved space
   - No unexpected layout shifts

## 4. Time to First Byte (TTFB) - Target: < 800ms

### Optimization Strategies:
1. **Static Generation**:
   ```typescript
   // Use generateStaticParams for product pages
   export async function generateStaticParams() {
     return products.map((product) => ({
       id: product.id,
     }));
   }
   ```

2. **Edge Caching**:
   ```typescript
   export const revalidate = 3600; // Revalidate every hour
   ```

## 5. Bundle Size Optimization

### Current Dependencies:
```json
{
  "framer-motion": "^12.29.2",  // Consider code splitting
  "lucide-react": "^0.563.0",    // Tree-shaking enabled
  "zustand": "^5.0.10"           // Lightweight
}
```

### Recommendations:
1. **Dynamic Imports for Heavy Components**:
   ```typescript
   // Lazy load cart drawer
   const CartDrawer = dynamic(() => import('@/components/CartDrawer'), {
     ssr: false,
   });
   ```

2. **Analyze Bundle**:
   ```bash
   npm run build
   # Check .next/analyze for bundle size
   ```

## Testing & Monitoring

### Local Testing:
```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view

# Or use Chrome DevTools > Lighthouse tab
```

### Production Testing:
1. **PageSpeed Insights**: https://pagespeed.web.dev/
2. **GTmetrix**: https://gtmetrix.com/
3. **WebPageTest**: https://www.webpagetest.org/

### Real User Monitoring (RUM):
```typescript
// Add to app/layout.tsx
export function reportWebVitals(metric) {
  // Send to analytics
  console.log(metric);
  // Example: sendToAnalytics(metric)
}
```

## Target Scores

### Mobile:
- Performance: > 90
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Desktop:
- Performance: > 95
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## Implementation Priority

### High Priority (Week 1):
1. Add blur placeholders to images
2. Optimize hero image size
3. Test on real mobile devices
4. Run Lighthouse audit

### Medium Priority (Week 2):
1. Implement dynamic imports for heavy components
2. Add preload hints for critical assets
3. Set up Web Vitals monitoring

### Low Priority (Month 1):
1. Implement service worker for offline support
2. Add advanced caching strategies
3. Optimize third-party scripts

## Mobile Performance Checklist

- [ ] Test on real mobile devices (not just emulator)
- [ ] 3G network throttling test
- [ ] Touch target sizes (minimum 44x44px)
- [ ] Viewport properly configured
- [ ] No horizontal scrolling
- [ ] Text readable without zoom (16px minimum)
- [ ] Tap targets not overlapping

## Performance Budget

Set and monitor these limits:
- JavaScript bundle: < 170KB (gzipped)
- CSS: < 50KB (gzipped)
- Images per page: < 1MB total
- Custom fonts: < 100KB
- Time to Interactive: < 3.5s
- Total page weight: < 2MB

## Quick Wins

1. **Enable HTTP/2**: Automatic with Vercel/modern hosting
2. **Add Service Worker**: For offline support and caching
3. **Optimize Google Fonts**: Already done with Next.js
4. **Remove unused CSS**: Use PurgeCSS or Tailwind's purge
5. **Minify JavaScript**: Automatic with Next.js production build

## Common Issues to Avoid

❌ Loading all animations on page load
✅ Use IntersectionObserver for scroll animations

❌ Large unoptimized images
✅ Use Next.js Image with proper sizing

❌ Blocking third-party scripts
✅ Defer or async load external scripts

❌ No loading states
✅ Show skeletons while content loads

❌ Client-side rendering everything
✅ Use SSR/SSG for initial content

## Resources

- Next.js Performance: https://nextjs.org/docs/app/building-your-application/optimizing
- Web.dev Performance: https://web.dev/performance/
- Core Web Vitals: https://web.dev/vitals/
- Lighthouse Documentation: https://developer.chrome.com/docs/lighthouse/
