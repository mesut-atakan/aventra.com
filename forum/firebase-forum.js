import { app, db } from './firebase-init.js';
import { collection, getDocs, query, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const forumList = document.getElementById("forumList");
const DEFAULT_PHOTO = "../assets/images/default-profile-photo.jpg";

// Editor.js JSON'u HTML'e çeviren fonksiyon
function renderEditorJs(data) {
    if (typeof data === "string") data = JSON.parse(data);
    let html = '';
    data.blocks.forEach(block => {
        switch (block.type) {
            case 'header':
                html += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                break;
            case 'paragraph':
                html += `<p>${block.data.text}</p>`;
                break;
            case 'list':
                const type = block.data.style === "ordered" ? "ol" : "ul";
                html += `<${type}>${block.data.items.map(item => `<li>${item}</li>`).join('')}</${type}>`;
                break;
            case 'quote':
                html += `<blockquote>${block.data.text} <cite>${block.data.caption || ''}</cite></blockquote>`;
                break;
            case 'code':
                html += `<pre><code>${block.data.code}</code></pre>`;
                break;
            case 'delimiter':
                html += `<hr/>`;
                break;
            case 'table':
                html += `<table>${block.data.content.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</table>`;
                break;
            case 'image':
                html += `<img src="${block.data.file.url}" alt="${block.data.caption || ''}" style="max-width:100%; border-radius:7px; margin:8px 0;"/>`;
                break;
            // Diğer blok tipleri burada çoğaltılabilir.
            default:
                break;
        }
    });
    return html;
}

async function loadForums() {
  const q = query(collection(db, "forums"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  forumList.innerHTML = '';
  for (const docu of snapshot.docs) {
    const data = docu.data();
    const forumId = docu.id;

    // Kullanıcı bilgisi
    let authorName = "Bilinmeyen";
    let authorPhoto = DEFAULT_PHOTO;

    if (data.authorId) {
      try {
        const userRef = doc(db, "users", data.authorId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          authorName = userData.username || userData.email || "Kullanıcı";
          authorPhoto = userData.photoURL || DEFAULT_PHOTO;
        }
      } catch (e) {
        // Hata varsa varsayılanları kullan
      }
    }

    // Yorum sayısını dinamik getir
    const commentsRef = collection(db, "forums", forumId, "comments");
    const commentSnap = await getDocs(commentsRef);
    const commentCount = commentSnap.size;

    // Editor.js preview: ilk paragraf veya ilk 150 karakter (HTML olarak)
    let preview = "";
    try {
      const contentJson = JSON.parse(data.content);
      // Paragraf veya ilk blok
      const firstBlock = contentJson.blocks.find(b => b.type === 'paragraph' || b.type === 'header');
      if (firstBlock && firstBlock.data.text)
        preview = firstBlock.data.text.slice(0, 150) + "...";
      else
        preview = renderEditorJs(contentJson).replace(/<[^>]+>/g, ' ').slice(0, 150) + "...";
    } catch (e) {
      preview = "";
    }

    const row = document.createElement("div");
    row.className = "subforum-row";
    row.innerHTML = `
      <div class="author-col">
          <img src="${authorPhoto}" class="author-avatar" alt="Profil Fotoğrafı" onerror="this.src='${DEFAULT_PHOTO}'">
          <span class="author-username">${authorName}</span>
      </div>
      <div class="subforum-description subforum-column">
          <span class="author-username" style="font-size:.93rem; font-weight:500; color:#FF6600; margin-bottom:2px;">${authorName}</span>
          <h4><a href="detail.html?id=${forumId}">${data.title}</a></h4>
          <p>${preview}</p>
      </div>
      <div class="subforum-stats subforum-column center">
          <span>${commentCount} Yorum</span>
      </div>
    `;
    forumList.appendChild(row);
  }
}

loadForums();