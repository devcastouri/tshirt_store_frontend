import React, { useState } from "react";
import "./index.css";

const products = [
  { id: 1, name: "Minimal Tee", price: 20, image: "https://via.placeholder.com/150" },
  { id: 2, name: "Street Style", price: 25, image: "https://via.placeholder.com/150" },
  { id: 3, name: "Classic Logo", price: 30, image: "https://via.placeholder.com/150" }
];

function App() {
  const [cart, setCart] = useState([]);
  const addToCart = (product) => setCart([...cart, product]);

  return (
    <div className="p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-6">🧢 Trendy Tees</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border p-4 rounded-xl shadow text-center">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded" />
            <h2 className="mt-2 text-lg font-semibold">{p.name}</h2>
            <p className="text-gray-600">${p.price}</p>
            <button className="mt-2 bg-black text-white px-4 py-2 rounded" onClick={() => addToCart(p)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-semibold">🛒 Cart</h2>
        {cart.map((item, idx) => (
          <p key={idx}>{item.name} - ${item.price}</p>
        ))}
      </div>
    </div>
  );
}

export default App;