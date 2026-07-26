import productModel from "../models/products.model.js";

const seedProducts = async () => {
  try {
    // Clear existing products to ensure new schema fields (stock/category) are seeded
    await productModel.deleteMany({});
    console.log("Cleared existing products from database.");

    const products = [
      {
        name: "Apple iPhone 15",
        category: "Smartphones",
        price: 10,
        stock: 25,
        rating: 4.8,
        reviewsCount: "12K",
        description:
          "Experience the ultimate iPhone with Dynamic Island and a 48MP main camera.",
        image:
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60",
        tag: "Promotion",
        colors: ["#38bdf8", "#ec4899", "#111827"],
      },
      {
        name: "Samsung Galaxy S24",
        category: "Smartphones",
        price: 9,
        stock: 18,
        rating: 4.7,
        reviewsCount: "5.2K",
        description:
          "Next-gen Galaxy intelligence with a sleek design and pro-grade camera.",
        image:
          "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=60",
        tag: "New",
        colors: ["#1e40af", "#4b5563", "#111827"],
      },
      {
        name: "Sony WH-1000XM5",
        category: "Audio",
        price: 8,
        stock: 40,
        rating: 4.9,
        reviewsCount: "2.1K",
        description:
          "Industry-leading noise cancelling wireless headphones with premium audio.",
        image:
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=60",
        tag: "Customer favorite",
        colors: ["#111827", "#f43f5e", "#9ca3af"],
      },
      {
        name: "Apple Watch Series 10",
        category: "Smartwatch",
        price: 7,
        stock: 22,
        rating: 4.8,
        reviewsCount: "850",
        description:
          "A thinner design, a larger display, and advanced health tracking metrics.",
        image:
          "https://images.unsplash.com/photo-1517502884422-41eaaced0168?w=500&auto=format&fit=crop&q=60",
        tag: "New",
        colors: ["#fbbf24", "#ffffff", "#111827"],
      },
      {
        name: "Logitech MX Master 3S",
        category: "Accessories",
        price: 6,
        stock: 60,
        rating: 4.9,
        reviewsCount: "1.2K",
        description:
          "The ultimate ergonomic mouse designed for precision and seamless control.",
        image:
          "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60",
        tag: "Best Value",
        colors: ["#ffffff", "#6b7280", "#111827"],
      },
      {
        name: "Dell XPS 13",
        category: "Laptops",
        price: 5,
        stock: 10,
        rating: 4.8,
        reviewsCount: "400",
        description:
          "Ultra-thin luxury laptop with Intel Core processor and stunning InfinityEdge screen.",
        image:
          "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60",
        tag: "Premium",
        colors: ["#9ca3af", "#111827"],
      },
      {
        name: "Nike Air Max 270",
        category: "Footwear",
        price: 4,
        stock: 35,
        rating: 4.6,
        reviewsCount: "3.5K",
        description:
          "Athletic lifestyle sneaker featuring Nike's tallest heel bag unit.",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
        tag: "Popular",
        colors: ["#ef4444", "#3b82f6", "#ffffff"],
      },
      {
        name: "Adidas Backpack",
        category: "Bags",
        price: 3,
        stock: 80,
        rating: 4.5,
        reviewsCount: "920",
        description:
          "Durable multi-compartment utility backpack for daily use.",
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
        tag: "Best Value",
        colors: ["#111827", "#4b5563"],
      },
      {
        name: "boAt Stone 650",
        category: "Audio",
        price: 2,
        stock: 120,
        rating: 4.4,
        reviewsCount: "1.8K",
        description:
          "Powerful portable Bluetooth speaker with deep bass and long battery life.",
        image:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60",
        tag: "Promotion",
        colors: ["#111827", "#ef4444", "#0284c7"],
      },
      {
        name: "Kindle Paperwhite",
        category: "Electronics",
        price: 1,
        stock: 28,
        rating: 4.7,
        reviewsCount: "2.4K",
        description:
          "Waterproof e-reader with a 6.8-inch display and adjustable warm light.",
        image:
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60",
        tag: "Customer favorite",
        colors: ["#111827", "#9ca3af"],
      },
    ];

    await productModel.insertMany(products);
    console.log(
      "10 new products successfully seeded with stock and category configurations.",
    );
  } catch (error) {
    console.error("Error seeding products into the database:", error);
  }
};

export default seedProducts;
