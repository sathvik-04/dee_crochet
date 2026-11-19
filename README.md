# deecrochet._ website

Showcase site for deecrochet._ (React + Vite + Tailwind CSS v4). No backend, no cart: every call to action opens an Instagram DM.

## Run

    npm install
    npm run dev      # http://localhost:5173
    npm run build    # outputs dist/, ready for Vercel or Netlify

## Where to edit

- `src/data/products.js`: add a product with one line, after putting its photo in `public/products/<id>.jpg`
- `src/data/site.js`: Instagram links, city, story and the custom-order steps
- `src/index.css`: colours and fonts (`@theme` block)
- `src/components/`: Navbar, Hero, Collection (CategoryFilter + ProductCard), CustomOrders, About, InstagramBand, Footer

## Before launch

- Replace the photos in `public/products/` with the client's original high-res images (these were cropped from Instagram screenshots)
- Fill in `[YOUR STORY]` and `[YOUR CITY]` in `src/data/site.js`, and replace the `[MAKER PHOTO]` box in `About.jsx`
- Confirm the client is happy to show the Marvel, anime and CSK pieces publicly (trademarked characters and logos)
- Rename products to match the client's own names
