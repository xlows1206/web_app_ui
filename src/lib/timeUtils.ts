
/**
 * 将时间戳转换为相对于当前时间的描述 (例如："5 分钟前", "2 小时前")
 * @param timestamp 毫秒级时间戳
 * @param t 翻译对象，从 useLanguage() 或类似上下文获取
 * @returns 相对时间字符串
 */
export function formatTimeAgo(timestamp: number, t?: any): string {
  if (!timestamp) return t?.timeAgo?.justNow || "Just now";
  
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) {
    return t?.timeAgo?.justNow || "Just now";
  } else if (minutes < 60) {
    return `${minutes}${t?.timeAgo?.minutes || "m"} ${t?.timeAgo?.ago || "ago"}`;
  } else if (hours < 24) {
    return `${hours}${t?.timeAgo?.hours || "h"} ${t?.timeAgo?.ago || "ago"}`;
  } else if (days < 7) {
    return `${days}${t?.timeAgo?.days || "d"} ${t?.timeAgo?.ago || "ago"}`;
  } else {
    // 超过 7 天显示具体日期
    return new Date(timestamp).toLocaleDateString([], { month: "short", day: "numeric" });
  }
}
