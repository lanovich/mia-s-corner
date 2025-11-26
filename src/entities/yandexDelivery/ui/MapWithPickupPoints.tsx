"use client";
import React, { useEffect, useRef, useState } from "react";
import { initYMap } from "../lib";
import { getPickupPoints } from "../api";
import { PickupPoint, useDeliveryStore } from "../model";
import { useFormContext } from "react-hook-form";
import { LoadingIndicator } from "@/shared/ui";
import { toast } from "sonner";

interface Props {
  geoId?: number;
}

export const MapWithPickupPoints: React.FC<Props> = ({ geoId }) => {
  const { setValue, clearErrors } = useFormContext();
  const { watch } = useFormContext();
  const city = watch("city");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const {
    setPickupPoints,
    clearPickupPoints,
    pickupPoints,
    setOpenSubmit,
    selectedPoint,
    setSelectedPoint,
  } = useDeliveryStore();

  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);

  const cacheRef = useRef<Record<number, PickupPoint[]>>({});

  const fetchedRef = useRef<Record<number, boolean>>({});

  useEffect(() => {
    if (!geoId) {
      clearPickupPoints();
      return;
    }

    if (cacheRef.current[geoId]) {
      const cached = cacheRef.current[geoId];
      setPickupPoints(cached);
      setPickupPoints(cached);
      setEmpty(cached.length === 0);
      return;
    }

    if (fetchedRef.current[geoId]) return;

    const fetchPoints = async () => {
      setLoading(true);
      setEmpty(false);
      fetchedRef.current[geoId] = true;
      try {
        const points = await getPickupPoints(geoId) || [];
        cacheRef.current[geoId] = points;
        setPickupPoints(points);
        setPickupPoints(points);
        setEmpty(!points || points.length === 0);
      } catch {
        setEmpty(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [geoId]);

  const handleSelect = (point: PickupPoint) => {
    setSelectedPoint(point);
    setValue("street", point.address?.street || "", { shouldValidate: true });
    clearErrors("street");
    setValue("building", point.address?.house || "", { shouldValidate: true });
    clearErrors("building");

    setOpenSubmit(true);
    toast.success("Пункт выдачи выбран ✅", { position: "top-center" });
  };

  useEffect(() => {
    if (!mapRef.current || pickupPoints.length === 0) return;

    initYMap(
      mapRef.current,
      pickupPoints,
      handleSelect,
      mapInstance,
      selectedPoint?.id
    );
  }, [pickupPoints, selectedPoint]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "400px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
      ref={mapRef}
    >
      {(loading || empty || !city) && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255,255,255,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
            padding: "16px",
          }}
        >
          {loading && <LoadingIndicator isLoading />}
          {empty && !loading && city && (
            <p style={{ color: "#333", fontSize: "14px" }}>
              К сожалению, в этом городе нет пунктов выдачи Яндекс Маркет :(
            </p>
          )}
        </div>
      )}
    </div>
  );
};
