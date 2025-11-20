const primaryColors = [
  { name: 'Main', token: 'var(--color-primary-main)', hex: '#FF4093' },
  { name: 'Light', token: 'var(--color-primary-light)', hex: '#FDBCD9' },
  {
    name: 'Extra Light',
    token: 'var(--color-primary-extra-light)',
    hex: '#FFEEF6',
  },
  { name: 'Dark', token: 'var(--color-primary-dark)', hex: '#D8016F' },
]

const grayScale = [
  { name: 'Gray 900', hex: '#100F0F' },
  { name: 'Gray 800', hex: '#302F2F' },
  { name: 'Gray 700', hex: '#4E4D4D' },
  { name: 'Gray 600', hex: '#616060' },
  { name: 'Gray 500', hex: '#888787' },
  { name: 'Gray 400', hex: '#A9A8A8' },
  { name: 'Gray 300', hex: '#CECDCD' },
  { name: 'Gray 200', hex: '#E1E0E0' },
  { name: 'Gray 100', hex: '#EEEDED' },
  { name: 'Gray 50', hex: '#F8F7F7' },
]

const typography = [
  { name: 'Heading 1', className: 'heading-1', spec: 'bold / 24 / 140%' },
  { name: 'Heading 2', className: 'heading-2', spec: 'bold / 20 / 140%' },
  { name: 'Body 1', className: 'body-1', spec: 'medium / 16 / 140%' },
  { name: 'Body 2', className: 'body-2', spec: 'medium / 14 / 140%' },
  { name: 'Caption 1', className: 'caption-1', spec: 'medium / 12 / 140%' },
  { name: 'Caption 2', className: 'caption-2', spec: 'medium / 10 / 140%' },
  { name: 'Caption 3', className: 'caption-3', spec: 'extrabold / 10 / 140%' },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 text-gray-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6">
        <header className="flex flex-col gap-2">
          <p className="caption-1 text-gray-500">Design System</p>
          <h1 className="heading-1">Storix UI Kit</h1>
          <p className="body-1 text-gray-600">
            Tokens derived from the magenta palette, grayscale ramp, and iPhone
            16 grid specs.
          </p>
        </header>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="heading-2">Typography</h2>
            <p className="caption-2 text-gray-500">Line height 140%</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {typography.map((type) => (
              <div
                key={type.name}
                className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-6 shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="caption-2 text-gray-500">{type.name}</span>
                  <span className={type.className}>The quick brown fox</span>
                </div>
                <span className="caption-2 text-gray-500">{type.spec}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="heading-2">Color System</h2>
          <div className="space-y-4">
            <div>
              <p className="caption-1 text-gray-500">Primary / Magenta</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {primaryColors.map((color) => (
                  <div
                    key={color.name}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div
                      className="h-24 w-full rounded-xl"
                      style={{ backgroundColor: color.token }}
                    />
                    <div className="mt-3">
                      <p className="body-2">{color.name}</p>
                      <p className="caption-2 text-gray-500">{color.hex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="caption-1 text-gray-500">Gray Scale</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {grayScale.map((color) => (
                  <div
                    key={color.name}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div
                      className="h-20 w-full rounded-xl"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="mt-3">
                      <p className="body-2">{color.name}</p>
                      <p className="caption-2 text-gray-500">{color.hex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full h-full space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="heading-2">Grid System</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid">
              <div>
                <p className="caption-1 text-gray-500">Device</p>
                <p className="body-1">iPhone 16</p>
              </div>
              <div>
                <p className="caption-1 text-gray-500">Frame</p>
                <p className="body-1">393 x 852 · Margin 16px · Gutter 12px</p>
              </div>
            </div>
            <div className="">
              <p className="caption-1 text-gray-500">Preview</p>
              <div className=" ipone16-container rounded-2xl border-2 border-black bg-gray-50 p-4">
                wowow
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
