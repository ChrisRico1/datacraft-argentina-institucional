import { afterEach, describe, expect, it, vi } from "vitest";
import { radarDimensionFilters } from "./filterConfig";
import { getIndecIndicator } from "./server/indec";

const originalToken = process.env["INDEC_API_TOKEN"];

afterEach(() => {
  if (originalToken === undefined) {
    delete process.env["INDEC_API_TOKEN"];
  } else {
    process.env["INDEC_API_TOKEN"] = originalToken;
  }
  vi.unstubAllGlobals();
});

describe("radarDimensionFilters", () => {
  it.each(Object.entries(radarDimensionFilters))(
    "keeps every visible %s dimension accepted by the server allowlist",
    async (indicatorId, filters) => {
      process.env["INDEC_API_TOKEN"] = "test-secret-token";
      const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(new Response("[]", { status: 200 })));
      vi.stubGlobal("fetch", fetchMock);

      for (const filter of filters) {
        await expect(
          getIndecIndicator(indicatorId, {
            dimensions: JSON.stringify({ [filter.field]: "valor-de-prueba" }),
          }),
        ).resolves.toMatchObject({
          result: { indicator: indicatorId, data: [] },
          status: 200,
        });
      }

      expect(fetchMock).toHaveBeenCalledTimes(filters.length);
    },
  );

  it.each(Object.entries(radarDimensionFilters))(
    "references existing parent dimensions in %s dependencies",
    (indicatorId, filters) => {
      const fields = new Set(filters.map((filter) => filter.field));

      for (const filter of filters) {
        if (filter.dependsOn) {
          expect(fields.has(filter.dependsOn), `${indicatorId}.${filter.field} depends on missing ${filter.dependsOn}`).toBe(true);
          expect(filter.dependsOn).not.toBe(filter.field);
        }
      }
    },
  );

  it.each(Object.entries(radarDimensionFilters))(
    "does not declare duplicate visible fields for %s",
    (indicatorId, filters) => {
      const fields = filters.map((filter) => filter.field);
      expect(new Set(fields).size, indicatorId).toBe(fields.length);
    },
  );
});
