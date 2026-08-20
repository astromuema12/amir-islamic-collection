import { describe, it, expect } from "vitest";
import {
  formatPrice,
  formatDate,
  formatDateTime,
  slugify,
  truncate,
  generateSKU,
  calculateDiscount,
  parseError,
  cn,
} from "@/lib/utils";

describe("formatPrice", () => {
  it("formats KES price correctly", () => {
    const result = formatPrice(2500);
    expect(result).toContain("2,500");
  });

  it("formats zero price", () => {
    const result = formatPrice(0);
    expect(result).toContain("0");
  });

  it("formats large prices", () => {
    const result = formatPrice(100000);
    expect(result).toContain("100,000");
  });
});

describe("formatDate", () => {
  it("formats a Date object", () => {
    const date = new Date("2025-06-15");
    const result = formatDate(date);
    expect(result).toContain("June");
    expect(result).toContain("15");
    expect(result).toContain("2025");
  });

  it("formats a date string", () => {
    const result = formatDate("2025-01-01");
    expect(result).toContain("January");
    expect(result).toContain("1");
  });
});

describe("formatDateTime", () => {
  it("formats date with time", () => {
    const result = formatDateTime(new Date("2025-06-15T14:30:00"));
    expect(result).toContain("June");
    expect(result).toContain("15");
  });
});

describe("slugify", () => {
  it("converts text to slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("handles special characters", () => {
    expect(slugify("Prayer Mat & Tasbih!")).toBe("prayer-mat-tasbih");
  });

  it("handles multiple spaces", () => {
    expect(slugify("  Hello   World  ")).toBe("hello-world");
  });

  it("handles underscores and hyphens", () => {
    expect(slugify("hello_world-foo")).toBe("hello-world-foo");
  });
});

describe("truncate", () => {
  it("returns original string if shorter than limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates long strings", () => {
    expect(truncate("hello world", 5)).toBe("hello...");
  });

  it("handles exact length", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });
});

describe("generateSKU", () => {
  it("generates SKU from category and id", () => {
    const sku = generateSKU("prayer-mats", "abc123");
    expect(sku).toBe("PRA-ABC123");
  });
});

describe("calculateDiscount", () => {
  it("calculates 20% discount", () => {
    expect(calculateDiscount(1000, 800)).toBe(20);
  });

  it("calculates 50% discount", () => {
    expect(calculateDiscount(2000, 1000)).toBe(50);
  });

  it("rounds to nearest integer", () => {
    expect(calculateDiscount(1000, 666)).toBe(33);
  });
});

describe("parseError", () => {
  it("parses Error instances", () => {
    expect(parseError(new Error("test error"))).toBe("test error");
  });

  it("parses string errors", () => {
    expect(parseError("string error")).toBe("string error");
  });

  it("returns default for unknown types", () => {
    expect(parseError(null)).toBe("An unexpected error occurred");
    expect(parseError(undefined)).toBe("An unexpected error occurred");
    expect(parseError(42)).toBe("An unexpected error occurred");
  });
});

describe("cn", () => {
  it("merges class names", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "extra");
    expect(result).toContain("base");
    expect(result).toContain("extra");
    expect(result).not.toContain("hidden");
  });
});
