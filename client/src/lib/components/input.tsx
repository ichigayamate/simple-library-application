import { InputHTMLAttributes } from "react";
import { Control, FieldValues, Path, PathValue, useController } from "react-hook-form";

interface InputProps<T extends FieldValues = FieldValues> extends Omit<InputHTMLAttributes<HTMLInputElement>, "defaultValue"> {
  name: Path<T>
  control: Control<T>
  noBorder?: boolean
  defaultValue?: PathValue<T, Path<T>>;
}

export default function Input<T extends FieldValues = FieldValues>({
  name,
  control,
  required,
  noBorder,
  defaultValue,
  ...props
}: Readonly<InputProps<T>>) {
  const { field } = useController({
    name,
    control,
    rules: { required },
    defaultValue: defaultValue,
  });

  return (
    <input
      {...field}
      className={`input w-full ${!noBorder ? "input-bordered" : ""} ${props.className ?? ""}`}
      required={required}
      {...props}
      value={field.value ?? ""}
    />
  );
}