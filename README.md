# seyedvahidmirnezami.github.io

Source for [seyedvahidmirnezami.github.io](https://seyedvahidmirnezami.github.io/): the personal site of Seyed Vahid Mirnezami.

Plain HTML, CSS and JavaScript, with no build step. Edit the files and push to `main`; GitHub Pages publishes it in about a minute.

- **Teaching:** the course list is loaded live from [latentquest.ai](https://latentquest.ai/) (`assets/data/site.js` there), so new LatentQuest courses appear here automatically. The course card in `index.html` is only a fallback.
- **Coupons:** `/coupon/` redirects to the LatentQuest coupon page, so links shared earlier keep working.

To preview locally:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
