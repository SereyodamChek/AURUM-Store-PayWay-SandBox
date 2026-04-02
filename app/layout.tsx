export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Add the Flaticon UIcons CDN here */}
        <link 
          rel='stylesheet' 
          href='https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-rounded/css/uicons-solid-rounded.css' 
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
