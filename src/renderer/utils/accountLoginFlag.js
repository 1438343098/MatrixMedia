const PREFIX = "accountLogin:";

export function setAccountLoginFlag(flagName, expiresAtMs) {
  if (!flagName) return;
  const exp = expiresAtMs || Date.now() + 10 * 365 * 864e5;
  localStorage.setItem(PREFIX + flagName, JSON.stringify({ ok: true, exp }));
}

export function clearAccountLoginFlag(flagName) {
  if (!flagName) return;
  localStorage.removeItem(PREFIX + flagName);
}

export function isAccountLoginFlagSet(flagName) {
  if (!flagName) return false;
  try {
    const raw = localStorage.getItem(PREFIX + flagName);
    if (!raw) return false;
    const { ok, exp } = JSON.parse(raw);
    if (!ok) return false;
    if (exp && Date.now() > exp) {
      localStorage.removeItem(PREFIX + flagName);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
