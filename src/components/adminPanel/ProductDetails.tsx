"use client";

import { Save, Book, Plus } from "lucide-react";
import { DimensionInputs } from "./sections/DimensionInputs";
import { Button, Checkbox, Label } from "../shadcn-ui";
import React, { useState, useEffect } from "react";
import { useConfirm } from "./hooks/useConfirm";
import { InputField, PlaceholderForm, Section } from ".";
import { PriceInputs } from "./sections/PriceInputs";
import { ParamsInputs } from "./sections/ParamsInputs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn-ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { CategoryProduct } from "@/entities/category/model";
import { SizeDetails } from "@/entities/product/model";

interface ProductDetailsProps {
  className?: string;
  productDataInSelectedCategory?: CategoryProduct | null;
  onProductUpdated?: () => Promise<void>;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  className,
  productDataInSelectedCategory,
  onProductUpdated,
}) => {
  const [selectedSizeId, setSelectedSizeId] = useState<number>(0);
  const [currentSizeDetails, setCurrentSizeDetails] =
    useState<SizeDetails | null>(null);
  const [originalSizeDetails, setOriginalSizeDetails] =
    useState<SizeDetails | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [changedFields, setChangedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [availableSizes, setAvailableSizes] = useState<any[]>([]);
  const [selectedNewSize, setSelectedNewSize] = useState<string>("");
  const [isAddingSize, setIsAddingSize] = useState(false);
  const { confirm, confirmState } = useConfirm();
  const [originalDescription, setOriginalDescription] = useState("");
  const [description, setDescription] = useState("");


  useEffect(() => {
    const fetchSizes = async () => {
      const { data, error } = await supabase.from("sizes").select("*");
      if (!error && data) {
        setAvailableSizes(data);
      }
    };
    fetchSizes();
  }, []);

  useEffect(() => {
    if (!productDataInSelectedCategory) return;

    const size = productDataInSelectedCategory.product.sizes.find(
      (s) => s.id === selectedSizeId
    );

    setCurrentSizeDetails(size || null);
    setOriginalSizeDetails(size || null);
    setHasChanges(false);
    setChangedFields({});
  }, [selectedSizeId, productDataInSelectedCategory]);

  useEffect(() => {
    if (!currentSizeDetails || !originalSizeDetails) return;

    const changes: Record<string, boolean> = {};
    let anyChange = false;

    (Object.keys(currentSizeDetails) as Array<keyof SizeDetails>).forEach(
      (key) => {
        if (
          JSON.stringify(currentSizeDetails[key]) !==
          JSON.stringify(originalSizeDetails[key])
        ) {
          changes[key] = true;
          anyChange = true;
        }
      }
    );

    // Проверка изменения описания
    if (description !== originalDescription) {
      anyChange = true;
    }

    setChangedFields(changes);
    setHasChanges(anyChange);
  }, [currentSizeDetails, originalSizeDetails, description, originalDescription]);

  useEffect(() => {
    if (productDataInSelectedCategory) {
      const desc = productDataInSelectedCategory.product.product_description || "";
      setOriginalDescription(desc);
      setDescription(desc);
    }
  }, [productDataInSelectedCategory]);

  const filteredSizes = availableSizes.filter((size: any) => {
    const isSameCategory =
      size.category_name ===
      productDataInSelectedCategory?.product.category.name;
    const isNotAdded = !productDataInSelectedCategory?.product.sizes.some(
      (s) => s.id === size.id
    );
    return isSameCategory && isNotAdded;
  });

  const handleAddSize = async () => {
    if (!productDataInSelectedCategory || !selectedNewSize) return;

    setIsAddingSize(true);
    const toastId = toast.loading("Добавление размера...");

    try {
      const { error } = await supabase.from("product_sizes").insert({
        product_id: productDataInSelectedCategory.product.id,
        size_id: Number(selectedNewSize),
        is_default: false,
        price: 0,
        quantity_in_stock: 0,
      });

      if (error) throw error;

      toast.success("Размер успешно добавлен", { id: toastId });

      if (onProductUpdated) {
        await onProductUpdated();
      }

      setSelectedNewSize("");
    } catch (error) {
      toast.error("Ошибка при добавлении размера", { id: toastId });
      console.error("Ошибка при добавлении размера:", error);
    } finally {
      setIsAddingSize(false);
    }
  };

  const handleInputChange = (field: keyof SizeDetails, value: any) => {
    if (!currentSizeDetails) return;
    setCurrentSizeDetails({ ...currentSizeDetails, [field]: value });
  };

  const handleSaveChanges = async () => {
    if (!currentSizeDetails || !productDataInSelectedCategory) return;

    const toastId = toast.loading("Сохранение изменений...");

    try {
      const sizeInfo = productDataInSelectedCategory.product.sizes.find(
        (s) => s.id === selectedSizeId
      );

      const productId = productDataInSelectedCategory.product.id

      if (!sizeInfo) {
        throw new Error("Не удалось найти информацию о размере");
      }

      const response = await fetch("/api/admin/product-sizes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sizeId: sizeInfo.id,
          productId: productId,
          price: currentSizeDetails.price,
          oldPrice: currentSizeDetails.oldPrice,
          isDefault: currentSizeDetails.isDefault,
          quantityInStock: currentSizeDetails.quantity,
          sizeValue: currentSizeDetails.size,
          timeOfExploitation: currentSizeDetails.timeOfExploitation,
          dimensions: currentSizeDetails.dimensions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при сохранении размера");
      }

      if (description !== originalDescription) {
        const descResponse = await fetch(
          "/api/admin/products/update-description",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId: productDataInSelectedCategory.product.id,
              description,
            }),
          }
        );

        if (!descResponse.ok) {
          const errorData = await descResponse.json();
          throw new Error(errorData.error || "Ошибка при обновлении описания");
        }

        setOriginalDescription(description);
      }

      toast.success("Изменения успешно сохранены", { id: toastId });

      setOriginalSizeDetails(currentSizeDetails);
      setHasChanges(false);
      setChangedFields({});

      if (onProductUpdated) {
        await onProductUpdated();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ошибка при сохранении",
        { id: toastId }
      );
      console.error("Ошибка при сохранении:", error);
    }
  };

  const handleDiscardChanges = () => {
    if (!originalSizeDetails) return;
    setCurrentSizeDetails(originalSizeDetails);
    setDescription(originalDescription);
    setHasChanges(false);
    setChangedFields({});
  };

  const handleSizeChange = async (newSizeId: number) => {
    if (!hasChanges) {
      setSelectedSizeId(newSizeId);
      return;
    }

    const shouldSave = await confirm({
      title: "Несохраненные изменения",
      description: "У вас есть несохраненные изменения. Сохранить перед переходом?",
      cancelText: "Отменить",
      confirmText: "Сохранить",
    });

    if (shouldSave) await handleSaveChanges();
    setSelectedSizeId(newSizeId);
  };

  if (
    !productDataInSelectedCategory ||
    productDataInSelectedCategory.product.sizes.length === 0
  ) {
    return (
      <div className={className}>
        <p className="text-gray-500">Нет доступных размеров для этого товара</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Section
        title={`Параметры для категории ${productDataInSelectedCategory.product.category.name}`}
        className="my-2"
      >
        <InputField
          label="Описание на странице товара"
          value={description}
          onChange={setDescription}
          icon={<Book className="h-4 w-4" />}
          rows={5}
          multiline={true}
          isChanged={description !== originalDescription}
        />
      </Section>

      <Section title="Выбор размера" className="mb-2">
        <div className="flex flex-wrap gap-2 my-2">
          {productDataInSelectedCategory.product.sizes
            .sort((a, b) => {
              const sizeA = parseFloat(a.size || "0");
              const sizeB = parseFloat(b.size || "0");
              return sizeA - sizeB;
            })
            .map((size) => (
              <Button
                key={size.id}
                onClick={() => handleSizeChange(size.id)}
                className="p-2 border-2 gap-2 rounded-lg max-w-36 min-w-24 disabled:opacity-100"
                variant={selectedSizeId === size.id ? "default" : "ghost"}
                disabled={selectedSizeId === size.id}
              >
                {`${size.size} ${productDataInSelectedCategory.product.measure}` || "Без размера"}{" "}
                - {size.quantity} шт
              </Button>
            ))}

          <div className="flex items-center gap-2 rounded-lg border">
            <Select
              value={selectedNewSize}
              onValueChange={setSelectedNewSize}
              disabled={isAddingSize || filteredSizes.length === 0}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Выберите размер" />
              </SelectTrigger>
              <SelectContent>
                {filteredSizes.map((size: any) => (
                  <SelectItem key={size.id} value={String(size.id)}>
                    {`${size.category_name}: ${size.size} ${productDataInSelectedCategory.product.measure}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleAddSize}
              disabled={!selectedNewSize || isAddingSize}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Добавить
            </Button>
          </div>
        </div>
      </Section>

      {selectedSizeId !== 0 && currentSizeDetails ? (
        <>
          <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg mb-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="default-size"
                checked={currentSizeDetails?.isDefault || false}
                onCheckedChange={(checked) => {
                  handleInputChange("isDefault", checked);
                }}
              />
              <Label
                htmlFor="default-size"
                className="text-sm font-medium flex items-center gap-2"
              >
                Использовать по умолчанию
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Section title="Цены">
              <PriceInputs
                currentSizeDetails={currentSizeDetails}
                handleInputChange={handleInputChange}
                changedFields={changedFields}
              />
            </Section>

            <Section title="Параметры">
              <ParamsInputs
                changedFields={changedFields}
                currentSizeDetails={currentSizeDetails}
                productDataInSelectedCategory={productDataInSelectedCategory}
                handleInputChange={handleInputChange}
              />
            </Section>

            <Section title="Габариты">
              <DimensionInputs
                dimensions={currentSizeDetails.dimensions}
                onChange={(value) => handleInputChange("dimensions", value)}
                isChanged={changedFields.dimensions}
              />
            </Section>

            {hasChanges && (
              <div className="sticky bottom-0 bg-white pt-4 border-t">
                <Button onClick={handleSaveChanges} className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  Сохранить изменения
                </Button>
              </div>
            )}

            {hasChanges && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDiscardChanges}
                className="text-red-500 hover:text-red-600"
              >
                Отменить изменения
              </Button>
            )}
          </div>
        </>
      ) : (
        <PlaceholderForm />
      )}

      {confirmState.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full">
            <h3 className="text-lg font-medium mb-2">{confirmState.title}</h3>
            <p className="text-gray-600 mb-4">{confirmState.description}</p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => confirmState.onCancel?.()}
              >
                {confirmState.cancelText}
              </Button>
              <Button onClick={() => confirmState.onConfirm?.()}>
                {confirmState.confirmText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
