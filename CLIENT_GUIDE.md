# Comic Book Clique — Client Operations Guide

Welcome to the command center for Comic Book Clique. This guide will show you how to manage your content, write articles, upload podcasts, and control what appears on the homepage.

You do not need to touch any code to update the website. Everything is controlled through your custom CMS (Content Management System).

## 1. Accessing Your Dashboard
To edit the website, go to:
**[https://comic-book-clique.vercel.app/studio](https://comic-book-clique.vercel.app/studio)**

You will be prompted to log in using your Sanity credentials.

---

## 2. Setting Up Authors
Before publishing a new piece, make sure the writer has a profile.
1. Look at the left sidebar and click **✍️ Authors**.
2. Click the **+ (New document)** button at the top.
3. Fill in their name, click "Generate" next to Slug, and optionally add a bio, social handles, and a profile photo.
4. Click **Publish** in the bottom right.

---

## 3. Creating Content (Articles, News, Reviews)
1. In the left sidebar, click the type of content you want to create (e.g., **📰 Articles & Features**).
2. Click the **+** button to start a new draft.
3. **The Basics:** Fill out the Title, generate the Slug, and write a quick excerpt.
4. **Hero Image:** Click to upload your main image. You can adjust the "hotspot" (the circle) to ensure the most important part of the image never gets cropped out on mobile phones.
5. **Writing the Story:** The "Story Body" is a rich text editor. 
   - *Pro Tip:* Click the **+** button inside the editor to insert specialized layouts like **Info Boxes** (great for reading orders), **Pull Quotes**, or **Z-Pattern Layouts** (image next to text).

### Special Fields
- **⭐ Reviews:** Switch to the **Verdict & Scoring** tab to add a 0-10 rating, select a "Verdict Label" (like 🔥 Essential), and list Pros/Cons. This automatically generates a beautiful scorecard for the reader.
- **🎤 Interviews:** You can tag the interviewee's name and their role (e.g., "Writer, X-Men #1") for a stylized header.

---

## 4. Publishing & Tagging
Before you hit publish, click the **Publishing & Author (or Meta)** tab at the top of your draft.
- **Assign Category & Author:** Select the writer and the topic.
- **Tags:** Type in keywords and hit enter. This groups related stories together.
- **Feature on Homepage:** If you toggle this **ON**, the story will automatically jump into the massive carousel at the very top of the homepage (unless you have manually overridden it—see below).
- **SEO Tab:** If you want specific text or images to appear when you share the link on Twitter/Discord, fill out the SEO tab!

Once everything looks good, hit **Publish** (bottom right). The live website will update automatically within 60 seconds.

---

## 5. Controlling the Homepage Hero Carousel
If you want absolute control over the top 5 stories on the homepage, you can manually override the automatic feeds.
1. Click **⚙️ Site Settings** in the left sidebar.
2. Under **Manual Hero Selection**, you can hand-pick exactly which articles, reviews, or podcasts appear, and in what order.
3. This is perfect for highlighting major exclusive drops or massive news stories.

---

## 6. Podcast Automation
Good news! You **do not** need to manually upload your podcast episodes here. 
The website has an automated robot that checks Podbean and Libsyn every single hour. When you publish an episode on Podbean, the website will automatically pull the audio link, title, and show notes, and publish it to the 🎙️ Podcasts section of your website. 

*(If you ever want to add custom cover art to an episode, you can simply click on the auto-generated episode in the CMS and upload an image).*

---

## Technical Support
If the website goes down, or you need structural changes to the layout or new features, contact your development partner. For day-to-day writing and publishing, this guide is all you need!
