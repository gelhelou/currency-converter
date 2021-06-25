import { capitalize, formatCurrencyLabel, formatMoney } from "./formatters";

describe("formatters", () => {
  describe("capitalize", () => {
    it("should capitalize the first letter of a word", () => {
      expect(capitalize("adyen")).toBe("Adyen");
    });

    it("should return empty string if input is not defined", () => {
      expect(capitalize(undefined)).toBe("");
    });
  });

  describe("formatCurrencyLabel", () => {
    it("should shorten the label if it is more than 20 characters", () => {
      expect(formatCurrencyLabel("Bosnia-Herzegovina Convertible Mark")).toBe(
        "Bosnia-Herzegovina C..."
      );
    });

    it("should return the same label if less than 20 characters", () => {
      expect(formatCurrencyLabel("US Dollar")).toBe("US Dollar");
    });
  });

  describe("formatMoney", () => {
    it("should format an amount string with the correct commas", () => {
      expect(formatMoney(10452.10205)).toBe("10,452.10");
    });
  });
});
