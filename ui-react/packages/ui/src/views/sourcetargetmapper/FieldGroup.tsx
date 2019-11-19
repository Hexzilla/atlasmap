import {
  AccordionContent,
  AccordionItem,
  AccordionToggle,
} from '@patternfly/react-core';
import { FolderOpenIcon, FolderCloseIcon } from '@patternfly/react-icons';
import { css, StyleSheet } from '@patternfly/react-styles';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useCanvas } from '../../canvas';
import { ElementType, IFieldsGroup, IFieldsNode } from '../../models';
import { FieldElement } from './FieldElement';

const styles = StyleSheet.create({
  button: {
    paddingRight: '0.5rem !important',
    direction: 'ltr',
  },
  buttonRightAlign: {
    direction: 'rtl',
    '& > span': {
      direction: 'ltr',
      flex: 1,
      order: 1,
    }
  },
  buttonContentRightAligned: {
    transform: 'scaleX(-1)',
    display: 'inline-block',
    textAlign: 'left',
    width: '100%',
  },
  content: {
    fontSize: 'inherit !important',
    '& > div': {
      padding: 'var(--pf-c-accordion__expanded-content-body--PaddingTop) 0.5rem var(--pf-c-accordion__expanded-content-body--PaddingBottom) 0.5rem !important'
    }
  },
  contentRightAligned: {
    '& > div': {
    }
  },
});

export interface IFieldGroupProps {
  isVisible: boolean;
  group: IFieldsGroup;
  type: ElementType;
  parentRef?: HTMLElement | null;
  boxRef?: HTMLElement | null;
  rightAlign?: boolean;
  level?: number;
}
export const FieldGroup: FunctionComponent<IFieldGroupProps> = ({
  isVisible,
  group,
  type,
  parentRef = null,
  boxRef = null,
  rightAlign = false,
  level = 0,
}) => {
  const { redraw } = useCanvas();
  const ref = useRef<HTMLElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const toggleExpand = useCallback(() => setIsExpanded(!isExpanded), [
    isExpanded,
    setIsExpanded,
  ]);
  useEffect(() => {
    redraw();
  }, [isExpanded, redraw]);
  return (
    <AccordionItem>
      <AccordionToggle
        onClick={toggleExpand}
        isExpanded={isExpanded}
        id={`source-field-group-${group.id}-toggle`}
        className={css(styles.button, rightAlign && styles.buttonRightAlign)}
      >
        <span
          ref={ref}
          className={css(rightAlign && styles.buttonContentRightAligned)}
        >
          {isExpanded ? <FolderOpenIcon /> : <FolderCloseIcon />} {group.title}
        </span>
      </AccordionToggle>
      <AccordionContent
        id={`source-field-group-${group.id}-content`}
        isHidden={!isExpanded}
        className={css(styles.content, rightAlign && styles.contentRightAligned)}
      >
        {group.fields.map(f =>
          (f as IFieldsNode).element ? (
            <FieldElement
              key={f.id}
              type={type}
              parentRef={
                isVisible && isExpanded
                  ? ref.current
                  : isVisible || !parentRef
                  ? ref.current
                  : parentRef
              }
              boxRef={boxRef}
              node={f as IFieldsNode}
              rightAlign={rightAlign}
            />
          ) : (
            <FieldGroup
              isVisible={isVisible && isExpanded}
              type={type}
              parentRef={isVisible || !parentRef ? ref.current : parentRef}
              group={f as IFieldsGroup}
              boxRef={boxRef}
              rightAlign={rightAlign}
              key={f.id}
              level={level + 1}
            />
          )
        )}
      </AccordionContent>
    </AccordionItem>
  );
};