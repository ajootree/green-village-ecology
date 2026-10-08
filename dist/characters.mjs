// All character art is packaged with the game, including offline/device play.
const asset = name => new URL(`./assets/characters/${name}-v1.webp`, import.meta.url).href;
export const explorerImage = asset('explorer');
const villagers = {'숲지기':'forest','물지기':'river','밭지기':'farm','빛지기':'festival'};
export const villagerImage = speaker => asset(villagers[speaker] || 'explorer');
