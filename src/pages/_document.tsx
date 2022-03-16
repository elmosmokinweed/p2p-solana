import Document, { Html, Head, Main, NextScript } from 'next/document';

class CustomDocument extends Document {
  public render(): JSX.Element {
    const fonts = [
      {
        variations: [
          '/fonts/Oxanium-Regular.eot',
          '/fonts/Oxanium-Regular.ttf',
          '/fonts/Oxanium-Regular.woff',
        ],
      },
      {
        variations: [
          '/fonts/Oxanium-Medium.eot',
          '/fonts/Oxanium-Medium.ttf',
          '/fonts/Oxanium-Medium.woff',
        ],
      },
      {
        variations: [
          '/fonts/Oxanium-Bold.eot',
          '/fonts/Oxanium-Bold.ttf',
          '/fonts/Oxanium-Bold.woff',
        ],
      },
      {
        variations: [
          '/fonts/Oxanium-ExtraBold.eot',
          '/fonts/Oxanium-ExtraBold.ttf',
          '/fonts/Oxanium-ExtraBold.woff',
        ],
      },
      {
        variations: [
          '/fonts/Oxanium-SemiBold.eot',
          '/fonts/Oxanium-SemiBold.ttf',
          '/fonts/Oxanium-SemiBold.woff',
        ],
      },
    ];

    return (
      <Html>
        <Head>
          {fonts.map(({ variations }) =>
            variations.map((url) => (
              <link
                key={url}
                rel="preload"
                href={url}
                as="font"
                crossOrigin=""
              />
            ))
          )}
          <link rel="icon" type="image/ico" href="/Favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
