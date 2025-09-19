"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/shared/lib";
import { MapWithPickupPoints } from "@/entities/yandexDelivery/ui";
import {
  geocodeCity,
  getPostalDeliveryPrice,
} from "@/entities/yandexDelivery/api";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/shared/shadcn-ui/command";
import { FormInput, LoadingIndicator } from "@/shared/ui";
import { useClickOutside } from "@/features/product-search/lib";
import { useDeliveryStore } from "@/entities/yandexDelivery/model";
import { Button } from "@/shared/shadcn-ui";
import { toast } from "sonner";
import {
  findPickupMatch,
  hasAddressMatch,
  normalizeAddress,
  normalizeHouse,
  validateSelectedPoint,
} from "@/entities/yandexDelivery/lib";

interface GeoPoint {
  geo_id: number;
  address: string;
}

interface Props {
  className?: string;
}

export const PostalDelivery: React.FC<Props> = ({ className }) => {
  const { watch, setValue } = useFormContext();
  const [options, setOptions] = useState<GeoPoint[]>([]);
  const [selectedGeo, setSelectedGeo] = useState<GeoPoint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { setOpenSubmit, pickupPoints, selectedPoint, setSelectedPoint } =
    useDeliveryStore();

  const cityInput = watch("city");
  const street = watch("street");
  const building = watch("building");

  useEffect(() => {
    if (!cityInput || !street || !building) {
      setOpenSubmit(false);
      return;
    }

    if (selectedPoint) {
      if (validateSelectedPoint(selectedPoint, cityInput, street, building)) {
        setOpenSubmit(true);
        return;
      } else {
        setSelectedPoint(null);
        setOpenSubmit(false);
        return;
      }
    }

    const match = findPickupMatch(pickupPoints, cityInput, street, building);

    if (match) {
      setSelectedPoint(match);
      setOpenSubmit(true);
    } else {
      setOpenSubmit(false);
    }
  }, [cityInput, street, building, pickupPoints, selectedPoint]);

  useClickOutside(dropdownRef, () => setOpen(false));

  useEffect(() => {
    if (!cityInput) {
      setOptions([]);
      setSelectedGeo(null);
      setError(null);
      setOpen(false);
      return;
    }

    if (selectedGeo && cityInput === selectedGeo.address) {
      return;
    }

    const handler = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await geocodeCity(cityInput);

        if (!result || !result.points) {
          setError("Ошибка при запросе. Попробуйте позже или измените ввод.");
          setOptions([]);
          setOpen(false);
          return;
        }

        const unique = Array.from(
          new Map(result.points.map((p) => [p.geo_id, p])).values()
        ).slice(0, 5);

        setOptions(unique);
        setOpen(unique.length > 0);

        if (unique.length === 1 && unique[0].address === cityInput) {
          setSelectedGeo(unique[0]);
          setOpen(false);
        }
      } catch (e) {
        setError("Не удалось загрузить список городов. Попробуйте позже.");
        setOptions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [cityInput]);

  const handleSelect = (geo: GeoPoint) => {
    setSelectedGeo(geo);
    setValue("city", geo.address);
    setOptions([]);
    setOpen(false);
    if (!geo.geo_id) return;
  };

  return (
    <div className={cn("mb-4", className)}>
      <h2 className="text-lg font-semibold pb-3">Адрес пункта выдачи</h2>
      <div className="space-y-2 relative">
        <FormInput
          placeholder="Наслённый пункт"
          name="city"
          autoComplete="none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && options.length > 0) {
              e.preventDefault();
              handleSelect(options[0]);
            }
          }}
        />

        <p className="text-xs text-gray-700 mt-1 ml-2">
          Укажите город, и мы отобразим пункты выдачи Яндекс Маркет
        </p>

        {error && <p className="text-xs text-red-600 mt-1 ml-2">{error}</p>}

        {open && (
          <Command className="absolute z-10 mt-1 max-h-30 h-fit w-full rounded-lg bg-black text-white shadow-md">
            <CommandList>
              {loading && (
                <div className="flex items-center justify-center py-16">
                  <LoadingIndicator isLoading={loading} />
                </div>
              )}

              {!loading && options.length > 0 && (
                <CommandGroup className="bg-black">
                  {options.map((geo) => (
                    <CommandItem className="bg-black text-white rounded-sm"
                      key={geo.geo_id + geo.address}
                      value={geo.address}
                      onSelect={() => handleSelect(geo)}
                    >
                      {geo.address}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        )}

        {selectedGeo && <MapWithPickupPoints geoId={selectedGeo?.geo_id} />}

        <FormInput placeholder="Улица" name="street" />

        <FormInput placeholder="Дом" name="building" />
      </div>
    </div>
  );
};
