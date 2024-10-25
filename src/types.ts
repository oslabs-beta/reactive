// The types.ts file is used to define reusable types and interfaces in a TypeScript project. It serves as a central place to store type definitions that can be imported and used throughout your project to enforce type safety and improve code organization. Here's what these types might be used for:
// disposable, filter, tree

export type DisposableOptions = {
    canSelectMany: boolean;
    openLabel: string;
    filters: FiltersObject;
}

export type FiltersObject = {
    'Accepted Files': string[]; 
}

export type TreeObject = {
    file: string;
    children: TreeObject;
}

//REATIVE/src/types.ts

// TreeObject: This type could be used to represent a hierarchical file structure, such as a folder tree or a component tree. Each TreeObject node contains a file and optional children, enabling recursive nesting to represent directory structures or nested components.