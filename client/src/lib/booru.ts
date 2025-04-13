import { Booru } from "../structure/Booru";

// settings
export const [danbooru, safebooru, testbooru]: Booru[] = [
  new Booru({ origin: 'https://danbooru.donmai.us', name: 'Danbooru' }),
  new Booru({ origin: 'https://safebooru.donmai.us', name: 'Safebooru' }),
  new Booru({ origin: 'https://testbooru.donmai.us', name: 'Testbooru' }),
]
// Booru.set(testbooru);
Booru.set(Booru.manager.get(Booru.storageAPI ?? '') ?? danbooru);