import type { Metadata } from "next";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import Client from "./client";

import { ClerkProvider, SignedOut, SignInButton } from "@clerk/nextjs";


export const metadata: Metadata = {
  title: "Habitat for Humanity SLO",
  description: "Web site created using nextjs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#000000" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body>
          <Client>{children}</Client>
        </body>
      </html>
    </ClerkProvider>
  );
}
