# Hydration Fix Plan for Gallery Page

## Information Gathered
- **Error Location**: app/gallery/page.tsx line 35 in GalleryItem component
- **Mismatch Details**: 
  - alt: "interior at Bite & Brew" (client) vs "pastries at Bite & Brew" (server)
  - src/srcSet: Different Unsplash images
  - span text: "interior" vs "pastries"
- **Root Cause**: app/types/gallery.ts exports initialGalleryData from generateGalleryImages(24), which uses Math.random() 4+ times per image:
  - Random category selection
  - Random seed for Unsplash
  - Random uniqueId for sig param
  - Random height/aspectRatio
- **Impact**: Server renders one set of random data, client renders different set → hydration fails
- **GalleryItem Usage**: page.tsx uses `const [images] = useState(initialGalleryData);` and maps over it

## Plan
1. **Replace random generation with static data** in app/types/gallery.ts:
   - Define fixed arrays of images for each category with consistent src/alt/category
   - Use predefined sequence instead of Math.random()
   - Ensure exactly 24 images with varied aspect ratios for masonry layout
   - Use reliable Unsplash image IDs that match category themes to avoid load failures
2. **No changes needed to page.tsx** - it will use the fixed initialGalleryData
3. **Preserve functionality**: Keep useState for reactivity, mouse tilt, GSAP animations unchanged
4. **Test hydration**: After fix, server/client should render identical HTML for images

## Dependent Files to be Edited
- **Primary**: `bite-brew/app/types/gallery.ts` (replace generateGalleryImages and initialGalleryData with static data)

## Followup Steps
1. Edit gallery.ts with static data
2. Run `npm run dev` and navigate to /gallery
3. Check browser console for hydration errors
4. Verify masonry layout, hover effects, mouse tilt work
5. Test responsive columns

## Confirmation
Does this plan look good? Any specific image preferences or additional categories? Ready to proceed with editing gallery.ts?
