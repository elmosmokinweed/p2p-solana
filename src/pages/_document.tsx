import Document, { Html, Head, Main, NextScript } from 'next/document';

class CustomDocument extends Document {
  public render(): JSX.Element {
    const fonts = [
      {
        variations: [
          '/fonts/Gilroy-Regular.eot',
          '/fonts/Gilroy-Regular.ttf',
          '/fonts/Gilroy-Regular.woff',
        ],
      },
      {
        variations: [
          '/fonts/Gilroy-Medium.eot',
          '/fonts/Gilroy-Medium.ttf',
          '/fonts/Gilroy-Medium.woff',
        ],
      },
      {
        variations: [
          '/fonts/Gilroy-Bold.eot',
          '/fonts/Gilroy-Bold.ttf',
          '/fonts/Gilroy-Bold.woff',
        ],
      },
      {
        variations: [
          '/fonts/Gilroy-Extrabold.eot',
          '/fonts/Gilroy-Extrabold.ttf',
          '/fonts/Gilroy-Extrabold.woff',
        ],
      },
      {
        variations: [
          '/fonts/Gilroy-Black.eot',
          '/fonts/Gilroy-Black.ttf',
          '/fonts/Gilroy-Black.woff',
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
