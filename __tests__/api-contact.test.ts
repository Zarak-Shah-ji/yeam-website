import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock resend before importing the route handler
const mockSend = vi.fn().mockResolvedValue({ data: { id: "mock-id" }, error: null });

vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = { send: mockSend };
    constructor(_key: string | undefined) {}
  },
}));

// Mock next/server to provide NextRequest/NextResponse in Node environment
vi.mock("next/server", async () => {
  const { NextResponse } = await import("next/server");
  return { NextRequest: Request, NextResponse };
});

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns JSON success when RESEND_API_KEY is missing (currently fails — bug reproduction)", async () => {
    // Simulate missing API key (the bug scenario)
    const originalKey = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;

    // Re-import so the module picks up the env change
    const { POST } = await import("../app/api/contact/route");

    const req = makeRequest({
      fullName: "Jane Smith",
      clinicName: "Riverside Clinic",
      email: "jane@clinic.com",
    });

    // This must not throw and must return valid JSON — before the fix it won't
    const res = await POST(req as never);
    const json = await res.json();

    expect(res.status).toBeLessThan(600);
    expect(json).toBeDefined();
    expect(typeof json).toBe("object");

    process.env.RESEND_API_KEY = originalKey;
  });

  it("returns 400 JSON when required fields are missing", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    const { POST } = await import("../app/api/contact/route");

    const req = makeRequest({ message: "hello" });
    const res = await POST(req as never);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("returns 200 JSON on valid submission", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    const { POST } = await import("../app/api/contact/route");

    const req = makeRequest({
      fullName: "Jane Smith",
      clinicName: "Riverside Clinic",
      email: "jane@clinic.com",
      claimVolume: "0-1,000",
      message: "Looking forward to the demo",
    });

    const res = await POST(req as never);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });
});
