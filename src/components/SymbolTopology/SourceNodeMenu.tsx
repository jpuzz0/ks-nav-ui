import { ContextMenuItem, Node } from "@patternfly/react-topology";

interface SourceNodeMenuItemProps {
  element: Node;
  label: string;
  onClick(): void;
}

const SourceNodeMenuItem = ({ label, onClick }: SourceNodeMenuItemProps) => (
  <ContextMenuItem key={label} onClick={onClick}>
    {label}
  </ContextMenuItem>
);

export const SourceNodeMenu = ({ element }: { element: Node }) => {
  const { onDetailsMenuItemClick } = element.getData();

  return (
    <SourceNodeMenuItem element={element} label="View details" onClick={onDetailsMenuItemClick} />
  );
};
