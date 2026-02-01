"use client";

export default function ProgressBar({ learned, total, label }) {
  const percentage = total > 0 ? Math.round((learned / total) * 100) : 0;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-700">{label}</span>
          <span className="text-gray-500">
            {learned}/{total} ({percentage}%)
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
