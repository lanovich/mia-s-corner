"use client";

import {
  Box,
  Ruler,
  Clock,
  Tag,
  Save,
  BadgePercent,
  Book,
  Divide,
} from "lucide-react";
import { DimensionInputs } from "./sections/DimensionInputs";
import { CategoryProduct } from "@/types/CategoryProduct";
import { Button, Checkbox, Label } from "../shadcn-ui";
import React, { useState, useEffect } from "react";
import { SizeDetails } from "@/types/SizeDetails";
import { useConfirm } from "./hooks/useConfirm";
import { InputField, PlaceholderForm, Section } from ".";
import { PriceInputs } from "./sections/PriceInputs";
import { ParamsInputs } from "./sections/ParamsInputs";

interface ProductDetailsProps {
  className?: string;
  productDataInSelectedCategory: CategoryProduct | null;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  className,
  productDataInSelectedCategory,
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
  const { confirm, confirmState } = useConfirm();

  useEffect(() => {
    const size = productDataInSelectedCategory?.product.sizes.find(
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

    setChangedFields(changes);
    setHasChanges(anyChange);
  }, [currentSizeDetails, originalSizeDetails]);

  const handleInputChange = (field: keyof SizeDetails, value: any) => {
    if (!currentSizeDetails) return;
    setCurrentSizeDetails({ ...currentSizeDetails, [field]: value });
  };

  const handleSaveChanges = async () => {
    if (!hasChanges || !currentSizeDetails) return;

    try {
      console.log("Сохранение изменений:", currentSizeDetails);
      setOriginalSizeDetails(currentSizeDetails);
      setHasChanges(false);
      setChangedFields({});
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    }
  };

  const handleDiscardChanges = () => {
    if (!originalSizeDetails) return;
    setCurrentSizeDetails(originalSizeDetails);
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
      description:
        "У вас есть несохраненные изменения. Сохранить перед переходом?",
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
          value={productDataInSelectedCategory.product.product_description}
          onChange={(value) => handleInputChange("quantity", value)}
          icon={<Book className="h-4 w-4" />}
          rows={5}
          multiline={true}
          isChanged={changedFields.quantity}
        />
      </Section>

      {/* Кнопки выбора размера */}
      <Section title="Выбор размера" className="mb-2">
        <div className="flex flex-wrap gap-2 my-2">
          {productDataInSelectedCategory.product.sizes
            .sort((a, b) => {
              const sizeA = a.size ? parseFloat(a.size) : 0;
              const sizeB = b.size ? parseFloat(b.size) : 0;
              return sizeA - sizeB;
            })
            .map((size) => (
              <Button
                key={size.id}
                onClick={() => handleSizeChange(size.id)}
                className={
                  "p-2 border-2 gap-2 rounded-lg max-w-36 min-w-24 disabled:opacity-100"
                }
                variant={selectedSizeId === size.id ? "default" : "ghost"}
                disabled={selectedSizeId === size.id}
              >
                {size.size || "Без размера"} - {size.quantity} шт
              </Button>
            ))}
        </div>
        {/* Чекбокс размера по умолчанию */}
      </Section>

      {/* Форма редактирования */}
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

            {/* Кнопка сохранения */}
            {hasChanges && (
              <div className="sticky bottom-0 bg-white pt-4 border-t">
                <Button onClick={handleSaveChanges} className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  Сохранить изменения
                </Button>
              </div>
            )}

            {/* Отмена изменений */}
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

      {/* Диалог подтверждения */}
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
