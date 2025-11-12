# 🤖 Jora Assistant – Telegram Mini App

A lightweight **Telegram WebApp (Mini App)** for Jora Assistant that lets users:
- Re-open their last session
- Start a new contract
- Edit an existing contract
- Ask questions (Q&A mode)

It’s fully static (HTML + CSS + JS), deployable on **Vercel**, and runs at  
`https://app.jora88.de` inside Telegram chats.

---

## 🚀 Features

✅  Opens fullscreen inside Telegram  
✅  Adapts to Telegram dark/light theme  
✅  Sends user actions (`new_contract`, `edit_contract`, etc.) back to the bot  
✅  Optional password gate for security  
✅  Optional webhook posting to **n8n** backend  

---

## 🗂 Project Structure
Jora/
├─ index.html
├─ assets/
│  ├─ styles.css
│  └─ app.js
└─ README.md
---

## ⚙️ Local Development

Open `index.html` in any browser for quick preview.  
(Password and Telegram APIs only activate when loaded in Telegram.)

---

## ☁️ Deploy on Vercel

1. Push this folder to **GitHub** (e.g. repo name `Jora`).
2. Go to [https://vercel.com](https://vercel.com) → **Add New → Project → Import from GitHub** → choose this repo.
3. Click **Deploy**.
4. After deployment, go to **Settings → Domains** and add
5. app.jora88.de
6. 5. In **GoDaddy DNS**, create:

| Type | Name | Value | TTL |
|------|------|--------|-----|
| `CNAME` | `app` | `cname.vercel-dns.com` | 1 hour |
| `A` | `@` | `76.76.21.21` | 1 hour |

6. Wait a few minutes → click **Verify** in Vercel.  
✅ SSL (HTTPS) is automatic.

Now your app is live at **https://app.jora88.de**.

---

## 💬 Connect to Telegram

### Option 1 – Inline Keyboard (via n8n or bot API)
Send a message containing:
```json
{
"reply_markup": {
 "inline_keyboard": [
   [
     {
       "text": "🔐 Deschide Jora Assistant",
       "web_app": { "url": "https://app.jora88.de" }
     }
   ]
 ]
}
}
