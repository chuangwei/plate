import {
  getAboveNode,
  HotkeyPlugin,
  Hotkeys,
  isCollapsed,
  KeyboardHandlerReturnType,
  PlateEditor,
  select,
  unhangRange,
  Value,
  WithPlatePlugin,
} from '@udecode/plate-core';
import isHotkey from 'is-hotkey';
import { castArray } from 'lodash';
import { Range } from 'slate';
import { moveListItems, toggleList } from './transforms';

export const onKeyDownList = <
  V extends Value = Value,
  E extends PlateEditor<V> = PlateEditor<V>
>(
  editor: E,
  { type, options: { hotkey } }: WithPlatePlugin<HotkeyPlugin, V, E>
): KeyboardHandlerReturnType => (e) => {
  const isTab = Hotkeys.isTab(editor, e);
  const isUntab = Hotkeys.isUntab(editor, e);

  let workRange = editor.selection;

  if (editor.selection && (isTab || isUntab)) {
    const { selection } = editor;

    // Unhang the expanded selection
    if (!isCollapsed(editor.selection)) {
      const { anchor, focus } = Range.isBackward(selection)
        ? { anchor: selection.focus, focus: selection.anchor }
        : { anchor: selection.anchor, focus: selection.focus };

      // This is a workaround for a Slate bug 
      // See: https://github.com/ianstormtaylor/slate/pull/5039
      anchor.offset = 0;
      const unHungRange = unhangRange(editor, { anchor, focus });
      if (unHungRange) {
        workRange = unHungRange;
        select(editor, unHungRange);
      }
    }

    // check if we're in a list context.
    const listSelected = getAboveNode(editor, {
      at: editor.selection,
    });

    if (workRange && listSelected) {
      e.preventDefault();
      moveListItems(editor, { at: workRange, increase: isTab });
      return true;
    }
  }

  if (!hotkey) return;

  const hotkeys = castArray(hotkey);

  for (const _hotkey of hotkeys) {
    if (isHotkey(_hotkey)(e as any)) {
      toggleList(editor, { type: type! });
    }
  }
};
