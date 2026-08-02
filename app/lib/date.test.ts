import { describe, expect, it } from "vitest";
import { formatDate } from "~/lib/date";

describe("formatDate", () => {
  it("formats ISO dates consistently in en-GB UTC", () => {
    expect(formatDate("2026-01-15")).toBe("15 Jan 2026");
  });
});
