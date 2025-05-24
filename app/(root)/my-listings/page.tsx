"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { TbPackage, TbShoppingBag, TbPlus, TbTrash } from "react-icons/tb";
import { MdOutlineEdit } from "react-icons/md";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  createdAt: Date;
}

export default function MyListingsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "product-1",
      title: "Vintage Leather Jacket",
      description:
        "Authentic vintage leather jacket in excellent condition. Size M.",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      category: "Clothing",
      createdAt: new Date("2023-10-15"),
    },
    {
      id: "product-2",
      title: "Mechanical Keyboard",
      description:
        "RGB mechanical keyboard with cherry MX blue switches. Like new.",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      category: "Electronics",
      createdAt: new Date("2023-11-02"),
    },
    {
      id: "product-3",
      title: "Vintage Camera",
      description:
        "Classic film camera from the 1970s. Fully functional and tested.",
      price: 249.99,
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      category: "Photography",
      createdAt: new Date("2023-11-10"),
    },
  ]);

  const removeProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          className="text-3xl font-bold flex items-center gap-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TbPackage className="text-4xl" />
          My Listings
        </motion.h1>

        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300"
        >
          <TbPlus className="text-lg" />
          Add Listing
        </motion.button>
      </div>

      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <TbShoppingBag className="text-8xl text-gray-300 mb-4" />
          </motion.div>
          <h2 className="text-2xl font-semibold text-gray-700">
            You currently don't have anything on your listing
          </h2>
          <p className="text-gray-500 mt-2 max-w-md">
            Start selling your items by creating your first listing
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium"
          >
            <TbPlus className="text-lg" />
            Create Your First Listing
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={item}
              layoutId={product.id}
              className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white overflow-hidden"
            >
              <Link href={`/products/${product.id}`} className="block">
                <div className="flex items-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 relative flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-l-lg"
                    />
                  </div>
                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          {product.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                          {product.description}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-gray-500">
                        Listed on {product.createdAt.toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Edit functionality would go here
                          }}
                        >
                          <MdOutlineEdit size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeProduct(product.id);
                          }}
                        >
                          <TbTrash size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
