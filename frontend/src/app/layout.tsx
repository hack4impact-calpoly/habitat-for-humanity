import type { Metadata } from "next";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import Client from "./client";

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
    <html lang="en">
      <head>
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <Client>{children}</Client>
      </body>
    </html>
  );
}
