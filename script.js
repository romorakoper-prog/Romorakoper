
document.addEventListener("DOMContentLoaded", () => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  // Menu untuk tampilan HP
  const menu = $("#menuToggle");
  const nav = $("#mainNav");

  if (menu && nav) {
    menu.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  // Tahun di bagian footer
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Keranjang belanja
  const cart = [];
  const count = $("#cartCount");

  function updateCart() {
    if (count) {
      count.textContent = cart.reduce((total, item) => total + item.qty, 0);
    }

    const box = $("#cartItems");
    if (!box) return;

    if (cart.length === 0) {
      box.innerHTML = '<p class="cart-empty">Keranjang Anda masih kosong.</p>';
      return;
    }

    box.innerHTML = cart.map((item, index) => `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong>
          <div>Jumlah: ${item.qty}</div>
        </div>
        <button data-remove="${index}">HAPUS</button>
      </div>
    `).join("");

    box.querySelectorAll("[data-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        cart.splice(Number(button.dataset.remove), 1);
        updateCart();
      });
    });
  }

  function openCart() {
    document.body.classList.add("cart-open");
  }

  function closeCart() {
    document.body.classList.remove("cart-open");
  }

  $("#cartTrigger")?.addEventListener("click", openCart);
  $("#cartClose")?.addEventListener("click", closeCart);
  $("#cartOverlay")?.addEventListener("click", closeCart);

  $$(".add-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.product || "Koper ROMORA";
      const existing = cart.find((item) => item.name === name);

      if (existing) {
        existing.qty++;
      } else {
        cart.push({ name, qty: 1 });
      }

      updateCart();
      openCart();
    });
  });

  // Tombol BELI langsung menuju WhatsApp
  $$(".buy-now, .order-link").forEach((button) => {
    button.addEventListener("click", (event) => {
      const name = button.dataset.product || "Koper ROMORA";
      const message = encodeURIComponent(
        `Halo Romora, saya ingin bertanya tentang produk ${name}. Mohon informasi harga dan ketersediaannya.`
      );

      event.preventDefault();
      window.open(
        "https://wa.me/628212385102?text=" + message,
        "_blank"
      );
    });
  });

  // Checkout keranjang melalui WhatsApp
  $("#checkoutButton")?.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Keranjang Anda masih kosong. Silakan pilih produk terlebih dahulu.");
      return;
    }

    const products = cart
      .map((item) => `${item.name} (jumlah ${item.qty})`)
      .join(", ");

    const message = encodeURIComponent(
      `Halo Romora, saya ingin memesan: ${products}. Mohon informasi harga dan ketersediaannya.`
    );

    window.open(
      "https://wa.me/628212385102?text=" + message,
      "_blank"
    );
  });

  // Menangani foto yang tidak ditemukan
  $$("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";
      img.closest(".product-image")?.classList.add("no-product-photo");
    }, { once: true });
  });

  // Tutup keranjang dengan tombol Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCart();
  });
});
