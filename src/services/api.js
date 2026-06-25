import { cacheHoles, getCachedHoles } from './storage';
import localHoles from '../../assets/data/holes.json';

const REMOTE_URL =
  'https://raw.githubusercontent.com/AngryPapayah/prg07-eindopdracht-pubgolf/main/assets/data/holes.json';

export async function fetchHoles() {
  try {
    const response = await fetch(REMOTE_URL);
    if (!response.ok) throw new Error('Network response not ok');
    const data = await response.json();
    await cacheHoles(data.holes);
    return { holes: data.holes, fromCache: false };
  } catch {
    const cached = await getCachedHoles();
    if (cached) {
      return { holes: cached, fromCache: true };
    }
    // Laatste fallback: gebundelde locale data
    await cacheHoles(localHoles.holes);
    return { holes: localHoles.holes, fromCache: true };
  }
}
