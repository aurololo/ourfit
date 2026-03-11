# How to Add Your Own Images to the App

Since this is a static app (no database), adding images requires putting the file in the project folder and updating the code.

## Step 1: Add Your Image File
1.  Take your photo (e.g., of a jacket).
2.  Rename it to something simple, like `my-jacket.jpg` (avoid spaces).
3.  Move this file into the `public/uploads/` folder in this project.
    - Path: `ourfit_final/public/uploads/my-jacket.jpg`

## Step 2: Update the App Data
1.  Open the file `constants.ts` in your code editor.
2.  Find the product you want to update (or add a new one).
3.  Change the image path to point to your new file.
    - **Format**: `'/uploads/filename.jpg'` (Note the leading slash).

### Example Change in `constants.ts`

**Before:**
```typescript
const IMG_KANTHA_JACKET = 'https://images.unsplash.com/...';
```

**After:**
```typescript
const IMG_KANTHA_JACKET = '/uploads/my-jacket.jpg';
```

## Step 3: View on iPhone
1.  Make sure your iPhone and Computer are on the same WiFi.
2.  Open Safari on your iPhone.
3.  Go to: `http://192.168.1.6:3000`
4.  The app should load, and your new image should be visible!

> **Note:** If you add a new image while the app is running, you might need to refresh the page on your iPhone.
