// No-op stand-in for `server-only` under vitest (jsdom looks like the client to
// the real package, which throws on import). Build-time guarding is untouched.
export {}
