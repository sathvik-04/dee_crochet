// To add extra photos or videos for any product:
// Drop .jpg, .png, .webp, .mp4, .webm, or .mov files into:
//   src/assets/gallery/<category-folder>/<product-id>/
// They will automatically appear in that product's viewer!

const VIDEO_EXT = /\.(mp4|webm|mov)$/i;

const galleryModules = import.meta.glob(
  '../assets/gallery/**/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,mp4,webm,mov,MP4,WEBM,MOV}',
  { eager: true, import: 'default' },
);

const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const getExtraMedia = (category, id) => {
  const prefix = `../assets/gallery/${slugify(category)}/${id}/`;
  return Object.entries(galleryModules)
    .filter(([path]) => path.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([path, src]) => ({
      type: VIDEO_EXT.test(path) ? 'video' : 'image',
      src,
    }));
};

const item = (id, name, category) => {
  const image = `/products/${id}.jpg`;
  return {
    id,
    name,
    category,
    image,
    media: [{ type: 'image', src: image }, ...getExtraMedia(category, id)],
  };
};

export const products = [
  item('beagle-keychain', 'Beagle keychain', 'Keychains'),
  item('rose-bouquet', 'Rose bouquet', 'Bouquets'),
  item('strawberry-pouch', 'Strawberry pouch', 'Bags & pouches'),
  item('spider-man-keychain', 'Spider-Man keychain', 'Keychains'),
  item('teddy-sling-bag', 'Teddy sling bag', 'Bags & pouches'),
  item('evil-eye-charm', 'Evil eye charm', 'Bag charms'),
  item('sunflower-keychain', 'Sunflower keychain', 'Keychains'),
  item('jellyfish-charm', 'Jellyfish charm', 'Bag charms'),
  item('flower-bookmark', 'Flower bookmark', 'Bookmarks'),
  item('little-krishna', 'Little Krishna', 'Figurines'),
  item('lace-bandana', 'Lace bandana', 'Bandanas'),
  item('daisy-bouquet', 'Daisy bouquet', 'Bouquets'),
  item('satoru-gojo-keychain', 'Satoru Gojo keychain', 'Keychains'),
  item('csk-jersey-keychain', 'CSK jersey keychain', 'Keychains'),
  item('ganpati-bappa', 'Ganpati Bappa', 'Figurines'),
  item('lily-bouquet', 'Lily bouquet', 'Bouquets'),
];

export const categories = ['All', ...new Set(products.map((p) => p.category))];
