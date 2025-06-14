import { useState } from "react";

export default function ImageAnalysis() {
  const [labels, setLabels] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result?.toString().split(",")[1];
      const response = await fetch("http://localhost:5000/api/ai/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await response.json();
      setLabels(data.labels.map((label: any) => label.Name));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <ul>
        {labels.map((label, i) => (
          <li key={i}>{label}</li>
        ))}
      </ul>
    </div>
  );
}