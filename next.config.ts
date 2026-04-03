import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  // @ts-ignore: turbopack has been elevated to top level in recent next config
  turbopack: {
    // 显式锁定 turbopack 工作区根目录，防止其错误向父级目录寻根导致 SSR 路径 undefined
    root: process.cwd(),
  },
};

export default nextConfig;
