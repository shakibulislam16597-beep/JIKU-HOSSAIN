import React from 'react';

/**
 * SkeletonCard Component - Loading state placeholder for product card
 */
export default function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 flex flex-col justify-between shadow-xs animate-pulse">
      <div className="w-full aspect-square rounded-xl bg-gray-200 mb-3" />
      <div className="space-y-2 flex flex-col items-center">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mt-1" />
        <div className="h-8 bg-gray-200 rounded-xl w-full mt-2" />
      </div>
    </div>
  );
}
