import { SubtitlesServer } from '../SubtitlesServer';

async function main() {
  const subtitlesServer = new SubtitlesServer();
  const subtitle = await subtitlesServer.findSubtitle(
    {
      type: 'episode',
      imdbid: 'tt0898266',
      season: 10,
      episode: 1
    },
    499781295,
    'spa'
  );
  console.log(subtitle);
}

main().catch(e => console.error(e));