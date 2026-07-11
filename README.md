# Tiantan WebAR Samples

Published site: https://hhzzzzzzzzzzzz.github.io/tiantan-webar/

![Mobile QR code](./assets/tiantan-webar-qr.png)

This static site recognizes three spreads from `0511合稿.pdf`:

- Page 18: a lightweight Qinian Hall model rises from the site plan.
- Page 20: the ancient-tree spread becomes a shallow geometric relief.
- Page 27: historical citizen illustrations separate into far, middle, and near planes.

Open the published GitHub Pages URL on a phone and choose `启动相机 AR`. Camera access requires HTTPS. Point the camera at a complete page with even light and keep the page filling most of the frame.

For desktop review, choose `查看效果预览`; no camera is required.

## Local preview

```powershell
node .\scripts\dev-server.mjs
```

Then open `http://127.0.0.1:4173/`.
