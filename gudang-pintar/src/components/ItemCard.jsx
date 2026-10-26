import React from "react";
import "./ItemCard.css";

export default function ItemCard({ item }) {
  let statusClass = "stock-aman";
  let statusText = "Aman";

  if (item.stock === 0) {
    statusClass = "stock-habis";
    statusText = "Habis";
  } else if (item.stock <= 10) {
    statusClass = "stock-menipis";
    statusText = "Hampir habis";
  }

  return (
    <article className="card item-card">
      <img
        src={item.image}
        className="card-img-top"
        alt={item.name}
        loading="lazy"
      />
      <div className="card-body">
        <h2 className="card-title">{item.name}</h2>
        <p className="card-text mb-2">
          Harga: Rp{item.price.toLocaleString("id-ID")}
        </p>
        <p className="card-text mb-2">
          Jumlah: <strong className="stock-quantity">{item.stock}</strong> unit
        </p>
        <span className={`stock-status ${statusClass}`}>{statusText}</span>
      </div>
    </article>
  );
}
