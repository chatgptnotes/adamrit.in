import React, { useState } from "react";

/**
 * Props for SurgicalPricingAdjuster
 * @typedef {Object} SurgicalPricingAdjusterProps
 * @property {object} pricing - The pricing object (dummy data)
 * @property {Array} cghsAdjustmentOptions - Array of adjustment options (dummy data)
 * @property {function} onAdjustmentChange - Callback for dropdown changes (dummy for now)
 * @property {number} itemIdx - Index for the surgical item (dummy)
 * @property {number} subIdx - Index for the sub-item (dummy)
 */

/**
 * SurgicalPricingAdjuster component
 * Encapsulates the pricing adjustment UI for a surgical sub-item using dummy data/state.
 * No backend/database interaction. All calculations are local.
 */
export default function SurgicalPricingAdjuster({
  pricing,
  cghsAdjustmentOptions,
  onAdjustmentChange,
  itemIdx,
  subIdx
}: any) {
  // Local state for adjustments
  const [primary, setPrimary] = useState(pricing.primaryAdjustment || "none");
  const [secondary, setSecondary] = useState(pricing.secondaryAdjustment || "none");
  const [baseAmount] = useState(pricing.baseAmount || 0);

  // Calculate discounts/additions and final amount
  let discountAmount = 0;
  let additionAmount = 0;
  let subDiscountAmount = 0;
  let finalAmount = baseAmount;

  const primaryOption = cghsAdjustmentOptions.find((opt: any) => opt.value === primary);
  if (primaryOption) {
    if (primaryOption.type === "discount") {
      discountAmount = Math.round(baseAmount * primaryOption.percentage / 100);
      finalAmount = baseAmount - discountAmount;
    } else if (primaryOption.type === "addition") {
      additionAmount = Math.round(baseAmount * primaryOption.percentage / 100);
      finalAmount = baseAmount + additionAmount;
    }
  }

  const secondaryOption = cghsAdjustmentOptions.find((opt: any) => opt.value === secondary);
  if (secondaryOption && secondaryOption.type === "discount" && primary !== "none") {
    subDiscountAmount = Math.round(finalAmount * secondaryOption.percentage / 100);
    finalAmount = finalAmount - subDiscountAmount;
  }

  // Handlers
  const handlePrimaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrimary(e.target.value);
    setSecondary("none"); // Reset secondary on primary change
    if (onAdjustmentChange) onAdjustmentChange(itemIdx, subIdx, "primary", e.target.value);
  };
  const handleSecondaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSecondary(e.target.value);
    if (onAdjustmentChange) onAdjustmentChange(itemIdx, subIdx, "secondary", e.target.value);
  };

  return (
    <div className="surgery-pricing" style={{ marginTop: 4 }}>
      <div>Base Amount: {baseAmount}</div>
      {/* Primary Adjustment Dropdown */}
      <div style={{ marginTop: 2 }}>
        <select
          value={primary}
          onChange={handlePrimaryChange}
          className="text-xs border rounded px-1 py-0.5 w-full"
          style={{ fontSize: "10px" }}
        >
          {cghsAdjustmentOptions.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {discountAmount > 0 && (
          <div style={{ fontSize: "10px", color: "#dc2626" }}>-{discountAmount}</div>
        )}
        {additionAmount > 0 && (
          <div style={{ fontSize: "10px", color: "#059669" }}>+{additionAmount}</div>
        )}
      </div>
      {/* Secondary Adjustment Dropdown */}
      {primary !== "none" && (
        <div style={{ marginTop: 2 }}>
          <select
            value={secondary}
            onChange={handleSecondaryChange}
            className="text-xs border rounded px-1 py-0.5 w-full"
            style={{ fontSize: "10px" }}
          >
            <option value="none">No Additional Adjustment</option>
            {cghsAdjustmentOptions.filter((opt: any) => opt.type === "discount").map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {subDiscountAmount > 0 && (
            <div style={{ fontSize: "10px", color: "#dc2626" }}>-{subDiscountAmount}</div>
          )}
        </div>
      )}
      <div style={{ fontWeight: "bold", marginTop: 2 }}>Final Amount: {finalAmount}</div>
    </div>
  );
} 