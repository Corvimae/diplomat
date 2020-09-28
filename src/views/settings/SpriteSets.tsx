import React from 'react';
import { MenuItem } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer } from "@blueprintjs/select";

export interface SpriteSet {
  name: string;
  path: string;
  gen: number;
};

export const SPRITE_SETS = [
  { name: 'Red/Blue/Yellow', path: 'gen1rb', gen: 1 },
  { name: 'Red/Green', path: 'gen1rg', gen: 1 },
  { name: 'Gold/Silver/Crystal', path: 'gen2', gen: 2 },
  { name: 'Gold/Silver (Shiny)', path: 'gen2-shiny', gen: 2 },
  { name: 'Ruby/Sapphire/Emerald', path: 'gen3', gen: 3 },
  { name: 'Ruby/Sapphire/Emerald (Shiny)', path: 'gen3rs-shiny', gen: 3 },
  { name: 'FireRed/LeafGreen', path: 'gen3frlg-shiny', gen: 3 },
  { name: 'Diamond/Pearl/Platinum', path: 'gen4', gen: 4 },
  { name: 'Diamond/Pearl/Platinum (Shiny)', path: 'gen4-shiny', gen: 4 },
  { name: 'Black/White', path: 'gen5', gen: 5 },
  { name: 'Black/White (Shiny)', path: 'gen5-shiny', gen: 5 },
  { name: 'Black/White (Animated)', path: 'gen5ani', gen: 5 },
  { name: 'Black/White (Animated, Shiny)', path: 'gen5ani-shiny', gen: 5 },
  { name: 'X/Y', path: 'gen6', gen: 6 },
];

export const filterSpriteSet: ItemPredicate<SpriteSet> = (query, spriteSet, _index, exactMatch) => {
  const normalizedTitle = spriteSet.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
      return normalizedTitle === normalizedQuery;
  } else {
      return `${spriteSet.name} - Gen. ${spriteSet.gen} ${spriteSet.path}`.indexOf(normalizedQuery) >= 0;
  }
};

export const renderSpriteSet: ItemRenderer<SpriteSet> = (spriteSet, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) return null;

  const text = `${spriteSet.name}`;

  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={`Gen ${spriteSet.gen}`}
      key={spriteSet.path}
      onClick={handleClick}
      text={highlightText(text, query)}
    />
  );
};

function escapeRegExpChars(text: string) {
  return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function highlightText(text: string, query: string) {
  let lastIndex = 0;
  const words = query
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(escapeRegExpChars);
  if (words.length === 0) {
      return [text];
  }
  const regexp = new RegExp(words.join("|"), "gi");
  const tokens: React.ReactNode[] = [];
  while (true) {
    const match = regexp.exec(text);

    if (!match) break;

    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);

    if (before.length > 0) tokens.push(before);

    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }

  const rest = text.slice(lastIndex);

  if (rest.length > 0) tokens.push(rest);

  return tokens;
}