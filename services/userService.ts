const LS_KEY = 'ourfit_indian_avatars';

interface RandomUserResult {
  picture: { large: string };
}

/**
 * Fetches 10 Indian user portrait URLs from randomuser.me (5 men + 5 women).
 * Returns a map of { userId -> avatarUrl }.
 * Caches in localStorage — only fetches once per session clear.
 */
export async function fetchIndianAvatars(): Promise<Record<string, string>> {
  try {
    const cached = localStorage.getItem(LS_KEY);
    if (cached) return JSON.parse(cached);
  } catch {}

  try {
    const [menRes, womenRes] = await Promise.all([
      fetch('https://randomuser.me/api/?nat=in&gender=male&results=5&inc=picture'),
      fetch('https://randomuser.me/api/?nat=in&gender=female&results=5&inc=picture'),
    ]);
    const menData = await menRes.json();
    const womenData = await womenRes.json();

    const menPics: string[] = menData.results.map((u: RandomUserResult) => u.picture.large);
    const womenPics: string[] = womenData.results.map((u: RandomUserResult) => u.picture.large);

    // Map to our user IDs — men: u2,u3,u4,u5,u6 | women: u7,u8,u9,u10,a1
    const avatarMap: Record<string, string> = {
      u2: menPics[0],
      u3: menPics[1],
      u4: menPics[2],
      u5: menPics[3],
      u6: menPics[4],
      u7: womenPics[0],
      u8: womenPics[1],
      u9: womenPics[2],
      u10: womenPics[3],
      a1: womenPics[4],
    };

    localStorage.setItem(LS_KEY, JSON.stringify(avatarMap));
    return avatarMap;
  } catch {
    return {};
  }
}
