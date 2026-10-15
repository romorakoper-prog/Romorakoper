// ROMORA KOPER - pengaturan toko
// Format internasional tanpa tanda +: 62 + nomor, 0821... menjadi 62821...
const WHATSAPP_NUMBER = "6282122385102";

const products = [
  { id: 1, name: "Koper ROMORA 01" },
  { id: 2, name: "Koper ROMORA 02" },
  { id: 3, name: "Koper ROMORA 03" },
  { id: 4, name: "Koper ROMORA 04" },
  { id: 5, name: "Koper ROMORA 05" },
  { id: 6, name: "Koper ROMORA 06" },
  { id: 7, name: "Koper ROMORA 07" }
];

let cart = [];

document.getElementById("year").textContent = new Date().getFullYear();

function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.romoraToastTimer);
  window.romoraToastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  renderCart();
  toast(product.name + " ditambahkan ke keranjang");
}

function changeQty(id, amount) {
  const item = cart.find(product => product.id === id);
  if (!item) return;
  item.qty += amount;
  if (item.qty <= 0) cart = cart.filter(product => product.id !== id);
  renderCart();
}

function renderCart() {
  document.getElementById("cartCount").textContent =
    cart.reduce((sum, item) => sum + item.qty, 0);
  const container = document.getElementById("cartItems");
  if (!cart.length) {
    container.innerHTML = '<div class="empty">Keranjang masih kosong. Silakan pilih koper dari katalog.</div>';
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div><strong>${item.name}</strong><small>Jumlah: ${item.qty}</small></div>
        <div class="qty">
          <button onclick="changeQty(${item.id},-1)" aria-label="Kurangi jumlah">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id},1)" aria-label="Tambah jumlah">+</button>
        </div>
      </div>`).join("");
  }
  document.getElementById("cartTotal").textContent =
    cart.length ? cart.reduce((sum, item) => sum + item.qty, 0) + " produk" : "—";
}

function openCart() {
  renderCart();
  document.getElementById("cartModal").classList.add("open");
}
function closeCart() {
  document.getElementById("cartModal").classList.remove("open");
}

function sendWhatsApp(message) {
  const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  window.open(url, "_blank", "noopener,noreferrer");
}

function buyNow(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  sendWhatsApp("Halo ROMORA KOPER, saya tertarik memesan:\n- " + product.name +
    "\nMohon info harga, ketersediaan, dan cara pemesanannya.");
}

function checkoutCart() {
  if (!cart.length) {
    toast("Keranjang kamu masih kosong");
    return;
  }
  const list = cart.map(item => "- " + item.name + " (" + item.qty + "x)").join("\n");
  sendWhatsApp("Halo ROMORA KOPER, saya ingin memesan:\n" + list +
    "\n\nMohon info harga, ongkir, dan cara pembayaran.");
}

function orderViaWhatsApp() {
  if (cart.length) {
    checkoutCart();
  } else {
    sendWhatsApp("Halo ROMORA KOPER, saya ingin bertanya tentang katalog koper. Mohon informasi produk dan cara pemesanannya.");
  }
}

function scrollCatalog(direction) {
  const catalog = document.getElementById("catalog");
  catalog.scrollBy({ left: direction * Math.min(catalog.clientWidth * 0.8, 420), behavior: "smooth" });
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});
