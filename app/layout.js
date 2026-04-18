import "./globals.css";

export const metadata = {
  title: "Mr. Makedon's Book Reviews",
  description: "A Firebase-powered private review desk for Mr. Makedon's favorite books.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

