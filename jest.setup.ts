import "whatwg-fetch";

// next-auth を完全モック
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// lib/auth もモック
jest.mock("@/lib/auth", () => ({
  getUser: jest.fn(),
  signIn: jest.fn(),
}));

import "whatwg-fetch";

// NextResponse.json を完全にモック
jest.mock("next/server", () => {
  const actual = jest.requireActual("next/server");

  return {
    ...actual,
    NextResponse: {
      json: (data: any, init?: any) =>
        new Response(JSON.stringify(data), {
          status: init?.status ?? 200,
          headers: { "Content-Type": "application/json" },
        }),
    },
  };
});
