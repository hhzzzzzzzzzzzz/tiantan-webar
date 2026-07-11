# Tiantan WebAR Scene Samples

Published site: https://hhzzzzzzzzzzzz.github.io/tiantan-webar/

![Mobile QR code](./assets/tiantan-webar-qr.png)

This static WebAR site recognizes three spreads from the Tiantan book:

- Page 6: a rotating Qinian Hall scene with a three-tier altar, colonnade, tree line, star rings, and path.
- Page 22: a layered poster scene with four image cards rising from the printed spread.
- Page 27: a living street scene where people, stalls, and city fragments occupy different depths and move independently.

Open the published GitHub Pages URL on a phone and choose `Start Camera AR`. Camera access requires HTTPS. Point the camera at a complete page with even light and keep the page filling most of the frame.

Choose `Preview Scene` on desktop to review the composition without a camera.

## Local preview

```powershell
node .\scripts\dev-server.mjs
```

Then open `http://127.0.0.1:4173/`.
