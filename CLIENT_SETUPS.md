# Client Setups

Follow these steps every time you start a new client website from this template.

Tip: search the whole project for `CLIENT_`. Every placeholder you need to replace starts with it.

---

## 1. Set up the project

1. On GitHub, under **BlackDahliaCreative**, create two empty repositories:
   - a **preview** repo, which holds the source code and the preview site
   - a **live** repo, which holds only the finished website
2. Check that you have Node.js 22.12 or newer: run `node -v` in a terminal. If it's older, install the latest "LTS" version from nodejs.org.
3. Copy this template into the preview repo, then open a terminal in the project folder and run `npm install`.
4. Create two settings files in the main project folder. Git ignores them, so you have to create them by hand each time.

   **`.env.preview`**: put the preview repo's name between the slashes
   ```
   BASE_PATH=/name-of-the-preview-repo/
   VITE_SITE_ENV=preview
   ```

   **`.env.official`**
   ```
   BASE_PATH=/
   VITE_SITE_ENV=official
   ```

---

## 2. Fill in the client's details

Replace the placeholders in these files:

- **`package.json`**
  - Change `"name"` to the client's project name.
  - In the deploy scripts, replace `CLIENT_PREVIEW_REPO` and `CLIENT_LIVE_REPO` with the two repo names.
  - Replace `CLIENT_DOMAIN.com` with the client's real domain.
- **`index.html`** (in the main project folder)
  - Fill in the Instagram/Facebook names. The name, website address, description and share image are filled in automatically from `src/site.config.json`.
  - Set the language in three places: `lang="en"`, `og:locale` and `inLanguage`. For example, an Italian site uses `it`, `it_IT` and `it`.
  - If the client uses Google Tag Manager, uncomment those two blocks and add their ID. If not, leave them as they are.
- **`src/site.config.json`** — the most important file for SEO:
  - Fill in the site name, website address (`siteUrl`, no slash at the end), tagline, default description and share image.
  - Each entry in `pages` is one page: give it a real title and a description of about 150 characters. These are what Google shows in search results.
- **`public/manifest.json`**: set the app name and colors.

---

## 3. Add the client's images

1. Replace `favicon.ico`, `logo192.png` and `logo512.png` in the `public` folder with the client's logo.
2. Add a share image. This is the picture shown when someone shares the site on social media, and it should be 1200 × 630 pixels.
3. Add the carousel photos:
   - **Carousel with sections**: put each section in its own folder inside `public/carousel-pictures/`, named with a number first, for example `1-Weddings`, `2-Events`.
   - **Simple carousel**: put the photos straight into `public/single-carousel-folder/`.
   - Start every photo name with a number to set its order, for example `1.Beach.webp`, `2.Dinner.webp`.
   - The photo lists update by themselves when you run `npm start`. To add captions, edit the `.json` files in `src/components/Carousel/services/`. Your captions are kept when the lists update.

---

## 4. Replace the demo content

1. Turn the demo pages (`Page1`, `Page2`, `Animations`) into the client's real pages, or delete them.
2. **Whenever you add, rename or remove a page**, update it in all three of these places:
   - the page list (the routes) in `src/App.tsx`
   - both menus: `NavigationBar` and `NavigationBarSmallScreen`. Link with a slash at the end, like `to={'/about-us/'}`
   - the `pages` list in `src/site.config.json`, and put `<SEOHead path="/about-us" />` at the top of the page

   Use lowercase page addresses with dashes, like `/about-us`. Run `npm test`: it warns you if a page in the config has no matching route.
3. In your code, use `window` and `document` only inside `useEffect` or click handlers. Pages are built in advance on a computer that has no browser, and the build stops with an error if it finds them anywhere else.
4. For images in the `public` folder, use `publicUrl('/my-image.webp')` (from `src/utils/publicUrl.ts`). Then they work on both the preview site and the official site.
5. Replace the placeholder footer in `src/components/Footer/`.
6. Run `npm start` and check every page in the browser. Before publishing, run `npm run build:official` once to check that every page builds.

---

## 5. Publish the site

1. **Preview site**: run `npm run deploy:preview`. It builds the site and publishes it, and search engines are told not to list it.
2. **Official site**: run `npm run deploy:official`. It builds the site, creates a real file for every page (so Google can index each one), and adds the sitemap and the domain file.
3. In the **live** repo on GitHub, go to **Settings → Pages**:
   - Source: the `live` branch, `/` folder
   - Custom domain: the client's domain
   - Turn on **Enforce HTTPS**. You may need to wait a few minutes after setting the domain before it becomes available.
4. At the client's domain provider, add these DNS records:
   - Four **A records** for the main domain, pointing to:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One **CNAME record** for `www`, pointing to `blackdahliacreative.github.io`

---

## 6. Delete this file 😃

You're done! Delete `CLIENT_SETUPS.md` from the client's project. It's only needed in the template.
