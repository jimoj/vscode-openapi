import styled from "styled-components";

import { HttpMethod } from "@xliic/common/http";
import { BundledSwaggerOrOasSpec } from "@xliic/common/openapi";

import OperationTabs from "./OperationTabs";

export default function Operation({
  oas,
  settings,
  path,
  method,
}: {
  oas: BundledSwaggerOrOasSpec;
  settings?: JSX.Element;
  path: string;
  method: HttpMethod;
}) {
  return (
    <Container>
      <OperationTabs oas={oas} settings={settings} path={path} method={method} />
    </Container>
  );
}

const Container = styled.div``;
