import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "./store";
import FormatCard from "./FormatCard";
import Alert from "react-bootstrap/Alert";
import List from "../../components/List";
import { ThemeColorVariables } from "@xliic/common/theme";

function App() {
  const formats = useAppSelector((state) => state.formats.formats);
  const dictionaries = useAppSelector((state) => state.formats.dictionaries);
  const [selected, setSelected] = useState(dictionaries?.[0]?.id);
  useEffect(() => {
    setSelected(dictionaries?.[0]?.id);
  }, [dictionaries]);

  if (selected === undefined) {
    return (
      <>
        <Container>
          <Sidebar>
            <Header>Data Dictionaries</Header>
          </Sidebar>
          <Content>
            <Alert variant="secondary">No data dictionaries added yet</Alert>
          </Content>
        </Container>
      </>
    );
  }

  const cards = formats
    .filter((format) => format.dictionaryId === selected)
    .map((format) => <FormatCard format={format} key={`${format.dictionaryId}-${format.name}`} />);

  const standardDictionary = dictionaries
    .filter((dicttionary) => dicttionary.id === "standard")
    .map((dicttionary) => ({ ...dicttionary, label: dicttionary.name }));

  const userDictionaries = dictionaries
    .filter((dicttionary) => dicttionary.id !== "standard")
    .map((dicttionary) => ({ ...dicttionary, label: dicttionary.name }));

  return (
    <>
      <Container>
        <Sidebar>
          <Header>Data Dictionaries</Header>
          <Subheader>Organization standard dictionary</Subheader>
          <List selected={selected} setSelected={setSelected} items={standardDictionary} />
          <Subheader>Organization named dictionaries</Subheader>
          <List selected={selected} setSelected={setSelected} items={userDictionaries} />
        </Sidebar>
        <Content>{cards}</Content>
      </Container>
    </>
  );
}

const Header = styled.h3`
  font-weight: 500;
  font-size: 24px;
  line-height: 33px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Subheader = styled.h5`
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  line-height: 33px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Container = styled.div`
  display: flex;
  background-color: var(${ThemeColorVariables.background});
  height: 100vh;
`;

const Sidebar = styled.div`
  padding: 8px 16px 20px;
  width: 400px;
`;

const Content = styled.div`
  width: 100%;
  height: 100vh;
  overflow-x: scroll;
`;

export default App;
