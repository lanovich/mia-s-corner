import { SizeDetails } from "@/entities/product/model";
import { InputField } from "../ui";
interface DimensionInputsProps {
  dimensions: SizeDetails["dimensions"];
  onChange: (dimensions: SizeDetails["dimensions"]) => void;
  isChanged?: boolean;
}

export const DimensionInputs: React.FC<DimensionInputsProps> = ({
  dimensions,
  onChange,
  isChanged = false,
}) => (
  <div className="grid grid-cols-3 gap-4">
    <InputField
      label="Ширина (X)"
      value={dimensions?.x?.toString() || null}
      onChange={(value) => onChange({ ...dimensions, x: Number(value) })}
      placeholder="мм"
      unit="мм"
      isChanged={isChanged}
    />
    <InputField
      label="Длина (Y)"
      value={dimensions?.y?.toString() || null}
      onChange={(value) => onChange({ ...dimensions, y: Number(value) })}
      placeholder="мм"
      unit="мм"
      isChanged={isChanged}
    />
    <InputField
      label="Высота (Z)"
      value={dimensions?.z?.toString() || null}
      onChange={(value) => onChange({ ...dimensions, z: Number(value) })}
      placeholder="мм"
      unit="мм"
      isChanged={isChanged}
    />
  </div>
);
