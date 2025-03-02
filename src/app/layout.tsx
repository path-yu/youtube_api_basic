"use client";
import "./globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SnackbarComponent from "@/componets/SnackbarComponent";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />
      </head>

      <meta name="viewport" />
      <body>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <main>{children}</main>
          <SnackbarComponent /> {/* 全局添加 Snackbar */}
        </ThemeProvider>
      </body>
    </html>
  );
}
