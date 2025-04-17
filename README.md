<picture style="display: flex; justify-content: center;">
  <img style="max-width: 500px" src="https://raw.githubusercontent.com/defaultkavy-dev/danbooru-viewer/refs/heads/asset/danbooru-viewer-logo.png" alt="Danbooru Viewer Logo">
</picture>
<p style="text-align: center">A modern style viewer for <a href="https://danbooru.donmai.us">Dannbooru</a> or other Booru API base site.</p>

## How To Use
- Enter this URL: [https://danbooru.defaultkavy.com](https://danbooru.defaultkavy.com).
- Or, replace `danbooru.donmai.us` to `danbooru.defaultkavy.com` without changing pathname and url query, will directly open the same page on Danbooru Viewer.
- Or, clone this repository and run commands for self-hosting:
  ```sh
    bun i --production
    bun run start
  ```
- Or, you can also self-host using the Docker image:
  ```sh
    docker run -d --name=danbooru-viewer -p 3030:3030 ghcr.io/defaultkavy-dev/danbooru-viewer
  ```

## Features
- Same path as the original website.
    - Support URL query like `/posts?tags=ord:fav+minato_aqua`.
- Search tags with autocomplete.
- Infinite scroll posts with waterfall image layout.
- Auto load newest posts when user stay on the top of page.
- Swap image to switch between posts, just like a gallery app.
- Mobile friendly. Modern design.

## Hotkeys
- Global Shortcut
  - `Q`: Back.
  - `E`: Forward.
  - `/`: Open search bar.
- Posts Browser Page
  - `W/A/S/D`: Navigation posts in direction.
  - `Tab`: Toogle post detail panel.
  - `Space/Enter`: Open selected post page.
  - `-/=`: Adjust posts grid column size.
- Post Page
  - `A/D`: Switch to previous/next post page.
  - `Spacebar`: Play/Pause video.

## Roadmap to V1.0
- [x] Posts Page
- [x] Posts Search with any tags
- [x] Booru Account Login (Using API keys)
- [x] Favorite Post with Account
- [x] Post Detail Panel in Posts Browser
- [x] User Page
- [ ] Saved Searches
- [ ] Post Commentary
- [ ] More...

## Tools
- [Elexis](https://github.com/defaultkavy/elexis): Web Builder.
- [Elysia](https://elysiajs.com/): Server Framework.
- [ionicons](https://ionic.io/ionicons): Open Souces Icons.