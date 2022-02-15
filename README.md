# danbooru-viewer
A danbooru image browser.
[You can get this tool on GitHub Page](https://defaultkavy.github.io/danbooru-viewer/)

![](https://raw.githubusercontent.com/defaultkavy/danbooru-viewer/master/images/screenshots/001.jpg)

## Why I need this?
- Waterfall style images browser.
- Infinite scrolling.
- Auto update the newest posts when scroll at top.
- One-hand control with convenience shortcut key (Where is your other hand? 😏)
- Don't need to download, run in your browser.
- No complex UI, all we need is browsing IMAGES.

## Available Browser
Prefer Chrome or Edge 79.
Touch screen device is not fully supported. (Will be supported in future)

## Supported Booru
- Safebooru.donmai.us（default)
- Danbooru.donmai.us (https://defaultkavy.github.io/danbooru-viewer/#danbooru)
- Sakugabooru.com (https://defaultkavy.github.io/danbooru-viewer/#sakuga)

## Search tag?
Use \` key (above the tab key) to open search page.

## Shortcut Keys
### Grid Page:

**Keyborad**
- WASD/Arrow keys: Move the selection cursor.
- Enter/Spacebar: Open the selected object in Viewer/Player.
- Esc (Selected): Cancel selection.
- Esc (Unselected): Back to previous page.
- Tab: Slide up/down Detail Panel.
- `: Open search page.
- Ctrl + Spacebar: Open booru page.
- Shift + Spacebar: Open source page.
- Ctrl + Shift + Spacebar: Open image in new tab.

**Mouse**
- Left Click on unselected object: Select object.
- Left Click on selected object: Open object in Viewer/Player.
- Ctrl + Left Click: Multi select.
- Middle Click on object: Open image in new tab.
- Ctrl + Middle Click: Open booru page.
- Shift + Middle Click: Open source page.

### Image Viewer

**Keyboard**
- AD/Left/Right: Move the grid selection and switch object in Image Viewer (Prev/Next image).
- WS/Up/Down: Scale image.
- R: Reset image position and scale.
- Shift + WASD: Pan move the image.
- Enter/Spacebar/Esc: Close Image Viewer.
- Ctrl + Spacebar: Open booru page.
- Shift + Spacebar: Open source page.
- Ctrl + Shift + Spacebar: Open image in new tab.

**Mouse**
- Scroll: Scale image.
- Drag: Move image.
- Double Click: Reset image position and scale.
- Middle Click: Open image in new tab.
- Right Click: Close Image Viewer.

**Search Page**
- `: Closh search page.
- Enter: Select the first search tag.

## Used Code Sources
- [Anime.js](animejs.com) - Use for animation.
- This site is build with Vanilla Javascript/Typescript.

## Milestone
- [x] Search tag.
- [ ] Support other danbooru api type booru.
- [ ] Login to your danbooru account to save your favorite image.
- [ ] Support forum.
