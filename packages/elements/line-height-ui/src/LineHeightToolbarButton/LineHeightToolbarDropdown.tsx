import React, { useCallback } from 'react';
import {
  getPluginInjectProps,
  isCollapsed,
  someNode,
  usePlateEditorState,
} from '@udecode/plate-core';
import { KEY_LINE_HEIGHT, setLineHeight } from '@udecode/plate-line-height';
import {
  ToolbarButton,
  ToolbarButtonProps,
  ToolbarDropdown,
} from '@udecode/plate-toolbar';
import { ReactEditor } from 'slate-react';

export const LineHeightToolbarDropdown = (props: ToolbarButtonProps) => {
  const [open, setOpen] = React.useState(false);
  const editor = usePlateEditorState()!;

  const { validNodeValues } = getPluginInjectProps(editor, KEY_LINE_HEIGHT);

  const onToggle = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  const selectHandler = useCallback(
    (lineHeight) => {
      if (editor) {
        ReactEditor.focus(editor);
        setLineHeight(editor, {
          value: lineHeight,
        });
      }
    },
    [editor]
  );

  return (
    <ToolbarDropdown
      control={
        <ToolbarButton
          active={
            isCollapsed(editor?.selection) &&
            someNode(editor!, { match: (n) => n.lineHeight !== undefined })
          }
          {...props}
        />
      }
      open={open}
      onOpen={onToggle}
      onClose={onToggle}
    >
      {validNodeValues &&
        validNodeValues.map((lineHeight) => (
          <div
            style={{ cursor: 'pointer' }}
            key={lineHeight}
            onClick={() => selectHandler(lineHeight)}
          >
            {lineHeight}
          </div>
        ))}
    </ToolbarDropdown>
  );
};