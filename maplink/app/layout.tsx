export const metadata = { title: "MapLink Finder" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{fontFamily:"system-ui", padding: "1rem"}}>{children}</body>
    </html>
  );
}
