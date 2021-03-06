type StorageKey = "store.jwt" | "store.refresh";
interface AuthSession {
  jwt?: string;
  refresh?: string;
}

interface TokenStorage {
  getItem: (key: StorageKey) => string | null;
  setItem: (key: StorageKey, value: string) => void;
  removeItem: (key: StorageKey) => void;
}

interface TokenStorageMap {
  session: TokenStorage;
}

const tryOrNull = <T>(f: () => T) => {
  try {
    return f();
  } catch {
    return null;
  }
};

// Si el dia de mañana queremos mover como vmaos a alojar el JWT
// Entonces unicamente deberiamos crear otra variable aca
// En realidad, solo usar un [key: string]: TokenStorage y listo
const STORAGE: TokenStorageMap = {
  session: {
    getItem: (k) => tryOrNull(() => sessionStorage.getItem(k)),
    setItem: (k, v) => tryOrNull(() => sessionStorage.setItem(k, v)),
    removeItem: (k) => tryOrNull(() => sessionStorage.removeItem(k)),
  },
};

export const getSession = (): AuthSession | false => {
  const { getItem } = getTokenStorage();
  const jwt = getItem("store.jwt");
  const refresh = getItem("store.refresh");
  if (!jwt || !refresh) {
    return false;
  }

  return { jwt, refresh };
};

const getTokenStorage = () => {
  return STORAGE.session;
};

export const setSession = ({ jwt, refresh }: AuthSession): boolean => {
  const current = getSession();
  if (current && current.jwt === jwt && current.refresh === refresh) {
    return false;
  }

  const storage = getTokenStorage();
  if (!storage) {
    return false;
  }

  const { setItem } = storage;
  setItem("store.jwt", jwt || "");
  setItem("store.refresh", refresh || "");
  return true;
};

export const removeSession = () => {
  const storage = getTokenStorage();
  if (!storage) {
    return;
  }

  const { removeItem } = storage;

  removeItem("store.jwt");
  removeItem("store.refresh");
};
