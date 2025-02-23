import styled from "styled-components";
import { useFormContext, useController } from "react-hook-form";
import { ThemeColorVariables } from "@xliic/common/theme";
import { TrashCan, ExclamationCircle } from "../../icons";

export default function EnvKeyValue({ name, remove }: { name: string; remove: () => void }) {
  const { control } = useFormContext();

  const {
    field: keyField,
    fieldState: { error },
  } = useController({
    name: `${name}.key`,
    control,
    rules: {
      pattern: {
        value: /^\w+$/,
        message: "Only the alphanumeric characters or the underscore",
      },
    },
  });

  const { field: valueField } = useController({
    name: `${name}.value`,
    control,
  });

  return (
    <Container>
      <KeyValue>
        <Name type="text" {...keyField} />
        <Value type="text" {...valueField} />
        <Remove
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            remove();
          }}
        >
          <TrashCan />
        </Remove>
      </KeyValue>
      {error && (
        <Error>
          <ExclamationCircle />
          &nbsp; {error.message}
        </Error>
      )}
    </Container>
  );
}

const Container = styled.div`
  margin-bottom: 10px;
`;

const KeyValue = styled.div`
  display: flex;
  &:hover > :last-child {
    visibility: visible;
  }
`;

const Name = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  border-bottom: 1px solid var(${ThemeColorVariables.border});
  color: var(${ThemeColorVariables.foreground});
  margin-right: 10px;
`;

const Value = styled.input`
  flex: 2;
  border: none;
  background: transparent;
  border-bottom: 1px solid var(${ThemeColorVariables.border});
  color: var(${ThemeColorVariables.foreground});
`;

const Remove = styled.button`
  background: none;
  border: none;
  padding: 0;
  width: 1.5em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  > svg {
    fill: var(${ThemeColorVariables.foreground});
  }
`;

const Error = styled.div`
  padding: 4px;
  display: flex;
`;
