import { getEcho, disconnectEcho } from "../utils/echo";

describe("Echo configuration with REVERB environment variables", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    disconnectEcho();
    sessionStorage.clear();
  });

  afterAll(() => {
    process.env = originalEnv;
    disconnectEcho();
    sessionStorage.clear();
  });

  test("returns null when no session token exists", () => {
    const echo = getEcho();
    expect(echo).toBeNull();
  });

  test("initializes Echo reading REVERB_* env variables without REACT_APP_ prefix", () => {
    sessionStorage.setItem("token", "dummy-jwt-token");
    process.env.REVERB_APP_KEY = "my_reverb_key_custom";
    process.env.REVERB_HOST = "reverb.garage.com";
    process.env.REVERB_PORT = "8090";
    process.env.REVERB_SCHEME = "https";

    const echo = getEcho();
    expect(echo).not.toBeNull();
    expect(echo.options.key).toBe("my_reverb_key_custom");
    expect(echo.options.wsHost).toBe("reverb.garage.com");
    expect(echo.options.wsPort).toBe(8090);
    expect(echo.options.forceTLS).toBe(true);
  });

  test("falls back to REACT_APP_REVERB_* if REVERB_* without prefix is not provided", () => {
    sessionStorage.setItem("token", "dummy-jwt-token");
    delete process.env.REVERB_APP_KEY;
    delete process.env.REVERB_HOST;
    delete process.env.REVERB_PORT;
    delete process.env.REVERB_SCHEME;

    process.env.REACT_APP_REVERB_APP_KEY = "fallback_key_cra";
    process.env.REACT_APP_REVERB_HOST = "fallback.host";
    process.env.REACT_APP_REVERB_PORT = "8080";
    process.env.REACT_APP_REVERB_SCHEME = "http";

    const echo = getEcho();
    expect(echo).not.toBeNull();
    expect(echo.options.key).toBe("fallback_key_cra");
    expect(echo.options.wsHost).toBe("fallback.host");
    expect(echo.options.wsPort).toBe(8080);
    expect(echo.options.forceTLS).toBe(false);
  });
});
