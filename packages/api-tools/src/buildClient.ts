/* eslint-disable no-console, import/no-named-as-default-member -- cli file */
import * as fs from "node:fs";
import { routes } from "@starter/api-routes/routes";
import ts from "typescript";
import {
  convertSnakeCaseToCamelCase,
  formatPath,
} from "@starter/api-tools/utils";

const { factory } = ts;
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

const finalFileImports = new Set<string>();

export const buildApiClient = (): void => {
  fs.rmSync("./src/generated", { recursive: true, force: true });

  const exportsMap = new Map<string, Record<string, boolean>>();

  for (const [routeName, rawRoute] of Object.entries(routes)) {
    buildFunctionForRoute(
      routeName,
      rawRoute.path.toString(),
      rawRoute.method,
      exportsMap
    );
  }

  console.log(
    "---------------------\nCREATING EXPORT FILES\n---------------------"
  );
  for (const exportFilePath of exportsMap.keys()) {
    buildExportFile(exportFilePath, exportsMap);
  }

  console.log(
    "---------------------\nCREATING FINAL CLIENT EXPORT FILE\n---------------------"
  );
  buildFinalFile();
};

const buildFinalFile = (): void => {
  const importDeclarations: ts.ImportDeclaration[] = [];
  const propAssignments: ts.PropertyAssignment[] = [];

  // create import statements
  for (const importStatement of finalFileImports) {
    importDeclarations.push(
      factory.createImportDeclaration(
        undefined,
        factory.createImportClause(
          false,
          undefined,
          factory.createNamespaceImport(
            factory.createIdentifier(importStatement)
          )
        ),
        factory.createStringLiteral(`./${importStatement}`)
      )
    );
  }

  // create variable statements
  for (const importStatement of finalFileImports) {
    propAssignments.push(
      factory.createPropertyAssignment(
        factory.createIdentifier(importStatement),
        factory.createIdentifier(importStatement)
      )
    );
  }

  const finalList = factory.createNodeArray([
    /**
     * final file should look lile
     * import * as healthCheck from "./healthCheck";
     *
     * const client = {
     *  healthCheck,
     * }
     *
     * export default client;
     */
    ...importDeclarations,
    factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier("RawApiClient"),
            undefined,
            undefined,
            factory.createObjectLiteralExpression(propAssignments, false)
          ),
        ],
        ts.NodeFlags.Const
      )
    ),
    factory.createExportDeclaration(
      undefined,
      false,
      factory.createNamedExports([
        factory.createExportSpecifier(
          false,
          undefined,
          factory.createIdentifier("RawApiClient")
        ),
      ])
    ),
  ]);

  fs.writeFileSync(
    "./src/generated/client.ts",
    printer.printList(
      ts.ListFormat.MultiLine,
      finalList,
      ts.createSourceFile("", "", ts.ScriptTarget.Latest)
    )
  );
};

const buildExportFile = (
  fileName: string,
  exportMap: Map<string, Record<string, boolean>>
): void => {
  const exportFileNodes = exportMap.get(fileName);
  if (!exportFileNodes) {
    return;
  }

  const finalExportList = Object.entries(exportFileNodes).map(
    ([exportName, isNamespace]) => {
      if (isNamespace) {
        return factory.createExportDeclaration(
          /*decorators*/ undefined,
          /*modifiers*/ false,
          factory.createNamespaceExport(factory.createIdentifier(exportName)),
          factory.createStringLiteral(`./${exportName}`)
        );
      }
      return factory.createExportDeclaration(
        /*decorators*/ undefined,
        /*modifiers*/ false,
        factory.createNamedExports([
          factory.createExportSpecifier(
            false,
            undefined,
            factory.createIdentifier(exportName)
          ),
        ]),
        factory.createStringLiteral(`./${exportName}`)
      );
    }
  );
  // exportFileNodes.values()((exportName) => {
  //   return factory.createExportDeclaration(
  //     /*decorators*/ undefined,
  //     /*modifiers*/ false,
  //     factory.createNamedExports([
  //       factory.createExportSpecifier(
  //         false,
  //         undefined,
  //         factory.createIdentifier(exportName)
  //       ),
  //     ]),
  //     factory.createStringLiteral(`./${exportName}`)
  //   );
  // }
  const finalList =
    factory.createNodeArray<ts.ExportDeclaration>(finalExportList);

  const dirPath = formatPath(fileName.split("/").slice(0, -1).join("/"));
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(
    fileName,
    printer.printList(
      ts.ListFormat.MultiLine,
      finalList,
      ts.createSourceFile("", "", ts.ScriptTarget.Latest)
    )
  );
};

const buildFunctionForRoute = (
  routeName: string,
  routePath: string,
  method: string,
  exportsMap: Map<string, Record<string, boolean>>
): void => {
  const parsedRouteTree = routePath
    .split("/")
    .slice(1)
    .map(convertSnakeCaseToCamelCase);
  const dirPath = formatPath(`./src/generated/${parsedRouteTree.join("/")}`);

  // for each folder, create index file along with exports needed
  const exportsToCreate = ["generated", ...parsedRouteTree, method];
  for (let i = 0; i < exportsToCreate.length - 1; i++) {
    const currentPath = formatPath(
      `./src/${exportsToCreate.slice(0, i + 1).join("/")}/index.ts`
    );
    const exportName = formatPath(exportsToCreate[i + 1]);

    if (!exportsMap.has(currentPath)) {
      exportsMap.set(currentPath, {});
    }
    const exportFile = exportsMap.get(currentPath);
    if (exportFile) {
      // const exportDeclaration = (() => {
      //   if (i !== exportsToCreate.length - 2) {
      //     // namespace exports
      //     return factory.createExportDeclaration(
      //       /*decorators*/ undefined,
      //       /*modifiers*/ false,
      //       factory.createNamespaceExport(factory.createIdentifier(exportName)),
      //       factory.createStringLiteral(`./${exportName}`)
      //     );
      //   }
      //   // method exports
      //   return factory.createExportDeclaration(
      //     /*decorators*/ undefined,
      //     /*modifiers*/ false,
      //     factory.createNamedExports([
      //       factory.createExportSpecifier(
      //         false,
      //         undefined,
      //         factory.createIdentifier(method)
      //       ),
      //     ]),
      //     factory.createStringLiteral(`./${exportName}`)
      //   );
      // })();

      if (i === 0) {
        // add to final file exports
        finalFileImports.add(exportName);
      } else {
        exportsMap.set(currentPath, {
          ...exportFile,
          [exportName]: i !== exportsToCreate.length - 2,
        });
      }
    }
  }

  // create import statements
  const zodImport = factory.createImportDeclaration(
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports([
        factory.createImportSpecifier(
          false,
          undefined,
          factory.createIdentifier("z")
        ),
      ])
    ),
    factory.createStringLiteral("zod")
  );

  const fetcherImport = factory.createImportDeclaration(
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports([
        factory.createImportSpecifier(
          false,
          undefined,
          factory.createIdentifier("genericFetch")
        ),
      ])
    ),
    factory.createStringLiteral("@starter/api-tools/fetcher")
  );

  const importPath = `@starter/api-routes/routes${formatPath(
    routePath
  )}/${method}`;
  const importStatement = factory.createImportDeclaration(
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports([
        factory.createImportSpecifier(
          false,
          undefined,
          factory.createIdentifier(routeName)
        ),
      ])
    ),
    factory.createStringLiteral(importPath)
  );

  const functionBody = factory.createBlock([
    factory.createReturnStatement(
      factory.createCallExpression(
        factory.createIdentifier("genericFetch"),
        // create types
        [
          factory.createTypeReferenceNode(
            factory.createIdentifier(
              `z.infer<typeof ${routeName}.validate.params>`
            ),
            undefined
          ),
          factory.createTypeReferenceNode(
            factory.createIdentifier(
              `z.infer<typeof ${routeName}.validate.query>`
            ),
            undefined
          ),
          factory.createTypeReferenceNode(
            factory.createIdentifier(
              `z.infer<typeof ${routeName}.validate.body>`
            ),
            undefined
          ),
          factory.createTypeReferenceNode(
            factory.createIdentifier(
              `z.infer<typeof ${routeName}.validate.response>`
            ),
            undefined
          ),
        ],
        [
          factory.createObjectLiteralExpression(
            [
              factory.createPropertyAssignment(
                "method",
                factory.createStringLiteral(method)
              ),
              factory.createPropertyAssignment(
                "path",
                factory.createStringLiteral(routePath)
              ),
              factory.createPropertyAssignment(
                "params",
                factory.createIdentifier("data.params")
              ),
              factory.createPropertyAssignment(
                "query",
                factory.createIdentifier("data.query")
              ),
              factory.createPropertyAssignment(
                "body",
                factory.createIdentifier("data.body")
              ),
              factory.createPropertyAssignment(
                "cookies",
                factory.createIdentifier("data.cookies")
              ),
              factory.createPropertyAssignment(
                "responseSchema",
                factory.createPropertyAccessExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier(routeName),
                    "validate"
                  ),
                  "response"
                )
              ),
            ],
            false
          ),
        ]
      )
    ),
  ]);

  const functionDef = factory.createFunctionDeclaration(
    undefined,
    undefined,
    method,
    [],
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        `data: {
            params: z.infer<typeof ${routeName}.validate.params>;
            query: z.infer<typeof ${routeName}.validate.query>;
            body: z.infer<typeof ${routeName}.validate.body>;
            cookies?: {
              name: string;
              value: string;
            }[];
          }`,
        undefined,
        undefined
      ),
    ],
    undefined,
    functionBody
  );

  // export get function
  const functionExport = factory.createExportDeclaration(
    undefined,
    false,
    factory.createNamedExports([
      factory.createExportSpecifier(
        false,
        undefined,
        factory.createIdentifier(method)
      ),
    ])
  );

  const finalList = factory.createNodeArray([
    zodImport,
    fetcherImport,
    importStatement,
    functionDef,
    functionExport,
  ]);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(
    `${dirPath}/${method}.ts`,
    printer.printList(
      ts.ListFormat.MultiLine,
      finalList,
      ts.createSourceFile("", "", ts.ScriptTarget.Latest)
    )
  );
};

buildApiClient();
