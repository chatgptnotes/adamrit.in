import SurgicalPricingAdjuster from "@/components/SurgicalPricingAdjuster";

// Dummy adjustment options
const cghsAdjustmentOptions = [
  { value: "none", label: "No Adjustment", percentage: 0, type: "none" },
  { value: "ward10", label: "Less 10% Gen. Ward Charges as per CGHS", percentage: 10, type: "discount" },
  { value: "guideline50", label: "Less 50% as per CGHS Guideline", percentage: 50, type: "discount" },
  { value: "guideline25", label: "Less 25% as per CGHS Guideline", percentage: 25, type: "discount" },
  { value: "special15", label: "Add 15% Specialward Charges as per CGHS", percentage: 15, type: "addition" }
];

// Dummy pricing object
const dummyPricing = {
  baseAmount: 2698,
  primaryAdjustment: "ward10",
  secondaryAdjustment: "guideline50"
};

export default function SurgicalPricingAdjusterDemo() {
  // Dummy handler (no backend)
  const handleAdjustmentChange = (
    itemIdx: number,
    subIdx: number,
    type: string,
    value: string
  ) => {
    console.log("Adjustment changed:", { itemIdx, subIdx, type, value });
  };

  return (
    <div style={{ maxWidth: 320, margin: "2rem auto", border: "1px solid #eee", padding: 16 }}>
      <h3 className="font-bold mb-2">Surgical Pricing Adjuster Demo</h3>
      <SurgicalPricingAdjuster
        pricing={dummyPricing}
        cghsAdjustmentOptions={cghsAdjustmentOptions}
        onAdjustmentChange={handleAdjustmentChange}
        itemIdx={0}
        subIdx={0}
      />
    </div>
  );
} 