export const SkeletonBox = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`} />
);

export const SkeletonDashboard = () => (
  <div className="flex flex-col md:flex-row gap-6 md:items-stretch">

    {/* COLUMNA IZQUIERDA */}
    <div className="flex flex-col gap-4 w-full md:w-72 shrink-0">

      {/* Profile card skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-16 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-t-2xl" />
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-8 mb-4">
            <SkeletonBox className="w-16 h-16 rounded-2xl" />
            <SkeletonBox className="w-16 h-6 rounded-full" />
          </div>
          <SkeletonBox className="w-32 h-4 mb-1" />
          <SkeletonBox className="w-24 h-3 mb-4" />
          <div className="border-t border-gray-100 dark:border-gray-700 mb-4" />
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonBox className="w-7 h-7 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1">
                  <SkeletonBox className="w-16 h-2" />
                  <SkeletonBox className="w-28 h-3" />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 mt-4 mb-4" />
          <SkeletonBox className="w-full h-9 rounded-xl" />
        </div>
      </div>

      {/* Expediente skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">
        <SkeletonBox className="w-36 h-4 mb-4" />
        <div className="flex items-center gap-5">
          <SkeletonBox className="w-[90px] h-[90px] rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBox className="w-full h-2" />
            <div className="grid grid-cols-2 gap-1.5">
              {[1,2,3,4].map(i => <SkeletonBox key={i} className="h-10 rounded-lg" />)}
            </div>
          </div>
        </div>
      </div>

    </div>

    {/* COLUMNA DERECHA */}
    <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow" />

  </div>
);

export const SkeletonDocumentos = () => (
  <div className="grid md:grid-cols-3 gap-6">
    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
      {[1,2,3,4].map(i => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
          <div className="flex justify-between items-start mb-4">
            <SkeletonBox className="w-11 h-11 rounded-xl" />
            <SkeletonBox className="w-20 h-6 rounded-full" />
          </div>
          <SkeletonBox className="w-32 h-4 mb-1" />
          <SkeletonBox className="w-24 h-3 mb-4" />
          <SkeletonBox className="w-full h-9 rounded-xl" />
        </div>
      ))}
    </div>
    <div className="order-first md:order-last bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">
      <SkeletonBox className="w-36 h-4 mb-4" />
      <div className="flex items-center gap-5">
        <SkeletonBox className="w-[90px] h-[90px] rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBox className="w-full h-2" />
          <div className="grid grid-cols-2 gap-1.5">
            {[1,2,3,4].map(i => <SkeletonBox key={i} className="h-10 rounded-lg" />)}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonPerfil = () => (
  <div className="grid md:grid-cols-3 gap-6 items-start">

    {/* COLUMNA IZQUIERDA */}
    <div className="flex flex-col gap-6">
      {[1,2].map(i => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <SkeletonBox className="w-7 h-7 rounded-lg" />
            <SkeletonBox className="w-32 h-4" />
          </div>
          <div className="p-5 space-y-3">
            {[1,2,3,4].map(j => (
              <div key={j}>
                <SkeletonBox className="w-16 h-2 mb-1" />
                <SkeletonBox className="w-full h-10 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* COLUMNA DERECHA */}
    <div className="md:col-span-2 flex flex-col gap-6">
      {[1,2].map(i => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <SkeletonBox className="w-7 h-7 rounded-lg" />
            <SkeletonBox className="w-32 h-4" />
          </div>
          <div className="p-5 grid md:grid-cols-2 gap-4">
            {[1,2,3,4,5,6].map(j => (
              <div key={j}>
                <SkeletonBox className="w-16 h-2 mb-1" />
                <SkeletonBox className="w-full h-10 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

  </div>
);