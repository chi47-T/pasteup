# PASTEUP

**Pick a layout for each part of a landing page, get one prompt that tells your AI tool exactly how to lay it out.**

👉 **Open the app: https://pasteupai.com/compose** · [Home](https://pasteupai.com) · [中文](https://pasteupai.com/zh)

[![PASTEUP: compose a landing page from layout blocks, then copy the prompt](https://pasteupai.com/opengraph-image.png)](https://pasteupai.com)

Ask an AI for a landing page and you often get the same generic layout: AI slop. PASTEUP offers layout structures distilled from studying well-designed websites (headers, heroes, content sections, footers), each rewritten as a neutral description and redrawn as a wireframe. It turns your selection into a single prompt you can paste into Claude Code, Codex, Cursor, v0 or any other AI tool.

## How to use

1. **Pick blocks.** In the bottom panel, choose a Header, a Hero, any number of Content sections and a Footer. The preview updates as you pick. Not sure where to start? Press **Shuffle** for a random page.
2. **Arrange and inspect.** Drag Content sections to reorder them (or focus a handle and use ← →). Click the info icon on a card to see a larger preview, its description and the block's own prompt.
3. **Copy the prompt.** Press **Page Prompt**, optionally choose a tech stack, then copy the full-page prompt (or a single block's prompt) and paste it into your AI tool together with your own content (brand, copy, images).

Switch between desktop and mobile previews with the device toggle in the bottom panel.

## What the prompt covers

| Covers | Leaves to you |
|---|---|
| Layout structure of every block | Copy and wording |
| How blocks relate (e.g. a header over the hero) | Images and video |
| Tablet and mobile behavior | Colors and fonts |
| Scroll behavior (pinned sections, etc.) | Exact sizes |
| Page-wide settings from the **Page** tab (e.g. smooth scrolling) | |
| Tech stack, if you pick one (HTML + CSS, React, Next.js, Vue, Astro) | |

The previews are wireframes on purpose: they show structure, not a finished design.

## Tips

- Add your own context before or after the prompt: what the site is for, who it is for, the real text.
- If your AI tool builds only part of the page, ask it to continue from the next block heading.
- If the result differs from the preview, paste the prompt's final check section again and ask the AI to check its own work.
- The app and the prompts are available in English and Traditional Chinese. Use the language switch in the top right.

## FAQ

**Is it free?** Yes. No account is needed.

**Does it send my data anywhere?** No. Everything runs in your browser; nothing you select is uploaded.

**Can I use the generated prompts in commercial work?** Yes. The prompts you generate and the pages you build from them are yours to use.

**Where is the source code?** This repository contains only the built site. The source is not public at the moment.

**Do the layouts copy other websites?** No. Each block describes a general layout structure in our own words and is shown as a wireframe. It contains no text, images, logos, colors or code from any website.

**A layout looks too close to my website.** Please open an [issue](../../issues) and tell us which block. We will review it and adjust or remove it.

**I found a problem / I have a layout to suggest.** Please open an [issue](../../issues).

## License

© 2026 chi47-T. All rights reserved.
The contents of this repository (the built site, layout data and previews) may not be copied, redistributed or re-hosted without permission. Prompts generated with the app may be used freely, including commercially.

---

# PASTEUP（繁體中文）

**替 Landing Page 的每個區塊挑一種版面，產生一段完整的提示詞，讓 AI 照著排版。**

👉 **開啟組合器：https://pasteupai.com/compose** · [中文首頁](https://pasteupai.com/zh)

直接叫 AI 做頁面，常常得到千篇一律的版面，也就是所謂的 AI slop。PASTEUP 研究有設計感的網站，整理出常見且有效的版面結構（頁首、主視覺、內容區塊、頁尾），每一種都重新描述並畫成線框。它把你選的組合轉成一段提示詞，貼到 Claude Code、Codex、Cursor、v0 等任何 AI 工具都可以用。

## 使用方式

1. **挑選區塊**：在下方面板選一個頁首、一個主視覺、任意數量的內容區塊，以及一個頁尾，預覽會即時更新。不知道從哪裡開始，可以按「隨機組合」先組一整頁。
2. **排序與檢視**：內容區塊可以拖曳排序（或聚焦把手後用 ← →）。點卡片上的資訊圖示，可以看較大的預覽、說明和這個區塊的提示詞。
3. **複製提示詞**：按「整頁提示詞」，需要的話選擇技術，再複製整頁或單一區塊的提示詞，連同你自己的內容（品牌、文案、圖片）一起貼給 AI 工具。

下方面板可以切換桌機與手機預覽。

## 提示詞包含什麼

| 包含 | 留給你決定 |
|---|---|
| 每個區塊的版面結構 | 文案 |
| 區塊之間的關係（例如頁首疊在主視覺上） | 圖片與影片 |
| 平板與手機的變化 | 配色與字體 |
| 捲動行為（固定捲動等） | 確切的尺寸 |
| 「整頁」分頁的全站設定（例如慣性平滑捲動） | |
| 選用的技術（HTML + CSS、React、Next.js、Vue、Astro） | |

預覽刻意做成線框，只呈現結構，不是完成的設計。

## 小技巧

- 在提示詞前後補上你自己的資訊：網站用途、目標對象、實際文案。
- AI 只做了一部分時，請它從下一個區塊標題接著做。
- 結果和預覽不同時，把提示詞最後的「完成後檢查」再貼一次，請 AI 自己檢查。
- 介面和提示詞都有英文與繁體中文，用右上角的語言切換。

## 常見問題

**要付費嗎？** 不用，也不需要帳號。

**會上傳我的資料嗎？** 不會，全部在瀏覽器裡執行。

**產生的提示詞可以用在商業案子嗎？** 可以。你產生的提示詞和用它做出來的頁面都可以自由使用。

**原始碼在哪裡？** 這個 repo 只放打包後的網站，原始碼目前沒有公開。

**這些版面是複製別人的網站嗎？** 不是。每個區塊都是用我們自己的文字描述的通用版面結構，並以線框呈現，不包含任何網站的文字、圖片、標誌、配色或程式碼。

**某個版面和我的網站太像**：請開 [issue](../../issues) 告訴我們是哪一個區塊，我們會檢視並調整或移除。

**回報問題或推薦版面**：請開 [issue](../../issues)。

## 授權

© 2026 chi47-T。保留所有權利。
這個 repo 的內容（打包後的網站、版面資料與預覽）未經同意不得複製、散布或另行架站。用本網站產生的提示詞可以自由使用，包含商業用途。
