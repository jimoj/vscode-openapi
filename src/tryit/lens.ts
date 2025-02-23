import * as vscode from "vscode";
import { Cache } from "../cache";
import {
  BundledOpenApiSpec,
  getOperations as getOpenApiOperations,
  OasOperation,
} from "@xliic/common/oas30";
import { getOperations as getSwaggerOperations } from "@xliic/common/swagger";
import { BundledSwaggerOrOasSpec, isOpenapi } from "@xliic/common/openapi";
import { deref } from "@xliic/common/ref";
import { getLocation } from "@xliic/preserving-json-yaml-parser";
import { getOpenApiVersion } from "../parsers";
import { OpenApiVersion } from "../types";

export class TryItCodelensProvider implements vscode.CodeLensProvider {
  onDidChangeCodeLenses?: vscode.Event<void>;
  constructor(private cache: Cache) {}

  async provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Promise<vscode.CodeLens[]> {
    const result: vscode.CodeLens[] = [];
    const parsed = this.cache.getParsedDocument(document);
    const version = getOpenApiVersion(parsed);
    if (parsed && version !== OpenApiVersion.Unknown) {
      const oas = parsed as unknown as BundledSwaggerOrOasSpec;
      const operations = isOpenapi(oas) ? getOpenApiOperations(oas) : getSwaggerOperations(oas);
      for (const [path, method, operation] of operations) {
        const tryOperationLens = operationLens(document, oas, path, method);
        if (tryOperationLens) {
          result.push(tryOperationLens);
        }
        // TODO examples in swagger
        if (isOpenapi(oas)) {
          result.push(
            ...operationExamplesLens(document, oas, path, method, operation as OasOperation)
          );
        }
      }
    }

    return result;
  }
}

function operationLens(
  document: vscode.TextDocument,
  oas: BundledSwaggerOrOasSpec,
  path: string,
  method: string
): vscode.CodeLens | undefined {
  const location = getLocation(oas.paths[path], method);
  if (!location) {
    return undefined;
  }
  const position = document.positionAt(location!.key!.start);
  const line = document.lineAt(position.line + 1);
  const range = new vscode.Range(
    new vscode.Position(position.line + 1, line.firstNonWhitespaceCharacterIndex),
    new vscode.Position(position.line + 1, line.range.end.character)
  );
  return new vscode.CodeLens(range, {
    title: `Try it`,
    tooltip: "Try this operation by sending a request",
    command: "openapi.tryOperation",
    arguments: [document, path, method],
  });
}

function operationExamplesLens(
  document: vscode.TextDocument,
  oas: BundledOpenApiSpec,
  path: string,
  method: string,
  operation: OasOperation
): vscode.CodeLens[] {
  const result = [];
  const content = deref(oas, operation.requestBody)?.content;
  for (const [mediaType, mediaTypeContent] of Object.entries(content || {})) {
    const examples = mediaTypeContent.examples;
    if (examples) {
      for (const [name, exampleOrRef] of Object.entries(examples)) {
        const location = getLocation(examples, name);
        const example = deref(oas, exampleOrRef);
        if (location && example?.value !== undefined) {
          const position = document.positionAt(location!.key!.start);
          const line = document.lineAt(position.line + 1);
          const range = new vscode.Range(
            new vscode.Position(position.line + 1, line.firstNonWhitespaceCharacterIndex),
            new vscode.Position(position.line + 1, line.range.end.character)
          );
          result.push(
            new vscode.CodeLens(range, {
              title: `Try it`,
              tooltip:
                "Try this operation by sending a request, use this example for the request body",
              command: "openapi.tryOperationWithExample",
              arguments: [document, path, method, mediaType, example.value],
            })
          );
        }
      }
    }
  }
  return result;
}
