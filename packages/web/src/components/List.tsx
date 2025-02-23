import styled from "styled-components";
import { ThemeColorVariables } from "@xliic/common/theme";

export type ListItem = {
  id: string;
  label: string;
};

export default function List({
  items,
  selected,
  setSelected,
  filter,
}: {
  items: ListItem[];
  selected: string;
  setSelected: (selected: string) => void;
  filter?: string;
}) {
  return (
    <Body>
      {items
        .filter(
          (item) => filter === undefined || item.label.toLowerCase().includes(filter.toLowerCase())
        )
        .map((item) => {
          if (item.id === selected) {
            return <SelectedItem key={item.id}>{item.label}</SelectedItem>;
          }
          return (
            <Item onClick={() => setSelected(item.id)} key={item.id}>
              {item.label}
            </Item>
          );
        })}
    </Body>
  );
}

const Body = styled.ul`
  padding: 0;
  margin: 0;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  list-style: none;
  height: 36px;
  border-bottom: 1px solid var(${ThemeColorVariables.border});
  cursor: pointer;
  padding: 0 8px;
  overflow: hidden;
`;

const SelectedItem = styled(Item)`
  background-color: var(${ThemeColorVariables.listActiveSelectionBackground});
  color: var(${ThemeColorVariables.listActiveSelectionForeground});
  border-radius: 2px;
`;
