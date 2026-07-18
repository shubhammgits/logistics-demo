"use client";

import dynamic from 'next/dynamic';

const GlobalCanvas = dynamic(() => import('@/components/GlobalCanvas'), { ssr: false });

export default function GlobalCanvasLoader() {
  return <GlobalCanvas />;
}
