/**
 * Loading.
 * The sheet is being pulled. Skeleton blocks match the real layout's shape
 * rather than a generic spinner, so the arrival of content is an exchange of
 * one shape for another and nothing shifts.
 */
export default function Loading() {
  return (
    <main
      className="relative flex min-h-[100dvh] flex-col"
      style={{ paddingTop: "calc(var(--chrome) + var(--step-4))" }}
      aria-busy="true"
    >
      <div className="shell flex-1">
        <div className="grid gap-x-8 gap-y-10 lg:grid-cols-12">
          {/* Two display lines, standing in for the name */}
          <div className="lg:col-span-8">
            <div
              className="skeleton h-[0.86em] w-[78%]"
              style={{ fontSize: "clamp(2.5rem, 6.6vw, 6.25rem)" }}
            />
            <div
              className="skeleton mt-3 h-[0.86em] w-[54%]"
              style={{ fontSize: "clamp(2.5rem, 6.6vw, 6.25rem)" }}
            />
            <div className="skeleton mt-12 h-4 w-[42ch] max-w-full" />
            <div className="skeleton mt-3 h-4 w-[36ch] max-w-full" />
          </div>
          {/* Portrait counterweight */}
          <div className="lg:col-span-3 lg:col-start-10">
            <div
              className="skeleton w-full max-w-[300px]"
              style={{ aspectRatio: "3 / 4" }}
            />
          </div>
        </div>
      </div>

      <div className="shell" style={{ paddingBottom: "var(--step-2)" }}>
        <div
          className="h-px w-full"
          style={{ background: "var(--rule-strong)", marginBottom: "var(--step-1)" }}
        />
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <div className="skeleton h-7 w-[5ch]" />
              <div className="skeleton mt-3 h-3 w-[16ch]" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
