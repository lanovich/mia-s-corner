export const PlaceholderForm = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-row gap-2">
          <span className="bg-gray-200 rounded w-8 h-8 my-auto"></span>
          <span className="flex h-10 bg-gray-100 rounded flex-1 items-center">
            <p className="text-gray-500 text-md ml-4 -mt-1"></p>
          </span>
        </div>
      </div>
      {/* Секция цен */}
      <div className="space-y-4">
        <div className="h-5 w-24 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-100 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>

      {/* Секция параметров */}
      <div className="space-y-4">
        <div className="h-5 w-24 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-100 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-100 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>

      {/* Секция габаритов */}
      <div className="space-y-4">
        <div className="h-5 w-24 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-12 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Кнопка (неактивная) */}
      <div className="sticky bottom-0 pt-4 border-t">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};
