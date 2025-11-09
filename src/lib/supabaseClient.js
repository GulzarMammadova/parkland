// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

/**
 * Решает проблему "Multiple GoTrueClient instances":
 * - один-единственный клиент хранится на globalThis.__PL_SUPABASE
 * - уникальный storageKey, чтобы не пересекаться с другими проектами/вкладками
 * - корректная работа с Vite HMR (dev)
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  // eslint-disable-next-line no-console
  console.error(
    "[supabase] Missing env vars: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY"
  );
}

function createSingletonClient() {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      // уникальный ключ для хранения токенов именно этого приложения
      storageKey: "parkland-auth",
      // если у тебя SSR нет, можно оставить по умолчанию
      // autoRefreshToken: true,
      // persistSession: true,
      // detectSessionInUrl: true,
    },
    // глобальные настройки fetch при желании
  });
}

// — синглтон через глобальный объект (переживает HMR)
const g = globalThis;
if (!g.__PL_SUPABASE__) {
  g.__PL_SUPABASE__ = createSingletonClient();
}

// При обновлении модулей в dev перезапускать клиент не нужно
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    // ничего не делаем — сохраняем один и тот же инстанс
  });
  // если нужно сбрасывать именно при замене модуля:
  // import.meta.hot.dispose(() => { delete globalThis.__PL_SUPABASE__; });
}

export const supabase = g.__PL_SUPABASE__;
