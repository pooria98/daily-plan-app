import { createTheme } from "@mantine/core";
import { geistSans, geistMono } from "./fonts/fonts";

export const theme = createTheme({
  fontFamily: geistSans.style.fontFamily,
  fontFamilyMonospace: geistMono.style.fontFamily,
});
