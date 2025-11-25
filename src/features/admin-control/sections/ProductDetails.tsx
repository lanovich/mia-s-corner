"use client";

import { Save, Book, Plus } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { InputField, Section } from "../ui";
import { Button, Checkbox, Label } from "@/shared/shadcn-ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/shadcn-ui/select";
import { Product, ProductSize, Size } from "@/entities/product/model";
import { PriceInputs, DimensionInputs, ParamsInputs } from ".";
import { toast } from "sonner";

interface ProductDetailsProps {
  className?: string;
  selectedProductData?: Product | null;
  onProductUpdated?: () => Promise<void>;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  className,
  selectedProductData,
  onProductUpdated,
}) => {
  const [productState, setProductState] = useState({
    title: "",
    description: "",
    storyText: "",
    isLimited: false,
  });

  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [sizeState, setSizeState] = useState<Record<number, ProductSize>>({});

  useEffect(() => {
    if (!selectedProductData) return;

    setProductState({
      title: selectedProductData.title || "",
      description: selectedProductData.description || "",
      storyText: selectedProductData.storyText || "",
      isLimited: selectedProductData.isLimited,
    });

    const sizesMap: Record<number, ProductSize> = {};
    selectedProductData.sizes.forEach((s) => {
      sizesMap[s.id] = { ...s };
    });
    setSizeState(sizesMap);

    setSelectedSizeId(selectedProductData.sizes[0]?.id || null);
  }, [selectedProductData]);

  if (!selectedProductData) {
    return <div className={className}>Выберите продукт для редактирования</div>;
  }

  const selectedSize = selectedSizeId ? sizeState[selectedSizeId] : null;

  const handleProductChange = (
    field: keyof typeof productState,
    value: any
  ) => {
    setProductState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSizeChange = (sizeId: number) => {
    setSelectedSizeId(sizeId);
  };

  const handleSizeFieldChange = (field: keyof ProductSize, value: any) => {
    if (!selectedSizeId) return;
    setSizeState((prev) => ({
      ...prev,
      [selectedSizeId]: {
        ...prev[selectedSizeId],
        [field]: value,
      },
    }));
  };

  const hasProductChanges = useMemo(() => {
    return (
      productState.title !== selectedProductData.title ||
      productState.description !== selectedProductData.description ||
      productState.storyText !== selectedProductData.storyText ||
      productState.isLimited !== selectedProductData.isLimited
    );
  }, [productState, selectedProductData]);

  const hasSizeChanges = useMemo(() => {
    if (!selectedSizeId) return false;
    const originalSize = selectedProductData.sizes.find(
      (s) => s.id === selectedSizeId
    );
    if (!originalSize) return false;

    return JSON.stringify(selectedSize) !== JSON.stringify(originalSize);
  }, [selectedSize, selectedSizeId, selectedProductData]);

  const handleSaveChanges = async () => {
    try {
      toast.success("Изменения успешно сохранены");
      onProductUpdated?.();
    } catch (error) {
      toast.error("Ошибка при сохранении изменений");
    }
  };

  const handleDiscardChanges = () => {
    if (!selectedProductData) return;

    setProductState({
      title: selectedProductData.title || "",
      description: selectedProductData.description || "",
      storyText: selectedProductData.storyText || "",
      isLimited: selectedProductData.isLimited,
    });

    const sizesMap: Record<number, ProductSize> = {};
    selectedProductData.sizes.forEach((s) => {
      sizesMap[s.id] = { ...s };
    });
    setSizeState(sizesMap);
  };

  return (
    <div className={className}>
      <Section title="Информация о продукте" className="mb-4">
        <InputField
          label="Название"
          value={productState.title}
          onChange={(v) => handleProductChange("title", v)}
        />
        <InputField
          label="Описание"
          value={productState.description}
          onChange={(v) => handleProductChange("description", v)}
          multiline
          rows={5}
        />
        <InputField
          label="История"
          value={productState.storyText}
          onChange={(v) => handleProductChange("storyText", v)}
          multiline
          rows={3}
        />
        <div className="flex items-center gap-2 mt-2">
          <Checkbox
            id="is-limited"
            checked={productState.isLimited}
            onCheckedChange={(v) => handleProductChange("isLimited", v)}
          />
          <Label htmlFor="is-limited">Ограниченный выпуск</Label>
        </div>
      </Section>

      <Section title="Размеры" className="mb-4">
        <div className="flex flex-wrap gap-2">
          {selectedProductData.sizes.map((size) => (
            <Button
              key={size.id}
              variant={selectedSizeId === size.id ? "default" : "ghost"}
              onClick={() => handleSizeChange(size.id)}
            >
              {`${size.volume.amount || ""} ${size.volume.unit || ""}`} -{" "}
              {size.stock} шт
            </Button>
          ))}
        </div>
      </Section>

      {selectedSize && (
        <div className="space-y-4">
          <Section title="Общие настройки размера">
            <div className="flex items-center gap-2">
              <Checkbox
                id="default-size"
                checked={selectedSize.isDefault}
                onCheckedChange={(v) => handleSizeFieldChange("isDefault", v)}
              />
              <Label htmlFor="default-size">Использовать по умолчанию</Label>
            </div>
          </Section>

          <Section title="Цены">
            <PriceInputs
              currentSizeDetails={selectedSize}
              handleInputChange={(field, value) =>
                handleSizeFieldChange(field, value)
              }
              changedFields={{
                price:
                  parseFloat(selectedSize.price as any) !==
                  parseFloat(
                    selectedProductData.sizes.find(
                      (s) => s.id === selectedSize.id
                    )?.price as any
                  ),
                oldPrice: !!(
                  parseFloat((selectedSize.oldPrice as any) || 0) !==
                    selectedProductData.sizes.find(
                      (s) => s.id === selectedSize.id
                    )?.oldPrice || 0
                ),
              }}
            />
          </Section>

          <Section title="Параметры">
            <ParamsInputs
              currentSizeDetails={selectedSize}
              selectedProductData={selectedProductData}
              handleInputChange={(field, value) =>
                handleSizeFieldChange(field, value)
              }
            />
          </Section>

          <Section title="Габариты">
            <div></div>
            {/* <DimensionInputs
              dimensions={selectedSize.props}
              onChange={(value) => handleSizeFieldChange("dimensions", value)}
              isChanged={false}
            /> */}
          </Section>
        </div>
      )}

      {(hasProductChanges || hasSizeChanges) && (
        <div className="sticky bottom-0 bg-white border-t p-4 flex flex-col gap-2">
          <Button className="w-full gap-2" onClick={handleSaveChanges}>
            <Save className="h-4 w-4" />
            Сохранить изменения
          </Button>
          <Button
            variant="ghost"
            className="w-full text-red-500 hover:text-red-600"
            onClick={handleDiscardChanges}
          >
            Отменить изменения
          </Button>
        </div>
      )}
    </div>
  );
};
