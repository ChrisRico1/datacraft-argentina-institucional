import { afterEach, describe, expect, it, vi } from "vitest";
import { getIndecIndicator, IndecServiceError } from "./indec";

const originalToken = process.env.INDEC_API_TOKEN;

afterEach(() => {
  if (originalToken === undefined) {
    delete process.env.INDEC_API_TOKEN;
  } else {
    process.env.INDEC_API_TOKEN = originalToken;
  }
  vi.unstubAllGlobals();
});

describe("getIndecIndicator", () => {
  it("rejects indicators that are not in the allowlist", async () => {
    await expect(getIndecIndicator("unknown-table", {})).rejects.toMatchObject({
      name: "IndecServiceError",
      status: 404,
    });
  });

  it("does not call INDEC when the server token is missing", async () => {
    delete process.env.INDEC_API_TOKEN;

    await expect(getIndecIndicator("ipc", {})).rejects.toMatchObject({
      name: "IndecServiceError",
      status: 503,
    });
  });

  it("uses a fixed upstream endpoint, safe filters and server-side bearer auth", async () => {
    process.env.INDEC_API_TOKEN = "test-secret-token";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ periodo: "202601", valor: 1 }]), {
        status: 200,
        headers: { "Content-Range": "0-0/1" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await getIndecIndicator("ipc", { from: "2021", limit: "100" });
    const [requestUrl, requestOptions] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ];

    expect(requestUrl).toContain("https://api.indec.gob.ar/v1/ipc_nacional?");
    expect(requestUrl).toContain("periodo=gte.2021");
    expect(requestUrl).toContain("order=periodo.desc");
    expect(requestOptions.headers).toMatchObject({
      Authorization: "Bearer test-secret-token",
      Prefer: "count=exact",
    });
    expect(response.result.source).toBe("INDEC");
    expect(response.result.contentRange).toBe("0-0/1");
  });

  it("rejects page sizes above the INDEC limit", async () => {
    process.env.INDEC_API_TOKEN = "test-secret-token";

    await expect(getIndecIndicator("ipc", { limit: "1001" })).rejects.toMatchObject({
      status: 400,
    });
  });
});
