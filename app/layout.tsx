'use client'
import "./globals.css";
import { Provider } from "react-redux";
import {store} from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import NavbarBoth from "./components/NavbarBoth";
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// Create a QueryClient instance
const queryClient = new QueryClient();



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

useAuthRedirect();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <html lang="en">
          {/* <SessionRefresher> */}
          <body
          // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <NavbarBoth />
            {/* <EmailWindow /> */}
            {children}
            <Toaster richColors position="bottom-center" />
          </body>
          {/* </SessionRefresher> */}
        </html>
      </QueryClientProvider>
    </Provider>
  );
}
