"use client";

import { useState, useEffect } from "react";
import slugify from "slugify";
import axios from "axios";
import { toast } from "sonner";
import { Input, Button, Textarea } from "@/shared/shadcn-ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/shadcn-ui/select";
import { ChapterHeading, Container } from "@/shared/ui";
import { GoToButton } from "@/shared/ui";
import { Category } from "@/entities/category/model";
import { Size } from "@/entities/product/model";
import { categoriesApi } from "@/entities/category/api";
import { adminApi } from "@/features/admin-control/api";

export default function AddProduct() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSizes, setLoadingSizes] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    compound: "",
    episode: "",
    epsiodeNumber: "",
    measure: "",
  });
  const [selectedSizeIds, setSelectedSizeIds] = useState<number[]>([]);
  const [generatedSlug, setGeneratedSlug] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesApi.fetchCategories();

        setCategories(data ? data : []);
      } catch (error) {
        toast.error("Не удалось загрузить категории");
        console.error("Ошибка загрузки категорий:", error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (!formData.categoryId) return;

    const loadSizes = async () => {
      setLoadingSizes(true);
      try {
        const category = categories.find(
          (c) => c.id.toString() === formData.categoryId
        );

        if (category) {
          const sizesData = await adminApi.fetchSizesByCategoryName(
            category.name
          );
          setSizes(sizesData ? sizesData : []);
        }
      } catch (error) {
        toast.error("Не удалось загрузить размеры");
        console.error("Ошибка загрузки размеров:", error);
      } finally {
        setLoadingSizes(false);
      }
    };

    loadSizes();
  }, [formData.categoryId, categories]);

  // Обновление slug при изменении названия или категории
  useEffect(() => {
    if (formData.title && formData.categoryId) {
      const selectedCategory = categories.find(
        (c) => c.id.toString() === formData.categoryId
      );
      if (selectedCategory) {
        setCategorySlug(selectedCategory.slug);
        const slug = slugify(`${formData.title} ${selectedCategory.slug}`, {
          lower: true,
          strict: true,
        });
        setGeneratedSlug(slug);
      }
    } else {
      setGeneratedSlug("");
      setCategorySlug("");
    }
  }, [formData.title, formData.categoryId, categories]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
    setSelectedSizeIds([]);
  };

  const handleSizeSelection = (sizeId: number) => {
    setSelectedSizeIds((prev) =>
      prev.includes(sizeId)
        ? prev.filter((id) => id !== sizeId)
        : [...prev, sizeId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.categoryId) {
      toast.warning("Заполните обязательные поля (название и категорию)");
      return;
    }

    if (selectedSizeIds.length === 0) {
      toast.warning("Выберите хотя бы один размер");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Создание товара...");

    try {

      toast.success("Товар успешно создан!", { id: toastId });

      setSelectedSizeIds([]);
    } catch (error) {
      let errorMessage = "Ошибка при создании товара";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { id: toastId });
      console.error("Ошибка при создании товара:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-400 h-full">
      <Container className="bg-gray-200 pt-5 gap-y-4 mb-5 pb-5 p-8">
        <GoToButton
          href={"/admin"}
          label={"Редактировать существующие товары"}
          className="text-sm h-6 p-4"
        />
        <ChapterHeading className="mb-5">Добавить новый товар</ChapterHeading>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="border-gray-200 border-2 p-4 rounded-xl bg-white">
              <h3 className="font-medium mb-4">Основная информация</h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium mb-1"
                  >
                    Название товара*
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="border-gray-300"
                    required
                    placeholder="Введите название товара"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium mb-1"
                  >
                    Категория*
                  </label>
                  <Select
                    onValueChange={handleCategoryChange}
                    value={formData.categoryId}
                    required
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Генерируемый slug
                  </label>
                  <Input
                    value={generatedSlug}
                    readOnly
                    className="border-gray-300 bg-gray-100"
                    placeholder="Slug сгенерируется автоматически"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Slug категории
                  </label>
                  <Input
                    value={categorySlug}
                    readOnly
                    className="border-gray-300 bg-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="border-gray-200 border-2 p-4 rounded-xl bg-white">
              <h3 className="font-medium mb-4">Дополнительная информация</h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="compound"
                    className="block text-sm font-medium mb-1"
                  >
                    Аромат
                  </label>
                  <Input
                    id="compound"
                    name="compound"
                    value={formData.compound}
                    onChange={handleInputChange}
                    className="border-gray-300"
                    placeholder="Введите аромат продукта"
                  />
                </div>

                <div>
                  <label
                    htmlFor="episode"
                    className="block text-sm font-medium mb-1"
                  >
                    Содержание эпизода
                  </label>
                  <Textarea
                    id="episode"
                    name="episode"
                    value={formData.episode}
                    onChange={(e) => handleInputChange(e)}
                    className="border-gray-300 min-h-[100px]"
                    placeholder="Опишите содержание эпизода, связанного с продуктом"
                  />
                </div>

                <div>
                  <label
                    htmlFor="epsiodeNumber"
                    className="block text-sm font-medium mb-1"
                  >
                    Номер эпизода
                  </label>
                  <Input
                    id="epsiodeNumber"
                    name="epsiodeNumber"
                    type="number"
                    step="0.1"
                    value={formData.epsiodeNumber}
                    onChange={handleInputChange}
                    className="border-gray-300"
                    placeholder="Введите номер эпизода"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Блок выбора размеров */}
          <div className="border-gray-200 border-2 p-4 rounded-xl bg-white">
            <h3 className="font-medium mb-4">Доступные размеры</h3>
            {loadingSizes ? (
              <p>Загрузка размеров...</p>
            ) : sizes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {sizes?.map((size) => (
                  <Button
                    key={size.id}
                    type="button"
                    variant={
                      selectedSizeIds.includes(size.id) ? "default" : "outline"
                    }
                    onClick={() => handleSizeSelection(size.id)}
                  >
                    {size?.volume?.amount} {size?.volume?.unit}
                  </Button>
                ))}
              </div>
            ) : (
              <p>Нет доступных размеров для выбранной категории</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  title: "",
                  categoryId: "",
                  compound: "",
                  episode: "",
                  epsiodeNumber: "",
                  measure: "",
                });
                setSelectedSizeIds([]);
                setGeneratedSlug("");
              }}
            >
              Очистить форму
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                !formData.title ||
                !formData.categoryId ||
                selectedSizeIds.length === 0
              }
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Создание..." : "Создать товар"}
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}
