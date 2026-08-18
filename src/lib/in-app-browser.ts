export type Platform = "android" | "ios" | "other";

// 확인된 정상 동작 인앱 브라우저. 여기 걸리면 구글 로그인을 그대로 쓴다.
const WORKING = /TikTok|musical_ly|BytedanceWebview/i;

// 로그인이 막히는 것이 확인됐거나, 같은 계열이라 막힐 가능성이 높은 앱.
const KNOWN_IN_APP =
  /Twitter|Instagram|FBAN|FBAV|FB_IAB|KAKAOTALK|NAVER\(inapp|DaumApps|Line\//i;

const ANDROID_WEBVIEW = /\bwv\b/;

export function platformOf(userAgent: string): Platform {
  if (/Android/i.test(userAgent)) {
    return "android";
  }

  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return "ios";
  }

  return "other";
}

export function isInAppBrowser(userAgent: string): boolean {
  if (userAgent === "" || WORKING.test(userAgent)) {
    return false;
  }

  if (KNOWN_IN_APP.test(userAgent)) {
    return true;
  }

  if (ANDROID_WEBVIEW.test(userAgent)) {
    return true;
  }

  // iOS 인앱 브라우저는 Safari를 흉내내지만 Safari 토큰이 빠진다.
  return platformOf(userAgent) === "ios" && !/Safari\//.test(userAgent);
}

export function chromeIntentUrl(url: string): string {
  const bare = url.replace(/^https?:\/\//, "");

  return `intent://${bare}#Intent;scheme=https;package=com.android.chrome;end`;
}
