"use client";
import React, { useEffect, useRef, useState } from "react";
import { initYMap } from "../lib";
import { getPickupPoints } from "../api";
import { PickupPoint } from "../model";
import { useFormContext } from "react-hook-form";
import { LoadingIndicator } from "@/shared/ui";

interface Props {
  geoId?: number;
}

export const MapWithPickupPoints: React.FC<Props> = ({ geoId }) => {
  const { setValue } = useFormContext();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);

  const cacheRef = useRef<Record<number, PickupPoint[]>>({});

  const fetchedRef = useRef<Record<number, boolean>>({});

  useEffect(() => {
    if (!geoId) return;
    if (cacheRef.current[geoId]) {
      setPickupPoints(cacheRef.current[geoId]);
      setEmpty(cacheRef.current[geoId].length === 0);
      return;
    }
    if (fetchedRef.current[geoId]) return;

    const fetchPoints = async () => {
      setLoading(true);
      setEmpty(false);
      fetchedRef.current[geoId] = true;
      try {
        const points = await getPickupPoints(geoId);
        cacheRef.current[geoId] = points;
        setPickupPoints(points);
        if (!points || points.length === 0) setEmpty(true);
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
    setValue("street", point.address?.street || "");
    setValue("building", point.address?.house || "");
  };

  useEffect(() => {
    if (!mapRef.current || pickupPoints.length === 0) return;
    initYMap(
      mapRef.current,
      pickupPoints,
      handleSelect,
      mapInstance,
      selectedPoint?.id,
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
      {(loading || empty) && (
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
            zIndex: 10,
            flexDirection: "column",
            textAlign: "center",
            padding: "16px",
          }}
        >
          {loading && <LoadingIndicator isLoading />}
          {empty && !loading && (
            <p style={{ color: "#333", fontSize: "14px" }}>
              К сожалению, в этом городе нет пунктов выдачи Яндекс Маркет :(
            </p>
          )}
        </div>
      )}
    </div>
  );
};
