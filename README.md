# seyedvahidmirnezami.github.io

Source for [seyedvahidmirnezami.github.io](https://seyedvahidmirnezami.github.io/): the personal site of Seyed Vahid Mirnezami and home of the course
[Master Transformers from Scratch: BERT, ViT & AI Search](https://www.udemy.com/course/master-transformers-from-scratch-bert-vit-ai-search/).

Plain HTML, CSS and JavaScript, with no build step. Edit the files and push to `main`; GitHub Pages publishes it in about a minute.

## Adding a new course

All course content lives in [`assets/data/site.js`](assets/data/site.js). To add a course:

1. Copy the existing entry in `courses` and give it a unique `slug` (for example `agents`).
2. Fill in the title, tagline, Udemy referral link (`url`), tags, pillars and syllabus `tracks`.
3. Use `status: "soon"` while it's in production. It shows as "Coming soon" with no enroll button.
4. Move `featured: true` to whichever course the homepage should spotlight.

With two or more courses, the homepage shows a grid of course cards automatically.
Free-code repos go in `repos`, each tagged with its course `slug`.

## Coupon requests

[`/coupon/`](https://seyedvahidmirnezami.github.io/coupon/) writes a short coupon request, copies it, and opens LinkedIn.
Link to a specific course with `?course=<slug>`, for example
`https://seyedvahidmirnezami.github.io/coupon/?course=transformers`.

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
