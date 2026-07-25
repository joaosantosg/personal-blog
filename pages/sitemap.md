---
layout: page
title: Sitemap
permalink: /sitemap/
---

<div class="aero-window">
  <div class="aero-window__titlebar">
    <span>sitemap.exe</span>
    <div class="aero-window__buttons">
      <span>_</span><span>□</span><span>×</span>
    </div>
  </div>
  <div class="aero-window__body">
<pre class="sitemap-tree">Website
│
├── <a href="{{ '/' | relative_url }}">Home</a>
├── <a href="{{ '/about/' | relative_url }}">Sobre</a>
├── <a href="{{ '/blog/' | relative_url }}">Blog</a>{% for post in site.posts %}
│   └── <a href="{{ post.url | relative_url }}">{{ post.title }}</a>{% endfor %}
├── <a href="{{ '/gallery/' | relative_url }}">Galeria</a>
├── <a href="{{ '/links/' | relative_url }}">Links</a>
├── <a href="{{ '/guestbook/' | relative_url }}">Guestbook</a>
├── <a href="{{ '/sitemap/' | relative_url }}">Sitemap</a>
└── <a href="{{ '/404.html' | relative_url }}">404 Not Found</a></pre>
  </div>
</div>
