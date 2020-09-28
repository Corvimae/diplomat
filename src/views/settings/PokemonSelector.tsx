import React from 'react';
import { MenuItem } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer } from "@blueprintjs/select";
import { Pokemon } from '../../utils/Dex';

export const filterPokemonOption: ItemPredicate<Pokemon> = (query, pokemon, _index, exactMatch) => {
  const normalizedTitle = pokemon.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
      return normalizedTitle === normalizedQuery;
  } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
  }
};

export const renderPokemonOption: ItemRenderer<Pokemon> = (pokemon, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) return null;

  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={`#${pokemon.id}`}
      key={pokemon.id}
      onClick={handleClick}
      text={highlightText(pokemon.name, query)}
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