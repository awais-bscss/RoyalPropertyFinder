export const themeColors = {
  royal: {
    100: "#caf0f8",
    200: "#ade8f4",
    300: "#90e0ef",
    400: "#48cae4",
    500: "#00b4d8",
    600: "#0096c7",
    700: "#0077b6",
    800: "#023e8a",
    900: "#03045e",
  },
  neutrals: {
    slate: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
      950: "#020617",
    },
  },
  semantic: {
    success: "#00b4d8", // Aligned with royal palette
    error: "#E11D48",
    warning: "#D97706",
    info: "#0284C7",
  },
} as const;

export type ThemeColors = typeof themeColors;
