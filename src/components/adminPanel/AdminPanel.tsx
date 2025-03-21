"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import axios from "axios";
import { supabase } from "@/lib/supabase";

const AdminPanel = () => {
  const { register, handleSubmit, watch, setValue } = useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [addedSizes, setAddedSizes] = useState<ProductSize[]>([]);
  const [generatedSlug, setGeneratedSlug] = useState<string>("");

  // Загрузка категорий и размеров из базы данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем категории
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*");

        if (categoriesError) {
          throw categoriesError;
        }

        // Получаем размеры
        const { data: sizesData, error: sizesError } = await supabase
          .from("sizes")
          .select("*");

        if (sizesError) {
          throw sizesError;
        }

        setCategories(categoriesData || []);
        setSizes(sizesData || []);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, []);

  // Генерация slug на основе названия и категории
  useEffect(() => {
    const title = watch("title");
    const categoryId = watch("category");

    if (title && categoryId) {
      const category = categories.find(
        (cat) => cat.id === parseInt(categoryId)
      );
      const categorySlug = category?.slug || null;

      // Генерация slug
      const baseSlug = slugify(title, { lower: true });
      const fullSlug = `${baseSlug}-${categorySlug}`;

      setGeneratedSlug(fullSlug);
    }
  }, [watch("title"), watch("category"), categories]);

  // Добавление размера к продукту
  const addSize = () => {
    if (selectedSize) {
      const newSize: ProductSize = {
        size_id: selectedSize.id,
        size: selectedSize,
        price: 0,
        oldPrice: 0,
        quantity_in_stock: 0,
        is_default: false,
        product_id: 0, // Временно, будет обновлено после создания продукта
      };
      setAddedSizes([...addedSizes, newSize]);
      setSelectedSize(null); // Сброс выбора размера
    }
  };

  // Удаление размера
  const removeSize = (index: number) => {
    const updatedSizes = addedSizes.filter((_, i) => i !== index);
    setAddedSizes(updatedSizes);
  };

  // Загрузка изображения в Supabase Storage
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", `${Date.now()}-${file.name}`); // Уникальное имя файла

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.url; // Возвращаем URL изображения
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
      return null;
    }
  };

  // Обработчик отправки формы
  const onSubmit = async (data: any) => {
    const category = categories.find(
      (cat) => cat.id === parseInt(data.category)
    );

    if (!category) {
      alert("Категория не выбрана");
      return;
    }

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    // Подготовка данных для отправки
    const productData = {
      title: data.title,
      history_id: data.history_id,
      category_id: data.category,
      compound: data.compound,
      slug: generatedSlug,
      category_slug: category.slug, // Берём slug из выбранной категории
      scent_pyramid: {
        top: data.scent_top,
        heart: data.scent_heart,
        base: data.scent_base,
      },
      description: data.description,
      images: imageUrl ? [{ url: imageUrl, type: "main" }] : [], // Добавляем изображение, если оно есть
      measure: data.measure,
      episode: data.episode,
      episode_number: data.episode_number,
      product_sizes: addedSizes.map((size, index) => ({
        size_id: size.size_id,
        price: data[`price_${index}`],
        oldPrice: data[`oldPrice_${index}`],
        quantity_in_stock: data[`quantity_${index}`],
        is_default: data[`is_default_${index}`] === "on",
      })),
    };

    try {
      await axios.post("/api/products", productData);
      alert("Продукт успешно добавлен!");
    } catch (error) {
      console.error("Ошибка при добавлении продукта:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Добавить новый продукт
        </h1>

        {/* Название продукта */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название продукта
          </label>
          <input
            {...register("title", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите название"
          />
        </div>

        {/* История (history_id) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            История (history_id)
          </label>
          <input
            {...register("history_id", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите history_id"
          />
        </div>

        {/* Категория */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Категория
          </label>
          <select
            {...register("category", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Состав (compound) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Состав
          </label>
          <input
            {...register("compound", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите состав"
          />
        </div>

        {/* Сгенерированный slug */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Сгенерированный slug
          </label>
          <input
            type="text"
            value={generatedSlug}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Пирамида ароматов (scent_pyramid) */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Пирамида ароматов
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Верхние ноты
              </label>
              <input
                {...register("scent_top", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Верхние ноты"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Сердечные ноты
              </label>
              <input
                {...register("scent_heart", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Сердечные ноты"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Базовые ноты
              </label>
              <input
                {...register("scent_base", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Базовые ноты"
              />
            </div>
          </div>
        </div>

        {/* Описание (description) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Описание
          </label>
          <textarea
            {...register("description", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите описание"
          />
        </div>

        {/* Изображение */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Изображение
          </label>
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Мера (measure) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Мера
          </label>
          <input
            {...register("measure", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите меру"
          />
        </div>

        {/* Эпизод (episode) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Эпизод
          </label>
          <input
            {...register("episode", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите эпизод"
          />
        </div>

        {/* Номер эпизода (episode_number) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Номер эпизода
          </label>
          <input
            {...register("episode_number", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите номер эпизода"
          />
        </div>

        {/* Выбор размера */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Выберите размер
          </label>
          <select
            onChange={(e) => {
              const size = sizes.find((s) => s.id === parseInt(e.target.value));
              setSelectedSize(size || null);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Выберите размер</option>
            {sizes.map((size) => (
              <option key={size.id} value={size.id}>
                {size.size} (Ш: {size.dimensions.x} см, Д: {size.dimensions.y}{" "}
                см, В: {size.dimensions.z} см)
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addSize}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Добавить размер
          </button>
        </div>

        {/* Добавленные размеры */}
        {addedSizes.map((size, index) => (
          <div
            key={index}
            className="mb-6 p-4 border border-gray-200 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Размер: {size.size.size} (Ш: {size.size.dimensions.x} см, Д:{" "}
              {size.size.dimensions.y} см, В: {size.size.dimensions.z} см)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Цена</label>
                <input
                  {...register(`price_${index}`, { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Цена"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Старая цена
                </label>
                <input
                  {...register(`oldPrice_${index}`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Старая цена"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Количество на складе
                </label>
                <input
                  {...register(`quantity_${index}`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Количество"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register(`is_default_${index}`)}
                  className="mr-2"
                />
                <label className="text-sm text-gray-600">По умолчанию</label>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeSize(index)}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Удалить размер
            </button>
          </div>
        ))}

        {/* Кнопка отправки */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Добавить продукт
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
