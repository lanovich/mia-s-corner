"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/shadcn-ui/input";
import slugify from "slugify";

export default function AdminPage() {
  const [product, setProduct] = useState<Partial<Product>>({
    title: "",
    history_id: 0,
    category_id: 0,
    compound: "",
    slug: "",
    category_slug: "",
    images: [],
    scent_pyramid: {} as ScentPyramid,
    description: "",
    wick: "",
    wax: "",
    measure: "",
    episode: null,
  });

  const [sizes, setSizes] = useState<
    (Omit<Partial<Size>, "dimensions"> & {
      dimensions: { x: number; y: number; z: number };
    })[]
  >([
    {
      size: 0,
      oldPrice: 0,
      price: 0,
      time_of_exploitation: 0,
      dimensions: { x: 0, y: 0, z: 0 },
      quantity_in_stock: 0,
      is_default: false,
    },
  ]);

  const [categories, setCategories] = useState<Category[]>([]);

  // Загружаем категории при монтировании компонента
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) {
        console.error("Ошибка загрузки категорий:", error);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  // Генерация slug на основе title
  useEffect(() => {
    if (product.title) {
      const slug = slugify(product.title, {
        lower: true,
        strict: true,
      });
      setProduct((prev) => ({ ...prev, slug }));
    }
  }, [product.title]);

  // Получение category_slug при изменении category_id
  useEffect(() => {
    if (product.category_id) {
      const selectedCategory = categories.find(
        (cat) => cat.id === product.category_id
      );
      if (selectedCategory) {
        setProduct((prev) => ({
          ...prev,
          category_slug: selectedCategory.slug,
        }));
      }
    }
  }, [product.category_id, categories]);

  const handleProductChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setSizes((prev) =>
      prev.map((size, i) =>
        i === index ? { ...size, [name]: parseFloat(value) || 0 } : size
      )
    );
  };

  const handleDimensionsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setSizes((prev) =>
      prev.map((size, i) =>
        i === index
          ? {
              ...size,
              dimensions: {
                ...size.dimensions,
                [name]: parseFloat(value) || 0,
              },
            }
          : size
      )
    );
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const imagesArray: Image[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.error) {
        console.error("Ошибка загрузки изображения:", result.error);
      } else {
        imagesArray.push({
          url: result.url,
          type: "main",
        });
      }
    }

    setProduct((prev) => ({ ...prev, images: imagesArray }));
  };

  const addSize = () => {
    setSizes((prev) => [
      ...prev,
      {
        size: 0,
        oldPrice: 0,
        price: 0,
        time_of_exploitation: 0,
        dimensions: { x: 0, y: 0, z: 0 },
        quantity_in_stock: 0,
        is_default: false,
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product, sizes }),
      });

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      alert("Данные успешно добавлены!");
    } catch (error) {
      console.error("❌ Ошибка при добавлении данных:", error);
      alert("Произошла ошибка при добавлении данных.");
    }
  };

  return (
    <div className="p-4 bg-slate-400">
      <h1 className="text-2xl font-bold mb-4">Добавление продукта</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-2">
                <label>Название продукта:</label>
              </td>
              <td className="py-2">
                <Input
                  type="text"
                  name="title"
                  value={product.title}
                  onChange={handleProductChange}
                  required
                  className="w-full"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label>History ID:</label>
              </td>
              <td className="py-2">
                <Input
                  type="number"
                  name="history_id"
                  value={product.history_id}
                  onChange={handleProductChange}
                  required
                  className="w-full"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label>Категория:</label>
              </td>
              <td className="py-2">
                <select
                  name="category_id"
                  value={product.category_id}
                  onChange={(e) =>
                    handleProductChange({
                      target: {
                        name: "category_id",
                        value: parseInt(e.target.value, 10),
                      }, // Преобразуем значение в число
                    } as unknown as React.ChangeEvent<HTMLInputElement>)
                  }
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value={0}>Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label>Аромат:</label>
              </td>
              <td className="py-2">
                <Input
                  type="text"
                  name="compound"
                  value={product.compound}
                  onChange={handleProductChange}
                  required
                  className="w-full"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label>Slug:</label>
              </td>
              <td className="py-2">
                <Input
                  type="text"
                  name="slug"
                  value={product.slug}
                  readOnly
                  className="w-full bg-gray-100"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label>Category Slug:</label>
              </td>
              <td className="py-2">
                <Input
                  type="text"
                  name="category_slug"
                  value={product.category_slug}
                  readOnly
                  className="w-full bg-gray-100"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label>Изображения:</label>
              </td>
              <td className="py-2">
                <Input
                  type="file"
                  multiple
                  onChange={handleImagesChange}
                  accept="image/*"
                  className="w-full"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label>Пирамида ароматов:</label>
              </td>
              <td className="py-2">
                <Input
                  type="text"
                  name="scent_pyramid"
                  value={product.scent_pyramid?.toString() || ""}
                  onChange={handleProductChange}
                  className="w-full"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label>Описание:</label>
              </td>
              <td className="py-2">
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleProductChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label>Фитиль:</label>
              </td>
              <td className="py-2">
                <Input
                  type="text"
                  name="wick"
                  value={product.wick}
                  onChange={handleProductChange}
                  required
                  className="w-full"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label>Воск:</label>
              </td>
              <td className="py-2">
                <Input
                  type="text"
                  name="wax"
                  value={product.wax}
                  onChange={handleProductChange}
                  required
                  className="w-full"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label>Единица измерения:</label>
              </td>
              <td className="py-2">
                <Input
                  type="text"
                  name="measure"
                  value={product.measure}
                  onChange={handleProductChange}
                  required
                  className="w-full"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label>Эпизод:</label>
              </td>
              <td className="py-2">
                <Input
                  type="text"
                  name="episode"
                  value={product.episode || ""}
                  onChange={handleProductChange}
                  className="w-full"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-xl font-bold mt-6">Добавление размеров</h2>
        {sizes.map((size, index) => (
          <div key={index} className="space-y-4 border p-4 rounded">
            <h3 className="font-semibold">Размер #{index + 1}</h3>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-2">
                    <label>Размер:</label>
                  </td>
                  <td className="py-2">
                    <Input
                      type="number"
                      name="size"
                      value={size.size}
                      onChange={(e) => handleSizeChange(e, index)}
                      required
                      className="w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2">
                    <label>Старая цена:</label>
                  </td>
                  <td className="py-2">
                    <Input
                      type="number"
                      name="oldPrice"
                      value={size.oldPrice}
                      onChange={(e) => handleSizeChange(e, index)}
                      required
                      className="w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2">
                    <label>Цена:</label>
                  </td>
                  <td className="py-2">
                    <Input
                      type="number"
                      name="price"
                      value={size.price}
                      onChange={(e) => handleSizeChange(e, index)}
                      required
                      className="w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2">
                    <label>Время эксплуатации:</label>
                  </td>
                  <td className="py-2">
                    <Input
                      type="number"
                      name="time_of_exploitation"
                      value={size.time_of_exploitation}
                      onChange={(e) => handleSizeChange(e, index)}
                      required
                      className="w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2">
                    <label>Габариты (X):</label>
                  </td>
                  <td className="py-2">
                    <Input
                      type="number"
                      name="x"
                      value={size.dimensions.x}
                      onChange={(e) => handleDimensionsChange(e, index)}
                      required
                      className="w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2">
                    <label>Габариты (Y):</label>
                  </td>
                  <td className="py-2">
                    <Input
                      type="number"
                      name="y"
                      value={size.dimensions.y}
                      onChange={(e) => handleDimensionsChange(e, index)}
                      required
                      className="w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2">
                    <label>Габариты (Z):</label>
                  </td>
                  <td className="py-2">
                    <Input
                      type="number"
                      name="z"
                      value={size.dimensions.z}
                      onChange={(e) => handleDimensionsChange(e, index)}
                      required
                      className="w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2">
                    <label>Количество на складе:</label>
                  </td>
                  <td className="py-2">
                    <Input
                      type="number"
                      name="quantity_in_stock"
                      value={size.quantity_in_stock}
                      onChange={(e) => handleSizeChange(e, index)}
                      required
                      className="w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2">
                    <label>По умолчанию:</label>
                  </td>
                  <td className="py-2">
                    <Input
                      type="checkbox"
                      name="is_default"
                      checked={size.is_default}
                      onChange={(e) =>
                        setSizes((prev) =>
                          prev.map((s, i) =>
                            i === index
                              ? { ...s, is_default: e.target.checked }
                              : s
                          )
                        )
                      }
                      className="w-4 h-4"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
        <button
          type="button"
          onClick={addSize}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Добавить ещё размер
        </button>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        >
          Добавить продукт и размеры
        </button>
      </form>
    </div>
  );
}
