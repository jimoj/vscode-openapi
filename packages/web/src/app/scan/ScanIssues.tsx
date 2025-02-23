import styled from "styled-components";

import { HttpError, HttpResponse } from "@xliic/common/http";
import { ThemeColorVariables } from "@xliic/common/theme";

import { TestLogReport } from "@xliic/common/scan-report";

import ScanIssue from "./ScanIssue";

export default function ScanIssues({
  issues,
  responses,
  errors,
  waitings,
}: {
  issues: TestLogReport[];
  responses: Record<string, HttpResponse>;
  errors: Record<string, HttpError>;
  waitings: Record<string, boolean>;
}) {
  const grouped: Record<string, TestLogReport[]> = {};
  const titles: Record<string, string> = {};

  for (const issue of issues) {
    const key = issue.test?.key;
    if (key !== undefined) {
      if (grouped[key] === undefined) {
        grouped[key] = [];
        titles[key] = issue.test?.description as string;
      }
      grouped[key].push(issue);
    }
  }

  const keys = Object.keys(grouped);

  for (const key of keys) {
    // fixme, improve sorting
    grouped[key].sort((a, b) => {
      if (a.outcome?.status !== b.outcome?.status) {
        if (a.outcome?.status === "incorrect") {
          return -1;
        }
        if (b.outcome?.status === "incorrect") {
          return 1;
        }
        if (a.outcome?.status === "unexpected") {
          return -1;
        }
        if (b.outcome?.status === "unexpected") {
          return 1;
        }
      }

      if (a.outcome?.criticality !== b.outcome?.criticality) {
        return a.outcome?.criticality! - b.outcome?.criticality!;
      }

      return 0;
    });
  }

  if (issues.length === 0) {
    return (
      <Container>
        <NoTests>No test results available</NoTests>
      </Container>
    );
  }

  return (
    <Container>
      {keys.map((key) => (
        <div key={key}>
          <GroupTitle>{kdbTitles[key] ?? "Unknown test type"}</GroupTitle>
          {grouped[key].map((issue, index) => {
            const id = `${key}-${index}`;
            return (
              <ScanIssue
                issue={issue}
                httpResponse={responses[id]}
                error={errors[id]}
                waiting={waitings[id]}
                key={id}
                id={id}
              />
            );
          })}
        </div>
      ))}
    </Container>
  );
}

const Container = styled.div`
  margin-top: 8px;
`;

const NoTests = styled.div`
  margin: 8px;
  padding: 4px;
  border: 1px solid var(${ThemeColorVariables.border});
`;

const GroupTitle = styled.div`
  padding: 10px;
  font-size: 1.1em;
  font-weight: 600;
`;

const kdbTitles: Record<string, string> = {
  "path-item-method-not-allowed-scan": "Scan sends a request using an undefined verb",
  "parameter-required-scan": "Scan sends a request that is missing a required parameter",
  "parameter-header-contenttype-wrong-scan": "Scan sends a request with wrong content type",
  "schema-multipleof-scan":
    "Scan sends a request containing a numeric value conflicting with multipleOf",
  "schema-maximum-scan": "Scan sends a request containing a numeric value overflowing maximum",
  "schema-minimum-scan": "Scan sends a request containing a numeric value under the minimum",
  "schema-minlength-scan": "Scan sends a request containing a string value that is too short",
  "schema-maxlength-scan": "Scan sends a request containing a string value that is too long",
  "schema-pattern-scan": "Scan sends a request containing a string value with wrong pattern",
  "schema-maxitems-scan": "Scan sends a request containing an array with too many items",
  "schema-minitems-scan": "Scan sends a request containing an array with too few items",
  "schema-uniqueitems-unique-scan":
    "Scan sends a request containing an array value that conflicts with ‘uniqueItems’",
  "schema-required-scan": "Scan sends a request that is missing a required property",
  "schema-enum-scan":
    "Scan sends a request containing a value not present in the constraining enum",
  "schema-additionalproperties-scan": "Scan sends a request that contains an undefined property",
  "schema-format-scan": "Scan sends a request containing a string value with wrong format",
  "schema-type-wrong-string-scan":
    "Scan sends a request containing a string value instead of the expected type",
  "schema-type-wrong-bool-scan":
    "Scan sends a request containing a Boolean value instead of the expected type",
  "schema-type-wrong-integer-scan":
    "Scan sends a request containing an integer value instead of the expected type",
  "schema-type-wrong-number-scan":
    "Scan sends a request containing a number value instead of the expected type",
  "schema-type-wrong-array-scan":
    "Scan sends a request containing an array instead of the expected type",
  "schema-type-wrong-object-scan":
    "Scan sends a request containing an object instead of the expected type",
};
