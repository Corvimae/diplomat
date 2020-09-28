import React from 'react';
import { MenuItem } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer } from "@blueprintjs/select";
import { TrackerStateDefinition } from '../../stores/profiles/types';

export const filterStateOption: ItemPredicate<TrackerStateDefinition> = (query, stateDefinition, _index, exactMatch) => {
  const normalizedTitle = stateDefinition.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
      return normalizedTitle === normalizedQuery;
  } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
  }
};

export const renderStateOption: ItemRenderer<TrackerStateDefinition> = (stateDefinition, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) return null;

  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={stateDefinition.name}
      onClick={handleClick}
      text={highlightText(stateDefinition.name, query)}
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