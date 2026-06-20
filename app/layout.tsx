import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'centripetal-router',
  description: 'Minimal stateless HTTP router service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
